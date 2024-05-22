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
          this.addTask(ProjectID, name, cubeID, side, 50);
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

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('name').value;

      this.addTask(name);
      this.renderTasks();
      form.reset();
    });

    return form;
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
