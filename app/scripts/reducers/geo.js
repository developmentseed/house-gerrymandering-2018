'use strict';
import { get } from 'object-path';
import { feature as toGeojson, merge } from 'topojson';
import { fips, districtId } from '../util/format';
import { error } from '../util/log';
import { initialNationalVote } from './vote';

// Create a mapping of districts to their national analysis number.
// Apply this to the districts geojson properties object.
const nationalThresholds = require('../static/national-analysis.json');
const districtThresholds = {};
nationalThresholds.forEach(d => {
  let id = districtId(d.state, d.district);
  districtThresholds[id] = districtThresholds[id] || {};
  districtThresholds[id].national = 100 - d.demvote;
});

const raw = require('../static/us_cd115_updated_pa-quantized-topo.json');
const districts = toGeojson(raw, raw.objects.districts).features;

districts.forEach(d => {
  const { id } = d.properties;
  const threshold = districtThresholds[id];
  if (!threshold) {
    error('No threshold found for district with id ' + id);
  } else {
    d.properties.threshold = threshold.national;
  }
});

const initialGeoState = {
  districts,
  focused: null,
  selected: null,
  selectedIdMap: null,
  selectedStateFips: null
};

export function geo (state = initialGeoState, { type, next }) {
  switch (type) {
    case 'sync_mouse_location':
      // Only set new state on a new hovered district
      state = next.district && next.district !== get(state.focused, 'properties.id')
        ? Object.assign({}, state, {
          focused: findDistrict(state.districts, next.district)
        })
        : state;
      break;
    case 'sync_selected_state':
      state = Object.assign({}, state, getSelectedState(state.districts, next.stateId));
      state.selectedStateFips = next.stateId || null;
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

// Returns a geojson feature representing the selected state
function getSelectedState (districts, stateId) {
  // a null value here will reset the map view to national
  if (!stateId) {
    return { selected: null, selectedIdMap: null };
  }
  const selected = districts.filter(d => d.properties.stateFips === stateId);
  const idMap = new Map(selected.map(d => [d.properties.id, true]));
  const merged = merge(raw, raw.objects.districts.geometries.filter(d => idMap.has(d.properties.id)));
  return { selected: merged, selectedIdMap: idMap };
}

const initialVoteState = { votes: { natl: initialNationalVote } };
const initialNatlSummary = getNatlCount(initialVoteState.votes);

// {
//  votes: { natl: Number, [stateFips]: Number, ... },
//  natlDemCount: Number,
//  natlRepCount: Number,
//  stateAnalysis: {}
//  }
const initialSummaryState = Object.assign({
  stateAnalysis: {}
}, initialVoteState, initialNatlSummary);

// Note, this reducer is functionally very similar to the one in `./vote.js`.
// The reason for duplication is we need access to the current vote state
// to determine summary numbers, as state-specific scenarios override national.
// For organizational reasons, it's easier to duplicate them.
export function summary (state = initialSummaryState, { type, next, results }) {
  let votes;
  switch (type) {
    case 'get_state_analysis_success':
      let stateAnalysis = parseStateAnalysis(results);
      state = Object.assign({}, state, { stateAnalysis }, getNatlCount(state.votes, stateAnalysis));
      break;
    case 'set_vote':
      let loc = next.stateFips || 'natl';
      votes = Object.assign({}, state.votes, { [loc]: next.vote });
      state = Object.assign({}, state, getNatlCount(votes, state.stateAnalysis));
      state.votes = votes;
      break;
    case 'sync_vote_state':
      votes = Object.assign({}, state.votes, next.voteState);
      state = Object.assign({}, state, getNatlCount(votes, state.stateAnalysis));
      state.votes = votes;
      break;
  }
  return state;
}

// Normalize the state-level raw data.
// add threshold, ie 100 - demvote
// normalize district, ie "1" -> "01"
// Create a dual-layer map object, ie:
// [stateFips]: {
//  [districtFips]: {},
// }
function parseStateAnalysis (states) {
  for (let state in states) {
    let stateMap = {};
    states[state].forEach(d => {
      let district = fips(d.district);
      stateMap[district] = 100 - parseFloat(d.demvote);
    });
    states[state] = stateMap;
  }
  return states;
}

function getNatlCount (vote, stateAnalysis) {
  let natlDemCount = 0;
  let natlRepCount = 0;
  for (let i = 0; i < districts.length; ++i) {
    let { stateFips, fips } = districts[i].properties;
    let stateScenario = vote[stateFips];
    let scenario = stateScenario || vote.natl;
    let threshold = stateScenario ? get(stateAnalysis, [stateFips, fips])
      : districts[i].properties.threshold;
    if (threshold > scenario) {
      natlDemCount += 1;
    } else if (threshold < scenario) {
      natlRepCount += 1;
    }
  }
  return { natlDemCount, natlRepCount };
}
