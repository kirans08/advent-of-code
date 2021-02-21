const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');
const IntcodeComputer = require('../shared/IntcodeComputer');

const program = input.split(',').map(Number);
const drone = new IntcodeComputer(program);

const GRID_LENGTH = 50;
let count = 0;

const isDronePulled = (x, y) => {

    drone.reset();
    drone.input([x, y]);

    return drone.output() === 1;

}

// Part 1
for (let i = 0; i < GRID_LENGTH; i++) {

    for (let j = 0; j < GRID_LENGTH; j++) {

        isDronePulled(i, j) && count++;

    }

}

console.log(count);

// Part 2
const SHIP_DIMENSION_OFFSET = 99;
let leftX = -1, topY = -1, rightX, bottomY = topY + SHIP_DIMENSION_OFFSET;

do {

    bottomY++;
    topY++;
    while(isDronePulled(++leftX, bottomY) == 0);

    rightX = leftX + SHIP_DIMENSION_OFFSET;

} while(!isDronePulled(rightX, topY))

console.log((leftX*10000) + topY);
