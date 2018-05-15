'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { geoPath } from 'd3-geo';
import { select } from 'd3';

class Map extends React.Component {
  constructor (props) {
    super(props);
    this.setHeight = this.setHeight.bind(this);
    this.renderMap = this.renderMap.bind(this);
    this.cont = React.createRef();
    this.state = { width: null, height: null };
  }

  componentDidMount () {
    window.addEventListener('resize', this.setHeight);
    this.context = select(this.cont.current).node().getContext('2d');
    this.path = geoPath().context(this.context);
    this.renderMap();
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setHeight);
    this.path = null;
    this.context = null;
  }

  setHeight () {
    const { width, height } = this.cont.current.getBoundingClientRect();
    this.setState({ width, height });
  }

  renderMap () {
    const { context: ctx } = this;
    ctx.beginPath();
    this.path({type: 'FeatureCollection', features: this.props.geo.districts});
    ctx.fillStyle = '#dcd8d2'
    ctx.fill()
    ctx.lineWidth = '1'
    ctx.strokeStyle = '#c9c4bc'
    ctx.stroke()
  }

  render () {
    const {
      width,
      height
    } = this.props;
    return (
      <canvas ref={this.cont} style={{ width, height }} className='map__cont' />
    );
  }
}

const selector = (state) => ({
  geo: state.geo
});

export default connect(selector)(Map);
