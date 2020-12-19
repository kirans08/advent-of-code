const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var processRow = (row) => {

    var temp;
    while(temp = /^.*\(([\d+*\s]+)\).*$/.exec(row)) {

        row = row.replace(`(${temp[1]})`, processRow(temp[1]));

    }

    row = row.replace(/(\d)([*+])/g,"$1 $2").replace(/([*+])(\d)/g,"$1 $2")
    var op;

    return row.split(' ')
        .reduce((res, i) => {

            if (['*', '+'].includes(i)) {
                op = i;
                return res;
            }

            return eval(`${res}${op}${i}`);

        })

}

var result = input.split('\n')
.reduce((res, row) =>  (res + processRow(row)), 0);

console.log(result);

