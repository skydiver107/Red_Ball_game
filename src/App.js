import React, { Component, useState, useEffect } from 'react';
import Snake from './Snake';
import Food from './Food';
// import Web3
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ConnectButton } from "@rainbow-me/rainbowkit";


// Web3 Wallet Integration
const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Thomas Young App",
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});


// gives random point
const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  let y =  Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  return [x,y]
}

const initialState = {
  food: getRandomCoordinates(),
  speed: 200,
  direction: 'RIGHT',
  snakeDots: [
    [0,0],
    [2,0]
  ],
  level: 1
}


class App extends Component {
  
  state = initialState;
    
  componentDidMount() {
    setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
  }
  
  componentDidUpdate() {
    this.checkIfOutOfBorders();
    this.checkIfCollapsed();
    this.checkIfEat();
  }

  onKeyDown = (e) => {
    e = e || window.event;
    switch (e.keyCode) {
      case 38:
        this.setState({direction: 'UP'});
        break;
      case 40:
        this.setState({direction: 'DOWN'});
        break;
      case 37:
        this.setState({direction: 'LEFT'});
        break;
      case 39:
        this.setState({direction: 'RIGHT'});
        break;
    }
  }

  moveSnake = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];

    switch (this.state.direction) {
      case 'RIGHT':
        head = [head[0] + 2, head[1]];
        break;
      case 'LEFT':
        head = [head[0] - 2, head[1]];
        break;
      case 'DOWN':
        head = [head[0], head[1] + 2];
        break;
      case 'UP':
        head = [head[0], head[1] - 2];
        break;
    }
    dots.push(head);
    dots.shift();
    this.setState({
      snakeDots: dots
    })
  }

  checkIfOutOfBorders() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.onGameOver();
    }
  }

  checkIfCollapsed() {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach(dot => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        this.onGameOver();
      }
    })
  }

  checkIfEat() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let food = this.state.food;
    if (head[0] === food[0] && head[1] === food[1]) {
      this.setState({
        food: getRandomCoordinates()
      })
      this.enlargeSnake();
      this.increaseSpeed();
    }
  }

  enlargeSnake() {
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift([])
    this.setState({
      snakeDots: newSnake
    })
  }
  
  // check snake size and change level and movement speed
  increaseSpeed() {
    if (this.state.speed > 10) {
      if ((this.state.snakeDots.length) >= 3 && (this.state.snakeDots.length) <= 6) {
        this.setState({
          level: 2,
          speed: this.state.speed - 10
        })
      }

      if ((this.state.snakeDots.length) >= 6) {
        this.setState({
          level: 3,
          speed: this.state.speed - 15
        })
      }
    }
  }

  onGameOver() {
    alert(`All Done!!. Your snake length is ${this.state.snakeDots.length} and your current level is ${this.state.level}`);
    this.setState(initialState)
    console.log("initial state", this.state)
  }

  render() {
    return (
      <>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider modalSize="compact" chains={chains}>
            <div className="game-title">
              Take Home Assignment by Thomas Young
            </div>
            <div className="game-title">
              You are on LEVEL {this.state.level}
            </div>
            <div className="walletButton">
              <ConnectButton accountStatus="address" showBalance={false}/>
            </div>              
            <div className="game-area">
              <Snake snakeDots={this.state.snakeDots}/>
              <Food dot={this.state.food}/>
            </div>
          </RainbowKitProvider>
        </WagmiConfig>        
      </>
    );
  }
}

export default App;
