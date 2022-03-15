import { createClient, SupabaseClient, PostgrestResponse } from '@supabase/supabase-js';
import envVars from '../env.tests';

export default class SupabaseHelper {
  private static readonly HERO_MEMBERS_TABLE = 'HeroMembers';
  private static readonly HERO_CONFIG_TABLE = 'HeroConfiguration';
  private readonly supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(envVars.DB_HOST, envVars.DB_ACCESS_KEY);
  }

  public async cleanUp(): Promise<unknown> {
    return Promise.all([
      await this.supabase
      .from(SupabaseHelper.HERO_MEMBERS_TABLE)
      .delete(),
      await this.supabase
        .from(SupabaseHelper.HERO_CONFIG_TABLE)
        .delete()
    ]);
  }

  public async addConfiguration(): Promise<PostgrestResponse<any>> {
    return this.supabase
      .from(SupabaseHelper.HERO_CONFIG_TABLE)
      .insert({
        id: envVars.CONFIG_IDENTIFIER,
        number_of_heroes: 1,
        last_modified: (new Date).toISOString()
      });
  }

  public async addMembers(): Promise<PostgrestResponse<any>> {
    return this.supabase
      .from(SupabaseHelper.HERO_MEMBERS_TABLE)
      .insert([
        {
          id: 'U000001',
          slack_handle: 'john',
          is_selected: false,
          is_available: true,
          last_selected: null ,
          config_id: envVars.CONFIG_IDENTIFIER
        },
        {
          id: 'U000002',
          slack_handle: 'doe',
          is_selected: false,
          is_available: true,
          last_selected: null ,
          config_id: envVars.CONFIG_IDENTIFIER
        }
      ]);
  }

  public async selectHero(id: string, lastSelectedDate: string | undefined = undefined): Promise<PostgrestResponse<any>> {
    return this.supabase
      .from(SupabaseHelper.HERO_MEMBERS_TABLE)
      .update(
        { is_selected: true, last_selected: lastSelectedDate ?? (new Date).toISOString() }
      )
      .match({ id });
  }
}
