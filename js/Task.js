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
    sideElement.textContent = `Wall: ${this.Side}`;
    taskDiv.appendChild(sideElement);

    const timeElement = document.createElement('p');
    timeElement.textContent = `Time: ${this.Time}`;
    taskDiv.appendChild(timeElement);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-task-btn');
    buttonContainer.appendChild(editBtn);

    const showHistoryBtn = document.createElement('button');
    showHistoryBtn.textContent = 'History';
    showHistoryBtn.classList.add('show-history-btn');
    buttonContainer.appendChild(showHistoryBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-task-btn');
    buttonContainer.appendChild(deleteBtn);

    taskDiv.appendChild(buttonContainer);

    editBtn.addEventListener('click', () => {
      this.showEditPanel(taskDiv);
    });

    showHistoryBtn.addEventListener('click', () => {
      this.showHistory(this.ProjectID);
    });

    deleteBtn.addEventListener('click', async () => {
      const modalOverlay = document.createElement('div');
      modalOverlay.classList.add('modal-overlay');

      const modal = document.createElement('div');
      modal.classList.add('modal');

      const modalMessage = document.createElement('p');
      modalMessage.textContent = 'Are you sure you want to delete this project?';

      const confirmBtn = document.createElement('button');
      confirmBtn.textContent = 'Yes';
      confirmBtn.classList.add('confirm-btn');

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'No';
      cancelBtn.classList.add('cancel-btn');

      modal.appendChild(modalMessage);
      modal.appendChild(confirmBtn);
      modal.appendChild(cancelBtn);
      modalOverlay.appendChild(modal);
      document.body.appendChild(modalOverlay);

      confirmBtn.addEventListener('click', async () => {
        await this.deleteTask(taskDiv);
        document.body.removeChild(modalOverlay);
      });

      cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modalOverlay);
      });
    });

    return taskDiv;
  }

  async showHistory(project_id) {
    const url = "http://localhost:3000/get_events";
    const data = { token: token, project_id: project_id };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }

      const historyData = await response.json();
      console.log('History Data:', historyData);

      let historyDiv = document.querySelector('.history');
      if (!historyDiv) {
        historyDiv = document.createElement('div');
        historyDiv.classList.add('history');
        document.body.appendChild(historyDiv);
      }

      historyDiv.innerHTML = '';

      historyData.forEach(event => {
        const eventElement = document.createElement('p');
        eventElement.textContent = `EventID: ${event.EventID}, Name: ${event.Name}, Time: ${event.Time}`;
        historyDiv.appendChild(eventElement);
      });

      historyDiv.style.display = 'block';

    } catch (error) {
      console.error('Error fetching history:', error);
    }
  }

  async showEditPanel(taskDiv) {
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
    nameInput.placeholder = 'name of Task';
    editPanel.appendChild(nameInput);

    const cubeIdSelect = document.createElement('select');
    cubeIdSelect.id = 'cubeIdSelect';
    cubeIdSelect.placeholder = 'cube ID';

    const macSelect = document.createElement('select');
    macSelect.id = 'macSelect';
    macSelect.placeholder = 'MAC Address';

    const cubeIdToMacMap = {};

    async function populateCubeIdSelect() {
      try {
        const userCubes = await getUserCubes();
        console.log('User Cubes:', userCubes);

        const uniqueCubeIds = new Set();

        userCubes.forEach(cube => {
          uniqueCubeIds.add(cube.Cube_users_ID);
          cubeIdToMacMap[cube.Cube_users_ID] = cubeIdToMacMap[cube.Cube_users_ID] || [];
          cubeIdToMacMap[cube.Cube_users_ID].push(cube.Mac);
        });

        cubeIdSelect.innerHTML = '';

        uniqueCubeIds.forEach(cubeId => {
          const option = document.createElement('option');
          option.value = cubeId;
          option.textContent = cubeId;
          cubeIdSelect.appendChild(option);
        });
        populateMacSelect(cubeIdSelect.value);

      } catch (error) {
        console.error('Failed to fetch user cubes:', error);
      }
    }

    function populateMacSelect(cubeId) {
      macSelect.innerHTML = '';

      const macs = cubeIdToMacMap[cubeId] || [];

      macs.forEach(mac => {
        const option = document.createElement('option');
        option.value = mac;
        option.textContent = mac;
        macSelect.appendChild(option);
      });
    }

    populateCubeIdSelect();

    editPanel.appendChild(cubeIdSelect);
    editPanel.appendChild(macSelect);

    cubeIdSelect.addEventListener('change', function () {
      const selectedCubeId = cubeIdSelect.value;
      populateMacSelect(selectedCubeId);
    });

    const sideInput = document.createElement('input');
    sideInput.type = 'text';
    sideInput.value = this.Side;
    sideInput.placeholder = 'wall of cube';
    editPanel.appendChild(sideInput);

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.classList.add('save-btn');

    saveBtn.addEventListener('click', async () => {
      const newCubeID = cubeIdSelect.value;
      const newSide = sideInput.value;
      this.CubeID = newCubeID;
      this.Side = newSide;
      this.updateTask(taskDiv);

      await setProjectActive(this.ProjectID, this.CubeID, macSelect.value, this.Side);

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
    const cubeIDElement = taskDiv.querySelectorAll('p')[1];
    const sideElement = taskDiv.querySelectorAll('p')[2];
    nameElement.textContent = this.Name;
    cubeIDElement.textContent = `CubeID: ${this.CubeID}`;
    sideElement.textContent = `Side: ${this.Side}`;
  }

  async deleteTask(taskDiv) {
    taskDiv.remove();
    await removeProject(this.ProjectID);
  }
}
