// ===============================
// Philips Referral Link System
// ===============================

// Generate Random Referral Code
function generateReferralCode() {
    const prefix = "PH";
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return prefix + random;
}

// Load or Create User Data
function loadReferralData() {
    const saved = JSON.parse(localStorage.getItem("referralData"));

    if (saved) return saved;

    const newData = {
        code: generateReferralCode(),
        totalReferrals: 0,
        earnings: 0,
        pending: 0
    };

    localStorage.setItem("referralData", JSON.stringify(newData));
    return newData;
}

// Save Data
function saveReferralData(data) {
    localStorage.setItem("referralData", JSON.stringify(data));
}

// Create Referral Link
function createReferralLink(code) {
    const baseUrl = "https://philipsfuturelightingindia.com";
    return `${baseUrl}?ref=${code}`;
}

// Update UI
function updateUI() {
    const data = loadReferralData();

    const fullLink = createReferralLink(data.code);

    document.querySelector(".code-box").innerText = data.code;

    const linkBox = document.querySelector(".link-box");
    if (linkBox) {
        linkBox.innerText = fullLink;
    }

    document.querySelectorAll(".stat-card h3")[0].innerText = data.totalReferrals;
    document.querySelectorAll(".stat-card h3")[1].innerText = "₹" + data.earnings;
    document.querySelectorAll(".stat-card h3")[2].innerText = data.pending;
}

// Copy Full Referral Link
function copyReferralLink() {
    const link = document.querySelector(".link-box").innerText;

    navigator.clipboard.writeText(link).then(() => {
        const button = document.querySelector(".copy-link-btn");
        button.innerText = "Copied!";
        setTimeout(() => {
            button.innerText = "Copy Referral Link";
        }, 2000);
    });
}

// Detect Incoming Referral
function checkIncomingReferral() {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get("ref");

    if (refCode) {
        localStorage.setItem("incomingReferral", refCode);
        console.log("Referred by:", refCode);
    }
}

// Form Handling
document.addEventListener("DOMContentLoaded", () => {

    checkIncomingReferral();
    updateUI();

    const form = document.querySelector(".referral-form");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            let data = loadReferralData();

            data.totalReferrals += 1;
            data.earnings += 200;
            data.pending += 1;

            saveReferralData(data);
            updateUI();

            form.reset();
            alert("Referral Sent Successfully 🎉");
        });
    }
});