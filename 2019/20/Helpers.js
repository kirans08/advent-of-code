const preProcessGrid = grid => {

    grid.forEach((row, rowInd) => {

        row.forEach((v, colInd) => {

            if (['.', '#', ' '].includes(v) || !_isAdjacentToMaze(grid, rowInd, colInd)) {
                return;
            }

            const prevRow = rowInd - 1;
            const nextRow = rowInd + 1;
            const prevCol = colInd - 1;
            const nextCol = colInd + 1;

            
            if (_isNode(grid, prevRow, colInd)) {

                grid[nextRow][colInd] = grid[prevRow][colInd] + v;
                grid[rowInd][colInd] = ' ';
                grid[prevRow][colInd] = ' ';

            }
            else if (_isNode(grid, rowInd, prevCol)) {

                grid[rowInd][nextCol] = grid[rowInd][prevCol] + v;
                grid[rowInd][colInd] = ' ';
                grid[rowInd][prevCol] = ' ';

            }
            else if (_isNode(grid, nextRow, colInd)) {

                grid[prevRow][colInd] = v + grid[nextRow][colInd];
                grid[rowInd][colInd] = ' ';
                grid[nextRow][colInd] = ' ';

            }
            else if (_isNode(grid, rowInd, nextCol)) {

                grid[rowInd][prevCol] = v + grid[rowInd][nextCol];
                grid[rowInd][colInd] = ' ';
                grid[rowInd][nextCol] = ' ';

            }

        })

    });

    return grid;

}

const _isAdjacentToMaze = (grid, x, y) => {

    return [
        [x-1, y],
        [x+1, y],
        [x, y-1],
        [x, y+1]
    ].find(coord => {

        const [x, y] = coord;

        return grid[x] && ['.', '#'].includes(grid[x][y]);

    })

}

const _isNode = (grid, x, y) => {

    return grid[x] && grid[x][y] && /^[A-Z]$/.test(grid[x][y]);

}


module.exports = {
    preProcessGrid: preProcessGrid
}