const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const result = input.split('\n')
.map(Number)
.map(num => Math.floor(num/3) - 2)
.map(mass => {

    let result = 0;

    while (mass > 0) {
        result += mass;
        mass = Math.floor(mass/3) - 2;
    }

    return result;

})
.reduce((res, mass) => res + mass);

console.log(result);