'use strict';
import React from 'react';
import { connect } from 'react-redux';
import c from 'classnames';
import { setNatlVote, clearStateVote } from '../actions';
import { stateNameFromFips } from '../util/format';

class Scenario extends React.Component {
  constructor (props) {
    super(props);
    this.resetVote = this.resetVote.bind(this);
  }

  resetVote (e) {
    const entity = e.currentTarget.getAttribute('data-id');
    if (entity === 'natl') {
      this.props.setNatlVote(50);
    } else {
      this.props.clearStateVote(entity);
    }
  }

  label (scenario) {
    if (scenario === 'natl') {
      return 'National';
    } else {
      return stateNameFromFips(scenario);
    }
  }

  margin (vote) {
    const v = Math.abs(vote - 50) * 2;
    return <span className='scenario__item__margin'>+{v}</span>;
  }

  render () {
    const { vote } = this.props;
    const scenarios = Object.keys(vote).filter(name => parseFloat(vote[name]) !== 50.0);
    return (
      <div className='scenario__cont'>
        <ul className='scenario'>
          {scenarios.map(s => (
            <li key={s} className={c('scenario__item', {
              'scenario__item--rep': vote[s] > 50,
              'scenario__item--dem': vote[s] < 50
            })} onClick={this.resetVote} data-id={s}>{this.label(s)} {this.margin(vote[s])}</li>
          ))}
        </ul>
      </div>
    );
  }
}

const selector = state => ({
  vote: state.vote
});

export default connect(selector, { setNatlVote, clearStateVote })(Scenario);
