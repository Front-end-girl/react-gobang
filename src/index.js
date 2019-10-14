import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// class Square extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             value: null
//         }
//     }
//     render() {
//         return (
//             <button
//                 className="square"
//                 onClick={() => { this.props.onClick() }}>
//                 {this.props.value}
//             </button>
//         );
//     }
// }
function Square(props) {
    return (
        <span
            className="square"
            onClick={props.onClick}>
            {props.value}
        </span>
    )
}
class Board extends React.Component {
    renderSquare(i) {
        return <Square
            key={i}
            value={this.props.squares[i].name}
            onClick={() => this.props.onClick(i)}
        />;
    }

    render() {
        // let form = this.props.form.map()
        let row = Array(this.props.form[0]).fill('row')
        let column = Array(this.props.form[1]).fill('column')

        let item = row.map((item, index) => {
            let start = column.length * index
            let columnoItem = column.map((item, c_index) => {
                return (
                    this.renderSquare(start + c_index)
                )
            })
            return (
                <div className="board-row" key={index}>{columnoItem}</div>
            )
        })
        return (
            <div>
                <div className="status">{this.props.status}</div>
                <div>{item}</div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        // 在 JavaScript class 中，每次你定义其子类的构造函数时，都需要调用 super 方法。因此，在所有含有构造函数的的 React 组件中，构造函数必须以 super(props) 开头。
        super(props)
        this.state = {
            form: [3, 3],
            history: [
                {
                    location: [],
                    index: 0,
                    squares: Array(9).fill({
                        name: '',
                        location: []
                    })
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            upFlag: true,
            val: 0
        }
        this.initCanvas = this.initCanvas.bind(this)
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1]
        let squares = JSON.parse(JSON.stringify(current.squares));
        let location = [Math.floor(i / 3) + 1, (i + 1) % 3 === 0 ? 3 : (i + 1) % 3]

        //        说明
        // 请注意，该方法并不会修改数组，而是返回一个子数组。如果想删除数组中的一段元素，应该使用方法 Array.splice()。
        // this.setState({squares[i]:}) 报错
        if (calculateWinner(squares) || squares[i].name) {
            return;
        }

        squares[i].name = this.state.xIsNext ? 'X' : 'O';
        squares[i].location = location
        let Val = this.state.val + 1
        this.setState({
            val: Val,
            history: history.concat([{
                location: location,
                index: Val,
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            test: '',
            moves: ''
        });
    }
    jumpTo(i) {
        console.log(i)
        if(i===0){
            this.initCanvas()
        }
        this.setState({
            stepNumber: i,
            xIsNext: (i % 2) === 0 //如果是偶数下一位就是奇数 true 对应X
        })
    }
    historyUpandLower(type) {
        this.render(type)
    }
    historyShow(history) {
        console.log(history)
        return history.map((item, index) => {
            const desc = index ? `Go to move #${item.index}` : 'Go to game start'
            const active = this.state.stepNumber === item.index ? "active" : ""
            return (
                <li key={index}>
                    <button className={active} onClick={() => this.jumpTo(item.index)}>{desc}</button>
                    <span>{item.location.length > 0 ? JSON.stringify(item.location) : ''}</span>
                </li>
            )
        })
    }
    initCanvas(a, b, d) {
        if (!b) return
        var c = document.querySelector('#mycanvas');
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, 105, 105);
        ctx.rect(0, 0, 105, 105);
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "red"; // 红色路径
        let Val = b - a
        console.log(Val)
        switch (Val) {
            case 1:
                switch (a) {
                    case 0:
                       
                        ctx.moveTo(0, 17);
                        ctx.lineTo(105, 17);
                        break;
                    case 3:
                        ctx.moveTo(0, 51);
                        ctx.lineTo(105, 51);
                        break;
                    case 6:
                        ctx.moveTo(0, 85);
                        ctx.lineTo(105, 85);
                        break;
                    default:
                        break;
                }
                break;
            case 2:
                ctx.moveTo(105, 0);
                ctx.lineTo(0, 105);
                break;
            case 3:
                switch (a) {
                    case 0:
                        console.log(a)
                        ctx.moveTo(17, 0);
                        ctx.lineTo(17, 105);
                        break;
                    case 1:
                        ctx.moveTo(51, 0);
                        ctx.lineTo(51, 105);
                        break;
                    case 2:
                        ctx.moveTo(85, 0);
                        ctx.lineTo(85, 105);
                        break;
                    default:
                        break;
                }
                break;
            case 4:
                ctx.moveTo(0, 0);
                ctx.lineTo(105, 105);
                break;

            default:
                break;
        }

        ctx.stroke();

    }
    render(type) {
        let that = this
        let moves
        let history = this.state.history;
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)
        let status;
        let winterFlag
        if (type === 0 || type === 1) {
            let _history = JSON.parse(JSON.stringify(this.state.history))
            let _shift = _history.splice(0, 1)

            _history.sort((a, b) => {
                return type === 0 ? b.index - a.index : a.index - b.index
            })
            _history.unshift(..._shift)

            this.setState({
                moves: this.historyShow(_history)
            })


        } else {
            if (winner) {
                status = 'Winner: ' + winner.name;
                that.initCanvas(...winner.location)
                winterFlag = 'display-block'
            } else {
                if (isequal(current.squares)) {
                    status = 'equal';
                } else {
                    status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
                }


            }
            moves = this.historyShow(history)
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        form={this.state.form}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        status={status}
                    />
                    <canvas className={winterFlag} id='mycanvas'></canvas>
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{moves}</ol>
                    <ol>{this.state.moves}</ol>
                    <button onClick={(i) => this.historyUpandLower(1)}>
                        升序历史记录
                    </button>
                    <button onClick={(i) => this.historyUpandLower(0)}>
                        降序历史记录
                    </button>
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
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a].name && squares[a].name === squares[b].name && squares[a].name === squares[c].name) {
            return {
                name: squares[a].name,
                location: [a, b, c]
            };
        }
    }

    return null;
}
function isequal(arg) {
    arg = arg.filter((item) => !item.name)
    if (arg.length === 0) {
        return !arg.length
    }
}
// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


// 总结：全局变量