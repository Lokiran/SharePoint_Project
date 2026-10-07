import * as React from 'react';
import { SearchBox, Dropdown, IDropdownOption, ActionButton, DefaultButton, PrimaryButton, IconButton, Icon } from '@fluentui/react';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';
import { TONES } from '../inventory/inventoryUi';
import { Pager } from '../common/Pager';
import {
  recordCss as css,
  ACCENTS,
  cardButtonStyles,
  Pill,
  StatusChips,
  LayoutSwitch,
  useRecordLayout,
  RecordCard,
  MetaItem,
  BoardLanes,
  IStatusChip,
  priorityTone,
  serviceStatusTone,
  formatFlexibleDay,
  relativeDay,
  timeOf,
  dateRangeOptions,
  inDateRange,
  DateRangeKey
} from '../common/listUi';

/** The fields the incident and replacement history components share. */
export interface IServiceRecord {
  id: string;
  incidentId: string;
  assetName: string;
  issueType: string;
  issueDescription: string;
  priority: string;
  status: string;
  reportedDate: string;
  employeeName?: string;
  isLocalOnly?: boolean;
}

export interface IServiceRecordCardsProps<T extends IServiceRecord> {
  kind: 'incident' | 'replacement';
  title: string;
  subtitle: string;
  records: T[];
  /** Admins see everyone's records, so they also get the reporter on each card and as a filter. */
  isAdmin: boolean;
  onView: (record: T) => void;
  onDownload: (record: T) => void;
}

type Bucket = 'open' | 'progress' | 'resolved' | 'closed';
type QuickFilter = 'all' | Bucket | 'high';
type SortKey = 'newest' | 'oldest' | 'priority' | 'asset';

const PAGE_SIZE = 10;
const BUCKETS: Bucket[] = ['open', 'progress', 'resolved', 'closed'];
const BUCKET_COLOR: { [b in Bucket]: string } = { open: ACCENTS.red, progress: ACCENTS.amber, resolved: ACCENTS.green, closed: ACCENTS.grey };
const PRIORITY_RANK: { [p: string]: number } = { critical: 0, high: 0, medium: 1, low: 2 };

const bucketOf = (status?: string): Bucket => {
  const s = (status || 'Open').toLowerCase();
  if (s.indexOf('progress') >= 0) return 'progress';
  if (s.indexOf('resolv') >= 0 || s.indexOf('complet') >= 0) return 'resolved';
  if (s.indexOf('closed') >= 0) return 'closed';
  return 'open';
};

const isActive = (status?: string): boolean => bucketOf(status) === 'open' || bucketOf(status) === 'progress';
const isHigh = (priority?: string): boolean => /^(high|critical)$/i.test((priority || '').trim());
const rankOf = (priority?: string): number => PRIORITY_RANK[(priority || 'medium').toLowerCase()] ?? 1;

