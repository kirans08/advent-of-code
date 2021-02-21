const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');
const IntcodeComputer = require('../shared/IntcodeComputer');

const program = input.split(',').map(Number);
const droid = new IntcodeComputer(program);

const map = {};
const pathStack = [];

const getKey = (x, y) => `${x}.${y}`;

const setTile = (x, y, tile) => {
    map[getKey(x, y)] = tile;
}

const getTile = (x, y) => map[getKey(x, y)];

const isVisited = (x, y) => getTile(x, y) !== undefined;

const isPath = (x, y) => getTile(x, y) == 1;

const getNextDir = (x, y) => {

    return !isVisited(x, y+1) ? 1 :
    !isVisited(x, y-1) ? 2 :
    !isVisited(x-1, y) ? 3 :
    !isVisited(x+1, y) ? 4 : false;

}

const getNewCoordinates = (tx, ty, dir) => {

    switch(dir) {

        case 1:
            ty++;
            break;

        case 2:
            ty--;
            break;

        case 3:
            tx--;
            break;

        case 4:
            tx++;
            break;

    }

    return [tx, ty];

}

const getReverseDir = dir => {

    switch(dir) {
        case 1: return 2;
        case 2: return 1;
        case 3: return 4;
        case 4: return 3;
    }

}

const getAdjacentTiles = (x, y) => {

    return [
        [x+1, y],
        [x-1, y],
        [x, y+1],
        [x, y-1]
    ];

}


const getBfsDepth = (x, y) => {

    let queue = [[x,y]];
    let depth = -1;

    while(queue.length != 0) {

        const temp = [];
        queue.forEach(coord => {

            getAdjacentTiles(...coord)
            .filter(adjCoord => isPath(...adjCoord))
            .forEach(adjCoord => {

                setTile(...adjCoord, 'O');
                temp.push(adjCoord)

            })

        });

        queue = temp;
        depth++;

    }

    return depth;

}

let x = 0, y = 0;
let dir, backTrack, tile, tx, ty;

setTile(x, y, 1);

do {

    dir = getNextDir(x, y) || pathStack.pop();
    backTrack = !getNextDir(x, y);

    droid.input(dir);
    tile = droid.output();

    ([tx, ty] = getNewCoordinates(x, y, dir));
    setTile(tx, ty, tile);

    if (tile == 0) {
        continue;
    }

    !backTrack && pathStack.push(getReverseDir(dir));
    [x, y] = [tx, ty];

} while(tile != 2);

console.log(pathStack.length);  // Part 1
console.log(getBfsDepth(x, y)); // Part 2
