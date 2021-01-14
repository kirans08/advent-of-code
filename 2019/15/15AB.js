const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

class Computer {

    constructor(program, input = []) {

        this.program = [...program];
        this.inputList = input;

        this.instance = this._execute();

    }

    input(val) {
        this.inputList.push(val);
    }

    output() {
        return this.instance.next().value;
    }

    *_execute() {

        let program = this.program;
        let pointer = 0;

        while (pointer < program.length) {

            const opcode = this._processCode(program[pointer++]);

            let arg1 = program[pointer];
            let arg2 = program[pointer+1];
            let arg3 = program[pointer+2];

            (opcode.mode1 == 2) && (arg1+=this.relativeBase);
            (opcode.mode2 == 2) && (arg2+=this.relativeBase);
            (opcode.mode3 == 2) && (arg3+=this.relativeBase);

            let address1 = arg1;

            (opcode.mode1 != 1) && (arg1 = program[arg1] || 0);
            (opcode.mode2 != 1) && (arg2 = program[arg2] || 0);

            switch(opcode.code) {

                case 1:
                    program[arg3] = arg1 + arg2;
                    pointer+=3;
                    break;
                case 2:
                    program[arg3] = arg1 * arg2;
                    pointer+=3;
                    break;

                case 3:
                    program[address1] = this.inputList.shift();
                    pointer++;
                    break;

                case 4:
                    pointer++;
                    yield arg1;
                    break;

                case 5:
                    pointer+=2;
                    (arg1 != 0) && (pointer = arg2)
                    break

                case 6:
                    pointer+=2;
                    (arg1 == 0) && (pointer = arg2)
                    break

                case 7:
                    program[arg3] = (arg1 < arg2) ? 1 : 0;
                    pointer+=3;
                    break

                case 8:
                    program[arg3] = (arg1 == arg2) ? 1 : 0;
                    pointer+=3;
                    break

                case 9:
                    this.relativeBase+=arg1;
                    pointer++;
                    break;

                case 99:
                    console.log('HALT');
                    return;

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

}


const program = input.split(',').map(Number);
const droid = new Computer(program);

const map = {};
const pathStack = [];

const getKey = (x, y) => `${x}.${y}`;

const setTile = (x, y, tile) => {
    map[getKey(x, y)] = tile;
}

const getTile = (x, y) => map[getKey(x, y)];

const isVisited = (x, y) => getTile(x, y) !== undefined;

const isPath = (x, y) => getTile(x, y) == 1;

const getNextDir = (x, y) => {

    return !isVisited(x, y+1) ? 1 :
    !isVisited(x, y-1) ? 2 :
    !isVisited(x-1, y) ? 3 :
    !isVisited(x+1, y) ? 4 : false;

}

const getNewCoordinates = (tx, ty, dir) => {

    switch(dir) {

        case 1:
            ty++;
            break;

        case 2:
            ty--;
            break;

        case 3:
            tx--;
            break;

        case 4:
            tx++;
            break;

    }

    return [tx, ty];

}

const getReverseDir = dir => {

    switch(dir) {
        case 1: return 2;
        case 2: return 1;
        case 3: return 4;
        case 4: return 3;
    }

}

const getAdjacentTiles = (x, y) => {

    return [
        [x+1, y],
        [x-1, y],
        [x, y+1],
        [x, y-1]
    ];

}


const getBfsDepth = (x, y) => {

    let queue = [[x,y]];
    let depth = -1;

    while(queue.length != 0) {

        const temp = [];
        queue.forEach(coord => {

            getAdjacentTiles(...coord)
            .filter(adjCoord => isPath(...adjCoord))
            .forEach(adjCoord => {

                setTile(...adjCoord, 'O');
                temp.push(adjCoord)

            })

        });

        queue = temp;
        depth++;

    }

    return depth;

}

let x = 0, y = 0;
let dir, backTrack, tile, tx, ty;

setTile(x, y, 1);

do {

    dir = getNextDir(x, y) || pathStack.pop();
    backTrack = !getNextDir(x, y);

    droid.input(dir);
    tile = droid.output();

    ([tx, ty] = getNewCoordinates(x, y, dir));
    setTile(tx, ty, tile);

    if (tile == 0) {
        continue;
    }

    !backTrack && pathStack.push(getReverseDir(dir));
    [x, y] = [tx, ty];

} while(tile != 2);

console.log(pathStack.length);  // Part 1
console.log(getBfsDepth(x, y)); // Part 2

