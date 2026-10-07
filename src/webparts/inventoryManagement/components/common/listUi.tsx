// Shared building blocks for the record pages (incidents, replacements, returns):
// status chips, filter strip, record cards and the board layout.
import * as React from 'react';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { Icon } from '@fluentui/react/lib/Icon';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';
import { ITone, TONES } from '../inventory/inventoryUi';

/** Solid colours for the status dots on chips and board lanes. */
export const ACCENTS = { red: '#d13438', amber: '#eaa300', orange: '#f7630c', blue: '#0f6cbd', green: '#107c10', grey: '#8a8886' };

const LINE = 'rgba(128, 128, 128, 0.22)';
const FOCUS = { outline: '2px solid #0f6cbd', outlineOffset: 2 };

export const recordCss = mergeStyleSets({
  root: { color: 'var(--text-main, #242424)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap', marginBottom: 14 },
  title: { margin: 0, fontSize: 22, fontWeight: 600, lineHeight: '28px' },
  subtitle: { margin: '4px 0 0', fontSize: 14, color: 'var(--text-muted, #616161)' },

  switch: { display: 'inline-flex', padding: 3, borderRadius: 10, background: 'rgba(128, 128, 128, 0.14)' },
  switchButton: {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: 'none', borderRadius: 8,
    background: 'transparent', cursor: 'pointer', font: 'inherit', fontSize: 13, fontWeight: 600, color: 'var(--text-muted, #616161)',
    selectors: { ':hover': { color: 'var(--text-main, #242424)' }, ':focus-visible': FOCUS }
  },
  switchActive: { background: 'var(--surface-bg, #ffffff)', color: 'var(--text-main, #242424)', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.16)' },

  chips: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: {
    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 8px 6px 12px', borderRadius: 999,
    border: `1px solid ${LINE}`, background: 'var(--surface-bg, #ffffff)', cursor: 'pointer',
    font: 'inherit', fontSize: 13, fontWeight: 600, color: 'inherit',
    selectors: { ':hover': { borderColor: 'rgba(128, 128, 128, 0.6)' }, ':focus-visible': FOCUS }
  },
  chipActive: { background: '#0f6cbd', borderColor: '#0f6cbd', color: '#ffffff', selectors: { ':hover': { borderColor: '#0f6cbd' } } },
  chipCount: { fontSize: 12, fontWeight: 600, minWidth: 22, textAlign: 'center', padding: '0 7px', borderRadius: 999, background: 'rgba(128, 128, 128, 0.18)', lineHeight: '20px', boxSizing: 'border-box' },
  chipCountActive: { background: 'rgba(255, 255, 255, 0.25)' },
  dot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },

  filters: { display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap', padding: '12px 14px', borderRadius: 12, background: 'rgba(128, 128, 128, 0.08)', marginBottom: 12 },
  search: { flex: '1 1 240px', minWidth: 200 },
  resultLine: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, minHeight: 32, fontSize: 13, color: 'var(--text-muted, #616161)', margin: '0 0 8px' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: 14 },
  pager: { marginTop: 14 },
  card: {
    display: 'flex', flexDirection: 'column', flexShrink: 0, gap: 8, minWidth: 0, padding: '14px 16px 12px',
    borderRadius: 12, border: `1px solid ${LINE}`, background: 'var(--surface-bg, #ffffff)', cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', transition: 'box-shadow 0.15s ease, transform 0.15s ease', overflow: 'hidden',
    selectors: { ':hover': { boxShadow: '0 6px 18px rgba(0, 0, 0, 0.12)', transform: 'translateY(-1px)' } }
  },
  cardCompact: { padding: '10px 12px 8px', gap: 6, boxShadow: 'none' },
  cardTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' },
  cardId: { fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', color: 'var(--text-muted, #616161)' },
  cardPills: { display: 'inline-flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' },
  cardTitle: { margin: 0, fontSize: 15, fontWeight: 600, lineHeight: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  cardText: { margin: 0, fontSize: 13, lineHeight: '18px', minHeight: 36, color: 'var(--text-muted, #616161)', overflow: 'hidden' },
  cardMeta: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 14px', fontSize: 12, color: 'var(--text-muted, #616161)' },
  metaItem: { display: 'inline-flex', alignItems: 'center', gap: 5, minWidth: 0 },
  cardActions: { display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', paddingTop: 10, marginTop: 'auto', borderTop: `1px solid ${LINE}`, cursor: 'default' },
  cardActionsCompact: { paddingTop: 4, gap: 4 },

  board: { display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(270px, 1fr)', gap: 12, overflowX: 'auto', paddingBottom: 4, alignItems: 'start' },
  lane: { display: 'flex', flexDirection: 'column', minWidth: 0, borderRadius: 12, background: 'rgba(128, 128, 128, 0.08)' },
  laneHead: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', fontSize: 13, fontWeight: 600 },
  laneBody: { display: 'flex', flexDirection: 'column', gap: 8, padding: '0 8px 8px', maxHeight: 620, overflowY: 'auto' },
  laneEmpty: { padding: '20px 8px', textAlign: 'center', fontSize: 12, color: 'var(--text-muted, #616161)' },

  pill: { fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 999, lineHeight: '18px', whiteSpace: 'nowrap', display: 'inline-block' },
  empty: { padding: '48px 16px', textAlign: 'center', color: 'var(--text-muted, #616161)', border: `1px dashed ${LINE}`, borderRadius: 12 }
});

/** Compact buttons for card footers. */
export const cardButtonStyles = { root: { height: 30, minWidth: 0, padding: '0 10px', borderRadius: 6 }, label: { fontSize: 12 } };

const TWO_LINES: React.CSSProperties = { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' };

export const Pill: React.FC<{ tone: ITone; text: string; title?: string }> = ({ tone, text, title }) => (
  <span className={recordCss.pill} style={{ background: tone.bg, color: tone.fg }} title={title}>{text}</span>
);

export interface IStatusChip {
  key: string;
  label: string;
  count: number;
  color?: string;
}

/** Rounded filter chips with counts; exactly one is selected. */
export const StatusChips: React.FC<{ chips: IStatusChip[]; selected: string; onSelect: (key: string) => void; ariaLabel: string }> = ({ chips, selected, onSelect, ariaLabel }) => (
  <div className={recordCss.chips} role="group" aria-label={ariaLabel}>
    {chips.map(chip => {
      const active = selected === chip.key;
      return (
        <button key={chip.key} type="button" className={`${recordCss.chip} ${active ? recordCss.chipActive : ''}`} aria-pressed={active} onClick={() => onSelect(chip.key)}>
          {chip.color && <span className={recordCss.dot} style={{ background: active ? '#ffffff' : chip.color }} />}
          {chip.label}
          <span className={`${recordCss.chipCount} ${active ? recordCss.chipCountActive : ''}`}>{chip.count}</span>
        </button>
      );
    })}
  </div>
);

export type RecordLayout = 'cards' | 'board';

export const LayoutSwitch: React.FC<{ layout: RecordLayout; onChange: (layout: RecordLayout) => void }> = ({ layout, onChange }) => {
  const s = strings.RecordLists;
  const options: { key: RecordLayout; icon: string; label: string }[] = [
    { key: 'cards', icon: 'GridViewMedium', label: s.ViewCards },
    { key: 'board', icon: 'TripleColumn', label: s.ViewBoard }
  ];
  return (
    <div className={recordCss.switch} role="group" aria-label={s.ViewAria}>
      {options.map(o => (
        <button key={o.key} type="button" className={`${recordCss.switchButton} ${layout === o.key ? recordCss.switchActive : ''}`} aria-pressed={layout === o.key} onClick={() => onChange(o.key)}>
          <Icon iconName={o.icon} aria-hidden="true" />{o.label}
        </button>
      ))}
    </div>
  );
};

/** The chosen layout, remembered per page in this browser. */
export const useRecordLayout = (pageKey: string): [RecordLayout, (layout: RecordLayout) => void] => {
  const storageKey = `inventory.recordLayout.${pageKey}`;
  const [layout, setLayout] = React.useState<RecordLayout>(() => {
    try {
      return window.localStorage.getItem(storageKey) === 'board' ? 'board' : 'cards';
    } catch {
      return 'cards';
    }
  });
  const change = (next: RecordLayout): void => {
    setLayout(next);
    try {
      window.localStorage.setItem(storageKey, next);
    } catch {
      // Storage unavailable: the choice just isn't remembered.
    }
  };
  return [layout, change];
};

export const MetaItem: React.FC<{ icon: string; title?: string }> = ({ icon, title, children }) => (
  <span className={recordCss.metaItem} title={title}>
    <Icon iconName={icon} aria-hidden="true" style={{ fontSize: 12 }} />{children}
  </span>
);

export interface IRecordCardProps {
  idText: string;
  badges?: React.ReactNode;
  title: string;
  text?: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  /** Board lanes use the smaller variant without the description. */
  compact?: boolean;
  onOpen: () => void;
}

/** One record. Clicking anywhere outside the footer buttons opens it. */
export const RecordCard: React.FC<IRecordCardProps> = (props) => (
  <div className={`${recordCss.card} ${props.compact ? recordCss.cardCompact : ''}`} onClick={props.onOpen}>
    <div className={recordCss.cardTop}>
      <span className={recordCss.cardId}>{props.idText}</span>
      {props.badges && <span className={recordCss.cardPills}>{props.badges}</span>}
    </div>
    <h4 className={recordCss.cardTitle} title={props.title}>{props.title}</h4>
    {!props.compact && <p className={recordCss.cardText} style={TWO_LINES} title={props.text}>{props.text || '—'}</p>}
    {props.meta && <div className={recordCss.cardMeta}>{props.meta}</div>}
    {props.actions && (
      <div className={`${recordCss.cardActions} ${props.compact ? recordCss.cardActionsCompact : ''}`} onClick={(e) => e.stopPropagation()}>
        {props.actions}
      </div>
    )}
  </div>
);

export interface IBoardLane<T> {
  key: string;
  label: string;
  color: string;
  items: T[];
}

/** Side-by-side lanes, one per status, each scrolling on its own. */
export function BoardLanes<T>(props: { lanes: IBoardLane<T>[]; keyOf: (item: T) => string; renderCard: (item: T) => React.ReactNode }): JSX.Element {
  return (
    <div className={recordCss.board}>
      {props.lanes.map(lane => (
        <section key={lane.key} className={recordCss.lane} aria-label={`${lane.label} (${lane.items.length})`}>
          <div className={recordCss.laneHead}>
            <span className={recordCss.dot} style={{ background: lane.color }} />
            {lane.label}
            <span className={recordCss.chipCount}>{lane.items.length}</span>
          </div>
          <div className={recordCss.laneBody}>
            {lane.items.length === 0
              ? <div className={recordCss.laneEmpty}>{strings.RecordLists.LaneEmpty}</div>
              : lane.items.map(item => <React.Fragment key={props.keyOf(item)}>{props.renderCard(item)}</React.Fragment>)}
          </div>
        </section>
      ))}
    </div>
  );
}

export const priorityTone = (priority?: string): ITone => {
  const p = (priority || 'Medium').toLowerCase();
  return p === 'high' || p === 'critical' ? TONES.red : p === 'low' ? TONES.blue : TONES.grey;
};

/** Open / Pending = red, In Progress = amber, Resolved = green, Closed = grey. */
export const serviceStatusTone = (status?: string): ITone => {
  const s = (status || 'Open').toLowerCase();
  if (s.indexOf('progress') >= 0) return TONES.amber;
  if (s.indexOf('resolv') >= 0 || s.indexOf('complet') >= 0) return TONES.green;
  if (s.indexOf('closed') >= 0) return TONES.grey;
  return TONES.red;
};

/**
 * Reads a stored date. ISO and other machine formats go through Date; a day-first
 * "13/6/2026" or "13-06-2026" (what older rows hold) is read as day/month/year.
 */
export const parseFlexibleDate = (raw?: string): Date | undefined => {
  const text = (raw || '').trim();
  if (!text) return undefined;
  const dmy = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})(?:[,\sT]+(\d{1,2}):(\d{2}))?/.exec(text);
  if (dmy && Number(dmy[1]) > 12) {
    const d = new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]), Number(dmy[4] || 0), Number(dmy[5] || 0));
    return isNaN(d.getTime()) ? undefined : d;
  }
  const parsed = new Date(text);
  return isNaN(parsed.getTime()) ? undefined : parsed;
};

/** "6 Aug 2026", the raw text when it isn't a date, or "—". */
export const formatFlexibleDay = (raw?: string): string => {
  const d = parseFlexibleDate(raw);
  return d ? d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : ((raw || '').trim() || '—');
};

export const formatFlexibleDateTime = (raw?: string): string => {
  const d = parseFlexibleDate(raw);
  return d ? d.toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ((raw || '').trim() || '—');
};

/** "Today", "3 days ago", "2 months ago". */
export const relativeDay = (raw?: string, now: Date = new Date()): string | undefined => {
  const d = parseFlexibleDate(raw);
  if (!d) return undefined;
  const s = strings.RecordLists;
  const days = Math.floor((new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() - new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) / 86400000);
  if (days < 0) return undefined;
  if (days === 0) return s.Today;
  if (days === 1) return s.Yesterday;
  if (days < 60) return formatString(s.DaysAgo, days);
  return formatString(s.MonthsAgo, Math.floor(days / 30));
};

/** Milliseconds for sorting; undated records sort as the oldest. */
export const timeOf = (raw?: string): number => {
  const d = parseFlexibleDate(raw);
  return d ? d.getTime() : 0;
};

export type DateRangeKey = 'all' | '7' | '30' | '90' | 'year';

export const dateRangeOptions = (): IDropdownOption[] => {
  const s = strings.RecordLists;
  return [
    { key: 'all', text: s.RangeAll },
    { key: '7', text: formatString(s.RangeLastDays, 7) },
    { key: '30', text: formatString(s.RangeLastDays, 30) },
    { key: '90', text: formatString(s.RangeLastDays, 90) },
    { key: 'year', text: s.RangeThisYear }
  ];
};

/** Undated rows only match "All time". */
export const inDateRange = (raw: string | undefined, range: DateRangeKey, now: Date = new Date()): boolean => {
  if (range === 'all') return true;
  const d = parseFlexibleDate(raw);
  if (!d) return false;
  if (range === 'year') return d.getFullYear() === now.getFullYear();
  return now.getTime() - d.getTime() <= Number(range) * 86400000;
};
