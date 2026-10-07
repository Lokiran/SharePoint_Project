import * as React from 'react';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { ActionButton } from '@fluentui/react/lib/Button';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';
import { IRequest } from '../../models/IRequest';
import { getAppConfig } from '../../config/AppConfig';
import { getSlaStage, summarizeSla, SlaStage, IRequestSla } from '../../utils/RequestSlaUtils';
import { exportRowsToCsv } from '../../utils/ReportExportUtils';
import { StatusChips, IStatusChip, Pill, priorityTone, formatFlexibleDay, relativeDay, dateRangeOptions, inDateRange, DateRangeKey } from '../common/listUi';
import { countBy, rankedKeys, requestedOn } from './reportData';
import { STAGES, STAGE_COLOR, stageLabel, stageTone, durationText } from './reportLabels';
import { reportCss as css, PALETTE, IKpi, KpiRow, ReportCard, RankList, ReportTable, IReportColumn } from './reportsUi';
import { ExportButtons } from './reportParts';

export type RequestStageFilter = 'all' | SlaStage;

export interface IRequestsReportProps {
  requests: IRequest[];
  stage: RequestStageFilter;
  onStageChange: (stage: RequestStageFilter) => void;
}

const TOP_COUNT = 5;

const refOf = (request: IRequest): string => request.requestKey || request.id;
const dateTextOf = (request: IRequest): string | undefined => request.createdAt || request.requestDate;
const timeOfRequest = (request: IRequest): number => { const d = requestedOn(request); return d ? d.getTime() : 0; };

