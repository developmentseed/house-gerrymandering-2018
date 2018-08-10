'use strict';

const initialState = {
  event: null,
  district: null,
  x: 0,
  y: 0,
  locked: false
};

function mouse (state = initialState, { type, next }) {
  if (type === 'sync_mouse_location' && (!state.locked || (next.hasOwnProperty('locked') && !next.locked))) {
    state = Object.assign({}, state, next);
  }
  return state;
}

export default mouse;
