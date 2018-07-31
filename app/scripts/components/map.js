'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { geoPath, geoAlbersUsa } from 'd3-geo';
import { select } from 'd3';
import c from 'classnames';
import {
  dem,
  rep,
  districtStrokeColor,
  districtStrokeWidth
} from '../static/settings';

const districtPaths = {};

class Map extends React.Component {
  constructor (props) {
    super(props);
    this.setHeight = this.setHeight.bind(this);
    this.renderCanvasMap = this.renderCanvasMap.bind(this);
    this.renderSvgMap = this.renderSvgMap.bind(this);
    this.getMapElement = this.getMapElement.bind(this);
    this.renderCount = 0;

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
    if (this.props.useCanvas) {
      this.renderCanvasMap();
    }
  }

  setHeight () {
    const { width, height } = this.cont.current.getBoundingClientRect();
    const { districts } = this.props.geo;
    const fc = { type: 'FeatureCollection', features: districts };
    this.projection = geoAlbersUsa().fitExtent([[0, 0], [width, height]], fc);

    // Cache all district paths.
    // This uses more memory but saves a ton of time on reach successive render.
    if (!this.props.useCanvas) {
      let path = geoPath().projection(this.projection);
      districts.forEach(function (d) {
        districtPaths[d.properties.id] = path(d);
      });
    }

    // Trigger a re-render
    this.setState({ width, height });
  }

  renderCanvasMap () {
    const { width, height } = this.state;
    const ctx = select(this.map.current).node().getContext('2d');
    const path = geoPath().projection(this.projection).context(ctx);

    const { geo, vote } = this.props;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    path({type: 'FeatureCollection', features: geo.districts.filter(d => d.properties.threshold >= vote.natl)});
    ctx.fillStyle = rep;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    path({type: 'FeatureCollection', features: geo.districts.filter(d => d.properties.threshold < vote.natl)});
    ctx.fillStyle = dem;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    path({type: 'FeatureCollection', features: geo.districts});
    ctx.strokeStyle = districtStrokeColor;
    ctx.lineWidth = districtStrokeWidth;
    ctx.stroke();
  }

  renderSvgMap () {
    const { vote, geo } = this.props;
    return (
      <svg width={this.state.width} height={this.state.height} className='map'>
        <g className='districts'>
          {geo.districts.map(d => (
            <path
              className={c('district', {
                'district--red': d.properties.threshold >= vote.natl,
                'district--blue': d.properties.threshold < vote.natl
              })}
              key={d.properties.id}
              d={districtPaths[d.properties.id]}
            />
          ))}
        </g>
      </svg>
    );
  }

  getMapElement () {
    if (this.props.useCanvas) {
      return <canvas ref={this.map} width={this.state.width} height={this.state.height} className='map' />;
    } else {
      return this.renderSvgMap();
    }
  }

  render () {
    const {
      width,
      height
    } = this.props;
    return (
      <div ref={this.cont} style={{ width, height }} className='map__cont'>
        {this.state.width && this.state.height ? this.getMapElement() : null}
      </div>
    );
  }
}

const selector = (state) => ({
  geo: state.geo,
  vote: state.vote
});

export default connect(selector)(Map);
