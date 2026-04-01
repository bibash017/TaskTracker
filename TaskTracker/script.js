let tasks = [];
 
const oneMinute = 60 * 1000;
const oneHour   = 60 * 60 * 1000;
const oneDay    = 24 * 60 * 60 * 1000;
const oneWeek   = 7  * 24 * 60 * 60 * 1000;
 

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {

    // restore whatever was saved last time the user visited
    const savedTasksData = localStorage.getItem("tasks")

    if (savedTasksData) {
        tasks = JSON.parse(savedTasksData); 
    }

    // grab our form elements once here instead of hunting for them every render 
    const form = document.getElementById("task-form");
    const input = document.getElementById("add_new_task");
    const dateInput = document.getElementById("date");

    // start and end time inputs 
    const startTime = document.getElementById("start-time"); 
    const endTime = document.getElementById("end-time"); 

    // these lists get rewritten every render  
    window.remainingList = document.getElementById("remaining-list");
    window.completedList = document.getElementById("completed-list");

    // form submit
    form.addEventListener("submit", function(e) {
        // prevent the page from refreshing on submit
        e.preventDefault();

        const taskText = input.value.trim();
        if(!taskText) return; 
        const taskDate = dateInput.value;

        const newTask = {
            id: Date.now(),
            text: taskText,
            dueDate: dateInput.value,
            createdAt: Date.now(),
            completedAt: null,
            deletedAt: null,
            status: "active",
            startTime : startTime.value, 
            endTime: endTime.value, 
        };

        tasks.push(newTask);

        // save tasks after adding new tasks 
        saveTasks(); 

        input.value = "";
        dateInput.value = "";
        // clear form fields so the user can type the next task straight away
        startTime.value = ""; 
        endTime.value = "";

        renderTasks();
    });

    // Run cleanup every minute
    setInterval(cleanupTasks, 60000);

    // update timer display every second 
    setInterval(renderTasks, 1000); 

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

            // show timer if due date today (within 24 hours )
            let timerHTML = "";
        if (task.dueDate) {
        const due = new Date(task.dueDate).getTime();
        const diff = due - now;

        if (diff < 0) {
            li.style.color = "red";
            timerHTML = `<span style="color:red; font-weight:bold;"> ⚠ Overdue</span>`;
        } else if (diff < oneDay) {
            const hoursLeft = Math.floor(diff / oneHour);
            const minutesLeft = Math.floor((diff % oneHour) / oneMinute);
            timerHTML = `<span style="color:orange; font-weight:bold;"> ⏰ ${hoursLeft}h ${minutesLeft}m left</span>`;
        }
        }

            li.innerHTML = `
                <input type="checkbox" class="task-checkbox">
                <span>${task.text}${task.dueDate ? " - " + task.dueDate : ""}${timerHTML}</span>
            `;

            const checkbox = li.querySelector(".task-checkbox");

            checkbox.addEventListener("change", function() {
                task.status = "completed";
                task.completedAt = Date.now();

                // save after task completion 
                saveTasks(); 

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
    saveTasks(); 

    renderTasks();
}

// save tasks to localstorage so they persist after refresh 
function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks)); 
}

// Turns "2025-06-15" into "Jun 15" - easier to scan at a glance
function formatDate(dateStr){
    const d = new Date(dateStr); 
    return d.toLocaleDateString("en-US", {month: "short", day: "numeric"}); 
}

// turns a time stamp into "2 min ago", "1 hr ago", etc. 
function timeAgo(timestamp){
    const diff = Date.now() - timestamp; 
    if (diff < oneHour)
    return `${Math.floor(diff / oneMinute)} min ago`;

    if (diff < oneHour)
        return `${Math.floor(diff / oneHour)}hr ago`; 

    if (diff < oneDay)
        return `${Math.floor(diff / oneHour)} hr ago`; 
    return `${Math.floor(diff / oneDay)} days ago`
}