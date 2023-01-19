<?php
    require "admin_loginchecker_ajax.php";

    // get real time results
    if(isset($_POST['get_real_time_results_for'])) {
        require "db/open.php";
        $portion_id = addslashes(htmlentities(trim($_POST['get_real_time_results_for'])));

        // get all criteria
        $arr_criteria = array();
        $query = "SELECT `ID`, `Title`, `Percentage`, `IsLinkedToPortion`, `PortionLink` FROM `criteria` WHERE `PortionID`=$portion_id ORDER BY `ID`";
        $result = mysqli_query($con, $query);
        while($row = mysqli_fetch_assoc($result)) {
            array_push($arr_criteria, array(
                $row['ID'],
                $row['IsLinkedToPortion'],
                $row['PortionLink'],
                $row['Percentage']
            ));
        }

        // get all extra criteria
        $arr_extra_criteria = array();
        $total_extra_criteria_percentage = 0;
        $has_visible_extra_criteria = false;
        $query = "SELECT `ID`, `Title`, `Percentage`, `IsHidden` FROM `extra_criteria`  WHERE `PortionID`=$portion_id ORDER BY `ID`";
        $result = mysqli_query($con, $query);
        while($row = mysqli_fetch_assoc($result)) {
            array_push($arr_extra_criteria, array(
                $row['ID'],
                $row['Percentage']
            ));
            $total_extra_criteria_percentage += floatval($row['Percentage']);
            if(!$has_visible_extra_criteria) {
                if(intval($row['IsHidden'] == 0)) {
                    $has_visible_extra_criteria = true;
                }
            }
        }
        $judge_average_percentage = 100 - $total_extra_criteria_percentage;


        // get all candidate ids
        $arr_candidates = array();
        if(intval($portion_id) == 7) {
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
                $query = "SELECT `ID` FROM `candidates` WHERE `ID`=" . $arr_top_10[$x];
                $result = mysqli_query($con, $query);
                while($row = mysqli_fetch_assoc($result)) {
                    array_push($arr_candidates, $row['ID']);
                }
            }
        }
        else {
            $query = "SELECT `ID` FROM `candidates` ORDER BY `ID`";
            $result = mysqli_query($con, $query);
            while($row = mysqli_fetch_assoc($result)) {
                array_push($arr_candidates, $row['ID']);
            }
        }

        // get all the judge ids
        $arr_judges = array();
        $query = "SELECT `ID` FROM `judges` ORDER BY `ID`";
        $result = mysqli_query($con, $query);
        $result = mysqli_query($con, $query);
        while($row = mysqli_fetch_assoc($result)) {

            // determine if judge already locked his/her ratings for this portion
            $judge_bg = 'bg-eee';
            $total_locked_ratings = 0;
            for($i=0; $i<sizeof($arr_candidates); $i++) {
                $candidate_id = $arr_candidates[$i][0];
                $query = "SELECT `IsLocked` FROM `ratings` WHERE `IsLocked`=1 AND `JudgeID`=" . $row['ID'] . " AND `CandidateID`=$candidate_id";
                $result2 = mysqli_query($con, $query);
                if(mysqli_num_rows($result2) > 0) {
                    $total_locked_ratings += 1;
                }
            }
            if($total_locked_ratings == sizeof($arr_candidates)) {
                $judge_bg = 'bg-white';
            }
            array_push($arr_judges, array($row['ID'], $judge_bg));

        }

        // get ratings
        $arr_ratings = array();
        for($i=0; $i<sizeof($arr_candidates); $i++) {
            $arr_candidate_rating = array();
            $candidate_id = $arr_candidates[$i];

            $arr_judge_ratings = array();
            for($j=0; $j<sizeof($arr_judges); $j++) {
                $arr_judge_rating = array();
                $judge_id = $arr_judges[$j][0];
                $judge_bg = 'bg-white';
                $judge_total_rating = 0;
                $linked_to_portion_ctr = 0;
                for($k=0; $k<sizeof($arr_criteria); $k++) {
                    $criteria_id = $arr_criteria[$k][0];
                    $criteria_percentage = $arr_criteria[$k][3];
                    $criteria_is_linked_to_portion = intval($arr_criteria[$k][1]);
                    $criteria_portion_link = intval($arr_criteria[$k][2]);

                    if ($criteria_is_linked_to_portion == 0) {
                        // NOT LINKED TO PORTION
                        $query = "SELECT `Rating`, `IsLocked` FROM `ratings` WHERE `JudgeId`=$judge_id AND `CandidateID`=$candidate_id AND `CriteriaID`=$criteria_id";
                        $result2 = mysqli_query($con, $query);
                        if (mysqli_num_rows($result2) > 0) {
                            $row2 = mysqli_fetch_assoc($result2);
                            $rating = floatval($row2['Rating']);
                            $is_locked = intval($row2['IsLocked']);
                            if ($is_locked == 0) {
                                $judge_bg = "bg-eee";
                            }
                            $judge_total_rating += $rating;
                        }
                        else {
                            $judge_bg = "bg-eee";
                        }
                    }
                    else {
                        // LINKED TO PORTION
                        $query = "SELECT `ratings`.`Rating` FROM `criteria`, `ratings` ";
                        $query .= "WHERE `criteria`.`PortionID`=" . $criteria_portion_link . " AND ";
                        $query .= "`criteria`.`ID`=`ratings`.`CriteriaID` AND ";
                        $query .= "`ratings`.`CandidateID`=$candidate_id AND ";
                        $query .= "`ratings`.`JudgeID`=$judge_id";

                        $result2 = mysqli_query($con, $query);
                        $ctr = 0;
                        $judge_portion_rating = 0;
                        while ($row2 = mysqli_fetch_assoc($result2)) {
                            $judge_portion_rating += floatval($row2['Rating']);
                            $ctr += 1;
                        }
                        $judge_total_rating += $judge_portion_rating * (floatval($criteria_percentage) / 100.0);
                    }
                }

                array_push($arr_judge_rating, $judge_id);
                array_push($arr_judge_rating, $judge_total_rating);
                array_push($arr_judge_rating, $judge_bg);

                array_push($arr_judge_ratings, $arr_judge_rating);
            }

            $total_candidate_extra_rating = 0;
            for($j=0; $j<sizeof($arr_extra_criteria); $j++) {
                // get rating for this extra criteria for this candidate
                $extra_criteria_rating = 0;

                $query = "SELECT `Rating` FROM `extra_ratings` WHERE `ExtraCriteriaID`=" . $arr_extra_criteria[$j][0] . " AND `CandidateID`=$candidate_id";
                $result = mysqli_query($con, $query);
                if(mysqli_num_rows($result) > 0) {
                    $row = mysqli_fetch_assoc($result);
                    $extra_criteria_rating = floatval($row['Rating']);
                }

                // get the weight of this extra criteria
                $extra_criteria_weight = $extra_criteria_rating * ($arr_extra_criteria[$j][1] / 100);
                $total_candidate_extra_rating += $extra_criteria_weight;
            }

            array_push($arr_candidate_rating,  $candidate_id);
            array_push($arr_candidate_rating,  $arr_judge_ratings);
            array_push($arr_candidate_rating,  $total_candidate_extra_rating);
            array_push($arr_candidate_rating,  $judge_average_percentage);
            array_push($arr_ratings, $arr_candidate_rating);
        }

        echo json_encode(array($arr_ratings, $arr_judges));
        require "db/close.php";
    }

    // unlock candidate ratings
    else if(isset($_POST['unlock_ratings_for'])) {
        require "db/open.php";
        $portion_id = addslashes(htmlentities(trim($_POST['portion'])));
        $candidate_id = addslashes(htmlentities(trim($_POST['unlock_ratings_for'])));

        // get chairman of judges
        $arr_chairman_of_judges = array();
        $query = "SELECT `ID` FROM `judges` WHERE `IsChairman` = 1";
        $result = mysqli_query($con, $query);
        while($row = mysqli_fetch_assoc($result)) {
            array_push($arr_chairman_of_judges, $row['ID']);
        }

        if(sizeof($arr_chairman_of_judges) <= 0) {
            // NO CHAIRMAN
            $query = "SELECT `ID` FROM `criteria` WHERE `PortionID`=$portion_id";
            $result = mysqli_query($con, $query);
            while ($row = mysqli_fetch_assoc($result)) {
                $criteria_id = $row['ID'];
                $query = "UPDATE `ratings` SET `IsLocked`=0 WHERE `CandidateID`=$candidate_id AND `CriteriaID`=$criteria_id";
                mysqli_query($con, $query);
            }
        }
        else {
            // HAS CHAIRMAN
            $query = "SELECT `ID` FROM `criteria` WHERE `PortionID`=$portion_id";
            $result = mysqli_query($con, $query);
            while ($row = mysqli_fetch_assoc($result)) {
                $criteria_id = $row['ID'];
                $query = "UPDATE `ratings` SET `IsLocked`=0 WHERE `CandidateID`=$candidate_id AND `CriteriaID`=$criteria_id AND `JudgeID` IN (" . implode(",", $arr_chairman_of_judges) . ")";
                mysqli_query($con, $query);
            }
        }
        echo "1";
        require "db/close.php";
    }
?>
