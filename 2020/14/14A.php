<?php

$input = file_get_contents('input');

$rows = explode("\n", $input);

$mem = [];
$om = 0;
$pm = 0;

foreach ($rows as $row) {

    $parts = explode(' = ', $row);

    if ($parts[0] == 'mask') {

        $om = bindec(str_replace('X', '0', $parts[1]));
        $pm = bindec(
            str_replace('X', '1', str_replace('1', '0', $parts[1]))
        );
        continue;
    }

    $addr = substr($parts[0], 4, -1);
    $val = intval($parts[1]);

    $val = $om | ($pm & $val);

    if (!isset($mem[$addr]))
        $mem[$addr] = 0;

    $mem[$addr] = $val;

}

print_r(array_sum($mem));
echo "\n";


