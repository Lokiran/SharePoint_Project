import * as React from 'react';
import { useState, useMemo } from 'react';
import { IRequest } from '../models/IRequest';
import { IReturnRequest } from '../models/IReturnRequest';
import { 
  Stack, 
  Text, 
  TextField, 
  Dropdown, 
  Icon, 
  DefaultButton, 
  Panel, 
  PanelType,
  Pivot,
  PivotItem
} from '@fluentui/react';
import styles from './InventoryManagement.module.scss';

export interface IMyRequestsViewProps {
  requests: IRequest[];
  returnRequests?: IReturnRequest[];
}

export const MyRequestsView: React.FC<IMyRequestsViewProps> = (props) => {
  const { requests, returnRequests = [] } = props;

  // Search and Filter States (Asset Requests)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  // Search and Filter States (Return Requests)
  const [returnSearchQuery, setReturnSearchQuery] = useState<string>('');
  const [returnSelectedStatus, setReturnSelectedStatus] = useState<string>('All');

  // Detail Panel State
  const [selectedRequest, setSelectedRequest] = useState<IRequest | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  // Return Request Detail Panel State
  const [selectedReturnRequest, setSelectedReturnRequest] = useState<IReturnRequest | null>(null);
  const [isReturnPanelOpen, setIsReturnPanelOpen] = useState<boolean>(false);

  // Dynamic metrics derived from all requests
  const metrics = useMemo(() => {
    let pendingCount = 0;
    let approvedCount = 0;
    let declinedCount = 0;

    requests.forEach(r => {
      const status = r.status || 'Pending';
      if (status === 'Pending') pendingCount++;
      else if (status === 'Approved') approvedCount++;
      else if (status === 'Declined') declinedCount++;
    });

    return {
      total: requests.length,
      pending: pendingCount,
      approved: approvedCount,
      declined: declinedCount
    };
  }, [requests]);

  // Return Request metrics
  const returnMetrics = useMemo(() => {
    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;
    let completedCount = 0;

    returnRequests.forEach(r => {
      const status = r.status || 'Pending';
      if (status === 'Pending') pendingCount++;
      else if (status === 'Approved') approvedCount++;
      else if (status === 'Rejected') rejectedCount++;
      else if (status === 'Completed') completedCount++;
    });

    return {
      total: returnRequests.length,
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      completed: completedCount
    };
  }, [returnRequests]);

  // Filtering Logic (Asset Requests)
  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const normQuery = searchQuery.toLowerCase().trim();
      const matchesSearch = !normQuery || 
        (r.requestKey || '').toLowerCase().includes(normQuery) ||
        (r.assetTitle || '').toLowerCase().includes(normQuery) ||
        (r.reason || '').toLowerCase().includes(normQuery) ||
        (r.id || '').toLowerCase().includes(normQuery);

      const matchesStatus = selectedStatus === 'All' || (r.status || 'Pending') === selectedStatus;
      const matchesPriority = selectedPriority === 'All' || (r.priority || 'Medium') === selectedPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [requests, searchQuery, selectedStatus, selectedPriority]);

  // Filtering Logic (Return Requests)
  const filteredReturnRequests = useMemo(() => {
    return returnRequests.filter(r => {
      const normQuery = returnSearchQuery.toLowerCase().trim();
      const matchesSearch = !normQuery ||
        (r.assetName || '').toLowerCase().includes(normQuery) ||
        (r.serialNumber || '').toLowerCase().includes(normQuery) ||
        (r.returnReason || '').toLowerCase().includes(normQuery) ||
        (r.id || '').toLowerCase().includes(normQuery);

      const matchesStatus = returnSelectedStatus === 'All' || r.status === returnSelectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [returnRequests, returnSearchQuery, returnSelectedStatus]);

  // Return status badge styles
  const getReturnStatusStyle = (status: string): { bg: string; color: string } => {
    switch (status) {
      case 'Pending':   return { bg: '#fff8e6', color: '#b06000' };
      case 'Approved':  return { bg: '#e8f0fe', color: '#1558d6' };
      case 'Rejected':  return { bg: '#fce8e6', color: '#c5221f' };
      case 'Completed': return { bg: '#e6f4ea', color: '#137333' };
      default:          return { bg: '#f1f3f4', color: '#5f6368' };
    }
  };

  const getReturnStatusIcon = (status: string): string => {
    switch (status) {
      case 'Pending':   return 'Clock';
      case 'Approved':  return 'CompletedSolid';
      case 'Rejected':  return 'ErrorBadge';
      case 'Completed': return 'CheckMark';
      default:          return 'Info';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>

      <Pivot aria-label="My Requests">

        {/* ══════════════════════════════════════════
            TAB 1: My Asset Requests (existing)
        ══════════════════════════════════════════ */}
        <PivotItem
          headerText="Asset Requests"
          itemIcon="Send"
          itemCount={metrics.total}
        >
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '15px' }}>

            {/* Metrics Row */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              padding: '0 4px 16px 4px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
            }}>
              <div style={{ flex: '1 1 auto', minWidth: '110px' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Total Requests</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-main)' }}>{metrics.total}</span>
              </div>
              <div style={{ width: '1px', backgroundColor: '#e2e8f0', alignSelf: 'stretch' }} />
              <div style={{ flex: '1 1 auto', minWidth: '110px' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Pending Approval</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 600, color: metrics.pending > 0 ? '#d97706' : 'var(--text-muted)' }}>{metrics.pending}</span>
              </div>
              <div style={{ width: '1px', backgroundColor: '#e2e8f0', alignSelf: 'stretch' }} />
              <div style={{ flex: '1 1 auto', minWidth: '110px' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Approved</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 600, color: '#16a34a' }}>{metrics.approved}</span>
              </div>
              <div style={{ width: '1px', backgroundColor: '#e2e8f0', alignSelf: 'stretch' }} />
              <div style={{ flex: '1 1 auto', minWidth: '110px' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Declined</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 600, color: metrics.declined > 0 ? '#dc2626' : 'var(--text-muted)' }}>{metrics.declined}</span>
              </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end', padding: '0 0 10px 0' }}>
              <div style={{ flex: '1 1 200px' }}>
                <TextField
                  placeholder="Search by Request ID, asset type, reason..."
                  value={searchQuery}
                  onChange={(e, val) => setSearchQuery(val || '')}
                  iconProps={{ iconName: 'Search' }}
                  underlined
                />
              </div>
              <div style={{ width: '130px' }}>
                <Dropdown
                  options={[
                    { key: 'All', text: 'All Statuses' },
                    { key: 'Pending', text: 'Pending' },
                    { key: 'Approved', text: 'Approved' },
                    { key: 'Declined', text: 'Declined' }
                  ]}
                  selectedKey={selectedStatus}
                  onChange={(e, option) => setSelectedStatus(option ? (option.key as string) : 'All')}
                  styles={{ root: { selectors: { '.ms-Dropdown-title': { border: 'none', borderBottom: '1px solid #a1a1a1', background: 'transparent', paddingLeft: 0 } } } }}
                />
              </div>
              <div style={{ width: '130px' }}>
                <Dropdown
                  options={[
                    { key: 'All', text: 'All Priorities' },
                    { key: 'Low', text: 'Low' },
                    { key: 'Medium', text: 'Medium' },
                    { key: 'High', text: 'High' }
                  ]}
                  selectedKey={selectedPriority}
                  onChange={(e, option) => setSelectedPriority(option ? (option.key as string) : 'All')}
                  styles={{ root: { selectors: { '.ms-Dropdown-title': { border: 'none', borderBottom: '1px solid #a1a1a1', background: 'transparent', paddingLeft: 0 } } } }}
                />
              </div>
              <div>
                <DefaultButton
                  text="Reset"
                  iconProps={{ iconName: 'ClearFilter' }}
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatus('All');
                    setSelectedPriority('All');
                  }}
                  style={{ height: '30px', border: 'none', background: 'transparent' }}
                />
              </div>
            </div>

            {/* Asset Request Cards Grid */}
            {filteredRequests.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '16px',
                marginTop: '10px'
              }}>
                {filteredRequests.map(item => {
                  const status = item.status || 'Pending';
                  const priority = item.priority || 'Medium';

                  let statusBg = '#fef7e0';
                  let statusText = '#b06000';
                  if (status === 'Approved') { statusBg = '#e6f4ea'; statusText = '#137333'; }
                  else if (status === 'Declined') { statusBg = '#fce8e6'; statusText = '#c5221f'; }

                  let priorityColor = '#5f6368';
                  let priorityBg = '#f1f3f4';
                  if (priority === 'High') { priorityColor = '#c5221f'; priorityBg = '#fce8e6'; }
                  else if (priority === 'Low') { priorityColor = '#1a73e8'; priorityBg = '#e8f0fe'; }

                  let adminAllocationText = '';
                  let adminAllocationColor = 'var(--text-muted)';
                  const managerStatusLower = status.toLowerCase();

                  if (managerStatusLower === 'pending') {
                    adminAllocationText = 'Waiting on Manager';
                    adminAllocationColor = '#b06000';
                  } else if (managerStatusLower === 'declined') {
                    adminAllocationText = 'N/A (Rejected)';
                    adminAllocationColor = '#c5221f';
                  } else {
                    const isAllocated = (item.assetStatus || '').toLowerCase().includes('approv');
                    if (isAllocated) {
                      adminAllocationText = 'Asset Allocated ✓';
                      adminAllocationColor = '#137333';
                    } else {
                      adminAllocationText = 'Pending Admin Allocation';
                      adminAllocationColor = '#b06000';
                    }
                  }

                  return (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: 'var(--surface-bg)',
                        borderRadius: '6px',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.2s ease',
                        overflow: 'hidden'
                      }}
                      className={styles.assetCardHover}
                    >
                      {/* Header */}
                      <div style={{ padding: '14px 14px 6px 14px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {item.requestKey || `REQ-${item.id.substring(0, 6)}`}
                          </h4>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Requested: {item.requestDate}
                          </span>
                        </div>
                        <span style={{ backgroundColor: statusBg, color: statusText, padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 600 }}>
                          {status}
                        </span>
                      </div>

                      {/* Body */}
                      <div style={{ padding: '4px 14px 12px 14px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>
                          Asset: <strong>{item.assetTitle}</strong> (Qty: {item.quantity})
                        </div>
                        {item.reason && (
                          <p style={{ margin: '0 0 2px 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '32px' }}>
                            Reason: {item.reason}
                          </p>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', borderTop: '1px solid rgba(0, 0, 0, 0.04)', paddingTop: '6px', marginTop: 'auto' }}>
                          <span style={{ color: adminAllocationColor, fontWeight: 500 }}>{adminAllocationText}</span>
                          <span style={{ backgroundColor: priorityBg, color: priorityColor, padding: '2px 6px', borderRadius: '3px', fontSize: '0.68rem', fontWeight: 500 }}>{priority}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ padding: '8px 14px 10px 14px', display: 'flex', gap: '6px', borderTop: '1px solid rgba(0, 0, 0, 0.04)', alignItems: 'center' }}>
                        <DefaultButton
                          text="View Details"
                          onClick={() => { setSelectedRequest(item); setIsPanelOpen(true); }}
                          style={{ height: '24px', padding: '0 8px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid #e0e0e0', width: '100%' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 10px', backgroundColor: 'var(--surface-bg)', borderRadius: '6px', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
                <Icon iconName="DatabaseNoData" style={{ fontSize: '32px', color: 'var(--text-muted)', marginBottom: '8px' }} />
                <Text variant="medium" block style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>No Asset Requests Found</Text>
                <Text variant="small" style={{ color: 'var(--text-muted)' }}>Try adjusting your search query or filters.</Text>
              </div>
            )}
          </div>
        </PivotItem>

        {/* ══════════════════════════════════════════
            TAB 2: My Return Requests (NEW)
        ══════════════════════════════════════════ */}
        <PivotItem
          headerText="Return Requests"
          itemIcon="ReturnToSession"
          itemCount={returnMetrics.total}
        >
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '15px' }}>

            {/* Return Metrics Row */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              padding: '0 4px 16px 4px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
            }}>
              <div style={{ flex: '1 1 auto', minWidth: '90px' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Total</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-main)' }}>{returnMetrics.total}</span>
              </div>
              <div style={{ width: '1px', backgroundColor: '#e2e8f0', alignSelf: 'stretch' }} />
              <div style={{ flex: '1 1 auto', minWidth: '90px' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Pending</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 600, color: returnMetrics.pending > 0 ? '#d97706' : 'var(--text-muted)' }}>{returnMetrics.pending}</span>
              </div>
              <div style={{ width: '1px', backgroundColor: '#e2e8f0', alignSelf: 'stretch' }} />
              <div style={{ flex: '1 1 auto', minWidth: '90px' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Approved</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 600, color: '#1558d6' }}>{returnMetrics.approved}</span>
              </div>
              <div style={{ width: '1px', backgroundColor: '#e2e8f0', alignSelf: 'stretch' }} />
              <div style={{ flex: '1 1 auto', minWidth: '90px' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Completed</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 600, color: '#16a34a' }}>{returnMetrics.completed}</span>
              </div>
              <div style={{ width: '1px', backgroundColor: '#e2e8f0', alignSelf: 'stretch' }} />
              <div style={{ flex: '1 1 auto', minWidth: '90px' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Rejected</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 600, color: returnMetrics.rejected > 0 ? '#dc2626' : 'var(--text-muted)' }}>{returnMetrics.rejected}</span>
              </div>
            </div>

            {/* Return Filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end', padding: '0 0 10px 0' }}>
              <div style={{ flex: '1 1 200px' }}>
                <TextField
                  placeholder="Search by asset name, serial number, reason..."
                  value={returnSearchQuery}
                  onChange={(e, val) => setReturnSearchQuery(val || '')}
                  iconProps={{ iconName: 'Search' }}
                  underlined
                />
              </div>
              <div style={{ width: '150px' }}>
                <Dropdown
                  options={[
                    { key: 'All', text: 'All Statuses' },
                    { key: 'Pending', text: 'Pending' },
                    { key: 'Approved', text: 'Approved' },
                    { key: 'Rejected', text: 'Rejected' },
                    { key: 'Completed', text: 'Completed' }
                  ]}
                  selectedKey={returnSelectedStatus}
                  onChange={(e, option) => setReturnSelectedStatus(option ? (option.key as string) : 'All')}
                  styles={{ root: { selectors: { '.ms-Dropdown-title': { border: 'none', borderBottom: '1px solid #a1a1a1', background: 'transparent', paddingLeft: 0 } } } }}
                />
              </div>
              <div>
                <DefaultButton
                  text="Reset"
                  iconProps={{ iconName: 'ClearFilter' }}
                  onClick={() => {
                    setReturnSearchQuery('');
                    setReturnSelectedStatus('All');
                  }}
                  style={{ height: '30px', border: 'none', background: 'transparent' }}
                />
              </div>
            </div>

            {/* Return Request Cards */}
            {filteredReturnRequests.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '16px',
                marginTop: '10px'
              }}>
                {filteredReturnRequests.map(item => {
                  const { bg: statusBg, color: statusColor } = getReturnStatusStyle(item.status);
                  const statusIcon = getReturnStatusIcon(item.status);

                  // Condition badge
                  let condBg = '#e6f4ea';
                  let condColor = '#137333';
                  const cond = (item.proposedCondition || '').toLowerCase();
                  if (cond === 'fair') { condBg = '#fff8e6'; condColor = '#b06000'; }
                  else if (cond === 'poor') { condBg = '#ffe8d6'; condColor = '#a63e00'; }
                  else if (cond === 'damaged') { condBg = '#fce8e6'; condColor = '#c5221f'; }

                  return (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: 'var(--surface-bg)',
                        borderRadius: '6px',
                        border: `1px solid ${item.status === 'Rejected' ? 'rgba(197, 34, 31, 0.15)' : item.status === 'Completed' ? 'rgba(19, 115, 51, 0.15)' : 'rgba(0, 0, 0, 0.08)'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.2s ease',
                        overflow: 'hidden'
                      }}
                      className={styles.assetCardHover}
                    >
                      {/* Header */}
                      <div style={{ padding: '14px 14px 6px 14px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <Icon iconName="ReturnToSession" style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '2px' }} />
                          <div>
                            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                              {item.assetName}
                            </h4>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              S/N: {item.serialNumber || 'N/A'} &bull; Submitted: {item.requestDate}
                            </span>
                          </div>
                        </div>
                        <span style={{ backgroundColor: statusBg, color: statusColor, padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                          <Icon iconName={statusIcon} style={{ fontSize: '10px' }} />
                          {item.status}
                        </span>
                      </div>

                      {/* Body */}
                      <div style={{ padding: '4px 14px 12px 14px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {item.returnReason && (
                          <p style={{ margin: '0 0 2px 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '32px' }}>
                            Reason: {item.returnReason}
                          </p>
                        )}

                        {/* Condition & Return Date */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', borderTop: '1px solid rgba(0, 0, 0, 0.04)', paddingTop: '6px' }}>
                          <span>
                            Condition: <span style={{ backgroundColor: condBg, color: condColor, padding: '1px 6px', borderRadius: '3px', fontSize: '0.68rem', fontWeight: 600 }}>
                              {item.proposedCondition || 'N/A'}
                            </span>
                          </span>
                          {item.completedDate && (
                            <span style={{ color: '#16a34a', fontSize: '0.7rem' }}>✓ {item.completedDate}</span>
                          )}
                        </div>

                        {/* Manager comment (if any) */}
                        {item.managerComment && (
                          <div style={{
                            backgroundColor: item.status === 'Rejected' ? '#fef2f2' : item.status === 'Completed' ? '#f0fdf4' : '#f8fafc',
                            borderRadius: '4px',
                            padding: '6px 8px',
                            borderLeft: `3px solid ${item.status === 'Rejected' ? '#dc2626' : item.status === 'Completed' ? '#16a34a' : '#94a3b8'}`,
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)'
                          }}>
                            <strong style={{ display: 'block', marginBottom: '2px', color: 'var(--text-main)' }}>Manager Notes:</strong>
                            {item.managerComment}
                          </div>
                        )}

                        {/* Workflow guidance for pending/approved */}
                        {item.status === 'Pending' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#b06000' }}>
                            <Icon iconName="Clock" style={{ fontSize: '10px' }} />
                            <span>Awaiting manager review</span>
                          </div>
                        )}
                        {item.status === 'Approved' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#1558d6' }}>
                            <Icon iconName="Info" style={{ fontSize: '10px' }} />
                            <span>Please physically hand over the asset to the IT team</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ padding: '8px 14px 10px 14px', display: 'flex', gap: '6px', borderTop: '1px solid rgba(0, 0, 0, 0.04)', alignItems: 'center' }}>
                        <DefaultButton
                          text="View Details"
                          onClick={() => { setSelectedReturnRequest(item); setIsReturnPanelOpen(true); }}
                          style={{ height: '24px', padding: '0 8px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid #e0e0e0', width: '100%' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 10px', backgroundColor: 'var(--surface-bg)', borderRadius: '6px', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
                <Icon iconName="ReturnToSession" style={{ fontSize: '32px', color: 'var(--text-muted)', marginBottom: '8px' }} />
                <Text variant="medium" block style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>No Return Requests Found</Text>
                <Text variant="small" style={{ color: 'var(--text-muted)' }}>
                  {returnRequests.length === 0
                    ? 'You have not submitted any return requests yet. Use the "Return" button on an asset in My Assets.'
                    : 'Try adjusting your search query or filters.'}
                </Text>
              </div>
            )}
          </div>
        </PivotItem>

      </Pivot>

      {/* ══════════════════════════════════════════
          Asset Request Detail Panel (existing)
      ══════════════════════════════════════════ */}
      {selectedRequest && (
        <Panel
          isOpen={isPanelOpen}
          onDismiss={() => { setIsPanelOpen(false); setSelectedRequest(null); }}
          type={PanelType.medium}
          headerText={`Request Details: ${selectedRequest.requestKey || 'Asset Request'}`}
          closeButtonAriaLabel="Close"
        >
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '8px', fontSize: '0.88rem' }}>
              <div><span style={{ color: '#64748b', display: 'block' }}>Request ID:</span> <strong>{selectedRequest.requestKey || 'N/A'}</strong></div>
              <div><span style={{ color: '#64748b', display: 'block' }}>Date Requested:</span> <strong>{selectedRequest.requestDate}</strong></div>
              <div><span style={{ color: '#64748b', display: 'block' }}>Requester:</span> <strong>{selectedRequest.requesterName}</strong></div>
              <div><span style={{ color: '#64748b', display: 'block' }}>Employee ID:</span> <strong>{selectedRequest.employeeId || '-'}</strong></div>
              <div><span style={{ color: '#64748b', display: 'block' }}>Asset Type:</span> <strong>{selectedRequest.assetTitle}</strong></div>
              <div><span style={{ color: '#64748b', display: 'block' }}>Quantity:</span> <strong>{selectedRequest.quantity}</strong></div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Reason for Request</span>
              <span style={{ fontSize: '0.9rem', color: '#334155' }}>{selectedRequest.reason || 'No reason provided.'}</span>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Manager Approval Status</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{
                  backgroundColor: selectedRequest.status === 'Approved' ? '#e6f4ea' : selectedRequest.status === 'Declined' ? '#fce8e6' : '#fef7e0',
                  color: selectedRequest.status === 'Approved' ? '#137333' : selectedRequest.status === 'Declined' ? '#c5221f' : '#b06000',
                  padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600
                }}>
                  {selectedRequest.status || 'Pending'}
                </span>
                {selectedRequest.managerResponse && (
                  <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                    - &ldquo;{selectedRequest.managerResponse}&rdquo;
                  </span>
                )}
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Admin Allocation Status</span>
              <span style={{ fontSize: '0.9rem', color: '#334155' }}>
                {selectedRequest.status === 'Approved' ? (
                  (selectedRequest.assetStatus || '').toLowerCase().includes('approv') ? (
                    <span style={{ color: '#137333', fontWeight: 600 }}>Asset Allocated &amp; Dispatched ✓</span>
                  ) : (
                    <span style={{ color: '#b06000', fontWeight: 600 }}>Pending physical asset allocation by system administrator</span>
                  )
                ) : selectedRequest.status === 'Declined' ? (
                  <span style={{ color: '#c5221f' }}>Not applicable (Request was rejected by manager)</span>
                ) : (
                  <span style={{ color: '#64748b', fontStyle: 'italic' }}>Pending manager approval first</span>
                )}
              </span>
            </div>

            <Stack horizontal tokens={{ childrenGap: 10 }} style={{ marginTop: '25px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
              <DefaultButton
                text="Close"
                onClick={() => { setIsPanelOpen(false); setSelectedRequest(null); }}
              />
            </Stack>
          </div>
        </Panel>
      )}

      {/* ══════════════════════════════════════════
          Return Request Detail Panel (NEW)
      ══════════════════════════════════════════ */}
      {selectedReturnRequest && (
        <Panel
          isOpen={isReturnPanelOpen}
          onDismiss={() => { setIsReturnPanelOpen(false); setSelectedReturnRequest(null); }}
          type={PanelType.medium}
          headerText={`Return Request: ${selectedReturnRequest.assetName}`}
          closeButtonAriaLabel="Close"
        >
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>

            {/* Status Banner */}
            {(() => {
              const { bg, color } = getReturnStatusStyle(selectedReturnRequest.status);
              const icon = getReturnStatusIcon(selectedReturnRequest.status);
              const statusMessages: Record<string, string> = {
                'Pending': 'Your return request has been submitted and is awaiting manager review.',
                'Approved': 'Your return has been approved. Please hand over the asset to the IT/Asset team.',
                'Rejected': 'Your return request was rejected. Please check the manager notes below.',
                'Completed': 'The asset has been successfully checked in. This return is complete.'
              };
              return (
                <div style={{ backgroundColor: bg, padding: '12px 15px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Icon iconName={icon} style={{ fontSize: '20px', color, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color, display: 'block', marginBottom: '2px' }}>{selectedReturnRequest.status}</strong>
                    <span style={{ fontSize: '0.85rem', color }}>{statusMessages[selectedReturnRequest.status] || ''}</span>
                  </div>
                </div>
              );
            })()}

            {/* Asset Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '8px', fontSize: '0.88rem' }}>
              <div><span style={{ color: '#64748b', display: 'block' }}>Asset Name:</span> <strong>{selectedReturnRequest.assetName}</strong></div>
              <div><span style={{ color: '#64748b', display: 'block' }}>Serial Number:</span> <strong>{selectedReturnRequest.serialNumber || 'N/A'}</strong></div>
              <div><span style={{ color: '#64748b', display: 'block' }}>Submitted On:</span> <strong>{selectedReturnRequest.requestDate}</strong></div>
              <div><span style={{ color: '#64748b', display: 'block' }}>Proposed Condition:</span> <strong>{selectedReturnRequest.proposedCondition || 'N/A'}</strong></div>
              {selectedReturnRequest.completedDate && (
                <div><span style={{ color: '#64748b', display: 'block' }}>Completed On:</span> <strong style={{ color: '#16a34a' }}>{selectedReturnRequest.completedDate}</strong></div>
              )}
            </div>

            {/* Return Reason */}
            <div style={{ backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Reason for Return</span>
              <span style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>{selectedReturnRequest.returnReason || 'No reason provided.'}</span>
            </div>

            {/* Manager Comment */}
            {selectedReturnRequest.managerComment && (
              <div style={{
                backgroundColor: selectedReturnRequest.status === 'Rejected' ? '#fef2f2' : '#f0fdf4',
                padding: '12px 15px', borderRadius: '8px',
                border: `1px solid ${selectedReturnRequest.status === 'Rejected' ? '#fecaca' : '#bbf7d0'}`
              }}>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Manager / Admin Notes</span>
                <span style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>{selectedReturnRequest.managerComment}</span>
              </div>
            )}

            {/* Workflow Progress Steps */}
            <div style={{ backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '12px', fontWeight: 600 }}>Return Workflow Progress</span>
              {[
                { label: 'Return Submitted', done: true },
                { label: 'Manager Review', done: selectedReturnRequest.status !== 'Pending' },
                { label: 'Physical Asset Handover', done: selectedReturnRequest.status === 'Completed' },
                { label: 'Asset Checked In & Verified', done: selectedReturnRequest.status === 'Completed' }
              ].map((step, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: idx < 3 ? '8px' : 0, fontSize: '0.85rem' }}>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                    backgroundColor: step.done ? '#16a34a' : '#e2e8f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {step.done && <Icon iconName="CheckMark" style={{ fontSize: '10px', color: '#ffffff' }} />}
                  </div>
                  <span style={{ color: step.done ? '#166534' : '#94a3b8', fontWeight: step.done ? 600 : 400 }}>{step.label}</span>
                </div>
              ))}
            </div>

            <Stack horizontal tokens={{ childrenGap: 10 }} style={{ marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
              <DefaultButton
                text="Close"
                onClick={() => { setIsReturnPanelOpen(false); setSelectedReturnRequest(null); }}
              />
            </Stack>
          </div>
        </Panel>
      )}

    </div>
  );
};
