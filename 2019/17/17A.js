const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');
const IntcodeComputer = require('../shared/IntcodeComputerV3');

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
const robot = new IntcodeComputer(program);

let output;
let scaffold = [];
let temp = [];

do {

    output = robot.output();

    if (output == 10) {
        scaffold.push(temp);
        temp = [];
        continue;
    }

    temp.push(String.fromCharCode(output));

}while(output);

console.log(getAllignmentParams(scaffold));

