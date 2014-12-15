<?php
    if(!empty($_GET)){

    }else{
        header('Content-Type: application/json');
        $response = new stdClass;
        $randId = rand(1,55);
        try {
            $response->id = $randId;
            $response->file = $randId.'.svg';
        } catch (Exception $e) {
            $response->response = false;    
            $response->exception = $e->getMessage();    
        }    
        $content = json_encode($response);
        echo $content;    
    }	
?>