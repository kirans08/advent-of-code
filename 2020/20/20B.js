const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

String.prototype.reverse = function () { return [...this].reverse().join(''); }

const EDGES = ['t', 'r', 'b', 'l'];
const INV_EDGE = {
    t:'b',
    b:'t',
    r:'l',
    l:'r'
};
const monsterTemplate = 
`                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `;


var boundaryMap = new Map();
var positionFixedTiles = new Map();
var tiles, merged, monsterOffsets;

const addBoundary = (id, boundary) => {

    var key = [boundary, boundary.reverse()].sort().join('');

    if (!boundaryMap.has(key))
        boundaryMap.set(key, []);

    boundaryMap.get(key).push(id);

}

const getPossibleTilesForBoundary = (boundary) => {
    
    var key = [boundary, boundary.reverse()].sort().join('');

    return boundaryMap.get(key);

}

const initTiles = () => {

    tiles = input.split('\n\n').reduce((result, tile) => {

        var parts = tile.split('\n');
        var id = parts[0].slice(5, -1);

        result[id] = {
            i: id,
            t: parts[1],
            r: parts.slice(1).reduce((result, row) => result + row.slice(-1), ''),
            b: parts[parts.length - 1].reverse(),
            l: parts.slice(1).reduce((result, row) => result + row.slice(0,1), '').reverse(),
            c: parts.slice(2, -1).map(row => row.slice(1,-1).split('')),
            x: 0,
            y: 0
        };

        //Top, Right, Bottom, Left
        addBoundary(id, result[id].t);
        addBoundary(id, result[id].r);
        addBoundary(id, result[id].b);
        addBoundary(id, result[id].l);

        return result;

    }, {});

}

const checkBoundary = (tileId, boundary) => {

    var tile = tiles[tileId]
    var result = EDGES.find(
        e => (boundary == tile[e]) || (boundary.reverse() == tile[e])
    )

    if (!result) {
        return false;
    }

    return {
        id: tileId,
        edge: result,
        isReverse: (boundary == tile[result])
    };

}

const findAdjacentTile = (boundary) => {

    var result = '';

    getPossibleTilesForBoundary(boundary)
    .filter(tileId => !positionFixedTiles.has(tileId))
    .find(tileId => !!(result = checkBoundary(tileId, boundary)))

    return result;

}

const setAdjacentTile = (baseX, baseY, position, tileId) => {

    var tile = tiles[tileId];

    tile.x = baseX;
    tile.y = baseY;

    switch(position) {

        case 't':
            tile.y++;
            break;

        case 'r':
            tile.x++;
            break;

        case 'b':
            tile.y--;
            break;

        case 'l':
            tile.x--;
            break;

    }

    positionFixedTiles.set(tileId, true);

}

const rotateTile = (tileId, currentEdge, targetEdge) => {

    var turns = ((EDGES.indexOf(targetEdge) - EDGES.indexOf(currentEdge)) + EDGES.length) % EDGES.length; 
    var tile  = tiles[tileId];
    var tileT = tile.t;
    var tileR = tile.r;
    var content = tile.c;

    switch(turns) {

        case 1:
            tile.t = tile.l;
            tile.l = tile.b;
            tile.b = tile.r;
            tile.r = tileT;
            tile.c = content[0].map((col, c) => content.map((row, r) => content[r][c]).reverse());
            break;

        case 2:
            tile.t = tile.b;
            tile.b = tileT;
            tile.r = tile.l;
            tile.l = tileR;
            tile.c = content.map((row, r) => content[row.length-r-1].reverse());
            break;

        case 3:
            tile.t = tile.r;
            tile.r = tile.b;
            tile.b = tile.l;
            tile.l = tileT;
            tile.c = content[0].map((col, c) => content.map((row, r) => content[r][content.length-c-1]));
            break;

    }

}

const flipTile = (tileId, targetEdge)  => {

    var tile = tiles[tileId];
    var tileT = tile.t;
    var tileR = tile.r;
    var len = tile.c.length;

    switch (targetEdge) {

        case 't':
        case 'b':
            tile.r = tile.l.reverse();
            tile.l = tileR.reverse();
            tile.t = tile.t.reverse();
            tile.b = tile.b.reverse();
            tile.c = tile.c.map(row => row.reverse())
            break;

        case 'l':
        case 'r':
            tile.t = tile.b.reverse();
            tile.b = tileT.reverse();
            tile.r = tile.r.reverse();
            tile.l = tile.l.reverse();
            tile.c = tile.c.map((row,r) => tile.c[tile.c.length-r-1])
            break;

    }

}

const positionTiles = () => {

    var tile1 = Object.keys(tiles)[0];
    var pending = [tile1];
    positionFixedTiles.set(tile1, true);

    while(pending.length > 0) {

        var nextId = pending.shift();
        var tile = tiles[nextId];

        EDGES.forEach(edge => {

            var match = findAdjacentTile(tile[edge]);

            if (!match) {
                return true;
            }
        
            var targetEdge = INV_EDGE[edge];

            setAdjacentTile(tile.x, tile.y, edge, match.id);
            rotateTile(match.id, match.edge, targetEdge);
            match.isReverse && flipTile(match.id, targetEdge);

            pending.push(match.id);

        });

    }
}

const mergeTiles = () => {

    var x = [], y = [], grid = {}, base = 0;
    merged = [];

    Object.values(tiles).forEach(tile => {

        x.push(tile.x);
        y.push(tile.y);

        grid[`${tile.x}.${tile.y}`] = tile.i;

    });

    var minX = Math.min(...x),
        maxX = Math.max(...x),
        minY = Math.min(...y),
        maxY = Math.max(...y);

    for(var i = maxY; i >= minY; i--) {

        for(var j = minX; j <= maxX; j++) {

            var tileId  = grid[`${j}.${i}`];
            var content = tiles[tileId].c;

            content.forEach((r,ind) => {

                if (!merged[base+ind]) {
                    merged[base+ind] = [];
                }

                merged[base+ind] = merged[base+ind].concat(r);

            });

        }

       base+=8;

    }

}



const initMonsterOffsets = () => {

    monsterOffsets = [];

    monsterTemplate.split('\n')
    .forEach((row, r) => {
        row.split('').forEach((v, c) => {
            (v=='#') && monsterOffsets.push({x:r-1,y:c})
        })
    })

}


const searchForMonster = () => {

    var mergedLen = merged.length;
    var c = 0;

    for (var i=1; i< mergedLen-1; i++) {

        for (var j=0; j< mergedLen; j++) {

            var result = monsterOffsets.find(offset => merged[i+offset.x][j+offset.y] !== '#');

            if (!result) {
                monsterOffsets.forEach(offset => {
                    merged[i+offset.x] && merged[i+offset.x][j+offset.y] && (merged[i+offset.x][j+offset.y] = '0');
                });
                c++;
            }

        }
    }

    return c;

}

const findMonsterCount = () => {

    var i=0;

    while (i++ < 8) {

        var result = searchForMonster();

        if (result > 0) {
            break;
        }

        merged = merged[0].map((col, c) => merged.map((row, r) => merged[r][c]).reverse())

        if (i == 4) {
            merged = merged.map(row => row.reverse());
        }


    }

    return result;

}

const getWaterRoughness = () => {

    var totalArea = merged.map(row => row.join('')).join('').match(/#/g).length;
    var monsterArea = monsterTemplate.match(/#/g).length * findMonsterCount();

    return totalArea - monsterArea;

}

const solve = () => {

    initTiles()
    positionTiles();
    mergeTiles();
    initMonsterOffsets();

    console.log(getWaterRoughness());

}

solve();
