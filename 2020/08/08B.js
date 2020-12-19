const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var rows = input.split('\n').map(row => /^(\w{3})\s([+-]\d+)$/.exec(row));

var runCode = function () {
    
    var pointer = 0;
    var acc = 0;
    var visited = {};
    var jmpStack = [];
    var nopStack = [];

    while(!visited[pointer] && rows[pointer]) {

        visited[pointer] = true;

        var operation = rows[pointer][1];
        var offset = parseInt(rows[pointer][2]);

        switch(operation) {

            case 'nop':
                nopStack.push(pointer);
                pointer++;
                break;

            case 'acc':
                acc += offset;
                pointer++;
                break;

            case 'jmp':
                jmpStack.push(pointer);
                pointer += offset;
                break;

        }

    }

    return {
        acc: acc,
        loop: !!visited[pointer],
        jmpStack: jmpStack,
        nopStack: nopStack
    };


}


var result = runCode();


if (result.loop)
{
    var rowsBackup = [...rows];
    var jmpStack = result.jmpStack;
    var nopStack = result.nopStack;

    while(result.loop && (jmpStack.length > 0)) {

        rows[jmpStack.pop()][1] = 'nop';
        result = runCode();

        rows = [...rowsBackup];

    }

    while(result.loop && (nopStack.length > 0)) {

        rows[nopStack.pop()][1] = 'jmp';
        result = runCode();

        rows = [...rowsBackup];

    }

}


console.log(result.acc);

