#!/usr/bin/env node
'use strict';
const path = require('path');
const fs = require('fs');
const request = require('request-promise');

let config;
try {
  config = require(path.resolve(__dirname, '../../config.js'));
} catch (e) {
  console.log('No local config found, using environment variable');
}

let key;
if (config) {
  key = config.sheetsApiKey;
} else {
  key = process.env.SHEETS_API_KEY;
}

if (!key) {
  throw new Error('No API key found');
}

const sheetsApi = 'https://sheets.googleapis.com/v4/spreadsheets/1SRcGEabn9mNRQw4eR3eg1lv6FFkkCt7UlFFetowGfkQ/values/Sheet1!A1:D437?key=' + key;

query(sheetsApi);

async function query (url) {
  const results = await request(url);
  const d = JSON.parse(results);
  const out = d.values.map(d => {
    let district = d[0].split('-');
    if (district.length !== 2) {
      return null;
    }
    let result = [
      district[0],
      district[1],
      d[1],
      d[2],
      d[3]
    ];
    return result;
  }).filter(Boolean);
  fs.writeFileSync(path.resolve(__dirname, '../../app/static/supplementary-analysis.json'), JSON.stringify(out));
}
