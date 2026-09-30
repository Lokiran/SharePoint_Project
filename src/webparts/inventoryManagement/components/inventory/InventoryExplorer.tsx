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
import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';
import { IInventoryItem } from '../../models/IInventoryItem';
import { IEventLog } from '../../models/IEventLog';
import { IReturnRequest } from '../../models/IReturnRequest';
import { AssetDetailsPanel } from './AssetDetailsPanel';
import { Pager, buildPageGroups, IPagedGroupData } from '../common/Pager';
import {
  StatusBucket,
  assetTypeIcon,
  statusBucket,
  statusBucketLabel,
  statusTone,
  conditionTone,
  formatDay,
  ageText,
  warrantyInfo,
  initials,
  categoryOf
} from './inventoryUi';

export interface IInventoryExplorerProps {
  items: IInventoryItem[];
  /** Shows the primary button (add asset for admins, assign for managers). */
  addLabel?: string;
  onAdd?: () => void;
  auditLogs: IEventLog[];
  returnRequests: IReturnRequest[];
  spContext: WebPartContext;
}

type GroupBy = 'type' | 'category' | 'status' | 'none';
type QuickFilter = 'all' | StatusBucket | 'warrantySoon';
type SortKey = 'name' | 'type' | 'status' | 'assignedTo' | 'warranty' | 'purchased';

const PAGE_SIZE = 10;
const GROUP_STORAGE_KEY = 'inventory_groupBy';
const STATUS_ORDER: StatusBucket[] = ['inStock', 'assigned', 'pendingReturn', 'maintenance', 'retired', 'other'];

