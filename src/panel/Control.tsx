import React from "react";

export class Control extends React.Component <
    {
        size: number, started: boolean,
        resize: (v: number) => void,
        stop: () => void, start: () => void, reset: () => void
    },
    { size: number }> {

    constructor(props: any) {
        super(props);
        this.state = {size: this.props.size};
        this.resize = this.resize.bind(this);
        this.setSize = this.setSize.bind(this);
    }

    resize() {
        this.props.resize(this.state.size)
    }

    setSize(e: any) {
        const targetEvent = e.target as HTMLInputElement;
        this.setState({size: parseInt(targetEvent.value)})
    }

    render() {
        return (
            <div className={"container"}>
                <div className="field">
                    <div className="label">Размер поля ввода</div>
                    <div className="field is-grouped">
                        <div className={"columns"}>
                            <div className="control column is-two-fifths">
                                <input id="board-size" className="input" onChange={this.setSize} type="text"
                                       placeholder="Количество"/>
                            </div>
                            <div className="control column is-half">
                                <button onClick={this.resize} className="button">Применить</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="field is-grouped">
                    <div className="control">
                        {(this.props.started) ?
                            <button onClick={this.props.stop} className="button is-danger">Стоп</button> :
                            <button onClick={this.props.start} className="button is-primary">Старт</button>}
                    </div>
                    <div className="control">
                        <button onClick={this.props.reset} className="button is-info">Сброс</button>
                    </div>
                </div>
            </div>
        )
    }
}