// Define the input data for each sample.
// Note: Each array contains the values for the top 5 features in the same order as used during training:
// ['government consumption exp (% of GDP)', 'Unemployment intermediate education',
//  'Birth rate, crude (per 1,000 people)', 'doing business score',
//  'Population living in slums (% of urban population)']
const sampleData = {
  'algeria2020': [14.057, 2.706086545, 19.80315972, 44042091, 18.49155345], // actual = 6.175910221882971
  'belgium2023': [5.528, 0.468319, 23.77194415, 11787423, 383.0330557],      // actual = 4.665990182926327
  'colombia2020': [15.983, 1.701713279, 17.15883586, 50629997, 45.63316539],    // actual = 3.0219239396755246
  'mauritius2023': [5.571, 0.505408716, 13.84471963, 1261041, 632.2098147]       // actual = 91.19449724
};

// When the Predict button is clicked, send a POST request to the backend prediction API.
document.getElementById('predictButton').addEventListener('click', function() {
  // Get the selected country sample key from the dropdown
  const selectedCountry = document.getElementById('countrySelect').value;
  
  // Get the corresponding feature values
  const inputData = sampleData[selectedCountry];
  
  // Prepare the payload. We wrap the array in an object with a key (e.g., "data")
  const payload = {
    data: inputData
  };
  
  // Send the POST request using fetch.
  // Adjust the URL to match your backend endpoint.
  fetch('http://localhost:5001/predict', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.json();
  })
  .then(result => {
    // Display the prediction result on the webpage.
    document.getElementById('predictionResult').textContent = "Predicted Immigration: " + Number(result.prediction).toFixed(2) + " per 100K persons ";
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('predictionResult').textContent = "Error: " + error.message;
  });
});
