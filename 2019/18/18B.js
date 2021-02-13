const fs = require('fs');
let input = fs.readFileSync('input', 'utf8');

const GraphBuilder = require('../shared/GraphBuilder');
const SortedList = require('../shared/SortedList');

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

    return currentNodes + '-' + collectedKeys;

}

const isDoor = node => /^[A-Z]$/.test(node);

const possibleKeys = (spTreeSet, currentNodes, collectedKeys) => {

    let result = [];

    currentNodes.forEach((currentNode, robot) => {

        const spTree = spTreeSet[currentNode];
        Object.keys(spTree)
        .forEach(node => {

            if (node == currentNode || isDoor(node) || collectedKeys.has(node) || ENTRY_POINTS.includes(node)) {
                return;
            }

            const {distance:distance, keys:requiredKeys} = spTree[node];

            if (!requiredKeys.find(key => !collectedKeys.has(key))) {

                result.push([node, distance, robot]);
            }

        })

    })

    return result;

}

const shortestPathCache = new Map();

const findMinDistance = (spTreeSet, currentNodes, pendingKeyCount, collectedKeys = new SortedList()) => {

    const cacheKey = getCacheKey(currentNodes, collectedKeys);

    if (shortestPathCache.has(cacheKey)) {

        return shortestPathCache.get(cacheKey);

    }

    if (pendingKeyCount == 0) {
        return 0;
    }

    let minDistance = Number.POSITIVE_INFINITY;
    pendingKeyCount--;

    possibleKeys(spTreeSet, currentNodes, collectedKeys)
    .forEach(node => {
        
        const [key, dist, robot] = node;

        const prevState = currentNodes[robot];
        currentNodes[robot] = key;
        collectedKeys.add(key);

        const totalDist = dist + findMinDistance(spTreeSet, currentNodes, pendingKeyCount, collectedKeys);

        collectedKeys.delete(key);
        currentNodes[robot] = prevState;


        if (totalDist < minDistance) {
            minDistance = totalDist;
        }

    });

    shortestPathCache.set(cacheKey, minDistance);

    return minDistance;

}

const findNextUnvisitedNode = (shortestPathTree, visitedVertexes) => {

    let minDist = Number.POSITIVE_INFINITY;
    let result;

    Object.keys(shortestPathTree).forEach(node => {

        if (!visitedVertexes.has(node) && shortestPathTree[node].distance < minDist) {
            result = node;
            minDist = shortestPathTree[node].distance;
        }

    })

    return result;

}

const dijikstras = (graph, start) => {

    const visitedVertexes = new Map();
    const shortestPathTree = {};
    let count = Object.keys(graph).length;

    Object.keys(graph).forEach(node => {
        shortestPathTree[node] = {
            distance: Number.POSITIVE_INFINITY,
            keys: []
        };
    });

    shortestPathTree[start].distance = 0;

    while(count-- > 0) {

        const currentNode = findNextUnvisitedNode(shortestPathTree, visitedVertexes);

        if (!currentNode) {
            break;
        }

        visitedVertexes.set(currentNode, true);

        const adjacentNodes = graph[currentNode];
        const baseDistance  = shortestPathTree[currentNode].distance;
        const baseKeys = shortestPathTree[currentNode].keys;

        Object.keys(adjacentNodes).forEach(node => {

            const distance = adjacentNodes[node] + baseDistance;

            if (distance < shortestPathTree[node].distance) {
                shortestPathTree[node] = {
                    distance: distance,
                    keys: isDoor(currentNode) ? baseKeys.concat(currentNode.toLowerCase()) : baseKeys
                }

            }

        })

    };

    const result = {};
    
    // Filter unreachable keys
    Object.entries(shortestPathTree)
    .forEach(([key, node]) => {

        if (node.distance < Number.POSITIVE_INFINITY) {
            result[key] = node;
        }

    });

    return result;

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

const spTreeSet = {};
Object.keys(graph)
.forEach(key => spTreeSet[key] = dijikstras(graph, key));

console.log(findMinDistance(spTreeSet, [...ENTRY_POINTS], keyCount));
