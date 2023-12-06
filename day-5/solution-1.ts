import input from './input.txt';

const array = input.split('\n\n');

const seeds = array
    .shift()!
    .split(': ')[1]
    .split(' ')
    .map((num) => +num);

const maps = array.map((rawMap) => {
    const [name, rawValues] = rawMap.split('map:\n');
    const values = rawValues.split('\n').map((line) => line.split(' ').map((value) => +value));
    return values;
});

const locations = maps.reduce((currentArray, currentMap) => {
    const soils: number[] = [];
    currentArray.forEach((seed) => {
        let found = false;

        currentMap.forEach((entry) => {
            const [destinationRange, sourceRange, rangeLength] = entry;
            if (seed >= sourceRange && seed < sourceRange + rangeLength) {
                const distance = destinationRange - sourceRange;
                const soil = seed + distance;
                found = true;
                return soils.push(soil);
            }
        });

        if (!found) soils.push(seed);
    });

    return soils;
}, seeds);

const lowestLocation = Math.min(...locations);

console.log(lowestLocation);
