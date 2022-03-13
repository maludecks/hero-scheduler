'use strict';

const moment = require('moment');

const isValid = (heroes) => {
  const selectionValidity = heroes.map(
    hero => moment(hero.lastSelected).isSame(moment(), 'day')
  );

  return !selectionValidity.includes(false);
};

module.exports = {
  isValid
};
