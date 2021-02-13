const fs = require('fs');
let input = fs.readFileSync('input', 'utf8');

const GraphBuilder = require('../shared/GraphBuilder');
const SortedList = require('../shared/SortedList');

const getCacheKey = (currentNode, collectedKeys) => {

    return '' + currentNode + collectedKeys;

}

const isDoor = node => /^[A-Z]$/.test(node);

const possibleKeys = (spTreeSet, currentNode, collectedKeys) => {

    const result = [];
    const spTree = spTreeSet[currentNode];

    Object.keys(spTree)
    .forEach(node => {

        if (node == currentNode || isDoor(node) || collectedKeys.has(node) || node == '@') {
            return;
        }

        const {distance:distance, keys:requiredKeys} = spTree[node];

        if (!requiredKeys.find(key => !collectedKeys.has(key))) {

            result.push([node, distance]);
        }

    })

    return result;

}

const shortestPathCache = new Map();
const findMinDistance = (spTreeSet, currentNode, pendingKeyCount, collectedKeys = new SortedList()) => {

    const cacheKey = getCacheKey(currentNode, collectedKeys);
    if (shortestPathCache.has(cacheKey)) {

        return shortestPathCache.get(cacheKey);

    }

    if (pendingKeyCount == 0) {
        return 0;
    }

    let minDistance = Number.POSITIVE_INFINITY;
    pendingKeyCount--;

    possibleKeys(spTreeSet, currentNode, collectedKeys)
    .forEach(node => {
        
        const [key, dist] = node;

        collectedKeys.add(key);

        const totalDist = dist + findMinDistance(spTreeSet, key, pendingKeyCount, collectedKeys);

        collectedKeys.delete(key);

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

    return shortestPathTree;

}

const grid = input.split('\n')
.map(row => row.split(''));

const graph = (new GraphBuilder(grid)).build();
const keyCount = Object.keys(graph)
.filter(node => /^[a-z]$/.test(node))
.length;

const spTreeSet = {};
Object.keys(graph)
.forEach(key => spTreeSet[key] = dijikstras(graph, key));


console.log(findMinDistance(spTreeSet, '@', keyCount));

