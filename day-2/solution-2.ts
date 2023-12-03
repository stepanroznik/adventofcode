import input from './input.txt';

const colors = ['red', 'green', 'blue'] as const;

interface ICubeSet {
    red?: number;
    green?: number;
    blue?: number;
}

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

const gamePowers: number[] = parsedGameInput.map((game) => {
    const colorsToMultiply: ICubeSet = {};
    for (const color of colors) {
        const gameSetsByColor = game.map((set) => set[color] || 0);
        const largestColor = Math.max(...gameSetsByColor);
        colorsToMultiply[color] = largestColor;
    }
    const values: number[] = Object.values(colorsToMultiply);
    return values.reduce((total, current) => total * current, 1);
});

const powersSum = gamePowers.reduce((sum, current) => sum + current, 0);

console.log(powersSum);
