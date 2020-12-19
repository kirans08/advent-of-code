const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var result = input.split("\n\n").filter(
    s => s.split(/\s/).length + (s.includes('cid:') ? -1:0) == 7
).length;

console.log(result);

