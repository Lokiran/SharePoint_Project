import * as React from 'react';
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
  IGroup,
  IDetailsRowProps,
  ConstrainMode
} from '@fluentui/react/lib/DetailsList';
import { IGroupHeaderProps } from '@fluentui/react/lib/GroupedList';
import { SearchBox, Dropdown, IDropdownOption, PrimaryButton, ActionButton, Icon, Link } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';
import { IRequest } from '../../models/IRequest';
import { IInventoryItem } from '../../models/IInventoryItem';
import { getAppConfig } from '../../config/AppConfig';
import { evaluateRequestSla, IRequestSla } from '../../utils/RequestSlaUtils';
import { assetTypeIcon, assignableOfType, formatDay, initials, TONES, ITone } from '../inventory/inventoryUi';
import { Pager, buildPageGroups, IPagedGroupData } from '../common/Pager';

export interface IAssignmentQueueProps {
  /** Manager-approved requests (waiting for an asset, and already assigned). */
  requests: IRequest[];
  items: IInventoryItem[];
  actionInProgressId?: string;
  /** Opens the assignment panel for a waiting request. */
  onAssign: (request: IRequest) => void;
}

type View = 'waiting' | 'assigned' | 'all';
type QuickFilter = 'all' | 'ready' | 'noStock' | 'overdue';
type GroupBy = 'type' | 'employee' | 'priority' | 'none';
type SortKey = 'request' | 'employee' | 'type' | 'priority' | 'waiting';

interface IQueueRow {
  request: IRequest;
  assigned: boolean;
  sla: IRequestSla;
  stock: number;
  quantity: number;
}

const GROUP_STORAGE_KEY = 'assignmentQueue_groupBy';
const PAGE_SIZE = 10;
const PRIORITY_RANK: { [p: string]: number } = { high: 0, medium: 1, low: 2 };

