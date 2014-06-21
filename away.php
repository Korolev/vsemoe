å<?php
$url = $_GET['to'];
$pwd = getcwd();
$filename = $pwd.'/log/redirect.log';
// if(!file_exists($filename)){
// 	$file = fopen($filename, 'w+');
// 	fclose($file);
// }

// $file = fopen($filename, 'r+');

// $file_content = stream_get_contents($file);

// $data = 
	
// var_dump($file_content);	

// @fclose($file);
file_put_contents($filename,$url."\n",FILE_APPEND);
header('Location: '.$url);
?>