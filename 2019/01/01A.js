const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const result = input.split('\n')
.map(Number)
.map(num => Math.floor(num/3) - 2)
.reduce((res, num) => res + num);

console.log(result);