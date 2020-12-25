const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const parts = input.split('-');
const low = +parts[0];
const high = +parts[1];

let c = 0;

for (let i=low; i <= high; i++) {

    if (!i.toString().match(/(\d)\1/)) {
        continue;
    }

    let t = i.toString().split('');
    let mismatch = t.find((n,ind) => n < t[ind-1]);

    if (mismatch) {
        continue;
    }

    c++;

}

console.log(c);
