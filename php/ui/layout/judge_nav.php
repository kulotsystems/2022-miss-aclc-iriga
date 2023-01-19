<?php
    echo "<div class='sticky-top'>";
    echo "<div id='divMenu'>";
    echo "<div style='margin-bottom: 45px; margin-top: -15px; padding-top: 15px;'>";
    echo "<img src='" . $path . "img/_header.png' class='img' style='width: 100%; border-radius: 4px; background: #023354; padding: 5px'>";
    echo "</div>";

    echo "<table style='width: 100%; margin-bottom: 25px'>";
    echo "<tr>";
        echo "<td align='center' class='d-none d-md-table-cell'>";
            echo "<img class='img' src='" . $path . "img/" . $filename . "' style='border-radius: 50%; width: 120px'>";
        echo "</td>";
        echo "<td>";
            echo "<ul style='list-style-type: none; padding: 0; margin: 0'>";
            echo "<li style='line-height: 1 !important; font-size: 2em; font-weight: bold; margin-bottom: 3px'>Judge #" . $judge_id . "</li>";
            echo "<li style='line-height: 1 !important; font-size: 1.6em;'>" . $fullname . "</li>";
            echo "<li style='line-height: 1 !important;'><span class='btn btn-xs btn-link btn-logout text-danger' style='margin: 0; padding: 0; font-size: 0.7em'>LOGOUT</span></li>";
            echo "</ul>";
        echo "</td>";
    echo "</tr>";
    echo "</table>";
    require $path."php/db/open.php";
    $query = "SELECT `ID`, `Title` FROM `portions` ORDER BY `DateAdded`";
    $result = mysqli_query($con, $query);
    if(mysqli_num_rows($result) <= 0) {
        echo "<span class='judge-nav'>* no portions</span>";
    }
    else {
        echo "<ul class='list-group judge-nav' style='margin-bottom: 15px'>";
        $ctr = 0;

        $arr_portions = array();

        while($row = mysqli_fetch_assoc($result)) {
            array_push($arr_portions, array(
                'portion_id' => $portion_id = $row['ID'],
                'portion_title' => $row['Title']
            ));
        }

        $arr_portion_order = array(1, 2, 3, 4, 5, 7);
        for($i=0; $i<sizeof($arr_portion_order); $i++) {

            for($j=0; $j<sizeof($arr_portions); $j++) {
                if(intval($arr_portion_order[$i]) == intval($arr_portions[$j]['portion_id'])) {

                    $portion_id = $arr_portions[$j]['portion_id'];
                    $portion_title = $arr_portions[$j]['portion_title'];

                    $attr_active = '';
                    if (isset($_COOKIE[$cookie_judge_current_portion])) {
                        if (intval($_COOKIE[$cookie_judge_current_portion]) == intval($portion_id)) {
                            $attr_active = ' active';
                        }
                    }
                    else {
                        if ($ctr == 0) {
                            $attr_active = ' active';
                        }
                    }
                    echo "<li class='list-group-item cursor-pointer" . $attr_active . "' data-id='" . $portion_id . "'>" . ($ctr + 1) . ". <span class='sp-portion-title'>" . $portion_title . "</span></li>";
                    $ctr += 1;
                }
            }
        }
        echo "</ul>";
    }
    require $path."php/db/close.php";

    // echo "</div>";
    // echo "<img id='imgOfficialTabulator' src='" . $path . "img/_official_tabulator.png' style='width: 100%;'>";
    // echo "</div>";


    echo "</div>";
    echo "<span id='imgOfficialTabulator'></span>";
    echo "</div>";

?>
