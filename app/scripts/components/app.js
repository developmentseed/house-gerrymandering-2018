'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { parse } from 'qs';
import {
  setAppDimensions,
  getHistoricalData,
  getStateThresholds,
  getStateAnalysis,
  syncSelectedState,
  syncVoteState
} from '../actions';
import Map from './map';
import Slider from './slider';
import Head2Head from './head-to-head';
import Scenario from './scenario';
import Legend from './legend';
import Tooltip from './tooltip';
import { isStateFips } from '../util/format';

const sliderOffset = 0.25;
const stateToFips = require('../static/state-to-fips.json');

function isWithinThreshold (value) {
  return value > sliderOffset * 100 && value < 100 - (sliderOffset * 100);
}

class App extends React.Component {
  constructor (props) {
    super(props);
    if (props.match.params.state) {
      this.syncState(props.match.params.state);
    }
    if (props.location.search) {
      this.syncVote();
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

  syncVote () {
    const { vote } = this.props;
    const { search } = this.props.location;
    const qs = parse(search.slice(1, search.length));
    const nextVoteState = {};
    let shouldSyncVoteState = false;
    for (let stateFips in qs) {
      let value = qs[stateFips];
      if (!isStateFips(stateFips) || isNaN(value)) {
        continue;
      }
      value = Math.round(value);
      if (isWithinThreshold(value) && (!vote[stateFips] || +vote[stateFips] !== +value)) {
        nextVoteState[stateFips] = value;
        shouldSyncVoteState = true;
      }
    }
    if (shouldSyncVoteState) {
      this.props.syncVoteState(nextVoteState);
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
          offset={sliderOffset}
        />
        <Scenario />
        <Map width='100%' height='420px' />
        <Legend />
        <Tooltip />
      </div>
    );
  }
}

const selector = (state) => ({
  vote: state.vote
});

export default connect(selector, {
  setAppDimensions,
  getHistoricalData,
  getStateThresholds,
  getStateAnalysis,
  syncSelectedState,
  syncVoteState
})(App);
