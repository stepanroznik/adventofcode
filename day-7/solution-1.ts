import input from './input.txt';

const letterToHexMap: Record<string, string> = {
    T: 'A',
    J: 'B',
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
    let type = 0;

    const repetitions: number[] = [];
    [...card].forEach((letter) => repetitions.push([...card].filter((l) => l === letter).length));

    const highestRepetition = Math.max(...repetitions);

    // Five of a kind
    if (highestRepetition === 5) type = 7;
    // Four of a kind
    else if (highestRepetition === 4) type = 6;
    else if (highestRepetition === 3) {
        // Full house
        if (repetitions.includes(2)) type = 5;
        // Three of a kind
        else type = 4;
    } else if (highestRepetition === 2) {
        // Two pair
        if (repetitions.filter((x) => x === 2).length === 4) type = 3;
        else type = 2;
        // High card
    } else type = 1;

    const decimals = parseInt(card, 16);
    const numberifiedCard = +`${type}.${decimals}`;
    return { numberifiedCard, bid: +hand.bid };
});

const totalWinnings = numberifiedHands
    .sort((a, b) => a.numberifiedCard - b.numberifiedCard)
    .reduce((total, currentHand, index) => total + currentHand.bid * (index + 1), 0);

console.log(totalWinnings);
