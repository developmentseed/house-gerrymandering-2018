'use strict';

const initialState = {};

function infobox (state = initialState, { type, next }) {
  if (type === 'open_info_box') {
    state = Object.assign({}, state, { [next.id]: true });
  } else if (type === 'close_info_box') {
    state = Object.assign({}, state);
    delete state[next.id];
  }
  return state;
}

export default infobox;
