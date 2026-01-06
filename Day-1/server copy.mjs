import { createServer } from "node:http";

const ERROR_RESPONSE = {
    status: 404,
    message: "Resource not found."
}

// DB in memory
const db = {
    tasks: [{
        id: 1,
        name: 'Làm bài tập',
        isCompleted: false,
    }, {
        id: 2,
        name: 'Rửa bát',
        isCompleted: false,
    }, {
        id: 3,
        name: 'Dọn nhà',
        isCompleted: false,
    }],
}

function serverResponse(res, data) {
    res.writeHead(data.status, {"Content-Type": "application/json"});

    // data type is object/json but res.write accept string or buffer as input, so we have to convert it
    res.write(JSON.stringify(data));
    res.end();
}

const server = createServer((req, res) => {
    let response = {
        status: 200,
    }

    //GET /api/task/1
    if (req.method === "GET" && req.url.startsWith("/api/task/")) {
        const id = +req.url.split("/").pop();
        const task = db.tasks.find((_task) => _task.id === id);
        if (task) {
            response.data = task;
        } else {
            response = ERROR_RESPONSE;
        }

        serverResponse(res, response);

        return;
    }

    //GET /api/tasks
    if (req.method === "GET" && req.url.startsWith("/api/tasks")) {
        if (db.tasks) {
            response.data = db.tasks;
        } else {
            response = ERROR_RESPONSE;
        }

        serverResponse(res, response);

        return;
    }

    //POST /api/task
    if (req.method === "POST" && req.url === "/api/task") {
        console.log('create task');

        let body = "";
        req.on("data", (buffer) => {
            body += buffer.toString();
        });
        req.on("end", () => {
            console.log('db', db.tasks);
            console.log('db length', db.tasks.length);

            // Shouldn't use ++length or length++, because it will mutate the length of array 
            const nextTaskId = db.tasks.length + 1;

            try {
                const payload = JSON.parse(body);
                const newTask = {
                    id: nextTaskId,
                    name: payload.name,
                    isCompleted: false,
                };

                if (newTask && newTask !== null) {
                    console.log('newTask', newTask);
                    db.tasks.push(newTask);
        
                    response.status = 201;
                    response.data = newTask;
                }
    
                
            } catch (error) {
                response.status = 500;
                response.message = "Create Task Failed."
            }

            serverResponse(res, response);
        });

        return;
    }

    // PUT/PATCH /api/task/1
    if ((req.method === "PUT" || req.method === "PATCH") && req.url.includes("/api/task")) {
        let body = "";

        req.on("data", (buffer) => {
            body += buffer.toString();
        });

        req.on("end", () => {
            const payload = JSON.parse(body);
            const payloadId = payload.id;

            const taskExists =  db.tasks.find(task => task.id === payloadId);
            
            const updatedData = db.tasks.map(task => {
                if (task.id === payloadId) {
                    return {
                        ...task,
                        name: payload.name,
                        isCompleted: payload.isCompleted,
                    }
                }

                return task
            });

            if (taskExists) {
                // Save Data
                db.tasks = updatedData;

                response.status = 201;
                response.data = db.tasks.find(task => task.id === payloadId);

            } else {
                response.status = 404;
                response.message = `Task with Id: ${payloadId} not found`;
            }

            serverResponse(res, response);
        });

        return;
    }

    // DELETE /api/tasks/1
    if (req.method === "DELETE" && req.url.includes("/api/task/")) {
        const idToDelete = +req.url.split('/').pop();

        const taskExists = db.tasks.find(task => task.id === idToDelete);
        const deletedData = db.tasks.filter(task => task.id !== idToDelete)

        if (taskExists) {
            db.tasks = deletedData;

            response.status = 200;
            response.data = `Task with Id: ${idToDelete} deleted`;
        } else {
            response.status = 404;
            response.message = `Task with Id: ${idToDelete} not found`;
        }

        serverResponse(res, response);

        return;
    }

    //Other
    serverResponse(res, {
        status: 200,
        data: "OK",
    });
});

server.listen(3000, "127.0.0.1", () => {
    console.log("Listening on 127.0.0.1:3000");
});