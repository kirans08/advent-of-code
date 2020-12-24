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

console.log(tileMap.size);