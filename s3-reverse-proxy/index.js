const express  = require('express');
const httpProxy = require('http-proxy')
const {PrismaClient} = require('@prisma/client');

const app = express();
require("dotenv").config();

const PORT = 8000;
const bucket = process.env.AWS_BUCKET;
const region = process.env.AWS_REGION;

const BASE_PATH = `https://${bucket}.s3.${region}.amazonaws.com/__ouputs/`;

const prisma = new PrismaClient();

const proxy = httpProxy.createProxy();
app.use(async (req, res) => {
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];
    // Finding id matching to this subdomain
    const project = await prisma.project.findFirst({
        where: {
            subdomain: subdomain
        }
    });
    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }
    const resolvesTo = `${BASE_PATH}/${project.id}`;

    return proxy.web(req, res, {target: resolvesTo, changeOrigin: true})
})

proxy.on('proxyReq', (proxyReq, req, res) => {
    const url = req.url;
    if(url === "/") {
        proxyReq.path += 'index.html';
    }
    return proxyReq;
})
app.listen(PORT, () => {
    console.log(`Reverse Proxy running on ${PORT}`);
});
