const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var result = input.split('\n\n')
.reduce((res, ansList) => {

    return res + ansList.split('\n')
    .map(ans => ans.split(''))
    .reduce((intersection, ans) => ans.filter(a => intersection.indexOf(a) !== -1))
    .length;

}, 0);

console.log(result);


