'use strict';

class UnableToSaveHeroesSelectionError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UnableToSaveHeroesSelectionError'
    Error.captureStackTrace(this, UnableToSaveHeroesSelectionError)
  }
}

module.exports = UnableToSaveHeroesSelectionError;
