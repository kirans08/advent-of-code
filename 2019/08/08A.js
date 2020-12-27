const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

let minLayer;
let minCount = 150;

input.match(/\d{150}/g)
.forEach(layer => {

    const temp = layer.match(/0/g).length;

    if (temp < minCount) {
        minLayer = layer;
        minCount = temp;
    }

});

const result = minLayer.match(/1/g).length * minLayer.match(/2/g).length;

console.log(result);
