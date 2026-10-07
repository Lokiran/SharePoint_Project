// The Event Stream's activity feed: a day-by-day timeline of events, plus the summary strip above it.
import * as React from 'react';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { Icon } from '@fluentui/react/lib/Icon';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';
import { IEventLog } from '../../models/IEventLog';
import { EventActionBadge, eventActionStyle } from '../EventActionBadge';

const LINE = 'rgba(128, 128, 128, 0.22)';
const MUTED = 'var(--text-muted, #616161)';
const MONO = 'Consolas, "Cascadia Mono", "Courier New", monospace';
const TIME_W = 60;
const NODE = 28;
const PULSE_DAYS = 14;

const css = mergeStyleSets({
  pulse: {
    display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px 32px',
    padding: '14px 18px', borderRadius: 12, background: 'rgba(128, 128, 128, 0.08)', marginBottom: 16
  },
  stats: { display: 'flex', flexWrap: 'wrap', gap: '12px 32px' },
  statValue: { display: 'block', fontSize: 24, fontWeight: 600, lineHeight: '30px' },
  statLabel: { display: 'block', fontSize: 12, color: MUTED },
  chart: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 },
  bars: { display: 'flex', alignItems: 'flex-end', gap: 4, height: 44 },
  bar: { width: 10, borderRadius: 3, background: '#0f6cbd' },
  barEmpty: { background: 'rgba(128, 128, 128, 0.3)' },
  chartLabel: { fontSize: 11, color: MUTED },

  day: {
    display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12,
    padding: '0 0 6px', margin: '20px 0 4px', borderBottom: `1px solid ${LINE}`
  },
  dayFirst: { marginTop: 0 },
  dayRelative: { fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginRight: 8 },
  dayName: { fontSize: 13, fontWeight: 600, color: MUTED },
  dayCount: { fontSize: 12, color: MUTED, whiteSpace: 'nowrap' },

  track: { position: 'relative' },
  list: { listStyle: 'none', margin: 0, padding: 0 },
  // The vertical line the event markers sit on.
  rail: { position: 'absolute', left: TIME_W + 12 + NODE / 2 - 1, top: 14, bottom: 14, width: 2, background: LINE },
  row: {
    position: 'relative', display: 'grid', gridTemplateColumns: `${TIME_W}px ${NODE}px minmax(0, 1fr) 16px`, columnGap: 12, alignItems: 'start',
    width: '100%', padding: '10px 10px 10px 0', border: 'none', borderRadius: 10, background: 'transparent',
    cursor: 'pointer', font: 'inherit', color: 'inherit', textAlign: 'left',
    selectors: { ':hover': { background: 'rgba(128, 128, 128, 0.07)' }, ':focus-visible': { outline: '2px solid #0f6cbd', outlineOffset: -2 } }
  },
  time: { fontFamily: MONO, fontSize: 12, lineHeight: '16px', color: MUTED, textAlign: 'right', paddingTop: 6, whiteSpace: 'nowrap' },
  timeDate: { display: 'block', fontSize: 11 },
  // The ring in the card colour hides the rail behind the marker.
  node: {
    position: 'relative', zIndex: 1, width: NODE, height: NODE, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, boxShadow: '0 0 0 4px var(--surface-bg, #ffffff)'
  },
  body: { minWidth: 0 },
  title: { display: 'block', fontSize: 14, fontWeight: 600, lineHeight: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  meta: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 10px', marginTop: 4, fontSize: 12, color: MUTED },
  metaItem: { display: 'inline-flex', alignItems: 'center', gap: 5, minWidth: 0 },
  details: { display: 'block', marginTop: 4, fontSize: 13, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  chevron: { fontSize: 11, color: MUTED, paddingTop: 8 },

  expanded: {
    margin: `0 10px 10px ${TIME_W + NODE + 24}px`, padding: '12px 14px', borderRadius: 10,
    background: 'rgba(128, 128, 128, 0.08)', fontSize: 13
  },
  fullDetails: { margin: '0 0 10px', lineHeight: '20px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
  facts: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px 16px', margin: 0 },
  factLabel: { fontSize: 11, color: MUTED, margin: 0 },
  factValue: { margin: '1px 0 0', fontWeight: 600, wordBreak: 'break-word' },
  mono: { fontFamily: MONO, fontSize: 12 }
});

/** Event timestamps are stored as local "YYYY-MM-DD HH:mm:ss". */
export const eventDate = (timestamp?: string): Date | undefined => {
  const text = (timestamp || '').trim();
  if (!text) return undefined;
  const d = new Date(text.replace(' ', 'T'));
  if (!isNaN(d.getTime())) return d;
  const fallback = new Date(text);
  return isNaN(fallback.getTime()) ? undefined : fallback;
};

const dayKey = (d?: Date): string => d ? `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` : 'unknown';

const daysAgo = (d: Date, now: Date): number =>
  Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() - new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) / 86400000);

