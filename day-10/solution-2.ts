import input from './input.txt';

// const input = `FF7FSF7F7F7F7F7F---7
// L|LJ||||||||||||F--J
// FL-7LJLJ||||||LJL-77
// F--JF--7||LJLJ7F7FJ-
// L---JF-JLJ.||-FJLJJ7
// |F|F-JF---7F7-L7L|7|
// |FFJF7L7F-JF7|JL---7
// 7-L-JL7||F7|L7F-7F7|
// L.L7LFJ|||||FJL7||LJ
// L7JLJL-JLJLJL--JLJ.L`;

// const input = `.F----7F7F7F7F-7....
// .|F--7||||||||FJ....
// .||.FJ||||||||L7....
// FJL7L7LJLJ||LJ.L-7..
// L--J.L7...LJS7F-7L7.
// ....F-J..F7FJ|L7L7L7
// ....L7.F7||L7|.L7L7|
// .....|FJLJ|FJ|F7|.LJ
// ....FJL-7.||.||||...
// ....L---J.LJ.LJLJ...`;

/*
O┌----┐┌┐┌┐┌┐┌-┐OOOO
O|┌--┐||||||||┌┘OOOO
O||O┌┘||||||||└┐OOOO
┌┘└┐└┐└┘└┘||└┘*└-┐OO
└--┘O└┐***└┘┌┐┌-┐└┐O
OOOO┌-┘**┌┐┌┘|└┐└┐└┐
OOOO└┐*┌┐||└┐|*└┐└┐|
OOOOO|┌┘└┘|┌┘|┌┐|O└┘
OOOO┌┘└-┐O||O||||OOO
OOOO└---┘O└┘O└┘└┘OOO
*/

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
        const pipeAtDir = pipeMap[currentPosition[1] + dy]?.[currentPosition[0] + dx] as Pipe;
        if (pipeConnectionsMap[pipe][direction]?.includes(pipeAtDir)) {
            possibleDirs.push(direction);
        }
    }
    if (possibleDirs.length > 1) {
        currentType = pipe;
        break;
    }
}

const initialType = currentType;

function includesPosition(positionsArray: [number, number][], positionToFind: [number, number]): boolean {
    return positionsArray.some(([x, y]) => x === positionToFind[0] && y === positionToFind[1]);
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
            !includesPosition([previousPosition], [newX, newY]) &&
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

pipeMap.forEach((line, index) => (pipeMap[index] = line.replace('S', initialType)));

let enclosedTiles: [number, number][] = [];

const isComplexWall = (positions: [number, number]) => {
    const [x, y] = positions;
    if (pipeMap[y][x] === Pipe.SouthEast)
        for (let i = 1; ; i++) {
            const nextPipe = pipeMap[y][x + i];
            if (!includesPosition(positionsTaken, [x + i, y])) break;
            if (nextPipe === Pipe.NorthWest) return true;
            else if (nextPipe === Pipe.Horizontal) continue;
            else break;
        }
    if (pipeMap[y][x] === Pipe.NorthEast)
        for (let i = 1; ; i++) {
            const nextPipe = pipeMap[y][x + i];
            if (!includesPosition(positionsTaken, [x + i, y])) break;
            if (nextPipe === Pipe.SouthWest) return true;
            else if (nextPipe === Pipe.Horizontal) continue;
            else break;
        }
    return false;
};

for (const y in pipeMap) {
    for (const x in [...pipeMap[y]]) {
        if (includesPosition(positionsTaken, [+x, +y])) continue;

        const XPositionsTaken = positionsTaken
            .filter(([xp, yp]) => +y === yp && pipeMap[yp][xp] !== Pipe.Horizontal && !isComplexWall([xp, yp]))
            .sort(([ax], [bx]) => ax - bx);

        const closestXIndex = XPositionsTaken.findIndex(([xp]) => +x < xp);

        if (![closestXIndex, closestXIndex].includes(-1) && closestXIndex % 2 !== 0) {
            enclosedTiles.push([+x + 1, +y + 1]);
        }
    }
}

console.log(enclosedTiles, enclosedTiles.length);
