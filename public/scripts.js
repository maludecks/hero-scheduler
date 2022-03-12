const apiBaseUrl = 'http://localhost:3000';
const heroesSection = document.querySelector('#heroes');
const pickButton = document.querySelector('#pick-btn');
const notifyButton = document.querySelector('#notify-btn');

window.addEventListener('load', async () => {
  fetch(`${apiBaseUrl}/heroes/current`)
    .then(response => response.json())
    .then(parsedResponse => {
      heroesSection.innerHTML = parsedResponse.heroes.join(' and ') + '🦸';
    });
});

pickButton.addEventListener('click', async () => {
  heroesSection.innerHTML = '...';

  fetch(`${apiBaseUrl}/heroes/pick`)
    .then(response => response.json())
    .then(parsedResponse => {
      heroesSection.innerHTML = parsedResponse.heroes.join(' and ') + '🦸';
    });
});

notifyButton.addEventListener('click', async () => {
  notifyButton.disabled = true;

  fetch(`${apiBaseUrl}/heroes/notify`)
    .then(response => response.text())
    .then(() => {
      notifyButton.disabled = false;
    });
});
