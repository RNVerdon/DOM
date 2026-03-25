////////////////////////////////////////////////////////////////
//mobile version
const menuToggle = document.getElementById('menu-toggle');
const navButtons = document.getElementById('nav-buttons');

menuToggle.addEventListener('click', (event) => {
    event.stopPropagation(); 
    navButtons.classList.toggle('active');
});

document.addEventListener('click', (event) => {
    const isClickInsideMenu = navButtons.contains(event.target);
    const isClickOnToggle = menuToggle.contains(event.target);

    if (!isClickInsideMenu && !isClickOnToggle) {
    navButtons.classList.remove('active');
    }
});



//mobile version
////////////////////////////////////////////////////////////////
function goToSWP() {
    window.location.href = 'swp.php';
}

const buttons = document.querySelectorAll('.nav-btns');
buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
    navButtons.classList.remove('active');
    });
});
////////////////////////////////////////////////////////////////
// LINE NAMES
const dashboardNames = {
    "192.168.1.32": "TUBE ASSEMBLY: C4 TUBE LINE",
    "10.0.0.102": "TUBE ASSEMBLY: C7 TUBE LINE",
    "10.0.0.136": "TUBE ASSEMBLY: C9 TUBE LINE",
    "10.0.0.125": "TUBE ASSEMBLY: C9-1 TUBE LINE",
    "10.0.0.164": "TUBE ASSEMBLY: C10 TUBE LINE",
    "localhost": "ADMINISTRATOR",
    "192.168.0.228": "TUBE ASSEMBLY: C4 TUBE LINE"
}

async function getCurrentIP() {
    try {
        const res = await fetch("../../data/ip.php");
        const data = await res.json();
        currentIP = data.lan_ip;
        console.log("LAN IP:", currentIP);
        return currentIP;
    } catch (err) {
        console.error("Failed to fetch LAN IP:", err);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const titleDiv = document.getElementById("production_line_name");

    const currentIP = await getCurrentIP();

    if (currentIP && dashboardNames[currentIP]) {
        titleDiv.textContent = dashboardNames[currentIP];
    } else {
        titleDiv.textContent = "NO INTERNET";
    }
});

/*
document.addEventListener("DOMContentLoaded", () => {
    const titleSpan = document.querySelector("#production_line_name");
    if (titleSpan && typeof dashboardTitle !== "undefined") {
        titleSpan.textContent = dashboardTitle;
    }

    const fullscreenButton = document.getElementById("fullscreen-button");
    const fullscreenIcon = document.getElementById("fullscreen-icon");

    // --- FULLSCREEN HELPERS ---
    function isFullscreen() {
        return (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );
    }

    function requestFullscreen(elem) {
        if (elem.requestFullscreen) return elem.requestFullscreen();
        if (elem.webkitRequestFullscreen) return elem.webkitRequestFullscreen();
        if (elem.mozRequestFullScreen) return elem.mozRequestFullScreen();
        if (elem.msRequestFullscreen) return elem.msRequestFullscreen();
    }

    function exitFullscreen() {
        if (document.exitFullscreen) return document.exitFullscreen();
        if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
        if (document.mozCancelFullScreen) return document.mozCancelFullScreen();
        if (document.msExitFullscreen) return document.msExitFullscreen();
    }

    // --- OPTIONAL: LOCK ORIENTATION (KIOSK-LIKE) ---
    async function lockOrientation() {
        if (screen.orientation && screen.orientation.lock) {
            try {
                await screen.orientation.lock("landscape");
            } catch (err) {
                console.warn("Orientation lock denied:", err);
            }
        }
    }

    async function unlockOrientation() {
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
    }

    // --- BUTTON CLICK ---
    fullscreenButton.addEventListener("click", async () => {
        if (!isFullscreen()) {
            await requestFullscreen(document.documentElement);
            await lockOrientation();
        } else {
            await exitFullscreen();
            await unlockOrientation();
        }
    });

    // --- FULLSCREEN CHANGE LISTENER ---
    const fullscreenEvents = [
        "fullscreenchange",
        "webkitfullscreenchange",
        "mozfullscreenchange",
        "MSFullscreenChange"
    ];

    fullscreenEvents.forEach(event => {
        document.addEventListener(event, () => {
            if (isFullscreen()) {
                fullscreenIcon.classList.add("fullscreen");
                document.body.classList.add("fullscreen-active");
            } else {
                fullscreenIcon.classList.remove("fullscreen");
                document.body.classList.remove("fullscreen-active");
                unlockOrientation();
            }
        });
    });

    // --- PREVENT ACCIDENTAL ESC (LIMITED BY BROWSER) ---
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isFullscreen()) {
            e.preventDefault();
            console.warn("ESC pressed — browser may still exit fullscreen");
        }
    });
});*/


//LINE NAMES
////////////////////////////////////////////////////////////////

// 1️⃣ Fetch and display plan output
fetch('fetches1/domfetch.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'action=fetchPlanOutput'
})
.then(res => res.json())
.then(data => {
    // Display the data
    document.querySelector('#product-part h4:nth-child(2)').textContent = data.partnumber;
    const spans = document.querySelectorAll('#product-details span');
    spans[1].textContent = data.model;
    spans[3].textContent = data.deliverydate;
    spans[5].textContent = data.balance;
    spans[7].textContent = data.cycletime;
    spans[9].textContent = data.manpower;
    spans[11].textContent = data.cycletimeasof;
    spans[13].textContent = data.prodhrs;
    spans[15].textContent = data.expirationdate;

    // 2️⃣ After displaying, call the new action to update the summary table
    return fetch('fetches1/domfetch.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'action=updateSummary' // <-- this is your new PHP action
    });
})
.then(res => res.json())
.then(resp => {
    console.log('Summary table updated:', resp);
})
.catch(err => {
    console.error('Error:', err);
});

function updateBalance() {
    fetch('fetches1/domfetch.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'action=fetchBalance' // new lightweight action
    })
    .then(res => res.json())
    .then(data => {
        // update only the balance span
        const spans = document.querySelectorAll('#product-details span');
        spans[5].textContent = data.balance;
    })
    .catch(err => console.error('Balance update error:', err));
}
setInterval(updateBalance, 3000); // 3000 ms = 3 seconds


