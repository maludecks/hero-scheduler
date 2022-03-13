'use strict';

const _ = require('lodash');
const superheroRepository = require('./superheroRepository');

async function current() {
  let currentSelection = await superheroRepository.fetchCurrentHeroes();

  if (currentSelection.length === 0) {
    currentSelection = pick();
  }

  return currentSelection;
}

async function pick() {
  const { numberOfHeroes } = await superheroRepository.fetchConfiguration();
  const availableMembers = await superheroRepository.fetchAvailableMembers();

  if (availableMembers.length === 0) {
    throw new Error('List of members is empty');
  }

  const newSelection = _.sampleSize(
    availableMembers,
    numberOfHeroes
  );

  await superheroRepository.removeCurrentHeroes();
  await superheroRepository.saveNewHeroes(newSelection);

  return newSelection;
}

async function setup(members, numberOfHeroes) {
  if (members.length === 0) {
    throw new Error(`List of members can't be empty`);
  }

  return Promise.all(
    superheroRepository.saveConfiguration(numberOfHeroes),
    superheroRepository.saveMembers(numberOfHeroes)
  );
}

module.exports = {
  current,
  pick,
  setup
};
