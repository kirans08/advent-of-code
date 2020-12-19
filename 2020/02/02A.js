const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var result = input.split('\n')
.map(row => /^(\d+)-(\d+)\s(\w):\s(\w+)$/.exec(row))
.filter(row => {

    var c = row[3];
    var n = row[4].split('')
    .filter(s => (s==c))
    .length;
    
    return (n >= row[1] && n <= row[2])

}).length;

console.log(result);