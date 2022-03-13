import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { HeroConfiguration, Hero } from "./types";

export type HeroRow = {
  id: string;
  slack_handle: string;
  is_selected: boolean;
  is_available: boolean;
  last_selected: string;
  config_id: string;
}

export default class SuperheroRepository {
  private static readonly HERO_MEMBERS_TABLE = 'HeroMembers';
  private static readonly HERO_CONFIG_TABLE = 'HeroConfiguration';
  private readonly supabaseClient: SupabaseClient;

  constructor(
    private readonly databaseHost: string,
    private readonly databaseAccessKey: string,
    private readonly configIdentifier: string
  ) {
    this.supabaseClient = createClient(this.databaseHost, this.databaseAccessKey);
  }

  public async fetchConfiguration(): Promise<HeroConfiguration> {
    const { data, error } = await this.supabaseClient
      .from(SuperheroRepository.HERO_CONFIG_TABLE)
      .select('*')
      .eq('id', this.configIdentifier)
      .limit(1)
      .single();

    if (error) {
      throw new Error(`Error while fetching configuration: ${error.message}`);
    }

    return {
      numberOfHeroes: data['number_of_heroes'],
      lastModified: data['last_modified'],
    };
  }

  public async fetchAvailableMembers(): Promise<Hero[]> {
    const response = await this.supabaseClient
      .from<HeroRow>(SuperheroRepository.HERO_MEMBERS_TABLE)
      .select('*')
      .eq('is_selected', false)
      .eq('is_available', true)
      .eq('config_id', this.configIdentifier);

    if (response.error) {
      throw new Error(`Error while fetching available members: ${response.error.message}`);
    }

    return response.data.map((member: HeroRow) => ({
      id: member['id'],
      slackHandle: member['slack_handle'],
      lastSelected: member['last_selected'],
      isSelected: member['is_selected'],
      isAvailable: member['is_available'],
    }));
  }

  public async fetchCurrentHeroes(): Promise<Hero[]> {
    const response = await this.supabaseClient
      .from<HeroRow>(SuperheroRepository.HERO_MEMBERS_TABLE)
      .select('*')
      .eq('is_selected', true)
      .eq('config_id', this.configIdentifier)

    if (response.error) {
      throw new Error(`Error while fetching current heroes: ${response.error.message}`);
    }

    return response.data.map((member: HeroRow) => ({
      id: member['id'],
      slackHandle: member['slack_handle'],
      lastSelected: member['last_selected'],
      isSelected: member['is_selected'],
      isAvailable: member['is_available'],
    }));
  }

  public async removeCurrentHeroes(): Promise<void> {
    const { error } = await this.supabaseClient
      .from(SuperheroRepository.HERO_MEMBERS_TABLE)
      .update({ is_selected: false })
      .match({ config_id: this.configIdentifier });

    if (error) {
      throw new Error(`Error trying to remove current heroes: ${error.message}`);
    }
  }

  public async saveNewHeroes(heroes: Hero[]): Promise<void> {
    const { error } = await this.supabaseClient
      .from(SuperheroRepository.HERO_MEMBERS_TABLE)
      .update({
        is_selected: true,
        last_selected: (new Date).toISOString()
      })
      .match({ config_id: this.configIdentifier })
      .in('id', heroes.map(hero => hero.id));

    if (error) {
      throw new Error(`Error trying to save new heroes: ${error.message}`);
    }
  }

  public async saveConfiguration(numberOfHeroes: number): Promise<void> {
    const { error } = await this.supabaseClient
      .from(SuperheroRepository.HERO_CONFIG_TABLE)
      .update({
        number_of_heroes: numberOfHeroes,
        last_modified: (new Date).toISOString()
      })
      .match({ id: this.configIdentifier });

    if (error) {
      throw new Error(`Error trying to save configuration: ${error.message}`);
    }
  }

  public async saveMembers(membersList: Hero[]): Promise<void> {
    const data = membersList.map(async member => ({
      id: member.id,
      slack_handle: member.slackHandle,
      is_selected: false,
      is_available: true,
      last_selected: null
    }));

    const { error } = await this.supabaseClient
      .from(SuperheroRepository.HERO_MEMBERS_TABLE)
      .upsert(data);

    if (error) {
      throw new Error(`Error trying to save members list: ${error.message}`);
    }
  }

  public async saveAvailability(member: Hero): Promise<void> {
    const { error } = await this.supabaseClient
      .from(SuperheroRepository.HERO_MEMBERS_TABLE)
      .update({
        id: member.id,
        is_available: false
      });

    if (error) {
      throw new Error(`Error trying to save member availability: ${error.message}`);
    }
  }
}
