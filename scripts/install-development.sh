#!/bin/bash

echo "- installing dependencies"
npm i --include=dev

echo "- compiling Typescript"
npm run compile

echo "- building package"
sam build --manifest package.json

echo "- starting local api"
sam local start-api --env-vars etc/env.dev.json
