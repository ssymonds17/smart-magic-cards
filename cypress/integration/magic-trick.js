const suits = ['hearts', 'spades', 'diamonds', 'clubs'];
const sortedCardsClasses = [];
let selectedCard; /* eslint-disable-line */
suits.forEach((suit) => [...Array(13)].forEach((_, i) => sortedCardsClasses.push(`${suit}-${i + 1}`)));

describe('Play game', () => {
  it('Visits the game and play', () => {
    cy.visit('./index.html');
    cy.get('.navbar-brand img').should('have.exist');
    cy.get('.navbar-brand').should('have.attr', 'href').and('eq', 'https://www.smartpension.co.uk');
    cy.get('h1').should('have.text', 'Become a software engineer at Smart');
    cy.get('h3').should('have.text', 'Join Smart by simply performing a magic trick');
    cy.get('#description').should('exist');
    cy.get('#start-game').should('have.text', "Let's get started").click();
    cy.get('[class*="hearts-"]').should('have.length', 13);

    cy.get('#start-game').should('have.not.exist');

    /* Each suit is rendered with 13 cards each (hearts, spades, diamonds, clubs) */
    suits.forEach((suit) => {
      cy.get(`[class*="${suit}-"]`).should('have.length', 13);
    });

    /* The cards are sorted and grouped by suit (hearts, spades, diamonds, clubs) */
    cy.get('.card').then((cards) => {
      const allCardClasses = [...cards].map((card) => card.classList[1]);
      expect(allCardClasses).to.deep.equal(sortedCardsClasses);
    });

    /* Click the `Shuffle` button */
    cy.contains('Shuffle').click();

    /* The cards are not sorted anymore (shuffled) */
    cy.get('.card').then((cards) => {
      const allCardClasses = [...cards].map((card) => card.classList[1]);
      expect(allCardClasses).to.not.deep.equal(sortedCardsClasses);
    });

    /* Click the `Flip Cards` button */
    cy.contains('Flip Cards').click();

    /* The cards are now flipped */
    cy.get('.cards-wrapper').should('have.class', 'hidden');

    /* Click the `Flip Cards` button */
    cy.contains('Flip Cards').click();

    /* The cards are now flipped to be visible again */
    cy.get('.cards-wrapper').should('not.have.class', 'hidden');

    cy.get('.selected-card-wrapper .card').should('not.exist');
    cy.contains('Magic').should('not.exist');

    /* Click on the first card */
    cy.get('.card').then((cards) => {
      [selectedCard] = cards;
      cards[0].click();
    });

    /* The selected card moved to the `selected-cards` */
    cy.get('.selected-cards .card').then((cards) => {
      expect(cards).to.have.length(1);
      expect(cards[0]).to.equal(selectedCard);
    });

    /* The `Shuffle` and `Flip Cards` buttons should now have css display set to none */
    cy.get('#shuffle').should('have.css', 'display', 'none');
    cy.get('#flip').should('have.css', 'display', 'none');

    /* Card elements should not have the attributes draggable or onclick */
    cy.get('.card').should('not.have.attr', 'draggable');
    cy.get('.card').should('not.have.attr', 'onclick');

    /* `Play Again` button should not exist */
    cy.contains('Play Again').should('not.exist');

    /* Click on the `Magic` button */
    cy.contains('Magic').click();

    /* All the related cards have been removed from the deck */
    cy.get('.cards-wrapper .card').then((cards) => {
      const allCardValues = [...cards].map((card) => card.getAttribute('data-value'));
      expect(allCardValues).to.have.length(48);
      expect(allCardValues).to.not.include(selectedCard.getAttribute('data-value'));
    });

    /* The removed cards are desplayed in the `selected-card-wrapper` */
    cy.get('.selected-card-wrapper .card').then((cards) => {
      const allCardValues = [...cards].map((card) => card.getAttribute('data-value'));
      const selectedValue = selectedCard.getAttribute('data-value');
      expect(allCardValues).to.have.length(4);
      expect(allCardValues).to.deep.equal([selectedValue, selectedValue, selectedValue, selectedValue]);
    });

    /* `Play Again` button should exist */
    cy.contains('Play Again').should('exist');

    /* Click the `Play Again` button */
    cy.contains('Play Again').click();

    /*  `Play Again` button should not exist */
    cy.contains('Play Again').should('not.exist');

    /* `Shuffle` and `Flip Cards` buttons should have style display as 'block' */
    cy.get('#shuffle').should('have.css', 'display', 'block');
    cy.get('#flip').should('have.css', 'display', 'block');

    /* `cards-wrapper` should not have class hidden */
    cy.get('.cards-wrapper').should('not.have.class', 'hidden');

    /* The cards are sorted and grouped by suit (hearts, spades, diamonds, clubs) */
    cy.get('.card').then((cards) => {
      const allCardClasses = [...cards].map((card) => card.classList[1]);
      expect(allCardClasses).to.deep.equal(sortedCardsClasses);
    });

    /* `selected-cards` should be empty (length of zero) */
    cy.get('.selected-cards').children().should('have.length', 0);
  });
});
