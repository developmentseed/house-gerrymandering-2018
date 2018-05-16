'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { geoPath, geoAlbersUsa } from 'd3-geo';
import { select } from 'd3';

class Map extends React.Component {
  constructor (props) {
    super(props);
    this.setHeight = this.setHeight.bind(this);
    this.renderMap = this.renderMap.bind(this);
    this.cont = React.createRef();
    this.map = React.createRef();
    this.state = { width: null, height: null };
  }

  componentDidMount () {
    window.addEventListener('resize', this.setHeight);
    this.setHeight();
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setHeight);
  }

  componentDidUpdate () {
    this.renderMap();
  }

  setHeight () {
    const { width, height } = this.cont.current.getBoundingClientRect();
    this.setState({ width, height });
  }

  renderMap () {
    const { width, height } = this.state;
    const fc = { type: 'FeatureCollection', features: this.props.geo.districts };
    const projection = geoAlbersUsa().fitExtent([[0, 0], [width, height]], fc);
    const ctx = select(this.map.current).node().getContext('2d');
    const path = geoPath().projection(projection).context(ctx);

    const { geo, vote } = this.props;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    path({type: 'FeatureCollection', features: geo.districts.filter(d => d.properties.threshold >= vote.natl)});
    ctx.fillStyle = '#ff0000';
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    path({type: 'FeatureCollection', features: geo.districts.filter(d => d.properties.threshold < vote.natl)});
    ctx.fillStyle = '#0000ff';
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    path({type: 'FeatureCollection', features: geo.districts});
    ctx.strokeStyle = '#dddddd';
    ctx.lineWidth = 0.4;
    ctx.stroke();
  }

  render () {
    const {
      width,
      height
    } = this.props;
    return (
      <div ref={this.cont} style={{ width, height }} className='map__cont'>
        {this.state.width && this.state.height ?
          <canvas ref={this.map} width={this.state.width} height={this.state.height} className='map' />
            : null
        }
      </div>
    );
  }
}

const selector = (state) => ({
  geo: state.geo,
  vote: state.vote
});

export default connect(selector)(Map);
