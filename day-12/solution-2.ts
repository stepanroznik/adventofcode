// import input from './input.txt';

const input = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

const springsRegex = /^[\?#]+$/;

const rows = input.split(/\n/).map((row) =>
    row.split(' ').map((entry, index) =>
        !index
            ? Array(5).fill(entry).join('?')
            : Array(5)
                  .fill(entry)
                  .join(',')
                  .split(',')
                  .map((number) => +number)
    )
) as [string, number[]][];

const createCombinations = (
    arrays: number[][],
    index = 0,
    currentCombination: number[] = [],
    combinations: number[][] = []
) => {
    if (index === arrays.length) {
        const isInOrder = currentCombination.every(
            (num, i) => i === currentCombination.length - 1 || num < currentCombination[i + 1]
        );
        if (isInOrder) combinations.push([...currentCombination]);
        return combinations;
    }

    for (let i = 0; i < arrays[index].length; i++) {
        currentCombination[index] = arrays[index][i];
        createCombinations(arrays, index + 1, currentCombination, combinations);
    }

    return combinations;
};

const sum = rows.reduce((total, currentRow, rowIndex) => {
    const [record, groups] = currentRow;

    const positionsPerGroup: number[][] = Array(groups.length)
        .fill(0)
        .map(() => []);

    for (let i = 0; i < groups.length; i++) {
        for (let j = 0; j < record.length; j++) {
            const sectionToCheck = record.substring(j, j + groups[i]);
            if (sectionToCheck.length !== groups[i]) continue;
            if (springsRegex.test(sectionToCheck)) positionsPerGroup[i].push(j);
        }
    }

    const combinations = createCombinations(positionsPerGroup);

    console.log('Current row:', rowIndex, 'Combinations to analyze:', combinations.length);

    const validCombinations: string[] = [];
    combinations.forEach((combination) => {
        let modifiedRecord = record;

        combination.forEach((number, index) => {
            const length = groups[index];
            modifiedRecord =
                modifiedRecord.slice(0, number) + '#'.repeat(length) + modifiedRecord.slice(number + length);
        });
        const matches = Array.from(modifiedRecord.matchAll(/#+/g));
        if (
            matches.length === groups.length &&
            matches.every((match, index) => match[0].length === groups[index]) &&
            !validCombinations.includes(modifiedRecord)
        )
            validCombinations.push(modifiedRecord);
    });

    return total + validCombinations.length;
}, 0);

console.log(sum);
