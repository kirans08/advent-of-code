const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');
const IntcodeComputer = require('../shared/IntcodeComputer');

const program = input.split(',').map(Number);

const nicList = [];

for (let i=0; i < 50; i++) {
    nicList[i] = new IntcodeComputer(program, [i], -1, true);
}

let natx, naty, natUpdated = false;
const runNic = () => {

    nicList.forEach((nic, address) => {

        const target = nic.next();

        if (target === IntcodeComputer.INPUT_EVENT) {
            return;
        }

        const x = nic.next(), y = nic.next();

        if (target == 255) {

            natx = x;
            naty = y;
            natUpdated = true;
            return;

        }

        nicList[target].input([x, y]);

    });

}

// Bootup
runNic();

let part1Result, part2Result;
let prevNatY = null;

while(true) {

    runNic();

    if (!part1Result && natUpdated) {
        part1Result = naty;
    }

    const isInputEmpty = !nicList.find(nic => !nic.isInputEmpty());

    if (isInputEmpty && natUpdated) {

        if (prevNatY == naty) {
            part2Result = naty;
            break;
        }

        prevNatY = naty;
        nicList[0].input([natx, naty]);
        natUpdated = false;

    }

}

console.log(part1Result);
console.log(part2Result);
