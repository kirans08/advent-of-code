const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');
const IntcodeComputer = require('./IntcodeComputer');

const program = input.split(',').map(Number);
const adapter = new IntcodeComputer(program);

const testAdapter = (prevPhases, input) => {

    if (prevPhases.length == 5) {
        return input;
    }

    let outputs = [];

    for (var i=0; i<5; i++) {

        if (prevPhases.includes(i)) {
            continue;
        }

        let result = adapter.reset(false, [i, input])
        .finalOutput();

        outputs.push(testAdapter([...prevPhases,i], result));

    }

    return Math.max(...outputs);

}

console.log(testAdapter([],0));
