import type { AWS } from '@serverless/typescript';

import benchmarkFunction02 from '@functions/02';
import benchmarkFunction01 from '@functions/01';

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
        region: 'ap-northeast-1',
    },
    // import the function via paths
    functions: { benchmarkFunction01, benchmarkFunction02 },
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
};

module.exports = serverlessConfiguration;
