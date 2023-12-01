export const variables = {
    REGION: ['us', 'eu', 'asia'],
    SCHEDULED_FUNCTIONS: ["nodejs01", "nodejs02"], //, "nodejs03", "nodejs04", "nodejs05", "java01", "java02", "java03", "java04"],
    NUMBER_OF_PARALLELIZATION: 50, //[1, 8, 32, 128, 216, 512],
    LOG_BUCKET_NAME: 'optfaas-logs',
    GCF_LOG_FUNCTION_URL: 'https://us-central1-optfaas.cloudfunctions.net/logFunction'
} as const;

export const AWS_REGIONS: { [key: string]: string } = {
    "us": "us-east-1",
    "asia": "ap-northeast-1",
    // "eu": "eu-central-1"
}

export const GCP_REGIONS: { [key: string]: string } = {
    "us": "us-central1",
    "asia": "asia-northeast1",
    "eu": "europe-west3"
}


export const URL_DICT_GCF: { [key: string]: string } = {
    "us": "https://us-central1-optfaas.cloudfunctions.net/",
    "asia": "https://asia-northeast1-optfaas.cloudfunctions.net/",
    "eu": "https://europe-west3-optfaas.cloudfunctions.net/"
};

export const URL_DICT_AWS: { [key: string]: string } = {
    "us": "https://us-central1-optfaas.cloudfunctions.net/",
};

export default variables;
