document.addEventListener("DOMContentLoaded", async () => {
    // Fetch the LAN IP from ip.php
    const currentIP = await getCurrentIP(); // use your async function

    // Loop through each button and disable if it matches the current device's IP
    document.querySelectorAll(".nav-button").forEach(button => {
        if (button.dataset.ip === currentIP) {
            button.disabled = true;
            button.style.opacity = "0.5";
            button.style.cursor = "not-allowed";
        }
    });
});

document.getElementById("c4-cont").addEventListener("click", function() {
    window.location.href = "http://192.168.1.32/DOM/files/DOMPlanner/planner.php";
});

document.getElementById("c7-cont").addEventListener("click", function() {
    window.location.href = "http://10.0.0.102/DOM/files/DOMPlanner/planner.php";
});

document.getElementById("c9-cont").addEventListener("click", function() {
    window.location.href = "http://10.0.0.136//DOM/files/DOMPlanner/planner.php";
});

document.getElementById("c9-1-cont").addEventListener("click", function() {
    window.location.href = "http://10.0.0.125/DOM/files/DOMPlanner/planner.php";
});

document.getElementById("c10-cont").addEventListener("click", function() {
    window.location.href = "http://10.0.0.164/DOM/files/DOMPlanner/planner.php";
});

const dashboardNames = {
    "192.168.1.32": "TUBE ASSEMBLY: C4 TUBE LINE",
    "10.0.0.102": "TUBE ASSEMBLY: C7 TUBE LINE",
    "10.0.0.136": "TUBE ASSEMBLY: C9 TUBE LINE",
    "10.0.0.125": "TUBE ASSEMBLY: C9-1 TUBE LINE",
    "10.0.0.164": "TUBE ASSEMBLY: C10 TUBE LINE",
    "192.168.0.228": "TUBE ASSEMBLY: C4 PRODUCTION LINE"
};

// Global variable
let currentIP = null;

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

async function updateDashboardTitles() {
    const ip = await getCurrentIP();
    const dashboardTitle = dashboardNames[ip] || "PRODUCTION LINE";

    const selectors = [
        ".line-prod-main",
        ".line-prod-number",
        ".line-prod-number2",
        ".line-prod-number3"
    ];

    selectors.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) el.textContent = dashboardTitle;
    });
}

// Wait for DOM and then update titles
document.addEventListener("DOMContentLoaded", updateDashboardTitles);

document.querySelector('.side-nav button:nth-child(1)').addEventListener('click', function() {
    document.getElementById('home').style.display = 'block';
    document.getElementById('dashboard-container').style.display = 'none';
    document.getElementById('dataentry-container').style.display = 'none';
    document.getElementById('prod-number').style.display = 'none';
    /*document.getElementById('title-with-dom-number').style.display = 'none';
    document.getElementById('side-nav-menu').style.justifyContent = 'center';
    document.getElementById('navigation-btn').style.margin = '0px 0px 0px 0px'; */
});

document.querySelector('.side-nav button:nth-child(3)').addEventListener('click', function() {
    
    document.getElementById('home').style.display = 'none';
    document.getElementById('dashboard-container').style.display = 'flex';
    document.getElementById('dataentry-container').style.display = 'none';
    document.getElementById('prod-number').style.display = 'block';
    /*document.getElementById('title-with-dom-number').style.display = 'flex';
    document.getElementById('side-nav-menu').style.justifyContent = 'space-between';
    document.getElementById('navigation-btn').style.margin = '0px 50px 0px 0px'; */
});

document.querySelector('.side-nav button:nth-child(5)').addEventListener('click', function() {
    
    document.getElementById('home').style.display = 'none';
    document.getElementById('dashboard-container').style.display = 'none';
    document.getElementById('dataentry-container').style.display = 'flex';
    document.getElementById('prod-number').style.display = 'block';
    /*document.getElementById('title-with-dom-number').style.display = 'flex';
    document.getElementById('side-nav-menu').style.justifyContent = 'space-between';
    document.getElementById('navigation-btn').style.margin = '0px 50px 0px 0px';*/
});

document.querySelector('.dropdown-content button:nth-child(1)').addEventListener('click', function() {
    window.location.href = "http://10.0.0.189/DOM/files/DOMPlanner/planner.php";
});
document.querySelector('.dropdown-content button:nth-child(2)').addEventListener('click', function() {
    window.location.href = "http://10.0.0.102/DOM/files/DOMPlanner/planner.php";
});
document.querySelector('.dropdown-content button:nth-child(3)').addEventListener('click', function() {
    window.location.href = "http://10.0.0.136/DOM/files/DOMPlanner/planner.php";
});
document.querySelector('.dropdown-content button:nth-child(4)').addEventListener('click', function() {
    window.location.href = "http://10.0.0.125/DOM/files/DOMPlanner/planner.php";
});
document.querySelector('.dropdown-content button:nth-child(5)').addEventListener('click', function() {
    window.location.href = "http://10.0.0.164/DOM/files/DOMPlanner/planner.php";
});

const buttons = document.querySelectorAll('.btns-form button');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

function showSwp() {
    document.getElementById('form-pic-container').style.display = 'none';
    document.getElementById('form-swp-container').style.display = 'block';
    document.getElementById('form-container').style.display = 'none';
    document.getElementById('plan-table-container').style.display = 'none';
}

function showPlandata() {
    document.getElementById('form-pic-container').style.display = 'none';
    document.getElementById('form-swp-container').style.display = 'none';
    document.getElementById('form-container').style.display = 'block';
    document.getElementById('plan-table-container').style.display = 'none';
}

function showPic() {
    document.getElementById('form-pic-container').style.display = 'block';
    document.getElementById('form-swp-container').style.display = 'none';
    document.getElementById('form-container').style.display = 'none';
    document.getElementById('plan-table-container').style.display = 'none';
}

function showTablePlan() {
    document.getElementById('form-pic-container').style.display = 'none';
    document.getElementById('form-swp-container').style.display = 'none';
    document.getElementById('form-container').style.display = 'none';
    document.getElementById('plan-table-container').style.display = 'block';
    const planDiv = document.getElementById('append-data-plan');
    planDiv.scrollTop = 0;
}

function openNav() {
    document.getElementById("mySidenav").style.width = "200px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function ShowUploadForm() {
    document.getElementById('pic-container-div').style.display = "flex"
    document.getElementById('upload-operator-div').classList.add("active");           
}

function ShowDeleteForm() {
    document.getElementById('DeleteContainer').style.display = "block";
    document.getElementById('delete-operator-div').classList.add("active");           
}

function exitDeleteForm() {
    document.getElementById('DeleteContainer').style.display = "none";
    document.getElementById('delete-operator-div').classList.remove("active");           
}

document.addEventListener('DOMContentLoaded', (event) => {
    loadPerson();
    loadLeaders();
}) 

