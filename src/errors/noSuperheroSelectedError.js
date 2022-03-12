'use strict';

class NoSuperheroSelectedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NoSuperheroSelectedError'
    Error.captureStackTrace(this, NoSuperheroSelectedError)
  }
}

module.exports = NoSuperheroSelectedError;
