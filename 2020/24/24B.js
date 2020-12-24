const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const tileMap = new Map();
const dirOffsetMap = {
    'e' : [2,0],
    'w' : [-2,0],
    'a' : [1,1],
    'b' : [-1,1],
    'c' : [1,-1],
    'd' : [-1,-1],
}

const filpTile = (x,y) => {

    const key = `${x}.${y}`;
    tileMap.has(key) ? tileMap.delete(key) : tileMap.set(key, true)

}

input.split('\n')
.map(row => row
    .replace(/ne/g, 'a')
    .replace(/nw/g, 'b')
    .replace(/se/g, 'c')
    .replace(/sw/g, 'd')
    .split('')
)
.forEach(row => {

    const coord = row.reduce((res, dir) => {

        res[0] += dirOffsetMap[dir][0];
        res[1] += dirOffsetMap[dir][1];

        return res;

    }, [0,0])

    filpTile(coord[0], coord[1]);

})

let i=0;
while(i++ < 100) {

    const retainedBlackTiles = [];
    const whiteTileAdjCountMap = {};

    [...tileMap.keys()].forEach(coord => {

        let parts = coord.split('.');

        let x = +parts[0];
        let y = +parts[1];
        let c = 0;

        Object.values(dirOffsetMap).forEach(offset => {

            const key = `${x+offset[0]}.${y+offset[1]}`;

            if (tileMap.has(key)) {
                c++;
            } else {
                whiteTileAdjCountMap[key] ? whiteTileAdjCountMap[key]++ : (whiteTileAdjCountMap[key] = 1);
            }

        });

        if (c == 1 || c == 2) {
            retainedBlackTiles.push(`${x}.${y}`);
        }

    });

    tileMap.clear();
    retainedBlackTiles.forEach(key => tileMap.set(key, true));

    Object.keys(whiteTileAdjCountMap)
    .filter(key => whiteTileAdjCountMap[key] == 2)
    .forEach(key => tileMap.set(key, true))

}

console.log(tileMap.size);