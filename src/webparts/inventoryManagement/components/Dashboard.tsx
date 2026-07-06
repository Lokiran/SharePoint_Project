import * as React from 'react';
import styles from './Dashboard.module.scss';
import { IInventoryItem } from '../models/IInventoryItem';
import { IRequest } from '../models/IRequest';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { Icon } from '@fluentui/react/lib/Icon';

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
  }, {} as Record<string, number>);

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
        }, {} as Record<string, number>)
    : requests.reduce((acc, req) => {
        const status = isAdmin ? (req.assetStatus || 'Pending') : (req.status || 'Pending');
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

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

  // --- Filter for pending assignments (Admin Action Center) ---
  const pendingAssignments = requests.filter(
    r => (r.status || '').toLowerCase() === 'approved' && (r.assetStatus || 'Pending') === 'Pending'
  );
  const recentAssignments = pendingAssignments.slice(0, 5);

  // --- Filter for pending decisions (Manager Action Center) ---
  const pendingApprovals = requests.filter(
    r => (r.status || 'Pending') === 'Pending' || (r.status || '').toLowerCase() === 'pending'
  );
  const recentApprovals = pendingApprovals.slice(0, 5);

  // --- Filter for employee's recent requests (Employee Action Center) ---
  const recentEmployeeRequests = requests.slice(0, 5);

  // --- Role label for header ---
  const roleLabel = isAdmin ? 'Administrator' : isManagerView ? 'Inventory Manager' : 'Employee';
  const dashboardTitle = isAdmin ? 'Administrator Dashboard' : isManagerView ? 'Manager Dashboard' : 'My Dashboard';

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
            {roleLabel} Overview
            <span style={{ color: '#c8c6c4' }}>•</span>
            Real-time analytics
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
                aria-label="View Inventory"
              >
                <Icon iconName="List" />
                <span>View Inventory</span>
              </button>
              <button
                className={styles.quickActionBtn}
                onClick={() => navigateTo('AssetAssignmentQueue')}
                aria-label="Assignment Queue"
              >
                <Icon iconName="Send" />
                <span>Assignment Queue</span>
              </button>
              <button
                className={styles.quickActionBtn}
                onClick={() => navigateTo('Reports')}
                aria-label="View Reports"
              >
                <Icon iconName="ReportDocument" />
                <span>Reports</span>
              </button>
              <button
                className={styles.quickActionBtn}
                onClick={() => navigateTo('EventStream')}
                aria-label="Event Stream"
              >
                <Icon iconName="ActivityFeed" />
                <span>Event Stream</span>
              </button>
            </>
          )}
          {isManagerView && (
            <>
              <button
                className={styles.quickActionBtn}
                onClick={() => navigateTo('Approvals')}
                aria-label="Review Approvals"
              >
                <Icon iconName="DoubleChevronRight12" />
                <span>Review Approvals</span>
              </button>
              <button
                className={styles.quickActionBtn}
                onClick={() => navigateTo('AssetReturns')}
                aria-label="Asset Returns"
              >
                <Icon iconName="ReturnToSession" />
                <span>Asset Returns</span>
              </button>
            </>
          )}
          {!isAdmin && !isManagerView && (
            <>
              <button
                className={styles.quickActionBtn}
                onClick={() => navigateTo('MyWorkspace')}
                aria-label="My Workspace"
              >
                <Icon iconName="Briefcase" />
                <span>My Workspace</span>
              </button>
              <button
                className={styles.quickActionBtn}
                onClick={() => navigateTo('Notifications')}
                aria-label="View Notifications"
              >
                <Icon iconName="Ringer" />
                <span>Notifications</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* ===== STATUS BANNERS ===== */}
      {isManagerView && (
        <div className={styles.dashboardIntro}>
          <MessageBar messageBarType={MessageBarType.info}>
            <strong>Inventory Manager Dashboard</strong> — Visual metrics and approval queues are aggregated from request lists. Full data resides in the <strong>Approvals</strong> registry.
          </MessageBar>
        </div>
      )}
      {isAdmin && (
        <div className={styles.dashboardIntro}>
          <MessageBar messageBarType={MessageBarType.success}>
            <strong>Administrator Dashboard</strong> — Analytics are derived directly from the physical inventory items. Assignment metrics display admin-approved items.
          </MessageBar>
        </div>
      )}
      {!isAdmin && !isInventoryManager && (
        <div className={styles.dashboardIntro}>
          <MessageBar messageBarType={MessageBarType.info}>
            <strong>Personal Asset Hub</strong> — Real-time telemetry tracking your assigned devices and ongoing request status.
          </MessageBar>
        </div>
      )}

      {/* ===== KPI SUMMARY CARDS ===== */}
      <div className={styles.summaryGrid} role="region" aria-label="Key performance indicators">
        {/* Card 1: Total Assets */}
        <div
          className={`${styles.summaryCard} ${styles.cardBlue}`}
          role="status"
          aria-label={`${isAdmin ? 'Total Assets' : !isInventoryManager ? 'My Devices' : 'Total Assets'}: ${totalAssets}`}
        >
          <div className={styles.iconContainer}>
            <Icon iconName="Package" />
          </div>
          <div className={styles.cardInfo}>
            <span className={styles.summaryValue}>{totalAssets}</span>
            <span className={styles.summaryLabel}>
              {isAdmin ? 'Total Assets' : !isInventoryManager ? 'My Devices' : 'Total Assets'}
            </span>
            <span className={styles.summarySubtitle}>
              {isAdmin
                ? `Allocation rate: ${allocationRate}% allocated`
                : !isInventoryManager
                  ? `${totalAssets} assigned hardware item${totalAssets === 1 ? '' : 's'}`
                  : `${totalAssets} items in catalog`}
            </span>
          </div>
        </div>

        {/* Card 2: Available Assets */}
        <div
          className={`${styles.summaryCard} ${styles.cardGreen}`}
          role="status"
          aria-label={`Available Assets: ${availableAssets}`}
        >
          <div className={styles.iconContainer}>
            <Icon iconName="Accept" />
          </div>
          <div className={styles.cardInfo}>
            <span className={styles.summaryValue}>{availableAssets}</span>
            <span className={styles.summaryLabel}>Available Assets</span>
            <span className={styles.summarySubtitle}>
              {availableAssets} in stock ({stockPercentage}% of total)
            </span>
          </div>
        </div>

        {/* Card 3: Requests in queue / Total Requests */}
        <div
          className={`${styles.summaryCard} ${styles.cardPurple}`}
          role="status"
          aria-label={`${isManagerView ? 'Requests in Queue' : 'Total Requests'}: ${totalRequests}`}
        >
          <div className={styles.iconContainer}>
            <Icon iconName="Send" />
          </div>
          <div className={styles.cardInfo}>
            <span className={styles.summaryValue}>{totalRequests}</span>
            <span className={styles.summaryLabel}>
              {isManagerView ? 'Requests in Queue' : 'Total Requests'}
            </span>
            <span className={styles.summarySubtitle}>
              {isAdmin
                ? `${totalRequests} queue requests`
                : `Approval success: ${approvalSuccessRate}%`}
            </span>
          </div>
        </div>

        {/* Card 4: Awaiting Approval / Pending Requests */}
        <div
          className={`${styles.summaryCard} ${styles.cardGold}`}
          role="status"
          aria-label={`${isManagerView ? 'Awaiting Approval' : 'Pending Requests'}: ${isManagerView ? awaitingManagerDecision : pendingRequests}`}
        >
          <div className={styles.iconContainer}>
            <Icon iconName="Clock" />
          </div>
          <div className={styles.cardInfo}>
            <span className={styles.summaryValue}>
              {isManagerView ? awaitingManagerDecision : pendingRequests}
            </span>
            <span className={styles.summaryLabel}>
              {isManagerView ? 'Awaiting Approval' : 'Pending Requests'}
            </span>
            <span className={styles.summarySubtitle}>
              {isManagerView
                ? `${awaitingManagerDecision} requires review`
                : `${pendingRequests} under assignment review`}
            </span>
          </div>
        </div>
      </div>

      {/* ===== CHART CARDS ===== */}
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
              <h3>Assets by Type</h3>
              <span className={styles.chartSubtitle}>Categorized distribution of equipment</span>
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
                {isManagerView ? 'Post-Approval Assignment Status' : 'Request Fulfillment Status'}
              </h3>
              <span className={styles.chartSubtitle}>
                {isManagerView
                  ? 'Status of asset handouts for manager-approved requests'
                  : 'Current status across all request pipelines'}
              </span>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <Doughnut data={requestStatusData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* ===== ACTION CENTER — ADMIN ===== */}
      {isAdmin && (
        <div className={styles.actionCenter}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>
                <Icon iconName="ReviewRequestMirrored" />
                Asset Assignment Action Center
              </h3>
              <span className={styles.sectionSubtitle}>
                Recent manager-approved requests awaiting physical hardware handout by administrators
              </span>
            </div>
          </div>
          <div className={styles.tableWrapper}>
            {recentAssignments.length > 0 ? (
              <table className={styles.actionTable}>
                <thead>
                  <tr>
                    <th>Requester</th>
                    <th>Asset Requested</th>
                    <th>Qty</th>
                    <th>Date Approved</th>
                    <th>Status Action</th>
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
                          Awaiting Handoff
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.noDataMessage}>
                <Icon iconName="CompletedSolid" />
                <span>All assignments caught up! No pending physical handouts.</span>
                <span className={styles.emptyStateHint}>Check the Assignment Queue for historical data</span>
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
                Pending Manager Decisions
              </h3>
              <span className={styles.sectionSubtitle}>
                Recent employee requests awaiting your approval or decline
              </span>
            </div>
          </div>
          <div className={styles.tableWrapper}>
            {recentApprovals.length > 0 ? (
              <table className={styles.actionTable}>
                <thead>
                  <tr>
                    <th>Requester</th>
                    <th>Asset Requested</th>
                    <th>Qty</th>
                    <th>Date Requested</th>
                    <th>Reason / Justification</th>
                    <th>Action State</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApprovals.map(req => (
                    <tr key={req.id}>
                      <td><strong>{req.requesterName}</strong></td>
                      <td>{req.assetTitle}</td>
                      <td>{req.quantity}</td>
                      <td>{formatDate(req.requestDate)}</td>
                      <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {req.reason || 'No justification specified'}
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles.badgePending}`}>
                          Awaiting Approval
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.noDataMessage}>
                <Icon iconName="CheckMark" />
                <span>Zero pending requests! Your approvals queue is clear.</span>
                <span className={styles.emptyStateHint}>New requests will appear here automatically</span>
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
                  Active Requests Status
                </h3>
                <span className={styles.sectionSubtitle}>
                  Recent hardware requests in the verification pipeline
                </span>
              </div>
            </div>
            <div className={styles.tableWrapper}>
              {recentEmployeeRequests.length > 0 ? (
                <table className={styles.actionTable}>
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Qty</th>
                      <th>Requested Date</th>
                      <th>Fulfillment State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEmployeeRequests.map(req => {
                      const isApproved = (req.status || '').toLowerCase() === 'approved';
                      const isDeclined = (req.status || '').toLowerCase() === 'declined' || (req.status || '').toLowerCase() === 'rejected';
                      const isAssetAssigned = (req.assetStatus || '').toLowerCase() === 'approved';

                      let badgeClass = styles.badgePending;
                      let badgeText = 'Awaiting Review';

                      if (isApproved) {
                        if (isAssetAssigned) {
                          badgeClass = styles.badgeApproved;
                          badgeText = 'Completed & Assigned';
                        } else {
                          badgeClass = styles.badgePending;
                          badgeText = 'Approved, Awaiting Handoff';
                        }
                      } else if (isDeclined) {
                        badgeClass = styles.badgeDeclined;
                        badgeText = 'Declined';
                      }

                      return (
                        <tr key={req.id}>
                          <td><strong>{req.assetTitle}</strong></td>
                          <td>{req.quantity}</td>
                          <td>{formatDate(req.requestDate)}</td>
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
                  <span>No active requests placed recently.</span>
                  <span className={styles.emptyStateHint}>Use &quot;Request Asset&quot; to submit a new request</span>
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
                  My Assigned Equipment
                </h3>
                <span className={styles.sectionSubtitle}>
                  Hardware currently registered and assigned to you
                </span>
              </div>
            </div>
            <div className={styles.tableWrapper}>
              {items.length > 0 ? (
                <table className={styles.actionTable}>
                  <thead>
                    <tr>
                      <th>Device Name</th>
                      <th>Category</th>
                      <th>Serial Number</th>
                      <th>Assigned Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.slice(0, 5).map(item => (
                      <tr key={item.id}>
                        <td><strong>{item.title}</strong></td>
                        <td>{item.assetType}</td>
                        <td><code>{item.serialNumber || 'N/A'}</code></td>
                        <td>{formatDate(item.assignedDate || '')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className={styles.noDataMessage}>
                  <Icon iconName="Devices3" />
                  <span>No equipment currently assigned to you.</span>
                  <span className={styles.emptyStateHint}>Assigned devices will appear here after handoff</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
