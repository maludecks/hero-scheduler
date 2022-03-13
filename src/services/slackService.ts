import axios, { AxiosResponse } from 'axios';
import { Hero } from './types';

export default class SlackService {
  constructor(private readonly slackWebhookUrl: string) {}

  public async callWorkflowWebhook(heroes: Hero[]): Promise<AxiosResponse> {
    const slackPayload = heroes.reduce((obj, item, i) => ({
      ...obj,
      [`hero_${i+1}`]: item.id
    }), {});

    return axios.post(this.slackWebhookUrl, slackPayload);
  }
}
