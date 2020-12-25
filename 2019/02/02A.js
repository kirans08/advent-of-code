const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const codes = input.split(',').map(Number);
codes[1] = 12;
codes[2] = 2;

let pointer = 0;

while (pointer < codes.length) {

    const op = codes[pointer++];

    if (op == 99) {
        break;
    }

    const input1 = codes[codes[pointer++]];
    const input2 = codes[codes[pointer++]];

    codes[codes[pointer++]] = (op == 1) ? input1 + input2 : input1 * input2;

}

console.log(codes[0])