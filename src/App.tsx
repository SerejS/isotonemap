import React from 'react';
import {InputPanel} from "./panel/InputPanel";
import {DiagramView} from "./DiagramView";
import {MathComponent} from "mathjax-react";

export function new_matrix(size: Readonly<number> | number): number[][] {
    return Array.from(Array(size), () => new Array(size).fill(0))
}

class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            size: 10,
            connections: new_matrix(10),
        };

        this.setConnections = this.setConnections.bind(this);
        this.start = this.start.bind(this);
        this.reset = this.reset.bind(this);
        this.resize = this.resize.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    setConnections(connections: number[][]) {
        this.setState({connections: connections});
    }

    start() {
        // this.setState({started: true});
    }


    reset() {
        this.setConnections(new_matrix(this.state.size));
    }

    resize(size: number) {
        size = (isNaN(size)) ? this.props.size : Math.abs(size);

        const minSize = 1;
        const maxSize = 23;
        if (size > maxSize || size < minSize) return;

        this.setState({
            size: size,
            connections: new_matrix(size)
        });
    }

    onClick(row: number, column: number) {
        //TODO: Validation
        if (row == column) return;

        let board = this.state.connections;
        board[row][column] = (board[row][column] === 0) ? 1 : 0;
        this.setState({connections: board});
    }


    render() {
        return (
            <div className="App section">
                <div className={"columns"}>
                    <div className={"column"}>
                        <InputPanel
                            board={this.state.connections}
                            setConnections={this.setConnections}
                            onClick={this.onClick}
                            start={this.start}
                            reset={this.reset}
                            resize={this.resize}
                            size={this.state.size}
                        />
                    </div>
                    <div className={"column"}>
                        <DiagramView connections={this.state.connections}/>
                    </div>
                </div>

                <ResultTable connections={this.state.connections}/>

            </div>
        );
    }
}

class ResultTable extends React.Component <{ connections: number[][] }, { naturalMapping: any[] }> {

    constructor(props: { connections: number[][] }) {
        super(props);

        this.state = {
            naturalMapping: new Array(props.connections.length).fill('?'),
        };
    }

    render() {
        return <div className="table-container">
            <table className="table">
                <tbody>
                {(() => {
                    return <>
                        <tr>
                            {(() => {
                                const arr = [];
                                for (let i = 1; i <= this.props.connections.length; i++) {
                                    arr.push(<td key={'res-header-' + i}>
                                        <MathComponent tex={String.raw`a_{${i}}`}/>
                                    </td>);
                                }
                                return arr;
                            })()}
                        </tr>

                        <tr>
                            {(() => {
                                const arr = [];
                                for (let i = 0; i < this.props.connections.length; i++) {
                                    arr.push(
                                        <td key={'res-content-' + i}>
                                            {/*{this.state.naturalMapping[i]}*/}
                                            ?
                                        </td>);
                                }
                                return arr;
                            })()}
                        </tr>
                    </>
                })()}
                </tbody>
            </table>
        </div>;
    }
}


export default App;
