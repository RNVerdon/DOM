<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="icon" type="image/ico" href="../../media/icons/nichivi-logo.ico">
    <title>DOM | Production Monitoring</title>
    <link rel="stylesheet" href="css/pnddesign.css">
</head>
<body>

    <nav id="website-nav">
        <div id="nav-title">
            <div id="company">
                <div>
                    <!-- <img width="35" src="../../media/icons/nichivi_logo_white.png" alt="logo"> -->
                </div>
                <div id="company-name-container">
                   
                </div>                
            </div>

            <div id="site-title">
                <div>
                    PRODUCTION OUTPUT AND DOWNTIME MONITORING
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
            <button class="nav-btns" style="width:100px;">
                Dashboard
            </button>
            <button class="nav-btns" style="width:100px;">
                History Data
            </button>
            <button class="nav-btns" onclick="goToSWP()" style="width:90px;">
                SWP
            </button>
            <button class="nav-btns">
                Video Tutorial
            </button>
        </div>
    </nav>
    <div id="dashboard-container">
        
        <div id="details">
            <div id="details-container">
                <div id="product-container">
                    <div id="product-picture">
                        <img id="pic" width="200" height="100"  src="../../media/img/ahh.png"> 
                    </div> 
                    <div id="product">
                        <div id="product-part">
                            <h4>Part Number:</h4> &nbsp; <h4>-</h4>
                        </div>
                        <div id="product-details">  
                            <span>Model:</span> <span>-</span>
                            <span>Delivery Date:</span> <span>-</span>
                            <span>Balance:</span> <span>-</span>
                            <span>Cycle Time:</span> <span>-</span>
                            <span>Manpower:</span> <span>-</span>
                            <span>Cycle Time as of:</span> <span>-</span>
                            <span>Production Hours:</span> <span>-</span>
                            <span>Expiration Date:</span> <span>-</span>
                        </div>
                    </div>

                </div>

                <div id="staffs-container">
                    <div id="header-staff">
                        Persons-in-Charge
                    </div>

                    <div id="line-leader" class="line-staff">
                        <div class="person-details">
                            <div class="picture-box">
                                <img id="ll-picture" src="" alt="wala?" width="72" height="72">
                            </div>
                            <div class="infos">
                                <div class="name">
                                    <span id="ll-ln"></span>
                                    <span id="ll-fn"></span>
                                </div>
                                <div class="person-title" id="ll-title"></div>
                            </div>
                        </div>
                    </div>

                    <div id="prod-staff" class="line-staff">
                        <div class="person-details">
                            <div class="picture-box">
                                <img src="fetches1/domfetch.php?action=fetchProdStaffPicture" alt="wala?" width="72" height="72">
                            </div>
                            <div class="infos">
                                <div class="name"><span></span><span></span></div>
                                <div class="person-title">
                                    
                                </div>
                                <div class="date-from">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="center-contents">
            <div id="production-table">
                <div id="table-data-container" class="data-container">
                    <table id="quota-data-table" class="data-table">
                        <tr>
                            <th colspan="4" class="actual-title">PLAN</th>
                            <th colspan="6" class="actual-title">ACTUAL</th>
                        </tr>

                        <tr>
                            <th class="actual-header">TIME</th>
                            <th class="actual-header">CYCLE TIME</th>
                            <th class="actual-header">MINUTES</th>
                            <th class="actual-header">PLAN OUTPUT <br><span>(Per hour)</span></th>
                            <th class="actual-header">ACTUAL <br> OUTPUT</th>
                            <th class="actual-header">PERCENTAGE</th>
                            <th class="actual-header">TOTAL</th>
                            <th class="actual-header">DOWNTIME <br>(MINS)</th>
                            <th class="actual-header">NG <br> QUANTITY</th>
                            <th class="actual-header">REMARKS</th>  
                        </tr>

                        </tr>
                            <tr>
                                <td>06:00 - 07:00</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>
                                    <div class="percent-bar-data" data-percent="0">
                                        0%
                                    </div>
                                </td>
                                <td>-</td>
                                <td>- | -</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>07:00 - 08:00</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>
                                    <div class="percent-bar-data" data-percent="0">
                                        0%
                                    </div>
                                </td>
                                <td>-</td>
                                <td>- | -</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>08:00 - 09:00</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>
                                    <div class="percent-bar-data" data-percent="0">
                                        0%
                                    </div>
                                </td>
                                <td>-</td>
                                <td>- | -</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>09:00 - 10:00</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>
                                    <div class="percent-bar-data" data-percent="0">
                                        0%
                                    </div>
                                </td>
                                <td>-</td>
                                <td>- | -</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>10:00 - 11:00</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>
                                    <div class="percent-bar-data" data-percent="0">
                                        0%
                                    </div>
                                </td>
                                <td>-</td>
                                <td>- | -</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>11:00 - 12:00</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>
                                    <div class="percent-bar-data" data-percent="0">
                                        0%
                                    </div>
                                </td>
                                <td>-</td>
                                <td>- | -</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>12:00 - 13:00</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>
                                    <div class="percent-bar-data" data-percent="0">
                                        0%
                                    </div>
                                </td>
                                <td>-</td>
                                <td>- | -</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>13:00 - 14:00</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>
                                    <div class="percent-bar-data" data-percent="0">
                                        0%
                                    </div>
                                </td>
                                <td>-</td>
                                <td>- | -</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>14:00 - 15:00</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>
                                    <div class="percent-bar-data" data-percent="0">
                                        0%
                                    </div>
                                </td>
                                <td>-</td>
                                <td>- | -</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>15:00 - 16:00</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>
                                    <div class="percent-bar-data" data-percent="0">
                                        0%
                                    </div>
                                </td>
                                <td>-</td>
                                <td>- | -</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>16:00 - 17:00</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>
                                    <div class="percent-bar-data" data-percent="0">
                                        0%
                                    </div>
                                </td>
                                <td>-</td>
                                <td>- | -</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>17:00 - 18:00</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>
                                    <div class="percent-bar-data" data-percent="0">
                                        0%
                                    </div>
                                </td>
                                <td>-</td>
                                <td>- | -</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>18:00 - 19:00</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>
                                    <div class="percent-bar-data" data-percent="0">
                                        0%
                                    </div>
                                </td>
                                <td>-</td>
                                <td>- | -</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                            <tr>
                            <td>19:00 - 20:00</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                                <div class="percent-bar-data" data-percent="0">
                                    0%
                                </div>
                            </td>
                            <td>-</td>
                            <td>- | -</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>   
                    </table>
                </div>        
            </div>
            <div id="graph-table">
                <div id="graph-table-container">
                    <div id="graph-header">
                        PRODUCTION GRAPH
                    </div>
                    <div id="graph"></div>

                    <!-- ✅ Legend Section -->
                    <div id="graph-legend">
                        <div class="legend-item">
                            <span class="legend-color green"></span>
                            <span class="legend-text">Target Reached</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-color red"></span>
                            <span class="legend-text">Incomplete</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="bottom-contents">
            <div id="btm-container">
                <div id="downtime-graph-container">
                    <div id="downtime-graph-header" class="bottom-header">DOWNTIME GRAPH (Per Hour)</div>
                    <div id="no-downtime">
                        No downtime as of today.
                    </div>
                    <div id="downtime-graph">
                        <!-- Times 06:00 to 19:00 -->
                        <div class="bar2-row" data-time="06:00">
                            <div class="time-label">06:00</div>
                            <div class="bar-container2"><div class="bar2"></div></div>
                        </div>

                        <div class="bar2-row" data-time="07:00">
                            <div class="time-label">07:00</div>
                            <div class="bar-container2"><div class="bar2"></div></div>
                        </div>

                        <div class="bar2-row" data-time="08:00">
                            <div class="time-label">08:00</div>
                            <div class="bar-container2"><div class="bar2"></div></div>
                        </div>

                        <div class="bar2-row" data-time="09:00">
                            <div class="time-label">09:00</div>
                            <div class="bar-container2"><div class="bar2"></div></div>
                        </div>

                        <div class="bar2-row" data-time="10:00">
                            <div class="time-label">10:00</div>
                            <div class="bar-container2"><div class="bar2"></div></div>
                        </div>

                        <div class="bar2-row" data-time="11:00">
                            <div class="time-label">11:00</div>
                            <div class="bar-container2"><div class="bar2"></div></div>
                        </div>

                        <div class="bar2-row" data-time="12:00">
                            <div class="time-label">12:00</div>
                            <div class="bar-container2"><div class="bar2"></div></div>
                        </div>


                        <div class="bar2-row" data-time="13:00">
                            <div class="time-label">13:00</div>
                            <div class="bar-container2"><div class="bar2"></div></div>
                        </div>

                        <div class="bar2-row" data-time="14:00">
                            <div class="time-label">14:00</div>
                            <div class="bar-container2"><div class="bar2"></div></div>
                        </div>

                        <div class="bar2-row" data-time="15:00">
                            <div class="time-label">15:00</div>
                            <div class="bar-container2"><div class="bar2"></div></div>
                        </div>

                        <div class="bar2-row" data-time="16:00">
                            <div class="time-label">16:00</div>
                            <div class="bar-container2"><div class="bar2"></div></div>
                        </div>

                        <div class="bar2-row" data-time="17:00">
                            <div class="time-label">17:00</div>
                            <div class="bar-container2"><div class="bar2"></div></div>
                        </div>

                        <div class="bar2-row" data-time="18:00">
                            <div class="time-label">18:00</div>
                            <div class="bar-container2"><div class="bar2"></div></div>
                        </div>

                        <div class="bar2-row" data-time="19:00">
                            <div class="time-label">19:00</div>
                            <div class="bar-container2"><div class="bar2"></div></div>
                        </div>
                    </div>
                </div>


                <div id="summary">
                    <div id="summary-container">
                        <div id="plan-summary">
                            <div id="planned-summary-container">
                                <div id="planned-summary-header" class="bottom-header2">
                                    PLANNED SUMMARY
                                </div>
                                <div id="planned-summary-body" class="summary-body">
                                    <span>PLAN PRODUCTION HOURS:</span>
                                    <span>-</span>
                                    <span>PLAN OUTPUT:</span>
                                    <span>-</span>
                                    <span>PLAN MANPOWER:</span>
                                    <span>-</span>
                                </div>
                            </div>
                        </div>
                        <div id="actual-summary">
                            <div id="actual-summary-container">
                                <div id="actual-summary-header" class="bottom-header2">
                                    ACTUAL SUMMARY
                                </div>
                                <div id="actual-summary-body" class="summary-body">
                                    <span>ACTUAL PRODUCTION HOURS:</span>
                                    <span>-</span>
                                    <span>ACTUAL OUTPUT:</span>
                                    <span>-</span>
                                    <span>ACTUAL MANPOWER:</span>
                                    <span>-</span>
                                </div>
                            </div>
                        </div>                       
                    </div>
                    <div id="overview-container">
                        <span>BREAKTIME:</span> <span>-</span>
                        <span>TOTAL DOWNTIME:</span> <span>-</span>
                        <span>GOOD QUANTITY:</span> <span>-</span>
                        <span>TOTAL NG:</span> <span>-</span>
                    </div>

                </div>

                <div id="pie-graph">
                    <div id="dandt">
                        <span id="time">--:-- --</span>
                        <span id="date">-- --, ----</span>
                    </div>

                    <div id="pie-graphs">
                        <div class="pie-text">0%</div>
                    </div>                        

                    <div>
                        <button id="save-btn" class="final-btn">Save Data</button>
                        <button id="edit-btn" class="final-btn">Settings</button>   
                    </div>
                   
                </div>
            </div>
        </div>
    </div>

    <div class="settings-overlay" id="settings-overlay">
        <div class="modal" id="settings-modal">
            <div id="settings-header">
                <h3>Settings</h3>                
                <button class="exit-btn" onclick="closeSettings()">&times;</button>
            </div>
            <div id="settings-contents">
                <div class="btns-form-container">
                    <nav class="btns-form">
                        <button onclick="showDataHandling()" class="active">Data Handling</button>
                        <button onclick="showGeneralization()">Generalization</button>
                    </nav>
                </div>

            <div id="data-handling-container">
                <div id="data-handling-selection">
                    <div id="data-buttons">
                        <button class="edits" id="editsbtn1">
                            <div class="title-edit">
                                Edit Daily Output
                                <p>Edits the daily count of the output created on the current day.</p>                                    
                            </div>
                            <div>></div>
                        </button>
                        <button class="edits" id="editsbtn2">
                            <div class="title-edit">
                                Add Downtime
                                <p>Form for filling up the downtime occurred in a certain time and its details.</p>                                    
                            </div>
                            <div>></div>
                        </button> 
                        <button class="edits" id="editsbtn3">
                            <div class="title-edit">
                                Edit Downtime Details
                                <p>Edits the whole Downtime Details occurred on the current day.</p>                                    
                            </div>
                            <div>></div>
                        </button>
                        <button class="edits" id="editsbtn4">
                            <div class="title-edit">
                                Add NG (No Good) Quantity
                                <p>Form for filling the NG in a certain time and its details.</p>                                    
                            </div>
                            <div>></div>
                        </button> 
                        <button class="edits" id="editsbtn5">
                            <div class="title-edit">
                                Change Plan
                                <p>Change the current plan running in the production line.</p>                                    
                            </div>
                            <div>></div>
                        </button> 
                      <!--  <button class="edits" id="editsbtn4">
                            <div class="title-edit">
                                Change Manpower
                                <p>Change the person-in-charge of the process.</p>                                    
                            </div>
                            <div>></div>
                        </button>  -->                           
                    </div>
                </div>

                <div class="data-handlers" id="edit-daily" style="display:none;">
                    <div class="headers-handlers">
                        <button class="back-btn">< Back</button>
                        <h2>Edit Daily Output</h2>
                    </div>
                    <div class="data-content" id="daily-output-content">
                        <div id="timely-outputs">
                            <div class="outputs">
                                <label for="6">6:00 - 7:00</label>
                                <input type="number" name="six" id="6" placeholder="Enter Output">
                            </div>
                            <div class="outputs">
                                <label for="7">7:00 - 8:00</label>
                                <input type="number" name="seven" id="7" placeholder="Enter Output">
                            </div>
                            <div class="outputs">
                                <label for="8">8:00 - 9:00</label>
                                <input type="number" name="eight" id="8" placeholder="Enter Output">
                            </div>
                            <div class="outputs">
                                <label for="9">9:00 - 10:00</label>
                                <input type="number" name="nine" id="9" placeholder="Enter Output">
                            </div>
                            <div class="outputs">
                                <label for="10">10:00 - 11:00</label>
                                <input type="number" name="ten" id="10" placeholder="Enter Output">
                            </div>
                            <div class="outputs">
                                <label for="11">11:00 - 12:00</label>
                                <input type="number" name="eleven" id="11" placeholder="Enter Output">
                            </div>
                            <div class="outputs">
                                <label for="12">12:00 - 13:00</label>
                                <input type="number" name="twelve" id="12" placeholder="Enter Output">
                            </div>
                            <div class="outputs">
                                <label for="13">13:00 - 14:00</label>
                                <input type="number" name="thirteen" id="13" placeholder="Enter Output">
                            </div>
                            <div class="outputs">
                                <label for="14">14:00 - 15:00</label>
                                <input type="number" name="fourteen" id="14" placeholder="Enter Output">
                            </div>
                            <div class="outputs">
                                <label for="15">15:00 - 16:00</label>
                                <input type="number" name="fifteen" id="15" placeholder="Enter Output">
                            </div>
                            <div class="outputs">
                                <label for="16">16:00 - 17:00</label>
                                <input type="number" name="sixteen" id="16" placeholder="Enter Output">
                            </div>
                            <div class="outputs">
                                <label for="17">17:00 - 18:00</label>
                                <input type="number" name="seventeen" id="17" placeholder="Enter Output">
                            </div>
                            <div class="outputs">
                                <label for="18">18:00 - 19:00</label>
                                <input type="number" name="eighteen" id="18" placeholder="Enter Output">
                            </div>
                            <div class="outputs">
                                <label for="19">19:00 - 20:00</label>
                                <input type="number" name="nineteen" id="19" placeholder="Enter Output">
                            </div>
                        </div>
                        <div id="buttons-edit">
                            <div id="keypad">
                               <!-- <div id="keypad-header">&#x2630;</div> -->
                                <div class="keypad-buttons">
                                    <button class="key">1</button>
                                    <button class="key">2</button>
                                    <button class="key">3</button>
                                    <button class="key">4</button>
                                    <button class="key">5</button>
                                    <button class="key">6</button>
                                    <button class="key">7</button>
                                    <button class="key">8</button>
                                    <button class="key">9</button>
                                    <button class="key">0</button>
                                    <button class="key">.</button>
                                    <button class="key">←</button>
                                    <button class="key clear">C</button>
                                </div>                   
                             
                            </div>  
                            <div>
                                <button class="output-buttons" id="edit-output">Edit</button>
                                <button class="output-buttons" id="confirm-output">Confirm</button>
                                <button class="output-buttons" id="cancel-output">Cancel</button>                                
                            </div>
                        </div>
                    </div>
                </div>    

                <div class="data-handlers" id="add-downtime" style="display: none;">
                    <div class="headers-handlers">
                        <button class="back-btn">< Back</button>
                        <h2>Add Downtime</h2>
                    </div>                   
                    <div class="data-content" id="daily-downtime-input">
                        <div id="input-container">
                            <div id="input-dt-1">
                                <label for="add-time-occurred">Time Occurred:</label>
                                <select id="add-time-occurred"></select>
                            </div>

                            <div id="input-dt-2">
                                <label for="process-add">Process:</label>
                                <input type="text" id="process-add">
                            </div>

                            <div id="input-dt-3">
                                <label for="dt-details-add">Downtime Details:</label>
                                <input type="text" id="dt-details-add">
                            </div>

                            <div id="input-dt-4">
                                <label for="countermeasure-add">Countermeasure:</label>
                                <input type="text" id="countermeasure-add">
                            </div>

                            <div id="input-dt-6">
                                <label>Time Range:</label>
                                <div id="time-wrapper">
                                    <input type="time" step="1" id="time-start-add">
                                    -
                                    <input type="time" step="1" id="time-end-add">
                                </div>
                            </div>

                            <div id="input-dt-7">
                                <label for="pic-add">Person-in-Charge</label>
                                <input type="text" id="pic-add">
                            </div>

                            <div id="input-dt-5">
                                <label for="remarks-add">Remarks:</label>
                                <input type="text" id="remarks-add">
                            </div>

                            <button id="add-dt-btn">Add Downtime</button>
                        </div>
                    </div> 
                </div>

                <div class="data-handlers" id="edit-downtime" style="display:none;">
                    <div class="headers-handlers">
                        <button class="back-btn">< Back</button>
                        <h2>Edit Downtime Details</h2>
                    </div>
                    <div class="data-content" id="daily-downtime-content">
                        <div id="occurred-downtime-list"></div>
                    </div>
                </div>

                <div class="data-handlers" id="add-ng" style="display:none;">
                    <div class="headers-handlers">
                        <button class="back-btn">< Back</button>
                        <h2>Add NG Quantity</h2>
                    </div>
                    <div class="data-content" id="daily-ng-content">
                        <div id="ng-form">
                            <div class="per-form">
                                <label for="time-ng">Time NG Occurred: </label>
                                <input type="time" id="time-ng" min="00:00" max="23:59" required>
                            </div>
                            <div class="per-form">
                                <label for="how-many">NG Quantity:</label>
                                <input type="number" id="how-many" min="1" required>
                            </div>
                            <div class="per-form">
                                <label for="ng1">NG Type:</label>
                                <select id="ng1" required></select>
                            </div>
                            <div class="per-form">
                                <label for="ng2">NG Type:</label>
                                <select id="ng2"></select>
                            </div>
                            <div class="per-form">
                                <label for="ng3">NG Type:</label>
                                <select id="ng3"></select> 
                            </div>
                            <button id="add-button-ng">
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                <div class="data-handlers" id="change-plan" style="display: none;">
                    <div class="headers-handlers">
                        <button class="back-btn">< Back</button>
                        <h2>Change Plan</h2>
                    </div>                   
                    <div class="data-content" id="change-plan-input">
                    <div id="plans-container">
                        <div class="plans-list card" id="plan-1">
                        </div>
                    </div>
                    </div> 
                </div>
            </div>

            <div id="generalization-container" style="display:none;">
                    <!-- Generalization content goes here -->
            </div>
        </div>
        <div id="keyboard" class="keyboard">
            <div class="keyboard-row" data-row="1">
                <button class="key">1</button>
                <button class="key">2</button>
                <button class="key">3</button>
                <button class="key">4</button>
                <button class="key">5</button>
                <button class="key">6</button>
                <button class="key">7</button>
                <button class="key">8</button>
                <button class="key">9</button>
                <button class="key">0</button>
                <button class="key">-</button>
                <button class="key">=</button>
                <button class="key backspace">⌫</button>
            </div>
            <div class="keyboard-row" data-row="2">
                <button class="key">q</button>
                <button class="key">w</button>
                <button class="key">e</button>
                <button class="key">r</button>
                <button class="key">t</button>
                <button class="key">y</button>
                <button class="key">u</button>
                <button class="key">i</button>
                <button class="key">o</button>
                <button class="key">p</button>
                <button class="key">[</button>
                <button class="key">]</button>
                <button class="key">\\</button>
            </div>
            <div class="keyboard-row" data-row="3">
                <button class="key shift">Shift</button>
                <button class="key">a</button>
                <button class="key">s</button>
                <button class="key">d</button>
                <button class="key">f</button>
                <button class="key">g</button>
                <button class="key">h</button>
                <button class="key">j</button>
                <button class="key">k</button>
                <button class="key">l</button>
                <button class="key">;</button>
                <button class="key">'</button>
                <button class="key enter">Enter</button>
            </div>
            <div class="keyboard-row" data-row="4">
                <button class="key capslock">Caps</button>
                <button class="key">z</button>
                <button class="key">x</button>
                <button class="key">c</button>
                <button class="key">v</button>
                <button class="key">b</button>
                <button class="key">n</button>
                <button class="key">m</button>
                <button class="key">,</button>
                <button class="key">.</button>
                <button class="key">/</button>
                <button class="key space" style="flex:2">Space</button>
            </div>
        </div>
    </div>

    
</body>

<script src="js/pnd.js"></script>

</html>