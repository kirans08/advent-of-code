const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');
const IntcodeComputer = require('../shared/IntcodeComputerV1');

const program = input.split(',').map(Number);
const OUTPUT = 19690720;

for (let i=0; i<=99; i++) {
    for (let j=0; j<=99; j++) {

        program[1] = i;
        program[2] = j;
        const computer = new IntcodeComputer(program);

        if (computer.output() == OUTPUT) {

            console.log(i.toString().padStart(2, '0') + j.toString().padStart(2, '0'));

        }

    }
}