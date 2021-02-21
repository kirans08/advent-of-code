const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

let grid = input.split('\n')
.map(row => row.split(''));

const findAdjacentBugCount = (r, c) => {

    const adjacentLocations = [
        [r-1, c],
        [r+1, c],
        [r, c-1],
        [r, c+1]
    ];


    return adjacentLocations.reduce((count, coord) => {

        const [r, c] = coord;

        if (!grid[r] || !grid[r][c] || grid[r][c] == '.') {
            return count;
        }

        return count + 1;

    }, 0)

}

const gridToString = grid => grid.map(row => row.join('')).join('');

const prevPatterns = new Map();
prevPatterns.set(gridToString(grid), true);

let repeatingPattern;
while(true) {

    const newPattern = grid.map(
        (row, rowInd) => row.map(
            (v, colInd) => {

                const bugCount = findAdjacentBugCount(rowInd, colInd);

                if (v == '#' && bugCount !== 1) {
                    return '.';
                }

                if (v == '.' && [1, 2].includes(bugCount)) {
                    return '#';
                }

                return v;

            }
        )
    );

    const newPatternString = gridToString(newPattern);

    if (prevPatterns.has(newPatternString)) {
        repeatingPattern = newPatternString;
        break;
    }

    prevPatterns.set(newPatternString, true);
    grid = newPattern;

}

const result = repeatingPattern.split('')
.reduce((result, cell, index) => {

    return cell == '.' ? result : (result + (1 << index));

}, 0);

console.log(result);
