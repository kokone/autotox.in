<!doctype html>
<html>
    <head>
        <title>Fifty Shades of Grey</title>
        <link rel="image_src" href="preview.png" />
        <link rel="stylesheet" type="text/css" href="css/reset.css">
        <link rel="stylesheet" type="text/css" href="css/style.css">
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
        <script rel="javascript" type="text/javascript" src="js/hoverintent.js"></script>
        <script rel="javascript" type="text/javascript" src="js/javascript.js"></script>
    </head>
    <body>
        <?php
            require_once 'functions.php';
            // initial hex value
            $hex = '#000000';
            // number of shades
            $color_nums = 50;
            for($i = 0; $i < $color_nums; $i++) {
                // get diff to add to each r g and b value
                $diff = 255 / $color_nums;
                $rgb = hex_to_rgb($hex);
                $rgb['r'] += $diff;
                $rgb['g'] += $diff;
                $rgb['b'] += $diff;
                $hex = rgb_to_hex($rgb);
                // print the div with the color
                printf('<div id="%1$d" class="grey" style="background-color:%2$s;"><span class="hex">%2$s</span></div>', $i, $hex);
            }
        ?>
    </body>
</html>