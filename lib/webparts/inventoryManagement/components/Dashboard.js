import * as React from 'react';
import styles from './Dashboard.module.scss';
import { Icon } from '@fluentui/react/lib/Icon';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../utils/LocalizationUtils';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { centerTotalPlugin, barValueLabelsPlugin } from '../utils/ChartPlugins';
import { LowStockPanel } from './dashboard/LowStockPanel';
import { RequestSlaPanel } from './dashboard/RequestSlaPanel';
import { summarizeSla } from '../utils/RequestSlaUtils';
import { getAppConfig } from '../config/AppConfig';
// Gaps between slices in the card's background colour (follows dark mode), and a small pop-out on hover.
const cardBackground = (ctx) => {
    try {
        return window.getComputedStyle(ctx.chart.canvas).getPropertyValue('--surface-bg').trim() || '#ffffff';
    }
    catch {
        return '#ffffff';
    }
};
const ARC_STYLE = { borderColor: cardBackground, borderWidth: 2, hoverOffset: 6 };
/** 'Assigned' -> 'Assigned (16)' for legend entries; placeholder labels (no data) are left as-is. */
const withCounts = (labels, counts) => labels.map(label => (counts[label] !== undefined ? `${label} (${counts[label]})` : label));
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
    const statusTotal = Object.keys(statusCounts).reduce((sum, k) => sum + statusCounts[k], 0);
    const assetStatusData = {
        labels: withCounts(statusLabels, statusCounts),
        datasets: [
            {
                label: primaryPieLabel,
                data: statusDataValues,
                // Colours are keyed on the raw status, not the display label with its count.
                backgroundColor: statusLabels.map(label => getFluentColor(label, 0.85)),
                ...ARC_STYLE,
            },
        ],
    };
    // 2. Assets by Type (Bar Chart)
    const typeCounts = items.reduce((acc, item) => {
        const type = item.assetType || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});
    // Largest category first so the chart reads left to right by volume.
    const assetTypeLabels = Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a] || a.localeCompare(b));
    const assetTypeDataValues = assetTypeLabels.map(k => typeCounts[k]);
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
                maxBarThickness: 56,
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
    const requestStatusTotal = Object.keys(requestStatusCounts).reduce((sum, k) => sum + requestStatusCounts[k], 0);
    const requestStatusData = {
        labels: withCounts(doughnutLabels, requestStatusCounts),
        datasets: [
            {
                label: isManagerView ? strings.Dashboard.AssignmentStatusApprovedLabel : strings.Dashboard.RequestsByStatusLabel,
                data: doughnutDataValues,
                backgroundColor: doughnutLabels.map(label => getFluentColor(label, 0.85)),
                ...ARC_STYLE,
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
    // Tooltip: 'Assigned (16)' as title, '16 · 76%' as body.
    const arcTooltip = {
        ...chartPlugins.tooltip,
        callbacks: {
            label: (ctx) => {
                const values = ctx.dataset.data || [];
                const total = values.reduce((sum, v) => sum + (Number(v) || 0), 0);
                const pct = total > 0 ? Math.round((Number(ctx.raw) / total) * 100) : 0;
                return ` ${ctx.raw} · ${pct}%`;
            },
        },
    };
    const statusDoughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: { ...chartPlugins, tooltip: arcTooltip, centerTotal: { value: statusTotal } },
    };
    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: { ...chartPlugins, tooltip: arcTooltip, centerTotal: { value: requestStatusTotal } },
    };
    const assetTypeOptions = {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 18 } }, // room for the value labels above the tallest bar
        plugins: {
            legend: {
                display: false,
            },
            tooltip: chartPlugins.tooltip,
            barValueLabels: { enabled: assetTypeLabels.length > 0 },
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
    const isEmployeeView = !isAdmin && !isInventoryManager;
    const d = strings.Dashboard;
    // --- Quick action handler ---
    const navigateTo = (key) => {
        if (onNavigate) {
            onNavigate(key);
        }
    };
    // --- "Needs attention": the few things each role should act on now ---
    const slaSummary = !isEmployeeView ? summarizeSla(requests, getAppConfig().sla) : undefined;
    const overdueForRole = slaSummary
        ? slaSummary.overdueItems.filter(i => (isAdmin ? i.stage === 'awaitingAssignment' : i.stage === 'awaitingApproval')).length
        : 0;
    const employeeInReview = requests.filter(r => (r.status || 'Pending').toLowerCase().indexOf('pending') >= 0).length;
    const employeeAwaitingHandoff = requests.filter(r => (r.status || '').toLowerCase() === 'approved' && (r.assetStatus || '').toLowerCase() !== 'approved').length;
    const attentionAll = isAdmin ? [
        { key: 'assign', icon: 'Send', text: formatString(d.AttentionWaitingAssignment, pendingAssignments.length), tone: 'warn', target: 'AssetAssignmentQueue', count: pendingAssignments.length },
        { key: 'overdue', icon: 'Clock', text: formatString(d.AttentionOverdue, overdueForRole), tone: 'bad', target: 'AssetAssignmentQueue', count: overdueForRole }
    ] : isManagerView ? [
        { key: 'decide', icon: 'DoubleChevronRight12', text: formatString(d.AttentionAwaitingDecision, awaitingManagerDecision), tone: 'warn', target: 'Approvals', count: awaitingManagerDecision },
        { key: 'overdue', icon: 'Clock', text: formatString(d.AttentionOverdue, overdueForRole), tone: 'bad', target: 'Approvals', count: overdueForRole }
    ] : [
        { key: 'review', icon: 'Clock', text: formatString(d.AttentionInReview, employeeInReview), tone: 'info', target: 'MyWorkspace', count: employeeInReview },
        { key: 'handoff', icon: 'Package', text: formatString(d.AttentionReadySoon, employeeAwaitingHandoff), tone: 'warn', target: 'MyWorkspace', count: employeeAwaitingHandoff }
    ];
    const attention = attentionAll.filter(a => a.count > 0);
    const pct = (part, whole) => (whole > 0 ? Math.round((part / whole) * 100) : 0);
    const kpis = isAdmin ? [
        { key: 'assets', tone: styles.cardBlue, icon: 'Package', value: totalAssets, label: d.TotalAssets, subtitle: formatString(d.AllocationRateSubtitle, allocationRate), percent: Number(allocationRate), target: 'Inventory' },
        { key: 'available', tone: styles.cardGreen, icon: 'Accept', value: availableAssets, label: d.AvailableAssets, subtitle: formatString(d.InStockSubtitle, availableAssets, stockPercentage), percent: Number(stockPercentage), target: 'Inventory' },
        { key: 'requests', tone: styles.cardPurple, icon: 'Send', value: totalRequests, label: d.TotalRequests, subtitle: formatString(d.QueueRequestsSubtitle, totalRequests), target: 'AssetAssignmentQueue' },
        { key: 'pending', tone: styles.cardGold, icon: 'Clock', value: pendingAssignments.length, label: d.PendingRequests, subtitle: formatString(d.UnderReviewSubtitle, pendingAssignments.length), percent: pct(pendingAssignments.length, totalRequests), target: 'AssetAssignmentQueue' }
    ] : isManagerView ? [
        { key: 'assets', tone: styles.cardBlue, icon: 'Package', value: totalAssets, label: d.TotalAssets, subtitle: formatString(d.ItemsInCatalogSubtitle, totalAssets), target: 'Inventory' },
        { key: 'available', tone: styles.cardGreen, icon: 'Accept', value: availableAssets, label: d.AvailableAssets, subtitle: formatString(d.InStockSubtitle, availableAssets, stockPercentage), percent: Number(stockPercentage), target: 'Inventory' },
        { key: 'requests', tone: styles.cardPurple, icon: 'Send', value: totalRequests, label: d.RequestsInQueue, subtitle: formatString(d.ApprovalSuccessSubtitle, approvalSuccessRate), percent: Number(approvalSuccessRate), target: 'Approvals' },
        { key: 'awaiting', tone: styles.cardGold, icon: 'Clock', value: awaitingManagerDecision, label: d.AwaitingApproval, subtitle: formatString(d.RequiresReviewSubtitle, awaitingManagerDecision), percent: pct(awaitingManagerDecision, totalRequests), target: 'Approvals' }
    ] : [
        { key: 'devices', tone: styles.cardBlue, icon: 'Devices3', value: totalAssets, label: d.MyDevices, subtitle: formatString(d.AssignedHardwareSubtitle, totalAssets), target: 'MyWorkspace' },
        { key: 'requests', tone: styles.cardPurple, icon: 'Send', value: totalRequests, label: d.MyRequests, subtitle: formatString(d.ApprovalSuccessSubtitle, approvalSuccessRate), percent: totalDecidedRequests > 0 ? Number(approvalSuccessRate) : undefined, target: 'MyWorkspace' },
        { key: 'review', tone: styles.cardGold, icon: 'Clock', value: employeeInReview, label: d.KpiInReview, subtitle: d.KpiInReviewSubtitle, target: 'MyWorkspace' },
        { key: 'handoff', tone: styles.cardGreen, icon: 'Package', value: employeeAwaitingHandoff, label: d.KpiAwaitingHandoff, subtitle: d.KpiAwaitingHandoffSubtitle, target: 'MyWorkspace' }
    ];
    const bannerText = (isAdmin
        ? d.AdminBannerText
        : isManagerView
            ? `${d.ManagerBannerTextBefore}${strings.Nav.Approvals}${d.ManagerBannerTextAfter}`
            : d.EmployeeBannerText).replace(/^\s*[—–-]\s*/, '');
    const initialsOf = (name) => (name || '').split(/[\s.@_-]+/).filter(Boolean).slice(0, 2).map(p => p.charAt(0).toUpperCase()).join('') || '?';
    /** A table row that opens a page, by click or Enter / Space. */
    const rowLink = (target) => onNavigate ? {
        className: styles.clickableRow,
        onClick: () => navigateTo(target),
        onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigateTo(target);
            }
        },
        tabIndex: 0,
        role: 'link'
    } : {};
    const viewAll = (target, count) => onNavigate && count > 0 ? (React.createElement("button", { type: "button", className: styles.headerAction, onClick: () => navigateTo(target) },
        formatString(d.ViewAll, count),
        " ",
        React.createElement(Icon, { iconName: "ChevronRight", style: { fontSize: 10 } }))) : null;
    return (React.createElement("div", { className: `${styles.dashboard} ${isAdmin ? styles.roleAdmin : isManagerView ? styles.roleManager : styles.roleEmployee}` },
        React.createElement("div", { className: styles.dashboardHeader },
            React.createElement("div", { className: styles.headerLeft },
                React.createElement("div", { className: styles.headerEyebrow },
                    React.createElement("span", { className: styles.roleChip },
                        React.createElement(Icon, { iconName: "ContactInfo" }),
                        roleLabel),
                    React.createElement("span", { className: styles.headerDate },
                        React.createElement(Icon, { iconName: "Calendar" }),
                        getCurrentDate())),
                React.createElement("h2", { className: styles.headerTitle }, dashboardTitle),
                React.createElement("p", { className: styles.headerSubtitle }, bannerText))),
        React.createElement("div", { className: styles.attentionBar, role: "region", "aria-label": d.AttentionTitle },
            React.createElement("span", { className: styles.attentionTitle }, d.AttentionTitle),
            attention.length === 0 ? (React.createElement("span", { className: `${styles.attentionChip} ${styles.attentionGood}` },
                React.createElement(Icon, { iconName: "CompletedSolid" }),
                d.AttentionAllClear)) : attention.map(a => (React.createElement("button", { key: a.key, type: "button", className: `${styles.attentionChip} ${a.tone === 'bad' ? styles.attentionBad : a.tone === 'warn' ? styles.attentionWarn : styles.attentionInfo}`, onClick: () => navigateTo(a.target), disabled: !onNavigate },
                React.createElement(Icon, { iconName: a.icon }),
                a.text,
                React.createElement(Icon, { iconName: "ChevronRight", className: styles.attentionArrow }))))),
        React.createElement("div", { className: styles.summaryGrid, role: "region", "aria-label": d.KpiRegionAriaLabel }, kpis.map(k => {
            const body = (React.createElement(React.Fragment, null,
                React.createElement("div", { className: styles.cardTop },
                    React.createElement("div", { className: styles.iconContainer },
                        React.createElement(Icon, { iconName: k.icon })),
                    React.createElement("span", { className: styles.summaryLabel }, k.label),
                    k.target && onNavigate && React.createElement(Icon, { iconName: "ChevronRight", className: styles.cardArrow })),
                React.createElement("div", { className: styles.cardInfo },
                    React.createElement("span", { className: styles.summaryValue }, k.value),
                    k.percent !== undefined && (React.createElement("span", { className: styles.meter, "aria-hidden": "true" },
                        React.createElement("span", { className: styles.meterFill, style: { width: `${Math.max(0, Math.min(100, k.percent))}%` } }))),
                    React.createElement("span", { className: styles.summarySubtitle }, k.subtitle))));
            return k.target && onNavigate ? (React.createElement("button", { key: k.key, type: "button", className: `${styles.summaryCard} ${k.tone}`, onClick: () => navigateTo(k.target), "aria-label": `${k.label}: ${k.value}. ${k.subtitle}` }, body)) : (React.createElement("div", { key: k.key, className: `${styles.summaryCard} ${k.tone}`, role: "status", "aria-label": `${k.label}: ${k.value}` }, body));
        })),
        !isEmployeeView && (React.createElement(LowStockPanel, { items: items, onManageThresholds: isAdmin && onNavigate ? () => onNavigate('Config') : undefined })),
        !isEmployeeView && (React.createElement("div", { className: styles.chartsGrid },
            React.createElement("div", { className: styles.chartCard },
                React.createElement("div", { className: styles.chartHeader },
                    React.createElement("div", { className: styles.chartIcon },
                        React.createElement(Icon, { iconName: "DonutChart" })),
                    React.createElement("div", { className: styles.chartTitleBlock },
                        React.createElement("h3", null, primaryPieTitle),
                        React.createElement("span", { className: styles.chartSubtitle }, primaryPieSubtitle))),
                React.createElement("div", { className: styles.chartContainer },
                    React.createElement(Doughnut, { data: assetStatusData, options: statusDoughnutOptions, plugins: [centerTotalPlugin] }))),
            React.createElement("div", { className: styles.chartCard },
                React.createElement("div", { className: styles.chartHeader },
                    React.createElement("div", { className: styles.chartIcon },
                        React.createElement(Icon, { iconName: "PieDouble" })),
                    React.createElement("div", { className: styles.chartTitleBlock },
                        React.createElement("h3", null, isManagerView ? d.PostApprovalAssignmentTitle : d.RequestFulfillmentTitle),
                        React.createElement("span", { className: styles.chartSubtitle }, isManagerView ? d.PostApprovalAssignmentSubtitle : d.RequestFulfillmentSubtitle))),
                React.createElement("div", { className: styles.chartContainer },
                    React.createElement(Doughnut, { data: requestStatusData, options: doughnutOptions, plugins: [centerTotalPlugin] }))),
            React.createElement("div", { className: `${styles.chartCard} ${styles.chartWide}` },
                React.createElement("div", { className: styles.chartHeader },
                    React.createElement("div", { className: styles.chartIcon },
                        React.createElement(Icon, { iconName: "BarChart4" })),
                    React.createElement("div", { className: styles.chartTitleBlock },
                        React.createElement("h3", null, d.AssetsByTypeTitle),
                        React.createElement("span", { className: styles.chartSubtitle }, d.AssetsByTypeSubtitle))),
                React.createElement("div", { className: styles.chartContainer },
                    React.createElement(Bar, { data: assetTypeData, options: assetTypeOptions, plugins: [barValueLabelsPlugin] }))))),
        !isEmployeeView && (React.createElement(RequestSlaPanel, { requests: requests, queueKey: isAdmin ? 'AssetAssignmentQueue' : 'Approvals', onNavigate: onNavigate })),
        isAdmin && (React.createElement("div", { className: styles.actionCenter },
            React.createElement("div", { className: styles.sectionHeader },
                React.createElement("div", null,
                    React.createElement("h3", null,
                        React.createElement(Icon, { iconName: "ReviewRequestMirrored" }),
                        d.AdminActionCenterTitle),
                    React.createElement("span", { className: styles.sectionSubtitle }, d.AdminActionCenterSubtitle)),
                viewAll('AssetAssignmentQueue', pendingAssignments.length)),
            React.createElement("div", { className: styles.tableWrapper }, recentAssignments.length > 0 ? (React.createElement("table", { className: styles.actionTable },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, d.ColRequester),
                        React.createElement("th", null, d.ColAssetRequested),
                        React.createElement("th", null, d.ColQty),
                        React.createElement("th", null, d.ColDateApproved),
                        React.createElement("th", null, d.ColStatusAction))),
                React.createElement("tbody", null, recentAssignments.map(req => (React.createElement("tr", { key: req.id, ...rowLink('AssetAssignmentQueue') },
                    React.createElement("td", null,
                        React.createElement("span", { className: styles.person },
                            React.createElement("span", { className: styles.personCoin, "aria-hidden": "true" }, initialsOf(req.requesterName)),
                            React.createElement("strong", null, req.requesterName))),
                    React.createElement("td", null, req.assetTitle),
                    React.createElement("td", null, req.quantity),
                    React.createElement("td", null, formatDate(req.managerDecisionAt || req.requestDate)),
                    React.createElement("td", null,
                        React.createElement("span", { className: `${styles.statusBadge} ${styles.badgePending}` }, d.BadgeAwaitingHandoff)))))))) : (React.createElement("div", { className: styles.noDataMessage },
                React.createElement(Icon, { iconName: "CompletedSolid" }),
                React.createElement("span", null, d.AdminEmptyState),
                React.createElement("span", { className: styles.emptyStateHint }, d.AdminEmptyStateHint)))))),
        isManagerView && (React.createElement("div", { className: styles.actionCenter },
            React.createElement("div", { className: styles.sectionHeader },
                React.createElement("div", null,
                    React.createElement("h3", null,
                        React.createElement(Icon, { iconName: "ReviewRequest" }),
                        d.ManagerActionCenterTitle),
                    React.createElement("span", { className: styles.sectionSubtitle }, d.ManagerActionCenterSubtitle)),
                viewAll('Approvals', pendingApprovals.length)),
            React.createElement("div", { className: styles.tableWrapper }, recentApprovals.length > 0 ? (React.createElement("table", { className: styles.actionTable },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, d.ColRequester),
                        React.createElement("th", null, d.ColAssetRequested),
                        React.createElement("th", null, d.ColQty),
                        React.createElement("th", null, d.ColDateRequested),
                        React.createElement("th", null, d.ColReason),
                        React.createElement("th", null, d.ColActionState))),
                React.createElement("tbody", null, recentApprovals.map(req => (React.createElement("tr", { key: req.id, ...rowLink('Approvals') },
                    React.createElement("td", null,
                        React.createElement("span", { className: styles.person },
                            React.createElement("span", { className: styles.personCoin, "aria-hidden": "true" }, initialsOf(req.requesterName)),
                            React.createElement("strong", null, req.requesterName))),
                    React.createElement("td", null, req.assetTitle),
                    React.createElement("td", null, req.quantity),
                    React.createElement("td", null, formatDate(req.requestDate)),
                    React.createElement("td", { className: styles.tableCellJustification }, req.reason || d.NoJustificationSpecified),
                    React.createElement("td", null,
                        React.createElement("span", { className: `${styles.statusBadge} ${styles.badgePending}` }, d.BadgeAwaitingApproval)))))))) : (React.createElement("div", { className: styles.noDataMessage },
                React.createElement(Icon, { iconName: "CheckMark" }),
                React.createElement("span", null, d.ManagerEmptyState),
                React.createElement("span", { className: styles.emptyStateHint }, d.ManagerEmptyStateHint)))))),
        isEmployeeView && (React.createElement("div", { className: styles.splitLayout },
            React.createElement("div", { className: styles.actionCenter },
                React.createElement("div", { className: styles.sectionHeader },
                    React.createElement("div", null,
                        React.createElement("h3", null,
                            React.createElement(Icon, { iconName: "Send" }),
                            d.EmployeeActionCenterTitle),
                        React.createElement("span", { className: styles.sectionSubtitle }, d.EmployeeActionCenterSubtitle)),
                    viewAll('MyWorkspace', requests.length)),
                React.createElement("div", { className: styles.tableWrapper }, recentEmployeeRequests.length > 0 ? (React.createElement("table", { className: styles.actionTable },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, d.ColAsset),
                            React.createElement("th", null, d.ColManagerName),
                            React.createElement("th", null, d.ColQty),
                            React.createElement("th", null, d.ColDateRequested),
                            React.createElement("th", null, d.ColManagerComment),
                            React.createElement("th", null, d.ColFulfillmentState))),
                    React.createElement("tbody", null, recentEmployeeRequests.map(req => {
                        const isApproved = (req.status || '').toLowerCase() === 'approved';
                        const isDeclined = (req.status || '').toLowerCase() === 'declined' || (req.status || '').toLowerCase() === 'rejected';
                        const isAssetAssigned = (req.assetStatus || '').toLowerCase() === 'approved';
                        let badgeClass = styles.badgePending;
                        let badgeText = d.BadgeAwaitingReview;
                        if (isApproved) {
                            badgeClass = isAssetAssigned ? styles.badgeApproved : styles.badgePending;
                            badgeText = isAssetAssigned ? d.BadgeCompletedAssigned : d.BadgeApprovedAwaitingHandoff;
                        }
                        else if (isDeclined) {
                            badgeClass = styles.badgeDeclined;
                            badgeText = d.BadgeDeclined;
                        }
                        return (React.createElement("tr", { key: req.id, ...rowLink('MyWorkspace') },
                            React.createElement("td", null,
                                React.createElement("strong", null, req.assetTitle)),
                            React.createElement("td", null, req.managerName || '—'),
                            React.createElement("td", null, req.quantity),
                            React.createElement("td", null, formatDate(req.requestDate)),
                            React.createElement("td", { className: styles.tableCellJustification, style: { color: isDeclined ? '#a4262c' : undefined } }, req.managerResponse || '—'),
                            React.createElement("td", null,
                                React.createElement("span", { className: `${styles.statusBadge} ${badgeClass}` }, badgeText))));
                    })))) : (React.createElement("div", { className: styles.noDataMessage },
                    React.createElement(Icon, { iconName: "Info" }),
                    React.createElement("span", null, d.EmployeeEmptyState),
                    React.createElement("span", { className: styles.emptyStateHint }, d.EmployeeEmptyStateHint))))),
            React.createElement("div", { className: styles.actionCenter },
                React.createElement("div", { className: styles.sectionHeader },
                    React.createElement("div", null,
                        React.createElement("h3", null,
                            React.createElement(Icon, { iconName: "Devices3" }),
                            d.MyEquipmentTitle),
                        React.createElement("span", { className: styles.sectionSubtitle }, d.MyEquipmentSubtitle)),
                    viewAll('MyWorkspace', items.length)),
                React.createElement("div", { className: styles.tableWrapper }, sortedEmployeeItems.length > 0 ? (React.createElement("table", { className: styles.actionTable },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, d.ColDeviceName),
                            React.createElement("th", null, d.ColCategory),
                            React.createElement("th", null, d.ColSerialNumber),
                            React.createElement("th", null, d.ColAssignedDate))),
                    React.createElement("tbody", null, sortedEmployeeItems.map(item => (React.createElement("tr", { key: item.id, ...rowLink('MyWorkspace') },
                        React.createElement("td", null,
                            React.createElement("strong", null, item.assetName || item.title)),
                        React.createElement("td", null, item.assetType),
                        React.createElement("td", null,
                            React.createElement("code", null, item.serialNumber || strings.Common.NotAvailable)),
                        React.createElement("td", null, formatDate(item.assignedDate || '')))))))) : (React.createElement("div", { className: styles.noDataMessage },
                    React.createElement(Icon, { iconName: "Devices3" }),
                    React.createElement("span", null, d.MyEquipmentEmptyState),
                    React.createElement("span", { className: styles.emptyStateHint }, d.MyEquipmentEmptyStateHint)))))))));
};
//# sourceMappingURL=Dashboard.js.map