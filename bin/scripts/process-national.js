#!/usr/bin/env node
'use strict';
const csv = require('csv');
const stateToFips = require('../../app/scripts/static/state-to-fips.json');

function matchStateName (name) {
  for (let s in stateToFips) {
    if (name.slice(0, s.length) === s) {
      return s;
    }
  }
  return false;
}

process.stdin.pipe(csv.parse())
.pipe(csv.transform(row => {
  // header row
  if (row[0] === 'demvote') {
    row[2] = 'state';
    row[3] = 'district';
    return row;
  }

  // dem vote threshold
  row[0] = parseFloat(row[0]);
  let name = row[2].toLowerCase();
  let stateName = matchStateName(name);
  let stateFips = stateToFips[stateName];
  if (!stateFips) {
    console.log('No state name found for', name);
  }
  row[2] = stateFips;
  row[3] = name.slice(stateName.length, name.length);
  return row;
}))
.pipe(csv.stringify())
.pipe(process.stdout);
