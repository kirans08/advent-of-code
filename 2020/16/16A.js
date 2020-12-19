const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var parts = input.split('\n\n');

var rules = parts[0].split('\n');
var my    = parts[1].split('\n').splice(1);
var nearby = parts[2].split('\n').splice(1);

var valid = new Map();

var addRule = (rule) => {

    rule.split(': ')[1]
    .split(' or ')
    .forEach(range => {

        var limits = range.split('-').map(Number);

        for(var i=limits[0]; i<=limits[1]; i++) {
            valid.set(i, true);
        }

    })

}

rules.forEach(addRule);

var result = 0;

nearby.forEach(ticket => {

    ticket.split(',').map(Number).forEach(val => {

        !valid.has(val) && (result += val);

    })

});

console.log(result);

