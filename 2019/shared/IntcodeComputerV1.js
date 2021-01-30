
/**
 * Version 1 - Day 02
 *  - Support for Addition and Multiplication
 */

class IntcodeComputer {

    constructor(program) {

        this.program = [...program];

    }

    output() {

        return this._execute();

    }

    _execute() {

        let pointer = 0;
        let program = [...this.program];

        while (pointer < program.length) {

            const op = program[pointer++];

            if (op == 99) {
                break;
            }

            const arg1 = program[program[pointer++]];
            const arg2 = program[program[pointer++]];
            const arg3 = program[pointer++];

            program[arg3] = (op == 1) ? arg1 + arg2 : arg1 * arg2;

        }

        return program[0];

    }

}

module.exports = IntcodeComputer;
