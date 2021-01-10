const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const reactionMap = {};
const excessMap = {};

const processElement = element => {

    element = element.trim().split(' ');

    return {
        quantity: +element[0],
        name: element[1]
    }

}

const resetExcess = () => {

    Object.keys(reactionMap).forEach(key => {

        excessMap[key] = 0;

    });

}

const findOreRequired = (element, quantity) => {

    const excess = excessMap[element];

    if (excess > 0) {

        excessMap[element] = Math.max(excess - quantity, 0)
        quantity = Math.max(quantity - excess, 0);

    }

    if (element == 'ORE') {
        return quantity;
    }

    const reaction = reactionMap[element];
    const noOfReactions = Math.ceil(quantity/reaction.quantity);

    excessMap[element] += ((noOfReactions * reaction.quantity) - quantity);

    return reaction.source.reduce(
        (result, element) => result + findOreRequired(element.name, element.quantity * noOfReactions)
    , 0);


}

input.split('\n')
.forEach(row => {

    const parts = row.split(' => ');
    const target = processElement(parts[1]);

    reactionMap[target.name] = {
        quantity: target.quantity,
        source: parts[0].split(',').map(processElement)
    }


});

resetExcess();
const orePerFuel = findOreRequired('FUEL', 1);
const totalFuel  = 1000000000000;

let estimateFuel = Math.floor(totalFuel / orePerFuel);
let prevEstimate;

do {

    prevEstimate = estimateFuel;

    resetExcess();
    const actualOreReq = findOreRequired('FUEL', prevEstimate);
    estimateFuel = Math.floor(prevEstimate * totalFuel / actualOreReq);

} while (estimateFuel != prevEstimate)

console.log(orePerFuel);   // Part 1
console.log(estimateFuel); // Part 2
