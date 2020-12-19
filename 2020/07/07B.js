const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var contents = {};

input.split('\n')
.filter(row => !row.endsWith('no other bags.'))
.map(
    row => row.replace('contain ', '')
    .split(/\s?bags?[,\.]?\s?/)
    .filter(s => s != '')
)
.forEach(row => {

    contents[row[0]] = row.splice(1)
    .map(bag => /^(\d+)\s(.*)$/.exec(bag))
    .reduce((res, bag) => (res[bag[2]] = +bag[1]) && res, {});

})

getTotalCount = (color) => {

    return Object.keys(contents[color] || {}).reduce(
        (res, childBagColor) => res + (contents[color][childBagColor] * getTotalCount(childBagColor))
    , 1);

};

console.log(getTotalCount('shiny gold') - 1);