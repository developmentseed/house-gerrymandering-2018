'use strict';

export const initialNationalVote = 50;

const initialVoteState = {
  natl: initialNationalVote
};

export default function vote (state = initialVoteState, { type, next }) {
  switch (type) {
    case 'set_vote':
      state = Object.assign({}, state, { [next.stateFips]: next.vote });
      break;
    case 'clear_vote':
      state = Object.assign({}, state);
      delete state[next.stateFips];
      break;
    case 'sync_vote_state':
      state = Object.assign({}, state, next.voteState);
      break;
  }
  return state;
}
