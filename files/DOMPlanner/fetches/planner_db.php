<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', '/var/log/php_errors.log');

// -----------------------------
// Database connection
// -----------------------------
$host = "localhost";
$user = "root";
$pass = "";
$db   = "monitoring";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "DB connection failed"]);
    exit;
}

// -----------------------------
// Get action from GET or POST
// -----------------------------
$action = $_GET['action'] ?? $_POST['action'] ?? null;

/* ====================================
   GET ALL LINE LEADERS
==================================== */
if ($action === 'get_leaders') {
    $sql = "SELECT id, fn, mn, ln, title FROM line_leader_list WHERE id >= 1 ORDER BY id ASC";
    $result = $conn->query($sql);

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
    exit;
}

/* ====================================
   GET SINGLE LEADER BY ID
==================================== */

if ($action === 'get_leader_by_id') {
    header('Content-Type: application/json; charset=utf-8');

    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($id <= 0) {
        echo json_encode(["success" => false, "error" => "Invalid ID"]);
        exit;
    }

    $stmt = $conn->prepare("
        SELECT id, fn, mn, ln, title
        FROM line_leader_list
        WHERE id = ?
        LIMIT 1
    ");

    if (!$stmt) {
        echo json_encode(["success" => false, "error" => "Prepare failed: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "error" => "Execute failed: " . $stmt->error]);
        exit;
    }

    $result = $stmt->get_result();

    if ($result === false) {
        echo json_encode(["success" => false, "error" => "Get result failed: " . $stmt->error]);
        exit;
    }

    $row = $result->fetch_assoc();

    if ($row) {
        echo json_encode(["success" => true, "data" => $row]);
    } else {
        echo json_encode(["success" => false, "error" => "Leader not found"]);
    }

    exit;
}

if ($action === 'get_leader_picture') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id <= 0) {
        http_response_code(400);
        exit("Invalid ID");
    }

    $stmt = $conn->prepare("SELECT picture FROM line_leader_list WHERE id = ? LIMIT 1");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($picture);
    $stmt->fetch();

    if ($picture) {
        // Serve as raw BLOB
        header("Content-Type: image/jpeg"); // or image/png if PNG
        echo $picture;
    } else {
        http_response_code(404);
        exit("No image found");
    }
}
/* ====================================
   UPDATE LEADER (INCLUDING IMAGE)
==================================== */
if ($action === 'update_leader') {
    $id    = intval($_POST['id'] ?? 0);
    $fn    = $_POST['fn'] ?? '';
    $mn    = $_POST['mn'] ?? '';
    $ln    = $_POST['ln'] ?? '';
    $title = $_POST['title'] ?? '';

    if ($id <= 0) {
        echo json_encode(["success" => false, "error" => "Invalid ID"]);
        exit;
    }

    // -----------------------------
    // 1️⃣ Update only the text fields
    // -----------------------------
    $stmt = $conn->prepare("
        UPDATE line_leader_list
        SET fn=?, mn=?, ln=?, title=?
        WHERE id=?
    ");
    $stmt->bind_param("ssssi", $fn, $mn, $ln, $title, $id);
    $stmt->execute();
    $stmt->close();

    // -----------------------------
    // 2️⃣ Handle picture separately
    // -----------------------------
    if (isset($_FILES['picture']) && $_FILES['picture']['error'] === 0) {
        $imgDir  = "/var/www/html/DOM/media/img/staffs/leader/";
        $imgName = "leader_{$id}.jpg";
        $imgPath = $imgDir . $imgName;

        if (!file_exists($imgDir)) mkdir($imgDir, 0777, true);

        if (!move_uploaded_file($_FILES['picture']['tmp_name'], $imgPath)) {
            echo json_encode(["success" => false, "error" => "Failed to save uploaded file. Check permissions."]);
            exit;
        }

        // Update the picture column using LOAD_FILE
        $stmt2 = $conn->prepare("
            UPDATE line_leader_list
            SET picture = LOAD_FILE(?)
            WHERE id = ?
        ");
        $stmt2->bind_param("si", $imgPath, $id);
        $stmt2->execute();
        $stmt2->close();
    }

    echo json_encode(["success" => true]);
    exit;
}


if ($action === 'get_prod_staffs') {
    $sql = "
        SELECT id, fn, mn, ln, title, lcdate, rcdate
        FROM prod_staff_list
        WHERE id >= 1
        ORDER BY id ASC
    ";

    $result = $conn->query($sql);

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
    exit;
}

if ($action === 'get_prod_staff_by_id') {
    header('Content-Type: application/json; charset=utf-8');

    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($id <= 0) {
        echo json_encode(["success" => false, "error" => "Invalid ID"]);
        exit;
    }

    $stmt = $conn->prepare("
        SELECT id, fn, mn, ln, title, lcdate, rcdate
        FROM prod_staff_list
        WHERE id = ?
        LIMIT 1
    ");

    if (!$stmt) {
        echo json_encode(["success" => false, "error" => "Prepare failed: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "error" => "Execute failed: " . $stmt->error]);
        exit;
    }

    $result = $stmt->get_result();

    if ($result === false) {
        echo json_encode(["success" => false, "error" => "Get result failed: " . $stmt->error]);
        exit;
    }

    $row = $result->fetch_assoc();

    if ($row) {
        echo json_encode(["success" => true, "data" => $row]);
    } else {
        echo json_encode(["success" => false, "error" => "Production staff not found"]);
    }

    exit;
}

if ($action === 'get_prod_staff_picture') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($id <= 0) {
        http_response_code(400);
        exit("Invalid ID");
    }

    $stmt = $conn->prepare("
        SELECT picture
        FROM prod_staff_list
        WHERE id = ?
        LIMIT 1
    ");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($picture);
    $stmt->fetch();

    if ($picture) {
        header("Content-Type: image/jpeg");
        echo $picture;
    } else {
        http_response_code(404);
        exit("No image found");
    }

    exit;
}
/* ====================================
   UPDATE PROD STAFF (INCLUDING IMAGE)
==================================== */
if ($action === 'update_prod_staff') {
    $id     = intval($_POST['id'] ?? 0);
    $fn     = $_POST['fn'] ?? '';
    $mn     = $_POST['mn'] ?? '';
    $ln     = $_POST['ln'] ?? '';
    $lcdate = $_POST['lcdate'] ?? null;
    $rcdate = $_POST['rcdate'] ?? null;

    if ($id <= 0) {
        echo json_encode(["success" => false, "error" => "Invalid ID"]);
        exit;
    }

    // -----------------------------
    // 1️⃣ Update text fields
    // -----------------------------
    $stmt = $conn->prepare("
        UPDATE prod_staff_list
        SET fn=?, mn=?, ln=?, lcdate=?, rcdate=?
        WHERE id=?
    ");
    $stmt->bind_param("sssssi", $fn, $mn, $ln, $lcdate, $rcdate, $id);
    $stmt->execute();
    $stmt->close();

    // -----------------------------
    // 2️⃣ Handle picture upload
    // -----------------------------
    if (isset($_FILES['picture']) && $_FILES['picture']['error'] === 0) {
        $imgDir  = "/var/www/html/DOM/media/img/staffs/prod/";
        $imgName = "staff_{$id}.jpg";
        $imgPath = $imgDir . $imgName;

        if (!file_exists($imgDir)) {
            mkdir($imgDir, 0777, true);
        }

        if (!move_uploaded_file($_FILES['picture']['tmp_name'], $imgPath)) {
            echo json_encode([
                "success" => false,
                "error" => "Failed to save uploaded file. Check permissions."
            ]);
            exit;
        }

        // Store image into BLOB column
        $stmt2 = $conn->prepare("
            UPDATE prod_staff_list
            SET picture = LOAD_FILE(?)
            WHERE id = ?
        ");
        $stmt2->bind_param("si", $imgPath, $id);
        $stmt2->execute();
        $stmt2->close();
    }

    echo json_encode(["success" => true]);
    exit;
}

if ($action === 'get_prod_staff_picture') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($id <= 0) {
        http_response_code(400);
        exit("Invalid ID");
    }

    $stmt = $conn->prepare("
        SELECT picture
        FROM prod_staff_list
        WHERE id = ?
        LIMIT 1
    ");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($picture);
    $stmt->fetch();

    if ($picture) {
        header("Content-Type: image/jpeg");
        echo $picture;
    } else {
        http_response_code(404);
        exit("No image found");
    }

    exit;
}
/* ====================================
   UPDATE PROD STAFF (INCLUDING IMAGE)
==================================== */
/* ====================================
   UPDATE PROD STAFF (INCLUDING IMAGE)
==================================== */
if ($action === 'update_prod_staff') {
    $id     = intval($_POST['id'] ?? 0);
    $fn     = $_POST['fn'] ?? '';
    $mn     = $_POST['mn'] ?? '';
    $ln     = $_POST['ln'] ?? '';
    $title  = $_POST['title'] ?? '';
    $lcdate = $_POST['lcdate'] ?? null;
    $rcdate = $_POST['rcdate'] ?? null;

    if ($id <= 0) {
        echo json_encode(["success" => false, "error" => "Invalid ID"]);
        exit;
    }

    // -----------------------------
    // 1️⃣ Update text fields
    // -----------------------------
    $stmt = $conn->prepare("
        UPDATE prod_staff_list
        SET fn=?, mn=?, ln=?, title=?, lcdate=?, rcdate=?
        WHERE id=?
    ");
    $stmt->bind_param("ssssssi", $fn, $mn, $ln, $title, $lcdate, $rcdate, $id);
    $stmt->execute();
    $stmt->close();

    // -----------------------------
    // 2️⃣ Handle picture upload
    // -----------------------------
    if (isset($_FILES['picture']) && $_FILES['picture']['error'] === 0) {
        $imgDir  = "/var/www/html/DOM/media/img/staffs/prod/";
        $imgName = "staff_{$id}.jpg";
        $imgPath = $imgDir . $imgName;

        if (!file_exists($imgDir)) {
            mkdir($imgDir, 0777, true);
        }

        if (!move_uploaded_file($_FILES['picture']['tmp_name'], $imgPath)) {
            echo json_encode([
                "success" => false,
                "error" => "Failed to save uploaded file. Check permissions."
            ]);
            exit;
        }

        // Store image into BLOB column
        $stmt2 = $conn->prepare("
            UPDATE prod_staff_list
            SET picture = LOAD_FILE(?)
            WHERE id = ?
        ");
        $stmt2->bind_param("si", $imgPath, $id);
        $stmt2->execute();
        $stmt2->close();
    }

    echo json_encode(["success" => true]);
    exit;
}

if ($action === 'add_leader') {

    $fn    = $_POST['fn'] ?? '';
    $mn    = $_POST['mn'] ?? '';
    $ln    = $_POST['ln'] ?? '';
    $title = $_POST['title'] ?? '';

    // 1️⃣ Insert leader (no image yet)
    $stmt = $conn->prepare("
        INSERT INTO line_leader_list (fn, mn, ln, title)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->bind_param("ssss", $fn, $mn, $ln, $title);
    $stmt->execute();

    $newId = $stmt->insert_id;

    // 2️⃣ Handle picture
    if (isset($_FILES['picture']) && is_uploaded_file($_FILES['picture']['tmp_name'])) {

        $uploadDir = "/var/www/html/DOM/media/img/staffs/leader/";
        $fileName  = "leader_" . $newId . ".jpeg";
        $filePath  = $uploadDir . $fileName;

        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        if (!move_uploaded_file($_FILES['picture']['tmp_name'], $filePath)) {
            echo json_encode([
                "success" => false,
                "error" => "Failed to move image to leader folder"
            ]);
            exit;
        }

        // Update BLOB from file
        $sql = "UPDATE line_leader_list
                SET picture = LOAD_FILE(?)
                WHERE id = ?";
        $stmt2 = $conn->prepare($sql);
        $stmt2->bind_param("si", $filePath, $newId);
        $stmt2->execute();

    } else {
        // No picture uploaded → set BLOB to NULL
        $sql = "UPDATE line_leader_list
                SET picture = NULL
                WHERE id = ?";
        $stmt2 = $conn->prepare($sql);
        $stmt2->bind_param("i", $newId);
        $stmt2->execute();
    }

    echo json_encode([
        "success" => true,
        "id" => $newId
    ]);
    exit;
}

if ($action === 'reorder_leaders') {
    $uploadDir = "/var/www/html/DOM/media/img/staffs/leader/";

    // 1️⃣ Fetch all current leader IDs >= 1 (exclude 0)
    $result = $conn->query("SELECT id FROM line_leader_list WHERE id >= 1 ORDER BY id ASC");
    if (!$result) {
        echo json_encode(["success" => false, "error" => "Failed to fetch leaders"]);
        exit;
    }

    $leaders = [];
    while ($row = $result->fetch_assoc()) {
        $leaders[] = $row['id'];
    }

    if (empty($leaders)) {
        echo json_encode(["success" => false, "error" => "No leaders to reorder"]);
        exit;
    }

    $renameMap = [];

    // 2️⃣ Temporarily offset IDs to avoid duplicates
    foreach ($leaders as $oldId) {
        $tempId = $oldId + 1000; // avoid conflicts
        $stmt = $conn->prepare("UPDATE line_leader_list SET id = ? WHERE id = ?");
        $stmt->bind_param("ii", $tempId, $oldId);
        if (!$stmt->execute()) {
            echo json_encode(["success" => false, "error" => "Failed to offset ID $oldId"]);
            exit;
        }
        $stmt->close();
    }

    // 3️⃣ Assign new sequential IDs starting from 1
    $newId = 1;
    foreach ($leaders as $oldId) {
        $tempId = $oldId + 1000;
        $stmt = $conn->prepare("UPDATE line_leader_list SET id = ? WHERE id = ?");
        $stmt->bind_param("ii", $newId, $tempId);
        if (!$stmt->execute()) {
            echo json_encode(["success" => false, "error" => "Failed to assign new ID for $oldId"]);
            exit;
        }
        $stmt->close();

        $renameMap[$oldId] = $newId;
        $newId++;
    }

    // 4️⃣ Rename images safely using temporary filenames
    foreach ($renameMap as $oldId => $newId) {
        $oldFile = $uploadDir . "leader_" . $oldId . ".jpeg";
        $newFile = $uploadDir . "leader_" . $newId . ".jpeg";
        if (file_exists($oldFile)) {
            $tmpFile = $newFile . ".tmp"; // avoid overwriting
            if (!rename($oldFile, $tmpFile)) {
                echo json_encode(["success" => false, "error" => "Failed to rename $oldFile"]);
                exit;
            }
        }
    }

    // 5️⃣ Finalize image renames
    foreach ($renameMap as $oldId => $newId) {
        $newFile = $uploadDir . "leader_" . $newId . ".jpeg";
        $tmpFile = $newFile . ".tmp";
        if (file_exists($tmpFile)) {
            if (!rename($tmpFile, $newFile)) {
                echo json_encode(["success" => false, "error" => "Failed to finalize rename $tmpFile"]);
                exit;
            }
        }
    }

    echo json_encode(["success" => true, "message" => "Leaders reordered successfully"]);
    exit;
}

if ($action === 'add_prod_staff') {

    $fn      = $_POST['fn'] ?? '';
    $mn      = $_POST['mn'] ?? '';
    $ln      = $_POST['ln'] ?? '';
    $title   = $_POST['title'] ?? '';
    $lcdate  = $_POST['lcdate'] ?? null;
    $rcdate  = $_POST['rcdate'] ?? null;

    // 1️⃣ Insert staff (no image yet)
    $stmt = $conn->prepare("
        INSERT INTO prod_staff_list (fn, mn, ln, title, lcdate, rcdate)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("ssssss", $fn, $mn, $ln, $title, $lcdate, $rcdate);
    $stmt->execute();

    $newId = $stmt->insert_id;

    // 2️⃣ Handle picture
    if (isset($_FILES['picture']) && is_uploaded_file($_FILES['picture']['tmp_name'])) {

        $uploadDir = "/var/www/html/DOM/media/img/staffs/prod/";
        $fileName  = "staff_" . $newId . ".jpeg";
        $filePath  = $uploadDir . $fileName;

        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        if (!move_uploaded_file($_FILES['picture']['tmp_name'], $filePath)) {
            echo json_encode([
                "success" => false,
                "error" => "Failed to move image to prod folder"
            ]);
            exit;
        }

        // Update BLOB from file
        $sql = "UPDATE prod_staff_list
                SET picture = LOAD_FILE(?)
                WHERE id = ?";
        $stmt2 = $conn->prepare($sql);
        $stmt2->bind_param("si", $filePath, $newId);
        $stmt2->execute();

    } else {
        // No picture uploaded → set BLOB to NULL
        $sql = "UPDATE prod_staff_list
                SET picture = NULL
                WHERE id = ?";
        $stmt2 = $conn->prepare($sql);
        $stmt2->bind_param("i", $newId);
        $stmt2->execute();
    }

    echo json_encode([
        "success" => true,
        "id" => $newId
    ]);
    exit;
}

if ($action === 'reorder_prod_staff') {
    $uploadDir = "/var/www/html/DOM/media/img/staffs/prod/";

    // 1️⃣ Fetch all current staff IDs >= 1 (exclude 0)
    $result = $conn->query("SELECT id FROM prod_staff_list WHERE id >= 1 ORDER BY id ASC");
    if (!$result) {
        echo json_encode(["success" => false, "error" => "Failed to fetch production staff"]);
        exit;
    }

    $staffs = [];
    while ($row = $result->fetch_assoc()) {
        $staffs[] = $row['id'];
    }

    if (empty($staffs)) {
        echo json_encode(["success" => false, "error" => "No production staff to reorder"]);
        exit;
    }

    $renameMap = [];

    // 2️⃣ Temporarily offset IDs to avoid duplicates
    foreach ($staffs as $oldId) {
        $tempId = $oldId + 1000;
        $stmt = $conn->prepare("UPDATE prod_staff_list SET id = ? WHERE id = ?");
        $stmt->bind_param("ii", $tempId, $oldId);
        if (!$stmt->execute()) {
            echo json_encode(["success" => false, "error" => "Failed to offset ID $oldId"]);
            exit;
        }
        $stmt->close();
    }

    // 3️⃣ Assign new sequential IDs starting from 1
    $newId = 1;
    foreach ($staffs as $oldId) {
        $tempId = $oldId + 1000;
        $stmt = $conn->prepare("UPDATE prod_staff_list SET id = ? WHERE id = ?");
        $stmt->bind_param("ii", $newId, $tempId);
        if (!$stmt->execute()) {
            echo json_encode(["success" => false, "error" => "Failed to assign new ID for $oldId"]);
            exit;
        }
        $stmt->close();

        $renameMap[$oldId] = $newId;
        $newId++;
    }

    // 4️⃣ Rename images safely using temporary filenames
    foreach ($renameMap as $oldId => $newId) {
        $oldFile = $uploadDir . "staff_" . $oldId . ".jpeg";
        $newFile = $uploadDir . "staff_" . $newId . ".jpeg";
        if (file_exists($oldFile)) {
            $tmpFile = $newFile . ".tmp";
            if (!rename($oldFile, $tmpFile)) {
                echo json_encode(["success" => false, "error" => "Failed to rename $oldFile"]);
                exit;
            }
        }
    }

    // 5️⃣ Finalize image renames
    foreach ($renameMap as $oldId => $newId) {
        $newFile = $uploadDir . "staff_" . $newId . ".jpeg";
        $tmpFile = $newFile . ".tmp";
        if (file_exists($tmpFile)) {
            if (!rename($tmpFile, $newFile)) {
                echo json_encode(["success" => false, "error" => "Failed to finalize rename $tmpFile"]);
                exit;
            }
        }
    }

    echo json_encode(["success" => true, "message" => "Production staff reordered successfully"]);
    exit;
}

if ($action === 'deletePerson') {

    $id = (int)$_POST['id'];
    $type = $_POST['type'];

    $baseDir = "/var/www/html/DOM/media/img/staffs/";

    if ($type === 'leader') {
        $table = "line_leader_list";
        $imagePath = $baseDir . "leader/leader_" . $id . ".jpeg";

    } elseif ($type === 'staff') {
        $table = "prod_staff_list";
        $imagePath = $baseDir . "prod/staff_" . $id . ".jpeg";

    } else {
        echo json_encode(["success" => false]);
        exit;
    }

    // ✅ Try deleting file, but continue no matter what
    if (file_exists($imagePath)) {
        @unlink($imagePath); // @ prevents warnings
    }

    // ✅ Always continue to DB delete
    $stmt = $conn->prepare("DELETE FROM {$table} WHERE id = ?");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();

    echo json_encode([
        "success" => $success,
        "deleted_id" => $id
    ]);
    exit;
}

if(isset($_GET['action']) && $_GET['action'] === 'get_saved_data' && isset($_GET['id'])) {
    header('Content-Type: application/json');
    $id = (int)$_GET['id'];

    $conn = new mysqli("localhost", "root", "", "monitoring");
    if ($conn->connect_error) {
        echo json_encode(["success" => false, "message" => "DB connection failed"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM saved_data WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_assoc();

    if(!$data) {
        echo json_encode(["success" => false, "message" => "No data found for ID $id"]);
        exit;
    }

    echo json_encode(["success" => true, "data" => $data]);
    $stmt->close();
    $conn->close();
    exit;
}
/* ====================================
   UNKNOWN ACTION
==================================== */
echo json_encode(["success" => false, "error" => "Unknown action"]);
exit;

$conn->close();
?>
