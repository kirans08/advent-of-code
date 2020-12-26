const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const parentMap = {};

input.split('\n')
.map(row => row.split(')'))
.forEach(row => (parentMap[row[1]] = row[0]));

const getPathToRoot = body => {

    let path = [];

    while (parentMap[body]) {

        path.push(body);
        body = parentMap[body];

    }

    return path;

}

const sanPath = getPathToRoot('SAN');
const youPath = getPathToRoot('YOU');
const common = sanPath.find(a => youPath.indexOf(a) != -1);

const result = sanPath.indexOf(common) + youPath.indexOf(common) - 2;

console.log(result);
