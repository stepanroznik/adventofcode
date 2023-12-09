import input from './input.txt';

const reports = input.split('\n').map((line) => line.split(' ').map((num) => +num));

const nextNumbers = reports.map((report) => {
    const diffsPerLine: number[][] = [report];
    const addDiffs = (lastDiff: number[]) => {
        const deeperDiff = lastDiff.map((entry, i) => i && entry - lastDiff[i - 1]).filter((e, i) => i);
        diffsPerLine.push(deeperDiff);
        if (deeperDiff.every((diff) => diff === 0)) return;
        else addDiffs(deeperDiff);
    };
    addDiffs(report);

    const lastNumbersOnly = diffsPerLine.map((diffs) => diffs[diffs.length - 1]);

    const nextNumber = lastNumbersOnly.reverse().reduce((previousItem, currentItem) => currentItem + previousItem, 0);

    return nextNumber!;
});

console.log(nextNumbers.reduce((next, prev) => next + prev, 0));
