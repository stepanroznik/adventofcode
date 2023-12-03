import input from './input.txt';

const array = input.split('\n');

const result = array.reduce((sum: number, current: string) => {
    const charArray = current.split('');
    const firstDigit = charArray.find((c) => !isNaN(+c)) || '';
    const lastDigit = charArray.findLast((c) => !isNaN(+c)) || '';
    const calibrationValue = +(firstDigit + lastDigit);
    return sum + calibrationValue;
}, 0);

console.log(result);
