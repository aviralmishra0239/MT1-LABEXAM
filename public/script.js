
const API_URL = "http://localhost:4000";

// Load all tasks
async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`);
        const data = await response.json();

        const tasks = data.tasks || [];
        const taskList = document.getElementById("taskList");

        taskList.innerHTML = "";

        tasks.forEach(task => {
            const row = document.createElement("tr");

            const values = [
                task.id,
                task.taskName,
                task.assignedTo,
                task.status,
                task.priority
            ];

            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            const actionCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.onclick = () => editTask(task);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.style.background = "red";
            deleteButton.onclick = () => deleteTask(task.id);

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);

            taskList.appendChild(row);
        });

    } catch (error) {
        alert("Unable to load tasks. Check your server.");
        console.error(error);
    }
}

// Add new task
async function addTask() {
    const taskName = document.getElementById("taskName").value.trim();
    const assignedTo = document.getElementById("assignedTo").value.trim();
    const status = document.getElementById("status").value;
    const priority = document.getElementById("priority").value;

    if (!taskName || !assignedTo) {
        alert("Please enter task name and employee name.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/add-task`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                taskName,
                assignedTo,
                status,
                priority
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to add task");
        }

        alert("Task added successfully!");

        document.getElementById("taskName").value = "";
        document.getElementById("assignedTo").value = "";

        loadTasks();

    } catch (error) {
        alert(error.message);
        console.error(error);
    }
}

// Edit task
async function editTask(task) {
    const taskName = prompt("Enter new task name:", task.taskName);
    if (taskName === null || !taskName.trim()) return;

    const assignedTo = prompt("Enter employee name:", task.assignedTo);
    if (assignedTo === null || !assignedTo.trim()) return;

    const status = prompt(
        "Enter status (Pending, In Progress, Completed):",
        task.status
    );

    if (status === null) return;

    const priority = prompt(
        "Enter priority (Low, Medium, High):",
        task.priority
    );

    if (priority === null) return;

    try {
        const response = await fetch(`${API_URL}/tasks/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                taskName: taskName.trim(),
                assignedTo: assignedTo.trim(),
                status,
                priority
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to update task");
        }

        alert("Task updated successfully!");
        loadTasks();

    } catch (error) {
        alert(error.message);
        console.error(error);
    }
}

// Delete task
async function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to delete task");
        }

        alert("Task deleted successfully!");
        loadTasks();

    } catch (error) {
        alert(error.message);
        console.error(error);
    }
}

// Automatically load tasks when page opens
document.addEventListener("DOMContentLoaded", loadTasks);
