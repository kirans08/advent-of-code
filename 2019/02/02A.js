const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');
const IntcodeComputer = require('./IntcodeComputer');

const program = input.split(',').map(Number);
program[1] = 12;
program[2] = 2;

const computer = new IntcodeComputer(program);

console.log(computer.output());
