// index.js

// Selecting elements
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const clearCompletedBtn = document.getElementById("clear-completed-btn");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const progressDisplay = document.getElementById("progress-display");
const priorityDropdown = document.getElementById("priority-dropdown");
const filterButtons = document.querySelector(".filter-buttons");
const hamburgerMenu = document.getElementById("hamburger-menu");

// Load tasks from local storage on page load
document.addEventListener("DOMContentLoaded", loadTasks);

// Function to add a task
function addTask(taskText = taskInput.value, completed = false, priority = priorityDropdown.value) {
    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    const taskItem = document.createElement("li");
    taskItem.textContent = taskText + " (" + priority + ")";

    // Change color based on priority
    if (priority === "high") {
        taskItem.style.color = "red";
    } else if (priority === "medium") {
        taskItem.style.color = "orange";
    } else {
        taskItem.style.color = "green";
    }

    // Add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.backgroundColor = "#fb8500";
    deleteBtn.style.border = "none";
    deleteBtn.style.color = "white";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.style.borderRadius = "5px";

    taskItem.appendChild(deleteBtn);
    taskList.appendChild(taskItem);

    // Clear input field
    taskInput.value = "";

    // Event listeners
    deleteBtn.addEventListener("click", function () {
        taskList.removeChild(taskItem);
        saveTasks(); // Save updated list
        updateProgress(); // Update progress
    });

    taskItem.addEventListener("click", function () {
        taskItem.classList.toggle("completed");
        saveTasks(); // Save updated list
        updateProgress(); // Update progress
    });

    enableTaskEditing(taskItem); // Enable editing on each task
    saveTasks(); // Save tasks to local storage
    updateProgress(); // Update progress
}

// Function to enable editing a task
function enableTaskEditing(taskItem) {
    taskItem.addEventListener("dblclick", function () {
        const currentText = taskItem.firstChild.textContent.split(" (")[0]; // Get text without priority
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = currentText;
        taskItem.replaceChild(editInput, taskItem.firstChild);

        editInput.focus();

        editInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                taskItem.firstChild.textContent = editInput.value + " (" + priorityDropdown.value + ")";
                taskItem.replaceChild(document.createTextNode(taskItem.firstChild.textContent), editInput);
                saveTasks(); // Save updated task
            }
        });

        editInput.addEventListener("blur", function () {
            taskItem.firstChild.textContent = editInput.value + " (" + priorityDropdown.value + ")";
            taskItem.replaceChild(document.createTextNode(taskItem.firstChild.textContent), editInput);
            saveTasks(); // Save updated task
        });
    });
}

// Function to save tasks to local storage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll("li").forEach((taskItem) => {
        tasks.push({
            text: taskItem.firstChild.textContent.split(" (")[0],
            completed: taskItem.classList.contains("completed"),
            priority: taskItem.firstChild.textContent.split("(")[1].trim().replace(")", "")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
        addTask(task.text, task.completed, task.priority);
    });
    updateProgress(); // Update progress display on load
}

// Function to update progress display
function updateProgress() {
    const totalTasks = document.querySelectorAll("li").length;
    const completedTasks = document.querySelectorAll(".completed").length;
    progressDisplay.textContent = `Total Tasks: ${totalTasks} | Completed: ${completedTasks}`;
}

// Clear completed tasks
clearCompletedBtn.addEventListener("click", function () {
    document.querySelectorAll(".completed").forEach((taskItem) => {
        taskList.removeChild(taskItem);
    });
    saveTasks(); // Save updated list
    updateProgress(); // Update progress
});

// Dark mode toggle
darkModeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    document.querySelector(".todo-container").classList.toggle("dark-mode");
    document.querySelectorAll("input, select, button").forEach((el) => el.classList.toggle("dark-mode"));
    document.querySelectorAll("li").forEach((task) => task.classList.toggle("dark-mode"));
});

// Add task event listener
addTaskBtn.addEventListener("click", function () {
    addTask();
});

// Hamburger menu functionality
hamburgerMenu.addEventListener("click", function () {
    filterButtons.classList.toggle("hidden");
});
