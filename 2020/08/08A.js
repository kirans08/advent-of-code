const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var rows = input.split('\n').map(row => /^(\w{3})\s([+-]\d+)$/.exec(row));

var pointer = 0;
var acc = 0;
var visited = {};

while(!visited[pointer]) {

    visited[pointer] = true;

    var operation = rows[pointer][1];
    var offset = parseInt(rows[pointer][2]);

    switch(operation) {

        case 'nop':
            pointer++;
            break;

        case 'acc':
            acc += offset;
            pointer++;
            break;

        case 'jmp':
            pointer += offset;
            break;

    }

}

console.log(acc);