const css = mergeStyleSets({
  root: { color: 'var(--text-main, #242424)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 16 },
  title: { margin: 0, fontSize: 22, fontWeight: 600, lineHeight: '28px' },
  subtitle: { margin: '4px 0 0', fontSize: 14, color: 'var(--text-muted, #616161)' },
  tiles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 16 },
  tile: {
    textAlign: 'left',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid rgba(0, 0, 0, 0.1)',
    background: 'var(--surface-bg, #ffffff)',
    cursor: 'pointer',
    font: 'inherit',
    color: 'inherit',
    selectors: {
      ':hover': { borderColor: 'rgba(0, 0, 0, 0.25)' },
      ':focus-visible': { outline: '2px solid #0f6cbd', outlineOffset: 2 }
    }
  },
  tileActive: { borderColor: '#0f6cbd', boxShadow: 'inset 0 0 0 1px #0f6cbd', background: 'rgba(15, 108, 189, 0.05)' },
  tileLabel: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--text-muted, #616161)' },
  tileDot: { width: 8, height: 8, borderRadius: '50%' },
  tileValue: { fontSize: 24, fontWeight: 600, lineHeight: '32px', marginTop: 4 },
  toolbar: { display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap', marginBottom: 12 },
  search: { flex: '1 1 260px', minWidth: 200 },
  resultLine: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted, #616161)', margin: '4px 0 8px' },
  card: { border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 12, overflow: 'hidden', background: 'var(--surface-bg, #ffffff)' },
  groupHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: '10px 16px',
    border: 'none',
    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
    background: 'rgba(0, 0, 0, 0.025)',
    cursor: 'pointer',
    font: 'inherit',
    color: 'inherit',
    textAlign: 'left',
    selectors: { ':hover': { background: 'rgba(0, 0, 0, 0.05)' }, ':focus-visible': { outline: '2px solid #0f6cbd', outlineOffset: -2 } }
  },
  groupName: { fontSize: 14, fontWeight: 600 },
  count: { fontSize: 12, fontWeight: 600, padding: '0 8px', borderRadius: 999, background: 'rgba(0, 0, 0, 0.07)', lineHeight: '20px' },
  breakdown: { display: 'flex', gap: 12, marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted, #616161)', flexWrap: 'wrap' },
  crumb: { display: 'inline-flex', alignItems: 'center', gap: 5 },
  assetCell: { display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 },
  typeIcon: { width: 32, height: 32, borderRadius: 8, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0, color: '#242424' },
  assetName: { fontSize: 13, fontWeight: 600, color: 'var(--text-main, #242424)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' },
  assetMeta: { fontSize: 12, color: 'var(--text-muted, #616161)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' },
  pill: { fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 999, lineHeight: '18px', whiteSpace: 'nowrap' },
  person: { display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 },
  coin: { width: 24, height: 24, borderRadius: '50%', background: '#0f6cbd', color: '#fff', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cellText: { fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  muted: { color: 'var(--text-muted, #616161)' },
  row: { cursor: 'pointer' },
  empty: { padding: '48px 16px', textAlign: 'center', color: 'var(--text-muted, #616161)' },
  pager: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderTop: '1px solid rgba(0, 0, 0, 0.06)', fontSize: 13 }
});

const readGroupBy = (): GroupBy => {
  try {
    const v = window.localStorage.getItem(GROUP_STORAGE_KEY);
    if (v === 'type' || v === 'category' || v === 'status' || v === 'none') return v;
  } catch {
    // Storage unavailable: use the default.
  }
  return 'type';
};

const Pill: React.FC<{ status?: string; text: string; condition?: boolean }> = ({ status, text, condition }) => {
  const tone = condition ? conditionTone(status) : statusTone(status);
  return <span className={css.pill} style={{ background: tone.bg, color: tone.fg }}>{text}</span>;
};

export const InventoryExplorer: React.FC<IInventoryExplorerProps> = (props) => {
  const { items, addLabel, onAdd, auditLogs, returnRequests, spContext } = props;
  const s = strings.InventoryExplorer;

  const [search, setSearch] = React.useState('');
  const [quick, setQuick] = React.useState<QuickFilter>('all');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [groupBy, setGroupByState] = React.useState<GroupBy>(readGroupBy);
  const [collapsed, setCollapsed] = React.useState<{ [key: string]: boolean }>({});
  const [sort, setSort] = React.useState<{ key: SortKey; desc: boolean }>({ key: 'purchased', desc: true });
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<IInventoryItem | undefined>();

  const setGroupBy = (value: GroupBy): void => {
    setGroupByState(value);
    setCollapsed({});
    try { window.localStorage.setItem(GROUP_STORAGE_KEY, value); } catch { /* not persisted */ }
  };

  React.useEffect(() => setPage(1), [search, quick, typeFilter, groupBy, sort.key, sort.desc]);

  // Keep the open panel on the latest copy of its asset after a reload.
  React.useEffect(() => {
    if (selected) {
      const fresh = items.find(i => i.id === selected.id);
      if (fresh && fresh !== selected) setSelected(fresh);
    }
  }, [items]);

  const types = React.useMemo(() => Array.from(new Set(items.map(i => (i.assetType || '').trim()).filter(Boolean))).sort(), [items]);

  const counts = React.useMemo(() => ({
    total: items.length,
    inStock: items.filter(i => statusBucket(i.status) === 'inStock').length,
    assigned: items.filter(i => statusBucket(i.status) === 'assigned').length,
    maintenance: items.filter(i => statusBucket(i.status) === 'maintenance').length,
    warrantySoon: items.filter(i => warrantyInfo(i.warrantyExpiry).state === 'soon').length
  }), [items]);

  const query = search.trim().toLowerCase();
  const filtered = items.filter(i => {
    if (quick === 'warrantySoon' && warrantyInfo(i.warrantyExpiry).state !== 'soon') return false;
    if (quick !== 'all' && quick !== 'warrantySoon' && statusBucket(i.status) !== quick) return false;
    if (typeFilter !== 'all' && (i.assetType || '').trim() !== typeFilter) return false;
    if (!query) return true;
    return [i.assetName, i.serialNumber, i.vendor, i.assignedTo, i.assetType, i.title, i.id, i.specifications]
      .some(v => (v || '').toLowerCase().indexOf(query) >= 0);
  });

  const sortValue = (i: IInventoryItem): string | number => {
    switch (sort.key) {
      case 'name': return (i.assetName || i.title || '').toLowerCase();
      case 'type': return (i.assetType || '').toLowerCase();
      case 'status': return STATUS_ORDER.indexOf(statusBucket(i.status));
      case 'assignedTo': return (i.assignedTo || '￿').toLowerCase();
      case 'warranty': return i.warrantyExpiry ? new Date(i.warrantyExpiry).getTime() || 0 : Number.MAX_SAFE_INTEGER;
      default: return i.purchaseDate ? new Date(i.purchaseDate).getTime() || 0 : 0;
    }
  };
  const sorted = filtered.slice().sort((a, b) => {
    const va = sortValue(a), vb = sortValue(b);
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return sort.desc ? -cmp : cmp;
  });

  const groupKeyOf = (i: IInventoryItem): string =>
    groupBy === 'type' ? ((i.assetType || '').trim() || s.Uncategorised)
      : groupBy === 'category' ? categoryOf(i)
        : statusBucketLabel(statusBucket(i.status));

  // Items ordered group by group (DetailsList groups are contiguous ranges).
  let rows: IInventoryItem[] = sorted;
  const byKey: { [key: string]: IInventoryItem[] } = {};
  if (groupBy !== 'none') {
    sorted.forEach(i => { const k = groupKeyOf(i); (byKey[k] = byKey[k] || []).push(i); });
    const keys = Object.keys(byKey).sort((a, b) => {
      if (groupBy === 'status') {
        return STATUS_ORDER.indexOf(statusBucket(byKey[a][0].status)) - STATUS_ORDER.indexOf(statusBucket(byKey[b][0].status));
      }
      return a.localeCompare(b);
    });
    rows = keys.reduce((all, k) => all.concat(byKey[k]), [] as IInventoryItem[]);
  }

  // 10 rows per page in every view. When grouped, the page is cut from the group-ordered list and
  // its groups rebuilt, so a group that crosses a page boundary shows on both pages with its full count.
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const activePage = Math.min(page, totalPages);
  const visible = rows.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);
  const groups: IGroup[] | undefined = groupBy !== 'none' ? buildPageGroups(visible, groupKeyOf, byKey, collapsed) : undefined;

  const sortable = (key: SortKey): Partial<IColumn> => ({
    isSorted: sort.key === key,
    isSortedDescending: sort.key === key && sort.desc,
    onColumnClick: () => setSort(prev => ({ key, desc: prev.key === key ? !prev.desc : key === 'purchased' }))
  });

  const columns: IColumn[] = [
    {
      key: 'asset', name: s.ColAsset, minWidth: 220, maxWidth: 340, isResizable: true, ...sortable('name'),
      onRender: (i: IInventoryItem) => (
        <div className={css.assetCell}>
          <span className={css.typeIcon} aria-hidden="true"><Icon iconName={assetTypeIcon(i.assetType)} /></span>
          <span style={{ minWidth: 0 }}>
            <Link className={css.assetName} onClick={(e) => { e.stopPropagation(); setSelected(i); }}>{i.assetName || i.title || s.Unnamed}</Link>
            <span className={css.assetMeta}>{[i.serialNumber, `#${i.id}`].filter(Boolean).join('  ·  ')}</span>
          </span>
        </div>
      )
    },
    ...(groupBy !== 'type' ? [{
      key: 'type', name: s.ColType, minWidth: 80, maxWidth: 120, isResizable: true, ...sortable('type'),
      onRender: (i: IInventoryItem) => <span className={css.cellText}>{i.assetType || '—'}</span>
    } as IColumn] : []),
    ...(groupBy !== 'category' ? [{
      key: 'category', name: s.ColCategory, minWidth: 100, maxWidth: 140, isResizable: true,
      onRender: (i: IInventoryItem) => <span className={`${css.cellText} ${css.muted}`}>{categoryOf(i)}</span>
    } as IColumn] : []),
    {
      key: 'status', name: s.ColStatus, minWidth: 100, maxWidth: 140, isResizable: true, ...sortable('status'),
      onRender: (i: IInventoryItem) => <Pill status={i.status} text={i.status || '—'} />
    },
    {
      key: 'assignedTo', name: s.ColAssignedTo, minWidth: 130, maxWidth: 200, isResizable: true, ...sortable('assignedTo'),
      onRender: (i: IInventoryItem) => i.assignedTo ? (
        <span className={css.person}>
          <span className={css.coin} aria-hidden="true">{initials(i.assignedTo)}</span>
          <span className={css.cellText}>{i.assignedTo}</span>
        </span>
      ) : <span className={css.muted}>—</span>
    },
    {
      key: 'condition', name: s.ColCondition, minWidth: 80, maxWidth: 110, isResizable: true,
      onRender: (i: IInventoryItem) => i.condition ? <Pill status={i.condition} text={i.condition} condition={true} /> : <span className={css.muted}>—</span>
    },
    {
      key: 'warranty', name: s.ColWarranty, minWidth: 110, maxWidth: 150, isResizable: true, ...sortable('warranty'),
      onRender: (i: IInventoryItem) => {
        const w = warrantyInfo(i.warrantyExpiry);
        const text = w.state === 'active' ? formatDay(i.warrantyExpiry) : w.state === 'expired' ? s.WarrantyExpiredShort : w.state === 'none' ? '—' : w.text;
        return <span className={css.cellText} style={{ color: w.state === 'active' || w.state === 'none' ? undefined : w.tone.fg, fontWeight: w.state === 'soon' || w.state === 'expired' ? 600 : 400 }}>{text}</span>;
      }
    },
    {
      key: 'purchased', name: s.ColPurchased, minWidth: 100, maxWidth: 130, isResizable: true, ...sortable('purchased'),
      onRender: (i: IInventoryItem) => (
        <span style={{ minWidth: 0 }}>
          <span className={css.cellText} style={{ display: 'block' }}>{formatDay(i.purchaseDate)}</span>
          {ageText(i.purchaseDate) && <span className={css.assetMeta}>{ageText(i.purchaseDate)}</span>}
        </span>
      )
    },
    {
      key: 'vendor', name: s.ColVendor, minWidth: 80, maxWidth: 130, isResizable: true,
      onRender: (i: IInventoryItem) => <span className={css.cellText}>{i.vendor || '—'}</span>
    },
    {
      key: 'open', name: '', minWidth: 24, maxWidth: 24,
      onRender: () => <Icon iconName="ChevronRight" style={{ color: '#8a8886' }} aria-hidden="true" />
    }
  ];

  const renderGroupHeader = (headerProps?: IGroupHeaderProps): JSX.Element | null => {
    if (!headerProps || !headerProps.group) return null;
    const group = headerProps.group;
    const paged = group.data as IPagedGroupData<IInventoryItem> | undefined;
    const members: IInventoryItem[] = paged ? paged.members : [];
    const partial = !!paged && group.count < members.length;
    const breakdown = STATUS_ORDER
      .map(b => ({ b, n: members.filter(m => statusBucket(m.status) === b).length }))
      .filter(x => x.n > 0 && !(groupBy === 'status'));
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
        {partial && paged && <span className={css.muted} style={{ fontSize: 12 }}>{formatString(s.GroupPartial, paged.first, paged.last, members.length)}</span>}
        <span className={css.breakdown}>
          {breakdown.map(x => (
            <span key={x.b} className={css.crumb}>
              <span className={css.tileDot} style={{ background: statusTone(members.filter(m => statusBucket(m.status) === x.b)[0].status).fg }} />
              {formatString(s.BreakdownItem, x.n, statusBucketLabel(x.b).toLowerCase())}
            </span>
          ))}
        </span>
      </button>
    );
  };

  const tiles: { key: QuickFilter; label: string; value: number; dot?: string }[] = [
    { key: 'all', label: s.TileTotal, value: counts.total },
    { key: 'inStock', label: s.TileInStock, value: counts.inStock, dot: statusTone('In Stock').fg },
    { key: 'assigned', label: s.TileAssigned, value: counts.assigned, dot: statusTone('Assigned').fg },
    { key: 'maintenance', label: s.TileMaintenance, value: counts.maintenance, dot: statusTone('Under Maintenance').fg },
    { key: 'warrantySoon', label: formatString(s.TileWarrantySoon, 90), value: counts.warrantySoon, dot: '#bc4b09' }
  ];

  const typeOptions: IDropdownOption[] = [{ key: 'all', text: s.AllTypes }].concat(types.map(t => ({ key: t, text: t })));
  const groupOptions: IDropdownOption[] = [
    { key: 'type', text: s.GroupByType },
    { key: 'category', text: s.GroupByCategory },
    { key: 'status', text: s.GroupByStatus },
    { key: 'none', text: s.GroupByNone }
  ];
  const hasFilters = quick !== 'all' || typeFilter !== 'all' || !!query;
  const clearFilters = (): void => { setQuick('all'); setTypeFilter('all'); setSearch(''); };

  return (
    <div className={css.root}>
      <div className={css.header}>
        <div>
          <h3 className={css.title}>{strings.InventoryPage.Title}</h3>
          <p className={css.subtitle}>{s.Subtitle}</p>
        </div>
        {onAdd && addLabel && <PrimaryButton text={addLabel} iconProps={{ iconName: 'Add' }} onClick={onAdd} />}
      </div>

      <div className={css.tiles} role="group" aria-label={s.TilesAria}>
        {tiles.map(t => (
          <button
            key={t.key}
            type="button"
            className={`${css.tile} ${quick === t.key ? css.tileActive : ''}`}
            aria-pressed={quick === t.key}
            onClick={() => setQuick(quick === t.key ? 'all' : t.key)}
          >
            <span className={css.tileLabel}>{t.dot && <span className={css.tileDot} style={{ background: t.dot }} />}{t.label}</span>
            <div className={css.tileValue}>{t.value}</div>
          </button>
        ))}
      </div>

      <div className={css.toolbar}>
        <SearchBox className={css.search} placeholder={s.SearchPlaceholder} value={search} onChange={(_, v) => setSearch(v || '')} onClear={() => setSearch('')} />
        <Dropdown label={s.FilterType} options={typeOptions} selectedKey={typeFilter} onChange={(_, o) => o && setTypeFilter(String(o.key))} styles={{ root: { width: 170 } }} />
        <Dropdown label={s.GroupByLabel} options={groupOptions} selectedKey={groupBy} onChange={(_, o) => o && setGroupBy(o.key as GroupBy)} styles={{ root: { width: 170 } }} />
      </div>

      <div className={css.resultLine}>
        <span>{formatString(s.ResultCount, filtered.length, items.length)}</span>
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
          {hasFilters && <ActionButton iconProps={{ iconName: 'ClearFilter' }} text={s.ClearFilters} onClick={clearFilters} />}
        </span>
      </div>

      <div className={css.card}>
        {filtered.length === 0 ? (
          <div className={css.empty}>
            <Icon iconName="Search" style={{ fontSize: 28, display: 'block', marginBottom: 8 }} />
            {items.length === 0 ? s.EmptyInventory : s.EmptyFiltered}
          </div>
        ) : (
          <DetailsList
            items={visible}
            columns={columns}
            groups={groups}
            groupProps={{ onRenderHeader: renderGroupHeader, showEmptyGroups: false }}
            setKey="inventory"
            layoutMode={DetailsListLayoutMode.justified}
            constrainMode={ConstrainMode.unconstrained}
            selectionMode={SelectionMode.none}
            onItemInvoked={(i: IInventoryItem) => setSelected(i)}
            onRenderRow={(rowProps?: IDetailsRowProps, defaultRender?: (p?: IDetailsRowProps) => JSX.Element | null) =>
              rowProps && defaultRender ? (
                <div className={css.row} onClick={() => setSelected(rowProps.item as IInventoryItem)}>{defaultRender(rowProps)}</div>
              ) : null}
            ariaLabelForGrid={strings.InventoryPage.Title}
          />
        )}
        <Pager page={activePage} pageSize={PAGE_SIZE} totalItems={rows.length} onChange={setPage} />
      </div>

      <AssetDetailsPanel
        asset={selected}
        onDismiss={() => setSelected(undefined)}
        auditLogs={auditLogs}
        returnRequests={returnRequests}
        spContext={spContext}
      />
    </div>
  );
};
