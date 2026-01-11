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

let tasks = [
  { id: 1, title: "Learn Node.js", status: "completed", priority: "high" },
  { id: 2, title: "Build API", status: "in-progress", priority: "medium" }
];

let status = ["todo", "in-progress", "completed"];

let priorities = ["low", "medium", "high"];

function isValidTitle(taskTitle){
    if(taskTitle.length < 3 || taskTitle.length > 100) return false;
    return true;
}

function isValidStatus(taskStatus){
    return status.includes(taskStatus);  // Simple and correct!
}

function isValidPriority(taskPriority){
    return priorities.includes(taskPriority);
}

const server = http.createServer((req,res) => {
    console.log(`${req.method} ${req.url}`);

    if(req.url === '/tasks' && req.method === 'GET'){
        sendJSON(res,200,{tasks});
    } 

    else if (req.url.startsWith('/tasks/') && req.method === 'GET'){
        const id = parseInt(req.url.split('/')[2]);
        const task = tasks.find(b => b.id === id);
        if(!task){
            sendJSON(res, 404, {
                error: {
                    code: 'TASK_NOT_FOUND',
                    message: `Task with id ${id} not found`
                }
            });
        } else {
            sendJSON(res, 200, {task});
        }
    } 
    
    else if (req.url === '/tasks' && req.method === 'POST'){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newTask = JSON.parse(body);
                if(!newTask.title){
                    sendJSON(res, 400, {
                        error: {
                            code: 'MISSING_TITLE',
                            message: 'Title is required'
                        }
                    });
                    return;
                }

                if(!isValidTitle(newTask.title)){
                    sendJSON(res, 422, {
                        error: {
                            code: 'INVALID_TITLE',
                            message: 'title must be min 3 chars, max 100 chars'
                        }
                    });
                    return;
                }

                if(!isValidStatus(newTask.status)){
                    sendJSON(res, 422, {
                        error: {
                            code: 'INVALID_STATUS',
                            message: 'Status must be one of: todo, in-progress, completed'
                        }
                    });
                    return;
                }

                if(!isValidPriority(newTask.priority)){
                    sendJSON(res, 422, {
                        error: {
                            code: 'INVALID_PRIORITY',
                            message: 'Priority must be one of: low, medium, high'
                        }
                    });
                    return;
                }

                newTask.id = tasks.length > 0 ? Math.max(...tasks.map(u => u.id)) + 1 : 1;
                tasks.push(newTask);
                res.setHeader('Location', `/tasks/${newTask.id}`);
                sendJSON(res, 201, {
                    message: 'Task created successfully',
                    task: newTask
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

    else if (req.url.startsWith('/tasks/') && req.method === 'PUT'){
        const id = parseInt(req.url.split('/')[2]);
        const index = tasks.findIndex(i => i.id === id);
        if (index === -1){
            sendJSON(res, 404, {
                error:{
                    code: 'TASK_NOT_FOUND',
                    message: `Task with id ${id} not found`
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
                const updatedTask = JSON.parse(body);

                if(!updatedTask.title){
                    sendJSON(res, 400, {
                        error: {
                            code: 'MISSING_TITLE',
                            message: 'Title is required'
                        }
                    });
                    return;
                }

                if(!isValidTitle(updatedTask.title)){
                    sendJSON(res, 422, {
                        error: {
                            code: 'INVALID_TITLE',
                            message: 'title must be min 3 chars, max 100 chars'
                        }
                    });
                    return;
                }

                if(!isValidStatus(updatedTask.status)){
                    sendJSON(res, 422, {
                        error: {
                            code: 'INVALID_STATUS',
                            message: 'Status must be one of: todo, in-progress, completed'
                        }
                    });
                    return;
                }

                if(!isValidPriority(updatedTask.priority)){
                    sendJSON(res, 422, {
                        error: {
                            code: 'INVALID_PRIORITY',
                            message: 'Priority must be one of: low, medium, high'
                        }
                    });
                    return;
                }

                updatedTask.id = id;
                tasks[index] = updatedTask;
                sendJSON(res, 200, {task: updatedTask});

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
    
    else if (req.url.startsWith('/tasks/') && req.method === 'DELETE'){
        const id = parseInt(req.url.split('/')[2]);
        const index = tasks.findIndex(b => b.id === id);
        if (index === -1){
            sendJSON(res, 404, {
                error: {
                    code: 'TASK_NOT_FOUND',
                    message: `Task with id ${id} not found`
                }
            });
        } else {
            const deletedTask = tasks.splice(index,1)[0];

            sendJSON(res, 200, {
                message: `Task with ID ${id} is deleted`,
                task: deletedTask
            });
        }
        return;
    } 
    
    else if (req.url.startsWith('/tasks/') && req.method === 'PATCH'){
        const id = parseInt(req.url.split('/')[2]);
        const task = tasks.find(b => b.id === id);
        if (!task){
            sendJSON(res, 404, {
                error: {
                    code: 'TASK_NOT_FOUND',
                    message: `Task with ID ${id} is not found`
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
                if(updates.title) task.title = updates.title;
                if(updates.status){
                    if(!isValidStatus(updates.status)){
                        sendJSON(res, 422, {
                            error: {
                                code: 'INVALID_STATUS',
                                message: 'Status must be one of: todo, in-progress, completed'
                            }
                        });
                        return;
                    }
                    task.status = updates.status;
                } 
                if(updates.priority){
                    if(!isValidPriority(updates.priority)){
                        sendJSON(res, 422, {
                            error: {
                                code: 'INVALID_PRIORITY',
                                message: 'Priority must be one of: low, medium, high'
                            }
                        });
                        return;
                    }
                    task.priority = updates.priority;
                } 
                sendJSON(res, 200, {
                    message: `Task with ID ${id} partially updated`
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
        })
        return;
    }
    else if(req.url.startsWith('/tasks/status/') && req.method === 'GET'){
        const status = req.url.split('/')[3];
        const filteredTasks = tasks.filter(t => t.status === status);
        if(filteredTasks.length === 0){
            sendJSON(res, 404, {
                error: {
                    code: 'TASKS_NOT_FOUND',
                    message: `Tasks with status ${status} not found`
                }
            });
        } else {
            sendJSON(res, 200, {filteredTasks});
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