async function loadLeaders(){
    try {
        const response = await fetch('fetches/planner_db.php?action=get_leaders');
        const persons = await response.json();

        const table = document.getElementById('line-leader-person');
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';

        persons.forEach(person => {
            const name = `${person.ln}, ${person.fn} ${person.mn || ''}`.trim();

            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${person.id}</td>
            <td>${name}</td>
            <td>${person.title}</td>
            <td class="action-col" style="display:none;">
                <button class="row-delete-btn" onclick="deleteRow(this, 'leader')">
                    Delete
                </button>
            </td>`;
            tbody.appendChild(row);
        })
    }
    catch (error){
        console.error(error);
    }
}

async function loadPerson() {
    try {
        const response = await fetch('fetches/person_display_server.php');
        const persons = await response.json();

        const tableBody = document.querySelector('#table-person tbody');
        tableBody.innerHTML = ''; // Clear existing rows

        persons.forEach(person => {
            const fullName = `${person.ln}, ${person.fn} ${person.mn || ''}`.trim();

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${person.id}</td>
                <td>${fullName}</td>
                <td>${person.title}</td>
                <td>${person.lcdate || ''}</td>
                <td>${person.rcdate || ''}</td>
                <td class="action-col" style="display:none;">
                    <button class="row-delete-btn" onclick="deleteRow(this, 'staff')">
                        Delete
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading :', error);
    }
}


function ShowUpdateForm() {
    document.getElementById('update-operator-div').style.display = "flex"
    document.getElementById("operator-div").classList.add("active");           
}

function exitForm() {
    if (!confirm('Are you sure you want to exit and discard changes?')) {
        return;
    }

    document.querySelector('.update-operator-container').style.display = 'none';
    document.querySelector('#line-leader-edit-container').style.display = 'none';
    document.querySelector('#prod-staff-edit-container').style.display = 'none';
    document.querySelector('#choose-container').style.display = 'flex';

    document.getElementById("operator-div").classList.remove("active");
    document.querySelector('.upload-pic-container').style.display = 'none';
    document.getElementById("upload-operator-div").classList.remove("active");

    /* ===============================
       RESET LINE LEADER
    ================================ */
    const llContainer = document.getElementById("line-leader-edit-container");
    if (llContainer) {
        llContainer.querySelectorAll("input").forEach(i => i.value = "");
        llContainer.querySelectorAll("select").forEach(s => s.value = "");
        const pic = llContainer.querySelector("#picture-display-ll");
        if (pic) pic.innerHTML = "Picture";
    }

    /* ===============================
       RESET PROD STAFF
    ================================ */
    const psContainer = document.getElementById("prod-staff-edit-container");
    if (psContainer) {
        psContainer.querySelectorAll("input").forEach(i => i.value = "");
        psContainer.querySelectorAll("select").forEach(s => s.value = "");
        const pic = psContainer.querySelector("#picture-display-ps");
        if (pic) pic.innerHTML = "Picture";
    }
}


const chooseContainer = document.getElementById("choose-container");
const lineLeaderContainer = document.getElementById("line-leader-edit-container");
const prodStaffContainer = document.getElementById("prod-staff-edit-container");

document.getElementById("line-leader-edit-button").addEventListener("click", () => {
    chooseContainer.style.display = "none";
    prodStaffContainer.style.display = "none";
    lineLeaderContainer.style.display = "flex";
});

document.getElementById("prod-staff-edit-button").addEventListener("click", () => {
    chooseContainer.style.display = "none";
    lineLeaderContainer.style.display = "none";
    prodStaffContainer.style.display = "flex";
});

function goBack() {
    // Ask for confirmation
    if (!confirm("Do you want to discard the changes?")) {
        return;
    }

    /* ===============================
       RESET LINE LEADER FORM
    ================================ */
    const llContainer = document.getElementById("line-leader-edit-container");

    if (llContainer) {
        llContainer.querySelectorAll("input[type='text']").forEach(input => input.value = "");

        const select = llContainer.querySelector("#names-ll");
        if (select) select.value = "Select";

        const fileInput = llContainer.querySelector("#picture-ll");
        if (fileInput) fileInput.value = "";

        const pictureDisplay = llContainer.querySelector("#picture-display-ll");
        if (pictureDisplay) pictureDisplay.innerHTML = "Picture";
    }

    /* ===============================
       RESET PROD STAFF FORM
    ================================ */
    const psContainer = document.getElementById("prod-staff-edit-container");

    if (psContainer) {
        // Reset text + date inputs
        psContainer.querySelectorAll("input[type='text'], input[type='date']")
            .forEach(input => input.value = "");

        // Reset select
        const selectPs = psContainer.querySelector("#names-ps");
        if (selectPs) selectPs.value = "";

        // Reset file input
        const fileInputPs = psContainer.querySelector("#picture-ps");
        if (fileInputPs) fileInputPs.value = "";

        // Reset picture display
        const pictureDisplayPs = psContainer.querySelector("#picture-display-ps");
        if (pictureDisplayPs) pictureDisplayPs.innerHTML = "Picture";
    }

    /* ===============================
       HIDE FORMS, SHOW MENU
    ================================ */
    lineLeaderContainer.style.display = "none";
    prodStaffContainer.style.display = "none";
    chooseContainer.style.display = "flex";
}


function goBackConfirm() {
    // Hide containers and show the choose container
    lineLeaderContainer.style.display = "none";
    prodStaffContainer.style.display = "none";
    chooseContainer.style.display = "flex";
}


/* ===============================
   ELEMENT REFERENCES
================================ */
const llContainer     = document.getElementById("line-leader-edit-container");

const namesSelect     = document.getElementById("names-ll");
const firstName       = document.getElementById("first-name");
const middleName      = document.getElementById("middle-name");
const lastName        = document.getElementById("last-name");
const titleLl         = document.getElementById("title-ll");

const pictureInput    = document.getElementById("picture-ll");
const pictureDisplay  = document.getElementById("picture-display-ll");

const submitButton    = document.getElementById("submit-button-update-ll");

/* ===============================
   STATE
================================ */
let leaders = [];
let selectedLeaderId = null;

/* ===============================
   OPEN LINE LEADER EDIT
================================ */
document.getElementById("line-leader-edit-button").addEventListener("click", () => {
    chooseContainer.style.display = "none";
    llContainer.style.display = "flex";
    loadLineLeaders();
});

/* ===============================
   LOAD LINE LEADERS
================================ */
function loadLineLeaders(){
    fetch("fetches/planner_db.php?action=get_leaders")
        .then(res => res.json())
        .then(data => {
            leaders = data;
            namesSelect.innerHTML = `<option value="">Select a Name</option>`;

            data.forEach(l => {
                namesSelect.innerHTML += `
                    <option value="${l.id}">
                        ${l.ln}, ${l.fn} ${l.mn}
                    </option>
                `;
            });
        })
        .catch(err => console.error("Load leaders error:", err));
}

/* ===============================
   SELECT LEADER
================================ */
namesSelect.addEventListener("change", () => {
    const id = parseInt(namesSelect.value, 10);

    // If the user selects "Select a Name" (non-numeric or 0)
    if (Number.isNaN(id) || id <= 0) {
        firstName.value = "";
        middleName.value = "";
        lastName.value = "";
        titleLl.value = "";
        pictureDisplay.innerHTML = "Picture"; // Reset to default text
        croppedImageBlob = null;
        selectedLeaderId = null;
        return; // Exit early
    }

    // Fetch metadata if a valid ID is selected
    fetch(`fetches/planner_db.php?action=get_leader_by_id&id=${id}`)
        .then(res => res.json())
        .then(res => {
            if (!res.success) {
                console.error("Leader fetch failed:", res.error);
                return;
            }

            const l = res.data;
            selectedLeaderId = l.id;

            firstName.value  = l.fn ?? "";
            middleName.value = l.mn ?? "";
            lastName.value   = l.ln ?? "";
            titleLl.value    = l.title ?? "";

            // Fetch picture
            pictureDisplay.innerHTML = `
                <img src="fetches/planner_db.php?action=get_leader_picture&id=${l.id}" 
                     style="width:100%;height:100%;object-fit:cover;" 
                     onerror="this.src='../../../DOM/media/img/default.png';">
            `;

            croppedImageBlob = null;
        })
        .catch(err => console.error("Fetch error:", err));
});


/* ===============================
   IMAGE SELECT + SQUARE CROP
   (no ctx used)
================================ */
const input = document.getElementById('picture-ll');
const display = document.getElementById('picture-display-ll');

const overlay = document.getElementById('crop-overlay');
const cropImage = document.getElementById('crop-image');
const cropConfirm = document.getElementById('crop-confirm');
const cropCancel = document.getElementById('crop-cancel');

let cropper;
let croppedBlob = null;

input.addEventListener('change', function() {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        cropImage.src = e.target.result;
        overlay.style.display = 'flex';

        // Initialize Cropper
        cropper = new Cropper(cropImage, {
            aspectRatio: 1,  // Square crop
            viewMode: 1,
            autoCropArea: 1,
        });
    };
    reader.readAsDataURL(file);
});

// Confirm crop
cropConfirm.addEventListener('click', () => {
    if (!cropper) return;
    cropper.getCroppedCanvas({
        width: 200,
        height: 200
    }).toBlob(blob => {
        croppedBlob = blob;
        const url = URL.createObjectURL(blob);
        display.innerHTML = `<img src="${url}" alt="Cropped Image">`;
        overlay.style.display = 'none';
        cropper.destroy();
        cropper = null;
    }, 'image/jpeg');
});

// Cancel crop
cropCancel.addEventListener('click', () => {
    overlay.style.display = 'none';
    cropper.destroy();
    cropper = null;
});

/* ===============================
   SUBMIT UPDATE
================================ */
submitButton.addEventListener("click", () => {
    if (!selectedLeaderId) {
        alert("Please select a leader first.");
        return;
    }

    const formData = new FormData();
    formData.append("action", "update_leader");
    formData.append("id", selectedLeaderId);
    formData.append("fn", firstName.value);
    formData.append("mn", middleName.value);
    formData.append("ln", lastName.value);
    formData.append("title", titleLl.value);

    // Append the cropped image blob if available
    if (croppedBlob) {
        formData.append(
            "picture",
            croppedBlob,
            `leader_${selectedLeaderId}.jpeg`
        );
    }

    fetch("fetches/planner_db.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(resp => {
        if (resp.success) {
            alert("Line Leader updated successfully");

            // Automatically reset all inputs
            firstName.value = "";
            middleName.value = "";
            lastName.value = "";
            titleLl.value = "";
            namesSelect.value = "Select";
            pictureDisplay.innerHTML = "Picture";
            input.value = "";         // Reset the file input
            croppedBlob = null;
            selectedLeaderId = null;
            loadLeaders();
            goBackConfirm();
        } else {
            alert("Update failed: " + (resp.error || "Unknown error"));
        }
    })
    .catch(err => console.error("Update error:", err));
});

/* ===============================
   ELEMENT REFERENCES
================================ */
const psContainer      = document.getElementById("prod-staff-edit-container");

const namesPsSelect    = document.getElementById("names-ps");
const firstNamePs      = document.getElementById("first-name-ps");
const middleNamePs     = document.getElementById("middle-name-ps");
const lastNamePs       = document.getElementById("last-name-ps");
const titlePs          = document.getElementById("title-ps");
const lcdatePs         = document.getElementById("lcdate-ps");
const rcdatePs         = document.getElementById("rcdate-ps");

const pictureInputPs   = document.getElementById("picture-ps");
const pictureDisplayPs = document.getElementById("picture-display-ps");

const submitButtonPs   = document.getElementById("submit-button-update-ps");

/* ===============================
   STATE
================================ */
let prodStaffs = [];
let selectedProdStaffId = null;
let croppedBlobPs = null;

/* ===============================
   OPEN PROD STAFF EDIT
================================ */
document.getElementById("prod-staff-edit-button").addEventListener("click", () => {
    chooseContainer.style.display = "none";
    psContainer.style.display = "flex";
    loadProdStaffs();
});

/* ===============================
   LOAD PROD STAFF LIST
================================ */
function loadProdStaffs() {
    fetch("fetches/planner_db.php?action=get_prod_staffs")
        .then(res => res.json())
        .then(data => {
            prodStaffs = data;
            namesPsSelect.innerHTML = `<option value="">Select a Name</option>`;

            data.forEach(p => {
                namesPsSelect.innerHTML += `
                    <option value="${p.id}">
                        ${p.ln}, ${p.fn} ${p.mn ?? ""}
                    </option>
                `;
            });
        });
}

/* ===============================
   SELECT PROD STAFF
================================ */
namesPsSelect.addEventListener("change", () => {
    const id = parseInt(namesPsSelect.value, 10);

    if (!id) {
        firstNamePs.value = "";
        middleNamePs.value = "";
        lastNamePs.value = "";
        titlePs.value = "";
        lcdatePs.value = "";
        rcdatePs.value = "";
        pictureDisplayPs.innerHTML = "Picture";
        croppedBlobPs = null;
        selectedProdStaffId = null;
        return;
    }

    fetch(`fetches/planner_db.php?action=get_prod_staff_by_id&id=${id}`)
        .then(res => res.json())
        .then(res => {
            if (!res.success) return;

            const p = res.data;
            selectedProdStaffId = p.id;

            firstNamePs.value  = p.fn ?? "";
            middleNamePs.value = p.mn ?? "";
            lastNamePs.value   = p.ln ?? "";
            titlePs.value      = p.title ?? "";
            lcdatePs.value     = p.lcdate ?? "";
            rcdatePs.value     = p.rcdate ?? "";

            pictureDisplayPs.innerHTML = `
                <img src="fetches/planner_db.php?action=get_prod_staff_picture&id=${p.id}"
                     style="width:100%;height:100%;object-fit:cover;" 
                     onerror="this.src='../../../DOM/media/img/default.png';">
            `;
            croppedBlobPs = null;
        });
});

/* ===============================
   IMAGE SELECT + SQUARE CROP (PS)
================================ */
let cropperPs;

pictureInputPs.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        cropImage.src = e.target.result;
        overlay.style.display = "flex";

        cropperPs = new Cropper(cropImage, {
            aspectRatio: 1,
            viewMode: 1,
            autoCropArea: 1
        });
    };
    reader.readAsDataURL(file);
});

/* Confirm crop */
cropConfirm.addEventListener("click", () => {
    if (!cropperPs) return;

    cropperPs.getCroppedCanvas({ width: 200, height: 200 })
        .toBlob(blob => {
            croppedBlobPs = blob;
            const url = URL.createObjectURL(blob);
            pictureDisplayPs.innerHTML = `<img src="${url}">`;
            overlay.style.display = "none";
            cropperPs.destroy();
            cropperPs = null;
        }, "image/jpeg");
});

/* Cancel crop */
cropCancel.addEventListener("click", () => {
    overlay.style.display = "none";
    if (cropperPs) {
        cropperPs.destroy();
        cropperPs = null;
    }
});

/* ===============================
   SUBMIT UPDATE
================================ */
submitButtonPs.addEventListener("click", () => {
    if (!selectedProdStaffId) {
        alert("Please select a production staff first.");
        return;
    }

    const formData = new FormData();
    formData.append("action", "update_prod_staff");
    formData.append("id", selectedProdStaffId);
    formData.append("fn", firstNamePs.value);
    formData.append("mn", middleNamePs.value);
    formData.append("ln", lastNamePs.value);
    formData.append("title", titlePs.value);
    formData.append("lcdate", lcdatePs.value);
    formData.append("rcdate", rcdatePs.value);

    if (croppedBlobPs) {
        formData.append("picture", croppedBlobPs, `staff_${selectedProdStaffId}.jpg`);
    }

    fetch("fetches/planner_db.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(resp => {
        if (resp.success) {
            alert("Production staff updated successfully");
            namesPsSelect.value = "";
            firstNamePs.value = "";
            middleNamePs.value = "";
            lastNamePs.value = "";
            titlePs.value = "";
            lcdatePs.value = "";
            rcdatePs.value = "";
            pictureDisplayPs.innerHTML = "Picture";
            pictureInputPs.value = "";
            croppedBlobPs = null;
            selectedProdStaffId = null;
            loadPerson();
            goBackConfirm();
        }
    });
});


/* ===============================
   ADD LINE LEADER ELEMENTS
================================ */
const llAddContainer   = document.getElementById("line-leader-add-container");

const firstNameAdd     = document.getElementById("first-name-add");
const middleNameAdd    = document.getElementById("middle-name-add");
const lastNameAdd      = document.getElementById("last-name-add");
const titleLlAdd       = document.getElementById("title-ll-add");

const pictureInputAdd  = document.getElementById("add-picture-ll");
const pictureDisplayAdd= document.getElementById("add-picture-display-ll");

const submitAddBtn     = document.getElementById("submit-button-add-ll");
const chooseContainer2 = document.getElementById("choose-add-container");

let addCroppedBlob = null;
let addCropper = null;

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("pic-container-div");

    const chooseContainer = document.getElementById("choose-add-container");
    const lineLeaderContainer = document.getElementById("line-leader-add-container");
    const prodStaffContainer = document.getElementById("prod-staff-add-container");

    const lineLeaderBtn = document.getElementById("line-leader-add-button");
    const prodStaffBtn = document.getElementById("prod-staff-add-button");

    const backButtons = document.querySelectorAll(".add-back-btn");
    const exitBtn = document.querySelector(".add-exit-btn");

    // 🔹 Utility: reset everything
    function resetAddStaff() {
        lineLeaderContainer.style.display = "none";
        prodStaffContainer.style.display = "none";
        chooseContainer.style.display = "flex";

        // Clear all inputs inside modal
        modal.querySelectorAll("input").forEach(input => {
            input.value = "";
        });
    }

    // Initial state
    resetAddStaff();

    // Show Line Leader form
    lineLeaderBtn.addEventListener("click", () => {
        chooseContainer.style.display = "none";
        lineLeaderContainer.style.display = "flex";
    });

    // Show Production Staff form
    prodStaffBtn.addEventListener("click", () => {
        chooseContainer.style.display = "none";
        prodStaffContainer.style.display = "flex";
    });

    // Back button → return to choose screen
    backButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            resetAddStaff();
        });
    });

    // ❌ Exit button → close modal & reset
    exitBtn.addEventListener("click", () => {
        modal.style.display = "none";
        document.getElementById("operator-div").classList.remove("active");
        document.querySelector('.upload-pic-container').style.display = 'none';
        document.getElementById("upload-operator-div").classList.remove("active");
        resetAddStaff();
    });

});

pictureInputAdd.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        cropImage.src = e.target.result;
        overlay.style.display = "flex";

        addCropper = new Cropper(cropImage, {
            aspectRatio: 1,
            viewMode: 1,
            autoCropArea: 1
        });
    };
    reader.readAsDataURL(file);
});

cropConfirm.addEventListener("click", () => {
    const activeCropper = addCropper || cropper;
    if (!activeCropper) return;

    activeCropper.getCroppedCanvas({
        width: 200,
        height: 200
    }).toBlob(blob => {
        const url = URL.createObjectURL(blob);

        if (addCropper) {
            addCroppedBlob = blob;
            pictureDisplayAdd.innerHTML = `<img src="${url}">`;
            addCropper.destroy();
            addCropper = null;
        } else {
            croppedBlob = blob;
            pictureDisplay.innerHTML = `<img src="${url}">`;
            cropper.destroy();
            cropper = null;
        }

        overlay.style.display = "none";
    }, "image/jpeg");
});

cropCancel.addEventListener("click", () => {
    overlay.style.display = "none";

    if (addCropper) {
        addCropper.destroy();
        addCropper = null;
    }
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
});

submitAddBtn.addEventListener("click", () => {
    if (!firstNameAdd.value || !lastNameAdd.value) {
        alert("First and Last Name are required.");
        return;
    }

    // 2️⃣ Check if picture is missing
    let pictureMissing = !addCroppedBlob; // true if no picture
    if (pictureMissing) {
        let proceed = confirm(
            "You did not upload a picture. Do you want to save changes without uploading a picture?"
        );
        if (!proceed) {
            // User clicked Cancel → stop submission
            return;
        }
        // User clicked OK → continue with NULL picture
    }

    const formData = new FormData();
    formData.append("action", "add_leader");
    formData.append("fn", firstNameAdd.value);
    formData.append("mn", middleNameAdd.value);
    formData.append("ln", lastNameAdd.value);
    formData.append("title", titleLlAdd.value);

    // Only append picture if user uploaded it
    if (addCroppedBlob) {
        formData.append("picture", addCroppedBlob, "leader.jpeg");
    }

    fetch("fetches/planner_db.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(resp => {
        if (resp.success) {
            alert("Line Leader added successfully");

            // Auto reset
            firstNameAdd.value = "";
            middleNameAdd.value = "";
            lastNameAdd.value = "";
            titleLlAdd.value = "";
            pictureDisplayAdd.innerHTML = "Picture";
            pictureInputAdd.value = "";
            addCroppedBlob = null;

            llAddContainer.style.display = "none";
            chooseContainer2.style.display = "flex";
          
            reorderLeaders();
            loadLeaders();
        } else {
            alert("Add failed: " + (resp.error || "Unknown error"));
        }
    })
    .catch(err => console.error("Add leader error:", err));
});

function reorderLeaders() {
    return fetch("fetches/planner_db.php", {
        method: "POST",
        body: new URLSearchParams({ action: "reorder_leaders" })
    })
    .then(res => res.json())
    .then(resp => {
        if (resp.success) {
            loadLeaders();
            loadLineLeaders(); // Reload after reordering
        } else {
            console.error("Reorder failed", resp);
        }
    })
    .catch(err => console.error("Reorder error:", err));
}

/* ===============================
   ADD PRODUCTION STAFF ELEMENTS
================================ */
const psAddContainer     = document.getElementById("prod-staff-add-container");

const firstNameAddPS     = document.getElementById("first-name-add-ps");
const middleNameAddPS    = document.getElementById("middle-name-add-ps");
const lastNameAddPS      = document.getElementById("last-name-add-ps");
const titlePsAdd         = document.getElementById("title-ps-add");
const lcdatePsAdd        = document.getElementById("lcdate-ps-add");
const rcdatePsAdd        = document.getElementById("rcdate-ps-add");

const pictureInputAddPS  = document.getElementById("add-picture-ps");
const pictureDisplayAddPS= document.getElementById("add-picture-display-ps");

const submitAddBtnPS     = document.getElementById("submit-button-add-ps");

let addCroppedBlobPS = null;
let addCropperPS = null;

// Picture input + Cropper
pictureInputAddPS.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        cropImage.src = e.target.result;
        overlay.style.display = "flex";

        addCropperPS = new Cropper(cropImage, {
            aspectRatio: 1,
            viewMode: 1,
            autoCropArea: 1
        });
    };
    reader.readAsDataURL(file);
});

cropConfirm.addEventListener("click", () => {
    const activeCropper = addCropperPS || cropper;
    if (!activeCropper) return;

    activeCropper.getCroppedCanvas({
        width: 200,
        height: 200
    }).toBlob(blob => {
        const url = URL.createObjectURL(blob);

        if (addCropperPS) {
            addCroppedBlobPS = blob;
            pictureDisplayAddPS.innerHTML = `<img src="${url}">`;
            addCropperPS.destroy();
            addCropperPS = null;
        } else if (cropper) {
            croppedBlob = blob;
            pictureDisplay.innerHTML = `<img src="${url}">`;
            cropper.destroy();
            cropper = null;
        }

        overlay.style.display = "none";
    }, "image/jpeg");
});

cropCancel.addEventListener("click", () => {
    overlay.style.display = "none";

    if (addCropperPS) {
        addCropperPS.destroy();
        addCropperPS = null;
    }
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
});

// Submit Production Staff
submitAddBtnPS.addEventListener("click", () => {
    if (!firstNameAddPS.value || !lastNameAddPS.value) {
        alert("First and Last Name are required.");
        return;
    }

    let pictureMissing = !addCroppedBlobPS;
    if (pictureMissing) {
        let proceed = confirm(
            "You did not upload a picture. Do you want to save changes without uploading a picture?"
        );
        if (!proceed) return;
    }

    const formData = new FormData();
    formData.append("action", "add_prod_staff");
    formData.append("fn", firstNameAddPS.value);
    formData.append("mn", middleNameAddPS.value);
    formData.append("ln", lastNameAddPS.value);
    formData.append("title", titlePsAdd.value);
    formData.append("lcdate", lcdatePsAdd.value);
    formData.append("rcdate", rcdatePsAdd.value);

    if (addCroppedBlobPS) {
        formData.append("picture", addCroppedBlobPS, "staff.jpeg");
    }

    fetch("fetches/planner_db.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(resp => {
        if (resp.success) {
            alert("Production Staff added successfully");

            // Auto reset
            firstNameAddPS.value = "";
            middleNameAddPS.value = "";
            lastNameAddPS.value = "";
            titlePsAdd.value = "";
            lcdatePsAdd.value = "";
            rcdatePsAdd.value = "";
            pictureDisplayAddPS.innerHTML = "Picture";
            pictureInputAddPS.value = "";
            addCroppedBlobPS = null;

            psAddContainer.style.display = "none";
            chooseContainer2.style.display = "flex";
            
            reorderProdStaff();
            loadProdStaffs();
        } else {
            alert("Add failed: " + (resp.error || "Unknown error"));
        }
    })
    .catch(err => console.error("Add prod staff error:", err));
});

// Optional: reorder Production Staff (similar to reorderLeaders)
function reorderProdStaff() {
    return fetch("fetches/planner_db.php", {
        method: "POST",
        body: new URLSearchParams({ action: "reorder_prod_staff" })
    })
    .then(res => res.json())
    .then(resp => {
        if (resp.success) {
            loadPerson();
            loadProdStaffs(); // Reload after reordering
        } else {
            console.error("Reorder failed", resp);
        }
    })
    .catch(err => console.error("Reorder error:", err));
}

function deleteOperator() {
    const num = document.getElementById('num-operator').value;

    const formData = {
        person_delete: num
    };
    sendNumDelete(formData)

    document.getElementById('DeleteContainer').style.display = "none";
    document.getElementById('delete-operator-div').classList.remove("active"); 
}

function deleteRow(btn, type) {
    const tr = btn.closest("tr");

    // 👇 ID is the first column (No.)
    const id = tr.children[0].innerText.trim();

    if (!id) {
        alert("Invalid ID");
        return;
    }

    if (!confirm(`Delete ID ${id}?`)) return;

    fetch("fetches/planner_db.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=deletePerson&id=${id}&type=${type}`
    })
    .then(res => res.json())
    .then(resp => {
        if (resp.success) {
            tr.remove();
            alert("Removed.");
            toggleDeleteMode();
            reorderLeaders();
            reorderProdStaff();
            loadPerson();
            loadLeaders();
            loadProdStaffs();
            loadLineLeaders();
        } else {
            alert("Delete failed");
        }
    });
}

function loadPlans() {
    fetch('fetches/tablePlanServer.php', {
        method: 'POST',
        body: new URLSearchParams({ action: 'read' })
    })
    .then(res => res.json())
    .then(data => {
        let text = '';

    data.forEach(row => {
        text += `
        <div class="plan-data-container">
            <div class="plan-data">
                <div class="header-plan-data">
                    Plan No. ${row.id}
                </div>
                <div class="plan-section" id="information-plan-title">Product Information</div>
                <div class="information-plan">
                    <div><label>Part No:&nbsp;</label> ${row.partnumber}</div>
                    <div><label>Model:&nbsp;</label> ${row.model}</div>
                    <div><label>Delivery Date:&nbsp;</label> ${row.deliverydate}</div>
                    <div><label>Balance:&nbsp;</label> ${row.balance}</div>
                    <div><label>Man Power:&nbsp;</label> ${row.manpower}</div>
                    <div><label>Production Hours:&nbsp;</label> ${row.prodhrs}</div>                            
                </div>

                <div class="plan-section" id="time-plan-title">Minutes Allotted Per Hour</div>

                <div class="time-plan">
                    ${(() => {
                        const plans = [
                            row.mins1, row.mins2, row.mins3, row.mins4,
                            row.mins5, row.mins6, row.mins7, row.mins8,
                            row.mins9, row.mins10, row.mins11, row.mins12,
                            row.mins13, row.mins14
                        ];
                        const times = [
                            "6AM–7AM", "7AM–8AM", "8AM–9AM", "9AM–10AM",
                            "10AM–11AM", "11AM–12PM", "12PM–1PM", "1PM–2PM",
                            "2PM–3PM", "3PM–4PM", "4PM–5PM", "5PM–6PM",
                            "6PM–7PM", "7PM–8PM"
                        ];

                        const half = Math.ceil(plans.length / 2);

                        // First column
                        const col1 = plans.slice(0, half).map((p, i) => `
                            <div class="plan-item">
                                <label class="time-label">${times[i]}:&nbsp;</label>
                                <span class="plan-value">${p ?? '-'}</span>
                            </div>
                        `).join('');

                        const col2 = plans.slice(half).map((p, i) => `
                            <div class="plan-item">
                                <label class="time-label">${times[i + half]}:&nbsp;</label>
                                <span class="plan-value">${p ?? '-'}</span>
                            </div>
                        `).join('');

                        return `
                            <div class="column">${col1}</div>
                            <div class="column">${col2}</div>
                        `;
                    })()}
                </div>

                <div id="plan-buttons">
                    <button class="editbtn-table" onclick="editPlan(
                        ${row.id},
                        '${row.partnumber}',
                        '${row.model}', 
                        '${row.deliverydate}',
                        '${row.manpower}',
                        '${row.prodhrs}',
                        '${row.mins1}',
                        '${row.mins2}',
                        '${row.mins3}',
                        '${row.mins4}',
                        '${row.mins5}',
                        '${row.mins6}',
                        '${row.mins7}',
                        '${row.mins8}',
                        '${row.mins9}',
                        '${row.mins10}',
                        '${row.mins11}',
                        '${row.mins12}',
                        '${row.mins13}',
                        '${row.mins14}'
                    )">Edit</button>

                    <button class="deletebtn-table" onclick="deletePlan(${row.id})">Delete</button>
                </div>
                
            </div>                    
        </div>
        `;
    });

        document.getElementById('append-data-plan').innerHTML = text;
    })
    .catch(err => console.error('Error loading plans:', err));
}

document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let formData = new FormData(this);
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }
    
    formData.append('action', 'update'); // always update
    formData.append('planId', document.getElementById('planId').value);

    fetch('fetches/tablePlanServer.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(() => {
            this.reset();
            loadPlans(); // refresh the table
            document.getElementById('editForm').style.display = "none";
            document.getElementById('append-data-plan').style.display = "flex";
        });
            fetch('fetches/tablePlanServer.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => console.log(data));
});

