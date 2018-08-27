'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { closeShareModal } from '../actions';

class Modal extends React.Component {
  render () {
    return (
      <React.Fragment>
        <div className='modal__bg' />
        <div className='modal__cont'>
          <div className='modal__inner'>
            <div className='modal'>
              {this.props.children}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

class ShareModal extends React.Component {
  render () {
    const {
      vote,
      pageX,
      pageY,
      isOpen
    } = this.props;
    if (!isOpen) {
      return null;
    }
    return (
      <Modal>
        <p>Hello!</p>
      </Modal>
    );
  }
}

const selector = (state) => ({
  vote: state.vote,
  isOpen: state.share.isOpen,
  pageX: state.share.pageX,
  pageY: state.share.pageY
});

export default withRouter(connect(selector, { closeShareModal })(ShareModal));
