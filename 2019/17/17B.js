const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');
const AsciiComputer = require('../shared/AsciiComputer');

const findStartCoods = scaffold => {

    let result;
    scaffold.find(
        (row , rowInd) => row.find((val, colInd) => {

            if (!['>', '<', '^', 'v'].includes(val)) {
                return false;
            }

            result = [colInd, rowInd, val];
            return true;

        })
    )

    return result;

}

const getDirection = position => {

    switch(position) {
        case '>': return 'R';
        case '<': return 'L';
        case '^': return 'T';
        case 'v': return 'B';
    }
}

const move = (x, y, dir) => {

    switch(dir) {
        case 'T':
            y--;
            break;

        case 'R':
            x++;
            break;

        case 'B':
            y++;
            break;

        case 'L':
            x--;
            break;

    }

    return [x, y];

}

const nextTileInDir = (scaffold, x, y, dir) => {

    [x, y] = move(x, y, dir);

    return (scaffold[y] && scaffold[y][x]) || '.';

}

const turnDir = (dir, turn) => {

    const dirs = ['T', 'R', 'B', 'L'];
    let index = dirs.indexOf(dir);

    (turn == 'R') ? ++index : --index;
    index += 4;
    index %= 4;

    return dirs[index];
}

const getScaffoldPath = scaffold => {

    let [x, y, pos] = findStartCoods(scaffold);
    let dir = getDirection(pos);
    const result = [];
    let dist = 0;

    while (true) {

        if (nextTileInDir(scaffold, x, y, dir) == '#') {
            dist++;
            [x, y] = move(x, y, dir);
            continue;
        }

        const turn = ['R', 'L'].find(turn => {

            const newDir = turnDir(dir, turn);

            if (nextTileInDir(scaffold, x, y, newDir) != '#') {
                return false;
            }

            dist && result.push(dist);
            result.push(turn);
            dir = newDir;
            dist = 0;
            return true;


        });

        if (!turn) {
            break;
        }

    }

    dist && result.push(dist);

    return result;

}

const generatePathFunctions = path => {

    let pathString = path.join();
    let i = 0;
    let temp = [];
    const pathFunctions = [];
    const functionNames = ['A', 'B', 'C'];

    while (pathString.includes('R') || pathString.includes('L')) {

        temp.push(path[i]);

        const occurances = (pathString.match(new RegExp(temp.join(), 'g')) || []).length;

        if (occurances > 1 && 
            temp.join().length < 19 && 
            !['A', 'B', 'C'].includes(path[i])) {

            i++;
            continue;

        }

        temp.pop();

        // Funtion always ends with digits
        if (['R', 'L'].includes(temp[temp.length - 1])) {
            temp.pop();
        }

        const functionBody = temp.join();
        const functionName = functionNames[pathFunctions.length];

        pathFunctions.push(functionBody);
        pathString = pathString.replace(new RegExp(functionBody, 'g'), functionName);

        temp = [];
        path = pathString.split(',');
        i = path.includes('R') ? path.indexOf('R') : path.indexOf('L');

    }


    return [pathString].concat(pathFunctions).join('\n');

}

const program = input.split(',').map(Number);
let robot = new AsciiComputer(program);

let output;
let scaffold = [];
let temp = [];

while(!robot.halted()) {

    scaffold.push(robot.output().split(''));

}

const path = getScaffoldPath(scaffold);
const pathFunctions = generatePathFunctions(path);
const requireVideoFeed = `n`

const programInput = `${pathFunctions}
${requireVideoFeed}`;

program[0] = 2;
robot = new AsciiComputer(program, programInput);

let result;
temp = [];

while(!robot.halted()) {

    console.log(robot.output());

}
