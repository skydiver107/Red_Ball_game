import React, { Component } from 'react';
import Side from './Side.js';
import styles from './styles.js';

class Game extends Component {
  sideChoices = [
    'Left',
    'Right'
  ]

  notVisibleDurationChoices = [
    1000, // 1 second,
    3000, // 3 seconds
  ]

  speedParameters = {
    offset: 100,
    topLimit: 3000
  }

  validClickHistoryTime = 10000;

  constructor(){
    super();
    this.onClickBall = this.onClickBall.bind(this);
    this.onClickSide = this.onClickSide.bind(this);
    this.newFrame = this.newFrame.bind(this);
    this.state = {
      userFeedback: '', 
      sideToAppear: 'Left', 
      gameLoop: 0,
      secondsCount: Date.now(),
      showBall: true,
      notVisibleDuration: 1000,
      clicks: 0,
      correctClicks: 0,
      clicksHistory: [],
      correctClicksHistory: []
    }
  }

  componentDidMount(){
    this.setState({
      gameLoop: requestAnimationFrame(this.newFrame)
    });
  }

  componentWillUnmount(){
    cancelAnimationFrame(this.state.gameLoop);
  }  

  newFrame(){
    const { secondsCount, showBall, notVisibleDuration, clicks, correctClicks, clicksHistory, correctClicksHistory } = this.state;
    // show (S) -> wait 1 second (T) -> no show (S) -> wait 1 or 3 seconds (T) -> show (S) 
    let visibilityTime = this.speedParameters.topLimit * Math.exp(- correctClicksHistory.length / (clicksHistory.length + 1)) 
                      + this.speedParameters.offset; // TOP_LIMIT * e ^ (- CCH / CH) + OFFSET; - 1/3
    if( (Date.now() - secondsCount) > visibilityTime && showBall){ 
    // Hide the ball and set no show duration
    // Get random no show duration      
      const index = Math.round(Math.random() * (this.notVisibleDurationChoices.length - 1));
      let newClicksHistory = clicksHistory.filter( click => click.timestamp > Date.now() - this.validClickHistoryTime);
      let newCorrectClicksHistory = correctClicksHistory.filter( click => click.timestamp > Date.now() - this.validClickHistoryTime);
      //Last 20 results
      console.log('Ready to hide', Date.now() - secondsCount, index);
      this.setState({
        gameLoop: requestAnimationFrame(this.newFrame),
        secondsCount: Date.now(),
        showBall: false,
        notVisibleDuration: this.notVisibleDurationChoices[index],
        clicksHistory: newClicksHistory,
        correctClicksHistory: newCorrectClicksHistory
      });
      return;
    }
    

    if( Date.now() - secondsCount > visibilityTime && !showBall){ 
    // No show duration completed and show ball
    // Get random side to show (L, R or None)
      const index = Math.round(Math.random() * (this.sideChoices.length - 1));
      const side = this.sideChoices[index]; // Math.round(Math.random() * 1)
      console.log('Ready to show', Date.now() - secondsCount, side, index);
      this.setState({
        gameLoop: requestAnimationFrame(this.newFrame),
        secondsCount: Date.now(),
        showBall: true,
        sideToAppear: side
      });
      return;
    }

    this.setState({
      gameLoop: requestAnimationFrame(this.newFrame)
    });
  }

  onClickBall(e, side){ 
    e.stopPropagation();
    const { correctClicks, clicksHistory, correctClicksHistory } = this.state;
    this.setState({
      userFeedback: `Clicked ball on ${side} side`,
      clicks: this.state.clicks + 1,
      clicksHistory: [...clicksHistory, {timestamp: Date.now()}], 
      correctClicksHistory: [...correctClicksHistory, {timestamp: Date.now()}],
      correctClicks: correctClicks + 1,
      showBall: false,
      secondsCount: Date.now()
    });
  }

  onClickSide(e, side){
    const { sideToAppear, clicks, showBall, clicksHistory } = this.state;
    this.setState({
      userFeedback: 'Oops missed it!',
      clicks: clicks + 1,
      clicksHistory: [...clicksHistory, {timestamp: Date.now()}],
    });
  }

  render() {
    const { userFeedback, sideToAppear, showBall, correctClicks, clicks } = this.state;
    return (
      <div style={styles.game}>
        <h2>Red Ball Game</h2>
        <div style={styles.sides}>
          <Side 
            title='Left' 
            onClickBall={this.onClickBall}
            onClickSide={this.onClickSide}
            side={sideToAppear}
            showBall={showBall}
          />
          <Side 
            title='Right' 
            onClickBall={this.onClickBall}
            onClickSide={this.onClickSide}
            side={sideToAppear}
            showBall={showBall}
          />
        </div>
        <div>
          <div>Output: {userFeedback}</div>
          <div>Side: {sideToAppear}</div>
        </div>
        <div>
          <div>Stats</div>
          <div>Hit the ball: {correctClicks}</div>
          <div>Total clicks: {clicks}</div>
        </div>
      </div>
    );
  }
}



export default Game;
