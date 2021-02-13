const fs = require('fs');
let input = fs.readFileSync('input', 'utf8');

const GraphBuilder = require('../shared/GraphBuilder');
const SortedList = require('../shared/SortedList');
const Helpers = require('./Helpers');

const possibleKeys = (reachableKeySet, currentNode, collectedKeys) => {

    const result = [];
    const reachableKeys = reachableKeySet[currentNode];

    Object.keys(reachableKeys)
    .forEach(key => {

        if (collectedKeys.has(key)) {
            return;
        }

        const {distance:distance, keys:requiredKeys} = reachableKeys[key];

        if (!requiredKeys.find(requiredKey => !collectedKeys.has(requiredKey))) {
            result.push([key, distance]);
        }

    })

    return result;

}

const shortestPathCache = new Map();
const findMinDistance = (reachableKeySet, currentNode, pendingKeyCount, collectedKeys = new SortedList()) => {

    const cacheKey = '' + currentNode + collectedKeys;
    if (shortestPathCache.has(cacheKey)) {

        return shortestPathCache.get(cacheKey);

    }

    if (pendingKeyCount == 0) {
        return 0;
    }

    let minDistance = Number.POSITIVE_INFINITY;
    pendingKeyCount--;

    possibleKeys(reachableKeySet, currentNode, collectedKeys)
    .forEach(node => {
        
        const [key, dist] = node;

        collectedKeys.add(key);
        const totalDist = dist + findMinDistance(reachableKeySet, key, pendingKeyCount, collectedKeys);
        collectedKeys.delete(key);

        if (totalDist < minDistance) {
            minDistance = totalDist;
        }

    });

    shortestPathCache.set(cacheKey, minDistance);

    return minDistance;

}

const grid = input.split('\n')
.map(row => row.split(''));

const graph = (new GraphBuilder(grid)).build();
const keyCount = Object.keys(graph)
.filter(node => /^[a-z]$/.test(node))
.length;

const reachableKeySet = {};
Object.keys(graph)
.forEach(key => reachableKeySet[key] = Helpers.getReachableKeys(graph, key, ['@']));

console.log(findMinDistance(reachableKeySet, '@', keyCount));
