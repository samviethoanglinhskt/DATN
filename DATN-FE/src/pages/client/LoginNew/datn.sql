-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th12 10, 2024 lúc 04:07 PM
-- Phiên bản máy phục vụ: 8.0.30
-- Phiên bản PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `datn`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `favorites`
--

CREATE TABLE `favorites` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `tb_product_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(6, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(7, '2019_08_19_000000_create_failed_jobs_table', 1),
(8, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(9, '2024_10_10_142141_create_tb_roles_table', 1),
(10, '2024_10_10_142242_create_users_table', 1),
(11, '2024_10_10_142834_create_tb_discounts_table', 2),
(12, '2024_10_10_143318_create_tb_categories_table', 3),
(13, '2024_10_10_143410_create_tb_brands_table', 4),
(14, '2024_10_10_143517_create_tb_products_table', 5),
(15, '2024_10_10_144436_create_tb_sizes_table', 6),
(16, '2024_10_10_144450_create_tb_colors_table', 6),
(17, '2024_10_10_144554_create_tb_variants_table', 7),
(18, '2024_10_10_150531_create_tb_images_table', 8),
(19, '2024_10_10_150906_create_tb_logo_banner_table', 9),
(20, '2024_10_10_151031_create_tb_news_table', 10),
(21, '2024_10_10_151150_create_tb_statistics_table', 11),
(22, '2024_10_10_151608_create_tb_carts_table', 12),
(23, '2024_10_10_151824_create_tb_comments_table', 13),
(24, '2024_10_10_152007_create_tb_oders_table', 14),
(25, '2024_10_10_152316_create_tb__oderdetail_table', 15),
(26, '2024_10_12_114728_create_tb_images_table', 16),
(28, '2024_10_30_143859_add_column_image_to_table_tb_products', 17),
(29, '2024_10_30_183447_update_tb_products_table', 18),
(30, '2024_11_08_163311_remove_status_from_tb_images', 19),
(31, '2024_11_08_170120_add_selected_to_tb_carts', 20),
(32, '2024_11_08_191445_add_address_to_users_table', 21),
(33, '2024_11_09_103835_add_foreign_keys_to_tb_carts_table', 22),
(34, '2024_11_09_120010_remove_variant_size_color_from_tb_carts', 23),
(35, '2024_11_09_120139_remove_size_and_color_from_tb_carts', 24),
(37, '2024_11_09_120346_remove_size_and_color_from_tb_carts', 25),
(38, '2024_11_09_122034_drop_selected_column_from_tb_carts', 25),
(39, '2024_11_12_060412_add_order_code_to_tb_orders_table', 26),
(40, '2024_11_12_061929_add_order_code_to_tb_orders_table', 27),
(41, '2024_11_12_074340_add_price_to_tb_oderdetail', 28),
(42, '2024_11_12_090150_drop_column_from_tb_orders_table', 29),
(43, '2024_11_12_092418_add_tb_variant_id_to_tb_oderdetail_table', 29),
(44, '2024_11_14_151400_update_nullable_tb_variants_columns', 29),
(45, '2024_11_16_151534_create_tb_contacts_table', 30),
(46, '2024_11_17_062906_add_image_to_table_name', 31),
(47, '2024_11_17_065808_modify_image_nullable_in_tb_new_table', 32),
(48, '2024_11_17_113334_add_timestamps_to_tb_contacts', 33),
(49, '2024_11_19_174257_create_favorites_table', 34),
(50, '2024_11_19_155145_add_rating_and_parent_id_to_tb_comments', 35),
(51, '2024_11_24_183536_create_reviews_table', 36),
(52, '2024_11_24_183536_create_tb_reviews_table', 37),
(53, '2024_11_24_190503_create_tb_reviews_table', 38),
(54, '2024_11_24_192520_create_tb_reviews_table', 39),
(55, '2024_11_25_051632_add_is_reviewed_to_tb_orderdetail_table', 40),
(56, '2024_11_26_172941_create_tb_address_users_table', 41),
(57, '2024_12_01_161012_add_quantity_and_max_price_to_tb_discounts_table', 42),
(58, '2024_12_02_081032_add_delivered_at_to_tb_oder_table', 43),
(59, '2024_12_04_064516_create_tb_oderdetail_temp_table', 44),
(60, '2024_12_04_065330_create_tb_oder_temp_table', 45),
(61, '2024_12_04_071338_create_tb_oder_temp_table', 46),
(62, '2024_12_04_071931_create_tb_oder_temps_table', 47),
(63, '2024_12_04_072036_create_tb_oderdetail_temp_table', 48),
(64, '2024_12_04_103816_add_order_type_to_tb_order_table', 49);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_address_users`
--

CREATE TABLE `tb_address_users` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_detail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_address_users`
--

INSERT INTO `tb_address_users` (`id`, `user_id`, `address`, `address_detail`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 9, 'Hoàng Mai, Hà Nội', 'phố Linh Đàm', 0, NULL, NULL),
(2, 9, 'Từ Liêm, Hà Nội', 'Bắc Từ Liêm', 0, NULL, NULL),
(3, 5, 'Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'Thôn 3 - Bằng Trù', 0, '2024-12-02 21:46:28', '2024-12-02 21:46:28');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_brands`
--

CREATE TABLE `tb_brands` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_brands`
--

INSERT INTO `tb_brands` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Loreal', NULL, NULL),
(2, 'Lemonade', NULL, NULL),
(3, 'Cocoon', NULL, NULL),
(4, 'Peripera', NULL, NULL),
(6, 'Garnie', NULL, NULL),
(7, 'La Roche-Posay', NULL, NULL),
(8, 'CLUB CLIO', '2024-11-29 11:56:29', '2024-11-29 11:56:29'),
(9, 'OHUI', '2024-12-09 03:06:53', '2024-12-09 03:06:53');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_carts`
--

CREATE TABLE `tb_carts` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `tb_product_id` bigint UNSIGNED NOT NULL,
  `quantity` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `tb_variant_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_carts`
--

INSERT INTO `tb_carts` (`id`, `user_id`, `tb_product_id`, `quantity`, `created_at`, `updated_at`, `tb_variant_id`) VALUES
(174, 6, 246, 3, '2024-12-10 00:28:14', '2024-12-10 00:28:14', 261),
(175, 6, 246, 1, '2024-12-10 00:28:17', '2024-12-10 00:28:17', 262),
(176, 6, 246, 1, '2024-12-10 00:28:23', '2024-12-10 00:28:23', 263),
(177, 6, 246, 1, '2024-12-10 00:28:27', '2024-12-10 00:28:27', 264),
(178, 6, 248, 1, '2024-12-10 00:28:40', '2024-12-10 00:28:40', 268),
(179, 6, 248, 1, '2024-12-10 00:28:44', '2024-12-10 00:28:44', 269),
(180, 6, 248, 1, '2024-12-10 00:28:47', '2024-12-10 00:28:47', 270),
(181, 6, 250, 4, '2024-12-10 00:29:07', '2024-12-10 00:29:12', 274),
(182, 6, 250, 1, '2024-12-10 00:29:15', '2024-12-10 00:29:15', 276),
(183, 6, 249, 1, '2024-12-10 00:29:27', '2024-12-10 00:29:27', 271),
(184, 6, 249, 1, '2024-12-10 00:29:30', '2024-12-10 00:29:30', 272),
(185, 6, 249, 1, '2024-12-10 00:29:34', '2024-12-10 00:29:34', 273),
(186, 6, 253, 3, '2024-12-10 00:29:48', '2024-12-10 00:29:48', 281),
(187, 6, 253, 3, '2024-12-10 00:29:52', '2024-12-10 00:29:52', 282),
(188, 6, 252, 2, '2024-12-10 00:30:04', '2024-12-10 00:30:04', 279),
(189, 6, 252, 1, '2024-12-10 00:30:08', '2024-12-10 00:30:08', 280),
(190, 6, 258, 2, '2024-12-10 00:30:20', '2024-12-10 00:30:20', 287),
(191, 6, 257, 1, '2024-12-10 00:30:32', '2024-12-10 00:30:32', 286),
(192, 6, 255, 1, '2024-12-10 00:30:50', '2024-12-10 00:30:50', 283),
(193, 6, 251, 3, '2024-12-10 00:31:06', '2024-12-10 00:31:06', 277),
(194, 6, 251, 2, '2024-12-10 00:31:10', '2024-12-10 00:31:10', 278),
(195, 6, 256, 2, '2024-12-10 00:31:23', '2024-12-10 00:31:23', 284),
(196, 6, 256, 2, '2024-12-10 00:31:27', '2024-12-10 00:31:27', 285),
(197, 6, 260, 2, '2024-12-10 00:31:40', '2024-12-10 00:31:40', 290),
(198, 6, 260, 3, '2024-12-10 00:31:44', '2024-12-10 00:31:44', 291),
(199, 6, 261, 2, '2024-12-10 00:31:59', '2024-12-10 00:32:00', 292),
(200, 6, 259, 2, '2024-12-10 00:32:13', '2024-12-10 00:32:13', 289),
(201, 6, 262, 2, '2024-12-10 00:33:09', '2024-12-10 00:33:09', 293),
(202, 6, 263, 1, '2024-12-10 00:33:19', '2024-12-10 00:33:19', 294),
(203, 6, 264, 1, '2024-12-10 00:33:30', '2024-12-10 00:33:30', 295),
(204, 6, 266, 1, '2024-12-10 00:33:44', '2024-12-10 00:33:44', 298),
(205, 6, 266, 3, '2024-12-10 00:33:48', '2024-12-10 00:33:48', 299),
(206, 6, 265, 3, '2024-12-10 00:34:00', '2024-12-10 00:34:00', 296),
(207, 6, 265, 3, '2024-12-10 00:34:05', '2024-12-10 00:34:05', 297),
(208, 6, 267, 2, '2024-12-10 00:34:15', '2024-12-10 00:34:15', 300),
(209, 6, 268, 1, '2024-12-10 00:34:35', '2024-12-10 00:34:35', 301),
(210, 6, 273, 2, '2024-12-10 00:34:48', '2024-12-10 00:35:01', 311),
(211, 6, 274, 1, '2024-12-10 00:35:12', '2024-12-10 00:35:12', 313),
(212, 6, 274, 1, '2024-12-10 00:35:15', '2024-12-10 00:35:15', 314),
(213, 6, 272, 4, '2024-12-10 00:35:28', '2024-12-10 00:35:32', 309),
(214, 6, 269, 1, '2024-12-10 00:35:43', '2024-12-10 00:35:43', 302),
(215, 6, 269, 1, '2024-12-10 00:35:47', '2024-12-10 00:35:47', 303),
(216, 6, 269, 1, '2024-12-10 00:35:50', '2024-12-10 00:35:50', 304),
(217, 6, 271, 3, '2024-12-10 00:36:03', '2024-12-10 00:36:03', 307),
(218, 6, 271, 2, '2024-12-10 00:36:07', '2024-12-10 00:36:07', 308),
(219, 6, 275, 1, '2024-12-10 00:36:18', '2024-12-10 00:36:18', 315),
(220, 6, 270, 3, '2024-12-10 00:36:32', '2024-12-10 00:36:32', 305),
(221, 6, 270, 3, '2024-12-10 00:36:36', '2024-12-10 00:36:36', 306),
(222, 6, 277, 1, '2024-12-10 00:36:49', '2024-12-10 00:36:49', 318),
(223, 6, 277, 1, '2024-12-10 00:36:52', '2024-12-10 00:36:52', 319),
(224, 6, 277, 1, '2024-12-10 00:36:56', '2024-12-10 00:36:56', 320),
(225, 6, 276, 3, '2024-12-10 00:37:09', '2024-12-10 00:37:09', 316),
(226, 6, 276, 2, '2024-12-10 00:37:12', '2024-12-10 00:37:12', 317),
(227, 6, 278, 1, '2024-12-10 00:37:23', '2024-12-10 00:37:23', 321),
(228, 6, 278, 1, '2024-12-10 00:37:29', '2024-12-10 00:37:29', 322),
(229, 6, 279, 3, '2024-12-10 00:37:43', '2024-12-10 00:37:43', 323),
(230, 6, 279, 3, '2024-12-10 00:37:55', '2024-12-10 00:37:55', 324);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_categories`
--

CREATE TABLE `tb_categories` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_categories`
--

INSERT INTO `tb_categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Son', NULL, NULL),
(2, 'Nước tẩy trang', NULL, NULL),
(3, 'Serum', NULL, NULL),
(5, 'Tonner', NULL, NULL),
(17, 'Cusion', '2024-12-09 03:03:28', '2024-12-09 03:03:28'),
(18, 'Má hồng', '2024-12-09 03:04:02', '2024-12-09 03:04:02');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_colors`
--

CREATE TABLE `tb_colors` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_colors`
--

INSERT INTO `tb_colors` (`id`, `name`, `created_at`, `updated_at`) VALUES
(25, '01- Da trắng, sáng', '2024-12-09 03:07:52', '2024-12-09 03:07:52'),
(26, '02- Da trung bình', '2024-12-09 03:08:09', '2024-12-09 03:08:09'),
(27, '03- Da ngăm, nâu', '2024-12-09 03:08:34', '2024-12-09 03:08:34'),
(28, '06 Cherry Smoothie - hồng mận', '2024-12-09 03:17:36', '2024-12-09 03:17:36'),
(29, '05 Berry Coke - hồng baby', '2024-12-09 03:17:51', '2024-12-09 03:17:51'),
(30, '03 Grapefruit - hồng pha đỏ', '2024-12-09 03:18:05', '2024-12-09 03:18:05'),
(31, '01 Peach Fondue - cam đào', '2024-12-09 03:18:17', '2024-12-09 03:18:17'),
(32, '01 Warm-Bassador - Cam bí đỏ', '2024-12-09 03:29:49', '2024-12-09 03:29:49'),
(33, '02 Cool Starter - Hồng Cam', '2024-12-09 03:30:34', '2024-12-09 03:30:34'),
(34, '03 Pink Check - Hồng phớt baby', '2024-12-09 03:30:53', '2024-12-09 03:30:53'),
(35, '03 - Poinsettia Cranberry', '2024-12-09 03:45:32', '2024-12-09 03:45:32'),
(36, '04 - Cinnamon Apple', '2024-12-09 03:45:47', '2024-12-09 03:45:47'),
(37, '01.YOUR CRUSH', '2024-12-09 03:46:06', '2024-12-09 03:46:06'),
(38, 'Coral', '2024-12-09 03:56:03', '2024-12-09 03:56:03'),
(39, 'Red', '2024-12-09 03:56:14', '2024-12-09 03:56:14'),
(40, 'Mood Rose', '2024-12-09 03:56:31', '2024-12-09 03:56:31'),
(41, '11 Plum Macaron', '2024-12-09 04:03:45', '2024-12-09 04:03:45'),
(42, '07 Raspberry Chiffon Souffle', '2024-12-09 04:03:57', '2024-12-09 04:03:57'),
(43, '10 Fig Millefeuille', '2024-12-09 04:04:25', '2024-12-09 04:04:25'),
(44, 'cs01 Pure Fit', '2024-12-09 05:24:12', '2024-12-09 05:24:12'),
(45, '02 Ivory Fit', '2024-12-09 05:24:27', '2024-12-09 05:24:27'),
(46, '03 Natural Fit', '2024-12-09 05:24:38', '2024-12-09 05:24:38'),
(47, '01 ivory', '2024-12-09 05:29:58', '2024-12-09 05:29:58'),
(48, '02 Natural', '2024-12-09 05:30:06', '2024-12-09 05:30:06'),
(49, '003 LINEN - Da trung bình sáng (tông ấm beige yellow)', '2024-12-09 05:34:02', '2024-12-09 05:34:02'),
(50, '004 GINGER - Da trung bình', '2024-12-09 05:34:11', '2024-12-09 05:34:11'),
(51, '01-Light', '2024-12-09 05:51:10', '2024-12-09 05:51:10'),
(52, '02-medium light', '2024-12-09 05:51:29', '2024-12-09 05:51:29'),
(53, '01 Candy Pink - (hồng nhạt) & (xanh nhạt)', '2024-12-09 06:08:16', '2024-12-09 06:08:16'),
(54, '02 Fluffy Peach - (tím nhạt) & (cam đào nhạt)', '2024-12-09 06:08:28', '2024-12-09 06:08:28'),
(55, '11 Picnic Pink', '2024-12-09 06:14:22', '2024-12-09 06:14:22'),
(56, '19 Enjoy Coral', '2024-12-09 06:14:39', '2024-12-09 06:14:39'),
(57, '18 Shy Coral', '2024-12-09 06:14:52', '2024-12-09 06:14:52'),
(58, '01 Lucky - Hồng tím sữa', '2024-12-09 06:18:45', '2024-12-09 06:18:45'),
(59, '02 Cherish - Cam sữa', '2024-12-09 06:18:54', '2024-12-09 06:18:54');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_comments`
--

CREATE TABLE `tb_comments` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `tb_product_id` bigint UNSIGNED NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` tinyint UNSIGNED NOT NULL,
  `parent_id` bigint UNSIGNED DEFAULT NULL,
  `post_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_contacts`
--

CREATE TABLE `tb_contacts` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_contacts`
--

