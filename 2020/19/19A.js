const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var parts = input.split('\n\n');

var rules = parts[0].split('\n')
.map(row => row.replace(/"/g, '').split(':'))
.reduce((result, row) => (result[row[0]] = row[1].trim().split(' | ')) && result, {});

var ruleCache = {};
var expandRule = (rule) => {

    if (rules[rule].length == 1 && /^[a-z]+$/.test(rules[rule][0])) {
        return rules[rule][0];
    }

    if (ruleCache[rule]) {
        return ruleCache[rule];
    }

    var result = rules[rule].map(
        row => row.trim()
        .split(' ')
        .map(expandRule)
        .join('')
    ).join('|');

    return ruleCache[rule] = `(${result})`;

}

var ruleRegex = new RegExp(`^${expandRule('0')}$`);

var result = parts[1].split('\n')
.filter(row => ruleRegex.test(row))
.length;

console.log(result);
