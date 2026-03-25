<?php
header('Content-Type: application/json');

$host = "localhost";
$user = "root";
$pass = "";
$db   = "monitoring";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

function isPlan
($conn) {
    $check = $conn->query("SELECT plan FROM PlanSelection LIMIT 1");

    if (!$check || $check->num_rows === 0) {
        return true; // Treat as inactive if no record
    }

    $row = $check->fetch_assoc();
    return ((int)$row['plan'] === 0);
}

// Check if action is set
$action = $_POST['action'] ?? '';

if ($action === 'fetch') {

    if (isPlan($conn)) {
        echo json_encode([]);
        exit;
    }
    
    // Check plan value first
    $planCheck = $conn->query("SELECT plan FROM PlanSelection LIMIT 1");
    $planRow = $planCheck->fetch_assoc();

    // If plan is NOT 0, continue fetching data
    $sql = "SELECT * FROM OutputTable ORDER BY id ASC LIMIT 14";
    $result = $conn->query($sql);

    $data = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }

    echo json_encode($data);
}

if ($action === 'fetchPlanOutput') {

    // 1️⃣ Get the selected plan ID
    $sqlPlan = "SELECT plan FROM PlanSelection LIMIT 1";
    $resultPlan = $conn->query($sqlPlan);

    
    $planId = 0;
    if ($resultPlan && $resultPlan->num_rows > 0) {
        $rowPlan = $resultPlan->fetch_assoc();
        $planId = intval($rowPlan['plan']);
    }

    // Default data
    $data = [
        "partnumber"     => "-",
        "model"          => "-",
        "balance"        => "-",
        "manpower"       => "-",
        "prodhrs"        => "-",
        "deliverydate"   => "-",
        "cycletime"      => "-",
        "cycletimeasof"  => "-",
        "expirationdate" => "-"
    ];

    // 2️⃣ If we have a plan ID, fetch PlanOutput
    if ($planId > 0) {
        $sql = "SELECT partnumber, model, balance, manpower, prodhrs, deliverydate, cycletime, cycletimeasof, expirationdate 
                FROM PlanOutput 
                WHERE id = $planId
                LIMIT 1";
        $result = $conn->query($sql);

        if ($result && $result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $data = [
                "partnumber"     => $row['partnumber'] ?: "-",
                "model"          => $row['model'] ?: "-",
                "balance"        => $row['balance'] ?: "0",
                "manpower"       => $row['manpower'] ?: "-",
                "prodhrs"        => $row['prodhrs'] ?: "-",
                "deliverydate"   => $row['deliverydate'] ?: "-",
                "cycletime"      => $row['cycletime'] ?: "-",
                "cycletimeasof"  => $row['cycletimeasof'] ?: "-",
                "expirationdate" => $row['expirationdate'] ?: "-"
            ];
        }
    }

    echo json_encode($data);
}

