'use strict';
export const na = '--';
export function pct (n) {
  if (isNaN(n)) {
    return na;
  }
  return n + '%';
}
