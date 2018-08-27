'use strict';

const consoleError = typeof console.error === 'function' ? console.error : console.log.bind(null, 'Error:');

export function error (message) {
  consoleError(message);
}
