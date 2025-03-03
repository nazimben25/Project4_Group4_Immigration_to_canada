document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "http://127.0.0.1:5000/api/proj4_v0.1/immigation_flow_per_year_between/2015/2024";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("✅ API Data Received:", data);
            const tableBody = document.getElementById("data-table");

            let countries = [];
            let immigrants = [];

            data.slice(0, 10).forEach(item => {
                let row = document.createElement("tr");
                row.innerHTML = `<td>${item.country}</td><td>${item.flow}</td>`;
                tableBody.appendChild(row);

                // Push data for chart
                countries.push(item.country);
                immigrants.push(item.flow);
            });

            // Create Bar Chart
            const ctx = document.getElementById("immigrationChart").getContext("2d");
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: countries,
                    datasets: [{
                        label: "Immigrants",
                        data: immigrants,
                        backgroundColor: "lightblue",
                        borderColor: "blue",
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,  // Keeps chart proportions
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        })
        .catch(error => {
            console.error(" API Fetch Error:", error);
            alert("Failed to fetch data. Check the console.");
        });
});
