$(function() {

    var txtUsername = $('#txtUsername');
    var txtPassword = $('#txtPassword');
    var btnLogin = $('#btnLogin');

    function attemptLogin() {
        var username = txtUsername.val().trim();
        var password = txtPassword.val();
        if(username != "" && password != "") {
            btnLogin.prop('disabled', true);
            btnLogin.prop('attr', true);
            $.ajax({
                type: 'POST',
                url: '../php/admin_login.php',
                data: {
                    usermane: username,
                    paswsord: password
                },
                success: function(data) {
                    if(data == "0") {
                        alert("Invalid Username or Password");
                        txtUsername.focus();
                    }
                    else if(data == "1") {
                       window.open('portions.php', '_self');
                    }
                    else {
                        alert(data);
                    }
                    btnLogin.prop('disabled', false);
                    btnLogin.prop('attr', false);
                }
            });
        }
    }
    btnLogin.on('click', function() {
        attemptLogin();
    });
    txtUsername.on('keyup', function(e) {
        if(e.keyCode == 13) {
            attemptLogin();
        }
    });
    txtPassword.on('keyup', function(e) {
        if(e.keyCode == 13) {
            attemptLogin();
        }
    });
});