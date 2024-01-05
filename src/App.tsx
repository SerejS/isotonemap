import React, {useState} from 'react';
import {InputPanel} from "./panel/InputPanel";
import {DiagramView} from "./DiagramView";
import {MathComponent} from "mathjax-react";

function App() {
    const [connections, setConnections] = useState([
        [0, 1, 0],
        [0, 0, 1],
        [0, 0, 0],
    ]);

    const [naturalMapping, setNaturals] = useState([])

    return (
        <div className="App section">
            <div className={"columns"}>
                <div className={"column"}><InputPanel size={10} setNatural={setNaturals} setConnections={setConnections}/></div>
                <div className={"column"}><DiagramView connections={connections}/></div>
            </div>

            <div className="table-container">
                <table className="table">
                    <tbody>
                    {(() => {
                        return <>
                            <tr>
                                {(() => {
                                    const arr = [];
                                    for (let i = 1; i <= connections.length; i++) {
                                        arr.push(<td>
                                            <MathComponent tex={String.raw`a_{${i}}`}/>
                                        </td>);
                                    }
                                    return arr;
                                })()}
                            </tr>
                            <tr>
                                {(() => {
                                    const arr = [];
                                    for (let i = 0; i < connections.length; i++) {
                                        arr.push(
                                            <td>{naturalMapping! && naturalMapping.length === connections.length
                                                ? naturalMapping[i] : "?"}</td>);
                                    }
                                    return arr;
                                })()}
                            </tr>
                        </>
                    })()}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;
