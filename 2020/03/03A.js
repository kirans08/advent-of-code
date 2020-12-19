const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var rows = input.split('\n').map(r => r.split(''));
var c = 0, x = 0, y = 0, xmax = rows.length, ymax = rows[0].length;

while(x < xmax) {
    
    y = (3*x) % ymax;
    
    if (rows[x][y] == '#') c++;

    x++;

};

console.log(c);