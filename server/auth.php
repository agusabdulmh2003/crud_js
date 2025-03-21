<?php
session_start();
include 'db.php';

$action = $_GET['action'] ?? '';

if ($action == "register") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    $sql = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$password')";
    echo $conn->query($sql) ? "Registrasi berhasil!" : "Gagal registrasi!";
}

if ($action == "login") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $result = $conn->query("SELECT * FROM users WHERE email='$email'");
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            $_SESSION['user'] = $user['username'];
            echo "success";
        } else {
            echo "Password salah!";
        }
    } else {
        echo "Email tidak ditemukan!";
    }
}

if ($action == "logout") {
    session_destroy();
    echo "Logout berhasil!";
}
?>
