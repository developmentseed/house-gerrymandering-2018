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
    return (
      <div className='slider__cont'>
        <figure className='range__label'>
          <div className='range__label__inner'>
            <span className='range__label__limit range__label__limit--left' style={{left: leftPct + '%'}} />
            <span className='range__label__span' style={{left: leftPct + '%', width: width + '%'}} />
            <span className='range__label__limit range__label__limit--right' style={{left: rightPct + '%'}} />
            <span className='range__label__indicator' style={{left: leftPct + width / 2 + '%'}}>historic range</span>

            <span className='range__marker range__marker--left'>{100 - tally}%</span>
            <span className='range__marker range__marker--right'>{tally}%</span>
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
