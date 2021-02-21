
/**
 * Version 1 - Day 02
 *  - Support for Addition and Multiplication
 *
 * Version 2 - Day 05
 *  - Support for Input and Output
 *  - Support for Parameter modes
 *  - Support for Jump if true, Jump if false, Less than, equals
 *
 * Version 3 - Day 09
 *  - Support for Relative Base
 *
 * Version 4 - Day 23
 *  - Support for Default Input
 *  - Add next method - pauses on every input and output
 *  - Add method to check if input is empty
 */

class IntcodeComputer {

    constructor(program, input = [], defaultInput = null) {

        this._init(program, input);
        this.defaultInput = defaultInput;

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
        this.done = false;

    }

    input(val, clearPastInputs = false) {

        if (clearPastInputs === true) {
            this.inputList = [];
        }

        this.inputList = this.inputList.concat(Array.isArray(val) ? val : [val]);

        return this;

    }

    isInputEmpty() {

        return this.inputList.length === 0;

    }

    output() {

        let result;

        do {

            result = this.next();

        } while(result !== this.constructor.INPUT_EVENT);

        return result;


    }

    next() {

        return this.instance.next().value;

    }

    halted() {

        return this.done;

    }

    finalOutput() {

        let result, temp;

        do {

            result = temp;
            temp = this.output();

        } while(!this.halted());

        return result;

    }

    *_execute() {

        let program = [...this.program];
        let pointer = 0;
        let relativeBase = 0;

        while (pointer < program.length) {

            const opcode = this._processOpcode(program[pointer++]);

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
                    program[address1] = this._getNextInput();
                    yield this.constructor.INPUT_EVENT;
                    pointer++;
                    break;

                case 4:
                    pointer++;
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

                case 9:
                    relativeBase+=arg1;
                    pointer++;
                    break;

                case 99:
                    this.done = true;
                    return false;

            }

        }

        this.done = true;
        return false;

    }

    _getNextInput() {

        return this.isInputEmpty() ? this.defaultInput : this.inputList.shift();

    }

    _processOpcode(opcode) {

        let parts = opcode.toString().split('').reverse();

        return {
            code: opcode % 100,
            mode1: parts[2] || 0,
            mode2: parts[3] || 0,
            mode3: parts[4] || 0,
        };

    }

    static get INPUT_EVENT() {
        return 'INPUT_EVENT';
    }

}

module.exports = IntcodeComputer;
