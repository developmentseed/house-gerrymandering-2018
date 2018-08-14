'use strict';
import { get } from 'object-path';

const fipsToState = require('../static/fips-to-state.json');

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

export function districtId (stateFips, districtFips) {
  let s = +stateFips >= 10 ? stateFips : `0${+stateFips}`;
  let d = +districtFips >= 10 ? districtFips : `0${+districtFips}`;
  return `${s}${d}`;
}
