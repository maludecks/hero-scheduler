'use strict';

class EmptyMembersListError extends Error {
  constructor(message) {
    super(message)
    this.name = 'EmptyMembersListError'
    Error.captureStackTrace(this, EmptyMembersListError)
  }
}

module.exports = EmptyMembersListError;
