// Shared look for the Reports page: tab bar, KPI cards, chart cards, ranked bars,
// a sortable paged table and the Chart.js theme.
import * as React from 'react';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { Icon } from '@fluentui/react/lib/Icon';
import { DetailsList, DetailsListLayoutMode, SelectionMode, IColumn, IDetailsRowProps } from '@fluentui/react/lib/DetailsList';
import { Pager } from '../common/Pager';

const LINE = 'rgba(128, 128, 128, 0.22)';
const FOCUS = { outline: '2px solid #0f6cbd', outlineOffset: 2 };
const FONT_FAMILY = "'Segoe UI', -apple-system, sans-serif";

export const PALETTE = {
  blue: '#0f6cbd',
  green: '#107c10',
  amber: '#eaa300',
  orange: '#f7630c',
  red: '#d13438',
  purple: '#8764b8',
  teal: '#038387',
  grey: '#8a8886'
};

export const reportCss = mergeStyleSets({
  root: { color: 'var(--text-main, #242424)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap', marginBottom: 16 },
  title: { margin: 0, fontSize: 22, fontWeight: 600, lineHeight: '28px' },
  subtitle: { margin: '4px 0 0', fontSize: 14, color: 'var(--text-muted, #616161)' },

  tabs: { display: 'flex', flexWrap: 'wrap', gap: 4, padding: 4, borderRadius: 12, background: 'rgba(128, 128, 128, 0.12)', marginBottom: 20 },
  tab: {
    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', border: 'none', borderRadius: 9,
    background: 'transparent', cursor: 'pointer', font: 'inherit', fontSize: 13, fontWeight: 600, color: 'var(--text-muted, #616161)',
    selectors: { ':hover': { color: 'var(--text-main, #242424)' }, ':focus-visible': FOCUS }
  },
  tabActive: { background: 'var(--surface-bg, #ffffff)', color: 'var(--text-main, #242424)', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.16)' },

  kpis: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12, marginBottom: 20 },
  kpi: {
    display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, textAlign: 'left', padding: '14px 16px', borderRadius: 12,
    border: `1px solid ${LINE}`, background: 'var(--surface-bg, #ffffff)', font: 'inherit', color: 'inherit'
  },
  kpiClickable: {
    cursor: 'pointer', transition: 'box-shadow 0.15s ease, transform 0.15s ease',
    selectors: { ':hover': { boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)', transform: 'translateY(-1px)' }, ':focus-visible': FOCUS }
  },
  kpiTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontSize: 12, fontWeight: 600, color: 'var(--text-muted, #616161)' },
  kpiIcon: { width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 },
  kpiValue: { fontSize: 28, fontWeight: 600, lineHeight: '34px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  kpiHint: { fontSize: 12, color: 'var(--text-muted, #616161)' },
  meter: { display: 'block', height: 6, borderRadius: 999, background: 'rgba(128, 128, 128, 0.18)', overflow: 'hidden', margin: '4px 0 2px' },
  meterFill: { display: 'block', height: '100%', borderRadius: 999, background: PALETTE.blue },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 16 },
  card: { display: 'flex', flexDirection: 'column', minWidth: 0, padding: '16px 18px', borderRadius: 12, border: `1px solid ${LINE}`, background: 'var(--surface-bg, #ffffff)' },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  cardTitle: { margin: 0, fontSize: 15, fontWeight: 600 },
  cardSub: { margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted, #616161)' },
  link: {
    display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
    font: 'inherit', fontSize: 12, fontWeight: 600, color: PALETTE.blue, whiteSpace: 'nowrap',
    selectors: { ':hover': { textDecoration: 'underline' }, ':focus-visible': FOCUS }
  },
  // The colour is read by the chart plugins that draw text (centre total, bar values).
  chartBox: { position: 'relative', height: 260, color: 'var(--text-main, #242424)' },

  rank: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 },
  rankRow: {
    display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '5px 12px', alignItems: 'center', width: '100%',
    padding: 0, border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', textAlign: 'left'
  },
  rankClickable: { cursor: 'pointer', selectors: { ':hover': { color: PALETTE.blue }, ':focus-visible': FOCUS } },
  rankLabel: { fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  rankValue: { fontSize: 13, fontWeight: 600 },
  rankTrack: { gridColumn: '1 / -1', display: 'block', height: 6, borderRadius: 999, background: 'rgba(128, 128, 128, 0.18)', overflow: 'hidden' },
  rankFill: { display: 'block', height: '100%', borderRadius: 999 },

  toolbar: { display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap', padding: '12px 14px', borderRadius: 12, background: 'rgba(128, 128, 128, 0.08)', marginBottom: 12 },
  search: { flex: '1 1 240px', minWidth: 200 },
  resultLine: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap', minHeight: 32, fontSize: 13, color: 'var(--text-muted, #616161)', margin: '0 0 8px' },
  actions: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  section: { marginTop: 20 },

  tableCard: { border: `1px solid ${LINE}`, borderRadius: 12, background: 'var(--surface-bg, #ffffff)', overflowX: 'auto' },
  row: { cursor: 'pointer' },
  two: { minWidth: 0, display: 'block' },
  strong: { fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', color: 'var(--text-main, #242424)' },
  meta: { fontSize: 12, color: 'var(--text-muted, #616161)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' },
  cellText: { fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' },
  muted: { color: 'var(--text-muted, #616161)' },
  empty: { padding: '40px 16px', textAlign: 'center', fontSize: 13, color: 'var(--text-muted, #616161)', border: `1px dashed ${LINE}`, borderRadius: 12 },

  person: {
    display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px', border: 'none', background: 'transparent',
    cursor: 'pointer', font: 'inherit', color: 'inherit', textAlign: 'left',
    selectors: { ':hover': { background: 'rgba(128, 128, 128, 0.08)' }, ':focus-visible': { outline: '2px solid #0f6cbd', outlineOffset: -2 } }
  },
  personItem: { borderTop: `1px solid ${LINE}`, selectors: { ':first-child': { borderTop: 'none' } } },
  coin: { width: 34, height: 34, borderRadius: '50%', background: PALETTE.blue, color: '#ffffff', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  personText: { flex: '1 1 auto', minWidth: 0 },
  personPills: { display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' },
  personAssets: { padding: '0 16px 14px 62px' },
  assetLine: {
    display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) auto', gap: 12, alignItems: 'center', width: '100%',
    padding: '8px 10px', border: 'none', borderRadius: 8, background: 'transparent', cursor: 'pointer', font: 'inherit', fontSize: 13, color: 'inherit', textAlign: 'left',
    selectors: { ':hover': { background: 'rgba(128, 128, 128, 0.1)' }, ':focus-visible': FOCUS }
  }
});

export interface IReportTab {
  key: string;
  label: string;
  icon: string;
}

export const ReportTabs: React.FC<{ tabs: IReportTab[]; selected: string; onSelect: (key: string) => void; ariaLabel: string }> = ({ tabs, selected, onSelect, ariaLabel }) => (
  <div className={reportCss.tabs} role="tablist" aria-label={ariaLabel}>
    {tabs.map(tab => (
      <button
        key={tab.key}
        type="button"
        role="tab"
        aria-selected={selected === tab.key}
        className={`${reportCss.tab} ${selected === tab.key ? reportCss.tabActive : ''}`}
        onClick={() => onSelect(tab.key)}
      >
        <Icon iconName={tab.icon} aria-hidden="true" />{tab.label}
      </button>
    ))}
  </div>
);

export interface IKpi {
  key: string;
  icon: string;
  color: string;
  label: string;
  value: string | number;
  hint?: string;
  /** 0–100; draws a small meter under the value. */
  percent?: number;
  /** Makes the card a button (drill-down). */
  onClick?: () => void;
}

export const KpiCard: React.FC<{ kpi: IKpi }> = ({ kpi }) => {
  const body = (
    <>
      <span className={reportCss.kpiTop}>
        {kpi.label}
        <span className={reportCss.kpiIcon} style={{ background: `${kpi.color}1f`, color: kpi.color }} aria-hidden="true"><Icon iconName={kpi.icon} /></span>
      </span>
      <span className={reportCss.kpiValue}>{kpi.value}</span>
      {kpi.percent !== undefined && (
        <span className={reportCss.meter} aria-hidden="true"><span className={reportCss.meterFill} style={{ width: `${Math.max(0, Math.min(100, kpi.percent))}%` }} /></span>
      )}
      {kpi.hint && <span className={reportCss.kpiHint}>{kpi.hint}</span>}
    </>
  );
  return kpi.onClick ? (
    <button type="button" className={`${reportCss.kpi} ${reportCss.kpiClickable}`} onClick={kpi.onClick} aria-label={`${kpi.label}: ${kpi.value}. ${kpi.hint || ''}`}>{body}</button>
  ) : (
    <div className={reportCss.kpi}>{body}</div>
  );
};

export const KpiRow: React.FC<{ kpis: IKpi[] }> = ({ kpis }) => (
  <div className={reportCss.kpis}>{kpis.map(kpi => <KpiCard key={kpi.key} kpi={kpi} />)}</div>
);

export const ReportCard: React.FC<{ title: string; subtitle?: string; action?: { text: string; onClick: () => void } }> = ({ title, subtitle, action, children }) => (
  <section className={reportCss.card}>
    <div className={reportCss.cardHead}>
      <div>
        <h4 className={reportCss.cardTitle}>{title}</h4>
        {subtitle && <p className={reportCss.cardSub}>{subtitle}</p>}
      </div>
      {action && (
        <button type="button" className={reportCss.link} onClick={action.onClick}>
          {action.text}<Icon iconName="ChevronRight" style={{ fontSize: 10 }} aria-hidden="true" />
        </button>
      )}
    </div>
    {children}
  </section>
);

export interface IRankRow {
  key: string;
  label: string;
  value: number;
  onClick?: () => void;
}

/** Ranked horizontal bars: label, count and a bar relative to the largest row. */
export const RankList: React.FC<{ rows: IRankRow[]; color?: string; emptyText: string }> = ({ rows, color, emptyText }) => {
  if (rows.length === 0) return <div className={reportCss.empty}>{emptyText}</div>;
  const max = Math.max(...rows.map(r => r.value), 1);
  return (
    <ul className={reportCss.rank}>
      {rows.map(row => {
        const content = (
          <>
            <span className={reportCss.rankLabel} title={row.label}>{row.label}</span>
            <span className={reportCss.rankValue}>{row.value}</span>
            <span className={reportCss.rankTrack} aria-hidden="true">
              <span className={reportCss.rankFill} style={{ width: `${(row.value / max) * 100}%`, background: color || PALETTE.blue }} />
            </span>
          </>
        );
        return (
          <li key={row.key}>
            {row.onClick
              ? <button type="button" className={`${reportCss.rankRow} ${reportCss.rankClickable}`} onClick={row.onClick}>{content}</button>
              : <div className={reportCss.rankRow}>{content}</div>}
          </li>
        );
      })}
    </ul>
  );
};

export interface IReportColumn<T> {
  key: string;
  name: string;
  minWidth: number;
  maxWidth?: number;
  render: (row: T) => React.ReactNode;
  /** Makes the column sortable. */
  sortValue?: (row: T) => string | number;
}

export interface IReportTableProps<T> {
  rows: T[];
  columns: IReportColumn<T>[];
  keyOf: (row: T) => string;
  /** Opens the row (click or Enter). */
  onOpen?: (row: T) => void;
  /** Changes whenever the filters change, to go back to page 1. */
  resetKey: string;
  emptyText: string;
  ariaLabel: string;
}

const PAGE_SIZE = 10;

/** Sortable table, 10 rows per page. Rows arrive already filtered and in their default order. */
export function ReportTable<T>(props: IReportTableProps<T>): JSX.Element {
  const { rows, onOpen } = props;
  const [sort, setSort] = React.useState<{ key: string; desc: boolean } | undefined>();
  const [page, setPage] = React.useState(1);
  const sortKey = sort ? sort.key : '';
  const sortDesc = sort ? sort.desc : false;

  React.useEffect(() => setPage(1), [props.resetKey, sortKey, sortDesc]);

  if (rows.length === 0) return <div className={reportCss.empty}>{props.emptyText}</div>;

  const sortColumn = props.columns.filter(c => c.key === sortKey)[0];
  const valueOf = sortColumn ? sortColumn.sortValue : undefined;
  const sorted = valueOf ? rows.slice().sort((a, b) => {
    const va = valueOf(a), vb = valueOf(b);
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return sortDesc ? -cmp : cmp;
  }) : rows;

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const activePage = Math.min(page, totalPages);
  const visible = sorted.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);

  const columns: IColumn[] = props.columns.map(c => ({
    key: c.key,
    name: c.name,
    minWidth: c.minWidth,
    maxWidth: c.maxWidth,
    isResizable: true,
    isSorted: sortKey === c.key,
    isSortedDescending: sortKey === c.key && sortDesc,
    onColumnClick: c.sortValue ? () => setSort(prev => ({ key: c.key, desc: !!prev && prev.key === c.key ? !prev.desc : false })) : undefined,
    onRender: (row: T) => c.render(row)
  }));

  return (
    <div className={reportCss.tableCard}>
      <DetailsList
        items={visible}
        columns={columns}
        getKey={(row: T) => props.keyOf(row)}
        setKey={props.ariaLabel}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        ariaLabelForGrid={props.ariaLabel}
        onItemInvoked={onOpen ? (row: T) => onOpen(row) : undefined}
        onRenderRow={(rowProps?: IDetailsRowProps, defaultRender?: (p?: IDetailsRowProps) => JSX.Element | null) =>
          rowProps && defaultRender
            ? (onOpen ? <div className={reportCss.row} onClick={() => onOpen(rowProps.item as T)}>{defaultRender(rowProps)}</div> : defaultRender(rowProps))
            : null}
      />
      <Pager page={activePage} pageSize={PAGE_SIZE} totalItems={sorted.length} onChange={setPage} />
    </div>
  );
}

// ---------- Chart.js theme (same look as the dashboard charts) ----------

/** Gaps between slices in the card's background colour, so they follow dark mode. */
const cardBackground = (ctx: { chart: { canvas: HTMLCanvasElement } }): string => {
  try {
    return window.getComputedStyle(ctx.chart.canvas).getPropertyValue('--surface-bg').trim() || '#ffffff';
  } catch {
    return '#ffffff';
  }
};

export const ARC_STYLE = { borderColor: cardBackground, borderWidth: 2, hoverOffset: 6 };

const legend = {
  position: 'bottom' as const,
  labels: { boxWidth: 10, boxHeight: 10, padding: 14, usePointStyle: true, font: { family: FONT_FAMILY, size: 11 }, color: '#616161' }
};

const tooltip = {
  backgroundColor: '#ffffff',
  titleColor: '#242424',
  bodyColor: '#242424',
  borderColor: 'rgba(0,0,0,0.1)',
  borderWidth: 1,
  padding: 10,
  boxPadding: 6,
  cornerRadius: 8,
  usePointStyle: true,
  titleFont: { family: FONT_FAMILY, size: 12, weight: 'bold' as const },
  bodyFont: { family: FONT_FAMILY, size: 12 }
};

const ticks = { font: { family: FONT_FAMILY, size: 11 }, color: '#8a8886' };

/** Chart.js click / hover handlers for a drill-down: (dataIndex, datasetIndex). */
const pickHandlers = (onPick?: (index: number, datasetIndex: number) => void): { onClick?: unknown; onHover?: unknown } => onPick ? {
  onClick: (_event: unknown, elements: { index: number; datasetIndex: number }[]) => {
    if (elements && elements.length) onPick(elements[0].index, elements[0].datasetIndex);
  },
  onHover: (event: { native?: { target?: unknown } }, elements: unknown[]) => {
    const target = event.native && event.native.target as HTMLElement | undefined;
    if (target && target.style) target.style.cursor = elements && elements.length ? 'pointer' : 'default';
  }
} : {};

/** Doughnut with the total in the middle and "count · share" tooltips. */
export const doughnutOptions = (total: number, onPick?: (index: number) => void): unknown => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: {
    legend,
    centerTotal: { value: total },
    tooltip: {
      ...tooltip,
      callbacks: {
        label: (ctx: { raw: unknown; dataset: { data: number[] } }): string => {
          const sum = (ctx.dataset.data || []).reduce((acc: number, v: number) => acc + (Number(v) || 0), 0);
          return ` ${ctx.raw} · ${sum > 0 ? Math.round((Number(ctx.raw) / sum) * 100) : 0}%`;
        }
      }
    }
  },
  ...pickHandlers(onPick)
});

export const barOptions = (o: { stacked?: boolean; showLegend?: boolean; valueLabels?: boolean; onPick?: (index: number, datasetIndex: number) => void }): unknown => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { top: o.valueLabels ? 18 : 0 } },
  plugins: {
    legend: o.showLegend ? legend : { display: false },
    tooltip,
    barValueLabels: { enabled: !!o.valueLabels }
  },
  scales: {
    x: { stacked: !!o.stacked, grid: { display: false }, ticks },
    y: { stacked: !!o.stacked, beginAtZero: true, grid: { color: 'rgba(128,128,128,0.12)' }, ticks: { ...ticks, precision: 0 } }
  },
  ...pickHandlers(o.onPick)
});

export const BAR_STYLE = { borderRadius: 5, maxBarThickness: 48 };
