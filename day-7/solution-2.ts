import input from './input.txt';

const letterToHexMap: Record<string, string> = {
    T: 'A',
    J: '1',
    Q: 'C',
    K: 'D',
    A: 'E',
};

const hands = input
    .replaceAll(/A|K|Q|J|T/g, (letter) => letterToHexMap[letter])
    .split('\n')
    .map((line) => line.split(' '))
    .map(([card, bid]) => ({ card, bid }));

const numberifiedHands = hands.map((hand) => {
    const card = hand.card;
    const possibleTypes: number[] = [];

    const possibleCards = [...Object.values(letterToHexMap), ...[...Array(10).keys()].slice(2).map((n) => '' + n)];

    possibleCards.forEach((c) => {
        const repetitions: number[] = [];
        const modifiedCard = card.replaceAll('1', c);
        [...modifiedCard].forEach((letter) => repetitions.push([...modifiedCard].filter((l) => l === letter).length));

        const highestRepetition = Math.max(...repetitions);

        // Five of a kind
        if (highestRepetition === 5) possibleTypes.push(7);
        // Four of a kind
        else if (highestRepetition === 4) possibleTypes.push(6);
        else if (highestRepetition === 3) {
            // Full house
            if (repetitions.includes(2)) possibleTypes.push(5);
            // Three of a kind
            else possibleTypes.push(4);
        } else if (highestRepetition === 2) {
            // Two pair
            if (repetitions.filter((x) => x === 2).length === 4) possibleTypes.push(3);
            else possibleTypes.push(2);
            // High card
        } else possibleTypes.push(1);
    });

    const type = Math.max(...possibleTypes);

    const decimals = parseInt(card, 16);
    const numberifiedCard = type + decimals / 1000000;
    return { numberifiedCard, bid: +hand.bid };
});

const totalWinnings = numberifiedHands
    .sort((a, b) => a.numberifiedCard - b.numberifiedCard)
    .reduce((total, currentHand, index) => total + currentHand.bid * (index + 1), 0);

console.log(totalWinnings);
