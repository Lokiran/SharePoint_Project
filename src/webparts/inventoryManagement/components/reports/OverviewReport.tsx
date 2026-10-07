import * as React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';
import { IInventoryItem } from '../../models/IInventoryItem';
import { IRequest } from '../../models/IRequest';
import { centerTotalPlugin } from '../../utils/ChartPlugins';
import { getSlaStage, SlaStage } from '../../utils/RequestSlaUtils';
import { statusBucket, statusBucketLabel, StatusBucket, LIFECYCLE_YEARS } from '../inventory/inventoryUi';
import {
  CONDITION_NONE,
  STATUS_ORDER,
  AGE_BANDS,
  countBy,
  rankedKeys,
  ageBand,
  isPastLifecycle,
  warrantyBucket,
  needsAttention,
  isHeld,
  requestedOn,
  monthKey,
  monthSeries
} from './reportData';
import { STATUS_COLOR, STAGES, STAGE_COLOR, stageLabel, AGE_COLOR, ageBandLabel } from './reportLabels';
import { reportCss as css, PALETTE, ARC_STYLE, BAR_STYLE, IKpi, KpiRow, ReportCard, RankList, doughnutOptions, barOptions } from './reportsUi';

/** A filter set for the Assets tab, produced by clicking a KPI or a chart. */
export interface IAssetDrill {
  type?: string;
  status?: StatusBucket;
  condition?: string;
}

export interface IOverviewReportProps {
  items: IInventoryItem[];
  requests: IRequest[];
  onDrillAssets: (drill: IAssetDrill) => void;
  /** 'attention' = expired or ending within 90 days; 'lifecycle' = past the planned lifecycle. */
  onDrillWarranty: (chip: 'attention' | 'lifecycle') => void;
  onDrillRequests: (stage?: SlaStage) => void;
}

