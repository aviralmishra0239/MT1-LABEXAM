
import express from 'express';

const app = express();

const PORT = 4000;

// Middleware to parse JSON
app.use(express.json());

// Sample employee tasks
let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending",
        priority: "High"
    },
    {
        id: 2,
        taskName: "Design Dashboard",
        assignedTo: "Amit Kumar",
        status: "Completed",
        priority: "Medium"
    },
    {
        id: 3,
        taskName: "Test Application",
        assignedTo: "Priya Singh",
        status: "In Progress",
        priority: "High"
    }
];

// Helper function to validate task details
function isValidTask(task) {
    return (
        task &&
        task.id !== undefined &&
        Number.isInteger(task.id) &&
        task.id > 0 &&
        typeof task.taskName === 'string' &&
        task.taskName.trim() !== '' &&
        typeof task.assignedTo === 'string' &&
        task.assignedTo.trim() !== '' &&
        typeof task.status === 'string' &&
        task.status.trim() !== '' &&
        typeof task.priority === 'string' &&
        task.priority.trim() !== ''
    );
}

// B2.1: GET all tasks
app.get('/tasks', (req, res) => {

    res.status(200).json({
        message: 'All tasks retrieved successfully',
        tasks: tasks
    });

});

// B2.2: GET task by ID
app.get('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'Invalid task ID'
        });
    }

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: 'Task not found'
        });
    }

    res.status(200).json({
        message: 'Task retrieved successfully',
        task: task
    });

});

// B2.3: POST - Add new task
app.post('/tasks', (req, res) => {

    const newTask = req.body;

    if (!isValidTask(newTask)) {
        return res.status(400).json({
            message: 'Invalid task details. All fields are required.'
        });
    }

    const existingTask = tasks.find(t => t.id === newTask.id);

    if (existingTask) {
        return res.status(400).json({
            message: 'Task ID already exists'
        });
    }

    tasks.push(newTask);

    res.status(201).json({
        message: 'Task added successfully',
        task: newTask
    });

});

// B2.4: PUT - Update task
app.put('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'Invalid task ID'
        });
    }

    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({
            message: 'Task not found'
        });
    }

    const { taskName, assignedTo, status, priority } = req.body;

    if (
        typeof taskName !== 'string' || !taskName.trim() ||
        typeof assignedTo !== 'string' || !assignedTo.trim() ||
        typeof status !== 'string' || !status.trim() ||
        typeof priority !== 'string' || !priority.trim()
    ) {
        return res.status(400).json({
            message: 'All task details are required for update'
        });
    }

    tasks[taskIndex] = {
        id: id,
        taskName,
        assignedTo,
        status,
        priority
    };

    res.status(200).json({
        message: 'Task updated successfully',
        task: tasks[taskIndex]
    });

});

// B2.5: DELETE task
app.delete('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'Invalid task ID'
        });
    }

    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({
            message: 'Task not found'
        });
    }

    const deletedTask = tasks.splice(taskIndex, 1);

    res.status(200).json({
        message: 'Task deleted successfully',
        task: deletedTask[0]
    });

});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({
        message: 'API route not found'
    });
});

// Handle invalid JSON and other errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            message: 'Invalid JSON request'
        });
    }

    res.status(500).json({
        message: 'Internal server error'
    });
});

// Start Express server
app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}`);
});
