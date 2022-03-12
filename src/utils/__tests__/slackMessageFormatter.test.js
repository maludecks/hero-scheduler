'use strict';

const slackMessageFormatter = require('../slackMessageFormatter');

describe('slackMessageFormatter', () => {
  test('Mention pretty prints single hero', () => {
    const heroes = ['USERID1'];

    const response = slackMessageFormatter.mention(heroes);

    expect(response).toBe(`<@USERID1>`);
  });

  test('Mention pretty prints multiple heroes', () => {
    const heroes = ['USERID1', 'USERID2'];

    const response = slackMessageFormatter.mention(heroes);

    expect(response).toBe(`<@USERID1> and <@USERID2>`);
  });
});
