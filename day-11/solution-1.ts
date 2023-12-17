import input from './input.txt';

const image = input.split(/\n/);
const rowLen = image[0].length;

const emptyRowIndexes = image.map((_row, index) => index).filter((index) => !image[index].includes('#'));

const emptyColIndexes = [] as number[];
for (let i = 0; i < rowLen; i++) if (!image.map((row) => row[i]).includes('#')) emptyColIndexes.push(i);

emptyRowIndexes.forEach((i, rowsAdded) => image.splice(i + rowsAdded, 0, '.'.repeat(rowLen)));
emptyColIndexes.forEach((i, colsAdded) =>
    image.forEach((row, rowIndex) => (image[rowIndex] = row.slice(0, i + colsAdded) + '.' + row.slice(i + colsAdded)))
);

const galaxyPositions: [number, number][] = [];

image.forEach((row, y) => {
    for (const galaxyFound of row.matchAll(/#/g)) galaxyPositions.push([galaxyFound.index!, y]);
});

const sum = galaxyPositions.reduce((total, [x, y], index) => {
    const sumOfDistancesFromOthers = galaxyPositions.slice(index + 1).reduce((totalOfOthers, [otherX, otherY]) => {
        const distanceSum = Math.abs(x - otherX) + Math.abs(y - otherY);
        return totalOfOthers + distanceSum;
    }, 0);
    return total + sumOfDistancesFromOthers;
}, 0);

console.log(sum);
