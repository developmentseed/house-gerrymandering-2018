'use strict';
import { feature as toGeojson } from 'topojson';
const raw = require('../static/tl_2016_us_cd115-quantized-topo.json');
const districts = toGeojson(raw, raw.objects.districts).features;

// TODO: remove this and integrate actual data
districts.forEach(d => {
  d.properties.threshold = 35 + Math.random() * 30;
});

const initialNationalVote = 50;
const initialGeoState = Object.assign({
  districts
}, getNatlCount(districts, initialNationalVote));

function getNatlCount (districts, vote) {
  const natlDemCount = districts.filter(d => d.properties.threshold > vote).length;
  const natlRepCount = districts.filter(d => d.properties.threshold < vote).length;
  return { natlDemCount, natlRepCount };
}

export function geo (state = initialGeoState, { type, next }) {
  switch (type) {
    case 'set_natl_vote':
      state = Object.assign({}, state, getNatlCount(state.districts, next.vote));
      break;
  }
  return state;
}

const initialVoteState = {
  natl: initialNationalVote
};

export function vote (state = initialVoteState, { type, next }) {
  switch (type) {
    case 'set_natl_vote':
      state = Object.assign({}, state, { natl: next.vote });
      break;
  }
  return state;
}
