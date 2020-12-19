const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var rows = input.split('\n')
.map(row => [row.slice(0,1), parseInt(row.slice(1))]);

var ce = 0, cn = 0;

var dirList = ['E', 'S', 'W', 'N'];
var currentDir = 0;

var move = (dir, dist) => {


    switch(dir) {

        case 'E':
            ce += dist;
            break;

        case 'W':
            ce -= dist;
            break;

        case 'N':
            cn += dist;
            break;

        case 'S':
            cn -= dist;
            break;

        case 'F':
            move(dirList[currentDir], dist);
            break;

        case 'R':
            var dirOffset = Math.floor(dist / 90);
            currentDir = (currentDir + dirOffset) % 4;
            break;

        case 'L':
            var dirOffset = Math.floor(dist / 90);
            currentDir = (currentDir - dirOffset + 4) % 4;
            break;

    }

}

rows.forEach(r => {

    move(r[0], r[1]);

});

console.log(Math.abs(ce) + Math.abs(cn));


