'use strict';
const initialState = {
  isOpen: false
};

export default function reducer (state = initialState, { type }) {
  switch (type) {
    case 'open_share_modal':
      state = Object.assign({}, state, { isOpen: true });
      break;
    case 'close_share_modal':
      state = Object.assign({}, state, { isOpen: false });
      break;
  }
  return state;
}
