const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

let grid = new Map();
let lowerLevel = 0, upperLevel = 0;

const getKey = (level, r, c) => `${level}${r}${c}`;

const expandKeyRegex = pattern => {

    const result = [];
    let i = 0;

    while (i < 5) {
        result.push(pattern.replace('.', i++));
    }

    return result;

}

const getAdjacentLocationsAtCurrentLevel = (level, r, c) => {

    return [
        [r-1, c],
        [r+1, c],
        [r, c-1],
        [r, c+1]
    ].filter(coord => {

        const [r, c] = coord;

        return r >= 0 && r < 5 && c >= 0 && c < 5 && (r != 2 || c != 2);

    })
    .map(coord => getKey(level, ...coord));

}

const getAdjacentLocationsAtLowerLevel = (level, r, c) => {

    const key = getKey('', r, c);
    level--;

    return [
        ['12', '0.'],
        ['23', '.4'],
        ['32', '4.'],
        ['21', '.0'],
    ].filter(pattern => pattern[0] == key)
    .reduce((result, pattern) => {

        return result.concat(expandKeyRegex(level + pattern[1]));

    }, []);

}

const getAdjacentLocationsAtUpperLevel = (level, r, c) => {

    const key = getKey('', r, c);
    level++;

   return [
        [/0./, '12'],
        [/.4/, '23'],
        [/4./, '32'],
        [/.0/, '21'],
    ].filter(pattern => pattern[0].test(key))
    .map(pattern => level + pattern[1]);

}

const getAdjacentLocations = (level, r, c) => {

    return [].concat(
        getAdjacentLocationsAtCurrentLevel(level, r, c),
        getAdjacentLocationsAtLowerLevel(level, r, c),
        getAdjacentLocationsAtUpperLevel(level, r, c),
    )

}

const findAdjacentBugCount = (level, r, c) => {

    return getAdjacentLocations(level, r, c)
    .filter(key => grid.has(key))
    .length;


}

const processLevel  = level => {

    const result = [];

    for (let r = 0; r < 5; r++) {

        for (let c = 0; c < 5; c++) {

            if (r == 2 && c == 2) {
                continue;
            }

            const key = getKey(level, r, c);
            const isBug = grid.has(key);
            const adjBugCount = findAdjacentBugCount(level, r, c);

            // Bug dies if adjacent count is not one
            if (isBug && adjBugCount != 1) {
                continue;
            }
            // Space remains space if adjacent count is not one or two
            else if (!isBug && ![1, 2].includes(adjBugCount)) {                
                continue;
            }

            result.push(key);

        }

    }

    return result;

}

const resetLevels = () => {

    if([...grid.keys()].find(key => key.startsWith(lowerLevel))) {
        lowerLevel--;
    }

    if([...grid.keys()].find(key => key.startsWith(upperLevel))) {
        upperLevel++;
    }

}

const processLevels = () => {

    let newGrid = new Map();
    resetLevels();

    for (var i = lowerLevel; i <= upperLevel; i++) {

        processLevel(i)
        .forEach(key => newGrid.set(key, true));

    }

    grid = newGrid;

}

input.split('\n')
.map(row => row.split(''))
.forEach(
    (row, rowInd) => row.forEach(
        (v, colInd) => {

            if (v != '#') {
                return;
            }

            grid.set(getKey(0, rowInd, colInd), true);

        }
    )
);

let i = 0;
while(i++ < 200) {
    processLevels();
}

console.log(grid.size);
