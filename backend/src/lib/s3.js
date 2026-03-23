import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadToS3 = async (file) => {
  const fileExtension = file.originalname.split(".").pop();
  const key = `avatars/${crypto.randomUUID()}.${fileExtension}`;

  const putCommand = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(putCommand);

  // Generate a presigned GET URL valid for 7 days
  const getCommand = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  });

  const presignedUrl = await getSignedUrl(s3, getCommand, { expiresIn: 604800 });
  return presignedUrl;
};
