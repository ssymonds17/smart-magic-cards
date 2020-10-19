const cardsWrapper = document.querySelector('.cards-wrapper');
const btnWrapper = document.querySelector('.btn-wrapper'); /* eslint-disable-line */
const selectedCardsWrapper = document.querySelector('.selected-cards'); /* eslint-disable-line */
const cards = [];
const suits = ['hearts', 'spades', 'diamonds', 'clubs'];
let selectedCard = {};

function magicTrick() {
  //   // Identify 3 cards with same data value as selected card
  const selectedValue = selectedCard.getAttribute('data-value');
  const newDeck = [...cardsWrapper.children];
  const matchingCards = [];

  for (let i = 0; i < newDeck.length; i += 1) {
    if (newDeck[i].getAttribute('data-value') === selectedValue) {
      matchingCards.push(newDeck[i]);
    }
  }

  const dropzone = document.querySelector(('#selected-cards'));
  matchingCards.forEach((card) => {
    dropzone.appendChild(card);
  });

  selectedCardsWrapper.children[1].style.left = '33px';
  selectedCardsWrapper.children[2].style.left = '66px';
  selectedCardsWrapper.children[3].style.left = '99px';
}

function createCards() {
  // Create an array with objects containing the value and the suit of each card
  suits.forEach((suit) => {
    for (let i = 1; i <= 13; i += 1) {
      const cardObject = {
        value: i,
        suit,
      };
      cards.push(cardObject);
    }
  });

  // For each dataObject, create a new card and append it to the DOM
  cards.forEach((card, i) => {
    const positionFromLeft = i * 33;
    const cardElement = document.createElement('div');
    cardElement.setAttribute('data-value', card.value);
    cardElement.setAttribute('id', `${card.suit}-${card.value}`);
    cardElement.setAttribute('draggable', 'true');
    cardElement.setAttribute('onclick', `onClick('${card.suit}-${card.value}')`);
    cardElement.classList.add('card', `${card.suit}-${card.value}`);
    cardElement.style.left = `${positionFromLeft}px`;
    cardsWrapper.append(cardElement);
  });
}

// Function to clear out the initial button and create new buttons to play the game.
function createButtons() {
  document.getElementById('start-game').remove();
  document.getElementById('shuffle').style.display = 'block';
  document.getElementById('flip').style.display = 'block';
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
  }

  document.getElementById('cards-wrapper').innerHTML = '';

  // For each dataObject, create a new card and append it to the DOM
  cards.forEach((card, i) => {
    const positionFromLeft = i * 33;
    const cardElement = document.createElement('div');
    cardElement.setAttribute('data-value', card.value);
    cardElement.setAttribute('id', `${card.suit}-${card.value}`);
    cardElement.setAttribute('draggable', 'true');
    cardElement.setAttribute('onclick', `onClick('${card.suit}-${card.value}')`);
    cardElement.classList.add('card', `${card.suit}-${card.value}`);
    cardElement.style.left = `${positionFromLeft}px`;
    cardsWrapper.append(cardElement);
  });
}

function flipCardsToggle() {
  const cardWrapper = document.getElementById('cards-wrapper');
  cardWrapper.classList.toggle('hidden');
}

function onClick(id) {
  const clickableElement = document.querySelector(`#${id}`);
  clickableElement.style.left = 0;
  const dropzone = document.querySelector(('#selected-cards'));
  dropzone.appendChild(clickableElement);
  selectedCard = clickableElement;

  const magicButtonElement = document.createElement('button');
  magicButtonElement.innerHTML = 'Magic';
  magicButtonElement.setAttribute('id', 'magic');
  magicButtonElement.classList.add('btn', 'btn-lg', 'btn-secondary');
  btnWrapper.append(magicButtonElement);

  const cardsList = document.querySelectorAll('.card');
  for (var i = 0; i < cardsList.length; i += 1) {
    cardsList[i].removeAttribute('draggable');
  }
  for (var i = 0; i < cardsList.length; i += 1) {
    cardsList[i].removeAttribute('onclick');
  }

  document.getElementById('magic').addEventListener('click', magicTrick);
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
  selectedCard = draggableElement;

  event
    .dataTransfer
    .clearData();

  const magicButtonElement = document.createElement('button');
  magicButtonElement.innerHTML = 'Magic';
  magicButtonElement.setAttribute('id', 'magic');
  magicButtonElement.classList.add('btn', 'btn-lg', 'btn-secondary');
  btnWrapper.append(magicButtonElement);

  const cardsList = document.querySelectorAll('.card');
  for (var i = 0; i < cardsList.length; i += 1) {
    cardsList[i].removeAttribute('draggable');
  }
  for (var i = 0; i < cardsList.length; i += 1) {
    cardsList[i].removeAttribute('onclick');
  }

  document.getElementById('magic').addEventListener('click', magicTrick);
}

document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('shuffle').addEventListener('click', shuffleCards);
document.getElementById('flip').addEventListener('click', flipCardsToggle);

// Event listener that fires when target is clicked
document.addEventListener('onclick', onClick);
// Event listener that fires when target is dragged
document.addEventListener('dragstart', onDragStart);
// Event listeners that fire target is dropped
document.addEventListener('dragover', onDragOver);
document.addEventListener('drop', onDrop);
