import http from 'http';

const server = http.createServer((req,res) => {
    res.end('server is running');
});

server.listen(3000, () => {
    console.log('server started in port 3000');
});