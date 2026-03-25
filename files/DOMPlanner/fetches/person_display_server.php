<?php
header('Content-Type: application/json');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
ini_set('memory_limit', '256M');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "monitoring";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Get all records from prod_staff_list starting from id 1
$sql = "SELECT id, fn, mn, ln, title, lcdate, rcdate 
        FROM prod_staff_list 
        WHERE id >= 1 
        ORDER BY id ASC"; // ASC so it starts from 1
$result = $conn->query($sql);

$persons = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $persons[] = [
            'id' => $row['id'],
            'fn' => $row['fn'],
            'mn' => $row['mn'],
            'ln' => $row['ln'],
            'title' => $row['title'],
            'lcdate' => $row['lcdate'],
            'rcdate' => $row['rcdate']
        ];
    }
}

echo json_encode($persons);
$conn->close();
?>
