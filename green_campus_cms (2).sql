-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 19, 2026 at 04:34 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `green_campus_cms`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `footer_settings`
--

CREATE TABLE `footer_settings` (
  `id` int(11) NOT NULL DEFAULT 1,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`settings`)),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `footer_settings`
--

INSERT INTO `footer_settings` (`id`, `settings`, `updated_at`) VALUES
(1, '{\"faq_url\": \"https://www.youtube.com/watch?v=YOPZbW_KNN4&pp=0gcJCUwLAYcqIYzv\", \"tagline\": \"Smart Maritime Campus\", \"faq_label\": \"FAQ\", \"site_name\": \"PPNS\", \"terms_url\": \"https://www.youtube.com/watch?v=YOPZbW_KNN4&pp=0gcJCUwLAYcqIYzv\", \"description\": \"Building Indonesia Future Maritime Technology Ecosystem since 1996.\", \"privacy_url\": \"https://www.youtube.com/watch?v=YOPZbW_KNN4&pp=0gcJCUwLAYcqIYzv\", \"terms_label\": \"Syarat & Ketentuan\", \"twitter_url\": \"https://www.youtube.com/watch?v=YOPZbW_KNN4&pp=0gcJCUwLAYcqIYzv\", \"youtube_url\": \"https://www.youtube.com/watch?v=YOPZbW_KNN4&pp=0gcJCUwLAYcqIYzv\", \"facebook_url\": \"https://www.youtube.com/watch?v=YOPZbW_KNN4&pp=0gcJCUwLAYcqIYzv\", \"linkedin_url\": \"https://www.youtube.com/watch?v=YOPZbW_KNN4&pp=0gcJCUwLAYcqIYzv\", \"instagram_url\": \"https://www.youtube.com/watch?v=YOPZbW_KNN4&pp=0gcJCUwLAYcqIYzv\", \"privacy_label\": \"Kebijakan Privasi\"}', '2026-07-06 07:09:09');

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `url` varchar(500) NOT NULL,
  `thumbnail` varchar(500) DEFAULT NULL,
  `public_id` varchar(255) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`id`, `filename`, `url`, `thumbnail`, `public_id`, `width`, `height`, `mime_type`, `size`, `created_by`, `created_at`, `updated_at`) VALUES
(3, 'background.jpg', 'https://res.cloudinary.com/dycwak7mq/image/upload/v1782443081/green-campus/media/rhtbvi7tiyjonzggbsy2.jpg', 'https://res.cloudinary.com/dycwak7mq/image/upload/v1782443081/green-campus/media/rhtbvi7tiyjonzggbsy2.jpg', 'green-campus/media/rhtbvi7tiyjonzggbsy2', 2048, 1152, 'image/jpeg', 1563438, 1, '2026-06-26 03:04:42', '2026-06-26 03:04:42'),
(5, 'biokin9b7cjgmbzhaerq', 'https://res.cloudinary.com/dycwak7mq/image/upload/v1782704542/green-campus/biokin9b7cjgmbzhaerq.png', NULL, NULL, NULL, NULL, 'image/png', NULL, NULL, '2026-06-29 03:42:26', '2026-06-29 03:42:26'),
(6, 'sqdw5d28ojmvlhc1rgee', 'https://res.cloudinary.com/dycwak7mq/image/upload/v1782712053/green-campus/sqdw5d28ojmvlhc1rgee.jpg', NULL, NULL, NULL, NULL, 'image/jpeg', NULL, NULL, '2026-06-29 05:47:38', '2026-06-29 05:47:38'),
(7, 'g5dekvrciwdn9mqwxyi2', 'https://res.cloudinary.com/dycwak7mq/image/upload/v1782713462/green-campus/g5dekvrciwdn9mqwxyi2.png', NULL, NULL, NULL, NULL, 'image/png', NULL, NULL, '2026-06-29 06:11:06', '2026-06-29 06:11:06'),
(9, 'l0pfwa0f6tbrydvrsmvd', 'https://res.cloudinary.com/dycwak7mq/image/upload/v1783071804/green-campus/l0pfwa0f6tbrydvrsmvd.jpg', NULL, NULL, NULL, NULL, 'image/jpeg', NULL, NULL, '2026-07-03 09:43:27', '2026-07-03 09:43:27'),
(10, 'DANU CATUR.pdf', 'https://res.cloudinary.com/dycwak7mq/raw/upload/v1783072124/green-campus/reports/utdczmt5odljtemldyrc', NULL, NULL, NULL, NULL, 'application/pdf', NULL, NULL, '2026-07-03 09:48:45', '2026-07-03 09:48:45'),
(11, 'lykmcc2d81pmfvjduaft', 'https://res.cloudinary.com/dycwak7mq/image/upload/v1783305237/green-campus/lykmcc2d81pmfvjduaft.jpg', NULL, NULL, NULL, NULL, 'image/jpeg', NULL, NULL, '2026-07-06 02:34:01', '2026-07-06 02:34:01'),
(12, 'owukodac7amgkp0phjyj', 'https://res.cloudinary.com/dycwak7mq/image/upload/v1783305659/green-campus/owukodac7amgkp0phjyj.jpg', NULL, NULL, NULL, NULL, 'image/jpeg', NULL, NULL, '2026-07-06 02:41:02', '2026-07-06 02:41:02');

-- --------------------------------------------------------

--
-- Table structure for table `navbar_items`
--

