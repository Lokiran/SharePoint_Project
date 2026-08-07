"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const Dashboard_module_scss_1 = tslib_1.__importDefault(require("./Dashboard.module.scss"));
const MessageBar_1 = require("@fluentui/react/lib/MessageBar");
const Icon_1 = require("@fluentui/react/lib/Icon");
const chart_js_1 = require("chart.js");
const react_chartjs_2_1 = require("react-chartjs-2");
chart_js_1.Chart.register(chart_js_1.CategoryScale, chart_js_1.LinearScale, chart_js_1.BarElement, chart_js_1.Title, chart_js_1.Tooltip, chart_js_1.Legend, chart_js_1.ArcElement);
const Dashboard = (props) => {
    const { items, requests, isAdmin, isInventoryManager, onNavigate } = props;
    const isManagerView = !!isInventoryManager && !isAdmin;
    // --- Utility: Format Date nicely ---
    const formatDate = (dateStr) => {
        if (!dateStr)
            return 'N/A';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime()))
                return dateStr;
            return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        }
        catch {
            return dateStr;
        }
    };
    // --- Utility: Get current date string ---
    const getCurrentDate = () => {
        const now = new Date();
        return now.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    // --- Utility: Semantic Fluent UI Colors for charts ---
    const getFluentColor = (status, alpha = 1) => {
        const s = status.toLowerCase();
        if (s.includes('in stock') || s === 'yes' || s === 'approved' || s === 'available') {
            return `rgba(16, 124, 16, ${alpha})`; // Fluent Green
        }
        if (s.includes('assigned') || s === 'active' || s === 'in use' || s === 'assigned to employee') {
            return `rgba(0, 120, 212, ${alpha})`; // Fluent Blue
        }
        if (s.includes('pending') || s.includes('awaiting')) {
            return `rgba(255, 185, 0, ${alpha})`; // Fluent Gold/Yellow
        }
        if (s.includes('damaged') || s.includes('rejected') || s.includes('lost') || s.includes('broken')) {
            return `rgba(216, 59, 1, ${alpha})`; // Fluent Red
        }
        if (s.includes('borrowed') || s.includes('requested') || s === 'requested asset') {
            return `rgba(135, 100, 184, ${alpha})`; // Fluent Purple
        }
        // Fallback: stable hashing to pick harmonious Fluent-like colors
        const hash = status.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const colors = [
            `rgba(0, 120, 212, ${alpha})`, // Blue
            `rgba(16, 124, 16, ${alpha})`, // Green
            `rgba(135, 100, 184, ${alpha})`, // Purple
            `rgba(0, 130, 114, ${alpha})`, // Teal (#008272)
            `rgba(216, 59, 1, ${alpha})`, // Orange
        ];
        return colors[hash % colors.length];
    };
    // --- Data Processing for Charts ---
    // 1. Primary pie: Admin / Employee = asset status from inventory; Inventory Manager = request status from Approvals queue
    const statusCounts = isManagerView
        ? requests.reduce((acc, req) => {
            const status = req.status || 'Pending';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {})
        : items.reduce((acc, item) => {
            const status = item.status || 'Unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
    const primaryPieLabel = isManagerView ? 'Requests in approval queue' : 'Assets by Status';
    const primaryPieTitle = isManagerView ? 'Approvals Queue Status' : 'Asset Status Distribution';
    const primaryPieSubtitle = isManagerView ? 'Requests categorized by manager approval state' : 'Current condition and status of registered assets';
    const statusLabels = Object.keys(statusCounts).length ? Object.keys(statusCounts) : ['No data'];
    const statusDataValues = Object.keys(statusCounts).length
        ? Object.keys(statusCounts).map(k => statusCounts[k])
        : [1];
    const assetStatusData = {
        labels: statusLabels,
        datasets: [
            {
                label: primaryPieLabel,
                data: statusDataValues,
                backgroundColor: statusLabels.map(label => getFluentColor(label, 0.75)),
                borderColor: statusLabels.map(label => getFluentColor(label, 1.0)),
                borderWidth: 1.5,
            },
        ],
    };
    // 2. Assets by Type (Bar Chart)
    const typeCounts = items.reduce((acc, item) => {
        const type = item.assetType || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});
    const assetTypeLabels = Object.keys(typeCounts);
    const assetTypeDataValues = Object.keys(typeCounts).map(k => typeCounts[k]);
    const assetTypeData = {
        labels: assetTypeLabels.length ? assetTypeLabels : ['No assets'],
        datasets: [
            {
                label: 'Number of Assets',
                data: assetTypeDataValues.length ? assetTypeDataValues : [0],
                backgroundColor: 'rgba(0, 120, 212, 0.7)',
                borderColor: 'rgba(0, 120, 212, 1)',
                borderWidth: 1.5,
                hoverBackgroundColor: 'rgba(0, 90, 158, 0.85)',
                hoverBorderColor: 'rgba(0, 90, 158, 1)',
                borderRadius: 6,
            },
        ],
    };
    // 3. Doughnut: Admin = asset assignment status; Manager = fulfillment after manager approval; Employee = request status
    const requestStatusCounts = isManagerView
        ? requests
            .filter(req => (req.status || '').toLowerCase() === 'approved')
            .reduce((acc, req) => {
            const status = req.assetStatus || 'Pending';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {})
        : requests.reduce((acc, req) => {
            const status = isAdmin ? (req.assetStatus || 'Pending') : (req.status || 'Pending');
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
    const doughnutLabels = Object.keys(requestStatusCounts).length
        ? Object.keys(requestStatusCounts)
        : isManagerView
            ? ['No approved requests yet']
            : ['No data'];
    const doughnutDataValues = Object.keys(requestStatusCounts).length
        ? Object.keys(requestStatusCounts).map(k => requestStatusCounts[k])
        : [1];
    const requestStatusData = {
        labels: doughnutLabels,
        datasets: [
            {
                label: isManagerView ? 'Assignment status (approved requests)' : 'Requests by Status',
                data: doughnutDataValues,
                backgroundColor: doughnutLabels.map(label => getFluentColor(label, 0.75)),
                borderColor: doughnutLabels.map(label => getFluentColor(label, 1.0)),
                borderWidth: 1.5,
            },
        ],
    };
    // --- Clean Segoe UI Options for Chart.js ---
    const chartPlugins = {
        legend: {
            position: 'bottom',
            labels: {
                boxWidth: 10,
                boxHeight: 10,
                padding: 14,
                usePointStyle: true,
                font: {
                    family: "'Segoe UI', -apple-system, sans-serif",
                    size: 11,
                    weight: 'normal',
                },
                color: '#616161',
            },
        },
        tooltip: {
            backgroundColor: '#ffffff',
            titleColor: '#242424',
            bodyColor: '#242424',
            borderColor: 'rgba(0,0,0,0.1)',
            borderWidth: 1,
            padding: 10,
            boxPadding: 6,
            cornerRadius: 8,
            usePointStyle: true,
            titleFont: {
                family: "'Segoe UI', -apple-system, sans-serif",
                size: 12,
                weight: 'bold',
            },
            bodyFont: {
                family: "'Segoe UI', -apple-system, sans-serif",
                size: 12,
            },
        },
    };
    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: chartPlugins,
    };
    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: chartPlugins,
        cutout: '65%',
    };
    const assetTypeOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: chartPlugins.tooltip,
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        family: "'Segoe UI', -apple-system, sans-serif",
                        size: 11,
                    },
                    color: '#8a8886',
                },
            },
            y: {
                grid: {
                    color: 'rgba(0,0,0,0.04)',
                },
                ticks: {
                    precision: 0,
                    font: {
                        family: "'Segoe UI', -apple-system, sans-serif",
                        size: 11,
                    },
                    color: '#8a8886',
                },
            },
        },
    };
    // --- Quick Summaries & Subtitle metrics ---
    const totalAssets = items.length;
    const totalRequests = requests.length;
    const pendingRequests = requests.filter(r => {
        const status = isAdmin ? (r.assetStatus || 'Pending') : (r.status || 'Pending');
        return status === 'Pending';
    }).length;
    const availableAssets = items.filter(i => i.status === 'In Stock' || i.status === 'Yes').length;
    const awaitingManagerDecision = isManagerView
        ? requests.filter(r => (r.status || '').toLowerCase() === 'pending').length
        : 0;
    const stockPercentage = totalAssets > 0 ? ((availableAssets / totalAssets) * 100).toFixed(0) : '0';
    // --- Compute Allocation Rate (Admin) ---
    const assignedAssetsCount = totalAssets - availableAssets;
    const allocationRate = totalAssets > 0 ? ((assignedAssetsCount / totalAssets) * 100).toFixed(0) : '0';
    // --- Compute Approval Success Rate (Manager & Employee) ---
    const approvedReqCount = requests.filter(r => (r.status || '').toLowerCase() === 'approved').length;
    const declinedReqCount = requests.filter(r => (r.status || '').toLowerCase() === 'declined' || (r.status || '').toLowerCase() === 'rejected').length;
    const totalDecidedRequests = approvedReqCount + declinedReqCount;
    const approvalSuccessRate = totalDecidedRequests > 0 ? ((approvedReqCount / totalDecidedRequests) * 100).toFixed(0) : '0';
    // --- Utility: Sort requests & assets new-to-old ---
    const sortRequestsNewToOld = (reqs) => {
        return [...reqs].sort((a, b) => {
            const dateA = a.requestDate || '';
            const dateB = b.requestDate || '';
            if (dateA && dateB && dateA !== dateB) {
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            }
            const numA = parseInt((a.id || '0').replace(/\D/g, ''), 10);
            const numB = parseInt((b.id || '0').replace(/\D/g, ''), 10);
            if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
                return numB - numA;
            }
            return (b.id || '').localeCompare(a.id || '');
        });
    };
    const sortItemsNewToOld = (itemList) => {
        return [...itemList].sort((a, b) => {
            const dateA = a.assignedDate || a.purchaseDate || '';
            const dateB = b.assignedDate || b.purchaseDate || '';
            if (dateA && dateB && dateA !== dateB) {
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            }
            const numA = parseInt((a.id || '0').replace(/\D/g, ''), 10);
            const numB = parseInt((b.id || '0').replace(/\D/g, ''), 10);
            if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
                return numB - numA;
            }
            return (b.id || '').localeCompare(a.id || '');
        });
    };
    // --- Filter for pending assignments (Admin Action Center - New to Old) ---
    const pendingAssignments = sortRequestsNewToOld(requests.filter(r => (r.status || '').toLowerCase() === 'approved' && (r.assetStatus || 'Pending') === 'Pending'));
    const recentAssignments = pendingAssignments.slice(0, 5);
    // --- Filter for pending decisions (Manager Action Center - New to Old) ---
    const pendingApprovals = sortRequestsNewToOld(requests.filter(r => (r.status || 'Pending') === 'Pending' || (r.status || '').toLowerCase() === 'pending'));
    const recentApprovals = pendingApprovals.slice(0, 5);
    // --- Filter for employee's recent requests (Employee Action Center - New to Old) ---
    const recentEmployeeRequests = sortRequestsNewToOld(requests).slice(0, 5);
    const sortedEmployeeItems = sortItemsNewToOld(items).slice(0, 5);
    // --- Role label for header ---
    const roleLabel = isAdmin ? 'Administrator' : isManagerView ? 'Inventory Manager' : 'Employee';
    const dashboardTitle = isAdmin ? 'Administrator Dashboard' : isManagerView ? 'Manager Dashboard' : 'My Dashboard';
    // --- Quick action handler ---
    const navigateTo = (key) => {
        if (onNavigate) {
            onNavigate(key);
        }
    };
    return (React.createElement("div", { className: Dashboard_module_scss_1.default.dashboard },
        React.createElement("div", { className: Dashboard_module_scss_1.default.dashboardHeader },
            React.createElement("div", { className: Dashboard_module_scss_1.default.headerLeft },
                React.createElement("h2", { className: Dashboard_module_scss_1.default.headerTitle }, dashboardTitle),
                React.createElement("p", { className: Dashboard_module_scss_1.default.headerSubtitle },
                    React.createElement(Icon_1.Icon, { iconName: "ContactInfo", style: { fontSize: 13, color: '#0078d4' } }),
                    roleLabel,
                    " Overview",
                    React.createElement("span", { style: { color: '#c8c6c4' } }, "\u2022"),
                    "Real-time analytics"),
                React.createElement("div", { className: Dashboard_module_scss_1.default.headerDate },
                    React.createElement(Icon_1.Icon, { iconName: "Calendar" }),
                    React.createElement("span", null, getCurrentDate())))),
        onNavigate && (React.createElement("div", { className: Dashboard_module_scss_1.default.quickActions },
            isAdmin && (React.createElement(React.Fragment, null,
                React.createElement("button", { className: Dashboard_module_scss_1.default.quickActionBtn, onClick: () => navigateTo('Inventory'), "aria-label": "View Inventory" },
                    React.createElement(Icon_1.Icon, { iconName: "List" }),
                    React.createElement("span", null, "View Inventory")),
                React.createElement("button", { className: Dashboard_module_scss_1.default.quickActionBtn, onClick: () => navigateTo('AssetAssignmentQueue'), "aria-label": "Assignment Queue" },
                    React.createElement(Icon_1.Icon, { iconName: "Send" }),
                    React.createElement("span", null, "Assignment Queue")),
                React.createElement("button", { className: Dashboard_module_scss_1.default.quickActionBtn, onClick: () => navigateTo('Reports'), "aria-label": "View Reports" },
                    React.createElement(Icon_1.Icon, { iconName: "ReportDocument" }),
                    React.createElement("span", null, "Reports")),
                React.createElement("button", { className: Dashboard_module_scss_1.default.quickActionBtn, onClick: () => navigateTo('EventStream'), "aria-label": "Event Stream" },
                    React.createElement(Icon_1.Icon, { iconName: "ActivityFeed" }),
                    React.createElement("span", null, "Event Stream")))),
            isManagerView && (React.createElement(React.Fragment, null,
                React.createElement("button", { className: Dashboard_module_scss_1.default.quickActionBtn, onClick: () => navigateTo('Approvals'), "aria-label": "Review Approvals" },
                    React.createElement(Icon_1.Icon, { iconName: "DoubleChevronRight12" }),
                    React.createElement("span", null, "Review Approvals")),
                React.createElement("button", { className: Dashboard_module_scss_1.default.quickActionBtn, onClick: () => navigateTo('AssetReturns'), "aria-label": "Asset Returns" },
                    React.createElement(Icon_1.Icon, { iconName: "ReturnToSession" }),
                    React.createElement("span", null, "Asset Returns")))),
            !isAdmin && !isManagerView && (React.createElement(React.Fragment, null,
                React.createElement("button", { className: Dashboard_module_scss_1.default.quickActionBtn, onClick: () => navigateTo('MyWorkspace'), "aria-label": "My Workspace" },
                    React.createElement(Icon_1.Icon, { iconName: "Briefcase" }),
                    React.createElement("span", null, "My Workspace")),
                React.createElement("button", { className: Dashboard_module_scss_1.default.quickActionBtn, onClick: () => navigateTo('Notifications'), "aria-label": "View Notifications" },
                    React.createElement(Icon_1.Icon, { iconName: "Ringer" }),
                    React.createElement("span", null, "Notifications")))))),
        isManagerView && (React.createElement("div", { className: Dashboard_module_scss_1.default.dashboardIntro },
            React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.info },
                React.createElement("strong", null, "Inventory Manager Dashboard"),
                " \u2014 Visual metrics and approval queues are aggregated from request lists. Full data resides in the ",
                React.createElement("strong", null, "Approvals"),
                " registry."))),
        isAdmin && (React.createElement("div", { className: Dashboard_module_scss_1.default.dashboardIntro },
            React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.success },
                React.createElement("strong", null, "Administrator Dashboard"),
                " \u2014 Analytics are derived directly from the physical inventory items. Assignment metrics display admin-approved items."))),
        !isAdmin && !isInventoryManager && (React.createElement("div", { className: Dashboard_module_scss_1.default.dashboardIntro },
            React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.info },
                React.createElement("strong", null, "Personal Asset Hub"),
                " \u2014 Real-time telemetry tracking your assigned devices and ongoing request status."))),
        React.createElement("div", { className: Dashboard_module_scss_1.default.summaryGrid, role: "region", "aria-label": "Key performance indicators" },
            React.createElement("div", { className: `${Dashboard_module_scss_1.default.summaryCard} ${Dashboard_module_scss_1.default.cardBlue}`, role: "status", "aria-label": `${isAdmin ? 'Total Assets' : !isInventoryManager ? 'My Devices' : 'Total Assets'}: ${totalAssets}` },
                React.createElement("div", { className: Dashboard_module_scss_1.default.iconContainer },
                    React.createElement(Icon_1.Icon, { iconName: "Package" })),
                React.createElement("div", { className: Dashboard_module_scss_1.default.cardInfo },
                    React.createElement("span", { className: Dashboard_module_scss_1.default.summaryValue }, totalAssets),
                    React.createElement("span", { className: Dashboard_module_scss_1.default.summaryLabel }, isAdmin ? 'Total Assets' : !isInventoryManager ? 'My Devices' : 'Total Assets'),
                    React.createElement("span", { className: Dashboard_module_scss_1.default.summarySubtitle }, isAdmin
                        ? `Allocation rate: ${allocationRate}% allocated`
                        : !isInventoryManager
                            ? `${totalAssets} assigned hardware item${totalAssets === 1 ? '' : 's'}`
                            : `${totalAssets} items in catalog`))),
            (isAdmin || isInventoryManager) && (React.createElement("div", { className: `${Dashboard_module_scss_1.default.summaryCard} ${Dashboard_module_scss_1.default.cardGreen}`, role: "status", "aria-label": `Available Assets: ${availableAssets}` },
                React.createElement("div", { className: Dashboard_module_scss_1.default.iconContainer },
                    React.createElement(Icon_1.Icon, { iconName: "Accept" })),
                React.createElement("div", { className: Dashboard_module_scss_1.default.cardInfo },
                    React.createElement("span", { className: Dashboard_module_scss_1.default.summaryValue }, availableAssets),
                    React.createElement("span", { className: Dashboard_module_scss_1.default.summaryLabel }, "Available Assets"),
                    React.createElement("span", { className: Dashboard_module_scss_1.default.summarySubtitle },
                        availableAssets,
                        " in stock (",
                        stockPercentage,
                        "% of total)")))),
            React.createElement("div", { className: `${Dashboard_module_scss_1.default.summaryCard} ${Dashboard_module_scss_1.default.cardPurple}`, role: "status", "aria-label": `${isManagerView ? 'Requests in Queue' : 'Total Requests'}: ${totalRequests}` },
                React.createElement("div", { className: Dashboard_module_scss_1.default.iconContainer },
                    React.createElement(Icon_1.Icon, { iconName: "Send" })),
                React.createElement("div", { className: Dashboard_module_scss_1.default.cardInfo },
                    React.createElement("span", { className: Dashboard_module_scss_1.default.summaryValue }, totalRequests),
                    React.createElement("span", { className: Dashboard_module_scss_1.default.summaryLabel }, isManagerView ? 'Requests in Queue' : !isAdmin ? 'My Requests' : 'Total Requests'),
                    React.createElement("span", { className: Dashboard_module_scss_1.default.summarySubtitle }, isAdmin
                        ? `${totalRequests} queue requests`
                        : `Approval success: ${approvalSuccessRate}%`))),
            (isAdmin || isInventoryManager) && (React.createElement("div", { className: `${Dashboard_module_scss_1.default.summaryCard} ${Dashboard_module_scss_1.default.cardGold}`, role: "status", "aria-label": `${isManagerView ? 'Awaiting Approval' : 'Pending Requests'}: ${isManagerView ? awaitingManagerDecision : pendingRequests}` },
                React.createElement("div", { className: Dashboard_module_scss_1.default.iconContainer },
                    React.createElement(Icon_1.Icon, { iconName: "Clock" })),
                React.createElement("div", { className: Dashboard_module_scss_1.default.cardInfo },
                    React.createElement("span", { className: Dashboard_module_scss_1.default.summaryValue }, isManagerView ? awaitingManagerDecision : pendingRequests),
                    React.createElement("span", { className: Dashboard_module_scss_1.default.summaryLabel }, isManagerView ? 'Awaiting Approval' : 'Pending Requests'),
                    React.createElement("span", { className: Dashboard_module_scss_1.default.summarySubtitle }, isManagerView
                        ? `${awaitingManagerDecision} requires review`
                        : `${pendingRequests} under assignment review`))))),
        (isAdmin || isInventoryManager) && (React.createElement("div", { className: Dashboard_module_scss_1.default.chartsGrid },
            React.createElement("div", { className: Dashboard_module_scss_1.default.chartCard },
                React.createElement("div", { className: Dashboard_module_scss_1.default.chartHeader },
                    React.createElement("div", { className: Dashboard_module_scss_1.default.chartIcon },
                        React.createElement(Icon_1.Icon, { iconName: "DonutChart" })),
                    React.createElement("div", { className: Dashboard_module_scss_1.default.chartTitleBlock },
                        React.createElement("h3", null, primaryPieTitle),
                        React.createElement("span", { className: Dashboard_module_scss_1.default.chartSubtitle }, primaryPieSubtitle))),
                React.createElement("div", { className: Dashboard_module_scss_1.default.chartContainer },
                    React.createElement(react_chartjs_2_1.Pie, { data: assetStatusData, options: pieOptions }))),
            React.createElement("div", { className: Dashboard_module_scss_1.default.chartCard },
                React.createElement("div", { className: Dashboard_module_scss_1.default.chartHeader },
                    React.createElement("div", { className: Dashboard_module_scss_1.default.chartIcon },
                        React.createElement(Icon_1.Icon, { iconName: "BarChart4" })),
                    React.createElement("div", { className: Dashboard_module_scss_1.default.chartTitleBlock },
                        React.createElement("h3", null, "Assets by Type"),
                        React.createElement("span", { className: Dashboard_module_scss_1.default.chartSubtitle }, "Categorized distribution of equipment"))),
                React.createElement("div", { className: Dashboard_module_scss_1.default.chartContainer },
                    React.createElement(react_chartjs_2_1.Bar, { data: assetTypeData, options: assetTypeOptions }))),
            React.createElement("div", { className: Dashboard_module_scss_1.default.chartCard },
                React.createElement("div", { className: Dashboard_module_scss_1.default.chartHeader },
                    React.createElement("div", { className: Dashboard_module_scss_1.default.chartIcon },
                        React.createElement(Icon_1.Icon, { iconName: "PieDouble" })),
                    React.createElement("div", { className: Dashboard_module_scss_1.default.chartTitleBlock },
                        React.createElement("h3", null, isManagerView ? 'Post-Approval Assignment Status' : 'Request Fulfillment Status'),
                        React.createElement("span", { className: Dashboard_module_scss_1.default.chartSubtitle }, isManagerView
                            ? 'Status of asset handouts for manager-approved requests'
                            : 'Current status across all request pipelines'))),
                React.createElement("div", { className: Dashboard_module_scss_1.default.chartContainer },
                    React.createElement(react_chartjs_2_1.Doughnut, { data: requestStatusData, options: doughnutOptions }))))),
        isAdmin && (React.createElement("div", { className: Dashboard_module_scss_1.default.actionCenter },
            React.createElement("div", { className: Dashboard_module_scss_1.default.sectionHeader },
                React.createElement("div", null,
                    React.createElement("h3", null,
                        React.createElement(Icon_1.Icon, { iconName: "ReviewRequestMirrored" }),
                        "Asset Assignment Action Center"),
                    React.createElement("span", { className: Dashboard_module_scss_1.default.sectionSubtitle }, "Recent manager-approved requests awaiting physical hardware handout by administrators"))),
            React.createElement("div", { className: Dashboard_module_scss_1.default.tableWrapper }, recentAssignments.length > 0 ? (React.createElement("table", { className: Dashboard_module_scss_1.default.actionTable },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Requester"),
                        React.createElement("th", null, "Asset Requested"),
                        React.createElement("th", null, "Qty"),
                        React.createElement("th", null, "Date Approved"),
                        React.createElement("th", null, "Status Action"))),
                React.createElement("tbody", null, recentAssignments.map(req => (React.createElement("tr", { key: req.id },
                    React.createElement("td", null,
                        React.createElement("strong", null, req.requesterName)),
                    React.createElement("td", null, req.assetTitle),
                    React.createElement("td", null, req.quantity),
                    React.createElement("td", null, formatDate(req.requestDate)),
                    React.createElement("td", null,
                        React.createElement("span", { className: `${Dashboard_module_scss_1.default.statusBadge} ${Dashboard_module_scss_1.default.badgePending}` }, "Awaiting Handoff")))))))) : (React.createElement("div", { className: Dashboard_module_scss_1.default.noDataMessage },
                React.createElement(Icon_1.Icon, { iconName: "CompletedSolid" }),
                React.createElement("span", null, "All assignments caught up! No pending physical handouts."),
                React.createElement("span", { className: Dashboard_module_scss_1.default.emptyStateHint }, "Check the Assignment Queue for historical data")))))),
        isManagerView && (React.createElement("div", { className: Dashboard_module_scss_1.default.actionCenter },
            React.createElement("div", { className: Dashboard_module_scss_1.default.sectionHeader },
                React.createElement("div", null,
                    React.createElement("h3", null,
                        React.createElement(Icon_1.Icon, { iconName: "ReviewRequest" }),
                        "Pending Manager Decisions"),
                    React.createElement("span", { className: Dashboard_module_scss_1.default.sectionSubtitle }, "Recent employee requests awaiting your approval or decline"))),
            React.createElement("div", { className: Dashboard_module_scss_1.default.tableWrapper }, recentApprovals.length > 0 ? (React.createElement("table", { className: Dashboard_module_scss_1.default.actionTable },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Requester"),
                        React.createElement("th", null, "Asset Requested"),
                        React.createElement("th", null, "Qty"),
                        React.createElement("th", null, "Date Requested"),
                        React.createElement("th", null, "Reason / Justification"),
                        React.createElement("th", null, "Action State"))),
                React.createElement("tbody", null, recentApprovals.map(req => (React.createElement("tr", { key: req.id },
                    React.createElement("td", null,
                        React.createElement("strong", null, req.requesterName)),
                    React.createElement("td", null, req.assetTitle),
                    React.createElement("td", null, req.quantity),
                    React.createElement("td", null, formatDate(req.requestDate)),
                    React.createElement("td", { className: Dashboard_module_scss_1.default.tableCellJustification }, req.reason || 'No justification specified'),
                    React.createElement("td", null,
                        React.createElement("span", { className: `${Dashboard_module_scss_1.default.statusBadge} ${Dashboard_module_scss_1.default.badgePending}` }, "Awaiting Approval")))))))) : (React.createElement("div", { className: Dashboard_module_scss_1.default.noDataMessage },
                React.createElement(Icon_1.Icon, { iconName: "CheckMark" }),
                React.createElement("span", null, "Zero pending requests! Your approvals queue is clear."),
                React.createElement("span", { className: Dashboard_module_scss_1.default.emptyStateHint }, "New requests will appear here automatically")))))),
        !isAdmin && !isInventoryManager && (React.createElement("div", { className: Dashboard_module_scss_1.default.splitLayout },
            React.createElement("div", { className: Dashboard_module_scss_1.default.actionCenter },
                React.createElement("div", { className: Dashboard_module_scss_1.default.sectionHeader },
                    React.createElement("div", null,
                        React.createElement("h3", null,
                            React.createElement(Icon_1.Icon, { iconName: "Send" }),
                            "Active Requests Status"),
                        React.createElement("span", { className: Dashboard_module_scss_1.default.sectionSubtitle }, "Recent hardware requests in the verification pipeline"))),
                React.createElement("div", { className: Dashboard_module_scss_1.default.tableWrapper }, recentEmployeeRequests.length > 0 ? (React.createElement("table", { className: Dashboard_module_scss_1.default.actionTable },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Asset"),
                            React.createElement("th", null, "Manager Name"),
                            React.createElement("th", null, "Qty"),
                            React.createElement("th", null, "Requested Date"),
                            React.createElement("th", null, "Manager Comment"),
                            React.createElement("th", null, "Fulfillment State"))),
                    React.createElement("tbody", null, recentEmployeeRequests.map(req => {
                        const isApproved = (req.status || '').toLowerCase() === 'approved';
                        const isDeclined = (req.status || '').toLowerCase() === 'declined' || (req.status || '').toLowerCase() === 'rejected';
                        const isAssetAssigned = (req.assetStatus || '').toLowerCase() === 'approved';
                        let badgeClass = Dashboard_module_scss_1.default.badgePending;
                        let badgeText = 'Awaiting Review';
                        if (isApproved) {
                            if (isAssetAssigned) {
                                badgeClass = Dashboard_module_scss_1.default.badgeApproved;
                                badgeText = 'Completed & Assigned';
                            }
                            else {
                                badgeClass = Dashboard_module_scss_1.default.badgePending;
                                badgeText = 'Approved, Awaiting Handoff';
                            }
                        }
                        else if (isDeclined) {
                            badgeClass = Dashboard_module_scss_1.default.badgeDeclined;
                            badgeText = 'Declined';
                        }
                        return (React.createElement("tr", { key: req.id },
                            React.createElement("td", null,
                                React.createElement("strong", null, req.assetTitle)),
                            React.createElement("td", null, req.managerName || '-'),
                            React.createElement("td", null, req.quantity),
                            React.createElement("td", null, formatDate(req.requestDate)),
                            React.createElement("td", { style: { color: isDeclined ? '#991b1b' : 'inherit' } }, req.managerResponse || '-'),
                            React.createElement("td", null,
                                React.createElement("span", { className: `${Dashboard_module_scss_1.default.statusBadge} ${badgeClass}` }, badgeText))));
                    })))) : (React.createElement("div", { className: Dashboard_module_scss_1.default.noDataMessage },
                    React.createElement(Icon_1.Icon, { iconName: "Info" }),
                    React.createElement("span", null, "No active requests placed recently."),
                    React.createElement("span", { className: Dashboard_module_scss_1.default.emptyStateHint }, "Use \"Request Asset\" to submit a new request"))))),
            React.createElement("div", { className: Dashboard_module_scss_1.default.actionCenter },
                React.createElement("div", { className: Dashboard_module_scss_1.default.sectionHeader },
                    React.createElement("div", null,
                        React.createElement("h3", null,
                            React.createElement(Icon_1.Icon, { iconName: "Devices3" }),
                            "My Assigned Equipment"),
                        React.createElement("span", { className: Dashboard_module_scss_1.default.sectionSubtitle }, "Hardware currently registered and assigned to you"))),
                React.createElement("div", { className: Dashboard_module_scss_1.default.tableWrapper }, sortedEmployeeItems.length > 0 ? (React.createElement("table", { className: Dashboard_module_scss_1.default.actionTable },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Device Name"),
                            React.createElement("th", null, "Category"),
                            React.createElement("th", null, "Serial Number"),
                            React.createElement("th", null, "Assigned Date"))),
                    React.createElement("tbody", null, sortedEmployeeItems.map(item => (React.createElement("tr", { key: item.id },
                        React.createElement("td", null,
                            React.createElement("strong", null, item.title)),
                        React.createElement("td", null, item.assetType),
                        React.createElement("td", null,
                            React.createElement("code", null, item.serialNumber || 'N/A')),
                        React.createElement("td", null, formatDate(item.assignedDate || '')))))))) : (React.createElement("div", { className: Dashboard_module_scss_1.default.noDataMessage },
                    React.createElement(Icon_1.Icon, { iconName: "Devices3" }),
                    React.createElement("span", null, "No equipment currently assigned to you."),
                    React.createElement("span", { className: Dashboard_module_scss_1.default.emptyStateHint }, "Assigned devices will appear here after handoff")))))))));
};
exports.Dashboard = Dashboard;
//# sourceMappingURL=Dashboard.js.map