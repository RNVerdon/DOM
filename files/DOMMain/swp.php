<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DOM - Standard Working Procedures</title>
    <link rel="icon" type="image/ico" href="../../media/icons/nichivi-logo.ico">
    <link rel="stylesheet" href="css/swp.css">
</head>
<body>
    <nav id="website-nav">
        <div id="nav-title">
            <div id="company">
                <div>
                    <img width="35" src="../../media/icons/nichivi_logo_white.png" alt="logo">
                </div>
                <div id="company-name-container">
                   
                </div>                
            </div>

            <div id="line-nav"></div>
            <div id="site-title">
                <div>
                    DOM - STANDARD WORKING PROCEDURES
                </div>
                <div id="production_line_name">
                    Loading...
                </div> 
            </div>
        </div>
        <button id="menu-toggle">☰</button>
        <!--<div id="fullscreen-button">
            <div id="fullscreen-icon">
                <span class="corner top-left"></span>
                <span class="corner top-right"></span>
                <span class="corner bottom-left"></span>
                <span class="corner bottom-right"></span>
            </div>
        </div> -->
        <div id="nav-buttons">
            <button class="nav-btns" onclick="goToDashb()">
                Dashboard
            </button>
            <button class="nav-btns">
                History Data
            </button>
            <button class="nav-btns" onclick="goToSWP()">
                SWP
            </button>
            <button class="nav-btns">
                Video Tutorial
            </button>
        </div>
    </nav>
    <div id="swp-container">
        <div id="swp-view-box">
        </div>
    </div>
</body>
<script src="js/swp.js"></script>
</html>