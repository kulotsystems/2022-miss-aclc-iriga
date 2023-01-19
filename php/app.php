<?php
    $uri = $_SERVER['REQUEST_URI'];
    if(strpos(basename($uri), '.php') === false){
        if(substr($uri, -1) != '/')
            header('Location: ' . $uri . '/');
    }
    $current_time = time();
    $script_version = base64_encode(rand(0, 1) . rand(0, 1024) . rand(0, 512) . rand(0, 1024) . rand(0, 1) . $current_time);
    $app_name = "Miss ACLC Iriga 2022";
?>
