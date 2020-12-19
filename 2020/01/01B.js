const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var rows = input.split('\n').map(Number).sort((a,b) => a-b);
var a, b;

a = rows.find((a,i) => {

    var map = new Map();
    b = rows.slice(i+1).find( b => map.set(2020 - a - b, true) && map.has(b));

    return !!b;

});

console.log(a * b * (2020-a-b));
