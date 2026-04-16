import http from 'http';

const server = http.createServer((req, res) => {
    if(req.url === '/'){
        res.end('Home');
    } else if(req.url === '/health'){
        res.end('OK');
    } else if(req.url === '/status'){
        res.end('Server status');
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
})

server.listen(3000, () => {
    console.log('server started in port 3000');
});