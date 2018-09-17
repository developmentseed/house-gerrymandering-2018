'use strict';
import { combineReducers } from 'redux';
import mouse from './mouse';
import {
  geo,
  summary
} from './geo';
import vote from './vote';
import states from './states';
import historical from './historical';
import infobox from './infobox';
import supplementary from './supplementary';

const initialAppState = {
  width: 0,
  height: 0
};

function app (state = initialAppState, { type, next }) {
  if (type === 'set_app_dimensions') {
    state = Object.assign({}, state, { width: next.width, height: next.height });
  }
  return state;
}

export default combineReducers({ app, geo, summary, vote, mouse, historical, states, infobox, supplementary });
