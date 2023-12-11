import input from './input.txt';

type Direction = 'up' | 'down' | 'left' | 'right';

enum Pipe {
    Vertical = '|',
    Horizontal = '-',
    NorthEast = 'L',
    NorthWest = 'J',
    SouthWest = '7',
    SouthEast = 'F',
}

const directions: Record<Direction, [number, number]> = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0],
};

const pipeConnectionsMap: Record<Pipe, Partial<Record<keyof typeof directions, Pipe[]>>> = {
    [Pipe.Vertical]: {
        up: [Pipe.Vertical, Pipe.SouthWest, Pipe.SouthEast],
        down: [Pipe.Vertical, Pipe.NorthWest, Pipe.NorthEast],
    },
    [Pipe.Horizontal]: {
        left: [Pipe.Horizontal, Pipe.NorthEast, Pipe.SouthEast],
        right: [Pipe.Horizontal, Pipe.NorthWest, Pipe.SouthWest],
    },
    [Pipe.SouthWest]: {
        down: [Pipe.Vertical, Pipe.NorthWest, Pipe.NorthEast],
        left: [Pipe.Horizontal, Pipe.NorthEast, Pipe.SouthEast],
    },
    [Pipe.SouthEast]: {
        down: [Pipe.Vertical, Pipe.NorthWest, Pipe.NorthEast],
        right: [Pipe.Horizontal, Pipe.NorthWest, Pipe.SouthWest],
    },
    [Pipe.NorthEast]: {
        up: [Pipe.Vertical, Pipe.SouthWest, Pipe.SouthEast],
        right: [Pipe.Horizontal, Pipe.NorthWest, Pipe.SouthWest],
    },
    [Pipe.NorthWest]: {
        up: [Pipe.Vertical, Pipe.SouthWest, Pipe.SouthEast],
        left: [Pipe.Horizontal, Pipe.NorthEast, Pipe.SouthEast],
    },
};

const pipeMap = input.split('\n');

let previousPosition: [number, number] = [0, 0];
let currentPosition = previousPosition;
let currentType = 'S' as Pipe | 'S';
let stepsTaken = 0;

// Determine S position
for (const y in pipeMap) {
    const x = [...pipeMap[y]].findIndex((pipe) => pipe === 'S');
    if (x > -1) {
        currentPosition = [x, +y];
        break;
    }
}

// Determine S type
for (const pipeKey in Pipe) {
    const possibleDirs: Direction[] = [];
    const pipe = Pipe[pipeKey as keyof typeof Pipe];
    for (const dir in pipeConnectionsMap[pipe]) {
        const direction = dir as Direction;
        const [dx, dy] = directions[direction];
        const pipeAtDir = pipeMap[currentPosition[1] + dy][currentPosition[0] + dx] as Pipe;
        if (pipeConnectionsMap[pipe][direction]?.includes(pipeAtDir)) {
            possibleDirs.push(direction);
        }
    }
    if (possibleDirs.length > 1) {
        currentType = pipe;
        break;
    }
}

for (;;) {
    Object.entries(pipeConnectionsMap[currentType as Pipe]).forEach(([dir, possiblePipes]) => {
        const direction = dir as Direction;
        const [dx, dy] = directions[direction];
        const [newX, newY] = [currentPosition[0] + dx, currentPosition[1] + dy];
        const pipeAtDir = pipeMap[newY][newX] as Pipe | 'S';
        if (
            !(previousPosition[0] === newX && previousPosition[1] === newY) &&
            (pipeAtDir === 'S' || possiblePipes.includes(pipeAtDir))
        ) {
            stepsTaken++;
            currentType = pipeAtDir;
            previousPosition = currentPosition;
            currentPosition = [newX, newY];
            console.log(currentType, currentPosition);
            return;
        }
    });
    if (currentType === 'S') break;
}

console.log(stepsTaken);
