let tasks = [];

const oneHour = 60 * 60 * 1000;
const oneDay = 24 * 60 * 60 * 1000;
const oneWeek = 7 * 24 * 60 * 60 * 1000;

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {

    const savedTasks = localStorage.getItem("tasks")

    if (savedTasks) {
        tasks = JSON.parse(savedTasks); 
    }

    const form = document.getElementById("task-form");
    const input = document.getElementById("add_new_task");
    const dateInput = document.getElementById("date");

    // start and end time inputs 
    const startTime = document.getElementById("start-time"); 
    const endTime = document.getElementById("end-time"); 

    window.remainingList = document.getElementById("remaining-list");
    window.completedList = document.getElementById("completed-list");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const taskText = input.value.trim();
        const taskDate = dateInput.value;

        if (taskText === "") return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            dueDate: taskDate,
            createdAt: Date.now(),
            completedAt: null,
            deletedAt: null,
            status: "active",
            startTime : startTime.value, 
            endTime: endTime.value
        };

        tasks.push(newTask);

        // save tasks after adding new tasks 
        savedTasks(); 

        input.value = "";
        dateInput.value = "";

        renderTasks();
    });

    // Run cleanup every minute
    setInterval(cleanupTasks, 60000);

    // show saved tasks when page loads 
    renderTasks(); 

});

// Handle checkbox click
function renderTasks() {

    remainingList.innerHTML = "";
    completedList.innerHTML = "";

    const now = Date.now();

    tasks.forEach(task => {

        const li = document.createElement("li");

        // ACTIVE TASKS
        if (task.status === "active") {

            // Overdue check
            if (task.dueDate) {
                const due = new Date(task.dueDate).getTime();

                if (now > due) {
                    li.style.color = "red";
                }
            }

            li.innerHTML = `
                <input type="checkbox" class="task-checkbox">
                <span>${task.text}${task.dueDate ? " - " + task.dueDate : ""}</span>
            `;

            const checkbox = li.querySelector(".task-checkbox");

            checkbox.addEventListener("change", function() {
                task.status = "completed";
                task.completedAt = Date.now();

                // save after task completion 
                savedTasks(); 

                renderTasks();
            });

            remainingList.appendChild(li);
        }

        // COMPLETED TASKS
        if (task.status === "completed") {
            li.textContent = task.text + " (Completed)";
            completedList.appendChild(li);
        }

    });
}

function cleanupTasks() {

    const now = Date.now();

    tasks.forEach(task => {

        // Completed > 1 hour → Deleted
        if (task.status === "completed" &&
            now - task.completedAt > oneHour) {

            task.status = "deleted";
            task.deletedAt = now;
        }

        // Active overdue > 1 day → Deleted
        if (task.status === "active" && task.dueDate) {

            const due = new Date(task.dueDate).getTime();

            if (now - due > oneDay) {
                task.status = "deleted";
                task.deletedAt = now;
            }
        }
    });

    // Deleted > 1 week → Permanently remove
    tasks = tasks.filter(task => {
        if (task.status === "deleted") {
            return (now - task.deletedAt < oneWeek);
        }
        return true;
    });
    savedTasks(); 

    renderTasks();
}

// save tasks to localstorage so they persist after refresh 
function savedTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks)); 
}