////////////////////////////////////////////////////////////////
// PRODUCTION AND DOWNTIME GRAPH
document.addEventListener("DOMContentLoaded", () => {
    /*** FIRST GRAPH (Vertical) ***/
    const container1 = document.getElementById("graph");
    const startHour = 6;

    // Initialize graph bars and labels
    function initializeGraph(length) {
        const format = h => String(h).padStart(2, "0") + ":00";
        const labels = Array.from({ length }, (_, i) => {
            const start = startHour + i;
            const end = start + 1;
            return `${format(start)}-${format(end)}`;
        });

        for (let i = 0; i < length; i++) {
            const wrap = document.createElement("div");
            wrap.classList.add("bar-wrap");

            const barContainer = document.createElement("div");
            barContainer.classList.add("bar-container");

            const bar = document.createElement("div");
            bar.classList.add("bar");
            bar.style.height = "0%";
            bar.style.transition = "height 0.8s ease";

            const val = document.createElement("div");
            val.classList.add("bar-value");
            val.textContent = "0";
            val.style.opacity = 0; // hidden initially
            val.style.transition = "opacity 0.5s ease";

            bar.appendChild(val);
            barContainer.appendChild(bar);

            const label = document.createElement("div");
            label.classList.add("bar-label");
            label.textContent = labels[i];

            wrap.appendChild(barContainer);
            wrap.appendChild(label);
            container1.appendChild(wrap);
        }
    }

    // Update bars with new data
    function updateGraph(data, planData) {
        const bars = container1.querySelectorAll(".bar");
        const max = Math.max(...data, 1); // avoid division by 0
        const minVisible = 1; // height for zero bars

        // Find the last index that has either actual_output or plan_output > 0
        let lastNonZeroIndex = -1;
        data.forEach((v, i) => {
            if (v > 0 || (planData[i] || 0) > 0) lastNonZeroIndex = i;
        });

        bars.forEach((bar, i) => {
            const actual = data[i] || 0;
            const plan = planData[i] || 0;
            const barWrap = bar.parentElement.parentElement;

            if (i > lastNonZeroIndex) {
                // hide bars after the last non-zero
                barWrap.style.display = "none";
            } else {
                barWrap.style.display = ""; // visible

                const height = actual === 0 ? minVisible + "%" : (actual / max * 100) + "%";

                // Determine color: green if actual === plan, else default color
                const color = actual === plan && actual !== 0 ? "#4caf50" : "red";
                bar.style.backgroundColor = color;

                setTimeout(() => {
                    bar.style.height = height;

                    const val = bar.querySelector(".bar-value");
                    val.textContent = actual;
                    val.style.opacity = actual === 0 ? 0 : 1;
                }, i * 100);
            }
        });
    }

    ////////////////////////////////////////////////////////////////

    /*** 🔹 SECOND GRAPH (Horizontal Downtime) ***/
    let firstLoad = true;

    // Helper: convert "HH:MM:SS" or "MM:SS" or "SS" to seconds
    function timeToSeconds(timeStr) {
        const parts = timeStr.split(":").map(Number);
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        if (parts.length === 1) return parts[0];
        return 0;
    }

        // =========================================
        // NEW FUNCTION – INITIAL GRAPH ANIMATION
        // =========================================
    function initializeDowntimeAnimation(data) {
        const bars2 = document.querySelectorAll("#downtime-graph .bar2");
        const data2 = data.map(row => timeToSeconds(row.dt_mins));
        const max2 = Math.max(...data2, 1);

        const grid = document.getElementById("downtime-graph");

        // ===== Compute visible rows (same as update) =====
        let lastNonZeroIndex = -1;
        data2.forEach((v, i) => { if (v > 0) lastNonZeroIndex = i; });

        const visibleBars = [];

        bars2.forEach((bar, i) => {
            const wrap = bar.parentElement.parentElement;

            if (i <= lastNonZeroIndex) {
                wrap.style.display = "";
                visibleBars.push(wrap);
            } else {
                wrap.style.display = "none";
            }
        });

        // If nothing visible

        // Initialize grid sizing
        grid.style.display = "grid";
        const numRows = Math.ceil(visibleBars.length / 2);
        grid.style.gridTemplateRows = `repeat(${numRows}, auto)`;

        // ===== Animate bars =====
        const baseDelay = 300;
        bars2.forEach((bar, i) => {
            const value = data2[i] ?? 0;
            const widthPercent = (value / max2) * 100;
            bar.dataset.width = widthPercent + "%";

            // Build text
            let timeText = "";
            if (value < 60) timeText = `${value}s`;
            else if (value < 3600) timeText = `${Math.floor(value / 60)}m ${value % 60}s`;
            else {
                const h = Math.floor(value / 3600);
                const m = Math.floor((value % 3600) / 60);
                const s = value % 60;
                timeText = `${h}h ${m}m ${s}s`;
            }

            // Apply into span
            bar.textContent = "";
            let valSpan = bar.querySelector(".bar-value2");
            if (!valSpan) {
                valSpan = document.createElement("span");
                valSpan.className = "bar-value2";
                bar.appendChild(valSpan);
            }
            valSpan.textContent = timeText;
            valSpan.style.opacity = 0;

            // Reset to start
            bar.style.width = "0";

            // Animate staggered
            setTimeout(() => {
                bar.style.transition = "width 1.2s ease";
                bar.style.width = bar.dataset.width;
                valSpan.style.transition = "opacity 0.8s ease";
                valSpan.style.opacity = 1;
            }, baseDelay + i * 150);

        });
    }

    // =========================================
    // UPDATE FUNCTION – ONLY WIDTH/DISPLAY/GRID
    // =========================================
    function updateDowntimeGraph(data) {
        const bars2 = document.querySelectorAll("#downtime-graph .bar2");
        const data2 = data.map(row => timeToSeconds(row.dt_mins));

        const grid = document.getElementById("downtime-graph");
        const noDowntime = document.getElementById("no-downtime");

        // Find last non-zero value
        let lastNonZeroIndex = -1;
        data2.forEach((v, i) => { if (v > 0) lastNonZeroIndex = i; });

        const visibleBars = [];
        let hiddenCount = 0;

        bars2.forEach((bar, i) => {
            const barWrap = bar.parentElement.parentElement;

            if (i <= lastNonZeroIndex) {
                barWrap.style.display = "";
                visibleBars.push(barWrap);
            } else {
                barWrap.style.display = "none";
                hiddenCount++;
            }
        });

        // ===== Show "no downtime" if nothing visible =====
        if (visibleBars.length === 0) {
            grid.style.display = "none";
            noDowntime.style.display = "flex";
            //console.log("No downtime to display. Grid hidden.");
            return;
        } else {
            grid.style.display = "grid";
            noDowntime.style.display = "none";
        }

        // ===== Adjust grid rows dynamically =====
        const numRows = Math.ceil(visibleBars.length / 2);
        grid.style.gridTemplateRows = `repeat(${numRows}, auto)`;

        /*console.log(
            "Visible bars:", visibleBars.length,
            "Hidden bars:", hiddenCount,
            "Grid rows:", numRows
        );*/

        // ===== Update bar widths and time text =====
        const max2 = Math.max(...data2, 1);
        visibleBars.forEach((barWrap, i) => {
            const bar = barWrap.querySelector(".bar2");
            const value = data2[i] ?? 0;

            const widthPercent = (value / max2) * 100;
            bar.dataset.width = widthPercent + "%";
            bar.style.width = bar.dataset.width;

            // ===== Update time text =====
            let timeText = "";
            if (value < 60) timeText = `${value}s`;
            else if (value < 3600) timeText = `${Math.floor(value / 60)}m ${value % 60}s`;
            else {
                const hours = Math.floor(value / 3600);
                const minutes = Math.floor((value % 3600) / 60);
                const seconds = value % 60;
                timeText = `${hours}h ${minutes}m ${seconds}s`;
            }

            let valSpan = bar.querySelector(".bar-value2");
            if (!valSpan) {
                valSpan = document.createElement("span");
                valSpan.className = "bar-value2";
                bar.appendChild(valSpan);
            }
            valSpan.textContent = timeText;
        });
    }
    // =========================================
    // AJAX – FETCH AND UPDATE LOGIC
    // =========================================
    function fetchDowntimeData() {
        fetch('fetches1/domfetch.php', {
            method: 'POST',
            body: new URLSearchParams({ action: 'fetch' })
        })
        .then(res => res.json())
        .then(data => {
            if (!data || data.length === 0) return;

            if (firstLoad) {
                firstLoad = false;

                // Call pre-setup which updates output durations first
                preDowntimeSetup().then(() => {
                    // Once done, run the original animation
                    initializeDowntimeAnimation(data);
                });
            } else {
                preDowntimeSetup();
                updateDowntimeGraph(data); // Live updates
            }
        })
        .catch(err => console.error("Failed to fetch downtime data:", err));
    }

    // New function that calls update_output_durations action
    function preDowntimeSetup() {
        return fetch('fetches1/domfetch.php', {
            method: 'POST',
            body: new URLSearchParams({ action: 'update_output_durations' })
        })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                //console.log("Updated OutputTable data:", result.data);
            } else {
                console.error("Failed to update OutputTable:", result.error);
            }
        })
        .catch(err => console.error("Error in preDowntimeSetup:", err));
    }

    fetchDowntimeData();
    setInterval(fetchDowntimeData, 3000);

    /////////////////////////////////////////////////////////////////////

    function fetchGraphData() {
        fetch('fetches1/domfetch.php', {
            method: 'POST',
            body: new URLSearchParams({ action: 'fetch' })
        })
        .then(res => res.json())
        .then(data => {
            if (!data || data.length === 0) return;

            const actualOutputData = data.map(row => Number(row.actual_output) || 0);
            const planOutputData = data.map(row => Number(row.plan_output) || 0);

            if (container1.children.length === 0) {
                initializeGraph(actualOutputData.length);
                setTimeout(() => updateGraph(actualOutputData, planOutputData), 100);
            } else {
                updateGraph(actualOutputData, planOutputData);
            }
        })
        .catch(err => console.error(err));
    }

    fetchGraphData();
    setInterval(fetchGraphData, 3000);
});

