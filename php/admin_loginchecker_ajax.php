<?php
    $path = '../';
    require "admin_cookies.php";
    if(isset($_COOKIE[$cookie_admin_username]) && isset($_COOKIE[$cookie_admin_password]) && isset($_COOKIE[$cookie_admin_fullname]) && isset($_COOKIE[$cookie_admin_pic])) {
        $username = base64_decode(base64_decode($_COOKIE[$cookie_admin_username]));
        $password = base64_decode(base64_decode($_COOKIE[$cookie_admin_password]));

        require "db/open.php";
        $query = "SELECT `FullName`, `PicFilename` FROM `admin` WHERE `Username`='$username' AND `Password`='$password'";
        $result = mysqli_query($con, $query);
        if(mysqli_num_rows($result) <= 0) {
            echo "-1";
            exit();
        }
        require "db/close.php";
    }
?>
