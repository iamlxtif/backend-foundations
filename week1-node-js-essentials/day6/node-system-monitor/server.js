import http from 'http';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';

const logDir = 'logs';
const logFile = path.join(logDir, 'server.log');

async function log(method, url){
    await fs.mkdir(logDir, { recursive: true });
    const time = new Date().toISOString();
    await fs.appendFile(logFile, `[${time}] ${method} ${url}\n`);
}

function getSystemInfo() {
    return {
        cpu: os.arch(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        platform: os.platform()
    };
}

const server = http.createServer(async (req, res) => {
    await log(req.method, req.url);
    if (req.url === '/') {
        res.end('Welcome');
    } else if (req.url === '/health') {
        res.end(JSON.stringify({ status: "ok", uptime: process.uptime() }));
    } else if (req.url === '/status'){
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(getSystemInfo()));
    } else{
        res.statusCode = 404;
        res.end('Not Found');
    }
})

server.listen(3000, () => {
    console.log('server started at point 3000');
});