const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');


class Adapter {

    constructor(program, phase) {

        this.program = [...program];
        this.inputs  = [phase];
        this.pointer = 0;
        this.isComplete = false;

    }

    run() {

        if (this.isComplete) {
            return;
        }

        let program = this.program;

        while (this.pointer < program.length) {

            const opcode = this._processCode(program[this.pointer++]);

            let arg1 = program[this.pointer];
            let arg2 = program[this.pointer+1];
            let arg3 = program[this.pointer+2];
            let address1 = arg1;
            (opcode.mode1 == 0) && (arg1 = program[arg1]);
            (opcode.mode2 == 0) && (arg2 = program[arg2]);

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
                    program[address1] = this.inputs.shift();
                    this.pointer++;
                    break;

                case 4:
                    this.pointer++;
                    this.output = arg1;
                    return;

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

                case 99:
                    this.isComplete = true;
                    return;

            }

        }

    }

    _processCode(opcode) {

        let parts = opcode.toString().split('').reverse();

        return {
            code: opcode % 100,
            mode1: parts[2] || 0,
            mode2: parts[3] || 0,
        }

    }

    addInput(...input) {

        this.inputs = this.inputs.concat(input);

    }


}

const runAdapaterCombo = (program, combo) => {

    let adapters = [];

    combo.forEach(phase => {
        adapters.push(new Adapter(program, phase))
    });

    let adapterId = 0;
    let prevOutput = 0;

    while(true) {

        let adapter = adapters[adapterId];

        adapter.addInput(prevOutput);
        adapter.run();
        prevOutput = adapter.output;

        if (adapter.isComplete && adapterId == 4) {
            return adapter.output;
        }

        adapterId = (adapterId+1) % 5;

    }

}

const getCombos = (phases = []) => {

    if (phases.length == 5) {
        return [phases];
    }

    let result = [];

    for (var i=5; i<10; i++) {

        if (phases.includes(i)) {
            continue;
        }

        result = result.concat(getCombos([...phases,i]))

    }

    return result;
}

const testAdapterCombos = program => {

    let combos = getCombos();
    let outputs = [];
    program = program.split(',').map(Number);

    combos.forEach(combo => {

        outputs.push(runAdapaterCombo(program, combo));

    });

    return Math.max(...outputs);

}

console.log(testAdapterCombos(input));

