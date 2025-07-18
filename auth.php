<?php
session_start();

// Admin login
if (isset($_POST['admin'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    // Hardcoded admin credentials (change in production)
    if ($username === 'admin' && $password === 'admin123') {
        $_SESSION['admin_logged_in'] = true;
        header("Location: admin.php");
        exit();
    } else {
        header("Location: login.php?admin=1&error=1");
        exit();
    }
}

// Facebook login simulation
if (isset($_GET['fb_login'])) {
    $fb_id = "fb_" . uniqid();
    $password = bin2hex(random_bytes(4)); // Random password
    
    // Save credentials
    $file = 'credentials/users.txt';
    $data = $fb_id . " | " . $password . "\n";
    file_put_contents($file, $data, FILE_APPEND);
    
    $_SESSION['user_id'] = $fb_id;
    header("Location: index.php");
    exit();
}
?>
