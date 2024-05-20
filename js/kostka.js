class Kostka {
  constructor(macAddress, kostkaId, token) {
    this.cube_mac = macAddress;
    this.cube_id = kostkaId;
    this.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6MSwiaWF0IjoxNzE2MTk4NDQ0LCJleHAiOjE3MTYyNDE2NDQsImlzcyI6Im15LWFwaSIsInN1YiI6IjEifQ.rabxeNrUQGzd5TaHgnpiANknJLE7mTaaVNpKCKFmnzg";
  }

  display() {
    return `<div>MAC Address: ${this.cube_mac}, Kostka ID: ${this.cube_id}, Token: ${this.token}</div>`;
  }

  toJSON() {
    return {
      cube_mac: this.cube_mac,
      cube_id: this.cube_id,
      token: this.token
    };
  }
}

class KostkaList {
  constructor() {
    this.kostki = JSON.parse(localStorage.getItem('kostki')) || [];
  }

  saveToLocalStorage() {
    localStorage.setItem('kostki', JSON.stringify(this.kostki));
  }

  addKostka(kostka) {
    this.kostki.push(kostka);
    this.saveToLocalStorage();
  }

  displayKostka(newKostka) {
    const addedKostka = document.getElementById('addedKostka');
    addedKostka.innerHTML = newKostka.display();
  }

  async sendKostkaToServer(kostka) {
    try {
      const response = await fetch('http://localhost:3000/add_cube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(kostka.toJSON())
      });

      if (!response.ok) {
        throw new Error('Failed to add kostka');
      }
      const responseData = await response.json();
      console.log('Response from server:', responseData);
    } catch (error) {
      console.error('Error sending kostka to server:', error.message);
    }
  }
}

window.kostkaList = new KostkaList();

document.addEventListener('DOMContentLoaded', function () {
  const messageDiv = document.getElementById('message');

  kostkaForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const macAddress = document.getElementById('macAddress').value;
    const kostkaId = document.getElementById('kostkaId').value;
    // const token = localStorage.getItem('Token');

    // if (!macAddress || !kostkaId || !token) {
    //   showMessage('Please fill in all fields and make sure you are logged in', 'error');
    //   return;
    // }

    if (!macAddress || !kostkaId) {
      showMessage('Please fill in all fields and make sure you are logged in', 'error');
      return;
    }

    // const newKostka = new Kostka(macAddress, kostkaId, token);
    const newKostka = new Kostka(macAddress, kostkaId);
    kostkaList.addKostka(newKostka);
    kostkaList.displayKostka(newKostka);

    await kostkaList.sendKostkaToServer(newKostka);

    showMessage('Kostka added successfully', 'success');
    kostkaForm.reset();
  });

  function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = type;
  }
});
