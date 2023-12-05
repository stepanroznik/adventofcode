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

// I am REALLY not proud of this part, I know I could write this way more efficiently but I don't want to waste more time on it

const arrayOfArrays = [newCardsPerCard];

for (let currentCardIndex = 0; currentCardIndex < newCardsPerCard.length; currentCardIndex++) {
    arrayOfArrays.forEach((array) => {
        const numCardsToAdd = newCardsPerCard[currentCardIndex];
        const arrayToAdd = newCardsPerCard.slice(1 + currentCardIndex, 1 + currentCardIndex + numCardsToAdd);
        if (array[currentCardIndex]) arrayOfArrays.push([...Array(currentCardIndex + 1).fill(null), ...arrayToAdd]);
    });
}

const totalCards = arrayOfArrays.flat().filter((n) => n !== null).length;

console.log(totalCards);