INSERT INTO `tb_contacts` (`id`, `user_id`, `name`, `phone`, `email`, `content`, `status`, `created_at`, `updated_at`) VALUES
(2, 6, 'yen', '02374732', 'yu@gmail.com', 'dfgẻw', 'new', NULL, NULL),
(3, 8, 'yen', '02374732', 'yu@gmail.com', 'dfgseyetuytiẻw', 'new', '2024-11-17 04:34:09', '2024-11-17 04:48:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_discounts`
--

CREATE TABLE `tb_discounts` (
  `id` bigint UNSIGNED NOT NULL,
  `discount_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_value` int NOT NULL,
  `quantity` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `max_price` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_day` date NOT NULL,
  `end_day` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_discounts`
--

INSERT INTO `tb_discounts` (`id`, `discount_code`, `discount_value`, `quantity`, `max_price`, `name`, `start_day`, `end_day`, `created_at`, `updated_at`) VALUES
(1, 'linhtess', 10, '5', '1000000', 'test', '2024-11-13', '2024-12-31', NULL, '2024-11-21 04:10:56'),
(2, 'test', 15, '5', '500000', 'duylinh', '2024-11-13', '2024-12-31', NULL, '2024-11-21 04:11:25');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_images`
--

CREATE TABLE `tb_images` (
  `id` bigint UNSIGNED NOT NULL,
  `tb_variant_id` bigint UNSIGNED NOT NULL,
  `name_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_images`
--

INSERT INTO `tb_images` (`id`, `tb_variant_id`, `name_image`, `created_at`, `updated_at`) VALUES
(144, 261, 'images/Mrm20S7UX5zYQSNLQx86ebg3DkGZIXLwo17ED5x1.webp', '2024-12-09 03:23:02', '2024-12-09 03:23:02'),
(145, 262, 'images/sT2njw3n34e4Vr76qHbxEFNl1wrSYaHzZfQLQfm6.webp', '2024-12-09 03:23:02', '2024-12-09 03:23:02'),
(146, 263, 'images/sdP0zqAn1PPWEFRCkGSv3UZlgCT3kKaEp5os3MUl.webp', '2024-12-09 03:23:02', '2024-12-09 03:23:02'),
(147, 264, 'images/plPp2kgMOJuxkRIUfezdKOw7n7cEPrjG4LNI3IYL.webp', '2024-12-09 03:23:02', '2024-12-09 03:23:02'),
(148, 265, 'images/IA6ts8ufvrMvgsP1K193bHUByAH1cBISZrQWR5Qa.webp', '2024-12-09 03:37:55', '2024-12-09 03:37:55'),
(149, 266, 'images/qOjy95KSP6tdXynezrxgqBVaPkrNSOAQ17tnBHlv.webp', '2024-12-09 03:37:55', '2024-12-09 03:37:55'),
(150, 267, 'images/vJ2XfY4eHfU0D4IacTYgnHnQ915cfNKYIXSHi6ux.webp', '2024-12-09 03:37:55', '2024-12-09 03:37:55'),
(151, 268, 'images/hT9Exwr1KfloniflDgD5xSC6xdDBHRUq6nAQVrEi.jpg', '2024-12-09 03:54:55', '2024-12-09 03:54:55'),
(152, 269, 'images/u0mtB0TrRxjJjp7F5Zhy2j77pM0WO6MkggpqVnQB.png', '2024-12-09 03:54:55', '2024-12-09 03:54:55'),
(153, 270, 'images/J3VHwU6amtlnz4Ms0ETlHvDhSV5FM8HiObu4sQmq.png', '2024-12-09 03:54:55', '2024-12-09 03:54:55'),
(154, 271, 'images/0JiGntHCv5ffbf68ROim6PZmz5PO4FAoujKYamMl.webp', '2024-12-09 04:00:41', '2024-12-09 04:00:41'),
(155, 272, 'images/dOQBESLW5Ijov2FGe68DRHAHANCNNzUlFdCk5AEp.webp', '2024-12-09 04:00:41', '2024-12-09 04:00:41'),
(156, 273, 'images/OnEan5oytswEF60QTCraMtAyFOyWT03ekpDap6x8.webp', '2024-12-09 04:00:41', '2024-12-09 04:00:41'),
(157, 274, 'images/a8NHejr14JkCTsOuaxhyEGDx18uQXIs72i72Xair.webp', '2024-12-09 04:08:36', '2024-12-09 04:08:36'),
(158, 275, 'images/KPgvprwnyTWVU5cSIoi7aYKiFuvBWVCFC8aaKL0v.webp', '2024-12-09 04:08:36', '2024-12-09 04:08:36'),
(159, 276, 'images/3YJaZEQWlcOIKNWdt8iXPpQ3xURATfMPsUUXgwXM.webp', '2024-12-09 04:08:36', '2024-12-09 04:08:36'),
(160, 277, 'images/q3BTNmvAeleWW08O3cpArQiFf6QpCoEmJXBQlfdQ.webp', '2024-12-09 04:14:09', '2024-12-09 04:14:09'),
(161, 278, 'images/vF4W6vlQlrX6G9BGPrFr0xbjqLeuKylDrZCz0Prx.webp', '2024-12-09 04:14:09', '2024-12-09 04:14:09'),
(162, 279, 'images/bIPaCdTcbK6QRfimSA8nosJlqbk0i7AP9mCaig50.jpg', '2024-12-09 04:19:49', '2024-12-09 04:19:49'),
(163, 280, 'images/U0aZ2JlF6UtofOk2yuWgSNzQnAWApuKErN9E1EYX.jpg', '2024-12-09 04:19:49', '2024-12-09 04:19:49'),
(164, 281, 'images/4JYOAHZ3BI2GFjaGl2m9VuK4LWXuwsWhAVqpDWyy.jpg', '2024-12-09 04:23:37', '2024-12-09 04:23:37'),
(165, 282, 'images/ClLyhPiZh9n4Cd9ACKsaJtdGusNK96I0AGyDJBkI.jpg', '2024-12-09 04:23:37', '2024-12-09 04:23:37'),
(166, 283, 'images/RSr4KEU9XTmKrx45cszVzoCTwOhwjKyHCOQrKCUl.jpg', '2024-12-09 04:30:15', '2024-12-09 04:30:15'),
(167, 284, 'images/6t2kzmUB5I2I43HS4AOOUb9MBwatgUqfBth6TSLL.webp', '2024-12-09 04:36:18', '2024-12-09 04:36:18'),
(168, 285, 'images/LwEMbFBwm3733v4dHZOOBXjodYq94ZEHZ1vJx3vS.webp', '2024-12-09 04:36:18', '2024-12-09 04:36:18'),
(169, 286, 'images/MNQE6uY65rFXigMimEm7AR3MrNBfYQlR2MoOLvqY.webp', '2024-12-09 04:40:42', '2024-12-09 04:40:42'),
(170, 287, 'images/D6DgmsX2LUN0HepH3hP2u0tihTi688N8vauka95R.webp', '2024-12-09 04:46:26', '2024-12-09 04:46:26'),
(171, 288, 'images/oCSGSvUbd3xwumfe54M7RWjG0VBzCU3s0JJZtGnU.webp', '2024-12-09 04:46:26', '2024-12-09 04:46:26'),
(172, 289, 'images/51tnGogNrE8v2plyXGbl2AS3Oa46EX13oYnrWq3Z.webp', '2024-12-09 04:49:41', '2024-12-09 04:49:41'),
(173, 290, 'images/G5YdlXxDxgHo1PUcco1kylnpamX7q330JyWeEfDW.webp', '2024-12-09 04:55:20', '2024-12-09 04:55:20'),
(174, 291, 'images/WNpYmLwwsaRXXiqa5t38OL9MkURvZOT6VHrZyzy6.png', '2024-12-09 04:55:20', '2024-12-09 04:55:20'),
(175, 292, 'images/w3PLUBj3j8sXbJr4Fq7DiQPa3RNmRGjlaz02WsI3.webp', '2024-12-09 04:57:33', '2024-12-09 04:57:33'),
(176, 293, 'images/wuInISFMnel4WFDir7xHMMcoLkFSjGjy4cZsmifX.webp', '2024-12-09 04:59:59', '2024-12-09 04:59:59'),
(177, 294, 'images/qcu0IggEkpUStkddy0ObvWwnh91eXGV0sYDLmuvH.png', '2024-12-09 05:05:32', '2024-12-09 05:05:32'),
(178, 295, 'images/usY1CetyVPTT9wRUmtoiZZQwDvODUh51qjx1NkpF.webp', '2024-12-09 05:08:27', '2024-12-09 05:08:27'),
(179, 296, 'images/Jkp28xUsjEBqka4rnvE59vdey3AiaEmqXNvlbSrE.webp', '2024-12-09 05:13:10', '2024-12-09 05:13:10'),
(180, 297, 'images/uosJOyGxBIEaF8oGcM3OUPWEwJHJqAS58YygjVji.webp', '2024-12-09 05:13:10', '2024-12-09 05:13:10'),
(181, 298, 'images/3bJCUWrUQT7nzD6qzuErkRRctlRUdm1vM8aCAOZW.webp', '2024-12-09 05:16:31', '2024-12-09 05:16:31'),
(182, 299, 'images/Mz74DaLa2mG9yGv1TX0kLoGQZdFuj7Py4f8rxujW.webp', '2024-12-09 05:16:31', '2024-12-09 05:16:31'),
(183, 300, 'images/1mpPsWRqDuHiM2G2LSlOkv50ITUcoyRiVoRXhaRm.webp', '2024-12-09 05:18:43', '2024-12-09 05:18:43'),
(184, 300, 'images/SAVuD8QbgNyM4Ypx92kds5zNQ4J7ZOXG7Vodou6F.webp', '2024-12-09 05:18:43', '2024-12-09 05:18:43'),
(185, 301, 'images/hucnWK2QhMOgcJNZ7hqwxjtZnHa6O3US3WyPYM80.webp', '2024-12-09 05:21:38', '2024-12-09 05:21:38'),
(186, 302, 'images/s52xkHynNgxI9H9Tg12KWOg8VJQxVqmXk8O61Usx.webp', '2024-12-09 05:29:05', '2024-12-09 05:29:05'),
(187, 303, 'images/sjSot6t0dM3lSWACjqGv1It4PLvZzU1jL3qv6lpH.webp', '2024-12-09 05:29:05', '2024-12-09 05:29:05'),
(188, 304, 'images/NQx8sFIrSElYi96SZ2hKnOt6QfN1UP8hQogRolrg.webp', '2024-12-09 05:29:05', '2024-12-09 05:29:05'),
(189, 305, 'images/hCk9bsvuBzC7IH4hQqK7PDhtZHHnt9j0CgtVA660.webp', '2024-12-09 05:33:16', '2024-12-09 05:33:16'),
(190, 306, 'images/uGvwQcORtN2Ij6gk18tbs8hBwrjRi9aPqd4MIqL5.webp', '2024-12-09 05:33:16', '2024-12-09 05:33:16'),
(191, 307, 'images/xX2BZYFX669MmEUZiRpD1dgPXzlupS3HlsHACAQ7.webp', '2024-12-09 05:36:52', '2024-12-09 05:36:52'),
(192, 308, 'images/VpvoDvtqFArhxFXIZpvJjrSof6KX4Npk0p8OuqJH.webp', '2024-12-09 05:36:52', '2024-12-09 05:36:52'),
(193, 309, 'images/CWXW9qJKBIuwkgnQN9WwJvUffxmm7PqAuT5CKCyY.webp', '2024-12-09 05:40:45', '2024-12-09 05:40:45'),
(194, 310, 'images/OAw23bNHOULzPLqyg1pKzkX1HyQGcL5xuiazHrKU.webp', '2024-12-09 05:40:45', '2024-12-09 05:40:45'),
(195, 311, 'images/lW199Arbo5vhLsgEXX8DFgQ26RCmpdFyurWxcsQF.webp', '2024-12-09 05:47:43', '2024-12-09 05:47:43'),
(196, 312, 'images/wOHjkcO1bFzQQC6jEZWCdDtrBLIq5W7cYcY7a8Ng.webp', '2024-12-09 05:47:43', '2024-12-09 05:47:43'),
(197, 313, 'images/n0VadneGy2d86WHRIkBaenBPzSTDSlpq0W1NgDxK.webp', '2024-12-09 05:54:11', '2024-12-09 05:54:11'),
(198, 314, 'images/ze0K1MYVLavVVvb3ygajDRUt5RxaMc8UlSRYDu6R.webp', '2024-12-09 05:54:11', '2024-12-09 05:54:11'),
(199, 315, 'images/vpANaRIzBr400O0wZ6lemjdswTJmKgdTqwfUwT9B.webp', '2024-12-09 06:05:47', '2024-12-09 06:05:47'),
(200, 316, 'images/DCrV6yRgnj1M9sDk0dSs6lNSehnOMDFd24LCh1Uw.webp', '2024-12-09 06:13:04', '2024-12-09 06:13:04'),
(201, 317, 'images/HrvfDM6WlqRpsKHPCadOujzHcjI2lPGpv2WzDyvb.webp', '2024-12-09 06:13:04', '2024-12-09 06:13:04'),
(202, 318, 'images/sO0jqPXJ56bg71gmOvAAft0is6V5DL5axcJbeK3C.webp', '2024-12-09 06:18:02', '2024-12-09 06:18:02'),
(203, 319, 'images/o6JF8xEJqgJv15PTRjk8OtngrwSjEyLRR4gWNs26.webp', '2024-12-09 06:18:02', '2024-12-09 06:18:02'),
(204, 320, 'images/XyaaBVwqgxaQAZtF71MAEp5mdoebkIuDFpQzCi70.webp', '2024-12-09 06:18:02', '2024-12-09 06:18:02'),
(205, 321, 'images/3L9USzj8unnX2yR9DSxM2nACrKGl6MFTU0EI8jux.webp', '2024-12-09 06:21:01', '2024-12-09 06:21:01'),
(206, 322, 'images/6hRIC7acR4N1ZPiESfv3sJk1dPoPiUIMs2UB2nVK.webp', '2024-12-09 06:21:01', '2024-12-09 06:21:01'),
(207, 323, 'images/4qRZivvJisI9rug3BBfrRJ7PotrttCw389jdBwWb.jpg', '2024-12-09 06:24:53', '2024-12-09 06:24:53'),
(208, 324, 'images/OPi3KHGenm7Nc1NurDy1TatDa4a2rwfNrpeW95RV.webp', '2024-12-09 06:24:53', '2024-12-09 06:24:53');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_logo_banner`
--

CREATE TABLE `tb_logo_banner` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_logo_banner`
--

INSERT INTO `tb_logo_banner` (`id`, `name`, `image`, `created_at`, `updated_at`) VALUES
(1, 'logo', 'https://picsum.photos/200/300', '2024-10-17 13:56:37', NULL),
(2, 'banner', 'https://picsum.photos/200/300', '2024-10-17 13:56:37', NULL),
(3, 'banner', 'https://picsum.photos/200/300', '2024-10-17 13:57:13', NULL),
(4, 'banner', 'https://picsum.photos/200/300', '2024-10-17 13:57:13', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_news`
--

CREATE TABLE `tb_news` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_day` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_news`
--

INSERT INTO `tb_news` (`id`, `title`, `content`, `create_day`, `created_at`, `updated_at`, `image`) VALUES
(2, 'Uống nước để giảm cân: Có thể hay không?', 'Nước đóng vai trò vô cùng quan trọng đối với mọi hoạt động của con người. Một trong số những công dụng của nước có thể bạn chưa biết đó chính là nước cũng có thể giúp giảm cân. Cùng chúng tôi tìm hiểu những lợi ích của việc uống nước dành cho giảm cân thông qua bài viết dưới đây.', '2024-11-12', '2024-11-12 07:14:52', '2024-11-12 07:14:52', '');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_oderdetail_temp`
--

CREATE TABLE `tb_oderdetail_temp` (
  `id` bigint UNSIGNED NOT NULL,
  `tb_oder_temp_id` bigint UNSIGNED NOT NULL,
  `tb_product_id` bigint UNSIGNED NOT NULL,
  `is_reviewed` tinyint(1) NOT NULL DEFAULT '0',
  `tb_variant_id` bigint UNSIGNED NOT NULL,
  `quantity` int NOT NULL,
  `price` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_oderdetail_temp`
--

INSERT INTO `tb_oderdetail_temp` (`id`, `tb_oder_temp_id`, `tb_product_id`, `is_reviewed`, `tb_variant_id`, `quantity`, `price`, `created_at`, `updated_at`) VALUES
(74, 68, 248, 0, 269, 1, 239000, '2024-12-10 00:11:24', '2024-12-10 00:11:24'),
(76, 70, 248, 0, 270, 1, 210000, '2024-12-10 00:12:21', '2024-12-10 00:12:21'),
(89, 77, 259, 0, 289, 2, 349000, '2024-12-10 00:32:18', '2024-12-10 00:32:18'),
(95, 83, 266, 0, 298, 1, 175000, '2024-12-10 01:17:32', '2024-12-10 01:17:32');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_oders`
--

CREATE TABLE `tb_oders` (
  `id` bigint UNSIGNED NOT NULL,
  `order_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `tb_discount_id` bigint UNSIGNED DEFAULT NULL,
  `order_date` date NOT NULL,
  `total_amount` int DEFAULT NULL,
  `order_status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `feedback` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_oders`
--

INSERT INTO `tb_oders` (`id`, `order_code`, `user_id`, `tb_discount_id`, `order_date`, `total_amount`, `order_status`, `order_type`, `delivered_at`, `feedback`, `name`, `phone`, `address`, `email`, `created_at`, `updated_at`) VALUES
(382, 'ORD-382', 6, NULL, '2024-12-10', 1870000, 'Chờ xử lý', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-09-05 17:00:00', '2024-12-10 00:08:52'),
(383, 'ORD-383', 6, NULL, '2024-12-10', 680000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-09-10 00:09:40', '2024-12-10 01:44:17'),
(384, 'ORD-384', 6, NULL, '2024-12-10', 850000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-09-15 00:09:49', '2024-12-10 00:19:29'),
(385, 'ORD-385', 6, 2, '2024-12-10', 152150, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-09-18 00:10:14', '2024-12-10 00:19:25'),
(386, 'ORD-386', 6, 1, '2024-12-10', 161100, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-09-22 00:10:35', '2024-12-10 00:19:21'),
(387, 'ORD-387', 6, 2, '2024-12-10', 608600, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-09-26 00:10:47', '2024-12-10 00:19:17'),
(388, 'ORD-388', 6, NULL, '2024-12-10', 179000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-09-30 00:10:57', '2024-12-10 00:19:13'),
(389, 'ORD-389', 6, 2, '2024-12-10', 812600, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-10-01 00:11:11', '2024-12-10 00:19:08'),
(390, 'ORD-OL69', 6, 1, '2024-12-10', 239000, 'Đã thanh toán', 'cart', NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-10-02 00:12:07', '2024-12-10 00:12:07'),
(391, 'ORD-391', 6, 2, '2024-12-10', 178500, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-10-06 00:12:29', '2024-12-10 00:19:06'),
(392, 'ORD-OL71', 6, 1, '2024-12-10', 296650, 'Đã thanh toán', 'cart', NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-10-09 00:12:57', '2024-12-10 00:12:57'),
(393, 'ORD-393', 6, NULL, '2024-12-10', 349000, 'Đã hủy đơn hàng', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-10-13 00:13:07', '2024-12-10 00:19:02'),
(394, 'ORD-394', 6, 1, '2024-12-10', 1145700, 'Giao hàng thất bại', NULL, NULL, 'Do bão', 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-10-16 00:13:28', '2024-12-10 00:18:54'),
(395, 'ORD-OL72', 6, 1, '2024-12-10', 2044250, 'Đã thanh toán', 'cart', NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-10-25 00:14:06', '2024-12-10 00:14:06'),
(396, 'ORD-396', 6, 2, '2024-12-10', 2151350, 'Giao hàng thất bại', NULL, NULL, 'Do bão', 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-10-20 00:14:22', '2024-12-10 00:18:50'),
(397, 'ORD-397', 6, NULL, '2024-12-10', 1835000, 'Giao hàng thất bại', NULL, NULL, 'Do bão', 'linh1', '0352169486', 'Thôn 3 - Bằng Trù, ', 'linh@gmail.com', '2024-10-23 00:14:37', '2024-12-10 00:18:44'),
(398, 'ORD-398', 6, NULL, '2024-12-10', 1076000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-10-27 00:14:46', '2024-12-10 00:18:33'),
(399, 'ORD-OL73', 6, 1, '2024-12-10', 2500000, 'Chưa thanh toán', 'cart', NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-10-31 00:15:00', '2024-12-10 00:15:00'),
(400, 'ORD-OL74', 6, 1, '2024-12-10', 2787000, 'Chưa thanh toán', 'cart', NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-11-24 00:15:17', '2024-12-10 00:15:17'),
(401, 'ORD-401', 6, NULL, '2024-12-10', 590000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-11-30 00:15:43', '2024-12-10 00:18:30'),
(402, 'ORD-402', 6, NULL, '2024-12-10', 1047000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-11-09 00:15:51', '2024-12-10 00:18:24'),
(403, 'ORD-OL75', 6, 1, '2024-12-10', 7395000, 'Đã thanh toán', 'cart', NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-11-10 00:16:21', '2024-12-10 00:16:21'),
(404, 'ORD-404', 6, NULL, '2024-12-10', 4800000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-11-01 00:16:31', '2024-12-10 00:18:19'),
(405, 'ORD-405', 6, NULL, '2024-12-10', 765000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-11-19 00:16:40', '2024-12-10 00:18:13'),
(406, 'ORD-406', 6, 2, '2024-12-10', 6111500, 'Đã hủy đơn hàng', NULL, NULL, 'không muốn mua nữa', 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-11-26 00:16:51', '2024-12-10 00:17:56'),
(407, 'ORD-407', 6, NULL, '2024-12-10', 1365000, 'Đã hủy đơn hàng', NULL, NULL, 'không muốn mua nữa', 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-04 00:17:02', '2024-12-10 00:17:46'),
(408, 'ORD-OL76', 6, 1, '2024-12-10', 585000, 'Chưa thanh toán', 'cart', NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-01 00:17:15', '2024-12-10 00:17:15'),
(409, 'ORD-409', 6, NULL, '2024-12-10', 510000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-10 00:28:03', '2024-12-10 01:44:14'),
(410, 'ORD-410', 6, NULL, '2024-12-10', 179000, 'Giao hàng thất bại', NULL, NULL, 'Do boom hàng', 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-10 00:28:32', '2024-12-10 01:44:00'),
(411, 'ORD-411', 6, NULL, '2024-12-10', 210000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-10 00:28:52', '2024-12-10 00:40:57'),
(412, 'ORD-412', 6, NULL, '2024-12-10', 349000, 'Đã hủy đơn hàng', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-01 00:29:19', '2024-12-10 00:40:49'),
(413, 'ORD-413', 6, NULL, '2024-12-10', 950000, 'Đã hủy đơn hàng', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-02 00:29:38', '2024-12-10 00:40:45'),
(414, 'ORD-414', 6, NULL, '2024-12-10', 567000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-03 00:29:56', '2024-12-10 00:40:39'),
(415, 'ORD-415', 6, NULL, '2024-12-10', 220000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-04 00:30:13', '2024-12-10 00:40:35'),
(416, 'ORD-416', 6, NULL, '2024-12-10', 183000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-05 00:30:26', '2024-12-10 00:40:31'),
(417, 'ORD-417', 6, NULL, '2024-12-10', 269000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-06 00:30:38', '2024-12-10 00:40:26'),
(418, 'ORD-418', 6, NULL, '2024-12-10', 295000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-07 00:30:54', '2024-12-10 00:40:23'),
(419, 'ORD-419', 6, NULL, '2024-12-10', 1040000, 'Giao hàng thất bại', NULL, NULL, 'do bão', 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-08 00:31:14', '2024-12-10 00:40:19'),
(420, 'ORD-420', 6, NULL, '2024-12-10', 1050000, 'Giao hàng thất bại', NULL, NULL, 'do bão', 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-09 00:31:31', '2024-12-10 00:40:15'),
(421, 'ORD-421', 6, 1, '2024-12-10', 1497000, 'Giao hàng thất bại', NULL, NULL, 'do bão', 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-09 00:31:51', '2024-12-10 00:40:11'),
(422, 'ORD-422', 6, 1, '2024-12-10', 590000, 'Giao hàng thất bại', NULL, NULL, 'do bão', 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-07 00:32:05', '2024-12-10 00:40:06'),
(423, 'ORD-423', 6, NULL, '2024-12-10', 698000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-08 00:32:25', '2024-12-10 00:39:57'),
(424, 'ORD-OL78', 6, NULL, '2024-12-10', 349000, 'Đã thanh toán', 'quick', NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-04 00:32:57', '2024-12-10 00:32:57'),
(425, 'ORD-425', 6, NULL, '2024-12-10', 2600000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-03 00:33:13', '2024-12-10 00:39:55'),
(426, 'ORD-426', 6, NULL, '2024-12-10', 1600000, 'Đã hủy đơn hàng', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-02 00:33:23', '2024-12-10 00:39:52'),
(427, 'ORD-427', 6, NULL, '2024-12-10', 1600000, 'Đã hủy đơn hàng', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-01 00:33:34', '2024-12-10 00:39:48'),
(428, 'ORD-428', 6, NULL, '2024-12-10', 885000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-06 00:33:52', '2024-12-10 00:39:37'),
(429, 'ORD-429', 6, NULL, '2024-12-10', 885000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-06 00:34:08', '2024-12-10 00:39:33'),
(430, 'ORD-430', 6, NULL, '2024-12-10', 910000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-10 00:34:19', '2024-12-10 00:39:30'),
(431, 'ORD-431', 6, NULL, '2024-12-10', 455000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-05 00:34:27', '2024-12-10 00:39:26'),
(432, 'ORD-432', 6, NULL, '2024-12-10', 2200000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-01 00:34:38', '2024-12-10 00:39:21'),
(433, 'ORD-433', 6, NULL, '2024-12-10', 314000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-11-05 00:34:51', '2024-12-10 00:39:15'),
(434, 'ORD-434', 6, NULL, '2024-12-10', 314000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-11-18 00:35:05', '2024-12-10 00:39:10'),
(435, 'ORD-435', 6, 2, '2024-12-10', 323000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-11-24 00:35:21', '2024-12-10 00:39:07'),
(436, 'ORD-436', 6, NULL, '2024-12-10', 898000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-11-29 00:35:36', '2024-12-10 00:39:03'),
(437, 'ORD-437', 6, NULL, '2024-12-10', 468000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-11-19 00:35:54', '2024-12-10 00:38:58'),
(438, 'ORD-438', 6, NULL, '2024-12-10', 998000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-11-02 00:36:10', '2024-12-10 00:38:55'),
(439, 'ORD-439', 6, NULL, '2024-12-10', 2000000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-10-02 00:36:22', '2024-12-10 00:38:51'),
(440, 'ORD-440', 6, NULL, '2024-12-10', 3900000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-10-20 00:36:40', '2024-12-10 00:38:48'),
(441, 'ORD-441', 6, NULL, '2024-12-10', 139000, 'Đã hoàn thành', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-10-18 00:36:59', '2024-12-10 00:38:41'),
(442, 'ORD-442', 6, NULL, '2024-12-10', 336000, 'Giao hàng thất bại', NULL, NULL, 'do mưa', 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-09-11 00:37:16', '2024-12-10 00:38:38'),
(443, 'ORD-443', 6, NULL, '2024-12-10', 215000, 'Giao hàng thất bại', NULL, NULL, 'do mưa', 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-09-06 00:37:33', '2024-12-10 00:38:33'),
(444, 'ORD-444', 6, NULL, '2024-12-10', 1377000, 'Đã hủy đơn hàng', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-09-05 00:37:46', '2024-12-10 00:38:24'),
(445, 'ORD-445', 6, NULL, '2024-12-10', 1377000, 'Đã hủy đơn hàng', NULL, NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-09-01 00:37:59', '2024-12-10 00:38:17'),
(446, 'ORD-446', 1, NULL, '2024-12-10', 110000, 'Giao hàng thất bại', NULL, NULL, 'Do boom hàng', 'duylinh chất', '0352168486', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Đông Anh, Xã Dục Tú', 'hpking2020@gmail.com', '2024-12-10 00:58:04', '2024-12-10 01:43:56'),
(447, 'ORD-OL79', 1, NULL, '2024-12-10', 449000, 'Đã thanh toán', 'quick', NULL, NULL, 'Nguyễn Duy Linh', '0352168486', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Mê Linh, Xã Tiến Thịnh', 'hpking2020@gmail.com', '2024-12-10 00:58:57', '2024-12-10 00:58:57'),
(448, 'ORD-OL80', 1, NULL, '2024-12-10', 468000, 'Đã thanh toán', 'quick', NULL, NULL, 'Nguyễn Duy Linh', '0352168486', ', Thành phố Hà Nội, Quận Cầu Giấy, Phường Nghĩa Tân', 'hpking2020@gmail.com', '2024-12-10 01:03:31', '2024-12-10 01:03:31'),
(449, 'ORD-449', 1, NULL, '2024-12-10', 110000, 'Giao hàng thất bại', NULL, NULL, 'Do boom hàng', 'Nguyễn Duy Linh', '0352168486', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Quận Nam Từ Liêm, Phường Mỹ Đình 1', 'hpking2020@gmail.com', '2024-12-10 01:12:08', '2024-12-10 01:43:51'),
(450, 'ORD-OL81', 1, NULL, '2024-12-10', 323000, 'Đã thanh toán', 'quick', NULL, NULL, 'Nguyễn Duy Linh', '0352168486', ', Thành phố Hà Nội, Quận Hoàng Mai, Phường Hoàng Liệt', 'hpking2020@gmail.com', '2024-12-10 01:15:21', '2024-12-10 01:15:21'),
(451, 'ORD-OL82', 1, NULL, '2024-12-10', 459000, 'Đã thanh toán', 'quick', NULL, NULL, 'Duy Linh Nguyễn', '0352168486', 'Thôn 3 - Bằng Trù, Tỉnh Cao Bằng, Huyện Bảo Lạc, Xã Thượng Hà', 'hpking2020@gmail.com', '2024-12-10 01:16:14', '2024-12-10 01:16:14'),
(452, 'ORD-452', 5, NULL, '2024-12-10', 308000, 'Đã hủy đơn hàng', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-12-10 01:36:14', '2024-12-10 01:43:39'),
(453, 'ORD-453', 5, 1, '2024-12-10', 906300, 'Đã hoàn thành', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-12-10 01:36:26', '2024-12-10 01:43:32'),
(454, 'ORD-OL84', 5, 1, '2024-12-10', 891900, 'Đã thanh toán', 'cart', NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-12-10 01:36:59', '2024-12-10 01:36:59'),
(455, 'ORD-455', 5, NULL, '2024-12-10', 957000, 'Đã hoàn thành', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-12-10 01:37:14', '2024-12-10 01:43:27'),
(456, 'ORD-456', 5, 2, '2024-12-10', 285600, 'Đã hoàn thành', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-12-10 01:37:25', '2024-12-10 01:43:19'),
(457, 'ORD-457', 5, NULL, '2024-12-10', 340000, 'Đã hoàn thành', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-12-10 01:37:32', '2024-12-10 01:43:24'),
(458, 'ORD-458', 5, NULL, '2024-12-10', 340000, 'Đã hoàn thành', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-12-10 01:37:38', '2024-12-10 01:44:20'),
(459, 'ORD-459', 5, 2, '2024-12-10', 2244000, 'Chờ xử lý', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-12-10 01:37:56', '2024-12-10 01:37:56'),
(460, 'ORD-OL85', 5, 1, '2024-12-10', 983000, 'Chưa thanh toán', 'cart', NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-12-10 01:38:12', '2024-12-10 01:38:12'),
(461, 'ORD-461', 5, 1, '2024-12-10', 673200, 'Chờ xử lý', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-12-10 01:38:27', '2024-12-10 01:38:27'),
(462, 'ORD-OL86', 5, 1, '2024-12-10', 1003000, 'Đã thanh toán', 'cart', NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-12-10 01:38:52', '2024-12-10 01:38:52'),
(463, 'ORD-463', 5, NULL, '2024-12-10', 1476000, 'Chờ xử lý', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-12-10 01:39:03', '2024-12-10 01:39:04'),
(464, 'ORD-OL87', 5, 1, '2024-12-10', 239000, 'Chưa thanh toán', 'cart', NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-12-10 01:39:15', '2024-12-10 01:39:15'),
(465, 'ORD-465', 5, NULL, '2024-12-10', 1390000, 'Đã hoàn thành', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-08-28 01:39:26', '2024-12-10 01:44:23'),
(466, 'ORD-466', 5, NULL, '2024-12-10', 1937000, 'Đã thanh toán', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-08-31 01:39:41', '2024-12-10 01:44:28'),
(467, 'ORD-467', 5, NULL, '2024-12-10', 2555000, 'Đã hoàn thành', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-08-26 01:39:52', '2024-12-10 01:44:33'),
(468, 'ORD-468', 5, NULL, '2024-12-10', 734000, 'Chờ xử lý', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-08-24 01:40:03', '2024-12-10 01:40:04'),
(469, 'ORD-469', 5, NULL, '2024-12-10', 349000, 'Đã hoàn thành', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-08-22 01:40:12', '2024-12-10 01:43:14'),
(470, 'ORD-470', 5, NULL, '2024-12-10', 3065000, 'Đã hoàn thành', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-08-18 01:40:22', '2024-12-10 01:43:10'),
(471, 'ORD-OL88', 5, 1, '2024-12-10', 3926000, 'Đã thanh toán', 'cart', NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-08-16 01:40:56', '2024-12-10 01:40:56'),
(472, 'ORD-472', 5, NULL, '2024-12-10', 449000, 'Đã hủy đơn hàng', NULL, NULL, 'Chán không muốn mua nữa', 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-08-14 01:41:06', '2024-12-10 01:42:37'),
(473, 'ORD-473', 5, NULL, '2024-12-10', 468000, 'Đã hoàn thành', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-08-04 01:41:15', '2024-12-10 01:43:07'),
(474, 'ORD-474', 5, NULL, '2024-12-10', 3208000, 'Đã hủy đơn hàng', NULL, NULL, 'Chán không muốn mua nữa', 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-12-10 01:41:29', '2024-12-10 01:42:29'),
(475, 'ORD-475', 5, NULL, '2024-12-10', 1965000, 'Đã hủy đơn hàng', NULL, NULL, 'Chán không muốn mua nữa', 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-08-08 01:41:38', '2024-12-10 01:42:20'),
(476, 'ORD-476', 5, NULL, '2024-12-10', 3250000, 'Đã hủy đơn hàng', NULL, NULL, 'Chán không muốn mua nữa', 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-08-01 01:41:49', '2024-12-10 01:42:13'),
(477, 'ORD-477', 5, NULL, '2024-12-10', 2200000, 'Đã hoàn thành', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-12-10 02:09:32', '2024-12-10 02:09:42'),
(478, 'ORD-478', 5, NULL, '2024-12-10', 3655000, 'Đã hoàn thành', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-12-10 07:10:31', '2024-12-10 07:10:43'),
(479, 'ORD-479', 5, NULL, '2024-12-10', 6885000, 'Đã hoàn thành', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-12-10 07:11:27', '2024-12-10 07:11:34'),
(480, 'ORD-480', 5, NULL, '2024-12-10', 4680000, 'Đã hoàn thành', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-12-10 07:12:30', '2024-12-10 07:13:38'),
(481, 'ORD-481', 5, NULL, '2024-12-10', 3493000, 'Đã hoàn thành', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-12-10 07:13:03', '2024-12-10 07:13:32'),
(482, 'ORD-482', 5, NULL, '2024-12-10', 3141000, 'Đã hoàn thành', NULL, NULL, NULL, 'Huy Phúc 2', '0767148666', 'Thôn 3 - Bằng Trù, Thành phố Hà Nội, Huyện Thạch Thất, Xã Hạ Bằng', 'hpking2020@gmail.com', '2024-12-10 07:13:19', '2024-12-10 07:13:28');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_oder_temps`
--

CREATE TABLE `tb_oder_temps` (
  `id` bigint UNSIGNED NOT NULL,
  `order_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `tb_discount_id` bigint UNSIGNED DEFAULT NULL,
  `order_date` date NOT NULL,
  `total_amount` int DEFAULT NULL,
  `order_status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `feedback` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_oder_temps`
--

INSERT INTO `tb_oder_temps` (`id`, `order_code`, `user_id`, `tb_discount_id`, `order_date`, `total_amount`, `order_status`, `order_type`, `delivered_at`, `feedback`, `name`, `phone`, `address`, `email`, `created_at`, `updated_at`) VALUES
(68, 'ORD-OL68', 6, 1, '2024-12-10', 239000, 'Chờ xử lý', 'cart', NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-10 00:11:24', '2024-12-10 00:11:24'),
(70, 'ORD-OL70', 6, 1, '2024-12-10', 210000, 'Chờ xử lý', 'cart', NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-10 00:12:21', '2024-12-10 00:12:21'),
(77, 'ORD-OL77', 6, NULL, '2024-12-10', 698000, 'Chờ xử lý', 'quick', NULL, NULL, 'linh1', '0352169486', ', ', 'linh@gmail.com', '2024-12-10 00:32:18', '2024-12-10 00:32:18'),
(83, 'ORD-OL83', 1, NULL, '2024-12-10', 175000, 'Chờ xử lý', 'quick', NULL, NULL, 'Nguyễn Duy Linh', '0352168486', ', Thành phố Hà Nội, Quận Bắc Từ Liêm, Phường Phú Diễn', 'linh@gmail.com', '2024-12-10 01:17:32', '2024-12-10 01:17:32');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_products`
--

CREATE TABLE `tb_products` (
  `id` bigint UNSIGNED NOT NULL,
  `tb_category_id` bigint UNSIGNED NOT NULL,
  `tb_brand_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_products`
--

INSERT INTO `tb_products` (`id`, `tb_category_id`, `tb_brand_id`, `name`, `status`, `description`, `created_at`, `updated_at`, `image`) VALUES
(246, 1, 4, 'Son Thỏi Bóng Peripera Heart Jam Glow Lip 1.4g', 'còn hàng', '**Son Thỏi Bóng Peripera Heart Jam Glow Lip 1.4g** là sản phẩm son môi đáng yêu và tinh tế từ thương hiệu Peripera nổi tiếng, mang đến hiệu ứng **bóng mềm mại và căng đầy sức sống** cho đôi môi bạn. Với kết cấu **mỏng nhẹ và dưỡng ẩm tự nhiên**, son không chỉ tạo lớp màu tươi sáng, rạng rỡ mà còn giữ cho môi mềm mịn và thoải mái suốt cả ngày.  \n\n**Heart Jam Glow Lip** sở hữu bảng màu đa dạng với các sắc hồng, cam và đỏ ngọt ngào, phù hợp với mọi phong cách và mọi hoàn cảnh. Với khả năng **cấp ẩm và giữ màu bền lâu**, son giúp đôi môi trông căng bóng, quyến rũ mà không bị khô hay lộ vân môi.  \n\nĐầu cọ thiết kế thông minh và dễ sử dụng, giúp bạn thoa son một cách dễ dàng và chính xác. Thiết kế xinh xắn, đáng yêu với hình trái tim độc đáo mang đến cảm giác trẻ trung và dễ thương cho mọi nàng.  \n\n**Peripera Heart Jam Glow Lip 1.4g** sẽ là lựa chọn tuyệt vời để tạo nên đôi môi căng mọng, mềm mịn và đầy sức sống trong mọi hoàn cảnh! 💖', '2024-12-09 03:23:02', '2024-12-09 03:23:02', 'products/WP9VHQ2wgIrAcAUH35R4RNGhFZSclET8J2wA5Xpj.webp'),
(247, 1, 4, 'Son Kem Peripera Mịn Lì Over Blur Tint 3.5g', 'còn hàng', '**Son Kem Peripera Mịn Lì Over Blur Tint 3.5g** là sản phẩm son môi nổi tiếng từ thương hiệu Peripera đình đám, mang đến hiệu ứng **mịn lì siêu mềm mại** và màu sắc rạng rỡ, quyến rũ. Với kết cấu **mỏng nhẹ, mềm mịn**, son kem này thẩm thấu nhanh và tạo lớp màu đều đẹp, không làm lộ vân môi, mang đến đôi môi căng đầy và tự nhiên.  \n\n**Over Blur Tint** sở hữu công thức độc quyền với khả năng **bám màu lâu trôi và giữ màu ổn định**, giúp bạn tự tin suốt cả ngày mà không lo lem hoặc phai màu. Sản phẩm có thể sử dụng như một lớp màu nhẹ nhàng tự nhiên hoặc hiệu ứng sắc màu đầy nổi bật tùy theo cách thoa.  \n\nVới thiết kế đầu cọ thông minh và dễ sử dụng, bạn dễ dàng kiểm soát lượng son và tạo kiểu môi theo ý muốn. Sản phẩm phù hợp với mọi phong cách trang điểm từ tự nhiên, nhẹ nhàng đến cá tính, nổi bật.  \n\n**Peripera Mịn Lì Over Blur Tint 3.5g** sẽ là người bạn đồng hành hoàn hảo, mang đến đôi môi mềm mịn, quyến rũ và tràn đầy sức sống mỗi ngày!', '2024-12-09 03:37:55', '2024-12-09 03:37:55', 'products/xxKCtjvSTpzmw3lalH2K55z6qfZSwyw0pABowcFd.webp'),
(248, 1, 2, 'SON TINT BÓNG KHÔNG DÍNH BỀN MÀU LEMONADE MIRROR MIRROR', 'còn hàng', '\nSon Tint Bóng Không Dính Bền Màu Lemonade Mirror Mirror là sản phẩm son môi tinh tế kết hợp hiệu ứng bóng nhẹ nhàng và độ bám màu lâu dài, mang đến đôi môi căng mọng, rạng rỡ cả ngày. Với kết cấu mỏng nhẹ, không dính, son tint dễ dàng thẩm thấu và tạo lớp màu tự nhiên, thoải mái mà không gây cảm giác nặng môi hay khó chịu.\n\nLemonade Mirror Mirror sở hữu bảng màu đa dạng, từ các tông màu nhẹ nhàng đến sắc cam, hồng, đỏ nổi bật, phù hợp với mọi phong cách trang điểm và hoàn cảnh khác nhau. Sản phẩm có khả năng bám màu bền lâu, không lem và không trôi trong suốt thời gian sử dụng, giữ cho đôi môi luôn tươi mới và cuốn hút.', '2024-12-09 03:54:55', '2024-12-09 03:54:55', 'products/ADfRYf7rKpVZYWTh5bxYAIiBhJ9yeYROJVGxDqTg.webp'),
(249, 1, 9, 'Son Lì Dưỡng Ẩm Ngăn Lão Hóa Ohui The First Geniture Lipstick 3.8g', 'còn hàng', 'Son Lì Dưỡng Ẩm Ngăn Lão Hóa Ohui The First Geniture Lipstick 3.8g là sản phẩm son môi cao cấp kết hợp hoàn hảo giữa dưỡng ẩm và hiệu ứng màu lì tinh tế, mang đến đôi môi mềm mịn, căng đầy sức sống. Với công thức độc quyền từ Ohui, sản phẩm chứa các thành phần chống lão hóa mạnh mẽ, giúp ngăn ngừa các dấu hiệu lão hóa sớm và giữ cho đôi môi luôn trẻ trung, rạng rỡ.\n\nSon có kết cấu mịn màng, dễ thoa, tạo lớp màu đều đẹp và lâu trôi, giúp bạn tự tin suốt cả ngày mà không lo bị khô môi. Với khả năng cung cấp độ ẩm tự nhiên, Ohui The First Geniture Lipstick không chỉ làm đẹp mà còn chăm sóc đôi môi từ bên trong, giữ cho làn môi luôn mềm mại và căng bóng.', '2024-12-09 04:00:41', '2024-12-09 04:00:41', 'products/Wr2tRJqPdB3UdxH6HGM5mTWFLVLV452NN7lgVWot.webp'),
(250, 1, 8, 'Son Thỏi Hiệu Ứng Mờ Clio Chiffon Mood Lip 3.2g', 'còn hàng', 'Son Thỏi Hiệu Ứng Mờ Clio Chiffon Mood Lip 3.2g là sản phẩm son môi đình đám đến từ thương hiệu Clio nổi tiếng, mang đến hiệu ứng lì mềm mại và tinh tế cho đôi môi của bạn. Với kết cấu mềm mịn và nhẹ nhàng, son thẩm thấu nhanh, tạo lớp màu đều đẹp mà không gây cảm giác khô môi.\n\nChiffon Mood Lip sở hữu bảng màu đa dạng, phù hợp với mọi phong cách và hoàn cảnh, từ tự nhiên, dịu dàng đến cá tính, nổi bật. Với khả năng giữ màu lâu trôi, son không bị lem, không phai màu và mang đến đôi môi căng mọng, rạng rỡ suốt cả ngày dài. Đầu cọ tiện lợi và thiết kế sang trọng, dễ sử dụng và phù hợp cho mọi nàng yêu thích sự tinh tế và nhẹ nhàng trong từng lần trang điểm.', '2024-12-09 04:08:36', '2024-12-09 04:08:36', 'products/qruEpdifVQP1iB7ePHTBKyHtnikOGeIk12Qk56Q8.webp'),
(251, 2, 7, 'Nước Làm Sạch & Tẩy Trang Cho Da Dầu La Roche-Posay Effaclar Micellar Water Ultra Oily Skin', 'còn hàng', '**Nước Làm Sạch & Tẩy Trang Cho Da Dầu La Roche-Posay Effaclar Micellar Water Ultra Oily Skin 400ml** là sản phẩm tẩy trang chuyên biệt được thiết kế dành riêng cho làn da dầu và da có xu hướng mụn. Với công thức độc quyền kết hợp công nghệ **Micellar Water**, sản phẩm giúp làm sạch sâu, loại bỏ hoàn toàn lớp trang điểm, bụi bẩn và dầu thừa mà không làm mất cân bằng độ ẩm tự nhiên của làn da.  \n\nĐược chiết xuất từ các thành phần an toàn, hiệu quả và không chứa cồn, **Effaclar Micellar Water Ultra Oily Skin** giúp kiểm soát dầu thừa, thu nhỏ lỗ chân lông và làm dịu làn da, ngăn ngừa tình trạng viêm mụn và kích ứng. Sản phẩm thẩm thấu nhanh, nhẹ nhàng, không nhờn rít và không cần rửa lại với nước sau khi dùng. Đây là giải pháp hoàn hảo giúp làn da bạn thông thoáng, sạch sẽ và kiểm soát dầu hiệu quả mỗi ngày.', '2024-12-09 04:14:09', '2024-12-09 04:14:09', 'products/bT6tviLeSRdToRk9LC97H3xQQjk2D0QBD2uKCRPz.webp'),
(252, 2, 6, 'Nước Tẩy Trang Làm Sạch Sâu Garnier Oil Infused Cleansing Water', 'còn hàng', '**Nước Tẩy Trang Làm Sạch Sâu Garnier Oil Infused Cleansing Water 400ml** là sản phẩm tẩy trang hiệu quả kết hợp công nghệ **2 trong 1** độc quyền, kết hợp dầu và nước để loại bỏ hoàn toàn lớp trang điểm, bụi bẩn và dầu thừa trên làn da. Với khả năng làm sạch mạnh mẽ nhưng vẫn dịu nhẹ, sản phẩm giúp bạn loại bỏ mọi lớp trang điểm cứng đầu như mascara, kem nền lâu trôi một cách nhanh chóng và dễ dàng.  \n\nSản phẩm chứa **dầu thiên nhiên nhẹ nhàng**, cung cấp độ ẩm cho làn da sau khi tẩy trang, ngăn tình trạng khô căng và giữ cho làn da mềm mại, mịn màng. **Garnier Oil Infused Cleansing Water** không cần rửa lại với nước sau khi sử dụng, tiện lợi và tiết kiệm thời gian, phù hợp với mọi loại da, đặc biệt là làn da khô và nhạy cảm. Với sản phẩm này, làn da của bạn sẽ luôn thông thoáng, sạch sẽ và tràn đầy sức sống mỗi ngày.', '2024-12-09 04:19:49', '2024-12-09 04:19:49', 'products/DVfg5KIO8lF7CIvXUKYQzM5ayUu8QcNF4Etzm3Rh.webp'),
(253, 2, 6, 'Nước Tẩy Trang Cho Da Nhạy Cảm Garnier Micellar Cleansing Water For Sensitive Skin', 'còn hàng', '**Nước Tẩy Trang Cho Da Nhạy Cảm Garnier Micellar Cleansing Water For Sensitive Skin 400ml** là sản phẩm tẩy trang dịu nhẹ, được thiết kế đặc biệt dành cho làn da nhạy cảm và dễ tổn thương. Với công thức **Micellar Technology** độc quyền, sản phẩm giúp loại bỏ hoàn toàn lớp trang điểm, bụi bẩn và dầu thừa một cách nhẹ nhàng mà không gây kích ứng.  \n\nĐược chiết xuất từ các thành phần an toàn và tự nhiên, nước tẩy trang này không chứa cồn, hương liệu hay hóa chất độc hại, mang lại cảm giác thoải mái và nhẹ nhàng sau khi sử dụng. Sản phẩm không cần rửa lại với nước, tiết kiệm thời gian và vô cùng tiện lợi. Với **Garnier Micellar Cleansing Water For Sensitive Skin**, làn da của bạn sẽ được làm sạch hoàn toàn, giữ độ ẩm và trở nên mềm mịn, thông thoáng mỗi ngày.', '2024-12-09 04:23:37', '2024-12-09 04:23:37', 'products/ZIowkCqNLhJh30Gp70OS8HSzDzRcxJ4MqamHeoDM.jpg'),
(255, 2, 3, 'Nước tẩy trang bí đao 500ml', 'còn hàng', '**Nước Tẩy Trang Bí Đao 500ml** là sản phẩm tẩy trang thiên nhiên an toàn và hiệu quả, giúp loại bỏ lớp trang điểm, bụi bẩn và dầu thừa một cách nhẹ nhàng. Chiết xuất **bí đao tự nhiên** cung cấp độ ẩm, làm dịu và cân bằng làn da sau mỗi lần sử dụng, mang lại làn da mềm mịn và thoáng sạch.  \n\nVới công thức an toàn và không chứa hóa chất độc hại, sản phẩm phù hợp với mọi loại da, đặc biệt là làn da nhạy cảm và dễ tổn thương. Nước tẩy trang có kết cấu lỏng nhẹ, thẩm thấu nhanh, không gây nhờn rít và không cần rửa lại với nước sau khi sử dụng. Với **Nước Tẩy Trang Bí Đao 500ml**, bạn sẽ có làn da sạch sẽ, thông thoáng và được cung cấp đủ độ ẩm mỗi ngày.', '2024-12-09 04:30:15', '2024-12-09 04:30:46', 'products/7ef1PeUQ4DmuIaW0jqJjZe0dT89VXAfRplVnbmEU.jpg'),
(256, 2, 7, 'Nước Làm Sạch & Tẩy Trang Cho Da Nhạy Cảm La Roche-Posay Micellar Water Ultra Sensitive Skin (0) 16 Xuất xứ: Pháp SKU: 11104108', 'còn hàng', 'Nước tẩy trang chứa nước khoáng La Roche-Posay, có tác dụng làm dịu và bảo vệ làn da khỏi các tác nhân gây hại từ môi trường. Sản phẩm không chứa cồn, paraben hay hương liệu, hoàn toàn an toàn và là lựa chọn lý tưởng cho làn da dễ tổn thương. Với kết cấu nhẹ nhàng, không cần rửa lại với nước, La Roche-Posay Micellar Water Ultra Sensitive Skin giúp da bạn luôn sạch sẽ, mềm mại và ẩm mịn ngay cả với những làn da nhạy cảm nhất. Sản phẩm xuất xứ từ Pháp, mang lại sự yên tâm về chất lượng và hiệu quả sử dụng.', '2024-12-09 04:36:18', '2024-12-09 04:36:18', 'products/mU9SLNGxsKF4kroMAok45O71jLJ6eD10pIWjJEf2.webp'),
(257, 2, 1, 'Nước Tẩy Trang Cấp Ẩm L\'Oreal Paris Revitalift Hyaluronic Acid Micellar Water 400Ml', 'còn hàng', '**Nước Tẩy Trang Cấp Ẩm L\'Oreal Paris Revitalift Hyaluronic Acid Micellar Water 400ml** là sản phẩm tẩy trang đa năng kết hợp khả năng làm sạch hiệu quả và cung cấp độ ẩm tuyệt đối cho làn da. Với công thức **Hyaluronic Acid** tinh khiết, sản phẩm không chỉ loại bỏ hoàn toàn lớp trang điểm, bụi bẩn và dầu thừa, mà còn giữ cho làn da mềm mịn, căng mướt sau mỗi lần sử dụng.  \n\nNước tẩy trang này có kết cấu nhẹ nhàng, không chứa cồn, không gây kích ứng, phù hợp với mọi loại da, đặc biệt là làn da nhạy cảm và da khô. Dễ dàng sử dụng và không cần rửa lại với nước, **L\'Oreal Paris Revitalift Hyaluronic Acid Micellar Water** sẽ giúp bạn có làn da sạch sẽ, thông thoáng và ẩm mịn, sẵn sàng cho các bước dưỡng da tiếp theo trong chu trình làm đẹp của mình.', '2024-12-09 04:40:42', '2024-12-09 04:40:42', 'products/A20jK2GCfYy23F9IG1bP9VKd55VwhP2st6ks1VuF.webp'),
(258, 2, 1, 'Nước tẩy trang L\'Oreal Micellar Water 3-in-1 Refreshing dành cho da nhạy cảm', 'còn hàng', '**Nước Tẩy Trang L\'Oreal Micellar Water 3-in-1 Refreshing Dành Cho Da Nhạy Cảm** là sản phẩm tẩy trang đa năng, nhẹ nhàng và hiệu quả, được thiết kế đặc biệt cho làn da nhạy cảm. Với công thức **3 trong 1**, sản phẩm không chỉ làm sạch lớp trang điểm và bụi bẩn tận sâu trong lỗ chân lông mà còn làm dịu da và cung cấp độ ẩm, mang lại làn da mềm mịn, thoáng sạch sau mỗi lần sử dụng.  \n\nChiết xuất từ các thành phần nhẹ nhàng và an toàn, nước tẩy trang không chứa hương liệu độc hại, không gây kích ứng, phù hợp hoàn hảo với làn da nhạy cảm và dễ tổn thương. Với kết cấu nước trong suốt, dễ sử dụng và không cần rửa lại với nước, **L\'Oreal Micellar Water 3-in-1 Refreshing** sẽ là bước làm sạch hiệu quả, giúp làn da bạn luôn tươi mới và sẵn sàng cho các bước dưỡng da tiếp theo.', '2024-12-09 04:46:26', '2024-12-09 04:46:26', 'products/cL21UawY9UZwzPECewa6yBL3O1OVOI9OcMUbmSoH.webp'),
(259, 3, 6, 'Tinh Chất Dưỡng Sáng Da Garnier Skin Naturals Bright Complete Anti - Acne Booster Serum 30Ml', 'còn hàng', '**Tinh Chất Dưỡng Sáng Da Garnier Skin Naturals Bright Complete Anti-Acne Booster Serum 30ml** là giải pháp hoàn hảo cho làn da xỉn màu, thâm nám và đang gặp vấn đề mụn. Với công thức độc quyền kết hợp **Vitamin C và chiết xuất thiên nhiên**, sản phẩm không chỉ làm sáng da hiệu quả mà còn giúp làm mờ thâm nám, tái tạo làn da đều màu và rạng rỡ tự nhiên. Đặc biệt, với công dụng **chống mụn và làm dịu làn da**, serum hỗ trợ ngăn ngừa mụn, làm se khít lỗ chân lông và cải thiện tình trạng viêm đỏ, mang lại làn da mềm mịn và khỏe mạnh. \n\nTinh chất có kết cấu mỏng nhẹ, dễ thẩm thấu, không gây nhờn rít, phù hợp với mọi loại da, kể cả làn da nhạy cảm nhất. Với **Garnier Bright Complete Anti-Acne Booster Serum**, bạn sẽ cảm nhận được làn da sáng khỏe, rạng rỡ và tự tin mỗi ngày.', '2024-12-09 04:49:41', '2024-12-09 04:49:41', 'products/gQ8e6N0oEHuiBU2okhzskda72CicfmnnGYffOcVb.webp'),
(260, 3, 1, 'Tinh Chất Cấp Ẩm Căng Mướt Da L\'Oreal Paris Revitalift Hyaluronic Acid Serum', 'còn hàng', '**Tinh Chất Cấp Ẩm Căng Mướt Da L\'Oreal Paris Revitalift Hyaluronic Acid Serum** là giải pháp dưỡng ẩm hiệu quả, mang đến làn da căng mướt, mềm mại và tràn đầy sức sống. Với thành phần **Hyaluronic Acid** tinh khiết, serum giúp cung cấp độ ẩm sâu, giữ nước lâu dài và cải thiện tình trạng da khô ráp chỉ sau một thời gian ngắn sử dụng. Sản phẩm có kết cấu nhẹ nhàng, thẩm thấu nhanh vào làn da mà không gây nhờn rít, mang lại cảm giác thoáng mát và dễ chịu suốt cả ngày. Không chỉ cấp ẩm, **Revitalift Hyaluronic Acid Serum** còn giúp làm giảm các dấu hiệu lão hóa sớm, cải thiện độ đàn hồi và tái tạo làn da trẻ trung, rạng rỡ. Phù hợp với mọi loại da, sản phẩm sẽ là người bạn đồng hành lý tưởng trong quy trình dưỡng da hàng ngày của bạn.', '2024-12-09 04:55:20', '2024-12-09 04:55:20', 'products/QBzAQw8k40YVYVfD6QjFB0Cdc2GOJPMs8dgKtZlJ.webp'),
(261, 3, 3, 'Tinh Chất Bí Đao Cocoon Winter Melon Serum 70Ml', 'còn hàng', '**Tinh Chất Bí Đao Cocoon Winter Melon Serum 70ml** là sản phẩm dưỡng da thiên nhiên an toàn, nhẹ nhàng, giúp cung cấp độ ẩm và làm sáng làn da từ bên trong. Chiết xuất **bí đao tự nhiên** chứa nhiều vitamin và khoáng chất, giúp làm dịu, cung cấp nước, cải thiện làn da khô và xỉn màu hiệu quả. Serum có kết cấu lỏng nhẹ, thẩm thấu nhanh vào làn da, không gây bết dính, mang lại cảm giác thoáng mát và dễ chịu. Sản phẩm phù hợp với mọi loại da, đặc biệt là làn da nhạy cảm, giúp làn da mềm mại, căng mướt và tràn đầy sức sống. Với **Cocoon Winter Melon Serum**, bạn sẽ có làn da sáng khỏe, mềm mịn và rạng rỡ mỗi ngày.', '2024-12-09 04:57:33', '2024-12-09 04:57:33', 'products/JqdxhSwEFoa18t0b7w4IhydwDXQBvw6V9n1REjyk.webp'),
(262, 3, 7, 'Tinh Chất La Roche-Posay Dưỡng Da Mềm Mịn, Mờ Thâm Nám Mela B3 Serum 30ml', 'còn hàng', '**Tinh Chất La Roche-Posay Mela B3 Serum 30ml** là giải pháp tối ưu cho làn da xỉn màu, thâm nám và không đều màu. Với công thức độc quyền kết hợp **Vitamin B3 (Niacinamide)** và các thành phần làm sáng da, sản phẩm giúp cải thiện đáng kể tình trạng thâm nám, làm mờ các vết sạm màu và mang lại làn da rạng rỡ, mềm mịn tự nhiên. Serum có kết cấu nhẹ nhàng, thẩm thấu nhanh, không gây nhờn rít, giúp làn da duy trì độ ẩm và phục hồi sức sống từ bên trong. An toàn và dịu nhẹ, sản phẩm phù hợp với mọi loại da, kể cả làn da nhạy cảm nhất. Với **Mela B3 Serum**, làn da bạn sẽ trở nên sáng khỏe, đều màu và tràn đầy tự tin mỗi ngày.', '2024-12-09 04:59:59', '2024-12-09 04:59:59', 'products/FYj0SumQYDHL5RxkC0L48s4CN9vQBiWjjAEDdb9l.webp'),
(263, 3, 9, 'Tinh Chất Dưỡng Ẩm Ohui Miracle Moisture Essence 50Ml', 'còn hàng', '**Tinh Chất Dưỡng Ẩm Ohui Miracle Moisture Essence 50ml** là sản phẩm dưỡng da cao cấp đến từ thương hiệu Ohui, được thiết kế đặc biệt để cung cấp độ ẩm và làm dịu làn da tức thì. Với công thức chiết xuất tự nhiên độc quyền và công nghệ hiện đại, tinh chất này thẩm thấu nhanh vào làn da, cung cấp độ ẩm sâu từ bên trong và duy trì làn da mềm mại, căng mướt suốt cả ngày. *Miracle Moisture Essence* giúp cải thiện tình trạng da khô ráp, xỉn màu và hỗ trợ tái tạo làn da khỏe mạnh, tràn đầy sức sống. Sản phẩm an toàn, nhẹ nhàng và phù hợp với mọi loại da, mang lại cảm giác thư giãn và thoải mái sau mỗi lần sử dụng.', '2024-12-09 05:05:32', '2024-12-09 05:05:32', 'products/lpCmUVcYQ3i2Yt0TFSGaIXYQrVHorbWZ1bmZ9rry.webp'),
(264, 3, 9, 'Tinh Chất Ohui Làm Sáng & Căng Mướt Da Miracle Toning Glow Serum 50ml', 'còn hàng', 'Tinh Chất Ohui Làm Sáng & Căng Mướt Da *Miracle Toning Glow Serum* 50ml là sản phẩm chăm sóc da cao cấp, giúp làn da bạn rạng rỡ và căng mướt từ bên trong. Với công thức độc quyền, serum cung cấp độ ẩm sâu, làm sáng da và cải thiện làn da xỉn màu, mang đến làn da mềm mại, đều màu và tràn đầy sức sống. Sản phẩm được chiết xuất từ các thành phần tự nhiên an toàn, nhẹ nhàng, không gây kích ứng, phù hợp với mọi làn da. Với kết cấu tinh chất mỏng nhẹ, dễ dàng thẩm thấu nhanh vào da, Miracle Toning Glow Serum sẽ là bước dưỡng da lý tưởng trong quy trình làm đẹp của bạn, giúp da khỏe mạnh và rạng rỡ mỗi ngày.', '2024-12-09 05:08:27', '2024-12-09 05:08:27', 'products/XiH947Qf9G8NVp2sgp1rwr3QqMsoZCzELhEeFEoT.webp'),
(265, 5, 3, 'Nước Cân Bằng Cocoon Hoa Sen Hau Giang Lotus Soothing Toner', 'còn hàng', '**Nước Cân Bằng Cocoon Hoa Sen Hậu Giang Lotus Soothing Toner** là sản phẩm chăm sóc da dịu nhẹ, thuần chay từ thương hiệu Cocoon, được chiết xuất từ hoa sen Hậu Giang – loài hoa nổi tiếng với đặc tính làm dịu và nuôi dưỡng làn da. Với công thức giàu chiết xuất tự nhiên, toner này giúp cân bằng độ pH, cung cấp độ ẩm tức thì và làm mềm da, mang lại cảm giác tươi mát và dễ chịu sau mỗi lần sử dụng.\n\nSản phẩm chứa các thành phần nổi bật như chiết xuất hoa sen, nước cất từ cánh hoa, và glycerin thực vật, giúp làm dịu làn da kích ứng, giảm tình trạng khô ráp và hỗ trợ cải thiện kết cấu da. Đặc biệt, sản phẩm không chứa cồn hay hương liệu tổng hợp, an toàn cho cả làn da nhạy cảm. Cocoon Hoa Sen Hậu Giang còn giúp loại bỏ bụi bẩn, dầu thừa sau bước làm sạch, tạo điều kiện lý tưởng để da hấp thụ tốt hơn các dưỡng chất từ các bước chăm sóc tiếp theo. Với sự kết hợp hoàn hảo giữa thiên nhiên và hiệu quả, đây là lựa chọn lý tưởng cho những ai yêu thích chăm sóc da một cách dịu nhẹ và bền vững.', '2024-12-09 05:13:10', '2024-12-09 05:13:10', 'products/Ga5qgrBqdupIRNwNqPEITmvs1UjY9vByEyV9b9aj.webp'),
(266, 5, 3, 'Nước Nghệ Hưng Yên Cocoon Hung Yen Turmeric Toner', 'còn hàng', 'Nước Nghệ Hưng Yên Cocoon Hung Yen Turmeric Toner là sản phẩm chăm sóc da tự nhiên, an toàn và hiệu quả từ thương hiệu Cocoon, nổi bật với thành phần chính là nghệ Hưng Yên – một loại nghệ nổi tiếng với hàm lượng curcumin cao và đặc tính chống viêm, kháng khuẩn vượt trội. Toner này được thiết kế để giúp làm dịu da, giảm tình trạng kích ứng, hỗ trợ làm sáng da và cải thiện các khuyết điểm như thâm mụn hoặc sạm da.', '2024-12-09 05:16:31', '2024-12-09 05:16:31', 'products/X7MVltufPe9sFlL5iQVjwSC3m8sYEK87e8w6P6mV.webp'),
(267, 5, 7, 'Nước Cân Bằng Cho Da Dầu La Roche-Posay Effaclar Lotion 200Ml', 'còn hàng', 'Nước Cân Bằng Cho Da Dầu La Roche-Posay Effaclar Lotion 200ml là sản phẩm lý tưởng dành cho làn da dầu, da mụn hoặc da dễ bị bít tắc lỗ chân lông. Sản phẩm chứa các thành phần nổi bật như nước khoáng La Roche-Posay và các hoạt chất làm sạch chuyên sâu, giúp loại bỏ dầu thừa, làm sạch lỗ chân lông và cân bằng độ pH tự nhiên cho da. Kết cấu lỏng nhẹ của nước cân bằng dễ dàng thẩm thấu, mang lại cảm giác mát dịu và không nhờn rít sau khi sử dụng.', '2024-12-09 05:18:42', '2024-12-09 05:18:42', 'products/r2m252d5mbxzzyrlvNFeea4gfj2o73r2VOYdrPXc.webp'),
(268, 5, 9, 'Nước Cân Bằng Chống Lão Hóa, Tái Sinh Da Ohui The First Geniture Skin Softener 150ml', 'còn hàng', 'Nước Cân Bằng Chống Lão Hóa, Tái Sinh Da Ohui The First Geniture Skin Softener (150ml) là sản phẩm chăm sóc da cao cấp thuộc dòng The First Geniture của Ohui, mang đến giải pháp toàn diện giúp tái sinh làn da và ngăn ngừa các dấu hiệu lão hóa. Được chiết xuất từ các thành phần quý giá như công nghệ Signature 29 Cell™ độc quyền, sản phẩm giúp kích thích tái tạo tế bào da, phục hồi độ đàn hồi và mang lại làn da khỏe mạnh, căng bóng. Kết cấu dạng nước mềm mại dễ dàng thẩm thấu sâu vào da, cung cấp độ ẩm tức thì và duy trì làn da mịn màng, tươi sáng. Đồng thời, nước cân bằng giúp cải thiện kết cấu da, tăng cường khả năng hấp thụ dưỡng chất từ các bước dưỡng da tiếp theo. Với thiết kế sang trọng và dung tích 150ml, Ohui The First Geniture Skin Softener là sự lựa chọn lý tưởng cho những ai tìm kiếm một sản phẩm vừa chống lão hóa, vừa tái sinh da hiệu quả.', '2024-12-09 05:21:38', '2024-12-09 05:21:38', 'products/x56Jrn6ResZtHxOERlcD8KkAmzOE9mS8aApKvIEQ.webp'),
(269, 17, 4, '(Phiên bản Soda Cafe) Phấn Nước Peripera Che Phủ & Cấp Ẩm Mood Fit Cover Cushion SPF50+, PA++++ 15g', 'còn hàng', 'Phấn Nước Peripera Che Phủ & Cấp Ẩm Mood Fit Cover Cushion SPF50+, PA++++ (Phiên bản Soda Cafe) là sản phẩm trang điểm đến từ thương hiệu Peripera, nổi bật với khả năng che phủ hoàn hảo và cung cấp độ ẩm tối ưu. Với chỉ số chống nắng cao SPF50+, PA++++, sản phẩm bảo vệ da toàn diện khỏi tác hại của tia UV, phù hợp cho cả ngày dài hoạt động ngoài trời. Phấn nước được thiết kế để mang lại lớp nền mỏng nhẹ, tự nhiên nhưng vẫn che phủ tốt các khuyết điểm như thâm mụn, lỗ chân lông và vùng da không đều màu. Đặc biệt, công thức cấp ẩm giúp duy trì làn da mịn màng, căng bóng, ngăn ngừa tình trạng khô da. Phiên bản Soda Cafe sở hữu thiết kế trẻ trung, bắt mắt và dung tích 15g, đi kèm với bông phấn mềm mại, dễ sử dụng. Đây là sự lựa chọn hoàn hảo cho những ai muốn sở hữu làn da rạng rỡ và khỏe đẹp suốt cả ngày.', '2024-12-09 05:29:05', '2024-12-09 05:29:05', 'products/NTxdCPNg6YQAfkLaIF54OGToEHtioip2tAfhvtbg.webp'),
(270, 17, 9, 'Phấn Nước Kiềm Dầu Ohui Ultimate Cover Mesh Cushion 13g', 'còn hàng', 'Phấn Nước Kiềm Dầu Ohui Ultimate Cover Mesh Cushion (13g) là sản phẩm trang điểm cao cấp đến từ thương hiệu Ohui, nổi tiếng với khả năng kiểm soát dầu nhờn hiệu quả và mang lại lớp nền mịn màng, lâu trôi. ', '2024-12-09 05:33:16', '2024-12-09 05:33:16', 'products/AhGzTvrAR24WCo0B1K9jqtRNuE27rhIEvcllHJGT.webp'),
(271, 17, 8, 'Phấn Nước Cushion Clio Kill Cover Mesh Glow SPF50+, PA++++ 15g', 'còn hàng', '\nPhấn Nước Clio Kill Cover High Glow Cushion (14Gx2) là sản phẩm trang điểm nổi bật từ thương hiệu mỹ phẩm Clio của Hàn Quốc, mang đến lớp nền căng bóng, mịn màng và che phủ vượt trội. Với khả năng cung cấp độ ẩm và tạo hiệu ứng căng mịn tự nhiên, sản phẩm giúp làn da trở nên sáng rạng rỡ suốt cả ngày. ', '2024-12-09 05:36:52', '2024-12-09 05:36:52', 'products/z0M51MGtdOdGznQN1zxkVfFbX2Kp9mvuRtzPFhI7.webp'),
(272, 17, 8, 'Phấn Nước Clio Hiệu Ứng Căng Bóng Kill Cover High Glow Cushion (14Gx2', 'còn hàng', '\nPhấn Nước Clio Kill Cover High Glow Cushion (14Gx2) là sản phẩm trang điểm nổi bật từ thương hiệu mỹ phẩm Clio của Hàn Quốc, mang đến lớp nền căng bóng, mịn màng và che phủ vượt trội. Với khả năng cung cấp độ ẩm và tạo hiệu ứng căng mịn tự nhiên, sản phẩm giúp làn da trở nên sáng rạng rỡ suốt cả ngày. ', '2024-12-09 05:40:45', '2024-12-09 05:40:45', 'products/wkSi37g3NEpHYaRdsPaRiGUcFZRKJQA6KAFQ1r7S.webp'),
(273, 17, 2, 'Phấn Nước Lâu Trôi Lemonade Matte Addict Cushion 15g', 'còn hàng', 'Phấn nước có kết cấu mỏng nhẹ, set nhanh và lâu trôi cho lớp nền mịn màng, căng mướt nhưng hoàn toàn không bị bóng dầu.\nPhấn nước có độ che phủ cao, giúp che phủ mụn đỏ và vết thâm hiệu quả nhưng trông lớp nền vẫn thật tự nhiên.\nKhả năng kiểm soát dầu nhờn và bền màu suốt cả ngày dài.', '2024-12-09 05:47:43', '2024-12-09 05:47:43', 'products/mxQ0OiQgMDI7mwevYsOEwI7ZvXKe6EZihWF3Lja5.webp'),
(274, 17, 2, 'Phấn Nước Kiềm Dầu Lemonade Supermatte Cushion 15g', 'còn hàng', 'Ra đời với ước mơ tạo nên một thế hệ tự tin và tràn đầy năng lượng, Lemonade là thương hiệu mỹ phẩm tới từ Việt Nam, đem đến giải pháp trang điểm dành riêng cho phụ nữ Việt. Đây là thương hiệu được tạo nên bởi Quách Ánh - 1 makeup artist chuyên nghiệp có gần 15 năm kinh nghiệm trong ngành, một trong những chuyên gia trang điểm hàng đầu Việt Nam, chị đã nghiên cứu và cho ra đời các dòng mỹ phẩm đáp ứng tiêu chuẩn và kỳ vọng lớn của mình.\n\nVới thiết kế màu vàng trắng đã trở nên quen thuộc, nay Lemonade Supermatte Cushion - dòng cushion quốc dân dành cho da dầu đã được thay đổi diện mạo mới, nhỏ nhắn gọn gàng hơn, cùng những cải tiến vượt bậc về chất lượng.', '2024-12-09 05:54:11', '2024-12-09 05:54:11', 'products/YAoY3D6SYSLCAyhqL3q70og02t34wYXFqb6JHmQ9.webp'),
(275, 17, 9, 'Phấn Nước Nâng Tông Ohui Ultimate Fit Tone Up Jean Cushion 15g', 'còn hàng', 'OHUI Ultimate Tone-Up Jean Cushion là loại Cushion với khả năng che phủ cao và nâng tone tự nhiên, thiết kế được lấy ý tưởng từ vài jean trẻ trung năng động, mang công thức độc quyền bởi OHUI giúp đem đến lớp nền , mỏng nhẹ, mịn mượt, sáng rạng rỡ', '2024-12-09 06:05:47', '2024-12-09 06:05:47', 'products/9HSiZKiT9CrtzNJYGsVG9JU0OlnlSvv2wRvwAIIC.webp'),
(276, 18, 4, '(Phiên bản Soda Cafe) Má Hồng Peripera 2 Màu Pure Blushed Custom Cheek 4.2g', 'còn hàng', 'Makeup look của bạn sẽ trông xinh xắn, mới mẻ hơn nếu sở hữu phấn má hồng 2 màu Peripera Pure Blushed Custom Cheek. Sản phẩm “lai” tạo hiệu ứng màu loang khá đẹp, với 2 màu sắc mix & match trong một sản phẩm sẽ giúp bạn dễ dàng tạo nên màu sắc mới ấn tượng.\n\nPeripera Pure Blushed Custom Cheek có bột phấn mịn, tiệp vào da rất tự nhiên. Với khả năng thấm hút dầu thừa trên gò má, sản phẩm giúp gương mặt trông rạng rỡ hơn với màu má hồng được lưu giữ lâu dài. Bảng màu Peripera Pure Blushed Custom Cheek là sự kết hợp giữa các màu sắc thiên mlbb, tự nhiên và mát mẻ, thích hợp sử dụng hằng ngày.', '2024-12-09 06:13:04', '2024-12-09 06:13:04', 'products/WOfsu9H23pMCoMXWCG8ocaDbqJ9At0SRwWVuv3tS.webp'),
(277, 18, 4, 'Má Hồng Peripera Pure Blushed Sunshine Cheek 4.2G', 'còn hàng', 'Công dụng chính: Má hồng Peripera kết cấu phấn mịn vừa lưu giữ màu lâu trôi, sắc màu nhẹ nhàng cùng khả năng dưỡng ẩm bên trong cho làn da.', '2024-12-09 06:18:02', '2024-12-09 06:18:02', 'products/Mbpbu8667YrgURaFUHroao3chMIFufCauY5UX5om.webp'),
(278, 18, 2, 'Má Hồng Lemonade Dạng Kem Thuần Chay Perfect Couple Blush - Love Edition 2 Shade 8.5g', 'còn hàng', 'Má hồng Lemonade dạng kem phiên bản hoàn toàn mới có thiết kế vô cùng độc đáo 2 đầu tiện dụng, một đầu cọ lấy kem hình vạt chéo dễ dàng lấy kem và apply lên da mặt. Đầu tan kem cực hiện đại, được làm từ sợi lông mềm mại, mật độ lông vừa đủ, không gây kích ứng, tổn thương da nhạy cảm, không gây trượt nền.', '2024-12-09 06:21:01', '2024-12-09 06:21:01', 'products/aP327JY758ytaS4ADSYOYQYpiJOfhM4HxTPxWkKX.webp'),
(279, 18, 2, 'Phấn Má Peripera All Take Mood Cheek Palette 11.4G', 'còn hàng', 'Công dụng: phấn má Peripera All Take Mood Cheek Palette là bảng phấn má hồng phù hợp cho những kiểu trang điểm tự nhiên với 3 tông màu, 3 sắc thái để bạn có thể biến hóa nhiều phong cách makeup khác nhau.', '2024-12-09 06:24:53', '2024-12-09 06:24:53', 'products/jLc8wPDQyc7IYyJ2aMq31P0obCFOtPUvcD2zG3fz.webp');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_reviews`
--

CREATE TABLE `tb_reviews` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `tb_product_id` bigint UNSIGNED NOT NULL,
  `order_id` bigint UNSIGNED NOT NULL,
  `rating` int UNSIGNED NOT NULL,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_reviews`
--

INSERT INTO `tb_reviews` (`id`, `user_id`, `tb_product_id`, `order_id`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(46, 6, 266, 405, 5, 'sản phẩm đẹp', '2024-11-04 00:19:49', '2024-12-10 00:19:49'),
(47, 6, 263, 404, 5, 'sản phẩm đẹp', '2024-12-10 00:20:09', '2024-12-10 00:20:09'),
(48, 6, 259, 402, 3, 'Hơi tệ', '2024-11-07 00:20:20', '2024-12-10 00:20:20'),
(49, 6, 261, 401, 2, 'tệ', '2024-11-13 00:20:27', '2024-12-10 00:20:27'),
(50, 6, 257, 398, 5, 'sản phẩm đẹp', '2024-10-15 00:20:38', '2024-12-10 00:20:38'),
(51, 6, 248, 389, 5, 'sản phẩm đẹp', '2024-10-24 00:20:46', '2024-12-10 00:20:46'),
(52, 6, 248, 391, 5, 'sản phẩm đẹp', '2024-12-10 00:20:51', '2024-12-10 00:20:51'),
(53, 6, 246, 388, 1, 'tệ', '2024-10-27 00:21:01', '2024-12-10 00:21:01'),
(54, 6, 246, 387, 4, 'tốt', '2024-12-10 00:21:12', '2024-12-10 00:21:12'),
(55, 6, 246, 386, 4, 'tốt', '2024-11-27 00:21:21', '2024-12-10 00:21:21'),
(56, 6, 247, 384, 5, 'Xuất sắc', '2024-09-04 00:21:30', '2024-12-10 00:21:30'),
(57, 6, 277, 441, 5, 'Sản phẩm tốt', '2024-12-10 00:50:48', '2024-12-10 00:50:48'),
(58, 6, 270, 440, 5, 'Sản phẩm tốt', '2024-09-11 00:50:54', '2024-12-10 00:50:54'),
(59, 6, 275, 439, 4, 'Sản phẩm tốt', '2024-09-26 00:51:00', '2024-12-10 00:51:00'),
(60, 6, 271, 438, 3, 'ok', '2024-09-29 00:51:06', '2024-12-10 00:51:06'),
(61, 6, 269, 437, 3, 'tạm được', '2024-08-01 00:51:15', '2024-12-10 00:51:15'),
(62, 6, 268, 432, 5, 'ok', '2024-08-08 00:51:23', '2024-12-10 00:51:23'),
(63, 6, 273, 433, 5, 'Sản phẩm tốt', '2024-08-20 00:51:30', '2024-12-10 00:51:30'),
(64, 6, 273, 434, 3, 'ok', '2024-12-10 00:51:36', '2024-12-10 00:51:36'),
(65, 6, 274, 435, 2, 'Đóng gói sơ sai', '2024-10-22 00:51:47', '2024-12-10 00:51:47'),
(66, 6, 272, 436, 5, 'Sản phẩm tốt', '2024-10-24 00:51:53', '2024-12-10 00:51:53'),
(67, 6, 262, 425, 4, NULL, '2024-12-10 00:52:00', '2024-12-10 00:52:00'),
(68, 5, 252, 477, 5, NULL, '2024-11-23 02:46:02', '2024-12-10 02:46:02'),
(69, 5, 269, 473, 5, 'Sản phẩm tốt', '2024-11-28 02:46:09', '2024-12-10 02:46:09'),
(70, 5, 256, 470, 4, 'Sản phẩm tốt', '2024-11-29 02:46:15', '2024-12-10 02:46:15'),
(71, 5, 250, 469, 3, 'ok', '2024-08-02 02:46:21', '2024-12-10 02:46:21'),
(72, 5, 274, 467, 1, 'tệ', '2024-09-02 02:46:28', '2024-12-10 02:46:28'),
(73, 5, 258, 455, 5, 'Sản phẩm tốt', '2024-12-10 02:46:36', '2024-12-10 02:46:36'),
(74, 5, 276, 456, 3, 'đáng tiền', '2024-12-10 02:46:45', '2024-12-10 02:46:45'),
(75, 5, 247, 457, 3, 'ok', '2024-12-10 02:46:54', '2024-12-10 02:46:54'),
(76, 5, 247, 458, 3, 'ok', '2024-12-10 02:47:01', '2024-12-10 02:47:01'),
(77, 5, 248, 465, 5, 'tốt', '2024-12-10 02:47:08', '2024-12-10 02:47:08'),
(78, 5, 253, 453, 5, NULL, '2024-12-10 02:47:16', '2024-12-10 02:47:16'),
(79, 5, 278, 478, 5, 'Tuyệt vời', '2024-12-10 07:11:10', '2024-12-10 07:11:10'),
(80, 5, 279, 479, 5, 'Tuyệt vời', '2024-12-10 07:11:49', '2024-12-10 07:11:49'),
(81, 5, 250, 482, 5, 'Tuyệt vời', '2024-08-17 07:13:48', '2024-12-10 07:13:48'),
(82, 5, 271, 481, 5, 'Tuyệt vời', '2024-08-19 07:13:54', '2024-12-10 07:13:54'),
(83, 5, 269, 480, 5, 'Tuyệt vời', '2024-12-10 07:14:00', '2024-12-10 07:14:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_roles`
--

CREATE TABLE `tb_roles` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_roles`
--

INSERT INTO `tb_roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Admin', NULL, NULL),
(2, 'Khách hàng', NULL, NULL),
(3, 'Nhân viên', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_sizes`
--

CREATE TABLE `tb_sizes` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_sizes`
--

INSERT INTO `tb_sizes` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, '100ml', '2024-10-10 08:57:26', '2024-10-10 08:57:26'),
(2, '150ml', '2024-10-10 08:57:26', '2024-10-10 08:57:26'),
(3, '200ml', '2024-10-10 08:57:26', '2024-10-10 08:57:26'),
(21, '400ml', '2024-12-09 04:10:33', '2024-12-09 04:10:33'),
(22, '125ml', '2024-12-09 04:21:33', '2024-12-09 04:21:33'),
(23, '500ml', '2024-12-09 04:28:27', '2024-12-09 04:28:27'),
(24, '30ml', '2024-12-09 04:48:00', '2024-12-09 04:48:00'),
(25, '15ml', '2024-12-09 04:52:01', '2024-12-09 04:52:01'),
(26, '70ml', '2024-12-09 04:55:45', '2024-12-09 04:55:45'),
(27, '50ml', '2024-12-09 05:02:27', '2024-12-09 05:02:27'),
(28, '300ml', '2024-12-09 05:13:22', '2024-12-09 05:13:22');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_statistics`
--

CREATE TABLE `tb_statistics` (
  `id` bigint UNSIGNED NOT NULL,
  `tb_category_id` bigint UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `statistic_value` int NOT NULL,
  `unit` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_variants`
--

CREATE TABLE `tb_variants` (
  `id` bigint UNSIGNED NOT NULL,
  `tb_product_id` bigint UNSIGNED NOT NULL,
  `tb_size_id` bigint UNSIGNED DEFAULT NULL,
  `tb_color_id` bigint UNSIGNED DEFAULT NULL,
  `sku` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int NOT NULL,
  `quantity` int NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_variants`
--

INSERT INTO `tb_variants` (`id`, `tb_product_id`, `tb_size_id`, `tb_color_id`, `sku`, `price`, `quantity`, `status`, `created_at`, `updated_at`) VALUES
(261, 246, NULL, 31, 'pr-01', 179000, 17, 'Còn hàng', '2024-12-09 03:23:02', '2024-12-10 01:38:27'),
(262, 246, NULL, 30, 'pr-02', 179000, 17, 'Còn hàng', '2024-12-09 03:23:02', '2024-12-10 01:37:56'),
(263, 246, NULL, 29, 'pr-03', 179000, 14, 'Còn hàng', '2024-12-09 03:23:02', '2024-12-10 01:38:52'),
(264, 246, NULL, 28, 'pr-04', 179000, 16, 'Còn hàng', '2024-12-09 03:23:02', '2024-12-10 01:44:00'),
(265, 247, NULL, 32, 'pr-05', 170000, 4, 'Còn hàng', '2024-12-09 03:37:55', '2024-12-10 01:37:14'),
(266, 247, NULL, 33, 'pr-06', 170000, 14, 'Còn hàng', '2024-12-09 03:37:55', '2024-12-10 01:37:32'),
(267, 247, NULL, 34, 'pr-07', 170000, 13, 'Còn hàng', '2024-12-09 03:37:55', '2024-12-10 01:37:39'),
(268, 248, NULL, 35, 'lm-01', 239000, 16, 'Còn hàng', '2024-12-09 03:54:55', '2024-12-10 00:11:11'),
(269, 248, NULL, 36, 'lm-02', 239000, 17, 'Còn hàng', '2024-12-09 03:54:55', '2024-12-10 01:39:04'),
(270, 248, NULL, 37, 'lm-03', 210000, 17, 'Còn hàng', '2024-12-09 03:54:55', '2024-12-10 01:39:26'),
(271, 249, NULL, 38, 'ohs-01', 950000, 19, 'Còn hàng', '2024-12-09 04:00:41', '2024-12-10 01:42:29'),
(272, 249, NULL, 39, 'ohs-02', 950000, 20, 'Còn hàng', '2024-12-09 04:00:41', '2024-12-10 01:42:13'),
(273, 249, NULL, 40, 'ohs-03', 950000, 19, 'Còn hàng', '2024-12-09 04:00:41', '2024-12-10 01:40:56'),
(274, 250, NULL, 41, 'clis-01', 349000, 18, 'Còn hàng', '2024-12-09 04:08:36', '2024-12-10 01:39:41'),
(275, 250, NULL, 42, 'clis-02', 349000, 10, 'Còn hàng', '2024-12-09 04:08:36', '2024-12-10 07:13:19'),
(276, 250, NULL, 43, 'ohs-04', 349000, 19, 'Còn hàng', '2024-12-09 04:08:36', '2024-12-10 01:40:12'),
(277, 251, 3, NULL, 'lptc-01', 420000, 19, 'Còn hàng', '2024-12-09 04:14:09', '2024-12-10 01:40:04'),
(278, 251, 21, NULL, 'lptc-02', 520000, 17, 'Còn hàng', '2024-12-09 04:14:09', '2024-12-10 01:39:52'),
(279, 252, 2, NULL, 'gtc-01', 110000, 0, 'Hết hàng', '2024-12-09 04:19:49', '2024-12-10 02:09:32'),
(280, 252, 21, NULL, 'gtc-02', 220000, 13, 'Còn hàng', '2024-12-09 04:19:49', '2024-12-10 01:36:26'),
(281, 253, 22, NULL, 'gtc-03', 99000, 19, 'Còn hàng', '2024-12-09 04:23:37', '2024-12-10 01:43:39'),
(282, 253, 21, NULL, 'gtc-04', 189000, 14, 'Còn hàng', '2024-12-09 04:23:37', '2024-12-10 01:36:26'),
(283, 255, 23, NULL, 'ctc-01', 295000, 15, 'Còn hàng', '2024-12-09 04:30:15', '2024-12-10 01:39:26'),
(284, 256, 3, NULL, 'lp-04', 425000, 16, 'Còn hàng', '2024-12-09 04:36:18', '2024-12-10 01:40:22'),
(285, 256, 21, NULL, 'lp-05', 525000, 20, 'Còn hàng', '2024-12-09 04:36:18', '2024-12-10 00:40:15'),
(286, 257, 21, NULL, 'lrtc-01', 269000, 15, 'Còn hàng', '2024-12-09 04:40:42', '2024-12-10 00:30:38'),
(287, 258, 3, NULL, 'lrtc-02', 119000, 14, 'Còn hàng', '2024-12-09 04:46:26', '2024-12-10 01:36:59'),
(288, 258, 21, NULL, 'lrtc-04', 183000, 18, 'Còn hàng', '2024-12-09 04:46:26', '2024-12-10 01:37:14'),
(289, 259, 24, NULL, 'gsr-01', 349000, 14, 'Còn hàng', '2024-12-09 04:49:41', '2024-12-10 00:32:57'),
(290, 260, 25, NULL, 'lrsr-01', 229000, 20, 'còn hàng', '2024-12-09 04:55:20', '2024-12-09 04:55:20'),
(291, 260, 24, NULL, 'lrsr-03', 499000, 18, 'Còn hàng', '2024-12-09 04:55:20', '2024-12-10 01:39:04'),
(292, 261, 26, NULL, 'csr-01', 295000, 18, 'Còn hàng', '2024-12-09 04:57:33', '2024-12-10 00:40:06'),
(293, 262, 24, NULL, 'lpsr-02', 1300000, 15, 'Còn hàng', '2024-12-09 04:59:59', '2024-12-10 00:33:13'),
(294, 263, 27, NULL, 'ohsr-01', 1600000, 17, 'Còn hàng', '2024-12-09 05:05:32', '2024-12-10 00:39:52'),
(295, 264, 27, NULL, 'ohsr-02', 1600000, 16, 'Còn hàng', '2024-12-09 05:08:27', '2024-12-10 01:40:56'),
(296, 265, 2, NULL, 'ctn-01', 195000, 18, 'Còn hàng', '2024-12-09 05:13:10', '2024-12-10 01:38:27'),
(297, 265, 28, NULL, 'ctn-02', 295000, 14, 'Còn hàng', '2024-12-09 05:13:10', '2024-12-10 01:37:56'),
(298, 266, 2, NULL, 'ctn-03', 175000, 19, 'Còn hàng', '2024-12-09 05:16:31', '2024-12-10 00:16:40'),
(299, 266, 28, NULL, 'ctn-04', 295000, 14, 'Còn hàng', '2024-12-09 05:16:31', '2024-12-10 01:37:14'),
(300, 267, 3, NULL, 'lptn-01', 455000, 14, 'Còn hàng', '2024-12-09 05:18:42', '2024-12-10 01:40:22'),
(301, 268, 2, NULL, 'ohtn-01', 2200000, 19, 'Còn hàng', '2024-12-09 05:21:38', '2024-12-10 00:34:38'),
(302, 269, NULL, 44, 'prcs-01', 468000, 18, 'Còn hàng', '2024-12-09 05:29:05', '2024-12-10 01:40:56'),
(303, 269, NULL, 45, 'prcs-02', 468000, 9, 'Còn hàng', '2024-12-09 05:29:05', '2024-12-10 07:12:30'),
(304, 269, NULL, 46, 'prcs-03', 468000, 19, 'Còn hàng', '2024-12-09 05:29:05', '2024-12-10 01:42:20'),
(305, 270, NULL, 47, 'ohcs-01', 1300000, 20, 'Còn hàng', '2024-12-09 05:33:16', '2024-12-10 01:42:29'),
(306, 270, NULL, 48, 'ohcs-02', 1300000, 17, 'Còn hàng', '2024-12-09 05:33:16', '2024-12-10 01:42:13'),
(307, 271, NULL, 49, 'clics-01', 499000, 13, 'Còn hàng', '2024-12-09 05:36:52', '2024-12-10 07:13:03'),
(308, 271, NULL, 50, 'clics-02', 499000, 18, 'Còn hàng', '2024-12-09 05:36:52', '2024-12-10 01:42:29'),
(309, 272, NULL, 25, 'clics-03', 449000, 17, 'Còn hàng', '2024-12-09 05:40:45', '2024-12-10 01:42:37'),
(310, 272, NULL, 26, 'clics-04', 449000, 19, 'Còn hàng', '2024-12-09 05:40:45', '2024-12-10 01:40:56'),
(311, 273, NULL, 25, 'lmcs-01', 314000, 15, 'Còn hàng', '2024-12-09 05:47:43', '2024-12-10 01:39:41'),
(312, 273, NULL, 26, 'lmcs-02', 314000, 19, 'Còn hàng', '2024-12-09 05:47:43', '2024-12-10 01:40:04'),
(313, 274, NULL, 51, 'lmcs-03', 323000, 17, 'Còn hàng', '2024-12-09 05:54:11', '2024-12-10 01:39:52'),
(314, 274, NULL, 52, 'lmcs-04', 323000, 17, 'Còn hàng', '2024-12-09 05:54:11', '2024-12-10 01:39:41'),
(315, 275, NULL, NULL, 'ohcs-04', 1000000, 18, 'Còn hàng', '2024-12-09 06:05:47', '2024-12-10 01:42:13'),
(316, 276, NULL, 53, 'prmh-01', 168000, 18, 'Còn hàng', '2024-12-09 06:13:04', '2024-12-10 01:36:59'),
(317, 276, NULL, 54, 'prmh-02', 168000, 18, 'Còn hàng', '2024-12-09 06:13:04', '2024-12-10 01:37:25'),
(318, 277, NULL, 55, 'prmh-03', 139000, 19, 'Còn hàng', '2024-12-09 06:18:02', '2024-12-10 01:37:14'),
(319, 277, NULL, 56, 'prmh-04', 139000, 18, 'Còn hàng', '2024-12-09 06:18:02', '2024-12-10 01:36:59'),
(320, 277, NULL, 57, 'prmh-05', 139000, 18, 'Còn hàng', '2024-12-09 06:18:02', '2024-12-10 01:36:59'),
(321, 278, NULL, 58, 'lmmh-01', 215000, 0, 'Hết hàng', '2024-12-09 06:21:01', '2024-12-10 07:10:31'),
(322, 278, NULL, 59, 'lmmh-02', 215000, 16, 'Còn hàng', '2024-12-09 06:21:01', '2024-12-10 01:37:56'),
(323, 279, NULL, 59, 'lmmh-04', 459000, 18, 'Còn hàng', '2024-12-09 06:24:53', '2024-12-10 01:40:56'),
(324, 279, NULL, 28, 'lmmh-05', 459000, 5, 'Còn hàng', '2024-12-09 06:24:53', '2024-12-10 07:11:27');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb__oderdetail`
--

CREATE TABLE `tb__oderdetail` (
  `id` bigint UNSIGNED NOT NULL,
  `tb_oder_id` bigint UNSIGNED NOT NULL,
  `tb_product_id` bigint UNSIGNED NOT NULL,
  `is_reviewed` tinyint(1) NOT NULL DEFAULT '0',
  `tb_variant_id` bigint UNSIGNED NOT NULL,
  `quantity` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `price` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tb__oderdetail`
--

INSERT INTO `tb__oderdetail` (`id`, `tb_oder_id`, `tb_product_id`, `is_reviewed`, `tb_variant_id`, `quantity`, `created_at`, `updated_at`, `price`) VALUES
(240, 382, 247, 0, 265, 11, '2024-12-10 00:08:52', '2024-12-10 00:08:52', 170000),
(241, 383, 247, 0, 266, 4, '2024-12-10 00:09:40', '2024-12-10 00:09:40', 170000),
(242, 384, 247, 1, 267, 5, '2024-12-10 00:09:49', '2024-12-10 00:21:30', 170000),
(243, 385, 246, 0, 261, 1, '2024-12-10 00:10:14', '2024-12-10 00:10:14', 179000),
(244, 386, 246, 1, 262, 1, '2024-12-10 00:10:36', '2024-12-10 00:21:21', 179000),
(245, 387, 246, 1, 263, 4, '2024-12-10 00:10:48', '2024-12-10 00:21:12', 179000),
(246, 388, 246, 1, 264, 1, '2024-12-10 00:10:58', '2024-12-10 00:21:01', 179000),
(247, 389, 248, 1, 268, 4, '2024-12-10 00:11:11', '2024-12-10 00:20:46', 239000),
(248, 390, 248, 0, 269, 1, '2024-12-10 00:12:07', '2024-12-10 00:12:07', 239000),
(249, 391, 248, 1, 270, 1, '2024-12-10 00:12:29', '2024-12-10 00:20:51', 210000),
(250, 392, 250, 0, 274, 1, '2024-12-10 00:12:57', '2024-12-10 00:12:57', 349000),
(251, 393, 250, 0, 275, 1, '2024-12-10 00:13:07', '2024-12-10 00:13:07', 349000),
(252, 394, 250, 0, 276, 1, '2024-12-10 00:13:29', '2024-12-10 00:13:29', 349000),
(253, 394, 256, 0, 284, 1, '2024-12-10 00:13:29', '2024-12-10 00:13:29', 425000),
(254, 394, 260, 0, 291, 1, '2024-12-10 00:13:29', '2024-12-10 00:13:29', 499000),
(255, 395, 249, 0, 271, 1, '2024-12-10 00:14:06', '2024-12-10 00:14:06', 950000),
(256, 395, 253, 0, 281, 1, '2024-12-10 00:14:06', '2024-12-10 00:14:06', 99000),
(257, 395, 258, 0, 287, 4, '2024-12-10 00:14:06', '2024-12-10 00:14:06', 119000),
(258, 395, 252, 0, 280, 4, '2024-12-10 00:14:06', '2024-12-10 00:14:06', 220000),
(259, 396, 249, 0, 272, 1, '2024-12-10 00:14:23', '2024-12-10 00:14:23', 950000),
(260, 396, 253, 0, 282, 1, '2024-12-10 00:14:23', '2024-12-10 00:14:23', 189000),
(261, 396, 252, 0, 279, 6, '2024-12-10 00:14:23', '2024-12-10 00:14:23', 110000),
(262, 396, 258, 0, 288, 4, '2024-12-10 00:14:23', '2024-12-10 00:14:23', 183000),
(263, 397, 249, 0, 273, 1, '2024-12-10 00:14:37', '2024-12-10 00:14:37', 950000),
(264, 397, 255, 0, 283, 3, '2024-12-10 00:14:37', '2024-12-10 00:14:37', 295000),
(265, 398, 257, 1, 286, 4, '2024-12-10 00:14:46', '2024-12-10 00:20:38', 269000),
(266, 399, 251, 0, 277, 1, '2024-12-10 00:15:00', '2024-12-10 00:15:00', 420000),
(267, 399, 251, 0, 278, 4, '2024-12-10 00:15:00', '2024-12-10 00:15:00', 520000),
(268, 400, 256, 0, 285, 4, '2024-12-09 00:15:17', '2024-12-10 00:15:17', 525000),
(269, 400, 260, 0, 290, 3, '2024-12-08 00:15:17', '2024-12-10 00:15:17', 229000),
(270, 401, 261, 1, 292, 2, '2024-12-07 00:15:43', '2024-12-10 00:20:27', 295000),
(271, 402, 259, 1, 289, 3, '2024-12-06 00:15:52', '2024-12-10 00:20:20', 349000),
(272, 403, 262, 0, 293, 3, '2024-12-10 00:16:21', '2024-12-10 00:16:21', 1300000),
(273, 403, 264, 0, 295, 3, '2024-12-05 00:16:21', '2024-12-10 00:16:21', 1600000),
(274, 404, 263, 1, 294, 3, '2024-12-10 00:16:31', '2024-12-10 00:20:09', 1600000),
(275, 405, 266, 1, 298, 1, '2024-12-10 00:16:40', '2024-12-10 00:19:49', 175000),
(276, 405, 266, 0, 299, 2, '2024-12-04 00:16:40', '2024-12-10 00:16:40', 295000),
(277, 406, 265, 0, 297, 2, '2024-12-10 00:16:52', '2024-12-10 00:16:52', 295000),
(278, 406, 268, 0, 301, 3, '2024-12-10 00:16:52', '2024-12-10 00:16:52', 2200000),
(279, 407, 267, 0, 300, 3, '2024-12-03 00:17:03', '2024-12-10 00:17:03', 455000),
(280, 408, 265, 0, 296, 3, '2024-12-10 00:17:15', '2024-12-10 00:17:15', 195000),
(281, 409, 247, 0, 265, 3, '2024-12-02 00:28:03', '2024-12-10 00:28:03', 170000),
(282, 410, 246, 0, 264, 1, '2024-12-01 00:28:32', '2024-12-10 00:28:32', 179000),
(283, 411, 248, 0, 270, 1, '2024-12-10 00:28:52', '2024-12-10 00:28:52', 210000),
(284, 412, 250, 0, 276, 1, '2024-12-10 00:29:19', '2024-12-10 00:29:19', 349000),
(285, 413, 249, 0, 273, 1, '2024-12-10 00:29:38', '2024-12-10 00:29:38', 950000),
(286, 414, 253, 0, 282, 3, '2024-12-10 00:29:56', '2024-12-10 00:29:56', 189000),
(287, 415, 252, 0, 280, 1, '2024-12-09 00:30:13', '2024-12-10 00:30:13', 220000),
(288, 416, 258, 0, 288, 1, '2024-12-10 00:30:26', '2024-12-10 00:30:26', 183000),
(289, 417, 257, 0, 286, 1, '2024-12-08 00:30:38', '2024-12-10 00:30:38', 269000),
(290, 418, 255, 0, 283, 1, '2024-12-10 00:30:54', '2024-12-10 00:30:54', 295000),
(291, 419, 251, 0, 278, 2, '2024-12-07 00:31:14', '2024-12-10 00:31:14', 520000),
(292, 420, 256, 0, 285, 2, '2024-12-10 00:31:31', '2024-12-10 00:31:31', 525000),
(293, 421, 260, 0, 291, 3, '2024-12-05 00:31:51', '2024-12-10 00:31:51', 499000),
(294, 422, 261, 0, 292, 2, '2024-12-02 00:32:05', '2024-12-10 00:32:05', 295000),
(295, 423, 259, 0, 289, 2, '2024-09-30 00:32:25', '2024-12-10 00:32:25', 349000),
(296, 424, 259, 0, 289, 1, '2024-09-29 00:32:57', '2024-12-10 00:32:57', 349000),
(297, 425, 262, 1, 293, 2, '2024-09-20 00:33:13', '2024-12-10 00:52:00', 1300000),
(298, 426, 263, 0, 294, 1, '2024-09-03 00:33:23', '2024-12-10 00:33:23', 1600000),
(299, 427, 264, 0, 295, 1, '2024-10-31 00:33:34', '2024-12-10 00:33:34', 1600000),
(300, 428, 266, 0, 299, 3, '2024-10-29 00:33:52', '2024-12-10 00:33:52', 295000),
(301, 429, 265, 0, 297, 3, '2024-10-11 00:34:08', '2024-12-10 00:34:08', 295000),
(302, 430, 267, 0, 300, 2, '2024-10-09 00:34:19', '2024-12-10 00:34:19', 455000),
(303, 431, 267, 0, 300, 1, '2024-11-28 00:34:27', '2024-12-10 00:34:27', 455000),
(304, 432, 268, 1, 301, 1, '2024-11-30 00:34:38', '2024-12-10 00:51:23', 2200000),
(305, 433, 273, 1, 311, 1, '2024-11-24 00:34:51', '2024-12-10 00:51:30', 314000),
(306, 434, 273, 1, 311, 1, '2024-11-27 00:35:05', '2024-12-10 00:51:36', 314000),
(307, 435, 274, 1, 314, 1, '2024-11-12 00:35:21', '2024-12-10 00:51:47', 323000),
(308, 436, 272, 1, 309, 2, '2024-10-05 00:35:36', '2024-12-10 00:51:53', 449000),
(309, 437, 269, 1, 304, 1, '2024-10-21 00:35:54', '2024-12-10 00:51:15', 468000),
(310, 438, 271, 1, 308, 2, '2024-08-03 00:36:10', '2024-12-10 00:51:06', 499000),
(311, 439, 275, 1, 315, 2, '2024-08-02 00:36:22', '2024-12-10 00:51:00', 1000000),
(312, 440, 270, 1, 306, 3, '2024-08-01 00:36:40', '2024-12-10 00:50:54', 1300000),
(313, 441, 277, 1, 320, 1, '2024-08-17 00:36:59', '2024-12-10 00:50:48', 139000),
(314, 442, 276, 0, 317, 2, '2024-08-14 00:37:16', '2024-12-10 00:37:16', 168000),
(315, 443, 278, 0, 321, 1, '2024-08-11 00:37:33', '2024-12-10 00:37:33', 215000),
(316, 444, 279, 0, 323, 3, '2024-08-09 00:37:46', '2024-12-10 00:37:46', 459000),
(317, 445, 279, 0, 324, 3, '2024-08-06 00:37:59', '2024-12-10 00:37:59', 459000),
(318, 446, 252, 0, 279, 1, '2024-08-04 00:58:04', '2024-12-10 00:58:04', 110000),
(319, 447, 272, 0, 309, 1, '2024-08-22 00:58:57', '2024-12-10 00:58:57', 449000),
(320, 448, 269, 0, 302, 1, '2024-08-19 01:03:31', '2024-12-10 01:03:31', 468000),
(321, 449, 252, 0, 279, 1, '2024-08-11 01:12:09', '2024-12-10 01:12:09', 110000),
(322, 450, 274, 0, 313, 1, '2024-08-24 01:15:21', '2024-12-10 01:15:21', 323000),
(323, 451, 279, 0, 323, 1, '2024-08-22 01:16:14', '2024-12-10 01:16:14', 459000),
(324, 452, 253, 0, 281, 2, '2024-08-20 01:36:14', '2024-12-10 01:36:14', 99000),
(325, 452, 252, 0, 279, 1, '2024-08-26 01:36:14', '2024-12-10 01:36:14', 110000),
(326, 453, 253, 1, 282, 3, '2024-08-28 01:36:26', '2024-12-10 02:47:16', 189000),
(327, 453, 252, 0, 280, 2, '2024-08-31 01:36:26', '2024-12-10 01:36:26', 220000),
(328, 454, 258, 0, 287, 2, '2024-09-05 01:36:59', '2024-12-10 01:36:59', 119000),
(329, 454, 277, 0, 319, 2, '2024-09-07 01:36:59', '2024-12-10 01:36:59', 139000),
(330, 454, 277, 0, 320, 1, '2024-09-04 01:36:59', '2024-12-10 01:36:59', 139000),
(331, 454, 276, 0, 316, 2, '2024-09-01 01:36:59', '2024-12-10 01:36:59', 168000),
(332, 455, 258, 1, 288, 1, '2024-09-13 01:37:14', '2024-12-10 02:46:36', 183000),
(333, 455, 277, 0, 318, 1, '2024-09-11 01:37:14', '2024-12-10 01:37:14', 139000),
(334, 455, 247, 0, 265, 2, '2024-09-08 01:37:14', '2024-12-10 01:37:14', 170000),
(335, 455, 266, 0, 299, 1, '2024-09-21 01:37:14', '2024-12-10 01:37:14', 295000),
(336, 456, 276, 1, 317, 2, '2024-09-18 01:37:25', '2024-12-10 02:46:45', 168000),
(337, 457, 247, 1, 266, 2, '2024-09-17 01:37:32', '2024-12-10 02:46:54', 170000),
(338, 458, 247, 1, 267, 2, '2024-09-15 01:37:39', '2024-12-10 02:47:01', 170000),
(339, 459, 246, 0, 262, 2, '2024-09-20 01:37:56', '2024-12-10 01:37:56', 179000),
(340, 459, 246, 0, 264, 3, '2024-09-18 01:37:56', '2024-12-10 01:37:56', 179000),
(341, 459, 265, 0, 297, 3, '2024-09-16 01:37:56', '2024-12-10 01:37:56', 295000),
(342, 459, 278, 0, 322, 4, '2024-09-27 01:37:56', '2024-12-10 01:37:56', 215000),
(343, 460, 266, 0, 298, 3, '2024-09-24 01:38:13', '2024-12-10 01:38:13', 175000),
(344, 460, 260, 0, 290, 2, '2024-09-22 01:38:13', '2024-12-10 01:38:13', 229000),
(345, 461, 246, 0, 261, 2, '2024-09-29 01:38:27', '2024-12-10 01:38:27', 179000),
(346, 461, 265, 0, 296, 2, '2024-10-05 01:38:27', '2024-12-10 01:38:27', 195000),
(347, 462, 246, 0, 263, 2, '2024-10-03 01:38:52', '2024-12-10 01:38:52', 179000),
(348, 462, 278, 0, 321, 3, '2024-10-01 01:38:52', '2024-12-10 01:38:52', 215000),
(349, 463, 260, 0, 291, 2, '2024-10-11 01:39:04', '2024-12-10 01:39:04', 499000),
(350, 463, 248, 0, 269, 2, '2024-10-08 01:39:04', '2024-12-10 01:39:04', 239000),
(351, 464, 248, 0, 268, 1, '2024-10-06 01:39:15', '2024-12-10 01:39:15', 239000),
(352, 465, 248, 1, 270, 1, '2024-10-18 01:39:26', '2024-12-10 02:47:08', 210000),
(353, 465, 255, 0, 283, 4, '2024-10-22 01:39:26', '2024-12-10 01:39:26', 295000),
(354, 466, 273, 0, 311, 3, '2024-10-13 01:39:41', '2024-12-10 01:39:41', 314000),
(355, 466, 274, 0, 314, 2, '2024-10-26 01:39:41', '2024-12-10 01:39:41', 323000),
(356, 466, 250, 0, 274, 1, '2024-10-24 01:39:41', '2024-12-10 01:39:41', 349000),
(357, 467, 274, 1, 313, 2, '2024-10-22 01:39:52', '2024-12-10 02:46:28', 323000),
(358, 467, 250, 0, 275, 1, '2024-10-20 01:39:52', '2024-12-10 01:39:52', 349000),
(359, 467, 251, 0, 278, 3, '2024-10-29 01:39:52', '2024-12-10 01:39:52', 520000),
(360, 468, 273, 0, 312, 1, '2024-10-27 01:40:04', '2024-12-10 01:40:04', 314000),
(361, 468, 251, 0, 277, 1, '2024-10-30 01:40:04', '2024-12-10 01:40:04', 420000),
(362, 469, 250, 1, 276, 1, '2024-11-01 01:40:12', '2024-12-10 02:46:21', 349000),
(363, 470, 256, 1, 284, 4, '2024-11-09 01:40:22', '2024-12-10 02:46:15', 425000),
(364, 470, 267, 0, 300, 3, '2024-11-07 01:40:22', '2024-12-10 01:40:22', 455000),
(365, 471, 272, 0, 310, 1, '2024-11-04 01:40:56', '2024-12-10 01:40:56', 449000),
(366, 471, 279, 0, 323, 1, '2024-11-16 01:40:56', '2024-12-10 01:40:56', 459000),
(367, 471, 269, 0, 302, 1, '2024-11-15 01:40:56', '2024-12-10 01:40:56', 468000),
(368, 471, 249, 0, 273, 1, '2024-11-12 01:40:56', '2024-12-10 01:40:56', 950000),
(369, 471, 264, 0, 295, 1, '2024-11-23 01:40:56', '2024-12-10 01:40:56', 1600000),
(370, 472, 272, 0, 309, 1, '2024-11-17 01:41:07', '2024-12-10 01:41:07', 449000),
(371, 473, 269, 1, 303, 1, '2024-11-19 01:41:16', '2024-12-10 02:46:09', 468000),
(372, 474, 279, 0, 324, 1, '2024-11-24 01:41:29', '2024-12-10 01:41:29', 459000),
(373, 474, 271, 0, 308, 1, '2024-11-25 01:41:29', '2024-12-10 01:41:29', 499000),
(374, 474, 249, 0, 271, 1, '2024-11-27 01:41:29', '2024-12-10 01:41:29', 950000),
(375, 474, 270, 0, 305, 1, '2024-11-28 01:41:29', '2024-12-10 01:41:29', 1300000),
(376, 475, 269, 0, 304, 1, '2024-12-09 01:41:39', '2024-12-10 01:41:39', 468000),
(377, 475, 271, 0, 307, 3, '2024-12-08 01:41:39', '2024-12-10 01:41:39', 499000),
(378, 476, 249, 0, 272, 1, '2024-12-07 01:41:49', '2024-12-10 01:41:49', 950000),
(379, 476, 275, 0, 315, 1, '2024-12-06 01:41:49', '2024-12-10 01:41:49', 1000000),
(380, 476, 270, 0, 306, 1, '2024-12-05 01:41:49', '2024-12-10 01:41:49', 1300000),
(381, 477, 252, 1, 279, 20, '2024-12-04 02:09:32', '2024-12-10 02:46:02', 110000),
(382, 478, 278, 1, 321, 17, '2024-12-03 07:10:31', '2024-12-10 07:11:10', 215000),
(383, 479, 279, 1, 324, 15, '2024-12-02 07:11:27', '2024-12-10 07:11:49', 459000),
(384, 480, 269, 1, 303, 10, '2024-12-01 07:12:30', '2024-12-10 07:14:00', 468000),
(385, 481, 271, 1, 307, 7, '2024-12-06 07:13:03', '2024-12-10 07:13:54', 499000),
(386, 482, 250, 1, 275, 9, '2024-12-02 07:13:19', '2024-12-10 07:13:48', 349000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tb_role_id` bigint UNSIGNED NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `name`, `tb_role_id`, `phone`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Khách Vãng Lai', 2, '', '', '2024-10-10 18:51:38', '$2y$12$BSS8aZeftXGKEE3Zcd48ouPeFWoPwLPmVLj5Mqod0T8XFeVI4juhu', 'S~r0{^I', '2024-10-10 18:51:38', '2024-10-10 18:51:38'),
(4, 'Isidro Boyer', 1, '407.508.1899', 'devin.wehner@example.net', '2024-10-10 18:52:43', '$2y$12$YQVD0jNvCXPmj5nez3lEMO0G.0svEOm9t3tpVnCrbaQmuNjQHMm2y', '8KXi[p{Ar$B!k)\'l', '2024-10-10 18:52:44', '2024-10-10 18:52:44'),
(5, 'Huy Phúc 2', 2, '0767148666', 'hpking2020@gmail.com', NULL, '$2y$12$3D.2clAf56/Y/k8I3A2eoOKiB3Rluc/.MbAm.9Xj6xXuUOtQEslBO', NULL, '2024-10-30 11:12:10', '2024-10-30 11:15:15'),
(6, 'linh1', 2, '0352169486', 'linh@gmail.com', NULL, '$2y$12$gs31mlPASHDJnmZCieE9puV6nOyvsMhF8dI0WwQea0F5x3itO.PTm', NULL, '2024-11-08 12:25:10', '2024-11-08 12:25:10'),
(7, 'Phạm', 2, '0123456789', 'yenptkph34168@fpt.edu.vn', NULL, '$2y$12$/i.Ui4boagGuQgC9qAq07.S5LoOnBxtXYF.9u1GGDkNNttTIJnnEK', NULL, '2024-11-13 10:11:55', '2024-11-13 10:11:55'),
(8, 'yen', 2, '0372504911', 'py210324@gmail.com', NULL, '$2y$12$8IH8wxeyOXyfM6hY0eJ9GuFSLrj/PqtVhADHcyf/7wNTb4qkKUVtG', NULL, '2024-11-17 04:28:05', '2024-11-17 04:28:05'),
(9, 'duongthang', 2, '0913123123', 'kame03112004@gmail.com', NULL, '$2y$12$i.YtitnPsBsLh/DTRisJh.aXkOo/XWd4OtHUlgitGZ/qQ1mDzbd86', NULL, '2024-11-17 11:04:57', '2024-11-17 11:04:57');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Chỉ mục cho bảng `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `favorites_user_id_foreign` (`user_id`),
  ADD KEY `favorites_tb_product_id_foreign` (`tb_product_id`);

--
-- Chỉ mục cho bảng `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Chỉ mục cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Chỉ mục cho bảng `tb_address_users`
--
ALTER TABLE `tb_address_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_address_users_user_id_foreign` (`user_id`);

--
-- Chỉ mục cho bảng `tb_brands`
--
ALTER TABLE `tb_brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tb_brands_name_unique` (`name`);

--
-- Chỉ mục cho bảng `tb_carts`
--
ALTER TABLE `tb_carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_carts_user_id_foreign` (`user_id`),
  ADD KEY `tb_carts_tb_product_id_foreign` (`tb_product_id`),
  ADD KEY `tb_carts_tb_variant_id_foreign` (`tb_variant_id`);

--
-- Chỉ mục cho bảng `tb_categories`
--
ALTER TABLE `tb_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tb_categories_name_unique` (`name`);

--
-- Chỉ mục cho bảng `tb_colors`
--
ALTER TABLE `tb_colors`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `tb_comments`
--
ALTER TABLE `tb_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_comments_user_id_foreign` (`user_id`),
  ADD KEY `tb_comments_tb_product_id_foreign` (`tb_product_id`),
  ADD KEY `tb_comments_parent_id_foreign` (`parent_id`);

--
-- Chỉ mục cho bảng `tb_contacts`
--
ALTER TABLE `tb_contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_contacts_user_id_foreign` (`user_id`);

--
-- Chỉ mục cho bảng `tb_discounts`
--
ALTER TABLE `tb_discounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tb_discounts_discount_code_unique` (`discount_code`);

--
-- Chỉ mục cho bảng `tb_images`
--
ALTER TABLE `tb_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_images_tb_variant_id_foreign` (`tb_variant_id`);

--
-- Chỉ mục cho bảng `tb_logo_banner`
--
ALTER TABLE `tb_logo_banner`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `tb_news`
--
ALTER TABLE `tb_news`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `tb_oderdetail_temp`
--
ALTER TABLE `tb_oderdetail_temp`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_oderdetail_temp_tb_oder_temp_id_foreign` (`tb_oder_temp_id`),
  ADD KEY `tb_oderdetail_temp_tb_product_id_foreign` (`tb_product_id`),
  ADD KEY `tb_oderdetail_temp_tb_variant_id_foreign` (`tb_variant_id`);

--
-- Chỉ mục cho bảng `tb_oders`
--
ALTER TABLE `tb_oders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_oders_user_id_foreign` (`user_id`),
  ADD KEY `tb_oders_tb_discount_id_foreign` (`tb_discount_id`);

--
-- Chỉ mục cho bảng `tb_oder_temps`
--
ALTER TABLE `tb_oder_temps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_oder_temps_user_id_foreign` (`user_id`),
  ADD KEY `tb_oder_temps_tb_discount_id_foreign` (`tb_discount_id`);

--
-- Chỉ mục cho bảng `tb_products`
--
ALTER TABLE `tb_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_products_tb_category_id_foreign` (`tb_category_id`),
  ADD KEY `tb_products_tb_brand_id_foreign` (`tb_brand_id`);

--
-- Chỉ mục cho bảng `tb_reviews`
--
ALTER TABLE `tb_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_reviews_user_id_foreign` (`user_id`),
  ADD KEY `tb_reviews_tb_product_id_foreign` (`tb_product_id`),
  ADD KEY `tb_reviews_order_id_foreign` (`order_id`);

--
-- Chỉ mục cho bảng `tb_roles`
--
ALTER TABLE `tb_roles`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `tb_sizes`
--
ALTER TABLE `tb_sizes`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `tb_statistics`
--
ALTER TABLE `tb_statistics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_statistics_tb_category_id_foreign` (`tb_category_id`);

--
-- Chỉ mục cho bảng `tb_variants`
--
ALTER TABLE `tb_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_variants_tb_product_id_foreign` (`tb_product_id`),
  ADD KEY `tb_variants_tb_size_id_foreign` (`tb_size_id`),
  ADD KEY `tb_variants_tb_color_id_foreign` (`tb_color_id`);

--
-- Chỉ mục cho bảng `tb__oderdetail`
--
ALTER TABLE `tb__oderdetail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb__oderdetail_tb_oder_id_foreign` (`tb_oder_id`),
  ADD KEY `tb__oderdetail_tb_product_id_foreign` (`tb_product_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_tb_role_id_foreign` (`tb_role_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tb_address_users`
--
ALTER TABLE `tb_address_users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `tb_brands`
--
ALTER TABLE `tb_brands`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `tb_carts`
--
ALTER TABLE `tb_carts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=288;

--
-- AUTO_INCREMENT cho bảng `tb_categories`
--
ALTER TABLE `tb_categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `tb_colors`
--
ALTER TABLE `tb_colors`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT cho bảng `tb_comments`
--
ALTER TABLE `tb_comments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tb_contacts`
--
ALTER TABLE `tb_contacts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `tb_discounts`
--
ALTER TABLE `tb_discounts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `tb_images`
--
ALTER TABLE `tb_images`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=209;

--
-- AUTO_INCREMENT cho bảng `tb_logo_banner`
--
ALTER TABLE `tb_logo_banner`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `tb_news`
--
ALTER TABLE `tb_news`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `tb_oderdetail_temp`
--
ALTER TABLE `tb_oderdetail_temp`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT cho bảng `tb_oders`
--
ALTER TABLE `tb_oders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=483;

--
-- AUTO_INCREMENT cho bảng `tb_oder_temps`
--
ALTER TABLE `tb_oder_temps`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT cho bảng `tb_products`
--
ALTER TABLE `tb_products`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=280;

--
-- AUTO_INCREMENT cho bảng `tb_reviews`
--
ALTER TABLE `tb_reviews`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT cho bảng `tb_roles`
--
ALTER TABLE `tb_roles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `tb_sizes`
--
ALTER TABLE `tb_sizes`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT cho bảng `tb_statistics`
--
ALTER TABLE `tb_statistics`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tb_variants`
--
ALTER TABLE `tb_variants`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=325;

--
-- AUTO_INCREMENT cho bảng `tb__oderdetail`
--
ALTER TABLE `tb__oderdetail`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=387;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_tb_product_id_foreign` FOREIGN KEY (`tb_product_id`) REFERENCES `tb_products` (`id`),
  ADD CONSTRAINT `favorites_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `tb_address_users`
--
ALTER TABLE `tb_address_users`
  ADD CONSTRAINT `tb_address_users_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `tb_carts`
--
ALTER TABLE `tb_carts`
  ADD CONSTRAINT `tb_carts_tb_product_id_foreign` FOREIGN KEY (`tb_product_id`) REFERENCES `tb_products` (`id`),
  ADD CONSTRAINT `tb_carts_tb_variant_id_foreign` FOREIGN KEY (`tb_variant_id`) REFERENCES `tb_variants` (`id`),
  ADD CONSTRAINT `tb_carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `tb_comments`
--
ALTER TABLE `tb_comments`
  ADD CONSTRAINT `tb_comments_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `tb_comments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tb_comments_tb_product_id_foreign` FOREIGN KEY (`tb_product_id`) REFERENCES `tb_products` (`id`),
  ADD CONSTRAINT `tb_comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `tb_contacts`
--
ALTER TABLE `tb_contacts`
  ADD CONSTRAINT `tb_contacts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tb_images`
--
ALTER TABLE `tb_images`
  ADD CONSTRAINT `tb_images_tb_variant_id_foreign` FOREIGN KEY (`tb_variant_id`) REFERENCES `tb_variants` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tb_oderdetail_temp`
--
ALTER TABLE `tb_oderdetail_temp`
  ADD CONSTRAINT `tb_oderdetail_temp_tb_oder_temp_id_foreign` FOREIGN KEY (`tb_oder_temp_id`) REFERENCES `tb_oder_temps` (`id`),
  ADD CONSTRAINT `tb_oderdetail_temp_tb_product_id_foreign` FOREIGN KEY (`tb_product_id`) REFERENCES `tb_products` (`id`),
  ADD CONSTRAINT `tb_oderdetail_temp_tb_variant_id_foreign` FOREIGN KEY (`tb_variant_id`) REFERENCES `tb_variants` (`id`);

--
-- Các ràng buộc cho bảng `tb_oders`
--
ALTER TABLE `tb_oders`
  ADD CONSTRAINT `tb_oders_tb_discount_id_foreign` FOREIGN KEY (`tb_discount_id`) REFERENCES `tb_discounts` (`id`),
  ADD CONSTRAINT `tb_oders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `tb_oder_temps`
--
ALTER TABLE `tb_oder_temps`
  ADD CONSTRAINT `tb_oder_temps_tb_discount_id_foreign` FOREIGN KEY (`tb_discount_id`) REFERENCES `tb_discounts` (`id`),
  ADD CONSTRAINT `tb_oder_temps_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `tb_products`
--
ALTER TABLE `tb_products`
  ADD CONSTRAINT `tb_products_tb_brand_id_foreign` FOREIGN KEY (`tb_brand_id`) REFERENCES `tb_brands` (`id`),
  ADD CONSTRAINT `tb_products_tb_category_id_foreign` FOREIGN KEY (`tb_category_id`) REFERENCES `tb_categories` (`id`);

--
-- Các ràng buộc cho bảng `tb_reviews`
--
ALTER TABLE `tb_reviews`
  ADD CONSTRAINT `tb_reviews_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `tb_oders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tb_reviews_tb_product_id_foreign` FOREIGN KEY (`tb_product_id`) REFERENCES `tb_products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tb_reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tb_statistics`
--
ALTER TABLE `tb_statistics`
  ADD CONSTRAINT `tb_statistics_tb_category_id_foreign` FOREIGN KEY (`tb_category_id`) REFERENCES `tb_categories` (`id`);

--
-- Các ràng buộc cho bảng `tb_variants`
--
ALTER TABLE `tb_variants`
  ADD CONSTRAINT `tb_variants_tb_color_id_foreign` FOREIGN KEY (`tb_color_id`) REFERENCES `tb_colors` (`id`),
  ADD CONSTRAINT `tb_variants_tb_product_id_foreign` FOREIGN KEY (`tb_product_id`) REFERENCES `tb_products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tb_variants_tb_size_id_foreign` FOREIGN KEY (`tb_size_id`) REFERENCES `tb_sizes` (`id`);

--
-- Các ràng buộc cho bảng `tb__oderdetail`
--
ALTER TABLE `tb__oderdetail`
  ADD CONSTRAINT `tb__oderdetail_tb_oder_id_foreign` FOREIGN KEY (`tb_oder_id`) REFERENCES `tb_oders` (`id`),
  ADD CONSTRAINT `tb__oderdetail_tb_product_id_foreign` FOREIGN KEY (`tb_product_id`) REFERENCES `tb_products` (`id`);

--
-- Các ràng buộc cho bảng `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_tb_role_id_foreign` FOREIGN KEY (`tb_role_id`) REFERENCES `tb_roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
