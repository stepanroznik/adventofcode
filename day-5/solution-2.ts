import input from './input.txt';

const array = input.split('\n\n');

const seeds = array
    .shift()!
    .split(': ')[1]
    .split(' ')
    .map((num) => +num);

const seedRanges = seeds.reduce((totalSeedRanges: [number, number][], seed, index) => {
    if (index % 2 !== 0) return totalSeedRanges;
    totalSeedRanges.push([seed, seeds[index + 1]]);
    return totalSeedRanges;
}, []);

const mapNames: string[] = [];

const maps = array.map((rawMap) => {
    const [name, rawValues] = rawMap.split('map:\n');
    mapNames.push(name.trim());
    const values = rawValues.split('\n').map((line) => line.split(' ').map((value) => +value));
    return values;
});

function addToRanges(ranges: [number, number][], number: number) {
    const foundRangeIndex = ranges.findIndex(([start, length]) => start + length === number);
    if (foundRangeIndex !== -1) {
        ranges[foundRangeIndex][1]++;
        return ranges;
    } else {
        ranges.push([number, 1]);
        return ranges;
    }
}

/* STATS */
const totalItemsLength =
    seedRanges.reduce((totalLength, currentRange) => totalLength + currentRange[1], 0) * maps.length;
let lastLoggedPercentage = -1;
let lastRecordedTime: null | number = null;
/* STATS */

const locations = maps.reduce((currentRanges, currentMap, mapIndex) => {
    const soilsRange: [number, number][] = [];
    currentRanges.forEach(([seedRangeStart, seedRangeLength], seedRangeIndex) => {
        for (let seed = seedRangeStart; seed < seedRangeStart + seedRangeLength; seed++) {
            /* STATS */
            const completedSeedsNumber = currentRanges.reduce(
                (totalLength, currentRange, index) => totalLength + (index < seedRangeIndex ? currentRange[1] : 0),
                0
            );
            const currentSeedIndexWithinRange = seed - seedRangeStart;
            const currentSeedIndexWithinMap = completedSeedsNumber + currentSeedIndexWithinRange;
            const currentSeedIndex = currentSeedIndexWithinMap * (mapIndex + 1);

            const currentPercentage = Math.floor((100 / totalItemsLength) * currentSeedIndex);

            if (currentPercentage > lastLoggedPercentage) {
                const remainingPercentages = 100 - currentPercentage;
                const newRecordedTime = new Date().getTime();
                const remainingTimeSeconds = lastRecordedTime
                    ? (remainingPercentages * (newRecordedTime - lastRecordedTime)) / 1000
                    : 'TBD';
                console.log(
                    `${currentPercentage}%, Current map: ${mapNames[mapIndex]}, range:, ${seedRangeIndex + 1}/${
                        currentRanges.length
                    }, item ${currentSeedIndex + 1}/${totalItemsLength}, Remaining estimate (s): ${remainingTimeSeconds}`
                );
                lastLoggedPercentage = currentPercentage;
                lastRecordedTime = newRecordedTime;
            }
            /* STATS */

            let found = false;

            currentMap.forEach((entry) => {
                const [destinationRange, sourceRange, rangeLength] = entry;
                if (seed >= sourceRange && seed < sourceRange + rangeLength) {
                    const distance = destinationRange - sourceRange;
                    const soil = seed + distance;
                    found = true;
                    return addToRanges(soilsRange, soil);
                }
            });
            if (!found) addToRanges(soilsRange, seed);
        }
    });

    return soilsRange;
}, seedRanges);

const lowestLocation = Math.min(...locations.map((loc) => loc[0]));

console.log(lowestLocation);