CREATE TABLE `navbar_items` (
  `id` int(11) NOT NULL,
  `label` varchar(100) NOT NULL,
  `page_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `navbar_items`
--

INSERT INTO `navbar_items` (`id`, `label`, `page_id`, `parent_id`, `order_index`, `active`, `created_at`, `updated_at`) VALUES
(1, 'Beranda', 1, NULL, 0, 1, '2026-06-27 06:00:40', '2026-11-19 02:38:38'),
(2, 'Tentang', 3, NULL, 1, 1, '2026-06-27 06:00:40', '2026-11-19 02:39:50'),
(3, 'Program', 4, NULL, 4, 1, '2026-06-27 06:00:40', '2026-11-19 02:38:38'),
(4, 'Berita', 5, NULL, 3, 1, '2026-06-27 06:00:40', '2026-11-19 02:38:38'),
(5, 'Galeri', 6, NULL, 5, 1, '2026-06-27 06:00:40', '2026-11-19 02:38:38'),
(6, 'Kontak', 7, NULL, 7, 1, '2026-06-27 06:00:40', '2026-11-19 02:38:38'),
(7, 'Laporan', 8, NULL, 6, 1, '2026-06-27 06:00:41', '2026-11-19 02:38:38');

-- --------------------------------------------------------

--
-- Table structure for table `navbar_settings`
--

CREATE TABLE `navbar_settings` (
  `id` int(11) NOT NULL DEFAULT 1,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`settings`)),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `navbar_settings`
--

INSERT INTO `navbar_settings` (`id`, `settings`, `updated_at`) VALUES
(1, '{\"logo_url\":null,\"site_name\":\"PPNS\",\"admin_href\":\"/admin\",\"show_admin\":true,\"admin_label\":\"Admin\",\"info_akademik_href\":\"/program\",\"show_info_akademik\":true,\"info_akademik_label\":\"Info Akademik\"}', '2026-11-19 02:37:18');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `title` varchar(200) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `date` varchar(100) DEFAULT NULL,
  `published` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `slug`, `title`, `excerpt`, `content`, `color`, `image`, `date`, `published`, `created_at`, `updated_at`) VALUES
(1, 'panel-surya-10-gedung', 'PPNS Luncurkan Program Panel Surya di 10 Gedung Utama', 'Sebagai langkah menuju kampus hemat energi, PPNS memasang panel surya berkapasitas 500 kWp di seluruh gedung utama kampus.', '<p>PPNS mengambil langkah besar menuju kemandirian energi dengan meluncurkan program pemasangan panel surya di 10 gedung utama kampus. Proyek ini merupakan bagian dari komitmen institusi dalam mendukung transisi energi bersih dan mencapai target karbon netral pada tahun 2030.</p><p></p><p>Panel surya berkapasitas total 500 kWp yang dipasang diperkirakan dapat memenuhi 30% kebutuhan listrik harian kampus. Program ini tidak hanya mengurangi biaya operasional, tetapi juga menjadi laboratorium hidup bagi mahasiswa untuk mempelajari teknologi energi terbarukan secara langsung.</p><p></p><p>Kerjasama dengan PLN dan Kementerian ESDM memungkinkan kelebihan listrik yang dihasilkan dapat disalurkan kembali ke jaringan listrik nasional melalui skema net metering..</p><p></p><img src=\"https://res.cloudinary.com/dycwak7mq/image/upload/v1782712053/green-campus/sqdw5d28ojmvlhc1rgee.jpg\" alt=\"sqdw5d28ojmvlhc1rgee\"><p></p><div data-youtube-video=\"\"><iframe width=\"640\" height=\"480\" allowfullscreen=\"true\" autoplay=\"false\" disablekbcontrols=\"false\" enableiframeapi=\"false\" endtime=\"0\" ivloadpolicy=\"0\" loop=\"false\" modestbranding=\"true\" origin=\"\" playlist=\"\" rel=\"1\" src=\"https://www.youtube.com/embed/EYAmT1HmNSU?modestbranding=1&amp;rel=1\" start=\"0\"></iframe></div><p></p>', 'from-amber-500 to-orange-600', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80', '2026-07-02', 1, '2026-07-02 02:20:45', '2026-07-02 08:17:46'),
(2, 'juara-kapal-cepat-nasional', 'Mahasiswa PPNS Juara Kapal Cepat Nasional', 'Tim Kontes Kapal Cepat Indonesia (KKCTBN) dari PPNS berhasil meraih juara umum di ajang kompetisi nasional.', 'Tim Kontes Kapal Cepat Indonesia (KKCTBN) dari PPNS berhasil memboyong gelar juara umum pada ajang kompetisi nasional yang diselenggarakan di Surabaya. Prestasi ini menegaskan posisi PPNS sebagai institusi vokasi maritim terdepan di Indonesia.\n\nLima kategori lomba berhasil dimenangkan oleh mahasiswa PPNS, termasuk kategori desain kapal terbaik, kecepatan tertinggi, dan inovasi sistem propulsi. Kapal karya mahasiswa yang diberi nama \"Gurita Emas\" berhasil mencatatkan rekor kecepatan baru.\n\nKemenangan ini merupakan hasil dari program pengembangan bakat yang sistematis, dimana mahasiswa mendapatkan bimbingan dari dosen berpengalaman dan praktisi industri.', 'from-amber-500 to-orange-600', 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80', '28 April 2026', 1, '2026-07-02 02:20:45', '2026-07-02 03:03:02'),
(3, 'kerjasama-10-industri-maritim', 'PPNS Jalin Kerjasama dengan 10 Industri Maritim', 'Nota kesepahaman ditandatangani dengan perusahaan maritim terkemuka untuk program magang dan riset.', 'PPNS resmi menjalin kerjasama strategis dengan 10 perusahaan maritim terkemuka di Indonesia. Nota kesepahaman yang ditandatangani mencakup program magang, penelitian bersama, pengembangan kurikulum, dan penyerapan lulusan.\n\nPerusahaan-perusahaan yang terlibat meliputi galangan kapal nasional, operator pelayaran, perusahaan logistik maritim, dan konsultan teknik kelautan. Kerjasama ini diharapkan dapat memperkuat link and match antara dunia pendidikan dan industri.\n\nProgram magang industri yang terstruktur akan memungkinkan mahasiswa mendapatkan pengalaman kerja nyata selama satu semester penuh, dengan bimbingan langsung dari praktisi ahli di bidangnya.', 'from-emerald-500 to-emerald-700', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80', '10 April 2026', 1, '2026-07-02 02:20:45', '2026-07-02 02:20:45'),
(4, 'kapal-riset-mahasiswa', 'Launching Kapal Riset Mahasiswa PPNS', 'Kapal riset karya mahasiswa PPNS siap digunakan untuk ekspedisi kelautan dan penelitian maritim.', 'Kapal riset hasil karya mahasiswa PPNS resmi diluncurkan di dermaga kampus. Kapal yang diberi nama \"Samudra Biru\" ini merupakan hasil project-based learning yang melibatkan mahasiswa dari berbagai program studi selama dua tahun.\n\nKapal sepanjang 12 meter ini dilengkapi dengan sistem navigasi modern, laboratorium mini untuk pengambilan sampel air laut, dan panel surya sebagai sumber energi tambahan. Kapal ini akan digunakan untuk ekspedisi penelitian di perairan Jawa Timur.\n\nProyek ini membuktikan bahwa mahasiswa PPNS mampu mengaplikasikan ilmu yang dipelajari di kelas menjadi produk nyata yang memiliki nilai guna tinggi bagi masyarakat dan industri.', 'from-purple-500 to-purple-700', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80', '22 Maret 2026', 1, '2026-07-02 02:20:45', '2026-07-02 03:03:16'),
(9, 'fmipa-ui', 'FMIPA UI Raih Peringkat Pertama UI Green Metric Award 2024, Komitmen Wujudkan Kampus Berkelanjutan', 'Fakultas Matematika dan Ilmu Pengetahuan Alam Universitas Indonesia (FMIPA UI) berhasil meraih peringkat pertama dalam UI Green Metric Award 2024, menjadikannya sebagai fakultas paling berkelanjutan di lingkungan Universitas Indonesia (UI). ', '<p>Fakultas Matematika dan Ilmu Pengetahuan Alam Universitas Indonesia (FMIPA UI) berhasil meraih peringkat pertama dalam UI Green Metric Award 2024, menjadikannya sebagai fakultas paling berkelanjutan di lingkungan Universitas Indonesia (UI). Penghargaan ini diserahkan langsung kepada Dekan FMIPA UI, Prof. Dede Djuhana, Ph.D., dalam acara puncak Dies Natalis ke-74 UI yang digelar di Balairung UI, Senin (3/2/2025).</p><p style=\"text-align: justify;\">Pencapaian ini merupakan peningkatan signifikan dibandingkan tahun sebelumnya, di mana FMIPA UI berada di peringkat ketiga. Prof. Dede menegaskan bahwa keberhasilan ini tidak lepas dari konsistensi FMIPA UI dalam mendukung dan mengimplementasikan Sustainable Development Goals (SDGs), yang merupakan agenda global untuk menciptakan pembangunan berkelanjutan.</p><p style=\"text-align: justify;\">“Kami berkomitmen untuk terus mengambil peran aktif dalam menciptakan lingkungan kampus yang hijau dan ramah lingkungan. Kami berharap keberhasilan ini dapat menjadi motivasi bagi seluruh civitas akademika untuk terus berkontribusi dalam mewujudkan kampus yang lebih hijau dan berkelanjutan,” ujar Prof. Dede.</p><img src=\"https://greenmetric.sci-ui.id/wp-content/uploads/2025/09/DSC_8751-1-768x482-1.jpg\" alt=\"\" width=\"768\" height=\"482\"><p style=\"text-align: justify;\"></p><p style=\"text-align: justify;\">FMIPA UI menerapkan berbagai strategi untuk mewujudkan keberlanjutan di lingkungan kampus, salah satunya melalui pembangunan infrastruktur berkelanjutan. Upaya ini diwujudkan dengan pengembangan smart class yang mendukung proses pembelajaran hybrid, sehingga dapat mengurangi penggunaan kertas sekaligus meningkatkan efisiensi energi. Selain itu, pembangunan dan pemeliharaan vertical garden di beberapa gedung juga dilakukan sebagai langkah untuk memperluas ruang hijau di lingkungan kampus.</p><p style=\"text-align: justify;\">Dari aspek pengelolaan lingkungan dan sumber daya, FMIPA UI menerapkan sistem pengelolaan sampah terpadu guna meningkatkan tingkat daur ulang serta mengurangi limbah. Upaya penghijauan kampus terus dilakukan melalui penanaman puluhan bibit pohon untuk meningkatkan kualitas udara dan memperluas kawasan hijau. Selain itu, program plasticless dan paperless diimplementasikan untuk mengurangi penggunaan plastik dan kertas dalam berbagai aktivitas akademik maupun administrasi.</p><img src=\"https://res.cloudinary.com/dycwak7mq/image/upload/v1783071804/green-campus/l0pfwa0f6tbrydvrsmvd.jpg\" alt=\"l0pfwa0f6tbrydvrsmvd\"><p style=\"text-align: justify;\">Sementara itu, dalam hal efisiensi energi dan pengurangan emisi karbon, FMIPA UI memanfaatkan energi terbarukan serta menerapkan sistem hemat energi di berbagai fasilitas kampus. Optimalisasi sistem transportasi ramah lingkungan juga dilakukan untuk mengurangi jejak karbon.</p><p style=\"text-align: justify;\">Sepanjang tahun 2024, FMIPA UI juga terus meningkatkan jumlah program inovatif di bidang energi dan perubahan iklim, baik yang dikembangkan oleh dosen maupun mahasiswa. Upaya ini turut berkontribusi dalam mengantarkan FMIPA UI meraih gelar juara pada ajang UI GreenMetric Award 2025.</p><p style=\"text-align: justify;\">UI Green Metric merupakan pemeringkatan tahunan yang diselenggarakan oleh Universitas Indonesia (UI) untuk menilai komitmen universitas di seluruh dunia terhadap keberlanjutan lingkungan. Penilaian didasarkan pada tiga indikator utama, Environment (Lingkungan), Economic (Ekonomi dan Efisiensi Sumber Daya), dan Equity (Keadilan dan Sosial).</p>', NULL, 'https://res.cloudinary.com/dycwak7mq/image/upload/v1783071804/green-campus/l0pfwa0f6tbrydvrsmvd.jpg', '2026-07-07', 1, '2026-07-03 09:45:55', '2026-07-03 09:45:55');

-- --------------------------------------------------------

--
-- Table structure for table `news_tags`
--

CREATE TABLE `news_tags` (
  `id` int(11) NOT NULL,
  `news_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news_tags`
--

INSERT INTO `news_tags` (`id`, `news_id`, `tag_id`) VALUES
(34, 1, 8),
(9, 2, 3),
(3, 3, 2),
(1, 4, 1),
(40, 9, 1),
(41, 9, 41);

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`content`)),
  `slug` varchar(255) NOT NULL,
  `template` varchar(50) NOT NULL DEFAULT 'default',
  `description` text DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `featured_media_id` int(11) DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `published` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`id`, `title`, `content`, `slug`, `template`, `description`, `seo_title`, `seo_description`, `featured_media_id`, `status`, `published`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Beranda', '[{\"data\":{\"badge\":\"Politeknik Perkapalan Negeri Surabaya\",\"image\":\"https://res.cloudinary.com/dycwak7mq/image/upload/v1782443081/green-campus/media/rhtbvi7tiyjonzggbsy2.jpg\",\"stats\":[],\"title\":\"PPNS Smart\",\"subtitle\":\"Maritime Campus\",\"button_link\":\"/tentang\",\"button_text\":\"Lihat Informasi\",\"description\":\"Portal informasi akademik, inovasi teknologi, berita kampus, dan kolaborasi industri maritim modern.\",\"stats_badge\":\"Sorotan Kampus\",\"stats_footer\":\"Penerimaan Mahasiswa Baru 2026/2027 dibuka\"},\"type\":\"hero\"},{\"data\":{\"cards\":[{\"desc\":\"Terakreditasi Unggul & Baik Sekali\",\"label\":\"Program Studi\",\"value\":\"25\",\"suffix\":\"+\"},{\"desc\":\"Tersebar di 4 Fakultas\",\"label\":\"Mahasiswa Aktif\",\"value\":10000,\"suffix\":\"+\"},{\"desc\":\"Kerjasama Nasional & Internasional\",\"label\":\"Mitra Industri\",\"value\":500,\"suffix\":\"+\"},{\"desc\":\"Lulusan Terserap dalam 6 Bulan\",\"label\":\"Penyerapan Kerja\",\"value\":95,\"suffix\":\"%\"}]},\"type\":\"statistics\"},{\"data\":{\"items\":[],\"featured\":\"\"},\"type\":\"news\"},{\"data\":{\"title\":\"\",\"images\":[]},\"type\":\"gallery\"},{\"data\":{\"programs\":\"\",\"kerjasama\":\"\",\"facilities\":\"\",\"bento_items\":\"\"},\"type\":\"program\"},{\"data\":{\"maps\":\"\",\"email\":\"\",\"phone\":\"\",\"address\":\"\"},\"type\":\"contact\"},{\"data\":{\"items\":[{\"name\":\"Kementerian LHK\",\"image\":\"https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=200&h=100&fit=crop&auto=format\"},{\"name\":\"PLN\",\"image\":\"https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&h=100&fit=crop&auto=format\"},{\"name\":\"PERTAMINA\",\"image\":\"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=100&fit=crop&auto=format\"},{\"name\":\"UNESCO\",\"image\":\"https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200&h=100&fit=crop&auto=format\"},{\"name\":\"UNDP\",\"image\":\"https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=100&fit=crop&auto=format\"},{\"name\":\"World Bank\",\"image\":\"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=100&fit=crop&auto=format\"},{\"name\":\"Greenpeace\",\"image\":\"https://images.unsplash.com/photo-1542601906990-b4d3fb082b5e?w=200&h=100&fit=crop&auto=format\"},{\"name\":\"WWF Indonesia\",\"image\":\"https://images.unsplash.com/photo-1470071459604-4016e2f5ff5c?w=200&h=100&fit=crop&auto=format\"},{\"name\":\"ITS\",\"image\":\"https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=100&fit=crop&auto=format\"},{\"name\":\"Universitas Indonesia\",\"image\":\"https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&h=100&fit=crop&auto=format\"}]},\"type\":\"partners\"}]', '', 'home', 'Halaman utama Green Campus', 'Green Campus - PPNS', '', NULL, 'published', 1, NULL, '2026-06-26 00:36:52', '2026-11-19 02:44:39'),
(3, 'Tentang', '[{\"data\": {\"title\": \"Tentang PPNS\", \"bgImage\": \"https://res.cloudinary.com/dycwak7mq/image/upload/v1782443081/green-campus/media/rhtbvi7tiyjonzggbsy2.jpg\", \"subtitle\": \"Membangun Generasi Maritim Indonesia yang Unggul\"}, \"type\": \"pagehero\"}, {\"data\": {\"cards\": [{\"desc\": \"Terakreditasi Unggul & Baik Sekali\", \"label\": \"Program Studi\", \"value\": 25, \"suffix\": \"+\"}, {\"desc\": \"Tersebar di 4 Fakultas\", \"label\": \"Mahasiswa Aktif\", \"value\": 10000, \"suffix\": \"+\"}, {\"desc\": \"Kerjasama Nasional & Internasional\", \"label\": \"Mitra Industri\", \"value\": 500, \"suffix\": \"+\"}, {\"desc\": \"Lulusan Terserap dalam 6 Bulan\", \"label\": \"Penyerapan Kerja\", \"value\": 95, \"suffix\": \"%\"}]}, \"type\": \"statistics\"}, {\"data\": {\"items\": [{\"label\": \"Peringkat Akreditasi\", \"value\": \"A+\"}, {\"label\": \"Tahun Berdiri\", \"value\": \"1996\"}, {\"label\": \"Negara Mitra\", \"value\": \"15+\"}]}, \"type\": \"highlights\"}, {\"data\": {\"items\": [{\"desc\": \"Didirikan sebagai program studi di bawah ITS, fokus pada pendidikan vokasi perkapalan.\", \"year\": \"1996\", \"title\": \"Pendirian PPNS\"}, {\"desc\": \"Menjadi politeknik negeri mandiri dengan 3 program studi.\", \"year\": \"2001\", \"title\": \"Politeknik Mandiri\"}, {\"desc\": \"Pengembangan 5 program studi baru dan pembukaan fakultas teknik.\", \"year\": \"2008\", \"title\": \"Ekspansi Program\"}, {\"desc\": \"Peluncuran inisiatif Smart Maritime Campus dan digitalisasi kampus.\", \"year\": \"2015\", \"title\": \"Smart Campus\"}, {\"desc\": \"Jaringan mitra internasional dari 15 negara untuk riset dan pertukaran.\", \"year\": \"2020\", \"title\": \"Kerjasama Global\"}, {\"desc\": \"Meraih peringkat Unggul dari BAN-PT dengan 25 program studi.\", \"year\": \"2025\", \"title\": \"Akreditasi Unggul\"}]}, \"type\": \"timeline\"}, {\"data\": {\"items\": [{\"desc\": \"Kontes Kapal Cepat Indonesia\", \"year\": \"2026\", \"color\": \"from-amber-500 to-orange-600\", \"image\": \"https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&q=80\", \"title\": \"Juara Umum KKCTBN\"}, {\"desc\": \"Peringkat institusi tertinggi dari BAN-PT\", \"year\": \"2025\", \"color\": \"from-blue-500 to-blue-700\", \"image\": \"https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80\", \"title\": \"Akreditasi Unggul\"}, {\"desc\": \"Pendanaan riset maritim dari World Bank\", \"year\": \"2025\", \"color\": \"from-emerald-500 to-emerald-700\", \"image\": \"https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80\", \"title\": \"Hibah Riset Internasional\"}, {\"desc\": \"Penghargaan inovasi panel surya terapung\", \"year\": \"2024\", \"color\": \"from-purple-500 to-purple-700\", \"image\": \"https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80\", \"title\": \"Innovation Award\"}]}, \"type\": \"achievements\"}, {\"data\": {\"misi\": [\"Menyelenggarakan pendidikan vokasi di bidang perkapalan dan maritim yang berkualitas dan relevan dengan kebutuhan industri.\", \"Melaksanakan penelitian terapan yang mendukung inovasi teknologi maritim dan keberlanjutan lingkungan.\", \"Mengembangkan sistem pengabdian kepada masyarakat berbasis teknologi tepat guna di sektor maritim.\", \"Membangun kerjasama strategis dengan industri, pemerintah, dan institusi riset baik nasional maupun internasional.\", \"Mewujudkan tata kelola institusi yang transparan, akuntabel, dan berbasis teknologi informasi.\"], \"visi\": \"Menjadi politeknik perkapalan yang unggul, inovatif, dan berdaya saing global dalam pengembangan teknologi maritim yang berkelanjutan pada tahun 2030.\", \"sejarah\": [\"Politeknik Perkapalan Negeri Surabaya (PPNS) didirikan pada tahun 1996 sebagai institusi pendidikan vokasi di bidang perkapalan dan maritim. Berawal dari sebuah program studi di bawah naungan ITS, PPNS kemudian berkembang menjadi politeknik negeri yang mandiri dan terkemuka.\", \"Sejak berdiri, PPNS telah mencetak ribuan lulusan yang tersebar di berbagai sektor industri maritim, baik nasional maupun internasional. Dengan motto \\\"Smart Maritime Campus\\\", PPNS terus berinovasi dalam pengembangan pendidikan vokasi yang relevan dengan kebutuhan industri.\", \"Pada tahun 2025, PPNS meraih akreditasi Unggul dari BAN-PT, menegaskan posisinya sebagai salah satu politeknik terbaik di Indonesia. Kini PPNS memiliki 4 fakultas dengan 25 program studi yang mencakup berbagai bidang teknologi maritim.\"], \"pimpinan\": [{\"nama\": \"Dr. Ir. Bambang Susilo, M.T.\", \"jabatan\": \"Direktur\"}, {\"nama\": \"Dr. Eng. Dewi Sartika, S.T., M.Sc.\", \"jabatan\": \"Wakil Direktur I (Akademik)\"}, {\"nama\": \"Ir. Hendra Gunawan, M.T.\", \"jabatan\": \"Wakil Direktur II (Keuangan)\"}, {\"nama\": \"Rina Marlina, S.T., M.Kom.\", \"jabatan\": \"Wakil Direktur III (Kemahasiswaan)\"}]}, \"type\": \"aboutdetail\"}, {\"data\": {\"title\": \"Jelajahi Program Studi PPNS\", \"bgImage\": \"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1920&q=80\", \"buttons\": [{\"link\": \"/program\", \"label\": \"Lihat Program\", \"variant\": \"primary\"}, {\"link\": \"/kontak\", \"label\": \"Hubungi Kami\", \"variant\": \"secondary\"}], \"description\": \"<p><span style=\\\"\\\">Temukan program studi yang sesuai dengan minat dan bakat Anda di bidang maritim.</span></p>\"}, \"type\": \"cta\"}]', 'tentang', 'about', 'Tentang Green Campus', 'Tentang - Green Campus', '', NULL, 'published', 1, NULL, '2026-06-26 01:46:16', '2026-06-29 04:51:29'),
(4, 'Program', '[{\"data\": {\"title\": \"Program Unggulan\", \"bgImage\": \"https://res.cloudinary.com/dycwak7mq/image/upload/v1782704542/green-campus/biokin9b7cjgmbzhaerq.png\", \"subtitle\": \"Program pendidikan dan inovasi maritim modern\"}, \"type\": \"pagehero\"}, {\"data\": {\"badge\": \"Inovasi Unggulan\", \"items\": [{\"desc\": \"Pembelajaran berbasis industri maritim dengan standar global yang terintegrasi langsung ke dunia kerja.\", \"icon\": \"Factory\", \"size\": \"large\", \"color\": \"from-blue-600 to-blue-800\", \"image\": \"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80\", \"title\": \"Teaching Factory\"}, {\"desc\": \"Pusat riset maritim dengan 12 laboratorium modern dan 50+ publikasi internasional per tahun.\", \"icon\": \"FlaskConical\", \"size\": \"small\", \"color\": \"from-amber-500 to-orange-600\", \"image\": \"https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80\", \"title\": \"Riset & Inovasi\"}, {\"desc\": \"Infrastruktur digital terpadu untuk mendukung ekosistem pembelajaran abad 21.\", \"icon\": \"Monitor\", \"size\": \"wide\", \"color\": \"from-emerald-500 to-emerald-700\", \"image\": \"https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80\", \"title\": \"Smart Campus\"}, {\"desc\": \"Pengembangan kompetensi di bidang otomatisasi, IoT, dan AI untuk sektor maritim.\", \"icon\": \"Cpu\", \"size\": \"small\", \"color\": \"from-purple-500 to-purple-700\", \"image\": \"https://res.cloudinary.com/dycwak7mq/image/upload/v1783305237/green-campus/lykmcc2d81pmfvjduaft.jpg\", \"title\": \"Industri 4.0\"}], \"title\": \"Program\", \"highlight\": \"Unggulan\"}, \"type\": \"bento\"}, {\"data\": {\"badge\": \"Program Studi\", \"items\": [{\"desc\": \"Program unggulan yang mencetak tenaga ahli di bidang perancangan, konstruksi, dan produksi kapal.\", \"icon\": \"Ship\", \"color\": \"from-blue-600 to-blue-800\", \"image\": \"https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80\", \"title\": \"Teknik Perkapalan\"}, {\"desc\": \"Fokus pada sistem kelistrikan kapal, otomasi, dan distribusi tenaga listrik maritim.\", \"icon\": \"Zap\", \"color\": \"from-amber-500 to-orange-600\", \"image\": \"https://images.unsplash.com/photo-1581092335391-9583eb1c0f6a?w=800&q=80\", \"title\": \"Teknik Kelistrikan\"}, {\"desc\": \"Penguasaan teknologi permesinan kapal, sistem propulsi, dan pemeliharaan mesin industri.\", \"icon\": \"Cog\", \"color\": \"from-emerald-500 to-emerald-700\", \"image\": \"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80\", \"title\": \"Teknik Mesin\"}, {\"desc\": \"Spesialisasi dalam permesinan presisi, manufaktur komponen kapal, dan pengelasan.\", \"icon\": \"Wrench\", \"color\": \"from-purple-500 to-purple-700\", \"image\": \"https://images.unsplash.com/photo-1581092335871-4bcb5c2c0c4b?w=800&q=80\", \"title\": \"Teknik Permesinan\"}, {\"desc\": \"Program D4 yang mengintegrasikan rekayasa teknologi dengan aplikasi industri maritim.\", \"icon\": \"Microscope\", \"color\": \"from-cyan-500 to-cyan-700\", \"image\": \"https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80\", \"title\": \"Teknologi Rekayasa\"}, {\"desc\": \"Pendalaman sistem kontrol otomatis, robotika, dan IoT untuk industri perkapalan.\", \"icon\": \"Cpu\", \"color\": \"from-rose-500 to-rose-700\", \"image\": \"https://images.unsplash.com/photo-1581092335391-9583eb1c0f6a?w=800&q=80\", \"title\": \"Teknik Otomasi\"}], \"title\": \"Semua\", \"highlight\": \"Program\", \"description\": \"PPNS menawarkan enam program studi unggulan di bidang teknologi maritim yang dirancang untuk memenuhi kebutuhan industri global.\"}, \"type\": \"programs\"}, {\"data\": {\"badge\": \"Fasilitas\", \"items\": [{\"desc\": \"Laboratorium riset maritim dengan peralatan tercanggih untuk penelitian dan pengembangan teknologi kapal.\", \"color\": \"from-blue-500 to-blue-700\", \"image\": \"https://res.cloudinary.com/dycwak7mq/image/upload/v1783305237/green-campus/lykmcc2d81pmfvjduaft.jpg\", \"title\": \"Lab Maritim\"}, {\"desc\": \"Perpustakaan digital dengan akses ke ribuan jurnal internasional dan ruang belajar kolaboratif.\", \"color\": \"from-indigo-500 to-indigo-700\", \"image\": \"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80\", \"title\": \"Smart Library\"}, {\"desc\": \"Bengkel kerja kapal seluas 2.000 m² dengan fasilitas produksi dan perbaikan kapal skala penuh.\", \"color\": \"from-amber-500 to-amber-700\", \"image\": \"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80\", \"title\": \"Workshop Kapal\"}, {\"desc\": \"Laboratorium simulasi navigasi kapal berbasis VR untuk pelatihan calon perwira pelayaran.\", \"color\": \"from-emerald-500 to-emerald-700\", \"image\": \"https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80\", \"title\": \"Simulator Navigasi\"}], \"title\": \"Fasilitas\", \"highlight\": \"Modern\"}, \"type\": \"facilities\"}, {\"data\": {\"items\": [{\"label\": \"Program Studi\", \"value\": \"25+\"}, {\"label\": \"Terakreditasi\", \"value\": \"100%\"}, {\"label\": \"Mahasiswa Aktif\", \"value\": \"10.000+\"}]}, \"type\": \"highlights\"}, {\"data\": {\"badge\": \"Kerjasama\", \"items\": [{\"logo\": \"PAL\", \"name\": \"PAL Indonesia\", \"image\": \"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=100&fit=crop&auto=format\", \"bidang\": \"Galangan Kapal\"}, {\"logo\": \"Pertamina\", \"name\": \"Pertamina\", \"image\": \"https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&h=100&fit=crop&auto=format\", \"bidang\": \"Energi Maritim\"}, {\"logo\": \"Pelindo\", \"name\": \"Pelindo\", \"image\": \"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=100&fit=crop&auto=format\", \"bidang\": \"Kepelabuhan\"}, {\"logo\": \"DPS\", \"name\": \"PT. Dok & Perkapalan\", \"image\": \"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=100&fit=crop&auto=format\", \"bidang\": \"Reparasi Kapal\"}, {\"logo\": \"ABS\", \"name\": \"ABS Consulting\", \"image\": \"https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=100&fit=crop&auto=format\", \"bidang\": \"Sertifikasi\"}, {\"logo\": \"BKI\", \"name\": \"BKI\", \"image\": \"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=100&fit=crop&auto=format\", \"bidang\": \"Klasifikasi\"}], \"title\": \"Mitra\", \"highlight\": \"Industri\"}, \"type\": \"kerjasama\"}, {\"data\": {\"title\": \"Siap Bergabung dengan PPNS?\", \"bgImage\": \"https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1920&q=80\", \"buttons\": [{\"link\": \"/kontak\", \"label\": \"Hubungi Kami\", \"variant\": \"primary\"}, {\"link\": \"/berita\", \"label\": \"Lihat Berita Terkini\", \"variant\": \"secondary\"}], \"description\": \"Mulai perjalanan Anda menuju karir di industri maritim global bersama PPNS.\"}, \"type\": \"cta\"}]', 'program', 'program', 'Program Green Campus', 'Program - Green Campus', NULL, NULL, 'published', 1, NULL, '2026-06-26 01:46:16', '2026-07-06 07:23:33'),
(5, 'Berita', '[{\"data\": {\"title\": \"Berita Kampus\", \"bgImage\": \"https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1440&q=80\", \"subtitle\": \"Informasi terbaru seputar PPNS\"}, \"type\": \"pagehero\"}, {\"data\": {\"items\": [{\"tag\": \"Energi\", \"date\": \"15 Mei 2026\", \"slug\": \"panel-surya-10-gedung\", \"color\": \"from-blue-500 to-blue-700\", \"image\": \"https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80\", \"title\": \"PPNS Luncurkan Program Panel Surya di 10 Gedung Utama\", \"content\": \"PPNS mengambil langkah besar menuju kemandirian energi dengan meluncurkan program pemasangan panel surya di 10 gedung utama kampus. Proyek ini merupakan bagian dari komitmen institusi dalam mendukung transisi energi bersih dan mencapai target karbon netral pada tahun 2030.\\n\\nPanel surya berkapasitas total 500 kWp yang dipasang diperkirakan dapat memenuhi 30% kebutuhan listrik harian kampus. Program ini tidak hanya mengurangi biaya operasional, tetapi juga menjadi laboratorium hidup bagi mahasiswa untuk mempelajari teknologi energi terbarukan secara langsung.\\n\\nKerjasama dengan PLN dan Kementerian ESDM memungkinkan kelebihan listrik yang dihasilkan dapat disalurkan kembali ke jaringan listrik nasional melalui skema net metering.\", \"excerpt\": \"Sebagai langkah menuju kampus hemat energi, PPNS memasang panel surya berkapasitas 500 kWp di seluruh gedung utama kampus.\"}, {\"tag\": \"Prestasi\", \"date\": \"28 April 2026\", \"slug\": \"juara-kapal-cepat-nasional\", \"color\": \"from-amber-500 to-orange-600\", \"image\": \"https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80\", \"title\": \"Mahasiswa PPNS Juara Kapal Cepat Nasional\", \"excerpt\": \"Tim Kontes Kapal Cepat Indonesia (KKCTBN) dari PPNS berhasil meraih juara umum di ajang kompetisi nasional.\"}, {\"tag\": \"Kerjasama\", \"date\": \"10 April 2026\", \"slug\": \"kerjasama-10-industri-maritim\", \"color\": \"from-emerald-500 to-emerald-700\", \"image\": \"https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80\", \"title\": \"PPNS Jalin Kerjasama dengan 10 Industri Maritim\", \"excerpt\": \"Nota kesepahaman ditandatangani dengan perusahaan maritim terkemuka untuk program magang dan riset.\"}, {\"tag\": \"Inovasi\", \"date\": \"22 Maret 2026\", \"slug\": \"kapal-riset-mahasiswa\", \"color\": \"from-purple-500 to-purple-700\", \"image\": \"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80\", \"title\": \"Launching Kapal Riset Mahasiswa PPNS\", \"excerpt\": \"Kapal riset karya mahasiswa PPNS siap digunakan untuk ekspedisi kelautan dan penelitian maritim.\"}], \"featured\": [{\"tag\": \"Energi\", \"date\": \"15 Mei 2026\", \"slug\": \"panel-surya-10-gedung\", \"color\": \"from-blue-500 to-blue-700\", \"image\": \"https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80\", \"title\": \"PPNS Luncurkan Program Panel Surya di 10 Gedung Utama\", \"content\": \"PPNS mengambil langkah besar menuju kemandirian energi dengan meluncurkan program pemasangan panel surya di 10 gedung utama kampus. Proyek ini merupakan bagian dari komitmen institusi dalam mendukung transisi energi bersih dan mencapai target karbon netral pada tahun 2030.\\n\\nPanel surya berkapasitas total 500 kWp yang dipasang diperkirakan dapat memenuhi 30% kebutuhan listrik harian kampus. Program ini tidak hanya mengurangi biaya operasional, tetapi juga menjadi laboratorium hidup bagi mahasiswa untuk mempelajari teknologi energi terbarukan secara langsung.\\n\\nKerjasama dengan PLN dan Kementerian ESDM memungkinkan kelebihan listrik yang dihasilkan dapat disalurkan kembali ke jaringan listrik nasional melalui skema net metering.\", \"excerpt\": \"Sebagai langkah menuju kampus hemat energi, PPNS memasang panel surya berkapasitas 500 kWp di seluruh gedung utama kampus.\"}, {\"tag\": \"Prestasi\", \"date\": \"28 April 2026\", \"slug\": \"juara-kapal-cepat-nasional\", \"color\": \"from-amber-500 to-orange-600\", \"image\": \"https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80\", \"title\": \"Mahasiswa PPNS Juara Kapal Cepat Nasional\", \"excerpt\": \"Tim Kontes Kapal Cepat Indonesia (KKCTBN) dari PPNS berhasil meraih juara umum di ajang kompetisi nasional.\"}, {\"tag\": \"Kerjasama\", \"date\": \"10 April 2026\", \"slug\": \"kerjasama-10-industri-maritim\", \"color\": \"from-emerald-500 to-emerald-700\", \"image\": \"https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80\", \"title\": \"PPNS Jalin Kerjasama dengan 10 Industri Maritim\", \"excerpt\": \"Nota kesepahaman ditandatangani dengan perusahaan maritim terkemuka untuk program magang dan riset.\"}]}, \"type\": \"news\"}]', 'berita', 'berita', 'Berita dan informasi', 'Berita - Green Campus', NULL, NULL, 'published', 1, NULL, '2026-06-26 01:46:16', '2026-06-28 14:14:03'),
(6, 'Galeri', '[{\"data\": {\"title\": \"Galeri Kampus\", \"bgImage\": \"https://images.unsplash.com/photo-1562774053-701939374585?w=1440&q=80\", \"subtitle\": \"Jelajahi momen dan fasilitas terbaik PPNS melalui lensa\"}, \"type\": \"pagehero\"}, {\"data\": {\"items\": [{\"label\": \"Foto Tersedia\", \"value\": \"200+\"}, {\"label\": \"Fasilitas Terekam\", \"value\": \"12\"}, {\"label\": \"Kategori Galeri\", \"value\": \"9\"}]}, \"type\": \"highlights\"}, {\"data\": {\"items\": [{\"desc\": \"Pusat administrasi dan pelayanan akademik\", \"color\": \"from-blue-400 to-blue-600\", \"image\": \"https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80\", \"title\": \"Gedung Rektorat\", \"category\": \"Kampus\"}, {\"desc\": \"Laboratorium riset maritim modern\", \"color\": \"from-amber-400 to-amber-600\", \"image\": \"https://res.cloudinary.com/dycwak7mq/image/upload/v1783305237/green-campus/lykmcc2d81pmfvjduaft.jpg\", \"title\": \"Lab Maritim\", \"category\": \"Laboratorium\"}, {\"desc\": \"Pusat literasi digital dan riset\", \"color\": \"from-indigo-400 to-indigo-600\", \"image\": \"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80\", \"title\": \"Perpustakaan\", \"category\": \"Kampus\"}, {\"desc\": \"Lingkungan kampus yang asri\", \"color\": \"from-emerald-400 to-emerald-600\", \"image\": \"https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80\", \"title\": \"Area Kampus\", \"category\": \"Kampus\"}, {\"desc\": \"Fasilitas pembelajaran modern\", \"color\": \"from-cyan-400 to-cyan-600\", \"image\": \"https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80\", \"title\": \"Ruang Kelas\", \"category\": \"Kampus\"}, {\"desc\": \"Kapal riset karya mahasiswa PPNS\", \"color\": \"from-rose-400 to-rose-600\", \"image\": \"https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80\", \"title\": \"Kapal Riset\", \"category\": \"Prestasi\"}, {\"desc\": \"Pusat kegiatan keagamaan mahasiswa\", \"color\": \"from-teal-400 to-teal-600\", \"image\": \"https://res.cloudinary.com/dycwak7mq/image/upload/v1783305659/green-campus/owukodac7amgkp0phjyj.jpg\", \"title\": \"Masjid Kampus\", \"category\": \"Kampus\"}, {\"desc\": \"Ruang kreativitas dan kegiatan mahasiswa\", \"color\": \"from-pink-400 to-pink-600\", \"image\": \"https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80\", \"title\": \"Student Center\", \"category\": \"Kegiatan\"}, {\"desc\": \"Fasilitas computing dan simulasi maritim\", \"color\": \"from-violet-400 to-violet-600\", \"image\": \"https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80\", \"title\": \"Lab Komputer\", \"category\": \"Laboratorium\"}], \"categories\": [\"Kampus\", \"Laboratorium\", \"Kegiatan\", \"Prestasi\"]}, \"type\": \"gallery\"}, {\"data\": {\"title\": \"Kunjungi Kampus Kami\", \"bgImage\": \"https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80\", \"buttons\": [{\"link\": \"#\", \"label\": \"Jadwalkan Kunjungan\", \"variant\": \"primary\"}], \"description\": \"Lihat langsung fasilitas modern dan lingkungan kampus yang inspiratif.\"}, \"type\": \"cta\"}]', 'galeri', 'galeri', 'Galeri foto', 'Galeri - Green Campus', NULL, NULL, 'published', 1, NULL, '2026-06-26 01:46:16', '2026-07-06 02:41:10'),
(7, 'Kontak', '[{\"data\": {\"title\": \"Kontak Kami\", \"bgImage\": \"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1440&q=80\", \"subtitle\": \"Hubungi PPNS untuk informasi akademik, kerja sama, dan kunjungan kampus\"}, \"type\": \"pagehero\"}, {\"data\": {\"maps\": \"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.635654321234!2d112.789!3d-7.293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPPNS!5e0!3m2!1sid!2sid!4v1\", \"email\": \"info@ppns.ac.id\", \"phone\": \"+62 31 594 7264\", \"address\": \"Jl. Teknik Kimia, Keputih, Kec. Sukolilo, Surabaya 60111\"}, \"type\": \"contact\"}, {\"data\": {\"title\": \"Tanyakan pada Kami\", \"bgImage\": \"https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80\", \"buttons\": [{\"link\": \"mailto:info@ppns.ac.id\", \"label\": \"Kirim Pesan\", \"variant\": \"primary\"}], \"description\": \"Tim PPNS siap membantu pertanyaan Anda terkait pendidikan dan kerjasama.\"}, \"type\": \"cta\"}]', 'kontak', 'kontak', 'Kontak kami', 'Kontak - Green Campus', NULL, NULL, 'published', 1, NULL, '2026-06-26 01:46:16', '2026-07-06 07:11:19'),
(8, 'Laporan', '[{\"data\": {\"title\": \"Laporan & Dokumen\", \"bgImage\": \"https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1440&q=80\", \"subtitle\": \"Dokumentasi dan laporan program Green Campus PPNS\"}, \"type\": \"pagehero\"}, {\"data\": {\"badge\": \"Dokumen\", \"items\": [{\"title\": \"Laporan Keberlanjutan 2025\", \"description\": \"Dokumen lengkap capaian dan target program Green Campus tahun 2025. (4.2 MB, PDF)\"}, {\"title\": \"Rencana Aksi Green Campus\", \"description\": \"Strategi dan roadmap program keberlanjutan jangka panjang PPNS. (2.8 MB, PDF)\"}, {\"title\": \"Data Emisi Karbon Kampus\", \"description\": \"Laporan inventarisasi emisi gas rumah kaca seluruh area kampus. (1.5 MB, XLSX)\"}, {\"title\": \"Pedoman Green Campus\", \"description\": \"Buku panduan pelaksanaan program dan kebijakan lingkungan kampus. (3.1 MB, PDF)\"}, {\"title\": \"Laporan Keuangan Hijau 2025\", \"description\": \"Transparansi pengelolaan dana program keberlanjutan lingkungan kampus. (2.3 MB, PDF)\"}, {\"title\": \"Audit Energi Kampus\", \"description\": \"Evaluasi konsumsi energi dan rekomendasi efisiensi di seluruh area kampus. (3.7 MB, PDF)\"}], \"title\": \"Laporan\", \"highlight\": \"Green Campus\", \"description\": \"Dokumen lengkap mengenai program keberlanjutan dan Green Campus di PPNS.\"}, \"type\": \"features\"}]', 'laporan', 'laporan', 'Laporan kegiatan', 'Laporan - Green Campus', NULL, NULL, 'published', 1, NULL, '2026-06-26 01:46:16', '2026-06-28 14:14:03');

-- --------------------------------------------------------

--
-- Table structure for table `page_blocks`
--

CREATE TABLE `page_blocks` (
  `id` int(11) NOT NULL,
  `page_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`content`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `page_blocks`
--

INSERT INTO `page_blocks` (`id`, `page_id`, `type`, `sort_order`, `content`, `created_at`, `updated_at`) VALUES
(153, 1, 'hero', 0, '{\"title\": \"Green Campus PPNS\", \"bgImage\": \"https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80\", \"buttons\": [{\"link\": \"/tentang\", \"text\": \"Jelajahi\"}, {\"link\": \"/program\", \"text\": \"Program Kami\"}], \"subtitle\": \"Membangun Kampus Berkelanjutan menuju Indonesia Hijau\", \"breadcrumb\": \"Beranda\"}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(154, 1, 'statistics', 1, '{\"cards\": [{\"label\": \"Mahasiswa\", \"number\": \"500+\", \"suffix\": \"\"}, {\"label\": \"Dosen & Tenaga Pendidik\", \"number\": \"50+\", \"suffix\": \"\"}, {\"label\": \"Program Studi\", \"number\": \"12\", \"suffix\": \"\"}, {\"label\": \"Mitra Industri\", \"number\": \"30+\", \"suffix\": \"\"}]}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(155, 1, 'features', 2, '{\"items\": [{\"icon\": \"\", \"title\": \"Energi Terbarukan\", \"description\": \"Pemanfaatan panel surya di 10 gedung kampus sebagai sumber energi listrik ramah lingkungan.\"}, {\"icon\": \"\", \"title\": \"Pengelolaan Sampah\", \"description\": \"Program daur ulang dan pengurangan sampah plastik yang melibatkan seluruh civitas akademika.\"}, {\"icon\": \"\", \"title\": \"Kawasan Hijau\", \"description\": \"Penghijauan kampus dengan lebih dari 500 pohon dan taman-taman terbuka hijau.\"}, {\"icon\": \"\", \"title\": \"Edukasi Lingkungan\", \"description\": \"Program edukasi dan kesadaran lingkungan bagi mahasiswa dan masyarakat sekitar.\"}]}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(156, 1, 'cta', 3, '{\"title\": \"Bergabunglah dengan Gerakan Green Campus\", \"bgColor\": \"#0F172A\", \"bgImage\": \"https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80\", \"buttons\": [{\"link\": \"/kontak\", \"text\": \"Hubungi Kami\"}], \"description\": \"Mari bersama-sama mewujudkan kampus yang ramah lingkungan dan berkelanjutan untuk generasi mendatang.\"}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(157, 1, 'news', 4, '{\"title\": \"Berita Terbaru\", \"subtitle\": \"Ikuti perkembangan dan kegiatan Green Campus PPNS\", \"showCount\": 3}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(158, 3, 'hero', 0, '{\"title\": \"Tentang Green Campus PPNS\", \"bgImage\": \"https://images.unsplash.com/photo-1562774053-701939374585?w=1440&q=80\", \"buttons\": [], \"subtitle\": \"Mewujudkan Kampus Berkelanjutan Berbasis Maritim\", \"breadcrumb\": \"Beranda > Tentang\"}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(159, 3, 'vision_mission', 1, '{\"vision\": \"Menjadi Politeknik Maritim terdepan dalam mewujudkan kampus berkelanjutan yang ramah lingkungan, berwawasan maritim, dan berdaya saing global pada tahun 2030.\", \"mission\": [\"Menyelenggarakan pendidikan vokasi maritim yang berwawasan lingkungan hidup.\", \"Melaksanakan penelitian terapan di bidang energi terbarukan dan kelestarian lingkungan maritim.\", \"Mengembangkan sistem pengelolaan kampus yang ramah lingkungan dan berkelanjutan.\", \"Membangun kemitraan strategis dengan industri dan komunitas dalam program pelestarian lingkungan.\", \"Menanamkan kesadaran dan budaya hijau kepada seluruh civitas akademika.\"]}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(160, 3, 'history', 2, '{\"html\": \"<h2>Sejarah Green Campus PPNS</h2><p>Program Green Campus di Politeknik Perkapalan Negeri Surabaya (PPNS) dimulai pada tahun 2020 sebagai bagian dari komitmen institusi dalam mendukung pembangunan berkelanjutan. Berawal dari inisiatif sekelompok mahasiswa dan dosen yang peduli lingkungan, program ini berkembang menjadi gerakan kampus yang melibatkan seluruh elemen kampus.</p><p>Pada tahun 2022, PPNS secara resmi mencanangkan program Green Campus dengan fokus pada empat pilar utama: energi terbarukan, pengelolaan sampah, penghijauan kampus, dan edukasi lingkungan. Lebih dari 500 pohon ditanam di area kampus dan panel surya dipasang di 10 gedung untuk mengurangi ketergantungan pada energi fosil.</p><p>Hingga saat ini, Green Campus PPNS terus berkembang dengan berbagai program inovatif yang melibatkan mahasiswa, dosen, tenaga kependidikan, dan masyarakat sekitar.</p>\"}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(161, 3, 'statistics', 3, '{\"cards\": [{\"label\": \"Gedung Berpanel Surya\", \"number\": \"10\", \"suffix\": \"\"}, {\"label\": \"Pohon Ditanam\", \"number\": \"500+\", \"suffix\": \"\"}, {\"label\": \"Tahun Berjalan\", \"number\": \"5\", \"suffix\": \"\"}, {\"label\": \"Partisipasi Civitas\", \"number\": \"100%\", \"suffix\": \"\"}]}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(162, 3, 'cta', 4, '{\"title\": \"Mari Berpartisipasi\", \"bgColor\": \"#1E293B\", \"bgImage\": \"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1920&q=80\", \"buttons\": [{\"link\": \"/program\", \"text\": \"Daftar Program\"}, {\"link\": \"/kontak\", \"text\": \"Hubungi Kami\"}], \"description\": \"Ikuti program Green Campus dan jadilah bagian dari perubahan menuju kampus yang lebih hijau dan berkelanjutan.\"}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(163, 4, 'hero', 0, '{\"title\": \"Program Green Campus\", \"bgImage\": \"https://images.unsplash.com/photo-1581092335391-9583eb1c0f6a?w=1440&q=80\", \"buttons\": [], \"subtitle\": \"Berbagai program unggulan untuk mewujudkan kampus berkelanjutan\", \"breadcrumb\": \"Beranda > Program\"}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(164, 4, 'program_list', 1, '{\"items\": [{\"icon\": \"\", \"link\": \"\", \"title\": \"Program Energi Terbarukan\", \"description\": \"Pemasangan dan pengelolaan panel surya, serta optimalisasi efisiensi energi di seluruh gedung kampus.\"}, {\"icon\": \"\", \"link\": \"\", \"title\": \"Program Pengelolaan Sampah\", \"description\": \"Sistem pengelolaan sampah terpadu mencakup pemilahan, daur ulang, dan pengolahan sampah organik.\"}, {\"icon\": \"\", \"link\": \"\", \"title\": \"Program Penghijauan Kampus\", \"description\": \"Penanaman pohon, pembuatan taman vertikal, dan pengembangan ruang terbuka hijau di area kampus.\"}, {\"icon\": \"\", \"link\": \"\", \"title\": \"Program Edukasi Lingkungan\", \"description\": \"Seminar, workshop, dan kampanye kesadaran lingkungan untuk civitas akademika dan masyarakat.\"}, {\"icon\": \"\", \"link\": \"\", \"title\": \"Program Transportasi Hijau\", \"description\": \"Pengembangan jalur sepeda, transportasi listrik, dan fasilitas pejalan kaki di lingkungan kampus.\"}, {\"icon\": \"\", \"link\": \"\", \"title\": \"Program Konservasi Air\", \"description\": \"Sistem penampungan air hujan, pengolahan air limbah, dan kampanye hemat air di seluruh area kampus.\"}]}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(165, 4, 'cta', 2, '{\"title\": \"Tertarik dengan Program Kami?\", \"bgColor\": \"#0F172A\", \"bgImage\": \"https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1920&q=80\", \"buttons\": [{\"link\": \"/kontak\", \"text\": \"Hubungi Kami\"}], \"description\": \"Hubungi kami untuk informasi lebih lanjut atau pendaftaran program.\"}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(166, 5, 'hero', 0, '{\"title\": \"Berita\", \"bgImage\": \"https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1440&q=80\", \"buttons\": [], \"subtitle\": \"Informasi terbaru seputar kegiatan Green Campus PPNS\", \"breadcrumb\": \"Beranda > Berita\"}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(167, 5, 'content', 1, '{\"html\": \"<p>Selamat datang di halaman berita Green Campus PPNS. Temukan informasi terbaru seputar kegiatan, program, dan pencapaian kami dalam mewujudkan kampus berkelanjutan.</p>\"}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(168, 5, 'cta', 2, '{\"title\": \"Ikuti Perkembangan PPNS\", \"bgColor\": \"#0F172A\", \"bgImage\": \"https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&q=80\", \"buttons\": [{\"link\": \"/kontak\", \"text\": \"Hubungi Kami\"}], \"description\": \"Dapatkan informasi terbaru seputar kegiatan dan prestasi kampus.\"}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(169, 6, 'hero', 0, '{\"title\": \"Galeri\", \"bgImage\": \"https://images.unsplash.com/photo-1562774053-701939374585?w=1440&q=80\", \"buttons\": [], \"subtitle\": \"Dokumentasi kegiatan Green Campus PPNS\", \"breadcrumb\": \"Beranda > Galeri\"}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(170, 6, 'gallery', 1, '{\"images\": [{\"url\": \"https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80\", \"caption\": \"Gedung Rektorat\"}, {\"url\": \"https://images.unsplash.com/photo-1581092335391-9583eb1c0f6a?w=800&q=80\", \"caption\": \"Lab Maritim\"}, {\"url\": \"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80\", \"caption\": \"Perpustakaan\"}, {\"url\": \"https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80\", \"caption\": \"Area Kampus\"}, {\"url\": \"https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80\", \"caption\": \"Ruang Kelas\"}, {\"url\": \"https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80\", \"caption\": \"Kapal Riset\"}]}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(171, 6, 'cta', 2, '{\"title\": \"Kunjungi Kampus Kami\", \"bgColor\": \"#0F172A\", \"bgImage\": \"https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80\", \"buttons\": [{\"link\": \"#\", \"text\": \"Jadwalkan Kunjungan\"}], \"description\": \"Lihat langsung fasilitas modern dan lingkungan kampus yang inspiratif.\"}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(172, 7, 'hero', 0, '{\"title\": \"Hubungi Kami\", \"bgImage\": \"https://images.unsplash.com/photo-1562774053-701939374585?w=1440&q=80\", \"buttons\": [], \"subtitle\": \"Silakan hubungi kami untuk informasi lebih lanjut\", \"breadcrumb\": \"Beranda > Kontak\"}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(173, 7, 'contact_info', 1, '{\"email\": \"green.campus@ppns.ac.id\", \"phone\": \"(031) 5947280\", \"mapUrl\": \"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.635654321234!2d112.789!3d-7.293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m2!1s0x0%3A0x0!2sPPNS!5e0!3m2!1sid!2sid!4v1\", \"address\": \"Jl. Teknik Kimia, Kampus ITS Sukolilo, Surabaya 60111\"}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(174, 7, 'cta', 2, '{\"title\": \"Kunjungi Langsung Kampus PPNS\", \"bgColor\": \"#0F172A\", \"bgImage\": \"https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80\", \"buttons\": [{\"link\": \"/program\", \"text\": \"Lihat Program Studi\"}], \"description\": \"Dapatkan pengalaman langsung melihat fasilitas kampus dan bertemu dengan tim akademik kami.\"}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(175, 8, 'hero', 0, '{\"title\": \"Laporan\", \"bgImage\": \"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1440&q=80\", \"buttons\": [], \"subtitle\": \"Laporan kegiatan dan program Green Campus PPNS\", \"breadcrumb\": \"Beranda > Laporan\"}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(176, 8, 'content', 1, '{\"html\": \"<p>Halaman ini menyajikan laporan-laporan kegiatan dan program Green Campus PPNS. Dokumen laporan dapat diunduh melalui tautan yang tersedia.</p>\"}', '2026-06-27 02:55:55', '2026-06-27 02:55:55'),
(177, 8, 'cta', 2, '{\"title\": \"Butuh Dokumen Lain?\", \"bgColor\": \"#0F172A\", \"bgImage\": \"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1920&q=80\", \"buttons\": [{\"link\": \"/kontak\", \"text\": \"Hubungi Kami\"}], \"description\": \"Hubungi kami untuk permintaan dokumen atau informasi lebih lanjut.\"}', '2026-06-27 02:55:55', '2026-06-27 02:55:55');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `file_url` varchar(500) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_size` int(11) DEFAULT NULL,
  `format` varchar(10) DEFAULT 'PDF',
  `published` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `release_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`id`, `slug`, `title`, `description`, `file_url`, `file_name`, `file_size`, `format`, `published`, `created_at`, `updated_at`, `release_date`) VALUES
(5, 'dsadas', 'sdadas', 'sadas', 'https://res.cloudinary.com/dycwak7mq/raw/upload/v1783046121/green-campus/reports/bu544k0xbvans58hqmd7', 'Screenshot 2026-06-04 162835 (1).pdf', 71881, 'PDF', 1, '2026-07-03 02:35:22', '2026-07-03 02:35:22', NULL),
(9, 'laporan-baru', 'tes laporan', 'tes singkat', 'https://res.cloudinary.com/dycwak7mq/raw/upload/v1783072124/green-campus/reports/utdczmt5odljtemldyrc', 'DANU CATUR.pdf', 179032, 'PDF', 1, '2026-07-03 09:48:45', '2026-07-03 09:48:45', '2025-06-17');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `setting_key`, `setting_value`, `description`, `created_at`, `updated_at`) VALUES
(1, 'site_name', 'Green Campus', 'Nama situs', '2026-06-26 00:36:52', '2026-06-26 00:36:52'),
(2, 'site_description', 'Politeknik Perkapalan Negeri Surabaya', 'Deskripsi situs', '2026-06-26 00:36:52', '2026-06-26 00:36:52'),
(3, 'site_logo', '', 'Logo situs', '2026-06-26 00:36:52', '2026-06-26 00:36:52'),
(4, 'site_favicon', '', 'Favicon', '2026-06-26 00:36:52', '2026-06-26 00:36:52'),
(5, 'footer_text', '© 2026 Green Campus. All rights reserved.', 'Teks footer', '2026-06-26 00:36:52', '2026-06-26 00:36:52'),
(6, 'seo_title', 'Green Campus - PPNS', 'SEO Title', '2026-06-26 00:36:52', '2026-06-26 00:36:52'),
(7, 'seo_description', 'Green Campus Politeknik Perkapalan Negeri Surabaya', 'SEO Description', '2026-06-26 00:36:52', '2026-06-26 00:36:52');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Inovasi', '2026-07-02 02:51:49', '2026-07-02 02:51:49'),
(2, 'Kerjasama', '2026-07-02 02:51:49', '2026-07-02 02:51:49'),
(3, 'Prestasi', '2026-07-02 02:51:49', '2026-07-02 02:51:49'),
(8, 'Usaha', '2026-07-02 02:59:09', '2026-07-02 02:59:09'),
(16, 'Keren', '2026-07-02 03:49:41', '2026-07-02 03:49:41'),
(41, 'Terbaru', '2026-07-03 09:45:55', '2026-07-03 09:45:55');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nip` varchar(50) DEFAULT NULL,
  `role` enum('admin','kalab') NOT NULL DEFAULT 'admin',
  `laboratory_id` int(11) DEFAULT NULL,
  `refresh_token` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `nip`, `role`, `laboratory_id`, `refresh_token`, `created_at`, `updated_at`) VALUES
(1, 'Administrator', 'admin@ppns.ac.id', '$2a$10$UuGztqN8E46g10YK23r7dOxWFApzgbTTdr/CCj0E7hFqr1ZT9GTxe', NULL, 'admin', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgyNTI3Mzg2LCJleHAiOjE3ODMxMzIxODZ9.M7Cc9Jr3v8yvDUiEmf49aQlie5o5zmH7jM8riNJGCxM', '2026-06-26 00:36:52', '2026-11-19 02:23:44'),
(4, 'Ula', 'aacha66@gmail.com', '$2a$10$udsVXEBRCx7LO6PhIyZRcuhivRFNxpquq3feb1bJsqnH4pBiJ9HrK', NULL, 'admin', NULL, NULL, '2026-11-19 02:23:11', '2026-11-19 02:23:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `footer_settings`
--
ALTER TABLE `footer_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `navbar_items`
--
ALTER TABLE `navbar_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `page_id` (`page_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `navbar_settings`
--
ALTER TABLE `navbar_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `news_tags`
--
ALTER TABLE `news_tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `news_id` (`news_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `page_blocks`
--
ALTER TABLE `page_blocks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `page_id` (`page_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `navbar_items`
--
ALTER TABLE `navbar_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `news_tags`
--
ALTER TABLE `news_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `page_blocks`
--
ALTER TABLE `page_blocks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=181;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `media_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `navbar_items`
--
ALTER TABLE `navbar_items`
  ADD CONSTRAINT `navbar_items_ibfk_1` FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `navbar_items_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `navbar_items` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `news_tags`
--
ALTER TABLE `news_tags`
  ADD CONSTRAINT `news_tags_ibfk_1` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `news_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pages`
--
ALTER TABLE `pages`
  ADD CONSTRAINT `pages_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `page_blocks`
--
ALTER TABLE `page_blocks`
  ADD CONSTRAINT `page_blocks_ibfk_1` FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