/** Asset requests: volumes, approval rate, turnaround times and the full filterable list. */
export const RequestsReport: React.FC<IRequestsReportProps> = (props) => {
  const { requests, stage } = props;
  const t = strings.Reports;
  const [search, setSearch] = React.useState('');
  const [range, setRange] = React.useState<DateRangeKey>('all');
  const [priority, setPriority] = React.useState('all');

  const query = search.trim().toLowerCase();
  // Everything except the outcome chip: the chips, KPIs and rankings describe this set.
  const scoped = requests.filter(req => {
    if (!inDateRange(dateTextOf(req), range)) return false;
    if (priority !== 'all' && (req.priority || 'Medium').toLowerCase() !== priority) return false;
    if (!query) return true;
    return [refOf(req), req.requesterName, req.requesterEmail, req.assetTitle, req.assetName, req.managerName, req.status]
      .some(v => (v || '').toLowerCase().indexOf(query) >= 0);
  });
  const rows = scoped.filter(req => stage === 'all' || getSlaStage(req) === stage).sort((a, b) => timeOfRequest(b) - timeOfRequest(a));

  const byStage = countBy(scoped, req => getSlaStage(req));
  const chips: IStatusChip[] = [
    { key: 'all', label: strings.RecordLists.TileAll, count: scoped.length },
    ...STAGES.map(s => ({ key: s as string, label: stageLabel(s), count: byStage[s] || 0, color: STAGE_COLOR[s] }))
  ];

  // ---- KPIs ----
  const sla = summarizeSla(scoped, getAppConfig().sla);
  const slaOf: { [id: string]: IRequestSla } = {};
  sla.items.forEach(item => { slaOf[item.request.id] = item; });
  const approved = (byStage.assigned || 0) + (byStage.awaitingAssignment || 0);
  const rejected = byStage.rejected || 0;
  const approvalRate = approved + rejected > 0 ? Math.round((approved / (approved + rejected)) * 100) : undefined;
  const kpis: IKpi[] = [
    { key: 'count', icon: 'Send', color: PALETTE.purple, label: t.KpiRequests, value: scoped.length, hint: formatString(t.KpiRequestsHint, (byStage.awaitingApproval || 0) + (byStage.awaitingAssignment || 0)) },
    { key: 'rate', icon: 'Accept', color: PALETTE.green, label: t.KpiApprovalRate, value: approvalRate === undefined ? '—' : `${approvalRate}%`, hint: formatString(t.KpiApprovalRateHint, approved, rejected), percent: approvalRate },
    { key: 'decision', icon: 'Clock', color: PALETTE.amber, label: t.KpiAvgDecision, value: durationText(sla.averageApprovalHours), hint: t.KpiAvgDecisionHint },
    { key: 'assignment', icon: 'DeliveryTruck', color: PALETTE.blue, label: t.KpiAvgAssignment, value: durationText(sla.averageAssignmentHours), hint: t.KpiAvgAssignmentHint }
  ];

  // ---- Rankings ----
  const byAsset = countBy(scoped, req => (req.assetTitle || req.assetName || '').trim() || strings.RecordLists.Unspecified);
  const byRequester = countBy(scoped, req => (req.requesterName || '').trim() || strings.RecordLists.Unspecified);
  const top = (counts: { [key: string]: number }): { key: string; label: string; value: number; onClick: () => void }[] =>
    rankedKeys(counts).slice(0, TOP_COUNT).map(key => ({ key, label: key, value: counts[key], onClick: () => setSearch(key) }));

  const columns: IReportColumn<IRequest>[] = [
    {
      key: 'id', name: strings.Columns.RequestId, minWidth: 90, maxWidth: 120,
      sortValue: req => parseInt(refOf(req).replace(/\D/g, ''), 10) || 0,
      render: req => <span className={css.strong}>{refOf(req)}</span>
    },
    {
      key: 'employee', name: strings.Columns.EmployeeName, minWidth: 140, maxWidth: 200,
      sortValue: req => (req.requesterName || '').toLowerCase(),
      render: req => (
        <span className={css.two}>
          <span className={css.cellText}>{req.requesterName || '—'}</span>
          {req.requesterEmail && <span className={css.meta}>{req.requesterEmail}</span>}
        </span>
      )
    },
    {
      key: 'asset', name: t.ColAssetRequested, minWidth: 130, maxWidth: 200,
      sortValue: req => (req.assetTitle || '').toLowerCase(),
      render: req => <span className={css.cellText}>{req.assetTitle || req.assetName || '—'}{req.quantity > 1 ? ` × ${req.quantity}` : ''}</span>
    },
    {
      key: 'priority', name: strings.Columns.Priority, minWidth: 80, maxWidth: 100,
      render: req => <Pill tone={priorityTone(req.priority)} text={req.priority || 'Medium'} />
    },
    {
      key: 'requested', name: strings.Columns.RequestedDate, minWidth: 110, maxWidth: 140,
      sortValue: timeOfRequest,
      render: req => (
        <span className={css.two}>
          <span className={css.cellText}>{formatFlexibleDay(dateTextOf(req))}</span>
          {relativeDay(dateTextOf(req)) && <span className={css.meta}>{relativeDay(dateTextOf(req))}</span>}
        </span>
      )
    },
    {
      key: 'manager', name: strings.Columns.ManagerName, minWidth: 120, maxWidth: 170,
      sortValue: req => (req.managerName || '').toLowerCase(),
      render: req => <span className={css.cellText}>{req.managerName || '—'}</span>
    },
    {
      key: 'outcome', name: t.ColOutcome, minWidth: 140, maxWidth: 170,
      sortValue: req => STAGES.indexOf(getSlaStage(req)),
      render: req => <Pill tone={stageTone(getSlaStage(req))} text={stageLabel(getSlaStage(req))} title={req.status} />
    },
    {
      key: 'decision', name: t.ColDecisionTime, minWidth: 110, maxWidth: 130,
      sortValue: req => { const item = slaOf[req.id]; return item && item.approvalHours !== undefined ? item.approvalHours : Number.MAX_SAFE_INTEGER; },
      render: req => <span className={css.cellText}>{durationText(slaOf[req.id] ? slaOf[req.id].approvalHours : undefined)}</span>
    }
  ];

  const exportCsv = (): void => exportRowsToCsv(
    'Asset_Requests_Report',
    [strings.Columns.RequestId, strings.Columns.EmployeeName, t.ColEmail, t.ColAssetRequested, strings.AssignmentQueue.ColQuantity, strings.Columns.Priority, strings.Columns.RequestedDate, strings.Columns.ManagerName, t.ColOutcome, strings.Columns.Status, strings.Columns.Reason, strings.Columns.ManagerComment],
    rows.map(req => [refOf(req), req.requesterName, req.requesterEmail, req.assetTitle || req.assetName, req.quantity, req.priority || 'Medium', formatFlexibleDay(dateTextOf(req)), req.managerName, stageLabel(getSlaStage(req)), req.status, req.reason, req.managerResponse])
  );

  const priorityOptions: IDropdownOption[] = [
    { key: 'all', text: strings.RecordLists.AllPriorities },
    { key: 'high', text: 'High' },
    { key: 'medium', text: 'Medium' },
    { key: 'low', text: 'Low' }
  ];
  const hasFilters = stage !== 'all' || range !== 'all' || priority !== 'all' || !!query;
  const clear = (): void => { props.onStageChange('all'); setRange('all'); setPriority('all'); setSearch(''); };

  return (
    <div>
      <KpiRow kpis={kpis} />

      <StatusChips chips={chips} selected={stage} ariaLabel={t.ColOutcome} onSelect={(key) => props.onStageChange(stage === key ? 'all' : key as RequestStageFilter)} />

      <div className={css.toolbar}>
        <SearchBox className={css.search} placeholder={t.SearchRequests} value={search} onChange={(_, v) => setSearch(v || '')} onClear={() => setSearch('')} />
        <Dropdown label={t.LabelPeriod} options={dateRangeOptions()} selectedKey={range} onChange={(_, o) => o && setRange(o.key as DateRangeKey)} styles={{ root: { width: 160 } }} />
        <Dropdown label={strings.Columns.Priority} options={priorityOptions} selectedKey={priority} onChange={(_, o) => o && setPriority(String(o.key))} styles={{ root: { width: 150 } }} />
      </div>

      <div className={css.resultLine}>
        <span className={css.actions}>
          {formatString(t.ResultRequests, rows.length, requests.length)}
          {hasFilters && <ActionButton iconProps={{ iconName: 'ClearFilter' }} text={strings.RecordLists.ClearFilters} onClick={clear} />}
        </span>
        <ExportButtons onExcel={exportCsv} disabled={rows.length === 0} />
      </div>

      <ReportTable
        rows={rows}
        columns={columns}
        keyOf={req => req.id}
        resetKey={[stage, range, priority, query].join('|')}
        emptyText={requests.length === 0 ? t.NoData : strings.RecordLists.EmptyFiltered}
        ariaLabel={t.TabRequests}
      />

      <div className={`${css.grid} ${css.section}`}>
        <ReportCard title={t.TopRequested} subtitle={t.TopSub}>
          <RankList rows={top(byAsset)} color={PALETTE.purple} emptyText={t.NoData} />
        </ReportCard>
        <ReportCard title={t.TopRequesters} subtitle={t.TopSub}>
          <RankList rows={top(byRequester)} emptyText={t.NoData} />
        </ReportCard>
      </div>
    </div>
  );
};
