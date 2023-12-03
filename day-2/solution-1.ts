import input from './input.txt';

const colors = ['red', 'green', 'blue'] as const;

interface ICubeSet {
    red?: number;
    green?: number;
    blue?: number;
}

const maximum = {
    red: 12,
    green: 13,
    blue: 14,
} as const satisfies ICubeSet;

const parsedGameInput: ICubeSet[][] = input.split('\n').map((game) => {
    const gameContent = game.split(': ')[1];
    const gameSetsInput = gameContent.split('; ');
    const parsedGameSets = gameSetsInput.map((set) => {
        const parsedSet: ICubeSet = {};
        for (const color of colors) {
            const colorNumberInputs = set.split(', ');
            colorNumberInputs.forEach((colorNumber) => {
                if (colorNumber.indexOf(color) !== -1) parsedSet[color] = +colorNumber.match(/\d/g)!.join('') || 0;
            });
        }
        return parsedSet;
    });
    return parsedGameSets;
});

const possibleGameSets: boolean[] = parsedGameInput.map((game) => {
    for (const set of game) {
        for (const color of colors) {
            if (set[color]! > maximum[color]) return false;
        }
    }

    return true;
});

const gameIdSum = possibleGameSets.reduce((sum, isPossible, index) => {
    return sum + (isPossible ? index + 1 : 0);
}, 0);

console.log(gameIdSum);
