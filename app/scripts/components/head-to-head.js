'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { scaleLinear } from 'd3';
import { houseDems, houseReps } from '../static/stats';

class Head2Head extends React.Component {
  getDelta (current, last) {
    const delta = current - last;
    if (delta === 0) {
      return '0 seats gained';
    } else if (delta > 0) {
      return `+${delta} seats gained`;
    } else {
      return `${delta} seats lost`;
    }
  }

  render () {
    const { dem, rep } = this.props;

    const winner = rep >= 218 ? 'The Republican party'
      : dem >= 218 ? 'The Democratic party' : 'Neither major party';

    const demDelta = this.getDelta(dem, houseDems);
    const repDelta = this.getDelta(rep, houseReps);

    const scale = scaleLinear()
      .domain([0, 435])
      .range([0, 100]);

    return (
      <div className='hh__cont'>

        <figure className='hh__party hh__party__dem'>
          <figcaption>{dem} <span className='hh__party__label'>Democrats</span></figcaption>
        </figure>

        <figure className='hh__party hh__party__rep'>
          <figcaption><span className='hh__party__label'>Republicans</span> {rep}</figcaption>
        </figure>

        <figure className='hh__figure'>
          <figcaption className='hidden'>{winner} controls the U.S. House of Representatives under this scenario</figcaption>
          <span className='hh__figure__span hh__figure__span--dem' style={{
            width: scale(dem) + '%'
          }}/>
          <span className='hh__figure__span hh__figure__span--rep' style={{
            left: 100 - scale(rep) + '%',
            width: scale(rep) + '%'
          }}/>
          <span className='hh__figure__center' />
        </figure>

        <figure className='hh__delta hh__delta__dem'>
          <figcaption><span className='hh__delta__num'>{demDelta}</span> <span className='hh__prior'>({houseDems} seats held prior to midterms)</span></figcaption>
        </figure>

        <figure className='hh__delta hh__delta__rep'>
          <figcaption><span className='hh__delta__num'>{repDelta}</span> <span className='hh__prior'>({houseReps} seats held prior to midterms)</span></figcaption>
        </figure>
      </div>
    );
  }
}

const selector = state => ({
  vote: state.vote,
  dem: state.summary.natlDemCount,
  rep: state.summary.natlRepCount
});

export default connect(selector)(Head2Head);
