import { variables } from 'variables';

export default {
    handler: './src/services/logger/handler.main',
    events: [
        { sns: { arn: variables.LOGGING_TOPIC_ARN } }
    ]
};