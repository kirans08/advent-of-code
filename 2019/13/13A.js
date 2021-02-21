const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');
const IntcodeComputer = require('../shared/IntcodeComputer');

const program = input.split(',').map(Number);
const game = new IntcodeComputer(program);
const output = [];

while(!game.halted()) {

    output.push(game.output());

}

output.pop();

let i=2;
let result = 0;
while (i < output.length) {

    (output[i] == '2' && result++);
    i+=3;

}

console.log(result);