////////////////////////////////////////////////////////////////
let percentage = 0; // current displayed percentage

function updatePie(percent) {
    const pie = document.querySelector('#pie-graphs');
    const text = document.querySelector('.pie-text');

    const color = percent >= 100 ? '#4caf50' : '#ffeb3b';
    pie.style.setProperty('--color', color);
    pie.style.setProperty('--percent', percent);
    text.textContent = percent + '%';
}

function animatePie(targetPercentage) {
    if (percentage < targetPercentage) {
        percentage++;
        updatePie(percentage);
        requestAnimationFrame(() => animatePie(targetPercentage));
    } else if (percentage > targetPercentage) {
        // optional: animate down if needed
        percentage--;
        updatePie(percentage);
        requestAnimationFrame(() => animatePie(targetPercentage));
    }
}

function updatePieChart() {
    fetch('fetches1/domfetch.php', {
        method: 'POST',
        body: new URLSearchParams({ action: 'fetchTotals' })
    })
    .then(res => res.json())
    .then(data => {
        if (!data || data.percentage === undefined) return;

        animatePie(data.percentage);
    })
    .catch(err => console.error(err));
}

updatePieChart();
setInterval(updatePieChart,3000);

// Live time and date
function updateTimeDate() {
    const timeEl = document.getElementById('time');
    const dateEl = document.getElementById('date');
    const now = new Date();

    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    timeEl.textContent = `${hours}:${minutes} ${ampm}`;

    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', options);
}

setInterval(updateTimeDate, 1000);
updateTimeDate();

function updateTable() {
    fetch('fetches1/domfetch.php', {
        method: 'POST',
        body: new URLSearchParams({ action: 'fetch' })
    })
    .then(res => res.json())
    .then(data => {
        if (!data || data.length === 0) return;

        const table = document.getElementById('quota-data-table');
        const rows = table.querySelectorAll('tr');

        // --- Compute last active row index ---
        let lastDataIndex = -1;
        for (let d = 0; d < data.length; d++) {
            const row = data[d];
            const hasPlanOutput = row.plan_output && Number(row.plan_output) > 0;
            if (hasPlanOutput) lastDataIndex = d;
        }

        // --- Skip first row without plan_output ---
        let firstActiveIndex = 0;
        for (let d = 0; d <= lastDataIndex; d++) {
            const row = data[d];
            const hasPlanOutput = row.plan_output && Number(row.plan_output) > 0;
            if (hasPlanOutput) {
                firstActiveIndex = d;
                break;
            }
        }

        const activeRows = lastDataIndex - firstActiveIndex + 1; // total active rows excluding leading empty

        let cumulativeTotal = 0;
        const hourStart = 6; // first row = 6AM

        for (let i = 2; i < rows.length; i++) { // skip 2 header rows
            const dataIndex = i - 2;
            const row = rows[i];
            const cells = row.querySelectorAll('td');
            const rowData = data[dataIndex] || {};
            
            const planOutput = Number(rowData.plan_output) || 0;
            const actualOutput = Number(rowData.actual_output) || 0;
            // --- Determine remark ---
            const rowHourStart = hourStart + dataIndex;
            const rowHourEnd = rowHourStart + 1;
            const now = new Date();
            const rowEndTime = new Date();
            rowEndTime.setHours(rowHourEnd, 0, 0, 0);

            let remarkText = "";
            if (planOutput === 0) {
                remarkText = "BREAK";
            } else if (now >= rowEndTime) {
                if (actualOutput > planOutput) remarkText = "EXCEEDED";
                else if (actualOutput === planOutput) remarkText = "COMPLETED";
                else remarkText = "INCOMPLETE";
            } else {
                remarkText = "ONGOING";
            }
            cells[9].textContent = remarkText;

            // --- Fill other cells ---
            cells[1].textContent = rowData.ct ?? '-';
            cells[2].textContent = rowData.mins ?? '-';
            cells[3].textContent = rowData.plan_output ?? '-';
            cells[4].textContent = rowData.actual_output ?? '-';

            const percent = planOutput > 0 ? Math.round((actualOutput / planOutput) * 100) : 0;
            const bar = cells[5].querySelector('.percent-bar-data');
            if (bar) {
                bar.textContent = percent + '%';
                bar.style.setProperty('--percent', percent);
                if (percent > 100) bar.style.background = `linear-gradient(to right, red ${percent}%, transparent 0)`;
                else if (percent === 100) bar.style.background = `linear-gradient(to right, #58ff58 ${percent}%, transparent 0)`;
                else bar.style.background = `linear-gradient(to right, yellow ${percent}%, transparent 0)`;
            }

            cumulativeTotal += actualOutput;
            cells[6].textContent = cumulativeTotal;
            if (rowData.id) {
                sendPercentToDB(rowData.id, percent);
                sendTotalToDB(rowData.id, cumulativeTotal);
                sendRemarksToDB(rowData.id, remarkText);
            }
            // --- Downtime ---
            const dtId = rowData.id;
            if (dtId) {
                fetch('fetches1/domfetch.php', {
                    method: 'POST',
                    body: new URLSearchParams({ action: 'get_downtime_count', dt_id: dtId })
                })
                .then(res => res.json())
                .then(downtimeData => {
                    const count = downtimeData.count ?? 0;
                    cells[7].textContent = count + ' | ' + (rowData.dt_mins ?? '-');
                })
                .catch(err => console.error(err));
            } else {
                cells[7].textContent = '0 | ' + (rowData.dt_mins ?? '-');
            }

            cells[8].textContent = rowData.ng_quantity ?? '-';
            updateNGOutput();
            if (dataIndex < firstActiveIndex || dataIndex > lastDataIndex) {
                // --- Hide row ---
                row.style.display = "none";

                // --- Clear / reset relevant cells ---
                cells[6].innerHTML = "0"; // cumulative total
                cells[9].innerHTML = "-"; // remarks or placeholder

                // --- Update database if needed ---
                if (rowData.id) {
                    sendTotalToDB(rowData.id, 0);
                    sendRemarksToDB(rowData.id, "-");
                }
            } else {
                // --- Show active row ---
                row.style.display = "";
            }
        }

        // --- Call updateOverview after table update ---
        updateOverview(activeRows);
        updateTimelyOutputs(firstActiveIndex, lastDataIndex);
        if (!editing) {
            fetchOutputs();
        }
    })
    .catch(err => console.error(err));
}

updateTable();
setInterval(updateTable, 3000);


function loadPlanSummary() {
    fetch("fetches1/domfetch.php", {
        method: "POST",
        body: new URLSearchParams({ action: "fetchPlanSummary" })
    })
    .then(res => res.json())
    .then(data => {

        document.querySelector("#planned-summary-body").innerHTML = `
            <span>PLAN PRODUCTION HOURS:</span>
            <span>${data.prodhrs}</span>
            <span>PLAN OUTPUT:</span>
            <span>${data.total_plan_output}</span>
            <span>PLAN MANPOWER:</span>
            <span>${data.manpower}</span>
        `;
    })
    .catch(err => console.error(err));
}