function editPlan(id, partnumber, model, deliverydate, 
    manpower, prodhrs, mins1, mins2,
    mins3, mins4, mins5, mins6, mins7, mins8, mins9, mins10,
    mins11, mins12, mins13, mins14
) {
    const deli = document.getElementById('delDate').value;
    console.log(`Delivery Date: ${deli}`);
    document.getElementById('editForm').style.display = "flex";
    document.getElementById('append-data-plan').style.display = "none";
    document.getElementById('planId').value = id;
    document.getElementById('partno').value = partnumber;
    document.getElementById('modelnumber').value = model;
    document.getElementById('delDate').value = deliverydate;
    document.getElementById('manpower').value = manpower;
    document.getElementById('prodhrs').value = prodhrs;
    document.getElementById('plan1').value = mins1;
    document.getElementById('plan2').value = mins2;
    document.getElementById('plan3').value = mins3;
    document.getElementById('plan4').value = mins4;
    document.getElementById('plan5').value = mins5;
    document.getElementById('plan6').value = mins6;
    document.getElementById('plan7').value = mins7;
    document.getElementById('plan8').value = mins8;
    document.getElementById('plan9').value = mins9;
    document.getElementById('plan10').value = mins10;
    document.getElementById('plan11').value = mins11;
    document.getElementById('plan12').value = mins12;
    document.getElementById('plan13').value = mins13;
    document.getElementById('plan14').value = mins14;
}

