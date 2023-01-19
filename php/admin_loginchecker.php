<?php
    require "admin_cookies.php";
    $username = "";
    $fullname = "";
    $filename = "";
    if(isset($_COOKIE[$cookie_admin_username]) && isset($_COOKIE[$cookie_admin_password]) && isset($_COOKIE[$cookie_admin_fullname]) && isset($_COOKIE[$cookie_admin_pic])) {
        $username = base64_decode(base64_decode($_COOKIE[$cookie_admin_username]));
        $password = base64_decode(base64_decode($_COOKIE[$cookie_admin_password]));
        $fullname = base64_decode(base64_decode($_COOKIE[$cookie_admin_fullname]));
        $filename = base64_decode(base64_decode($_COOKIE[$cookie_admin_pic]));

        require "db/open.php";
        $query = "SELECT `FullName`, `PicFilename` FROM `admin` WHERE `Username`='$username' AND `Password`='$password'";
        $result = mysqli_query($con, $query);
        if(mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            require "cookie_saver.php";
            savecookie($cookie_admin_fullname, base64_encode(base64_encode($row['FullName'])));
            savecookie($cookie_admin_pic     , base64_encode(base64_encode($row['PicFilename'])));
            $fullname = base64_decode(base64_decode($_COOKIE[$cookie_admin_fullname]));
            $filename = base64_decode(base64_decode($_COOKIE[$cookie_admin_pic]));

            if($page == 'index') {
                header("Location: home.php");
                exit();
            }
        }
        else {
            if($page != 'index') {
                header("Location: index.php");
                exit();
            }
        }
        require "db/close.php";
    }
    else {
        if($page != 'index') {
            header("Location: index.php");
            exit();
        }
    }
?>
