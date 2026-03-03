// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById("task-form");
    const input = document.getElementById("add_new_task");
    const dateInput = document.getElementById("date");
    const remainingList = document.getElementById("remaining-list");
    
    // Listen for form submit
    form.addEventListener("submit", function(e) {
        // FIXED: Prevent page refresh
        e.preventDefault();
        
        // Get values from inputs
        const taskText = input.value.trim();
        const taskDate = dateInput.value;
        
        // If empty, stop
        if (taskText === "") return;
        
        // Create new <li>
        const li = document.createElement("li");
        
        // Add checkbox and task text
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox">
            <span>${taskText}${taskDate ? ' - ' + taskDate : ''}</span>
        `;
        
        // Add to list
        remainingList.appendChild(li);
        
        // Clear inputs
        input.value = "";
        dateInput.value = "";
        
        // Add checkbox listener to new task
        attachCheckboxListener(li);
    });
    
    // Attach listeners to existing checkboxes
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        attachCheckboxListener(checkbox.parentElement);
    });
});

// Handle checkbox click
function attachCheckboxListener(li) {
    const checkbox = li.querySelector('.task-checkbox');
    
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            // Wait a moment, then move to completed
            setTimeout(() => {
                moveToCompleted(li);
            }, 300);
        }
    });
}

// Move task to completed section
function moveToCompleted(li) {
    const completedList = document.getElementById("completed-list");
    const taskText = li.querySelector('span').textContent;
    
    // Create completed task (no checkbox)
    const completedLi = document.createElement("li");
    completedLi.textContent = taskText;
    
    // Add to completed list
    completedList.appendChild(completedLi);
    
    // Remove from remaining list
    li.remove();
}