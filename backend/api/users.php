<?php
// backend/api/users.php (Bản Hoàn Chỉnh - Admin CRUD + Profile)

header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $host = "localhost";
    $port = "3307";
    $dbname = "nhathuocgb";
    $username = "root";
    $password = "";
    
    $db = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            handleGet($db);
            break;
        case 'POST':
            handlePost($db);
            break;
        case 'PUT':
            handlePut($db);
            break;
        case 'DELETE':
            handleDelete($db);
            break;
        default:
            http_response_code(405);
            echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

// GET - Lấy danh sách hoặc chi tiết người dùng
function handleGet($db) {
    if (isset($_GET['id'])) {
        $stmt = $db->prepare("SELECT id, full_name, email, phone, role, status, avatar, created_at FROM users WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            // Chuyển status từ số sang text
            $user['status'] = $user['status'] == 1 ? 'active' : 'inactive';
            echo json_encode(['status' => 'success', 'data' => $user]);
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Không tìm thấy người dùng']);
        }
    } else {
        $stmt = $db->query("SELECT id, full_name, email, phone, role, status, avatar, created_at FROM users ORDER BY created_at DESC");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Chuyển tất cả status từ số sang text
        foreach ($users as &$user) {
            $user['status'] = $user['status'] == 1 ? 'active' : 'inactive';
        }
        
        echo json_encode(['status' => 'success', 'data' => $users]);
    }
}

// POST - Tạo người dùng mới
function handlePost($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (empty($data['email']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Email và mật khẩu là bắt buộc']);
        return;
    }
    
    // Kiểm tra email đã tồn tại
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['status' => 'error', 'message' => 'Email đã tồn tại']);
        return;
    }
    
    // Tạo user mới - BỎ address
    $stmt = $db->prepare("
        INSERT INTO users (full_name, email, password, phone, role, status) 
        VALUES (?, ?, ?, ?, ?, 'active')
    ");
    
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
    $stmt->execute([
        $data['full_name'] ?? '',
        $data['email'],
        $hashedPassword,
        $data['phone'] ?? '',
        $data['role'] ?? 'customer'
    ]);
    
    echo json_encode(['status' => 'success', 'message' => 'Tạo người dùng thành công']);
}

// PUT - Cập nhật thông tin người dùng
function handlePut($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (empty($data['id'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ID là bắt buộc']);
        return;
    }
    
    // Chuyển status từ text sang số trước khi lưu
    $statusValue = ($data['status'] === 'active') ? 1 : 0;
    
    $stmt = $db->prepare("
        UPDATE users 
        SET full_name = ?, phone = ?, role = ?, status = ?
        WHERE id = ?
    ");
    
    $stmt->execute([
        $data['full_name'] ?? '',
        $data['phone'] ?? '',
        $data['role'] ?? 'customer',
        $statusValue,
        $data['id']
    ]);
    
    echo json_encode(['status' => 'success', 'message' => 'Cập nhật thành công']);
}

// DELETE - Xóa người dùng
function handleDelete($db) {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ID là bắt buộc']);
        return;
    }
    
    $userId = $_GET['id'];
    
    if ($userId == 1) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Không thể xóa tài khoản Admin chính']);
        return;
    }
    
    $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    
    echo json_encode(['status' => 'success', 'message' => 'Xóa người dùng thành công']);
}
?>