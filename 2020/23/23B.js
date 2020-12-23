const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const LIMIT = 1000000;
const MOVES = 10000000;

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {

    constructor(values) {

        this.head = null;
        this.hash = new Map();

        this._addValues(values)

    }

    _addValues(values) {

        let node, prev;

        values.forEach(value => {

            node = new Node(value);
            this.hash.set(value, node);

            if (this.head === null) {
                this.head = node;
                node.next = node;
                prev = node;
                return;
            }

            prev.next = node;
            prev = node;

        });

        prev.next = this.head;

    }

    get(value) {

        return this.hash.get(value);

    }
}

const cups = input.split('').map(Number);

let i=cups.length + 1;
while(i <= LIMIT) {
    cups.push(i++);
}

const cupList = new LinkedList(cups);

let currentNode = cupList.head;
i = 0;

while(i++ < MOVES) {

    let destinationValue = (currentNode.value - 1) || LIMIT;

    let pickupValues = [];
    let pickupStart = currentNode.next;
    let pickupEnd = currentNode;

    let j = 0;
    while (j++ < 3) {
        pickupEnd = pickupEnd.next;
        pickupValues.push(pickupEnd.value);
    }

    while(pickupValues.indexOf(destinationValue) != -1) {
        destinationValue = (destinationValue - 1) || LIMIT;
    }

    const destinationNode = cupList.get(destinationValue);

    currentNode.next = pickupEnd.next;
    pickupEnd.next = destinationNode.next;
    destinationNode.next = pickupStart;

    currentNode = currentNode.next;

}

const nodeOne = cupList.get(1);
const result = (nodeOne.next.value * nodeOne.next.next.value);

console.log(result);
