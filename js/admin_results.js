$(function() {

    var tblRatings = $('.table-ratings');
    var portionID = $('body').attr('data-id');

    function bubbleSort(a)
    {
        var swapp;
        var n = a.length-1;
        var x=a;
        do {
            swapp = false;
            for (var i=0; i < n; i++)
            {
                if (x[i] < x[i+1])
                {
                    var temp = x[i];
                    x[i] = x[i+1];
                    x[i+1] = temp;
                    swapp = true;
                }
            }
            n--;
        } while (swapp);
        return x;
    }

    function retrieveRealTimeResults() {
        $.ajax({
            type: 'POST',
            url: '../php/admin_results.php',
            data: {
                get_real_time_results_for: portionID
            },
            success: function(data) {
                var arrResponse = JSON.parse(data);
                var arrRatings = arrResponse[0];
                var arrUniqueAverages = [];
                var arrCandidatesToRank = [];
                var arrCandidateAveragesToRank = [];
                var arrCandidateRanks = [];
                for(var i=0; i<arrRatings.length; i++) {
                    var arrRating = arrRatings[i];
                    var candidateID = arrRating[0];
                    var judgeRatings = arrRating[1];
                    var totalCandidateExtraRating = parseFloat(arrRating[2]);
                    var judgeAveragePercentage = parseFloat(arrRating[3]);
                    var parentTR = tblRatings.find(".tr-candidate[data-id='" + candidateID + "']");
                    var totalRatings = 0;
                    var tieBreakerPoints = 0;
                    for(var j=0; j<judgeRatings.length; j++) {
                        var judgeRating = judgeRatings[j];
                        var judgeID = judgeRating[0];
                        var rating = parseFloat(judgeRating[1]);
                        var bg = judgeRating[2];
                        totalRatings += parseFloat(rating);

                        var tdJudgeTotal = parentTR.find(".td-judge-total[data-id='" + judgeID + "']");
                        var displayRating = "";
                        displayRating = rating.toFixed(2);
                        tdJudgeTotal.html(displayRating);
                        if(bg == 'bg-white') {
                            if(tdJudgeTotal.hasClass('bg-eee')) {
                                tdJudgeTotal.removeClass('bg-eee');
                                tdJudgeTotal.addClass('bg-white');
                            }
                        }
                        else if(bg == 'bg-eee') {
                            if(tdJudgeTotal.hasClass('bg-white')) {
                                tdJudgeTotal.removeClass('bg-white');
                                tdJudgeTotal.addClass('bg-eee');
                            }
                        }
                    }

                    var average = totalRatings / judgeRatings.length;

                    if(judgeAveragePercentage != 100) {
                        var judgeAverage = average * (judgeAveragePercentage / 100);
                        parentTR.find('.td-judge-average').html(average.toFixed(2).toString());
                        parentTR.find('.td-judge-weight').html(judgeAverage.toFixed(2).toString());

                        average = judgeAverage + totalCandidateExtraRating;
                    }
                    parentTR.find('.td-average').html(average.toFixed(2).toString());


                    if (arrUniqueAverages.indexOf(parseFloat(average)) < 0) {
                        arrUniqueAverages.push(parseFloat(average));
                    }
                    arrCandidatesToRank.push(candidateID);
                    arrCandidateAveragesToRank.push(parseFloat(average));
                }

                arrUniqueAverages = bubbleSort(arrUniqueAverages);


                var top12WinnersCTR = 0;
                tblRatings.find('.tr-candidate.winner').each(function(x) {
                    $(this).removeClass('winner');
                });

                // determine rank
                var finalRank = {};
                var minRank   = -1;
                var maxRank   = -1;
                for(var i=0; i<arrCandidatesToRank.length; i++) {
                    var candidateID = arrCandidatesToRank[i];
                    var candidateAverage = arrCandidateAveragesToRank[i];
                    var rank = arrUniqueAverages.indexOf(candidateAverage) + 1;

                    if(finalRank[rank] == null)
                        finalRank[rank] = [];
                    finalRank[rank].push(candidateID);
                    if(minRank < 0)
                        minRank = rank;
                    if(maxRank < 0)
                        maxRank = rank;
                    if(rank <= minRank)
                        minRank = rank;
                    if(rank >= maxRank)
                        maxRank = rank;

                    var parentTR = tblRatings.find(".tr-candidate[data-id='" + candidateID + "']");
                    parentTR.find('.td-rank').html(rank.toString());
                    arrCandidateRanks.push(rank);

                    var tdBgEes = tblRatings.find('td.bg-eee');
                    if(tdBgEes.length <= 0) {
                        if (portionID == 2 || portionID == 3 || portionID == 5) {
                            if (rank == 1) {
                                parentTR.addClass('winner');
                            }
                        }
                        else if (portionID == 6) {
                            var y = 1;
                            for(var x=0; x<arrUniqueAverages.length; x++) {
                                if(arrUniqueAverages[x] == candidateAverage) {
                                    break;
                                }
                                y += 1;
                            }
                            if (rank >= 1 && rank <= 10) {
                                if (tdBgEes.length <= 0) {
                                    parentTR.addClass('winner');
                                }
                            }
                        }
                    }
                }

                var orderCtr = 1;
                for(var rankCTR=minRank; rankCTR<=maxRank; rankCTR++) {
                    var orderCtrStatic = orderCtr;
                    if(finalRank[rankCTR].length > 1) {
                        let sum = 0;
                        for(let m=0; m<finalRank[rankCTR].length; m++) {
                            sum += orderCtr + m;
                        }
                        orderCtrStatic = sum / finalRank[rankCTR].length;
                    }
                    for(var finalRankCtr=0; finalRankCtr<finalRank[rankCTR].length; finalRankCtr++) {
                        var finalOrderCtr = finalRank[rankCTR].length > 1 ? Number(orderCtrStatic).toLocaleString() : orderCtr;
                        var tdFinalRank   = $('.tr-candidate[data-id="' + finalRank[rankCTR][finalRankCtr] + '"]').find('.td-rank-2');
                        tdFinalRank.html(Number(finalOrderCtr).toFixed(1).replace('.0', ''));
                        orderCtr += 1;
                    }
                }

                var arrJudges = arrResponse[1];
                for(var i=0; i<arrJudges.length; i++) {
                    var judgeID = arrJudges[i][0];
                    var bg = arrJudges[i][1];

                    var targetTh = tblRatings.find(".th-judge[data-id='" + judgeID + "']");
                    if(bg == 'bg-white') {
                        if(targetTh.hasClass('bg-eee')) {
                            targetTh.removeClass('bg-eee');
                            targetTh.addClass('bg-white');
                        }
                    }
                    else if(bg == 'bg-eee') {
                        if(targetTh.hasClass('bg-white')) {
                            targetTh.removeClass('bg-white');
                            targetTh.addClass('bg-eee');
                        }
                    }
                }

                /* DETECT TIES */
                var arrRankWithTies = [];
                var arrSortedRanks = bubbleSort(arrCandidateRanks).reverse();
                for(var n=0; n<arrSortedRanks.length-1; n++) {
                    for(var p=n+1; p<arrSortedRanks.length; p++) {
                        if(arrSortedRanks[p] != -2) {
                            if (arrSortedRanks[n] == arrSortedRanks[p]) {
                                if(arrRankWithTies.indexOf(arrSortedRanks[n]) < 0) {
                                    arrRankWithTies.push(arrSortedRanks[n]);
                                }
                                arrSortedRanks[p] = -2;
                            }
                        }
                    }
                }
                if(arrRankWithTies.length > 0) {
                    console.log("Tie at rank " + arrRankWithTies.join(", "));
                }

                /* DETEMINE WINNERS */
                var trCandidates = tblRatings.find('.tr-candidate');
                if(portionID == 2 || portionID == 3 || portionID == 5) {
                    trCandidates.each(function(z) {
                        var trCandidate = $(this);
                        var tdRank = $(this).find('.td-rank');
                        if(tdRank.html() == "1") {
                            $('#spWinnerCandidateNo').html(trCandidate.find('.candidate-no').html());
                            $('#imgWinnerPhoto').attr('src', trCandidate.find('.img-candidate').attr('src'))
                            $('#spWinnerName').html(trCandidate.find('.candidate-fullname').html());
                            $('#spWinnerAddress').html(trCandidate.find('.candidate-city').html());
                            return 0;
                        }
                    });
                }

                else if(portionID == 6) {
                    // DISREGARD TIES IN TOP 10, regardless of ties

                    var winnersCTR = 0;
                    var trWinnerss = tblRatings.find('.tr-candidate.winner');
                    for(var k=1; k<=10; k++) {
                        trWinnerss.each(function (x) {
                            var trWinner = $(this);
                            var tdRank = trWinner.find('.td-rank');
                            if (tdRank.html() == k.toString()) {
                                winnersCTR += 1;
                                if (winnersCTR > 10) {
                                    trWinner.removeClass('winner');
                                    console.log("ELIMINATED RANK: " + k.toString());

                                    // determine if same rank was inluded in winner
                                    tblRatings.find('.tr-candidate.winner').each(function() {
                                        if($(this).find('.td-rank').html() == k.toString()) {
                                            console.log("MUST INITIATE TIE BREAKER FROM JUDGES!");
                                        }
                                    });
                                }
                            }
                        });
                    }

                    // display winners
                    var arrTop10 = [];
                    tblRatings.find('.tr-candidate.winner').each(function() {
                        arrTop10.push($(this).find('.candidate-no').html());
                    });

                    arrTop10.sort(function() { return 0.5 - Math.random() });

                    var html = "<table cellspacing='2'>";
                    for(var z=0; z<arrTop10.length; z++) {
                        html += "<tr>";

                        html += "<td style='width: 64px; height: 64px;' align='center'>";
                        html += "<div style='width: 100%; height: 100%; border: 2px solid red; border-radius: 50%'>";
                        html += "<table style='width: 100%; height: 100%;'><tr><td align='center'>";
                        html += "<b>" + arrTop10[z] + "</b>";
                        html += "</td></tr></table>";
                        html += "</div>";
                        html += "</td>";

                        html += "<td style='padding-left: 5px'>";
                        html += "<ul style='list-style-type: none; margin: 0; padding: 0'>";

                        // get fullname
                        var trCandidate = tblRatings.find(".tr-candidate[data-id='" + arrTop10[z] + "']");


                        html += "<li style='line-height: 1; font-size: 0.9em'>" + trCandidate.find('.candidate-fullname').html() + "</li>";
                        html += "<li style='line-height: 1; font-size: 0.6em; text-transform: uppercase'>" + trCandidate.find('.candidate-city').html() + "</li>";
                        html += "</ul>";
                        html += "</td>";
                        html += "</tr>";
                    }
                    html += "</table>";
                    $('#spTop10').html(html);
                }

                else if(portionID == 7) {
                    trCandidates.each(function(x) {
                        $(this).find('.td-title').html("");
                        if($(this).hasClass('winner')) {
                            $(this).removeClass('winner');
                        }
                    });

                    var arrWinnerTitles = [
                        "MISS ACLC IRIGA 2022",
                        "MISS ACLC SILVER 2022",
                        "MISS ACLC CHARITY 2022",
                        "1ST RUNNER UP",
                        "2ND RUNNER UP"
                    ];

                    for(w=0; w<arrWinnerTitles.length; w++) {
                        for (var r = 1; r <= 10; r++) {
                            var winnerFound = false;
                            trCandidates.each(function (x) {
                                var candidateRank = parseInt($(this).find('.td-rank').html());
                                if (candidateRank == r) {
                                    var tdTitle = $(this).find('.td-title');
                                    var candidateTitle = tdTitle.html();
                                    if (candidateTitle == "") {
                                        tdTitle.html(arrWinnerTitles[w]);
                                        winnerFound = true;
                                        return 0;
                                    }
                                }
                            });
                            if (winnerFound) {
                                break;
                            }
                        }
                    }

                    tdBgEes = tblRatings.find('td.bg-eee');
                    if (tdBgEes.length <= 0) {
                        trCandidates.each(function(x) {
                            if($(this).find('.td-title').html() != "") {
                                if(!$(this).hasClass('winner')) {
                                    $(this).addClass('winner');
                                }
                            }
                        });
                    }


                    trCandidates.each(function(z) {
                        var trCandidate = $(this);
                        var tdTitle = $(this).find('.td-title');

                        var x = arrWinnerTitles.indexOf(tdTitle.html());
                        if(x > -1) {
                            x += 1;

                            var spWinnerCandidateNo = $("#spWinnerCandidateNo" + x.toString());
                            var imgWinnerPhoto = $("#imgWinnerPhoto" + x.toString());
                            var spWinnerName = $("#spWinnerName" + x.toString());
                            var spWinnerAddress = $("#spWinnerAddress" + x.toString());

                            spWinnerCandidateNo.html("#");
                            imgWinnerPhoto.attr('src', '');
                            spWinnerName.html("");
                            spWinnerAddress.html("");

                            spWinnerCandidateNo.html(trCandidate.find('.candidate-no').html());
                            imgWinnerPhoto.attr('src', trCandidate.find('.img-candidate').attr('src'));
                            spWinnerName.html(trCandidate.find('.candidate-fullname').html());
                            spWinnerAddress.html(trCandidate.find('.candidate-city').html());
                        }
                    });
                }
            }
        });
    }

    // unlock candidate ratings on pic click
    tblRatings.find('.img-candidate').on('click', function() {
        var candidateID = $(this).attr('data-id');
        var r = confirm("Confirm to unlock ratings for Candidate #" + candidateID);
        if(r) {
            $.ajax({
                type: 'POST',
                url: '../php/admin_results.php',
                data: {
                    unlock_ratings_for: candidateID,
                    portion: portionID
                },
                success: function (data) {
                    if(data != "1") {
                        alert(data);
                    }
                }
            });
        }
    });

    retrieveRealTimeResults();

    tmrResultRetriever = setInterval(function() {
        retrieveRealTimeResults();
    }, 1000);

    // reposition tabulator
    var divCardBodyTabulator = $('#divCardBodyTabulator');
    var tblTabulator = $('#tblTabulator');
    function repositionTblTabulator() {
        var divCardBodyTabulatorHeight = parseInt(divCardBodyTabulator.css('height'));
        var divTblTabulatorHeight = parseInt(tblTabulator.css('height'));
        var marginTop = ((divCardBodyTabulatorHeight - divTblTabulatorHeight) / 2) + 40;
        tblTabulator.css({'margin-top':marginTop.toString() + 'px'});
    }
    repositionTblTabulator();
    window.onresize = function() {
        repositionTblTabulator();
    };

    // apply colspan to tr header with logo
    var totalHeaderTD = tblRatings.find('#trMainTheadTr').find('th').length - 1;
    tblRatings.find('#tdColspanMe').attr('colspan', totalHeaderTD.toString());
});
