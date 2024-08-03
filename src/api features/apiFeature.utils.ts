import { JwtService } from '@nestjs/jwt';
import { S3 } from 'aws-sdk';

export default class APIFeatures {
  static async upload(files) {
    return new Promise((resolve) => {
      const s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });

      const images = new Array<S3.ManagedUpload.SendData>();

      files.forEach(async (file) => {
        const splitFile = file.originalname.split('.');
        const random = Date.now();

        const fileName = `${splitFile[0]}_${random}.${splitFile[1]}`;

        const param = {
          Bucket: `${process.env.AWS_S3_BUCKET_NAME}/restaurants`,
          Key: fileName,
          Body: file.buffer,
        };

        const uploadResponse = await s3.upload(param).promise();

        images.push(uploadResponse);

        if (images.length === files.length) {
          resolve(images);
        }
      });
    });
  }
  static async deleteImages(images) {
    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    if (images.length === 0) {
      return { msj: 'Dont have images for delete' };
    }

    const imagesKeys = images.map((image) => ({ Key: image.key.toString() }));

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Delete: {
        Objects: imagesKeys,
        Quiet: false,
      },
    };

    return new Promise((resolve, reject) => {
      s3.deleteObjects(params, (err, data) => {
        if (err) {
          console.error(err);
          reject(false);
        } else {
          resolve(data);
        }
      });
    });
  }
  static async assignJwtToken(
    userId: string,
    jwtService: JwtService,
  ): Promise<string> {
    const payload = { id: userId };

    const token = await jwtService.sign(payload);

    return token;
  }
}
