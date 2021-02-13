const fs = require('fs');
let input = fs.readFileSync('input', 'utf8');

const GraphBuilder = require('./GraphBuilder');

// Part 2 Input transformation
input = input.replace(`
#.........#.................#...#...#.......#.................#.#.....#.#.......#
#######################################.@.#######################################
#.......#.................#...............#.....#...........#.........#...#.....#`,
`
#.........#.................#...#...#..@#@..#.................#.#.....#.#.......#
#################################################################################
#.......#.................#............@#@#.....#...........#.........#...#.....#`
);

const ENTRY_POINTS = ['@', '^', '&', '*'];

const getCacheKey = (currentNodes, collectedKeys) => {

    return [...currentNodes].toString() + '-' + [...collectedKeys].sort().toString();

}

const possibleKeys = (graph, currentNodes, collectedKeys = new Set()) => {

    let pending = currentNodes.map((node, index) => [node, 0, index]);
    let visited = new Map();
    let result = [];

    while (pending.length > 0) {

        const [node, dist, robot] = pending.shift();
        const adjacents = graph[node];

        Object.keys(adjacents).forEach(node => {

            const isDoor = /^[A-Z]$/.test(node);
            if (isDoor && !collectedKeys.has(node.toLowerCase())) {
                return;
            }

            if (visited.has(node)) {
                return;
            }

            const pathDistance = dist + adjacents[node];
            visited.set(node, true);
            pending.push([node, pathDistance, robot]);

            if (isDoor || collectedKeys.has(node) || ENTRY_POINTS.includes(node)) {
                return;
            }

            result.push([node, pathDistance, robot]);

        })

    }

    return result;

}

const shortestPathCache = new Map();

const findMinDistance = (graph, currentNodes, pendingKeyCount, collectedKeys = new Set()) => {

    const cacheKey = getCacheKey(currentNodes, collectedKeys);
    if (shortestPathCache.has(cacheKey)) {

        return shortestPathCache.get(cacheKey);

    }

    if (pendingKeyCount == 0) {
        return 0;
    }

    let minDistance = Number.POSITIVE_INFINITY;
    pendingKeyCount--;

    possibleKeys(graph, currentNodes, collectedKeys)
    .forEach(node => {
        
        const [key, dist, robot] = node;

        const currentNodesNextState = [...currentNodes];
        currentNodesNextState[robot] = key;

        collectedKeys.add(key);
        const totalDist = dist + findMinDistance(graph, currentNodesNextState, pendingKeyCount, collectedKeys);
        collectedKeys.delete(key);

        if (totalDist < minDistance) {
            minDistance = totalDist;
        }


    });

    shortestPathCache.set(cacheKey, minDistance);

    return minDistance;

}


const updateEntryPoints = grid => {

    const newEntryPoints = [...ENTRY_POINTS];

    return grid.map(row => row.map(cell => {

        return cell != '@' ? cell : newEntryPoints.shift();

    }))

}

let grid = input.split('\n')
.map(row => row.split(''));

grid = updateEntryPoints(grid);

const graph = (new GraphBuilder(grid)).build();
const keyCount = Object.keys(graph)
.filter(node => /^[a-z]$/.test(node))
.length;

// Needs Optimisation to reduce running time
console.log(findMinDistance(graph, [...ENTRY_POINTS], keyCount));

