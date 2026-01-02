import { createServer } from 'node:http';

const ERROR_RESPONSE = {
    status: 404,
    message: "Resource not found."
}

// DB in memory
const db = {
    tasks: [
        {
            id: 1,
            name: 'Làm bài tập',
            isCompleted: false,
        },
        {
            id: 2,
            name: 'Dọn nhà',
            isCompleted: false,
        },
        {
            id: 3,
            name: 'Rửa bát',
            isCompleted: false,
        },
    ]
};

const port = 6868;
const hostname = '127.0.0.1';

function serverResponse(res, data) {
    res.writeHead(data.status, { "Content-Type": "application/json" });
    res.write(JSON.stringify(data));
    res.end();
};

const server = createServer((req, res) => {
    let response = {
        status: 200,
    }

    // GET / api / tasks
    if (req.method === 'GET' && req.url === '/api/tasks') {
        try {
            response = {
                data: db.tasks,
                message: 'Get Tasks List Successfully',
            }

            serverResponse(req, res);

            return;
        } catch (error) {
            response = ERROR_RESPONSE;
        }
    }

    // [GET] /api/tasks/:id
    if (req.method === 'GET' && req.url === '/api/tasks/:id') {

    }

    // [POST] /api/tasks
    if (req.method === 'POST' && req.url === '/api/tasks') {

    }

    // [PUT] /api/tasks/:id
    if (req.method === 'PUT' && req.url === '/api/tasks/:id') {

    }

    // [DELETE] /api/tasks/:id
    if (req.method === 'DELETE' && req.url === '/api/tasks/:id') {

    }

    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({
        data: response
    }));
});



server.listen(port, hostname, () => {
    console.log(`Listening on ${hostname}:${port}`);
});
