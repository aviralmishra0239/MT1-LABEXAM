
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Employee task array
let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending"
    },
    {
        id: 2,
        taskName: "Design Dashboard",
        assignedTo: "Amit Kumar",
        status: "Completed"
    },
    {
        id: 3,
        taskName: "Test Application",
        assignedTo: "Priya Singh",
        status: "In Progress"
    }
];

// Create HTTP server
const server = http.createServer((req, res) => {

    // A1 and A2: Routing

    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end(`
            <h1>Welcome to Employee Task Management</h1>
            <p>Manage employee tasks easily.</p>
        `);
    }

    else if (req.method === 'GET' && req.url === '/tasks') {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify(tasks, null, 2));
    }

    else if (req.method === 'GET' && req.url === '/about') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end(`
            <h1>About Application</h1>
            <p>This application manages employee tasks.</p>
            <p>Developed using Node.js HTTP and FS modules.</p>
        `);
    }

    // A4: Serve HTML using FS module
    else if (req.method === 'GET' && req.url === '/home') {

        const filePath = path.join(__dirname, 'public', 'index.html');

        fs.readFile(filePath, 'utf8', (err, data) => {

            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.end('Error reading HTML file');
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.end(data);
        });
    }

    // A3: POST method to add task
    else if (req.method === 'POST' && req.url === '/add-task') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {

            try {
                const newTask = JSON.parse(body);

                const { id, taskName, assignedTo, status } = newTask;

                if (
                    id === undefined ||
                    !taskName?.trim() ||
                    !assignedTo?.trim() ||
                    !status?.trim()
                ) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json'
                    });

                    res.end(JSON.stringify({
                        message: 'All required fields are mandatory'
                    }));

                    return;
                }

                if (tasks.some(task => task.id === id)) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json'
                    });

                    res.end(JSON.stringify({
                        message: 'Task ID already exists'
                    }));

                    return;
                }

                tasks.push({
                    id,
                    taskName,
                    assignedTo,
                    status
                });

                res.writeHead(201, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    message: 'Task added successfully',
                    task: newTask
                }));

            } catch (error) {

                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    message: 'Invalid JSON request'
                }));
            }
        });
    }

    // A5: Invalid route
    else {
        res.writeHead(404, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
            message: 'Route not found'
        }));
    }

});

// A1: Start server on port 3000
server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});
