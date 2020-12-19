const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var processRow = (row) => {

    var temp;
    while(temp = /^.*\(([\d+*\s]+)\).*$/.exec(row)) {

        row = row.replace(`(${temp[1]})`, processRow(temp[1]));

    }

    var result = row
    .split('*')
    .map(
        parts => parts.split('+')
            .map(Number)
            .reduce((a,i) => a+i)
    ).reduce((a,i) => a*i);

    return result;

}

var result = input.split('\n')
.reduce((res, row) =>  (res + processRow(row)), 0);

console.log(result);

