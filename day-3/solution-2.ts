import input from './input.txt';

const array = input.split('\n');

const gearRatios = array.map((line, lineIndex) => {
    const asteriskMatches = line.matchAll(/\*/g);
    const lineRatios = [];

    for (const asterisk of asteriskMatches) {
        const gearIndex = asterisk.index!;

        const positions: [number, number][] = [
            // Bottom Left, Mid Left, Top Left
            [1, -1],
            [0, -1],
            [-1, -1],
            // Top Middle, Top Right
            [-1, 0],
            [-1, 1],
            // Mid Right, Bottom Right, Bottom Middle
            [0, 1],
            [1, 1],
            [1, 0],
        ];

        const neighbors = positions.map(([y, x]) => array[lineIndex + y]?.[gearIndex + x]);

        const validNumbers: {
            number: number;
            positions: [number, number][];
        }[] = [];

        neighbors.forEach((symbol, positionIndex) => {
            if (!isNaN(+symbol)) {
                const position = positions[positionIndex];
                const y = position[0] + lineIndex;
                const x = position[1] + gearIndex;

                const numberDigits = [symbol];
                const digitPositions: [number, number][] = [[y, x]];

                let currentX = x - 1;
                while (!isNaN(+array[y]?.[currentX])) {
                    numberDigits.unshift(array[y]?.[currentX]);
                    digitPositions.unshift([y, currentX]);
                    currentX--;
                }

                currentX = x + 1;
                while (!isNaN(+array[y]?.[currentX])) {
                    numberDigits.push(array[y]?.[currentX]);
                    digitPositions.push([y, currentX]);
                    currentX++;
                }

                validNumbers.push({
                    number: +numberDigits.join(''),
                    positions: digitPositions,
                });
            }
        });

        // Remove duplicates
        const stringPositions = validNumbers.map(({ positions }) => JSON.stringify(positions));
        const uniqueValidNumbers = validNumbers.filter(
            ({ positions }, index) => !stringPositions.includes(JSON.stringify(positions), index + 1)
        );

        if (uniqueValidNumbers.length === 2)
            lineRatios.push(uniqueValidNumbers[0].number * uniqueValidNumbers[1].number);
    }
    return lineRatios;
});

const gearRatiosSum = gearRatios.flat().reduce((sum, num) => sum + num, 0);

console.log(gearRatiosSum);
