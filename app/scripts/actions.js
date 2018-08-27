'use strict';
import { csv, json } from 'd3';
import { error } from './util/log';

export function setAppDimensions ({ width, height }) {
  return { type: 'set_app_dimensions', next: { width, height } };
}

export function syncMouseLocation (next) {
  return { type: 'sync_mouse_location', next };
}

export function syncSelectedState (stateId) {
  return { type: 'sync_selected_state', next: { stateId } };
}

export function setVote (stateFips, vote) {
  return { type: 'set_vote', next: { stateFips, vote } };
}

export function clearVote (stateFips) {
  return { type: 'clear_vote', next: { stateFips } };
}

export function syncVoteState (voteState) {
  return { type: 'sync_vote_state', next: { voteState } };
}

export function openShareModal (reactSyntheticEvent) {
  const { pageX, pageY } = reactSyntheticEvent;
  return { type: 'open_share_modal', next: { pageX, pageY } };
}

export function closeShareModal () {
  return { type: 'close_share_modal' };
}

export function getHistoricalData () {
  return getCsv('historical-results.csv', 'get_historical');
}

export function getStateThresholds () {
  return getCsv('state-thresholds.csv', 'get_state_threshold');
}

export function getStateAnalysis () {
  return getJson('state-analysis.json', 'get_state_analysis');
}

var getCsv = getData.bind(null, csv);
var getJson = getData.bind(null, json);

function getData (method, filename, actionName) {
  return (dispatch) => {
    dispatch({ type: actionName + '_inflight' });
    method(`static/${filename}`).then(results => {
      dispatch({ type: actionName + '_success', results });
    }).catch(e => {
      error('Loading data failed:', e.message);
      dispatch({ type: actionName + '_failed', error: e.message });
    });
  };
}
