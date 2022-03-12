#!/bin/bash

: ${1?"Usage: $0 AWS_PROFILE AWS_REGION WEBPAGE_S3_BUCKET_NAME"}
: ${2?"Usage: $0 AWS_PROFILE AWS_REGION WEBPAGE_S3_BUCKET_NAME"}
: ${3?"Usage: $0 AWS_PROFILE AWS_REGION WEBPAGE_S3_BUCKET_NAME"}

echo "- cleaning-up development env files"
rm -rf src/node_modules

echo "- building package"
sam build --manifest package.json

echo "- deploying app"
sam deploy --profile $1 --region $2 --no-confirm-changeset

echo "- storing web page assets in S3"
aws s3 cp public/ s3://$3 --recursive --profile $1
