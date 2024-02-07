const express = require('express');
const fs = require('fs');
const fsPromise = require('fs').promises;
const path = require('path');
const { createGzip } = require('node:zlib');
const { pipeline } = require('node:stream');
const { promisify } = require('node:util');
const router = express.Router();


const getRequestLogs = async (req, res) => {
    try {
        const logsDir = path.join(__dirname, "..", 'logs');
        const reqLogFiles = await fsPromise.readdir(logsDir);

        const filteredReqLogFiles = reqLogFiles.filter(file => file.startsWith('reqLog'));

        if (!filteredReqLogFiles?.length) {
            return res.status(404).send('No reqLog files found');
        }

        const zipFileName = 'reqLogs.txt.gz';
        const zipFilePath = path.join(__dirname, '../temp', zipFileName);
        const output = fs.createWriteStream(zipFilePath);
        const gzip = createGzip();
        const pipelineAsync = promisify(pipeline);

        for (const file of filteredReqLogFiles) {
            const filePath = path.join(logsDir, file);
            const source = fs.createReadStream(filePath);
            await pipelineAsync(source, gzip, output);
        }

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);
        res.sendFile(zipFilePath, (err) => {
            if (err) {
                console.error('Error sending zip file:', err);
                res.status(500).send('Error sending zip file');
            }
            // Clean up temp file after sending
            fs.unlinkSync(zipFilePath);
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
};

const getErrorLogs = async (req, res) => {
    try {
        const logsDir = path.join(__dirname, "..", 'logs');
        const reqLogFiles = await fsPromise.readdir(logsDir);

        const filteredErrLogFiles = reqLogFiles.filter(file => file.startsWith('errLog'));

        if (!filteredErrLogFiles?.length) {
            return res.status(404).send('No reqLog files found');
        }

        const zipFileName = 'errLogs.txt.gz';
        const zipFilePath = path.join(__dirname, '../temp', zipFileName);
        const output = fs.createWriteStream(zipFilePath);
        const gzip = createGzip();
        const pipelineAsync = promisify(pipeline);

        for (const file of filteredErrLogFiles) {
            const filePath = path.join(logsDir, file);
            const source = fs.createReadStream(filePath);
            await pipelineAsync(source, gzip, output);
        }

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);
        res.sendFile(zipFilePath, (err) => {
            if (err) {
                console.error('Error sending zip file:', err);
                res.status(500).send('Error sending zip file');
            }
            // Clean up temp file after sending
            fs.unlinkSync(zipFilePath);
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { getRequestLogs, getErrorLogs };
