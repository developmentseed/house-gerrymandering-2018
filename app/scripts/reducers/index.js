'use strict';
import { combineReducers } from 'redux';
import { feature as toGeojson } from 'topojson';
const raw = require('../static/tl_2016_us_cd115-quantized-topo.json');
const districts = toGeojson(raw, raw.objects.districts).features;

// TODO: remove this and integrate actual data
districts.forEach(d => d.properties.threshold = 35 + Math.random() * 30);

const initialGeoState = { districts };
function geo (state = initialGeoState, action) {
  return state;
}

const initialVoteState = {
  natl: 50
}
function vote (state = initialVoteState, { type, next }) {
  switch (type) {
    case 'SET_NATL_VOTE':
      state = Object.assign({}, state, { natl: next.vote });
      break;
  }
  return state;
}

export default combineReducers({ geo, vote });
