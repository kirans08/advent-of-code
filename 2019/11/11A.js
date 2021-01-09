const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

class Robot {

    constructor(program) {

        this.program = [...program];
        this.output = 0;
        this.pointer = 0;
        this.relativeBase = 0;
        this.x = 0;
        this.y = 0;
        this.dir = 0;
        this.isModePaint = true;

        this.directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]

    }

    paint(ship) {

        let program = this.program;
        let c = 0;

        while (this.pointer < program.length) {

            const opcode = this._processCode(program[this.pointer++]);

            let arg1 = program[this.pointer];
            let arg2 = program[this.pointer+1];
            let arg3 = program[this.pointer+2];

            (opcode.mode1 == 2) && (arg1+=this.relativeBase);
            (opcode.mode2 == 2) && (arg2+=this.relativeBase);
            (opcode.mode3 == 2) && (arg3+=this.relativeBase);

            let address1 = arg1;

            (opcode.mode1 != 1) && (arg1 = program[arg1] || 0);
            (opcode.mode2 != 1) && (arg2 = program[arg2] || 0);

            switch(opcode.code) {

                case 1:
                    program[arg3] = arg1 + arg2;
                    this.pointer+=3;
                    break;
                case 2:
                    program[arg3] = arg1 * arg2;
                    this.pointer+=3;
                    break;

                case 3:
                    program[address1] = ship.getColor(this.x, this.y);
                    this.pointer++;
                    break;

                case 4:
                    this.pointer++;

                    this.isModePaint  && ship.setColor(this.x, this.y, arg1);
                    !this.isModePaint && this._move(arg1);

                    this.isModePaint = !this.isModePaint;

                    break;

                case 5:
                    this.pointer+=2;
                    (arg1 != 0) && (this.pointer = arg2)
                    break

                case 6:
                    this.pointer+=2;
                    (arg1 == 0) && (this.pointer = arg2)
                    break

                case 7:
                    program[arg3] = (arg1 < arg2) ? 1 : 0;
                    this.pointer+=3;
                    break

                case 8:
                    program[arg3] = (arg1 == arg2) ? 1 : 0;
                    this.pointer+=3;
                    break

                case 9:
                    this.relativeBase+=arg1;
                    this.pointer++;
                    break;

                case 99:
                    return ship;

            }

        }

    }

    _processCode(opcode) {

        const parts = opcode.toString().split('').reverse();

        return {
            code: opcode % 100,
            mode1: parts[2] || 0,
            mode2: parts[3] || 0,
            mode3: parts[4] || 0,
        }

    }

    _move(dir) {

        const offset = (dir != 0) ? dir : -1;

        this.dir += offset;

        if (this.dir == -1) {
            this.dir = 3;
        }

        this.dir %= 4;

        this.x += this.directions[this.dir][0];
        this.y += this.directions[this.dir][1];


    }

}

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

    _getKey(x, y) {
        return `${x}.${y}`;
    }

}

const program = input.split(',').map(Number);
const robot = new Robot(program);
const ship = new Ship();

robot.paint(ship);

console.log(Object.keys(ship.hull).length);
