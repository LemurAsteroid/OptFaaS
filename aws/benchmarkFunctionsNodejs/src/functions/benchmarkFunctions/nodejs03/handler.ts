import {middify} from "@libs/logger";
import {wrapperFunction} from "@libs/wrapper";
import Jimp from "jimp";
import {getUint8Array} from "@libs/s3";

const BUCKET_NAME = 'optfaas-resource-bucket';
const IMAGE_NAME = 'benchmark_image_1mb.jpg';


const resizeImageBenchmark = async () => {
    const originalImageBuffer = await getUint8Array(BUCKET_NAME, IMAGE_NAME);

    await Jimp.read(Buffer.from(originalImageBuffer))
        .then((image) => {
            return image
                .resize(300, 300)
                .greyscale();
        });

    return {
        success: true,
        payload: {
            test: 'convertVideoToGifBenchmark',
        },
    };
};

const wNodejs = async (event, context) => {
    return await wrapperFunction(resizeImageBenchmark, event, context);
}

export const main = middify(wNodejs, "nodejs03");
