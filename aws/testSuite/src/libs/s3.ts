import {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommandInput, S3, PutObjectCommandInput
} from '@aws-sdk/client-s3';

export const getItem = async (bucket: string, key: string) => {
    const s3 = new S3({ region: 'us-east-1' });

    const getObjectParams: GetObjectCommandInput = {
        Bucket: bucket,
        Key: key,
    };

    try {
        return await s3.send(new GetObjectCommand(getObjectParams));
    } catch (error) {
        console.error('Error fetching file from S3:', error);
        throw error;
    }
};

export const getUint8Array = async (bucket: string, key: string) => {
    try {
        const response = await getItem(bucket, key);
        return new Uint8Array(await new Response(response.Body).arrayBuffer());
    } catch (error) {
        console.error('Error fetching file from S3:', error);
        throw error;
    }
};

export const putItem = async (bucket: string, key: string, body: string) => {
    const s3 = new S3({ region: 'us-east-1' });
    const putObjectParams: PutObjectCommandInput = {
        Bucket: bucket,
        Key: key,
        Body: body,
    };

    try {
        await s3.send(new PutObjectCommand(putObjectParams));
    } catch (error) {
        console.error('Error putting file to S3:', error);
        throw error;
    }
};

export const deleteItem = async (bucketName: string, key: string) => {
    const s3Client = new S3Client();

    const deleteObjectParams = {
        Bucket: bucketName,
        Key: key,
    };

    try {
        await Promise.all([
            s3Client.send(new DeleteObjectCommand(deleteObjectParams)),
        ]);
    } catch (error) {
        console.error('Error deleting file from S3:', error.message);
        throw error;
    }
}




