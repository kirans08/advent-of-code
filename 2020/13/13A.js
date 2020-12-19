const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var rows = input.split('\n');

var time = parseInt(rows[0]);
var minTime = time;
var minBus  = -1;

rows[1].split(',')
.filter(b => (b !== 'x'))
.map(Number)
.forEach(bus => {

    var waitTime = (Math.ceil(time / bus) * bus) - time;

    if (waitTime < minTime) {
        minTime = waitTime;
        minBus = bus;
    }

})

console.log(minTime*minBus);
