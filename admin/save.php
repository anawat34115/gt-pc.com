<?php
include "config.php";
if (empty($_SESSION["logged_in"])) {
    header("Location: login.php");
    exit;
}

$file = $_POST["file"] ?? "";
$data = $_POST["content"] ?? "";

$path = "../content/" . basename($file);

// validate json
if (json_decode($data) === null) {
    die("Invalid JSON format!");
}

file_put_contents($path, $data);
header("Location: dashboard.php");
exit;
