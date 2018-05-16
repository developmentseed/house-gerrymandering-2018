'use strict'
import React from 'react';
import { connect } from 'react-redux';
import { setNatlVote } from '../actions';

const style = {
  'textAlign': 'center',
  'marginTop': '3em'
};

class Slider extends React.Component {
  constructor (props) {
    super(props);
    this.setVote = this.setVote.bind(this);
  }

  setVote (e) {
    this.props.setNatlVote(e.currentTarget.value);
  }

  render () {
    return (
      <div className='slider__cont' style={style}>
        <input type='range' min={30} max={70} value={this.props.vote.natl} onChange={this.setVote} />
        <p>{this.props.vote.natl}</p>
      </div>
    );
  }
}

const selector = state => ({
  vote: state.vote
});

export default connect(selector, { setNatlVote })(Slider);
