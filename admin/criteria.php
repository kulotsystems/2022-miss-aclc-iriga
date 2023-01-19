<?php $page='criteria'; $path = '../'; ?>
<?php require $path."php/app.php";?>
<?php require $path."php/admin_loginchecker.php";?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require $path."php/ui/global_imports.php";?>
    <?php require $path."php/ui/admin_js_codes.php";?>
    <script src="<?php echo $path; ?>js/admin_criteria.js?<?php echo $script_version;?>"></script>
    <title>Criteria ~ Admin | <?php echo $app_name; ?></title>
</head>
<body id="<?php echo $page;?>" rel="admin" data-path="<?php echo $path;?>">
<?php require $path."php/ui/layout/header.php"; ?>
<div class="container-fluid" id="main-content">
    <div class="row">
        <div class="col-sm-2">
            <?php require $path."php/ui/layout/admin_nav.php"?>
        </div>
        <div class="col-sm-10">
            <?php require $path."html/admin_criteria.html"?>
        </div>
    </div>
</div>
</body>
</html>
