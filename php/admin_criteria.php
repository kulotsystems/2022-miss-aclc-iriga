<?php
    require "admin_loginchecker_ajax.php";

    // get all criteria and extra criteria
    if(isset($_POST['get_all_criteria'])) {
        require "db/open.php";

        $arr_criteria = array();
        $query = "SELECT `ID`, `Title` FROM `portions` ORDER BY `ID`";
        $result = mysqli_query($con, $query);
        while($row = mysqli_fetch_assoc($result)) {
            $arr_portion = array();
            array_push($arr_portion, $row['ID']);
            array_push($arr_portion, $row['Title']);

            // get criteria
            $query = "SELECT `ID`, `Title`, `Percentage`, `IsLinkedToPortion`, `PortionLink` FROM `criteria` WHERE `PortionID`=" . $row['ID'];
            $result2 = mysqli_query($con, $query);
            $arr_criterion_items = array();
            while($row2 = mysqli_fetch_assoc($result2)) {
                $arr_criterion = array();
                array_push($arr_criterion, $row2['ID']);
                array_push($arr_criterion, $row2['Title']);
                array_push($arr_criterion, $row2['Percentage']);
                array_push($arr_criterion, $row2['IsLinkedToPortion']);
                array_push($arr_criterion, $row2['PortionLink']);
                array_push($arr_criterion_items, implode("]ddd[", $arr_criterion));
            }
            array_push($arr_portion, implode("]dd[", $arr_criterion_items));


            // get extra criteria
            $query = "SELECT `ID`, `Title`, `Percentage`, `IsHidden` FROM `extra_criteria` WHERE `PortionID`=" . $row['ID'];
            $result2 = mysqli_query($con, $query);
            $arr_extra_criterion_items = array();
            while($row2 = mysqli_fetch_assoc($result2)) {
                $arr_extra_criterion = array();
                array_push($arr_extra_criterion, $row2['ID']);
                array_push($arr_extra_criterion, $row2['Title']);
                array_push($arr_extra_criterion, $row2['Percentage']);
                array_push($arr_extra_criterion, $row2['IsHidden']);
                array_push($arr_extra_criterion_items, implode("]ddd[", $arr_extra_criterion));
            }
            array_push($arr_portion, implode("]dd[", $arr_extra_criterion_items));
            array_push($arr_criteria, implode("]d[", $arr_portion));
        }

        echo "1]s[" . implode("]r[", $arr_criteria);
        require "db/close.php";
    }

    // add criteria
    else if(isset($_POST['add_criteria'])) {
        require "db/open.php";
        $criteria_title = addslashes(htmlentities(trim($_POST['add_criteria'])));
        $criteria_percentage = floatval(addslashes(htmlentities(trim($_POST['percentage']))));
        $portion = addslashes(htmlentities(trim($_POST['portion'])));
        $is_linked_to_portion = addslashes(htmlentities(trim($_POST['is_linked_to_portion'])));
        $portion_link = addslashes(htmlentities(trim($_POST['portion_link'])));
        if($portion_link == '0') $portion_link = '1';
        $query = "INSERT INTO `criteria`(`Title`, `Percentage`, `PortionID`, `IsLinkedToPortion`, `PortionLink`) VALUES('$criteria_title', $criteria_percentage, $portion, $is_linked_to_portion, $portion_link)";
        mysqli_query($con, $query);
        $id = mysqli_insert_id($con);
        echo "1]s[" . $id;
        require "db/close.php";
    }

    // add extra criteria
    else if(isset($_POST['add_extra_criteria'])) {
        require "db/open.php";
        $criteria_title = addslashes(trim($_POST['add_extra_criteria']));
        $criteria_percentage = floatval(addslashes(htmlentities(trim($_POST['percentage']))));
        $portion = addslashes(htmlentities(trim($_POST['portion'])));
        $is_hidden = addslashes(htmlentities(trim($_POST['is_hidden'])));
        $query = "INSERT INTO `extra_criteria`(`Title`, `Percentage`, `PortionID`, `IsHidden`) VALUES('$criteria_title', $criteria_percentage, $portion, $is_hidden)";
        mysqli_query($con, $query);
        $id = mysqli_insert_id($con);
        echo "1]s[" . $id;
        require "db/close.php";
    }


    // edit criteria
    else if(isset($_POST['update_criteria'])) {
        require "db/open.php";
        $criteria_id = addslashes(htmlentities(trim($_POST['update_criteria'])));
        $criteria_title = addslashes(htmlentities(trim($_POST['criteria_title'])));
        $criteria_percentage = floatval(addslashes(htmlentities(trim($_POST['percentage']))));
        $is_linked_to_portion = addslashes(htmlentities(trim($_POST['is_linked_to_portion'])));
        $portion_link = addslashes(htmlentities(trim($_POST['portion_link'])));
        if($portion_link == '0') $portion_link = '1';
        $query = "UPDATE `criteria` SET `Title`='$criteria_title', `Percentage`=$criteria_percentage, `IsLinkedToPortion`=$is_linked_to_portion, `PortionLink`=$portion_link WHERE `ID`=$criteria_id";
        mysqli_query($con, $query);
        echo "1";
        require "db/close.php";
    }

    // edit extra criteria
    else if(isset($_POST['update_extra_criteria'])) {
        require "db/open.php";
        $criteria_id = addslashes(htmlentities(trim($_POST['update_extra_criteria'])));
        $criteria_title = addslashes(trim($_POST['criteria_title']));
        $criteria_percentage = floatval(addslashes(htmlentities(trim($_POST['percentage']))));
        $is_hidden = addslashes(htmlentities(trim($_POST['is_hidden'])));
        $query = "UPDATE `extra_criteria` SET `Title`='$criteria_title', `Percentage`=$criteria_percentage, `IsHidden`=$is_hidden WHERE `ID`=$criteria_id";
        mysqli_query($con, $query);
        echo "1";
        require "db/close.php";
    }

    // remove criteria
    else if(isset($_POST['remove_criteria'])) {
        require "db/open.php";
        $criteria_id = addslashes(htmlentities(trim($_POST['remove_criteria'])));
        $query = "SELECT `Rating` FROM `ratings` WHERE `CriteriaID`=$criteria_id";
        $result = mysqli_query($con, $query);
        if(mysqli_num_rows($result) > 0) {
            echo "-2";
        }
        else {
            $query = "DELETE FROM `criteria` WHERE `ID`=$criteria_id";
            mysqli_query($con, $query);
            echo "1";
        }
        require "db/close.php";
    }

    // remove extra criteria
    else if(isset($_POST['remove_extra_criteria'])) {
        require "db/open.php";
        $criteria_id = addslashes(htmlentities(trim($_POST['remove_extra_criteria'])));
        $query = "DELETE FROM `extra_criteria` WHERE `ID`=$criteria_id";
        mysqli_query($con, $query);
        echo "1";
        require "db/close.php";
    }
?>