if ($action === 'updateSummary') {
    header('Content-Type: application/json');

    // 1️⃣ Get the selected plan ID
    $sqlPlan = "SELECT plan FROM PlanSelection LIMIT 1";
    $resultPlan = $conn->query($sqlPlan);
    $planId = 0;
    if ($resultPlan && $resultPlan->num_rows > 0) {
        $rowPlan = $resultPlan->fetch_assoc();
        $planId = intval($rowPlan['plan']);
    }

    // Default values
    $planProdHrs = 0;
    $planManpower = 0;
    $planOutput = 0;

    // 2️⃣ Fetch plan values and calculate total_plan_output if plan exists
    if ($planId > 0) {
        $sql = "SELECT prodhrs, manpower, cycletime, mins1, mins2, mins3, mins4, mins5, mins6, mins7, mins8, mins9, mins10, mins11, mins12, mins13, mins14
                FROM PlanOutput
                WHERE id = $planId
                LIMIT 1";
        $result = $conn->query($sql);
        if ($result && $result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $planProdHrs = floatval($row['prodhrs']); // convert to integer
            $planManpower = intval($row['manpower']);

            $cycletime = floatval($row['cycletime']) ?: 1; // prevent division by zero
            $planOutput = 0;
            for ($i = 1; $i <= 14; $i++) {
                $mins = intval($row["mins$i"]); // treat NULL as 0
                $planOutput += round(($mins * 60) / $cycletime); // integer division
            }
        }
    }

    // 3️⃣ Ensure a row with id = 1 exists
    $conn->query("
        INSERT INTO summary (id) 
        VALUES (1) 
        ON DUPLICATE KEY UPDATE id=id
    ");

    // 4️⃣ Update summary table: actual = plan for prodhrs & manpower only
    $updateSummary = $conn->prepare("
        UPDATE summary
        SET plan_prodhrs = ?, plan_manpower = ?, plan_output = ?, 
            actual_prodhrs = ?, actual_manpower = ?
        WHERE id = 1
    ");
    $updateSummary->bind_param(
        "diidi",
        $planProdHrs, $planManpower, $planOutput,
        $planProdHrs, $planManpower
    );
    $success = $updateSummary->execute();

    echo json_encode([
        "success" => $success,
        "plan_prodhrs" => $planProdHrs,
        "plan_manpower" => $planManpower,
        "plan_output" => $planOutput,
        "actual_prodhrs" => $planProdHrs,
        "actual_manpower" => $planManpower
    ]);
    exit;
}

if ($action === 'update_output_durations') {
    header('Content-Type: application/json');

    // Step 1: Reorder dt_details.id to remove gaps
    $conn->query("SET @seq := 0;");
    $conn->query("
        UPDATE dt_details
        SET id = (@seq := @seq + 1)
        ORDER BY time_occurred ASC
    ");

    // Step 2: Update OutputTable.dt_mins based on sum of durations from dt_details
    $sql = "
        UPDATE OutputTable o
        LEFT JOIN (
            SELECT dt_id, SEC_TO_TIME(SUM(TIME_TO_SEC(duration))) AS total_duration
            FROM dt_details
            WHERE DATE(time_occurred) = CURDATE()
            GROUP BY dt_id
        ) d ON o.id = d.dt_id
        SET o.dt_mins = IFNULL(d.total_duration, '00:00:00')
    ";

    if (!$conn->query($sql)) {
        echo json_encode([
            "success" => false,
            "error" => $conn->error
        ]);
        exit;
    }

    // Fetch the updated data
    $result = $conn->query("SELECT id, dt_mins FROM OutputTable ORDER BY id ASC");
    $updatedData = [];
    while ($row = $result->fetch_assoc()) {
        $updatedData[] = $row;
    }

    echo json_encode([
        "success" => true,
        "message" => "dt_details IDs compacted and OutputTable.dt_mins updated successfully.",
        "data" => $updatedData
    ]);
    exit;
}

if ($action === 'get_downtime_count') {
    $dt_id = $_POST['dt_id'] ?? null;
    if (!$dt_id) {
        echo json_encode(["count" => 0]);
        exit;
    }

    $stmt = $conn->prepare("SELECT COUNT(*) AS cnt FROM dt_details WHERE dt_id = ? AND DATE(time_occurred) = CURDATE()");
    $stmt->bind_param("i", $dt_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    echo json_encode(["count" => $result['cnt'] ?? 0]);
    exit;
}

if ($action === 'fetchPlanSummary') {
    header('Content-Type: application/json; charset=utf-8');

    // Default response
    $response = [
        "prodhrs" => 0,
        "total_plan_output" => 0,
        "manpower" => 0
    ];

    // Fetch summary row (id = 1)
    $sql = "
        SELECT 
            plan_prodhrs,
            plan_manpower,
            plan_output
        FROM summary
        WHERE id = 1
        LIMIT 1
    ";

    $result = $conn->query($sql);

    if ($result && $row = $result->fetch_assoc()) {
        $response = [
            "prodhrs" => (float)$row['plan_prodhrs'],
            "total_plan_output" => (int)$row['plan_output'],
            "manpower" => (int)$row['plan_manpower']
        ];
    }

    echo json_encode($response);
    exit;
}


if ($_POST['action'] === 'fetchBalance') {

    $balance = 0;

    // Get current plan ID
    $sqlPlan = "SELECT plan FROM PlanSelection LIMIT 1";
    $resPlan = $conn->query($sqlPlan);

    if ($resPlan && $resPlan->num_rows > 0) {
        $planId = intval($resPlan->fetch_assoc()['plan']);

        if ($planId > 0) {
            // JUST FETCH balance
            $sql = "SELECT balance FROM PlanOutput WHERE id = $planId LIMIT 1";
            $res = $conn->query($sql);

            if ($res && $row = $res->fetch_assoc()) {
                $balance = $row['balance'];
            }
        }
    }

    echo json_encode([
        'balance' => $balance
    ]);
    exit;
}


if ($action === 'totalng') {
    $activeRows = isset($_POST['activeRows']) ? intval($_POST['activeRows']) : 14;

    if (isPlan($conn)) {
        echo json_encode([
            "breaktime" => "00:00",
            "totaldowntime" => "00:00:00",
            "good_qty" => 0,
            "total_ng" => 0
        ]);
        exit;
    }
    
    // 1️⃣ Get selected plan
    $sqlPlan = "SELECT plan FROM PlanSelection LIMIT 1";
    $planId = 0;
    $resultPlan = $conn->query($sqlPlan);
    if ($resultPlan && $rowPlan = $resultPlan->fetch_assoc()) {
        $planId = intval($rowPlan['plan']);
    }

    $breaktime = 0;
    $total_ng = 0;
    $good_qty = 0;

    if ($planId > 0) {
        $columns = [];
        for ($i = 1; $i < $activeRows; $i++) { // exclude last column
            $columns[] = "mins$i";
        }
        $colsStr = implode(",", $columns);

        $sqlMins = "SELECT $colsStr FROM PlanOutput WHERE id = $planId LIMIT 1";
        $resultMins = $conn->query($sqlMins);

        if ($resultMins && $rowMins = $resultMins->fetch_assoc()) {
            // Get all mins values into an array
            $minsArray = [];
            foreach ($columns as $col) {
                $minsArray[] = intval($rowMins[$col]);
            }

            // Find first non-zero index
            $firstIndex = 0;
            while ($firstIndex < count($minsArray) && $minsArray[$firstIndex] === 0) {
                $firstIndex++;
            }

            // Find last non-zero index
            $lastIndex = count($minsArray) - 1;
            while ($lastIndex >= 0 && $minsArray[$lastIndex] === 0) {
                $lastIndex--;
            }

            // Sum breaktime only between first and last non-zero (inclusive)
            for ($i = $firstIndex; $i <= $lastIndex; $i++) {
                $breaktime += (60 - $minsArray[$i]);
            }
        }


        $breakHours = floor($breaktime / 60);
        $breakMins  = $breaktime % 60;
        $breaktimeStr = sprintf("%02d:%02d", $breakHours, $breakMins);

        // 2️⃣ Get totals from OutputTable
        $sqlTotals = "SELECT 
                        SUM(ng_quantity) AS total_ng, 
                        SUM(actual_output) AS total_actual 
                    FROM OutputTable";
        $resultTotals = $conn->query($sqlTotals);

        if ($resultTotals && $rowTotals = $resultTotals->fetch_assoc()) {
            $total_ng     = intval($rowTotals['total_ng'] ?? 0);
            $total_actual = intval($rowTotals['total_actual'] ?? 0);
            $good_qty     = $total_actual - $total_ng;
        }
    } else {
        $breaktimeStr = "00:00";
    }

    // 3️⃣ Ensure summary row exists
    $conn->query("INSERT INTO summary (id) VALUES (1) ON DUPLICATE KEY UPDATE id=id");

    // 4️⃣ Update summary table
    $stmt = $conn->prepare("
        UPDATE summary
        SET breaktime = ?, 
            totaldowntime = SEC_TO_TIME((SELECT SUM(TIME_TO_SEC(dt_mins)) FROM OutputTable)),
            good_qty = ?, 
            total_ng = ?
        WHERE id = 1
    ");
    $stmt->bind_param("sii", $breaktimeStr, $good_qty, $total_ng);
    $stmt->execute();

    // 5️⃣ Fetch from summary and return
    $resultSummary = $conn->query("
        SELECT breaktime, totaldowntime, good_qty, total_ng 
        FROM summary 
        WHERE id = 1
    ");
    $rowSummary = $resultSummary->fetch_assoc();

    echo json_encode([
        "breaktime"     => $rowSummary['breaktime'],
        "totaldowntime" => $rowSummary['totaldowntime'],
        "good_qty"      => $rowSummary['good_qty'],
        "total_ng"      => $rowSummary['total_ng']
    ]);
    exit;
}


if ($action === 'fetchActualSummary') {
    header('Content-Type: application/json');

    if (isPlan($conn)) {
        echo json_encode([
            "actual_prodhrs" => 0,
            "total_actual_output" => 0,
            "actual_manpower" => 0
        ]);
        exit;
    }

    // 1️⃣ SUM of actual_output from OutputTable
    $sqlOutput = "SELECT SUM(actual_output) AS total_actual_output FROM OutputTable";
    $resultOutput = $conn->query($sqlOutput);

    $totalActualOutput = 0;
    if ($resultOutput && $rowOutput = $resultOutput->fetch_assoc()) {
        $totalActualOutput = intval($rowOutput['total_actual_output']); // integer
    }

    // 2️⃣ Update summary table with actual_output
    $updateSummary = $conn->prepare("
        UPDATE summary
        SET actual_output = ?
        WHERE id = 1
    ");
    $updateSummary->bind_param("i", $totalActualOutput);
    $updateSummary->execute();

    // 3️⃣ Fetch actual_prodhrs, actual_manpower, and actual_output from summary
    $sqlSummary = "SELECT actual_prodhrs, actual_manpower, actual_output 
                FROM summary 
                WHERE id = 1 
                LIMIT 1";
    $resultSummary = $conn->query($sqlSummary);

    $actualProdHrs = 0;
    $actualManpower = 0;
    $actualOutput = 0;

    if ($resultSummary && $rowSummary = $resultSummary->fetch_assoc()) {
        $actualProdHrs = floatval($rowSummary['actual_prodhrs']);
        $actualManpower = intval($rowSummary['actual_manpower']);
        $actualOutput = intval($rowSummary['actual_output']);
    }

    // 4️⃣ Return JSON
    echo json_encode([
        "actual_prodhrs"      => $actualProdHrs,
        "total_actual_output" => $actualOutput,
        "actual_manpower"     => $actualManpower
    ]);
}

if ($action === 'copyPlanMinutesToOutputTable') {

    if (isPlan($conn)) {
        echo json_encode(["status" => "no_plan_selected"]);
        exit;
    }
    
    // 1️⃣ Get selected plan ID
    $sqlPlan = "SELECT plan FROM PlanSelection LIMIT 1";
    $resultPlan = $conn->query($sqlPlan);

    $planId = 0;
    if ($resultPlan && $resultPlan->num_rows > 0) {
        $rowPlan = $resultPlan->fetch_assoc();
        $planId = intval($rowPlan['plan']);
    }

    // If no valid plan found, return
    if ($planId <= 0) {
        echo json_encode(["status" => "no_plan_selected"]);
        return;
    }

    // 2️⃣ Fetch mins1..mins14 + cycletime from selected PlanOutput row
    $sql = "SELECT mins1, mins2, mins3, mins4, mins5, mins6, mins7,
                mins8, mins9, mins10, mins11, mins12, mins13, mins14,
                cycletime
            FROM PlanOutput
            WHERE id = $planId
            LIMIT 1";

    $result = $conn->query($sql);

    if ($result && $row = $result->fetch_assoc()) {

        $ctValue = $row['cycletime'];

        // ------------------------------------
        // Loop through 14 rows and update data
        // ------------------------------------
        for ($i = 1; $i <= 14; $i++) {

            $col = "mins" . $i;
            $minsValue = $row[$col];

            // Update mins
            $update = $conn->prepare("UPDATE OutputTable SET mins = ? WHERE id = ?");
            $update->bind_param("si", $minsValue, $i);
            $update->execute();
            $update->close();

            // Compute plan_output = mins * 60 / cycletime
            $planOutput = ($ctValue > 0) ? ($minsValue * 60) / $ctValue : 0;

            // Update plan_output
            $updatePlan = $conn->prepare("UPDATE OutputTable SET plan_output = ? WHERE id = ?");
            $updatePlan->bind_param("di", $planOutput, $i);
            $updatePlan->execute();
            $updatePlan->close();
        }

        // ------------------------------------
        // Update CT field for all 14 rows
        // ------------------------------------
        $updateCT = $conn->prepare("UPDATE OutputTable SET ct = ?");
        $updateCT->bind_param("s", $ctValue);
        $updateCT->execute();
        $updateCT->close();

        echo json_encode(["status" => "success"]);

    } else {
        echo json_encode(["status" => "no_data"]);
    }
}

if ($action === 'fetchTotals') {

    if (isPlan($conn)) {
        echo json_encode(["percentage" => 0]);
        exit;
    }

    // 1️⃣ Get totals
    $sql = "SELECT 
                SUM(plan_output) AS total_plan, 
                SUM(actual_output) AS total_actual 
            FROM OutputTable";
    
    $result = $conn->query($sql);

    $totalPlan = 0;
    $totalActual = 0;

    if ($result && $row = $result->fetch_assoc()) {
        $totalPlan   = intval($row['total_plan'] ?? 0);
        $totalActual = intval($row['total_actual'] ?? 0);
    }

    // 2️⃣ Compute percentage (INT)
    $percentage = 0;
    if ($totalPlan > 0) {
        $percentage = round(($totalActual / $totalPlan) * 100);
    }

    // 3️⃣ Store to summary table
    $stmt = $conn->prepare("
        UPDATE summary 
        SET percentage = ? 
        WHERE id = 1
    ");
    $stmt->bind_param("i", $percentage);
    $stmt->execute();
    $stmt->close();

    // 4️⃣ Return only what JS needs
    echo json_encode([
        "percentage" => $percentage
    ]);
    exit;
}


if (isset($_POST['id']) && isset($_POST['percentage'])) {

    $id = (int)$_POST['id'];
    $percent = (float)$_POST['percentage'];

    if ($id > 0) {
        $stmt = $conn->prepare("UPDATE OutputTable SET percentage = ? WHERE id = ?");
        $stmt->bind_param("di", $percent, $id);

        if ($stmt->execute()) {
        /*       echo json_encode([
                "status" => "success",
                "id" => $id,
                "percent" => $percent
            ]);*/
        } else {
            echo json_encode([
                "status" => "error",
                "message" => $stmt->error
            ]);
        }

        $stmt->close();
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid ID"
        ]);
    }

}

if ($action === 'updateTotal') {
    $id = intval($_POST['id'] ?? 0);
    $total = floatval($_POST['total'] ?? 0);

    if ($id > 0) {
        $stmt = $conn->prepare("UPDATE OutputTable SET total = ? WHERE id = ?");
        $stmt->bind_param("di", $total, $id);
        $success = $stmt->execute();
        $stmt->close();

        echo json_encode(['success' => $success]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid ID']);
    }
}

if ($action === 'updateRemarksRow') {
    $id = intval($_POST['id'] ?? 0);
    $remarks = $_POST['remarks'] ?? '';

    if ($id > 0) {
        $stmt = $conn->prepare("UPDATE OutputTable SET remarks = ? WHERE id = ?");
        $stmt->bind_param("si", $remarks, $id);
        $stmt->execute();
        $stmt->close();

        echo json_encode([
            "status" => "success",
            "id" => $id,
            "remarks" => $remarks
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid ID"
        ]);
    }

    exit;
}

$action = $_POST['action'] ?? $_GET['action'] ?? '';


if ($action === 'fetchLineLeader') {

    $planId = 0;
    $leaderId = 0;

    // 1️⃣ Get selected plan ID
    $sqlPlan = "SELECT plan FROM PlanSelection LIMIT 1";
    $resultPlan = $conn->query($sqlPlan);
    if ($resultPlan && $resultPlan->num_rows > 0) {
        $rowPlan = $resultPlan->fetch_assoc();
        $planId = intval($rowPlan['plan']);
    }

    // 2️⃣ Get lineleader ID from PlanOutput
    if ($planId > 0) {
        $sqlOutput = "SELECT lineleader FROM PlanOutput WHERE id = $planId LIMIT 1";
        $resultOutput = $conn->query($sqlOutput);
        if ($resultOutput && $resultOutput->num_rows > 0) {
            $rowOutput = $resultOutput->fetch_assoc();
            $leaderId = intval($rowOutput['lineleader']);
        }
    }

    // 3️⃣ Fetch main leader data (names & title)
    $finalData = null;
    if ($leaderId > 0) {
        $sql = "SELECT fn, mn, ln, title, picture FROM line_leader_list WHERE id = $leaderId LIMIT 1";
        $result = $conn->query($sql);
        if ($result && $row = $result->fetch_assoc()) {
            $finalData = $row;
        }
    }

    if (!$finalData) {
        echo json_encode(["error" => "LEADER NOT FOUND"]);
        exit;
    }

    // 4️⃣ Picture with fallback to ID 1
    $finalPicture = $finalData['picture'] ?? null;

    if (empty($finalPicture)) {
        $sqlFallback = "SELECT picture FROM line_leader_list WHERE id = 1 LIMIT 1";
        $resultFallback = $conn->query($sqlFallback);
        if ($resultFallback && $rowFallback = $resultFallback->fetch_assoc() && !empty($rowFallback['picture'])) {
            $finalPicture = $rowFallback['picture'];
        }
    }

    // 5️⃣ Return JSON for names and title
    $response = [
        "fn" => $finalData['fn'],
        "mn" => $finalData['mn'],
        "ln" => $finalData['ln'],
        "title" => $finalData['title']
    ];

    header("Content-Type: application/json");
    echo json_encode($response);
    exit;
}

if ($action === 'fetchLineLeaderPicture') {

    $planId = 0;
    $leaderId = 0;

    // Get selected plan ID
    $sqlPlan = "SELECT plan FROM PlanSelection LIMIT 1";
    $resultPlan = $conn->query($sqlPlan);
    if ($resultPlan && $resultPlan->num_rows > 0) {
        $rowPlan = $resultPlan->fetch_assoc();
        $planId = intval($rowPlan['plan']);
    }

    // Get lineleader ID from PlanOutput
    if ($planId > 0) {
        $sqlOutput = "SELECT lineleader FROM PlanOutput WHERE id = $planId LIMIT 1";
        $resultOutput = $conn->query($sqlOutput);
        if ($resultOutput && $resultOutput->num_rows > 0) {
            $rowOutput = $resultOutput->fetch_assoc();
            $leaderId = intval($rowOutput['lineleader']);
        }
    }

    // Fetch leader picture
    $finalPicture = null;
    if ($leaderId > 0) {
        $sql = "SELECT picture FROM line_leader_list WHERE id = $leaderId LIMIT 1";
        $result = $conn->query($sql);

        if ($result && $row = $result->fetch_assoc()) {
            if (!empty($row['picture'])) {
                $finalPicture = $row['picture'];
            }
        }
    }

    // Fallback to ID 1
    if (empty($finalPicture)) {
        $sql2 = "SELECT picture FROM line_leader_list WHERE id = 0 LIMIT 1";
        $result2 = $conn->query($sql2);

        if ($result2 && $row2 = $result2->fetch_assoc()) {
            $finalPicture = $row2['picture'];
        }
    }

    if (empty($finalPicture)) {
        header("Content-Type: text/plain");
        echo "NO IMAGE";
        exit;
    }

    // Output raw image
    header("Content-Type: image/*");
    echo $finalPicture;
    exit;
}

if ($action === 'fetchProdStaff') {

    $planId = 0;
    $manpowerCount = 0;

    if (isPlan($conn)) {
        echo json_encode([]);
        exit;
    }
    
    // 1️⃣ Get selected plan ID
    $sqlPlan = "SELECT plan FROM PlanSelection LIMIT 1";
    $resultPlan = $conn->query($sqlPlan);
    if ($resultPlan && $resultPlan->num_rows > 0) {
        $rowPlan = $resultPlan->fetch_assoc();
        $planId = intval($rowPlan['plan']);
    }

    if ($planId <= 0) {
        echo json_encode(["error" => "No plan selected"]);
        exit;
    }

    // 2️⃣ Get manpower count and IDs from PlanOutput
    $sqlOutput = "SELECT manpower, manpower1, manpower2, manpower3 FROM PlanOutput WHERE id = $planId LIMIT 1";
    $resultOutput = $conn->query($sqlOutput);

    if (!$resultOutput || $resultOutput->num_rows == 0) {
        echo json_encode([]);
        exit;
    }

    $rowOutput = $resultOutput->fetch_assoc();
    $manpowerCount = intval($rowOutput['manpower']);
    if ($manpowerCount < 1) {
        echo json_encode([]);
        exit;
    }

    // Build staff IDs array based on manpowerCount
    $staffIds = [];
    for ($i = 1; $i <= $manpowerCount; $i++) {
        $col = "manpower$i";
        if (!empty($rowOutput[$col])) {
            $staffIds[] = intval($rowOutput[$col]);
        }
    }

    $staffList = [];

    foreach ($staffIds as $id) {
        $sqlStaff = "SELECT id, fn, mn, ln, title, lcdate, rcdate 
             FROM prod_staff_list 
             WHERE id = $id 
             LIMIT 1";
        $resultStaff = $conn->query($sqlStaff);
        if ($resultStaff && $rowStaff = $resultStaff->fetch_assoc()) {
            $staffList[] = [
                "id" => $rowStaff['id'],
                "fn" => $rowStaff['fn'],
                "mn" => $rowStaff['mn'],
                "ln" => $rowStaff['ln'],
                "title" => $rowStaff['title'],
                "lcdate" => $rowStaff['lcdate'],
                "rcdate" => $rowStaff['rcdate']
            ];
        }
    }

    header("Content-Type: application/json");
    echo json_encode($staffList);
    exit;
}

if ($action === 'fetchProdStaffPicture') {

    // Get staff ID from query param or POST
    $staffId = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($staffId <= 0) {
        header("Content-Type: text/plain");
        echo "NO IMAGE";
        exit;
    }

    $finalPicture = null;

    // 1️⃣ Try to get the staff picture
    $sql = "SELECT picture FROM prod_staff_list WHERE id = $staffId LIMIT 1";
    $result = $conn->query($sql);
    if ($result && $row = $result->fetch_assoc()) {
        if (!empty($row['picture'])) {
            $finalPicture = $row['picture'];
        }
    }

    // 2️⃣ Fallback to ID 1 picture
    if (empty($finalPicture)) {
        $sqlFallback = "SELECT picture FROM prod_staff_list WHERE id = 0 LIMIT 1";
        $resultFallback = $conn->query($sqlFallback);
        if ($resultFallback && $rowFallback = $resultFallback->fetch_assoc()) {
            $finalPicture = $rowFallback['picture'];
        }
    }

    // 3️⃣ Output
    if (empty($finalPicture)) {
        header("Content-Type: text/plain");
        echo "NO IMAGE";
        exit;
    }

    header("Content-Type: image/*");
    echo $finalPicture;
    exit;
}

if ($action === 'fetchManpowerCount') {

    // 1️⃣ Get selected plan ID (same method as fetchPlanSummary)
    $sqlPlan = "SELECT plan FROM PlanSelection LIMIT 1";
    $resultPlan = $conn->query($sqlPlan);

    $planId = 0;
    if ($resultPlan && $resultPlan->num_rows > 0) {
        $rowPlan = $resultPlan->fetch_assoc();
        $planId = intval($rowPlan['plan']);
    }

    $manpower = 0;

    // 2️⃣ Fetch manpower from selected PlanOutput
    if ($planId > 0) {
        $sql = "SELECT manpower FROM PlanOutput WHERE id = $planId LIMIT 1";
        $result = $conn->query($sql);

        if ($result && $row = $result->fetch_assoc()) {
            $manpower = intval($row['manpower']);
        }
    }

    echo json_encode(["manpower" => $manpower]);
    exit;
}

if ($action === 'fetch_outputs') {

    // Fetch all 14 rows (6:00–20:00) in order
    $stmt = $conn->prepare("
        SELECT actual_output 
        FROM OutputTable
        ORDER BY id ASC
        LIMIT 14
    ");

    $stmt->execute();
    $result = $stmt->get_result();

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
    exit;
}

if ($action === 'update_outputs') {
    $data = json_decode($_POST['data'] ?? '{}', true);

    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'No data received']);
        exit;
    }

    // --- Fetch all rows from OutputTable in order ---
    $stmt = $conn->prepare("SELECT id FROM OutputTable ORDER BY id ASC LIMIT ?");
    $activeRows = count($data);
    $stmt->bind_param("i", $activeRows);
    $stmt->execute();
    $result = $stmt->get_result();
    $rows = $result->fetch_all(MYSQLI_ASSOC);

    if (!$rows) {
        echo json_encode(['success' => false, 'message' => 'No rows found']);
        exit;
    }

    // --- Loop through rows and update actual_output ---
    foreach ($rows as $index => $row) {
        $inputId = $index + 1; // map 1 → activeRows
        $value = isset($data[$inputId]) ? $data[$inputId] : null;
        if ($value !== null) {
            $stmtUpdate = $conn->prepare("UPDATE OutputTable SET actual_output = ? WHERE id = ?");
            $stmtUpdate->bind_param("ii", $value, $row['id']);
            $stmtUpdate->execute();
        }
    }

    echo json_encode(['success' => true]);
}

if (isset($_POST['action']) && $_POST['action'] === 'get_today_downtime') {

    $data = [];

    $sql = "
        SELECT 
            id,
            dt_id,
            process,
            details,
            countermeasure,
            remarks,
            duration,
            time_occurred,
            time_ended,
            pic
        FROM dt_details
        WHERE dt_id BETWEEN 1 AND 14
        AND DATE(time_occurred) = CURDATE()
        ORDER BY dt_id ASC, time_occurred ASC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
    exit;
}

$actionType = $_POST['action'] ?? '';

if ($action === 'add_downtime') {

    /* ✅ VALIDATE + CAST dt_id */
    if (!isset($_POST['dt_id']) || !is_numeric($_POST['dt_id'])) {
        die("Invalid dt_id");
    }

    $dt_id = (int) $_POST['dt_id'];

    if ($dt_id < 1 || $dt_id > 14) {
        die("dt_id out of range");
    }

    /* ✅ PREPARE INSERT */
    $stmt = $conn->prepare("
        INSERT INTO dt_details
        (dt_id, process, details, countermeasure, remarks, time_occurred, time_ended, pic)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "isssssss",
        $dt_id,
        $_POST['process'],
        $_POST['details'],
        $_POST['countermeasure'],
        $_POST['remarks'],
        $_POST['time_start'],   // yyyy-mm-dd hh:mm:ss
        $_POST['time_end'],
        $_POST['pic']
    );

    /* ✅ EXECUTE */
    if ($stmt->execute()) {

        /* 🔁 FILL ID GAPS ONLY (1,4,5 → 1,2,3) */
        $conn->query("SET @seq := 0");
        $conn->query("
            UPDATE dt_details
            SET id = (@seq := @seq + 1)
            ORDER BY id
        ");
        $conn->query("ALTER TABLE dt_details AUTO_INCREMENT = 1");

        echo "Downtime added successfully";
    } else {
        echo "Insert failed: " . $stmt->error;
    }

    $stmt->close();
}

if ($_POST['action'] === 'delete_downtime') {
    $dt_id = $_POST['dt_id'];
    $date = date('Y-m-d'); // today

    // Find the row id to delete
    $stmt = $conn->prepare("SELECT id FROM dt_details WHERE dt_id = ? AND DATE(time_occurred) = ?");
    $stmt->bind_param("is", $dt_id, $date);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $id = $row['id'];
        $stmtDelete = $conn->prepare("DELETE FROM dt_details WHERE id = ?");
        $stmtDelete->bind_param("i", $id);
        if ($stmtDelete->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => $stmtDelete->error]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Record not found']);
    }
    exit;
}

if ($actionType === 'update_downtime') {
    // Get POST values and sanitize
    $dt_id = intval($_POST['dt_id'] ?? 0);
    $process = $conn->real_escape_string($_POST['process'] ?? '');
    $details = $conn->real_escape_string($_POST['details'] ?? '');
    $countermeasure = $conn->real_escape_string($_POST['countermeasure'] ?? '');
    $remarks = $conn->real_escape_string($_POST['remarks'] ?? '');
    $pic = $conn->real_escape_string($_POST['pic'] ?? '');
    $time_occurred = $conn->real_escape_string($_POST['time_occurred'] ?? '');
    $time_ended = $conn->real_escape_string($_POST['time_ended'] ?? '');

    // Update query (assuming dt_id is the primary key)
    $sql = "UPDATE dt_details
            SET process='$process', details='$details', countermeasure='$countermeasure', 
                remarks='$remarks', pic='$pic', time_occurred='$time_occurred', time_ended='$time_ended' 
            WHERE dt_id=$dt_id";

    if ($conn->query($sql)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => $conn->error]);
    }
    exit;
}

if ($action === 'add_ng_detail') {

    $ng_time_id = $_POST['ng_time_id'] ?? null;
    $ng_time = $_POST['ng_time'] ?? null; // <-- new column
    $ng_qty = $_POST['ng_qty'] ?? 1;
    $ngtype1 = $_POST['ngtype1'] ?? '-';
    $ngtype2 = $_POST['ngtype2'] ?? '-';
    $ngtype3 = $_POST['ngtype3'] ?? '-';

    if (!$ng_time_id || !$ng_time) {
        echo json_encode(['success' => false, 'message' => 'Invalid time or time ID.']);
        exit;
    }

    $stmt = $conn->prepare("
        INSERT INTO ng_details 
        (ng_time_id, ng_time, ng_qty, ngtype1, ngtype2, ngtype3) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("isisss", $ng_time_id, $ng_time, $ng_qty, $ngtype1, $ngtype2, $ngtype3);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => $stmt->error]);
    }

    $stmt->close();
    $conn->close();
    exit;
}

if ($action === 'update_ng_output') {
    $today = date('Y-m-d');

    for ($i = 1; $i <= 14; $i++) {
        // Sum ng_qty for current ng_time_id today
        $stmt = $conn->prepare("SELECT SUM(ng_qty) as total_qty FROM ng_details WHERE ng_time_id = ? AND DATE(date_added) = ?");
        $stmt->bind_param("is", $i, $today);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $totalQty = $row['total_qty'] ?? 0;

        // Update OutputTable
        $updateStmt = $conn->prepare("UPDATE OutputTable SET ng_quantity = ? WHERE id = ?");
        $updateStmt->bind_param("ii", $totalQty, $i);
        $updateStmt->execute();
        $updateStmt->close();

        $stmt->close();
    }

    echo json_encode(['success' => true]);
    exit;
}

if ($_POST['action'] === 'get_all_plans') {

    $query = "SELECT * FROM PlanOutput";
    $result = $conn->query($query);

    $plans = [];

    while ($row = $result->fetch_assoc()) {

        $cycletime = floatval($row['cycletime']) ?: 1; // prevent divide by zero
        $plannedOutput = 0;
        $firstSlot = 0;
        $lastSlot = 0;

        for ($i = 1; $i <= 14; $i++) {
            $mins = intval($row["mins$i"]);
            if ($mins > 0) {
                if ($firstSlot === 0) $firstSlot = $i; // first non-zero slot
                $lastSlot = $i; // last non-zero slot
            }
            $plannedOutput += round(($mins * 60) / $cycletime);
        }

        // ---------- TIME DISPLAY ----------
        if ($firstSlot > 0 && $lastSlot > 0) {
            $startHour = 6 + ($firstSlot - 1); // slot 1 = 6 AM
            $endHour   = 6 + $lastSlot;        // slot 1 ends at 7 AM, slot 2 ends at 8 AM

            // convert to 12-hour format
            $startHour12 = $startHour % 12;
            if ($startHour12 == 0) $startHour12 = 12;
            $startPeriod = $startHour >= 12 ? "PM" : "AM";

            $endHour12 = $endHour % 12;
            if ($endHour12 == 0) $endHour12 = 12;
            $endPeriod = $endHour >= 12 ? "PM" : "AM";

            $timeDisplay = "$startHour12:00 $startPeriod - $endHour12:00 $endPeriod";
        } else {
            $timeDisplay = "6:00 AM"; // no production
        }

        $plans[] = [
            "id" => $row['id'],
            "partnumber" => $row['partnumber'],
            "model" => $row['model'],
            "prodhrs" => $row['prodhrs'],
            "time" => $timeDisplay,
            "planned_output" => $plannedOutput
        ];
    }

    echo json_encode($plans);
    exit;
}

if ($_POST['action'] === 'get_active_plan') {

    $sql = "SELECT plan FROM PlanSelection LIMIT 1";
    $result = $conn->query($sql);

    $activePlan = 0;

    if ($result && $row = $result->fetch_assoc()) {
        $activePlan = intval($row['plan']);
    }

    echo json_encode([
        "active_plan" => $activePlan
    ]);
    exit;
}

if ($_POST['action'] === 'switch_plan') {

    $newPlanId = intval($_POST['new_plan_id']);

    // 1. Get current active plan
    $res = $conn->query("SELECT plan FROM PlanSelection LIMIT 1");
    if (!$res || $res->num_rows === 0) {
        echo json_encode(["success" => false, "msg" => "No active plan"]);
        exit;
    }

    $currentPlanId = intval($res->fetch_assoc()['plan']);

    // If same plan, do nothing
    if ($currentPlanId === $newPlanId) {
        echo json_encode(["success" => true]);
        exit;
    }

    // 2. Get values from current plan
    $sql = "
        SELECT balance, lineleader, manpower1, manpower2, manpower3
        FROM PlanOutput
        WHERE id = $currentPlanId
        LIMIT 1
    ";
    $res = $conn->query($sql);
    if (!$res || $res->num_rows === 0) {
        echo json_encode(["success" => false, "msg" => "Source plan not found"]);
        exit;
    }

    $data = $res->fetch_assoc();

    // 3. Transfer values to new plan
    $update = "
        UPDATE PlanOutput SET
            balance = '{$data['balance']}',
            lineleader = '{$data['lineleader']}',
            manpower1 = '{$data['manpower1']}',
            manpower2 = '{$data['manpower2']}',
            manpower3 = '{$data['manpower3']}'
        WHERE id = $newPlanId
        LIMIT 1
    ";
    $conn->query($update);

    // 4. Update active plan
    $conn->query("UPDATE PlanSelection SET plan = $newPlanId");

    echo json_encode(["success" => true]);
    exit;
}

if ($action === 'get_pdf') {
    // Fetch the latest PDF from swp_file table
    $result = $conn->query("SELECT file FROM swp_file ORDER BY id DESC LIMIT 1");

    if ($result && $row = $result->fetch_assoc()) {
        // Convert BLOB to base64
        $fileData = base64_encode($row['file']);
        echo json_encode([
            'success' => true,
            'file'    => $fileData
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No file found']);
    }
}

if ($action === 'get_plan_mins') {

    // 1️⃣ Get plan number from PlanSelection
    $planRes = $conn->query("
        SELECT plan
        FROM PlanSelection
        LIMIT 1
    ");

    if (!$planRes || $planRes->num_rows === 0) {
        echo json_encode([
            'success' => false,
            'message' => 'No plan found in PlanSelection.'
        ]);
        exit;
    }

    $planRow = $planRes->fetch_assoc();
    $planId = (int)$planRow['plan'];

    if ($planId === 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Plan is not set.'
        ]);
        exit;
    }

    // 2️⃣ Fetch mins1–mins14 from PlanOutput
    $minsRes = $conn->query("
        SELECT
            mins1, mins2, mins3, mins4, mins5, mins6, mins7,
            mins8, mins9, mins10, mins11, mins12, mins13, mins14
        FROM PlanOutput
        WHERE id = $planId
        LIMIT 1
    ");

    if (!$minsRes || $minsRes->num_rows === 0) {
        echo json_encode([
            'success' => false,
            'message' => 'No PlanOutput data found.'
        ]);
        exit;
    }

    $minsData = $minsRes->fetch_assoc();

    echo json_encode([
        'success' => true,
        'mins' => $minsData
    ]);
    exit;
}

if ($action === 'save_data') {

    $planRes = $conn->query("SELECT plan FROM PlanSelection LIMIT 1");
    $planRow = $planRes->fetch_assoc();
    if (!$planRow) {
        echo json_encode(["success"=>false,"message"=>"No plan found"]);
        exit;
    }
    $plan_id = (int)$planRow['plan'];

    /* =========================
       2️⃣ GET PLAN OUTPUT
    ========================= */
    $stmt = $conn->prepare("SELECT * FROM PlanOutput WHERE id = ?");
    $stmt->bind_param("i", $plan_id);
    $stmt->execute();
    $planOutput = $stmt->get_result()->fetch_assoc();
    if (!$planOutput) {
        echo json_encode(["success"=>false,"message"=>"PlanOutput not found"]);
        exit;
    }

    $partnumber     = $planOutput['partnumber'] ?? '';
    $model          = $planOutput['model'] ?? '';
    $balance        = (int)($planOutput['balance'] ?? 0);
    $manpower       = (int)($planOutput['manpower'] ?? 0);
    $prodhrs        = (float)($planOutput['prodhrs'] ?? 0);
    $deliverydate   = $planOutput['deliverydate'] ?? null;
    $cycletime      = $planOutput['cycletime'] ?? null;
    $cycletimeasof  = $planOutput['cycletimeasof'] ?? null;
    $expirationdate = $planOutput['expirationdate'] ?? null;

    $lineleader_id  = (int)($planOutput['lineleader'] ?? 0);
    $manpower1_id   = (int)($planOutput['manpower1'] ?? 0);
    $manpower2_id   = (int)($planOutput['manpower2'] ?? 0);
    $manpower3_id   = (int)($planOutput['manpower3'] ?? 0);

    /* =========================
       3️⃣ CT
    ========================= */
    $ctRes = $conn->query("SELECT ctime FROM ct LIMIT 1");
    $ctRow = $ctRes->fetch_assoc();
    $ct_val = (float)($ctRow['ctime'] ?? 0);

    /* =========================
       4️⃣ OUTPUT TABLE (14)
    ========================= */
    $outRes = $conn->query("SELECT * FROM OutputTable ORDER BY id ASC LIMIT 14");
    $outputRows = $outRes->fetch_all(MYSQLI_ASSOC);
    if (count($outputRows) < 14) {
        echo json_encode(["success"=>false,"message"=>"OutputTable < 14 rows"]);
        exit;
    }

    $mins = [];
    $output_flat = [];

    for ($i = 0; $i < 14; $i++) {
        $n = $i + 1;
        $mins[$n] = (int)$outputRows[$i]['mins'];

        $plan_output   = (int)$outputRows[$i]['plan_output'];
        $actual_output = (int)$outputRows[$i]['actual_output'];
        $remarks       = $outputRows[$i]['remarks'];

        // Check if remarks is "ONGOING" and plan_output equals actual_output
        if ($remarks === "ONGOING" && $plan_output === $actual_output) {
            $remarks = "COMPLETED";
        }

        $output_flat["mins_out$n"]      = (int)$outputRows[$i]['mins'];
        $output_flat["plan_output$n"]   = $plan_output;
        $output_flat["actual_output$n"] = $actual_output;
        $output_flat["percentage$n"]    = (int)$outputRows[$i]['percentage'];
        $output_flat["total$n"]         = (int)$outputRows[$i]['total'];
        $output_flat["dt_mins$n"]       = $outputRows[$i]['dt_mins'];
        $output_flat["ng_quantity$n"]   = (int)$outputRows[$i]['ng_quantity'];
        $output_flat["remarks$n"]       = $remarks;
    }


    /* =========================
       5️⃣ SUMMARY
    ========================= */
    $sumRes = $conn->query("SELECT * FROM summary LIMIT 1");
    $summary = $sumRes->fetch_assoc();

    $plan_prodhrs       = (float)$summary['plan_prodhrs'];
    $plan_manpower      = (int)$summary['plan_manpower'];
    $plan_output        = (int)$summary['plan_output'];

    $actual_prodhrs     = (float)$summary['actual_prodhrs'];
    $actual_manpower    = (int)$summary['actual_manpower'];
    $actual_output      = (int)$summary['actual_output'];

    $breaktime          = $summary['breaktime'];
    $totaldowntime     = $summary['totaldowntime'];
    $good_qty           = (int)$summary['good_qty'];
    $total_ng           = (int)$summary['total_ng'];
    $summary_percentage = (int)$summary['percentage'];

    /* =========================
       6️⃣ LINE LEADER & MANPOWER
    ========================= */
    function formatName($ln,$fn,$mn){ return trim("$ln, $fn $mn"); }

    $stmt = $conn->prepare("SELECT fn,mn,ln,title FROM line_leader_list WHERE id=?");
    $stmt->bind_param("i",$lineleader_id);
    $stmt->execute();
    $ll = $stmt->get_result()->fetch_assoc();

    $lineleader_name  = formatName($ll['ln'],$ll['fn'],$ll['mn']);
    $lineleader_title = $ll['title'];

    function getManpower($conn,$id){
        if(!$id) return ["",""];
        $s = $conn->prepare("SELECT fn,mn,ln,title FROM prod_staff_list WHERE id=?");
        $s->bind_param("i",$id);
        $s->execute();
        $r = $s->get_result()->fetch_assoc();
        return [formatName($r['ln'],$r['fn'],$r['mn']),$r['title']];
    }

    [$mp1_name,$mp1_title] = getManpower($conn,$manpower1_id);
    [$mp2_name,$mp2_title] = getManpower($conn,$manpower2_id);
    [$mp3_name,$mp3_title] = getManpower($conn,$manpower3_id);

    // --- 8️⃣ Flatten OutputTable rows (1–14) ---
    $flat = [];
    for ($i = 0; $i < 14; $i++) {
        $r = $outputRows[$i];
        $n = $i + 1;
        $flat["mins_out$n"]      = (int)$r['mins'];
        $flat["plan_output$n"]   = (int)$r['plan_output'];
        $flat["actual_output$n"] = (int)$r['actual_output'];
        $flat["percentage$n"]    = (int)$r['percentage'];
        $flat["total$n"]         = (int)$r['total'];
        $flat["dt_mins$n"]       = $r['dt_mins'];
        $flat["ng_quantity$n"]   = (int)$r['ng_quantity'];
        $flat["remarks$n"]       = $r['remarks'];
    }


    // --- 9️⃣ Prepare and execute INSERT ---
    $sql = "INSERT INTO saved_data (
        plan_id, partnumber, model, balance, manpower, prodhrs, deliverydate, cycletime, cycletimeasof, expirationdate,
        mins1, mins2, mins3, mins4, mins5, mins6, mins7, mins8, mins9, mins10, mins11, mins12, mins13, mins14,
        lineleader_id, manpower1_id, manpower2_id, manpower3_id,
        lineleader_name, lineleader_title, manpower1_name, manpower1_title, manpower2_name, manpower2_title, manpower3_name, manpower3_title,
        ct,
        mins_out1, plan_output1, actual_output1, percentage1, total1, dt_mins1, ng_quantity1, remarks1,
        mins_out2, plan_output2, actual_output2, percentage2, total2, dt_mins2, ng_quantity2, remarks2,
        mins_out3, plan_output3, actual_output3, percentage3, total3, dt_mins3, ng_quantity3, remarks3,
        mins_out4, plan_output4, actual_output4, percentage4, total4, dt_mins4, ng_quantity4, remarks4,
        mins_out5, plan_output5, actual_output5, percentage5, total5, dt_mins5, ng_quantity5, remarks5,
        mins_out6, plan_output6, actual_output6, percentage6, total6, dt_mins6, ng_quantity6, remarks6,
        mins_out7, plan_output7, actual_output7, percentage7, total7, dt_mins7, ng_quantity7, remarks7,
        mins_out8, plan_output8, actual_output8, percentage8, total8, dt_mins8, ng_quantity8, remarks8,
        mins_out9, plan_output9, actual_output9, percentage9, total9, dt_mins9, ng_quantity9, remarks9,
        mins_out10, plan_output10, actual_output10, percentage10, total10, dt_mins10, ng_quantity10, remarks10,
        mins_out11, plan_output11, actual_output11, percentage11, total11, dt_mins11, ng_quantity11, remarks11,
        mins_out12, plan_output12, actual_output12, percentage12, total12, dt_mins12, ng_quantity12, remarks12,
        mins_out13, plan_output13, actual_output13, percentage13, total13, dt_mins13, ng_quantity13, remarks13,
        mins_out14, plan_output14, actual_output14, percentage14, total14, dt_mins14, ng_quantity14, remarks14,
        plan_prodhrs, plan_manpower, plan_output,
        actual_prodhrs, actual_manpower, actual_output,
        breaktime, totaldowntime, good_qty, total_ng, summary_percentage,
        date_saved
    ) VALUES (
        ?,?,?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,?,?,?,?,?,?,
        ?,?,?,?,
        ?,?,?,?,?,?,?,?,
        ?,
        ?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,
        ?,?,?,
        ?,?,?,
        ?,?,?,?,?,
        NOW()
    )";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["success"=>false, "message"=>"❌ Failed to prepare INSERT statement: " . $conn->error]);
        exit;
    }

    $stmt->bind_param(
        // --- Types string ---
        "issiidssssiiiiiiiiiiiiiiiiiissssssssdiiiiisisiiiiisisiiiiisisiiiiisisiiiiisisiiiiisisiiiiisisiiiiisisiiiiisisiiiiisisiiiiisisiiiiisisiiiiisisiiiiisisdiidiissiii",
        $plan_id, $partnumber, $model, $balance, $manpower, $prodhrs, $deliverydate, $cycletime, $cycletimeasof, $expirationdate,
        $mins[1], $mins[2], $mins[3], $mins[4], $mins[5], $mins[6], $mins[7], $mins[8],
        $mins[9], $mins[10], $mins[11], $mins[12], $mins[13], $mins[14],
        $lineleader_id, $manpower1_id, $manpower2_id, $manpower3_id,
        $lineleader_name, $lineleader_title, $mp1_name, $mp1_title, $mp2_name, $mp2_title, $mp3_name, $mp3_title,
        $ct_val,
        $output_flat["mins_out1"], $output_flat["plan_output1"], $output_flat["actual_output1"], $output_flat["percentage1"], $output_flat["total1"], $output_flat["dt_mins1"], $output_flat["ng_quantity1"], $output_flat["remarks1"],
        $output_flat["mins_out2"], $output_flat["plan_output2"], $output_flat["actual_output2"], $output_flat["percentage2"], $output_flat["total2"], $output_flat["dt_mins2"], $output_flat["ng_quantity2"], $output_flat["remarks2"],
        $output_flat["mins_out3"], $output_flat["plan_output3"], $output_flat["actual_output3"], $output_flat["percentage3"], $output_flat["total3"], $output_flat["dt_mins3"], $output_flat["ng_quantity3"], $output_flat["remarks3"],
        $output_flat["mins_out4"], $output_flat["plan_output4"], $output_flat["actual_output4"], $output_flat["percentage4"], $output_flat["total4"], $output_flat["dt_mins4"], $output_flat["ng_quantity4"], $output_flat["remarks4"],
        $output_flat["mins_out5"], $output_flat["plan_output5"], $output_flat["actual_output5"], $output_flat["percentage5"], $output_flat["total5"], $output_flat["dt_mins5"], $output_flat["ng_quantity5"], $output_flat["remarks5"],
        $output_flat["mins_out6"], $output_flat["plan_output6"], $output_flat["actual_output6"], $output_flat["percentage6"], $output_flat["total6"], $output_flat["dt_mins6"], $output_flat["ng_quantity6"], $output_flat["remarks6"],
        $output_flat["mins_out7"], $output_flat["plan_output7"], $output_flat["actual_output7"], $output_flat["percentage7"], $output_flat["total7"], $output_flat["dt_mins7"], $output_flat["ng_quantity7"], $output_flat["remarks7"],
        $output_flat["mins_out8"], $output_flat["plan_output8"], $output_flat["actual_output8"], $output_flat["percentage8"], $output_flat["total8"], $output_flat["dt_mins8"], $output_flat["ng_quantity8"], $output_flat["remarks8"],
        $output_flat["mins_out9"], $output_flat["plan_output9"], $output_flat["actual_output9"], $output_flat["percentage9"], $output_flat["total9"], $output_flat["dt_mins9"], $output_flat["ng_quantity9"], $output_flat["remarks9"],
        $output_flat["mins_out10"], $output_flat["plan_output10"], $output_flat["actual_output10"], $output_flat["percentage10"], $output_flat["total10"], $output_flat["dt_mins10"], $output_flat["ng_quantity10"], $output_flat["remarks10"],
        $output_flat["mins_out11"], $output_flat["plan_output11"], $output_flat["actual_output11"], $output_flat["percentage11"], $output_flat["total11"], $output_flat["dt_mins11"], $output_flat["ng_quantity11"], $output_flat["remarks11"],
        $output_flat["mins_out12"], $output_flat["plan_output12"], $output_flat["actual_output12"], $output_flat["percentage12"], $output_flat["total12"], $output_flat["dt_mins12"], $output_flat["ng_quantity12"], $output_flat["remarks12"],
        $output_flat["mins_out13"], $output_flat["plan_output13"], $output_flat["actual_output13"], $output_flat["percentage13"], $output_flat["total13"], $output_flat["dt_mins13"], $output_flat["ng_quantity13"], $output_flat["remarks13"],
        $output_flat["mins_out14"], $output_flat["plan_output14"], $output_flat["actual_output14"], $output_flat["percentage14"], $output_flat["total14"], $output_flat["dt_mins14"], $output_flat["ng_quantity14"], $output_flat["remarks14"],
        $plan_prodhrs, $plan_manpower, $plan_output,
        $actual_prodhrs, $actual_manpower, $actual_output,
        $breaktime, $totaldowntime, $good_qty, $total_ng, $summary_percentage
    );
    
    if ($stmt->execute()) {
        $conn->query("SET @seq := 0;");
        $conn->query("UPDATE saved_data SET id = (@seq := @seq + 1)ORDER BY date_saved ASC");
        echo json_encode(["success"=>true, "message"=>"SWP data saved successfully."]);
    } else {
        echo json_encode(["success"=>false, "message"=>"Failed to save SWP data: " . $stmt->error]);
    }   
}

if ($action === 'reset_daily') {
    try {
        // 1️⃣ Get current selected plan
        $planSql = "SELECT plan FROM PlanSelection LIMIT 1";
        $planStmt = $conn->prepare($planSql);
        $planStmt->execute();
        $planStmt->bind_result($currentPlan);
        $planStmt->fetch();
        $planStmt->close();

        if (empty($currentPlan)) {
            echo json_encode([
                'success' => false,
                'message' => 'No active plan found'
            ]);
            exit;
        }

        // 2️⃣ Reset staff in PlanOutput based on plan
        $resetStaffSql = "
            UPDATE PlanOutput
            SET 
                lineleader = 0,
                manpower1 = 0,
                manpower2 = 0,
                manpower3 = 0
            WHERE id = ?
        ";
        $resetStaffStmt = $conn->prepare($resetStaffSql);
        $resetStaffStmt->bind_param("s", $currentPlan);
        $resetStaffStmt->execute();
        $resetStaffStmt->close();

        // 3️⃣ Reset actual output
        $resetOutputSql = "UPDATE OutputTable SET actual_output = 0";
        $resetOutputStmt = $conn->prepare($resetOutputSql);
        $resetOutputStmt->execute();
        $resetOutputStmt->close();

        // 4️⃣ Reset plan in PlanSelection to 0
        $resetPlanSql = "UPDATE PlanSelection SET plan = 0";
        $resetPlanStmt = $conn->prepare($resetPlanSql);
        $resetPlanStmt->execute();
        $resetPlanStmt->close();

        echo json_encode([
            'success' => true
        ]);

    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit;
}

/*else {
    echo json_encode(["success"=>false,"message"=>$e->getMessage()]);
}*/

$conn->close();
?>
