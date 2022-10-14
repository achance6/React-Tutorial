import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'


function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
          {props.value}
        </button>
    )
}

  
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
            />
        );
    }
  
    render() {
        return (
            <div>
                <div className="board-row">
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
                </div>
                <div className="board-row">
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
                </div>
                <div className="board-row">
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        // array of array of squares
        this.state = {
            history: [{ 
                squares: Array(9).fill(null), 
            }],
            xIsNext: true,
            stepNumber: 0,
            lastMove: null,
        };
    }

    handleClick(i) {
        // Throw future "history" away if move made while looking at past board
        // Creating copies of these arrays instead of mutating them to maintain immutability for react
        const history = this.state.history.slice(0, this.state.stepNumber + 1); 
        // Get current state of the board
        const curSquares = history[history.length - 1].squares.slice();
        if (calculateWinner(curSquares) || curSquares[i]) {
            return;
        }
        curSquares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: curSquares,
                lastMove: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    // Don't need to update history as unspecified props in state are left as after setState
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const curStep = this.state.stepNumber
        const current = history[curStep];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, moveIndex) => {
            const moveCol = (step.lastMove % 3) + 1;
            const moveRow = (Math.floor(step.lastMove / 3)) + 1;
            const desc = moveIndex ?
                'Go to move #' + moveIndex + ' at [' + moveCol + ']' + '['  + moveRow +']':
                'Go to game start';
            if (moveIndex != curStep) {
                return (
                    <li key={moveIndex}>
                        <button onClick={() => this.jumpTo(moveIndex)}>{desc}</button>
                    </li>
                );
            }
            else {
                return (
                    <li key={moveIndex}>
                        <button onClick={() => this.jumpTo(moveIndex)}><b>{desc}</b></button>
                    </li>
                );
            }  
        })

        let status;
        if (winner) {
            status = 'Winner = ' + winner;
        }
        else {
            status = 'Next player ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
        <div className="game">
            <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
            />
            </div>
            <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            </div>
        </div>
        );
    }
}   

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; ++i) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
  
  // ========================================
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
  