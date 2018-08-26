'use strict';
import React from 'react';
import { connect } from 'react-redux';
import {
  setAppDimensions,
  getHistoricalData,
  getStateThresholds,
  getStateAnalysis,
  syncSelectedState
} from '../actions';
import Map from './map';
import Slider from './slider';
import Head2Head from './head-to-head';
import Scenario from './scenario';
import Legend from './legend';
import Tooltip from './tooltip';

const stateToFips = require('../static/state-to-fips.json');

class App extends React.Component {
  constructor (props) {
    super(props);
    if (props.match.params.state) {
      this.syncState(props.match.params.state);
    }
  }
  componentDidMount () {
    this.onResize();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  componentWillMount () {
    this.props.getHistoricalData();
    this.props.getStateThresholds();
    this.props.getStateAnalysis();
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onResize);
  }

  componentDidUpdate (prevProps) {
    const { state } = this.props.match.params;
    if (state !== prevProps.match.params.state) {
      this.syncState(state);
    }
  }

  syncState (state) {
    const stateFips = state ? stateToFips[state.toLowerCase().split('-').join(' ')] : null;
    this.props.syncSelectedState(stateFips);
    if (!stateFips) {
      this.props.history.push('/');
    }
  }

  onResize (e) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.props.setAppDimensions({ width, height });
  }

  render () {
    return (
      <div className='ds__app'>
        <Head2Head />
        <Slider
          demLimit={0.55}
          repLimit={0.59}
          offset={0.25}
        />
        <Scenario />
        <Map width='100%' height='420px' />
        <Legend />
        <Tooltip />
      </div>
    );
  }
}
export default connect(null, {
  setAppDimensions,
  getHistoricalData,
  getStateThresholds,
  getStateAnalysis,
  syncSelectedState
})(App);
