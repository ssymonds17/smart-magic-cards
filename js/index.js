const cardsWrapper = document.querySelector('.cards-wrapper');
const btnWrapper = document.querySelector('.btn-wrapper'); /* eslint-disable-line */
const selectedCardsWrapper = document.querySelector('.selected-cards'); /* eslint-disable-line */
const cards = [];
const suits = ['hearts', 'clubs', 'diamonds', 'spades'];

function createCards() {

  // Create an array with objects containing the value and the suit of each card
  suits.forEach((suit) => {
    for (let i = 1; i <= 13; i += 1) {
      cardObject = {
        value: i,
        suit,
      };
      cards.push(cardObject);
    };
  });


  // For each dataObject, create a new card and append it to the DOM
  cards.forEach((card, i) => {
    const positionFromLeft = i * 33;
    const cardElement = document.createElement('div');
    cardElement.setAttribute('data-value', card.value);
    cardElement.setAttribute('id', `${card.suit}-${card.value}`);
    cardElement.setAttribute('draggable', 'true');
    cardElement.setAttribute('ondragstart', 'onDragStart(event);');
    cardElement.classList.add('card', `${card.suit}-${card.value}`);
    cardElement.style.left = `${positionFromLeft}px`;
    cardsWrapper.append(cardElement);
  });
}

// Function to clear out the initial button and create new buttons to play the game.
function createButtons() {
  document.getElementById('start-game').style.display = 'none';
  document.getElementById('shuffle').style.display = 'block';
  document.getElementById('show-hide').style.display = 'block';
}

// Function to start the game by clearing the wrapper, creating
// and appending the buttons and all the cards to the DOM
function startGame() {
  createCards();
  createButtons();
}

function shuffleCards() {

  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  };

  document.getElementById('cards-wrapper').innerHTML = "";

  // For each dataObject, create a new card and append it to the DOM
  cards.forEach((card, i) => {
    const positionFromLeft = i * 33;
    const cardElement = document.createElement('div');
    cardElement.setAttribute('data-value', card.value);
    cardElement.setAttribute('id', `${card.suit}-${card.value}`);
    cardElement.setAttribute('draggable', 'true');
    cardElement.setAttribute('ondragstart', 'onDragStart(event);');
    cardElement.classList.add('card', `${card.suit}-${card.value}`);
    cardElement.style.left = `${positionFromLeft}px`;
    cardsWrapper.append(cardElement);
  });
}

function hideCardsToggle() {
  const cardWrapper = document.getElementById('cards-wrapper');
  cardWrapper.classList.toggle('hidden');
}

// Dragging functions -------------------------------------
function onDragStart(event) {
  event
    .dataTransfer
    .setData('text/plain', event.target.id);
}

function onDragOver(event) {
  event.preventDefault();
}

function onDrop(event) {
  const id = event
    .dataTransfer
    .getData('text');

  const draggableElement = document.getElementById(id);
  draggableElement.style.left = 0;

  const dropzone = event.target;
  dropzone.appendChild(draggableElement);

  event
    .dataTransfer
    .clearData();

  document.getElementById('magic').style.display = 'block';
  document.getElementById('shuffle').style.display = 'none';
}

document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('shuffle').addEventListener('click', shuffleCards);
document.getElementById('show-hide').addEventListener('click', hideCardsToggle);