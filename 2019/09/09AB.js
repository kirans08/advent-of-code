const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const MODE_TEST  = 1;
const MODE_BOOST = 2;

class Computer {

    constructor(program) {

        this.program = [...program];
        this.output = 0;
        this.pointer = 0;
        this.relativeBase = 0;

    }

    run(mode) {

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
                    program[program[this.pointer] + this.relativeBase] = mode;
                    this.pointer++;
                    break;

                case 4:
                    this.pointer++;
                    this.output = arg1;
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
                    this.complete = true;
                    return this.output;

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
const sensor = new Computer(program);

console.log(sensor.run(MODE_TEST));  // PART 1
console.log(sensor.run(MODE_BOOST)); // PART 2
