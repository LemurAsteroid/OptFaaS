import type { AWS } from '@serverless/typescript';

import scheduleBenchmarkFunctions from '@services/runner/benchmarkMaster';
import benchmarkRunner from '@services/runner/benchmarkRunner';
import benchmarkFunction02 from '@functions/02';
import benchmarkFunction01 from '@functions/01';
import cwLogger from "@services/logging/cloudWatchLogger";
import logger from "@services/logger";
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
        iam: {
            role: "arn:aws:iam::#{AWS::AccountId}:role/LabRole",
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
            {
                Effect: "Allow",
                Action: [
                    "SNS:Publish",
                    "SNS:SetTopicAttributes",
                    "SNS:DeleteTopic",
                    "SNS:ListSubscriptionsByTopic",
                    "SNS:GetTopicAttributes",
                    "SNS:AddPermission",
                    "SNS:Subscribe"
                ],
                Principal: "*",
                Resource: ["arn:aws:sns:us-east-1:#{AWS::AccountId}:LOGGING_TOPIC", "arn:aws:lambda:us-east-1:#{AWS::AccountId}:function:logger", "arn:aws:lambda:us-east-1:#{AWS::AccountId}:function:benchmarkFunction01", "arn:aws:lambda:us-east-1:#{AWS::AccountId}:function:benchmarkFunction02"]
            },
        ]
    },
    // import the function via paths
    functions: { scheduleBenchmarkFunctions, benchmarkRunner, cwLogger, benchmarkRunnerAPI, benchmarkFunction01, benchmarkFunction02, logger },
    // Use type assertion to declare 'stepFunctions'
    // stepFunctions: {
    //     stateMachines: {
    //         logTrigger: {
    //             id: 'logTrigger',
    //             name: 'loggingStepFunction',
    //             definition: {
    //                 Comment: 'Trigger Lambda with a 10-minute delay',
    //                 StartAt: 'Wait10Minutes',
    //                 States: {
    //                     Wait10Minutes: {
    //                         Type: 'Wait',
    //                         Seconds: 600, // 10 minutes
    //                         End: true,
    //                         Next: 'InvokeCloudWatchLogger',
    //                     },
    //                     InvokeCloudWatchLogger: {
    //                         Type: 'Task',
    //                         Resource: "arn:aws:states:::lambda:invoke",
    //                         OutputPath: "$.Payload",
    //                         Parameters: {
    //                             FunctionName: 'arn:aws:lambda:#{AWS::Region}:#{AWS::AccountId}:function:cwLogger',
    //                             'Payload.$': '$',
    //                         },
    //                         End: true,
    //                     },
    //                 },
    //             },
    //         },
    //     },
    // },
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
            FunctionTable: {
                Type: "AWS::DynamoDB::Table",
                Properties: {
                    TableName: "Function",
                    AttributeDefinitions: [
                        {
                            AttributeName: "functionId",
                            AttributeType: "S"
                        }
                    ],
                    KeySchema: [
                        {
                            AttributeName: "functionId",
                            KeyType: "HASH"
                        }
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1
                    }
                }
            },
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
            EventInvokeConfig: {
                Type: "AWS::Lambda::EventInvokeConfig",
                Properties: {
                    FunctionName: "optFaas-dev-benchmarkFunction01",
                    Qualifier: "$LATEST",
                    MaximumEventAgeInSeconds: 600,
                    MaximumRetryAttempts: 0,
                    DestinationConfig: {
                        OnSuccess: {
                            Destination: "arn:aws:sns:us-east-1:#{AWS::AccountId}:LOGGING_TOPIC"
                        },
                    },
                }
            },
            // LoggingTopic: {
            //     Type: 'AWS::SNS::Topic',
            //     Properties: {
            //         DisplayName: 'LOGGING_TOPIC',
            //         TopicName: 'LOGGING_TOPIC',
            //     },
            // },
        }
    }
};

module.exports = serverlessConfiguration;
