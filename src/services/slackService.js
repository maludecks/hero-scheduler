'use strict';

const axios = require('axios');

const callWorkflowWebhook = async (heroes) => {
  try {
    const slackPayload = heroes.reduce((obj, item, i) => ({
      ...obj,
      [`hero_${i+1}`]: item.id
    }), {});

    await axios.post(process.env.SLACK_WEBHOOK_URL, slackPayload);
  } catch (e) {
    throw new Error(`Failed to call workflow webhook: ${e.stack}`);
  }
};

module.exports = {
  callWorkflowWebhook
}
