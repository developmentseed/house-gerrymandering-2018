'use strict';
import qs from 'qs';
import { get } from 'object-path';
import { error } from './log';

const fipsToState = require('../static/fips-to-state.json');
const fipsToStateAbbrev = require('../static/fips-to-state-abbrev.json');

export const na = '--';
export function pct (n) {
  if (isNaN(n)) {
    return na;
  }
  return n + '%';
}

export function fips (stateOrDistrictFips) {
  return +stateOrDistrictFips >= 10 ? stateOrDistrictFips : `0${+stateOrDistrictFips}`;
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
  let s = fips(stateFips);
  let d = fips(districtFips);
  return `${s}${d}`;
}

export function stateId (districtId) {
  let d = districtId.toString();
  if (isNaN(districtId) || (d.length !== 4 && d.length !== 3)) {
    error('Malformed district id ' + districtId);
    return '00';
  }
  // Normalize district IDs lacking a leading '0'.
  if (d.length === 3) {
    d = '0' + d;
  }
  return districtId.slice(0, 2);
}

export function stateNameFromFips (stateFips) {
  let stateName = get(fipsToState, stateFips.toString());
  if (!stateName) {
    error('Malformed state fips ' + stateFips);
    return na;
  }
  return stateName;
}

export function stateAbbrevFromFips (stateFips) {
  let stateAbbrev = get(fipsToStateAbbrev, stateFips.toString());
  if (!stateAbbrev) {
    error('Malformed state fips ' + stateFips);
    return na;
  }
  return stateAbbrev;
}

export function isStateFips (id) {
  return id === 'natl' || stateNameFromFips(id) !== na;
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

export function slug (s) {
  return s.toString().toLowerCase().split(' ').join('-');
}

export function searchUrl (voteObj) {
  let search = {};
  for (let k in voteObj) {
    if (k === 'natl' && +voteObj[k] === 50) {
      continue;
    }
    search[k] = voteObj[k];
  }
  return Object.keys(search).length ? '?' + qs.stringify(search) : '';
}
