import React from 'react';
import Ball from './Ball.js';
import styles from './styles.js';

/**
 * Creates a rectangle to be the container of Ball
 * @param {string} title  - title of Side
 * @param {function} ClickSide - callback that manages onclick events for Side Component
 * @param {function} onClickBall - callback that manages onclick events for Ball Component
 * @param {string} side - side where the ball is going to appear
 * @param {boolean} showBall - flag to show ball during the duration of visibility
 */
const Side = ({ title, onClickSide, onClickBall, side, showBall }) => (
  <div style={styles.side} onClick={(e) => onClickSide(e, title)}>
    <div style={styles.title}>{title}</div>
    {
      (side === title && showBall) &&
      <Ball 
        side={title}
        onClickBall={onClickBall}
      />
    }
  </div>
);


export default Side;