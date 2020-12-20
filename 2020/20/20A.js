const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

String.prototype.reverse = function () { return [...this].reverse().join(''); }

var boundaryMap = input.split('\n\n')
.reduce((boundaryMap, tile) => {

    var parts = tile.split('\n');
    var tileId = parts[0].slice(5, -1);

    [
        //Top, Right, Bottom, Left
        parts[1],
        parts.slice(1).reduce((result, row) => result + row.slice(-1), ''),
        parts[parts.length - 1],
        parts.slice(1).reduce((result, row) => result + row.slice(0,1), '')

    ].forEach(boundary => {

        var key = [boundary, boundary.reverse()].sort().join('');

        !boundaryMap[key] && (boundaryMap[key] = []);
        boundaryMap[key].push(tileId);

    })

    return boundaryMap;

}, {});


var idMap = new Map();

var result = Object.values(boundaryMap)
.filter(tiles => tiles.length === 1)
.map(tiles => tiles[0])
.filter(tileId => idMap.has(tileId) || !idMap.set(tileId,true))
.reduce((result, tileId) => result * tileId)

console.log(result);

