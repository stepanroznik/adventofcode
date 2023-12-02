import input from './input.txt';

const array = input.split('\n');

const result = array.reduce((previous: number, current: string) => {
    const charArray = current.split('');
    const firstDigit = charArray.find(c => !isNaN(parseInt(c))) || '';
    const lastDigit = charArray.findLast(c => !isNaN(parseInt(c))) || '';
    const calibrationValue = +(firstDigit + lastDigit);
    return previous + calibrationValue
}, 0)

console.log(result)
