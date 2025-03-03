from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
# Allow all origins explicitly
CORS(app, resources={r"/*": {"origins": "*"}})

# Load the pre-trained model
model = joblib.load('Model_pkl/rf_all_countries_top5_features.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    # Get JSON payload from the request
    data = request.get_json(force=True)
    
    # Expecting the JSON payload to have a "data" key with a list of feature values.
    feature_values = data.get('data')
    if feature_values is None:
        return jsonify({'error': 'No data provided. Please include "data" in your JSON payload.'}), 400

    try:
        # Convert the input data to a numpy array and reshape to a 2D array (one sample, multiple features)
        features_array = np.array(feature_values).reshape(1, -1)
        
        # Make prediction using the loaded model
        prediction = model.predict(features_array)
        
        # Return the prediction as JSON (convert NumPy value to native Python float)
        return jsonify({'prediction': float(prediction[0])})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run the Flask app on port 5001 (adjust host and port as needed)
    app.run(host='0.0.0.0', port=5001, debug=True)
