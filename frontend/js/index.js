document.addEventListener("DOMContentLoaded", function () {
    // Initialize the map centered on Africa
    let map = L.map("map").setView([10, 20], 2);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    // Define colors for clusters
    const clusterColors = {
        0: "blue",
        1: "red",
        2: "green",
        3: "orange",
    
    };

    // Create a legend control
    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function (map) {
        let div = L.DomUtil.create("div", "info legend");
        div.innerHTML = "<strong>Cluster Legend</strong><br>";
        for (let cluster in clusterColors) {
            div.innerHTML += `<i style="background: ${clusterColors[cluster]}; width: 10px; height: 10px; display: inline-block;"></i> Cluster ${cluster}<br>`;
        }
        return div;
    };

    // Add the legend to the map
    legend.addTo(map);

    // Fetch Data from API
    fetch("http://127.0.0.1:5000/api/proj4_v0.1/countries_data")
        .then(response => response.json())
        .then(data => {
            console.log("Received Data:", data);
            // Plot Each Country on the Map
            data.forEach(country => {
                const { coordinates, country: countryName, cluster } = country;
                if (coordinates && coordinates.Longitude && coordinates.Latitude) {
                    L.circleMarker([coordinates.Longitude, coordinates.Latitude], {
                        radius: 6,  // Marker size
                        fillColor: clusterColors[cluster] || "gray", // Default gray if undefined
                        fillOpacity: 0.7,
                        color: "black",
                        weight: 1
                    })
                        .bindPopup(`<strong>${countryName}</strong><br>Cluster: ${cluster}`)
                        .addTo(map);
                }
            });
        })
        .catch(error => console.error("Error loading country data:", error));
});
