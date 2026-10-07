import * as React from 'react';
import { IReportsPageProps } from '../types/Reports.types';
import { IInventoryItem } from '../models/IInventoryItem';
import * as strings from 'InventoryManagementWebPartStrings';
import { AssetDetailsPanel } from '../components/inventory/AssetDetailsPanel';
import { reportCss as css, ReportTabs, IReportTab } from '../components/reports/reportsUi';
import { OverviewReport, IAssetDrill } from '../components/reports/OverviewReport';
import { AssetsReport, IAssetFilters, NO_ASSET_FILTERS } from '../components/reports/AssetsReport';
import { WarrantyReport, WarrantyChip } from '../components/reports/WarrantyReport';
import { RequestsReport, RequestStageFilter } from '../components/reports/RequestsReport';
import { PeopleReport } from '../components/reports/PeopleReport';

export const ReportsPage: React.FC<IReportsPageProps> = (props) => {
  const { state, actions } = props;
  const { items, requests } = state;

  // Filters live here so a click on an Overview KPI or chart can set them and open the matching tab.
  const [assetFilters, setAssetFilters] = React.useState<IAssetFilters>(NO_ASSET_FILTERS);
  const [warrantyChip, setWarrantyChip] = React.useState<WarrantyChip>('all');
  const [requestStage, setRequestStage] = React.useState<RequestStageFilter>('all');
  const [openAsset, setOpenAsset] = React.useState<IInventoryItem | undefined>();

  const tabs: IReportTab[] = [
    { key: 'insights', label: strings.ReportsPage.TabVisualInsights, icon: 'BarChart4' },
    { key: 'detailed', label: strings.ReportsPage.TabDetailedReports, icon: 'Table' },
    { key: 'expiry', label: strings.ReportsPage.TabWarrantyExpiry, icon: 'Shield' },
    { key: 'requests', label: strings.Reports.TabRequests, icon: 'Send' },
    { key: 'people', label: strings.Reports.TabPeople, icon: 'People' }
  ];
  const tab = tabs.some(t => t.key === state.reportsSelectedTab) ? state.reportsSelectedTab : 'insights';

  const drillAssets = (drill: IAssetDrill): void => {
    actions.onAssetTypeFilterChange(drill.type || 'All');
    actions.onStatusFilterChange(drill.status || 'All');
    setAssetFilters({ ...NO_ASSET_FILTERS, condition: drill.condition || 'all' });
    actions.onTabChange('detailed');
  };

  return (
    <div className={css.root}>
      <div className={css.header}>
        <div>
          <h3 className={css.title}>{strings.ReportsPage.HeaderTitle}</h3>
          <p className={css.subtitle}>{strings.ReportsPage.HeaderSubtitle}</p>
        </div>
      </div>

      <ReportTabs tabs={tabs} selected={tab} onSelect={actions.onTabChange} ariaLabel={strings.ReportsPage.HeaderTitle} />

      {tab === 'insights' && (
        <OverviewReport
          items={items}
          requests={requests}
          onDrillAssets={drillAssets}
          onDrillWarranty={(chip) => { setWarrantyChip(chip); actions.onTabChange('expiry'); }}
          onDrillRequests={(stage) => { setRequestStage(stage || 'all'); actions.onTabChange('requests'); }}
        />
      )}

      {tab === 'detailed' && (
        <AssetsReport
          items={items}
          typeFilter={state.reportsAssetTypeFilter}
          statusFilter={state.reportsStatusFilter}
          onTypeChange={actions.onAssetTypeFilterChange}
          onStatusChange={actions.onStatusFilterChange}
          filters={assetFilters}
          onFiltersChange={setAssetFilters}
          onExportExcel={actions.onExportDetailedReportToExcel}
          onExportPdf={actions.onExportDetailedReportToPDF}
          onOpenAsset={setOpenAsset}
        />
      )}

      {tab === 'expiry' && (
        <WarrantyReport
          items={items}
          chip={warrantyChip}
          onChipChange={setWarrantyChip}
          onExportExcel={actions.onExportWarrantyReportToExcel}
          onExportPdf={actions.onExportWarrantyReportToPDF}
          onOpenAsset={setOpenAsset}
        />
      )}

      {tab === 'requests' && (
        <RequestsReport requests={requests} stage={requestStage} onStageChange={setRequestStage} />
      )}

      {tab === 'people' && (
        <PeopleReport items={items} onOpenAsset={setOpenAsset} />
      )}

      <AssetDetailsPanel
        asset={openAsset}
        onDismiss={() => setOpenAsset(undefined)}
        auditLogs={state.auditLogs}
        returnRequests={state.returnRequests}
        spContext={state.spContext}
      />
    </div>
  );
};
