'use strict';

export function setAppDimensions ({ width, height }) {
  return { type: 'set_app_dimensions', next: { width, height } };
}

export function syncMouse (next) {
  return { type: 'sync_mouse', next };
}

export function setNatlVote (vote) {
  return { type: 'set_natl_vote', next: { vote } };
}
