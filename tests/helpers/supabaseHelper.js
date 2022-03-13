'use strict';

const { createClient } = require('@supabase/supabase-js');
const envVars = require('../env.tests');

const HERO_MEMBERS_TABLE = 'HeroMembers';
const HERO_CONFIG_TABLE = 'HeroConfiguration';

const supabase = createClient(envVars.DB_HOST, envVars.DB_ACCESS_KEY);

const cleanUp = async () => {
  return Promise.all([
    await supabase
    .from(HERO_MEMBERS_TABLE)
    .delete(),
    await supabase
      .from(HERO_CONFIG_TABLE)
      .delete()
  ]);
};

const addConfiguration = async() => {
  return supabase
    .from(HERO_CONFIG_TABLE)
    .insert({
      id: envVars.CONFIG_IDENTIFIER,
      number_of_heroes: 1,
      last_modified: (new Date).toISOString()
    });
};

const addMembers = async () => {
  return supabase
    .from(HERO_MEMBERS_TABLE)
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
};

const selectHero = async (id, lastSelectedDate = null) => {
  return supabase
    .from(HERO_MEMBERS_TABLE)
    .update(
      { is_selected: true, last_selected: lastSelectedDate ?? (new Date).toISOString() }
    )
    .match({ id });
};

module.exports = {
  addConfiguration,
  addMembers,
  selectHero,
  cleanUp
};
