# P4_Group4_BoxOfficePerformance
Project 4 output for Group 4 : Felipe Suarez, Sunilduth Baichoo, Nazim Bendjaballah
# Immigration Trends Analysis and Prediction

This repository contains a machine learning project that analyzes immigration data for 203 countries (2015–2023) using various modeling techniques. The project includes baseline models (Linear Regression), advanced models (Random Forest), and cluster-specific models after segmenting the data using KMeans. The final models are deployed via a Flask API with a web interface for real-time predictions.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
  - [Data Analysis & Model Training](#data-analysis--model-training)
  - [Model Deployment via Flask API](#model-deployment-via-flask-api)
  - [Web Interface](#web-interface)
- [Results](#results)
- [Future Improvements](#future-improvements)
- [License](#license)

## Overview

The main objectives of this project are:
- **Data Analysis:**  
  Analyze immigration data (target: immigration per 100K persons) with 49 socio-economic, demographic, and environmental features.
  
- **Baseline & Advanced Modeling:**  
  - **Baseline:** Linear Regression model to establish initial benchmarks.
  - **Improved Model:** Random Forest Regression with hyperparameter tuning (using GridSearchCV) that yielded improved performance.
  
- **Feature Selection:**  
  The top 5 features were identified based on model importance:
  - `government consumption exp (% of GDP)`
  - `Unemployment intermediate education`
  - `Birth rate, crude (per 1,000 people)`
  - `doing business score`
  - `Population living in slums (% of urban population)`

- **Clustering:**  
  KMeans clustering was applied to group countries with similar characteristics into 4 clusters. For each cluster, both LR and RF models were developed using the cluster’s respective top 5 features for more tailored predictions.

- **Deployment:**  
  The final models were serialized using `joblib` and deployed via a Flask API. A web interface using HTML/JavaScript enables real-time predictions.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/immigration-prediction.git
   cd immigration-prediction

2. **Create a Virtual Environment and Install Dependencies:**

python -m venv venv <br>
source venv/bin/activate       # On Windows use `venv\Scripts\activate` <br>
pip install -r requirements.txt

3. **Install Additional Dependencies (if needed):**

Ensure that you have the following libraries installed:

- pandas
- numpy
- scikit-learn
- flask
- flask-cors
- joblib

## Usage
### Data Analysis & Model Training
- Open the notebooks in the notebooks/ folder with Jupyter Notebook or JupyterLab to explore:

    - Data cleaning and exploratory data analysis.
    - Baseline modeling with Linear Regression.
    - Random Forest modeling with GridSearchCV for hyperparameter tuning.
    - Clustering (KMeans) and building cluster-specific models.
- After training, the models are saved into the models/ directory for deployment.


