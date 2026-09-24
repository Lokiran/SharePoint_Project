import * as React from 'react';
import styles from './Dashboard.module.scss';
import { IInventoryItem } from '../models/IInventoryItem';
import { IRequest } from '../models/IRequest';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
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
import { Bar, Pie, Doughnut } from 'react-chartjs-2';

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
  }, {} as Record<string, number>);

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

  // --- Quick action handler ---
  const navigateTo = (key: string): void => {
    if (onNavigate) {
      onNavigate(key);
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* ===== DASHBOARD HEADER ===== */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <h2 className={styles.headerTitle}>{dashboardTitle}</h2>
          <p className={styles.headerSubtitle}>
            <Icon iconName="ContactInfo" style={{ fontSize: 13, color: '#0078d4' }} />
            {roleLabel} {strings.Dashboard.OverviewSuffix}
            <span style={{ color: '#c8c6c4' }}>•</span>
            {strings.Dashboard.RealTimeAnalytics}
          </p>
          <div className={styles.headerDate}>
            <Icon iconName="Calendar" />
            <span>{getCurrentDate()}</span>
          </div>
        </div>
      </div>

      {/* ===== QUICK ACTION BUTTONS ===== */}
      {onNavigate && (
        <div className={styles.quickActions}>
          {isAdmin && (
            <>
              <button
                className={styles.quickActionBtn}
                onClick={() => navigateTo('Inventory')}
                aria-label={strings.Dashboard.ActionViewInventory}
              >
                <Icon iconName="List" />
                <span>{strings.Dashboard.ActionViewInventory}</span>
              </button>
              <button
                className={styles.quickActionBtn}
                onClick={() => navigateTo('AssetAssignmentQueue')}
                aria-label={strings.Dashboard.ActionAssignmentQueue}
              >
                <Icon iconName="Send" />
                <span>{strings.Dashboard.ActionAssignmentQueue}</span>
              </button>
              <button
                className={styles.quickActionBtn}
                onClick={() => navigateTo('Reports')}
                aria-label={strings.Dashboard.ActionReports}
              >
                <Icon iconName="ReportDocument" />
                <span>{strings.Dashboard.ActionReports}</span>
              </button>
              <button
                className={styles.quickActionBtn}
                onClick={() => navigateTo('EventStream')}
                aria-label={strings.Dashboard.ActionEventStream}
              >
                <Icon iconName="ActivityFeed" />
                <span>{strings.Dashboard.ActionEventStream}</span>
              </button>
            </>
          )}
          {isManagerView && (
            <>
              <button
                className={styles.quickActionBtn}
                onClick={() => navigateTo('Approvals')}
                aria-label={strings.Dashboard.ActionReviewApprovals}
              >
                <Icon iconName="DoubleChevronRight12" />
                <span>{strings.Dashboard.ActionReviewApprovals}</span>
              </button>
              <button
                className={styles.quickActionBtn}
                onClick={() => navigateTo('AssetReturns')}
                aria-label={strings.Dashboard.ActionAssetReturns}
              >
                <Icon iconName="ReturnToSession" />
                <span>{strings.Dashboard.ActionAssetReturns}</span>
              </button>
            </>
          )}
          {!isAdmin && !isManagerView && (
            <>
              <button
                className={styles.quickActionBtn}
                onClick={() => navigateTo('MyWorkspace')}
                aria-label={strings.Dashboard.ActionMyWorkspace}
              >
                <Icon iconName="Briefcase" />
                <span>{strings.Dashboard.ActionMyWorkspace}</span>
              </button>
              <button
                className={styles.quickActionBtn}
                onClick={() => navigateTo('Notifications')}
                aria-label={strings.Dashboard.ActionNotifications}
              >
                <Icon iconName="Ringer" />
                <span>{strings.Dashboard.ActionNotifications}</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* ===== STATUS BANNERS ===== */}
      {isManagerView && (
        <div className={styles.dashboardIntro}>
          <MessageBar messageBarType={MessageBarType.info}>
            <strong>{strings.Dashboard.ManagerBannerTitle}</strong> {strings.Dashboard.ManagerBannerTextBefore}<strong>{strings.Nav.Approvals}</strong>{strings.Dashboard.ManagerBannerTextAfter}
          </MessageBar>
        </div>
      )}
      {isAdmin && (
        <div className={styles.dashboardIntro}>
          <MessageBar messageBarType={MessageBarType.success}>
            <strong>{strings.Dashboard.AdminBannerTitle}</strong> {strings.Dashboard.AdminBannerText}
          </MessageBar>
        </div>
      )}
      {!isAdmin && !isInventoryManager && (
        <div className={styles.dashboardIntro}>
          <MessageBar messageBarType={MessageBarType.info}>
            <strong>{strings.Dashboard.EmployeeBannerTitle}</strong> {strings.Dashboard.EmployeeBannerText}
          </MessageBar>
        </div>
      )}

      {/* ===== KPI SUMMARY CARDS ===== */}
      <div className={styles.summaryGrid} role="region" aria-label={strings.Dashboard.KpiRegionAriaLabel}>
        {/* Card 1: Total Assets / My Devices */}
        <div
          className={`${styles.summaryCard} ${styles.cardBlue}`}
          role="status"
          aria-label={`${isAdmin ? strings.Dashboard.TotalAssets : !isInventoryManager ? strings.Dashboard.MyDevices : strings.Dashboard.TotalAssets}: ${totalAssets}`}
        >
          <div className={styles.iconContainer}>
            <Icon iconName="Package" />
          </div>
          <div className={styles.cardInfo}>
            <span className={styles.summaryValue}>{totalAssets}</span>
            <span className={styles.summaryLabel}>
              {isAdmin ? strings.Dashboard.TotalAssets : !isInventoryManager ? strings.Dashboard.MyDevices : strings.Dashboard.TotalAssets}
            </span>
            <span className={styles.summarySubtitle}>
              {isAdmin
                ? formatString(strings.Dashboard.AllocationRateSubtitle, allocationRate)
                : !isInventoryManager
                  ? formatString(strings.Dashboard.AssignedHardwareSubtitle, totalAssets)
                  : formatString(strings.Dashboard.ItemsInCatalogSubtitle, totalAssets)}
            </span>
          </div>
        </div>

        {/* Card 2: Available Assets (Admin / Manager only) */}
        {(isAdmin || isInventoryManager) && (
          <div
            className={`${styles.summaryCard} ${styles.cardGreen}`}
            role="status"
            aria-label={`${strings.Dashboard.AvailableAssets}: ${availableAssets}`}
          >
            <div className={styles.iconContainer}>
              <Icon iconName="Accept" />
            </div>
            <div className={styles.cardInfo}>
              <span className={styles.summaryValue}>{availableAssets}</span>
              <span className={styles.summaryLabel}>{strings.Dashboard.AvailableAssets}</span>
              <span className={styles.summarySubtitle}>
                {formatString(strings.Dashboard.InStockSubtitle, availableAssets, stockPercentage)}
              </span>
            </div>
          </div>
        )}

        {/* Card 3: Requests in queue / My Requests */}
        <div
          className={`${styles.summaryCard} ${styles.cardPurple}`}
          role="status"
          aria-label={`${isManagerView ? strings.Dashboard.RequestsInQueue : strings.Dashboard.TotalRequests}: ${totalRequests}`}
        >
          <div className={styles.iconContainer}>
            <Icon iconName="Send" />
          </div>
          <div className={styles.cardInfo}>
            <span className={styles.summaryValue}>{totalRequests}</span>
            <span className={styles.summaryLabel}>
              {isManagerView ? strings.Dashboard.RequestsInQueue : !isAdmin ? strings.Dashboard.MyRequests : strings.Dashboard.TotalRequests}
            </span>
            <span className={styles.summarySubtitle}>
              {isAdmin
                ? formatString(strings.Dashboard.QueueRequestsSubtitle, totalRequests)
                : formatString(strings.Dashboard.ApprovalSuccessSubtitle, approvalSuccessRate)}
            </span>
          </div>
        </div>

        {/* Card 4: Awaiting Approval / Pending Requests (Admin / Manager only) */}
        {(isAdmin || isInventoryManager) && (
          <div
            className={`${styles.summaryCard} ${styles.cardGold}`}
            role="status"
            aria-label={`${isManagerView ? strings.Dashboard.AwaitingApproval : strings.Dashboard.PendingRequests}: ${isManagerView ? awaitingManagerDecision : pendingRequests}`}
          >
            <div className={styles.iconContainer}>
              <Icon iconName="Clock" />
            </div>
            <div className={styles.cardInfo}>
              <span className={styles.summaryValue}>
                {isManagerView ? awaitingManagerDecision : pendingRequests}
              </span>
              <span className={styles.summaryLabel}>
                {isManagerView ? strings.Dashboard.AwaitingApproval : strings.Dashboard.PendingRequests}
              </span>
              <span className={styles.summarySubtitle}>
                {isManagerView
                  ? formatString(strings.Dashboard.RequiresReviewSubtitle, awaitingManagerDecision)
                  : formatString(strings.Dashboard.UnderReviewSubtitle, pendingRequests)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ===== CHART CARDS (Admin & Manager only) ===== */}
      {(isAdmin || isInventoryManager) && (
        <div className={styles.chartsGrid}>
          {/* Chart 1: Primary Status (Pie) */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartIcon}>
                <Icon iconName="DonutChart" />
              </div>
              <div className={styles.chartTitleBlock}>
                <h3>{primaryPieTitle}</h3>
                <span className={styles.chartSubtitle}>{primaryPieSubtitle}</span>
              </div>
            </div>
            <div className={styles.chartContainer}>
              <Pie data={assetStatusData} options={pieOptions} />
            </div>
          </div>

          {/* Chart 2: Types (Bar) */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartIcon}>
                <Icon iconName="BarChart4" />
              </div>
              <div className={styles.chartTitleBlock}>
                <h3>{strings.Dashboard.AssetsByTypeTitle}</h3>
                <span className={styles.chartSubtitle}>{strings.Dashboard.AssetsByTypeSubtitle}</span>
              </div>
            </div>
            <div className={styles.chartContainer}>
              <Bar data={assetTypeData} options={assetTypeOptions} />
            </div>
          </div>

          {/* Chart 3: Doughnut (Request Status) */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartIcon}>
                <Icon iconName="PieDouble" />
              </div>
              <div className={styles.chartTitleBlock}>
                <h3>
                  {isManagerView ? strings.Dashboard.PostApprovalAssignmentTitle : strings.Dashboard.RequestFulfillmentTitle}
                </h3>
                <span className={styles.chartSubtitle}>
                  {isManagerView
                    ? strings.Dashboard.PostApprovalAssignmentSubtitle
                    : strings.Dashboard.RequestFulfillmentSubtitle}
                </span>
              </div>
            </div>
            <div className={styles.chartContainer}>
              <Doughnut data={requestStatusData} options={doughnutOptions} />
            </div>
          </div>
        </div>
      )}

      {/* ===== ACTION CENTER — ADMIN ===== */}
      {isAdmin && (
        <div className={styles.actionCenter}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>
                <Icon iconName="ReviewRequestMirrored" />
                {strings.Dashboard.AdminActionCenterTitle}
              </h3>
              <span className={styles.sectionSubtitle}>
                {strings.Dashboard.AdminActionCenterSubtitle}
              </span>
            </div>
          </div>
          <div className={styles.tableWrapper}>
            {recentAssignments.length > 0 ? (
              <table className={styles.actionTable}>
                <thead>
                  <tr>
                    <th>{strings.Dashboard.ColRequester}</th>
                    <th>{strings.Dashboard.ColAssetRequested}</th>
                    <th>{strings.Dashboard.ColQty}</th>
                    <th>{strings.Dashboard.ColDateApproved}</th>
                    <th>{strings.Dashboard.ColStatusAction}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAssignments.map(req => (
                    <tr key={req.id}>
                      <td><strong>{req.requesterName}</strong></td>
                      <td>{req.assetTitle}</td>
                      <td>{req.quantity}</td>
                      <td>{formatDate(req.requestDate)}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles.badgePending}`}>
                          {strings.Dashboard.BadgeAwaitingHandoff}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.noDataMessage}>
                <Icon iconName="CompletedSolid" />
                <span>{strings.Dashboard.AdminEmptyState}</span>
                <span className={styles.emptyStateHint}>{strings.Dashboard.AdminEmptyStateHint}</span>
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
              <h3>
                <Icon iconName="ReviewRequest" />
                {strings.Dashboard.ManagerActionCenterTitle}
              </h3>
              <span className={styles.sectionSubtitle}>
                {strings.Dashboard.ManagerActionCenterSubtitle}
              </span>
            </div>
          </div>
          <div className={styles.tableWrapper}>
            {recentApprovals.length > 0 ? (
              <table className={styles.actionTable}>
                <thead>
                  <tr>
                    <th>{strings.Dashboard.ColRequester}</th>
                    <th>{strings.Dashboard.ColAssetRequested}</th>
                    <th>{strings.Dashboard.ColQty}</th>
                    <th>{strings.Dashboard.ColDateRequested}</th>
                    <th>{strings.Dashboard.ColReason}</th>
                    <th>{strings.Dashboard.ColActionState}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApprovals.map(req => (
                    <tr key={req.id}>
                      <td><strong>{req.requesterName}</strong></td>
                      <td>{req.assetTitle}</td>
                      <td>{req.quantity}</td>
                      <td>{formatDate(req.requestDate)}</td>
                      <td className={styles.tableCellJustification}>
                        {req.reason || strings.Dashboard.NoJustificationSpecified}
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles.badgePending}`}>
                          {strings.Dashboard.BadgeAwaitingApproval}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.noDataMessage}>
                <Icon iconName="CheckMark" />
                <span>{strings.Dashboard.ManagerEmptyState}</span>
                <span className={styles.emptyStateHint}>{strings.Dashboard.ManagerEmptyStateHint}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== ACTION CENTER — EMPLOYEE ===== */}
      {!isAdmin && !isInventoryManager && (
        <div className={styles.splitLayout}>
          {/* Active Requests Tracker */}
          <div className={styles.actionCenter}>
            <div className={styles.sectionHeader}>
              <div>
                <h3>
                  <Icon iconName="Send" />
                  {strings.Dashboard.EmployeeActionCenterTitle}
                </h3>
                <span className={styles.sectionSubtitle}>
                  {strings.Dashboard.EmployeeActionCenterSubtitle}
                </span>
              </div>
            </div>
            <div className={styles.tableWrapper}>
              {recentEmployeeRequests.length > 0 ? (
                <table className={styles.actionTable}>
                  <thead>
                    <tr>
                      <th>{strings.Dashboard.ColAsset}</th>
                      <th>{strings.Dashboard.ColManagerName}</th>
                      <th>{strings.Dashboard.ColQty}</th>
                      <th>{strings.Dashboard.ColDateRequested}</th>
                      <th>{strings.Dashboard.ColManagerComment}</th>
                      <th>{strings.Dashboard.ColFulfillmentState}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEmployeeRequests.map(req => {
                      const isApproved = (req.status || '').toLowerCase() === 'approved';
                      const isDeclined = (req.status || '').toLowerCase() === 'declined' || (req.status || '').toLowerCase() === 'rejected';
                      const isAssetAssigned = (req.assetStatus || '').toLowerCase() === 'approved';

                      let badgeClass = styles.badgePending;
                      let badgeText = strings.Dashboard.BadgeAwaitingReview;

                      if (isApproved) {
                        if (isAssetAssigned) {
                          badgeClass = styles.badgeApproved;
                          badgeText = strings.Dashboard.BadgeCompletedAssigned;
                        } else {
                          badgeClass = styles.badgePending;
                          badgeText = strings.Dashboard.BadgeApprovedAwaitingHandoff;
                        }
                      } else if (isDeclined) {
                        badgeClass = styles.badgeDeclined;
                        badgeText = strings.Dashboard.BadgeDeclined;
                      }

                      return (
                        <tr key={req.id}>
                          <td><strong>{req.assetTitle}</strong></td>
                          <td>{req.managerName || '-'}</td>
                          <td>{req.quantity}</td>
                          <td>{formatDate(req.requestDate)}</td>
                          <td style={{ color: isDeclined ? '#991b1b' : 'inherit' }}>
                            {req.managerResponse || '-'}
                          </td>
                          <td>
                            <span className={`${styles.statusBadge} ${badgeClass}`}>
                              {badgeText}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className={styles.noDataMessage}>
                  <Icon iconName="Info" />
                  <span>{strings.Dashboard.EmployeeEmptyState}</span>
                  <span className={styles.emptyStateHint}>{strings.Dashboard.EmployeeEmptyStateHint}</span>
                </div>
              )}
            </div>
          </div>

          {/* Assigned Devices */}
          <div className={styles.actionCenter}>
            <div className={styles.sectionHeader}>
              <div>
                <h3>
                  <Icon iconName="Devices3" />
                  {strings.Dashboard.MyEquipmentTitle}
                </h3>
                <span className={styles.sectionSubtitle}>
                  {strings.Dashboard.MyEquipmentSubtitle}
                </span>
              </div>
            </div>
            <div className={styles.tableWrapper}>
              {sortedEmployeeItems.length > 0 ? (
                <table className={styles.actionTable}>
                  <thead>
                    <tr>
                      <th>{strings.Dashboard.ColDeviceName}</th>
                      <th>{strings.Dashboard.ColCategory}</th>
                      <th>{strings.Dashboard.ColSerialNumber}</th>
                      <th>{strings.Dashboard.ColAssignedDate}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEmployeeItems.map(item => (
                      <tr key={item.id}>
                        <td><strong>{item.title}</strong></td>
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
                  <span>{strings.Dashboard.MyEquipmentEmptyState}</span>
                  <span className={styles.emptyStateHint}>{strings.Dashboard.MyEquipmentEmptyStateHint}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
