import { LitElement, html, css, TemplateResult } from "lit";
import { property, customElement, query } from "lit/decorators.js";
import { interval, of, animationFrameScheduler } from "rxjs";
import { map, observeOn } from "rxjs/operators";

import { Chart } from "../src";
import { animation } from "../src/animation/animation";
import { axis } from "../src/geoms/axis";
import { bar } from "../src/geoms/bar";
import { path } from "../src/geoms/path";
import { dicreteScaleProvider } from "../src/scale/dicrete-scale";
import { linearScaleProvider } from "../src/scale/linear-scale";
import { data } from "./data";
@customElement("demo-app")
export class DemoApp extends LitElement {
  @property({ type: String }) title = "My app";

  @query("#chart") chartContainer!: HTMLElement;

  content: TemplateResult = html`Rendering...`;

  xLabel = (label: string) => {
    return label;
  };

  yLabel = (value: number) => {
    return value.toString();
  };

  chart: Chart = new Chart(this, "#chart", {
    xField: "name",
    yFields: ["pv"],
    xScaleProvider: dicreteScaleProvider({
      labelFunction: this.xLabel,
    }),
    yScaleProvider: linearScaleProvider({ labelFunction: this.yLabel }),
  });

  static styles = css`
    :host {
      height: 500px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      width: 500px;
      margin: 30px;
      text-align: center;
      background-color: var(--lit-chart-background-color);
    }
    #chart {
      flex: 1;
      width: 100%;
      height: 100%;
      font-size: 16px;
    }
    main {
      flex-grow: 1;
    }

    .logo > svg {
      margin-top: 36px;
      animation: app-logo-spin infinite 20s linear;
    }

    @keyframes app-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.initChart();
  }

  initChart() {
    this.chart.draw(animation({}), axis(), bar({}));
  }

  firstUpdated() {
    // const dataSource = interval(1000).pipe(
    //   map((_) => {
    //     data[0].pv = data[0].pv + 100;
    //     return [...data];
    //   }),
    //   observeOn(animationFrameScheduler)
    // );
    this.chart.setDataSource(data);
    // const chart = createChart(this.chartContainer, data, {
    //   xField: "name",
    //   yFields: ["pv"],
    //   xScaleProvider: dicreteScaleProvider({
    //     labelFunction: this.xLabel,
    //   }),
    //   yScaleProvider: linearScaleProvider({ labelFunction: this.yLabel }),
    // });
    // chart.pipe(animation({}), axis(), bar({})).subscribe((context) => {
    //   this.content = context.litTemplate;
    //   this.requestUpdate();
    // });
  }

  render() {
    return html`<div id="chart">${this.chart.template}</div>`;
  }
}
