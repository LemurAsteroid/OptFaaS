import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns'

// The AWS Region can be provided here using the `region` property. If you leave it blank
// the SDK will default to the region set in your AWS config.
export const snsClient = new SNSClient({});


