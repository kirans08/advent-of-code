const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const parts = input.split('-');
const low = +parts[0];
const high = +parts[1];

let c = 0;

for (let i=low; i <= high; i++) {

    let t = i.toString().split('');
    let mismatch = t.find((n,ind) => n < t[ind-1]);

    if (mismatch) {
        continue;
    }

    let matchDigits = t.find((n, ind) => {
        return (n == t[ind+1]) && (n != t[ind-1]) && (n != t[ind+2]);
    })

    if (!matchDigits) {
        continue;
    }

    c++;

}

console.log(c);
