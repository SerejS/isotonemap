import React, {Dispatch, SetStateAction} from 'react';
import {Control} from './Control'
import {Board} from './Board'
import '../style.sass';


function new_matrix(size: Readonly<number> | number): number[][] {
    return Array.from(Array(size), () => new Array(size).fill(0))
}

export class InputPanel extends React.Component<
    {
        size: number,
        setNatural: Dispatch<SetStateAction<never[]>>,
        setConnections: Dispatch<SetStateAction<number[][]>>
    },
    { started: boolean, size: number, board: number[][] }> {
    constructor(props: any) {
        super(props);
        this.state = {
            started: false,
            board: new_matrix(props.size),
            size: props.size,
        }
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.reset = this.reset.bind(this);
        this.resize = this.resize.bind(this);
        this.update = this.update.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    start() {
        this.setState({
            started: true
        })
    }

    stop() {
        this.setState({
            started: false
        })
    }

    reset() {
        this.stop();
        this.setState({
            board: new_matrix(this.state.size)
        })
    }

    resize(size: number) {
        this.setState({size: (isNaN(size)) ? this.props.size : Math.abs(size)});
        this.reset();
    }

    componentDidMount() {
        setInterval(() => {
            if (this.state.started)
                this.update();
        }, 500)
    }


    update() {}

    onClick(row: number, column: number) {
        let board = this.state.board;
        board[row][column] = (board[row][column] === 0) ? 1 : 0;
        this.setState({
            board: board
        })
    }

    render() {
        return (
            <>
                <div className="columns">
                    <div className="column is-narrow">
                        <Board board={this.state.board} started={this.state.started} onClick={this.onClick}/>
                        <Control started={this.state.started} stop={this.stop} start={this.start} reset={this.reset}
                                 resize={this.resize} size={this.state.size}/>
                    </div>
                </div>
            </>
        )
    }
}
