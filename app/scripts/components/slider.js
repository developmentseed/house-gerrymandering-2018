'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { scaleLinear } from 'd3';
import { get } from 'object-path';
import { setNatlVote } from '../actions';
import { stateNameFromFips } from '../util/format';

class Slider extends React.Component {
  constructor (props) {
    super(props);
    this.setVote = this.setVote.bind(this);
  }

  getOffset () {
    return isNaN(this.props.offset) ? 0 : this.props.offset;
  }

  setVote (e) {
    this.props.setNatlVote(e.currentTarget.value);
  }

  stateThreshold () {
    if (!this.props.selectedStateFips) {
      return null;
    }
    return get(this.props.stateThresholds, this.props.selectedStateFips);
  }

  threshold () {
    const stateThreshold = this.stateThreshold();
    if (!this.props.selectedStateFips || !stateThreshold) {
      return this.props;
    }
    return {
      demLimit: parseFloat(stateThreshold.high) / 100,
      repLimit: (100 - parseFloat(stateThreshold.low)) / 100
    };
  }

  title () {
    const stateThreshold = this.stateThreshold();
    // TODO When we show the national entity on a selected state,
    // we should show a pop-up note specifying that not all states have data.
    const entity = stateThreshold ? stateNameFromFips(this.props.selectedStateFips) : 'National';
    return `${entity} Percentage of Votes`;
  }

  render () {
    const { natlVote } = this.props;
    const { demLimit, repLimit } = this.threshold();
    // Calculate where the unrealistic scenario markers will go
    const offset = this.getOffset();
    const scale = scaleLinear()
      .domain([offset, 1 - offset])
      .range([0, 100]);
    const leftPct = scale(1 - demLimit);
    const rightPct = scale(repLimit);
    const width = rightPct - leftPct;

    // TODO props or state should control whether this looks at
    // the national vote tally, or a state-wide tally.
    const tally = natlVote;

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
  natlVote: state.vote.natl,
  selectedStateFips: state.geo.selectedStateFips,
  stateThresholds: state.states.thresholds
});

export default connect(selector, { setNatlVote })(Slider);
