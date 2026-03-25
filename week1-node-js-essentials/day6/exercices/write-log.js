import fs from 'fs/promises';
import path from 'path';

const logPath = path.join('logs', 'app.log');

async function log(msg) {
    const time = new Date().toISOString();
    await fs.appendFile(logPath, `[${time}] ${msg}\n`);
}

log('server started');
log('user logged in');
