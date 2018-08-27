#!/bin/bash

WORK=./bin/data
BIN=./node_modules/.bin
FILE=tl_2016_us_cd115

echo "Converting $WORK/$FILE/$FILE.shp to geojson"
#ogr2ogr -f GeoJSON -t_srs crs:84 \
#  $WORK/$FILE.json \
#  $WORK/us-districts-shapefile-cd115-2016/$FILE.shp

echo "Converting to ndjson"
#cat $WORK/$FILE.json | jq -c "." | $BIN/ndjson-split 'd.features' > $WORK/$FILE-nd.json

echo "Filtering properties"
cat $WORK/$FILE-nd.json \
  | $BIN/ndjson-map 'd.properties = { stateFips: d.properties.STATEFP, fips: d.properties.CD115FP, id: d.properties.GEOID }, d' \
  | $BIN/ndjson-filter '+d.properties.stateFips <= 56' \
  > $WORK/$FILE-filtered-nd.json

echo "Converting to topojson"
./node_modules/.bin/geo2topo -n districts=$WORK/$FILE-filtered-nd.json > $WORK/$FILE-topo.json
echo "Simplifying and quantizing"
$BIN/toposimplify -S 0.02 -f < $WORK/$FILE-topo.json > $WORK/$FILE-simple-topo.json
$BIN/topoquantize 1e4 < $WORK/$FILE-simple-topo.json > $WORK/$FILE-quantized-topo.json
echo "Creating a reference geojson"
$BIN/topo2geo districts=$WORK/$FILE-geo.json < $WORK/$FILE-quantized-topo.json
echo "Done!"
ls -lah $WORK
