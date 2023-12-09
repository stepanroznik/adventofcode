import input from './input.txt';

const reports = input.split('\n').map((line) =>
    line
        .split(' ')
        .map((num) => +num)
        //* This is the only difference between solutions 1 and 2:
        .reverse()
);

const nextNumbers = reports.map((report) => {
    const diffsPerLine: number[][] = [report];
    const addDiffs = (lastDiff: number[]) => {
        const deeperDiff = lastDiff.map((entry, i) => i && entry - lastDiff[i - 1]).filter((e, i) => i);
        diffsPerLine.push(deeperDiff);
        if (deeperDiff.every((diff) => diff === 0)) return;
        else addDiffs(deeperDiff);
    };
    addDiffs(report);

    const nextNumber = diffsPerLine
        .reverse()
        .reduce((previousDiff, currentDiff, index) => {
            if (index) {
                const currentLastItem = currentDiff[currentDiff.length - 1];
                const previousLastItem = previousDiff[previousDiff.length - 1];
                currentDiff.push(currentLastItem + previousLastItem);
            }
            return currentDiff;
        }, [])
        .findLast(() => true);

    return nextNumber!;
});

console.log(nextNumbers.reduce((next, prev) => next + prev, 0));
