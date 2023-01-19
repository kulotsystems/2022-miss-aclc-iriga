<?php $page='home'; $path = ''; ?>
<?php require $path."php/app.php";?>
<?php require $path."php/judge_loginchecker.php";?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require $path."php/ui/global_imports.php";?>
    <?php require $path."php/ui/judge_js_codes.php";?>
    <title>Home ~ Judge | <?php echo $app_name; ?></title>
</head>
<body id="<?php echo $page;?>" rel="judge" data-path="<?php echo $path;?>">
<?php require $path."php/ui/layout/header.php"; ?>
<div class="container-fluid" id="main-content">
    <div class="row">
        <div class="col-sm-3" id="divNav">
            <?php require $path."php/ui/layout/judge_nav.php"?>
        </div>
        <div class="col-sm-9" id="divRatings">

        </div>
    </div>
</div>
<div class="modal fade" id="modal-confirm-logout" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                Confirm Logout
                <span type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</span>
            </div>
            <div class="modal-body">
                Do you really want to logout?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">No</button>
                <button id="btnConfirmLogout" type="button" class="btn btn-primary">Yes</button>
            </div>
        </div>
    </div>
</div>
</body>
</html>
