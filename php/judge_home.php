<?php
    require "judge_loginchecker_ajax.php";

    // save rating
    if(isset($_POST['save_rating_for'])) {
        require "db/open.php";
        $rating_id = addslashes(htmlentities(trim($_POST['save_rating_for'])));
        $rating = floatval(addslashes(htmlentities(trim($_POST['rating']))));

        $query = "UPDATE `ratings` SET `Rating`=$rating WHERE ID=$rating_id";
        mysqli_query($con, $query);
        echo "1";

        require "db/close.php";
    }

    // save new rating
    else if(isset($_POST['save_new_ratings_for'])) {
        require "db/open.php";
        $arr_rating_ids = explode("]d[", trim($_POST['save_new_ratings_for']));
        $arr_rating_vals = explode("]d[", trim($_POST['save_new_ratings']));

        for($i=0; $i<sizeof($arr_rating_ids); $i++) {
            $query = "UPDATE `ratings` SET `Rating`=" . $arr_rating_vals[$i] . " WHERE `ID`=" . $arr_rating_ids[$i];
            // echo $query . "\n\n";
            mysqli_query($con, $query);
        }
        echo "1";

        require "db/close.php";
    }

    // render rating sheet
    else if(isset($_POST['render_rating_sheet_for'])) {
        require "db/open.php";
        $portion_id = intval(addslashes(htmlentities(trim($_POST['render_rating_sheet_for']))));

        require "cookie_saver.php";
        savecookie($cookie_judge_current_portion, $portion_id);

        // get all criteria
        $arr_criteria = array();
        $query = "SELECT `ID`, `Title`, `Percentage` FROM `criteria` WHERE `PortionID`=$portion_id ORDER BY `DateAdded`";
        $result = mysqli_query($con, $query);
        while($row = mysqli_fetch_assoc($result)) {
            $arr_criterion = array();
            array_push($arr_criterion, $row['ID']);
            array_push($arr_criterion, $row['Title']);
            array_push($arr_criterion, $row['Percentage']);
            array_push($arr_criteria, $arr_criterion);
        }

        // get candidates and register them into ratings

        $arr_candidates = array();
        if($portion_id == 7) {
            $arr_top_10 = array();
            $file = "../top10.txt";
            $fr = fopen($file, "r");
            while(!feof($fr)) {
                $line = trim(fgets($fr));
                if($line != ""){
                    array_push($arr_top_10, intval($line));
                }
            }
            fclose($fr);
            for($x=0; $x<sizeof($arr_top_10); $x++) {
                $query = "SELECT `ID`, `FullName`, `City`, `PicFilename` FROM `candidates` WHERE `ID`=" . $arr_top_10[$x];
                $result = mysqli_query($con, $query);
                while($row = mysqli_fetch_assoc($result)) {
                    $candidate_id = $row['ID'];
                    array_push($arr_candidates, array($candidate_id, $row['FullName'], $row['City'], $row['PicFilename']));
                    for($i=0; $i<sizeof($arr_criteria); $i++) {
                        $criteria_id = $arr_criteria[$i][0];
                        $query = "SELECT `Rating` FROM `ratings` WHERE `JudgeID`=$judge_id AND `CandidateID`=$candidate_id AND `CriteriaID`=$criteria_id";
                        $result2 = mysqli_query($con, $query);
                        if(mysqli_num_rows($result2) <= 0) {
                            $query = "INSERT INTO `ratings`(`JudgeID`, `CandidateID`, `CriteriaID`) VALUES($judge_id, $candidate_id, $criteria_id)";
                            mysqli_query($con, $query);
                        }
                    }
                }
            }
        }
        else {
            $query = "SELECT `ID`, `FullName`, `City`, `PicFilename` FROM `candidates` ORDER BY `ID`";
            $result = mysqli_query($con, $query);
            while($row = mysqli_fetch_assoc($result)) {
                $candidate_id = $row['ID'];
                array_push($arr_candidates, array($candidate_id, $row['FullName'], $row['City'], $row['PicFilename']));
                for($i=0; $i<sizeof($arr_criteria); $i++) {
                    $criteria_id = $arr_criteria[$i][0];
                    $query = "SELECT `Rating` FROM `ratings` WHERE `JudgeID`=$judge_id AND `CandidateID`=$candidate_id AND `CriteriaID`=$criteria_id";
                    $result2 = mysqli_query($con, $query);
                    if(mysqli_num_rows($result2) <= 0) {
                        $query = "INSERT INTO `ratings`(`JudgeID`, `CandidateID`, `CriteriaID`) VALUES($judge_id, $candidate_id, $criteria_id)";
                        mysqli_query($con, $query);
                    }
                }
            }
        }

        // get all ratings now
        $arr_candidate_ratings = array();
        for($i=0; $i<sizeof($arr_candidates); $i++) {
            $candidate_id = $arr_candidates[$i][0];

            $arr_ratings = array();
            for($j=0; $j<sizeof($arr_criteria); $j++) {
                $criteria_id = $arr_criteria[$j][0];
                $query = "SELECT `ID`, `Rating`, `IsLocked` FROM `ratings` WHERE `JudgeID`=$judge_id AND `CandidateID`=$candidate_id AND `CriteriaID`=$criteria_id";
                $result = mysqli_query($con, $query);
                while($row = mysqli_fetch_assoc($result)) {
                    $rating_id = $row['ID'];
                    $rating_rating = $row['Rating'];
                    $rating_is_locked = $row['IsLocked'];
                    array_push($arr_ratings, array($rating_id, $rating_rating, $rating_is_locked));
                }
            }
            array_push($arr_candidate_ratings, $arr_ratings);
        }

        $arr_response = array($arr_criteria, $arr_candidates, $arr_candidate_ratings);
        echo json_encode($arr_response);
        require "db/close.php";
    }

    // lock ratings
    else if(isset($_POST['lock_ratings_for'])) {
        require "db/open.php";
        $portion_id = addslashes(htmlentities(trim($_POST['lock_ratings_for'])));
        $query = "SELECT `ID` FROM `criteria` WHERE `PortionID`=$portion_id";
        $result = mysqli_query($con, $query);
        while($row = mysqli_fetch_assoc($result)) {
            $criteria_id = $row['ID'];
            $query = "UPDATE `ratings` SET `IsLocked`=1 WHERE `CriteriaID`=$criteria_id AND `JudgeID`=$judge_id";
            mysqli_query($con, $query);
        }
        echo "1";
        require "db/close.php";
    }

    // vote
    else if(isset($_POST['vote_in'])) {
        $rating_id = addslashes(htmlentities(trim($_POST['vote_in'])));
        $candidate_id = addslashes(htmlentities(trim($_POST['vote_for'])));

        require "db/open.php";
        // determine the judge id and criteria id
        $query = "SELECT `JudgeID`, `CriteriaID` FROM `ratings` WHERE `ID`=$rating_id";
        $result = mysqli_query($con, $query);
        if(mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            $judge_id = $row['JudgeID'];
            $criteria_id = $row['CriteriaID'];

            // unvote previous
            $query = "UPDATE `ratings` SET `Rating`=0 WHERE `JudgeID`=$judge_id AND `CriteriaID`=$criteria_id";
            mysqli_query($con, $query);

            // vote current
            $query = "UPDATE `ratings` SET `Rating`=1 WHERE `ID`=$rating_id";
            mysqli_query($con, $query);

            echo "1";

        }
        require "db/close.php";
    }


    // logout judge
    else if(isset($_POST['logout'])) {
        require "cookie_destroyer.php";
        destroycookie($cookie_judge_username);
        destroycookie($cookie_judge_password);
        destroycookie($cookie_judge_fullname);
        destroycookie($cookie_judge_pic);
        destroycookie($cookie_judge_current_portion);
        echo "1";
    }
?>
