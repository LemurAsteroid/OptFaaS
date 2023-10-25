import { FunctionData } from '@models/model';
import { URL_DICT_AWS, URL_DICT_GCF } from 'variables';

export const resolveURL = (region: string, provider: string, functionData: FunctionData) => {
    const urlDict = provider === "GCF" ? URL_DICT_GCF : URL_DICT_AWS;
    return `${urlDict[region]}${functionData.language}${functionData.ufunctionId}`;
}