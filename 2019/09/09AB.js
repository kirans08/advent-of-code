const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');
const IntcodeComputer = require('./IntcodeComputer');

const program = input.split(',').map(Number);
const computer = new IntcodeComputer(program);

// Part 1
console.log(computer.input(1).finalOutput());

// Part 2
computer.reset();
console.log(computer.input(2).finalOutput())
