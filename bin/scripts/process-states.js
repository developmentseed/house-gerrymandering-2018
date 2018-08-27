#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const { csvParse } = require('d3');

const stateToFips = require('../../app/scripts/static/state-to-fips.json');

const stateFilePath = path.join(__dirname, '../in/states/');

function csvname (state) {
  let s = state.split(' ').join('-');
  return s + '.csv';
}

const states = {};
for (let state in stateToFips) {
  let filename = path.join(stateFilePath, csvname(state));
  try {
    fs.statSync(filename);
  } catch (e) {
    console.log('No data for', state);
    continue
  }
  let csv = fs.readFileSync(filename).toString();
  let json = csvParse(csv);
  states[stateToFips[state]] = json;
}

fs.writeFileSync(path.join(__dirname, '../../app/static/state-analysis.json'), JSON.stringify(states));

console.log('\n\nDone!');