loadPlanSummary();

function loadActualSummary() {
    fetch("fetches1/domfetch.php", {
        method: "POST",
        body: new URLSearchParams({ action: "fetchActualSummary" })
    })
    .then(res => res.json())
    .then(data => {

        document.querySelector("#actual-summary-body").innerHTML = `
            <span>ACTUAL PRODUCTION HOURS:</span>
            <span>${data.actual_prodhrs}</span>
            <span>ACTUAL OUTPUT:</span>
            <span>${data.total_actual_output}</span>
            <span>ACTUAL MANPOWER:</span>
            <span>${data.actual_manpower}</span>
        `;
    })
    .catch(err => console.error(err));
}

loadActualSummary();
setInterval(loadActualSummary,3000);

fetch("fetches1/domfetch.php", {
    method: "POST",
    body: new URLSearchParams({ action: "copyPlanMinutesToOutputTable" })
})
.then(res => res.json());
//.then(d => console.log(d));

function sendPercentToDB(rowId, percent) {

    fetch('fetches1/domfetch.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ id: rowId, percentage: percent })
    })
    .then(res => res.text())
        //.then(resp => console.log(resp))
        .catch(err => console.error(err));
}

function sendTotalToDB(id, total){
    fetch('fetches1/domfetch.php', {
        method: 'POST',
        body: new URLSearchParams({ action: 'updateTotal', id, total })
    })
    .catch(err => console.error(err));
}

function sendRemarksToDB(id, remarks) {
    fetch('fetches1/domfetch.php', {
        method: 'POST',
        body: new URLSearchParams({
            action: 'updateRemarksRow',
            id: id,
            remarks: remarks
        })
    });
}

function updateOverview(activeRows) {
    if (activeRows === undefined || activeRows <= 0) return;

    fetch('fetches1/domfetch.php', {
        method: 'POST',
        body: new URLSearchParams({ 
            action: 'totalng',
            activeRows: activeRows
        })
    })
    .then(res => res.json())
    .then(data => {
        //console.log("SUMMARY DATA:", data); // ✅ DEBUG

        if (!data) return;

        const overview = document.getElementById('overview-container');
        const spans = overview.querySelectorAll("span");

        spans[1].textContent = data.breaktime      || "-"; // ✅ BREAKTIME
        spans[3].textContent = data.totaldowntime || "-"; // ✅ TOTAL DOWNTIME (FIXED)
        spans[5].textContent = data.good_qty      || "-"; // ✅ GOOD QTY (FIXED)
        spans[7].textContent = data.total_ng      || "-"; // ✅ TOTAL NG
    })
    .catch(err => console.error(err));
}



loadProdStaff();

function loadProdStaff() {
    const container = document.getElementById("prod-staff");
    container.innerHTML = ""; // clear previous staff

    // 1️⃣ Fetch staff JSON (names, title, id)
    fetch("fetches1/domfetch.php?action=fetchProdStaff")
        .then(res => res.json())
        .then(data => {
            if (!data || data.length === 0) {
                container.innerHTML = "<p>No staff available</p>";
                return;
            }

            data.forEach(staff => {
                // Combine first + middle name
                const fullFirstName = staff.fn + (staff.mn ? " " + staff.mn : "");

                // Create staff HTML
                const staffDiv = document.createElement("div");
                staffDiv.className = "person-details";

                // Picture box
                const pictureBox = document.createElement("div");
                pictureBox.className = "picture-box";

                const img = document.createElement("img");
                // Set the src to the separate PHP action for raw image
                img.src = `fetches1/domfetch.php?action=fetchProdStaffPicture&id=${staff.id}`;
                img.width = 72;
                img.height = 72;
                img.alt = "wala?";

                pictureBox.appendChild(img);

                // Infos
                const infos = document.createElement("div");
                infos.className = "infos";

                const nameDiv = document.createElement("div");
                nameDiv.className = "name";
                nameDiv.innerHTML = `<span>${staff.ln}</span><span>${fullFirstName}</span>`;

                const titleDiv = document.createElement("div");
                titleDiv.className = "person-title";
                titleDiv.textContent = staff.title;

                const dateDiv = document.createElement("div");
                const certRange = document.createElement("div");
                certRange.className = "cert-range";

                // Handle empty dates safely
                const lc = staff.lcdate ? staff.lcdate : "N/A";
                const rc = staff.rcdate ? staff.rcdate : "N/A";

                certRange.innerHTML = `<span>${lc} - ${rc}</span>`;

                dateDiv.className = "date-from";
                dateDiv.textContent = "Certification:";

                infos.appendChild(nameDiv);
                infos.appendChild(titleDiv);
                infos.appendChild(dateDiv);
                infos.appendChild(certRange);

                // Append to staffDiv
                staffDiv.appendChild(pictureBox);
                staffDiv.appendChild(infos);

                // Append staffDiv to container
                container.appendChild(staffDiv);

                
            });
        })
        .catch(err => console.error("Error loading staff:", err));
}

LineLeader();

function LineLeader(){
    fetch("fetches1/domfetch.php?action=fetchLineLeader")
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.warn(data.error);
                return;
            }

            // Combine first + middle name
            const fullFirstName = data.fn + (data.mn ? " " + data.mn : "");
            document.getElementById("ll-fn").textContent = fullFirstName;
            document.getElementById("ll-ln").textContent = data.ln;
            document.getElementById("ll-title").textContent = data.title;
        })
        .catch(err => console.error("Error fetching line leader:", err));

    // Fetch picture separately
    document.getElementById("ll-picture").src = "fetches1/domfetch.php?action=fetchLineLeaderPicture";
}

const editBtn = document.getElementById("edit-btn");
const settingsOverlay = document.getElementById("settings-overlay");

// Open modal
editBtn.addEventListener("click", () => {
    settingsOverlay.classList.add("active");
});


const buttonsset = document.querySelectorAll('.btns-form button');

buttonsset.forEach(btn => {
    btn.addEventListener('click', () => {
        buttonsset.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

function resetDataHandlingSections() {
    const confirmDiscard = confirm("Are you sure you want to discard your changes?");
    if (!confirmDiscard) return;

    const sections = document.querySelectorAll('.data-handlers');
    const selectionView = document.getElementById('data-handling-selection');

    sections.forEach(section => section.style.display = 'none');
    selectionView.style.display = 'block';

    // Reset downtime rows in edit mode
    const editWrappers = document.querySelectorAll('.append-occurred-downtime');
    editWrappers.forEach(wrapper => {
        const cancelBtn = wrapper.querySelector('.cancel-downtime-button');
        if (cancelBtn && cancelBtn.style.display !== 'none') {
            cancelBtn.click();
        }
    });

    // Reset all inputs
    resetInputs();

    // Restore modal position
    const modal = document.querySelector('.modal');
    if(modal) modal.style.bottom = '';
}

function showDataHandling() {
    const sections = document.querySelectorAll('.data-handlers');
    const isAnyVisible = Array.from(sections).some(section => section.offsetParent !== null);

    if (isAnyVisible) {
        resetDataHandlingSections();
    }

    document.getElementById('data-handling-container').style.display = 'block';
    document.getElementById('generalization-container').style.display = 'none';
}


function showGeneralization() {
    document.getElementById('data-handling-container').style.display = 'none';
    document.getElementById('generalization-container').style.display = 'block';
}

const buttonsedit = document.querySelectorAll('.edits');
const sections = document.querySelectorAll('.data-handlers');
const selectionView = document.getElementById('data-handling-selection');

// Show sections
buttonsedit.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        selectionView.style.display = 'none'; // hide selection
        sections.forEach(section => section.style.display = 'none'); // hide all
        sections[index].style.display = 'block'; // show clicked
    });
});

