# Project4_Group4_Immigration
Project 4 output for Group 4 : Felipe Suarez, Sunilduth Baichoo, Nazim Bendjaballah

1) Goal and Reasearch question
Analyze immigration trends to Canada and examine the correlation between 
the decision immigration to canada and different indicators (macroeconomic, social, and other).
49 indicators will be used and will be compared to the immigration flow to canada (ratio of immigrant for each 100K people of the origin country population)

    1.1) Reasearch question
        What are the indicators that motivate people to immigrate from their country ? (using canada as an example)

        - Analysis of Indicator Importance: 
        Which socio-economic, demographic, and macroeconomic factors, as identified through machine learning feature selection techniques, most strongly predict the decision to immigrate?

        - Clustering and Profile Identification: 
        Can unsupervised machine learning methods, such as clustering, uncover distinct immigrant profiles based on the identified indicators, and what motivational patterns emerge within these clusters?

        - Comparative Model Evaluation: 
        How do different supervised machine learning models compare in ranking the influence of key indicators on the likelihood of immigration?


    1.2) data sources
    Datasets : Below are the dataset sources that will be used
        Immigration data : IRCC (immigration, refugees and citizenship Canada)
        Macro economic and social Data : World Bank
        Other Indicators : Transparency international, Economic and peace 


2) repository structure
    
    Files in the main directory
        - api_app_project.py : you must run this server to get data
        - api_deployment_model.py : you must run this server to run the deployed ML modele
        - db_canada_immigration.sqlite
        - index.html : to run the front end

    Folders
        - Data_collection_ETL_DataB_creation : 4 notebooks for data collection, cleaning, transformation and database creation
        - Output : csv and xls files from data collection and transformation
        - Output_analysis : csv and xls files from different analysis
        - Other_cleaning_and tranformation : 2 files for ml clustering + 1 of linear regression via scipy.stats
        - deployment : 2 files for deployment app.js and deploy.html
        - ML_analysis : 3 notenooks for ML analysis and model development
        - Model_pkl : 3 machine learning models for deployment.
        - frontend : contain all the package for the html pages including the JS and CSS files + pkl files for modele deployment


3) ENVIRONMENTS & CODE PRESENTATION

    3.1) Environemnts 

        3.1.1) DATA COLLECTION, TRANSORMATION AND API

            3.1.1.1)
                import pandas as pd
                import pathlib as path
                import requests
                import json
                from pprint 
                import numpy as np
                from io import StringIO
                import zipfile
                import io


            3.1.1.2) DATA TRANSFORMATION and LOAD
                from scipy.stats 

            3.1.1.3) DATA BASE CREATION
                sqlalchemy 

            3.1.1.4) API
               from datetime import timedelta, datetime
                from dateutil.relativedelta 
                from flask           
                from collections


        3.1.2) Machine learning
            3.1.2.1) ML ANALYSIS AND MODELLING
                import matplotlib.pyplot as plt
                import seaborn as sns
                import sklearn
                import joblib

            3.1.2.2) CLUSTERING AND MODEL REFINEMENT
                import seaborn as sns
               import joblib

    
        3.1.3) Front end
            3.1.3.1) MODEL DEPLOYMENT


    3.2) CODE PRESENTATION

        3.2.1) DATA COLLECTION, TRANSFORMATION and API construction

            3.2.1.1) data collection
            use Data_collection_ETL_DataB_creation\Data_collection.ipynb

                - for immigration data 
                    source : Immigration, refugees and citizenship of Canada
                    type : CSV file
                    Access : https://www.ircc.canada.ca/opendata-donneesouvertes/data/ODP-PR-Citz.csv

                - for macro-economic data 
                    source : World bank
                    type : API
                    Access : https://api.worldbank.org/v2/country/XXX/indicator/XX.XXX.XXX.XX?date=XXXX:XXXX&format=json

                - countries
                countries are selected from immigration list merged with countries to extract the iso3code Example Canada = CAN
                    - indicators : you can add any indicator a the list . this list will be used to loop
                    - We need an intermediate data to link the country name (in immigration data) and country code (used by the API)
                        this link is provided by a datafram countries 
                        source : World bank
                        type : API
                        Access : https://api.worldbank.org/v2/country?format=json

                - Extract Corruption perception indicator
                    source : https://images.transparencycdn.org/images/CPI2023_FullDataSet.zip
                    from webpage : https://www.transparency.org/en/cpi/2023/media-kit
                    extract sheet : CPI 2023
                    data source extract a zip file => xls file

                - Extract Global Peace Index data
                    source Wikidepia : https://en.wikipedia.org/wiki/Global_Peace_Index
                    the full data and the report is available as PDF from the Economics And Peace organization
                    link : https://www.economicsandpeace.org/wp-content/uploads/2023/09/GPI-2023-Web.pdf

            3.2.2.2) data cleaning and transformation
            use Data_collection_ETL_DataB_creation\data_compiling.ipynb

                => countries data
                    - drop rows with nan representing regions
                    - change type of data

                => immigration data
                    - drop columns in frensh
                    - data type conversion
                    - replace empty values
                    - replace NAN values

                    - replace country name : the names used in the 2 datasets do not match
                        => identify the mismatch and manually create a mapping dictionary 
                        =>  replace 78 countries to be in line with World bank
                    - rename columns

                    - map months to get the numeric value (exp : mars : 3, apr : 4)
                    - reset index

                => macroeconomic data
                    - retrieve countries list from immigration
                    
                    - replace Nan
                            - pivot the DF 
                            - replace nan of 1st column
                            - replcae nan of other columns
                            = unpivot (melt) 


                    : drop and rename columns after merge
                    - change data type

                => Corruption perception indicator
                - drop columns
                - rename columns

                => Global Peace Index data
                - drop columns
                - rename columns
                - replace country name : the names used in the 2 datasets do not match
                    => identify the mismatch and manually create a mapping dictionary 
                    =>  replace 21 countries to be in line with World bank

            outputs
                - csv countries_UN_referential: Countries list United Nations referential 
                - csv immigrants_by_country_monthly: immigration by country and by month from 2015 to 2024
                - csv macro_economic_data: selected indicators for each country and by year from 2015 to 2024
                - csv Global_Peace_Index : data for this indicator for 2023
                - csv corruption_perception_index : data for this indicator for 2023
                - csv full_indicators_by_country_by_year_long
                - csv full_indicators_by_country_by_year
                - csv full_indicators_by_country

            3.2.1.3) creation database
            use Data_collection_ETL_DataB_creation\db_create.ipynb

            DATA BASE Type : sqlite
                Created by : SQLAlechemy
                Inputs : csv files, from Data cllection and trnaformation step
                declarative_base method
                Output  7 tables : countries, immigration, macrodata, pci, gpi, clusters, indicators_clusters
            
            3.2.1.4) creation API
                use api_app_project.py

                Use of Flask 
                use of “automap_base” method
                create a server : http://127.0.0.1:5000
                it describes the API’s possibilities

        3.2.2) machine learning
            3.2.2.1) ML_analysis and model selection using Supervised Learning
            use ML_analysis/ML_analysis_SL_all_countries_all_features.ipynb

            3.2.2.2) ML model fine-tuning using top 5 features 
            use ML_analysis/ML_analysis_SL_All_countries_Top5_features.ipynb

            3.2.2.3) Clustering of countries using unsupervised learning and developing models using Supervised learning
            use ML_analysis/ML_analysis_clustered_data_SL_Top5_features.ipynb


        3.2.3) Front end
            run api_app_project.py
            run api_deployment_model.py
            run the index.html
