const form = document.querySelector("form");    // select the form element 
const input = document.getElementById("add_new_task");  // select input fields 
const dateInput = document.getElementById("date"); 
const remainingList = document.getElementById("remaining-list");    // select the list where new task will go 

// listen for form submit
form.addEventListener("submit", function(e){
    // page doesn't refresh 
    e.preventDefault(); 

    // get values form inputs 
    const taskText = input.value; 
    const taskDate = dateInput.value; 

    // if empty, stop 
    if (taskText === "") return; 

    // create new <li>
    const li = document.createElement("li"); 

    // Add content inside <li>
    li.innerHTML = `
        <span>${taskText}</span>
        <span>${taskDate}</span>
    `

    // Add the new task to the list 
    remainingList.appendChild(li); 

    // clear inputs 
    input.value = ""; 
    dateInput.value = ""; 
}); 