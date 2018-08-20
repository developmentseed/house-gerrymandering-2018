'use strict';

export const initialNationalVote = 50;

const initialVoteState = {
  natl: initialNationalVote
};

export default function vote (state = initialVoteState, { type, next }) {
  switch (type) {
    case 'set_natl_vote':
      state = Object.assign({}, state, { natl: next.vote });
      break;
    case 'set_state_vote':
      state = Object.assign({}, state, { [next.stateFips]: next.vote });
      break;
    case 'clear_state_vote':
      state = Object.assign({}, state);
      delete state[next.stateFips];
      break;
  }
  return state;
}
