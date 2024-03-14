import { URL_DICT_GCF } from 'variables';

export const resolveURL = (region: string, functionId: string) => {
    return `${URL_DICT_GCF[region]}${functionId}`;
}
