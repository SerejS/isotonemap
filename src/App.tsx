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
            item_mapping: new Array(10).fill('?'),
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
        try {
            let result = this.stub(this.state.connections);
            this.setState({
                item_mapping: result.map(num => String(num))
            });
        } catch (e) {
            this.setState({item_mapping: new Array(this.state.size).fill('?')});
        }
    }

    // Stub for main logic
    stub(connections: number[][]): number[] {
        return Array.from({length: connections.length}, () => Math.floor(Math.random() * 40));
    }

    // Reset all state values to default
    reset() {
        this.setConnections(new_matrix(this.state.size));
        this.setState({
            item_levels: new Array(this.state.size).fill(0),
            item_children: new Array(this.state.size).fill([]),
            item_mapping: new Array(this.state.size).fill('?'),
        });
    }

    // Resize input board
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
            item_mapping: new Array(size).fill('?'),
        });
    }

    // Click on cell and redraw panel and diagram
    onClick(row: number, column: number) {
        let board: number[][] = [];
        for (let i = 0; i < this.state.connections.length; i++)
            board[i] = this.state.connections[i].slice();

        // Ignore locked cells
        if (board[row][column] === 2) return;

        // Diagram View properties
        let levels: number[] = [...this.state.item_levels];
        let children: number[][] = [...this.state.item_children];
        if (board[row][column] !== 0) {
            levels = new Array(this.state.size).fill(0);
            children = new Array(this.state.size).fill([]);
        }

        // if: create new connection, else: remove ex-connection
        if (board[row][column] === 0) this.onSelect(row, column, board, levels, children);
        else {
            let new_board = new_matrix(board.length);
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board.length; j++) {
                    if (i === row && j === column) continue;
                    if (board[i][j] === 1)
                        this.onSelect(i, j, new_board, levels, children);
                }
            }
            board = new_board;
        }

        this.setState({
            connections: board,
            item_levels: levels,
            item_children: children,
        });
    }

    // Select new cell
    onSelect(row: number, column: number, board: number[][], levels: number[], children: number[][]) {
        board[row][column] = (board[row][column] === 0) ? 1 : 0;

        // (Un)Lock symmetric
        if (board[row][column] === 1) board[column][row] = 2;
        else board[column][row] = 0;

        if (!board[row][column]) return;

        // Lock triangles
        for (let i = 0; i < board.length; i++) {
            // Hint: current parent - column
            if (board[i][column] === 1) {
                for (let j = 0; j < board.length; j++) {
                    if (board[j][column] !== 1 || i === j) continue;
                    board[i][j] = 2;
                }
            }

            // Hint: current child - row
            if (board[row][i] === 1) {
                for (let j = 0; j < board.length; j++) {
                    if (board[row][j] !== 1 || i === j) continue;
                    board[i][j] = 2;
                }
            }
        }

        // Lock cycles
        // Lock children paths
        let allElements: number[] = [];
        let elementsQueue: number[] = [column];
        while (elementsQueue.length) {
            let element = elementsQueue[0];

            for (let i = 0; i < board.length; i++) {
                if (board[i][element] !== 1 || allElements.includes(i)) continue;
                allElements.push(i);
                elementsQueue.push(i);
                if (board[column][i] === 0) board[column][i] = 2;
                if (board[i][column] === 0) board[i][column] = 2;
            }

            elementsQueue.shift();
        }

        // Lock parents paths
        allElements = [];
        elementsQueue = [row];
        while (elementsQueue.length) {
            let element = elementsQueue[0];

            for (let i = 0; i < board.length; i++) {
                if (board[element][i] !== 1 || allElements.includes(i)) continue;
                allElements.push(i);
                elementsQueue.push(i);
                if (board[row][i] === 0) board[row][i] = 2;
                if (board[i][row] === 0) board[i][row] = 2;
            }

            elementsQueue.shift();
        }


        // Restructure diagram
        const index: number = children[column].indexOf(row);
        if (index !== -1) children[column].splice(index, 1);
        else children[column] = [...children[column], row];

        let childrenLevels = children[column].map((element: number) => levels[element]);
        levels[column] = children[column].length ? Math.max(...childrenLevels) + 1 : 0;
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

                <ResultTable item_mapping={this.state.item_mapping}/>

            </div>
        );
    }
}

class ResultTable extends React.Component <{ item_mapping: string[] }, {}> {
    render() {
        return <div className="table-container">
            <table className="table">
                <tbody>
                {(() => {
                    return <>
                        <tr>
                            {(() => {
                                const arr = [];
                                for (let i = 1; i <= this.props.item_mapping.length; i++) {
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
                                for (let i = 0; i < this.props.item_mapping.length; i++) {
                                    arr.push(
                                        <td key={'res-content-' + i}>
                                            {this.props.item_mapping[i]}
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
