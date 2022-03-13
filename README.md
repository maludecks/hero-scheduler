# Hero Scheduler 🦸

App which picks random* members (a.k.a heroes) and assigns them to take care of any reported tasks for the day. Hero scheduler consists of an API that interacts with a [Supabase database](https://supabase.com/) and a simple webpage. In order to integrate it with Slack, a [Slack Webhook Workflow](https://slack.com/help/articles/360041352714-Create-more-advanced-workflows-using-webhooks) needs to be set up

## Run locally
To run the local enviroment you'll need [aws-sam-sdk](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) and [supabase/cli](https://github.com/supabase/cli) installed.

The API runs locally through `sam local start-api`. Start the API locally with the script `install-development`:
```sh
./install-development
```

The web page is found in `/public` and can be run on a local express server for convenience with:
```sh
node webpageServer.js
```

## Endpoints
There API has are 3 main endpoints:

### GET /heroes/current
Get current selection of heroes

### GET /heroes/pick
Pick new selection of heroes

### GET /heroes/notify
Call webhook with current selection of heroes

### \**WIP** POST /heroes/configure
Define members list and number of heroes to pick

### \**WIP** POST /heroes/availability
Set members as `available`/`unavailable`. Only `available` members can be picked as heroes. Mark members as `unavailable` whenever you want to exclude them from the selection

## Setting up Slack Webhook Workflow
The workflow in Slack will be responsible for reacting to webhook calls and posting the notification to a slack channel. For that, create a Webhook Workflow, with variables `hero_{number}` for as many heroes are set in the configuration. This is necessary because [it's not currently possible to use nested JSON structures in workflow variables](https://slack.com/help/articles/360041352714-Create-more-advanced-workflows-using-webhooks). For example, if the configuration is set to 2 `number_of_heroes`, then the variables should be named `hero_1` and `hero_2`. The `Data type` of the variables should be set to `Slack User ID`. The response example you should see is:
```json
{
  "hero_1": "U123456789",
  "hero_2": "U123456789"
}
```
After that, you can add a step to send a message to a specific channel or user, and use the variables' value as desired in the `Message text`

## Deploy
You can deploy the app to AWS using the convenience script `./scripts/deploy` if desired. The script will create all the resources listed in `template.yml` in a stage environment in AWS. Make sure to fill in the right environment variables in a `samconfig.toml` file, including `Supabase` credentials to a hosted database

## Contributing
If you have suggestions or want to report a bug, feel welcome to contribute to this repository by submitting a PR!

## License
[ISC](LICENSE) © 2020 Malu Decks <maludecks@gmail.com> (https://github.com/maludecks/hero-scheduler)
