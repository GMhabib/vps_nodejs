<?php
// Cek apakah parameter 'run' ada di URL
if (isset($_GET['run'])) {
    $url = $_GET['run']; // Ambil nilai dari parameter 'run'
    $extension = pathinfo($url, PATHINFO_EXTENSION); // Dapatkan ekstensi file

    // Tentukan Content-Type berdasarkan ekstensi file
    switch ($extension) {
        case 'js':
            header('Content-Type: application/javascript');
            break;
        case 'php':
            header('Content-Type: text/plain');
            break;
        case 'html':
        case 'htm':
            header('Content-Type: text/html');
            break;
        case 'css':
            header('Content-Type: text/css');
            break;
        case 'xml':
            header('Content-Type: application/xml');
            break;
        case 'rss':
            header('Content-Type: application/rss+xml');
            break;
        case 'json':
            header('Content-Type: application/json');
            break;
        // Tambahan untuk gambar
        case 'jpg':
        case 'jpeg':
            header('Content-Type: image/jpeg');
            break;
        case 'png':
            header('Content-Type: image/png');
            break;
        case 'gif':
            header('Content-Type: image/gif');
            break;
        case 'svg':
            header('Content-Type: image/svg+xml');
            break;
        case 'webp':
            header('Content-Type: image/webp');
            break;
        // Tambahan untuk video
        case 'mp4':
            header('Content-Type: video/mp4');
            break;
        case 'webm':
            header('Content-Type: video/webm');
            break;
        case 'ogg':
            header('Content-Type: video/ogg');
            break;
        // Tambahan untuk audio
        case 'mp3':
            header('Content-Type: audio/mpeg');
            break;
        case 'wav':
            header('Content-Type: audio/wav');
            break;
        case 'oga':
            header('Content-Type: audio/ogg');
            break;
        default:
            http_response_code(400); // Bad Request
            die("Error: Tipe file tidak didukung.");
    }

    // Cek apakah file bisa diakses
    $content = @file_get_contents($url);

    // Jika konten berhasil diambil
    if ($content !== false) {
        // Tampilkan isi file
        echo $content;
    } else {
        // Jika gagal mengambil file
        http_response_code(404); // Not Found
        echo "Error: File tidak ditemukan atau tidak dapat diakses.";
    }
} else {
    // Jika parameter 'run' tidak ada
    http_response_code(400); // Bad Request
    echo "Error: Parameter 'run' tidak ditemukan di URL. Contoh: ?run=https://contoh.com/jam.js";
}
?>