'use strict';

const superheroService = require('./services/superheroService');
const slackService = require('./services/slackService');
const responseBuilder = require('./utils/responseBuilder');
const selectionDateValidator = require('./utils/selectionDateValidator');

const getCurrentSelection = async () => {
  try {
    const currentSelection = await superheroService.current();

    if (selectionDateValidator.isValid(currentSelection)) {
      return responseBuilder.success({
        heroes: currentSelection.map(hero => hero.slackHandle)
      });
    }

    return pickNewSelection();
  } catch (e) {
    console.error(`Unable to find current selection: ${e.stack}`);

    return responseBuilder.internalError({
      error: 'Unable to find current selection of heroes'
    });
  }
};

const pickNewSelection = async () => {
  try {
    const selectedHeroes = await superheroService.pick();

    return responseBuilder.success({
      heroes: selectedHeroes.map(hero => hero.slackHandle)
    });
  } catch (e) {
    console.error(`Unable to pick new selection: ${e.stack}`);

    return responseBuilder.internalError({
      error: 'Unable to pick new heroes'
    });
  }
};

const notifySlackChannel = async () => {
  try {
    const currentSelection = await superheroService.current();

    await slackService.callWorkflowWebhook(currentSelection);

    return responseBuilder.noContent();
  } catch (e) {
    console.error(`Unable to notify slack channel: ${e.stack}`);

    return responseBuilder.internalError({
      error: 'Unable to notify slack channel'
    });
  }
};

const pickAndNotify = async () => {
  try {
    let currentSelection = await superheroService.current();

    if (!selectionDateValidator.isValid(currentSelection)) {
      currentSelection = await superheroService.pick();
    }

    await slackService.callWorkflowWebhook(currentSelection);

    return responseBuilder.noContent();
  } catch (e) {
    console.error(`Unable to pick and notify slack channel: ${e.stack}`);

    return responseBuilder.internalError({
      error: 'Unable to pick and notify slack channel'
    });
  }
};

module.exports = {
  getCurrentSelection,
  pickNewSelection,
  notifySlackChannel,
  pickAndNotify
};
