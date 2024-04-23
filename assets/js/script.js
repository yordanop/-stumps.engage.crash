// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const toDoSection = $('#todo-cards');
const inProgressSection = $('#in-progress-cards');
const doneSection = $('#done-cards');

const cardsStatusLanes = [toDoSection, inProgressSection, doneSection]


// Todo: create a function to generate a unique task id
function generateTaskId() {
    let newTaskID;
    if (taskList){
         newTaskID =  (taskList.length + 1 + 0xFFFFF).toString(16);
    }else{
        newTaskID = (1 + 0xFFFFF).toString(16);
    }
    return newTaskID;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const todayDay = dayjs().format('MM/DD/YY');
    const dueDate = dayjs(task.date).format('MM/DD/YY');
    let taskColor = null;
    let textColor = null;

    if(task.taskStatus !== 'done'){
        if(dueDate < todayDay){
            taskColor = 'bg-danger';
            textColor = 'text-light';
        }else if(dueDate === todayDay){
            taskColor = 'bg-warning';
            textColor = 'text-light';
        }
    }else{
        taskColor = 'bg-body-color';
        textColor = 'text-black';
    }
    

    const taskCard = $(`<div class="card text-center ${taskColor}  ${textColor} task-card" data-taskid="${task.taskID}">
                            <div class="card-header">
                                ${task.title}
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">${task.description}</h5>
                                <p class="card-text card-contrast">${task.date}</p>
                                <button class="btn btn-danger delete-task-btn">Delete</a>
                            </div>
                            </div>`);

    return taskCard
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    for (task_i of taskList){
        if(task_i.taskStatus === 'to-do'){
            toDoSection.append(createTaskCard(task_i));
        }else if(task_i.taskStatus === 'in-progress'){
            inProgressSection.append(createTaskCard(task_i));
        }else{
            doneSection.append(createTaskCard(task_i));
        }
    }
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    const taskTitleInput = $('#recipient-title');
    const taskDateInput = $('#date-task');
    const taskDescriptionInput = $('#message-text');

    const toDoSection = $('#todo-cards');

    task = {taskID: generateTaskId(),
            title: taskTitleInput.val(),
            date: taskDateInput.val(),
            description: taskDescriptionInput.val(),
            taskStatus:'to-do'}
    if(taskList){
        taskList.push(task);
    }else{
        taskList = [task];
    }
    
    localStorage.setItem('tasks', JSON.stringify(taskList));
    
    $('#formModal').modal('toggle');

    const createdTask = createTaskCard(task);
    
    toDoSection.append(createdTask);

    $(function () {
        createdTask.draggable({ revert: "valid" });

      });
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskToRemove = $(event.target).parent().parent();
    const taskDataId = taskToRemove.data('taskid');
    const indexTask = getIndexTask(taskDataId);
    
    taskToRemove.remove();
    taskList.splice(indexTask, 1);
    localStorage.setItem('tasks', JSON.stringify(taskList));
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    console.log(ui);
    const droppedCard = $(ui.draggable[0]);
    const taskData = taskList[getIndexTask(droppedCard.attr('data-taskid'))];
    const taskCardStatus = taskData.taskStatus;
    const newLaneStatus = $(event.target).attr('id');

    const todayDay = dayjs().format('MM/DD/YY');
    const dueDate = dayjs(taskData.date).format('MM/DD/YY');

    let cardclassList = droppedCard.attr('class').split(" ");
    const bgClassIndex = cardclassList.findIndex(taskIndex => taskIndex.includes('bg-'));
    let textClassIndex = cardclassList.findIndex(taskIndex => taskIndex.includes('text-b'));
    if (textClassIndex === -1){
        textClassIndex = cardclassList.findIndex(taskIndex => taskIndex.includes('text-l'));
    }
    const actualColor = cardclassList[bgClassIndex];

    if(taskCardStatus !== newLaneStatus){
        $( this )
            .children().eq(1).children().append(droppedCard);
        taskData.taskStatus = newLaneStatus;
        localStorage.setItem('tasks', JSON.stringify(taskList));

        if((newLaneStatus === 'done')){
            droppedCard.removeClass(actualColor).addClass( "bg-body-color" );
            droppedCard.removeClass('text-light').addClass( "text-black" );
        }else{

            if(dueDate < todayDay){
                taskColor = 'bg-danger';
                textColor = 'text-light'
            }else if(dueDate === todayDay){
                taskColor = 'bg-warning';
                textColor = 'text-light'
            }else {
                taskColor = 'bg-body-color'
                textColor = 'text-black'
            }
            droppedCard.removeClass(actualColor).addClass(taskColor);
            droppedCard.removeClass('text-black').addClass(textColor);
        }
    }
    

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    const addTaskButton = $('#addTask');

    if (taskList){
        renderTaskList();
        for(let i = 0; i < cardsStatusLanes.length; i++){
            cardsStatusLanes[i].on('click', '.delete-task-btn', handleDeleteTask);
        }
    }

    $(function () {
        $('#date-task').datepicker({
          changeMonth: true,
          changeYear: true,
        });
      });

      $(function () {
        $('.task-card').draggable({ 
            revert: "valid",
            containment: $('.container') });

     
        $('.lane').droppable({
            accept: ".task-card",
            drop:handleDrop});

        $('.lane').sortable();

      });

    addTaskButton.on('click', handleAddTask);

});

function getIndexTask(taskID){
    return taskList.findIndex(taskIndex => taskIndex.taskID === taskID.toString());
}

