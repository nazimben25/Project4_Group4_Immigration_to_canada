// Creating the map object
let myMap = L.map("map", {
    
    // define center as town of Bangui, central africa
    center: [4.3612, 18.5550],
    zoom: 3
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
// Store the API query variables.
let url = "http://127.0.0.1:5000/api/proj4_v0.1/immigation_flow";
  
console.log(url)

  // Get the data with d3.
  d3.json(url).then(function(response) { 
    console.log(response); 

    // CReate markers : for Loop through the features array in the response

    // Define colors for clusters
    const clusterColors = {
      0: "blue",
      1: "red",
      2: "green",
      3: "orange",};

 // Create a legend control
 let legend = L.control({ position: "bottomright" });

 legend.onAdd = function (myMap) {
     let div = L.DomUtil.create("div", "info legend");
     div.innerHTML = "<strong>Cluster Legend</strong><br>";
     for (let cluster in clusterColors) {
         div.innerHTML += `<i style="background: ${clusterColors[cluster]}; width: 10px; height: 10px; display: inline-block;"></i> Cluster ${cluster}<br>`;
     }
     return div;
 };

 // Add the legend to the map
 legend.addTo(myMap);

    for (let i = 0; i <  response.length; i++) {
                    // retrieve coordinates from json file and store them in variables
                    let latitude = response[i].coordinates.Latitude ;
                    let longitude = response[i].coordinates.Longitude ; 

                    // retrieve country name and immigration flow from json file and store them in variables

                    let flow_100k = response[i].flow_100k;
                    let country = response[i].country;
                    let flow = response[i].flow;
                    let cluster = response[i].cluster;

                    // create circle marker  with 
                    // marker's size proportional to the magnitude (x10000 for visibility)
                    // color follows of the depth 
                    L.circle([longitude, latitude], {
                                fillOpacity: 0.75,
                                //color: "green", 
                                // fillColor: colorscale(depth),
                                fillColor: clusterColors[cluster] || "gray", // Default gray if undefined
                                // Setting our circle's radius to equal the output of our markerSize() function:
                                // This will make our marker's size proportionate to its population.
                                radius: flow_100k > 1000 ? flow_100k * 25 : flow_100k *1500,  // Example condition
                                stroke: false,

                                })
    
    // popups that provide additional information : country, flow
    .bindPopup(`<h3>Country : ${country}</h3><hr><h4>Flow : ${flow}</h4><hr><hr><h4>Flow_100k : ${flow_100k}</h4><hr>`)
    .addTo(myMap)  ;

    }
});
