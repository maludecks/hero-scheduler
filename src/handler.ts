import { APIGatewayProxyResult } from 'aws-lambda';
import SlackService from './services/slackService';
import ResponseBuilder from './utils/responseBuilder';
import SelectionDateValidator from './utils/selectionDateValidator';
import SuperheroRepository from './services/superheroRepository';
import SuperheroService from './services/superheroService';

const slackService = new SlackService(process.env.SLACK_WEBHOOK_URL || '');
const responseBuilder = new ResponseBuilder();
const selectionDateValidator = new SelectionDateValidator();
const superheroRepository = new SuperheroRepository(
  process.env.DB_HOST || '',
  process.env.DB_ACCESS_KEY || '',
  process.env.CONFIG_IDENTIFIER || ''
);
const superheroService = new SuperheroService(superheroRepository);

export const getCurrentSelection = async (): Promise<APIGatewayProxyResult> => {
  try {
    const currentSelection = await superheroService.current();

    if (selectionDateValidator.isValid(currentSelection)) {
      return responseBuilder.success({
        heroes: currentSelection.map(hero => hero.slackHandle)
      });
    }

    return pickNewSelection();
  } catch (e) {
    console.error(`Unable to find current selection: ${<Error>e}`);

    return responseBuilder.internalError({
      error: 'Unable to find current selection of heroes'
    });
  }
};

export const pickNewSelection = async (): Promise<APIGatewayProxyResult> => {
  try {
    const selectedHeroes = await superheroService.pick();

    return responseBuilder.success({
      heroes: selectedHeroes.map(hero => hero.slackHandle)
    });
  } catch (e) {
    console.error(`Unable to pick new selection: ${<Error>e}`);

    return responseBuilder.internalError({
      error: 'Unable to pick new heroes'
    });
  }
};

export const notifySlackChannel = async (): Promise<APIGatewayProxyResult> => {
  try {
    const currentSelection = await superheroService.current();

    await slackService.callWorkflowWebhook(currentSelection);

    return responseBuilder.noContent();
  } catch (e) {
    console.error(`Unable to notify slack channel: ${<Error>e}`);

    return responseBuilder.internalError({
      error: 'Unable to notify slack channel'
    });
  }
};

export const pickAndNotify = async (): Promise<APIGatewayProxyResult> => {
  try {
    let currentSelection = await superheroService.current();

    if (!selectionDateValidator.isValid(currentSelection)) {
      currentSelection = await superheroService.pick();
    }

    await slackService.callWorkflowWebhook(currentSelection);

    return responseBuilder.noContent();
  } catch (e) {
    console.error(`Unable to pick and notify slack channel: ${<Error>e}`);

    return responseBuilder.internalError({
      error: 'Unable to pick and notify slack channel'
    });
  }
};
