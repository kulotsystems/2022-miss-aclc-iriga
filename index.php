<?php $page='index'; $path = ''; ?>
<?php require $path."php/app.php";?>
<?php require $path."php/judge_loginchecker.php";?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require $path."php/ui/global_imports.php";?>
    <link rel="stylesheet" href="<?php echo $path; ?>css/login.css">
    <script src="<?php echo $path; ?>js/judge_login.js?<?php echo $script_version;?>"></script>
    <title>Login ~ Judge | <?php echo $app_name; ?></title>
</head>
<body id="<?php echo $page;?>" rel="judge" data-path="<?php echo $path;?>">
<?php require $path."php/ui/layout/header.php"; ?>
<div class="container-fluid" id="main-content">
    <?php require $path."html/judge_index.html";?>
</div>
</body>
</html>