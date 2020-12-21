const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

let mask, numComb, numPos, varInd;

const mem = input.split('\n')
.map(row => row.split(' = '))
.reduce((mem, row) => {

    if (row[0] == 'mask') {

        mask = row[1].replace(/X/g, '1').split('');
        numPos = row[1].match(/X/g).length;
        numComb = Math.pow(2, numPos);

        varInd = [];
        row[1].split('')
        .forEach((c, ind) => (c=='X') && varInd.push(ind));

        return mem;
    }

    let val = +row[1];
    let addr = parseInt(row[0].slice(4,-1))
    .toString(2)
    .padStart(mask.length, '0')
    .split('')
    .map((v, ind) => mask[ind] == '1' ? '1' : v);

    for (let i=0; i< numComb; i++) {

        let combination = i.toString(2).padStart(numPos, '0').split('');

        varInd.forEach((target, ind) => {
            addr[target] = combination[ind];
        });

        mem.set(parseInt(addr.join(''), 2), val);

    }

    return mem;


}, new Map());

const result = [...mem.values()].reduce((sum, v) => sum+v);

console.log(result)