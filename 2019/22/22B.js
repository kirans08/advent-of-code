const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

let a = 1n, b = 0n;
const length = 119315717514047n;
const count = 101741582076661n;

const dealNewStack = () => {

    a = (length - a) % length;
    b = (length - 1n - b) % length;

}

const cutN = (n) => {

    b = (b - n + length) % length;

}

const dealWithN = (n) => {

    a = (n * a) % length;
    b = (n * b) % length;

}

// Using Fermats Little Theorm
const findModularInverse = (a, m) => {

    return modularPower(a, m - 2n, m);

}

const modularPower = (a, exp, m) => {

    if (exp == 0) {
        return 1n;
    }

    let prod = modularPower(a, exp / 2n, m) % m;
    prod = (prod * prod) % m;

    return exp & 1n ? (prod * a) % m : prod;

}

const processAction = action => {

    if (action == 'deal into new stack') {

        dealNewStack();

    }
    else if (action.includes('cut')) {

        cutN(BigInt(action.slice(4)));

    }
    else if (action.includes('deal with increment')) {

        dealWithN(BigInt(action.slice(20)));

    }

}

// Compute values of a & b for one iteration
const actions = input.split('\n')
.map(processAction);

// Compute values of a & b after {count} iterations
const bSum = b * (1n - modularPower(a, count, length)) * (findModularInverse(1n - a, length));
b = bSum % length;
a = modularPower(a, count, length);

// Target Position = (a * {Source Position} + b) % length
const targetPosition = 2020n;
const rem = (targetPosition - b + length) % length;
const inverse = findModularInverse(a, length);

const result = (rem * inverse) % length;

console.log(result);
