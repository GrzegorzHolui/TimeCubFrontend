class Task {
  constructor(title, description) {
    this.title = title;
    this.description = description;
  }

  createTaskElement() {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');

    const titleElement = document.createElement('h3');
    titleElement.textContent = this.title;
    taskDiv.appendChild(titleElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = this.description;
    taskDiv.appendChild(descriptionElement);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edytuj';
    editBtn.classList.add('edit-task-btn');
    taskDiv.appendChild(editBtn);

    editBtn.addEventListener('click', () => {
      this.showEditPanel(taskDiv);
    });

    return taskDiv;
  }

  showEditPanel(taskDiv) {
    // Sprawdź, czy overlay istnieje w dokumencie
    let overlay = document.querySelector('.overlay');
    if (!overlay) {
      // Jeśli overlay nie istnieje, utwórz nowy i dodaj do dokumentu
      overlay = document.createElement('div');
      overlay.classList.add('overlay');
      document.body.appendChild(overlay);
    }

    // Utwórz panel edycji
    const editPanel = document.createElement('div');
    editPanel.classList.add('edit-panel');

    // Pole formularza do edycji tytułu
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = this.title;
    editPanel.appendChild(titleInput);

    // Pole formularza do edycji opisu
    const descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';
    descriptionInput.value = this.description;
    editPanel.appendChild(descriptionInput);

    // Przycisk zatwierdzający edycję
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Zapisz';
    saveBtn.classList.add('save-btn');
    saveBtn.addEventListener('click', () => {
      this.title = titleInput.value;
      this.description = descriptionInput.value;
      this.updateTask(taskDiv);
      document.body.removeChild(editPanel); // Usunięcie panelu edycji po zapisaniu zmian
      overlay.style.display = 'none'; // Ukrycie overlay po zapisaniu zmian
    });
    editPanel.appendChild(saveBtn);

    // Przycisk zamykania panelu
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Anuluj';
    closeBtn.classList.add('close-btn');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(editPanel); // Usunięcie panelu edycji po anulowaniu
      overlay.style.display = 'none'; // Ukrycie overlay po anulowaniu
    });
    editPanel.appendChild(closeBtn);

    // Wyświetlenie panelu edycji
    overlay.style.display = 'block'; // Wyświetlenie overlay
    document.body.appendChild(editPanel); // Dodanie panelu edycji do body
  }



  updateTask(taskDiv) {
    // Aktualizacja tytułu i opisu w elemencie zadania
    const titleElement = taskDiv.querySelector('h3');
    const descriptionElement = taskDiv.querySelector('p');
    titleElement.textContent = this.title;
    descriptionElement.textContent = this.description;
  }
}

class TaskManager {
  constructor() {
    this.tasksContainer = document.getElementById('tasks-container');
    this.loadMoreBtn = document.getElementById('load-more-btn');
    this.taskCount = 5;
    this.tasks = [];
  }

  addTask(title, description) {
    const task = new Task(title, description);
    this.tasks.push(task);
  }

  renderTasks() {
    this.tasksContainer.innerHTML = '';
    this.tasks.forEach(task => {
      const taskElement = task.createTaskElement();
      this.tasksContainer.appendChild(taskElement);
    });
  }

  generateInitialTasks() {
    for (let i = 1; i <= this.taskCount; i++) {
      const title = 'Task ' + i;
      const description = 'Description for Task ' + i;
      this.addTask(title, description);
    }
    this.renderTasks();
  }

  handleLoadMore() {
    this.loadMoreBtn.addEventListener('click', () => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const taskManager = new TaskManager();
  taskManager.generateInitialTasks();
  taskManager.handleLoadMore();
});

