const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var colorMap = {};

input.split('\n')
.filter(row => !row.endsWith('no other bags.'))
.map(
    row => row.replace('contain ', '')
    .split(/\s?bags?[,\.]?\s?/)
    .filter(s => s != '')
    .map(bag => /^(\d+\s)?(.*)/.exec(bag)[2])
)
.forEach(row => {

    row.slice(1).forEach(bag => {

        if (!colorMap[bag]){
            colorMap[bag] = new Set();
        }

        colorMap[bag].add(row[0]);

    });

});

var visited = {};
var list = [];
var addParentBags = (color) => {

    if (visited[color] || !colorMap[color]) {
        return;
    }

    visited[color] = true;
    list.push(...colorMap[color]);
    [...colorMap[color]].forEach(color => addParentBags(color));

}

addParentBags('shiny gold');

console.log(new Set(list).size);
