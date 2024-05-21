class Cube {

  constructor(macAddress, cubeId, token) {
    this.cube_mac = macAddress;
    this.cube_id = cubeId;
  }

  display() {
    return `<div>MAC Address: ${this.cube_mac}, Cube ID: ${this.cube_id}, Token: ${this.token}</div>`;
  }

  toJSON() {
    return {
      cube_mac: this.cube_mac, cube_id: this.cube_id, token: token
    };
  }
}

class CubeList {
  constructor() {
    this.cubes = JSON.parse(localStorage.getItem('cubes')) || [];
  }

  saveToLocalStorage() {
    localStorage.setItem('cubes', JSON.stringify(this.cubes));
  }

  addCube(cube) {
    this.cubes.push(cube);
    this.saveToLocalStorage();
  }

  displayCube(newCube) {
    const addedCube = document.getElementById('addedCube');
    addedCube.innerHTML = newCube.display();
  }

  async sendCubeToServer(cube) {
    try {
      const response = await fetch('http://localhost:3000/add_cube', {
        method: 'POST', headers: {
          'Content-Type': 'application/json'
        }, body: JSON.stringify(cube.toJSON())
      });

      if (!response.ok) {
        throw new Error('Failed to add cube');
      }
      const responseData = await response.json();
      console.log('Response from server:', responseData);
    } catch (error) {
      console.error('Error sending cube to server:', error.message);
    }

  }
}

window.cubeList = new CubeList();

document.addEventListener('DOMContentLoaded', function () {
  const messageDiv = document.getElementById('message');
  const cubeForm = document.getElementById('cubeForm');

  cubeForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const macAddress = document.getElementById('macAddress').value;
    const cubeId = document.getElementById('cubeId').value;

    if (!macAddress || !cubeId) {
      showMessage('Please fill in all fields and make sure you are logged in', 'error');
      return;
    }

    const newCube = new Cube(macAddress, cubeId);
    cubeList.addCube(newCube);
    cubeList.displayCube(newCube);

    await cubeList.sendCubeToServer(newCube);

    showMessage('Cube added successfully', 'success');
    cubeForm.reset();
  });

  function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = type;
  }
});
