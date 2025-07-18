
<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ভাইরাল ভিডিও - পাবলিক</title>
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

    <main class="public-videos">
        <h2>সকল ভিডিও</h2>
        <div class="video-gallery">
            <?php
            $videos = glob('videos/*.{mp4,avi,mov}', GLOB_BRACE);
            foreach ($videos as $video) {
                $video_name = basename($video);
                echo '<div class="video-card">';
                echo '<video controls>';
                echo '<source src="'.$video.'" type="video/mp4">';
                echo 'আপনার ব্রাউজার ভিডিও সাপোর্ট করে না।';
                echo '</video>';
                echo '<h3>'.$video_name.'</h3>';
                echo '</div>';
            }
            ?>
        </div>
    </main>

    <footer>
        <p>© 2023 ভাইরাল ভিডিও - সকল অধিকার সংরক্ষিত</p>
    </footer>
</body>
  </html>
