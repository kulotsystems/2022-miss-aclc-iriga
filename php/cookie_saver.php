<?php
    function savecookie($cookie_name, $cookie_value) {
        $exp = time() + intval(86400 * 0.5); // cookie will expire in 12 hours
        setcookie($cookie_name, $cookie_value, $exp, "/");
    }
?>