'use strict';

const moment = require('moment');
const axios = require('axios');
const superheroService = require('./services/superheroService');
const responseBuilder = require('./utils/responseBuilder');
const NoSuperheroSelectedError = require('./errors/noSuperheroSelectedError');

const getCurrentSelection = async () => {
  try {
    const { currentSelection, lastModified } = await superheroService.current();

    const isSelectionUpToDate = moment(lastModified).isSame(moment(), 'day');

    if (isSelectionUpToDate) {
      return responseBuilder.success({
        heroes: currentSelection
      });
    }

    return await pickNewSelection();
  } catch (e) {
    if (e instanceof NoSuperheroSelectedError) {
      return await pickNewSelection();
    }

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
      heroes: selectedHeroes
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
    const { currentSelection } = await superheroService.current();

    const slackPayload = currentSelection.reduce((obj, item, i) => ({
      ...obj,
      [`hero_${i+1}`]: item
    }), {});

    await axios.post(process.env.SLACK_WEBHOOK_URL, slackPayload);

    return responseBuilder.noContent();
  } catch (e) {
    console.error(`Unable to notify slack channel: ${e.stack}`);

    return responseBuilder.internalError({
      error: 'Unable to notify slack channel'
    });
  }
};

module.exports = {
  getCurrentSelection,
  pickNewSelection,
  notifySlackChannel
};
