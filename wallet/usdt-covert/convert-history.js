document.addEventListener("DOMContentLoaded", async () => {

    const historyBody = document.getElementById("historyBody");
    const emptyState = document.getElementById("emptyState");

    try {
        const response = await fetch(`${API_BASE}/usdt/history`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });

        const result = await response.json();

        // 🔥 If request failed
        if (!response.ok || !result.success) {
            emptyState.innerText = result.message || "Unable to load history.";
            emptyState.style.display = "block";
            return;
        }

        const history = result.data;

        // 🔥 If no records
        if (!history || history.length === 0) {
            emptyState.innerText = "No conversion history found.";
            emptyState.style.display = "block";
            return;
        }

        history.forEach(item => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${new Date(item.createdAt).toLocaleString()}</td>
                <td>${item.usdtAmount} USDT</td>
                <td>₹${item.rate}</td>
                <td>₹${item.inrAmount}</td>
                <td class="status-completed">Completed</td>
            `;

            historyBody.appendChild(row);
        });

    } catch (error) {
        console.error("History Load Error:", error);
        emptyState.innerText = "Unable to load history.";
        emptyState.style.display = "block";
    }

});