<?php 
$html = file_get_contents('template/_default.html');
$action = 'intro';
$userCookie = $_COOKIE;
$page = $_GET['action'];
$sub_action = $_GET['dir'];
$cost = $_GET['summ'];
$tarif = $_GET['tarif'];
$response = '';

if($page == 'PaymentFail'){
    $page = 'fail';
}
if($page == 'PaymentSuccess'){
    $page = 'confirm';
}

if(!$userCookie['vse_cookie_token_'] & $page == 'pay'){
    $vse_redirect_url = $_SERVER['HTTP_REFERER'].'?'.$_SERVER['QUERY_STRING'];
    $vse_redirect_url = urlencode($vse_redirect_url);
    header('Location: http://'.$_SERVER['HTTP_HOST'].'/account/#login/'.$vse_redirect_url);
}

$payTextHash = array(
    82 => 'Дорогой друг, вы покупаете за 82 рублея программный пакет на 1 месяц.',
    164 => 'Дорогой друг, вы покупаете за 164 рублея программный пакет на 2 месяца.',
    856 => 'Дорогой друг, вы покупаете за 856 рублей программный пакет на 1 год.'
    );

$payTextHash = array(
    82 => '1 месяц',
    164 => '2 месяца',
    856 => '1 год'
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
    if(isset($tarif)){
        $content = str_replace('{!period}',$payTextHash[$tarif], $content);
    }    
    $content = str_replace('{!document_content}',$content, $html);

}

echo $content;
?>