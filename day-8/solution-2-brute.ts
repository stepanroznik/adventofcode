// import input from './input.txt';

const input = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

//! DO NOT RUN THIS FILE ON REAL INPUT, IT WOULD PROBABLY TAKE WEEKS TO COMPUTE

const [rawInstructions, rawElements] = input.split('\n\n');
const instructions = [...rawInstructions] as 'R' | 'L'[];
const elements = rawElements
    .split('\n')
    .map((line) => line.split(' = '))
    .map(([key, rawValues]) => ({ key, values: rawValues.replaceAll(/\(|\)/g, '').split(', ') }));

let nodes = elements.filter((e) => e.key[2] === 'A');

let stepsFollowed = 0;
while (!nodes.every((e) => e.key[2] === 'Z')) {
    for (const i of instructions) {
        nodes.forEach((currentNode, index) => {
            const { values } = currentNode;
            nodes[index] = elements.find((e) => e.key === (i === 'R' ? values[1] : values[0]))!;
        });
        stepsFollowed++;
        if (nodes.every((e) => e.key[2] === 'Z')) break;
    }
}

console.log(stepsFollowed);
