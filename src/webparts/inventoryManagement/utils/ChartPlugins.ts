import { Chart, Plugin } from 'chart.js';

const FONT_FAMILY = "'Segoe UI', -apple-system, sans-serif";

/** Text colour inherited from the chart's container, so labels follow light/dark theme. */
const inheritedColor = (chart: Chart, fallback: string): string => {
  try {
    return window.getComputedStyle(chart.canvas).color || fallback;
  } catch {
    return fallback;
  }
};

export interface ICenterTotalOptions {
  /** Number drawn in the middle of a doughnut; omit to draw nothing. */
  value?: number;
}

/** Draws a total in the centre of a doughnut chart. Configure via `options.plugins.centerTotal`. */
export const centerTotalPlugin: Plugin<'doughnut'> = {
  id: 'centerTotal',
  afterDraw(chart: Chart<'doughnut'>, _args: unknown, options: ICenterTotalOptions) {
    if (options === undefined || options.value === undefined) return;
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    const x = (chartArea.left + chartArea.right) / 2;
    const y = (chartArea.top + chartArea.bottom) / 2;
    const size = Math.max(16, Math.min(chartArea.width, chartArea.height) / 7);

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = inheritedColor(chart, '#242424');
    ctx.font = `600 ${size}px ${FONT_FAMILY}`;
    ctx.fillText(String(options.value), x, y);
    ctx.restore();
  }
};

/** Writes each bar's value just above it. Enable via `options.plugins.barValueLabels: { enabled: true }`. */
export const barValueLabelsPlugin: Plugin<'bar'> = {
  id: 'barValueLabels',
  afterDatasetsDraw(chart: Chart<'bar'>, _args: unknown, options: { enabled?: boolean }) {
    if (!options || !options.enabled) return;
    const { ctx } = chart;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = inheritedColor(chart, '#616161');
    ctx.font = `600 11px ${FONT_FAMILY}`;
    chart.data.datasets.forEach((dataset, di) => {
      const meta = chart.getDatasetMeta(di);
      if (meta.hidden) return;
      meta.data.forEach((bar, i) => {
        const value = dataset.data[i];
        if (typeof value !== 'number' || value <= 0) return;
        ctx.fillText(String(value), bar.x, bar.y - 4);
      });
    });
    ctx.restore();
  }
};
