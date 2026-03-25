<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="css/startup.css">
    <link rel="icon" type="image/ico" href="../../media/icons/nichivi-logo.ico">
    <title>DOM | Start-Up Menu</title>
</head>
<body>
    <div id="startup-menu">
        <div id="title-container">
            <div id="company">
                <div id="logo">
                    <img width="35" src="../../media/icons/nichivi_logo_white.png" alt="logo">
                </div>
                <div id="company-title">
                    NICHIVI PHILIPPINES CORPORATION
                </div>
            </div>
            <div id="title">
                <span id="dom-name">DIGITAL OUTPUT MONITORING</span>
                <span id="line">Loading...</span>
                <span id="tab-name">START-UP MENU</span>
            </div>
        </div>

        <div id="fill-up-container">
            <div id="plan-container">
                <span id="please-select-span">Please Select Plan below.</span>
                <div>
                    <select id="plan-select">
                        <option value="">Loading plans...</option>
                    </select>
                </div>
                <div id="instructions">
                    <div id="instructions-header">
                        <h2>Instructions</h2>
                        <p>To start the monitoring process, you must fill in all the required fields.</p>
                        <br>                        
                    </div>

                    <span>1. Select a Plan for Today.</span>
                    <p>If there are any errors in the plan details, please coordinate with the Planner or M-Tech Engineer.</p>
                    <br>

                    <span>2. Enter the Balance.</span>
                    <p>Click the input field for the keypad to appear, then enter the remaining balance.</p>
                    <br>

                    <span>3. Select a Line Leader.</span>
                    <p>Select the Line Leader in charge.</p>
                    <br>

                    <span>4. Manpower Count.</span>
                    <p>The manpower count will be automatically filled in once you select a plan. Please double-check that the count is correct.</p>
                    <br>

                    <span>5. Select an Operator.</span>
                    <p>Choose a designated staff member for each process, and assign who is responsible for each process.</p>

                </div>
                <div id="plan-preview-container">
                    <div id="plan-preview"></div>
                </div>
            </div>
            <div id="right-container">
                <div id="balance">
                    <p>Enter Balance:</p>
                    <input type="number" id="balance-input">
                </div>
                <div id="person-in-charge-container">

                    <div id="line-leader-container">
                        <div id="header-ll">
                            <span>Line Leader</span>
                            <select id="line-leader-select" class="staff-input">
                                <option value="">Select Line Leader:</option>
                            </select>                            
                        </div>
                        <div id="body-ll">
                                <div id="picture-ll">
                                </div>
                                <div id="details-ll">
                                    <div><span id="surname">(Surname)</span></div>
                                    <div><span id="fn-mn">(First Name)(Middle Initial)</span></div>
                                    <div id="ll-title">(Title)</div>
                                </div>
                        </div>
                    </div>

                    <div id="manpower-container">
                        <div id="header-op">
                            <label for="manpower-input" id="manpower-label">Manpower Count:</label>
                            <input type="number" id="manpower-input" min="1" max="3">
                        </div>
                        <div id="staffs-container">
                            <div id="staff-1" class="staffs">
                                <select name="select-1" id="select-1" class="staff-select">
                                    <option value="">Select Person 1</option>
                                </select>
                                <img class="staff-picture">
                                    <div class="staff-details">
                                    <div class="staff-ln">(Surname)</div>
                                    <div class="staff-fn">(First Name)(M.I.)</div>
                                    <div class="staff-title"></div>
                                    <select id="staff-1-select" class="prod-input">
                                        <option value="">Select Process</option>
                                        <option value="Person 1 (Process)">Person 1 (Process)</option>
                                        <option value="Person 2 (Process)">Person 2 (Process)</option>
                                        <option value="Person 3 (Process)">Person 3 (Process)</option>
                                        <option value="Final Inspection">Final Inspection</option>
                                    </select>
                                    </div>
                            </div>
                            <div id="staff-2" class="staffs">
                                <select name="select-2" id="select-2" class="staff-select">
                                    <option value="">Select Person 2</option>
                                </select>
                                <img class="staff-picture">
                                <div class="staff-details">
                                    <div class="staff-ln">(Surname)</div>
                                    <div class="staff-fn">(First Name)(M.I.)</div>
                                    <div class="staff-title"></div>
                                    <select id="staff-2-select" class="prod-input">
                                        <option value="">Select Process</option>
                                        <option value="Person 1 (Process)">Person 1 (Process)</option>
                                        <option value="Person 2 (Process)">Person 2 (Process)</option>
                                        <option value="Person 3 (Process)">Person 3 (Process)</option>
                                        <option value="Final Inspection">Final Inspection</option>
                                    </select>           
                                </div>
                            </div>
                            <div id="staff-3" class="staffs">
                                <select name="select-3" id="select-3" class="staff-select">
                                    <option value="">Select Person 3</option>
                                </select>
                                <img class="staff-picture">
                                    <div class="staff-details">
                                    <div class="staff-ln">(Surname)</div>
                                    <div class="staff-fn">(First Name)(M.I.)</div>
                                    <div class="staff-title"></div>
                                    <select id="staff-3-select" class="prod-input">
                                        <option value="">Select Process</option>
                                        <option value="Person 1 (Process)">Person 1 (Process)</option>
                                        <option value="Person 2 (Process)">Person 2 (Process)</option>
                                        <option value="Person 3 (Process)">Person 3 (Process)</option>
                                        <option value="Final Inspection">Final Inspection</option>
                                    </select>
                                    </div>
                            </div>                        
                        </div>
                    </div>
                </div>
            </div>
        </div>    

        <div id="button-container">
                <button id="button-submit">
                    Start Production
                </button>
        </div>                    
    </div>

    <div id="keypad" class="hidden">
        <button class="key">1</button>
        <button class="key">2</button>
        <button class="key">3</button>
        <button class="key" data-action="back">⌫</button>

        <button class="key">4</button>
        <button class="key">5</button>
        <button class="key">6</button>
        <button class="key" data-action="clear">C</button>

        <button class="key">7</button>
        <button class="key">8</button>
        <button class="key">9</button>
        <button class="key" data-action="check">✓</button>

        <button class="key">0</button>
        <button class="key" data-action="cancel">✕</button>
    </div>

    <div id="overlay" class="hidden"></div>

    <!-- Modal -->
    <div id="already-filled-modal" class="hidden">
        <div class="modal-content">
            <p>You already filled up this form.</p>
            <button id="proceed-dashboard-btn">Proceed to DOM Dashboard</button>
        </div>
    </div>



    
    <script src="js/startup.js"></script>
</body>
</html>