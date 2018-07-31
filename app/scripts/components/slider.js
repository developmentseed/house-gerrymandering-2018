'use strict'
import React from 'react';
import { connect } from 'react-redux';
import { setNatlVote } from '../actions';

class Slider extends React.Component {
  constructor (props) {
    super(props);
    this.setVote = this.setVote.bind(this);
  }

  setVote (e) {
    this.props.setNatlVote(e.currentTarget.value);
  }

  render () {
    const { vote, demLimit, repLimit } = this.props;
    const left = 100 - demLimit;
    const right = repLimit;
    const width = right - left;
    return (
      <div className='slider__cont'>
        <figure className='range__label'>
          <div className='range__label__inner'>
            <span className='range__label__limit range__label__limit--left' style={{left: left + '%'}} />
            <span className='range__label__span' style={{left: left + '%', width: width + '%'}} />
            <span className='range__label__limit range__label__limit--right' style={{left: right + '%'}} />
          </div>
        </figure>
        <label className='slider__label'>
          Percentage of Votes
          <input className='slider' type='range' min={0} max={100} value={vote.natl} onChange={this.setVote} />
        </label>
      </div>
    );
  }
}

const selector = state => ({
  vote: state.vote
});

export default connect(selector, { setNatlVote })(Slider);
