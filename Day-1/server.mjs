import { createServer} from 'node:http';
import { memoryUsage } from 'node:process';

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

function serverResponse(res,data) {
    res.writeHead(data.status, {"Content-Type": "application/json"});
    res.write(JSON.stringify(data));
    res.end();
};

const server = createServer((req, res) => {
    let response = {
        status: 200,
    }

    GET /api/tasks1
});

server.listen(3000, "127.0.0.1", () => {
    console.log("Listening on 127.0.0.1:3000");
});
