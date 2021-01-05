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

let baseX, baseY, maxCount = 0;

cords.forEach(baseCord => {

    let angles = cords
    .filter(cord => cord[0] != baseCord[0] || cord[1] != baseCord[1])
    .map(cord => Math.atan2(cord[1] - baseCord[1], cord[0] - baseCord[0]));
    
    let tempCount = new Set(angles).size;

    if (tempCount > maxCount) {
        maxCount = tempCount;
        baseX = baseCord[0];
        baseY = baseCord[1];
    }
});

let astroidMap = cords.filter(cord => cord[0] != baseX || cord[1] != baseY)
.map(cord => {

    let xdiff = cord[0] - baseX;
    let ydiff = cord[1] - baseY;
    let angle = Math.atan2(xdiff, ydiff) - 90;

    if (angle < 0) {
        angle += 360;
    }

    angle = 360 - angle;

    let dist = Math.sqrt(xdiff*xdiff + ydiff*ydiff);

    return {
        x: cord[0],
        y: cord[1],
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