function deletePlan(id) {
    if (!confirm('Delete this plan?')) return;
    fetch('fetches/tablePlanServer.php', {
            method: 'POST',
            body: new URLSearchParams({
                action: 'delete',
                id
            })
        })
        .then(res => res.json())
        .then(() => loadPlans());
}

// Auto refresh every 5 seconds
setInterval(loadPlans, 5000);

// Initial load
loadPlans();       





///////////WHOLE SWP FUNCTION UPLOAD//////////
document.addEventListener('DOMContentLoaded', () => {
    const viewBox = document.getElementById('swp-view-box');

    /* =========================
       LOAD LATEST SWP
    ========================= */
    fetch('fetches/tablePlanServer.php?action=get_latest_swp')
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                viewBox.innerHTML = `<p>${data.message || 'No file found'}</p>`;
                return;
            }

            const { filename, date_uploaded, initial_issue, revision_date, file } = data;

            const pdfBlob = b64toBlob(file, 'application/pdf');
            const pdfUrl = URL.createObjectURL(pdfBlob);

            viewBox.innerHTML = `
                <strong>Current Standard Working Procedure</strong>
                <iframe src="${pdfUrl}"></iframe>
                <div class="file-details">
                    <strong>File Name:</strong> ${filename}<br>
                    <strong>Initial Issue:</strong> ${formatDate(initial_issue)}<br>
                    <strong>Revision Date:</strong> ${
                        revision_date
                            ? formatDate(revision_date)
                            : 'This Document has not been revised yet.'
                    }<br>
                    <strong>Date Uploaded:</strong> ${formatDateTime(date_uploaded)}<br>
                </div>
            `;
        })
        .catch(err => {
            console.error(err);
            viewBox.innerHTML = '<p>Error loading file</p>';
        });

    /* =========================
       REVISION DATE N/A CHECKBOX
    ========================= */
    const revisionDateInput = document.getElementById('revision-date');
    const revisionNA = document.getElementById('revision-na');

    revisionNA.addEventListener('change', () => {
        if (revisionNA.checked) {
            revisionDateInput.value = '';
            revisionDateInput.disabled = true;
        } else {
            revisionDateInput.disabled = false;
        }
    });

    /* =========================
       HELPERS
    ========================= */
    function formatDate(dateStr) {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric'
        });
    }

    function formatDateTime(dateTimeStr) {
        if (!dateTimeStr) return '-';
        const date = new Date(dateTimeStr);

        const datePart = date.toLocaleDateString('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric'
        });

        const timePart = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        return `${datePart} ${timePart}`;
    }

    function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            byteArrays.push(new Uint8Array(byteNumbers));
        }

        return new Blob(byteArrays, { type: contentType });
    }
});

