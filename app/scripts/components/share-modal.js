'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { closeShareModal } from '../actions';

class ShareModal extends React.Component {
  render () {
    const { vote, isOpen } = this.props;
    if (!isOpen) {
      return null;
    }
    return (
      <div className='modal__cont'>
        <div className='modal'>
          <p>Share</p>
        </div>
      </div>
    );
  }
}

const selector = (state) => ({
  vote: state.vote,
  isOpen: state.share.isOpen
});

export default withRouter(connect(selector, { closeShareModal })(ShareModal));
