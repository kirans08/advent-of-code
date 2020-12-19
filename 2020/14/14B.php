<?php

$input = file_get_contents('input');
$rows = explode("\n", $input);

$mem = [];
$mask = 0;
$noOfCombos = 0;
$noOfPositions = 0;
$indexes = [];

foreach ($rows as $row) {

    $parts = explode(' = ', $row);

    if ($parts[0] == 'mask') {

        $mask = bindec(str_replace('X', '1', $parts[1]));
        $noOfPositions = substr_count($parts[1], "X");
        $noOfCombos = pow(2, $noOfPositions);
        $indexes = [];

        $maskArray = str_split($parts[1]);
        $maskLength = count($maskArray);
        foreach ($maskArray as $index => $char) {

            if ($char == 'X')
                $indexes[] = ($index);

        }

        continue;
    }

    $addr = str_pad(decbin(intval(substr($parts[0], 4, -1)) | $mask), $maskLength, '0', STR_PAD_LEFT);

    $addrArray = str_split($addr);
    $addrLen = count($addrArray);
    $val = intval($parts[1]);

    $i = 0;

    while($i < $noOfCombos) {

        $comb = str_split(str_pad(strval(decbin($i)), $noOfPositions, '0', STR_PAD_LEFT));

        foreach ($indexes as $ind => $position) {

            $addrArray[$position] = $comb[$ind];

        }

        $target = bindec(implode('', $addrArray));

        $mem[$target] = $val;
        $i++;

    }



}

print_r(array_sum($mem));
echo "\n";


