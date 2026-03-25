const dashboardNames = {
    "10.0.0.189": "TUBE ASSEMBLY: C4 TUBE LINE",
    "10.0.0.102": "TUBE ASSEMBLY: C7 TUBE LINE",
    "10.0.0.136": "TUBE ASSEMBLY: C9 TUBE LINE",
    "10.0.0.125": "TUBE ASSEMBLY: C9-1 TUBE LINE",
    "10.0.0.164": "TUBE ASSEMBLY: C10 TUBE LINE",
    "localhost": "ADMINISTRATOR",
    "192.168.0.228": "TUBE ASSEMBLY: C4 TUBE LINE"
};
async function getCurrentIP() {
    try {
        const res = await fetch("../../data/ip.php");
        const data = await res.json();
        return data.lan_ip;
    } catch (err) {
        console.error("Failed to fetch LAN IP:", err);
        return null;
    }
}
document.addEventListener("DOMContentLoaded", async () => {
    const lineSpan = document.getElementById("line");
    if (!lineSpan) return;

    const currentIP = await getCurrentIP();

    lineSpan.textContent =
        (currentIP && dashboardNames[currentIP])
            ? dashboardNames[currentIP]
            : "PRODUCTION LINE";
});



document.addEventListener("DOMContentLoaded", () => {
    fetch("fetches1/startup_handler.php?action=checkPlanFilled")
    .then(res => res.json())
    .then(data => {
        if (data.filled) {
            // Show overlay and modal
            document.getElementById("overlay").classList.remove("hidden");
            document.getElementById("already-filled-modal").classList.remove("hidden");

            // Button to proceed to dashboard
            document.getElementById("proceed-dashboard-btn").addEventListener("click", () => {
                window.location.href = "pndmonitoring.php";
            });
        }
    })
    .catch(err => console.error(err));
    
    const planSelect = document.getElementById("plan-select");
    const planPreview = document.getElementById("plan-preview");
    const balanceInput = document.getElementById("balance-input");
    const manpowerInput = document.getElementById("manpower-input");
    const Instructions = document.getElementById("instructions");

    const staff1 = document.getElementById("staff-1");
    const staff2 = document.getElementById("staff-2");
    const staff3 = document.getElementById("staff-3");

    /* ===============================
    STAFF VISIBILITY HANDLER
    =============================== */
    function updateStaffVisibility(count) {
        staff1.style.display = count >= 1 ? "flex" : "none";
        staff2.style.display = count >= 2 ? "flex" : "none";
        staff3.style.display = count >= 3 ? "flex" : "none";
    }

    // Initial state (hide all)
    updateStaffVisibility(0);

    // Update when manpower is manually changed
    manpowerInput.addEventListener("input", () => {
        const count = parseInt(manpowerInput.value) || 0;
        updateStaffVisibility(count);
    });

    /* ===============================
        FETCH ALL PLANS
    =============================== */
    fetch("fetches1/startup_handler.php?action=getPlans")
        .then(res => res.json())
        .then(plans => {
            planSelect.innerHTML = '<option value="">Select a plan</option>';
            plans.forEach(plan => {
                const option = document.createElement("option");
                option.value = plan.id;
                option.dataset.id = plan.id;
                option.textContent = `Plan No. ${plan.id}`;
                planSelect.appendChild(option);
            });
        });

        /* ===============================
        PLAN SELECTION CHANGE
        =============================== */
    planSelect.addEventListener("change", () => {
        const selectedId = planSelect.value;

        if (!selectedId) {
            planPreview.innerHTML = "";
            balanceInput.value = "";
            manpowerInput.value = "";
            updateStaffVisibility(0);
            return;
        }

        fetch(`fetches1/startup_handler.php?action=getPlanDetails&id=${selectedId}`)
            .then(res => res.json())
            .then(plan => {
                if (plan.error) {
                    planPreview.innerHTML = plan.error;
                    balanceInput.value = "";
                    manpowerInput.value = "";
                    updateStaffVisibility(0);
                    return;
                }

                // Set balance & manpower
                Instructions.style.display = "none";
                balanceInput.value = plan.balance;
                manpowerInput.value = plan.manpower;
                updateStaffVisibility(plan.manpower);

                /* ===============================
                RENDER PLAN DETAILS
                =============================== */
                let html = `
                <div id="plan-details">
                    <div>Part Number:<br><strong>${plan.partnumber}</strong></div>
                    <div>Model:<br><strong>${plan.model}</strong></div>
                    <div>Prod Hrs:<br><strong>${plan.prodhrs}</strong></div>
                    <div>Delivery Date:<br><strong>${plan.deliverydate}</strong></div>
                    <div>Cycle Time:<br><strong>${plan.cycletime}</strong></div>
                    <div>Cycle Time As Of:<br><strong>${plan.cycletimeasof}</strong></div>
                    <div>Expiration Date:<br><strong>${plan.expirationdate}</strong></div>
                    <div>Date Created:<br><strong>${plan.date_created}</strong></div>
                </div>`;

                for (let rect = 0; rect < 2; rect++) {
                    html += `<div class="plan-hours-rectangle">`;
                    for (let i = 1 + rect * 7; i <= 7 + rect * 7; i++) {
                        const hourValue = plan['mins' + i];
                        const planValue = Math.round(hourValue * 60 / plan.cycletime);

                        html += `
                        <div class="hour-block">
                            <div class="hour-label">Hour ${i}</div>
                            <div class="hour-value"><strong>${hourValue}</strong></div>
                            <div class="plan-value">Plan: <strong>${planValue}</strong></div>
                        </div>`;
                    }
                    html += `</div>`;
                }

                planPreview.innerHTML = html;
            });
    });

    /* ===============================
    FETCH LINE LEADERS
    =============================== */
    const lineLeaderSelect = document.getElementById("line-leader-select");
    const pictureLL = document.getElementById("picture-ll");
    const detailsLL = document.getElementById("details-ll");

    let leadersData = []; // Store all leaders after fetching

    // Fetch line leaders with BLOB (Base64) image
    fetch("fetches1/startup_handler.php?action=getLineLeaders")
        .then(res => res.json())
        .then(leaders => {
            leadersData = leaders; // save for later lookup

            lineLeaderSelect.innerHTML = '<option value="">Select Line Leader:</option>';
            leaders.forEach(leader => {
                const middle = leader.mn ? ` ${leader.mn}` : "";
                const fullName = `${leader.ln}, ${leader.fn}${middle}`;
                const option = document.createElement("option");
                option.value = fullName;           // still use fullName as value
                option.textContent = fullName;
                option.dataset.id = leader.id;     // store numeric ID here
                lineLeaderSelect.appendChild(option);
            });
        })
        .catch(err => console.error("Error fetching line leaders:", err));

    // Listen for selection change
    lineLeaderSelect.addEventListener("change", () => {
        const selectedOption = lineLeaderSelect.selectedOptions[0];
        const selectedId = selectedOption ? parseInt(selectedOption.dataset.id) : null;

        if (!selectedId) {
            pictureLL.innerHTML = "";
            detailsLL.innerHTML = `
                <div><span id="surname">(Surname)</span></div>
                <div><span id="fn-mn">(First Name)(Middle Initial)</span></div>
                <div id="ll-title">(Title)</div>`;
            return;
        }

        const leader = leadersData.find(l => Number(l.id) === selectedId);

        if (leader) {
            pictureLL.innerHTML = leader.picture
                ? `<img src="${leader.picture}" alt="${leader.fn}" style="width: 100%; height: 100%; object-fit: cover;">`
                : '';

            detailsLL.innerHTML = `
                <div><span id="surname">${leader.ln}</span></div>
                <div><span id="fn-mn">${leader.fn}${leader.mn ? ' ' + leader.mn : ''}</span></div>
                <div id="ll-title">${leader.title}</div>`;
        }
    });


    const staffSelects = [
        document.getElementById("select-1"),
        document.getElementById("select-2"),
        document.getElementById("select-3")
    ];

    const staffCards = [
        document.getElementById("staff-1"),
        document.getElementById("staff-2"),
        document.getElementById("staff-3")
    ];

    let prodStaffData = [];

    // Fetch all prod staff
    fetch("fetches1/startup_handler.php?action=getProdStaff")
        .then(res => res.json())
        .then(staffs => {
            prodStaffData = staffs;

            staffSelects.forEach((select, index) => {
                // Set the default option dynamically: "Select Person 1", "Select Person 2", etc.
                select.innerHTML = `<option value="">Select Person ${index + 1}</option>`;
                
                staffs.forEach(staff => {
                    const middle = staff.mn ? ` ${staff.mn}` : "";
                    const fullName = `${staff.ln}, ${staff.fn}${middle}`;
                    const option = document.createElement("option");
                    option.value = fullName;
                    option.dataset.id = staff.id;
                    option.textContent = fullName;
                    select.appendChild(option);
                });
            });
        })
        .catch(err => console.error("Error fetching prod staff:", err));

    /* ===============================
    HANDLE STAFF SELECTION CHANGE
    =============================== */
    staffSelects.forEach((select, index) => {
        select.addEventListener("change", () => {
            const card = staffCards[index];
            const pictureEl = card.querySelector(".staff-picture");
            const detailsEl = card.querySelector(".staff-details");

            // If placeholder is selected
            if (select.selectedIndex === 0) {
                pictureEl.src = "";
                pictureEl.style.display = "none"; // hide image
                detailsEl.querySelector(".staff-ln").textContent = "(Surname)";
                detailsEl.querySelector(".staff-fn").textContent = "(First Name)(M.I.)";
                detailsEl.querySelector(".staff-title").textContent = "";
                return;
            }

            const selectedName = select.value;
            const staff = prodStaffData.find(s => {
                const middle = s.mn ? ` ${s.mn}` : "";
                return `${s.ln}, ${s.fn}${middle}` === selectedName;
            });

            if (staff) {
                pictureEl.src = staff.picture || "";
                pictureEl.style.display = staff.picture ? "block" : "none"; // show only if picture exists
                detailsEl.querySelector(".staff-ln").textContent = staff.ln;
                detailsEl.querySelector(".staff-fn").textContent = `${staff.fn}${staff.mn ? ' ' + staff.mn : ''}`;
                detailsEl.querySelector(".staff-title").textContent = staff.title;
            }
        });
    });

    const keypad = document.getElementById("keypad");

    // Show keypad when input is focused
    balanceInput.addEventListener("focus", () => {
        const rect = balanceInput.getBoundingClientRect();
        keypad.style.top = rect.bottom + window.scrollY + 8 + "px";
        keypad.style.left = rect.left + window.scrollX + "px";
        keypad.classList.remove("hidden");
    });

    // Hide keypad when input loses focus
    balanceInput.addEventListener("blur", () => {
        setTimeout(() => keypad.classList.add("hidden"), 100);
    });

    // Prevent blur when clicking on keypad
    keypad.addEventListener("mousedown", (e) => e.preventDefault());

    // Handle keypad button clicks
    keypad.addEventListener("click", (e) => {
        const key = e.target.closest(".key");
        if (!key) return;

        if (key.dataset.action === "back") {
            balanceInput.value = balanceInput.value.slice(0, -1);
        } else if (key.dataset.action === "clear") {
            balanceInput.value = "";
        } else if (key.dataset.action === "cancel") {
            balanceInput.value = "";
            keypad.classList.add("hidden");
            balanceInput.blur();
        } else if (key.dataset.action === "check") {
            keypad.classList.add("hidden");
            balanceInput.blur();
        } else {
            balanceInput.value += key.textContent;
        }
    });

    const submitButton = document.getElementById("button-submit");
    submitButton.addEventListener("click", () => {
        const selectedPlanOption = planSelect.selectedOptions[0];
        const planNumber = selectedPlanOption ? parseInt(selectedPlanOption.dataset.id) : null;

        const balance = parseInt(balanceInput.value) || 0;

        // Get numeric line leader ID from selected option's data-id
        const selectedLLOption = lineLeaderSelect.selectedOptions[0];
        const lineLeaderId = selectedLLOption ? parseInt(selectedLLOption.dataset.id) : null;

        const manpower = parseInt(manpowerInput.value) || 0;

        const staffIds = [];
        const staffProcesses = [];



        for (let i = 0; i < manpower; i++) {
            const staffSelect = staffSelects[i];
            const processSelect = document.getElementById(`staff-${i+1}-select`);

            const selectedStaffOption = staffSelect.selectedOptions[0];
            const selectedStaffId = selectedStaffOption ? parseInt(selectedStaffOption.dataset.id) : null;

            if (!selectedStaffId || !processSelect.value) {
                alert(`Please select both staff and process for Person ${i+1}`);
                return;
            }

            staffIds.push(selectedStaffId);
            staffProcesses.push(processSelect.value);
        }


        if (!planNumber || !balance || !lineLeaderId || manpower < 1) {
            alert("Please fill in all required fields.");
            return;
        }

        const payload = { planNumber, balance, lineLeaderId, manpower, staffIds, staffProcesses };

        console.log(payload);
        fetch("fetches1/startup_handler.php?action=submitProduction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ planNumber, balance, lineLeaderId, manpower, staffIds, staffProcesses })
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                alert("You can now start the Monitoring. Please Open the Counting Program before Operating.");
                window.location.href = "pndmonitoring.php";
            } else {
                alert("Error: " + res.error); 
            }
        })
        .catch(err => {
            console.error(err);
            alert("An error occurred while submitting.");
        });
    });
});




