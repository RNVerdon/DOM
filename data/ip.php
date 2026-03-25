<?php
header('Content-Type: application/json');

// Function to get the IP of a specific interface
function getInterfaceIP($interface = 'wlan0') {
    $ip = null;
    $output = [];

    // Detect OS and use appropriate command
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        // Windows: use ipconfig
        exec("ipconfig", $output);
        
        $inWifiAdapter = false;
        foreach ($output as $line) {
            $line = trim($line);
            
            // Check if we're in a wireless adapter section
            if (stripos($line, 'Wireless LAN adapter') !== false || stripos($line, 'WiFi') !== false) {
                $inWifiAdapter = true;
            }
            // Reset if we hit another adapter section
            elseif (stripos($line, 'adapter') !== false && stripos($line, 'Wireless') === false) {
                $inWifiAdapter = false;
            }
            
            // Get IPv4 address from wireless adapter
            if ($inWifiAdapter && stripos($line, 'IPv4 Address') !== false) {
                preg_match('/:\s*([0-9.]+)/', $line, $matches);
                if (isset($matches[1])) {
                    $ip = $matches[1];
                    break;
                }
            }
        }
    } else {
        // Linux/Unix: use ip addr show
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
    }
    
    return $ip;
}

// Example: get wlan0 IP
$lan_ip = getInterfaceIP('wlan0');

echo json_encode([
    "lan_ip" => $lan_ip
]);
