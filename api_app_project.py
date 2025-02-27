# Import the dependencies.

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

import numpy as np

from datetime import timedelta, datetime
from dateutil.relativedelta import relativedelta

from flask import Flask, jsonify
from flask_cors import CORS
    
from collections import defaultdict  # to generate dictionary 'precipitation

################################################
# Database Setup
################################################
engine = create_engine("sqlite:///db_canada_immigration.sqlite")


# reflect an existing database into a new model
Base = automap_base()
Base.prepare(autoload_with=engine)

# # reflect the tables
Base.classes.keys()

#to check
print(Base.classes.keys())

# Save references to each table
countries = Base.classes.countries
immigration = Base.classes.immigration
macrodata = Base.classes.macrodata
cpi = Base.classes.cpi
gpi = Base.classes.gpi
clusters = Base.classes.clusters
indicators_clusters = Base.classes.indicators_clusters

# Create our session (link) from Python to the DB
session = Session(engine)

#to check
print(session.query(countries).first().__dict__)
print(session.query(immigration).first().__dict__)
print(session.query(macrodata).first().__dict__)
print(session.query(cpi).first().__dict__)
print(session.query(gpi).first().__dict__)
print(session.query(clusters).first().__dict__)
print(session.query(indicators_clusters).first().__dict__)


#################################################
# Flask Setup
#################################################
app = Flask(__name__)
CORS(app)
#################################################
# Flask Routes
#################################################

## welcome route presentation of the 6 routes available

@app.route("/")

def welcome():
    """List all available api routes."""
    
    return (
        f"This is your API to access to the analysis of 'immigration as Permanent resident to Canada motivations'  <br/>"
        f"  <br/>"
        f"Available Routes:<br/>"
        f"  <br/>"
        f"List of the countries available in IRCC data    : /api/proj4_v0.1/countries_list_ircc <br/>"
        f"  <br/>"
        f"List of the countries coutries with additional information : region, cluster, lat, lon    : /api/proj4_v0.1/countries_data <br/>"
        f"  <br/>"
        f"List of the indicators available       : /api/v0.1/Macro_economic_indicators <br/>"
        f"  <br/>"
        f"immigation_flow_per_year_between 2015 and 2024       : /api/proj4_v0.1/immigation_flow_per_year_between/<year_start>/<year_end> <br/>"
        f"  <br/>"
        f"immigration_statistics_per_country (add the country code iso3 example : AGO for ANGLOA )       : /api/proj4_v0.1/immigration_statistics_per_country/country_select"
        f"  <br/>"
        f"Main indicators per cluster       : /api/proj4_v0.1/immigration_statistics_per_country/indicator_cluster"


        )

# route countries : returns the list of available countries in the immigration statistics 

@app.route("/api/proj4_v0.1/countries_list_ircc")
def countries_list():

    # Create our session (link) from Python to the DB
    session = Session(engine)

    # query 'station' table
    results = session.query(immigration.country).distinct().order_by(immigration.country).all()
         
    # close the session               
    session.close()

    countries_list = []
    for country in results:
            # countries_dict = {}
            # countries['Country_name'] = country[0]
            # countries_list.append(countries)
            countries_list.append(country[0])

    return jsonify(countries_list)   

# # # # route Countries data : returns all the countries with additional information : region, cluster, lat, lon

@app.route("/api/proj4_v0.1/countries_data")
def immigation_flow_per_country():

    # Create our session (link) from Python to the DB
    session = Session(engine)


    # grop by table ,               
    result = session.query(countries.country, countries.region, countries.longitude,countries.latitude, clusters.cluster)\
                    .join(clusters, countries.country == clusters.country) \
                    .order_by(countries.country) \
                    .all()

    # close session
    session.close()        
    
    #create a list to be jsonified, by loopong through the result above

    countries_data_list = []
    for country, region, lat, lon, cluster in result:
        country_data_dict = {}
        country_data_dict['country'] = country
        country_data_dict['region'] = region
        country_data_dict['cluster'] = cluster
        country_data_dict['coordinates'] = {
                                    'Longitude' : lon , 
                                    'Latitude'  : lat 
                                    }


        countries_data_list.append(country_data_dict)

    return jsonify(countries_data_list)
    


# # route Indicators : returns all indicators 

@app.route("/api/proj4_v0.1/indicators_all")
def Macro_economic_indicators():

    # Create our session (link) from Python to the DB
    session = Session(engine)

    # query 'station' table
    results = session.query(macrodata.indicator).distinct().order_by(macrodata.indicator).all()
         
    # close the session               
    session.close()

    indicators_list = []
    for indicator in results:
            # countries = {}
            # countries['Country_name'] = country[0]
            # countries_list.append(countries)
            indicators_list.append(indicator[0])

   
    return jsonify(indicators_list)


# route cluster_indicator : returns the list of main indicators for each cluster 

@app.route("/api/proj4_v0.1/indicators_clusters")
def indicators_per_clusters():

    # Create our session (link) from Python to the DB
    session = Session(engine)

    # query 'station' table
    results = session.query(indicators_clusters.cluster, indicators_clusters.indicator).order_by(indicators_clusters.cluster).all()
         
    # close the session               
    session.close()

    indicators_clusters_list = []
    for cluster, indicator in results:
        indicators_clusters_dict = {}
        indicators_clusters_dict['cluster'] = cluster
        indicators_clusters_dict['indicator'] = indicator

        indicators_clusters_list.append(indicators_clusters_dict)

   
    return jsonify(indicators_clusters_list)


