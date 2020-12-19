const fs = require('fs');
var input = fs.readFileSync('input', 'utf8');

var result = input.split("\n\n").filter(s => {
    
    var data = s.split(/\s/)
    .reduce((res, key) => {

        var parts = key.split(':');
        res[parts[0]] = parts[1].trim();

        return res;

    }, {});

    var byr = parseInt(data.byr);
    if (!byr || byr < 1920 || byr > 2002 ) return false;

    var iyr = parseInt(data.iyr);
    if (!iyr || iyr < 2010 || iyr > 2020 ) return false;

    var eyr = parseInt(data.eyr);
    if (!eyr || eyr < 2020 || eyr > 2030 ) return false;

    var hgt = data.hgt
    var hgtVal = parseInt(hgt);

    if (!hgt || !(hgt.endsWith('cm') || hgt.endsWith('in')) ) return false;
    if (hgt.endsWith('cm') && (hgtVal < 150 || hgtVal > 193) ) return false;
    if (hgt.endsWith('in') && (hgtVal < 59 || hgtVal > 76) ) return false;

    var hcl = data.hcl
    if (!hcl || !/^#[a-f\d]{6}$/.test(hcl)) return false;

    var ecl = data.ecl;
    if (!ecl || !['amb','blu','brn','gry','grn','hzl','oth'].includes(ecl)) return false;

    var pid = data.pid
    if (!pid || !/^[\d]{9}$/.test(pid)) return false;

    return true

}).length;

console.log(result);

