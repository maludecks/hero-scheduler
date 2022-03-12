'use strict';

const { createClient } = require('@supabase/supabase-js');
const ConfigurationNotFoundError = require('../errors/configurationNotFoundError');
const UnableToSaveHeroesSelectionError = require('../errors/unableToSaveHeroesSelectionError');
const UnableToSaveHeroesConfigurationError = require('../errors/unableToSaveHeroesConfigurationError');

async function fetchConfiguration() {
  const supabase = createClient(process.env.DB_HOST, process.env.DB_ACCESS_KEY);

  const { data: heroesConfig, error } = await supabase
    .from(process.env.DB_TABLE_NAME)
    .select('*')
    .eq('id', process.env.CONFIG_IDENTIFIER);

  if (error) {
    throw new ConfigurationNotFoundError(error.message);
  }

  if (heroesConfig.length === 0) {
    throw new ConfigurationNotFoundError();
  }

  const heroConfig = heroesConfig[0];

  return {
    membersList: heroConfig.members_list.split(','),
    numberOfHeroes: heroConfig.number_of_heroes,
    lastModified: heroConfig.last_modified,
    currentSelection: heroConfig.current_selection ? heroConfig.current_selection.split(',') : []
  };
}

async function saveNewSelection(newSelection) {
  const supabase = createClient(process.env.DB_HOST, process.env.DB_ACCESS_KEY);

  const { _, error } = await supabase
    .from(process.env.DB_TABLE_NAME)
    .update({
      current_selection: newSelection.join(','),
      last_modified: (new Date).toISOString()
    })
    .match({ id: process.env.CONFIG_IDENTIFIER });

    if (error) {
      throw new UnableToSaveHeroesSelectionError(error.message);
    }
}

async function saveConfiguration(membersList, numberOfHeroes) {
  config.membersList = membersList;
  config.numberOfHeroes = numberOfHeroes;
  config.lastModified = (new Date).toISOString();

  const { _, error } = await supabase
    .from(process.env.DB_TABLE_NAME)
    .update({
      members_list: membersList.join(','),
      number_of_heroes: numberOfHeroes,
      last_modified: (new Date).toISOString()
    })
    .match({ id: process.env.CONFIG_IDENTIFIER });

    if (error) {
      throw new UnableToSaveHeroesConfigurationError(error.message);
    }
}

module.exports = {
  fetchConfiguration,
  saveNewSelection,
  saveConfiguration
};
