'use strict';

const _ = require('lodash');
const superheroRepository = require('./superheroRepository');
const EmptyMembersListError = require('../errors/emptyMembersListError');
const NoSuperheroSelectedError = require('../errors/noSuperheroSelectedError');

async function current() {
  const { currentSelection, lastModified } = await superheroRepository.fetchConfiguration();

  if (currentSelection.length === 0) {
    throw new NoSuperheroSelectedError();
  }

  return {
    currentSelection,
    lastModified
  };
}

async function pick() {
  const {
    membersList,
    currentSelection,
    numberOfHeroes
  } = await superheroRepository.fetchConfiguration();

  if (membersList.length === 0) {
    throw new EmptyMembersListError();
  }

  const newSelection = _.sampleSize(
    membersList.filter(hero => !currentSelection.includes(hero)),
    numberOfHeroes
  );

  await superheroRepository.saveNewSelection(newSelection);

  return newSelection;
}

async function setup(users, numberOfHeroes) {
  if (users.length === 0) {
    throw new EmptyMembersListError();
  }

  return await superheroRepository.saveConfiguration(users, numberOfHeroes);
}

module.exports = {
  current,
  pick,
  setup
};
