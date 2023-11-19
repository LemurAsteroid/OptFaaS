import type { AWS } from '@serverless/typescript';

import scheduleBenchmarkFunctions from '@services/runner/benchmarkMaster';
import benchmarkRunner from '@services/runner/benchmarkRunner';
import benchmarkFunction02 from '@functions/02';
import benchmarkFunction01 from '@functions/01';
import cwLogger from "@services/logging/cloudWatchLogger";
import benchmarkRunnerAPI from '@services/runner/benchmarkRunnerAPIGateway';


const serverlessConfiguration: AWS = {
    service: 'optFaas',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-pseudo-parameters'],
    provider: {
        name: 'aws',
        runtime: 'nodejs18.x',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
        region: 'us-east-1',
        iamRoleStatements: [
            {
                Effect: "Allow",
                Action: [
                    "dynamodb:GetItem",
                    "dynamodb:PutItem",
                    "dynamodb:UpdateItem",
                    "dynamodb:DescribeTable",
                    "dynamodb:DeleteItem",
                    "dynamodb:Query",
                ],
                Resource: ["arn:aws:dynamodb:us-east-1:#{AWS::AccountId}:table/*", "arn:aws:lambda:us-east-1:#{AWS::AccountId}:function:cwLogger"]
            },
            {
                Effect: "Allow",
                Action: ["lambda:InvokeFunction"],
                Principal: "*",
                Resource: ["arn:aws:lambda:us-east-1:#{AWS::AccountId}:function:benchmarkMaster", "arn:aws:lambda:us-east-1:#{AWS::AccountId}:function:benchmarkRunner", "arn:aws:lambda:us-east-1:#{AWS::AccountId}:function:benchmarkFunction02"]
            },
        ]
    },
    // import the function via paths
    functions: { scheduleBenchmarkFunctions, benchmarkRunner, cwLogger, benchmarkRunnerAPI, benchmarkFunction01, benchmarkFunction02 },
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node18',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10,
        },
    },
    resources: {
        Resources: {
            ExecutionLogTable: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    TableName: 'ExecutionLogTable',
                    AttributeDefinitions: [
                        { AttributeName: 'requestId', AttributeType: 'S' },
                    ],
                    KeySchema: [
                        { AttributeName: 'requestId', KeyType: 'HASH' },
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1,
                    },
                },
            },
        }
    }
};

module.exports = serverlessConfiguration;
