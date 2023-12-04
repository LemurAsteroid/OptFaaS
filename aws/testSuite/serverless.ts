import type { AWS } from '@serverless/typescript';

import scheduleBenchmarkFunctions from '@services/runner/benchmarkMaster';
import benchmarkRunner from '@services/runner/benchmarkRunner';
import benchmarkRunnerAPI from '@services/runner/benchmarkRunnerAPIGateway';
import cloudWatchLogger from "@services/logging/cloudWatchLogger";


const serverlessConfiguration: AWS = {
    service: 'optFaas',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-pseudo-parameters'],
    provider: {
        name: 'aws',
        stage: 'dev',
        stackTags: {
            Project: ' OptFaas',
            Deployment: 'Serverless',
            Author: 'Arne Pawlowski'
        },
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
        iam: {
            role: "arn:aws:iam::717556240325:role/Foppa_full_lambda_role",
        },
        iamRoleStatements: [
            {
                Effect: "Allow",
                Action: ["lambda:InvokeFunction"],
                Principal: "*",
                Resource: ["arn:aws:lambda:us-east-1:#{AWS::AccountId}:function:benchmarkMaster", "arn:aws:lambda:us-east-1:#{AWS::AccountId}:function:benchmarkRunner", "arn:aws:lambda:us-east-1:#{AWS::AccountId}:function:benchmarkFunction02"]
            },
        ]
    },
    // import the function via paths
    functions: { scheduleBenchmarkFunctions, benchmarkRunner, cloudWatchLogger, benchmarkRunnerAPI },
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
    // resources: {
    //     Resources: {
    //         ResourceBucket: {
    //             Type: 'AWS::S3::Bucket',
    //             Properties: {
    //                 BucketName: 'optfaas-resource-bucket'
    //             }
    //         },
    //     }
    // }
};

module.exports = serverlessConfiguration;
