'use strict';
import React from 'react';
import { connect } from 'react-redux';
import c from 'classnames';
import { get } from 'object-path';
import {
  lean,
  pct,
  party,
  year,
  districtName,
  districtId
} from '../util/format';
import { error } from '../util/log';

const tooltipWidth = {
  sm: 200,
  lg: 260
};

class Tooltip extends React.Component {
  getSize () {
    return this.props.appWidth < 640 ? 'sm' : 'lg';
  }

  getDirection () {
    return this.props.appWidth / 2 - this.props.mouse.x > 0 ? 'right' : 'left';
  }

  getInlineStyle () {
    const { mouse } = this.props;
    const display = mouse.event !== 'mousemove' ? 'none' : 'block';

    // short circuit if there's no tooltip to show
    if (display === 'none') {
      return { display };
    }

    const direction = this.getDirection();
    const size = this.getSize();
    const left = direction === 'right' ? mouse.x : mouse.x - tooltipWidth[size];
    const top = mouse.y;
    const width = tooltipWidth[size] + 'px';
    return { display, left, top, width };
  }

  renderHistorical (historical) {
    if (!Array.isArray(historical) || !historical.length) {
      return <p>Historical data not available.</p>;
    }
    return (
      <React.Fragment>
        <div className='hist__cont'>
          <h6 className='hist__label hist__label--district'>Past results</h6>
          <h6 className='hist__label hist__label--percent'>Vote %</h6>
        </div>
        {historical.map((d, i) => (
          <p className={'hist__cont hist__cont--' + i} key={d.year}>
            <span className='hist__item hist__item--first'>
              <span className={c('hist__winner', {
                'hist__winner--rep': d.party.toLowerCase() === 'r',
                'hist__winner--dem': d.party.toLowerCase() === 'd'
              })}>{d.winner} ({party(d.party)}) {year(d.year)}</span>
            </span>
            <span className='hist__item'>{pct(d.vote)}</span>
          </p>
        ))}
      </React.Fragment>
    );
  }

  renderThreshold (threshold, useStateThreshold, hasNoStateThreshold) {
    if (isNaN(threshold)) {
      error('No threshold found');
      return null;
    }
    const demVote = 100 - threshold;
    const partyLean = Math.floor(demVote / 50);
    const opposing = partyLean === 0 ? 'Republicans' : 'Democrats';
    const opposingLean = partyLean ? 'lean__0' : 'lean__1';
    const opposingVote = Math.round(partyLean === 0 ? threshold : demVote);
    return (
      <React.Fragment>
        <p className='lean'>
          <span className={'lean__' + partyLean}>{lean(threshold)}</span>
        </p>
        <p className='lean'>
          <span className={opposingLean}>{opposing}</span> need <span className={opposingLean}>{opposingVote}%</span> of {useStateThreshold && !hasNoStateThreshold ? 'state' : 'national'} vote
        </p>
        {hasNoStateThreshold ? (
          <p className='lean lean__nodata'>State-level analysis unavailable</p>
        ) : null}
        <figure className='threshold'>
          <span className='threshold__bar threshold__bar--dem' style={{ width: demVote + '%' }}/>
          <span className='threshold__bar threshold__bar--rep' style={{ left: demVote + '%', width: (100 - demVote) + '%' }}/>
          <span className='threshold__limit' style={{ left: demVote + '%' }}/>
          <h4 className='threshold__label threshold__label--dem'>{pct(Math.round(demVote))}</h4>
          <h4 className='threshold__label threshold__label--rep'>{pct(Math.round(threshold))}</h4>
        </figure>
      </React.Fragment>
    );
  }

  render () {
    const style = this.getInlineStyle();
    if (style.display === 'none') {
      return null;
    }

    const { stateAnalysis, vote, focused, selectedStateFips } = this.props;
    const d = get(focused, 'properties');
    if (!d) {
      return null;
    }

    const classNames = c(
      'tooltip__cont',
      'tooltip__cont__' + this.getDirection(),
      'tooltip__cont__' + this.getSize()
    );
    const id = districtId(d.stateFips, d.fips);
    const historical = get(this.props.historical, id);
    // Use the state-specific threshold if:
    // 1. We've specified a threshold
    // 2. We've clicked into the state
    const useStateThreshold = vote.hasOwnProperty(d.stateFips) || selectedStateFips === d.stateFips;

    // Some states, however, do not have a threshold available.
    // These are single-district states like WY and ND.
    // Fallback to the national threshold in this case, but call it out.
    let threshold = useStateThreshold ? get(stateAnalysis, [d.stateFips, d.fips]) : d.threshold;
    const hasNoStateThreshold = useStateThreshold && !threshold;
    if (hasNoStateThreshold) {
      threshold = d.threshold;
    }
    return (
      <figure style={style} className={classNames}>
        <div className='tooltip__sect'>
          <h3 className='tooltip__title'>{districtName(d.stateFips, d.fips)}</h3>
          {this.renderThreshold(threshold, useStateThreshold, hasNoStateThreshold)}
        </div>
        <div className='tooltip__sect tooltip__sect--divider'>
          {this.renderHistorical(historical)}
        </div>
      </figure>
    );
  }
}

const selector = (state) => ({
  appWidth: state.app.width,
  mouse: state.mouse,
  focused: state.geo.focused,
  selectedStateFips: state.geo.selectedStateFips,
  historical: state.historical.districts,
  stateAnalysis: state.summary.stateAnalysis,
  vote: state.vote
});
export default connect(selector, null)(Tooltip);
