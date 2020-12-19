const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var prev = 0;
var total = 1;
var tempc = 0;

input.split('\n')
.map(Number)
.sort((a,b) => a-b)
.forEach((adapter,i) => {

    var diff = adapter - prev;

    if (diff === 1){
        tempc++;
    }
    else if (tempc !== 0) {

        var n = tempc -1;
        var p = ((n*n) + n + 2)/2;

        total = total*p;
        tempc = 0;

    }

    prev = adapter;

});

if (tempc !== 0) {

    var n = tempc -1;
    var p = ((n*n) + n + 2)/2;

    total = total*p;

}

console.log(total);