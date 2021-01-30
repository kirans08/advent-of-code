const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');
const IntcodeComputer = require('../shared/IntcodeComputerV2');

const program = input.split(',').map(Number);

const runAdapaterCombo = (combo) => {

    let adapters = [];

    combo.forEach(phase => {
        adapters.push(new IntcodeComputer(program, [phase]))
    });

    let adapterId = -1, prevOutput = 0, result;

    while(true) {

        adapterId = (adapterId+1) % 5;

        prevOutput = adapters[adapterId]
        .input(prevOutput)
        .output();

        if (adapters[adapterId].halted()) {
            return result;
        }

        if (adapterId === 4) {
            result = prevOutput;
        }

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

    combos.forEach(combo => {

        outputs.push(runAdapaterCombo(combo));

    });

    return Math.max(...outputs);

}

console.log(testAdapterCombos(input));
