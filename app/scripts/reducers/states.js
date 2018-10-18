'use strict';
import { get } from 'object-path';
import { error } from '../util/log';
const stateToFips = require('../static/state-to-fips.json');

const initialStatesState = {
  thresholds: {}
};

export default function states (state = initialStatesState, { type, results }) {
  if (type === 'get_state_threshold_success') {
    return Object.assign({}, state, { thresholds: parseThresholds(results) });
  }
  return state;
}

function parseThresholds (results) {
  const thresholds = {};
  for (let i = 0; i < results.length; ++i) {
    let fips = get(stateToFips, results[i].state.toLowerCase());
    if (!fips) {
      error('No fips found for ' + results[i].state);
      continue;
    }
    thresholds[fips] = results[i];
  }
  return thresholds;
}
