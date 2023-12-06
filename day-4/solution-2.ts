import input from './input.txt';

const parsedCards = input.split('\n').map((game) => {
    const gameContent = game.split(': ')[1];
    return gameContent.split('|').map((numbers) =>
        numbers
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ')
            .map((n) => +n)
    );
});

const newCardsPerCard = parsedCards.map(([elfNumbers, winningNumbers]) =>
    elfNumbers.reduce((total, currentNumber) => total + +winningNumbers.includes(currentNumber), 0)
);

const cardCounts = Array(newCardsPerCard.length).fill(1);

newCardsPerCard.forEach((cardsToAdd, cardIndex) => {
    for (let cardWinningCount = 0; cardWinningCount < cardsToAdd; cardWinningCount++) {
        for (let cardNumber = 0; cardNumber < cardCounts[cardIndex]; cardNumber++) {
            cardCounts[cardIndex + cardWinningCount + 1]++;
        }
    }
});

const totalCards = cardCounts.reduce((total, currentCardCount) => (total += currentCardCount), 0);

console.log(totalCards);
