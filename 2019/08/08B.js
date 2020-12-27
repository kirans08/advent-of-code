const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

const result = input.match(/\d{150}/g)
.reduce(
    (result, layer) => result.split('')
    .map((c, ind) => {

        if (c != 2) {
            return c;
        }

        return layer[ind];

    })
    .join('')
)
.replace(/0/g, ' ')
.replace(/1/g, '.')
.match(/.{25}/g)
.join('\n')

console.log(result);
