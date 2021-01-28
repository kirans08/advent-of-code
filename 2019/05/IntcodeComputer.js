
/**
 * Version 1 - Day 02 - Part 1,2
 *  - Support for Addition and Multiplication
 *
 * Version 2 - Day 05 - Part 1
 *  - Support for Input and Output
 *  - Support for Parameter modes
 *
 * Version 3 - Day 05 - Part 2
 *  - Support for Jump if true, Jump if false, Less than, equals
 */

class IntcodeComputer {

    constructor(program, input = []) {

        this._init(program, input);

    }

    reset(program = false, input = []) {

        this.instance.return();
        this._init(program || this.program, input);

        return this;

    }

    _init(program, input) {

        this.program = [...program];
        this.inputList = input;
        this.instance = this._execute();

    }

    input(val) {

        this.inputList = this.inputList.concat(Array.isArray(val) ? val : [val]);

        return this;

    }

    output() {

        return this.instance.next().value;

    }

    finalOutput() {

        let temp, result;

        while ((temp = this.output()) !== false) {
            result = temp;
        }

        return result;

    }

    *_execute() {

        let program = [...this.program];
        let pointer = 0;

        while (pointer < program.length) {

            const opcode = this._processOpcode(program[pointer++]);

            let arg1 = program[pointer];
            let arg2 = program[pointer+1];
            let arg3 = program[pointer+2];
            let address1 = arg1;

            (opcode.mode1 == 0) && (arg1 = program[arg1]);
            (opcode.mode2 == 0) && (arg2 = program[arg2]);

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
                    yield arg1;
                    break;

                case 5:
                    pointer+=2;
                    (arg1 != 0) && (pointer = arg2)
                    break;

                case 6:
                    pointer+=2;
                    (arg1 == 0) && (pointer = arg2)
                    break;

                case 7:
                    program[arg3] = (arg1 < arg2) ? 1 : 0;
                    pointer+=3;
                    break;

                case 8:
                    program[arg3] = (arg1 == arg2) ? 1 : 0;
                    pointer+=3;
                    break;

                case 99:
                    return false;
                    break;

            }

        }

        return false;

    }

    _processOpcode(opcode) {

        let parts = opcode.toString().split('').reverse();

        return {
            code: opcode % 100,
            mode1: parts[2] || 0,
            mode2: parts[3] || 0,
        };

    }

}

module.exports = IntcodeComputer;
