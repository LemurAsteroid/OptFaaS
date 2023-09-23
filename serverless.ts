// import type { CustomServerless } from '@libs/customTSConfig'
import type { AWS } from '@serverless/typescript';

import scheduleBenchmarkFunctions from '@services/runner/benchmarkMaster';
import benchmarkRunner from '@services/runner/benchmarkRunner';
import benchmarkFunction02 from '@functions/02';
import cwLogger from "@services/logging/cloudWatchLogger";
import benchmarkRunnerAPI from '@services/runner/benchmarkRunnerAPIGateway';


const serverlessConfiguration: AWS = {
    service: 'optFaas',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-step-functions', 'serverless-pseudo-parameters'],
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
                    "dynamodb:PutItem"
                ],
                Resource: "arn:aws:dynamodb:us-east-1:#{AWS::AccountId}:table/*"
            },
            {
                Effect: "Allow",
                Action: ["lambda:InvokeFunction"],
                Principal: "*",
                Resource: ["arn:aws:lambda:us-east-1:#{AWS::AccountId}:function:benchmarkMaster", "arn:aws:lambda:us-east-1:#{AWS::AccountId}:function:benchmarkRunner"]
            }
        ]
    },
    // import the function via paths
    functions: { scheduleBenchmarkFunctions, benchmarkRunner, cwLogger,benchmarkRunnerAPI, benchmarkFunction02 },
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
            }
        }
    }
};

module.exports = serverlessConfiguration;
