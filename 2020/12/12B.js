const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var rows = input.split('\n')
.map(row => [row.slice(0,1), parseInt(row.slice(1))]);

var we = 10, wn = 1;
var ce = 0, cn = 0;

var dirList = ['E', 'S', 'W', 'N'];
var currentDir = 0;


var rot = (dist) => {

    var offset = Math.floor(dist/90);
    var backup = we;

    switch(offset) {

        case 1:
        case -3:
            we = wn;
            wn = -backup;
            break;

        case 2:
        case -2:
            we = -we;
            wn = -wn;
            break;


        case 3:
        case -1:
            we = -wn;
            wn = backup;
            break;


    }

}

var move = (dir, dist) => {


    switch(dir) {

        case 'E':
            we += dist;
            break;

        case 'W':
            we -= dist;
            break;

        case 'N':
            wn += dist;
            break;

        case 'S':
            wn -= dist;
            break;

        case 'F':
            ce += dist * we;
            cn += dist * wn;
            break;


        case 'R':
            rot(dist)
            break;

        case 'L':
            rot(-dist);
            break;

    }

}

rows.forEach(r => {

    move(r[0], r[1]);

});

console.log(Math.abs(ce) + Math.abs(cn));


