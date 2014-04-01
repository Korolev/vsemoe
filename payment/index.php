<?php 
$html = file_get_contents('template/_default.html');
$action = 'intro';
$userCookie = $_COOKIE;
$page = $_GET['action'];
$sub_action = $_GET['dir'];
$cost = $_GET['summ'];
$response = '';

if(!$userCookie['vse_cookie_token_'] & $page == 'pay'){
    setcookie('vse_redirect_url',$_SERVER['HTTP_REFERER'].'?'.$_SERVER['QUERY_STRING'],0,'/');
    header('Location: http://'.$_SERVER['HTTP_HOST'].'/account/#login');
}

$payTextHash = array(
    45 => 'Дорогой друг, вы покупаете за 45 рублей программный пакет на 1 месяц.',
    79 => 'Дорогой друг, вы покупаете за 79 рублей программный пакет на 2 месяца.',
    450 => 'Дорогой друг, вы покупаете за 450 рублей программный пакет на 1 год.'
    );
if(isset($page)){
    $action = $page;
}
if(isset($sub_action)){
    header('Content-Type: application/json');
    $response = new stdClass;
    try {
        $response->response = @file_get_contents('template/'.$action.'/'.$sub_action.'.html');        
    } catch (Exception $e) {
        $response->response = false;    
        $response->exception = $e->getMessage();    
    }    
    $content = json_encode($response);
}else{
    $content = file_get_contents('template/'.$action.'.html');
    if(isset($cost)){
        $content = str_replace('{!invitation}',$payTextHash[$cost], $content);
    }    
    $content = str_replace('{!document_content}',$content, $html);
}

echo $content;
?>