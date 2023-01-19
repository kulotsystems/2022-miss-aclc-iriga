<?php
    $path = '../';
    require "judge_cookies.php";
    $judge_id = "";
    if(isset($_COOKIE[$cookie_judge_username]) && isset($_COOKIE[$cookie_judge_password]) && isset($_COOKIE[$cookie_judge_fullname]) && isset($_COOKIE[$cookie_judge_pic])) {
        $username = base64_decode(base64_decode($_COOKIE[$cookie_judge_username]));
        $password = base64_decode(base64_decode($_COOKIE[$cookie_judge_password]));

        require "db/open.php";
        $query = "SELECT `ID`, `FullName`, `PicFilename` FROM `judges` WHERE `Username`='$username' AND `Password`='$password'";
        $result = mysqli_query($con, $query);
        if(mysqli_num_rows($result) <= 0) {
            echo "-1";
            exit();
        }
        else {
            $row = mysqli_fetch_assoc($result);
            $judge_id = $row['ID'];
        }
        require "db/close.php";
    }
?>
