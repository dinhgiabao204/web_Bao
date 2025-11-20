<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

ini_set('display_errors', 1);
error_reporting(E_ALL);

function json_response($code, $data) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Session
session_set_cookie_params([
    'lifetime' => 86400*7, 'path'=>'/', 'domain'=>'',
    'secure'=>false, 'httponly'=>true, 'samesite'=>'Lax'
]);
if(session_status() == PHP_SESSION_NONE) session_start();

// Check admin
function check_admin(){
    if(!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin'){
        json_response(403,['status'=>'error','message'=>'Forbidden: Yêu cầu quyền Admin.']);
    }
    return $_SESSION['user_id'];
}

// DB
$DB_HOST = "localhost";
$DB_PORT = "3306";
$DB_NAME = "sql_nhom50_itimi";
$DB_USER = "sql_nhom50_itimi";
$DB_PASS = "03a894cb183488";

try {
    $pdo = new PDO("mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_NAME;charset=utf8mb4",
                   $DB_USER, $DB_PASS,
                   [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
} catch(Exception $e) {
    json_response(500, ["status"=>"error","message"=>"Lỗi kết nối CSDL."]);
}

// Upload avatar
function handle_image_upload($file_input_name){
    if(empty($_FILES[$file_input_name]) || $_FILES[$file_input_name]['error'] != UPLOAD_ERR_OK){
        return null;
    }
    $upload_dir = __DIR__ . '/../../uploads/users/';
    if(!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);

    $file = $_FILES[$file_input_name];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if(!in_array($ext, ['jpg','jpeg','png','webp','avif','gif']) || $file['size'] > 5*1024*1024){
        return null;
    }
    $new_file_name = uniqid('user_') . '_' . time() . '.' . $ext;
    $destination = $upload_dir . $new_file_name;
    if(move_uploaded_file($file['tmp_name'], $destination)){
        return 'users/'.$new_file_name;
    }
    return null;
}

// Action
$action = $_GET['action'] ?? 'list';
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch($action){
        case 'admin_list':
            if($method!=='GET') json_response(405,['status'=>'error','message'=>'Method Not Allowed']);
            check_admin();
            $stmt = $pdo->query("SELECT id, full_name, email, role, status, avatar, created_at FROM users ORDER BY id DESC");
            $users = $stmt->fetchAll();
            json_response(200,['status'=>'success','data'=>$users]);
            break;

        case 'admin_detail':
            if($method!=='GET') json_response(405,['status'=>'error','message'=>'Method Not Allowed']);
            check_admin();
            $id = (int)($_GET['id']??0);
            if(!$id) json_response(400,['status'=>'error','message'=>'Thiếu ID.']);
            $stmt = $pdo->prepare("SELECT id, full_name, email, role, status, avatar, created_at FROM users WHERE id=:id");
            $stmt->execute([':id'=>$id]);
            $user = $stmt->fetch();
            if($user) json_response(200,['status'=>'success','data'=>$user]);
            else json_response(404,['status'=>'error','message'=>'Không tìm thấy user.']);
            break;

        case 'create':
            if($method!=='POST') json_response(405,['status'=>'error','message'=>'Method Not Allowed']);
            check_admin();
            $data = $_POST;
            if(empty($data['email']) || empty($data['password']) || empty($data['full_name'])){
                json_response(400,['status'=>'error','message'=>'Full name, Email và Password là bắt buộc.']);
            }

            // Check email trùng
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email=:email LIMIT 1");
            $stmt->execute([':email'=>$data['email']]);
            if($stmt->fetch()) json_response(409,['status'=>'error','message'=>'Email đã tồn tại.']);

            $avatar_path = handle_image_upload('avatar');
            $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
            $role = in_array($data['role']??'customer',['admin','staff','customer']) ? $data['role']:'customer';
            $status = ($data['status']??1)==1 ? 1 : 0;

            $stmt = $pdo->prepare("INSERT INTO users (full_name,email,password,role,status,avatar,created_at) 
                                   VALUES (:full_name,:email,:password,:role,:status,:avatar,NOW())");
            $stmt->execute([
                ':full_name'=>$data['full_name'],
                ':email'=>$data['email'],
                ':password'=>$password_hash,
                ':role'=>$role,
                ':status'=>$status,
                ':avatar'=>$avatar_path
            ]);
            json_response(201,['status'=>'success','message'=>'Tạo user thành công.']);
            break;

        case 'update':
            if($method!=='POST') json_response(405,['status'=>'error','message'=>'Method Not Allowed']);
            check_admin();
            $data = $_POST;
            $id = (int)($data['id']??0);
            if(!$id) json_response(400,['status'=>'error','message'=>'Thiếu ID.']);
            if(empty($data['full_name'])) json_response(400,['status'=>'error','message'=>'Full name là bắt buộc.']);

            $avatar_path = handle_image_upload('avatar');
            $params = [
                ':full_name'=>$data['full_name'],
                ':role'=>in_array($data['role']??'customer',['admin','staff','customer'])?$data['role']:'customer',
                ':status'=>($data['status']==1)?1:0,
                ':id'=>$id
            ];
            $setSql = "full_name=:full_name, role=:role, status=:status";

            if(!empty($data['password'])){
                $params[':password']=password_hash($data['password'],PASSWORD_DEFAULT);
                $setSql.=", password=:password";
            }
            if($avatar_path!==null){
                $params[':avatar']=$avatar_path;
                $setSql.=", avatar=:avatar";
            }

            $stmt = $pdo->prepare("UPDATE users SET $setSql WHERE id=:id");
            $stmt->execute($params);
            json_response(200,['status'=>'success','message'=>'Cập nhật user thành công.']);
            break;

        case 'delete':
            if($method!=='POST') json_response(405,['status'=>'error','message'=>'Method Not Allowed']);
            check_admin();
            $data = json_decode(file_get_contents('php://input'), true) ?: $_POST;
            $id = (int)($data['id']??0);
            if(!$id) json_response(400,['status'=>'error','message'=>'Thiếu ID.']);
            $stmt = $pdo->prepare("UPDATE users SET status=0 WHERE id=:id");
            $stmt->execute([':id'=>$id]);
            json_response(200,['status'=>'success','message'=>'Đã ẩn user.']);
            break;

        default:
            json_response(404,['status'=>'error','message'=>'API endpoint không tìm thấy.']);
    }

} catch(Exception $e){
    error_log("Error in users.php: ".$e->getMessage());
    json_response(500,['status'=>'error','message'=>'Lỗi server: '.$e->getMessage()]);
}
