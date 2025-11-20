<?php
// backend/api/chat.php

// 1. Cấu hình Header (Bắt buộc)
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

// =======================================================================
// 2. ĐIỀN API KEY (Đã xác nhận là ĐÚNG)
// =======================================================================
$apiKey = "AIzaSyCMIzJeOiNbXHFI8tGxGgip-GBnWp8ub-I"; 
$apiKey = trim($apiKey); // Xóa khoảng trắng thừa

$data = json_decode(file_get_contents("php://input"), true);
$userMessage = $data['message'] ?? '';

if (empty($userMessage)) {
    echo json_encode(['reply' => 'Bạn chưa nhập nội dung.']);
    exit();
}

// =======================================================================
// 3. CẤU HÌNH MODEL (SỬA LẠI THEO ẢNH BẠN GỬI)
// =======================================================================
// Trong ảnh của bạn có 'models/gemini-1.5-flash' -> Vậy tên đúng là 'gemini-1.5-flash'
$model = "gemini-2.5-flash"; 

$url = "https://generativelanguage.googleapis.com/v1beta/models/$model:generateContent?key=" . $apiKey;

// Kịch bản Dược sĩ
$systemPrompt = "Bạn là Dược sĩ AI của Nhà thuốc GB. Hãy trả lời ngắn gọn, thân thiện, có tâm. Tư vấn thuốc hoặc bệnh lý cơ bản. Địa chỉ: 123 Nguyễn Văn Cừ, Q5, HCM. Hotline: 0909.699.699. Lưu ý: Câu trả lời dưới 100 từ.";

$postData = [
    "contents" => [
        [
            "role" => "user",
            "parts" => [
                ["text" => $systemPrompt . "\n\nKhách hàng hỏi: " . $userMessage]
            ]
        ]
    ]
];

// 4. Gửi Request
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

// FIX SSL (Quan trọng)
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

$response = curl_exec($ch);

if ($response === false) {
    echo json_encode(['reply' => "Lỗi kết nối Server: " . curl_error($ch)]);
    exit();
}
curl_close($ch);

$responseData = json_decode($response, true);

// 5. Xử lý kết quả
if (isset($responseData['error'])) {
    $errMsg = $responseData['error']['message'] ?? 'Lỗi không xác định';
    // In lỗi rõ ràng để bạn biết
    echo json_encode(['reply' => "Lỗi Google ($model): $errMsg"]);
} else {
    $aiReply = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? null;
    if ($aiReply) {
        $cleanReply = str_replace(['**', '*'], '', $aiReply);
        echo json_encode(['reply' => $cleanReply]);
    } else {
        echo json_encode(['reply' => 'AI không phản hồi. Vui lòng thử lại sau.']);
    }
}
?>