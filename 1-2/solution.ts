import input from './input.txt';

const wordDigits = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
// const regex = new RegExp(wordDigits.join('|'), "g")

const array = input.split('\n');

const result = array.reduce((sum: number, current: string) => {
    // I really loved these solutions, but "twone" is apparently supposed to be neither 2ne, nor tw1, but 21, which is imho dumb (sorry)

    // 2ne:
    // const parsedDigitString = current.replaceAll(regex, (matchedWord) => '' + (wordDigits.indexOf(matchedWord) + 1))
    // const charArray = parsedDigitString.split('');

    // tw1:
    // let parsedDigitString
    // wordDigits.forEach((word, index) => parsedDigitString = parsedDigitString.replaceAll(word, '' + (index + 1)))
    // const charArray = parsedDigitString.split('');

    // 21:
    const charArray = current.split('');
    wordDigits.forEach((word, wordIndex) => {
        for (let i = 0; i < current.length; i++) {
            const position = current.indexOf(word, i);
            if (position > -1) charArray[position] = '' + (wordIndex + 1)
        }
    })
    
    const firstDigit = charArray.find(c => !isNaN(parseInt(c))) || '';
    const lastDigit = charArray.findLast(c => !isNaN(parseInt(c))) || '';
    const calibrationValue = +(firstDigit + lastDigit);

    // console.log(current, charArray.join(''), calibrationValue)
    return sum + calibrationValue
}, 0)

console.log(result)
