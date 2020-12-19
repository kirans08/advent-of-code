const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var list = input.split(',').map(i => parseInt(i));

var map = new Map(), i=0;

// Part 1
// const LIMIT = 2020;

// Part 2
const LIMIT = 30000000;

var prevIndex = 0;
var lastNum = 0;

var speak = (e) => {

    prevIndex = 0;
    if (map.has(e)) {
        prevIndex = map.get(e);
    }

    map.set(e, ++i);
    lastNum = e;

}

list.forEach(speak);

while(i < LIMIT) {
    (prevIndex === 0) ? speak(0) : speak(i-prevIndex);
}

console.log(lastNum);
