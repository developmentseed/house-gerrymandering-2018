'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { scaleLinear } from 'd3';
import { get } from 'object-path';
import { setVote } from '../actions';
import { stateNameFromFips, fips } from '../util/format';

class Slider extends React.Component {
  constructor (props) {
    super(props);
    this.setVote = this.setVote.bind(this);
    this.state = {
      scenarioEnabledState: null
    };
  }

  static getDerivedStateFromProps (props, state) {
    // Determine we are focused on a state, and whether it is scenario-enabled,
    // ie whether we have a separate state threshold data point for it.
    const { selectedStateFips, stateThresholds } = props;
    if (!props.selectedStateFips || !stateThresholds.hasOwnProperty(selectedStateFips.toString())) {
      return state.scenarioEnabledState ? { scenarioEnabledState: null } : null;
    }
    return state.scenarioEnabledState === selectedStateFips ? null
      : { scenarioEnabledState: fips(selectedStateFips) };
  }

  getOffset () {
    return isNaN(this.props.offset) ? 0 : this.props.offset;
  }

  setVote (e) {
    const { value } = e.currentTarget;
    const { scenarioEnabledState } = this.state;
    if (!scenarioEnabledState) {
      this.props.setVote('natl', value);
    } else {
      this.props.setVote(scenarioEnabledState, value);
    }
  }

  threshold () {
    const { scenarioEnabledState } = this.state;
    if (!scenarioEnabledState) {
      return this.props;
    }
    const stateThreshold = get(this.props.stateThresholds, scenarioEnabledState);
    return {
      demLimit: parseFloat(stateThreshold.high) / 100,
      repLimit: (100 - parseFloat(stateThreshold.low)) / 100
    };
  }

  title () {
    // TODO When we show the national entity on a selected state,
    // we should show a pop-up note specifying that not all states have data.
    const { scenarioEnabledState } = this.state;
    if (!scenarioEnabledState) {
      return 'National scenario';
    }
    const stateName = stateNameFromFips(scenarioEnabledState);
    return `${stateName} scenario`;
  }

  tally () {
    const { scenarioEnabledState } = this.state;
    if (!scenarioEnabledState) {
      return this.props.vote.natl;
    }
    const stateVote = get(this.props.vote, this.props.selectedStateFips, 50);
    return stateVote;
  }

  renderStateScenario (tally) {
    const stateAnalysis = get(this.props.stateAnalysis, this.props.selectedStateFips);
    if (!stateAnalysis) {
      return null;
    }
    let dem = 0;
    let rep = 0;
    for (let fips in stateAnalysis) {
      if (stateAnalysis[fips] > tally) {
        dem += 1;
      } else if (stateAnalysis[fips] < tally) {
        rep += 1;
      }
    }
    return (
      <React.Fragment>
        <span className='range__label__scenario range__label__scenario--dem'>{dem}</span>
        <span className='range__label__scenario range__label__scenario--rep'>{rep}</span>
      </React.Fragment>
    );
  }

  render () {
    const { demLimit, repLimit } = this.threshold();
    // Calculate where the unrealistic scenario markers will go
    const offset = this.getOffset();
    const scale = scaleLinear()
      .domain([offset, 1 - offset])
      .range([0, 100]);
    const leftPct = scale(1 - demLimit);
    const rightPct = scale(repLimit);
    const width = rightPct - leftPct;

    const tally = this.tally();

    // Determine the republican and democratic deltas under this tally
    const demVote = 100 - tally - 50;
    const repVote = tally - 50;
    const demDelta = demVote - repVote;
    const repDelta = repVote - demVote;

    // Determine if we're currently in an unrealistic scenario
    const isUnrealistic = tally < (1 - demLimit) * 100 ||
      tally > repLimit * 100;

    return (
      <div className='slider__cont'>
        {isUnrealistic ? (
          <figure className='range__warning'>
            <figcaption>Scenario unlikely based on past results</figcaption>
          </figure>
        ) : null}
        <figure className='range__label'>
          <div className='range__label__inner'>
            <figcaption className='range__label__indicator' style={{left: leftPct + width / 2 + '%'}}>historic range</figcaption>

            <span className='range__label__limit range__label__limit--left' style={{left: leftPct + '%'}} />
            <span className='range__label__span' style={{left: leftPct + '%', width: width + '%'}} />
            <span className='range__label__limit range__label__limit--right' style={{left: rightPct + '%'}} />

            {this.state.scenarioEnabledState ? this.renderStateScenario(tally) : null}

            {demDelta > 0 ? <span className='range__marker range__marker--left'>+{demDelta}%</span> : null}
            {repDelta > 0 ? <span className='range__marker range__marker--right'>+{repDelta}%</span> : null}
          </div>
        </figure>
        <label className='slider__label'>
          {this.title()}
          <input
            className='slider'
            type='range'
            min={offset * 100}
            max={100 - (offset * 100)}
            value={tally}
            onChange={this.setVote}
          />
        </label>
      </div>
    );
  }
}

const selector = state => ({
  vote: state.vote,
  selectedStateFips: state.geo.selectedStateFips,
  stateThresholds: state.states.thresholds,
  stateAnalysis: state.summary.stateAnalysis
});

export default connect(selector, { setVote })(Slider);
