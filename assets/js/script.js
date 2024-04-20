// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let newTaskID;
    if (taskList){
         newTaskID =  (taskList.id + 1 + 0xFFFFF).toString(16);
    }else{
        newTaskID = (1 + 0xFFFFF).toString(16);
    }
    return newTaskID;
}

// Todo: create a function to create a task card
function createTaskCard(task) {

    const taskCard = $(`<div class="card text-center">
                            <div class="card-header">
                                ${task.title}
                            </div>
                                <div class="card-body">
                                    <h5 class="card-title">${task.description}</h5>
                                    <p class="card-text">${task.date}</p>
                                    <button class="btn btn-primary">Delete</a>
                                </div>
                            </div>`);

    return taskCard
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
   
});
