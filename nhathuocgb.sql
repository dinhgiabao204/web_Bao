-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3307
-- Thời gian đã tạo: Th10 03, 2025 lúc 10:33 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `nhathuocgb`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `addresses`
--

CREATE TABLE `addresses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `is_default` tinyint(4) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `full_name`, `phone`, `address`, `is_default`, `created_at`) VALUES
(1, 2, 'Khách hàng', '0903234567', '123 Đường ABC, Phường 1, Quận 2, TP. Hồ Chí Minh', 1, '2025-10-24 14:28:22');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`, `created_at`) VALUES
(30, 3, 4, 1, '2025-10-26 17:20:02'),
(49, 1, 3, 1, '2025-11-03 14:54:22');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `image`, `status`, `created_at`) VALUES
(1, 'Thuốc không kê đơn', 'thuoc-khong-ke-don', 'category1.jpg', 1, '2025-10-24 14:28:22'),
(2, 'Vitamin & TPCN', 'vitamin-tpcn', 'category2.jpg', 1, '2025-10-24 14:28:22'),
(3, 'Dụng cụ y tế', 'dung-cu-y-te', 'category3.jpg', 1, '2025-10-24 14:28:22'),
(4, 'Chăm sóc sức khỏe', 'cham-soc-suc-khoe', 'category4.jpg', 1, '2025-10-24 14:28:22'),
(5, 'Mẹ và bé', 'me-va-be', 'category5.jpg', 1, '2025-10-24 14:28:22');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `order_code` varchar(50) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `address` text NOT NULL,
  `note` text DEFAULT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `payment_method` enum('cod','bank') DEFAULT 'cod',
  `status` enum('pending','confirmed','shipping','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `order_code`, `customer_name`, `customer_phone`, `customer_email`, `address`, `note`, `total_amount`, `payment_method`, `status`, `created_at`) VALUES
(1, 2, 'GB-1001', 'Khách hàng', '0903234567', 'customer@gmail.com', '123 Đường ABC, Phường 1, Quận 2, TP. Hồ Chí Minh', 'Giao hàng giờ hành chính', 175000.00, 'cod', 'confirmed', '2025-10-24 14:28:22'),
(2, 3, 'GB-1761407952', 'đinh gia bao', '0909699257', 'dinhgiabao@gmail.com', 'Vĩnh Lộc ', '', 405000.00, 'cod', 'pending', '2025-10-25 15:59:12'),
(3, 3, 'GB-1761408029', 'đinh gia bao', '0909699257', 'dinhgiabao@gmail.com', '123', '', 180000.00, 'bank', 'pending', '2025-10-25 16:00:29'),
(4, 3, 'GB-1761470659', 'Gia Bảo', '0909699257', '', '123, bình chánh, hồ chí minh', '', 550000.00, 'cod', 'pending', '2025-10-26 09:24:19'),
(5, 3, 'GB-1761470698', 'Gia Bảo', '0909699257', 'dinhgiabao@gmail.com', '123, bình chánh, hồ chí minh', '', 135000.00, 'cod', 'pending', '2025-10-26 09:24:58'),
(6, 1, 'GB-1761472392', 'Administrator', '0909699257', '', '123, bình chánh, hồ chí minh', '', 135000.00, 'cod', 'pending', '2025-10-26 09:53:12'),
(7, 3, 'GB-1761473344', 'Gia Bảo', '0909699257', 'dinhgiabao@gmail.com', '123, bình chánh, hồ chí minh', '', 180000.00, 'cod', 'pending', '2025-10-26 10:09:04'),
(8, 1, 'GB-1761473836', 'Administrator', '0903234567', 'dinhgiabao@gmail.com', 'a, a, A', '', 234000.00, 'cod', 'pending', '2025-10-26 10:17:16'),
(9, 1, 'GB-1761473882', 'Administrator', '0909699257', 'dinhgiabao@gmail.com', 'a, a, hồ chí minh', '', 279000.00, 'cod', 'pending', '2025-10-26 10:18:02'),
(10, 3, 'GB-1761474103', 'Gia Bảo', '0909699257', 'dinhgiabao77991@gmail.com', '123, bình chánh, hồ chí minh', '', 135000.00, 'cod', 'pending', '2025-10-26 10:21:43'),
(11, 1, 'GB-1761474449', 'Administrator', '0901234567', 'admin@gmail.com', 'Landmark 81, bình thạnh, hồ chí minh', '', 459000.00, 'cod', 'pending', '2025-10-26 10:27:29'),
(12, 3, 'GB-1761498894', 'Gia Bảo', '0909699257', 'dinhgiabao77991@gmail.com', '123, bình chánh, hồ chí minh', '', 279000.00, 'cod', 'pending', '2025-10-26 17:14:54'),
(14, 1, 'GB-1761499900', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 135000.00, 'cod', 'pending', '2025-10-26 17:31:40'),
(16, 1, 'GB-000016', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 389000.00, 'cod', 'pending', '2025-10-26 17:33:14'),
(17, 1, 'GB-000017', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 389000.00, 'cod', 'pending', '2025-10-26 17:33:14'),
(18, 1, 'GB-000018', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 35000.00, 'cod', 'pending', '2025-10-26 17:35:38'),
(19, 1, 'GB-000019', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 35000.00, 'cod', 'pending', '2025-10-26 17:35:38'),
(20, 1, 'GB-000020', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 180000.00, 'bank', 'pending', '2025-10-26 17:36:12'),
(21, 1, 'GB-000021', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 180000.00, 'bank', 'pending', '2025-10-26 17:36:12'),
(22, 1, 'GB-000022', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 399000.00, 'cod', 'pending', '2025-10-26 17:42:51'),
(23, 1, 'GB-000023', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 399000.00, 'cod', 'pending', '2025-10-26 17:42:51'),
(24, 1, 'GB-000024', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 135000.00, 'cod', 'pending', '2025-10-26 17:51:16'),
(25, 1, 'GB-000025', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 135000.00, 'cod', 'pending', '2025-10-26 17:51:16'),
(26, 1, 'GB-000026', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 35000.00, 'bank', 'pending', '2025-10-26 18:01:26'),
(27, 1, 'GB-000027', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 35000.00, 'bank', 'pending', '2025-10-26 18:01:26'),
(28, 1, 'GB-000028', 'Administrator', '0901234567', 'admin@gmail.com', '123, 123, hồ chí minh', '', 45000.00, 'bank', 'confirmed', '2025-10-26 18:05:15'),
(29, 1, 'GB-000029', 'Administrator', '0901234567', 'admin@gmail.com', '123, 123, hồ chí minh', '', 45000.00, 'bank', 'pending', '2025-10-26 18:05:15'),
(30, 1, 'GB-000030', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 35000.00, 'bank', 'pending', '2025-10-26 18:07:55'),
(31, 1, 'GB-000031', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 35000.00, 'bank', 'pending', '2025-10-26 18:07:55'),
(32, 1, 'GB-000032', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 35000.00, 'bank', 'pending', '2025-10-26 18:11:07'),
(33, 1, 'GB-000033', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 35000.00, 'bank', 'pending', '2025-10-26 18:11:07'),
(34, 1, 'GB-000034', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 135000.00, 'bank', 'pending', '2025-10-26 18:11:51'),
(35, 1, 'GB-000035', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 135000.00, 'bank', 'pending', '2025-10-26 18:11:51'),
(36, 1, 'GB-000036', 'Administrator', '0909699257', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 450000.00, 'bank', 'pending', '2025-10-26 18:17:35'),
(37, 1, 'GB-000037', 'Administrator', '0909699257', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 450000.00, 'bank', 'pending', '2025-10-26 18:18:45'),
(38, 1, 'GB-000038', 'Administrator', '0909699257', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 450000.00, 'bank', 'pending', '2025-10-26 18:18:47'),
(39, 1, 'GB-000039', 'Administrator', '0909699257', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 450000.00, 'bank', 'pending', '2025-10-26 18:18:49'),
(40, 1, 'GB-000040', 'Administrator', '0909699257', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 450000.00, 'cod', 'pending', '2025-10-26 18:18:54'),
(41, 1, 'GB-000041', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 180000.00, 'bank', 'pending', '2025-10-26 18:23:46'),
(42, 1, 'GB-000042', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 280000.00, 'bank', 'pending', '2025-10-26 18:24:40'),
(43, 1, 'GB-000043', 'Administrator', '0901234567', 'admin@gmail.com', '132, 123, hồ chí minh', '', 325000.00, 'bank', 'pending', '2025-10-26 18:27:53'),
(44, 1, 'GB-000044', 'Administrator', '0901234567', 'admin@gmail.com', '123, bình chánh, hồ chí minh', '', 35000.00, 'bank', 'completed', '2025-10-26 18:31:31'),
(45, 1, 'GB-000045', 'Administrator', '0901234567', 'admin@gmail.com', '444, bình chánh, hồ chí minh', '', 180000.00, 'cod', 'cancelled', '2025-10-28 00:23:51');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `price` decimal(15,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `product_image`, `price`, `quantity`, `subtotal`) VALUES
(1, 1, 1, 'Paracetamol 500mg', 'products/medicine1.avif', 20000.00, 2, 40000.00),
(2, 1, 3, 'Vitamin C 1000mg', 'products/medicine3.avif', 135000.00, 1, 135000.00),
(3, 2, 4, 'Vitamin B Complex', 'products/medicine4.avif', 180000.00, 2, 360000.00),
(4, 2, 2, 'Amoxicillin 500mg', 'products/medicine2.avif', 45000.00, 1, 45000.00),
(5, 3, 2, 'Amoxicillin 500mg', 'products/medicine2.avif', 45000.00, 1, 45000.00),
(6, 3, 3, 'Vitamin C 1000mg', 'products/medicine3.avif', 135000.00, 1, 135000.00),
(7, 4, 1, 'Paracetamol 500mg', 'products/medicine1.avif', 20000.00, 19, 380000.00),
(8, 4, 7, 'Nước rửa tay khô', 'products/medicine7.avif', 35000.00, 1, 35000.00),
(9, 4, 3, 'Vitamin C 1000mg', 'products/medicine3.avif', 135000.00, 1, 135000.00),
(10, 5, 3, 'Vitamin C 1000mg', 'products/medicine3.avif', 135000.00, 1, 135000.00),
(11, 6, 3, 'Vitamin C 1000mg', 'products/medicine3.avif', 135000.00, 1, 135000.00),
(12, 7, 4, 'Vitamin B Complex', 'products/medicine4.avif', 180000.00, 1, 180000.00),
(13, 8, 3, 'Vitamin C 1000mg', 'products/medicine3.avif', 135000.00, 1, 135000.00),
(14, 8, 5, 'Nhiệt kế điện tử', 'products/medicine5.avif', 99000.00, 1, 99000.00),
(15, 9, 4, 'Vitamin B Complex', 'products/medicine4.avif', 180000.00, 1, 180000.00),
(16, 9, 5, 'Nhiệt kế điện tử', 'products/medicine5.avif', 99000.00, 1, 99000.00),
(17, 10, 3, 'Vitamin C 1000mg', 'products/medicine3.avif', 135000.00, 1, 135000.00),
(18, 11, 4, 'Vitamin B Complex', 'products/medicine4.avif', 180000.00, 2, 360000.00),
(19, 11, 5, 'Nhiệt kế điện tử', 'products/medicine5.avif', 99000.00, 1, 99000.00),
(20, 12, 4, 'Vitamin B Complex', 'products/medicine4.avif', 180000.00, 1, 180000.00),
(21, 12, 5, 'Nhiệt kế điện tử', 'products/medicine5.avif', 99000.00, 1, 99000.00),
(22, 14, 3, 'Vitamin C 1000mg', 'products/medicine3.avif', 135000.00, 1, 135000.00),
(23, 16, 9, 'Sữa bột Enfamil', 'products/medicine9.avif', 389000.00, 1, 389000.00),
(24, 17, 9, 'Sữa bột Enfamil', 'products/medicine9.avif', 389000.00, 1, 389000.00),
(25, 18, 7, 'Nước rửa tay khô', 'products/medicine7.avif', 35000.00, 1, 35000.00),
(26, 19, 7, 'Nước rửa tay khô', 'products/medicine7.avif', 35000.00, 1, 35000.00),
(27, 20, 4, 'Vitamin B Complex', 'products/medicine4.avif', 180000.00, 1, 180000.00),
(28, 21, 4, 'Vitamin B Complex', 'products/medicine4.avif', 180000.00, 1, 180000.00),
(29, 22, 6, 'Máy đo huyết áp', 'products/medicine6.avif', 399000.00, 1, 399000.00),
(30, 23, 6, 'Máy đo huyết áp', 'products/medicine6.avif', 399000.00, 1, 399000.00),
(31, 24, 3, 'Vitamin C 1000mg', 'products/medicine3.avif', 135000.00, 1, 135000.00),
(32, 25, 3, 'Vitamin C 1000mg', 'products/medicine3.avif', 135000.00, 1, 135000.00),
(33, 26, 7, 'Nước rửa tay khô', 'products/medicine7.avif', 35000.00, 1, 35000.00),
(34, 27, 7, 'Nước rửa tay khô', 'products/medicine7.avif', 35000.00, 1, 35000.00),
(35, 28, 8, 'Khẩu trang y tế', 'products/medicine8.avif', 45000.00, 1, 45000.00),
(36, 29, 8, 'Khẩu trang y tế', 'products/medicine8.avif', 45000.00, 1, 45000.00),
(37, 30, 7, 'Nước rửa tay khô', 'products/medicine7.avif', 35000.00, 1, 35000.00),
(38, 31, 7, 'Nước rửa tay khô', 'products/medicine7.avif', 35000.00, 1, 35000.00),
(39, 32, 7, 'Nước rửa tay khô', 'products/medicine7.avif', 35000.00, 1, 35000.00),
(40, 33, 7, 'Nước rửa tay khô', 'products/medicine7.avif', 35000.00, 1, 35000.00),
(41, 34, 3, 'Vitamin C 1000mg', 'products/medicine3.avif', 135000.00, 1, 135000.00),
(42, 35, 3, 'Vitamin C 1000mg', 'products/medicine3.avif', 135000.00, 1, 135000.00),
(43, 36, 6, 'Máy đo huyết áp', 'products/medicine6.avif', 450000.00, 1, 450000.00),
(44, 37, 6, 'Máy đo huyết áp', 'products/medicine6.avif', 450000.00, 1, 450000.00),
(45, 38, 6, 'Máy đo huyết áp', 'products/medicine6.avif', 450000.00, 1, 450000.00),
(46, 39, 6, 'Máy đo huyết áp', 'products/medicine6.avif', 450000.00, 1, 450000.00),
(47, 40, 6, 'Máy đo huyết áp', 'products/medicine6.avif', 450000.00, 1, 450000.00),
(48, 41, 4, 'Vitamin B Complex', 'products/medicine4.avif', 180000.00, 1, 180000.00),
(49, 42, 10, 'Tã giấy Pampers', 'products/medicine10.avif', 280000.00, 1, 280000.00),
(50, 43, 2, 'Amoxicillin 500mg', 'products/medicine2.avif', 45000.00, 1, 45000.00),
(51, 43, 10, 'Tã giấy Pampers', 'products/medicine10.avif', 280000.00, 1, 280000.00),
(52, 44, 7, 'Nước rửa tay khô', 'products/medicine7.avif', 35000.00, 1, 35000.00),
(53, 45, 4, 'Vitamin B Complex', 'products/medicine4.avif', 180000.00, 1, 180000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext NOT NULL,
  `status` enum('draft','published') DEFAULT 'published',
  `views` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `posts`
--

INSERT INTO `posts` (`id`, `title`, `slug`, `image`, `excerpt`, `content`, `status`, `views`, `created_at`) VALUES
(2, 'Lợi ích của Vitamin C đối với cơ thể, bạn đã biết hết chưa?', 'loi-ich-cua-vitamin-c', 'posts/post2.jpg', 'Vitamin C không chỉ giúp tăng sức đề kháng mà còn là vi chất quan trọng cho da, xương và quá trình chống oxy hóa. Hãy cùng tìm hiểu sâu hơn về lợi ích của Vitamin C.', 'Vitamin C (Acid Ascorbic) là một vi chất dinh dưỡng thiết yếu mà cơ thể không thể tự tổng hợp được, bắt buộc phải bổ sung từ bên ngoài. Đây không chỉ là \"thuốc giải cảm\" như nhiều người vẫn nghĩ, mà còn có vô số vai trò quan trọng:\n\n### 1. \"Vệ Sĩ\" Của Hệ Miễn Dịch\nĐây là lợi ích nổi tiếng nhất. Vitamin C kích thích sản xuất và tăng cường chức năng của các tế bào bạch cầu, giúp cơ thể nhận diện và tiêu diệt mầm bệnh (vi khuẩn, virus) hiệu quả hơn. Nó cũng là một chất kháng histamine tự nhiên, giúp giảm các triệu chứng cảm lạnh.\n\n### 2. Chất Chống Oxy Hóa Hàng Đầu\nVitamin C giúp trung hòa các gốc tự do - những phân tử gây hại được sinh ra từ quá trình trao đổi chất hoặc do tiếp xúc với khói thuốc, ô nhiễm. Nhờ đó, nó bảo vệ tế bào khỏi hư tổn và làm chậm quá trình lão hóa.\n\n### 3. Yếu Tố Cần Thiết Cho Làn Da\nVitamin C là thành phần không thể thiếu trong quá trình tổng hợp collagen. Collagen là protein chính tạo nên cấu trúc da, xương, sụn và mạch máu. Bổ sung đủ Vitamin C giúp da săn chắc, đàn hồi, giảm nếp nhăn và giúp vết thương mau lành.\n\n### 4. Tăng Cường Hấp Thu Sắt\nVitamin C cải thiện đáng kể khả năng hấp thu sắt từ thực phẩm có nguồn gốc thực vật (sắt non-heme). Điều này đặc biệt quan trọng cho người ăn chay hoặc người có nguy cơ thiếu máu do thiếu sắt.\n\n**Nguồn cung cấp Vitamin C:** Có nhiều trong ổi, cam, chanh, kiwi, dâu tây, ớt chuông, bông cải xanh...', 'published', 0, '2025-10-24 14:28:22'),
(3, 'Chăm sóc da cơ bản: 3 bước vàng cho làn da khỏe mạnh', 'cham-soc-da-3-buoc-vang', 'posts/post3.jpg', 'Một chu trình chăm sóc da khoa học không cần phức tạp. Hãy tập trung vào 3 bước cơ bản nhưng thiết yếu để bảo vệ và nuôi dưỡng làn da bạn mỗi ngày.', 'Chăm sóc da không chỉ là vấn đề thẩm mỹ mà còn là bảo vệ hàng rào sức khỏe đầu tiên của cơ thể. Một quy trình dưỡng da hiệu quả nên đơn giản và nhất quán.\n\n### 1. Làm sạch (Cleansing): Nền tảng của mọi chu trình\nLàm sạch là bước quan trọng nhất, giúp loại bỏ bụi bẩn, dầu thừa, lớp trang điểm và tế bào chết tích tụ trên da. Nên thực hiện 2 lần/ngày (sáng và tối).\n* **Buổi tối:** Nên dùng phương pháp làm sạch kép (double cleansing) gồm tẩy trang (dầu/nước) và sữa rửa mặt.\n* **Buổi sáng:** Dùng sữa rửa mặt dịu nhẹ hoặc chỉ rửa bằng nước.\n\n### 2. Dưỡng ẩm (Moisturizing): Chìa khóa cho độ đàn hồi\nDưỡng ẩm giúp bổ sung nước và duy trì hàng rào lipid tự nhiên của da, ngăn ngừa tình trạng da khô căng, bong tróc. Chọn loại kem dưỡng phù hợp với loại da (da dầu/da khô).\n* **Thành phần nên có:** Hyaluronic Acid, Ceramide, Glycerin.\n* **Cách áp dụng:** Lấy một lượng vừa đủ, vỗ nhẹ hoặc massage đều lên mặt và cổ.\n\n### 3. Bảo vệ (Sunscreen): Tuyệt đối không thể thiếu\nÁnh nắng mặt trời là nguyên nhân hàng đầu gây lão hóa sớm, nám, tàn nhang và ung thư da. Kem chống nắng bảo vệ da khỏi tia UVA/UVB.\n* **Sử dụng:** Thoa kem chống nắng phổ rộng (Broad Spectrum) có SPF 30 trở lên.\n* **Tần suất:** Bôi lại sau mỗi 2-3 giờ, đặc biệt khi hoạt động ngoài trời hoặc tiếp xúc với nước.\n\nViệc duy trì 3 bước này sẽ giúp da bạn khỏe mạnh và hấp thu dưỡng chất tốt hơn.', 'published', 0, '2025-10-25 16:45:29'),
(4, 'Sử dụng kháng sinh an toàn: Những điều BẮT BUỘC phải biết', 'su-dung-khang-sinh-an-toan', 'posts/post4.jpg', 'Kháng sinh là thuốc điều trị hiệu quả các bệnh nhiễm khuẩn, nhưng sử dụng không đúng cách sẽ gây ra tình trạng kháng thuốc nguy hiểm, đe dọa sức khỏe cộng đồng.', 'Tình trạng kháng kháng sinh đang là một cuộc khủng hoảng y tế toàn cầu. Việc mỗi cá nhân sử dụng kháng sinh có trách nhiệm là vô cùng cần thiết.\n\n### Nguyên tắc 5 KHÔNG khi dùng kháng sinh:\n\n1. **KHÔNG** tự ý mua thuốc: Kháng sinh chỉ được dùng khi có chỉ định và đơn thuốc của bác sĩ. Không tự chẩn đoán bệnh.\n2. **KHÔNG** tự ý ngưng thuốc: Phải dùng hết liều lượng và thời gian bác sĩ kê đơn (thường là 5, 7 hoặc 10 ngày), ngay cả khi bạn cảm thấy đã khỏi bệnh. Việc dừng thuốc sớm khiến vi khuẩn chưa bị tiêu diệt hết và dễ dàng kháng thuốc hơn.\n3. **KHÔNG** dùng lại đơn thuốc cũ: Triệu chứng có thể giống nhau, nhưng mầm bệnh có thể khác. Dùng lại đơn cũ là hành vi sai lầm.\n4. **KHÔNG** chia sẻ thuốc: Kháng sinh kê cho bạn là cho tình trạng của riêng bạn.\n5. **KHÔNG** dùng kháng sinh để trị cảm cúm: Kháng sinh không có tác dụng với bệnh do virus gây ra (như cảm cúm thông thường).\n\n### Cách dùng đúng:\n* Uống thuốc đúng giờ, đúng liều lượng.\n* Hỏi ý kiến dược sĩ về tương tác thuốc với thực phẩm (ví dụ: không uống thuốc với sữa, nước trái cây).\n* Thông báo cho bác sĩ nếu gặp bất kỳ phản ứng phụ nào.', 'published', 0, '2025-10-25 16:45:29'),
(5, '5 cách đơn giản để cân bằng sức khỏe tinh thần giữa nhịp sống bận rộn', 'can-bang-suc-khoe-tinh-than', 'posts/post5.jpg', 'Trong cuộc sống hiện đại, việc chăm sóc sức khỏe tinh thần cũng quan trọng như chăm sóc thể chất. Dưới đây là 5 thói quen dễ dàng áp dụng ngay hôm nay.', 'Stress, lo âu và kiệt sức (burnout) là những vấn đề phổ biến. Việc dành thời gian nuôi dưỡng tâm trí giúp tăng năng suất và chất lượng cuộc sống.\n\n### 1. Thực hành chánh niệm (Mindfulness) 5 phút mỗi ngày\nThử dành 5 phút mỗi ngày ngồi yên tĩnh, tập trung vào hơi thở. Chánh niệm giúp bạn kết nối với hiện tại, giảm bớt suy nghĩ về quá khứ và tương lai.\n\n### 2. Thiết lập ranh giới kỹ thuật số\nĐừng để thông báo điện thoại làm gián đoạn mọi hoạt động của bạn. Tắt thông báo, quy định thời gian không dùng mạng xã hội, và không mang điện thoại vào phòng ngủ.\n\n### 3. Sắp xếp lại môi trường sống/làm việc\nMôi trường lộn xộn thường gây ra cảm giác căng thẳng. Dành 15 phút mỗi tuần để dọn dẹp bàn làm việc, góc phòng ngủ. Không gian sạch sẽ giúp tâm trí minh mẫn hơn.\n\n### 4. Kết nối xã hội chất lượng\nĐầu tư thời gian vào những mối quan hệ mang lại năng lượng tích cực. Chỉ cần một cuộc gọi ngắn với bạn bè thân thiết cũng có thể giải tỏa căng thẳng.\n\n### 5. Dành thời gian cho \"Sở thích vô dụng\"\nĐó là những sở thích không nhằm mục đích kiếm tiền hay giải quyết vấn đề (như vẽ vời, nghe nhạc cổ điển, làm vườn). Những hoạt động này giúp bộ não được nghỉ ngơi và sáng tạo hơn.\n\n**Ghi nhớ:** Sức khỏe tinh thần là một hành trình dài, hãy kiên nhẫn với chính mình.', 'published', 0, '2025-10-25 16:45:29'),
(6, '5 mẹo vàng giữ gìn sức khỏe khi giao mùa', '5-meo-giu-gin-suc-khoe-khi-giao-mua', 'posts/post1.jpg', 'Thời tiết thay đổi đột ngột là điều kiện thuận lợi cho vi khuẩn, virus phát triển. Áp dụng ngay 5 mẹo đơn giản sau đây để bảo vệ sức khỏe cho bạn và gia đình.', 'Thời tiết giao mùa, đặc biệt là sự chênh lệch nhiệt độ lớn giữa ngày và đêm, thường làm suy yếu hệ miễn dịch và tạo điều kiện thuận lợi cho các bệnh về đường hô hấp như cảm cúm, viêm họng, viêm phế quản.\n\n### 1. Giữ ấm cơ thể đúng cách\nLuôn giữ ấm cơ thể, đặc biệt là các vùng quan trọng như cổ, ngực, và bàn chân. Sử dụng khăn quàng, áo khoác khi ra ngoài vào buổi sáng sớm hoặc tối muộn. Tuy nhiên, cũng không nên mặc quá bí, dễ gây đổ môi và nhiễm lạnh ngược.\n\n### 2. Vệ sinh cá nhân và môi trường sống\nRửa tay thường xuyên bằng xà phòng hoặc dung dịch sát khuẩn là biện pháp phòng bệnh đơn giản nhất. Vệ sinh mũi họng hàng ngày bằng nước muối sinh lý để loại bỏ mầm bệnh. Giữ nhà cửa thông thoáng, sạch sẽ, thường xuyên giặt giũ chăn màn.\n\n### 3. Chế độ dinh dưỡng cân bằng, tăng cường đề kháng\nMột hệ miễn dịch khỏe mạnh là lá chắn tốt nhất. Tăng cường ăn rau xanh, trái cây giàu vitamin (đặc biệt là Vitamin C có trong cam, ổi, bưởi) và khoáng chất (như Kẽm). Uống đủ nước mỗi ngày (khoảng 2 lít) để giữ ẩm cho niêm mạc đường hô hấp.\n\n### 4. Tập luyện thể dục đều đặn\nVận động thể chất giúp tăng cường tuần hoàn máu, cải thiện sức bền và nâng cao hệ miễn dịch. Bạn không cần tập nặng, chỉ cần duy trì thói quen đi bộ nhanh, yoga, hoặc đạp xe 30 phút mỗi ngày.\n\n### 5. Ngủ đủ giấc và giữ tinh thần thoải mái\nGiấc ngủ sâu và đủ (7-8 tiếng/đêm) giúp cơ thể phục hồi năng lượng và tái tạo hệ miễn dịch. Tránh căng thẳng, stress kéo dài vì đây cũng là yếu tố làm suy giảm sức đề kháng của cơ thể.', 'published', 0, '2025-10-24 14:28:22');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `usage` text DEFAULT NULL,
  `price` decimal(15,2) NOT NULL,
  `sale_price` decimal(15,2) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `unit` varchar(50) DEFAULT 'Hộp',
  `status` tinyint(4) DEFAULT 1,
  `featured` tinyint(4) DEFAULT 0,
  `views` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `image`, `description`, `usage`, `price`, `sale_price`, `stock`, `unit`, `status`, `featured`, `views`, `created_at`) VALUES
(1, 1, 'Paracetamol 500mg', 'paracetamol-500mg', 'products/medicine1.avif', 'Paracetamol 500mg là thuốc giảm đau, hạ sốt hiệu quả, được sử dụng rộng rãi để điều trị các triệu chứng như đau đầu, đau cơ, đau răng, đau bụng kinh và hạ sốt do cảm cúm hoặc nhiễm trùng. Cơ chế tác động nhanh, an toàn khi sử dụng đúng liều.', '* Liều dùng người lớn và trẻ em trên 12 tuổi: Uống 1-2 viên/lần, cách nhau 4-6 giờ nếu cần.\r\n* Không dùng quá 8 viên (4000mg) trong 24 giờ.\r\n* Uống thuốc với một cốc nước đầy.\r\n* Chống chỉ định: Người mẫn cảm với paracetamol, người suy gan nặng.\r\n* Đọc kỹ hướng dẫn sử dụng trước khi dùng.', 25000.00, 20000.00, 0, 'Hộp', 1, 1, 0, '2025-10-24 14:28:22'),
(2, 1, 'Amoxicillin 500mg', 'amoxicillin-500mg', 'products/medicine2.avif', 'Amoxicillin 500mg là kháng sinh thuộc nhóm penicillin, được chỉ định để điều trị các bệnh nhiễm khuẩn do vi khuẩn nhạy cảm gây ra, như nhiễm khuẩn đường hô hấp, tai mũi họng, đường tiết niệu, da và mô mềm. Thuốc cần được sử dụng theo đúng chỉ định của bác sĩ.', '* Chỉ sử dụng khi có đơn của bác sĩ.\r\n* Liều dùng và thời gian điều trị tùy thuộc vào loại nhiễm khuẩn và tình trạng bệnh nhân.\r\n* Uống thuốc trước hoặc sau bữa ăn đều được.\r\n* Phải uống hết liệu trình kháng sinh, ngay cả khi triệu chứng đã cải thiện.\r\n* Thông báo cho bác sĩ nếu bạn có tiền sử dị ứng với penicillin hoặc các thuốc khác.', 45000.00, NULL, 0, 'Hộp', 1, 1, 0, '2025-10-24 14:28:22'),
(3, 2, 'Vitamin C 1000mg', 'vitamin-c-1000mg', 'products/medicine3.avif', 'Viên uống Vitamin C 1000mg là thực phẩm bổ sung thiết yếu, giúp tăng cường hệ miễn dịch tự nhiên của cơ thể, đặc biệt trong các giai đoạn giao mùa hoặc khi cơ thể mệt mỏi. Sản phẩm còn hỗ trợ chống oxy hóa, bảo vệ tế bào và góp phần duy trì làn da khỏe mạnh.', '* Liều dùng: Uống 1 viên mỗi ngày.\n* Cách dùng: Nên uống sau bữa ăn sáng hoặc trưa với nhiều nước.\n* Đối tượng: Người trưởng thành có nhu cầu bổ sung Vitamin C liều cao.\n* Lưu ý: Không dùng quá liều. Tham khảo ý kiến bác sĩ nếu đang mang thai, cho con bú hoặc có bệnh lý nền.\n* Sản phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh.', 150000.00, 135000.00, 189, 'Hộp', 1, 1, 0, '2025-10-24 14:28:22'),
(4, 2, 'Vitamin B Complex', 'vitamin-b-complex', 'products/medicine4.avif', 'Vitamin B Complex cung cấp hỗn hợp các vitamin nhóm B quan trọng (B1, B2, B3, B5, B6, B12...) cần thiết cho quá trình chuyển hóa năng lượng, hoạt động của hệ thần kinh và duy trì sức khỏe tổng thể. Giúp giảm căng thẳng, mệt mỏi, hỗ trợ ăn ngon miệng.', '* Liều dùng: Uống 1 viên mỗi ngày.\n* Cách dùng: Uống sau bữa ăn với một cốc nước.\n* Đối tượng: Người cần bổ sung vitamin nhóm B, người ăn uống kém, mệt mỏi, căng thẳng.\n* Bảo quản: Nơi khô ráo, thoáng mát.\n* Sản phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh.', 180000.00, NULL, 139, 'Hộp', 1, 1, 0, '2025-10-24 14:28:22'),
(5, 3, 'Nhiệt kế điện tử', 'nhiet-ke-dien-tu', 'products/medicine5.avif', 'Nhiệt kế điện tử cho kết quả đo nhiệt độ cơ thể nhanh chóng và chính xác chỉ sau vài giây. Thiết kế nhỏ gọn, dễ sử dụng, an toàn cho cả trẻ em và người lớn. Màn hình LCD hiển thị rõ ràng, có bộ nhớ lưu kết quả đo gần nhất.', '* Cách đo: Có thể đo ở miệng, nách hoặc hậu môn.\n    * Đo ở miệng: Đặt đầu dò dưới lưỡi, ngậm miệng lại.\n    * Đo ở nách: Kẹp nhiệt kế vào giữa nách, đảm bảo đầu dò tiếp xúc với da.\n* Đợi đến khi có tín hiệu báo (tiếng bíp).\n* Đọc kết quả trên màn hình.\n* Vệ sinh đầu dò sau mỗi lần sử dụng bằng cồn y tế.', 120000.00, 99000.00, 46, 'Hộp', 1, 1, 0, '2025-10-24 14:28:22'),
(6, 3, 'Máy đo huyết áp', 'may-do-huyet-ap', 'products/medicine6.avif', 'Máy đo huyết áp bắp tay tự động, đo chỉ số huyết áp tâm thu, tâm trương và nhịp tim một cách chính xác. Màn hình lớn, dễ đọc, bộ nhớ lưu trữ kết quả cho nhiều người dùng. Thiết kế tiện lợi, dễ dàng sử dụng tại nhà.', '* Nghỉ ngơi 5-10 phút trước khi đo.\n* Ngồi đúng tư thế, lưng thẳng, chân không bắt chéo.\n* Quấn vòng bít vào bắp tay trái, ngang tim.\n* Nhấn nút Start/Stop để bắt đầu đo.\n* Giữ yên lặng trong quá trình đo.\n* Ghi lại kết quả và thời gian đo.\n* Tham khảo ý kiến bác sĩ nếu có chỉ số bất thường.', 450000.00, 399000.00, 23, 'Hộp', 1, 1, 0, '2025-10-24 14:28:22'),
(7, 4, 'Nước rửa tay khô', 'nuoc-rua-tay-kho', 'products/medicine7.avif', 'Dung dịch rửa tay khô sát khuẩn nhanh chóng, tiêu diệt 99.9% vi khuẩn mà không cần dùng nước. Công thức dịu nhẹ, bổ sung dưỡng ẩm, không gây khô da. Hương thơm dễ chịu. Tiện lợi mang theo bên người.', '* Lấy một lượng dung dịch vừa đủ (khoảng 2-3ml) vào lòng bàn tay.\n* Xoa đều hai bàn tay, kẽ ngón tay, mu bàn tay trong ít nhất 30 giây cho đến khi khô hoàn toàn.\n* Không cần rửa lại với nước.\n* Chỉ dùng ngoài da. Tránh tiếp xúc với mắt.\n* Để xa tầm tay trẻ em và nguồn lửa.', 35000.00, NULL, 290, 'Hộp', 1, 1, 0, '2025-10-24 14:28:22'),
(8, 4, 'Khẩu trang y tế', 'khau-trang-y-te', 'products/medicine8.avif', 'Khẩu trang y tế 4 lớp kháng khuẩn, giúp ngăn ngừa hiệu quả bụi bẩn, vi khuẩn và giọt bắn trong không khí. Thiết kế ôm sát khuôn mặt, quai đeo co giãn, thanh nẹp mũi dễ điều chỉnh. Chất liệu vải không dệt mềm mại, thoáng khí.', '* Rửa tay sạch trước khi đeo khẩu trang.\n* Đeo mặt màu xanh/trắng ra ngoài, mặt trắng vào trong.\n* Kéo khẩu trang che kín mũi, miệng và cằm.\n* Điều chỉnh thanh nẹp mũi cho ôm sát sống mũi.\n* Tránh chạm tay vào mặt ngoài khẩu trang khi đang đeo.\n* Thay khẩu trang mới khi bị ẩm hoặc sau mỗi 4-8 giờ sử dụng.\n* Thải bỏ khẩu trang đã qua sử dụng đúng cách.', 50000.00, 45000.00, 498, 'Hộp', 1, 1, 0, '2025-10-24 14:28:22'),
(9, 5, 'Sữa bột Enfamil', 'sua-bot-enfamil', 'products/medicine9.avif', 'Sữa bột Enfamil A+ 1 với công thức dinh dưỡng khoa học, cung cấp hệ dưỡng chất DHA, ARA, Choline và các vitamin, khoáng chất thiết yếu cho sự phát triển toàn diện của não bộ, thị giác và hệ miễn dịch của trẻ sơ sinh từ 0-6 tháng tuổi.', '* Rửa sạch tay và dụng cụ pha sữa.\n* Đun sôi nước sạch và để nguội đến khoảng 40°C.\n* Đong lượng nước và bột theo đúng tỷ lệ hướng dẫn trên vỏ hộp.\n* Cho bột vào nước, đậy nắp và lắc đều cho tan hoàn toàn.\n* Kiểm tra nhiệt độ trước khi cho bé bú.\n* Sữa đã pha nên dùng ngay hoặc bảo quản trong tủ lạnh không quá 24 giờ.', 420000.00, 389000.00, 58, 'Hộp', 1, 1, 0, '2025-10-24 14:28:22'),
(10, 5, 'Tã giấy Pampers', 'ta-giay-pampers', 'products/medicine10.avif', 'Tã giấy Pampers Newborn với bề mặt mềm mại, thấm hút vượt trội, giữ cho làn da bé sơ sinh luôn khô thoáng và thoải mái. Thiết kế chống tràn hiệu quả, đai hông co giãn linh hoạt. Có vạch báo đầy thông minh.', '* Đặt tã sạch dưới mông bé.\r\n* Kéo phần trước tã lên bụng bé.\r\n* Dán miếng dán hai bên sao cho vừa vặn với eo bé (không quá chặt).\r\n* Kiểm tra lại xem tã có bị lệch hay hở không.\r\n* Thay tã cho bé thường xuyên (sau mỗi 2-4 giờ) hoặc khi tã đầy (vạch báo đổi màu).\r\n* Vệ sinh sạch sẽ cho bé mỗi lần thay tã.', 280000.00, NULL, 0, 'Hộp', 1, 1, 0, '2025-10-24 14:28:22');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` tinyint(4) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `status` enum('pending','approved') DEFAULT 'approved',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `reviews`
--

INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `rating`, `comment`, `status`, `created_at`) VALUES
(1, 1, 2, 5, 'Thuốc Paracetamol này dùng rất tốt, hạ sốt nhanh.', 'approved', '2025-10-24 14:28:22'),
(2, 3, 2, 4, 'Vitamin C vị cam dễ uống, sẽ mua lại.', 'approved', '2025-10-24 14:28:22'),
(3, 5, 2, 5, 'Nhiệt kế đo chính xác, giao hàng nhanh.', 'approved', '2025-10-24 14:28:22');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `settings`
--

INSERT INTO `settings` (`id`, `setting_key`, `setting_value`, `description`) VALUES
(1, 'site_name', 'Nhà thuốc GB', 'Tên website'),
(2, 'site_email', 'contact@nhathuocgb.com', 'Email liên hệ'),
(3, 'site_phone', '1900-xxxx', 'Số điện thoại'),
(4, 'site_address', 'TP. Hồ Chí Minh', 'Địa chỉ'),
(5, 'shipping_fee', '30000', 'Phí vận chuyển'),
(6, 'free_ship_from', '500000', 'Miễn phí ship từ'),
(7, 'facebook', 'https://facebook.com/nhathuocgb', 'Facebook'),
(8, 'instagram', 'https://instagram.com/nhathuocgb', 'Instagram');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role` enum('admin','staff','customer') DEFAULT 'customer',
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `role`, `email`, `password`, `full_name`, `phone`, `avatar`, `status`, `created_at`) VALUES
(1, 'admin', 'admin@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', '0901234567', NULL, 1, '2025-10-24 14:28:22'),
(2, 'customer', 'customer@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Khách hàng', '0903234567', NULL, 1, '2025-10-24 14:28:22'),
(3, 'customer', 'dinhgiabao77991@gmail.com', '$2y$10$TNi7skOnilGPTwBMz3HENuVpHENZ22U4Pw7n0Ed5ZL6Y9z6dqXt8u', 'Gia Bảo', '', NULL, 1, '2025-10-25 15:39:08');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_code` (`order_code`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `category_id` (`category_id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
