'use strict';

class ConfigurationNotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ConfigurationNotFoundError'
    Error.captureStackTrace(this, ConfigurationNotFoundError)
  }
}

module.exports = ConfigurationNotFoundError;