const css = mergeStyleSets({
  root: { color: 'var(--text-main, #242424)' },
  header: { marginBottom: 16 },
  title: { margin: 0, fontSize: 22, fontWeight: 600, lineHeight: '28px' },
  subtitle: { margin: '4px 0 0', fontSize: 14, color: 'var(--text-muted, #616161)' },
  tiles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 16 },
  tile: {
    textAlign: 'left',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid rgba(0, 0, 0, 0.1)',
    background: 'var(--surface-bg, #ffffff)',
    cursor: 'pointer',
    font: 'inherit',
    color: 'inherit',
    selectors: { ':hover': { borderColor: 'rgba(0, 0, 0, 0.25)' }, ':focus-visible': { outline: '2px solid #0f6cbd', outlineOffset: 2 } }
  },
  tileActive: { borderColor: '#0f6cbd', boxShadow: 'inset 0 0 0 1px #0f6cbd', background: 'rgba(15, 108, 189, 0.05)' },
  tileLabel: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--text-muted, #616161)' },
  dot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  tileValue: { fontSize: 24, fontWeight: 600, lineHeight: '32px', marginTop: 4 },
  tileHint: { fontSize: 12, color: 'var(--text-muted, #616161)' },
  toolbar: { display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap', marginBottom: 12 },
  search: { flex: '1 1 260px', minWidth: 200 },
  resultLine: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted, #616161)', margin: '4px 0 8px' },
  card: { border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, overflow: 'hidden', background: 'var(--surface-bg, #ffffff)' },
  groupHeader: {
    display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px', border: 'none',
    borderTop: '1px solid rgba(0, 0, 0, 0.06)', background: 'rgba(0, 0, 0, 0.025)', cursor: 'pointer',
    font: 'inherit', color: 'inherit', textAlign: 'left',
    selectors: { ':hover': { background: 'rgba(0, 0, 0, 0.05)' }, ':focus-visible': { outline: '2px solid #0f6cbd', outlineOffset: -2 } }
  },
  groupName: { fontSize: 14, fontWeight: 600 },
  count: { fontSize: 12, fontWeight: 600, padding: '0 8px', borderRadius: 999, background: 'rgba(0, 0, 0, 0.07)', lineHeight: '20px' },
  groupMeta: { marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted, #616161)', display: 'flex', gap: 12, flexWrap: 'wrap' },
  crumb: { display: 'inline-flex', alignItems: 'center', gap: 5 },
  two: { minWidth: 0 },
  strong: { fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', color: 'var(--text-main, #242424)' },
  meta: { fontSize: 12, color: 'var(--text-muted, #616161)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' },
  person: { display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 },
  coin: { width: 28, height: 28, borderRadius: '50%', background: '#0f6cbd', color: '#fff', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  typeCell: { display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 },
  typeIcon: { width: 28, height: 28, borderRadius: 8, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 },
  pill: { fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 999, lineHeight: '18px', whiteSpace: 'nowrap' },
  row: { cursor: 'pointer' },
  rowStatic: { cursor: 'default' },
  empty: { padding: '48px 16px', textAlign: 'center', color: 'var(--text-muted, #616161)' }
});

const Pill: React.FC<{ tone: ITone; text: string }> = ({ tone, text }) => (
  <span className={css.pill} style={{ background: tone.bg, color: tone.fg }}>{text}</span>
);

const priorityTone = (p?: string): ITone => {
  const v = (p || 'Medium').toLowerCase();
  return v === 'high' ? TONES.red : v === 'low' ? TONES.blue : TONES.grey;
};

/** 5 h, 2 d 4 h, 12 d. */
const formatHours = (hours?: number): string => {
  if (hours === undefined) return '—';
  const s = strings.AssignmentQueue;
  if (hours < 1) return s.DurationUnderHour;
  if (hours < 24) return formatString(s.DurationHours, Math.floor(hours));
  const days = Math.floor(hours / 24);
  const rest = Math.floor(hours % 24);
  return days < 7 && rest ? formatString(s.DurationDaysHours, days, rest) : formatString(s.DurationDays, days);
};

/** The approver: the recorded manager name, else "Approved by X" in the comment, else the comment itself. */
const approverOf = (r: IRequest): string => {
  if (r.managerName) return r.managerName;
  const m = /approved by\s+(.+)/i.exec(r.managerResponse || '');
  return m ? m[1].trim() : (r.managerResponse || '').trim();
};

const readGroupBy = (): GroupBy => {
  try {
    const v = window.localStorage.getItem(GROUP_STORAGE_KEY);
    if (v === 'type' || v === 'employee' || v === 'priority' || v === 'none') return v;
  } catch {
    // Storage unavailable: use the default.
  }
  return 'type';
};

export const AssignmentQueue: React.FC<IAssignmentQueueProps> = (props) => {
  const { requests, items, actionInProgressId, onAssign } = props;
  const s = strings.AssignmentQueue;

  const [view, setView] = React.useState<View>('waiting');
  const [quick, setQuick] = React.useState<QuickFilter>('all');
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [groupBy, setGroupByState] = React.useState<GroupBy>(readGroupBy);
  const [collapsed, setCollapsed] = React.useState<{ [key: string]: boolean }>({});
  const [sort, setSort] = React.useState<{ key: SortKey; desc: boolean }>({ key: 'waiting', desc: true });
  const [page, setPage] = React.useState(1);

  // Back to the first page whenever what's listed changes.
  React.useEffect(() => setPage(1), [search, view, quick, typeFilter, groupBy, sort.key, sort.desc]);

  const setGroupBy = (value: GroupBy): void => {
    setGroupByState(value);
    setCollapsed({});
    try { window.localStorage.setItem(GROUP_STORAGE_KEY, value); } catch { /* not persisted */ }
  };

  const now = Date.now();
  const targets = getAppConfig().sla;
  const allRows: IQueueRow[] = requests.map(r => {
    const assigned = (r.assetStatus || '').toLowerCase().indexOf('approv') >= 0 || (r.status || '') === 'Asset Assigned';
    return {
      request: r,
      assigned,
      sla: evaluateRequestSla(r, targets, now),
      stock: assignableOfType(items, r.assetTitle).length,
      quantity: Math.max(1, r.quantity || 1)
    };
  });
  const waiting = allRows.filter(r => !r.assigned);
  const counts = {
    waiting: waiting.length,
    ready: waiting.filter(r => r.stock >= r.quantity).length,
    noStock: waiting.filter(r => r.stock < r.quantity).length,
    overdue: waiting.filter(r => r.sla.overdue).length,
    assigned: allRows.length - waiting.length
  };

  const types = Array.from(new Set(allRows.map(r => (r.request.assetTitle || '').trim()).filter(Boolean))).sort();
  const query = search.trim().toLowerCase();
  const filtered = allRows.filter(r => {
    if (view === 'waiting' && r.assigned) return false;
    if (view === 'assigned' && !r.assigned) return false;
    if (quick === 'ready' && (r.assigned || r.stock < r.quantity)) return false;
    if (quick === 'noStock' && (r.assigned || r.stock >= r.quantity)) return false;
    if (quick === 'overdue' && (r.assigned || !r.sla.overdue)) return false;
    if (typeFilter !== 'all' && (r.request.assetTitle || '').trim() !== typeFilter) return false;
    if (!query) return true;
    const q = r.request;
    return [q.requestKey, q.id, q.requesterName, q.employeeId, q.assetTitle, q.managerName, q.managerResponse, q.reason]
      .some(v => (v || '').toLowerCase().indexOf(query) >= 0);
  });

  const sortValue = (r: IQueueRow): string | number => {
    switch (sort.key) {
      case 'request': return parseInt((r.request.requestKey || r.request.id || '').replace(/\D/g, ''), 10) || 0;
      case 'employee': return (r.request.requesterName || '').toLowerCase();
      case 'type': return (r.request.assetTitle || '').toLowerCase();
      case 'priority': return PRIORITY_RANK[(r.request.priority || 'medium').toLowerCase()] ?? 1;
      default: return r.assigned ? -1 : (r.sla.openHours || 0);
    }
  };
  const sorted = filtered.slice().sort((a, b) => {
    const va = sortValue(a), vb = sortValue(b);
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return sort.desc ? -cmp : cmp;
  });

  const groupKeyOf = (r: IQueueRow): string =>
    groupBy === 'type' ? ((r.request.assetTitle || '').trim() || s.Unspecified)
      : groupBy === 'employee' ? (r.request.requesterName || s.Unspecified)
        : (r.request.priority || 'Medium');

  let rows = sorted;
  const byKey: { [key: string]: IQueueRow[] } = {};
  if (groupBy !== 'none') {
    sorted.forEach(r => { const k = groupKeyOf(r); (byKey[k] = byKey[k] || []).push(r); });
    const keys = Object.keys(byKey).sort((a, b) => groupBy === 'priority'
      ? (PRIORITY_RANK[a.toLowerCase()] ?? 1) - (PRIORITY_RANK[b.toLowerCase()] ?? 1)
      : a.localeCompare(b));
    rows = keys.reduce((all, k) => all.concat(byKey[k]), [] as IQueueRow[]);
  }

  // 10 rows per page, grouped or not (a group crossing a page boundary shows on both pages).
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const activePage = Math.min(page, totalPages);
  const visible = rows.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);
  const groups: IGroup[] | undefined = groupBy !== 'none' ? buildPageGroups(visible, groupKeyOf, byKey, collapsed) : undefined;

  const sortable = (key: SortKey): Partial<IColumn> => ({
    isSorted: sort.key === key,
    isSortedDescending: sort.key === key && sort.desc,
    onColumnClick: () => setSort(prev => ({ key, desc: prev.key === key ? !prev.desc : key === 'waiting' }))
  });

  const stockPill = (r: IQueueRow): JSX.Element => {
    if (r.assigned) return <span className={css.meta}>—</span>;
    if (r.stock === 0) return <Pill tone={TONES.red} text={s.OutOfStock} />;
    if (r.stock < r.quantity) return <Pill tone={TONES.amber} text={formatString(s.PartialStock, r.stock, r.quantity)} />;
    return <Pill tone={TONES.green} text={formatString(s.InStockCount, r.stock)} />;
  };

  const columns: IColumn[] = [
    {
      key: 'request', name: s.ColRequest, minWidth: 120, maxWidth: 150, isResizable: true, ...sortable('request'),
      onRender: (r: IQueueRow) => (
        <span className={css.two}>
          {r.assigned
            ? <span className={css.strong}>{r.request.requestKey || `#${r.request.id}`}</span>
            : <Link className={css.strong} onClick={(e) => { e.stopPropagation(); onAssign(r.request); }}>{r.request.requestKey || `#${r.request.id}`}</Link>}
          <span className={css.meta}>{formatString(s.RequestedOn, formatDay(r.request.requestDate))}</span>
        </span>
      )
    },
    {
      key: 'employee', name: s.ColEmployee, minWidth: 150, maxWidth: 220, isResizable: true, ...sortable('employee'),
      onRender: (r: IQueueRow) => (
        <span className={css.person}>
          <span className={css.coin} aria-hidden="true">{initials(r.request.requesterName)}</span>
          <span className={css.two}>
            <span className={css.strong}>{r.request.requesterName || '—'}</span>
            {r.request.employeeId && <span className={css.meta}>{formatString(s.EmployeeId, r.request.employeeId)}</span>}
          </span>
        </span>
      )
    },
    ...(groupBy !== 'type' ? [{
      key: 'type', name: s.ColAsset, minWidth: 110, maxWidth: 160, isResizable: true, ...sortable('type'),
      onRender: (r: IQueueRow) => (
        <span className={css.typeCell}>
          <span className={css.typeIcon} aria-hidden="true"><Icon iconName={assetTypeIcon(r.request.assetTitle)} /></span>
          <span className={css.strong} style={{ fontWeight: 400 }}>{r.quantity > 1 ? `${r.request.assetTitle} × ${r.quantity}` : r.request.assetTitle}</span>
        </span>
      )
    } as IColumn] : [{
      key: 'qty', name: s.ColQuantity, minWidth: 50, maxWidth: 60,
      onRender: (r: IQueueRow) => <span>{r.quantity}</span>
    } as IColumn]),
    ...(groupBy !== 'priority' ? [{
      key: 'priority', name: s.ColPriority, minWidth: 80, maxWidth: 100, isResizable: true, ...sortable('priority'),
      onRender: (r: IQueueRow) => <Pill tone={priorityTone(r.request.priority)} text={r.request.priority || 'Medium'} />
    } as IColumn] : []),
    {
      key: 'stock', name: s.ColStock, minWidth: 110, maxWidth: 140, isResizable: true,
      onRender: (r: IQueueRow) => stockPill(r)
    },
    {
      key: 'approver', name: s.ColApprovedBy, minWidth: 130, maxWidth: 200, isResizable: true,
      onRender: (r: IQueueRow) => (
        <span className={css.two}>
          <span className={css.strong} style={{ fontWeight: 400 }}>{approverOf(r.request) || '—'}</span>
          {r.request.managerDecisionAt && <span className={css.meta}>{formatDay(r.request.managerDecisionAt)}</span>}
        </span>
      )
    },
    {
      key: 'waiting', name: s.ColWaiting, minWidth: 110, maxWidth: 140, isResizable: true, ...sortable('waiting'),
      onRender: (r: IQueueRow) => r.assigned ? (
        <span className={css.two}>
          <Pill tone={TONES.green} text={s.StatusAssigned} />
          {r.request.assignedAt && <span className={css.meta} style={{ marginTop: 2 }}>{formatDay(r.request.assignedAt)}</span>}
        </span>
      ) : (
        <span className={css.two}>
          <span className={css.strong} style={{ color: r.sla.overdue ? TONES.red.fg : undefined }}>{formatHours(r.sla.openHours)}</span>
          <span className={css.meta} style={{ color: r.sla.overdue ? TONES.red.fg : undefined }}>
            {r.sla.overdue ? formatString(s.OverdueBy, formatHours(r.sla.overdueByHours)) : targets.assignmentHours > 0 ? formatString(s.TargetHours, targets.assignmentHours) : ''}
          </span>
        </span>
      )
    },
    {
      key: 'action', name: '', minWidth: 90, maxWidth: 100,
      onRender: (r: IQueueRow) => r.assigned ? null : (
        <PrimaryButton
          text={actionInProgressId === r.request.id ? s.Working : s.Assign}
          iconProps={{ iconName: 'Send' }}
          disabled={actionInProgressId === r.request.id}
          onClick={(e) => { e.stopPropagation(); onAssign(r.request); }}
          styles={{ root: { height: 30, minWidth: 0, padding: '0 12px', borderRadius: 6 } }}
        />
      )
    }
  ];

  const renderGroupHeader = (headerProps?: IGroupHeaderProps): JSX.Element | null => {
    if (!headerProps || !headerProps.group) return null;
    const group = headerProps.group;
    const paged = group.data as IPagedGroupData<IQueueRow> | undefined;
    const members: IQueueRow[] = paged ? paged.members : [];
    const partial = !!paged && group.count < members.length;
    const waitingHere = members.filter(m => !m.assigned);
    const stock = groupBy === 'type' ? assignableOfType(items, group.name).length : undefined;
    const overdue = waitingHere.filter(m => m.sla.overdue).length;
    return (
      <button
        type="button"
        className={css.groupHeader}
        aria-expanded={!group.isCollapsed}
        onClick={() => setCollapsed(prev => ({ ...prev, [group.key]: !prev[group.key] }))}
      >
        <Icon iconName={group.isCollapsed ? 'ChevronRight' : 'ChevronDown'} style={{ fontSize: 12 }} />
        {groupBy === 'type' && <Icon iconName={assetTypeIcon(group.name)} />}
        <span className={css.groupName}>{group.name}</span>
        <span className={css.count}>{members.length}</span>
        {partial && paged && <span className={css.meta} style={{ display: 'inline' }}>{formatString(strings.InventoryExplorer.GroupPartial, paged.first, paged.last, members.length)}</span>}
        <span className={css.groupMeta}>
          {waitingHere.length > 0 && <span className={css.crumb}><span className={css.dot} style={{ background: TONES.amber.fg }} />{formatString(s.GroupWaiting, waitingHere.length)}</span>}
          {overdue > 0 && <span className={css.crumb}><span className={css.dot} style={{ background: TONES.red.fg }} />{formatString(s.GroupOverdue, overdue)}</span>}
          {stock !== undefined && <span className={css.crumb}><span className={css.dot} style={{ background: stock > 0 ? TONES.green.fg : TONES.red.fg }} />{formatString(s.GroupStock, stock)}</span>}
        </span>
      </button>
    );
  };

  const tiles: { key: QuickFilter | 'assigned'; label: string; value: number; hint: string; dot: string }[] = [
    { key: 'all', label: s.TileWaiting, value: counts.waiting, hint: s.TileWaitingHint, dot: TONES.amber.fg },
    { key: 'ready', label: s.TileReady, value: counts.ready, hint: s.TileReadyHint, dot: TONES.green.fg },
    { key: 'noStock', label: s.TileNoStock, value: counts.noStock, hint: s.TileNoStockHint, dot: TONES.red.fg },
    { key: 'overdue', label: s.TileOverdue, value: counts.overdue, hint: formatString(s.TileOverdueHint, targets.assignmentHours), dot: TONES.red.fg },
    { key: 'assigned', label: s.TileAssigned, value: counts.assigned, hint: s.TileAssignedHint, dot: TONES.blue.fg }
  ];
  const tileActive = (key: QuickFilter | 'assigned'): boolean =>
    key === 'assigned' ? view === 'assigned' : view === 'waiting' && quick === key;
  const onTile = (key: QuickFilter | 'assigned'): void => {
    if (key === 'assigned') {
      setQuick('all');
      setView(view === 'assigned' ? 'waiting' : 'assigned');
    } else {
      setView('waiting');
      setQuick(quick === key && key !== 'all' ? 'all' : key);
    }
  };

  const viewOptions: IDropdownOption[] = [
    { key: 'waiting', text: s.ViewWaiting },
    { key: 'assigned', text: s.ViewAssigned },
    { key: 'all', text: s.ViewAll }
  ];
  const typeOptions: IDropdownOption[] = [{ key: 'all', text: s.AllTypes }].concat(types.map(t => ({ key: t, text: t })));
  const groupOptions: IDropdownOption[] = [
    { key: 'type', text: s.GroupByType },
    { key: 'employee', text: s.GroupByEmployee },
    { key: 'priority', text: s.GroupByPriority },
    { key: 'none', text: s.GroupByNone }
  ];
  const hasFilters = quick !== 'all' || typeFilter !== 'all' || !!query || view !== 'waiting';

  return (
    <div className={css.root}>
      <div className={css.header}>
        <h3 className={css.title}>{strings.AssetAssignmentQueuePage.Title}</h3>
        <p className={css.subtitle}>{s.Subtitle}</p>
      </div>

      <div className={css.tiles} role="group" aria-label={s.TilesAria}>
        {tiles.map(t => (
          <button key={t.key} type="button" className={`${css.tile} ${tileActive(t.key) ? css.tileActive : ''}`} aria-pressed={tileActive(t.key)} onClick={() => onTile(t.key)}>
            <span className={css.tileLabel}><span className={css.dot} style={{ background: t.dot }} />{t.label}</span>
            <div className={css.tileValue}>{t.value}</div>
            <div className={css.tileHint}>{t.hint}</div>
          </button>
        ))}
      </div>

      <div className={css.toolbar}>
        <SearchBox className={css.search} placeholder={s.SearchPlaceholder} value={search} onChange={(_, v) => setSearch(v || '')} onClear={() => setSearch('')} />
        <Dropdown label={s.FilterShow} options={viewOptions} selectedKey={view} onChange={(_, o) => { if (o) { setView(o.key as View); setQuick('all'); } }} styles={{ root: { width: 170 } }} />
        <Dropdown label={s.FilterType} options={typeOptions} selectedKey={typeFilter} onChange={(_, o) => o && setTypeFilter(String(o.key))} styles={{ root: { width: 160 } }} />
        <Dropdown label={s.GroupByLabel} options={groupOptions} selectedKey={groupBy} onChange={(_, o) => o && setGroupBy(o.key as GroupBy)} styles={{ root: { width: 160 } }} />
      </div>

      <div className={css.resultLine}>
        <span>{formatString(s.ResultCount, filtered.length, allRows.length)}</span>
        <span>
          {groups && groups.length > 1 && (
            <ActionButton
              iconProps={{ iconName: groups.every(g => g.isCollapsed) ? 'ExploreContent' : 'CollapseContent' }}
              text={groups.every(g => g.isCollapsed) ? s.ExpandAll : s.CollapseAll}
              onClick={() => {
                const collapse = !groups!.every(g => g.isCollapsed);
                const next: { [key: string]: boolean } = {};
                groups!.forEach(g => { next[g.key] = collapse; });
                setCollapsed(next);
              }}
            />
          )}
          {hasFilters && (
            <ActionButton iconProps={{ iconName: 'ClearFilter' }} text={s.ClearFilters} onClick={() => { setQuick('all'); setTypeFilter('all'); setSearch(''); setView('waiting'); }} />
          )}
        </span>
      </div>

      <div className={css.card}>
        {filtered.length === 0 ? (
          <div className={css.empty}>
            <Icon iconName={view === 'waiting' && !hasFilters ? 'CompletedSolid' : 'Search'} style={{ fontSize: 28, display: 'block', marginBottom: 8, color: view === 'waiting' && !hasFilters ? TONES.green.fg : undefined }} />
            {view === 'waiting' && !hasFilters ? s.EmptyAllDone : s.EmptyFiltered}
          </div>
        ) : (
          <DetailsList
            items={visible}
            columns={columns}
            groups={groups}
            groupProps={{ onRenderHeader: renderGroupHeader, showEmptyGroups: false }}
            setKey="assignmentQueue"
            getKey={(r: IQueueRow) => r.request.id}
            layoutMode={DetailsListLayoutMode.justified}
            constrainMode={ConstrainMode.unconstrained}
            selectionMode={SelectionMode.none}
            onItemInvoked={(r: IQueueRow) => { if (!r.assigned) onAssign(r.request); }}
            onRenderRow={(rowProps?: IDetailsRowProps, defaultRender?: (p?: IDetailsRowProps) => JSX.Element | null) => {
              if (!rowProps || !defaultRender) return null;
              const r = rowProps.item as IQueueRow;
              return (
                <div className={r.assigned ? css.rowStatic : css.row} onClick={() => { if (!r.assigned) onAssign(r.request); }}>
                  {defaultRender(rowProps)}
                </div>
              );
            }}
            ariaLabelForGrid={strings.AssetAssignmentQueuePage.Title}
          />
        )}
        <Pager page={activePage} pageSize={PAGE_SIZE} totalItems={rows.length} onChange={setPage} />
      </div>
    </div>
  );
};
