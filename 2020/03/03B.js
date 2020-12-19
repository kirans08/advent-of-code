const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var rows = input.split('\n').map(r => r.split(''));

var x=0, y = 0, xmax = rows.length, ymax = rows[0].length;
var c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0;

while(x < xmax) {
    
    y = (x) % ymax;
    if (rows[x][y] == '#') c1++;

    y = (3*x) % ymax;
    if (rows[x][y] == '#') c2++;


    y = (5*x) % ymax;
    if (rows[x][y] == '#') c3++;


    y = (7*x) % ymax;
    if (rows[x][y] == '#') c4++;

    x++;

};

x = 0;
y = 0;

while(x < xmax) {
    
    y = (y) % ymax;
    
    if (rows[x][y] === '#') c5++;

    x += 2;
    y++;

}

console.log(c1*c2*c3*c4*c5);