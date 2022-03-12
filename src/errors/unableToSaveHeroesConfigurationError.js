'use strict';

class UnableToSaveHeroesConfigurationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UnableToSaveHeroesConfigurationError'
    Error.captureStackTrace(this, UnableToSaveHeroesConfigurationError)
  }
}

module.exports = UnableToSaveHeroesConfigurationError;
