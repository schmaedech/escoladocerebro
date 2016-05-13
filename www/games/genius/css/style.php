<?php

header("Content-type: text/css");
if (substr_count($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip'))
    ob_start("ob_gzhandler");
else
    ob_start(); 

$files = glob("../img/*.{jpg,png,gif,svg}", GLOB_BRACE);
$count = count($files); 
$sortedArray = array();
for ($i = 0; $i < $count; $i++) {
    $sortedArray[date('YmdHis', filemtime($files[$i]))] = $files[$i];
} 
ksort($sortedArray); 
foreach ($sortedArray as &$filename) {
    if ($fp = fopen($filename, "rb", 0)) {
        $beer = fread($fp, filesize($filename));
        fclose($fp);
        $base64 = base64_encode($beer);
        $info = pathinfo($filename);
        $filename = basename($filename, '.' . $info['extension']);
    //    echo '.' . $filename . '{background-repeat:no-repeat; background-position: center center;   background-image: url("data:image/jpg/png/gif/svg;base64,' . $base64 . '" );} ';
   echo '.' . $filename . '{   background-repeat:no-repeat; background-position: center center; background-image: url("../img/'.$filename. '.'.$info['extension'].'" );} ';
    
        }
}

?>
 