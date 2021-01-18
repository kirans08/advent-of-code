const fs = require('fs');
let input = fs.readFileSync('input', 'utf8');

const signal = input.split('').map(Number);
const offset = +signal.slice(0,7).join('');
const rem = signal.length - (offset%signal.length);

let repeatedSignal = signal.slice(-rem);
let i = Math.ceil(offset/signal.length);
const COUNT = 10000;
while (i++ < COUNT) {
    signal.forEach(s => repeatedSignal.push(s));
}


i = 0;
const LIMIT = 100;
while (i++ < LIMIT) {

    let j = repeatedSignal.length;
    let agg  = 0;

    while (j-- > 0){

        agg = (agg + repeatedSignal[j]) % 10;
        repeatedSignal[j] = agg;

    }

}

console.log(repeatedSignal.slice(0, 8).join(''));
