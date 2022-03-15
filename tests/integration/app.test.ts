import * as moment from 'moment';
import * as nock from 'nock';
import * as handlers from '../../src/handler';
import envVars from '../env.tests';
import SupabaseHelper from '../helpers/supabaseHelper';

describe('Hero Scheduler', () => {
  const supabaseHelper = new SupabaseHelper();

  beforeEach(async () => {
    await supabaseHelper.cleanUp();
  });

  afterAll(async () => {
    await supabaseHelper.cleanUp();
  });

  test('Returns current heroes', async () => {
    await supabaseHelper.addConfiguration();
    await supabaseHelper.addMembers();
    await supabaseHelper.selectHero('U000001');

    const res = await handlers.getCurrentSelection();

    const expectedRes = {
      heroes: ['john']
    };

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(JSON.stringify(expectedRes));
  });

  test('Picks new heroes', async () => {
    await supabaseHelper.addConfiguration();
    await supabaseHelper.addMembers();
    await supabaseHelper.selectHero('U000001');

    const res = await handlers.pickNewSelection();

    const expectedRes = {
      heroes: ['doe']
    };

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(JSON.stringify(expectedRes));
  });

  test('Calls workflow webhook to send notification', async () => {
    await supabaseHelper.addConfiguration();
    await supabaseHelper.addMembers();
    await supabaseHelper.selectHero('U000001');

    const expectedSlackPayload = {
      hero_1: 'U000001'
    };

    nock(envVars.SLACK_WEBHOOK_URL)
      .post('/', JSON.stringify(expectedSlackPayload))
      .reply(200, {});

    const res = await handlers.notifySlackChannel();

    expect(res.statusCode).toBe(204);
  });

  test('Picks and calls workflow webhook to send notification', async () => {
    await supabaseHelper.addConfiguration();
    await supabaseHelper.addMembers();

    const selectedOnDate = moment().subtract(1, 'day');
    await supabaseHelper.selectHero('U000001', selectedOnDate.toISOString());

    const expectedSlackPayload = {
      hero_1: 'U000002'
    };

    nock(envVars.SLACK_WEBHOOK_URL)
      .post('/', JSON.stringify(expectedSlackPayload))
      .reply(200, {});

    const res = await handlers.pickAndNotify();

    expect(res.statusCode).toBe(204);
  });
});
