<?php
// ตั้ง username/password
$ADMIN_USER = "admin";
$ADMIN_PASS = "1234";

// กำหนดโฟลเดอร์เก็บ session ให้เป็น tmp ในเว็บเรา
session_save_path(__DIR__ . '/tmp');

// เริ่ม session
session_start();
