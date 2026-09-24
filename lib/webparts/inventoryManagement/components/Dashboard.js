import * as React from 'react';
import styles from './Dashboard.module.scss';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { Icon } from '@fluentui/react/lib/Icon';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../utils/LocalizationUtils';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, } from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
export const Dashboard = (props) => {
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
    const primaryPieLabel = isManagerView ? strings.Dashboard.RequestsInApprovalQueueLabel : strings.Dashboard.AssetsByStatusLabel;
    const primaryPieTitle = isManagerView ? strings.Dashboard.ApprovalsQueueStatusTitle : strings.Dashboard.AssetStatusDistributionTitle;
    const primaryPieSubtitle = isManagerView ? strings.Dashboard.ApprovalsQueueStatusSubtitle : strings.Dashboard.AssetStatusDistributionSubtitle;
    const statusLabels = Object.keys(statusCounts).length ? Object.keys(statusCounts) : [strings.Dashboard.NoDataLabel];
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
        labels: assetTypeLabels.length ? assetTypeLabels : [strings.Dashboard.NoAssetsLabel],
        datasets: [
            {
                label: strings.Dashboard.NumberOfAssetsLabel,
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
            ? [strings.Dashboard.NoApprovedRequestsYetLabel]
            : [strings.Dashboard.NoDataLabel];
    const doughnutDataValues = Object.keys(requestStatusCounts).length
        ? Object.keys(requestStatusCounts).map(k => requestStatusCounts[k])
        : [1];
    const requestStatusData = {
        labels: doughnutLabels,
        datasets: [
            {
                label: isManagerView ? strings.Dashboard.AssignmentStatusApprovedLabel : strings.Dashboard.RequestsByStatusLabel,
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
    const roleLabel = isAdmin ? strings.Dashboard.RoleAdministrator : isManagerView ? strings.Dashboard.RoleManager : strings.Dashboard.RoleEmployee;
    const dashboardTitle = isAdmin ? strings.Dashboard.AdminTitle : isManagerView ? strings.Dashboard.ManagerTitle : strings.Dashboard.EmployeeTitle;
    // --- Quick action handler ---
    const navigateTo = (key) => {
        if (onNavigate) {
            onNavigate(key);
        }
    };
    return (React.createElement("div", { className: styles.dashboard },
        React.createElement("div", { className: styles.dashboardHeader },
            React.createElement("div", { className: styles.headerLeft },
                React.createElement("h2", { className: styles.headerTitle }, dashboardTitle),
                React.createElement("p", { className: styles.headerSubtitle },
                    React.createElement(Icon, { iconName: "ContactInfo", style: { fontSize: 13, color: '#0078d4' } }),
                    roleLabel,
                    " ",
                    strings.Dashboard.OverviewSuffix,
                    React.createElement("span", { style: { color: '#c8c6c4' } }, "\u2022"),
                    strings.Dashboard.RealTimeAnalytics),
                React.createElement("div", { className: styles.headerDate },
                    React.createElement(Icon, { iconName: "Calendar" }),
                    React.createElement("span", null, getCurrentDate())))),
        onNavigate && (React.createElement("div", { className: styles.quickActions },
            isAdmin && (React.createElement(React.Fragment, null,
                React.createElement("button", { className: styles.quickActionBtn, onClick: () => navigateTo('Inventory'), "aria-label": strings.Dashboard.ActionViewInventory },
                    React.createElement(Icon, { iconName: "List" }),
                    React.createElement("span", null, strings.Dashboard.ActionViewInventory)),
                React.createElement("button", { className: styles.quickActionBtn, onClick: () => navigateTo('AssetAssignmentQueue'), "aria-label": strings.Dashboard.ActionAssignmentQueue },
                    React.createElement(Icon, { iconName: "Send" }),
                    React.createElement("span", null, strings.Dashboard.ActionAssignmentQueue)),
                React.createElement("button", { className: styles.quickActionBtn, onClick: () => navigateTo('Reports'), "aria-label": strings.Dashboard.ActionReports },
                    React.createElement(Icon, { iconName: "ReportDocument" }),
                    React.createElement("span", null, strings.Dashboard.ActionReports)),
                React.createElement("button", { className: styles.quickActionBtn, onClick: () => navigateTo('EventStream'), "aria-label": strings.Dashboard.ActionEventStream },
                    React.createElement(Icon, { iconName: "ActivityFeed" }),
                    React.createElement("span", null, strings.Dashboard.ActionEventStream)))),
            isManagerView && (React.createElement(React.Fragment, null,
                React.createElement("button", { className: styles.quickActionBtn, onClick: () => navigateTo('Approvals'), "aria-label": strings.Dashboard.ActionReviewApprovals },
                    React.createElement(Icon, { iconName: "DoubleChevronRight12" }),
                    React.createElement("span", null, strings.Dashboard.ActionReviewApprovals)),
                React.createElement("button", { className: styles.quickActionBtn, onClick: () => navigateTo('AssetReturns'), "aria-label": strings.Dashboard.ActionAssetReturns },
                    React.createElement(Icon, { iconName: "ReturnToSession" }),
                    React.createElement("span", null, strings.Dashboard.ActionAssetReturns)))),
            !isAdmin && !isManagerView && (React.createElement(React.Fragment, null,
                React.createElement("button", { className: styles.quickActionBtn, onClick: () => navigateTo('MyWorkspace'), "aria-label": strings.Dashboard.ActionMyWorkspace },
                    React.createElement(Icon, { iconName: "Briefcase" }),
                    React.createElement("span", null, strings.Dashboard.ActionMyWorkspace)),
                React.createElement("button", { className: styles.quickActionBtn, onClick: () => navigateTo('Notifications'), "aria-label": strings.Dashboard.ActionNotifications },
                    React.createElement(Icon, { iconName: "Ringer" }),
                    React.createElement("span", null, strings.Dashboard.ActionNotifications)))))),
        isManagerView && (React.createElement("div", { className: styles.dashboardIntro },
            React.createElement(MessageBar, { messageBarType: MessageBarType.info },
                React.createElement("strong", null, strings.Dashboard.ManagerBannerTitle),
                " ",
                strings.Dashboard.ManagerBannerTextBefore,
                React.createElement("strong", null, strings.Nav.Approvals),
                strings.Dashboard.ManagerBannerTextAfter))),
        isAdmin && (React.createElement("div", { className: styles.dashboardIntro },
            React.createElement(MessageBar, { messageBarType: MessageBarType.success },
                React.createElement("strong", null, strings.Dashboard.AdminBannerTitle),
                " ",
                strings.Dashboard.AdminBannerText))),
        !isAdmin && !isInventoryManager && (React.createElement("div", { className: styles.dashboardIntro },
            React.createElement(MessageBar, { messageBarType: MessageBarType.info },
                React.createElement("strong", null, strings.Dashboard.EmployeeBannerTitle),
                " ",
                strings.Dashboard.EmployeeBannerText))),
        React.createElement("div", { className: styles.summaryGrid, role: "region", "aria-label": strings.Dashboard.KpiRegionAriaLabel },
            React.createElement("div", { className: `${styles.summaryCard} ${styles.cardBlue}`, role: "status", "aria-label": `${isAdmin ? strings.Dashboard.TotalAssets : !isInventoryManager ? strings.Dashboard.MyDevices : strings.Dashboard.TotalAssets}: ${totalAssets}` },
                React.createElement("div", { className: styles.iconContainer },
                    React.createElement(Icon, { iconName: "Package" })),
                React.createElement("div", { className: styles.cardInfo },
                    React.createElement("span", { className: styles.summaryValue }, totalAssets),
                    React.createElement("span", { className: styles.summaryLabel }, isAdmin ? strings.Dashboard.TotalAssets : !isInventoryManager ? strings.Dashboard.MyDevices : strings.Dashboard.TotalAssets),
                    React.createElement("span", { className: styles.summarySubtitle }, isAdmin
                        ? formatString(strings.Dashboard.AllocationRateSubtitle, allocationRate)
                        : !isInventoryManager
                            ? formatString(strings.Dashboard.AssignedHardwareSubtitle, totalAssets)
                            : formatString(strings.Dashboard.ItemsInCatalogSubtitle, totalAssets)))),
            (isAdmin || isInventoryManager) && (React.createElement("div", { className: `${styles.summaryCard} ${styles.cardGreen}`, role: "status", "aria-label": `${strings.Dashboard.AvailableAssets}: ${availableAssets}` },
                React.createElement("div", { className: styles.iconContainer },
                    React.createElement(Icon, { iconName: "Accept" })),
                React.createElement("div", { className: styles.cardInfo },
                    React.createElement("span", { className: styles.summaryValue }, availableAssets),
                    React.createElement("span", { className: styles.summaryLabel }, strings.Dashboard.AvailableAssets),
                    React.createElement("span", { className: styles.summarySubtitle }, formatString(strings.Dashboard.InStockSubtitle, availableAssets, stockPercentage))))),
            React.createElement("div", { className: `${styles.summaryCard} ${styles.cardPurple}`, role: "status", "aria-label": `${isManagerView ? strings.Dashboard.RequestsInQueue : strings.Dashboard.TotalRequests}: ${totalRequests}` },
                React.createElement("div", { className: styles.iconContainer },
                    React.createElement(Icon, { iconName: "Send" })),
                React.createElement("div", { className: styles.cardInfo },
                    React.createElement("span", { className: styles.summaryValue }, totalRequests),
                    React.createElement("span", { className: styles.summaryLabel }, isManagerView ? strings.Dashboard.RequestsInQueue : !isAdmin ? strings.Dashboard.MyRequests : strings.Dashboard.TotalRequests),
                    React.createElement("span", { className: styles.summarySubtitle }, isAdmin
                        ? formatString(strings.Dashboard.QueueRequestsSubtitle, totalRequests)
                        : formatString(strings.Dashboard.ApprovalSuccessSubtitle, approvalSuccessRate)))),
            (isAdmin || isInventoryManager) && (React.createElement("div", { className: `${styles.summaryCard} ${styles.cardGold}`, role: "status", "aria-label": `${isManagerView ? strings.Dashboard.AwaitingApproval : strings.Dashboard.PendingRequests}: ${isManagerView ? awaitingManagerDecision : pendingRequests}` },
                React.createElement("div", { className: styles.iconContainer },
                    React.createElement(Icon, { iconName: "Clock" })),
                React.createElement("div", { className: styles.cardInfo },
                    React.createElement("span", { className: styles.summaryValue }, isManagerView ? awaitingManagerDecision : pendingRequests),
                    React.createElement("span", { className: styles.summaryLabel }, isManagerView ? strings.Dashboard.AwaitingApproval : strings.Dashboard.PendingRequests),
                    React.createElement("span", { className: styles.summarySubtitle }, isManagerView
                        ? formatString(strings.Dashboard.RequiresReviewSubtitle, awaitingManagerDecision)
                        : formatString(strings.Dashboard.UnderReviewSubtitle, pendingRequests)))))),
        (isAdmin || isInventoryManager) && (React.createElement("div", { className: styles.chartsGrid },
            React.createElement("div", { className: styles.chartCard },
                React.createElement("div", { className: styles.chartHeader },
                    React.createElement("div", { className: styles.chartIcon },
                        React.createElement(Icon, { iconName: "DonutChart" })),
                    React.createElement("div", { className: styles.chartTitleBlock },
                        React.createElement("h3", null, primaryPieTitle),
                        React.createElement("span", { className: styles.chartSubtitle }, primaryPieSubtitle))),
                React.createElement("div", { className: styles.chartContainer },
                    React.createElement(Pie, { data: assetStatusData, options: pieOptions }))),
            React.createElement("div", { className: styles.chartCard },
                React.createElement("div", { className: styles.chartHeader },
                    React.createElement("div", { className: styles.chartIcon },
                        React.createElement(Icon, { iconName: "BarChart4" })),
                    React.createElement("div", { className: styles.chartTitleBlock },
                        React.createElement("h3", null, strings.Dashboard.AssetsByTypeTitle),
                        React.createElement("span", { className: styles.chartSubtitle }, strings.Dashboard.AssetsByTypeSubtitle))),
                React.createElement("div", { className: styles.chartContainer },
                    React.createElement(Bar, { data: assetTypeData, options: assetTypeOptions }))),
            React.createElement("div", { className: styles.chartCard },
                React.createElement("div", { className: styles.chartHeader },
                    React.createElement("div", { className: styles.chartIcon },
                        React.createElement(Icon, { iconName: "PieDouble" })),
                    React.createElement("div", { className: styles.chartTitleBlock },
                        React.createElement("h3", null, isManagerView ? strings.Dashboard.PostApprovalAssignmentTitle : strings.Dashboard.RequestFulfillmentTitle),
                        React.createElement("span", { className: styles.chartSubtitle }, isManagerView
                            ? strings.Dashboard.PostApprovalAssignmentSubtitle
                            : strings.Dashboard.RequestFulfillmentSubtitle))),
                React.createElement("div", { className: styles.chartContainer },
                    React.createElement(Doughnut, { data: requestStatusData, options: doughnutOptions }))))),
        isAdmin && (React.createElement("div", { className: styles.actionCenter },
            React.createElement("div", { className: styles.sectionHeader },
                React.createElement("div", null,
                    React.createElement("h3", null,
                        React.createElement(Icon, { iconName: "ReviewRequestMirrored" }),
                        strings.Dashboard.AdminActionCenterTitle),
                    React.createElement("span", { className: styles.sectionSubtitle }, strings.Dashboard.AdminActionCenterSubtitle))),
            React.createElement("div", { className: styles.tableWrapper }, recentAssignments.length > 0 ? (React.createElement("table", { className: styles.actionTable },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, strings.Dashboard.ColRequester),
                        React.createElement("th", null, strings.Dashboard.ColAssetRequested),
                        React.createElement("th", null, strings.Dashboard.ColQty),
                        React.createElement("th", null, strings.Dashboard.ColDateApproved),
                        React.createElement("th", null, strings.Dashboard.ColStatusAction))),
                React.createElement("tbody", null, recentAssignments.map(req => (React.createElement("tr", { key: req.id },
                    React.createElement("td", null,
                        React.createElement("strong", null, req.requesterName)),
                    React.createElement("td", null, req.assetTitle),
                    React.createElement("td", null, req.quantity),
                    React.createElement("td", null, formatDate(req.requestDate)),
                    React.createElement("td", null,
                        React.createElement("span", { className: `${styles.statusBadge} ${styles.badgePending}` }, strings.Dashboard.BadgeAwaitingHandoff)))))))) : (React.createElement("div", { className: styles.noDataMessage },
                React.createElement(Icon, { iconName: "CompletedSolid" }),
                React.createElement("span", null, strings.Dashboard.AdminEmptyState),
                React.createElement("span", { className: styles.emptyStateHint }, strings.Dashboard.AdminEmptyStateHint)))))),
        isManagerView && (React.createElement("div", { className: styles.actionCenter },
            React.createElement("div", { className: styles.sectionHeader },
                React.createElement("div", null,
                    React.createElement("h3", null,
                        React.createElement(Icon, { iconName: "ReviewRequest" }),
                        strings.Dashboard.ManagerActionCenterTitle),
                    React.createElement("span", { className: styles.sectionSubtitle }, strings.Dashboard.ManagerActionCenterSubtitle))),
            React.createElement("div", { className: styles.tableWrapper }, recentApprovals.length > 0 ? (React.createElement("table", { className: styles.actionTable },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, strings.Dashboard.ColRequester),
                        React.createElement("th", null, strings.Dashboard.ColAssetRequested),
                        React.createElement("th", null, strings.Dashboard.ColQty),
                        React.createElement("th", null, strings.Dashboard.ColDateRequested),
                        React.createElement("th", null, strings.Dashboard.ColReason),
                        React.createElement("th", null, strings.Dashboard.ColActionState))),
                React.createElement("tbody", null, recentApprovals.map(req => (React.createElement("tr", { key: req.id },
                    React.createElement("td", null,
                        React.createElement("strong", null, req.requesterName)),
                    React.createElement("td", null, req.assetTitle),
                    React.createElement("td", null, req.quantity),
                    React.createElement("td", null, formatDate(req.requestDate)),
                    React.createElement("td", { className: styles.tableCellJustification }, req.reason || strings.Dashboard.NoJustificationSpecified),
                    React.createElement("td", null,
                        React.createElement("span", { className: `${styles.statusBadge} ${styles.badgePending}` }, strings.Dashboard.BadgeAwaitingApproval)))))))) : (React.createElement("div", { className: styles.noDataMessage },
                React.createElement(Icon, { iconName: "CheckMark" }),
                React.createElement("span", null, strings.Dashboard.ManagerEmptyState),
                React.createElement("span", { className: styles.emptyStateHint }, strings.Dashboard.ManagerEmptyStateHint)))))),
        !isAdmin && !isInventoryManager && (React.createElement("div", { className: styles.splitLayout },
            React.createElement("div", { className: styles.actionCenter },
                React.createElement("div", { className: styles.sectionHeader },
                    React.createElement("div", null,
                        React.createElement("h3", null,
                            React.createElement(Icon, { iconName: "Send" }),
                            strings.Dashboard.EmployeeActionCenterTitle),
                        React.createElement("span", { className: styles.sectionSubtitle }, strings.Dashboard.EmployeeActionCenterSubtitle))),
                React.createElement("div", { className: styles.tableWrapper }, recentEmployeeRequests.length > 0 ? (React.createElement("table", { className: styles.actionTable },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, strings.Dashboard.ColAsset),
                            React.createElement("th", null, strings.Dashboard.ColManagerName),
                            React.createElement("th", null, strings.Dashboard.ColQty),
                            React.createElement("th", null, strings.Dashboard.ColDateRequested),
                            React.createElement("th", null, strings.Dashboard.ColManagerComment),
                            React.createElement("th", null, strings.Dashboard.ColFulfillmentState))),
                    React.createElement("tbody", null, recentEmployeeRequests.map(req => {
                        const isApproved = (req.status || '').toLowerCase() === 'approved';
                        const isDeclined = (req.status || '').toLowerCase() === 'declined' || (req.status || '').toLowerCase() === 'rejected';
                        const isAssetAssigned = (req.assetStatus || '').toLowerCase() === 'approved';
                        let badgeClass = styles.badgePending;
                        let badgeText = strings.Dashboard.BadgeAwaitingReview;
                        if (isApproved) {
                            if (isAssetAssigned) {
                                badgeClass = styles.badgeApproved;
                                badgeText = strings.Dashboard.BadgeCompletedAssigned;
                            }
                            else {
                                badgeClass = styles.badgePending;
                                badgeText = strings.Dashboard.BadgeApprovedAwaitingHandoff;
                            }
                        }
                        else if (isDeclined) {
                            badgeClass = styles.badgeDeclined;
                            badgeText = strings.Dashboard.BadgeDeclined;
                        }
                        return (React.createElement("tr", { key: req.id },
                            React.createElement("td", null,
                                React.createElement("strong", null, req.assetTitle)),
                            React.createElement("td", null, req.managerName || '-'),
                            React.createElement("td", null, req.quantity),
                            React.createElement("td", null, formatDate(req.requestDate)),
                            React.createElement("td", { style: { color: isDeclined ? '#991b1b' : 'inherit' } }, req.managerResponse || '-'),
                            React.createElement("td", null,
                                React.createElement("span", { className: `${styles.statusBadge} ${badgeClass}` }, badgeText))));
                    })))) : (React.createElement("div", { className: styles.noDataMessage },
                    React.createElement(Icon, { iconName: "Info" }),
                    React.createElement("span", null, strings.Dashboard.EmployeeEmptyState),
                    React.createElement("span", { className: styles.emptyStateHint }, strings.Dashboard.EmployeeEmptyStateHint))))),
            React.createElement("div", { className: styles.actionCenter },
                React.createElement("div", { className: styles.sectionHeader },
                    React.createElement("div", null,
                        React.createElement("h3", null,
                            React.createElement(Icon, { iconName: "Devices3" }),
                            strings.Dashboard.MyEquipmentTitle),
                        React.createElement("span", { className: styles.sectionSubtitle }, strings.Dashboard.MyEquipmentSubtitle))),
                React.createElement("div", { className: styles.tableWrapper }, sortedEmployeeItems.length > 0 ? (React.createElement("table", { className: styles.actionTable },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, strings.Dashboard.ColDeviceName),
                            React.createElement("th", null, strings.Dashboard.ColCategory),
                            React.createElement("th", null, strings.Dashboard.ColSerialNumber),
                            React.createElement("th", null, strings.Dashboard.ColAssignedDate))),
                    React.createElement("tbody", null, sortedEmployeeItems.map(item => (React.createElement("tr", { key: item.id },
                        React.createElement("td", null,
                            React.createElement("strong", null, item.title)),
                        React.createElement("td", null, item.assetType),
                        React.createElement("td", null,
                            React.createElement("code", null, item.serialNumber || strings.Common.NotAvailable)),
                        React.createElement("td", null, formatDate(item.assignedDate || '')))))))) : (React.createElement("div", { className: styles.noDataMessage },
                    React.createElement(Icon, { iconName: "Devices3" }),
                    React.createElement("span", null, strings.Dashboard.MyEquipmentEmptyState),
                    React.createElement("span", { className: styles.emptyStateHint }, strings.Dashboard.MyEquipmentEmptyStateHint)))))))));
};
//# sourceMappingURL=Dashboard.js.map