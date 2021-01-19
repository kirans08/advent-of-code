
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

const findIntersections = scaffold => {

    let result = [];

    scaffold.forEach((row, rowIndex) => {

        row.forEach((val, colIndex) => {

            if (val == '.' || !scaffold[rowIndex-1] || !scaffold[rowIndex+1]) {
                return true;
            }

            if (row[colIndex-1] == '#' && 
                row[colIndex+1] == '#' && 
                scaffold[rowIndex-1][colIndex] == '#' && 
                scaffold[rowIndex+1][colIndex] == '#') {

                result.push([rowIndex, colIndex]);
            }

        })

    });

    return result;

}

const getAllignmentParams = scaffold => {

    return findIntersections(scaffold).reduce(
        (result, coord) => result + (coord[0]*coord[1])
    , 0);

}

const program = input.split(',').map(Number);
const robot = new Computer(program);

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

console.log(getAllignmentParams(scaffold));

