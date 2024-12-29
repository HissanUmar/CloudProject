import express from 'express'
import multer from 'multer'
import { Storage } from '@google-cloud/storage'
import path from 'path'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cors from 'cors';
import fs from 'fs'
import { CLIENT_RENEG_LIMIT } from 'tls'
import fetchuser from './fetch_user.js'

// Middleware to handle file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
}).fields([
    { name: 'files', maxCount: 2 },
]);



const app = express();
const port = 8800;
app.use(bodyParser.json());
dotenv.config();
app.use(cors());


const storage = new Storage({ keyFilename: 'my-project-007-436010-40d85edc0764.json' });
const bucket = storage.bucket('video-bucket-24');


app.post('/upload', fetchuser, upload, async (req, res) => {


    const auth_token = req.header("auth_token");
    // const response = await fetch('http://localhost:8080/get-username',{
    //     method: 'GET',
    //     headers: {
    //     'auth_token': auth_token ? `${auth_token}` : '', // Attach the token in Authorization header
    //     'Content-Type': 'application/json', // Optional, depending on the server's expected content type
    //     }
    // });

    // const data = await response.json();
    // const userId = data.userId;

    // if(!userId){
    //     res.status(400).json({error: 'User id not found in the database.'});
    // }

    // Check if the response is successful
    const name = req.body.name;
    const files = req.files.files;
    const userId = req.userId;

    console.log("This is the userId", userId);
    //console.log(req.body.name);
    //console.log(req.files);

    if (!name || !files || files.length === 0) {
        console.log("Failed");
        return res.status(400).json({ error: 'Name and files are required' });
    }

    console.log("to try block");

    try {
        const folderPath = `${userId}`;

        const [existingFiles] = await bucket.getFiles({ prefix: folderPath });
        const totalSize = await existingFiles.reduce(async (accPromise, currentFile) => {
            const acc = await accPromise;
            const [metadata] = await currentFile.getMetadata();
            return acc + parseInt(metadata.size, 10);
        }, Promise.resolve(0));

        console.log("No error after promise");

        const newFilesSize = files.reduce((acc, file) => acc + file.size, 0);

        if (totalSize + newFilesSize > (50 * 1024 * 1024)) {
            return res.status(400).json({
                message: 'Limit exceeded: Total folder size cannot exceed 50 MB',
            });
        }

        for (const file of files) {
            let fileFormat = "image"

            if (file.mimetype.includes('video')) {
                fileFormat = "video"
            }



            const destination = `${folderPath}/${fileFormat}/${name}`;
            const cloudFile = bucket.file(destination);
            await cloudFile.save(file.buffer, {
                metadata: {
                    contentType: file.mimetype,
                },
            });

            const response = fetch('http://localhost:5000/logging', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event: "upload",            // Event type (e.g., upload, stream)
                    status: "success",          // Event status (e.g., success, failure)
                    timestamp: new Date(),  // Timestamp of event
                    user_id: userId,         // Unique user identifier
                    fileName: `${req.body.name}`,     // File name (if applicable)
                })
            });
        }



        res.json({
            message: `File uploaded successfully to ${folderPath}`,
            ok: true,
        });
    }
    catch (err) {
        console.error('Error uploading file:', err);
        console.log(err);
        res.status(500).json({ error: 'Error uploading file to bucket' });
    }

});


app.delete('/delete', async (req, res) => {
    const { name, fileName } = req.query;

    console.log(name, fileName);

    if (!name || !fileName) {
        return res.status(400).json({ error: 'userName and fileName are required' });
    }

    try {
        const filePath = `${name}/${fileName}`;
        const file = bucket.file(filePath);

        await file.delete();

        res.json({ message: `File at location ${filePath} deleted.` });

        const response = fetch('http://localhost:5000/logging', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event: "delete",            // Event type (e.g., upload, stream)
                status: "success",          // Event status (e.g., success, failure)
                timestamp: new Date(),  // Timestamp of event
                user_id: userId,         // Unique user identifier
                fileName: `${name}`,     // File name (if applicable)
            })
        });

    }
    catch (err) {
        console.error("Error deleting file: ", err);
        res.json({ error: 'Error while deleting the file at the location.' });
    }

});

app.get('/all-files', fetchuser, async (req, res) => {

    const userId = req.userId;

    console.log("ID: ", userId)
    // const { name } = req.query;

    // if (!name) {
    //     return res.status(400).json({ error: 'Folder name is required' });
    // }

    try {
        const folderPath = `${userId}/image/`;
        const [files] = await bucket.getFiles(({ prefix: folderPath }));

        //const fileNames = files.map(file => file.name);

        const fileData = await Promise.all(
            files.map(async (file) => {
                const signedURL = await file.getSignedUrl({
                    action: 'read',
                    expires: Date.now() + 100 * 60 * 60
                });

                return {
                    name: file.name,
                    url: signedURL[0] // Get the signed URL
                };
            })
        );

        console.log("File data structured");

        const response = fetch('http://localhost:5000/logging', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event: "file-access",            // Event type (e.g., upload, stream)
                status: "success",          // Event status (e.g., success, failure)
                timestamp: new Date(),  // Timestamp of event
                user_id: userId,         // Unique user identifier   
                fileName: folderPath,
            })
        });

        res.json({ objects: fileData });

    }
    catch (err) {
        console.error('Error listing objects in folder:', err);
        res.status(500).json({ error: 'Error listing objects in folder' });
    }

});

app.get('/stream-video/', async (req, res) => {
    try {
        const folderName = req.query.folderName;
        const videoName = req.query.videoName;
        const filePath = `${folderName}/${videoName}`;

        console.log(filePath);

        const file = bucket.file(filePath);
        const [exists] = await file.exists();
        if (!exists) {
            return res.status(404).send('Video not found');
        }

        // Fetch metadata
        const [metaData] = await file.getMetadata();
        const fileSize = parseInt(metaData.size, 10);

        const range = req.headers.range

        console.log(metaData);

        const [metadata] = await file.getMetadata();

        // Set response headers for video streaming
        res.setHeader('Content-Type', metadata.contentType || 'video/mp4');
        res.setHeader('Content-Length', metadata.size);

        // Stream video file from Google Cloud Storage
        const readStream = file.createReadStream();

        // Pipe the stream to the response
        readStream
            .on('error', (err) => {
                console.error('Error streaming file:', err);
                res.status(500).send('Error streaming video');
            })
            .pipe(res);

        const response = fetch('http://localhost:5000/logging', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event: "stream",            // Event type (e.g., upload, stream)
                status: "success",          // Event status (e.g., success, failure)
                timestamp: new Date(),  // Timestamp of event
                user_id: userId,         // Unique user identifier   
                fileName: videoName,
            })
        });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal server error');
    }
});






app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

