import input from './input.txt';

const [times, distances] = input.split('\n').map((line) =>
    line
        .replace(/\s+/g, ' ')
        .split(': ')[1]
        .split(' ')
        .map((num) => +num)
);

const races = times.map((time, index) => ({ time, recordDistance: distances[index] }));

const optionsPerRace = races.reduce((allOptions: number[][], currentRace) => {
    const currentRaceOptions: number[] = [];
    for (let speed = 1; speed < currentRace.time; speed++) {
        const timeToMove = currentRace.time - speed;
        const distance = timeToMove * speed;
        if (distance > currentRace.recordDistance) currentRaceOptions.push(speed);
    }
    allOptions.push(currentRaceOptions);
    return allOptions;
}, []);

const totalOptions = optionsPerRace.reduce((total, options) => (total *= options.length), 1);

console.log(totalOptions);
