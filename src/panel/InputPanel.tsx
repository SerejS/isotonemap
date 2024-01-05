import React from 'react';
import {Control} from './Control'
import {Board} from './Board'
import '../style.sass';


export class InputPanel extends React.Component<
    {
        board: number[][],
        setConnections: (matrix: number[][]) => void,
        onClick: (row: number, column: number) => void,
        start: () => void,
        reset: () => void,
        resize: (size: number) => void,
        size: number,
    }, {}> {

    componentDidMount() {
        setInterval(() => {
            // if (this.state.started)
            //     this.update();
        }, 500)
    }


    render() {
        return (
            <>
                <div className="columns">
                    <div className="column is-narrow">
                        <Board board={this.props.board} onClick={this.props.onClick}/>
                        <Control
                            start={this.props.start}
                            reset={this.props.reset}
                            resize={this.props.resize}
                            size={this.props.size}/>
                    </div>
                </div>
            </>
        )
    }
}
