import input from './input.txt';

const array = input.split('\n');

const validNumbers2DArray = array.map((line, lineIndex) => {
    const numberMatches = line.matchAll(/\d+/g);
    const validNumbers = [];

    for (const number of numberMatches) {
        const numberLength = number.toString().length;
        const numberIndex = number.index!;

        const bottomLeft = array[lineIndex + 1]?.[numberIndex - 1];
        const midLeft = array[lineIndex][numberIndex - 1];
        const topLeft = array[lineIndex - 1]?.[numberIndex - 1];

        /**
         * Neighbors order is like this, starting with 0:
         * 2345
         * 1**6
         * 0987
         */
        const neighbors = [bottomLeft, midLeft, topLeft];

        for (let i = 0; i < numberLength; i++) neighbors.push(array[lineIndex - 1]?.[numberIndex + i]);

        const topRight = array[lineIndex - 1]?.[numberIndex + numberLength];
        const midRight = array[lineIndex][numberIndex + numberLength];
        const bottomRight = array[lineIndex + 1]?.[numberIndex + numberLength];

        neighbors.push(topRight, midRight, bottomRight);

        for (let i = 0; i < numberLength; i++) neighbors.push(array[lineIndex + 1]?.[numberIndex + i]);

        // if neighbors include anything else than another number or a dot (.), add the number to validNumbers
        if (neighbors.join('').match(/[^.\d]/)) validNumbers.push(+number);
    }
    return validNumbers;
});

const validNumbersSum = validNumbers2DArray.flat().reduce((sum, num) => sum + num, 0);

console.log(validNumbersSum);
