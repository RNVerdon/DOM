<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
$host = "localhost";
$user = "root";
$pass = "";
$db   = "monitoring";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$action = $_REQUEST['action'] ?? null;

/* ===============================
   FALLBACK — ONLY IF NO ACTION
================================ */
if (!$action) {

    // 🔑 Check plan first
    $stmt = $conn->prepare("SELECT plan FROM PlanSelection WHERE id = 1");
    $stmt->execute();
    $resPlan = $stmt->get_result();
    $planRow = $resPlan->fetch_assoc();

    // If no plan or plan = 0 → return 0 0
    if (!$planRow || (int)$planRow['plan'] === 0) {
        echo "0 0";
        exit;
    }

    $sql = "SELECT 
                COALESCE(SUM(plan_output),0) AS totalPlan, 
                COALESCE(SUM(actual_output),0) AS totalCount 
            FROM OutputTable";
    $result = $conn->query($sql);

    if ($result && $row = $result->fetch_assoc()) {
        $totalPlan  = $row['totalPlan'];
        $totalCount = $row['totalCount'];
        echo $totalPlan . " " . $totalCount;
    } else {
        echo "0 0";
    }

    exit; // 🔑 important: stop script so no extra output
}

$conn->close();
?>
