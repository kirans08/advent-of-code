const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var rows = input.split('\n').map(r => r.split(''));

var space = {};

// Part 1
// const DIMENSIONS = 3;

// Part 2
const DIMENSIONS = 4;


const ITERATIONS=6;

var addItem = (value, ...coord) => {


    if (value == '.')
        return;

    var key = '';
    var i=0

    while(i<DIMENSIONS){
        key += `${(coord[i] || 0)}.`;
        i++;
    }

    space[key] = value;

}

rows.forEach((row,i) => {
    row.forEach((v,j) => {
        addItem(v, i, j);
    });
});


var countActiveAdjacent = (key) => {

    var coord = key.slice(0,-1).split('.').map(Number);
    var l = Math.pow(3, DIMENSIONS);
    var i = 1;
    var count = 0;

    while(i < l) {

        var modifier = (i.toString(3).padStart(DIMENSIONS, '0')).split('');
        var key = '';

        modifier.forEach((m, index) => {

            m = parseInt(m);
            m = (m==2) ? -1 : m;

            key += (coord[index] + m) + '.';

        });


        if (space[key] && space[key] == '#')
            count++;

        i++;

    }

    return count;

}

var generateKeys = (...limits) => {

    if (limits.length === 0) {
        return [];
    }

    var l = limits[0];
    var u = limits[1];

    var keys = [];

    for(var i=l; i<=u; i++) {
        keys.push(i + '.');
    }

    if (limits.length == 2) {
        return keys;
    }

    var newLimits = limits.splice(2, limits.length);
    var childKeys = generateKeys(...newLimits);

    var result = [];

    keys.forEach(key => {

        childKeys.forEach(childKey => {

            result.push(key + childKey);

        })
    });

    return result;

}

var processSpace = (...limits) => {

    var keys = generateKeys(...limits);
    var add = [];
    var remove = [];

    keys.forEach(key => {

        var state = space[key] || '.';
        var activeAdjacent = countActiveAdjacent(key);

        if (state === '.' && activeAdjacent == 3) {
            add.push(key);
        }
        else if(state == '#' && activeAdjacent != 2 && activeAdjacent != 3) {
            remove.push(key)
        }

    });

    add.forEach(key => (space[key] = '#'));
    remove.forEach(key => (delete space[key]));

}

var i;

var limits = [0, rows.length-1, 0, rows[0].length-1];

i=4;
while(i++ < 2*DIMENSIONS) {
    limits.push(0)
}

i = 0;
while(i++ < 6)  {

    var j=0;
    while(j < DIMENSIONS) {
        limits[j*2]--;
        limits[j*2+1]++;
        j++;
    }

    processSpace(...limits);

}


console.log(Object.keys(space).length);
