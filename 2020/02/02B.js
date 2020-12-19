const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var result = input.split('\n')
.map(row => /^(\d+)-(\d+)\s(\w):\s(\w+)$/.exec(row))
.filter(row => {

    var c = row[3];
    var f1 = row[4].charAt(row[1]-1) == c;
    var f2 = row[4].charAt(row[2]-1) == c;
    
    return f1 ^ f2;
    
}).length;

console.log(result);