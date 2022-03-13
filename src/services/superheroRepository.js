'use strict';

const { createClient } = require('@supabase/supabase-js');

const HERO_MEMBERS_TABLE = 'HeroMembers';
const HERO_CONFIG_TABLE = 'HeroConfiguration';

async function fetchConfiguration() {
  const supabase = createClient(process.env.DB_HOST, process.env.DB_ACCESS_KEY);

  const { data, error } = await supabase
    .from(HERO_CONFIG_TABLE)
    .select('*')
    .eq('id', process.env.CONFIG_IDENTIFIER)
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

async function fetchAvailableMembers() {
  const supabase = createClient(process.env.DB_HOST, process.env.DB_ACCESS_KEY);

  const { data, error } = await supabase
    .from(HERO_MEMBERS_TABLE)
    .select('*')
    .eq('is_selected', false)
    .eq('is_available', true)
    .eq('config_id', process.env.CONFIG_IDENTIFIER);

  if (error) {
    throw new Error(`Error while fetching available members: ${error.message}`);
  }

  return data.map(member => ({
    id: member['id'],
    slackHandle: member['slack_handle'],
    lastSelected: member['last_selected']
  }));
}

async function fetchCurrentHeroes() {
  const supabase = createClient(process.env.DB_HOST, process.env.DB_ACCESS_KEY);

  const { data, error } = await supabase
    .from(HERO_MEMBERS_TABLE)
    .select('*')
    .eq('is_selected', true)
    .eq('config_id', process.env.CONFIG_IDENTIFIER)

  if (error) {
    throw new Error(`Error while fetching current heroes: ${error.message}`);
  }

  return data.map(hero => ({
    id: hero['id'],
    slackHandle: hero['slack_handle'],
    isAvailable: hero['is_available'],
    lastSelected: hero['last_selected']
  }));
}

async function removeCurrentHeroes() {
  const supabase = createClient(process.env.DB_HOST, process.env.DB_ACCESS_KEY);

  const { res, error } = await supabase
    .from(HERO_MEMBERS_TABLE)
    .update({ is_selected: false })
    .match({ config_id: process.env.CONFIG_IDENTIFIER });

  if (error) {
    throw new Error(`Error trying to remove current heroes: ${error.message}`);
  }

  return res;
}

async function saveNewHeroes(heroes) {
  const supabase = createClient(process.env.DB_HOST, process.env.DB_ACCESS_KEY);

  const { res, error } = await supabase
    .from(HERO_MEMBERS_TABLE)
    .update({
      is_selected: true,
      last_selected: (new Date).toISOString()
    })
    .match({ config_id: process.env.CONFIG_IDENTIFIER })
    .in('id', heroes.map(hero => hero.id));

  if (error) {
    throw new Error(`Error trying to save new heroes: ${error.message}`);
  }

  return res;
}

async function saveConfiguration(numberOfHeroes) {
  const supabase = createClient(process.env.DB_HOST, process.env.DB_ACCESS_KEY);

  const { res, error } = await supabase
    .from(HERO_CONFIG_TABLE)
    .update({
      number_of_heroes: numberOfHeroes,
      last_modified: (new Date).toISOString()
    })
    .match({ id: process.env.CONFIG_IDENTIFIER });

  if (error) {
    throw new Error(`Error trying to save configuration: ${error.message}`);
  }

  return res;
}

async function saveMembers(membersList) {
  const supabase = createClient(process.env.DB_HOST, process.env.DB_ACCESS_KEY);

  const data = membersList.map(async member => ({
    id: member.id,
    slack_handle: member.slackHandle,
    is_selected: false,
    is_available: true,
    last_selected: null
  }));

  const { res, error } = await supabase
    .from(HERO_MEMBERS_TABLE)
    .upsert(data);

  if (error) {
    throw new Error(`Error trying to save members list: ${error.message}`);
  }

  return res;
}

async function saveAvailability(member) {
  const supabase = createClient(process.env.DB_HOST, process.env.DB_ACCESS_KEY);

  const { res, error } = await supabase
    .from(HERO_MEMBERS_TABLE)
    .update({
      id: member.id,
      is_available: false
    });

  if (error) {
    throw new Error(`Error trying to save member availability: ${error.message}`);
  }

  return res;
}

module.exports = {
  fetchConfiguration,
  fetchAvailableMembers,
  fetchCurrentHeroes,
  removeCurrentHeroes,
  saveNewHeroes,
  saveConfiguration,
  saveMembers,
  saveAvailability
};