// Back buttons inside sections
const backBtns = document.querySelectorAll('.back-btn');
backBtns.forEach(btn => {
    btn.addEventListener('click', () => {

        // Confirm before discarding changes
        const confirmDiscard = confirm("Are you sure you want to discard your changes?");
        if (!confirmDiscard) return;

        const sections = document.querySelectorAll('.data-handlers');
        const selectionView = document.getElementById('data-handling-selection');

        // Hide all sections
        sections.forEach(section => section.style.display = 'none');

        // Show selection view
        selectionView.style.display = 'block';

        // Reset any downtime rows in edit mode
        const editWrappers = document.querySelectorAll('.append-occurred-downtime');
        editWrappers.forEach(wrapper => {
            const cancelBtn = wrapper.querySelector('.cancel-downtime-button');
            if (cancelBtn && cancelBtn.style.display !== 'none') {
                cancelBtn.click();
            }
        });

        // Reset all inputs in the form
        resetInputs();
    });
});

function resetInputs() {
    const inputs = document.querySelectorAll('#input-container input, #input-container select');
    inputs.forEach(input => {
        if (input.tagName === 'SELECT') {
            input.selectedIndex = 0; // reset selects
        } else {
            input.value = ''; // reset text/time inputs
        }
    });
}




//////////////////////////    EDIT OUTPUT DAILY /////////////////////////////
function updateTimelyOutputs(firstActiveIndex, lastDataIndex) {
    const outputs = document.querySelectorAll('#timely-outputs .outputs');

    outputs.forEach((div, index) => {
        if (index >= firstActiveIndex && index <= lastDataIndex) {
            // Match table: show exact same row positions
            div.style.display = "flex";
        } else {
            // Match table: hide leading + trailing zeros
            div.style.display = "none";

            // Clear hidden inputs
            const input = div.querySelector('input');
            if (input) input.value = "";
        }
    });
}

let activeInput = null;

// Track last focused input
document.querySelectorAll('#timely-outputs input').forEach(input => {
    input.addEventListener('focus', () => {
        activeInput = input;
    });
});

const keys = document.querySelectorAll('#keypad .key');

keys.forEach(key => {
    key.addEventListener('click', () => {
        if (!activeInput) return; // no input selected

        const keyVal = key.textContent;

        if (keyVal === '←') {
            activeInput.value = activeInput.value.slice(0, -1);
        } 
        else if (keyVal === 'C') {
            activeInput.value = '';
        } 
        else {
            activeInput.value += keyVal;
        }

        activeInput.focus();
    });
});

let editing = false;

// --- FETCH OUTPUTS ---
function fetchOutputs() {
    if (editing) return; // don't overwrite while editing

    fetch('fetches1/domfetch.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ action: 'fetch_outputs' })
    })
    .then(res => res.json())
    .then(data => {
        // data should be in order of hours 6→19
        data.forEach((row, index) => {
            const inputId = index + 6; // 6 = 6AM, 7 = 7AM, etc
            const input = document.getElementById(inputId);
            if (input) {
                input.value = row.actual_output; // assign regardless of display
            }
        });
    })
    .catch(err => console.error('Fetch Error:', err));
}



// --- EDIT / CONFIRM / CANCEL ---
document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.getElementById('edit-output');
    const confirmBtn = document.getElementById('confirm-output');
    const cancelBtn = document.getElementById('cancel-output');
    const inputs = document.querySelectorAll('#timely-outputs input');

    // Initial state
    confirmBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    inputs.forEach(input => input.readOnly = true);

    // --- EDIT BUTTON ---
    editBtn.addEventListener('click', () => {
        editing = true;
        editBtn.style.display = 'none';
        confirmBtn.style.display = 'inline-block';
        cancelBtn.style.display = 'inline-block';
        inputs.forEach(input => input.readOnly = false);
        inputs[0].focus();
    });

    // --- CANCEL BUTTON ---
    cancelBtn.addEventListener('click', () => {
        editing = false;
        editBtn.style.display = 'inline-block';
        confirmBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
        inputs.forEach(input => input.readOnly = true);

        const activeRows = inputs.length;
        fetchOutputs(activeRows);
    });

    // --- CONFIRM BUTTON ---
    confirmBtn.addEventListener('click', () => {
        // --- Ask user for confirmation ---
        const proceed = confirm("Are you sure you want to save the changes?");
        if (!proceed) return; // stop if user cancels

        const data = {};
        inputs.forEach((input, index) => {
            const inputId = index + 1; // start from 1
            data[inputId] = input.value;
        });

        console.log('Data to send:', data); // inspect before sending

        fetch('fetches1/domfetch.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=update_outputs&data=${encodeURIComponent(JSON.stringify(data))}`
        })
        .then(res => res.json())
        .then(resp => {
            console.log('Server response:', resp); // inspect response
            if (resp.success) {
                alert('Data saved successfully!');
                editing = false;
                editBtn.style.display = 'inline-block';
                confirmBtn.style.display = 'none';
                cancelBtn.style.display = 'none';
                inputs.forEach(input => input.readOnly = true);
            } else {
                alert('Error saving data.');
            }
        })
        .catch(err => console.error('Save Error:', err));
    });
});
/////////////////////////////////////////////////////////////////////////

//////////////////////////////DOWNTIME EDIT//////////////////////////////
let downtimeInterval; // global variable

document.addEventListener('DOMContentLoaded', () => {
    fetchDowntime();
    downtimeInterval = setInterval(() => {
     fetchDowntime();
    }, 10000);
});

// -------------------- FETCH & DISPLAY --------------------

function fetchDowntime() {
    fetch('fetches1/domfetch.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'action=get_today_downtime'
    })
    .then(res => res.json())
    .then(data => {

        const container = document.getElementById('occurred-downtime-list');
        container.innerHTML = ''; // clear existing

        // Show message if no downtime found
        if (!data || data.length === 0) {
            container.innerHTML = '<p>No downtime as of today.</p>';
            return;
        }

        data.forEach(row => container.appendChild(createDowntimeRow(row)));
    })
    .catch(err => console.error('Fetch error', err));
}


