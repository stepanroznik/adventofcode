import input from './input.txt';

const pointsPerLine = input.split('\n').map((game) => {
    const gameContent = game.split(': ')[1];

    const [winningNumbers, elfNumbers] = gameContent
        .split('|')
        .map((numbers) => numbers.replace(/\s+/g, ' ').trim().split(' '));

    return elfNumbers.reduce((total, currentNumber) => {
        if (winningNumbers.includes(currentNumber)) {
            return total ? total * 2 : 1;
        } else return total;
    }, 0);
});

const totalPoints = pointsPerLine.reduce((total, currentNumber) => total + currentNumber, 0);

console.log(totalPoints);
