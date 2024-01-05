import React, {RefObject} from "react";

import * as echarts from 'echarts/core';
import {GraphChart} from 'echarts/charts';
import {TooltipComponent, TitleComponent} from 'echarts/components';
import {GridComponent, LegendComponent} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import {EChartsOption} from "echarts-for-react";

echarts.use([GraphChart, TooltipComponent, TitleComponent, GridComponent, LegendComponent, CanvasRenderer]);


export class DiagramView extends React.Component<
    { connections: number[][] | undefined }, { connections: number[][] | undefined }> {

    chartRef: RefObject<HTMLDivElement>;
    chart?: echarts.ECharts;

    constructor(props: any) {
        super(props);
        this.chartRef = React.createRef();
        this.setState({
            connections: props.connections
        })
    }

    componentDidMount() {
        this.initChart();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        if (this.chart) this.chart.dispose();
    }

    handleResize = () => {
        if (this.chart) this.chart.resize();
    };

    initChart = () => {
        if (!this.chartRef.current) return;
        this.chart = echarts.init(this.chartRef.current);

        const options: EChartsOption = {
            title: {
                text: 'Диаграмма УМ'
            },
            tooltip: {},
            animationDurationUpdate: 100,
            animationEasingUpdate: 'quinticInOut',
            color: 'black',
            series: [
                {
                    type: 'graph',
                    layout: 'none',
                    symbolSize: 25,
                    roam: false,
                    label: {show: true},
                    edgeSymbol: ['circle'],
                    edgeSymbolSize: [1, 10],
                    data: [
                        {name: 1, x: 550, y: 1300},
                        {name: 2, x: 550, y: 1100},
                        {name: 3, x: 550, y: 900},
                        {name: 4, x: 550, y: 700},
                        {name: 5, x: 1000, y: 300},
                        {name: 6, x: 300, y: 300},
                        {name: 7, x: 550, y: 100}
                    ],
                    links: [
                        {source: 0, target: 3},
                        {source: 0, target: 1},
                        {source: 0, target: 1},
                        {source: 3, target: 4},
                        {source: 3, target: 5},
                        {source: 5, target: 6}
                    ],
                    lineStyle: {
                        opacity: 1,
                        width: 1.5,
                        color: 'black',
                        curveness: 0
                    },
                    emphasis: false,
                    force: {repulsion: 1000},
                    draggable: true,
                    silent: true
                }
            ]
        };

        if (this.chart) this.chart.setOption(options);


    };

    render() {
        return <div ref={this.chartRef} style={{width: '100%', height: '100%'}}></div>;
    }
}