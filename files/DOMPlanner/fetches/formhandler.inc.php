<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "localhost";
$user = "root";
$pass = "";
$db   = "monitoring";
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // throw exceptions on errors
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // fetch associative arrays
    PDO::ATTR_EMULATE_PREPARES   => false,                  // use real prepared statements
];
try {
    $pdo = new PDO($dsn, $user, $pass, $options);  // ✅ this defines $pdo
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Collect inputs
    $part_no = $_POST['partnumber'];
    $model = $_POST['model'];
    $del_date = $_POST['deliverydate'];
    $balance = $_POST['balance'];
    $man_power = $_POST['man_power'];
    $prod_hrs = $_POST['prod_hrs'];

    $plans = [];
    for ($i = 1; $i <= 14; $i++) {
        $plans[] = $_POST["mins$i"] ?? null;
    }

    // Generate current timestamp
    $date_created = date("Y-m-d H:i:s");

    try {
        // 1. Get latest values from ct
        $stmtCT = $pdo->query("SELECT ctime, ctao, ed FROM ct ORDER BY id DESC LIMIT 1");
        $ctRow = $stmtCT->fetch(PDO::FETCH_ASSOC);

        if ($ctRow) {
            $cycletime = $ctRow['ctime'];
            $ct_as_of = $ctRow['ctao'];
            $exp_date = $ctRow['ed'];
        } else {
            // fallback if ct table is empty
            $cycletime = 0;
            $ct_as_of = null;
            $exp_date = null;
        }

        // 2. Prepare INSERT
        $query = "INSERT INTO PlanOutput
            (partnumber, model, deliverydate, cycletime, balance, manpower, cycletimeasof, expirationdate, prodhrs, 
             mins1, mins2, mins3, mins4, mins5, mins6, mins7, mins8, mins9, mins10, mins11, mins12, mins13, mins14, date_created)
            VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $pdo->prepare($query);
        $stmt->execute(array_merge(
            [$part_no, $model, $del_date, $cycletime, $balance, $man_power, $ct_as_of, $exp_date, $prod_hrs], 
            $plans,
            [$date_created]
        ));

        echo "Successfully inserted!";
        header("Location: ../planner.php");
        exit;

    } catch (PDOException $e) {
        die("Query failed: " . $e->getMessage());
    } finally {
        $pdo = null;
    }
}

?>
