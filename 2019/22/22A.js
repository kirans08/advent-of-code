const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const dealNewStack = index => length - index - 1;

const cutN = (index, n) => (index - n + length) % length;

const dealWithN = (index, n) => (n*index) % length;

const parseAction = action => {

    if (action == 'deal into new stack') {
        return [dealNewStack, []];
    }

    if (action.includes('cut')) {

        return [cutN, [parseInt(action.slice(4))]];

    }

    if (action.includes('deal with increment')) {

        return [dealWithN, [parseInt(action.slice(20))]]
    }

}

const executeActions = (index, actions) => {

    actions.forEach(action => {

        const [func, param] = action;
        index = func(index, ...param);

    });

    return index;

}

const actions = input.split('\n')
.map(parseAction);

const length = 10007;
const position = 2019

console.log(executeActions(position, actions));
