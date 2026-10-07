import * as React from 'react';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { Icon } from '@fluentui/react/lib/Icon';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';
import { IInventoryItem } from '../../models/IInventoryItem';
import { exportRowsToCsv } from '../../utils/ReportExportUtils';
import { TONES, statusTone, formatDay, initials } from '../inventory/inventoryUi';
import { Pager } from '../common/Pager';
import { Pill } from '../common/listUi';
import { countBy, rankedKeys, nameOf, isHeld } from './reportData';
import { reportCss as css, PALETTE, IKpi, KpiRow } from './reportsUi';
import { ExportButtons } from './reportParts';

export interface IPeopleReportProps {
  items: IInventoryItem[];
  onOpenAsset: (item: IInventoryItem) => void;
}

interface IHolder {
  key: string;
  name: string;
  email?: string;
  assets: IInventoryItem[];
}

const PAGE_SIZE = 10;

/** Who holds what: every person with assets, largest holding first, with the assets behind each count. */
export const PeopleReport: React.FC<IPeopleReportProps> = ({ items, onOpenAsset }) => {
  const t = strings.Reports;
  const [search, setSearch] = React.useState('');
  const [expanded, setExpanded] = React.useState<{ [key: string]: boolean }>({});
  const [page, setPage] = React.useState(1);

  React.useEffect(() => setPage(1), [search]);

  const holders = React.useMemo(() => {
    const byKey: { [key: string]: IHolder } = {};
    items.filter(isHeld).forEach(item => {
      const name = (item.assignedTo || '').trim();
      const key = (item.assignedToEmail || name).trim().toLowerCase();
      const holder = byKey[key] || (byKey[key] = { key, name, email: item.assignedToEmail, assets: [] });
      holder.assets.push(item);
    });
    return Object.keys(byKey).map(key => byKey[key])
      .sort((a, b) => b.assets.length - a.assets.length || a.name.localeCompare(b.name));
  }, [items]);

  const query = search.trim().toLowerCase();
  const shown = !query ? holders : holders.filter(h =>
    [h.name, h.email].some(v => (v || '').toLowerCase().indexOf(query) >= 0) ||
    h.assets.some(a => [nameOf(a), a.serialNumber, a.assetType].some(v => (v || '').toLowerCase().indexOf(query) >= 0)));

  const totalPages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const activePage = Math.min(page, totalPages);
  const visible = shown.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);

  const held = holders.reduce((sum, h) => sum + h.assets.length, 0);
  const largest = holders[0];
  const kpis: IKpi[] = [
    { key: 'people', icon: 'People', color: PALETTE.blue, label: t.KpiPeople, value: holders.length, hint: t.KpiPeopleHint },
    { key: 'held', icon: 'Devices3', color: PALETTE.teal, label: t.KpiAssetsHeld, value: held, hint: formatString(t.KpiAssetsHeldHint, items.length) },
    { key: 'average', icon: 'Calculator', color: PALETTE.purple, label: t.KpiAveragePerPerson, value: holders.length ? (Math.round((held / holders.length) * 10) / 10).toString() : '—', hint: t.KpiAveragePerPersonHint },
    { key: 'largest', icon: 'Trophy2', color: PALETTE.amber, label: t.KpiLargestHolding, value: largest ? largest.assets.length : '—', hint: largest ? largest.name : undefined }
  ];

  const exportCsv = (): void => exportRowsToCsv(
    'Assets_By_Person_Report',
    [strings.Columns.EmployeeName, t.ColEmail, strings.Columns.AssetName, strings.ReportsPage.LabelAssetType, strings.Columns.SerialNumber, strings.Columns.Status, strings.Columns.Condition, t.ColAssignedOn],
    shown.reduce((all, h) => all.concat(h.assets.map(a => [h.name, h.email, nameOf(a), a.assetType, a.serialNumber, a.status, a.condition, formatDay(a.assignedDate)])), [] as (string | undefined)[][])
  );

  return (
    <div>
      <KpiRow kpis={kpis} />

      <div className={css.toolbar}>
        <SearchBox className={css.search} placeholder={t.SearchPeople} value={search} onChange={(_, v) => setSearch(v || '')} onClear={() => setSearch('')} />
      </div>

      <div className={css.resultLine}>
        <span>{formatString(t.ResultPeople, shown.length, holders.length)}</span>
        <ExportButtons onExcel={exportCsv} disabled={shown.length === 0} />
      </div>

      {shown.length === 0 ? (
        <div className={css.empty}>{holders.length === 0 ? t.EmptyPeople : strings.RecordLists.EmptyFiltered}</div>
      ) : (
        <div className={css.tableCard}>
          {visible.map(holder => {
            const open = !!expanded[holder.key];
            const types = countBy(holder.assets, a => (a.assetType || '').trim() || strings.RecordLists.Unspecified);
            return (
              <div key={holder.key} className={css.personItem}>
                <button type="button" className={css.person} aria-expanded={open} onClick={() => setExpanded(prev => ({ ...prev, [holder.key]: !prev[holder.key] }))}>
                  <span className={css.coin} aria-hidden="true">{initials(holder.name)}</span>
                  <span className={css.personText}>
                    <span className={css.strong}>{holder.name}</span>
                    {holder.email && <span className={css.meta}>{holder.email}</span>}
                  </span>
                  <span className={css.personPills}>
                    {rankedKeys(types).map(type => <Pill key={type} tone={TONES.grey} text={`${types[type]} × ${type}`} />)}
                  </span>
                  <Pill tone={TONES.blue} text={formatString(t.PeopleAssetCount, holder.assets.length)} />
                  <Icon iconName={open ? 'ChevronUp' : 'ChevronDown'} style={{ fontSize: 12 }} aria-hidden="true" />
                </button>
                {open && (
                  <div className={css.personAssets}>
                    {holder.assets.map(asset => (
                      <button key={asset.id} type="button" className={css.assetLine} onClick={() => onOpenAsset(asset)}>
                        <span className={css.two}>
                          <span className={css.strong}>{nameOf(asset) || strings.InventoryExplorer.Unnamed}</span>
                          <span className={css.meta}>{asset.serialNumber || strings.Common.NotAvailable}</span>
                        </span>
                        <span className={css.cellText}>{asset.assetType || '—'}</span>
                        <span className={css.cellText} title={t.ColAssignedOn}>{formatDay(asset.assignedDate)}</span>
                        <Pill tone={statusTone(asset.status)} text={asset.status || '—'} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <Pager page={activePage} pageSize={PAGE_SIZE} totalItems={shown.length} onChange={setPage} />
        </div>
      )}
    </div>
  );
};
