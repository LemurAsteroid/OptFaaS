export const variables = {
    REGION: ['us'],
    SCHEDULED_FUNCTIONS: ["01", "02"],
    NUMBER_OF_PARALLELIZATION: 5,
    CLOUD_WATCH_TRIGGER_ARN: "",
    GCP_BENCHMARK_RUNNER_URL: "https://us-central1-optfaas.cloudfunctions.net/benchmarkRunner",
    LOGGING_TOPIC_ARN: 'arn:aws:sns:us-east-1:794009295823:LOGGING_TOPIC',
} as const;

export const AWS_REGIONS: { [key: string]: string } = {
    "us": "us-east-1",
    "asia": "ap-northeast-1",
    "eu": "eu-central-1"
}

export const GCP_REGIONS: { [key: string]: string } = {
    "us": "us-central1"
}


export const URL_DICT_GCF: { [key: string]: string } = {
    "us": "https://us-central1-optfaas.cloudfunctions.net/",
};

export const URL_DICT_AWS: { [key: string]: string } = {
    "us": "https://us-central1-optfaas.cloudfunctions.net/",
};

export default variables;
