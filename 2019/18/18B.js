const fs = require('fs');
let input = fs.readFileSync('input', 'utf8');

const GraphBuilder = require('../shared/GraphBuilder');
const SortedList = require('../shared/SortedList');
const Helpers = require('./Helpers');

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

const possibleKeys = (reachableKeySet, currentNodes, collectedKeys) => {

    let result = [];

    currentNodes.forEach((currentNode, robot) => {

        const reachableKeys = reachableKeySet[currentNode];
        Object.keys(reachableKeys)
        .forEach(key => {

            if (collectedKeys.has(key)) {
                return;
            }

            const {distance:distance, keys:requiredKeys} = reachableKeys[key];

            if (!requiredKeys.find(requiredKey => !collectedKeys.has(requiredKey))) {

                result.push([key, distance, robot]);
            }

        })

    })

    return result;

}

const shortestPathCache = new Map();
const findMinDistance = (reachableKeySet, currentNodes, pendingKeyCount, collectedKeys = new SortedList()) => {

    const cacheKey = '' + currentNodes + collectedKeys;

    if (shortestPathCache.has(cacheKey)) {

        return shortestPathCache.get(cacheKey);

    }

    if (pendingKeyCount == 0) {
        return 0;
    }

    let minDistance = Number.POSITIVE_INFINITY;
    pendingKeyCount--;

    possibleKeys(reachableKeySet, currentNodes, collectedKeys)
    .forEach(node => {
        
        const [key, dist, robot] = node;

        const prevState = currentNodes[robot];
        currentNodes[robot] = key;
        collectedKeys.add(key);

        const totalDist = dist + findMinDistance(reachableKeySet, currentNodes, pendingKeyCount, collectedKeys);

        collectedKeys.delete(key);
        currentNodes[robot] = prevState;

        if (totalDist < minDistance) {
            minDistance = totalDist;
        }

    });

    shortestPathCache.set(cacheKey, minDistance);

    return minDistance;

}

const ENTRY_POINTS = ['@', '^', '&', '*'];
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

const reachableKeySet = {};
Object.keys(graph)
.forEach(key => reachableKeySet[key] = Helpers.getReachableKeys(graph, key, [...ENTRY_POINTS]));

console.log(findMinDistance(reachableKeySet, ENTRY_POINTS, keyCount));
