const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const orbitMap = {};

input.split('\n')
.map(row => row.split(')'))
.forEach(row => {

    let orbit = orbitMap[row[0]] || [];
    orbit.push(row[1])
    orbitMap[row[0]] =orbit;

});

const findOrbits = (body, depth = 1) => {

    if (!orbitMap[body]) {
        return 0;
    }

    let result =  depth * orbitMap[body].length;

    return result + orbitMap[body].reduce((res, orbit) => res + findOrbits(orbit, (depth + 1)), 0);

}

console.log(findOrbits('COM'));
