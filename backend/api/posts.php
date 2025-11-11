<?php
/**
 * API: posts.php
 * Dùng cho blog và tin tức trong website Nhà Thuốc GB
 * Bổ sung các action: admin_list, create, update, delete
 */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// === DEBUG MODE ===
ini_set('display_errors', 1);
error_reporting(E_ALL);

// === JSON helper ===
function json_response($code, $data) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

// === CORS preflight ===
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// === DB connection ===
$DB_HOST = "127.0.0.1";
$DB_PORT = "3307"; // XAMPP MySQL port
$DB_NAME = "nhathuocgb";
$DB_USER = "root";
$DB_PASS = "";

try {
    $pdo = new PDO(
        "mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_NAME;charset=utf8mb4",
        $DB_USER,
        $DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (Exception $e) {
    json_response(500, ["status" => "error", "message" => "Lỗi kết nối CSDL: " . $e->getMessage()]);
}

// === Upload config ===
$UPLOAD_DIR = realpath(__DIR__ . '/../../uploads/posts');
if (!$UPLOAD_DIR) {
    $UPLOAD_DIR = __DIR__ . '/../../uploads/posts';
    @mkdir($UPLOAD_DIR, 0777, true);
}

// === Helpers ===
function slugify($str) {
    $str = trim(mb_strtolower($str, 'UTF-8'));
    // bỏ dấu tiếng Việt
    $map = [
        'à'=>'a','á'=>'a','ạ'=>'a','ả'=>'a','ã'=>'a','â'=>'a','ầ'=>'a','ấ'=>'a','ậ'=>'a','ẩ'=>'a','ẫ'=>'a','ă'=>'a','ằ'=>'a','ắ'=>'a','ặ'=>'a','ẳ'=>'a','ẵ'=>'a',
        'è'=>'e','é'=>'e','ẹ'=>'e','ẻ'=>'e','ẽ'=>'e','ê'=>'e','ề'=>'e','ế'=>'e','ệ'=>'e','ể'=>'e','ễ'=>'e',
        'ì'=>'i','í'=>'i','ị'=>'i','ỉ'=>'i','ĩ'=>'i',
        'ò'=>'o','ó'=>'o','ọ'=>'o','ỏ'=>'o','õ'=>'o','ô'=>'o','ồ'=>'o','ố'=>'o','ộ'=>'o','ổ'=>'o','ỗ'=>'o','ơ'=>'o','ờ'=>'o','ớ'=>'o','ợ'=>'o','ở'=>'o','ỡ'=>'o',
        'ù'=>'u','ú'=>'u','ụ'=>'u','ủ'=>'u','ũ'=>'u','ư'=>'u','ừ'=>'u','ứ'=>'u','ự'=>'u','ử'=>'u','ữ'=>'u',
        'ỳ'=>'y','ý'=>'y','ỵ'=>'y','ỷ'=>'y','ỹ'=>'y',
        'đ'=>'d'
    ];
    $str = strtr($str, $map);
    $str = preg_replace('/[^a-z0-9\s-]/', '', $str);
    $str = preg_replace('/[\s-]+/', '-', $str);
    return trim($str, '-');
}

function normalize_status($s) {
    $s = strtolower((string)$s);
    return in_array($s, ['published','draft'], true) ? $s : 'published';
}

function save_image_if_any($field, $UPLOAD_DIR) {
    if (!isset($_FILES[$field]) || !is_uploaded_file($_FILES[$field]['tmp_name'])) return null;

    $allowed = ['jpg','jpeg','png','webp','gif'];
    $ext = strtolower(pathinfo($_FILES[$field]['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowed)) {
        json_response(422, ["status"=>"error", "message"=>"Định dạng ảnh không hợp lệ. Cho phép: ".implode(', ', $allowed)]);
    }
    if ($_FILES[$field]['size'] > 5 * 1024 * 1024) { // 5MB
        json_response(413, ["status"=>"error", "message"=>"Ảnh vượt quá 5MB"]);
    }

    $basename = 'post_' . date('Ymd_His') . '_' . bin2hex(random_bytes(3)) . '.' . $ext;
    $target = rtrim($UPLOAD_DIR, '/\\') . DIRECTORY_SEPARATOR . $basename;
    if (!move_uploaded_file($_FILES[$field]['tmp_name'], $target)) {
        json_response(500, ["status"=>"error", "message"=>"Không thể lưu ảnh tải lên"]);
    }
    // Lưu vào DB dạng "posts/xxx.jpg"
    return 'posts/' . $basename;
}

function read_json_body() {
    $ct = $_SERVER['CONTENT_TYPE'] ?? '';
    if (stripos($ct, 'application/json') !== false) {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }
    return [];
}

// === Router ===
$action = $_GET['action'] ?? ($_POST['action'] ?? 'list');
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($action) {

        // ---------------- LIST (public, chỉ bài published) ---------------
        case 'list':
            if ($method !== 'GET') {
                json_response(405, ["status"=>"error","message"=>"Phương thức không được phép."]);
            }
            $query = "SELECT id, title, slug, image, excerpt, status, created_at
                      FROM posts
                      WHERE status = 'published'
                      ORDER BY created_at DESC";
            if (!empty($_GET['limit'])) {
                $limit = abs((int)$_GET['limit']);
                if ($limit > 0) $query .= " LIMIT $limit";
            }
            $stmt = $pdo->query($query);
            $posts = $stmt->fetchAll();
            json_response(200, ["status"=>"success","data"=>$posts]);
            break;

        // ---------------- ADMIN LIST (trả tất cả status) -----------------
        case 'admin_list':
            if ($method !== 'GET') {
                json_response(405, ["status"=>"error","message"=>"Phương thức không được phép."]);
            }
            $stmt = $pdo->query("SELECT id, title, slug, image, excerpt, status, created_at
                                 FROM posts
                                 ORDER BY created_at DESC");
            json_response(200, ["status"=>"success","data"=>$stmt->fetchAll()]);
            break;

        // ---------------- DETAIL (by slug hoặc id) -----------------------
        case 'detail':
            if ($method !== 'GET') {
                json_response(405, ["status"=>"error","message"=>"Phương thức không được phép."]);
            }
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            $slug = $_GET['slug'] ?? '';

            if ($id > 0) {
                // Sửa lại để lấy tất cả các trường cho form edit
                $stmt = $pdo->prepare("SELECT * FROM posts WHERE id = ?");
                $stmt->execute([$id]);
            } else {
                if ($slug === '') json_response(400, ["status"=>"error","message"=>"Thiếu slug hoặc id."]);
                // Chỉ lấy các bài đã published cho trang public
                $stmt = $pdo->prepare("SELECT * FROM posts WHERE slug = ? AND status = 'published'");
                $stmt->execute([$slug]);
            }
            $post = $stmt->fetch();
            if ($post) json_response(200, ["status"=>"success","data"=>$post]);
            json_response(404, ["status"=>"error","message"=>"Không tìm thấy bài viết."]);
            break;

        // ---------------- CREATE (multipart hoặc JSON) -------------------
        case 'create':
            if ($method !== 'POST') {
                json_response(405, ["status"=>"error","message"=>"Phương thức không được phép."]);
            }
            // Ưu tiên FormData; nếu là JSON thì đọc từ body
            $payload = $_POST ?: read_json_body();

            $title   = trim($payload['title']   ?? '');
            $slug    = trim($payload['slug']    ?? '');
            $excerpt = trim($payload['excerpt'] ?? '');
            $content = trim($payload['content'] ?? '');
            $status  = normalize_status($payload['status'] ?? 'published');

            if ($title === '') json_response(422, ["status"=>"error","message"=>"Thiếu tiêu đề."]);
            if ($slug  === '') $slug = slugify($title);

            // kiểm tra slug trùng
            $check = $pdo->prepare("SELECT COUNT(*) FROM posts WHERE slug = ?");
            $check->execute([$slug]);
            if ($check->fetchColumn() > 0) {
                json_response(409, ["status"=>"error","message"=>"Slug đã tồn tại."]);
            }

            $imagePath = save_image_if_any('image', $UPLOAD_DIR); // field 'image'

            $stmt = $pdo->prepare("INSERT INTO posts (title, slug, image, excerpt, content, status, created_at, updated_at)
                                   VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())");
            $stmt->execute([$title, $slug, $imagePath, $excerpt, $content, $status]);

            json_response(201, ["status"=>"success","data"=>["id"=>$pdo->lastInsertId()]]);
            break;

        // ---------------- UPDATE (multipart hoặc JSON) -------------------
        case 'update':
            if ($method !== 'POST') {
                json_response(405, ["status"=>"error","message"=>"Phương thức không được phép."]);
            }
            $payload = $_POST ?: read_json_body();

            $id = (int)($payload['id'] ?? 0);
            if ($id <= 0) json_response(422, ["status"=>"error","message"=>"Thiếu id."]);

            $stmt = $pdo->prepare("SELECT * FROM posts WHERE id = ?");
            $stmt->execute([$id]);
            $old = $stmt->fetch();
            if (!$old) json_response(404, ["status"=>"error","message"=>"Không tồn tại bài viết."]);

            $title   = trim($payload['title']   ?? $old['title']);
            $slug    = trim($payload['slug']    ?? $old['slug']);
            $excerpt = trim($payload['excerpt'] ?? $old['excerpt']);
            $content = trim($payload['content'] ?? $old['content']);
            $status  = normalize_status($payload['status'] ?? $old['status']);

            if ($slug === '') $slug = slugify($title);
            if ($slug !== $old['slug']) {
                $check = $pdo->prepare("SELECT COUNT(*) FROM posts WHERE slug=? AND id<>?");
                $check->execute([$slug, $id]);
                if ($check->fetchColumn() > 0) {
                    json_response(409, ["status"=>"error","message"=>"Slug đã tồn tại."]);
                }
            }

            $imagePath = save_image_if_any('image', $UPLOAD_DIR);
            if (!$imagePath) $imagePath = $old['image'];

            $stmt = $pdo->prepare("UPDATE posts
                                   SET title=?, slug=?, image=?, excerpt=?, content=?, status=?, updated_at=NOW()
                                   WHERE id=?");
            $stmt->execute([$title, $slug, $imagePath, $excerpt, $content, $status, $id]);

            json_response(200, ["status"=>"success","data"=>["updated"=>true]]);
            break;

        // ---------------- DELETE --------------------------
        case 'delete':
            if ($method !== 'POST') {
                json_response(405, ["status"=>"error","message"=>"Phương thức không được phép."]);
            }
            $id = (int)($_POST['id'] ?? (read_json_body()['id'] ?? 0));
            if ($id <= 0) json_response(422, ["status"=>"error","message"=>"Thiếu id."]);

            $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
            $stmt->execute([$id]);

            json_response(200, ["status"=>"success","data"=>["deleted" => ($stmt->rowCount() > 0)]]);
            break;

        // ---------------- DEFAULT -------------------------
        default:
            json_response(404, ["status" => "error", "message" => "API endpoint không tồn tại."]);
    }
} catch (PDOException $e) {
    json_response(500, ["status" => "error", "message" => "SQL Error: " . $e->getMessage()]);
} catch (Exception $e) {
    json_response(500, ["status" => "error", "message" => "Server Error: " . $e->getMessage()]);
}
