import React from 'react';
import styles from './styles';

/**
 * Creates a circle to represent a ball
 * @param  {function} { onClickBall,  side } - callback to handle onclick events
 * @return {string}  side - side where the ball is going to be visible
 */
const Ball = ({ onClickBall, side }) => (
  <div style={styles.ball} onClick={(e) => onClickBall(e, side)}>
    Ball
  </div>
);

export default Ball;