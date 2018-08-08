'use strict';
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from './get-store';

import App from './components/app';
import Map from './components/map';
import Slider from './components/slider';
import Head2Head from './components/head-to-head';
import Legend from './components/legend';
import Tooltip from './components/tooltip';

const Root = () => (
  <Provider store={store}>
    <App>
      <Slider
        demLimit={0.55}
        repLimit={0.59}
        offset={0.35}
      />
      <Head2Head />
      <Map width='100%' height='600px' useCanvas={false} />
      <Legend />
      <Tooltip />
    </App>
  </Provider>
);

render(<Root store={store} />, document.querySelector('#site-canvas'));
