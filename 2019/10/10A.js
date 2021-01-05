const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const cords = [];

input.split('\n')
.map(row => row.split(''))
.forEach((row, r) => {

    row.forEach((v, c) => {

        if (v == '.') {
            return;
        }

        cords.push([c,r]);

    })

});

let maxCount = 0;

cords.forEach(baseCord => {

    let angles = cords
    .filter(cord => cord[0] != baseCord[0] || cord[1] != baseCord[1])
    .map(cord => Math.atan2(cord[1] - baseCord[1], cord[0] - baseCord[0]));
    
    let tempCount = new Set(angles).size;

    if (tempCount > maxCount) {
        maxCount = tempCount;
    }
});

console.log(maxCount);



