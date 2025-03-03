document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.getElementById("indicatorDropdown");
    const tableBody = document.getElementById("table-body");
    const apiBaseUrl = "http://127.0.0.1:5000/api/proj4_v0.1";
    let chartInstance = null;

    // Fetch available indicators
    fetch(`${apiBaseUrl}/indicators_all`)
        .then(response => response.json())
        .then(indicators => {
            dropdown.innerHTML = ""; // Clear previous options
            indicators.forEach(indicator => {
                let option = document.createElement("option");
                option.value = indicator;
                option.textContent = indicator;
                dropdown.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching indicators:", error));

    // Event listener for dropdown selection
    dropdown.addEventListener("change", function () {
        const selectedIndicator = dropdown.value;
        if (!selectedIndicator) return;

        fetch(`${apiBaseUrl}/top_countries_by_indicator/${selectedIndicator}`)
            .then(response => response.json())
            .then(data => {
                tableBody.innerHTML = ""; // Clear previous table results
                let countries = [];
                let values = [];
                let uniqueCountries = new Set();

                data.forEach(item => {
                    if (!uniqueCountries.has(item.country)) {
                        uniqueCountries.add(item.country);
                        let row = document.createElement("tr");
                        row.innerHTML = `<td>${item.country}</td><td>${item.value}</td>`;
                        tableBody.appendChild(row);

                        // Push data for chart
                        countries.push(item.country);
                        values.push(item.value);
                    }
                });

                // Update Chart
                updateChart(countries, values);
            })
            .catch(error => {
                console.error("❌ Error fetching top countries:", error);
                alert("Failed to load data.");
            });
    });

    // Function to update chart
    function updateChart(countries, values) {
        const ctx = document.getElementById("indicatorChart").getContext("2d");

        // Destroy previous chart instance if exists
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels: countries,
                datasets: [{
                    label: "Indicator Value",
                    data: values,
                    backgroundColor: "lightblue",
                    borderColor: "blue",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Ensure flexibility in resizing
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
});