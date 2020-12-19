const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var findInv = (a, m) => {

    a = a%m;

    for (var i=1; i<m; i++) {
        if ((a*i)%m == 1) {
            return i;
        }
    }

    return 0;

}

var prod = BigInt(1);

//Using Chineese Remainder Theorm
var buses = input.split('\n')[1]
.split(',')
.map((bus, index) => [bus, index])
.filter(bus => bus[0] !== 'x')
.map(bus => {

    var a = parseInt(bus[0]);
    var offset = bus[1] % a;
    var rem = (a - offset)%a;
    prod *= BigInt(a);

    return [a, rem];

});

var s = BigInt(0);
buses.forEach((bus, index) => {

    var a = Number(prod / BigInt(bus[0]))

    s += BigInt(a)*BigInt(findInv(a, bus[0]))*BigInt(bus[1]);

});

console.log(s % BigInt(prod));
