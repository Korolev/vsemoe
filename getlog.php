<?php
$pwd = getcwd();
$filename = $pwd.'/log/redirect.log';

echo @file_get_contents($filename);
?>