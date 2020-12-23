const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const cups = input.split('').map(Number);
const max = Math.max(...cups);
const length = cups.length;

let i =0;
let index = 0;

while(i++ < 100) {

    let current = cups[index];
    let destination = (current - 1) || max;
    let pickup = cups.splice(index + 1, 3);

    if (pickup.length < 3) {
        pickup = pickup.concat(cups.splice(0, 3 - pickup.length));
    }

    while(pickup.indexOf(destination) != -1) {

        destination = (destination - 1) || max;

    }

    cups.splice(cups.indexOf(destination) + 1, 0, ...pickup);
    index = (cups.indexOf(current) + 1) % length;

}

var oneIndex = cups.indexOf(1);
var result = (cups.slice(oneIndex+1).concat(cups.slice(0, oneIndex))).join('');

console.log(result);
