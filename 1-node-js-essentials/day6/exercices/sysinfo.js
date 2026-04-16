import os from 'os';

console.log('CPU: ', os.arch());
console.log('Memory: ', os.totalmem());
console.log('Free Memory: ', os.freemem());
console.log('OS: ', os.platform());

