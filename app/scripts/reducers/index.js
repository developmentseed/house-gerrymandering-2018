'use strict';
import { combineReducers } from 'redux';
import { feature as toGeojson } from 'topojson';
const raw = require('../static/tl_2016_us_cd115-quantized-topo.json');
const districts = toGeojson(raw, raw.objects.districts).features;

// TODO: remove this and integrate actual data
districts.forEach(d => d.properties.threshold = 50 + Math.random() * 15);

const initialGeoState = { districts };
function geo (state = initialGeoState, action) {
  return state;
}

export default combineReducers({ geo });