function createDowntimeRow(row) {
    const wrapper = document.createElement('div');
    wrapper.className = 'append-occurred-downtime';

    const startHour = Number(row.dt_id) + 5;
    const endHour = startHour + 1;
    const timeRange = `${startHour}:00 - ${endHour}:00`;

    const totalSeconds = timeToSeconds(row.duration);
    const durationText = formatDuration(totalSeconds);

    const timeOcc = formatTime(row.time_occurred);
    const timeEnd = formatTime(row.time_ended);

    // Initial HTML
    wrapper.innerHTML = `
        <p class="p1"><label for="time-occurredv" class="time-occurred">Time Occurred:</label> <br> 
        <span class="time-occurred-value" id="time-occurredv">${timeRange}</span>
        </p>
        <p class="p2"><label for="processv" class="process">Process:</label> 
        <span class="process-value" id="processv">${escapeHtml(row.process)}</span>
        </p>
        <p class="p3"><label for="detailsv" class="details">Downtime Details:</label> 
        <span class="details-value" id="detailsv">${escapeHtml(row.details)}</span>
        </p>
        <p class="p4"><label for="countermeasurev" class="countermeasure">Countermeasure:</label> 
        <span class="countermeasure-value" id="countermeasurev">${escapeHtml(row.countermeasure)}</span>
        </p>
        <p class="p5"><label for="remarksv" class="remarks">Remarks:</label> 
        <span class="remarks-value" id="remarksv">${escapeHtml(row.remarks)}</span>
        </p>
        <p class="p6"><label for="rangev" class="range">Range:</label> 
        <span class="range-value" id="rangev">${formatTo12Hour(timeOcc)} - ${formatTo12Hour(timeEnd)}</span>
        </p>
        <p class="p7"><label for="durationv" class="duration">Elapsed Time:</label> 
        <span class="duration-value" id="durationv">${durationText}</span>
        </p>
        <p class="p8"><label for="picv" class="pic">Person-in-Charge:</label> 
        <span class="pic-value" id="picv">${escapeHtml(row.pic)}</span>
        </p>
        <div id="edit-or-delete"> 
            <button class="edit-downtime-button">Edit</button>
            <button class="delete-downtime-button">Delete</button>
        </div>

        <div id="edit-container-button">
            <button class="save-downtime-button" style="display:none;">Save</button>
            <button class="cancel-downtime-button" style="display:none;">Cancel</button> 
        </div>
    `;

    // Buttons
    const editBtn = wrapper.querySelector('.edit-downtime-button');
    const delBtn = wrapper.querySelector('.delete-downtime-button');
    const saveBtn = wrapper.querySelector('.save-downtime-button');
    const cancelBtn = wrapper.querySelector('.cancel-downtime-button');

    editBtn.addEventListener('click', () => enterEditMode(wrapper, row));
    saveBtn.addEventListener('click', () => saveRow(wrapper, row));
    cancelBtn.addEventListener('click', () => cancelEdit(wrapper, row));
    delBtn.addEventListener('click', () => deleteRow(row.dt_id, wrapper)); // Use id now


    return wrapper;
}

function deleteRow(dt_id, wrapper) {
    const proceed = confirm("Are you sure you want to delete this downtime record?");
    if (!proceed) return;

    // Send dt_id to server; server will figure out the correct id
    fetch('fetches1/domfetch.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ action: 'delete_downtime', dt_id }).toString()
    })
    .then(res => res.json())
    .then(resp => {
        if (resp.success) {
            alert('Downtime record deleted successfully!');
            wrapper.remove(); // Remove from DOM immediately
        } else {
            alert('Failed to delete.');
            console.error("Server error:", resp.message);
        }
    })
    .catch(err => console.error("Fetch error:", err));
}


function enterEditMode(wrapper, row) {
    // Move modal up
    const delBtn = wrapper.querySelector('.delete-downtime-button');
    const modal = document.querySelector('.modal');
    if(modal) modal.style.bottom = '100px';

    // Stop live refresh while editing
    if (downtimeInterval) clearInterval(downtimeInterval);

    // Time Occurred dropdown (1-14)
    const timeOccurredSelect = document.createElement('select');
    timeOccurredSelect.disabled = true; // 👈 disable here

    for (let i = 1; i <= 14; i++) {
        const option = document.createElement('option');
        option.value = i;
        const h = i + 5;
        option.text = `${h}:00 - ${h + 1}:00`;
        if (i == row.dt_id) option.selected = true;
        timeOccurredSelect.appendChild(option);
    }

    wrapper.querySelector('.time-occurred-value').replaceWith(timeOccurredSelect);


    // Text inputs
    ['process','details','countermeasure','remarks','pic'].forEach(cls => {
        const span = wrapper.querySelector(`.${cls}-value`);
        const input = document.createElement('input');
        input.type = 'text';
        input.value = span.textContent;
        span.replaceWith(input);
    });

    // Range inputs (with seconds)
    const rangeSpan = wrapper.querySelector('.range-value');
    const [occ, end] = rangeSpan.textContent.split(' - ').map(t => convertTo24Hour(t));
    const occInput = document.createElement('input');
    occInput.type = 'time';
    occInput.step = '1';
    occInput.value = occ;

    const endInput = document.createElement('input');
    endInput.type = 'time';
    endInput.step = '1';
    endInput.value = end;

    const rangeWrapper = document.createElement('span');
    rangeWrapper.className = 'range-value-wrapper';
    rangeWrapper.appendChild(occInput);
    rangeWrapper.appendChild(document.createTextNode(' - '));
    rangeWrapper.appendChild(endInput);
    rangeSpan.replaceWith(rangeWrapper);

    // Show Save / Cancel, hide Edit
    wrapper.querySelector('.edit-downtime-button').style.display = 'none';
    delBtn.style.display = 'none';
    wrapper.querySelector('.save-downtime-button').style.display = 'inline-block';
    wrapper.querySelector('.cancel-downtime-button').style.display = 'inline-block';
}

function cancelEdit(wrapper, row) {
    // Restore modal position
    const modal = document.querySelector('.modal');
    if(modal) modal.style.bottom = ''; // revert to original CSS
    const delBtn = wrapper.querySelector('.delete-downtime-button');

    // Restore original spans
    const timeRange = `${Number(row.dt_id)+5}:00 - ${Number(row.dt_id)+6}:00`;
    const select = wrapper.querySelector('select');
    if (select) select.replaceWith(createSpan('time-occurred-value', timeRange));

    const inputs = wrapper.querySelectorAll('input[type="text"]');
    ['process','details','countermeasure','remarks','pic'].forEach((cls, i) => {
        if(inputs[i]) inputs[i].replaceWith(createSpan(`${cls}-value`, row[cls]));
    });

    const rangeWrapper = wrapper.querySelector('.range-value-wrapper');
    if(rangeWrapper){
        const occ = formatTo12Hour(formatTime(row.time_occurred));
        const end = formatTo12Hour(formatTime(row.time_ended));
        rangeWrapper.replaceWith(createSpan('range-value', `${occ} - ${end}`));
    }

    wrapper.querySelector('.save-downtime-button').style.display = 'none';
    wrapper.querySelector('.cancel-downtime-button').style.display = 'none';
    wrapper.querySelector('.edit-downtime-button').style.display = 'inline-block';
    delBtn.style.display = 'inline-block';

    if (downtimeInterval) clearInterval(downtimeInterval);
    downtimeInterval = setInterval(() => {
        fetchDowntime();
    }, 10000);
}

function saveRow(wrapper, row) {
    const proceed = confirm("Are you sure you want to save the changes?");
    if (!proceed) return;

    // Restore modal position
    const modal = document.querySelector('.modal');
    if(modal) modal.style.bottom = '';

    const dt_id = wrapper.querySelector('select').value;
    const inputs = wrapper.querySelectorAll('input[type="text"]');
    const process = inputs[0].value;
    const details = inputs[1].value;
    const countermeasure = inputs[2].value;
    const remarks = inputs[3].value;
    const pic = inputs[4].value;
    const timeInputs = wrapper.querySelectorAll('input[type="time"]');

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const currentDate = `${yyyy}-${mm}-${dd}`;

    const time_occurred = `${currentDate} ${timeInputs[0].value}`;
    const time_ended = `${currentDate} ${timeInputs[1].value}`;

    const sendData = {
        action: "update_downtime",
        dt_id,
        process,
        details,
        countermeasure,
        remarks,
        pic,
        time_occurred,
        time_ended
    };
    console.log(sendData);

    fetch('fetches1/domfetch.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(sendData).toString()
    })
    .then(res => res.json())
    .then(resp => {
        if (resp.success) {
            alert('Data saved successfully!');
            console.log({
                sent: sendData,
                response: resp
            });
            fetchDowntime();
        } else {
            alert('Failed to update.');
            console.error("Server error:", resp.message);
        }

        if (downtimeInterval) clearInterval(downtimeInterval);
        downtimeInterval = setInterval(() => {
            fetchDowntime();
        }, 10000);
    })
    .catch(err => console.error("Fetch error:", err));
}
// -------------------- HELPER FUNCTIONS --------------------

