import { APIGatewayProxyResult } from 'aws-lambda';

export default class ResponseBuilder {
  private static readonly CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT,DELETE',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers':
      'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,X-Requested-With',
  };

  public success(body: Record<string, unknown>): APIGatewayProxyResult {
    return {
      statusCode: 200,
      body: JSON.stringify(body),
      headers: {
        ...ResponseBuilder.CORS_HEADERS
      }
    };
  }

  public noContent(): APIGatewayProxyResult {
    return {
      statusCode: 204,
      body: '',
      headers: {
        ...ResponseBuilder.CORS_HEADERS
      }
    };
  }

  public internalError(body: Record<string, unknown>): APIGatewayProxyResult {
    return {
      statusCode: 502,
      body: JSON.stringify(body),
      headers: {
        ...ResponseBuilder.CORS_HEADERS
      }
    };
  }
}
