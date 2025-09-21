<?php
include "config.php";
if (empty($_SESSION["logged_in"])) {
    header("Location: login.php");
    exit;
}

$files = glob("../content/*.json");
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dashboard</title>
</head>
<body>
  <h2>Content Files</h2>
  <ul>
    <?php foreach ($files as $f): 
      $name = basename($f);
    ?>
      <li><a href="edit.php?file=<?=$name?>"><?=$name?></a></li>
    <?php endforeach; ?>
  </ul>
  <a href="logout.php">Logout</a>
</body>
</html>
