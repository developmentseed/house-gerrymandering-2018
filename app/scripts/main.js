'use strict';
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import store from './get-store';
import App from './components/app';

const Root = () => (
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route exact path='/' component={App} />
        <Route path='/state/:state/' component={App} />
        <Route render={() => <Redirect to='/' />} />
      </Switch>
    </HashRouter>
  </Provider>
);

render(<Root store={store} />, document.querySelector('#site-canvas'));
