import type { AWS } from '@serverless/typescript';

import nodejs01 from "@functions/benchmarkFunctions/nodejs01";
import nodejs02 from "@functions/benchmarkFunctions/nodejs02";
import nodejs03 from "@functions/benchmarkFunctions/nodejs03";
import nodejs04 from "@functions/benchmarkFunctions/nodejs04";
import nodejs05 from "@functions/benchmarkFunctions/nodejs05";


const serverlessConfiguration: AWS = {
    service: 'optFaas-nodejs',
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
                Action: [
                    "s3:PutObject",
                    "s3:GetObject",
                    "s3:DeleteObject"
                ],
                Resource: [
                    "arn:aws:s3:::optfaas-resource-bucket/*",
                    "arn:aws:s3:::optfaas-resource-bucket"
                ]
            },
        ]
    },
    // import the function via paths
    functions: { nodejs01, nodejs02, nodejs03, nodejs04, nodejs05 },
    package: {
        include: ['src/functions/benchmarkFunctions/shared/template.handlebars'],
        individually: true,
    },
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
