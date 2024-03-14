export const variables = {
    REGION: ['us', 'eu', 'asia'],
    SCHEDULED_FUNCTIONS: ["nodejs01", "nodejs02", "nodejs03", "nodejs04", "nodejs05", "java01", "java02", "java03", "java04"],
    NUMBER_OF_PARALLELIZATION: [1, 8, 32, 128, 400],
    LOG_BUCKET_NAME: 'optfaas-resource-bucket',
    GCF_LOG_FUNCTION_URL: 'https://us-central1-optfaas.cloudfunctions.net/logFunction'
} as const;

export const AWS_REGIONS: { [key: string]: string } = {
    "us": "us-east-1",
    "asia": "ap-northeast-1",
    "eu": "eu-central-1"
}

export const GCP_REGIONS: { [key: string]: string } = {
    "us": "us-central1",
    "asia": "asia-northeast1",
    "eu": "europe-west3"
}

export const CompleteFunctionName: { [key: string]: string } = {
    "nodejs01": "optFaas-nodejs-dev-nodejs01",
    "nodejs02": "optFaas-nodejs-dev-nodejs02",
    "nodejs03": "optFaas-nodejs-dev-nodejs03",
    "nodejs04": "optFaas-nodejs-dev-nodejs04",
    "nodejs05": "optFaas-nodejs-dev-nodejs05",
    "java01": "optFaas-java-dev-java01",
    "java02": "optFaas-java-dev-java02",
    "java03": "optFaas-java-dev-java03",
    "java04": "optFaas-java-dev-java04"
}

export const URL_DICT_GCF: { [key: string]: string } = {
    "us": "https://us-central1-optfaas.cloudfunctions.net/",
    "asia": "https://asia-northeast1-optfaas.cloudfunctions.net/",
    "eu": "https://europe-west3-optfaas.cloudfunctions.net/"
};

export default variables;
