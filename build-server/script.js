const { exec } = require("child_process")
const path = require("path");
const fs = require("fs");
const {S3Client, PutObjectCommand} = require("@aws-sdk/client-s3");
const mime = require("mime-types");
const Valkey = require("ioredis");
require("dotenv").config();

const AWS_REGION = process.env.AWS_REGION;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_BUCKET = process.env.AWS_BUCKET;
const REDIS_SERVICE_URI = process.env.REDIS_SERVICE_URI;

const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    }
})

const PROJECT_ID = process.env.PROJECT_ID;
const DEPLOYEMENT_ID = process.env.DEPLOYEMENT_ID

const serviceUri = REDIS_SERVICE_URI
const publisher = new Valkey(serviceUri);

function publishLog(log) {
    publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify({PROJECT_ID, DEPLOYEMENT_ID, log}));
}


async function init() {
    console.log("Executing script.js");
    console.log("Build started...");
    publishLog("Build started");

    const outDirPath = path.join(__dirname, "output");

    const p = exec(`cd ${outDirPath} && npm install && npm run build`);

    p.stdout.on("data", (data) => {
        console.log(data.toString());
        publishLog(data.toString());
    });

    p.stdout.on("error", (data) => {
        console.log("Error: ", data.toString());
        publishLog(`Error: ${data.toString()}`);
    });

    p.on("close", async () => {
        console.log("Build completed");
        publishLog("Build complete");
        const distFolderPath = path.join(__dirname, "output", "dist");
        const distFolderContents = fs.readdirSync(distFolderPath, {recursive: true});

        console.log("Uploading files to S3...");
        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file);
            if(fs.lstatSync(filePath).isDirectory()) continue;

            console.log("Uploading", filePath);
            publishLog(`Uploading ${file}`);
            
            const command = new PutObjectCommand({
                Bucket: AWS_BUCKET,
                Key: `__ouputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath)
            })

            await s3Client.send(command);
            publishLog(`Uploaded ${file}`);
            console.log("Uploaded", filePath);
        }
        console.log("Done!!!");
        publishLog("Done!");
        process.exit(0);
        
    });
}

init();