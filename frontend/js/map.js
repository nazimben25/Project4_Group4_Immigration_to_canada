document.addEventListener("DOMContentLoaded", function () {
    var map = L.map('map').setView([56.1304, -106.3468], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    fetch('data/data.json')
        .then(response => response.json())
        .then(data => {
            let select = document.getElementById("country-select");

            data.ref_country_codes.forEach(entry => {
                let option = document.createElement("option");
                option.value = entry.alpha3;
                option.textContent = entry.country;
                select.appendChild(option);
            });

            select.addEventListener("change", function () {
                let countryCode = this.value;
                if (countryCode) {
                    fetch(`/api/proj4_v0.1/immigration_statistics_per_country/${countryCode}`)
                        .then(response => response.json())
                        .then(data => {
                            console.log("Received Data:", data);
                        })
                        .catch(error => console.error("Fetch Error:", error));
                }
            });
        })
        .catch(error => console.error("Error loading country list:", error));
});
