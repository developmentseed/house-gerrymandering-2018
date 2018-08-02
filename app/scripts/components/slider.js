'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { setNatlVote } from '../actions';
import { scaleLinear } from 'd3';

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

  render () {
    const {
      vote,
      demLimit,
      repLimit
    } = this.props;
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
    const tally = vote.natl;

    // Determine the republican and democratic deltas under this tally
    const demDelta = 100 - tally - 50;
    const repDelta = tally - 50;

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
          Percentage of Votes
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
  vote: state.vote
});

export default connect(selector, { setNatlVote })(Slider);
