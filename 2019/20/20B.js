const fs = require('fs');
let input = fs.readFileSync('input', 'utf8');

const GraphBuilder = require('../shared/GraphBuilder');
const Helpers = require('./Helpers');

const addRecursionSuffix = (grid, corners) => {

    grid.forEach((row, rowInd) => {

        row.forEach((v, colInd) => {

            if (['.', '#', ' '].includes(v)) {
                return;
            }

            const suffix = isInside(corners, rowInd, colInd) ? '+' : '-';

            grid[rowInd][colInd] += suffix;

        })

    });

    return grid;

}

const isInside = (corners, rowInd, colInd) => {

    const [top, left, bottom, right] = corners;

    return rowInd > top && rowInd < bottom && colInd > left && colInd < right;

}

const findGridCorners = grid => {

    let top, left, bottom, right;

    grid.find(
        (row, rowInd) => row.find((v, colInd) => {

            if (!['.', '#'].includes(v)) {
                return false;
            }

            top = rowInd;
            left = colInd;
            return true;

        })
    );

    let temp = left;
    while(['.', '#'].includes(grid[top][++temp]));

    right = --temp;

    temp = top;
    while(['.', '#'].includes(grid[++temp][left]));

    bottom = --temp;

    return [top, left, bottom, right]

}

const processNode = node => /^(\w\w)(.)$/.exec(node).slice(1, 3);

const addWarpPoints = graph => {

    Object.entries(graph).forEach(([node, adjacents]) => {

        const [point, suffix] = processNode(node);
        const warpNode = point + (suffix == '+' ? '-' : '+');

        graph[warpNode] && (adjacents[warpNode] = 1);

    });

    return graph;

}


const findPath = (graph, start, end) => {

    const visited = new Map();
    const pending = [[start, 0, 0]];

    while(pending.length > 0) {

        const [node, baseDistance, level] = pending.shift();
        const [currentCell, currentCellSuffix] = processNode(node);

        if (level == 0 && node == end) {

            return baseDistance;

        }

        const key = node + level;

        if (visited.has(key)) {
            continue;
        }

        visited.set(key, true);

        const adjacents = graph[node];

        Object.entries(adjacents).forEach(([node, distance]) => {

            const [adjCell, adjCellSuffix] = processNode(node);
            let newLevel = level;

            if (adjCell == currentCell) {

                (currentCellSuffix == '+') ? newLevel++ : newLevel--;

            }

            if (newLevel < 0) {
                return;
            }

            pending.push([node, baseDistance + distance, newLevel]);

        });

    }

    return -1;

}


let grid = input.split('\n')
.map(row => row.split(''));

const corners = findGridCorners(grid);
grid = Helpers.preProcessGrid(grid);
grid = addRecursionSuffix(grid, corners);

let graph = (new GraphBuilder(grid)).build();
graph = addWarpPoints(graph);

console.log(findPath(graph, 'AA-', 'ZZ-'));
