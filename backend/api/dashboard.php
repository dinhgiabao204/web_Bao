<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Kết nối database
    $DB_HOST = "localhost";
    $DB_PORT = "3306";
    $DB_NAME = "sql_nhom50_itimi";
    $DB_USER = "sql_nhom50_itimi";
    $DB_PASS = "03a894cb183488";
    
    $db = new PDO("mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_NAME;charset=utf8mb4", $DB_USER, $DB_PASS);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Thống kê sản phẩm
    $stmt = $db->query("SELECT COUNT(*) as total FROM products");
    $totalProducts = (int)$stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Thống kê đơn hàng
    $stmt = $db->query("SELECT COUNT(*) as total FROM orders");
    $totalOrders = (int)$stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Thống kê người dùng
    $stmt = $db->query("SELECT COUNT(*) as total FROM users WHERE role = 'customer'");
    $totalUsers = (int)$stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Thống kê doanh thu
    $stmt = $db->query("SELECT IFNULL(SUM(total_amount),0) as revenue FROM orders WHERE status IN ('completed','shipped')");
    $totalRevenue = (float)$stmt->fetch(PDO::FETCH_ASSOC)['revenue'];

    // Đơn hàng theo trạng thái
    $stmt = $db->query("SELECT status, COUNT(*) as count FROM orders GROUP BY status");
    $ordersByStatus = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Doanh thu 6 tháng
    $stmt = $db->query("
        SELECT DATE_FORMAT(created_at,'%Y-%m') as month,
               IFNULL(SUM(total_amount),0) as revenue
        FROM orders
        WHERE status IN ('completed','shipped')
          AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY month
        ORDER BY month ASC
    ");
    $revenueByMonth = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Top 5 sản phẩm
    $stmt = $db->query("
        SELECT p.id, p.name, p.image, IFNULL(SUM(oi.quantity),0) as total_sold
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id
        WHERE o.status IN ('completed','shipped') OR o.id IS NULL
        GROUP BY p.id, p.name, p.image
        HAVING total_sold > 0
        ORDER BY total_sold DESC
        LIMIT 5
    ");
    $topProducts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Trả về JSON
    echo json_encode([
        'status' => 'success',
        'data' => [
            'totalProducts' => $totalProducts,
            'totalOrders' => $totalOrders,
            'totalUsers' => $totalUsers,
            'totalRevenue' => $totalRevenue,
            'ordersByStatus' => $ordersByStatus,
            'revenueByMonth' => $revenueByMonth,
            'topProducts' => $topProducts
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status'=>'error',
        'message'=>'Database error: '.$e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status'=>'error',
        'message'=>'Server error: '.$e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
