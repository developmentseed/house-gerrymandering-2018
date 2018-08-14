'use strict';
import { error } from '../util/log';
const stateToFips = require('../static/state-to-fips.json');

const initialState = {
  loading: false,
  districts: null
};

function historical (state = initialState, next) {
  switch (next.type) {
    case 'get_historical_inflight':
      return Object.assign({}, state, { loading: true });
    case 'get_historical_failed':
      return Object.assign({}, state, { error: next.error });
    case 'get_historical_success':
      return Object.assign({}, state, parseHistoricalResults(next.results));
  }
  return state;
}

function parseHistoricalResults (results) {
  const next = {};
  for (let i = 0; i < results.length; ++i) {
    let { state, district } = results[i];
    let stateFips = stateToFips[state.toLowerCase()];
    if (!stateFips) {
      error('State fips not found for', results[i].state);
    }
    let districtFips = +district >= 10 ? district : '0' + district;
    let id = `${stateFips}${districtFips}`;
    next[id] = results[i];
  }
  return next;
}

export default historical;
