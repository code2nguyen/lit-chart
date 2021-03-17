import {
  LitElement,
  html,
  css,
  property,
  customElement,
  query,
} from "lit-element";
import { createChart } from "../src";
import { axis } from "../src/geoms/axis";
import { data } from "./data";
@customElement("demo-app")
export class DemoApp extends LitElement {
  @property({ type: String }) title = "My app";

  @query("#chart") chartContainer!: HTMLElement;

  content = html`Rendering...`;
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
  }

  firstUpdated() {
    const chart = createChart(this.chartContainer, data, {
      xField: "name",
      yField: "pv",
    });

    chart.pipe(axis()).subscribe((context) => {
      console.log(context.template);
      this.content = context.litTemplate;
      this.requestUpdate();
    });
  }

  render() {
    return html`<div id="chart">${this.content}</div>`;
  }
}
