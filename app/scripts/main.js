'use strict';
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import Map from './components/map';

const Root = () => (
  <Provider store={store}>
    <Map width='100%' height='600px'/>
  </Provider>
);

render(<Root store={store} />, document.querySelector('#site-canvas'));
