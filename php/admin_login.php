<?php
    if(isset($_POST['usermane']) && isset($_POST['paswsord'])) {
        $path     = '../';
        $username = addslashes(trim(htmlentities($_POST['usermane'])));
        $password = addslashes(htmlentities($_POST['paswsord']));

        if($username != "" && $password != "") {
            require "db/open.php";
            $query = "SELECT `FullName`, `PicFilename` FROM `admin` WHERE `Username`='$username' AND `Password`='$password'";
            $result = mysqli_query($con, $query);
            if(mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                require "admin_cookies.php";
                require "cookie_saver.php";
                savecookie($cookie_admin_username, base64_encode(base64_encode($username)));
                savecookie($cookie_admin_password, base64_encode(base64_encode($password)));
                savecookie($cookie_admin_fullname, base64_encode(base64_encode($row['FullName'])));
                savecookie($cookie_admin_pic     , base64_encode(base64_encode($row['PicFilename'])));
                echo "1";
            }
            else {
                echo "0";
            }
            require "db/close.php";
        }
    }
?>
