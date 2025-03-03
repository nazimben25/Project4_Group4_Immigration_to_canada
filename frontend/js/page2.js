document.addEventListener("DOMContentLoaded", function () {
    const predictButton = document.getElementById("predictButton");
    const countrySelect = document.getElementById("countrySelect");
    const predictionResult = document.getElementById("predictionResult");

    // Fetch country list from API and populate the dropdown
    fetch("http://127.0.0.1:5000/api/proj4_v0.1/countries_list")
        .then(response => response.json())
        .then(data => {
            console.log("Fetched Countries:", data);  // Debugging output
            if (data.countries) {
                data.countries.forEach(country => {
                    let option = document.createElement("option");
                    option.value = country;
                    option.textContent = country;
                    countrySelect.appendChild(option);
                });
            } else {
                console.error("Invalid data format received", data);
            }
        })
        .catch(error => console.error("Error fetching countries:", error));

    predictButton.addEventListener("click", function () {
        const selectedCountry = countrySelect.value;

        // Define sample data mapping (update based on actual features)
        const sampleData = {
            "algeria2023": [5.1, 3.5, 1.4, 0.2],
            "denmark2023": [6.2, 2.8, 4.5, 1.5],
            "colombia2023": [5.5, 2.3, 3.8, 1.2],
            "mauritius2023": [4.8, 3.1, 2.2, 0.8]
        };

        if (!sampleData[selectedCountry]) {
            predictionResult.innerHTML = "<strong>Error:</strong> No sample data available for the selected country.";
            return;
        }

        // Send prediction request
        fetch("http://127.0.0.1:5000/api/proj4_v0.1/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "data": sampleData[selectedCountry] })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    predictionResult.innerHTML = `<strong>Error:</strong> ${data.error}`;
                } else {
                    predictionResult.innerHTML = `<strong>Prediction:</strong> ${data.prediction}`;
                }
            })
            .catch(error => {
                console.error("Error:", error);
                predictionResult.innerHTML = "<strong>Error:</strong> Failed to fetch prediction.";
            });
    });
});
