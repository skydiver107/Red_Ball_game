# Red Ball Game

### Run project

`npm start`

### Description

The game consiste of showing a ball for certain amount of time to the user to click it. It plays with time duration of visibility of the ball and duration between the ball if is visible. It can be thought as a state machine with 2 states: 

- Show
- Hidden

Two transitions

- To be Visible (time of visibility)
- To be Hidden (time of non-visiblity)

The game has a naive algorithm to weight the performance of the player. It saves data (timestamps) and exponentially weights and adjusts the time of visibility to provide a challenging experience to the player.


