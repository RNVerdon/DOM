<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

/* DB */
$conn = new mysqli("localhost", "root", "123", "monitoring");
if ($conn->connect_error) {
    die("DB connection failed");
}

if (!isset($_GET['id'])) {
    die("Missing ID");
}
$id = (int)$_GET['id'];

/* MAP IP TO LINE */
$lineMap = [
    "10.0.0.189" => "C4 Line",
    "10.0.0.102" => "C7 Line",
    "10.0.0.136" => "C9 Line",
    "10.0.0.125" => "C9-1 Line",
    "10.0.0.164" => "C10 Line"
];

$lineFile = [
    "10.0.0.189" => "C4",
    "10.0.0.102" => "C7",
    "10.0.0.136" => "C9",
    "10.0.0.125" => "C9-1",
    "10.0.0.164" => "C10"
];

function getInterfaceIP($interface = 'wlan0') {
    $ip = null;
    $output = [];
    exec("ip addr show $interface", $output);
    foreach ($output as $line) {
        $line = trim($line);
        if (strpos($line, 'inet ') === 0) {
            preg_match('/inet ([0-9.]+)\//', $line, $matches);
            if (isset($matches[1])) {
                $ip = $matches[1];
                break;
            }
        }
    }
    return $ip;
}

$serverIP = getInterfaceIP('wlan0');
$lineName = $lineMap[$serverIP] ?? "Unknown Line";

$lineNameFile = $lineFile[$serverIP] ?? "Unknown Line";

/* FETCH DATA */
$stmt = $conn->prepare("SELECT * FROM saved_data WHERE id=? LIMIT 1");
$stmt->bind_param("i", $id);
$stmt->execute();
$data = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$data) {
    die("Data not found");
}

/* XML OUTPUT */
header("Content-Type: application/xml");
$date_xml = date('F d, Y', strtotime($data['date_saved']));
$date_ko = date('Y-F-d', strtotime($data['date_saved']));
header("Content-Disposition: attachment; filename=\"{$lineNameFile}-Output_{$date_ko}.xml\"");

echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
echo "<production>\n";

/* HEADER */
echo "  <header>\n";
echo "    <date>{$date_xml}</date>\n";
echo "    <model>{$data['model']}</model>\n";
echo "    <partnumber>{$data['partnumber']}</partnumber>\n";
echo "    <line>{$lineName}</line>\n";
echo "  </header>\n";

/* INTERVALS */
echo "  <intervals>\n";
for ($i = 1; $i <= 14; $i++) {

    $dtMinutes = 0;
    if (!empty($data["dt_mins$i"])) {
        [$h, $m, $s] = explode(":", $data["dt_mins$i"]);
        $dtMinutes = round(($h * 60) + $m + ($s / 60), 2);
    }

    echo "    <row index=\"$i\">\n";
    echo "      <ct>{$data['ct']}</ct>\n";
    echo "      <mins_out>{$data["mins_out$i"]}</mins_out>\n";
    echo "      <plan>{$data["plan_output$i"]}</plan>\n";
    echo "      <actual>{$data["actual_output$i"]}</actual>\n";
    echo "      <dt>{$dtMinutes}</dt>\n";
    echo "      <ng>{$data["ng_quantity$i"]}</ng>\n";
    echo "      <remarks><![CDATA[{$data["remarks$i"]}]]></remarks>\n";
    echo "    </row>\n";
}
echo "  </intervals>\n";

/* SUMMARY */
$totalDT = 0;
if (!empty($data['totaldowntime'])) {
    foreach (explode(',', $data['totaldowntime']) as $t) {
        [$h, $m, $s] = explode(':', $t);
        $totalDT += ($h * 60) + $m + ($s / 60);
    }
}

$breakMinutes = 0;
if (!empty($data['breaktime'])) {
    foreach (explode(',', $data['breaktime']) as $t) {
        [$h, $m, $s] = explode(':', $t);
        $breakMinutes += ($h * 60) + $m + ($s / 60);
    }
}

echo "  <summary>\n";
echo "    <plan_prodhrs>{$data['plan_prodhrs']}</plan_prodhrs>\n";
echo "    <plan_output>{$data['plan_output']}</plan_output>\n";
echo "    <plan_manpower>{$data['plan_manpower']}</plan_manpower>\n";
echo "    <breaktime>" . round($breakMinutes, 2) . "</breaktime>\n";
echo "    <total_dt>" . round($totalDT, 2) . "</total_dt>\n";

echo "    <actual_prodhrs>{$data['actual_prodhrs']}</actual_prodhrs>\n";
echo "    <actual_output>{$data['actual_output']}</actual_output>\n";
echo "    <actual_manpower>{$data['actual_manpower']}</actual_manpower>\n";
echo "    <good_qty>{$data['good_qty']}</good_qty>\n";
echo "    <total_ng>{$data['total_ng']}</total_ng>\n";
echo "  </summary>\n";

echo "</production>";
exit;
