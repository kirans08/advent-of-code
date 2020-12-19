const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var c = {
    1: 0,
    2: 0,
    3: 1
}
var prev = 0;

input.split('\n')
.map(Number)
.sort((a,b) => a-b)
.forEach(adapter => {

    c[adapter - prev]++
    prev = adapter;

});

console.log(c[1]*c[3]);