$(function() {
    var editingCriteria = "";
    var editingExtraCriteria = "";
    var activePortion = "";
    var divCriteria = $('#divCriteria');

    var modalCriteria = $('#modal-criteria');
    var txtCriteriaTitle = modalCriteria.find('#txtCriteriaTitle');
    var txtCriteriaPercentage = modalCriteria.find('#txtCriteriaPercentage');
    var cboPortionLink = modalCriteria.find('#cboPortionLink');

    var modalExtraCriteria = $('#modal-extra-criteria');
    var txtExtraCriteriaTitle = modalExtraCriteria.find('#txtExtraCriteriaTitle');
    var txtExtraCriteriaPercentage = modalExtraCriteria.find('#txtExtraCriteriaPercentage');
    var cboExtraCriteriaIsHidden = modalExtraCriteria.find('#cboExtraCriteriaIsHidden');

    var modalCriteriaRemove = $('#modal-criteria-remove');
    var modalExtraCriteriaRemove = $('#modal-extra-criteria-remove');
    var parentTR;
    var parentCard;

    function getAllCriteria() {
        $.ajax({
            type: 'POST',
            url: '../php/admin_criteria.php',
            data: {
                get_all_criteria: '1'
            },
            success: function(data) {
                if(data != "") {
                    if(data == "-1") {
                        window.open('index.php', '_self');
                    }
                    else {
                        var arrData = data.split("]s[");
                        if(arrData[0] == "1") {
                        if(arrData[1] != "") {
                            var cardHTML = "";
                                var arrCriteria = arrData[1].split("]r[");
                                for(var i=0; i<arrCriteria.length; i++) {
                                    var arrPortion = arrCriteria[i].split("]d[");
                                    var portionID = arrPortion[0];
                                    var portionTitle = arrPortion[1];
                                    cardHTML += "<div class='col-sm-6' style='margin-bottom: 15px'>";
                                        cardHTML += "<div class='card h-100' data-id='" + portionID + "'>";
                                            cardHTML += "<div class='card-header'>" + (i+1).toString() + ". <span class='sp-portion-title' style='font-weight: bold'>" + portionTitle + "</span><button class='btn btn-sm btn-link text-success float-right btn-add-criteria'><span class='fa fa-plus-circle'></span> Criteria</button></div>";
                                            cardHTML += "<div class='card-body'>";
                                                cardHTML += "<table class='table table-borderless no-margin table-sm'>";
                                                    cardHTML += "<tbody class='tbody-criteria'>";
                                                    var totalPercentage = 0;
                                                    if(arrPortion[2] != "") {
                                                        var arrCriterionItems = arrPortion[2].split("]dd[");
                                                        for (var j = 0; j < arrCriterionItems.length; j++) {
                                                            var criterion = arrCriterionItems[j].split("]ddd[");
                                                            var criterionID = criterion[0];
                                                            var criterionTitle = criterion[1];
                                                            var criterionPercentage = parseFloat(criterion[2]);
                                                            var criterionIsLinkedToPortion = parseInt(criterion[3]);
                                                            var criterionPortionLink = criterion[4];
                                                            cardHTML += "<tr data-id='" + criterionID + "' data-is-linked-to-portion='" + criterionIsLinkedToPortion + "' data-portion-link='" + criterionPortionLink + "'>";
                                                            var textClass = (criterionIsLinkedToPortion == "1") ? " text-primary" : "";
                                                            cardHTML += "<td class='criterion-title" + textClass + "'>" + criterionTitle + "</td>";
                                                            cardHTML += "<td class='criterion-percentage align-right'><span class='sp-percentage'>" + criterionPercentage.toString() + "</span>%</td>";
                                                            cardHTML += "<td align='right'>";
                                                            cardHTML += "<button class='btn btn-sm btn-link btn-edit-criteria'><span class='fa fa-edit'></span></button>";
                                                            cardHTML += "<button class='btn btn-sm btn-link btn-remove-criteria text-danger'><span class='fa fa-trash'></span></button>";
                                                            cardHTML += "</td>";
                                                            cardHTML += "</tr>";
                                                            totalPercentage += criterionPercentage;
                                                        }
                                                    }
                                                    cardHTML += "</tbody>";
                                                    cardHTML += "<tfoot>";
                                                    cardHTML += "<tr>";
                                                    cardHTML += "<th>TOTAL</th>";
                                                    if(totalPercentage == 0)
                                                        totalPercentage = "[AVE]";
                                                    cardHTML += "<th class='align-right td-total-percentage'><span class='sp-total-percentage'>" + totalPercentage.toString() + "</span>%</th>";
                                                    cardHTML += "<th></th>";
                                                    cardHTML += "</tr>";
                                                    cardHTML += "</tfoot>";
                                                cardHTML += "</table>";

                                                // EXTRA CRITERIA -->
                                                cardHTML += "<div class='card' style='margin-top: 15px'>";
                                                    cardHTML += "<div class='card-header' style='padding: 0;'><button class='btn btn-sm btn-link text-success btn-add-extra-criteria'><span class='fa fa-plus-circle'></span> Extra Criteria</button></div>";
                                                    cardHTML += "<div class='card-body' style='padding: 0;'>";
                                                        cardHTML += "<table class='table table-borderless no-margin table-sm'>";
                                                            cardHTML += "<tbody class='tbody-extra-criteria'>";
                                                            if(arrPortion[3] != "") {
                                                                var arrExtraCriterionItems = arrPortion[3].split("]dd[");
                                                                for (var j = 0; j < arrExtraCriterionItems.length; j++) {
                                                                    var extraCriterion = arrExtraCriterionItems[j].split("]ddd[");
                                                                    var extraCriterionID = extraCriterion[0];
                                                                    var extraCriterionTitle = extraCriterion[1];
                                                                    var extraCriterionPercentage = parseFloat(extraCriterion[2]);
                                                                    var extraCriterionIsHidden = extraCriterion[3];

                                                                    cardHTML += "<tr data-id='" + extraCriterionID + "' data-is-hidden='" + extraCriterionIsHidden + "'>";
                                                                    var textClass = (extraCriterionIsHidden == "1") ? " text-danger" : "";
                                                                    cardHTML += "<td class='extra-criterion-title" + textClass + "'>" + extraCriterionTitle + "</td>";
                                                                    cardHTML += "<td class='extra-criterion-percentage align-right'><span class='sp-extra-percentage'>" + extraCriterionPercentage.toString() + "</span>%</td>";
                                                                    cardHTML += "<td align='right'>";
                                                                    cardHTML += "<button class='btn btn-sm btn-link btn-edit-extra-criteria'><span class='fa fa-edit'></span></button>";
                                                                    cardHTML += "<button class='btn btn-sm btn-link btn-remove-extra-criteria text-danger'><span class='fa fa-trash'></span></button>";
                                                                    cardHTML += "</td>";
                                                                    cardHTML += "</tr>";
                                                                }
                                                            }
                                                            cardHTML += "</tbody>";
                                                        cardHTML += "</table>";
                                                    cardHTML += "</div>";
                                                cardHTML += "</div>";
                                                // <-- EXTRA CRITERIA

                                            cardHTML += "</div>";
                                        cardHTML += "</div>";
                                    cardHTML += "</div>";
                                }
                                divCriteria.html(cardHTML);
                            }
                        }
                        else {
                            alert(data);
                        }
                    }
                }
            }
        });
    }
    getAllCriteria();


    // FUNCTION: get previous portions and populate to cboPortionLink
    function populatecboPortionLink(activePortionLink) {
        $.ajax({
            type: 'POST',
            url: '../php/admin_portions.php',
            data: {
                get_previous_portions_of: activePortion
            },
            success: function(data) {
                var arrData = data.split("]s[");

                if (arrData[0] == "1") {
                    var optHTML = "<option value=''>(None)</option>";
                    if (arrData[1] != "") {
                        var arrPortions = arrData[1].split("]r[");
                        for (var i = 0; i < arrPortions.length; i++) {
                            var arrPortion = arrPortions[i].split("]d[");
                            var portionID = arrPortion[0];
                            var portionTitle = arrPortion[1];
                            var attrSelected = (activePortionLink.toString() == portionID.toString()) ? " selected" : "";
                            optHTML += "<option value='" + portionID + "'" + attrSelected + ">" + (i + 1).toString() + ". " + portionTitle + "</option>";
                        }
                    }
                    cboPortionLink.html(optHTML);
                }
                else {
                    alert(data);
                }
            }
        });
    }

    // add criteria btn button
    divMainContent.delegate('.btn-add-criteria', 'click', function() {
        parentCard = $(this).parent();
        while(true) {
            if(parentCard.hasClass('h-100')) {
                break;
            }
            parentCard = parentCard.parent();
        }
        var portionTitle = parentCard.find('.sp-portion-title').html();
        activePortion = parentCard.attr('data-id');
        editingCriteria = "";
        txtCriteriaTitle.val("");
        txtCriteriaPercentage.val("");
        populatecboPortionLink("");
        modalCriteria.find('.sp-portion-title').html("to <b>" + portionTitle + "</b>");
        modalCriteria.find('.sp-mode').html("<span class='fa fa-plus-circle'></span> Add&nbsp;");
        modalCriteria.modal('show');
    });


    // add extra criteria btn button
    divMainContent.delegate('.btn-add-extra-criteria', 'click', function() {
        parentCard = $(this).parent().parent().parent().parent().parent();
        var portionTitle = parentCard.find('.sp-portion-title').html();
        activePortion = parentCard.attr('data-id');
        editingExtraCriteria = "";
        txtExtraCriteriaTitle.val("");
        txtExtraCriteriaPercentage.val("");
        cboExtraCriteriaIsHidden.val("1");
        modalExtraCriteria.find('.sp-portion-title').html("to <b>" + portionTitle + "</b>");
        modalExtraCriteria.find('.sp-mode').html("<span class='fa fa-plus-circle'></span> Add&nbsp;");
        modalExtraCriteria.modal('show');
    });


    // edit criteria button
    divMainContent.delegate('.btn-edit-criteria', 'click', function() {
        parentTR = $(this).parent().parent();
        parentCard = parentTR.parent().parent().parent().parent();
        var portionTitle = parentCard.find('.sp-portion-title').html();
        activePortion = parentCard.attr('data-id');
        editingCriteria = parentTR.attr('data-id');
        var criterionTitle = parentTR.find('.criterion-title').html();
        var criterionPercentage = parentTR.find('.sp-percentage').html();
        var criterionIsLinkedToPortion = parentTR.attr('data-is-linked-to-portion');
        var criterionPortionLink = (criterionIsLinkedToPortion == "1") ? parentTR.attr('data-portion-link') : "";
        txtCriteriaTitle.val(criterionTitle);
        txtCriteriaPercentage.val(criterionPercentage);
        populatecboPortionLink(criterionPortionLink);
        modalCriteria.find('.sp-portion-title').html("in <b>" + portionTitle + "</b>");
        modalCriteria.find('.sp-mode').html("<span class='fa fa-edit'></span> Edit&nbsp;");
        modalCriteria.modal('show');
    });


    // edit extra criteria button
    divMainContent.delegate('.btn-edit-extra-criteria', 'click', function() {
        parentTR = $(this).parent().parent();
        parentCard = parentTR.parent().parent().parent().parent().parent().parent();
        var portionTitle = parentCard.find('.sp-portion-title').html();
        activePortion = parentCard.attr('data-id');
        editingExtraCriteria = parentTR.attr('data-id');

        var extraCriterionTitle = parentTR.find('.extra-criterion-title').html();
        var extraCriterionPercentage = parentTR.find('.sp-extra-percentage').html();
        var extraCriterionIsHidden = parentTR.attr('data-is-hidden');

        txtExtraCriteriaTitle.val(extraCriterionTitle);
        txtExtraCriteriaPercentage.val(extraCriterionPercentage);
        cboExtraCriteriaIsHidden.val(extraCriterionIsHidden);

        modalExtraCriteria.find('.sp-portion-title').html("in <b>" + portionTitle + "</b>");
        modalExtraCriteria.find('.sp-mode').html("<span class='fa fa-edit'></span> Edit&nbsp;");
        modalExtraCriteria.modal('show');
    });

    // remove criteria button
    divMainContent.delegate('.btn-remove-criteria', 'click', function() {
        parentTR = $(this).parent().parent();
        parentCard = parentTR.parent().parent().parent().parent();
        var portionTitle = parentCard.find('.sp-portion-title').html();
        editingCriteria = parentTR.attr('data-id');
        var criterionTitle = parentTR.find('.criterion-title').html();
        modalCriteriaRemove.find('.sp-portion-title').html(portionTitle);
        modalCriteriaRemove.find('.sp-criteria-title').html(criterionTitle);
        modalCriteriaRemove.modal('show');
    });


    // remove extra criteria button
    divMainContent.delegate('.btn-remove-extra-criteria', 'click', function() {
        parentTR = $(this).parent().parent();
        parentCard = parentTR.parent().parent().parent().parent().parent().parent();
        var portionTitle = parentCard.find('.sp-portion-title').html();
        editingExtraCriteria = parentTR.attr('data-id');
        var extraCriterionTitle = parentTR.find('.extra-criterion-title').html();
        modalExtraCriteriaRemove.find('.sp-portion-title').html(portionTitle);
        modalExtraCriteriaRemove.find('.sp-criteria-title').html(extraCriterionTitle);
        modalExtraCriteriaRemove.modal('show');
    });

    modalCriteria.on('shown.bs.modal', function() {
        txtCriteriaTitle.focus();
    });

    modalExtraCriteria.on('shown.bs.modal', function() {
        txtExtraCriteriaTitle.focus();
    });

    // save changes - criteria
    $('#btnSaveChanges').on('click', function() {
        var criteriaTitle = txtCriteriaTitle.val().trim();
        var criteriaPercentage = txtCriteriaPercentage.val();
        var criteriaPortionLink = (cboPortionLink.val() == "") ? "0" : parseInt(cboPortionLink.val());
        var criteriaIsLinkedToPortion = (cboPortionLink.val() != "") ? "1" : "0";

        if(criteriaTitle != "" && criteriaPercentage != "") {
            if (editingCriteria == "") {
                // Add New Criteria
                $.ajax({
                    type: 'POST',
                    url: '../php/admin_criteria.php',
                    data: {
                        add_criteria: criteriaTitle,
                        percentage: criteriaPercentage,
                        portion: activePortion,
                        is_linked_to_portion: criteriaIsLinkedToPortion,
                        portion_link: criteriaPortionLink
                    },
                    success: function (data) {
                        if(data == "-1") {
                            window.open('index.php', '_self');
                        }
                        else {
                            var arrData = data.split("]s[");
                            if(arrData[0] == "1") {
                                if(arrData[1] != "") {
                                    var criteriaID = arrData[1];
                                    modalCriteria.modal('hide');
                                    var trHTML = "<tr data-id='" + criteriaID + "' data-is-linked-to-portion='" + criteriaIsLinkedToPortion + "' data-portion-link='" + criteriaPortionLink + "'>";
                                    var textClass = (criteriaIsLinkedToPortion == "1") ? " text-primary" : "";
                                    trHTML += "<td class='criterion-title" + textClass + "'>" + criteriaTitle + "</td>";
                                    trHTML += "<td class='criterion-percentage align-right'><span class='sp-percentage'>" + criteriaPercentage.toString() + "</span>%</td>";
                                    trHTML += "<td align='right'>";
                                    trHTML += "<button class='btn btn-sm btn-link btn-edit-criteria'><span class='fa fa-edit'></span></button>";
                                    trHTML += "<button class='btn btn-sm btn-link btn-remove-criteria text-danger'><span class='fa fa-trash'></span></button>";
                                    trHTML += "</td>";
                                    trHTML += "</tr>";
                                    parentCard.find('.tbody-criteria').append(trHTML);
                                    recomputeTotalPercentage();
                                }
                            }
                            else {
                                alert(data);
                            }
                        }
                    }
                });
            }
            else {
                // Update Existing Criteria
                $.ajax({
                    type: 'POST',
                    url: '../php/admin_criteria.php',
                    data: {
                        update_criteria: editingCriteria,
                        criteria_title: criteriaTitle,
                        percentage: criteriaPercentage,
                        is_linked_to_portion: criteriaIsLinkedToPortion,
                        portion_link: criteriaPortionLink
                    },
                    success: function (data) {
                        if(data == "-1") {
                            window.open('index.php', '_self');
                        }
                        else {
                            if(data == "1") {
                                modalCriteria.modal('hide');
                                var tdCriterionTitle = parentTR.find('.criterion-title');
                                tdCriterionTitle.html(criteriaTitle);
                                if(criteriaIsLinkedToPortion == "1") {
                                    if(!tdCriterionTitle.hasClass('text-primary')) {
                                        tdCriterionTitle.addClass('text-primary');
                                    }
                                }
                                else {
                                    if(tdCriterionTitle.hasClass('text-primary')) {
                                        tdCriterionTitle.removeClass('text-primary');
                                    }
                                }
                                parentTR.find('.sp-percentage').html(criteriaPercentage);
                                parentTR.attr('data-is-linked-to-portion', criteriaIsLinkedToPortion);
                                parentTR.attr('data-portion-link', criteriaPortionLink);
                                recomputeTotalPercentage();
                            }
                            else {
                                alert(data);
                            }
                        }
                    }
                });
            }
        }
    });

    // recompute total percentage
    function recomputeTotalPercentage() {
        var totalPercentage = 0;
        parentCard.find('.sp-percentage').each(function(i) {
            var percentage = parseFloat($(this).html());
            totalPercentage += percentage;
        });
        if(totalPercentage == 0)
            totalPercentage = "[AVE]";
        parentCard.find('.sp-total-percentage').html(totalPercentage.toString());
    }

    // save changes - extra criteria
    $('#btnSaveChanges2').on('click', function() {
        var extraCriteriaTitle = txtExtraCriteriaTitle.val().trim();
        var extraCriteriaPercentage = txtExtraCriteriaPercentage.val();
        var extraCriteriaIsHidden = parseInt(cboExtraCriteriaIsHidden.val());
        if(extraCriteriaTitle != "" && extraCriteriaPercentage != "") {
            if (editingExtraCriteria == "") {

                // Add New Extra Criteria
                $.ajax({
                    type: 'POST',
                    url: '../php/admin_criteria.php',
                    data: {
                        add_extra_criteria: extraCriteriaTitle,
                        percentage: extraCriteriaPercentage,
                        portion: activePortion,
                        is_hidden: extraCriteriaIsHidden
                    },
                    success: function (data) {
                        if(data == "-1") {
                            window.open('index.php', '_self');
                        }
                        else {
                            var arrData = data.split("]s[");
                            if(arrData[0] == "1") {
                                if(arrData[1] != "") {
                                    var extraCriteriaID = arrData[1];
                                    modalExtraCriteria.modal('hide');
                                    var trHTML = "<tr data-id='" + extraCriteriaID + "' data-is-hidden='" + extraCriteriaIsHidden + "'>";
                                    var textClass = (extraCriteriaIsHidden == "1") ? " text-danger" : "";
                                    trHTML += "<td class='extra-criterion-title" + textClass + "'>" + extraCriteriaTitle + "</td>";
                                    trHTML += "<td class='extra-criterion-percentage align-right'><span class='sp-extra-percentage'>" + extraCriteriaPercentage.toString() + "</span>%</td>";
                                    trHTML += "<td align='right'>";
                                    trHTML += "<button class='btn btn-sm btn-link btn-edit-extra-criteria'><span class='fa fa-edit'></span></button>";
                                    trHTML += "<button class='btn btn-sm btn-link btn-remove-extra-criteria text-danger'><span class='fa fa-trash'></span></button>";
                                    trHTML += "</td>";
                                    trHTML += "</tr>";
                                    parentCard.find('.tbody-extra-criteria').append(trHTML);
                                }
                            }
                            else {
                                alert(data);
                            }
                        }
                    }
                });
            }
            else {
                // Update Existing Extra Criteria
                $.ajax({
                    type: 'POST',
                    url: '../php/admin_criteria.php',
                    data: {
                        update_extra_criteria: editingExtraCriteria,
                        criteria_title: extraCriteriaTitle,
                        percentage: extraCriteriaPercentage,
                        is_hidden: extraCriteriaIsHidden
                    },
                    success: function (data) {
                        if(data == "-1") {
                            window.open('index.php', '_self');
                        }
                        else {
                            if(data == "1") {
                                modalExtraCriteria.modal('hide');
                                var tdExtraCriterionTitle = parentTR.find('.extra-criterion-title');
                                tdExtraCriterionTitle.html(extraCriteriaTitle);
                                if(extraCriteriaIsHidden == "1") {
                                    if(!tdExtraCriterionTitle.hasClass('text-danger')) {
                                        tdExtraCriterionTitle.addClass('text-danger');
                                    }
                                }
                                else {
                                    if(tdExtraCriterionTitle.hasClass('text-danger')) {
                                        tdExtraCriterionTitle.removeClass('text-danger');
                                    }
                                }
                                parentTR.find('.sp-extra-percentage').html(extraCriteriaPercentage);
                                parentTR.attr('data-is-hidden', extraCriteriaIsHidden);
                            }
                            else {
                                alert(data);
                            }
                        }
                    }
                });
            }
        }
    });

    $('#btnConfirmRemove').on('click', function() {
        $.ajax({
            type: 'POST',
            url: '../php/admin_criteria.php',
            data: {
                remove_criteria: editingCriteria
            },
            success: function (data) {
                if(data == "-1") {
                    window.open('index.php', '_self');
                }
                else {
                    if(data == "-2") {
                        alert("This criteria cannot be deleted because there are ratings associated with it.");
                        modalCriteriaRemove.modal('hide');
                    }
                    else if(data == "1") {
                        modalCriteriaRemove.modal('hide');
                        parentTR.fadeOut(500, function() {
                            parentTR.remove();
                            recomputeTotalPercentage();
                        });
                    }
                    else {
                        alert(data);
                    }
                }
            }
        });
    });

    $('#btnConfirmRemove2').on('click', function() {
        $.ajax({
            type: 'POST',
            url: '../php/admin_criteria.php',
            data: {
                remove_extra_criteria: editingExtraCriteria
            },
            success: function (data) {
                if(data == "-1") {
                    window.open('index.php', '_self');
                }
                else {
                    if(data == "-2") {
                        alert("This extra criteria cannot be deleted because there are ratings associated with it.");
                        modalExtraCriteriaRemove.modal('hide');
                    }
                    else if(data == "1") {
                        modalExtraCriteriaRemove.modal('hide');
                        parentTR.fadeOut(500, function() {
                            parentTR.remove();
                        });
                    }
                    else {
                        alert(data);
                    }
                }
            }
        });
    });
});