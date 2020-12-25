const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const codes = input.split(',').map(Number);
codes[1] = 'x';
codes[2] = 'y';

let pointer = 0;

while (pointer < codes.length) {

    const op = codes[pointer++];

    if (op == 99) {
        break;
    }

    const input1 = codes[codes[pointer++]];
    const input2 = codes[codes[pointer++]];

    let result;
    if (isNaN(input1) || isNaN(input2)) {
        result = `(${input1}${op == 1 ? '+' : '*'}${input2})`;
    }
    else {
        result = (op == 1) ? input1 + input2 : input1 * input2;
    }

    codes[codes[pointer++]] = result;

}

const findXY = (equation) => {

    for (let i=0;i<=99; i++) {
        for (let j=0; j<=99; j++) {
            let t = equation.replace(/x/g, i).replace(/y/g, j);
            if (eval(t) == 19690720) {
                return i.toString().padStart(2, '0') + j.toString().padStart(2, '0');
            }
        }
    }

}

console.log(findXY(codes[0]));