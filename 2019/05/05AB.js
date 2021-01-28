const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');
const IntcodeComputer = require('./IntcodeComputer');

const program = input.split(',').map(Number);
let computer = new IntcodeComputer(program, [1]);

console.log(computer.finalOutput());

computer.reset(false, [5]);
console.log(computer.finalOutput());
