const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');
const IntcodeComputer = require('../shared/IntcodeComputer');

class Ship {

    constructor() {
        this.hull = {};
    }

    getColor(x, y) {
        return this.hull[this._getKey(x,y)] || 0;
    }

    setColor(x, y, color) {
        this.hull[this._getKey(x,y)] = color;
    }

    reset() {
        this.hull = {};
    }

    print() {

        const coords = Object.keys(this.hull)
        .map(key => key.split('.'));

        const xCoords = coords.map(coord => coord[0]);
        const yCoords = coords.map(coord => coord[1]);

        const minX = Math.min(...xCoords);
        const maxX = Math.max(...xCoords);
        const minY = Math.min(...yCoords);
        const maxY = Math.max(...yCoords);

        for (let i = maxY; i >= minY; i--) {

            let row = '';
            for (let j = minX; j <= maxX; j++) {

                row += (this.getColor(j, i) == 0 ? ' ' : '#');

            }

            console.log(row);
        }

    }

    _getKey(x, y) {
        return `${x}.${y}`;
    }

}

const move = (x, y, dir, turn) => {

    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    (turn != 0) ? dir++ : dir--;

    dir = (dir + 4) % 4;

    x += directions[dir][0];
    y += directions[dir][1];

    return [x, y, dir];

}

const paint = (ship, robot) => {

    let x = 0, y = 0, dir = 0;

    while (true) {

        robot.input(ship.getColor(x, y));

        const color = robot.output();
        const turn  = robot.output();

        if (robot.halted()) {
            break;
        }

        ship.setColor(x, y, color);
        [x, y, dir] = move(x, y, dir, turn);

    }

    return ship;
}

const program = input.split(',').map(Number);
const robot = new IntcodeComputer(program);
const ship = new Ship();

// Part 1
paint(ship, robot);
console.log(Object.keys(ship.hull).length);

// Part 2
ship.reset();
robot.reset();
ship.setColor(0, 0, 1);
paint(ship, robot);
ship.print();
