import { config, S3 } from "aws-sdk";
import { FileRepository } from "src/domain/repositories/file";

config.update({
  region: "ap-northeast-2",
});

const s3 = new S3({
  apiVersion: "2006-03-01",
});

export class FileRepositoryImpl implements FileRepository {
  upload(key: string, buffer: Buffer, mimetype: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      s3.upload(
        {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: mimetype,
        },
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(null);
          }
        },
      );
    });
  }

  remove(key: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      s3.deleteObject(
        {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
        },
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(null);
          }
        },
      );
    });
  }
}
