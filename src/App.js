import './App.css';
import React, {Component} from 'react';
import {SHAPE} from './components/shapes.js';
import Square from "./components/square";



export const ROW_SIZE = 8;
export const COL_SIZE = 18;

const style = {
	width        : "250px",
	height       : "250px",
	margin       : "0 auto",
	display      : "grid",
	gridTemplate : `repeat(${COL_SIZE}, 1fr) / repeat(${ROW_SIZE}, 1fr)`,
};

const LEFT  = 37; /* left arrow */
const ROTATE_UP    = 90; /* z */
const RIGHT = 39; /* right arrow */
const ROTATE_DOWN  = 88; /* x */
const STOP  = 32; /* space */

const getRandomShape = () => Math.ceil((SHAPE.length -1) * Math.random());


const InitialState =  {
  shapePos  :  getRandomShape(),  // pointers to show which type of shape we are using
  rotatePos :  0,                 // pointer to represent which rotation of shape we are using
  xPos      : ROW_SIZE / 2,       // block starts coming down from middle of the board
  yPos      :  0,                  
  board     : [...Array(ROW_SIZE * COL_SIZE)].map( _ => 0)  ,
  speed     : 500,
  isPause   : false,
}

const increaseSpeed = (speed) => speed - 10 *(speed > 10)

class App extends Component {

  constructor(props) {
    super(props);
    this.state = InitialState;  
  }

  resetGame = () => this.setState(InitialState)

  componentDidMount() {
    this.periodicInterval = setInterval(this.fallDown, this.state.speed);
    document.onkeydown = this.keyInput;
  }

  componentWillUnmount() {
    clearInterval(this.periodicInterval);
  }

  // shift
  shiftRight = (isRight) => {
    let curShape = this.getCurShape(this.state.rotatePos);
    let oldArray = curShape.posArray;
    let xPos = this.state.xPos;
    // Making sure we are not going off the edge
    if ((isRight && (xPos + curShape.rowLength === ROW_SIZE)) || (!isRight && (xPos === 0))) {
      return;
    }
    let newArray = (isRight)? oldArray.map(x => x+1): oldArray.map(x => x-1);
    let isConflict = newArray.filter( x => oldArray.indexOf(x) === -1 && this.state.board[x] !== 0).length;
    
    if (!isConflict) {
      this.setState({ xPos: xPos + (isRight? 1:-1)});
    }
  }  

  //get Current shape 
  getCurShape = (rotatePos) => {
    let curShape = SHAPE[this.state.shapePos][rotatePos];
    let xPos = this.state.xPos;
    let yPos = this.state.yPos;
    // output for this function
    let out = {
      rowLength : curShape[0].length,
      colLength : curShape.length,
      posArray  : [] // Array representing postion of the given element
    }
    curShape.forEach((row, rowPos) =>  
      row.forEach( (col, colPos) => { 
        if (col !== 0 &&  rowPos + yPos + 1 >= curShape.length){
          let val = (colPos + xPos) + ROW_SIZE*(rowPos+ yPos);
          out.posArray.push(val);
        }
    }));
    return out;
  }

  getNextBlock = () => {
    this.updateBoard(this.state.shapePos);
    this.setState({
      yPos     : 0,
      shapePos : getRandomShape(),
      speed    : increaseSpeed(this.state.speed),
    });
  }

  detectCollision = () => {
    let curShape = this.getCurShape(this.state.rotatePos);
    let oldArray = curShape.posArray;

    // if bottom of the board is touched
    if (this.state.yPos + curShape.colLength  === COL_SIZE) {
      this.getNextBlock();
      return;      
    }

    let newArray = oldArray.map(x => x + ROW_SIZE);
    let isConflict = newArray.filter( x => oldArray.indexOf(x) === -1 && this.state.board[x] !== -1).length;
    console.log(oldArray, newArray, isConflict, newArray.filter( x => oldArray.indexOf(x) === -1 && this.state.board[x] !== -1), isConflict);
    if (!isConflict) {
      this.getNextBlock();
    }
  }
        

  updateBoard = (val) => {
    let board = [...this.state.board];
    let curShape = this.getCurShape(this.state.rotatePos).posArray;
    curShape.forEach( pos => board[pos] = val+1);
    this.setState({board: board});
  }

  // rotate
  rotateClockwise = (isClockwise) => {
    let oldArray = this.getCurShape(this.state.rotatePos).posArray;

    let rotatePos = this.state.rotatePos;
    let lenOfShape = SHAPE[this.state.shapePos].length - 1;
    
    let newRotatePos = (isClockwise)? 
        (rotatePos===0)? lenOfShape:(rotatePos - 1):
        (rotatePos===lenOfShape)? 0:(rotatePos + 1);

    let newArray = this.getCurShape(newRotatePos).posArray;
    let isConflict = newArray.filter( x => oldArray.indexOf(x) === -1 && this.state.board[x] !== 0).length;

    if (!isConflict) {
      this.setState({ rotatePos: newRotatePos});
    }
    
  } 
  
  fallDown = () => {
    if (!this.state.isPause) {
      this.updateBoard(-1);
      this.setState({yPos:  this.state.yPos+1});
      this.updateBoard(this.state.shapePos);
      this.detectCollision();
    }
  }

  pauseGame = () => this.setState({isPause: !this.state.isPause});
  keyInput = ({keyCode}) => {
    if (this.state.isPause) {
      if (keyCode === STOP) {
        this.pauseGame();
      }
      return;
    }
    /* Clearing last image */
    this.updateBoard(-1);
    switch (keyCode) {
      case LEFT:
        this.shiftRight(false); 
        break;
      case RIGHT:
        this.shiftRight(true);
        break;
      case ROTATE_UP: 
        this.rotateClockwise(true);
        break;
      case ROTATE_DOWN: 
        this.rotateClockwise(false);
        break;
      case STOP: 
        this.pauseGame();
        break;
      default: 
        break;
    }
    this.updateBoard(this.state.shapePos);
  }
  
  render() {
    const board =  this.state.board.map( (val, pos) => <Square key={pos} name={pos} color={val}/>);
    return (
      <div className="App">
        <h1>  Tetris  {this.state.yPos}</h1>
        <div style={style}> 
          {board}
        </div>
      </div>
    );
  }
}

export default App;
