# P4_Group4_BoxOfficePerformance
Project 4 output for Group 4 : Felipe Suarez, Sunilduth Baichoo, Nazim Bendjaballah



3) DATA COLLECTION AND TRANSFORMATION
use jupyter notebook : Data_collection.ipynb
 
Dependencies
    import pandas as pd
    import pathlib as path
    import requests
    import json
    from pprint import pprint
    import numpy as np
    from io import StringIO

    # to read the ZIP file
        import requests
        import zipfile
        import io

    3.1) data collection

            3.1.1) for immigration data 
                source : Immigration, refugees and citizenship of Canada
                type : CSV file
                Access : https://www.ircc.canada.ca/opendata-donneesouvertes/data/ODP-PR-Citz.csv

            3.1.2) for macro-economic data 
                source : World bank
                type : API
                Access : https://api.worldbank.org/v2/country/XXX/indicator/XX.XXX.XXX.XX?date=XXXX:XXXX&format=json

                3.1.2.1) countries
                countries are selected from immigration list merged with countries to extract the iso3code Example Canada = CAN
                3.1.2.2) indicators
                you can add any indicator a the list . this list will be used to loop

            3.1.3) We need an intermediate data to link the country name (in immigration data) and country code (used by the API)
                this link is provided by a datafram countries 
                source : World bank
                type : API
                Access : https://api.worldbank.org/v2/country?format=json

            3.1.4) Extract Corruption perception indicator
                source : https://images.transparencycdn.org/images/CPI2023_FullDataSet.zip
                from webpage : https://www.transparency.org/en/cpi/2023/media-kit
                extract sheet : CPI 2023
                data source extract a zip file => xls file

            3.1.5) Extract Global Peace Index data
                source Wikidepia : https://en.wikipedia.org/wiki/Global_Peace_Index
                the full data and the report is available as PDF from the Economics And Peace organization
                link : https://www.economicsandpeace.org/wp-content/uploads/2023/09/GPI-2023-Web.pdf

    3.2) data cleaning and transformation

            3.2.1) countries data
                - drop rows with nan representing regions
                - change type of data

            3.2.2) immigration data
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

            3.2.3) macroeconomic data
                - retrieve countries list from immigration
                
                - replace Nan
                        - pivot the DF 
                        - replace nan of 1st column
                        - replcae nan of other columns
                        = unpivot (melt) 


                : drop and rename columns after merge
                - change data type

            3.2.4) Corruption perception indicator
            - drop columns
            - rename columns

            3.2.5) Global Peace Index data
            - drop columns
            - rename columns
            - replace country name : the names used in the 2 datasets do not match
                => identify the mismatch and manually create a mapping dictionary 
                =>  replace 21 countries to be in line with World bank

    3.3) output
        - csv countries_UN_referential: Countries list United Nations referential 
        - csv immigrants_by_country_monthly: immigration by country and by month from 2015 to 2024
        - csv macro_economic_data: selected indicators for each country and by year from 2015 to 2024
        - csv Global_Peace_Index : data for this indicator for 2023
        - csv corruption_perception_index : data for this indicator for 2023