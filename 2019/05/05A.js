const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const processOpcode = opcode => {

    let parts = opcode.toString().split('').reverse();

    return {
        code: opcode % 100,
        mode1: parts[2] || 0,
        mode2: parts[3] || 0,
    }

}

const run = program => {

    let pointer = 0, output, param1, param2;

    program = program.split(',').map(Number);

    while (pointer < program.length) {


        const opcode = processOpcode(program[pointer++]);

        let arg1 = program[pointer];
        let arg2 = program[pointer+1];
        let arg3 = program[pointer+2];
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
                program[program[pointer]] = 1;
                pointer++;
                break;

            case 4:
                output = arg1;
                pointer++;
                break;

            case 99:
                return output;

        }

    }

    return output;
}

console.log(run(input));
