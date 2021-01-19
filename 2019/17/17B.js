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
        let relativeBase = 0;

        while (pointer < program.length) {

            const opcode = this._processCode(program[pointer++]);

            let arg1 = program[pointer];
            let arg2 = program[pointer+1];
            let arg3 = program[pointer+2];

            (opcode.mode1 == 2) && (arg1+=relativeBase);
            (opcode.mode2 == 2) && (arg2+=relativeBase);
            (opcode.mode3 == 2) && (arg3+=relativeBase);

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
                    relativeBase+=arg1;
                    pointer++;
                    break;

                case 99:
                    yield false;
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

const findStartCoods = scaffold => {

    let result;
    scaffold.find(
        (row , rowInd) => row.find((val, colInd) => {

            if (!['>', '<', '^', 'v'].includes(val)) {
                return false;
            }

            result = [colInd, rowInd, val];
            return true;

        })
    )

    return result;

}

const getDirection = position => {

    switch(position) {
        case '>': return 'R';
        case '<': return 'L';
        case '^': return 'T';
        case 'v': return 'B';
    }
}

const move = (x, y, dir) => {

    switch(dir) {
        case 'T':
            y--;
            break;

        case 'R':
            x++;
            break;

        case 'B':
            y++;
            break;

        case 'L':
            x--;
            break;

    }

    return [x, y];

}

const nextTileInDir = (scaffold, x, y, dir) => {

    [x, y] = move(x, y, dir);

    return (scaffold[y] && scaffold[y][x]) || '.';

}

const turnDir = (dir, turn) => {

    const dirs = ['T', 'R', 'B', 'L'];
    let index = dirs.indexOf(dir);

    (turn == 'R') ? ++index : --index;
    index += 4;
    index %= 4;

    return dirs[index];
}

const getScaffoldPath = scaffold => {

    let [x, y, pos] = findStartCoods(scaffold);
    let dir = getDirection(pos);
    const result = [];
    let dist = 0;

    while (true) {

        if (nextTileInDir(scaffold, x, y, dir) == '#') {
            dist++;
            [x, y] = move(x, y, dir);
            continue;
        }

        const turn = ['R', 'L'].find(turn => {

            const newDir = turnDir(dir, turn);

            if (nextTileInDir(scaffold, x, y, newDir) != '#') {
                return false;
            }

            dist && result.push(dist);
            result.push(turn);
            dir = newDir;
            dist = 0;
            return true;


        });

        if (!turn) {
            break;
        }

    }

    dist && result.push(dist);

    return result;

}

const generatePathFunctions = path => {

    let pathString = path.join();
    let i = 0;
    let temp = [];
    const pathFunctions = [];
    const functionNames = ['A', 'B', 'C'];

    while (pathString.includes('R') || pathString.includes('L')) {

        temp.push(path[i]);

        const occurances = (pathString.match(new RegExp(temp.join(), 'g')) || []).length;

        if (occurances > 1 && 
            temp.join().length < 19 && 
            !['A', 'B', 'C'].includes(path[i])) {

            i++;
            continue;

        }

        temp.pop();

        // Funtion always ends with digits
        if (['R', 'L'].includes(temp[temp.length - 1])) {
            temp.pop();
        }

        const functionBody = temp.join();
        const functionName = functionNames[pathFunctions.length];

        pathFunctions.push(functionBody);
        pathString = pathString.replace(new RegExp(functionBody, 'g'), functionName);

        temp = [];
        path = pathString.split(',');
        i = path.includes('R') ? path.indexOf('R') : path.indexOf('L');

    }


    return [pathString].concat(pathFunctions).join('\n');

}

const program = input.split(',').map(Number);
let robot = new Computer(program);

let output;
let scaffold = [];
let temp = [];

do {

    output = robot.output();

    if (output == 10) {
        scaffold.push(temp);
        temp = [];
        continue;
    }

    temp.push(String.fromCharCode(output));

}while(output);


const path = getScaffoldPath(scaffold);
const pathFunctions = generatePathFunctions(path);
const requireVideoFeed = `n`

const programInput = `${pathFunctions}
${requireVideoFeed}
`.split('').map(c => c.charCodeAt(0));

program[0] = 2;
robot = new Computer(program, programInput);

let result;
temp = [];
do {

    output = robot.output();
    output && (result = output)

    if (output == 10) {
        console.log(temp.join(''))
        temp = [];
        continue;
    }

    temp.push(String.fromCharCode(output));

}while(output);

console.log(result);

