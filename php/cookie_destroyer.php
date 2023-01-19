<?php
    function destroycookie($cookie_name) {
        $exp = time() - intval(86400); // cookie will expired in 1 day ago
        setcookie($cookie_name, "", $exp, "/");
    }
?>