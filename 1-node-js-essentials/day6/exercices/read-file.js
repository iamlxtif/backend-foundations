import fs from 'fs/promises';

async function readFile(){
    const data = await fs.readFile('data.txt', 'utf8');
    console.log(data);
}

readFile();