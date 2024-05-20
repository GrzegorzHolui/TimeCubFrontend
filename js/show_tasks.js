const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6MSwiaWF0IjoxNzE2MTk4NDQ0LCJleHAiOjE3MTYyNDE2NDQsImlzcyI6Im15LWFwaSIsInN1YiI6IjEifQ.rabxeNrUQGzd5TaHgnpiANknJLE7mTaaVNpKCKFmnzg";

async function saveTaskToServer(taskName) {
  const url = "http://localhost:3000/add_project";
  const data = {
    token: token, name: taskName
  };

  try {
    const response = await fetch(url, {
      method: 'POST', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to add project');
    }

    const responseData = await response.json();
    return {projectId: responseData.ProjectID}; // Assuming the response contains ProjectID
  } catch (error) {
    console.error('Error adding project:', error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
}

async function getUserCubes() {
  const url = "http://localhost:3000/get_user_cubes";
  const data = {
    token: token
  };

  try {
    const response = await fetch(url, {
      method: 'POST', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user cubes');
    }

    const userCubes = await response.json();

    // Mapowanie do tablicy Mac
    const macAddresses = userCubes.map(cube => cube.Mac);

    return macAddresses;

  } catch (error) {
    console.error('Error fetching user cubes:', error);
    throw error; // Ponowne rzucenie błędu dla obsługi przez wywołującego
  }
}


// function setProjectActive(projectId, cubeId, cubeMac, side) {
//   const url = "http://localhost:3000/set_project_active";
//   const data = {
//     token: token, project_id: projectId, cube_id: cubeId, cube_mac: cubeMac, side: side
//   };
//
//   return fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Failed to add project');
//       }
//       return response.json(); // Parse response as JSON
//     })
//     .then(json => {
//       const projectId = json.ProjectID; // Extract ProjectID from the parsed JSON
//       console.log('Project added successfully, ProjectID:', projectId);
//       return projectId; // Return the ProjectID
//     })
//     .catch(error => {
//       console.error('Error adding project:', error);
//       throw error; // Re-throw the error so it can be handled by the caller
//     });
// }


class Task {

  constructor(ProjectID, CubeID, Side, Name, Time = 0) {
    this.ProjectID = ProjectID;
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

    const projectIDElement = document.createElement('p');
    projectIDElement.textContent = `ProjectID: ${this.ProjectID}`;
    taskDiv.appendChild(projectIDElement);

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

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = this.Name;
    nameInput.placeholder = 'name of Task'
    editPanel.appendChild(nameInput);

    const cubeIDInput = document.createElement('input');
    cubeIDInput.type = 'text';
    cubeIDInput.value = this.CubeID;
    cubeIDInput.placeholder = 'cube id'
    editPanel.appendChild(cubeIDInput);

    const macCube = document.createElement('input');
    macCube.type = 'text';
    macCube.value = "";
    macCube.placeholder = 'cube MAC'
    editPanel.appendChild(macCube);

    const sideInput = document.createElement('input');
    sideInput.type = 'text';
    sideInput.value = this.Side;
    sideInput.placeholder = 'wall of cube'
    editPanel.appendChild(sideInput);

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.classList.add('save-btn');

    saveBtn.addEventListener('click', async () => {
      // this.Name = nameInput.value;
      // this.CubeID = cubeIDInput.value;
      // this.Side = sideInput.value;
      // this.updateTask(taskDiv);
      // document.body.removeChild(editPanel);
      // overlay.style.display = 'none';

      let macTabel = []
      getUserCubes()
        .then(macAddresses => {
          console.log('Mac Addresses:', macAddresses);
          macTabel.push(macAddresses)
          // Tutaj możesz dalej przetwarzać adresy MAC
        })
        .catch(error => {
          console.error('Failed to fetch user cubes:', error);
          // Obsługa błędu pobierania danych użytkownika
        });

      console.log(macTabel)


// !!!!!!!!!!!!!!!!!!!!!!!!!! tutaj funkcja settaaaaaaaaaaaaa !!!!!!!!


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
    const cubeIDElement = taskDiv.querySelectorAll('p')[1];
    const sideElement = taskDiv.querySelectorAll('p')[2];
    nameElement.textContent = this.Name;
    cubeIDElement.textContent = `CubeID: ${this.CubeID}`;
    sideElement.textContent = `Side: ${this.Side}`;
  }
}

class TaskManager {
  constructor() {
    this.tasksContainer = document.getElementById('tasks-container');
    this.loadMoreBtn = document.getElementById('load-more-btn');
    this.addTaskBtn = document.getElementById('add-task-btn'); // New button reference
    this.tasks = []
    this.loadMoreClicked = false;
  }

  addTask(ProjectID, name, cubeID = "", side = 0, time = 0) {
    const task = new Task(ProjectID, cubeID, side, name, time);
    this.tasks.push(task);
  }

  renderTasks() {
    this.tasksContainer.innerHTML = '';
    const tasksToShow = this.loadMoreClicked ? this.tasks : this.tasks.slice(0, 6);

    tasksToShow.forEach(task => {
      const taskElement = task.createTaskElement();
      this.tasksContainer.appendChild(taskElement);
    });
  }

  getTheProjects() {
    fetch('http://localhost:3000/get_user_projects', {
      method: 'POST', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify({token})
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        return response.json();
        // This returns a promise that resolves with the JSON body
      })
      .then(data => {
        // Assuming the response data is an array of projects/tasks
        data.forEach(project => {
          const ProjectID = project.ProjectID; // Replace with actual data fields from your API response
          const cubeID = project.CubeID; // Replace with actual data fields from your API response
          const side = project.Side; // Replace with actual data fields from your API response
          const name = project.Name; // Replace with actual data fields from your API response
          const time = project.Time || 0; // Replace with actual data fields from your API response
          console.log(ProjectID)
          console.log(cubeID)
          console.log(side)
          console.log(name)
          console.log(time)
          this.addTask(ProjectID, name, cubeID, side, time);
        });
        this.renderTasks();
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  }

  generateInitialTasks() {
    this.getTheProjects();
  }

  handleLoadMore() {
    this.loadMoreBtn.addEventListener('click', () => {
      this.loadMoreClicked = true;
      const currentTasksCount = this.tasksContainer.children.length;
      const nextTasks = this.tasks.slice(currentTasksCount, currentTasksCount + 6);

      nextTasks.forEach(task => {
        const taskElement = task.createTaskElement();
        this.tasksContainer.appendChild(taskElement);
      });

      const lastTaskElement = this.tasksContainer.lastElementChild;
      if (lastTaskElement) {
        lastTaskElement.scrollIntoView({behavior: 'smooth', block: 'end'});
      }
    });
  }


  createForm() {
    const form = document.createElement('form');
    form.id = 'taskForm';
    const nameDiv = this.createFormGroup('Name:', 'name', 'text');
    form.appendChild(nameDiv);

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Add Task';
    form.appendChild(submitBtn);

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('name').value;

      this.addTask(name);
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

  handleAddTask() {
    this.addTaskBtn.addEventListener('click', () => {
      let overlay = document.querySelector('.overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.classList.add('overlay');
        document.body.appendChild(overlay);
      }

      const editPanel = document.createElement('div');
      editPanel.classList.add('edit-panel');

      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.placeholder = 'name of Task';
      editPanel.appendChild(nameInput);

      const saveBtn = document.createElement('button');
      saveBtn.textContent = 'Save';
      saveBtn.classList.add('save-btn');

      saveBtn.addEventListener('click', async () => {
        const name = nameInput.value; // Assuming nameInput is the input element where user enters task name
        let projectId = "";

        try {
          const response = await saveTaskToServer(name);
          projectId = response.projectId;

          // Log the new project ID
          console.log('New project ID:', projectId);
        } catch (error) {
          console.error('Failed to save task to server:', error);
        }

        this.addTask(projectId, name);

        this.renderTasks();

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
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const taskManager = new TaskManager();
  const tasksContainer = document.getElementById('tasks-container');

  const form = taskManager.createForm();
  tasksContainer.appendChild(form);

  taskManager.generateInitialTasks();
  taskManager.handleLoadMore();
  taskManager.handleAddTask();
});
