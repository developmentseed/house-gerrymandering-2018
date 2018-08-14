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

export function getHistoricalData () {
  return (dispatch) => {
    dispatch({ type: 'get_historical_inflight' });
    csv('static/historical-results.csv').then(results => {
      dispatch({ type: 'get_historical_success', results });
    }).catch(e => {
      error('Loading historical data failed:', e.message);
      dispatch({ type: 'get_historical_failed', error: e.message });
    });
  };
}
