from flask import Flask
import geopandas as gp
import pandas as pd

app = Flask(__name__)

def get_tract_name(tract):
  return {
    "id": tract["id"],
    "name": tract["properties"]["NAMELSAD"],
    "lat": tract["properties"]["INTPTLAT"],
    "long": tract["properties"]["INTPTLON"],
  }

@app.route("/tracts")
def list_tracts():
  tracts = gp.read_file("./tracts.gpkg")
  return list(map(get_tract_name, tracts.iterfeatures()))


@app.route("/tracts/<int:pk>")
def get_tract(pk):
  tracts = gp.read_file("./tracts.gpkg")
  tract = tracts[pk:pk+1]
  centroid = tract.to_crs('+proj=cea').centroid.to_crs(tract.crs)

  return {
    "id": pk,
    "name": tract['NAMELSAD'].item(),
    "state_fips": tract['STATEFP'].item(),
    "county_fips": tract['COUNTYFP'].item(),
    "area_land": tract['ALAND'].item(),
    "area_water": tract['AWATER'].item(),
    "center": [centroid.y.item(), centroid.x.item()],
    "area": tract.to_crs('+proj=cea').geometry.area.item(),
    "coords": [[point[1], point[0]] for polygon in tract.geometry.apply(lambda p: list(p.exterior.coords)) for point in polygon]
  }
