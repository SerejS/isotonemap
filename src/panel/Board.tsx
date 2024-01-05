import React from "react";
import {MathComponent} from "mathjax-react";


class Cell extends React.Component<{
    row: number; column: number; value: number;
    onClick?: ((row: number, column: number) => void);
    text?: string
}> {

    render() {
        let row: number = this.props.row;
        let column: number = this.props.column;
        return (
            <div key={String(row) + " " + String(column)}
                 className={"cell" + ((this.props.value === 1) ? " clicked" : "")}
                 onClick={() => {
                     if (this.props.onClick!) this.props.onClick!(row, column)
                 }}>
                {(() => this.props.text!
                    ? <div className={"signText"}><MathComponent tex={this.props.text}/></div>
                    : <></>)()}
            </div>
        )
    }
}

export class Board extends React.Component<{
    board: number[][],
    onClick: (row: number, column: number) => void
}> {
    render() {
        const board = this.props.board;
        let rows = [];

        let header = [];
        for (let c = 0; c <= board.length; c++)
            header.push(<Cell text={c > 0 ? `a_{${c}}` : ""} row={-1} column={-c} key={-c} value={0}/>);
        rows.push(<div className="row" key={'row-1'}>{header}</div>);


        for (let r = 0; r < board.length; r++) {
            let row = [
                <Cell text={`a_{${r + 1}}`} row={-1} column={-1} key={-1 * board[0].length - r - 1} value={0}/>];

            for (let c = 0; c < board[0].length; c++) {
                row.push(<Cell row={r} column={c}
                               key={(r << 16) + (c + 1)}
                               value={board[r][c]}
                               onClick={this.props.onClick}/>);
            }

            rows.push(<div className="row" key={r}>{row}</div>);
        }

        return <div className="board"> {rows} </div>
    }
}
