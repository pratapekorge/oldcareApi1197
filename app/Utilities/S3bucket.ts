import fs from "fs";
import AWS from 'aws-sdk';

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey,
});

export const uploadFileMulter = async (file: Express.Multer.File, name: string): Promise<any> => {
    console.log("file", file)
    console.log("name", name)
   

    const fileBuffer = fs.readFileSync(file.path);

    const params: any = {
        Bucket: bucketName,
        Body: fileBuffer,
        Key: name,
        ContentType: file.mimetype
    }
    const s3 = new AWS.S3({
        region,
        accessKeyId,
        secretAccessKey,
    });

    let output = await s3.upload(params, (s3Err: any, data: any) => {
        console.log("output", output)
        if (s3Err){

            console.log("s3Err",s3Err)
            throw new s3Err
        } 
    }).promise();


    // fs.unlink(file.path, () => {
    //     console.log("File Unlink : ", file.path);
    // });

    return output;
}

export async function uploadExcelfile(data: any, key: any) {
    const params:any = {
        Bucket: bucketName,
        Body: data,
        Key: key, // Set the desired file name in S3
        ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    try {
        const uploadResult = await s3.upload(params).promise();
        console.log("uploadresult",uploadResult)
        return uploadResult;
        console.log(`File uploaded successfully at ${uploadResult.Location}`);
    } catch (error) {
        return  error;
        console.error('Error uploading to S3:', error);
    }
}