<?php
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "123", "monitoring");
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "DB connection failed"
    ]);
    exit;
}

$sql = "SELECT id, date_saved FROM saved_data ORDER BY date_saved DESC";
$result = $conn->query($sql);

$ids = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $ids[] = $row;
    }
}

echo json_encode([
    "success" => true,
    "ids" => $ids
]);
