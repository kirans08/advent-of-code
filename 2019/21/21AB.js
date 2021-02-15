const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');
const IntcodeComputer = require('../shared/IntcodeComputerV3');

const program = input.split(',').map(Number);
const droidInterface = new IntcodeComputer(program);

const runSpringScript = script => {

    script = script.split('')
    .map(c => c.charCodeAt(0));

    droidInterface.reset(false, script);

    let result;
    temp = [];
    do {

        output = droidInterface.output();
        output && (result = output)

        if (output == 10) {
            console.log(temp.join(''));
            temp = [];
            continue;
        }

        temp.push(String.fromCharCode(output));

    }while(output);

    console.log(result);

}

// (A.B.C)' . D
const part1Script = `NOT J T
AND A T
AND B T
AND C T
NOT T J
AND D J
WALK
`;

console.log('Part 1');
runSpringScript(part1Script);

// (A.B.C)' . D . (E'H + E)
const part2Script = `NOT E T
AND H T
OR T J
OR E J
NOT A T
NOT T T
AND B T
AND C T
NOT T T
AND T J
AND D J
RUN
`;
console.log('\nPart 2');
runSpringScript(part2Script);

