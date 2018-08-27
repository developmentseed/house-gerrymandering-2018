'use strict';
const initialState = {
  isOpen: false,
  pageY: null,
  pageX: null
};

export default function reducer (state = initialState, { type, next }) {
  switch (type) {
    case 'open_share_modal':
      state = Object.assign({}, state, { isOpen: true }, next);
      break;
    case 'close_share_modal':
      state = Object.assign({}, state, { isOpen: false });
      break;
  }
  return state;
}
