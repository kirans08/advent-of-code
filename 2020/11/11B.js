const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var grid = input.split('\n').map(r => r.split(''));

var lookForSeatInDirection = (r, c, rd, cd) => {

    r = r+rd;
    c = c+cd;

    while(grid[r] && grid[r][c]) {

        if (grid[r][c] == '#') {
            return true;
        }

        if (grid[r][c] == 'L') {
            return false;
        }

        r = r+rd;
        c = c+cd;   

    }

    return false;
}

var countAdjacent = (r, c) => {
    
    var count = 0;

    lookForSeatInDirection(r, c, -1, -1) && count++;
    lookForSeatInDirection(r, c, -1, 0) && count++;
    lookForSeatInDirection(r, c, -1, +1) && count++;
    lookForSeatInDirection(r, c, 0, -1) && count++;
    lookForSeatInDirection(r, c, 0, +1) && count++;
    lookForSeatInDirection(r, c, +1, -1) && count++;
    lookForSeatInDirection(r, c, +1, 0) && count++;
    lookForSeatInDirection(r, c, +1, +1) && count++;

    return count;
}

var rowsChanged = true;

while(rowsChanged) {

    rowsChanged = false;
    var newGrid = [];

    grid.forEach((r, ri) => {

        newGrid.push(r.map((e, ci) => {

            var noOfAdj = countAdjacent(ri, ci);

            if (e == 'L' && noOfAdj == 0){
                rowsChanged = true;
                return '#';
            }

            if (e == '#' && noOfAdj >= 5){
                rowsChanged = true;
                return 'L';
            }

            return e;

        }))

    });

    grid = newGrid;

}

var result = grid.reduce(
    (count, row) => count + row.reduce(
        (rowCount, e) => rowCount + ((e == '#') ? 1 : 0)
    , 0)
, 0)

console.log(result);

