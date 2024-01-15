<?php
function hex_to_rgb($hex) {
    // remove the # in front of the hex value
    $hex = str_replace('#', '', $hex);
    // convert three digit hex value into six digits
    if(strlen($hex) == 3) {
        $hex = str_repeat($hex, 2);
    }
    // return the RGB value in an array
    return array(
        'r' => hexdec(substr($hex, 0, 2)),
        'g' => hexdec(substr($hex, 2, 2)),
        'b' => hexdec(substr($hex, 4, 2))
    );
}

function rgb_to_hex($rgb) {
    // return the hex value. make sure to pad r g and b with a leading zero if necessary
    return '#'
        . str_pad(dechex($rgb['r']), 2, '0', STR_PAD_LEFT)
        . str_pad(dechex($rgb['g']), 2, '0', STR_PAD_LEFT)
        . str_pad(dechex($rgb['b']), 2, '0', STR_PAD_LEFT);
}