
<?php
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    header("Location: login.php?admin=1");
    exit();
}

$max_size = 200 * 1024 * 1024; // 200MB

if ($_FILES['video']['size'] > $max_size) {
    die("ভিডিওর সাইজ 200MB এর বেশি হতে পারবে না");
}

$target_dir = "videos/";
$target_file = $target_dir . basename($_FILES["video"]["name"]);
$file_type = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

// Allow certain file formats
$allowed = ["mp4", "avi", "mov", "mkv"];
if (!in_array($file_type, $allowed)) {
    die("শুধুমাত্র MP4, AVI, MOV, MKV ফরম্যাটে ভিডিও আপলোড করা যাবে");
}

if (move_uploaded_file($_FILES["video"]["tmp_name"], $target_file)) {
    header("Location: admin.php?success=1");
} else {
    echo "ভিডিও আপলোডে সমস্যা হয়েছে";
}
?>
