'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { scaleLinear } from 'd3';
import { houseDems, houseReps } from '../static/stats';

class Head2Head extends React.Component {
  render () {
    const { vote } = this.props;
    const rep = 280;
    const dem = 175;

    const winner = rep >= 218 ? 'The Republican party' :
      dem >= 218 ? 'The Democratic party' : 'Neither major party';

    const scale = scaleLinear()
      .domain([0, 455])
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
            left: scale(dem) + '%',
            width: scale(rep) + '%'
          }}/>
          <span className='hh__figure__center' />
        </figure>
        <figure className='hh__delta hh__delta__dem'>
          <figcaption>+6 votes gained<br />({houseDems} seats held prior to midterms)</figcaption>
        </figure>
        <figure className='hh__delta hh__delta__rep'>
          <figcaption>+6 votes gained<br />({houseReps} seats held prior to midterms)</figcaption>
        </figure>
      </div>
    );
  }
}

const selector = state => ({
  vote: state.vote
});

export default connect(selector)(Head2Head);
