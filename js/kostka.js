

class Kostka {
  constructor(macAddress, kostkaId, userId) {
    this.macAddress = macAddress;
    this.kostkaId = kostkaId;
    this.userId = userId;
  }

  display() {
    return `<div>MAC Address: ${this.macAddress}, Kostka ID: ${this.kostkaId}, User ID: ${this.userId}</div>`;
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
}

// Pobieranie istniejącej instancji KostkaList z localStorage lub tworzenie nowej
window.kostkaList = new KostkaList();

// Jeśli chcesz usunąć kostki z localStorage (np. po wylogowaniu), możesz użyć poniższego kodu:
// localStorage.removeItem('kostki');


document.addEventListener('DOMContentLoaded', function () {
  const kostkaForm = document.getElementById('kostkaForm');
  const messageDiv = document.getElementById('message');
  kostkaForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const macAddress = document.getElementById('macAddress').value;
    const kostkaId = document.getElementById('kostkaId').value;
    const userId = document.getElementById('userId').value;

    if (!macAddress || !kostkaId || !userId) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    const newKostka = new Kostka(macAddress, kostkaId, userId);
    kostkaList.addKostka(newKostka);
    kostkaList.displayKostka(newKostka);

    console.log(window.kostkaList)

    showMessage('Kostka added successfully', 'success');
    kostkaForm.reset();
  });

  function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = type;
  }
});


document.addEventListener('DOMContentLoaded', function () {
  console.log(window.kostkaList);
});