# # route immigration_yearly : returns the cumulated immigration flow per year - between to year (2015 and 2024)

@app.route("/api/proj4_v0.1/immigation_flow_per_year_between/<year_start>/<year_end>")
def immigation_flow_per_year_between(year_start, year_end):

    # Create our session (link) from Python to the DB
    session = Session(engine)

    # query measurment table for the last date in the DB

    # set a condition to be sure that dates are consistant

    if year_end >= year_start :

        # Create a subquery for macrodata
        macrodata_subquery = session.query(
                                            macrodata.country.label("country"),
                                            func.sum(macrodata.value).label("flow_100k")) \
        .filter(macrodata.year >= year_start)\
        .filter(macrodata.year <= year_end)\
        .filter(macrodata.indicator == 'immigration_100k') \
        .group_by(macrodata.country).subquery()

        # grop by table measurment, and calculate TMIN, TAVG, TMAX) for each date after filter of dates              
        result = session.query(
                                immigration.country, 
                                func.sum(immigration.immigration_flow).label("flow"),\
                                macrodata_subquery.c.flow_100k) \
                        .filter(immigration.year >= year_start)\
                        .filter(immigration.year <= year_end)\
                        .group_by(immigration.country) \
                        .order_by(func.sum(immigration.immigration_flow).desc()) \
                        .join(
                               macrodata_subquery, immigration.country == macrodata_subquery.c.country)\
                        .all()

        # close session
        session.close()        
        
        #create a list to be jsonified, by loopong through the result above
 
        flow_by_country_list = []
        for country, sumflow, sumflow_k in result:
            flow_dict = {}
            flow_dict['description'] = f'Immigration flows for the period between {year_start} and {year_end}'
            flow_dict['country'] = country
            flow_dict['flow'] = sumflow
            flow_dict['flow_100k'] = sumflow_k


            flow_by_country_list.append(flow_dict)

        return jsonify(flow_by_country_list)
    
    else : 
        # error message if dates are not consistant
        return 'NEIN!!! DAS IST NICH GUT !!! <br/> \
            <br/> \
            नहीं!!! यह अच्छा नहीं है <br/> \
            <br/> \
            NO!!! ESO NO ES BUENO <br/> \
            <br/> \
            Year_end must be later than Year_start. <br/> \
            In other words, you must enter a "year_end" that is after the "year_start".' 




@app.route("/api/proj4_v0.1/immigration_statistics_per_country/<country_select>")
def immigration_statistics_per_country(country_select):
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Create a subquery for macrodata
    macrodata_subquery = session.query(
        macrodata.iso3Code.label("macro_iso3Code"),
        macrodata.indicator.label("indicator"),
        func.avg(macrodata.value).label("avg_value")
    ).group_by(macrodata.iso3Code, macrodata.indicator).subquery()

    # Create a subquery for immigration data
    immigration_subquery = session.query(
        immigration.country.label("country"),
        func.sum(immigration.immigration_flow).label("imm_flow")
    ).group_by(immigration.country).subquery()

    # Main query
    result = session.query(
        immigration_subquery.c.country,
        immigration_subquery.c.imm_flow,
        countries.iso3Code.label("country_iso3Code"),
        countries.region,
        countries.latitude,
        countries.longitude,
        macrodata_subquery.c.indicator,
        macrodata_subquery.c.avg_value
    ).join(
        countries, immigration_subquery.c.country == countries.country
    ).join(
        macrodata_subquery, countries.iso3Code == macrodata_subquery.c.macro_iso3Code
    ).filter(countries.iso3Code == country_select
         
    ).all()

    # Close session
    session.close()

    # Create a list to be JSONified
    flow_by_country_list = []
    for country, imm_flow, country_iso3Code, region, lat, lon, indicator, avg_value in result:
        flow_dict = {
            "country": country,
            "region": region,
            "flow": imm_flow,
            "code": country_iso3Code,
            "avg_value": avg_value,
            "indicator": indicator,
            "coordinates": {
                "Longitude": lon,
                "Latitude": lat
            }
        }
        flow_by_country_list.append(flow_dict)

    return jsonify(flow_by_country_list)

 

# @app.route("/api/proj4_v0.1/immigration_statistics")
# def immigration_statistics():
#     # Create our session (link) from Python to the DB
#     session = Session(engine)

#     # Create a subquery for macrodata
#     macrodata_subquery = session.query(
#         macrodata.iso3Code.label("macro_iso3Code"),
#         macrodata.indicator.label("indicator"),
#         func.avg(macrodata.value).label("avg_value")
#         ).group_by(macrodata.iso3Code, macrodata.indicator).subquery()

#     # Create a subquery for immigration data
#     immigration_subquery = session.query(
#         immigration.country.label("country"),
#         func.sum(immigration.immigration_flow).label("imm_flow")
#     ).group_by(immigration.country).subquery()

#     # Main query
#     result = session.query(
#         immigration_subquery.c.country,
#         immigration_subquery.c.imm_flow,
#         countries.iso3Code.label("country_iso3Code"),
#         countries.region,
#         countries.latitude,
#         countries.longitude,
#         macrodata_subquery.c.indicator,
#         macrodata_subquery.c.avg_value
#     ).join(
#         countries, immigration_subquery.c.country == countries.country
#     ).join(
#         macrodata_subquery, countries.iso3Code == macrodata_subquery.c.macro_iso3Code
#     ).all()
   

   
    

if __name__ == '__main__':
    app.run(debug=True)