/* =========================
   FILE UPLOAD UI
========================= */
const uploadBox = document.getElementById('click-upload-box');
const fileInput = document.getElementById('file');
const uploadText = document.getElementById('upload-text');

uploadBox.addEventListener('click', (e) => {
    if (e.target.id !== 'swp-file-submitbtn') {
        fileInput.click();
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        if (file.type !== 'application/pdf') {
            alert('Only PDF files are allowed!');
            fileInput.value = '';
            uploadText.textContent = 'Click here to select file to upload:';
            return;
        }

        uploadText.textContent = `Selected file: ${file.name}`;
    } else {
        uploadText.textContent = 'Click here to select file to upload:';
    }
});

/* =========================
   LOGS OVERLAY
========================= */
const logsBtn = document.getElementById('logs-btn');
const logsOverlay = document.getElementById('logs-overlay');
const logsClose = document.getElementById('logs-close');
const logsList = document.getElementById('logs-list');

const LOGS_PER_PAGE = 10;
let allLogs = [];
let currentPage = 1;

function renderLogsPage(page) {
    logsList.innerHTML = '';

    const start = (page - 1) * LOGS_PER_PAGE;
    const end = start + LOGS_PER_PAGE;
    const pageLogs = allLogs.slice(start, end);

    if (pageLogs.length === 0) {
        logsList.innerHTML = '<li>No logs found</li>';
        return;
    }

    pageLogs.forEach(log => {
        const date = new Date(log.date_uploaded);
        const formatted = date.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        const li = document.createElement('li');
        li.textContent = `${log.log} in ${formatted}`;
        logsList.appendChild(li);
    });

    const totalPages = Math.ceil(allLogs.length / LOGS_PER_PAGE);
    document.getElementById('logs-page-info').textContent =
        `Page ${currentPage} of ${totalPages}`;

    document.getElementById('logs-prev').disabled = currentPage === 1;
    document.getElementById('logs-next').disabled = currentPage === totalPages;
}

logsBtn.addEventListener('click', () => {
    logsOverlay.style.display = 'flex';
    currentPage = 1;

    fetch('fetches/tablePlanServer.php?action=get_upload_logs')
        .then(res => res.json())
        .then(data => {
            if (data.success && data.logs.length > 0) {
                allLogs = data.logs;
                renderLogsPage(currentPage);
            } else {
                allLogs = [];
                logsList.innerHTML = '<li>No logs found</li>';
            }
        })
        .catch(err => {
            console.error(err);
            logsList.innerHTML = '<li>Error fetching logs</li>';
        });
});

document.getElementById('logs-prev').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderLogsPage(currentPage);
    }
});

document.getElementById('logs-next').addEventListener('click', () => {
    const totalPages = Math.ceil(allLogs.length / LOGS_PER_PAGE);
    if (currentPage < totalPages) {
        currentPage++;
        renderLogsPage(currentPage);
    }
});

logsClose.addEventListener('click', () => {
    logsOverlay.style.display = 'none';
});

logsOverlay.addEventListener('click', (e) => {
    if (e.target === logsOverlay) logsOverlay.style.display = 'none';
});


/* =========================
   SUBMIT / UPLOAD
========================= */
const submitBtn = document.getElementById('swp-file-submitbtn');

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (!fileInput.files.length) {
        alert('Please select a PDF file first!');
        return;
    }

    const newFile = fileInput.files[0];
    const initialDate = document.getElementById('initial-date').value;
    const revisionDate = document.getElementById('revision-date').value;
    const isRevisionNA = document.getElementById('revision-na').checked;

    if (!initialDate) {
        alert('Please select Initial Issue Date.');
        return;
    }

    if (!isRevisionNA && !revisionDate) {
        alert('Please select Revision Date or mark it as Not applicable.');
        return;
    }

    if (!confirm(`Are you sure you want to upload "${newFile.name}" and replace the current SWP?`)) {
        return;
    }

    const formData = new FormData();
    formData.append('file', newFile);
    formData.append('initial_issue', initialDate);
    formData.append('revision_date', isRevisionNA ? '' : revisionDate);
    formData.append('action', 'replace_swp');

    fetch('fetches/tablePlanServer.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('File uploaded and replaced successfully!');
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(err => {
            console.error(err);
            alert('An error occurred during upload.' + data.message);
        });
});


//////////////////////////////////////////////////////////




