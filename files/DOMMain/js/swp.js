function goToSWP() {
    window.location.href = 'swp.php';
}

function goToDashb() {
    window.location.href = 'pndmonitoring.php';
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

document.addEventListener('DOMContentLoaded', () => {
    const viewBox = document.getElementById('swp-view-box');

    fetch('fetches1/domfetch.php?action=get_pdf')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const base64PDF = data.file;
                const pdfBlob = b64toBlob(base64PDF, 'application/pdf');
                const pdfUrl = URL.createObjectURL(pdfBlob);

                // Embed the PDF in the div
                viewBox.innerHTML = `<iframe src="${pdfUrl}" style="width:100%; height:100%; border:none;"></iframe>`;
            } else {
                viewBox.innerText = data.message || 'Failed to load PDF';
            }
        })
        .catch(err => {
            console.error(err);
            viewBox.innerText = 'Error loading PDF';
        });

    // Helper: convert base64 to Blob
    function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: contentType });
    }
});


