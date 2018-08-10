'use strict';
import { get } from 'object-path';

const fipsToState = require('../static/fipsToState.json');

export const na = '--';
export function pct (n) {
  if (isNaN(n)) {
    return na;
  }
  return n + '%';
}

export function districtName (stateFips, districtFips) {
  const state = get(fipsToState, stateFips);
  if (!state) {
    return na;
  }
  const district = Number(districtFips);
  return district ? `${state} - ${district}` : state;
}
