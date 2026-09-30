import * as React from 'react';
import styles from './Dashboard.module.scss';
import { IInventoryItem } from '../models/IInventoryItem';
import { IRequest } from '../models/IRequest';
import { Icon } from '@fluentui/react/lib/Icon';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../utils/LocalizationUtils';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { centerTotalPlugin, barValueLabelsPlugin } from '../utils/ChartPlugins';
import { LowStockPanel } from './dashboard/LowStockPanel';
import { RequestSlaPanel } from './dashboard/RequestSlaPanel';
import { summarizeSla } from '../utils/RequestSlaUtils';
import { getAppConfig } from '../config/AppConfig';

// Gaps between slices in the card's background colour (follows dark mode), and a small pop-out on hover.
const cardBackground = (ctx: { chart: { canvas: HTMLCanvasElement } }): string => {
  try {
    return window.getComputedStyle(ctx.chart.canvas).getPropertyValue('--surface-bg').trim() || '#ffffff';
  } catch {
    return '#ffffff';
  }
};
const ARC_STYLE = { borderColor: cardBackground, borderWidth: 2, hoverOffset: 6 };

/** 'Assigned' -> 'Assigned (16)' for legend entries; placeholder labels (no data) are left as-is. */
const withCounts = (labels: string[], counts: Record<string, number>): string[] =>
  labels.map(label => (counts[label] !== undefined ? `${label} (${counts[label]})` : label));

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export interface IDashboardProps {
  items: IInventoryItem[];
  requests: IRequest[];
  isAdmin?: boolean;
  /** When true, dashboard copy and the primary pie chart follow the Approvals queue (requests), not inventory asset status. */
  isInventoryManager?: boolean;
  /** Optional callback to navigate to a different tab from quick action buttons. */
  onNavigate?: (tabKey: string) => void;
}