export const OverviewReport: React.FC<IOverviewReportProps> = (props) => {
  const { items, requests, onDrillAssets, onDrillWarranty, onDrillRequests } = props;
  const t = strings.Reports;
  const r = strings.ReportsPage;
  const details = strings.Common.ViewDetails;

  // ---- Inventory numbers ----
  const total = items.length;
  const byStatus = countBy(items, i => statusBucket(i.status));
  const inStock = byStatus.inStock || 0;
  const assigned = byStatus.assigned || 0;
  const inUse = total - inStock;
  const holders = Object.keys(countBy(items.filter(isHeld), i => (i.assignedTo || '').trim().toLowerCase())).length;
  const percent = (part: number, whole: number): number => (whole > 0 ? Math.round((part / whole) * 100) : 0);

  const warranty = countBy(items, i => warrantyBucket(i));
  const warrantyExpired = warranty.expired || 0;
  const warrantySoon = (warranty.within30 || 0) + (warranty.within90 || 0);
  const pastLifecycle = items.filter(i => isPastLifecycle(i)).length;
  const attention = items.filter(needsAttention).length;

  // ---- Request numbers ----
  const byStage = countBy(requests, req => getSlaStage(req));
  const awaitingApproval = byStage.awaitingApproval || 0;
  const awaitingAssignment = byStage.awaitingAssignment || 0;

  const kpis: IKpi[] = [
    { key: 'total', icon: 'Package', color: PALETTE.blue, label: t.KpiTotalAssets, value: total, hint: formatString(t.KpiTotalAssetsHint, Object.keys(countBy(items, i => i.assetType || '')).length), onClick: () => onDrillAssets({}) },
    { key: 'stock', icon: 'Accept', color: PALETTE.green, label: t.KpiInStock, value: inStock, hint: formatString(t.KpiShareHint, percent(inStock, total)), onClick: () => onDrillAssets({ status: 'inStock' }) },
    { key: 'assigned', icon: 'Contact', color: PALETTE.blue, label: t.KpiAssigned, value: assigned, hint: formatString(t.KpiAssignedHint, holders), onClick: () => onDrillAssets({ status: 'assigned' }) },
    { key: 'use', icon: 'SpeedHigh', color: PALETTE.teal, label: t.KpiUtilisation, value: `${percent(inUse, total)}%`, hint: formatString(t.KpiUtilisationHint, inUse, total), percent: percent(inUse, total) },
    { key: 'requests', icon: 'Send', color: PALETTE.purple, label: t.KpiOpenRequests, value: awaitingApproval + awaitingAssignment, hint: formatString(t.KpiOpenRequestsHint, awaitingApproval, awaitingAssignment), onClick: () => onDrillRequests() },
    { key: 'warranty', icon: 'Shield', color: PALETTE.orange, label: t.KpiWarranty, value: warrantyExpired + warrantySoon, hint: formatString(t.KpiWarrantyHint, warrantyExpired, warrantySoon), onClick: () => onDrillWarranty('attention') },
    { key: 'lifecycle', icon: 'History', color: PALETTE.amber, label: t.KpiLifecycle, value: pastLifecycle, hint: formatString(t.KpiLifecycleHint, LIFECYCLE_YEARS), onClick: () => onDrillWarranty('lifecycle') },
    { key: 'condition', icon: 'Repair', color: PALETTE.red, label: t.KpiCondition, value: attention, hint: t.KpiConditionHint, onClick: () => onDrillAssets({ condition: 'attention' }) }
  ];

  // ---- Assets by status ----
  const statusShown = STATUS_ORDER.filter(b => (byStatus[b] || 0) > 0);
  const statusData = {
    labels: statusShown.map(b => `${statusBucketLabel(b)} (${byStatus[b]})`),
    datasets: [{ data: statusShown.map(b => byStatus[b]), backgroundColor: statusShown.map(b => STATUS_COLOR[b]), ...ARC_STYLE }]
  };

  // ---- Assets by type, split into in stock / assigned / everything else ----
  const typeOf = (i: IInventoryItem): string => (i.assetType || '').trim() || strings.RecordLists.Unspecified;
  const types = rankedKeys(countBy(items, typeOf));
  const typeCount = (type: string, match: (bucket: StatusBucket) => boolean): number =>
    items.filter(i => typeOf(i) === type && match(statusBucket(i.status))).length;
  const typeSeries: { label: string; color: string; status?: StatusBucket; match: (bucket: StatusBucket) => boolean }[] = [
    { label: statusBucketLabel('inStock'), color: STATUS_COLOR.inStock, status: 'inStock', match: b => b === 'inStock' },
    { label: statusBucketLabel('assigned'), color: STATUS_COLOR.assigned, status: 'assigned', match: b => b === 'assigned' },
    { label: t.SeriesOther, color: PALETTE.grey, match: b => b !== 'inStock' && b !== 'assigned' }
  ];
  const typeData = {
    labels: types,
    datasets: typeSeries.map(series => ({ label: series.label, data: types.map(type => typeCount(type, series.match)), backgroundColor: series.color, ...BAR_STYLE }))
  };

  // ---- Asset age ----
  const byAge = countBy(items, i => ageBand(i));
  const ageShown = AGE_BANDS.filter(b => (byAge[b] || 0) > 0);
  const ageData = {
    labels: ageShown.map(b => `${ageBandLabel(b)} (${byAge[b]})`),
    datasets: [{ data: ageShown.map(b => byAge[b]), backgroundColor: ageShown.map(b => AGE_COLOR[b]), ...ARC_STYLE }]
  };

  // ---- Condition ----
  const byCondition = countBy(items, i => (i.condition || '').trim() || CONDITION_NONE);
  const conditionRows = rankedKeys(byCondition).map(key => ({
    key,
    label: key === CONDITION_NONE ? strings.RecordLists.Unspecified : key,
    value: byCondition[key],
    onClick: () => onDrillAssets({ condition: key })
  }));

  // ---- Requests per month (last 6 months) ----
  const months = monthSeries(-5, 6);
  const monthly = (match: (stage: SlaStage) => boolean): number[] => months.map(m =>
    requests.filter(req => { const d = requestedOn(req); return !!d && monthKey(d) === m.key && match(getSlaStage(req)); }).length);
  const monthlyData = {
    labels: months.map(m => m.label),
    datasets: [
      { label: t.OutcomeFulfilled, data: monthly(s => s === 'assigned'), backgroundColor: STAGE_COLOR.assigned, ...BAR_STYLE },
      { label: t.SeriesInProgress, data: monthly(s => s === 'awaitingApproval' || s === 'awaitingAssignment'), backgroundColor: PALETTE.amber, ...BAR_STYLE },
      { label: t.OutcomeRejected, data: monthly(s => s === 'rejected'), backgroundColor: STAGE_COLOR.rejected, ...BAR_STYLE }
    ]
  };

  // ---- Request outcomes ----
  const stagesShown = STAGES.filter(s => (byStage[s] || 0) > 0);
  const outcomeData = {
    labels: stagesShown.map(s => `${stageLabel(s)} (${byStage[s]})`),
    datasets: [{ data: stagesShown.map(s => byStage[s]), backgroundColor: stagesShown.map(s => STAGE_COLOR[s]), ...ARC_STYLE }]
  };

  const noData = <div className={css.empty}>{t.NoData}</div>;

  return (
    <div>
      <KpiRow kpis={kpis} />

      <div className={css.grid}>
        <ReportCard title={r.ChartStatusDistribution} subtitle={t.ChartClickHint} action={{ text: details, onClick: () => onDrillAssets({}) }}>
          {total === 0 ? noData : (
            <div className={css.chartBox}>
              <Doughnut data={statusData} options={doughnutOptions(total, (index) => onDrillAssets({ status: statusShown[index] })) as any} plugins={[centerTotalPlugin]} />
            </div>
          )}
        </ReportCard>

        <ReportCard title={r.ChartTypeDistribution} subtitle={t.ChartTypeSub} action={{ text: details, onClick: () => onDrillAssets({}) }}>
          {total === 0 ? noData : (
            <div className={css.chartBox}>
              <Bar
                data={typeData}
                options={barOptions({ stacked: true, showLegend: true, onPick: (index, datasetIndex) => onDrillAssets({ type: items.some(i => (i.assetType || '').trim() === types[index]) ? types[index] : undefined, status: typeSeries[datasetIndex].status }) }) as any}
              />
            </div>
          )}
        </ReportCard>

        <ReportCard title={r.ChartAgingAnalysis} subtitle={t.ChartAgeSub} action={{ text: details, onClick: () => onDrillWarranty('lifecycle') }}>
          {total === 0 ? noData : (
            <div className={css.chartBox}>
              <Doughnut data={ageData} options={doughnutOptions(total) as any} plugins={[centerTotalPlugin]} />
            </div>
          )}
        </ReportCard>

        <ReportCard title={t.ChartCondition} subtitle={t.ChartClickHint}>
          <RankList rows={conditionRows} emptyText={t.NoData} />
        </ReportCard>

        <ReportCard title={t.ChartRequestsMonthly} subtitle={t.ChartRequestsMonthlySub} action={{ text: details, onClick: () => onDrillRequests() }}>
          {requests.length === 0 ? noData : (
            <div className={css.chartBox}>
              <Bar data={monthlyData} options={barOptions({ stacked: true, showLegend: true }) as any} />
            </div>
          )}
        </ReportCard>

        <ReportCard title={t.ChartOutcomes} subtitle={t.ChartClickHint} action={{ text: details, onClick: () => onDrillRequests() }}>
          {requests.length === 0 ? noData : (
            <div className={css.chartBox}>
              <Doughnut data={outcomeData} options={doughnutOptions(requests.length, (index) => onDrillRequests(stagesShown[index])) as any} plugins={[centerTotalPlugin]} />
            </div>
          )}
        </ReportCard>
      </div>
    </div>
  );
};
