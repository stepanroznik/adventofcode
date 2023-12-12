import input from './input.txt';

// const input = `
// 7-F7-
// .FJ|7
// SJLL7
// |F--J
// LJ.LJ`;

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

let currentType = 'S' as Pipe | 'S';
const positionsTaken = [] as [number, number][];

// Determine S position
for (const y in pipeMap) {
    const x = [...pipeMap[y]].findIndex((pipe) => pipe === 'S');
    if (x > -1) {
        positionsTaken.push([x, +y]);
        break;
    }
}

// Determine S type
for (const pipeKey in Pipe) {
    const possibleDirs: Direction[] = [];
    const pipe = Pipe[pipeKey as keyof typeof Pipe];
    const currentPosition = positionsTaken[positionsTaken.length - 1];
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

function positionsMatch(position1: [number, number], position2: [number, number]): boolean {
    return position1[0] === position2[0] && position1[1] === position2[1];
}

for (;;) {
    let wasFound = false;
    const currentPosition = positionsTaken[positionsTaken.length - 1];
    const previousPosition = positionsTaken[positionsTaken.length - 2] || [0, 0];
    Object.entries(pipeConnectionsMap[currentType as Pipe]).forEach(([dir, possiblePipes]) => {
        const direction = dir as Direction;
        const [dx, dy] = directions[direction];
        const [newX, newY] = [currentPosition[0] + dx, currentPosition[1] + dy];
        const pipeAtDir = pipeMap[newY][newX] as Pipe | 'S';
        if (
            !positionsMatch(previousPosition, [newX, newY]) &&
            !wasFound &&
            (pipeAtDir === 'S' || possiblePipes.includes(pipeAtDir))
        ) {
            wasFound = true;
            currentType = pipeAtDir;
            positionsTaken.push([newX, newY]);
        }
    });
    if (currentType === 'S') break;
}

console.log((positionsTaken.length - 1) / 2);
