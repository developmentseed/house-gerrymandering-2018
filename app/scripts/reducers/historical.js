'use strict';
import { error } from '../util/log';
import { districtId } from '../util/format';
const stateToFips = require('../static/state-to-fips.json');

const years = ['2012', '2014', '2016'].reverse();

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
  const districts = {};
  for (let i = 0; i < results.length; ++i) {
    let { state, district } = results[i];
    let stateFips = stateToFips[state.toLowerCase()];
    if (!stateFips) {
      error('State fips not found for', results[i].state);
    }
    let id = districtId(stateFips, district);
    districts[id] = years.map(y => ({
      year: y,
      winner: results[i][y + '_winner'],
      party: results[i][y + '_party'],
      vote: results[i][y + '_pct']
    }));
  }
  return { districts };
}

export default historical;
