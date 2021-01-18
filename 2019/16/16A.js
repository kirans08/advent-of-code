const fs = require('fs');
let input = fs.readFileSync('input', 'utf8');

let signal = input.split('').map(Number);
const phase = [0, 1, 0, -1];

const getPhase = (row, col) => {

    return phase[Math.floor(++col/++row)%4];

}

const processSignal = signal => {

    return signal.map(
        (s1, row) => signal.reduce(
            (result, s2, col) => result + (s2 * getPhase(row, col))
        , 0)
    ).map(val => Math.abs(val%10))

};

const LIMIT = 100;
let i = 0;

while (i++ < LIMIT) {

    signal = processSignal(signal, signal.length*10);

}

console.log(signal.slice(0, 8).join(''))
