const cardsWrapper = document.querySelector('.cards-wrapper');
const btnWrapper = document.querySelector('.btn-wrapper'); /* eslint-disable-line */
const selectedCardsWrapper = document.querySelector('.selected-cards'); /* eslint-disable-line */
let cards = [];
const suits = ['hearts', 'spades', 'diamonds', 'clubs'];
let selectedCard = {};

function createCards() {
  // For each suit create a cardObject 1-13
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
    // Position must be set to 33 for optimum visibility
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

function playAgain() {
  cardsWrapper.innerHTML = ''; // Remove the previous game's deck
  selectedCardsWrapper.innerHTML = ''; // Remove the previous game's selected cards
  cards = []; // Reset cards so we do not get duplications
  createCards();
  cardsWrapper.classList.remove('hidden'); // Ensure that the cards are facing upright
  document.getElementById('play-again').remove();
  document.getElementById('shuffle').style.display = 'block';
  document.getElementById('flip').style.display = 'block';
}

function magicTrick() {
  // Identify the value of the selected card
  const selectedValue = selectedCard.getAttribute('data-value');
  const newDeck = [...cardsWrapper.children]; // Destructured the element to access its children as an array
  const matchingCards = [];

  newDeck.forEach((card) => {
    // Identify the remaining 3 cards that have the same value as the selected card then push to matchingCards
    if (card.getAttribute('data-value') === selectedValue) {
      matchingCards.push(card);
    }
  });

  // Set the position from the left of the 3 new cards.
  matchingCards.forEach((card) => {
    const newPositionFromLeft = (matchingCards.indexOf(card) + 1) * 33;
    card.style.left = `${newPositionFromLeft}px`;
  });

  // Add the 3 new card elements to the selected-cards element to complete the trick
  const dropzone = document.querySelector(('#selected-cards'));
  matchingCards.forEach((card) => {
    dropzone.appendChild(card);
  });

  // Remove Magic button and replace with Play Again button
  document.getElementById('magic').remove();
  const playAgainElement = document.createElement('button');
  playAgainElement.innerHTML = 'Play Again';
  playAgainElement.setAttribute('id', 'play-again');
  playAgainElement.classList.add('btn', 'btn-lg', 'btn-secondary');
  btnWrapper.append(playAgainElement);
  document.getElementById('play-again').addEventListener('click', playAgain);
}

// Function to start the game by clearing the wrapper, creating
// and appending the buttons and all the cards to the DOM
function startGame() {
  createCards();
  createButtons();
}

// Randomises the cards array, empties the cards wrapper and appends a new set of cards to the DOM
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

// Identifies the clicked card by ID and appends to selected-cards
function onClick(id) {
  const clickableElement = document.querySelector(`#${id}`);
  clickableElement.style.left = 0;
  const dropzone = document.querySelector(('#selected-cards'));
  dropzone.appendChild(clickableElement);
  selectedCard = clickableElement;

  // Create the Magic button and append to button wrapper
  const magicButtonElement = document.createElement('button');
  magicButtonElement.innerHTML = 'Magic';
  magicButtonElement.setAttribute('id', 'magic');
  magicButtonElement.classList.add('btn', 'btn-lg', 'btn-secondary');
  btnWrapper.append(magicButtonElement);

  // Hide Shuffle and Flip buttons
  document.getElementById('shuffle').style.display = 'none';
  document.getElementById('flip').style.display = 'none';

  // Remove the functionality to click or drag cards after a card has been selected
  const cardsList = document.querySelectorAll('.card');
  cardsList.forEach((card) => {
    card.removeAttribute('draggable');
    card.removeAttribute('onclick');
  });
  document.getElementById('magic').addEventListener('click', magicTrick);
}

// Dragging functions
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

  document.getElementById('shuffle').style.display = 'none';
  document.getElementById('flip').style.display = 'none';

  const cardsList = document.querySelectorAll('.card');
  cardsList.forEach((card) => {
    card.removeAttribute('draggable');
    card.removeAttribute('onclick');
  });
  document.getElementById('magic').addEventListener('click', magicTrick);
}

// Event listeners for clicks on the buttons rendered on page load
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
