const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const rows = input.split('\n')
.map(row => row.split(','));

const distModifier = {
    L: -1,
    R: 1,
    U: 1,
    D: -1
}

const getLines = path => {

    const result = {
        h: [],
        v: []
    };
    let x = 0, y = 0, totalDist = 0;

    path.forEach(line => {

        line = /^([LRUD])(\d+)$/.exec(line);

        let dir = line[1];
        let dist = +line[2] * distModifier[dir];

        switch(dir) {

            case 'R':
            case 'L':
                result.h.push([y, [x, x+dist], totalDist]);
                x += dist;
                break;

            case 'U':
            case 'D':
                result.v.push([x, [y, y+dist], totalDist]);
                y += dist;
                break;

        }

        totalDist += +line[2];

    });

    return result;

}

const isInBetween = (value, range1, range2) => {

    return value >= Math.min(range1, range2) && value <= Math.max(range1, range2);

}

const getMinDistance = (horizontalLines, verticalLines) => {

    let i = 0;
    let result = [];
    while(i < horizontalLines.length) {

        let horizontalLine = horizontalLines[i];
        let j=0;

        while (j < verticalLines.length) {

            let verticalLine = verticalLines[j];
            j++;

            if (horizontalLine[0] == 0 && verticalLine[0] == 0) {
                continue;
            }

            if (isInBetween(horizontalLine[0], ...verticalLine[1]) && isInBetween(verticalLine[0],...horizontalLine[1])) {
                result.push(Math.abs(horizontalLine[0]) + Math.abs(verticalLine[0]));
            }

        }

        i++;
    }

    return Math.min(...result);
}

let lines1 = getLines(rows[0]);
let lines2 = getLines(rows[1]);

let result = Math.min(getMinDistance(lines1.h, lines2.v), getMinDistance(lines2.h, lines1.v));

console.log(result);