/** Incident / replacement records as cards or as a status board, with filters and downloads. */
export function ServiceRecordCards<T extends IServiceRecord>(props: IServiceRecordCardsProps<T>): JSX.Element {
  const { kind, title, subtitle, records, isAdmin, onView, onDownload } = props;
  const s = strings.RecordLists;
  const h = strings.IncidentHistory;

  const [layout, setLayout] = useRecordLayout(kind);
  const [search, setSearch] = React.useState('');
  const [quick, setQuick] = React.useState<QuickFilter>('all');
  const [priority, setPriority] = React.useState('all');
  const [type, setType] = React.useState('all');
  const [person, setPerson] = React.useState('all');
  const [range, setRange] = React.useState<DateRangeKey>('all');
  const [sort, setSort] = React.useState<SortKey>('newest');
  const [page, setPage] = React.useState(1);

  React.useEffect(() => setPage(1), [search, quick, priority, type, person, range, sort]);

  const bucketLabel = (b: Bucket): string =>
    b === 'open' ? s.StatusOpen : b === 'progress' ? s.StatusInProgress : b === 'resolved' ? s.StatusResolved : s.StatusClosed;

  const statusParts: IStatusChip[] = BUCKETS.map(b => ({
    key: b,
    label: bucketLabel(b),
    count: records.filter(r => bucketOf(r.status) === b).length,
    color: BUCKET_COLOR[b]
  }));
  const chips: IStatusChip[] = [
    { key: 'all', label: s.TileAll, count: records.length },
    ...statusParts,
    { key: 'high', label: s.TileHighPriority, count: records.filter(r => isHigh(r.priority) && isActive(r.status)).length, color: ACCENTS.red }
  ];

  const types = Array.from(new Set(records.map(r => (r.issueType || '').trim()).filter(Boolean))).sort();
  const people = Array.from(new Set(records.map(r => (r.employeeName || '').trim()).filter(Boolean))).sort();
  const showType = kind === 'incident';
  const showPeople = isAdmin && people.length > 1;

  const query = search.trim().toLowerCase();
  const filtered = records.filter(r => {
    if (quick === 'high' && !(isHigh(r.priority) && isActive(r.status))) return false;
    if (quick !== 'all' && quick !== 'high' && bucketOf(r.status) !== quick) return false;
    if (priority !== 'all' && (r.priority || 'Medium').toLowerCase() !== priority) return false;
    if (type !== 'all' && (r.issueType || '').trim() !== type) return false;
    if (person !== 'all' && (r.employeeName || '').trim() !== person) return false;
    if (!inDateRange(r.reportedDate, range)) return false;
    if (!query) return true;
    return [r.incidentId, r.assetName, r.issueType, r.issueDescription, r.employeeName, r.status, r.priority]
      .some(v => (v || '').toLowerCase().indexOf(query) >= 0);
  });

  const newestFirst = (a: T, b: T): number => timeOf(b.reportedDate) - timeOf(a.reportedDate);
  const sorted = filtered.slice().sort((a, b) => {
    switch (sort) {
      case 'oldest': return -newestFirst(a, b);
      case 'priority': return rankOf(a.priority) - rankOf(b.priority) || newestFirst(a, b);
      case 'asset': return (a.assetName || '').trim().localeCompare((b.assetName || '').trim()) || newestFirst(a, b);
      default: return newestFirst(a, b);
    }
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const activePage = Math.min(page, totalPages);
  const visible = sorted.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);

  const keyOf = (r: T): string => `${r.id}-${r.incidentId}`;

  const renderCard = (r: T, compact: boolean): JSX.Element => {
    const ref = r.incidentId || `#${r.id}`;
    const ago = relativeDay(r.reportedDate);
    return (
      <RecordCard
        key={keyOf(r)}
        compact={compact}
        idText={ref}
        badges={
          <>
            {r.isLocalOnly && <Pill tone={TONES.amber} text={h.LocalOnlyTag} title={h.LocalOnlyTooltip} />}
            {!compact && <Pill tone={serviceStatusTone(r.status)} text={r.status || 'Open'} title={h.ColStatus} />}
            <Pill tone={priorityTone(r.priority)} text={r.priority || 'Medium'} title={h.ColPriority} />
          </>
        }
        title={(r.assetName || '').trim() || s.Unspecified}
        text={r.issueDescription}
        meta={
          <>
            {showType && r.issueType && <MetaItem icon="Tag" title={h.ColIssueType}>{r.issueType}</MetaItem>}
            {isAdmin && r.employeeName && <MetaItem icon="Contact" title={s.ColReportedBy}>{r.employeeName}</MetaItem>}
            <MetaItem icon="Calendar" title={h.ColReported}>{formatFlexibleDay(r.reportedDate)}{ago ? ` · ${ago}` : ''}</MetaItem>
          </>
        }
        actions={compact ? (
          <>
            <IconButton iconProps={{ iconName: 'RedEye' }} title={h.ButtonView} ariaLabel={`${h.ButtonView} ${ref}`} onClick={() => onView(r)} />
            <IconButton iconProps={{ iconName: 'Download' }} title={h.ButtonDownload} ariaLabel={`${h.ButtonDownload} ${ref}`} onClick={() => onDownload(r)} />
          </>
        ) : (
          <>
            <DefaultButton text={h.ButtonView} iconProps={{ iconName: 'RedEye' }} ariaLabel={`${h.ButtonView} ${ref}`} onClick={() => onView(r)} styles={cardButtonStyles} />
            <PrimaryButton text={h.ButtonDownload} iconProps={{ iconName: 'Download' }} ariaLabel={`${h.ButtonDownload} ${ref}`} onClick={() => onDownload(r)} styles={cardButtonStyles} />
          </>
        )}
        onOpen={() => onView(r)}
      />
    );
  };

  const option = (key: string, text: string): IDropdownOption => ({ key, text });
  const priorityOptions = [option('all', s.AllPriorities), option('high', 'High'), option('medium', 'Medium'), option('low', 'Low')];
  const typeOptions = [option('all', s.AllTypes)].concat(types.map(t => option(t, t)));
  const peopleOptions = [option('all', s.AllPeople)].concat(people.map(p => option(p, p)));
  const sortOptions = [option('newest', s.SortNewest), option('oldest', s.SortOldest), option('priority', s.SortPriority), option('asset', s.SortAsset)];

  const hasFilters = quick !== 'all' || priority !== 'all' || type !== 'all' || person !== 'all' || range !== 'all' || !!query;
  const clearFilters = (): void => { setQuick('all'); setPriority('all'); setType('all'); setPerson('all'); setRange('all'); setSearch(''); };

  // A status chip narrows the board to that one lane; every other filter keeps all four.
  const laneBuckets = BUCKETS.filter(b => quick === 'all' || quick === 'high' || quick === b);

  return (
    <div className={css.root}>
      <div className={css.header}>
        <div>
          <h3 className={css.title}>{title}</h3>
          <p className={css.subtitle}>{subtitle}</p>
        </div>
        <LayoutSwitch layout={layout} onChange={setLayout} />
      </div>

      <StatusChips chips={chips} selected={quick} ariaLabel={s.TilesAria} onSelect={(key) => setQuick(quick === key ? 'all' : key as QuickFilter)} />

      <div className={css.filters}>
        <SearchBox
          className={css.search}
          placeholder={kind === 'incident' ? h.SearchIncidentsPlaceholder : h.SearchReplacementsPlaceholder}
          value={search}
          onChange={(_, v) => setSearch(v || '')}
          onClear={() => setSearch('')}
        />
        <Dropdown label={h.ColPriority} options={priorityOptions} selectedKey={priority} onChange={(_, o) => o && setPriority(String(o.key))} styles={{ root: { width: 140 } }} />
        {showType && types.length > 1 && (
          <Dropdown label={h.ColIssueType} options={typeOptions} selectedKey={type} onChange={(_, o) => o && setType(String(o.key))} styles={{ root: { width: 170 } }} />
        )}
        {showPeople && (
          <Dropdown label={s.ColReportedBy} options={peopleOptions} selectedKey={person} onChange={(_, o) => o && setPerson(String(o.key))} styles={{ root: { width: 170 } }} />
        )}
        <Dropdown label={h.ColReported} options={dateRangeOptions()} selectedKey={range} onChange={(_, o) => o && setRange(o.key as DateRangeKey)} styles={{ root: { width: 150 } }} />
        <Dropdown label={s.SortLabel} options={sortOptions} selectedKey={sort} onChange={(_, o) => o && setSort(o.key as SortKey)} styles={{ root: { width: 180 } }} />
      </div>

      <div className={css.resultLine}>
        <span>{formatString(kind === 'incident' ? h.ShowingIncidents : h.ShowingReplacements, filtered.length, records.length)}</span>
        {hasFilters && <ActionButton iconProps={{ iconName: 'ClearFilter' }} text={s.ClearFilters} onClick={clearFilters} />}
      </div>

      {filtered.length === 0 ? (
        <div className={css.empty}>
          <Icon iconName={records.length === 0 ? 'CompletedSolid' : 'Search'} style={{ fontSize: 28, display: 'block', marginBottom: 8 }} />
          {records.length === 0 ? (kind === 'incident' ? s.EmptyIncidents : s.EmptyReplacements) : s.EmptyFiltered}
        </div>
      ) : layout === 'board' ? (
        <BoardLanes
          lanes={laneBuckets.map(b => ({ key: b, label: bucketLabel(b), color: BUCKET_COLOR[b], items: sorted.filter(r => bucketOf(r.status) === b) }))}
          keyOf={keyOf}
          renderCard={(r) => renderCard(r, true)}
        />
      ) : (
        <>
          <div className={css.grid}>{visible.map(r => renderCard(r, false))}</div>
          <div className={css.pager}><Pager page={activePage} pageSize={PAGE_SIZE} totalItems={sorted.length} onChange={setPage} /></div>
        </>
      )}
    </div>
  );
}
