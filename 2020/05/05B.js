const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var tickets = input.split('\n').map(ticket => {

    ticket = ticket.replace(/F/g, '0')
        .replace(/B/g, '1')
        .replace(/L/g, '0')
        .replace(/R/g, '1');

    var r = parseInt(ticket.slice(0, 7), 2);
    var c = parseInt(ticket.slice(7, 10), 2);

    return r*8 + c;

}).sort((a,b) => a-b);

var result = tickets.find((ticket, index) => ticket - tickets[0] !== index) - 1;

console.log(result);