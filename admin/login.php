<?php
include "config.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $user = $_POST["username"];
    $pass = $_POST["password"];

    if ($user === $ADMIN_USER && $pass === $ADMIN_PASS) {
        $_SESSION["logged_in"] = true;
        header("Location: dashboard.php");
        exit;
    } else {
        $error = "Invalid login!";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login</title>
</head>
<body>
  <h2>Admin Login</h2>
  <?php if (!empty($error)) echo "<p style='color:red'>$error</p>"; ?>
  <form method="post">
    <label>User: <input type="text" name="username"></label><br><br>
    <label>Pass: <input type="password" name="password"></label><br><br>
    <button type="submit">Login</button>
  </form>
</body>
</html>
