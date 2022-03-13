#!/bin/bash

echo "- installing dependencies"
npm i --include=dev

echo "- making dependencies available"
mkdir src/node_modules && cp -r node_modules/* src/node_modules

echo "- starting local api"
sam local start-api --env-vars etc/env.dev.json
