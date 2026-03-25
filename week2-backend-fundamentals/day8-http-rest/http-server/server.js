import http from 'http';

function logRequest(req){
    console.log('\n --- New request --- ');
    console.log(`Method: ${req.method}`);
    console.log(`Url: ${req.url}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
}

let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

const server = http.createServer((req, res) => {
    logRequest(req);

    res.setHeader('Content-Type','application/json');

    if(req.url === '/'){
        res.statusCode = 200;
        res.end(JSON.stringify({message: 'Welcome to my API'}));
    } else if (req.url === '/users' && req.method === 'GET'){
        res.statusCode = 200;
        res.end(JSON.stringify({ users }));
    } else if(req.url === '/about'){
        res.statusCode = 200;
        res.end(JSON.stringify({about: 'this is a REST API'}));
    } else if (req.url === '/users' && req.method === 'POST'){ 
// curl -X POST http://localhost:3000/users \
// -H "Content-Type: application/json" \
// -d '{"name": "David"}'
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newUser = JSON.parse(body);
                newUser.id = users.length + 1;
                users.push(newUser);

                res.statusCode = 201;
                res.end(JSON.stringify({
                    message: 'user created',
                    user: newUser
                }));
            } catch (error) {
                res.statusCode = 400;
                res.end(JSON.stringify({error: 'invalid JSON'}));
            }
        });
        return;
    }
    else{
        res.statusCode = 404;
        res.end(JSON.stringify({error: 'Route not found'}));
    }
});

const PORT = 3000;
server.listen(PORT,() => {
    console.log(`server is running in http://localhost:${PORT}/`);
})