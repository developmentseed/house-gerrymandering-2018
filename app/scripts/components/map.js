'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { geoPath, geoAlbersUsa } from 'd3-geo';
import { select, zoomIdentity } from 'd3';
import c from 'classnames';
import {
  syncMouseLocation,
  syncSelectedState
} from '../actions';

const districtPaths = {};

class Map extends React.Component {
  constructor (props) {
    super(props);
    this.setHeight = this.setHeight.bind(this);
    this.renderSvgMap = this.renderSvgMap.bind(this);
    this.getMapElement = this.getMapElement.bind(this);

    // Mouse events
    this.syncMouseMove = this.syncMouseMove.bind(this);
    this.syncMouseOut = this.syncMouseOut.bind(this);
    this.syncMouseClick = this.syncMouseClick.bind(this);

    this.cont = React.createRef();
    this.map = React.createRef();

    this.state = {
      width: null,
      height: null,
      transform: '',
      lockMouseEvents: false
    };
  }

  componentDidMount () {
    window.addEventListener('resize', this.setHeight);
    this.setHeight();
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setHeight);
  }

  // Use componentDidUpdate to animate between states and national
  componentDidUpdate (prevProps) {
    const { selected } = this.props;
    if (selected !== prevProps.selected) {
      const transform = this.getTransform(this.path, this.state);
      select(this.refs.districts).transition()
        .duration(400)
        .attr('transform', transform)
        .on('end', () => this.setState({ transform, lockMouseEvents: false }));
    }
  }

  setHeight () {
    const { width, height } = this.cont.current.getBoundingClientRect();
    const { districts } = this.props;
    const fc = { type: 'FeatureCollection', features: districts };
    this.projection = geoAlbersUsa().fitExtent([[0, 0], [width, height]], fc);
    // Cache all district paths.
    // This uses more memory but saves a ton of time on reach successive render.
    const path = this.path = geoPath().projection(this.projection);
    districts.forEach(function (d) {
      districtPaths[d.properties.id] = path(d);
    });
    const transform = this.getTransform(path, { width, height });
    // Trigger a re-render
    this.setState({ width, height, transform });
  }

  getTransform (path, { width, height }) {
    const { selected } = this.props;
    if (!selected) {
      return zoomIdentity.toString();
    }
    const bounds = path.bounds(selected);
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;
    const scale = 0.85 / Math.max(dx / width, dy / height);
    const translate = [width / 2 - scale * x, height / 2 - scale * y];
    const transform = `translate(${translate})scale(${scale})`;
    return transform;
  }

  renderSvgMap () {
    const { districts, vote, selected, selectedIdMap } = this.props;
    return (
      <svg width={this.state.width} height={this.state.height} className='map'>
        <rect width={this.state.width} height={this.state.height} className='map__bg' onClick={this.syncMouseClick} />
        <g ref='districts' transform={this.state.transform} className={c('districts', {
          'districts--zoomed': !!selected
        })}>
          {districts.map(d => {
            // District classname
            let outcome = d.properties.threshold > vote.natl ? '--blue'
              : d.properties.threshold < vote.natl ? '--red' : '--tie';
            // Unfocused district, aka zoomed into a different state
            if (selectedIdMap && !selectedIdMap.has(d.properties.id)) {
              outcome += '--out';
            }
            return <path
              className={c('district', `district${outcome}`)}
              key={d.properties.id}
              d={districtPaths[d.properties.id]}
              onMouseMove={this.syncMouseMove}
              onMouseOut={this.syncMouseOut}
              onClick={this.syncMouseClick}
              data-id={d.properties.id}
            />;
          })}
        </g>
      </svg>
    );
  }

  getMapElement () {
    return this.renderSvgMap();
  }

  syncMouseMove (e) {
    if (this.state.lockMouseEvents) return;
    const id = e.currentTarget.getAttribute('data-id');
    const next = {
      event: 'mousemove',
      district: id,
      x: e.pageX,
      y: e.pageY
    };
    this.props.syncMouseLocation(next);
  }

  syncMouseOut () {
    if (this.state.lockMouseEvents) return;
    this.props.syncMouseLocation({ event: null });
  }

  syncMouseClick (e) {
    if (this.state.lockMouseEvents) return;
    const id = e.currentTarget.getAttribute('data-id');
    this.props.syncMouseLocation({ event: null });
    this.props.syncSelectedState(id);
    this.setState({ lockMouseEvents: true });
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
  districts: state.geo.districts,
  vote: state.vote,
  selected: state.geo.selected,
  selectedIdMap: state.geo.selectedIdMap
});

export default connect(selector, {
  syncMouseLocation,
  syncSelectedState
})(Map);
