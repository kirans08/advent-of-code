const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const STEPS = 1000;
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

let i=0;

while(i++ < STEPS) {

    updatePosAndVel(xpos, xvel);
    updatePosAndVel(ypos, yvel);
    updatePosAndVel(zpos, zvel);

};

let total = 0;

for (let i=0; i<xpos.length; i++) {

    const pot = Math.abs(xpos[i]) + Math.abs(ypos[i]) + Math.abs(zpos[i]);
    const kin = Math.abs(xvel[i]) + Math.abs(yvel[i]) + Math.abs(zvel[i]);

    total += (pot * kin);

}

console.log(total);
