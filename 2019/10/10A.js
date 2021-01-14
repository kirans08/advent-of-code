const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const coords = [];

input.split('\n')
.map(row => row.split(''))
.forEach((row, r) => {

    row.forEach((v, c) => {

        if (v == '.') {
            return;
        }

        coords.push([c,r]);

    })

});

let maxCount = 0;

coords.forEach(baseCoord => {

    let angles = coords
    .filter(coord => coord[0] != baseCoord[0] || coord[1] != baseCoord[1])
    .map(coord => Math.atan2(coord[1] - baseCoord[1], coord[0] - baseCoord[0]));
    
    let tempCount = new Set(angles).size;

    if (tempCount > maxCount) {
        maxCount = tempCount;
    }
});

console.log(maxCount);



