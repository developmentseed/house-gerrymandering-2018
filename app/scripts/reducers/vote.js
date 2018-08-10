'use strict';
import { get } from 'object-path';
import { feature as toGeojson, merge } from 'topojson';
const raw = require('../static/tl_2016_us_cd115-quantized-topo.json');
const districts = toGeojson(raw, raw.objects.districts).features;

// TODO: remove this and integrate actual data
districts.forEach(d => {
  d.properties.threshold = 35 + Math.random() * 30;
});

const initialNationalVote = 50;
const initialGeoState = Object.assign({
  districts,
  focused: null,
  selected: null
}, getNatlCount(districts, initialNationalVote));

export function geo (state = initialGeoState, { type, next }) {
  switch (type) {
    case 'set_natl_vote':
      state = Object.assign({}, state, getNatlCount(state.districts, next.vote));
      break;
    case 'sync_mouse_location':
      // Only set new state on a new hovered district
      state = next.district && next.district !== get(state.focused, 'properties.id')
        ? Object.assign({}, state, {
          focused: findDistrict(state.districts, next.district)
        })
        : state;
      break;
    case 'sync_selected_state':
      state = Object.assign({}, state, getSelectedState(state.districts, next.districtId));
      break;
  }
  return state;
}

function findDistrict (districts, id) {
  for (let i = 0; i < districts.length; ++i) {
    if (districts[i].properties.id === id) {
      return Object.assign({}, districts[i]);
    }
  }
  return null;
}

function getStateDistricts (districts, id) {
  const district = findDistrict(districts, id);
  const { fips, stateFips } = district.properties;
  if (Number(fips) === 0) {
    return [district];
  } else {
    return districts.filter(d => d.properties.stateFips === stateFips);
  }
}

function getNatlCount (districts, vote) {
  const natlDemCount = districts.filter(d => d.properties.threshold > vote).length;
  const natlRepCount = districts.filter(d => d.properties.threshold < vote).length;
  return { natlDemCount, natlRepCount };
}

// Returns a geojson feature representing the state that the district is part of.
function getSelectedState (districts, districtId) {
  // a null value here will reset the map view to national
  if (!districtId) {
    return { selected: null };
  }
  const selected = getStateDistricts(districts, districtId);
  const idMap = new Map(selected.map(d => [d.properties.id, true]));
  const merged = merge(raw, raw.objects.districts.geometries.filter(d => idMap.has(d.properties.id)));
  return { selected: merged };
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
