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

let baseX, baseY, maxCount = 0;

coords.forEach(baseCoord => {

    let angles = coords
    .filter(coord => coord[0] != baseCoord[0] || coord[1] != baseCoord[1])
    .map(coord => Math.atan2(coord[1] - baseCoord[1], coord[0] - baseCoord[0]));
    
    let tempCount = new Set(angles).size;

    if (tempCount > maxCount) {
        maxCount = tempCount;
        baseX = baseCoord[0];
        baseY = baseCoord[1];
    }
});

let astroidMap = coords.filter(coord => coord[0] != baseX || coord[1] != baseY)
.map(coord => {

    let xdiff = coord[0] - baseX;
    let ydiff = coord[1] - baseY;
    let angle = Math.atan2(xdiff, ydiff) - 90;

    if (angle < 0) {
        angle += 360;
    }

    angle = 360 - angle;

    let dist = Math.sqrt(xdiff*xdiff + ydiff*ydiff);

    return {
        x: coord[0],
        y: coord[1],
        angle: angle,
        dist: dist
    }
})
.sort((astroid1, astroid2) => {

    if (astroid1.angle != astroid2.angle) {
        return astroid1.angle - astroid2.angle;
    }

    return astroid1.dist - astroid2.dist;

});

let angleMap = {};

astroidMap = astroidMap.map(astroid => {

    if (!angleMap[astroid.angle]) {
        angleMap[astroid.angle] = 0;
    }

    angleMap[astroid.angle]++;
    astroid.angle *= angleMap[astroid.angle];

    return astroid;

})
.sort((astroid1, astroid2) => astroid1.angle - astroid2.angle);

const result = astroidMap[199].x * 100 + astroidMap[199].y

console.log(result);
