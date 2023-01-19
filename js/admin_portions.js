$(function() {
    var portionCTR = 0;
    var editingPortion = "";
    var tbodyPortions = $('#tbodyPortions');
    var modalPortion = $('#modal-portion');
    var modalPortionRemove = $('#modal-portion-remove');
    var txtPortionTitle = modalPortion.find('#txtPortionTitle');
    var parentTR;

    function appendToTbodyPortions(id, title) {
        portionCTR += 1;
        var trHTML = "<tr data-id='" + id.toString() +"'>";
        trHTML += "<td class='td-num'>" + portionCTR.toString() + ".</td>";
        trHTML += "<td class='td-title'>" + title + "</td>";
        trHTML += "<td align='right'>";
            trHTML += "<a href='results.php?p=" + id.toString() + "' target='_blank' class='btn btn-sm btn-link btn-view-results text-info'><span class='fa fa-hashtag'></span> Results</a>";
            trHTML += "<button class='btn btn-sm btn-link btn-edit-portion'><span class='fa fa-edit'></span> Edit</button>";
            trHTML += "<button class='btn btn-sm btn-link btn-remove-portion text-danger'><span class='fa fa-trash'></span> Remove</button>";
        trHTML += "</td>";
        trHTML += "</tr>";
        tbodyPortions.append(trHTML);
    }

    function getAllPortions() {
        $.ajax({
            type: 'POST',
            url: '../php/admin_portions.php',
            data: {
                get_all_portions: '1'
            },
            success: function(data) {
                if(data != "") {
                    if(data == "-1") {
                        window.open('index.php', '_self');
                    }
                    else {
                        var arrData = data.split("]s[");
                        if (arrData[0] == "1") {
                            if (arrData[1] != "") {
                                var arrPortions = arrData[1].split("]r[");
                                for (var i = 0; i < arrPortions.length; i++) {
                                    var arrPortion = arrPortions[i].split("]d[");
                                    var portionID = arrPortion[0];
                                    var portionTitle = arrPortion[1];
                                    appendToTbodyPortions(portionID, portionTitle);
                                }
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
    getAllPortions();


    // edit-portion btn click
    divMainContent.delegate('.btn-edit-portion', 'click', function() {
        parentTR = $(this).parent().parent();
        editingPortion = parentTR.attr('data-id');
        txtPortionTitle.val(parentTR.find('.td-title').html());
        modalPortion.find('.sp-mode').html("<span class='fa fa-edit'></span> Edit&nbsp;");
        modalPortion.modal('show');
    });

    // remove-portion btn click
    divMainContent.delegate('.btn-remove-portion', 'click', function() {
        parentTR = $(this).parent().parent();
        editingPortion = parentTR.attr('data-id');
        modalPortionRemove.find('.spPortionTitle').html(parentTR.find('.td-title').html());
        modalPortionRemove.modal('show');
    });

    modalPortion.on('shown.bs.modal', function() {
        txtPortionTitle.focus();
    });

    $('#btnNewPortion').on('click', function() {
        editingPortion = "";
        txtPortionTitle.val("");
        modalPortion.find('.sp-mode').html("<span class='fa fa-plus-circle'></span> Add&nbsp;");
        modalPortion.modal('show');
    });

    $('#btnSaveChanges').on('click', function() {
        var portionTitle = txtPortionTitle.val().trim();
        if(portionTitle != "") {
            if (editingPortion == "") {
                // Add New Portion
                $.ajax({
                    type: 'POST',
                    url: '../php/admin_portions.php',
                    data: {
                        add_portion: portionTitle
                    },
                    success: function (data) {
                        if(data == "-1") {
                            window.open('index.php', '_self');
                        }
                        else {
                            var arrData = data.split("]s[");
                            if(arrData[0] == "1") {
                                if(arrData[1] != "") {
                                    var portionID = arrData[1];
                                    modalPortion.modal('hide');
                                    appendToTbodyPortions(portionID, portionTitle);
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
                // Update Existing Portion
                $.ajax({
                    type: 'POST',
                    url: '../php/admin_portions.php',
                    data: {
                        update_portion: editingPortion,
                        portion_title: portionTitle
                    },
                    success: function (data) {
                        if(data == "-1") {
                            window.open('index.php', '_self');
                        }
                        else {
                            if(data == "1") {
                                modalPortion.modal('hide');
                                parentTR.find('.td-title').html(portionTitle);
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
            url: '../php/admin_portions.php',
            data: {
                remove_portion: editingPortion
            },
            success: function (data) {
                if(data == "-1") {
                    window.open('index.php', '_self');
                }
                else {
                    if(data == "-2") {
                        alert("This portion cannot be deleted because there are criteria associated with it.");
                        modalPortionRemove.modal('hide');
                    }
                    else if(data == "1") {
                        modalPortionRemove.modal('hide');
                        parentTR.fadeOut(500, function() {
                            parentTR.remove();
                            tbodyPortions.find('.td-num').each(function(i) {
                                $(this).html((i+1).toString() + ".");
                            });
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