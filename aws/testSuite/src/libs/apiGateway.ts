import fetch from "node-fetch";
import variables, {GCP_REGIONS} from "../../variables";


export const invokeGcfLogger = async (region: string, ufunctionId: string) => {
    const requestData = {
        ufunctionId: ufunctionId,
        region: GCP_REGIONS[region],
    };


    return await fetch(variables.GCF_LOG_FUNCTION_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
}
