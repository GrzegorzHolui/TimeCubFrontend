class Task {

  constructor(UserID, CubeID, Side, Name, Time = 0) {
    this.UserID = UserID;
    this.CubeID = CubeID;
    this.Side = Side;
    this.Name = Name;
    this.Time = Time;
  }

  createTaskElement() {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');

    const nameElement = document.createElement('h3');
    nameElement.textContent = this.Name;
    taskDiv.appendChild(nameElement);

    const userIDElement = document.createElement('p');
    userIDElement.textContent = `UserID: ${this.UserID}`;
    taskDiv.appendChild(userIDElement);

    const cubeIDElement = document.createElement('p');
    cubeIDElement.textContent = `CubeID: ${this.CubeID}`;
    taskDiv.appendChild(cubeIDElement);

    const sideElement = document.createElement('p');
    sideElement.textContent = `Side: ${this.Side}`;
    taskDiv.appendChild(sideElement);

    const timeElement = document.createElement('p');
    timeElement.textContent = `Time: ${this.Time}`;
    taskDiv.appendChild(timeElement);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-task-btn');
    taskDiv.appendChild(editBtn);

    editBtn.addEventListener('click', () => {
      this.showEditPanel(taskDiv);
    });

    return taskDiv;
  }

  showEditPanel(taskDiv) {
    let overlay = document.querySelector('.overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.classList.add('overlay');
      document.body.appendChild(overlay);
    }

    const editPanel = document.createElement('div');
    editPanel.classList.add('edit-panel');

    const userIDInput = document.createElement('input');
    userIDInput.type = 'text';
    userIDInput.value = this.UserID;
    editPanel.appendChild(userIDInput);

    const cubeIDInput = document.createElement('input');
    cubeIDInput.type = 'text';
    cubeIDInput.value = this.CubeID;
    editPanel.appendChild(cubeIDInput);

    const sideInput = document.createElement('input');
    sideInput.type = 'text';
    sideInput.value = this.Side;
    editPanel.appendChild(sideInput);

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = this.Name;
    editPanel.appendChild(nameInput);

    const timeInput = document.createElement('input');
    timeInput.type = 'number';
    timeInput.value = this.Time;
    editPanel.appendChild(timeInput);

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.classList.add('save-btn');
    saveBtn.addEventListener('click', () => {
      this.UserID = userIDInput.value;
      this.CubeID = cubeIDInput.value;
      this.Side = sideInput.value;
      this.Name = nameInput.value;
      this.Time = parseInt(timeInput.value, 10);
      this.updateTask(taskDiv);
      document.body.removeChild(editPanel);
      overlay.style.display = 'none';
    });
    editPanel.appendChild(saveBtn);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Cancel';
    closeBtn.classList.add('close-btn');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(editPanel);
      overlay.style.display = 'none';
    });
    editPanel.appendChild(closeBtn);

    overlay.style.display = 'block';
    document.body.appendChild(editPanel);
  }

  updateTask(taskDiv) {
    const nameElement = taskDiv.querySelector('h3');
    const userIDElement = taskDiv.querySelectorAll('p')[0];
    const cubeIDElement = taskDiv.querySelectorAll('p')[1];
    const sideElement = taskDiv.querySelectorAll('p')[2];
    const timeElement = taskDiv.querySelectorAll('p')[3];
    nameElement.textContent = this.Name;
    userIDElement.textContent = `UserID: ${this.UserID}`;
    cubeIDElement.textContent = `CubeID: ${this.CubeID}`;
    sideElement.textContent = `Side: ${this.Side}`;
    timeElement.textContent = `Time: ${this.Time}`;
  }
}

class TaskManager {
  constructor() {
    this.tasksContainer = document.getElementById('tasks-container');
    this.loadMoreBtn = document.getElementById('load-more-btn');
    this.tasks = [];
  }

  addTask(userID, cubeID, side, name, time) {
    const task = new Task(userID, cubeID, side, name, time);
    this.tasks.push(task);
  }

