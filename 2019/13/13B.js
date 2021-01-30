const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');
const IntcodeComputer = require('../shared/IntcodeComputerV3');

const program = input.split(',').map(Number);
program[0] = 2;

const game = new IntcodeComputer(program);

let ballX, padX, score;

while (!game.halted()) {

    const x = game.output();
    const y = game.output();
    const c = game.output();

    if (x == -1 && y == 0) {
        score = c;
    }
    else if (c == 3) {
        padX = x;
        game.input(Math.sign(ballX - padX), true);
    }
    else if (c == 4) {
        ballX = x;
        game.input(Math.sign(ballX - padX), true);
    }

}

console.log(score);
