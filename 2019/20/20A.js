const fs = require('fs');
let input = fs.readFileSync('input', 'utf8');

const GraphBuilder = require('../shared/GraphBuilder');
const Helpers = require('./Helpers');

const findMinDistanceNode = (vertextDistances, visitedVertexes) => {

    let minDist = Number.POSITIVE_INFINITY;
    let result;

    Object.keys(vertextDistances).forEach(node => {

        if (!visitedVertexes.has(node) && vertextDistances[node].dist < minDist) {
            result = node;
            minDist = vertextDistances[node].dist;
        }

    })

    return result;

}

const dijikstras = (graph, start) => {


    const visitedVertexes = new Map();
    const vertextDistances = {};
    let count = Object.keys(graph).length;

    Object.keys(graph).forEach(node => {
        vertextDistances[node] = {
            dist: Number.POSITIVE_INFINITY,
            parent: null
        };
    });

    vertextDistances[start].dist = 0;

    while(count-- > 0) {

        const nextNode = findMinDistanceNode(vertextDistances, visitedVertexes);
        visitedVertexes.set(nextNode, true);

        const adjacents = graph[nextNode];
        const baseDistance = vertextDistances[nextNode].dist;

        Object.keys(adjacents).forEach(node => {

            const dist = adjacents[node] + baseDistance;

            if (dist < vertextDistances[node].dist) {
                vertextDistances[node] = {
                    dist: dist,
                    parent: nextNode
                }
            }

        })

    };

    return vertextDistances;

}

let grid = input.split('\n')
.map(row => row.split(''));

grid = Helpers.preProcessGrid(grid);
const graph = (new GraphBuilder(grid)).build();
const vertexDistances = dijikstras(graph, 'AA');

let node = vertexDistances['ZZ'];
let dist = node.dist;

while (node.parent != null) {

    dist++;
    node = vertexDistances[node.parent];

}

console.log(dist-1);