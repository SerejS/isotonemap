import React from 'react';
import {InputPanel} from "./panel/InputPanel";
import {DiagramView} from "./DiagramView";
import {MathComponent} from "mathjax-react";

export function new_matrix(size: Readonly<number> | number): number[][] {
    let arr = Array.from(Array(size), () => new Array(size).fill(0));
    for (let i = 0; i < arr.length; i++) arr[i][i] = 2;
    return arr;
}

class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            size: 10,
            connections: new_matrix(10),
            item_levels: new Array(10).fill(0),
            item_children: new Array(10).fill([]),
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
        this.setState({
            item_levels: new Array(this.state.size),
            item_children: new Array(this.state.size).fill([]),
        });
    }

    resize(size: number) {
        size = (isNaN(size)) ? this.props.size : Math.abs(size);

        const minSize = 1;
        const maxSize = 23;
        if (size > maxSize || size < minSize) return;

        this.setState({
            size: size,
            connections: new_matrix(size),
            item_levels: new Array(size).fill(0),
            item_children: new Array(size).fill([]),
        });
    }

    onClick(row: number, column: number) {
        //TODO: Validation
        if (row === column) return;

        let board = this.state.connections;
        board[row][column] = (board[row][column] === 0) ? 1 : 0;

        // Block symmetric
        if (board[row][column] === 1) board[column][row] = 2;
        else board[column][row] = 0;

        /*let triangles = []
        for (let i = 0; i < board.length; i++)
            if (board[i][column]) triangles.push(i);
        // for (let i = 0; i < board.length; i++)
        //     if (board[row][i]) triangles.push(i);

        for (let i = 0; i < triangles.length; i++) {
            for (let j = 1; j < triangles.length; j++) {
                board[triangles[i]][triangles[j]] = 2;
            }
        }*/

        // Restructure diagram
        let levels = [...this.state.item_levels];
        let children = [...this.state.item_children];

        const index: number = children[column].indexOf(row);
        if (index !== -1) children[column].splice(index, 1);
        else children[column] = [...children[column], row];

        let childrenLevels = children[column].map((element: number) => levels[element]);
        levels[column] = children[column].length ? Math.max(...childrenLevels) + 1 : 0;

        this.setState({
            connections: board,
            item_levels: levels,
            item_children: children,
        });
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
                        <DiagramView
                            item_children={this.state.item_children}
                            item_levels={this.state.item_levels}
                            connections={this.state.connections}/>
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
