'use strict';
import { csv } from 'd3';
import { error } from './util/log';

export function setAppDimensions ({ width, height }) {
  return { type: 'set_app_dimensions', next: { width, height } };
}

export function syncMouseLocation (next) {
  return { type: 'sync_mouse_location', next };
}

export function syncSelectedState (districtId) {
  return { type: 'sync_selected_state', next: { districtId } };
}

export function setNatlVote (vote) {
  return { type: 'set_natl_vote', next: { vote } };
}

function getCsv (filename, actionName) {
  return (dispatch) => {
    dispatch({ type: actionName + '_inflight' });
    csv(`static/${filename}.csv`).then(results => {
      dispatch({ type: actionName + '_success', results });
    }).catch(e => {
      error('Loading data failed:', e.message);
      dispatch({ type: actionName + '_failed', error: e.message });
    });
  };
}

export function getHistoricalData () {
  return getCsv('historical-results', 'get_historical');
}

export function getStateThresholds () {
  return getCsv('state-thresholds', 'get_state_threshold');
}
