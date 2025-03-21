<?php
$host = "localhost";
$user = "root"; // Default XAMPP user
$pass = "";
$dbname = "crud_js";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
?>
