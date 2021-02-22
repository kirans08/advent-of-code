const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');
const AsciiComputer = require('../shared/AsciiComputer');

const findIntersections = scaffold => {

    let result = [];

    scaffold.forEach((row, rowIndex) => {

        row.forEach((val, colIndex) => {

            if (val == '.' || !scaffold[rowIndex-1] || !scaffold[rowIndex+1]) {
                return true;
            }

            if (row[colIndex-1] == '#' && 
                row[colIndex+1] == '#' && 
                scaffold[rowIndex-1][colIndex] == '#' && 
                scaffold[rowIndex+1][colIndex] == '#') {

                result.push([rowIndex, colIndex]);
            }

        })

    });

    return result;

}

const getAllignmentParams = scaffold => {

    return findIntersections(scaffold).reduce(
        (result, coord) => result + (coord[0]*coord[1])
    , 0);

}

const program = input.split(',').map(Number);
const robot = new AsciiComputer(program);

let scaffold = [];

while(!robot.halted()) {

    scaffold.push(robot.output().split(''));

}

console.log(getAllignmentParams(scaffold));

