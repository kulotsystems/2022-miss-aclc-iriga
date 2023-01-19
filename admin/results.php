<?php
    date_default_timezone_set('Asia/Manila');
    $portion_id = "";
    if(isset($_GET['p'])) {
        $portion_id = intval($_GET['p']);
    }
    else {
        exit();
    }

    function get_str_time($t) {
        $t = (strpos(''.$t.'', ' ') > 0) ? strtotime($t) : $t;
        $d = date('m/d/Y g:i a', $t);

        $arr_d = explode(' ', $d);
        $dd = $arr_d[0];
        $dt = $arr_d[1];
        $ta = $arr_d[2];

        $arr_dd = explode('/', $dd);
        $arr_dt = explode(':', $dt);

        $arr_months = array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
        $new_dd = $arr_months[intval($arr_dd[0])-1] . ". " . intval($arr_dd[1]) . ", " . $arr_dd[2];
        $new_dt = $dt;

        return $new_dd . " " . $new_dt . $ta;
    }
?>
<?php $page='results'; $path = '../'; ?>
<?php require $path."php/app.php";?>
<?php require $path."php/admin_loginchecker.php";?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require $path."php/ui/global_imports.php";?>
    <?php require $path."php/ui/admin_js_codes.php";?>
    <script src="<?php echo $path; ?>js/admin_results.js?<?php echo $script_version;?>"></script>
    <title>Results ~ Admin | <?php echo $app_name; ?></title>
    <style>
        .tr-bg {
            background-color: #023354 !important;
        }
    </style>
    <link rel="stylesheet" type="text/css" href="print.css" media="print">
