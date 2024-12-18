import { HeadBucketCommand, S3Client as AwsS3Client, NoSuchBucket } from "@aws-sdk/client-s3";

// Check if S3 buckets exist and let the stack know
const awsS3Client: AwsS3Client = new AwsS3Client({
  region: "ap-southeast-2",
});

export const checkBucketExists = async (bucket: string): Promise<boolean> => {
  try {
    const output = await awsS3Client.send(
      new HeadBucketCommand({
        Bucket: bucket,
      })
    );

    return output.$metadata.httpStatusCode === 200;
  } catch (e) {
    if (e instanceof NoSuchBucket) {
      console.error(`Bucket ${bucket} does not exist`);
      return false;
    }

    console.error("Unknown error", e);
    return false;
  }
};
