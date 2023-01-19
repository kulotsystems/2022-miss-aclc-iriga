$(function() {
    var activePortion = "";
    var judgeNav = $('.judge-nav');
    var modalConfirmLogout = $('#modal-confirm-logout');

    function renderRatingSheetFor(portionID) {
        $.ajax({
            type: 'POST',
            url: 'php/judge_home.php',
            data: {
                render_rating_sheet_for: portionID
            },
            success: function(data) {
                if(data == "-1") {
                    window.open('index.php', '_self');
                }
                else {
                    var arrResponse = JSON.parse(data);
                    var arrCriteria = arrResponse[0];
                    var arrCandidates = arrResponse[1];
                    var arrCandidateRatings = arrResponse[2];

                    var tblHTML = "<table class='table table-bordered' style='margin-top: -2px'>";
                        tblHTML += "<thead>";
                            tblHTML += "<tr class='tr-heading'>";
                                    tblHTML += "<th colspan='3' class='sticky-top bg-white align-center' style='font-size: 1.3em'>" + judgeNav.find('li.active .sp-portion-title').html().toUpperCase() + "</th>";

                                var strTotalLabel = "AVERAGE";
                                for(var i=0; i<arrCriteria.length; i++) {
                                    var criteriaID = arrCriteria[i][0];
                                    var criteriaTitle = arrCriteria[i][1];
                                    var criteriaPercentage = arrCriteria[i][2];
                                    tblHTML += "<th class='align-center sticky-top bg-white' data-col='" + i.toString() + "' style='vertical-align: bottom !important'><span style='font-size: 1em'>" + criteriaTitle + "</span>";
                                    if (criteriaPercentage > 0) {
                                        //tblHTML += "<br>" + criteriaPercentage + "%";
                                        var critMax = criteriaPercentage;
                                        var critMin = parseFloat(criteriaPercentage * 0.75).toFixed(1);

                                        var arrCritMin = critMin.split(".");
                                        if (arrCritMin[1] == "00")
                                            critMin = arrCritMin[0];
                                        else
                                            critMax = parseFloat(critMax).toFixed(1);

                                        tblHTML += "<div class='alert alert-info'>" + critMin + " - " + critMax + "</div>";
                                        strTotalLabel = "TOTAL";
                                    }
                                    tblHTML += "</th>";
                                }
                    tblHTML += "<th class='sticky-top bg-white align-center' data-col='" + arrCriteria.length.toString() + "'>" + strTotalLabel + "</th>";

                            tblHTML += "</tr>";
                        tblHTML += "</thead>";
                        tblHTML += "<tbody>";
                        var attrReadOnlyDisabled = "";
                        var isAllSubmitted = true;
                        for(var j=0; j<arrCandidates.length; j++) {
                            var candidateID = arrCandidates[j][0];
                            var candidateFullname = arrCandidates[j][1];
                            var candidateCity = arrCandidates[j][2];
                            var candidatePicFilename = arrCandidates[j][3];
                            tblHTML += "<tr data-id='" + candidateID + "'>";
                            tblHTML += "<td align='center' style='font-weight: bold; font-size: 1.2em'>" + candidateID + "</td>";
                            tblHTML += "<td class='tdNimation' align='center' style='padding: 4px'>";
                            // tblHTML += "<div class='arvthumbnail arvthumbnail_60'><img class='img img-thumbnail' src='img/" + candidatePicFilename + "' style='padding: 1px'></div>";
                            tblHTML += "<img class='img-candidate img' src='img/" + candidatePicFilename + "' style='width: 60px; padding: 1px; border-radius: 50%;'>";
                            tblHTML += "</td>";
                            tblHTML += "<td>";
                            tblHTML += "<ul style='list-style-type: none; padding: 0; margin: 0'>";
                            tblHTML += "<li style='line-height: 1 !important; color: #000; font-size: 0.9em'>" + candidateFullname + "</li>";
                            tblHTML += "<li style='line-height: 2 !important; color: #666; font-size: 0.6em; text-transform: uppercase'>" + candidateCity + "</li>";
                            tblHTML += "</ul>";
                            tblHTML += "</td>";
                            var arrRatingForCandidate = arrCandidateRatings[j];
                            var totalRating = 0;
                            var totalCriteriaMin = 0;
                            var totalCriteriaMax = 0;
                            var allLocked = true;
                            for(var k=0; k<arrCriteria.length; k++) {
                                var ratingID = arrRatingForCandidate[k][0];
                                var ratingRating = arrRatingForCandidate[k][1];
                                var ratingIsLocked = arrRatingForCandidate[k][2];
                                if(ratingIsLocked == '0') {
                                    isAllSubmitted = false;
                                    allLocked = false;
                                }
                                attrReadOnlyDisabled = (ratingIsLocked == '1') ? " readonly disabled" : "";
                                var criteriaMax = parseFloat(arrCriteria[k][2]);
                                var criteriaMin = parseFloat(criteriaMax * 0.75).toFixed(1);
                                tblHTML += "<td align='center'>";
                                tblHTML += "<input type='number' class='form-control txt-rating txt-rating-criteria align-center' data-id='" + ratingID + "' data-row='" + j.toString() + "' data-col='" + k.toString() + "' data-min='" + criteriaMin.toString() + "' data-max='" + criteriaMax.toString() + "' placeholder='" + criteriaMin.toString() + " - " + criteriaMax.toString() + "' value='" + ratingRating + "'" + attrReadOnlyDisabled + " data-prev-val='" + ratingRating + "'>";
                                tblHTML += "</td>";

                                totalRating += parseFloat(ratingRating);
                                totalCriteriaMin += parseFloat(criteriaMin);
                                totalCriteriaMax += parseFloat(criteriaMax);
                            }

                            tblHTML += "<td>";
                            var attrReadOnlyDisabled2 = allLocked ? " readonly disabled" : "";
                            tblHTML += "<input type='number' data-row='" + j.toString() + "' data-col='" + arrCriteria.length.toString() + "' class='form-control txt-rating txt-rating-total align-center' data-min='" + totalCriteriaMin.toString() + "'  data-max='" + totalCriteriaMax + "' placeholder='" + totalCriteriaMin.toString() + " - " + totalCriteriaMax.toString() + "' value='" + totalRating.toString() + "' style='font-weight: bold'" + attrReadOnlyDisabled2 + ">";
                            tblHTML += "</td>";
                            tblHTML += "</tr>";
                        }
                        tblHTML += "</tbody>";
                        if(arrCandidates.length > 0) {
                            tblHTML += "<tfoot>";
                            tblHTML += "<tr>";
                            tblHTML += "<td colspan='" + (3 + arrCriteria.length + 1).toString() + "'>";
                            var btnClass = 'btn-primary';
                            var btnInnerHTML = "CONFIRM...";
                            if (attrReadOnlyDisabled != "" && isAllSubmitted) {
                                btnClass = "btn-light";
                                btnInnerHTML = "<b>Successfully submitted!</b>";
                            }
                            tblHTML += "<span class='btn " + btnClass + " btn-block btn-confirm-ratings' style='border: 0 !important;'>" + btnInnerHTML + "</span>";
                            tblHTML += "</td>";
                            tblHTML += "</tr>";
                            tblHTML += "</tfoot>";
                        }
                    tblHTML += "</table>";
                    divMainContent.find('#divRatings').html(tblHTML);
                }
            }
        });
    }

    // VOTE BUTTON
    divMainContent.delegate('.btn-vote', 'click', function() {
        var newBtnVote = $(this);
        var ratingID = newBtnVote.attr('data-rating-id');
        var candidateID = newBtnVote.parent().parent().attr('data-id');

        $.ajax({
            type: 'POST',
            url: 'php/judge_home.php',
            data: {
                vote_in: ratingID,
                vote_for: candidateID
            },
            success: function(data) {
                if(data == "-1") {
                    window.open('index.php', '_self');
                }
                else if(data == "1") {
                    // unvote previous
                    var previousBtnVote = divMainContent.find('.btn-vote.btn-outline-dark');
                    previousBtnVote.removeClass('btn-outline-dark');
                    previousBtnVote.addClass('btn-light');
                    previousBtnVote.find('.fa').removeClass('fa-circle');
                    previousBtnVote.find('.fa').addClass('fa-circle-notch');

                    // vote new
                    newBtnVote.removeClass('btn-light');
                    newBtnVote.addClass('btn-outline-dark');
                    newBtnVote.find('.fa').removeClass('fa-circle-notch');
                    newBtnVote.find('.fa').addClass('fa-circle');
                }
                else {
                    alert(data);
                }
            }
        });
        newBtnVote.blur();
    });

    activePortion = judgeNav.find('li.active').attr('data-id');
    renderRatingSheetFor(activePortion);

    judgeNav.find('li').on('click', function() {
        var li = $(this);

        judgeNav.find('li.active').removeClass('active');
        li.addClass('active');
        activePortion =li.attr('data-id');
        renderRatingSheetFor(activePortion);

    });

    // arrow keys on rating sheet
    divMainContent.delegate('.txt-rating', 'keyup', function(e) {
        var thisTxt = $(this);
        var parentTD = $(this).parent();
        var parentTR = parentTD.parent();
        var dataCol = parseInt(thisTxt.attr('data-col'));
        var dataRow = parseInt(thisTxt.attr('data-row'));
        var k = e.keyCode;
        if(k >= 37 && k <= 40) {
            if (k == 40) {
                // DOWN ARROW KEY
                dataRow += 1;
                var scrollTop = document.documentElement.scrollTop + parseInt(parentTR.css('height'));
                $([document.documentElement, document.body]).animate({
                    scrollTop: scrollTop
                }, 100);
            }
            else if (k == 38) {
                // UP ARROW KEY
                dataRow -= 1;
                var scrollTop = document.documentElement.scrollTop - parseInt(parentTR.css('height'));
                $([document.documentElement, document.body]).animate({
                    scrollTop: scrollTop
                }, 100);

            }
            else if (k == 37) {
                // LEFT ARROW KEY
                dataCol -= 1;
                var scrollLeft = document.documentElement.scrollLeft - parseInt(parentTD.css('width'));
                $([document.documentElement, document.body]).animate({
                    scrollLeft: scrollLeft
                }, 100);
            }
            else if (k == 39) {
                // RIGHT ARROW KEY
                dataCol += 1;
                var scrollLeft = document.documentElement.scrollLeft + parseInt(parentTD.css('width'));
                $([document.documentElement, document.body]).animate({
                    scrollLeft: scrollLeft
                }, 100);
            }
            var nextTxt = divMainContent.find("input[data-row='" + dataRow.toString() + "'][data-col='" + dataCol.toString() + "']");
            if (nextTxt.length > 0) {
                nextTxt.focus();
                nextTxt.select();
            }
        }
        else {
            thisTxt.css({'color':'red'});
        }
    });

    // .txt-rating keydown: prevent default
    divMainContent.delegate('.txt-rating', 'keydown', function(e) {
        if (e.which === 38 || e.which === 40) {
            e.preventDefault();
        }
    });


    // .txt-rating focus: highlight row and column on
    divMainContent.delegate('.txt-rating', 'focus', function() {
        var dataCol = $(this).attr('data-col');
        var parentTR = $(this).parent().parent();
        var parentTbl = parentTR.parent().parent();
        parentTbl.find('td.active, th.active').removeClass('active');
        parentTR.find('td, th').each(function(i) {
            $(this).addClass('active');
        });
        parentTbl.find("input[data-col='" + dataCol + "']").each(function() {
            $(this).parent().addClass('active');
        });

        parentTbl.find("th[data-col='" + dataCol + "']").each(function(i) {
            $(this).addClass('active');
        });
    });

    // .txt-rating-criteria focus
    divMainContent.delegate('.txt-rating-criteria', 'focus', function() {
        $(this).select();
    });


    // .txt-rating-criteria blur
    divMainContent.delegate('.txt-rating-criteria', 'blur', function() {
        var thisTxt = $(this);
        saveTxtCriteriaData(thisTxt);
    });

    function saveTxtCriteriaData(thisTxt) {
        thisTxt.css({'background':'pink'});
        var dataID = thisTxt.attr('data-id');
        var min = parseFloat(thisTxt.attr('data-min'));
        var max = parseFloat(thisTxt.attr('data-max'));
        var val = thisTxt.val();
        if(val == "") {
            val = min;
        }
        else {
            val = parseFloat(val);
            if (val > max) {
                val = max;
            }
            else if (val < min) {
                val = min;
            }
        }
        thisTxt.val(val.toString());
        $.ajax({
            type: 'POST',
            url: 'php/judge_home.php',
            data: {
                save_rating_for: dataID,
                rating: val
            },
            success: function(data) {
                if(data == "-1") {
                    window.open('index.php', '_self');
                }
                else if(data == "1") {
                    thisTxt.css({'color':'#333'});
                    thisTxt.css({'background':'white'});

                    // recompute for the total
                    var parentTR = thisTxt.parent().parent();
                    var totalRating = 0;
                    parentTR.find('.txt-rating-criteria').each(function (i) {
                        if(!$(this).hasClass('txt-rating-separate')) {
                            totalRating += parseFloat($(this).val());
                        }
                    });
                    parentTR.find('.txt-rating-total').val(totalRating.toString());
                }
                else {
                    alert(data);
                }
            }
        });
    }

    // .txt-rating-total blur
    divMainContent.delegate('.txt-rating-total', 'blur', function() {
        var thisTxt = $(this);
        var parentTR = thisTxt.parent().parent();
        var dataID = thisTxt.attr('data-id');
        var min = parseFloat($(this).attr('data-min'));
        var max = parseFloat($(this).attr('data-max'));
        var val = thisTxt.val();
        if(val == "") {
            val = min;
        }
        else {
            val = parseFloat(val);
            if (val > max) {
                val = max;
            }
            else if (val < min) {
                val = min;
            }
        }
        thisTxt.val(val.toString());

        // get the criteria total
        var criteriaTotal = 0;
        var arrTxtRatingCriteria = parentTR.find('.txt-rating-criteria');

        arrTxtRatingCriteria.each(function(i) {
            criteriaTotal += parseFloat($(this).val());
        });

        var arrNewRatingIDs = [];
        var arrNewRatings = [];
        if(val != criteriaTotal) {
            // distribute points to every criteria
            arrTxtRatingCriteria.each(function(i) {
                var dataID = $(this).attr('data-id');
                var dataMax = parseFloat($(this).attr('data-max'));
                var newValue = val * (dataMax / 100);
                $(this).val(newValue.toString());
                $(this).css({'color':'red'});
                arrNewRatingIDs.push(dataID);
                arrNewRatings.push(newValue);
            });
        }

        if(arrNewRatingIDs.length > 0 && arrNewRatings.length > 0) {
            $.ajax({
                type: 'POST',
                url: 'php/judge_home.php',
                data: {
                    save_new_ratings_for: arrNewRatingIDs.join(']d['),
                    save_new_ratings: arrNewRatings.join(']d[')
                },
                success: function(data) {
                    if(data == "-1") {
                        window.open('index.php', '_self');
                    }
                    else if(data == "1") {
                        thisTxt.css({'color':'#333'});
                        arrTxtRatingCriteria.each(function(i) {
                            $(this).css({'color':'#333'});
                        });
                    }
                    else {
                        alert(data);
                    }
                }
            });
        }
    });


    // btn logout click
    $('.btn-logout').on('click', function() {
        modalConfirmLogout.modal('show');
    });

    // btn confirm logout click
    $('#btnConfirmLogout').on('click', function() {
        $.ajax({
            type: 'POST',
            url: 'php/judge_home.php',
            data: {
                logout: '1'
            },
            success: function(data) {
                if(data == "-1") {
                    window.open('index.php', '_self');
                }
                else if(data == "1") {
                    window.open('index.php', '_self');
                }
                else {
                    alert(data);
                }
            }
        });
    });

    // confirm and lock ratings
    divMainContent.delegate('.btn-confirm-ratings', 'click', function() {
        var btn = $(this);
        var btnVotes = $('.btn-vote');
        var txtRatingTotals = $('.txt-rating-total');
        var txtRatingCriteria = $('.txt-rating-criteria');
        var strToConfirm = "";
        if(txtRatingTotals.length > 0 && btnVotes.length <= 0)
            strToConfirm = "ratings";
        else if(txtRatingTotals.length <= 0 && btnVotes.length > 0)
            strToConfirm = "votes";
        else if(txtRatingTotals.length > 0 && btnVotes.length > 0)
            strToConfirm = "votes and ratings";

        if(!btn.hasClass('btn-light')) {
            if (btn.hasClass('btn-primary')) {
                var canProceed = true;


                if(btnVotes.length > 0) {
                    canProceed = false;
                    btnVotes.each(function (x) {
                        if ($(this).hasClass('btn-outline-dark')) {
                            canProceed = true;
                            return 0;
                        }
                    });
                    if(!canProceed) {
                        alert("PLEASE VOTE FOR 1 CANDIDATE.");
                    }
                }

                if(txtRatingCriteria.length > 0) {
                    canProceed = true;

                    txtRatingCriteria.each(function (y) {
                        if (parseFloat($(this).val()) <= 0) {
                            canProceed = false;
                            return 0;
                        }
                    });

                    if(!canProceed) {
                        alert("PLEASE RATE ALL THE CANDIDATES.");
                    }
                }

                if (canProceed) {
                    btn.removeClass('btn-primary');
                    btn.addClass('btn-info');
                    btn.html("Click again to finalize " + strToConfirm + "...");
                }
            }
            else if (btn.hasClass('btn-info')) {
                btn.removeClass('btn-info');
                btn.addClass('btn-warning');
                btn.html("<b>Click again to SUBMIT " + strToConfirm + "</b>");
            }
            else if (btn.hasClass('btn-warning')) {
                // lock ratings now!
                $.ajax({
                    type: 'POST',
                    url: 'php/judge_home.php',
                    data: {
                        lock_ratings_for: activePortion
                    },
                    success: function (data) {
                        if (data == "-1") {
                            window.open('index.php', '_self');
                        }
                        else if (data == "1") {
                            // lock all .txt-rating
                            divMainContent.find('input.txt-rating').each(function(i){
                                $(this).prop('readonly', true);
                                $(this).attr('readonly', true);
                                $(this).prop('disabled', true);
                                $(this).attr('disabled', true);
                            });

                            divMainContent.find('.btn-vote').each(function(i){
                                $(this).prop('readonly', true);
                                $(this).attr('readonly', true);
                                $(this).prop('disabled', true);
                                $(this).attr('disabled', true);
                            });

                            // remove td, th highlight
                            divMainContent.find('th.active, td.active').each(function(i) {
                                $(this).removeClass('active');
                            });


                            btn.removeClass('btn-info');
                            btn.addClass('btn-light');
                            btn.html("<b>" + strToConfirm + " successfully submitted!</b>");
                        }
                        else {
                            alert(data);
                        }
                    }
                });
            }
        }
    });

    // reposition official tabulator image
    var imgOfficialTabulator = $('#imgOfficialTabulator');
    var divMenu = $('#divMenu');
    function repositionOfficialTabulatorImage() {
        var windowHeight = window.innerHeight;
        var windowWidth = window.innerWidth;
        var divMenuHeight = parseInt(divMenu.css('height'));
        marginTop = 15;
        if(windowWidth > 575) {
            imgOfficialTabulator.show();
            var imgTabulatorHeight = parseInt(imgOfficialTabulator.css('height'));
            var marginTop = windowHeight - divMenuHeight - imgTabulatorHeight - 20;
            imgOfficialTabulator.css({'margin-top':marginTop.toString() + 'px'});
        }
        else {
            imgOfficialTabulator.hide();
        }

    }
    repositionOfficialTabulatorImage();

    window.onresize = function() {
        repositionOfficialTabulatorImage();
    };

});