export const Dashboard: React.FunctionComponent<IDashboardProps> = (props) => {
  const { items, requests, isAdmin, isInventoryManager, onNavigate } = props;
  const isManagerView = !!isInventoryManager && !isAdmin;

  // --- Utility: Format Date nicely ---
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // --- Utility: Get current date string ---
  const getCurrentDate = (): string => {
    const now = new Date();
    return now.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // --- Utility: Semantic Fluent UI Colors for charts ---
  const getFluentColor = (status: string, alpha: number = 1): string => {
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
      `rgba(16, 124, 16, ${alpha})`,  // Green
      `rgba(135, 100, 184, ${alpha})`, // Purple
      `rgba(0, 130, 114, ${alpha})`,  // Teal (#008272)
      `rgba(216, 59, 1, ${alpha})`,   // Orange
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
      }, {} as Record<string, number>)
    : items.reduce((acc, item) => {
        const status = item.status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

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
  }, {} as Record<string, number>);

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
        }, {} as Record<string, number>)
    : requests.reduce((acc, req) => {
        const status = isAdmin ? (req.assetStatus || 'Pending') : (req.status || 'Pending');
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

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
      position: 'bottom' as const,
      labels: {
        boxWidth: 10,
        boxHeight: 10,
        padding: 14,
        usePointStyle: true,
        font: {
          family: "'Segoe UI', -apple-system, sans-serif",
          size: 11,
          weight: 'normal' as const,
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
        weight: 'bold' as const,
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
      label: (ctx: any): string => {
        const values: number[] = ctx.dataset.data || [];
        const total = values.reduce((sum: number, v: number) => sum + (Number(v) || 0), 0);
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
  const declinedReqCount = requests.filter(
    r => (r.status || '').toLowerCase() === 'declined' || (r.status || '').toLowerCase() === 'rejected'
  ).length;
  const totalDecidedRequests = approvedReqCount + declinedReqCount;
  const approvalSuccessRate = totalDecidedRequests > 0 ? ((approvedReqCount / totalDecidedRequests) * 100).toFixed(0) : '0';

  // --- Utility: Sort requests & assets new-to-old ---
  const sortRequestsNewToOld = (reqs: IRequest[]) => {
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

  const sortItemsNewToOld = (itemList: IInventoryItem[]) => {
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
  const pendingAssignments = sortRequestsNewToOld(requests.filter(
    r => (r.status || '').toLowerCase() === 'approved' && (r.assetStatus || 'Pending') === 'Pending'
  ));
  const recentAssignments = pendingAssignments.slice(0, 5);

  // --- Filter for pending decisions (Manager Action Center - New to Old) ---
  const pendingApprovals = sortRequestsNewToOld(requests.filter(
    r => (r.status || 'Pending') === 'Pending' || (r.status || '').toLowerCase() === 'pending'
  ));
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
  const navigateTo = (key: string): void => {
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
  const employeeAwaitingHandoff = requests.filter(r =>
    (r.status || '').toLowerCase() === 'approved' && (r.assetStatus || '').toLowerCase() !== 'approved').length;

  interface IAttention { key: string; icon: string; text: string; tone: 'warn' | 'bad' | 'info'; target: string; count: number }
  const attentionAll: IAttention[] = isAdmin ? [
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

  // --- KPI cards per role ---
  interface IKpi { key: string; tone: string; icon: string; value: number; label: string; subtitle: string; percent?: number; target?: string }
  const pct = (part: number, whole: number): number => (whole > 0 ? Math.round((part / whole) * 100) : 0);
  const kpis: IKpi[] = isAdmin ? [
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

  const initialsOf = (name?: string): string =>
    (name || '').split(/[\s.@_-]+/).filter(Boolean).slice(0, 2).map(p => p.charAt(0).toUpperCase()).join('') || '?';

  /** A table row that opens a page, by click or Enter / Space. */
  const rowLink = (target: string): React.HTMLAttributes<HTMLTableRowElement> => onNavigate ? {
    className: styles.clickableRow,
    onClick: () => navigateTo(target),
    onKeyDown: (e: React.KeyboardEvent<HTMLTableRowElement>) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigateTo(target); }
    },
    tabIndex: 0,
    role: 'link'
  } : {};

  const viewAll = (target: string, count: number): JSX.Element | null => onNavigate && count > 0 ? (
    <button type="button" className={styles.headerAction} onClick={() => navigateTo(target)}>
      {formatString(d.ViewAll, count)} <Icon iconName="ChevronRight" style={{ fontSize: 10 }} />
    </button>
  ) : null;

  return (
    <div className={`${styles.dashboard} ${isAdmin ? styles.roleAdmin : isManagerView ? styles.roleManager : styles.roleEmployee}`}>
      {/* ===== HEADER: title, role, date, one-line guidance, quick actions ===== */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerEyebrow}>
            <span className={styles.roleChip}><Icon iconName="ContactInfo" />{roleLabel}</span>
            <span className={styles.headerDate}><Icon iconName="Calendar" />{getCurrentDate()}</span>
          </div>
          <h2 className={styles.headerTitle}>{dashboardTitle}</h2>
          <p className={styles.headerSubtitle}>{bannerText}</p>
        </div>
      </div>

      {/* ===== NEEDS ATTENTION ===== */}
      <div className={styles.attentionBar} role="region" aria-label={d.AttentionTitle}>
        <span className={styles.attentionTitle}>{d.AttentionTitle}</span>
        {attention.length === 0 ? (
          <span className={`${styles.attentionChip} ${styles.attentionGood}`}><Icon iconName="CompletedSolid" />{d.AttentionAllClear}</span>
        ) : attention.map(a => (
          <button
            key={a.key}
            type="button"
            className={`${styles.attentionChip} ${a.tone === 'bad' ? styles.attentionBad : a.tone === 'warn' ? styles.attentionWarn : styles.attentionInfo}`}
            onClick={() => navigateTo(a.target)}
            disabled={!onNavigate}
          >
            <Icon iconName={a.icon} />{a.text}<Icon iconName="ChevronRight" className={styles.attentionArrow} />
          </button>
        ))}
      </div>

      {/* ===== KPI SUMMARY CARDS ===== */}
      <div className={styles.summaryGrid} role="region" aria-label={d.KpiRegionAriaLabel}>
        {kpis.map(k => {
          const body = (
            <>
              <div className={styles.cardTop}>
                <div className={styles.iconContainer}><Icon iconName={k.icon} /></div>
                <span className={styles.summaryLabel}>{k.label}</span>
                {k.target && onNavigate && <Icon iconName="ChevronRight" className={styles.cardArrow} />}
              </div>
              <div className={styles.cardInfo}>
                <span className={styles.summaryValue}>{k.value}</span>
                {k.percent !== undefined && (
                  <span className={styles.meter} aria-hidden="true"><span className={styles.meterFill} style={{ width: `${Math.max(0, Math.min(100, k.percent))}%` }} /></span>
                )}
                <span className={styles.summarySubtitle}>{k.subtitle}</span>
              </div>
            </>
          );
          return k.target && onNavigate ? (
            <button key={k.key} type="button" className={`${styles.summaryCard} ${k.tone}`} onClick={() => navigateTo(k.target!)} aria-label={`${k.label}: ${k.value}. ${k.subtitle}`}>
              {body}
            </button>
          ) : (
            <div key={k.key} className={`${styles.summaryCard} ${k.tone}`} role="status" aria-label={`${k.label}: ${k.value}`}>{body}</div>
          );
        })}
      </div>

      {/* ===== LOW-STOCK WARNING (Admin & Manager; hidden when stock is healthy) ===== */}
      {!isEmployeeView && (
        <LowStockPanel
          items={items}
          onManageThresholds={isAdmin && onNavigate ? () => onNavigate('Config') : undefined}
        />
      )}

      {/* ===== CHART CARDS (Admin & Manager only) ===== */}
      {!isEmployeeView && (
        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartIcon}><Icon iconName="DonutChart" /></div>
              <div className={styles.chartTitleBlock}>
                <h3>{primaryPieTitle}</h3>
                <span className={styles.chartSubtitle}>{primaryPieSubtitle}</span>
              </div>
            </div>
            <div className={styles.chartContainer}>
              <Doughnut data={assetStatusData} options={statusDoughnutOptions as any} plugins={[centerTotalPlugin]} />
            </div>
          </div>

          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartIcon}><Icon iconName="PieDouble" /></div>
              <div className={styles.chartTitleBlock}>
                <h3>{isManagerView ? d.PostApprovalAssignmentTitle : d.RequestFulfillmentTitle}</h3>
                <span className={styles.chartSubtitle}>{isManagerView ? d.PostApprovalAssignmentSubtitle : d.RequestFulfillmentSubtitle}</span>
              </div>
            </div>
            <div className={styles.chartContainer}>
              <Doughnut data={requestStatusData} options={doughnutOptions as any} plugins={[centerTotalPlugin]} />
            </div>
          </div>

          <div className={`${styles.chartCard} ${styles.chartWide}`}>
            <div className={styles.chartHeader}>
              <div className={styles.chartIcon}><Icon iconName="BarChart4" /></div>
              <div className={styles.chartTitleBlock}>
                <h3>{d.AssetsByTypeTitle}</h3>
                <span className={styles.chartSubtitle}>{d.AssetsByTypeSubtitle}</span>
              </div>
            </div>
            <div className={styles.chartContainer}>
              <Bar data={assetTypeData} options={assetTypeOptions as any} plugins={[barValueLabelsPlugin]} />
            </div>
          </div>
        </div>
      )}

      {/* ===== REQUEST SLA (Admin & Manager) ===== */}
      {!isEmployeeView && (
        <RequestSlaPanel
          requests={requests}
          queueKey={isAdmin ? 'AssetAssignmentQueue' : 'Approvals'}
          onNavigate={onNavigate}
        />
      )}

      {/* ===== ACTION CENTER — ADMIN ===== */}
      {isAdmin && (
        <div className={styles.actionCenter}>
          <div className={styles.sectionHeader}>
            <div>
              <h3><Icon iconName="ReviewRequestMirrored" />{d.AdminActionCenterTitle}</h3>
              <span className={styles.sectionSubtitle}>{d.AdminActionCenterSubtitle}</span>
            </div>
            {viewAll('AssetAssignmentQueue', pendingAssignments.length)}
          </div>
          <div className={styles.tableWrapper}>
            {recentAssignments.length > 0 ? (
              <table className={styles.actionTable}>
                <thead>
                  <tr>
                    <th>{d.ColRequester}</th>
                    <th>{d.ColAssetRequested}</th>
                    <th>{d.ColQty}</th>
                    <th>{d.ColDateApproved}</th>
                    <th>{d.ColStatusAction}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAssignments.map(req => (
                    <tr key={req.id} {...rowLink('AssetAssignmentQueue')}>
                      <td>
                        <span className={styles.person}>
                          <span className={styles.personCoin} aria-hidden="true">{initialsOf(req.requesterName)}</span>
                          <strong>{req.requesterName}</strong>
                        </span>
                      </td>
                      <td>{req.assetTitle}</td>
                      <td>{req.quantity}</td>
                      <td>{formatDate(req.managerDecisionAt || req.requestDate)}</td>
                      <td><span className={`${styles.statusBadge} ${styles.badgePending}`}>{d.BadgeAwaitingHandoff}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.noDataMessage}>
                <Icon iconName="CompletedSolid" />
                <span>{d.AdminEmptyState}</span>
                <span className={styles.emptyStateHint}>{d.AdminEmptyStateHint}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== ACTION CENTER — MANAGER ===== */}
      {isManagerView && (
        <div className={styles.actionCenter}>
          <div className={styles.sectionHeader}>
            <div>
              <h3><Icon iconName="ReviewRequest" />{d.ManagerActionCenterTitle}</h3>
              <span className={styles.sectionSubtitle}>{d.ManagerActionCenterSubtitle}</span>
            </div>
            {viewAll('Approvals', pendingApprovals.length)}
          </div>
          <div className={styles.tableWrapper}>
            {recentApprovals.length > 0 ? (
              <table className={styles.actionTable}>
                <thead>
                  <tr>
                    <th>{d.ColRequester}</th>
                    <th>{d.ColAssetRequested}</th>
                    <th>{d.ColQty}</th>
                    <th>{d.ColDateRequested}</th>
                    <th>{d.ColReason}</th>
                    <th>{d.ColActionState}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApprovals.map(req => (
                    <tr key={req.id} {...rowLink('Approvals')}>
                      <td>
                        <span className={styles.person}>
                          <span className={styles.personCoin} aria-hidden="true">{initialsOf(req.requesterName)}</span>
                          <strong>{req.requesterName}</strong>
                        </span>
                      </td>
                      <td>{req.assetTitle}</td>
                      <td>{req.quantity}</td>
                      <td>{formatDate(req.requestDate)}</td>
                      <td className={styles.tableCellJustification}>{req.reason || d.NoJustificationSpecified}</td>
                      <td><span className={`${styles.statusBadge} ${styles.badgePending}`}>{d.BadgeAwaitingApproval}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.noDataMessage}>
                <Icon iconName="CheckMark" />
                <span>{d.ManagerEmptyState}</span>
                <span className={styles.emptyStateHint}>{d.ManagerEmptyStateHint}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== ACTION CENTER — EMPLOYEE ===== */}
      {isEmployeeView && (
        <div className={styles.splitLayout}>
          <div className={styles.actionCenter}>
            <div className={styles.sectionHeader}>
              <div>
                <h3><Icon iconName="Send" />{d.EmployeeActionCenterTitle}</h3>
                <span className={styles.sectionSubtitle}>{d.EmployeeActionCenterSubtitle}</span>
              </div>
              {viewAll('MyWorkspace', requests.length)}
            </div>
            <div className={styles.tableWrapper}>
              {recentEmployeeRequests.length > 0 ? (
                <table className={styles.actionTable}>
                  <thead>
                    <tr>
                      <th>{d.ColAsset}</th>
                      <th>{d.ColManagerName}</th>
                      <th>{d.ColQty}</th>
                      <th>{d.ColDateRequested}</th>
                      <th>{d.ColManagerComment}</th>
                      <th>{d.ColFulfillmentState}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEmployeeRequests.map(req => {
                      const isApproved = (req.status || '').toLowerCase() === 'approved';
                      const isDeclined = (req.status || '').toLowerCase() === 'declined' || (req.status || '').toLowerCase() === 'rejected';
                      const isAssetAssigned = (req.assetStatus || '').toLowerCase() === 'approved';

                      let badgeClass = styles.badgePending;
                      let badgeText = d.BadgeAwaitingReview;
                      if (isApproved) {
                        badgeClass = isAssetAssigned ? styles.badgeApproved : styles.badgePending;
                        badgeText = isAssetAssigned ? d.BadgeCompletedAssigned : d.BadgeApprovedAwaitingHandoff;
                      } else if (isDeclined) {
                        badgeClass = styles.badgeDeclined;
                        badgeText = d.BadgeDeclined;
                      }

                      return (
                        <tr key={req.id} {...rowLink('MyWorkspace')}>
                          <td><strong>{req.assetTitle}</strong></td>
                          <td>{req.managerName || '—'}</td>
                          <td>{req.quantity}</td>
                          <td>{formatDate(req.requestDate)}</td>
                          <td className={styles.tableCellJustification} style={{ color: isDeclined ? '#a4262c' : undefined }}>{req.managerResponse || '—'}</td>
                          <td><span className={`${styles.statusBadge} ${badgeClass}`}>{badgeText}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className={styles.noDataMessage}>
                  <Icon iconName="Info" />
                  <span>{d.EmployeeEmptyState}</span>
                  <span className={styles.emptyStateHint}>{d.EmployeeEmptyStateHint}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.actionCenter}>
            <div className={styles.sectionHeader}>
              <div>
                <h3><Icon iconName="Devices3" />{d.MyEquipmentTitle}</h3>
                <span className={styles.sectionSubtitle}>{d.MyEquipmentSubtitle}</span>
              </div>
              {viewAll('MyWorkspace', items.length)}
            </div>
            <div className={styles.tableWrapper}>
              {sortedEmployeeItems.length > 0 ? (
                <table className={styles.actionTable}>
                  <thead>
                    <tr>
                      <th>{d.ColDeviceName}</th>
                      <th>{d.ColCategory}</th>
                      <th>{d.ColSerialNumber}</th>
                      <th>{d.ColAssignedDate}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEmployeeItems.map(item => (
                      <tr key={item.id} {...rowLink('MyWorkspace')}>
                        <td><strong>{item.assetName || item.title}</strong></td>
                        <td>{item.assetType}</td>
                        <td><code>{item.serialNumber || strings.Common.NotAvailable}</code></td>
                        <td>{formatDate(item.assignedDate || '')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className={styles.noDataMessage}>
                  <Icon iconName="Devices3" />
                  <span>{d.MyEquipmentEmptyState}</span>
                  <span className={styles.emptyStateHint}>{d.MyEquipmentEmptyStateHint}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
