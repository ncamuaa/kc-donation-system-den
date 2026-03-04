-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 04, 2026 at 03:53 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `donor_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `password_hash` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `email`, `role`, `created_at`, `password_hash`) VALUES
(3, 'admin@kc.org', 'admin', '2026-02-25 20:11:54', '$2b$10$6kCxcx41eWRFqt1G5VOKTO376F6eY4hv/OAzgjVP6r/S.cLAFtYtS');

-- --------------------------------------------------------

--
-- Table structure for table `campaigns`
--

CREATE TABLE `campaigns` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `target` decimal(12,2) NOT NULL DEFAULT 0.00,
  `end_date` date NOT NULL,
  `status` enum('Active','Completed','Paused') NOT NULL DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `category` varchar(100) DEFAULT 'Campaign',
  `raised` decimal(12,2) DEFAULT 0.00,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cause_marketing`
--

CREATE TABLE `cause_marketing` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `raised_ytd` decimal(12,2) DEFAULT 0.00,
  `active_partners` int(11) DEFAULT 0,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comm_history`
--

CREATE TABLE `comm_history` (
  `id` int(11) NOT NULL,
  `recipient` varchar(255) NOT NULL,
  `template_name` varchar(255) NOT NULL,
  `status` varchar(50) DEFAULT 'Sent',
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comm_templates`
--

CREATE TABLE `comm_templates` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comm_workflows`
--

CREATE TABLE `comm_workflows` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `trigger_event` varchar(255) NOT NULL,
  `status` varchar(50) DEFAULT 'Active',
  `steps` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donations`
--

CREATE TABLE `donations` (
  `id` int(11) NOT NULL,
  `donor` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `type` varchar(50) DEFAULT 'One-time',
  `campaign` varchar(255) NOT NULL,
  `channel` varchar(100) DEFAULT 'Bank Transfer',
  `status` varchar(50) DEFAULT 'Completed',
  `notes` text DEFAULT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `donations`
--

INSERT INTO `donations` (`id`, `donor`, `amount`, `type`, `campaign`, `channel`, `status`, `notes`, `date`, `created_at`) VALUES
(24, '12', 5000.00, 'One-time', 'Teacher Training Program', 'GCash', 'Completed', 'dasda', '2026-03-03', '2026-03-03 18:41:52'),
(25, '12', 20000.00, 'Recurring', 'Teacher Training Program', 'Credit Card', 'Completed', 'asads', '2026-03-03', '2026-03-03 18:46:50'),
(26, '12', 1000.00, 'Recurring', 'School Supplies for Learners', 'PayPal', 'Completed', 'dfsdf', '2026-03-04', '2026-03-04 02:16:24'),
(27, 'Anonymous', 5000.00, 'One-time', 'Educational TV Access', 'Credit Card', 'Completed', 'sdfds', '2026-03-04', '2026-03-04 02:28:55');

-- --------------------------------------------------------

--
-- Table structure for table `donors`
--

CREATE TABLE `donors` (
  `id` int(11) NOT NULL,
  `project` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `units` int(11) NOT NULL DEFAULT 0,
  `deliveryDate` varchar(50) DEFAULT NULL,
  `dueDate` date DEFAULT NULL,
  `sponsor` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `type` enum('Individual','Corporate','Organization') NOT NULL,
  `status` enum('Active','Inactive','Done','Completed') NOT NULL DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `donors`
--

INSERT INTO `donors` (`id`, `project`, `description`, `units`, `deliveryDate`, `dueDate`, `sponsor`, `email`, `amount`, `type`, `status`, `created_at`, `updated_at`) VALUES
(270, 'ds', 'Purchased 500 PMLs (for January)', 1, '2026-04-23', '2026-04-25', 'f', NULL, 45000.00, 'Individual', 'Active', '2026-03-03 18:50:19', '2026-03-03 18:55:55');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date` date NOT NULL,
  `time` varchar(50) DEFAULT NULL,
  `goal` decimal(12,2) DEFAULT 0.00,
  `status` enum('Upcoming','Planning','Completed') DEFAULT 'Upcoming',
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `date`, `time`, `goal`, `status`, `image`, `created_at`) VALUES
(5, 'asdasd', 'erewrwrw', '2026-04-23', '18:00', 34555.00, 'Upcoming', '1772532971402-704130877.webp', '2026-03-03 10:14:50'),
(6, 'eadad', 'efdsdfd', '2027-04-23', '00:00', 6000.00, 'Upcoming', '1772533361934-263855176.png', '2026-03-03 10:22:41');

-- --------------------------------------------------------

--
-- Table structure for table `grants`
--

CREATE TABLE `grants` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `org` varchar(255) NOT NULL,
  `status` enum('Approved','Under Review','Drafting','Declined') DEFAULT 'Under Review',
  `amount` decimal(12,2) NOT NULL,
  `deadline` date NOT NULL,
  `prop_id` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `grants`
--

INSERT INTO `grants` (`id`, `title`, `org`, `status`, `amount`, `deadline`, `prop_id`, `created_at`) VALUES
(4, 'dsfdsf', 'dfsdf', 'Drafting', 500000.00, '2026-05-31', 'rfdfs', '2026-03-03 16:36:19');

-- --------------------------------------------------------

--
-- Table structure for table `sponsorship_records`
--

CREATE TABLE `sponsorship_records` (
  `id` int(11) NOT NULL,
  `project` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `units` int(11) DEFAULT NULL,
  `delivery_date` varchar(50) DEFAULT NULL,
  `sponsor` varchar(255) DEFAULT NULL,
  `amount` decimal(15,2) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','staff','viewer') DEFAULT 'staff',
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
(3, 'Francis', 'francis@kc.org', '$2b$12$NB2bb0hUiJgGPsHzn6tR0e3TkqOL95SBPZHOp2kxtISy0sJByn4dW', 'staff', 1, '2026-03-03 17:18:41', '2026-03-03 05:16:59', '2026-03-03 17:18:41'),
(4, '12', '12@kc.org', '$2b$12$b.eUane6ONYJg0cIvnDfKOVHAQtj5ysZLd5kWKgKkIE2yF6wmyYdi', 'staff', 1, '2026-03-04 02:16:04', '2026-03-03 18:02:54', '2026-03-04 02:16:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `campaigns`
--
ALTER TABLE `campaigns`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cause_marketing`
--
ALTER TABLE `cause_marketing`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comm_history`
--
ALTER TABLE `comm_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comm_templates`
--
ALTER TABLE `comm_templates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comm_workflows`
--
ALTER TABLE `comm_workflows`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `donations`
--
ALTER TABLE `donations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `donors`
--
ALTER TABLE `donors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `grants`
--
ALTER TABLE `grants`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sponsorship_records`
--
ALTER TABLE `sponsorship_records`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `campaigns`
--
ALTER TABLE `campaigns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cause_marketing`
--
ALTER TABLE `cause_marketing`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `comm_history`
--
ALTER TABLE `comm_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `comm_templates`
--
ALTER TABLE `comm_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `comm_workflows`
--
ALTER TABLE `comm_workflows`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `donations`
--
ALTER TABLE `donations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `donors`
--
ALTER TABLE `donors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=271;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `grants`
--
ALTER TABLE `grants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sponsorship_records`
--
ALTER TABLE `sponsorship_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