</head>
<body id="<?php echo $page;?>" rel="admin" data-path="<?php echo $path;?>" data-id="<?php echo $portion_id; ?>">
<div class="container-fluid" id="main-content">
<?php
    require $path . "php/db/open.php";
    // get portion details
    $portion_title = "";
    $query = "SELECT `Title` FROM `portions` WHERE `ID`=$portion_id";
    $result = mysqli_query($con, $query);
    while($row = mysqli_fetch_assoc($result)) {
        $portion_title = $row['Title'];
        if($portion_title == "SWIMSUIT / Q&A") {
            $portion_title = "SWIMSUIT";
        }
    }

    // get all criteria
    $arr_criteria = array();
    $query = "SELECT `ID`, `Title`, `Percentage`, `IsLinkedToPortion`, `PortionLink` FROM `criteria` WHERE `PortionID`=$portion_id ORDER BY `ID`";
    $result = mysqli_query($con, $query);
    while($row = mysqli_fetch_assoc($result)) {
        array_push($arr_criteria, array(
            $row['ID'],
            $row['Title'],
            $row['Percentage'],
            $row['IsLinkedToPortion'],
            $row['PortionLink']
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
            $row['Title'],
            $row['Percentage'],
            $row['IsHidden']
        ));
        $total_extra_criteria_percentage += floatval($row['Percentage']);
        if(!$has_visible_extra_criteria) {
            if(intval($row['IsHidden'] == 0)) {
                $has_visible_extra_criteria = true;
            }
        }
    }
    $judge_average_percentage = 100 - $total_extra_criteria_percentage;

    // get all candidates
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
            while ($row = mysqli_fetch_assoc($result)) {
                array_push($arr_candidates, array(
                    $row['ID'],
                    $row['FullName'],
                    $row['City'],
                    $row['PicFilename']
                ));
            }
        }
    }
    else {
        $query = "SELECT `ID`, `FullName`, `City`, `PicFilename` FROM `candidates` ORDER BY `ID`";
        $result = mysqli_query($con, $query);
        while ($row = mysqli_fetch_assoc($result)) {
            array_push($arr_candidates, array(
                $row['ID'],
                $row['FullName'],
                $row['City'],
                $row['PicFilename']
            ));
        }
    }

    // get all the judges
    $arr_judges = array();
    $query = "SELECT `ID`, `FullName`, `IsChairman`, `PicFilename` FROM `judges` ORDER BY `ID`";
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
        array_push($arr_judges, array(
            $row['ID'],
            $row['FullName'],
            $row['IsChairman'],
            $row['PicFilename'],
            $judge_bg
        ));
    }

    echo "<div class='' align='left'>";
    echo "<span class='float-right' style='margin-top: 15px'>" . get_str_time(time()) . "</span>";
    echo "</div>";

    echo "<table class='table table-sm table-bordered table-ratings' style='margin-top: 0'>";
    echo "<thead>";
        echo "<tr class='tr-bg' style='border: 0'>";
            echo "<td colspan='3' class='tr-bg' align='center' style='border: 0;'>
                <div class='tr-bg' style='padding: 15px; margin: -5px'>
                <img src='../img/_header.png' style='width: 200px'>
                </div>
                </td>";
            echo "<td id='tdColspanMe' class='tr-bg' style='border: 0'>
                <div class='tr-bg' style='padding: 15px; margin: -5px'>
                <img src='../img/_header.png' style='width: 200px; visibility: hidden'>
                </div>
                </td>";
        echo "</tr>";
        echo "<tr id='trMainTheadTr'>";
            $th_rowspan = ($has_visible_extra_criteria) ? '2' : '0';
            echo "<th colspan='3' class='align-center text-primary' style='text-transform: uppercase; font-size: 1.6em' rowspan='" . $th_rowspan . "'>" . $portion_title . "</th>";
            for($i=0; $i<sizeof($arr_judges); $i++) {
                $judge_id = $arr_judges[$i][0];
                $judge_fullname = $arr_judges[$i][1];
                $judge_is_chairman = $arr_judges[$i][2];
                $judge_pic_filename = $arr_judges[$i][3];
                $judge_bg = $arr_judges[$i][4];

                echo "<th class='align-center " . $judge_bg . " th-judge' data-id='" . $judge_id . "' rowspan='" . $th_rowspan . "'>JUDGE<br>#" . $judge_id ."</th>";
            }
            if(!$has_visible_extra_criteria) {
                // no visible extra criteria

                echo "<th class='align-center' rowspan='" . $th_rowspan . "'>FINAL<br>AVERAGE</th>";
                echo "<th class='align-center d-print-none' rowspan='" . $th_rowspan . "'>DENSE<br>RANK</th>";
                echo "<th class='align-center' rowspan='" . $th_rowspan . "'>FRACTIONAL<br>RANK</th>";

                if($portion_id == 7) {
                    echo "<th class='align-center' rowspan='" . $th_rowspan . "'>TITLE</th>";
                }
                echo "</tr>";
            }
            else {
                // has visible extra criteria
                echo "<th class='align-center' colspan='2'>JUDGE AVERAGE</th>";

                for ($i = 0; $i < sizeof($arr_extra_criteria); $i++) {
                    if(intval($arr_extra_criteria[$i][3]) == 0) {
                        echo "<th class='align-center' colspan='2'>" . $arr_extra_criteria[$i][1] . "</th>";
                    }
                }
                echo "<th class='align-center' rowspan='" . $th_rowspan . "'>FINAL<br>AVERAGE</th>";
                echo "<th class='align-center d-print-none' rowspan='" . $th_rowspan . "'>DENSE<br>RANK</th>";
                echo "<th class='align-center' rowspan='" . $th_rowspan . "'>FRACTIONAL<br>RANK</th>";
                if($portion_id == 7) {
                    echo "<th class='align-center' rowspan='" . $th_rowspan . "'>TITLE</th>";
                }
                echo "</tr>";


                echo "<tr>";

                echo "<th class='align-center'></th>";
                echo "<th class='align-center'>" . $judge_average_percentage . "%</th>";
                for ($i = 0; $i < sizeof($arr_extra_criteria); $i++) {
                    if(intval($arr_extra_criteria[$i][3]) == 0) {
                        echo "<th class='align-center'></th>";
                        echo "<th class='align-center'>" . $arr_extra_criteria[$i][2] . "%</th>";
                    }
                }
                echo "</tr>";
            }
    echo "</thead>";

    echo "<tbody>";
    for($i=0; $i<sizeof($arr_candidates); $i++) {
        $candidate_id = $arr_candidates[$i][0];
        $candidate_fullname = $arr_candidates[$i][1];
        $candidate_city = $arr_candidates[$i][2];
        $candidate_pic_filename = $arr_candidates[$i][3];
        echo "<tr class='tr-candidate' data-id='$candidate_id'>";
        echo "<td align='center' class='candidate-no' style='font-weight: bold; font-size: 1.4em'>". $candidate_id . "</td>";
        echo "<td align='center' style='padding: 4px'>";
        echo "<img class='img img-candidate' data-id='" . $candidate_id . "' src='" . $path . "img/" . $candidate_pic_filename . "' style='width: 60px; border-radius: 50%'>";
        echo "</td>";
        echo "<td>";
        echo "<ul style='list-style-type: none; padding: 0; margin: 0'>";
        echo "<li class='candidate-fullname' style='line-height: 1 !important; color: #000; font-size: 0.9em; text-transform: none'>" . $candidate_fullname . "</li>";
        echo "<li class='candidate-city' style='line-height: 2 !important; color: #333; font-size: 0.65em; text-transform: uppercase'>" . $candidate_city . "</li>";
        echo "</ul>";
        echo "</td>";

        $total_rating = 0;
        for($j=0; $j<sizeof($arr_judges); $j++) {
            $judge_id = $arr_judges[$j][0];
            $is_chairman = intval($arr_judges[$j][2]);
            $judge_total_rating = 0;
            $judge_total_bg = 'bg-white';
            $linked_to_portion_ctr = 0;
            for($k=0; $k<sizeof($arr_criteria); $k++) {
                $criteria_id = $arr_criteria[$k][0];
                $criteria_percentage = $arr_criteria[$k][2];
                $criteria_is_linked_to_portion = intval($arr_criteria[$k][3]);
                $criteria_portion_link = intval($arr_criteria[$k][4]);

                if($criteria_is_linked_to_portion == 0) {
                    // NOT LINKED TO PORTION
                    $query = "SELECT `Rating`, `IsLocked` FROM `ratings` WHERE `JudgeId`=$judge_id AND `CandidateID`=$candidate_id AND `CriteriaID`=$criteria_id";
                    $result2 = mysqli_query($con, $query);
                    if (mysqli_num_rows($result2) > 0) {
                        $row2 = mysqli_fetch_assoc($result2);
                        $rating = floatval($row2['Rating']);
                        $is_locked = $row2['IsLocked'];
                        if (intval($is_locked) == 0) {
                            $judge_total_bg = 'bg-eee';
                        }
                        $judge_total_rating += $rating;
                    }
                    else {
                        $judge_total_bg = 'bg-eee';
                    }
                }

                else {
                    // LINKED TO PORTION
                    $query  = "SELECT `ratings`.`Rating` FROM `criteria`, `ratings` ";
                    $query .= "WHERE `criteria`.`PortionID`=" . $criteria_portion_link . " AND ";
                    $query .= "`criteria`.`ID`=`ratings`.`CriteriaID` AND ";
                    $query .= "`ratings`.`CandidateID`=$candidate_id AND ";
                    $query .= "`ratings`.`JudgeID`=$judge_id ";
                    $query .= "ORDER BY `criteria`.`ID`";

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

            $total_rating += $judge_total_rating;
            $color_class = ($is_chairman == 1) ? ' text-danger' : '';
            echo "<td align='center' class='td-judge-total " . $judge_total_bg . $color_class . "' data-id='$judge_id'>";
            if($judge_total_rating > 0) {
                echo number_format($judge_total_rating, 2);
            }
            echo "</td>";
        }
        $judge_average = $total_rating / sizeof($arr_judges);
        if(!$has_visible_extra_criteria) {
            // no visible extra criteria
            echo "<td align='center' class='td-average' style='font-weight: bold;'>" . number_format($judge_average, 2) . "</td>";
            echo "<td align='center' class='td-rank d-print-none' style='font-weight: bold;'></td>";
            echo "<td align='center' class='td-rank-2' style='font-weight: bold;'></td>";
            if($portion_id == 7) {
                echo "<td align='center' class='td-title' style='font-weight: bold;'></td>";
            }
        }
        else {
            // has visible extra criteria
            $final_average = 0;
            echo "<td align='center' class='td-judge-average' style='font-weight: bold;'>" . number_format($judge_average, 2) . "</td>";
            $judge_weight = $judge_average * ($judge_average_percentage / 100);
            $final_average += $judge_weight;
            echo "<td align='center' class='td-judge-weight' style='font-weight: bold;'>" . number_format($judge_weight, 2) . "</td>";

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
                $extra_criteria_weight = $extra_criteria_rating * ($arr_extra_criteria[$j][2] / 100);

                $final_average += $extra_criteria_weight;

                if(intval($arr_extra_criteria[$j][3]) == 0) {
                    echo "<td align='center' class='td-extra-criteria-rating' style='font-weight: bold;'>" . number_format($extra_criteria_rating, 2) . "</td>";
                    echo "<td align='center' class='td-extra-criteria-weight' style='font-weight: bold;'>" . number_format($extra_criteria_weight, 2) . "</td>";
                }
            }

            echo "<td align='center' class='td-average' style='font-weight: bold;'>" . number_format($final_average, 2) . "</td>";
            echo "<td align='center' class='td-rank d-print-none' style='font-weight: bold;'></td>";
            echo "<td align='center' class='td-rank-2' style='font-weight: bold;'></td>";
            if($portion_id == 7) {
                echo "<td align='center' class='td-title' style='font-weight: bold;'></td>";
            }
        }
        echo "</tr>";
    }
    echo "</tbody>";
    echo "</table>";
    echo "<div class='row' style='page-break-after: always'>";
        echo "<div class='col-sm-12'>";
            echo "<div class='card h-100'>";
                echo "<div class='card-header align-center tr-bg text-white'><b>BOARD OF JUDGES</b></div>";
                echo "<div class='card-body'>";
                    echo "<div class='row'>";
                    for($m=0; $m<sizeof($arr_judges); $m++) {
                        $judge_id = $arr_judges[$m][0];
                        $judge_fullname = $arr_judges[$m][1];
                        $judge_is_chairman = (intval($arr_judges[$m][2]) == 1) ? ' : <span class="text-danger">Chairman</span>' : '';
                        echo "<div class='col-sm-4' align='center' style='padding: 0'>";
                        echo "<ul style='list-style-type: none; padding: 0; margin: 0; margin-top: 25px; margin-bottom: 15px'>";
                            echo "<li style='line-height: 1; font-size: 1em'><b>" . $judge_fullname  . "</b></li>";
                            echo "<li style='line-height: 1; font-size: 1em'>Judge #$judge_id" . $judge_is_chairman . "</li>";
                        echo "</ul>";
                        echo "</div>";
                    }
                    echo "</div>";
                echo "</div>";
            echo "</div>";
        echo "</div>";
        /*echo "<div class='col-sm-3' id='divCardBodyTabulator'>";
            echo "<img id='tblTabulator' src='" . $path . "img/_official_tabulator.png' style='width: 100%'>";
        echo "</div>";*/
    echo "</div>";

    $arr_portion_to_show_winner = array(2, 3, 5);
    if(in_array($portion_id, $arr_portion_to_show_winner)) {
        echo "<div align='center' style='font-size: 1.8em !important;'>";
        echo "<div class='tr-bg' style='padding: 15px'>";
        echo "<img src='../img/_header.png' style='width: 480px'>";
        echo "</div>";
        echo "<br>";
        echo "<h2 class='text-primary'>BEST IN</h2>";
        $arr_portion_title = explode("<br>", $portion_title);
        echo "<h1 class='text-primary'>" . trim($arr_portion_title[0]) . "</h1>";
        echo "<img id='imgWinnerPhoto' src='' style='width: 150px; border-radius: 50%'>";
        echo "<h1>Candidate No. <big id='spWinnerCandidateNo'></big></h1>";
        echo "<h2 id='spWinnerName'></h2>";
        echo "<h3 id='spWinnerAddress'></h3>";
        echo "<br>";
        //echo "<img src='" . $path . "img/_official_tabulator.png' style='width: 320px'>";
        echo "</div>";
    }
    else if($portion_id == 6) {
        echo "<div align='center' style='font-size: 1.8em !important;'>";
        echo "<div class='tr-bg' style='padding: 15px'>";
        echo "<img src='../img/_header.png' style='width: 480px'>";
         echo "</div>";
        echo "<br>";
        echo "<h1 class='text-primary'>TOP 10</h1>";
        echo "<h3 class='text-primary'>(IN NO PARTICULAR ORDER)</h3>";
        echo "<br>";
        echo "<div id='spTop10'></div>";
        echo "<br>";
        //echo "<img src='" . $path . "img/_official_tabulator.png' style='width: 320px'>";
        echo "</div>";
    }
    else if($portion_id == 7) {
        $arr_titles = array('MISS ACLC IRIGA 2022', 'MISS ACLC SILVER 2022', 'MISS ACLC CHARITY 2022', '1st RUNNER UP', '2nd RUNNER UP');
        for($i=0; $i<5; $i++) {
            echo "<div align='center' style='page-break-after: always; font-size: 1.8em !important;'>";
            echo "<div class='tr-bg' style='padding: 15px'>";
            echo "<img src='../img/_header.png' style='width: 480px'>";
            echo "</div>";
            echo "<br>";
            echo "<h1 class='text-primary'>" . trim($arr_titles[$i]) . "</h1>";
            $j = $i + 1;
            echo "<img id='imgWinnerPhoto" . $j . "' src='' style='width: 150px; border-radius: 50%'>";
            echo "<h1>Candidate No. <big id='spWinnerCandidateNo" . $j . "'></big></h1>";
            echo "<h2 id='spWinnerName" . $j . "'></h2>";
            echo "<h3 id='spWinnerAddress" . $j . "'></h3>";
            echo "<br>";
            //echo "<img src='" . $path . "img/_official_tabulator.png' style='width: 320px'>";
            echo "</div>";
        }
    }


    require $path . "php/db/close.php";
?>
</div>
</body>
</html>
