const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var parts = input.split('\n\n');

var rules = parts[0].split('\n');
var my    = parts[1].split('\n')[1].split(',').map(Number);
var nearby = parts[2].split('\n')
.splice(1)
.map(ticket => ticket.split(',').map(Number));

var valid = new Map();
var fieldRules = new Map();

var addRule = (rule) => {

    var parts = rule.split(': ');
    var key = parts[0];
    var ranges = parts[1];
    var values = new Set();

    ranges.split(' or ').forEach(range => {

        var limits = range.split('-').map(Number);

        for(var i=limits[0]; i<=limits[1]; i++) {
            values.add(i);
            valid.set(i, true);
        }

    });

    fieldRules.set(key, values);

}

rules.forEach(rule => addRule(rule));

var validTickets = nearby.filter(tickets => !tickets.find(val => !valid.has(val)));

var columValues = [];
var i=0;

while(i < validTickets[0].length){
    columValues[i++] = [];
}

validTickets.forEach(tickets => {

    tickets.forEach((val, index) => {
        columValues[index].push(val);
    })

});


var validIndexForFields = {};

[...fieldRules.keys()].forEach(key => {
    validIndexForFields[key] = [];
});

columValues.forEach((column, index) => {

    fieldRules.forEach((value, key) => {

        var validLen = value.size;
        var mergedLen = new Set([...value, ...column]).size;

        if (mergedLen <= validLen) {
            validIndexForFields[key].push(index);
        }

    })

});


var finalFields = {};

while(Object.keys(validIndexForFields).length > 0) {

    Object.keys(validIndexForFields)
    .filter(key => validIndexForFields[key].length == 1)
    .forEach(key => {

        finalFields[key] = validIndexForFields[key][0];
        delete validIndexForFields[key];

    });

    Object.keys(validIndexForFields).forEach(key => {

        var possibilities = validIndexForFields[key];

        Object.values(finalFields).forEach(field => {
            const index = possibilities.indexOf(field);
            if (index == -1) {
                return true;
            }
            possibilities.splice(index, 1);
        })

        validIndexForFields[key] = possibilities;

    });

}

var result = Object.keys(finalFields)
.filter(key => key.startsWith('departure'))
.reduce((result, key) => result * my[finalFields[key]], 1);

console.log(result);


