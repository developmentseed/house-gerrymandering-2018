'use strict';
import { fips, stateFipsFromAbbrev } from '../util/format';
const initialState = {};

function supplementary (state = initialState, { type, results }) {
  if (type === 'get_supplementary_analysis_success') {
    state = processState(state, results);
  }
  return state;
}

function processState (current, results) {
  const out = {};
  for (let i = 0; i < results.length; ++i) {
    let d = results[i];
    let stateFips = stateFipsFromAbbrev(d[0]);
    let districtFips = d[1];
    // Single-district states aren't numbered, ie Alaska, Montana, etc.
    if (isNaN(districtFips)) {
      districtFips = '00';
    } else {
      districtFips = fips(districtFips);
    }
    const id = `${stateFips}${districtFips}`;
    out[id] = {
      fivethirtyeight: d[3] === '>99%' ? d[3] : parseFloat(d[3]).toFixed(1) + '%',
      sabato: d[4]
    };
  }
  return Object.assign({}, current, out);
}

export default supplementary;
