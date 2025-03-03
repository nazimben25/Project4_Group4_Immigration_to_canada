// Initialize the map
var map = L.map("map").setView([20, 0], 2);

// Load OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Fetch country coordinates from data.json
fetch("/frontend/data/data.json")
    .then(response => response.json())
    .then(countryData => {
        // Retrieve top 10 countries data from localStorage
        let topCountries = JSON.parse(localStorage.getItem("topCountries")) || [];

        console.log("Top 10 Countries Data:", topCountries);

        topCountries.forEach(country => {
            let countryInfo = countryData.ref_country_codes.find(c => c.country === country.country);

            if (countryInfo) {
                // Normalize immigration data for bubble size
                let size = Math.sqrt(country.immigrants) / 100;

                // Create a Circle marker
                L.circleMarker([countryInfo.latitude, countryInfo.longitude], {
                    color: "green",
                    fillColor: "green",
                    fillOpacity: 0.5,
                    radius: size
                })
                .addTo(map)
                .bindPopup(`<b>${country.country}</b><br>Immigrants: ${country.immigrants}`);
            }
        });
    })
    .catch(error => console.error("Error fetching country data:", error));
