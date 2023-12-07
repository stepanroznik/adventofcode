import input from './input.txt';

const [time, recordDistance] = input.split('\n').map((line) => +line.replace(/\s+/g, '').split(':')[1]);

const options: number[] = [];
for (let speed = 1; speed < time; speed++) {
    const timeToMove = time - speed;
    const distance = timeToMove * speed;
    if (distance > recordDistance) options.push(speed);
}

const totalOptions = options.length;

console.log(totalOptions);
