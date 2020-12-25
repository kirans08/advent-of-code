const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const parts = input.split('\n');
const cardKey = +parts[0];
const doorkey = +parts[1];

let subjectNum = 7;
const c = 20201227;

let t = 1, i = 0;
while(t != cardKey && t != doorkey) {

    t = (t*subjectNum)%c;
    i++;

}

subjectNum = (t == cardKey) ? doorkey : cardKey;
t = 1;
while(i-- > 0) {

    t = (t*subjectNum)%c;

}

console.log(t);
