import * as React from 'react';
import * as strings from 'InventoryManagementWebPartStrings';
import { AssetDetailsPanel } from '../components/inventory/AssetDetailsPanel';
import { reportCss as css, ReportTabs } from '../components/reports/reportsUi';
import { OverviewReport } from '../components/reports/OverviewReport';
import { AssetsReport, NO_ASSET_FILTERS } from '../components/reports/AssetsReport';
import { WarrantyReport } from '../components/reports/WarrantyReport';
import { RequestsReport } from '../components/reports/RequestsReport';
import { PeopleReport } from '../components/reports/PeopleReport';
export const ReportsPage = (props) => {
    const { state, actions } = props;
    const { items, requests } = state;
    // Filters live here so a click on an Overview KPI or chart can set them and open the matching tab.
    const [assetFilters, setAssetFilters] = React.useState(NO_ASSET_FILTERS);
    const [warrantyChip, setWarrantyChip] = React.useState('all');
    const [requestStage, setRequestStage] = React.useState('all');
    const [openAsset, setOpenAsset] = React.useState();
    const tabs = [
        { key: 'insights', label: strings.ReportsPage.TabVisualInsights, icon: 'BarChart4' },
        { key: 'detailed', label: strings.ReportsPage.TabDetailedReports, icon: 'Table' },
        { key: 'expiry', label: strings.ReportsPage.TabWarrantyExpiry, icon: 'Shield' },
        { key: 'requests', label: strings.Reports.TabRequests, icon: 'Send' },
        { key: 'people', label: strings.Reports.TabPeople, icon: 'People' }
    ];
    const tab = tabs.some(t => t.key === state.reportsSelectedTab) ? state.reportsSelectedTab : 'insights';
    const drillAssets = (drill) => {
        actions.onAssetTypeFilterChange(drill.type || 'All');
        actions.onStatusFilterChange(drill.status || 'All');
        setAssetFilters({ ...NO_ASSET_FILTERS, condition: drill.condition || 'all' });
        actions.onTabChange('detailed');
    };
    return (React.createElement("div", { className: css.root },
        React.createElement("div", { className: css.header },
            React.createElement("div", null,
                React.createElement("h3", { className: css.title }, strings.ReportsPage.HeaderTitle),
                React.createElement("p", { className: css.subtitle }, strings.ReportsPage.HeaderSubtitle))),
        React.createElement(ReportTabs, { tabs: tabs, selected: tab, onSelect: actions.onTabChange, ariaLabel: strings.ReportsPage.HeaderTitle }),
        tab === 'insights' && (React.createElement(OverviewReport, { items: items, requests: requests, onDrillAssets: drillAssets, onDrillWarranty: (chip) => { setWarrantyChip(chip); actions.onTabChange('expiry'); }, onDrillRequests: (stage) => { setRequestStage(stage || 'all'); actions.onTabChange('requests'); } })),
        tab === 'detailed' && (React.createElement(AssetsReport, { items: items, typeFilter: state.reportsAssetTypeFilter, statusFilter: state.reportsStatusFilter, onTypeChange: actions.onAssetTypeFilterChange, onStatusChange: actions.onStatusFilterChange, filters: assetFilters, onFiltersChange: setAssetFilters, onExportExcel: actions.onExportDetailedReportToExcel, onExportPdf: actions.onExportDetailedReportToPDF, onOpenAsset: setOpenAsset })),
        tab === 'expiry' && (React.createElement(WarrantyReport, { items: items, chip: warrantyChip, onChipChange: setWarrantyChip, onExportExcel: actions.onExportWarrantyReportToExcel, onExportPdf: actions.onExportWarrantyReportToPDF, onOpenAsset: setOpenAsset })),
        tab === 'requests' && (React.createElement(RequestsReport, { requests: requests, stage: requestStage, onStageChange: setRequestStage })),
        tab === 'people' && (React.createElement(PeopleReport, { items: items, onOpenAsset: setOpenAsset })),
        React.createElement(AssetDetailsPanel, { asset: openAsset, onDismiss: () => setOpenAsset(undefined), auditLogs: state.auditLogs, returnRequests: state.returnRequests, spContext: state.spContext })));
};
//# sourceMappingURL=ReportsPage.js.map