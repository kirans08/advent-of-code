const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

let om,pm;

const mem = input.split('\n')
.map(row => row.split(' = '))
.reduce((mem, row) => {

    if (row[0] == 'mask') {
        om = row[1].replace(/X/g, '0').split('');
        pm = row[1].replace(/1/g, '0').replace(/X/g, '1').split('');
        return mem;
    }

    let addr = row[0].slice(4,-1);
    let val = (+row[1]).toString(2).padStart(om.length, '0').split('');

    val = val.map((v, ind) => {

        return (om[ind] == '1' || (pm[ind] == '1' && v == '1')) ? '1' : '0'

    });

    mem.set(addr, parseInt(val.join(''), 2));

    return mem;

}, new Map());

const result = [...mem.values()].reduce((sum, v) => sum+v);

console.log(result)