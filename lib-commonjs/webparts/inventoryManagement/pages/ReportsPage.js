"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsPage = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const strings = tslib_1.__importStar(require("InventoryManagementWebPartStrings"));
const AssetDetailsPanel_1 = require("../components/inventory/AssetDetailsPanel");
const reportsUi_1 = require("../components/reports/reportsUi");
const OverviewReport_1 = require("../components/reports/OverviewReport");
const AssetsReport_1 = require("../components/reports/AssetsReport");
const WarrantyReport_1 = require("../components/reports/WarrantyReport");
const RequestsReport_1 = require("../components/reports/RequestsReport");
const PeopleReport_1 = require("../components/reports/PeopleReport");
const ReportsPage = (props) => {
    const { state, actions } = props;
    const { items, requests } = state;
    // Filters live here so a click on an Overview KPI or chart can set them and open the matching tab.
    const [assetFilters, setAssetFilters] = React.useState(AssetsReport_1.NO_ASSET_FILTERS);
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
        setAssetFilters({ ...AssetsReport_1.NO_ASSET_FILTERS, condition: drill.condition || 'all' });
        actions.onTabChange('detailed');
    };
    return (React.createElement("div", { className: reportsUi_1.reportCss.root },
        React.createElement("div", { className: reportsUi_1.reportCss.header },
            React.createElement("div", null,
                React.createElement("h3", { className: reportsUi_1.reportCss.title }, strings.ReportsPage.HeaderTitle),
                React.createElement("p", { className: reportsUi_1.reportCss.subtitle }, strings.ReportsPage.HeaderSubtitle))),
        React.createElement(reportsUi_1.ReportTabs, { tabs: tabs, selected: tab, onSelect: actions.onTabChange, ariaLabel: strings.ReportsPage.HeaderTitle }),
        tab === 'insights' && (React.createElement(OverviewReport_1.OverviewReport, { items: items, requests: requests, onDrillAssets: drillAssets, onDrillWarranty: (chip) => { setWarrantyChip(chip); actions.onTabChange('expiry'); }, onDrillRequests: (stage) => { setRequestStage(stage || 'all'); actions.onTabChange('requests'); } })),
        tab === 'detailed' && (React.createElement(AssetsReport_1.AssetsReport, { items: items, typeFilter: state.reportsAssetTypeFilter, statusFilter: state.reportsStatusFilter, onTypeChange: actions.onAssetTypeFilterChange, onStatusChange: actions.onStatusFilterChange, filters: assetFilters, onFiltersChange: setAssetFilters, onExportExcel: actions.onExportDetailedReportToExcel, onExportPdf: actions.onExportDetailedReportToPDF, onOpenAsset: setOpenAsset })),
        tab === 'expiry' && (React.createElement(WarrantyReport_1.WarrantyReport, { items: items, chip: warrantyChip, onChipChange: setWarrantyChip, onExportExcel: actions.onExportWarrantyReportToExcel, onExportPdf: actions.onExportWarrantyReportToPDF, onOpenAsset: setOpenAsset })),
        tab === 'requests' && (React.createElement(RequestsReport_1.RequestsReport, { requests: requests, stage: requestStage, onStageChange: setRequestStage })),
        tab === 'people' && (React.createElement(PeopleReport_1.PeopleReport, { items: items, onOpenAsset: setOpenAsset })),
        React.createElement(AssetDetailsPanel_1.AssetDetailsPanel, { asset: openAsset, onDismiss: () => setOpenAsset(undefined), auditLogs: state.auditLogs, returnRequests: state.returnRequests, spContext: state.spContext })));
};
exports.ReportsPage = ReportsPage;
//# sourceMappingURL=ReportsPage.js.map