
const isDoor = node => /^[A-Z]$/.test(node);

/**
 * Returns the next node to visit for dijikstras algorithm
 */
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

/**
 * Returns a shortest path tree for provided graph from start node.
 * The required keys to reach a node are also returned.
 */
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

    return shortestPathTree;

}

/**
 * Returns a object with all the keys that can be collected from start node
 * with the list of other keys that are required to reach them
 */
const getReachableKeys = (graph, start, excludeList = []) => {

    const result = {};
    excludeList.push(start);

    const shortestPathTree = dijikstras(graph, start);

    // Filter out unreachable nodes, doors and other nodes to exclude
    Object.entries(shortestPathTree)
    .forEach(([node, properties]) => {

        if (properties.distance < Number.POSITIVE_INFINITY && !isDoor(node) && !excludeList.includes(node)) {
            result[node] = properties;
        }

    });

    return result;

}

module.exports = {
    getReachableKeys: getReachableKeys
};