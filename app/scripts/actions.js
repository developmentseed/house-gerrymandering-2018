'use strict';

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
