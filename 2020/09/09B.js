const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var rows = input.split('\n').map(row => parseInt(row));
var size = 25;
var pre = rows.slice(0, size);

canSum = target => {
        
    var map = new Map();

    return !!pre.find(e => (map.set(target-e, true) && map.has(e)));

}

var invalidNumber = rows.slice(size)
.find(e => {

    if (!canSum(e)){
        return true;
    }

    pre.shift();
    pre.push(e);

    return false;

})

var slidWind = [rows[0]];
var sum = rows[0];
var i=1, l=rows.length;

while(slidWind.length != 0) {

    if (sum == invalidNumber) {
        break;
    }

    if (sum < invalidNumber && i < l) {
        var e = rows[i++];
        slidWind.push(e);
        sum += e;
        continue;
    }

    if (sum > invalidNumber || i >= l) {
        var e = slidWind.shift();
        sum -= e;
        continue;
    }

}

var result = Math.min(...slidWind) + Math.max(...slidWind);

console.log(result);
