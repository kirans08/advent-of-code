const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');
const AsciiComputer = require('../shared/AsciiComputer');

const program = input.split(',').map(Number);
const droid = new AsciiComputer(program);

const map = {};
let currentRoom, currentDoor, items = [];

const doorInverse = {
    east: 'west',
    south: 'north',
    west: 'east',
    north: 'south'
};

const blackListedItems = [
    'giant electromagnet',
    'infinite loop',
    'photons',
    'escape pod',
    'molten lava',
];

const getOptions = (output, startIndex) => {

    const result = [];

    while(true) {

        const row = output[startIndex++];

        if (!row || !row.startsWith('-')) {
            break;
        }

        result.push(row.slice(2));

    }

    return result;

}

const processOutput = output => {

    output = output
    .filter(row => row !== '')
    .map(row => row.trim());

    processRoom(output);

}

const processRoom = (output) => {

    const roomIdRegex = /^== (.*) ==$/;

    if (!roomIdRegex.test(output[0])) {
        return;
    }

    const id = roomIdRegex.exec(output[0])[1];

    if (currentRoom) {
        currentRoom.visited.set(currentDoor, true)
    }

    if (map[id]) {
        currentRoom = map[id];
        return;
    }

    currentRoom = addRoom(id, output);

}

const addRoom = (id, output) => {

    const room = {};

    if (currentDoor) {
        room.entry = doorInverse[currentDoor];
    }

    room.id = id;
    room.desc = output[1];

    const doorIndex = output.indexOf('Doors here lead:') + 1;
    room.doors = getOptions(output, doorIndex);
    room.visited = new Map();

    const itemIndex = output.indexOf('Items here:') + 1;
    room.items = getOptions(output, itemIndex).filter(item => !blackListedItems.includes(item));

    items = items.concat(room.items);

    map[id] = room;

    return room;

}

const getUnvisitedDoor = () => {

    const doors = currentRoom.doors;
    const visited = currentRoom.visited;

    if (doors.length == visited.size) {
        console.log("NO UNVISITED DOORS");
        return false;
    }

    let door = doors.find(
        door => !visited.has(door) && door !== currentRoom.entry
    );

    // Fallback to Entry door 
    if (!door) {
        door = currentRoom.entry;
    }

    currentDoor = door;

    return door;

}

const hasUnpickedItems    = () => currentRoom.items.length > 0;

const getNextUnpickedItem = () => currentRoom.items.shift();

const getNextInput = () => {

    if (hasUnpickedItems()) {
        return 'take ' + getNextUnpickedItem();
    }

    return getUnvisitedDoor();

}

const droidOutput = () => {

    const maxEmptyLines = 5;
    let c = 0;

    let outputBuffer = [];
    while(true) {

        output = droid.output();
        outputBuffer.push(output);
        console.log(output);

        output == '' ? c++ : (c = 0);

        if (output == 'Command?' || c > maxEmptyLines) {
            break;
        }
    }

    return outputBuffer;

}

const droidInput = input => {
    
    console.log(input);
    droid.input(input);

}

while(true) {

    processOutput(droidOutput());
    const command = getNextInput();

    if (currentRoom.id == 'Security Checkpoint') {
        break;
    }

    droidInput(command);

}

// Droid is at Security Checkpoint

let inventory = new Set(items)
let inventoryValues = inventory.values();
let currentItem = inventoryValues.next().value;

// Keeping one item constant try different combinations
while (true) {

    droidInput(currentDoor);
    const output = droidOutput().join('');

    if (!output.includes('ejected')) {
        break;
    }

    // If droid is expected to be heavier then the current Item can be dropped permanently
    // Pick up the remaining items and try again with a new currentItem
    if (output.includes('heavier')) {

        droidInput('drop ' + currentItem);
        droidOutput();
        inventory.delete(currentItem);

        [...inventory.values()].forEach(item => {

            droidInput('take ' + item);
            droidOutput();

        });

        inventoryValues = inventory.values();
        currentItem = inventoryValues.next().value;
        continue;

    }
    // If droid is expected to be lighter drop one item
    else if (output.includes('lighter')) {

        const nextToDrop = inventoryValues.next().value;

        droidInput('drop ' + nextToDrop);
        droidOutput();

        continue;

    }

}

