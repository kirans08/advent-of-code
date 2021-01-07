const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const rowRegex = /^.*x=(-?\d+).*y=(-?\d+).*z=(-?\d+).*$/;
const positions = input.split('\n')
.map(row => rowRegex.exec(row).slice(1,4));

const xpos = positions.map(row => row[0]).map(Number);
const ypos = positions.map(row => row[1]).map(Number);;
const zpos = positions.map(row => row[2]).map(Number);;

const xvel = positions.map(row => 0);
const yvel = positions.map(row => 0);
const zvel = positions.map(row => 0);

const updatePosAndVel = (pos, vel) => {

    pos.forEach((basePos, baseInd) => {

        pos.forEach((targetPos, targetInd) => {

            if (basePos == targetPos) {
                return true;
            }

            basePos > targetPos ? vel[targetInd]++ : vel[targetInd]--;

        })

    });

    pos.forEach((val, ind) => {
        pos[ind] += vel[ind];
    });

}

const findRecurranceInterval = (pos, vel) => {

    let i=0;
    let initialVel = vel.join();
    let initalPos = pos.join();

    while(++i) {

        updatePosAndVel(pos, vel);

        if (initalPos == pos.join() && initialVel == vel.join()) {
            break;
        }

    }

    return i;

}

const gcd = (a, b) => {

    if (a == 0) {
        return b;
    }

    return gcd(b%a, a);

}

const lcm = (a, b) => {

    return a * b / gcd(a, b);

}

const xInterval = findRecurranceInterval(xpos, xvel);
const yInterval = findRecurranceInterval(ypos, yvel);
const zInterval = findRecurranceInterval(zpos, zvel);

const result = lcm(lcm(xInterval, yInterval), zInterval);

console.log(result);
