import input from './input.txt';

const [rawInstructions, rawElements] = input.split('\n\n');
const instructions = [...rawInstructions] as 'R' | 'L'[];
const elements = rawElements
    .split('\n')
    .map((line) => line.split(' = '))
    .map(([key, rawValues]) => ({ key, values: rawValues.replaceAll(/\(|\)/g, '').split(', ') }));

let nodes = elements.filter((e) => e.key[2] === 'A');

const stepsPerNode: number[] = [];
nodes.forEach((node) => {
    let stepsFollowed = 0;
    let currentNode = node;
    while (currentNode.key[2] !== 'Z') {
        for (const i of instructions) {
            const { values } = currentNode;
            currentNode = elements.find((e) => e.key === (i === 'R' ? values[1] : values[0]))!;
            stepsFollowed++;
            if (currentNode.key[2] === 'Z') break;
        }
    }
    stepsPerNode.push(stepsFollowed);
});

const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);
const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

// Find the least common multiple of each followed path. It shouldn't technically work as per instructions but it does.
const result = stepsPerNode.reduce(lcm);

console.log(result);
