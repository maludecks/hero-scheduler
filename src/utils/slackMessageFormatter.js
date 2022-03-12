'use strict';

function mention(heroes) {
  return heroes
    .map(hero => `<\@${hero}>`)
    .join(', ').replace(/, ([^,]*)$/, ' and $1');
}

module.exports = {
  mention
};