// ---------- Summary strip ----------

export interface IActivityPulseProps {
  /** The events currently in view (after every filter). */
  logs: IEventLog[];
  /** Hides the people count for roles that may not see who did what. */
  showPeople: boolean;
}

/** Headline counts and a bar per day for the last two weeks. */
export const ActivityPulse: React.FC<IActivityPulseProps> = ({ logs, showPeople }) => {
  const t = strings.EventFeed;
  const now = new Date();
  const perDay: number[] = [];
  for (let i = 0; i < PULSE_DAYS; i++) perDay.push(0);
  let today = 0;
  logs.forEach(log => {
    const d = eventDate(log.timestamp);
    if (!d) return;
    const ago = daysAgo(d, now);
    if (ago === 0) today++;
    if (ago >= 0 && ago < PULSE_DAYS) perDay[PULSE_DAYS - 1 - ago]++;
  });
  const people = new Set(logs.map(l => (l.user || '').trim().toLowerCase()).filter(Boolean)).size;
  const peak = Math.max(...perDay, 1);
  const dayLabel = (index: number): string =>
    new Date(now.getFullYear(), now.getMonth(), now.getDate() - (PULSE_DAYS - 1 - index)).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

  const stats: { key: string; label: string; value: number }[] = [
    { key: 'events', label: t.StatEvents, value: logs.length },
    { key: 'today', label: t.StatToday, value: today },
    ...(showPeople ? [{ key: 'people', label: t.StatPeople, value: people }] : [])
  ];

  return (
    <div className={css.pulse}>
      <div className={css.stats}>
        {stats.map(stat => (
          <div key={stat.key}>
            <span className={css.statValue}>{stat.value}</span>
            <span className={css.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>
      <div className={css.chart}>
        <div className={css.bars} role="img" aria-label={`${t.ChartLast14}: ${perDay.join(', ')}`}>
          {perDay.map((count, i) => (
            <span
              key={i}
              className={`${css.bar} ${count === 0 ? css.barEmpty : ''}`}
              style={{ height: count === 0 ? 3 : Math.max(6, Math.round((count / peak) * 44)) }}
              title={formatString(t.BarTooltip, dayLabel(i), count)}
            />
          ))}
        </div>
        <span className={css.chartLabel}>{t.ChartLast14}</span>
      </div>
    </div>
  );
};

// ---------- Timeline ----------

export interface IEventTimelineProps {
  /** Events to show, already filtered, sorted and cut to the current page. */
  logs: IEventLog[];
  /** Day headings; only meaningful when the events are in date order. */
  groupByDay: boolean;
  /** Shows who did it and the full details (roles that may view the audit trail). */
  showAudit: boolean;
}

const Fact: React.FC<{ label: string; mono?: boolean }> = ({ label, mono, children }) => (
  <div>
    <dt className={css.factLabel}>{label}</dt>
    <dd className={`${css.factValue} ${mono ? css.mono : ''}`}>{children}</dd>
  </div>
);

export const EventTimeline: React.FC<IEventTimelineProps> = ({ logs, groupByDay, showAudit }) => {
  const [open, setOpen] = React.useState<{ [id: string]: boolean }>({});
  const now = new Date();

  // Consecutive events of the same day share a heading; without grouping there is a single, unnamed section.
  const sections: { key: string; date?: Date; events: IEventLog[] }[] = [];
  logs.forEach(log => {
    const date = eventDate(log.timestamp);
    const key = groupByDay ? dayKey(date) : 'all';
    const last = sections[sections.length - 1];
    if (last && last.key === key) last.events.push(log);
    else sections.push({ key, date, events: [log] });
  });

  const renderEvent = (log: IEventLog, index: number): JSX.Element => {
    // Identifies the event across pages, so an opened event stays open when paging back to it.
    const id = `${log.id}|${log.timestamp}|${log.action}`;
    const expanded = !!open[id];
    const style = eventActionStyle(log.action);
    const date = eventDate(log.timestamp);
    const showType = !!log.assetType && (log.assetType || '').toLowerCase() !== (log.assetName || '').toLowerCase();
    return (
      <li key={`${id}-${index}`}>
        <button type="button" className={css.row} aria-expanded={expanded} onClick={() => setOpen(prev => ({ ...prev, [id]: !prev[id] }))}>
          <span className={css.time}>
            {!groupByDay && date && <span className={css.timeDate}>{date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>}
            {date ? date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '—'}
          </span>
          <span className={css.node} style={{ background: style.bg, color: style.fg }} aria-hidden="true"><Icon iconName={style.icon} /></span>
          <span className={css.body}>
            <span className={css.title} title={log.title}>{log.title || log.assetName || '—'}</span>
            <span className={css.meta}>
              <EventActionBadge action={log.action} />
              <span className={css.metaItem}><Icon iconName={log.entityType === 'Request' ? 'Send' : 'Devices3'} aria-hidden="true" />{log.entityType}{log.assetName ? ` · ${log.assetName}` : ''}</span>
              {showAudit && log.user && <span className={css.metaItem}><Icon iconName="Contact" aria-hidden="true" />{log.user}</span>}
            </span>
            {showAudit && log.details && !expanded && <span className={css.details}>{log.details}</span>}
          </span>
          <Icon iconName={expanded ? 'ChevronUp' : 'ChevronDown'} className={css.chevron} aria-hidden="true" />
        </button>
        {expanded && (
          <div className={css.expanded}>
            {showAudit && log.details && <p className={css.fullDetails}>{log.details}</p>}
            <dl className={css.facts}>
              <Fact label={strings.EventStream.ColumnTimestamp} mono>{date ? date.toLocaleString() : (log.timestamp || '—')}</Fact>
              {showAudit && <Fact label={strings.EventStream.ColumnUser}>{log.user || '—'}</Fact>}
              <Fact label={strings.Columns.Type}>{log.entityType}</Fact>
              <Fact label={strings.Columns.AssetName}>{log.assetName || '—'}</Fact>
              {showType && <Fact label={strings.EventFilters.LabelAssetType}>{log.assetType}</Fact>}
              {log.entityId && <Fact label={strings.EventFeed.LabelReference} mono>{log.entityId}</Fact>}
            </dl>
          </div>
        )}
      </li>
    );
  };

  return (
    <div>
      {sections.map((section, sectionIndex) => {
        const ago = section.date ? daysAgo(section.date, now) : -1;
        const relative = ago === 0 ? strings.RecordLists.Today : ago === 1 ? strings.RecordLists.Yesterday : '';
        return (
          <section key={`${section.key}-${sectionIndex}`}>
            {groupByDay && (
              <div className={`${css.day} ${sectionIndex === 0 ? css.dayFirst : ''}`}>
                <h4 style={{ margin: 0, fontWeight: 'inherit' }}>
                  {relative && <span className={css.dayRelative}>{relative}</span>}
                  <span className={css.dayName}>
                    {section.date ? section.date.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : strings.Common.Unknown}
                  </span>
                </h4>
                <span className={css.dayCount}>{formatString(strings.EventFeed.DayEvents, section.events.length)}</span>
              </div>
            )}
            <div className={css.track}>
              <span className={css.rail} aria-hidden="true" />
              <ul className={css.list}>{section.events.map(renderEvent)}</ul>
            </div>
          </section>
        );
      })}
    </div>
  );
};
