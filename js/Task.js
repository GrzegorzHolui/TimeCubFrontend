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

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-task-btn');
    taskDiv.appendChild(editBtn);

    editBtn.addEventListener('click', () => {
      this.showEditPanel(taskDiv);
    });

    return taskDiv;
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


    const macSelect = document.createElement('select');
    macSelect.id = 'macSelect';
    macSelect.placeholder = 'cube MAC';


    // Populate options from tab array
    const tab = [];
    // wyciagnij to do funkcji
    try {
      const macAddresses = await getUserCubes();
      console.log('Mac Addresses:', macAddresses);
      tab.push(...macAddresses);

      tab.forEach(mac => {
        const option = document.createElement('option');
        option.value = mac.Mac
        option.textContent = mac.Mac
        macSelect.appendChild(option);
      });

    } catch (error) {
      console.error('Failed to fetch user cubes:', error);
      // Handle error fetching user cubes
    }

    editPanel.appendChild(macSelect);

    const cubeIDInput = document.createElement('input');
    cubeIDInput.type = 'text';
    cubeIDInput.value = ''
    cubeIDInput.placeholder = 'cube id';
    editPanel.appendChild(cubeIDInput);


    const sideInput = document.createElement('input');
    sideInput.type = 'text';
    sideInput.value = this.Side;
    sideInput.placeholder = 'wall of cube';
    editPanel.appendChild(sideInput);

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.classList.add('save-btn');

    saveBtn.addEventListener('click', async () => {
      const newName = nameInput.value;
      const newCubeID = cubeIDInput.value;
      const newSide = sideInput.value;
      this.Name = newName;
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
}