function createSpan(cls, text){
    const span = document.createElement('span');
    span.className = cls;
    span.textContent = text;
    return span;
}

function formatTo12Hour(timeStr){
    if(!timeStr) return '-';
    const parts = timeStr.split(':').map(Number);
    let [h, m, s] = parts;
    if (!s) s = 0;
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} ${period}`;
}

function formatTime(sqlDatetime){
    if(!sqlDatetime) return '-';
    const d = new Date(sqlDatetime);
    const hh = String(d.getHours()).padStart(2,'0');
    const mm = String(d.getMinutes()).padStart(2,'0');
    const ss = String(d.getSeconds()).padStart(2,'0');
    return `${hh}:${mm}:${ss}`;
}

function convertTo24Hour(timeStr){
    if(!timeStr) return '';
    let [time, period] = timeStr.split(' ');
    let [h, m, s] = time.split(':').map(Number);
    if (!s) s = 0;
    if(period.toUpperCase() === 'PM' && h < 12) h += 12;
    if(period.toUpperCase() === 'AM' && h === 12) h = 0;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function timeToSeconds(timeStr){
    if(!timeStr || typeof timeStr!=='string') return 0;
    const parts = timeStr.split(':').map(Number);
    const [h=0,m=0,s=0]=parts;
    return h*3600 + m*60 + s;
}

function formatDuration(totalSeconds){
    if(isNaN(totalSeconds)||totalSeconds<0) return '-';
    const h=Math.floor(totalSeconds/3600);
    const m=Math.floor((totalSeconds%3600)/60);
    const s=Math.floor(totalSeconds%60);
    const parts=[];
    if(h>0) parts.push(`${h} Hour${h>1?'s':''}`);
    if(m>0) parts.push(`${m} Minute${m>1?'s':''}`);
    if(s>0||parts.length===0) parts.push(`${s} Second${s>1?'s':''}`);
    return parts.join(' ');
}

function escapeHtml(str){
    if(str===null||str===undefined) return '';
    return String(str)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
}

// NG Type options
const ngOptions = [
    "Select NG Type",
    "Slanted Cut",
    "Short Tube",
    "Long Tube",
    "No Clamp",
    "Damaged Pre-Assemble Part 1",
    "Damaged Pre-Assemble Part 13",
    "Damaged Clamp 1",
    "Damaged Clamp 2",
    "Damaged Clamp 3",
    "Damaged Clamp 4",
    "Damaged Clamp 5",
    "Damaged Clamp 6",
    "Damaged Clamp 7",
    "Damaged Clamp 8",
    "Damaged Clamp 9",
    "Damaged Clamp 10",
    "Damaged Clamp 11",
    "Damaged Clamp 12",
    "Lack of Clamp",
    "Missing Clamp",
    "Missing Tape",
    "Short Feeder",
    "Long Feeder",
    "Missing Grommet",
    "Damaged Grommet"
];

// Load NG Type options into selects
function loadNGTypes() {
    const selects = [document.getElementById('ng1'), document.getElementById('ng2'), document.getElementById('ng3')];
    selects.forEach(sel => {
        ngOptions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            sel.appendChild(option);
        });
    });
}

loadNGTypes();

// Map time to value 1–14 (06:00–19:59)
function getNGTimeValue(timeStr) {
    if (!timeStr) return null;
    const hour = parseInt(timeStr.split(':')[0], 10);
    if (hour < 6 || hour >= 20) return null;
    return hour - 5;
}

// DOM elements
const NGtimeInput = document.getElementById('time-ng');
const ngQtyInput = document.getElementById('how-many');

NGtimeInput.min = "00:00";
NGtimeInput.max = "23:59";

// Handle Add button
document.getElementById('add-button-ng').addEventListener('click', (e) => {
    e.preventDefault();

    const timePicked = NGtimeInput.value;
    const ngTimeId = getNGTimeValue(timePicked);

    if (!timePicked || ngTimeId === null) {
        alert("Please pick a valid time between 06:00 and 19:59.");
        return;
    }

    // Add ":00" to the time for full value
    const fullTime = timePicked + ":00";

    // NG Quantity validation
    const ngQty = parseInt(ngQtyInput.value);
    if (!ngQty || ngQty < 1) {
        alert("Please enter a valid NG Quantity (1 or more).");
        return;
    }

    // NG Types
    const ng1 = document.getElementById('ng1').value;
    const ng2 = document.getElementById('ng2').value;
    const ng3 = document.getElementById('ng3').value;

    if (ng1 === "Select NG Type" && (ng2 === "" || ng2 === "Select NG Type") && (ng3 === "" || ng3 === "Select NG Type")) {
        alert("Please select at least one NG Type.");
        return;
    }

    // Fill empty NG Types with "-"
    const finalNG1 = ng1 !== "Select NG Type" ? ng1 : "-";
    const finalNG2 = (ng2 && ng2 !== "Select NG Type") ? ng2 : "-";
    const finalNG3 = (ng3 && ng3 !== "Select NG Type") ? ng3 : "-";
    // Confirmation dialog
    const confirmMsg = `Confirm adding NG Details?\n\nTime: ${timePicked} (ID: ${ngTimeId})\nQuantity: ${ngQty}\nNG Types: ${finalNG1}, ${finalNG2}, ${finalNG3}`;
    if (!confirm(confirmMsg)) return;

    // Prepare POST data
    const postData = new URLSearchParams();
    postData.append('action', 'add_ng_detail');
    postData.append('ng_time_id', ngTimeId);
    postData.append('ng_time', fullTime); // <-- added full time here
    postData.append('ng_qty', ngQty);
    postData.append('ngtype1', finalNG1);
    postData.append('ngtype2', finalNG2);
    postData.append('ngtype3', finalNG3);
    console.log(fullTime, ngTimeId, ngQty, finalNG1, finalNG2, finalNG3);
    // Send via fetch
    fetch('fetches1/domfetch.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: postData.toString()
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('NG Details added successfully!');
            // Reset manually since #ng-form is a div
            NGtimeInput.value = '';
            ngQtyInput.value = 1;
            document.getElementById('ng1').value = 'Select NG Type';
            document.getElementById('ng2').value = '';
            document.getElementById('ng3').value = '';
        } else {
            alert('Error adding NG Details: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(err => {
        console.error('Fetch error:', err);
        alert('Error adding NG Details.');
    });
});



function updateNGOutput() {
    fetch('fetches1/domfetch.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ action: 'update_ng_output' })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
        } else {
            console.error(data.message);
        }
    })
    .catch(err => {
        console.error('Fetch error:', err);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("add-time-occurred");

    // 6:00–7:00 (1) to 19:00–20:00 (14)
    for (let i = 0; i < 14; i++) {
        const start = 6 + i;
        const end = start + 1;

        const option = document.createElement("option");
        option.value = i + 1;
        option.textContent = `${start}:00 - ${end}:00`;
        select.appendChild(option);
    }
});

document.getElementById("add-dt-btn").addEventListener("click", () => {

    const today = new Date().toISOString().split("T")[0];

    const params = new URLSearchParams();
    params.append("action", "add_downtime");
    params.append(
        "dt_id",
        parseInt(document.getElementById("add-time-occurred").value, 10)
    );
    params.append("process", document.getElementById("process-add").value);
    params.append("details", document.getElementById("dt-details-add").value);
    params.append("countermeasure", document.getElementById("countermeasure-add").value);
    params.append("remarks", document.getElementById("remarks-add").value);
    params.append("pic", document.getElementById("pic-add").value);
    params.append(
        "time_start",
        `${today} ${document.getElementById("time-start-add").value}`
    );
    params.append(
        "time_end",
        `${today} ${document.getElementById("time-end-add").value}`
    );

    console.log("Downtime data to be sent:");
    console.log(Object.fromEntries(params.entries()));

    fetch("fetches1/domfetch.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);

        // ✅ Reset inputs
        const inputs = document.querySelectorAll('#input-container input, #input-container select');
        inputs.forEach(input => {
            if(input.tagName === "SELECT") {
                input.selectedIndex = 0;
            } else {
                input.value = "";
            }
        });

        // ✅ Hide downtime form, go back to selection view
        const sections = document.querySelectorAll('.data-handlers');
        sections.forEach(section => section.style.display = 'none');

        const selectionView = document.getElementById('data-handling-selection');
        if(selectionView) selectionView.style.display = 'block';
    });
});

document.addEventListener("DOMContentLoaded", loadPlans);

    function loadPlans() {
        Promise.all([
            fetch('fetches1/domfetch.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=get_all_plans'
            }).then(res => res.json()),

            fetch('fetches1/domfetch.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=get_active_plan'
            }).then(res => res.json())
        ])
        .then(([plans, active]) => {
            renderPlans(plans, active.active_plan);
        });
    }

    function renderPlans(plans, activePlanId) {
        const container = document.getElementById('plans-container');
        container.innerHTML = '';

        plans.forEach(plan => {

            const isActive = Number(plan.id) === Number(activePlanId);

            container.innerHTML += `
                <div class="plans-list card">
                    <div class="card-row"><strong>Plan No.:</strong> ${plan.id}</div>
                    <div class="card-row"><strong>Part Number (Model):</strong> ${plan.partnumber} (${plan.model})</div>
                    <div class="card-row"><strong>Production Hours:</strong> ${plan.prodhrs}</div>
                    <div class="card-row"><strong>Time:</strong> ${plan.time}</div>
                    <div class="card-row"><strong>Planned Output:</strong> ${plan.planned_output}</div>

                    <div class="card-actions">
                        <button class="btn use-btn"
                                data-id="${plan.id}"
                                style="${isActive ? 'display:none' : ''}">
                            Use
                        </button>

                        <button class="btn inuse-btn" style="${isActive ? '' : 'display:none'}">
                            In Use
                        </button>
                    </div>
                </div>
            `;
        });
    }

document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("use-btn")) return;

    const newPlanId = e.target.dataset.id;

    if (!confirm("Use this plan? Current plan data will be transferred.")) {
        return;
    }

    fetch('fetches1/domfetch.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `action=switch_plan&new_plan_id=${newPlanId}`
    })
    .then(res => res.json())
    .then(resp => {
        if (resp.success) {
            location.reload(); // ✅ FULL PAGE RELOAD
        } else {
            alert(resp.msg || "Failed to switch plan");
        }
    });
});

// Close modal
function closeSettings() {
    settingsOverlay.classList.remove("active");
    const sections = document.querySelectorAll('.data-handlers');
    const isAnyVisible = Array.from(sections).some(section => section.offsetParent !== null);

    if (isAnyVisible) {
        resetDataHandlingSections();
    }
}

let currentInput = null;
let shift = false;
let capsLock = false;

// Show keyboard when input is focused, except inputs inside #timely-outputs
document.addEventListener('focusin', (e) => {
    if (
        e.target.tagName === 'INPUT' &&
        e.target.type !== 'time' &&        
        !e.target.closest('#timely-outputs')
    ) {
        currentInput = e.target;
        document.getElementById('keyboard').style.display = 'block';
    }
});


// Hide keyboard when clicking outside
document.addEventListener('click', (e) => {
    const keyboard = document.getElementById('keyboard');
    if (!keyboard.contains(e.target) && e.target.tagName !== 'INPUT') {
        document.getElementById('keyboard').style.display = 'none';
        currentInput = null;
    }
});

// Handle key presses
document.querySelectorAll('#keyboard .key').forEach(key => {
    key.addEventListener('click', () => {
        if (!currentInput) return;

        let val = key.textContent;

        if (key.classList.contains('backspace')) {
            currentInput.value = currentInput.value.slice(0, -1);
        } else if (key.classList.contains('space')) {
            currentInput.value += ' ';
        } else if (key.classList.contains('enter')) {
            currentInput.dispatchEvent(new Event('change', { bubbles: true }));
            currentInput.blur();
        } else if (key.classList.contains('shift')) {
            shift = !shift;
            updateKeys();
        } else if (key.classList.contains('capslock')) {
            capsLock = !capsLock;
            updateKeys();
        } else {
            // NORMAL KEY PRESSED
            // Apply shift/caps rules
            if (shift) {
                val = val.toUpperCase();
            } else if (capsLock) {
                if (val.match(/[a-z]/i)) val = val.toUpperCase();
            }

            // Add value to input
            currentInput.value += val;

            // Turn off shift after any normal key press
            if (shift) {
                shift = false;
                updateKeys();
            }
        }

        currentInput.dispatchEvent(new Event('input', { bubbles: true }));
    });
});


function updateKeys() {
    document.querySelectorAll('#keyboard .key').forEach(key => {
        if (!key.classList.contains('backspace') &&
            !key.classList.contains('enter') &&
            !key.classList.contains('shift') &&
            !key.classList.contains('capslock') &&
            !key.classList.contains('space')) {

            if (shift) key.textContent = key.textContent.toUpperCase();
            else if (!capsLock) key.textContent = key.textContent.toLowerCase();
            else key.textContent = key.textContent.toUpperCase();
        }
    });
}

document.getElementById("save-btn").addEventListener("click", async () => {
    try {
        // 1️⃣ Fetch mins1–mins14
        const minsRes = await fetch("fetches1/domfetch.php?action=get_plan_mins");
        const minsData = await minsRes.json();

        if (!minsData.success) {
            alert("❌ " + minsData.message);
            return;
        }

        const minsArray = [];
        for (let i = 1; i <= 14; i++) {
            minsArray.push(Number(minsData.mins[`mins${i}`]));
        }

        // 2️⃣ Time validation
        let lastNonZeroIndex = -1;
        for (let i = 0; i < minsArray.length; i++) {
            if (minsArray[i] > 0) lastNonZeroIndex = i;
        }

        const firstRemainingZeroIndex = lastNonZeroIndex + 1;

        if (firstRemainingZeroIndex < minsArray.length) {
            const startHour = 6;
            const cutoffHour = startHour + firstRemainingZeroIndex;

            const cutoffDate = new Date();
            cutoffDate.setHours(cutoffHour, 0, 0, 0);

            const now = new Date();

            if (now < cutoffDate) {
                const cutoffTimeStr = cutoffDate.toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                });

                const earlyConfirm = confirm(
                    `⚠️ It is not ${cutoffTimeStr} yet.\nAre you sure you want to save the data?`
                );
                if (!earlyConfirm) return;
            }
        }

        // 3️⃣ FINAL confirmation
        const proceed = confirm(
            "Are you sure you want to save the data?\n\nThis action will reset the output today.\nView the DOM Planner for the details."
        );
        if (!proceed) return;

        // 4️⃣ SAVE DATA
        const saveRes = await fetch("fetches1/domfetch.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ action: "save_data" })
        });

        const saveData = await saveRes.json();

        if (!saveData.success) {
            alert("❌ Error saving SWP data: " + saveData.message);
            return;
        }

        // 5️⃣ RESET DAILY OUTPUT
        const resetRes = await fetch("fetches1/domfetch.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ action: "reset_daily" })
        });

        const resetData = await resetRes.json();

        if (!resetData.success) {
            alert("❌ Reset failed: " + resetData.message);
            return;
        }

        // 6️⃣ UPDATE TABLE & RELOAD
        updateTable();

        alert("✅ Daily output data saved and output reset!");
        location.reload();

    } catch (err) {
        alert("❌ Fetch error: " + err);
    }
});
