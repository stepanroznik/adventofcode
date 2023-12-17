import input from './input.txt';

const multiplier = 1000000;

const image = input.split(/\n/);
const rowLen = image[0].length;

const emptyRows = image.map((_row, index) => index).filter((index) => !image[index].includes('#'));

const emptyCols = [] as number[];
for (let i = 0; i < rowLen; i++) if (!image.map((row) => row[i]).includes('#')) emptyCols.push(i);

const galaxyPositions: [number, number][] = [];

image.forEach((row, y) => {
    for (const galaxyFound of row.matchAll(/#/g)) galaxyPositions.push([galaxyFound.index!, y]);
});

const sum = galaxyPositions.reduce((total, [x, y], index) => {
    const sumOfDistancesFromOthers = galaxyPositions.slice(index + 1).reduce((totalOfOthers, [otherX, otherY]) => {
        const emptyColsInBetween = emptyCols.filter(
            (col) => (col < x && col > otherX) || (col < otherX && col > x)
        ).length;
        const emptyRowsInBetween = emptyRows.filter(
            (row) => (row < y && row > otherY) || (row < otherY && row > y)
        ).length;
        const distanceSum =
            Math.abs(x - otherX) +
            emptyColsInBetween * (multiplier - 1) +
            Math.abs(y - otherY) +
            emptyRowsInBetween * (multiplier - 1);
        return totalOfOthers + distanceSum;
    }, 0);
    return total + sumOfDistancesFromOthers;
}, 0);

console.log(sum);
