let lastLoggedPercentage = -1;
let lastRecordedTime: null | number = null;
let completedSeedsNumber = 0;

export const printStats = (
    currentRanges: [number, number][],
    mapIndex: number,
    seedRangeIndex: number,
    totalItemsLength: number,
    mapNames: string[]
) => {
    const currentPercentage = Math.floor((100 / totalItemsLength) * completedSeedsNumber);

    if (currentPercentage > lastLoggedPercentage) {
        const remainingPercentages = 100 - currentPercentage;
        const newRecordedTime = new Date().getTime();
        const remainingTimeSeconds = lastRecordedTime
            ? (remainingPercentages * (newRecordedTime - lastRecordedTime)) / 1000
            : 'TBD';
        console.log(
            `${currentPercentage}%, Current map: ${mapNames[mapIndex]} (range: ${seedRangeIndex + 1}/${
                currentRanges.length
            }), item ${completedSeedsNumber + 1}/${totalItemsLength}, Remaining estimate (s): ${remainingTimeSeconds}`
        );
        lastLoggedPercentage = currentPercentage;
        lastRecordedTime = lastRecordedTime ? (newRecordedTime + lastRecordedTime) / 2 : newRecordedTime;
    }
    completedSeedsNumber++;
};
