<?php
    require "judge_cookies.php";
    $username = "";
    $fullname = "";
    $filename = "";
    $judge_id = "";
    if(isset($_COOKIE[$cookie_judge_username]) && isset($_COOKIE[$cookie_judge_password]) && isset($_COOKIE[$cookie_judge_fullname]) && isset($_COOKIE[$cookie_judge_pic])) {
        $username = base64_decode(base64_decode($_COOKIE[$cookie_judge_username]));
        $password = base64_decode(base64_decode($_COOKIE[$cookie_judge_password]));
        $fullname = base64_decode(base64_decode($_COOKIE[$cookie_judge_fullname]));
        $filename = base64_decode(base64_decode($_COOKIE[$cookie_judge_pic]));

        require "db/open.php";
        $query = "SELECT `ID`, `FullName`, `PicFilename` FROM `judges` WHERE `Username`='$username' AND `Password`='$password'";
        $result = mysqli_query($con, $query);
        if(mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            require "cookie_saver.php";
            savecookie($cookie_judge_fullname, base64_encode(base64_encode($row['FullName'])));
            savecookie($cookie_judge_pic     , base64_encode(base64_encode($row['PicFilename'])));
            $fullname = base64_decode(base64_decode($_COOKIE[$cookie_judge_fullname]));
            $filename = base64_decode(base64_decode($_COOKIE[$cookie_judge_pic]));
            $judge_id = $row['ID'];

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
