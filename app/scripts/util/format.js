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

export function party (party) {
  let p = party.toLowerCase();
  if (p === 'd' || p === 'dem') {
    return 'D';
  } else if (p === 'r' || p === 'rep') {
    return 'R';
  } else {
    return na;
  }
}

export function year (year) {
  let y = parseInt(year, 10);
  if (y === 2012) {
    return '`12';
  } else if (y === 2014) {
    return '`14';
  } else if (y === 2016) {
    return '`16';
  } else if (y === 2018) {
    return '`18';
  }
  return na;
}

export function lean (threshold) {
  if (isNaN(threshold)) {
    return null;
  }
  let t = parseFloat(threshold);
  if (t >= 65) {
    return 'Leans heavily Democrat';
  } else if (t > 50) {
    return 'Leans Democrat';
  } else if (t > 45) {
    return 'Leans Republican';
  } else {
    return 'Leans heavily Republican';
  }
}
