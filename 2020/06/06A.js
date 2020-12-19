const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var result = input.split('\n\n')
    .map(s => s.replace(/\n/g, '').split(''))
    .reduce((res, s) => res + (new Set(s)).size, 0);

console.log(result);