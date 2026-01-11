import http from 'http';

function sendJSON(res, statusCode, data){
    res.statusCode = statusCode;
    res.setHeader('Content-type', 'application/json');
    res.end(JSON.stringify(data));
}

function logError(error, context) {
  console.error('\n--- ERROR ---');
  console.error('Time:', new Date().toISOString());
  console.error('Context:', context);
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  console.error('-------------\n');
}

let users = [
  { id: 1, name: "Alice", email: "alice@example.com", age: 25 },
  { id: 2, name: "Bob", email: "bob@example.com", age: 30 }
];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const server = http.createServer((req,res) => {
    console.log(`${req.method} ${req.url}`);

    if(req.url === '/users' && req.method === 'GET'){
        sendJSON(res,200,{users});
    } 

    else if (req.url.startsWith('/users/') && req.method === 'GET'){
        const id = parseInt(req.url.split('/')[2]);
        const user = users.find(b => b.id === id);
        if(!user){
            sendJSON(res, 404, {
                error: {
                    code: 'USER_NOT_FOUND',
                    message: `User with id ${id} not found`
                }
            });
        } else {
            sendJSON(res, 200, {user});
        }
    } 
    
    else if (req.url === '/users' && req.method === 'POST'){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newUser = JSON.parse(body);
                if(!newUser.name || !newUser.email || !newUser.age){
                    sendJSON(res, 400, {
                        error: {
                            code: 'MISSING_FIELDS',
                            message: 'Required fields: name, email, age'
                        }
                    });
                    return;
                }

                if(!isValidEmail(newUser.email)){
                    sendJSON(res, 422, {
                        error: {
                            code: 'INVALID_EMAIL',
                            message: 'Invalid email format'
                        }
                    });
                    return;
                }

                if(newUser.age < 18){
                    sendJSON(res, 422, {
                        error: {
                            code: 'INVALID_AGE',
                            message: 'Age must be at least 18'
                        }
                    });
                    return;
                }

                if(users.find(u => u.email === newUser.email)){
                    sendJSON(res, 409, {
                        error: {
                            code: 'EMAIL_EXISTS',
                            message: 'User with this email already exists'
                        }
                    });
                    return;
                }

                newUser.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
                users.push(newUser);
                res.setHeader('Location', `/users/${newUser.id}`);
                sendJSON(res, 201, {
                    message: 'User created successfully',
                    user: newUser
                });

            } catch (error) {
                logError(error, {method: req.method, url: req.url});
                sendJSON(res, 400, {
                    error: {
                        code: 'INVALID_JSON',
                        message: 'Request body must be valid JSON'
                    }
                });
            }
        });
        return;
    } 

    else if (req.url.startsWith('/users/') && req.method === 'PUT'){
        const id = parseInt(req.url.split('/')[2]);
        const index = users.findIndex(i => i.id === id);
        if (index === -1){
            sendJSON(res, 404, {
                error:{
                    code: 'USER_NOT_FOUND',
                    message: `User with id ${id} not found`
                }
            });
            return;
        }
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const updatedUser = JSON.parse(body);

                if(!isValidEmail(updatedUser.email)){
                    sendJSON(res, 422, {
                        error: {
                            code: 'INVALID_EMAIL',
                            message: 'Invalid email format'
                        }
                    });
                    return;
                }

                if(updatedUser.age < 18){
                    sendJSON(res, 422, {
                        error: {
                            code: 'INVALID_AGE',
                            message: 'Age must be at least 18'
                        }
                    });
                    return;
                }

                updatedUser.id = id;
                users[index] = updatedUser;
                sendJSON(res, 200, {user: updatedUser});

            } catch (error) {
                logError(error, {method: req.method, url: req.url});
                sendJSON(res, 400, {
                    error: {
                        code: 'INVALID_JSON',
                        message: 'Request body must be valid JSON'
                    }
                });
            }
        })
        return;
    } 
    
    else if (req.url.startsWith('/users/') && req.method === 'DELETE'){
        const id = parseInt(req.url.split('/')[2]);
        const index = users.findIndex(b => b.id === id);
        if (index === -1){
            sendJSON(res, 404, {
                error: {
                    code: 'USER_NOT_FOUND',
                    message: `User with id ${id} not found`
                }
            });
        } else {
            const deleteduser = users.splice(index,1)[0];

            sendJSON(res, 200, {
                message: `User with ID ${id} is deleted`,
                user: deleteduser
            });
        }
        return;
    } 
    
    else if (req.url.startsWith('/users/') && req.method === 'PATCH'){
        const id = parseInt(req.url.split('/')[2]);
        const user = users.find(b => b.id === id);
        if (!user){
            sendJSON(res, 404, {
                error: {
                    code: 'USER_NOT_FOUND',
                    message: `User with ID ${id} is not found`
                }
            });
            return;
        }
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const updates = JSON.parse(body);
                if(updates.name) user.name = updates.name;
                if(updates.email){
                    if(!isValidEmail(updates.email)){
                        sendJSON(res, 422, {
                            error: {
                                code: 'INVALID_EMAIL',
                                message: 'Invalid email format'
                            }
                        });
                        return;
                    }

                    if (users.find(u => u.email === updates.email)) {
                        sendJSON(res, 409, {
                            error: {
                            code: 'EMAIL_EXISTS',
                            message: 'User with this email already exists'
                            }
                        });
                        return;
                    }
                    user.email = updates.email;
                } 
                if(updates.age){
                    if (updates.age < 18) {
                        sendJSON(res, 422, {
                            error: {
                            code: 'INVALID_AGE',
                            message: 'Age must be at least 18'
                            }
                        });
                        console.log('entered');
                        return;
                    }
                    user.age = updates.age;
                } 
                sendJSON(res, 200, {
                    message: `User with ID ${id} partially updated`
                });
                
            } catch (error) {
                logError(error, {method: req.method, url: req.url});
                sendJSON(res, 404, {
                    error: {
                        code: 'USER_NOT_FOUND',
                        message: `User with ID ${id} not found`
                    }
                });
            }
        })
        return;
    }
    else if(req.url === '/random-fail' && req.method === 'GET'){
        try {
            if(Math.random() > 0.5) {
                throw new Error('Database connection failed');
            }
            sendJSON(res, 500, {message: 'Success!'});
        } catch (error) {
            logError(error, {method: req.method, url: req.url});
            sendJSON(res, 500, {
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'An unexpected error occurred'
                }
            })
        }
    }
    else {
        sendJSON(res, 404, {
            error: {
                code: 'ROUTE_NOT_FOUND',
                message: `Route ${req.method} ${req.url} not found`
            }
        });
    }
})

server.listen(3000, () => {
    console.log('Server is running at port 3000');
})