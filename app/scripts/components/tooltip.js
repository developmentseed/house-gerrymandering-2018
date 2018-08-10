'use strict';
import React from 'react';
import { connect } from 'react-redux';
import c from 'classnames';
import { get } from 'object-path';
import { districtName } from '../util/format';

const tooltipWidth = {
  sm: 180,
  lg: 240
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

  render () {
    const style = this.getInlineStyle();
    if (style.display === 'none') {
      return null;
    }

    const d = get(this.props, 'focused.properties');
    const classNames = c(
      'tooltip__cont',
      'tooltip__cont__' + this.getDirection(),
      'tooltip__cont__' + this.getSize()
    );
    return (
      <figure style={style} className={classNames}>
        <h3 className='tooltip__title'>{districtName(d.stateFips, d.fips)}</h3>
      </figure>
    );
  }
}

const selector = (state) => ({
  appWidth: state.app.width,
  mouse: state.mouse,
  focused: state.geo.focused
});
export default connect(selector, null)(Tooltip);
