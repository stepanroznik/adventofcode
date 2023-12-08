import input from './input.txt';

const [rawInstructions, rawElements] = input.split('\n\n');
const instructions = [...rawInstructions] as 'R' | 'L'[];
const elements = rawElements
    .split('\n')
    .map((line) => line.split(' = '))
    .map(([key, rawValues]) => ({ key, values: rawValues.replaceAll(/\(|\)/g, '').split(', ') }));

let currentElement = elements.find((e) => e.key === 'AAA')!;
let stepsFollowed = 0;
while (currentElement.key !== 'ZZZ') {
    for (const i of instructions) {
        const { values } = currentElement;
        currentElement = elements.find((e) => e.key === (i === 'R' ? values[1] : values[0]))!;
        stepsFollowed++;
    }
}

console.log(stepsFollowed);
