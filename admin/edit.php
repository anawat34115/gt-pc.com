<?php
include "config.php";
if (empty($_SESSION["logged_in"])) {
    header("Location: login.php");
    exit;
}

$file = $_GET["file"] ?? "";
$path = "../content/" . basename($file);

if (!file_exists($path)) {
    die("File not found!");
}

$content = file_get_contents($path);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Edit <?=$file?></title>
</head>
<body>
  <h2>Edit: <?=$file?></h2>
  <form method="post" action="save.php">
    <input type="hidden" name="file" value="<?=$file?>">
    <textarea name="content" rows="20" cols="80"><?=htmlspecialchars($content)?></textarea><br><br>
    <button type="submit">Save</button>
  </form>
  <br>
  <a href="dashboard.php">Back</a>
</body>
</html>
