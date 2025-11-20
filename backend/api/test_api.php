<?php
// backend/test_api.php
header("Content-Type: text/html; charset=UTF-8");

// ====================================================
// DÁN KEY MỚI CỦA BẠN VÀO ĐÂY ĐỂ KIỂM TRA
// ====================================================
$apiKey = "AIzaSyCMIzJeOiNbXHFI8tGxGgip-GBnWp8ub-I"; // <-- Thay Key của bạn vào đây

echo "<h1>Kiểm tra kết nối Google Gemini API</h1>";
echo "<p>Đang kiểm tra Key: <strong>" . substr($apiKey, 0, 10) . "..." . substr($apiKey, -5) . "</strong></p>";

// 1. KIỂM TRA DANH SÁCH MODEL (Để biết Key có quyền truy cập không)
$url = "https://generativelanguage.googleapis.com/v1beta/models?key=" . $apiKey;

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Fix lỗi SSL Localhost
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($response === false) {
    echo "<h2 style='color:red'>❌ Lỗi kết nối Server (CURL)</h2>";
    echo "<p>Server của bạn không gửi được yêu cầu đi. Lỗi: $error</p>";
    exit();
}

$data = json_decode($response, true);

// 2. PHÂN TÍCH KẾT QUẢ
if ($httpCode == 200 && isset($data['models'])) {
    echo "<h2 style='color:green'>✅ API Key Hoạt Động Tốt!</h2>";
    echo "<p>Key này hợp lệ. Dưới đây là các Model mà Key này có thể dùng:</p>";
    echo "<ul>";
    $foundFlash = false;
    foreach ($data['models'] as $model) {
        // Chỉ hiện các model tạo nội dung (generateContent)
        if (in_array("generateContent", $model['supportedGenerationMethods'])) {
            $color = "black";
            if (strpos($model['name'], 'flash') !== false) {
                $color = "blue";
                $foundFlash = true;
            }
            echo "<li style='color:$color'>" . $model['name'] . "</li>";
        }
    }
    echo "</ul>";
    
    if ($foundFlash) {
        echo "<p style='color:blue'><strong>Gợi ý:</strong> Bạn nên dùng model <code>gemini-1.5-flash</code> trong file chat.php</p>";
    }
} else {
    echo "<h2 style='color:red'>❌ API Key Không Hợp Lệ hoặc Bị Lỗi</h2>";
    echo "<p>Mã lỗi HTTP: $httpCode</p>";
    echo "<p>Phản hồi từ Google:</p>";
    echo "<pre style='background:#f4f4f4; padding:10px; border:1px solid #ccc;'>" . print_r($data, true) . "</pre>";
    
    if (isset($data['error']['message'])) {
        $msg = $data['error']['message'];
        if (strpos($msg, 'API key not valid') !== false) {
            echo "<p>👉 <strong>Nguyên nhân:</strong> Key bạn copy bị sai hoặc đã bị xóa. Hãy tạo lại Key mới.</p>";
        } elseif (strpos($msg, 'IP address') !== false) {
             echo "<p>👉 <strong>Nguyên nhân:</strong> Key này chặn IP server của bạn.</p>";
        }
    }
}
?>