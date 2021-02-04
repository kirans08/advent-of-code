const fs = require('fs');
let input = fs.readFileSync('input', 'utf8');

const GraphBuilder = require('./GraphBuilder');

const getCacheKey = (currentNode, collectedKeys) => {

    return currentNode + [...collectedKeys].sort().toString();

}

const possibleKeyCache = new Map();
const possibleKeys = (graph, currentNode, collectedKeys = new Set()) => {

    const cacheKey = getCacheKey(currentNode, collectedKeys);
    if (possibleKeyCache.has(cacheKey)) {

        return possibleKeyCache.get(cacheKey);

    }

    let pending = [[currentNode, 0]];
    let visited = new Map();
    let result = [];

    while (pending.length > 0) {

        const [node, dist] = pending.shift();
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
            pending.push([node, pathDistance]);

            if (isDoor || collectedKeys.has(node) || node =='@') {
                return;
            }

            result.push([node, pathDistance]);

        })

    }


    possibleKeyCache.set(cacheKey, result);

    return result;

}

const shortestPathCache = new Map();

const findMinDistance = (graph, currentNode, pendingKeyCount, collectedKeys = new Set()) => {

    const cacheKey = getCacheKey(currentNode, collectedKeys);
    if (shortestPathCache.has(cacheKey)) {

        return shortestPathCache.get(cacheKey);

    }

    if (pendingKeyCount == 0) {
        return 0;
    }

    let minDistance = Number.POSITIVE_INFINITY;
    pendingKeyCount--;

    possibleKeys(graph, currentNode, collectedKeys)
    .forEach(node => {
        
        const [key, dist] = node;

        collectedKeys.add(key);
        const totalDist = dist + findMinDistance(graph, key, pendingKeyCount, collectedKeys);
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

console.log(findMinDistance(graph, '@', keyCount));

