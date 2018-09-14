'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import c from 'classnames';
import path from 'path';
import { setVote, clearVote } from '../actions';
import { stateAbbrevFromFips, searchUrl } from '../util/format';
import baseUrl from '../static/base-url';
import copyToClipboard from '../util/copy';

class _Share extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isOpen: false,
      copied: false,
      src: ''
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.copy = this.copy.bind(this);
  }

  open () {
    const { vote, location } = this.props;
    const hash = path.join(location.pathname, searchUrl(vote));
    const src = `${baseUrl}#${hash}`;
    this.setState({ isOpen: true, src });
    window.setTimeout(() => window.addEventListener('click', this.close), 0);
  }

  close () {
    this.setState({ isOpen: false, copied: false });
    window.removeEventListener('click', this.close);
  }

  copy (e) {
    e.stopPropagation();
    copyToClipboard(this.state.src);
    this.setState({ copied: true });
    window.setTimeout(() => this.close(), 600);
  }

  renderShare () {
    if (!this.state.isOpen) {
      return null;
    }
    return (
      <div className='share'>
        <div className='share__inner'>
          <h4 className='share__title'>Copy this link to share this scenario</h4>
          <div className='share__form'>
            <input className='share__link' type='text' readOnly aria-label='Link to this scenario' value={this.state.src} />
            <button className='share__btn' onClick={this.copy}>
              {this.state.copied
                ? <span className='collecticon collecticon-clipboard-tick' />
                : <span className='collecticon collecticon-clipboard-list' />
              }
            </button>
          </div>
        </div>
      </div>
    );
  }

  render () {
    return (
      <div className='share__cont'>
        <li className='scenario__item scenario__item--share' onClick={this.open}>
          <span className='scenario__link'><span className='collecticon collecticon-link' /></span>
          Share scenario <span className='scenario__triangle'><span className='collecticon collecticon-triangle-down' /></span>
        </li>
        {this.renderShare()}
      </div>
    );
  }
}

const shareSelector = (state) => ({
  vote: state.vote
});

const Share = withRouter(connect(shareSelector)(_Share));

class Scenario extends React.Component {
  constructor (props) {
    super(props);
    this.resetVote = this.resetVote.bind(this);
  }

  resetVote (e) {
    const entity = e.currentTarget.getAttribute('data-id');
    if (entity === 'natl') {
      this.props.setVote('natl', 50);
    } else {
      this.props.clearVote(entity);
    }
  }

  label (scenario) {
    if (scenario === 'natl') {
      return 'US';
    } else {
      return stateAbbrevFromFips(scenario);
    }
  }

  margin (vote) {
    const v = Math.abs(vote - 50) + 50;
    return <span className='scenario__item__margin'>{v}%</span>;
  }

  party (vote) {
    if (vote > 50) {
      return 'R ';
    } else if (vote < 50) {
      return 'D ';
    }
    return null;
  }

  render () {
    const { vote } = this.props;
    // Scenarios should be sorted national-first, then alphabetically by state name.
    const scenarios = ['natl'].concat(Object.keys(vote).filter(name => name !== 'natl'))
      .filter(name => parseFloat(vote[name]) !== 50.0);
    return (
      <div className='scenario__cont'>
        <ul className='scenario'>
          {scenarios.map(s => (
            <li key={s} className={c('scenario__item', {
              'scenario__item--rep': vote[s] > 50,
              'scenario__item--dem': vote[s] < 50
            })} onClick={this.resetVote} data-id={s}>{this.label(s)} {this.party(vote[s])}{this.margin(vote[s])}</li>
          ))}
          <Share />
        </ul>
      </div>
    );
  }
}

const selector = state => ({
  vote: state.vote
});

export default connect(selector, { setVote, clearVote })(Scenario);
