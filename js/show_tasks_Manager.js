class TaskManager {
  constructor() {
    this.tasksContainer = document.getElementById('tasks-container');
    this.unassignedTasksContainer = document.getElementById('unassigned-tasks-container');
    this.addTaskBtn = document.getElementById('add-task-btn');
    this.loadMoreAssignedBtn = document.getElementById('load-more-assigned-btn');
    this.loadMoreUnassignedBtn = document.getElementById('load-more-unassigned-btn');
    this.tasks = [];
    this.loadMoreAssignedClicked = false;
    this.loadMoreUnassignedClicked = false;
  }

  addTask(ProjectID, name, cubeID = "", side = 0, time = 0) {
    const task = new Task(ProjectID, cubeID, side, name, time);
    this.tasks.push(task);
  }

  renderTasks() {
    this.tasksContainer.innerHTML = '';
    this.unassignedTasksContainer.innerHTML = '';

    const assignedTasksToShow = this.loadMoreAssignedClicked ? this.tasks.filter(task => task.Side !== -1) : this.tasks.filter(task => task.Side !== -1).slice(0, 6);
    assignedTasksToShow.forEach(task => {
      const taskElement = task.createTaskElement();
      this.tasksContainer.appendChild(taskElement);
    });

    const unassignedTasksToShow = this.loadMoreUnassignedClicked ? this.tasks.filter(task => task.Side === -1) : this.tasks.filter(task => task.Side === -1).slice(0, 6);
    unassignedTasksToShow.forEach(task => {
      const taskElement = task.createTaskElement();
      this.unassignedTasksContainer.appendChild(taskElement);
    });
  }

  async getTheProjects() {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/get_user_projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.code === 101) { // Token invalid code
          await handleExpiredToken();
          throw new Error('Token expired or invalid');
        } else {
          throw new Error('Failed to fetch projects');
        }
      }

      const data = await response.json();

      // Assuming the response data is an array of projects/tasks
      data.forEach(project => {
        const ProjectID = project.ProjectID; // Replace with actual data fields from your API response
        const cubeID = project.Cube_users_ID; // Replace with actual data fields from your API response
        const side = project.Side; // Replace with actual data fields from your API response
        const name = project.Name; // Replace with actual data fields from your API response
        const time = project.Time || 0; // Replace with actual data fields from your API response
        this.addTask(ProjectID, name, cubeID, side, time);
      });

      this.renderTasks();
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }

  generateInitialTasks() {
    this.getTheProjects();
  }

  handleLoadMore() {
    this.loadMoreAssignedBtn.addEventListener('click', () => {
      this.loadMoreAssignedClicked = true;
      this.renderTasks();
    });

    this.loadMoreUnassignedBtn.addEventListener('click', () => {
      this.loadMoreUnassignedClicked = true;
      this.renderTasks();
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
      nameInput.placeholder = 'Name of Task';
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
