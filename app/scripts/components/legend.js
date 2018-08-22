'use strict';
import React from 'react';

class Legend extends React.Component {
  render () {
    return (
      <figure className='legend__cont'>
        <figcaption className='legend'>
          <span className='legend__item legend__item--rep'>Republican district</span>
          <span className='legend__item legend__item--dem'>Democrat district</span>
        </figcaption>
      </figure>
    );
  }
}

export default Legend;
