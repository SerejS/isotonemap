import React, {RefObject} from "react";

import * as echarts from 'echarts/core';
import {GraphChart} from 'echarts/charts';
import {TooltipComponent, TitleComponent} from 'echarts/components';
import {GridComponent, LegendComponent} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import {EChartsOption} from "echarts-for-react";

echarts.use([GraphChart, TooltipComponent, TitleComponent, GridComponent, LegendComponent, CanvasRenderer]);


export class DiagramView extends React.Component<
    { connections: number[][] }, { }> {

    chartRef: RefObject<HTMLDivElement>;
    chart?: echarts.ECharts;

    constructor(props: any) {
        super(props);
        this.chartRef = React.createRef();
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
        this.chart?.dispose();
        this.chart = echarts.init(this.chartRef.current);


        let connections = this.props.connections;

        let node_data = [];
        let node_cons = [];

        let height_px = 1500;
        let width_px = 1000;
        let width_gap = width_px / connections.length;

        let pos_px = width_gap;
        for (let i = 0; i < connections.length; i++) {
            node_data.push({name: i + 1, x: pos_px, y: i * 100 % 300});
            pos_px += width_gap;
        }

        for (let i = 0; i < connections.length; i++) {
            for (let j = 0; j < connections.length; j++) {
                if (connections[i][j]) node_cons.push({source: i, target: j});
            }
        }

        const standartOptions: EChartsOption = {
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
                    data: node_data,
                    links: node_cons,
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

        if (this.chart) this.chart.setOption(standartOptions);
    };

    render() {
        this.initChart();
        return <div ref={this.chartRef} style={{width: '100%', height: '100%'}}></div>;
    }
}