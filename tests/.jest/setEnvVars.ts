import envVars from '../env.tests';

process.env.DB_HOST = envVars.DB_HOST;
process.env.DB_ACCESS_KEY = envVars.DB_ACCESS_KEY;
process.env.CONFIG_IDENTIFIER = envVars.CONFIG_IDENTIFIER;
process.env.SLACK_WEBHOOK_URL = envVars.SLACK_WEBHOOK_URL;
