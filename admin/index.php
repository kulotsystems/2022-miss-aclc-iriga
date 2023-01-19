<?php $page='index'; $path = '../'; ?>
<?php require $path."php/app.php";?>
<?php require $path."php/admin_loginchecker.php";?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require $path."php/ui/global_imports.php";?>
    <?php require $path."php/ui/admin_js_codes.php";?>
    <link rel="stylesheet" href="<?php echo $path; ?>css/login.css">
    <script src="<?php echo $path; ?>js/admin_login.js?<?php echo $script_version;?>"></script>
    <title>Login ~ Admin | <?php echo $app_name; ?></title>
</head>
<body id="<?php echo $page;?>" rel="admin" data-path="<?php echo $path;?>">
<?php require $path."php/ui/layout/header.php"; ?>
<div class="container-fluid" id="main-content">
    <?php require $path."html/admin_index.html";?>
</div>
</body>
</html>
