'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { closeInfoBox } from '../actions';

class InfoBox extends React.Component {
  constructor (props) {
    super(props);
    this.close = this.close.bind(this);
  }

  close () {
    this.props.closeInfoBox(this.props.stateId);
  }

  componentDidMount () {
    window.setTimeout(() => {
      window.addEventListener('click', this.close);
    }, 0);
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.close);
  }

  render () {
    return (
      <div className='infobox__cont'>
        <div className='infobox'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default connect(null, { closeInfoBox })(InfoBox);
