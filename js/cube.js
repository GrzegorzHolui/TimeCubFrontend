const token = localStorage.getItem('token');

class Cube {
  constructor(macAddress, cubeId) {
    this.cube_mac = macAddress;
    this.cube_id = cubeId;
  }

  display() {
    return `<div>MAC Address: ${this.cube_mac}, Kostka ID: ${this.cube_id}, Token: ${token}</div>`;
  }

  toJSON() {
    return {
      cube_mac: this.cube_mac, cube_id: this.cube_id, token: token
    };
  }
}

class CubeList {
  constructor() {
    this.cubes = JSON.parse(localStorage.getItem('kostki')) || [];
  }

  saveToLocalStorage() {
    localStorage.setItem('kostki', JSON.stringify(this.cubes));
  }

  addCube(cube) {
    this.cubes.push(cube);
    this.saveToLocalStorage();
  }

  displayCube(newKostka) {
    const addedCube = document.getElementById('addedCube');
    addedCube.innerHTML = newKostka.display();
  }

  async sendCubeToServer(Cube) {
    try {
      const response = await fetch('http://localhost:3000/add_cube', {
        method: 'POST', headers: {
          'Content-Type': 'application/json'
        }, body: JSON.stringify(Cube.toJSON())
      });

      if (!response.ok) {
        throw new Error('Failed to add Cube');
      }
      const responseData = await response.json();
      console.log('Response from server:', responseData);
    } catch (error) {
      console.error('Error sending Cube to server:', error.message);
    }
  }

//   exp.post('/remove_cube', (req, res) => { // podajesz token, mac kostki i id kostki - usuwasz kostkę
//   DB.remove_cube(app.get_id_from_token(req.body.token), req.body.cube_mac, req.body.cube_id).then((result) => {
//   res.send(result);
// });
// });


async removeCubeFromServer(Cube) {
    try {
      const response = await fetch('http://localhost:3000/remove_cube', {
        method: 'POST', headers: {
          'Content-Type': 'application/json'
        }, body: JSON.stringify(Cube.toJSON())
      });

      if (!response.ok) {
        throw new Error('Failed to add Cube');
      }
      const responseData = await response.json();
      console.log('Response from server:', responseData);
    } catch (error) {
      console.error('Error sending Cube to server:', error.message);
    }
  }

}

window.cubeList = new CubeList();

document.addEventListener('DOMContentLoaded', function () {
  const messageDiv = document.getElementById('message');
  const cubeForm = document.getElementById('CubeForm');
  const btnAddCube = document.getElementById('Add-Cube');
  const btnRemoveCube = document.getElementById('Remove-Cube');

  btnAddCube.addEventListener('click', async function (event) {
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


  btnRemoveCube.addEventListener('click', async function (event) {
    event.preventDefault();

    const macAddress = document.getElementById('macAddress').value;
    const cubeId = document.getElementById('cubeId').value;

    if (!macAddress || !cubeId) {
      showMessage('Please fill in all fields and make sure you are logged in', 'error');
      return;
    }
    const newCube = new Cube(macAddress, cubeId);
    cubeList.displayCube(newCube);

    await cubeList.removeCubeFromServer(newCube);

    showMessage('Cube added successfully', 'success');
    cubeForm.reset();
  });


  function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = type;
  }
});
