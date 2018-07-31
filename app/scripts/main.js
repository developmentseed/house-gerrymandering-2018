'use strict';
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from './get-store';

import Map from './components/map';
import Slider from './components/slider';

const Root = () => (
  <Provider store={store}>
    <main>
      <Slider/>
      <Map width='100%' height='600px' useCanvas={false}/>
    </main>
  </Provider>
);

render(<Root store={store} />, document.querySelector('#site-canvas'));