  renderTasks() {
    this.tasksContainer.innerHTML = '';
    const tasksToShow = this.tasks.slice(0, 6); // Limit to first 6 tasks

    tasksToShow.forEach(task => {
      const taskElement = task.createTaskElement();
      this.tasksContainer.appendChild(taskElement);
    });
  }


  generateInitialTasks() {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6MSwiaWF0IjoxNzE2MTk4NDQ0LCJleHAiOjE3MTYyNDE2NDQsImlzcyI6Im15LWFwaSIsInN1YiI6IjEifQ.rabxeNrUQGzd5TaHgnpiANknJLE7mTaaVNpKCKFmnzg";

    fetch('http://localhost:3000/get_user_projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({token})
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        return response.json();
        ; // This returns a promise that resolves with the JSON body
      })
      .then(data => {
        // Assuming the response data is an array of projects/tasks
        data.forEach(project => {
          const userID = project.UserID; // Replace with actual data fields from your API response
          const cubeID = project.CubeID; // Replace with actual data fields from your API response
          const side = project.Side; // Replace with actual data fields from your API response
          const name = project.Name; // Replace with actual data fields from your API response
          const time = project.Time || 0; // Replace with actual data fields from your API response
          console.log(userID)
          console.log(cubeID)
          console.log(side)
          console.log(name)
          console.log(time)
          this.addTask(userID, cubeID, side, name, time);
        });

        this.renderTasks();
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
        // Handle error if needed
      });
  }


  // handleLoadMore() {
  //   this.loadMoreBtn.addEventListener('click', () => {
  //     window.scrollTo({
  //       top: document.body.scrollHeight, behavior: 'smooth'
  //     });
  //   });
  // }

  handleLoadMore() {
    this.loadMoreBtn.addEventListener('click', () => {
      const currentTasksCount = this.tasksContainer.children.length;
      const nextTasks = this.tasks.slice(currentTasksCount, currentTasksCount + 6);

      nextTasks.forEach(task => {
        const taskElement = task.createTaskElement();
        this.tasksContainer.appendChild(taskElement);
      });

      // Smooth scroll to the newly added tasks
      const lastTaskElement = this.tasksContainer.lastElementChild;
      if (lastTaskElement) {
        lastTaskElement.scrollIntoView({behavior: 'smooth', block: 'end'});
      }
    });
  }


  createForm() {
    const form = document.createElement('form');
    form.id = 'taskForm';

    const userIDDiv = this.createFormGroup('UserID:', 'userID', 'text');
    const cubeIDDiv = this.createFormGroup('CubeID:', 'cubeID', 'text');
    const sideDiv = this.createFormGroup('Side:', 'side', 'text');
    const nameDiv = this.createFormGroup('Name:', 'name', 'text');
    const timeDiv = this.createFormGroup('Time:', 'time', 'number', '0');

    form.appendChild(userIDDiv);
    form.appendChild(cubeIDDiv);
    form.appendChild(sideDiv);
    form.appendChild(nameDiv);
    form.appendChild(timeDiv);

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Add Task';
    form.appendChild(submitBtn);

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const userID = document.getElementById('userID').value;
      const cubeID = document.getElementById('cubeID').value;
      const side = document.getElementById('side').value;
      const name = document.getElementById('name').value;
      const time = document.getElementById('time').value;

      this.addTask(userID, cubeID, side, name, time);
      this.renderTasks();
      form.reset();
    });

    return form;
  }

  createFormGroup(labelText, inputID, inputType, defaultValue = '') {
    const div = document.createElement('div');
    div.classList.add('form-group');

    const label = document.createElement('label');
    label.setAttribute('for', inputID);
    label.textContent = labelText;
    div.appendChild(label);

    const input = document.createElement('input');
    input.type = inputType;
    input.id = inputID;
    input.name = inputID;
    input.value = defaultValue;
    div.appendChild(input);

    return div;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const taskManager = new TaskManager();
  const tasksContainer = document.getElementById('tasks-container');

  const form = taskManager.createForm();
  tasksContainer.appendChild(form);

  taskManager.generateInitialTasks();
  taskManager.handleLoadMore();
});
