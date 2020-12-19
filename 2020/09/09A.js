const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var rows = input.split('\n').map(row => parseInt(row));
var size = 25;
var pre = rows.slice(0, size);

canSum = target => {
        
    var map = new Map();

    return !!pre.find(e => (map.set(target-e, true) && map.has(e)));

}

var result = rows.slice(size)
.find(e => {

    if (!canSum(e)){
        return true;
    }

    pre.shift();
    pre.push(e);

    return false;

})

console.log(result);
