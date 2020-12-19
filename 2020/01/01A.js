const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var map = new Map();
var result = input.split('\n')
.map(Number)
.find( a => map.set(2020-a, true) && map.has(a));

console.log(result * (2020-result));