document.addEventListener("DOMContentLoaded", () => {
    const updateBars = () => {
        // Step 1: Fetch totalPlan and totalCount
        fetch("fetches/planner_data.php")
            .then(response => response.text())
            .then(value => {
                const [totalPlan, totalCount] = value.split(" ").map(Number);

                // Step 2: Fetch downtime count
                const downtimeCountPromise = fetch("fetches/tablePlanServer.php?action=get_downtime_total")
                    .then(res => res.json())
                    .then(data => {
                        return data.total_time || 0;
                    })
                    .catch(err => {
                        console.error("Error fetching downtime:", err);
                        return 0;
                    });


                // Step 3: Fetch downtime duration and compute total time
                const downtimeDurationPromise = fetch("fetches/tablePlanServer.php?action=get_downtime_duration")
                    .then(res => res.json())
                    .then(data => {
                        //console.log("Data received from server:", data); // <-- Add this to see the raw data

                        let totalSeconds = 0;

                        data.forEach(item => {
                            const parts = item.time_Elapse.split(":").map(Number);
                            // Handle HH:MM:SS or MM:SS formats
                            if (parts.length === 3) {
                                totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
                            } else if (parts.length === 2) {
                                totalSeconds += parts[0] * 60 + parts[1];
                            }
                        });

                        const hours = Math.floor(totalSeconds / 3600);
                        const minutes = Math.floor((totalSeconds % 3600) / 60);
                        const seconds = totalSeconds % 60;
                        return `${hours.toString().padStart(2, "0")}:${minutes
                            .toString()
                            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
                    })
                    .catch(err => {
                        console.error(err);
                        return "00:00:00";
                    });


                // Step 4: Fetch product model name
                const modelNamePromise = fetch("fetches/tablePlanServer.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({ action: "get_plan_value" })
                })
                .then(res => res.json())
                .then(res => res.success ? res.data.model : "--")
                .catch(() => "--");

                // Step 5: After all data fetched
                Promise.all([downtimeCountPromise, downtimeDurationPromise, modelNamePromise]).then(
                    ([downtimeCount, downtimeDuration, modelName]) => {
                        const barContainers = document.querySelectorAll(".bar-container");

                        barContainers.forEach(container => {
                            const label = container.querySelector(".label");
                            const bar = container.querySelector(".bar");
///////MUST CHANGE
                            if (label && label.textContent.trim() === "C4 Line:" && bar) {
                                const targetWidth = Math.round((totalCount / totalPlan) * 100);

                                // Update bar visuals
                                bar.setAttribute("data-width", targetWidth);
                                bar.textContent = totalCount;
                                bar.style.transition = "width 2s ease, background 2s ease";
                                bar.style.width = targetWidth + "%";

                                // Bar color
                                bar.style.background =
                                    targetWidth >= 100 ? "#3fb045ff" : "#3092fbff";

                                // Update info section MUSTTTTTTTTTTTTTTTT CHANGEEEEEEE
                                const info = container.parentElement.querySelector("#c4-info");
                                if (info) {
                                    info.innerHTML = `
                                        <div>Status: <strong style="color: green;">Online</strong></div>
                                        <div>Product Model: <strong>${modelName}</strong></div>
                                        <div>Quota per day: <strong>${totalPlan}</strong></div>
                                        <div>Completion Rate: <strong>${targetWidth}%</strong></div>
                                        <div>Downtime Count: <strong>${downtimeCount}</strong></div>
                                        <div>DT Duration: <strong>${downtimeDuration}</strong></div>
                                    `;
                                }
                            }
                        });
                    }
                );
            })
            .catch(err => console.error("Error fetching data:", err));
    };

    // Run initially and every second (you can increase to 5s if needed)
    updateBars();
    setInterval(updateBars, 5000);
});
/*
document.addEventListener("DOMContentLoaded", () => {
    const barEndpoints = {
        "c4": "http://192.168.1.32/DOM/files/DOMPlanner/fetches/planner_data.php",
        "c7": "http://10.0.0.102/DOM/files/DOMPlanner/fetches/planner_data.php",
        "c9": "http://10.0.0.136/DOM/files/DOMPlanner/fetches/planner_data.php",
        "c9one": "http://10.0.0.125/DOM/files/DOMPlanner/fetches/planner_data.php",
        "c10": "http://10.0.0.164/DOM/files/DOMPlanner/fetches/planner_data.php"
    };

    const barLabels = {
        "c4": "C4 Line:",
        "c7": "C7 Line:",
        "c9": "C9 Line:",
        "c9one": "C9-1 Line:",
        "c10": "C10 Line:"
    };

    // Fetch current LAN IP
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

    // Update a single bar
    const updateBar = async (key, url) => {
        const label = barLabels[key];
        const baseURL = url.replace("/DOM/files/DOMPlanner/fetches/planner_data.php", ""); // derive base ip
        console.log(baseURL);
        try {
            // 1️⃣ Fetch total plan & total count
            const response = await fetch(url);
            const value = await response.text();
            const [totalPlan, totalCount] = value.split(" ").map(Number);
            const targetWidth = Math.round((totalCount / totalPlan) * 100);

            // 2️⃣ Fetch model name
            let modelName = "--";
            try {
                const modelResponse = await fetch(url.replace("planner_data.php", "tablePlanServer.php"), {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({ action: "get_plan_value" })
                });

                const modelData = await modelResponse.json();

                if (modelData.success && modelData.data?.model) {
                    modelName = modelData.data.model;
                }
            } catch (err) {
                console.error(`Model fetch failed for ${label}:`, err);
            }

            // 3️⃣ Fetch downtime data
            let downtimeCount = 0;
            let downtimeDuration = "00:00:00";
            try {
                // Downtime count
                const countResponse = await fetch(`${baseURL}/DOM/files/DOMPlanner/fetches/tablePlanServer.php?action=get_downtime_total`);
                const countData = await countResponse.json();
                downtimeCount = countData.total_time || 0;

                // Downtime duration
                const durationResponse = await fetch(`${baseURL}/DOM/files/DOMPlanner/fetches/tablePlanServer.php?action=get_downtime_duration`);
                const durationData = await durationResponse.json();

                let totalSeconds = 0;
                durationData.forEach(item => {
                    const parts = item.time_Elapse.split(":").map(Number);
                    if (parts.length === 3)
                        totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
                    else if (parts.length === 2)
                        totalSeconds += parts[0] * 60 + parts[1];
                });

                const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
                const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
                const s = String(totalSeconds % 60).padStart(2, "0");
                downtimeDuration = `${h}:${m}:${s}`;
            } catch (err) {
                console.error(`Downtime fetch failed for ${label}:`, err);
            }

            // 4️⃣ Update DOM
            document.querySelectorAll(".bar-container").forEach(container => {
                const labelEl = container.querySelector(".label");
                const bar = container.querySelector(".bar");

                if (labelEl && labelEl.textContent.trim() === label && bar) {
                    bar.style.transition = "width 0.5s ease, background 0.5s ease";
                    bar.style.width = `${targetWidth}%`;
                    bar.textContent = totalCount;
                    bar.style.background = targetWidth >= 100 ? "#2E7D32" : "#006ee4";

                    const info = document.querySelector(`#${key}-info`);
                    if (info) {
                        info.innerHTML = `
                            <div>Status: <span style="color:green;"><strong>Online</strong></span></div>
                            <div>Product Model: <strong>${modelName}</strong></div>
                            <div>Quota per day: <strong>${totalPlan}</strong></div>
                            <div>Completion Rate: <strong>${targetWidth}%</strong></div>
                            <div>Downtime Count: <strong>${downtimeCount}</strong></div>
                            <div>DT Duration: <strong>${downtimeDuration}</strong></div>
                        `;
                    }
                }
            });
        } catch (err) {
            console.error(`Error updating ${label}:`, err);

            const info = document.querySelector(`#${key}-info`);
            if (info) {
                info.innerHTML = `
                    <div>Status: <strong style="color:red;">Offline</strong></div>
                    <div>Product Model: <strong>--</strong></div>
                    <div>Quota per day: <strong>--</strong></div>
                    <div>Completion Rate: <strong>--</strong></div>
                    <div>Downtime Count: <strong>--</strong></div>
                    <div>DT Duration: <strong>--</strong></div>
                `;
            }
        }
    };

    // Update all bars (skip C4 if current device is C4)
    const updateBars = async () => {
        const currentIP = await getCurrentIP();

        for (const [key, url] of Object.entries(barEndpoints)) {
            // Extract the IP from the URL
            const endpointIP = url.match(/\/\/([\d.]+)\//)[1];

            // Skip if the endpoint IP matches current device IP
            if (endpointIP === currentIP) continue;

            updateBar(key, url);
        }
    };


    // Initial update and interval
    updateBars();
    setInterval(updateBars, 6000);
}); 
 */ 

let deleteMode = false;

function toggleDeleteMode() {
    deleteMode = !deleteMode;

    document.getElementById("deleteMainBtn").innerText =
        deleteMode ? "Cancel" : "Delete";

    document.querySelectorAll(".action-col").forEach(col => {
        col.style.display = deleteMode ? "table-cell" : "none";
    });
}


function loadOverviewPlan() {
    fetch('fetches/tablePlanServer.php', {
        method: 'POST',
        body: new URLSearchParams({ action: 'get_by_plan_id_value' })
    })
    .then(res => res.json())
    .then(async row => {
        if (!row) return;

        // ✅ HANDLE "No Plan" FROM BACKEND
        if (row === "No Plan") {
            window.currentPlan = "No Plan";
            window.currentPlanOutputs = {};

            const text = `
                <div class="DOM-graphs-title">Daily Production Details</div>
                <div class="overview-plan-data-container">
                    <div class="overview-plan-data">
                        <div class="overview-header-plan-data">
                            No Plan Selected
                        </div>

                        <div class="overview-plan-section">Product Information</div>
                        <div class="overview-information">
                            <div><label>Part No:<br></label> No Plan Selected.</div>
                            <div><label>Model:<br></label> No Plan Selected.</div>
                            <div><label>Delivery Date:<br></label> No Plan Selected.</div>
                            <div><label>Cycle Time:<br></label> No Plan Selected.</div>
                            <div><label>Cycle Time As Of:<br></label> No Plan Selected.</div>
                            <div><label>Expiration Date:<br></label> No Plan Selected.</div>
                            <div><label>Manpower:<br></label> No Plan Selected.</div>
                            <div><label>Prod Hours:<br></label> No Plan Selected.</div>
                        </div>

                        <div class="overview-plan-section">Plan Output Per Hour</div>
                        <div class="overview-time-plan">
                            <div style="text-align:center; opacity:.6;">No Plan Selected.</div>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('dom-overview-container').innerHTML = text;
            return;
        }

        // SAVE PLAN DETAILS (normal flow)
        window.currentPlan = row;

        // 👉 Fetch plan_output 14 rows
        const planOutput = await fetch('fetches/tablePlanServer.php', {
            method: 'POST',
            body: new URLSearchParams({ action: 'fetchPlanOutput' })
        }).then(r => r.json());

        // 👉 Create a separate object for plan outputs
        window.currentPlanOutputs = {};
        if (Array.isArray(planOutput) && planOutput.length === 14) {
            for (let i = 0; i < 14; i++) {
                window.currentPlanOutputs[`mins${i + 1}`] = planOutput[i];
            }
        }

        const text = `
            <div class="DOM-graphs-title">Daily Production Details</div>
            <div class="overview-plan-data-container">
                <div class="overview-plan-data">
                    <div class="overview-header-plan-data">
                        Plan for ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>

                    <div class="overview-plan-section" id="overview-information-title">Product Information</div>
                    <div class="overview-information">
                        <div><label>Part No:<br></label> ${row.partnumber}</div>
                        <div><label>Model:<br></label> ${row.model}</div>
                        <div><label>Delivery Date:<br></label> ${row.deliverydate}</div>
                        <div><label>Cycle Time:<br></label>${row.cycletime}</div>
                        <div><label>Cycle Time As Of:<br></label> ${row.cycletimeasof}</div>
                        <div><label>Expiration Date:<br></label> ${row.expirationdate}</div>
                        <div><label>Manpower:<br></label> ${row.manpower}</div>
                        <div><label>Prod Hours:<br></label> ${row.prodhrs}</div>
                    </div>

                    <div class="overview-plan-section" id="overview-time-title">Plan Output Per Hour</div>
                    <div class="overview-time-plan">
                        ${generatePlanGrid(window.currentPlanOutputs)}
                    </div>

                    <div id="achieved-per-hr">
                        <div class="achieved-bar-title">Actual Count Per Hour 
                        <select id="bar-graph-selection">
                            <option value="prodgraph" id="bar-select-1" class="bar-select">Production</option>
                            <option value="dtgraph"  id="bar-select-2" class="bar-select">Downtime</option>
                        </select>
                        </div>
                        <div class="achieved-bar-graph" id="production-bar-graph">
                            ${generateInitialBars()}
                        </div>
                        <div class="achieved-bar-graph" id="downtime-bar-graph" style="display:none;">
                            ${generateDowntimeBars()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('dom-overview-container').innerHTML = text;
    })
    .catch(err => console.error('Error loading plan details:', err));
}



function generatePlanGrid(row) {
    const plans = [
        row.mins1, row.mins2, row.mins3, row.mins4,
        row.mins5, row.mins6, row.mins7, row.mins8,
        row.mins9, row.mins10, row.mins11, row.mins12,
        row.mins13, row.mins14
    ];
    const times = [
        "6AM–7AM","7AM–8AM","8AM–9AM","9AM–10AM",
        "10AM–11AM","11AM–12PM","12PM–1PM","1PM–2PM",
        "2PM–3PM","3PM–4PM","4PM–5PM","5PM–6PM",
        "6PM–7PM","7PM–8PM"
    ];

    const formatValue = (val, time) => {
        if (val === 0 || val === "0" || val === null) {
            if (/(6AM|7AM|8AM|9AM|10AM|11AM|12PM|1PM|2PM|3PM|4PM|5PM|6PM)/.test(time) && !/6PM|7PM|8PM/.test(time)) return "BREAK";
            if (/6PM|7PM|8PM/.test(time)) return "N/A";
        }
        return val ?? "-";
    };

    const firstHalfTimes = times.slice(0, 7);
    const secondHalfTimes = times.slice(7);
    const firstHalfPlans = plans.slice(0, 7);
    const secondHalfPlans = plans.slice(7);

    return `
        <div class="overview-grid">
            ${firstHalfTimes.map(t => `<div class="time-cell">${t}</div>`).join('')}
            ${firstHalfPlans.map((p,i) => `<div class="value-cell">${formatValue(p, firstHalfTimes[i])}</div>`).join('')}
            ${secondHalfTimes.map(t => `<div class="time-cell" id="timecell2">${t}</div>`).join('')}
            ${secondHalfPlans.map((p,i) => `<div class="value-cell">${formatValue(p, secondHalfTimes[i])}</div>`).join('')}
        </div>
    `;
}

function generateInitialBars() {
    const times = ["6AM–7AM","7AM–8AM","8AM–9AM","9AM–10AM","10AM–11AM","11AM–12PM","12PM–1PM",
                "1PM–2PM","2PM–3PM","3PM–4PM","4PM–5PM","5PM–6PM","6PM–7PM","7PM–8PM"];
    return times.map(time => `
        <div class="achieved-bar-item">
            <div class="achieved-bar" style="height:0; transition: height 0.5s;">
                <span class="achieved-bar-value">0</span>
            </div>
            <div class="achieved-bar-label">${time}</div>
        </div>
    `).join('');
}

function generateDowntimeBars() {
    const times = [
        "6AM–7AM","7AM–8AM","8AM–9AM","9AM–10AM",
        "10AM–11AM","11AM–12PM","12PM–1PM",
        "1PM–2PM","2PM–3PM","3PM–4PM","4PM–5PM",
        "5PM–6PM","6PM–7PM","7PM–8PM"
    ];

    return times.map(time => `
        <div class="dt-bar-item">
            <div class="dt-bar" style="height:0; transition: height 0.5s; background-color:#dc3545;">
                <span class="dt-bar-value">0</span>
            </div>
            <div class="dt-bar-label">${time}</div>
        </div>
    `).join('');
}

function updateBarHeights() {
    if (!window.currentPlan) return;

    fetch('fetches/tablePlanServer.php', {
        method: 'POST',
        body: new URLSearchParams({ action: 'get_countPerHr' })
    })
    .then(res => res.json())
    .then(countData => {
        const plans = [
            window.currentPlan.mins1,
            window.currentPlan.mins2,
            window.currentPlan.mins3,
            window.currentPlan.mins4,
            window.currentPlan.mins5,
            window.currentPlan.mins6,
            window.currentPlan.mins7,
            window.currentPlan.mins8,
            window.currentPlan.mins9,
            window.currentPlan.mins10,
            window.currentPlan.mins11,
            window.currentPlan.mins12,
            window.currentPlan.mins13,
            window.currentPlan.mins14
        ];

        const planMap = plans.map(p => parseInt(p) || 0);
        //console.log("Plans map:", planMap);

        // ⛔ Stop if all plans are 0
        if (planMap.every(v => v === 0)) {
            //console.log("All plan values are zero — terminating updateBarHeights().");
            return;
        }

        const maxVal = Math.max(
            ...countData.map(v => parseInt(v) || 0),
            ...plans.map(p => parseInt(p) || 0)
        ) || 1;

        const graphHeight = 150; // in vh
        const bars = document.querySelectorAll('#achieved-per-hr .achieved-bar');

        bars.forEach((bar, i) => {
            const numericVal = parseInt(countData[i]) || 0;
            const planVal = parseInt(plans[i]) || 0;
            const barHeight = (numericVal / maxVal) * graphHeight;
            const color = numericVal >= planVal ? "#28a745" : "#007bff";

            bar.style.height = barHeight + 'px';
            bar.style.backgroundColor = color;
            bar.querySelector('.achieved-bar-value').textContent = numericVal;

            // console.log(window.currentPlan);
            // console.log(`Bar ${i + 1}: numericVal = ${numericVal}, planVal = ${planVal}, barHeight (${barHeight.toFixed(2)})= (${numericVal}/${maxVal})*${graphHeight}`);
        });
    })
    .catch(err => console.error('Error updating bar heights:', err));
}

function updateDowntimeBars() {
    fetch('fetches/tablePlanServer.php', {
        method: 'POST',
        body: new URLSearchParams({ action: 'get_downtime_data' })
    })
    .then(res => res.json())
    .then(downtimeData => {
        const bars = document.querySelectorAll('#downtime-bar-graph .dt-bar');
        const maxVal = Math.max(...downtimeData.map(v => v.time_num || 0), 1);
        const graphHeight = 150; // same as production

        bars.forEach((bar, i) => {
            const val = downtimeData[i]?.time_num || 0;
            const barHeight = (val / maxVal) * graphHeight;

            bar.style.height = barHeight + 'px';
            bar.querySelector('.dt-bar-value').textContent = val;
        });
    })
    .catch(err => console.error('Error updating downtime bars:', err));
}

function updateOverviewPlan() {
    fetch('fetches/tablePlanServer.php', {
        method: 'POST',
        body: new URLSearchParams({ action: 'get_by_plan_id_value' })
    })
    .then(res => res.json())
    .then(async row => {
        if (!row) return;

        // ✅ HANDLE "No Plan Selected"
        if (row === "No Plan") {
            window.currentPlan = "No Plan";

            const infoHTML = `
                <div><label>Part No:<br></label> No Plan Selected.</div>
                <div><label>Model:<br></label> No Plan Selected.</div>
                <div><label>Delivery Date:<br></label> No Plan Selected.</div>
                <div><label>Cycle Time:<br></label> No Plan Selected.</div>
                <div><label>Cycle Time As Of:<br></label> No Plan Selected.</div>
                <div><label>Expiration Date:<br></label> No Plan Selected.</div>
                <div><label>Manpower:<br></label> No Plan Selected.</div>
                <div><label>Prod Hours:<br></label> No Plan Selected.</div>
            `;
            document.querySelector('.overview-information').innerHTML = infoHTML;

            document.querySelector('.overview-time-plan').innerHTML =
                `<div style="text-align:center; opacity:.6;">No Plan Selected.</div>`;

            return;
        }

        // Normal flow
        window.currentPlan = row;

        // 👉 Fetch plan_output 14 rows
        const planOutput = await fetch('fetches/tablePlanServer.php', {
            method: 'POST',
            body: new URLSearchParams({ action: 'fetchPlanOutput' })
        }).then(r => r.json());

        // 👉 Map the 14 values into mins1–mins14
        if (Array.isArray(planOutput) && planOutput.length === 14) {
            row.mins1  = planOutput[0];
            row.mins2  = planOutput[1];
            row.mins3  = planOutput[2];
            row.mins4  = planOutput[3];
            row.mins5  = planOutput[4];
            row.mins6  = planOutput[5];
            row.mins7  = planOutput[6];
            row.mins8  = planOutput[7];
            row.mins9  = planOutput[8];
            row.mins10 = planOutput[9];
            row.mins11 = planOutput[10];
            row.mins12 = planOutput[11];
            row.mins13 = planOutput[12];
            row.mins14 = planOutput[13];
        }

        // Update Product Info
        const infoHTML = `
            <div><label>Part No:<br></label> ${row.partnumber}</div>
            <div><label>Model:<br></label> ${row.model}</div>
            <div><label>Delivery Date:<br></label> ${row.deliverydate}</div>
            <div><label>Cycle Time:<br></label> ${row.cycletime}</div>
            <div><label>Cycle Time As Of:<br></label> ${row.cycletimeasof}</div>
            <div><label>Expiration Date:<br></label> ${row.expirationdate}</div>
            <div><label>Manpower:<br></label> ${row.manpower}</div>
            <div><label>Prod Hours:<br></label> ${row.prodhrs}</div>
        `;
        document.querySelector('.overview-information').innerHTML = infoHTML;

        // Update Plan per Hour Grid
        document.querySelector('.overview-time-plan').innerHTML =
            generatePlanGrid(row);
    })
    .catch(err => console.error('Error updating plan:', err));
}


document.addEventListener('change', function(e) {
    if (e.target.id === 'bar-graph-selection') {
        const selection = e.target.value;

        if (selection === 'prodgraph') {
            document.getElementById('production-bar-graph').style.display = 'flex';
            document.getElementById('downtime-bar-graph').style.display = 'none';
            updateBarHeights();
        } else if (selection === 'dtgraph') {
            document.getElementById('production-bar-graph').style.display = 'none';
            document.getElementById('downtime-bar-graph').style.display = 'flex';
            updateDowntimeBars();
        }
    }
});

loadOverviewPlan();

setInterval(updateBarHeights, 3000);  
setInterval(updateDowntimeBars, 3000);
setInterval(updateOverviewPlan, 5000); 

document.addEventListener("DOMContentLoaded", () => {
    const ctInput = document.getElementById('ct');
    const ctaoInput = document.getElementById('ctao');
    const expdateInput = document.getElementById('expdate');
    const editBtn = document.getElementById('edit-ct');
    const submitBtn = document.getElementById('submit-ct');
    const backBtn = document.getElementById('back-ct');

    let originalData = {}; // to store original values when editing

    // Inputs are readonly initially
    ctInput.readOnly = true;
    ctaoInput.readOnly = true;
    expdateInput.readOnly = true;

    // Submit and Back hidden initially
    submitBtn.style.display = 'none';
    backBtn.style.display = 'none';

    // Fetch CT data
    function loadCTData() {
        fetch('fetches/tablePlanServer.php?action=ctfetch')
            .then(res => res.json())
            .then(data => {
                ctInput.value = data.ctime || '';
                ctaoInput.value = data.ctao || '';
                expdateInput.value = data.ed || '';
                originalData = { ...data }; // store original values
            })
            .catch(err => console.error('Error fetching CT data:', err));
    }

    loadCTData();

    // Edit button click
    editBtn.addEventListener('click', () => {
        ctInput.readOnly = false;
        ctaoInput.readOnly = false;
        expdateInput.readOnly = false;

        editBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
        backBtn.style.display = 'inline-block';
    });

    // Back button click
    backBtn.addEventListener('click', () => {
        // Restore original values
        ctInput.value = originalData.ctime || '';
        ctaoInput.value = originalData.ctao || '';
        expdateInput.value = originalData.ed || '';

        ctInput.readOnly = true;
        ctaoInput.readOnly = true;
        expdateInput.readOnly = true;

        submitBtn.style.display = 'none';
        backBtn.style.display = 'none';
        editBtn.style.display = 'inline-block';
    });

    // Submit button click
    submitBtn.addEventListener('click', () => {
        const formData = new FormData();
        formData.append('action', 'ctupdate');
        formData.append('ctime', ctInput.value);
        formData.append('ctao', ctaoInput.value);
        formData.append('ed', expdateInput.value);

        fetch('fetches/tablePlanServer.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(resp => {
            if (resp.success) {
                alert('CT updated successfully!');
                ctInput.readOnly = true;
                ctaoInput.readOnly = true;
                expdateInput.readOnly = true;

                submitBtn.style.display = 'none';
                backBtn.style.display = 'none';
                editBtn.style.display = 'inline-block';
                location.reload();
                // Update originalData to latest values
                originalData = {
                    ctime: ctInput.value,
                    ctao: ctaoInput.value,
                    ed: expdateInput.value
                };
            } else {
                alert('Error: ' + (resp.error || 'Unknown'));
            }
        })
        .catch(err => console.error('Error updating CT:', err));
    });
});

document.addEventListener("DOMContentLoaded", () => {
    fetch('fetches/tablePlanServer.php', {
        method: 'POST',
        body: new URLSearchParams({ action: 'updatePlanOutputLive' })
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) {
            //console.log(`PlanOutput updated on page load: Cycle Time ${res.cycletime}`);
        } else {
            console.error('Update failed:', resp.error);
        }
    })
    .catch(err => console.error('Fetch error:', err));
});


/////DOWNLOAD XML FILE
document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("savedDataSelect");
    const preview = document.getElementById("dataPreview");
    const downloadBtn = document.getElementById("downloadBtn");

    // Load IDs for the dropdown
    fetch("../../data/fetch_id.php")
        .then(res => res.json())
        .then(data => {
            if (!data.success) return;

            data.ids.forEach(row => {
                const opt = document.createElement("option");

                // Format: Month Day, Year - HH:MM:SS AM/PM
                const dateObj = new Date(row.date_saved);
                const datePart = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

                let hours = dateObj.getHours();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12;
                const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                const seconds = String(dateObj.getSeconds()).padStart(2, '0');
                const timePart = `${hours}:${minutes}:${seconds} ${ampm}`;

                opt.value = row.id;
                opt.textContent = `${datePart} - ${timePart}`;
                select.appendChild(opt);
            });
        });

        function getTimeRange(index) {
    // index: 1 to 14
    const startHour24 = 5 + index; // 6 AM for index 1
    const endHour24 = startHour24 + 1;

    function formatHour(hour24) {
            const ampm = hour24 >= 12 ? 'PM' : 'AM';
            let hour12 = hour24 % 12;
            hour12 = hour12 === 0 ? 12 : hour12;
            return `${hour12}:00 ${ampm}`;
        }

        return `${formatHour(startHour24)} - ${formatHour(endHour24)}`;
    }

    // On select change
    select.addEventListener("change", () => {
        const id = select.value;

        if (!id) {
            preview.innerHTML = `<p class="placeholder-text">Data will appear here.</p>`;
            downloadBtn.disabled = true;
            return;
        }

        // Show loading message
        preview.innerHTML = `<p class="placeholder-text">Loading data for ID ${id}...</p>`;
        downloadBtn.disabled = false;

        // Fetch full saved_data for the selected ID
        fetch(`fetches/planner_db.php?action=get_saved_data&id=${id}`)
            .then(res => res.json())
            .then(response => {
                if (!response.success) {
                    preview.innerHTML = `<p class="placeholder-text">Failed to load data.</p>`;
                    return;
                }

                const d = response.data; // all saved_data columns

                // Build HTML dynamically
                let html = `
                <div class="preview-card">
                    <h3>Plan Info</h3>
                    <div id="plan-info-preview">
                        <span><strong>Part Number:</strong> ${d.partnumber}</span>
                        <span><strong>Model:</strong> ${d.model}</span>
                        <span><strong>Balance:</strong> ${d.balance}</span>
                        <span><strong>Manpower:</strong> ${d.manpower}</span>
                        <span><strong>Production Hours:</strong> ${d.prodhrs}</span>
                        <span><strong>Delivery Date:</strong> ${d.deliverydate}</span>
                        <span><strong>Cycle Time:</strong> ${d.cycletime}</span>
                    </div>
                </div>

                `;

                html += `
                <div class="preview-card"><h3>Line Leader & Manpower</h3>
                    <div id="ll-ps-previews">
                        <span><strong>Line Leader:</strong> ${d.lineleader_name} <!--${d.lineleader_title}--></span>
                        <span><strong>Manpower 1:</strong> ${d.manpower1_name} - ${d.manpower1_title}</span>
                        <span><strong>Manpower 2:</strong> ${d.manpower2_name} - ${d.manpower2_title}</span>
                        <span><strong>Manpower 3:</strong> ${d.manpower3_name} - ${d.manpower3_title}</span>
                    </div>                
                </div>

                `;

                html += `
                <div class="preview-card"><h3>Output Table</h3>
                <div id="data-preview-table">
                    <table border="1" cellpadding="4" style="border-collapse:collapse; width:100%;">
                        <tr>
                            <th>Time Range</th><th>Mins</th><th>Plan Output</th><th>Actual Output</th><th>Percentage</th>
                            <th>Total</th><th>Downtime</th><th>NG Qty</th><th>Remarks</th>
                        </tr>`;

                for (let i = 1; i <= 14; i++) {
                    html += `<tr>
                        <td><strong>${getTimeRange(i)}</strong></td>
                        <td>${d[`mins_out${i}`]}</td>
                        <td>${d[`plan_output${i}`]}</td>
                        <td>${d[`actual_output${i}`]}</td>
                        <td>${d[`percentage${i}`]}%</td>
                        <td>${d[`total${i}`]}</td>
                        <td>${d[`dt_mins${i}`]}</td>
                        <td>${d[`ng_quantity${i}`]}</td>
                        <td>${d[`remarks${i}`]}</td>
                    </tr>`;
                }
                html += `</table> </div> </div>`;

                html += `
                <div class="preview-card">
                <h3>Summary</h3>
                    <div id="summary-preview">
                        
                        <span><strong>Plan Production Hrs:</strong> ${d.plan_prodhrs}</span>
                        <span><strong>Actual Production Hrs:</strong> ${d.actual_prodhrs}</span>
                        <span><strong>Plan Output:</strong> ${d.plan_output}</span>
                        <span><strong>Actual Output:</strong> ${d.actual_output}</span>
                        <span><strong>Plan Manpower:</strong> ${d.plan_manpower}</span>
                        <span><strong>Actual Manpower:</strong> ${d.actual_manpower}</span>
                        <span><strong>Break Time:</strong> ${d.breaktime}</span>
                        <span><strong>Total Downtime:</strong> ${d.totaldowntime}</span>
                        <span><strong>Good Quantity:</strong> ${d.good_qty}</span>
                        <span><strong>Total NG:</strong> ${d.total_ng}</span>
                        <span><strong>Completion Rate:</strong> ${d.summary_percentage}%</span>
                    </div>
                </div>`;

                preview.innerHTML = html;
            })
            .catch(err => {
                console.error(err);
                preview.innerHTML = `<p class="placeholder-text">Failed to load data.</p>`;
            });
    });

    // Download
    downloadBtn.addEventListener("click", () => {
        const id = select.value;
        if (!id) return;

        window.location.href = `../../data/excel.php?id=${id}`;
    });
});

/////DOWNLOAD XML FILE


        