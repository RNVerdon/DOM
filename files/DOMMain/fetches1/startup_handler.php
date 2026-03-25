<?php
$host = 'localhost';
$db   = 'monitoring';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
    exit;
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action === 'checkPlanFilled') {
    // Check if PlanSelection has plan = 0
    $result = $conn->query("SELECT plan FROM PlanSelection WHERE plan != 0 LIMIT 1");
    $filled = $result && $result->num_rows > 0;

    echo json_encode(['filled' => $filled]);
    exit;
}

/* ---------------------------
   FETCH ALL PLANS
--------------------------- */
if ($action === 'getPlans') {
    $stmt = $pdo->query("SELECT id FROM PlanOutput ORDER BY id ASC");
    $plans = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($plans);
    exit;
}

/* ---------------------------
   FETCH PLAN DETAILS
--------------------------- */
if ($action === 'getPlanDetails') {
    $id = intval($_GET['id'] ?? 0);
    if ($id <= 0) {
        echo json_encode(['error' => 'Invalid ID']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM PlanOutput WHERE id=?");
    $stmt->execute([$id]);
    $plan = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$plan) {
        echo json_encode(['error' => 'Plan not found']);
        exit;
    }

    echo json_encode($plan);
    exit;
}

/* ---------------------------
   FETCH LINE LEADERS
--------------------------- */
if ($action === 'getLineLeaders') {
    $sql = "SELECT id, fn, mn, ln, title, picture FROM line_leader_list WHERE id >= 1 ORDER BY id ASC";
    $result = $conn->query($sql);

    $leaders = [];

    // default picture from id=0
    $defaultPicRow = $conn->query("SELECT picture FROM line_leader_list WHERE id = 0")->fetch_assoc();
    $defaultPicture = $defaultPicRow && $defaultPicRow['picture'] ? base64_encode($defaultPicRow['picture']) : null;
    $defaultPicture = $defaultPicture ? 'data:image/png;base64,' . $defaultPicture : null;

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $leaders[] = [
                'fn' => $row['fn'],
                'mn' => $row['mn'],
                'ln' => $row['ln'],
                'id' => $row['id'],
                'title' => $row['title'],
                'picture' => $row['picture'] 
                    ? 'data:image/png;base64,' . base64_encode($row['picture']) 
                    : $defaultPicture
            ];
        }
    }

    echo json_encode($leaders);
    exit;
}

/* ---------------------------
   FETCH PRODUCTION STAFF
--------------------------- */
if ($action === 'getProdStaff') {
    $sql = "SELECT id, fn, mn, ln, picture FROM prod_staff_list WHERE id >=1 ORDER BY id DESC";
    $result = $conn->query($sql);

    $staffs = [];

    // default picture from id=0
    $defaultPicRow = $conn->query("SELECT picture FROM prod_staff_list WHERE id = 0")->fetch_assoc();
    $defaultPicture = $defaultPicRow && $defaultPicRow['picture'] ? base64_encode($defaultPicRow['picture']) : null;
    $defaultPicture = $defaultPicture ? 'data:image/png;base64,' . $defaultPicture : null;

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $staffs[] = [
                'fn' => $row['fn'],
                'mn' => $row['mn'],
                'ln' => $row['ln'],
                'id' => $row['id'],
                'picture' => $row['picture'] 
                    ? 'data:image/png;base64,' . base64_encode($row['picture']) 
                    : $defaultPicture
            ];
        }
    }

    echo json_encode($staffs);
    exit;
}

/* ---------------------------
   SUBMIT PRODUCTION
--------------------------- */
if ($action === 'submitProduction') {
    header('Content-Type: application/json');

    $input = json_decode(file_get_contents('php://input'), true);

    $planNumber      = $input['planNumber'] ?? null;
    $balance         = $input['balance'] ?? null;
    $lineLeaderId    = $input['lineLeaderId'] ?? null;
    $manpower        = intval($input['manpower'] ?? 0);
    $staffIds        = $input['staffIds'] ?? [];
    $staffProcesses  = $input['staffProcesses'] ?? [];
    
    if (!$planNumber || !$balance || !$lineLeaderId || $manpower < 1) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }

    $conn->begin_transaction();

    try {
        // Update PlanSelection
        $stmt = $conn->prepare("UPDATE PlanSelection SET plan=? WHERE id = 1");
        $stmt->bind_param("i", $planNumber);
        $stmt->execute();
        $stmt->close();

        // Update PlanOutput with balance, lineleader, manpower
        $stmt = $conn->prepare("
            UPDATE PlanOutput 
            SET balance=?, lineleader=?, manpower=? 
            WHERE id=?
        ");
        $stmt->bind_param("iiii", $balance, $lineLeaderId, $manpower, $planNumber);
        $stmt->execute();
        $stmt->close();

        // Update manpower1..3 and prod_staff_list process/title
        for ($i = 0; $i < 3; $i++) {
            $staffId = $staffIds[$i] ?? null;
            $process = $staffProcesses[$i] ?? null;

            if ($staffId) {
                // Update manpower column in PlanOutput
                $col = 'manpower' . ($i + 1);
                $stmt = $conn->prepare("UPDATE PlanOutput SET $col=? WHERE id=?");
                $stmt->bind_param("ii", $staffId, $planNumber);
                $stmt->execute();
                $stmt->close();

                // Update staff's process/title in prod_staff_list
                if ($process) {
                    $stmt = $conn->prepare("UPDATE prod_staff_list SET title=? WHERE id=?");
                    $stmt->bind_param("si", $process, $staffId);
                    $stmt->execute();
                    $stmt->close();
                }
            }
        }

        $conn->commit();

        echo json_encode([
            'success' => true,
            'redirect' => 'pndmonitoring.php'
        ]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit;
}


$conn->close();
?>
