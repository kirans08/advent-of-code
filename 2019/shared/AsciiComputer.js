/**
 * An Extended version of Intcode Computer capable of ASCII Input and Output
 */
const IntcodeComputer = require('./IntcodeComputer');

class AsciiComputer extends IntcodeComputer {

    init(program, input = '') {

        super.init(program, this._inputToCharCode(input));

    }

    input(input) {

        super.input(this._inputToCharCode(input));

    }

    output() {

        const result = [];

        while(true) {

            const output = super.output();

            if (super.halted() || output == 10) {
                break;
            }

            result.push(
                this._isAscii(output) ? String.fromCharCode(output) : output
            );

        }

        return result.join('');

    }

    _inputToCharCode(input) {

        return (input + '\n')
        .split('')
        .map(c => c.charCodeAt(0));

    }

    _isAscii(code) {

        return code >= 0 && code < 255;

    }



}

module.exports = AsciiComputer;
