'use strict';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT,DELETE',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers':
    'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,X-Requested-With',
};

const success = (body) => ({
  statusCode: 200,
  body: JSON.stringify(body),
  headers: {
    ...CORS_HEADERS
  }
});

const noContent = () => ({
  statusCode: 204,
  body: '',
  headers: {
    ...CORS_HEADERS
  }
});

const internalError = (body) => ({
  statusCode: 502,
  body: JSON.stringify(body),
  headers: {
    ...CORS_HEADERS
  }
});

module.exports = {
  success,
  noContent,
  internalError
}
