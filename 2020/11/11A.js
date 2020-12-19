const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var grid = input.split('\n').map(r => r.split(''));

var countAdjacent = (r, c) => {
    
    var count = 0;

    grid[r-1] && grid[r-1][c-1] == '#' && count++;
    grid[r-1] && grid[r-1][c]   == '#' && count++;
    grid[r-1] && grid[r-1][c+1] == '#' && count++;
    grid[r]   && grid[r][c-1]   == '#' && count++;
    grid[r]   && grid[r][c+1]   == '#' && count++;
    grid[r+1] && grid[r+1][c-1] == '#' && count++;
    grid[r+1] && grid[r+1][c]   == '#' && count++;
    grid[r+1] && grid[r+1][c+1] == '#' && count++;

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

            if (e == '#' && noOfAdj >= 4){
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

