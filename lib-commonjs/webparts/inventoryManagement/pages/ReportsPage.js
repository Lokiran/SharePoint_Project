"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsPage = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("@fluentui/react");
const react_chartjs_2_1 = require("react-chartjs-2");
const InventoryManagement_module_scss_1 = tslib_1.__importDefault(require("../components/InventoryManagement.module.scss"));
const WarrantyUtils_1 = require("../utils/WarrantyUtils");
const ReportsPage = (props) => {
    const { state, actions } = props;
    const { items, requests } = state;
    return (React.createElement("div", null,
        React.createElement("div", { className: InventoryManagement_module_scss_1.default.cardHeader, style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            React.createElement("div", null,
                React.createElement("h3", null, "Reporting & Insights"),
                React.createElement("p", { style: { color: 'var(--text-muted)', margin: '4px 0 0 0', fontSize: '0.85rem' } }, "Interactive dashboards, live graphs, status analysis, and exporter module."))),
        React.createElement(react_1.Pivot, { selectedKey: state.reportsSelectedTab, onLinkClick: (item) => actions.onTabChange(item ? item.props.itemKey || 'insights' : 'insights'), styles: { root: { marginBottom: '20px', borderBottom: '1px solid rgba(128,128,128,0.1)' } } },
            React.createElement(react_1.PivotItem, { headerText: "Visual Insights", itemKey: "insights" }),
            React.createElement(react_1.PivotItem, { headerText: "Detailed Reports", itemKey: "detailed" }),
            React.createElement(react_1.PivotItem, { headerText: "Warranty Expiry", itemKey: "expiry" })),
        state.reportsSelectedTab === 'insights' && (React.createElement(react_1.Stack, { tokens: { childrenGap: 24 } },
            React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' } },
                React.createElement("div", { style: { padding: '16px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } },
                    React.createElement("span", { style: { display: 'block', fontSize: '0.82rem', color: '#6b7280', fontWeight: 600, marginBottom: '6px' } }, "TOTAL INVENTORY ASSETS"),
                    React.createElement("span", { style: { fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-main, #111827)' } }, items.length)),
                React.createElement("div", { style: { padding: '16px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } },
                    React.createElement("span", { style: { display: 'block', fontSize: '0.82rem', color: '#1e40af', fontWeight: 600, marginBottom: '6px' } }, "ASSETS CURRENTLY ASSIGNED"),
                    React.createElement("span", { style: { fontSize: '1.75rem', fontWeight: 'bold', color: '#1e3a8a' } }, items.length - items.filter(i => i.status === 'In Stock' || i.status === 'Yes').length)),
                React.createElement("div", { style: { padding: '16px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } },
                    React.createElement("span", { style: { display: 'block', fontSize: '0.82rem', color: '#166534', fontWeight: 600, marginBottom: '6px' } }, "UTILIZATION RATE"),
                    React.createElement("span", { style: { fontSize: '1.75rem', fontWeight: 'bold', color: '#14532d' } },
                        items.length > 0 ? Math.round(((items.length - items.filter(i => i.status === 'In Stock' || i.status === 'Yes').length) / items.length) * 100) : 0,
                        "%")),
                React.createElement("div", { style: { padding: '16px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } },
                    React.createElement("span", { style: { display: 'block', fontSize: '0.82rem', color: '#92400e', fontWeight: 600, marginBottom: '6px' } }, "TOTAL APPROVAL REQUESTS"),
                    React.createElement("span", { style: { fontSize: '1.75rem', fontWeight: 'bold', color: '#78350f' } }, requests.length))),
            React.createElement("div", { className: InventoryManagement_module_scss_1.default.responsiveGridGap20 },
                React.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                    React.createElement("h4", { style: { margin: '0 0 15px 0', alignSelf: 'flex-start', color: '#374151' } }, "Asset Status Distribution"),
                    React.createElement("div", { style: { height: '220px', width: '220px', position: 'relative' } },
                        React.createElement(react_chartjs_2_1.Pie, { data: {
                                labels: ['In Stock', 'Assigned', 'Pending Return', 'Under Maintenance'],
                                datasets: [{
                                        data: [
                                            items.filter(i => i.status === 'In Stock' || i.status === 'Yes').length,
                                            items.filter(i => i.status === 'Assigned' || i.status === 'Yes (Assigned)').length,
                                            items.filter(i => i.status === 'Pending Return').length,
                                            items.filter(i => i.status === 'Under Maintenance' || i.status === 'Damaged' || i.status === 'Poor').length,
                                        ],
                                        backgroundColor: ['#107c41', '#1f77b4', '#ea580c', '#b91c1c']
                                    }]
                            }, options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } }
                            } })),
                    React.createElement("div", { style: { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '15px', fontSize: '0.78rem', color: '#4b5563' } },
                        React.createElement("span", null,
                            React.createElement("span", { style: { color: '#107c41', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' } }, "\u25CF"),
                            "In Stock"),
                        React.createElement("span", null,
                            React.createElement("span", { style: { color: '#1f77b4', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' } }, "\u25CF"),
                            "Assigned"),
                        React.createElement("span", null,
                            React.createElement("span", { style: { color: '#ea580c', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' } }, "\u25CF"),
                            "Pending Return"),
                        React.createElement("span", null,
                            React.createElement("span", { style: { color: '#b91c1c', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' } }, "\u25CF"),
                            "Maintenance"))),
                React.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } },
                    React.createElement("h4", { style: { margin: '0 0 15px 0', color: '#374151' } }, "Asset Type Distribution"),
                    React.createElement("div", { style: { height: '240px' } }, (() => {
                        const typeCounts = {};
                        items.forEach(i => {
                            const type = i.assetType || "Other";
                            typeCounts[type] = (typeCounts[type] || 0) + 1;
                        });
                        const labels = Object.keys(typeCounts);
                        const data = Object.keys(typeCounts).map(key => typeCounts[key]);
                        return (React.createElement(react_chartjs_2_1.Bar, { data: {
                                labels,
                                datasets: [{
                                        label: 'Assets Count',
                                        data,
                                        backgroundColor: '#1f77b4',
                                        borderRadius: 4
                                    }]
                            }, options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { beginAtZero: true, ticks: { precision: 0 } }
                                }
                            } }));
                    })())),
                React.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                    React.createElement("h4", { style: { margin: '0 0 15px 0', alignSelf: 'flex-start', color: '#374151' } }, "Asset Aging Analysis"),
                    React.createElement("div", { style: { height: '220px', width: '220px', position: 'relative' } }, (() => {
                        const now = new Date();
                        const aging = items.reduce((acc, item) => {
                            if (!item.purchaseDate) {
                                acc.unknown++;
                                return acc;
                            }
                            const pd = new Date(item.purchaseDate);
                            const diffYears = Math.abs(now.getTime() - pd.getTime()) / (1000 * 60 * 60 * 24 * 365);
                            if (diffYears < 1)
                                acc.under1++;
                            else if (diffYears <= 3)
                                acc.between1and3++;
                            else
                                acc.over3++;
                            return acc;
                        }, { under1: 0, between1and3: 0, over3: 0, unknown: 0 });
                        return (React.createElement(react_chartjs_2_1.Doughnut, { data: {
                                labels: ['< 1 Year (New)', '1-3 Years', '> 3 Years (Aging)', 'Unknown'],
                                datasets: [{
                                        data: [aging.under1, aging.between1and3, aging.over3, aging.unknown],
                                        backgroundColor: ['#2ca02c', '#ff7f0e', '#d62728', '#9467bd']
                                    }]
                            }, options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } }
                            } }));
                    })()),
                    React.createElement("div", { style: { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '15px', fontSize: '0.78rem', color: '#4b5563' } },
                        React.createElement("span", null,
                            React.createElement("span", { style: { color: '#2ca02c', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' } }, "\u25CF"),
                            "< 1 Year"),
                        React.createElement("span", null,
                            React.createElement("span", { style: { color: '#ff7f0e', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' } }, "\u25CF"),
                            "1-3 Years"),
                        React.createElement("span", null,
                            React.createElement("span", { style: { color: '#d62728', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' } }, "\u25CF"),
                            "> 3 Years"),
                        React.createElement("span", null,
                            React.createElement("span", { style: { color: '#9467bd', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' } }, "\u25CF"),
                            "Unknown"))),
                React.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } },
                    React.createElement("h4", { style: { margin: '0 0 15px 0', color: '#374151' } }, "Request Approval Trends"),
                    React.createElement("div", { style: { height: '240px' } },
                        React.createElement(react_chartjs_2_1.Bar, { data: {
                                labels: ['Approved', 'Declined/Rejected', 'Pending'],
                                datasets: [{
                                        data: [
                                            requests.filter(r => (r.status || '').toLowerCase().includes('approv')).length,
                                            requests.filter(r => (r.status || '').toLowerCase().includes('declin') || (r.status || '').toLowerCase().includes('reject')).length,
                                            requests.filter(r => (r.status || '').toLowerCase() === 'pending').length
                                        ],
                                        backgroundColor: ['#2ca02c', '#d62728', '#ff7f0e']
                                    }]
                            }, options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { beginAtZero: true, ticks: { precision: 0 } }
                                }
                            } })))))),
        state.reportsSelectedTab === 'detailed' && (React.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } },
            React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px', alignItems: 'center', marginBottom: '20px' } },
                React.createElement("h4", { style: { margin: 0 } }, "Filterable Asset Inventory"),
                React.createElement(react_1.Stack, { horizontal: true, tokens: { childrenGap: 8 } },
                    React.createElement(react_1.PrimaryButton, { text: "Export Excel", iconProps: { iconName: 'ExcelDocument' }, onClick: () => {
                            const filtered = items.filter(i => {
                                const typeMatch = state.reportsAssetTypeFilter === 'All' || i.assetType === state.reportsAssetTypeFilter;
                                const statusMatch = state.reportsStatusFilter === 'All' || i.status === state.reportsStatusFilter;
                                return typeMatch && statusMatch;
                            });
                            actions.onExportDetailedReportToExcel(filtered);
                        }, styles: { root: { backgroundColor: '#107c41', borderColor: '#107c41', color: '#ffffff' } } }),
                    React.createElement(react_1.PrimaryButton, { text: "Export PDF", iconProps: { iconName: 'PDF' }, onClick: () => {
                            const filtered = items.filter(i => {
                                const typeMatch = state.reportsAssetTypeFilter === 'All' || i.assetType === state.reportsAssetTypeFilter;
                                const statusMatch = state.reportsStatusFilter === 'All' || i.status === state.reportsStatusFilter;
                                return typeMatch && statusMatch;
                            });
                            actions.onExportDetailedReportToPDF(filtered);
                        }, styles: { root: { backgroundColor: '#d13438', borderColor: '#d13438', color: '#ffffff' } } }))),
            React.createElement("div", { style: { display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' } },
                React.createElement("div", { style: { minWidth: '150px' } },
                    React.createElement(react_1.Dropdown, { label: "Asset Type", selectedKey: state.reportsAssetTypeFilter, options: [
                            { key: 'All', text: 'All Types' },
                            ...Array.from(new Set(items.map(i => i.assetType).filter(Boolean))).map(type => ({ key: type, text: type }))
                        ], onChange: (_, opt) => actions.onAssetTypeFilterChange(opt ? opt.key : 'All') })),
                React.createElement("div", { style: { minWidth: '150px' } },
                    React.createElement(react_1.Dropdown, { label: "Asset Status", selectedKey: state.reportsStatusFilter, options: [
                            { key: 'All', text: 'All Statuses' },
                            ...Array.from(new Set(items.map(i => i.status).filter(Boolean))).map(status => ({ key: status, text: status }))
                        ], onChange: (_, opt) => actions.onStatusFilterChange(opt ? opt.key : 'All') }))),
            (() => {
                const filtered = items.filter(i => {
                    const typeMatch = state.reportsAssetTypeFilter === 'All' || i.assetType === state.reportsAssetTypeFilter;
                    const statusMatch = state.reportsStatusFilter === 'All' || i.status === state.reportsStatusFilter;
                    return typeMatch && statusMatch;
                });
                return (React.createElement(react_1.DetailsList, { items: filtered, columns: [
                        { key: 'col1', name: 'Asset Name', fieldName: 'assetName', minWidth: 120, maxWidth: 180, isResizable: true, onRender: (item) => item.assetName || item.title },
                        { key: 'col2', name: 'Asset Type', fieldName: 'assetType', minWidth: 90, maxWidth: 120, isResizable: true },
                        { key: 'col3', name: 'Status', fieldName: 'status', minWidth: 90, maxWidth: 120, isResizable: true },
                        { key: 'col4', name: 'Condition', fieldName: 'condition', minWidth: 80, maxWidth: 100, isResizable: true },
                        { key: 'col5', name: 'Assigned To', fieldName: 'assignedTo', minWidth: 100, maxWidth: 140, isResizable: true, onRender: (item) => item.assignedTo || React.createElement("span", { style: { color: '#9ca3af', fontStyle: 'italic' } }, "Unassigned") }
                    ], setKey: "detailedReportList", layoutMode: react_1.DetailsListLayoutMode.justified, selectionMode: react_1.SelectionMode.none }));
            })())),
        state.reportsSelectedTab === 'expiry' && (React.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } },
            React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' } },
                React.createElement("h4", { style: { margin: 0 } }, "Warranty Expiry Report"),
                React.createElement(react_1.Stack, { horizontal: true, tokens: { childrenGap: 8 } },
                    React.createElement(react_1.PrimaryButton, { text: "Export Excel", iconProps: { iconName: 'ExcelDocument' }, onClick: actions.onExportWarrantyReportToExcel, styles: { root: { backgroundColor: '#107c41', borderColor: '#107c41', color: '#ffffff' } } }),
                    React.createElement(react_1.PrimaryButton, { text: "Export PDF", iconProps: { iconName: 'PDF' }, onClick: actions.onExportWarrantyReportToPDF, styles: { root: { backgroundColor: '#d13438', borderColor: '#d13438', color: '#ffffff' } } }))),
            React.createElement("div", { style: { marginBottom: '15px', display: 'flex', gap: '20px' } },
                React.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#f3f4f6', borderRadius: '6px' } },
                    React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px' } }, "Total Assets Count"),
                    React.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' } }, items.length)),
                React.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#f3f4f6', borderRadius: '6px' } },
                    React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px' } }, "Assets with Warranty Data"),
                    React.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' } }, items.filter(i => i.warrantyExpiry).length))),
            React.createElement(react_1.DetailsList, { items: items, columns: [
                    { key: 'col1', name: 'Asset Name', fieldName: 'assetName', minWidth: 120, maxWidth: 200, isResizable: true, onRender: (item) => item.assetName || item.title },
                    { key: 'col2', name: 'Asset Type', fieldName: 'assetType', minWidth: 100, maxWidth: 150, isResizable: true },
                    { key: 'col3', name: 'Status', fieldName: 'status', minWidth: 80, maxWidth: 100, isResizable: true },
                    { key: 'col4', name: 'Purchase Date', fieldName: 'purchaseDate', minWidth: 100, maxWidth: 120, isResizable: true },
                    {
                        key: 'col5',
                        name: 'Warranty Expiry Date',
                        fieldName: 'warrantyExpiry',
                        minWidth: 140,
                        maxWidth: 200,
                        isResizable: true,
                        onRender: (item) => {
                            const warrantyInfo = (0, WarrantyUtils_1.getWarrantyColorInfo)(item.warrantyExpiry);
                            return (React.createElement("span", { style: {
                                    color: warrantyInfo.textColor,
                                    fontWeight: 600,
                                    backgroundColor: warrantyInfo.bgColor,
                                    border: `1px solid ${warrantyInfo.borderColor}`,
                                    padding: '2px 8px',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    display: 'inline-block'
                                } },
                                item.warrantyExpiry || 'N/A',
                                " ",
                                item.warrantyExpiry ? warrantyInfo.statusText : ''));
                        }
                    }
                ], setKey: "warrantyReport", layoutMode: react_1.DetailsListLayoutMode.justified, selectionMode: react_1.SelectionMode.none })))));
};
exports.ReportsPage = ReportsPage;
//# sourceMappingURL=ReportsPage.js.map