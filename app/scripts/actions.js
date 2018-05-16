'use strict'

export function setNatlVote (vote) {
  return { type: 'SET_NATL_VOTE', next: { vote } }
}
