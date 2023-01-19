<?php
    require "admin_loginchecker_ajax.php";

    // get all portions
    if(isset($_POST['get_all_portions'])) {
        require "db/open.php";
        $arr_portions = array();
        $query = "SELECT `ID`, `Title` FROM `portions` ORDER BY `ID`";
        $result = mysqli_query($con, $query);
        while($row = mysqli_fetch_assoc($result)) {
            $arr_portion = array();
            array_push($arr_portion, $row['ID']);
            array_push($arr_portion, $row['Title']);

            array_push($arr_portions, implode("]d[", $arr_portion));
        }
        echo "1]s[" . implode("]r[", $arr_portions);
        require "db/close.php";
    }

    // get all previous portions from a given portion id
    else if(isset($_POST['get_previous_portions_of'])) {
        require "db/open.php";
        $portion_id = addslashes(htmlentities(trim($_POST['get_previous_portions_of'])));
        $arr_portions = array();
        $query = "SELECT `ID`, `Title` FROM `portions` WHERE `ID` < $portion_id ORDER BY `DateAdded`";
        $result = mysqli_query($con, $query);
        while($row = mysqli_fetch_assoc($result)) {
            $arr_portion = array();
            array_push($arr_portion, $row['ID']);
            array_push($arr_portion, $row['Title']);

            array_push($arr_portions, implode("]d[", $arr_portion));
        }
        echo "1]s[" . implode("]r[", $arr_portions);
        require "db/close.php";
    }

    // add portion
    else if(isset($_POST['add_portion'])) {
        require "db/open.php";
        $portion_title = addslashes(trim($_POST['add_portion']));
        $query = "INSERT INTO `portions`(`Title`) VALUES('$portion_title')";
        mysqli_query($con, $query);
        $id = mysqli_insert_id($con);
        echo "1]s[" . $id;
        require "db/close.php";
    }

    // edit portion
    else if(isset($_POST['update_portion'])) {
        require "db/open.php";
        $portion_id = addslashes(htmlentities(trim($_POST['update_portion'])));
        $portion_title = addslashes(trim($_POST['portion_title']));
        $query = "UPDATE `portions` SET `Title`='$portion_title' WHERE `ID`=$portion_id";
        mysqli_query($con, $query);
        echo "1";
        require "db/close.php";
    }

    // remove portion
    else if(isset($_POST['remove_portion'])) {
        require "db/open.php";
        $portion_id = addslashes(htmlentities(trim($_POST['remove_portion'])));

        $query = "SELECT `ID` FROM `criteria` WHERE `PortionID`=$portion_id";
        $result = mysqli_query($con, $query);
        if(mysqli_num_rows($result) > 0) {
            echo "-2";
        }
        else {
            $query = "DELETE FROM `portions` WHERE `ID`=$portion_id";
            mysqli_query($con, $query);
            echo "1";
        }
        require "db/close.php";
    }
?>
