import * as React from 'react';
import { useState } from 'react';
import { IRequest } from '../models/IRequest';
import { 
  DetailsList, 
  DetailsListLayoutMode, 
  SelectionMode, 
  IColumn
} from '@fluentui/react/lib/DetailsList';
import { PrimaryButton, DefaultButton, Panel, PanelType } from '@fluentui/react';

export interface IRequestListProps {
  items: IRequest[];
  canApproveReject?: boolean;
  canApproveAsset?: boolean;
  showResponseColumns?: boolean;
  statusColumnLabel?: string;
  statusField?: 'status' | 'assetStatus';
  hideStatusColumn?: boolean;
  onApproveRequest?: (request: IRequest) => Promise<void>;
  onRejectRequest?: (request: IRequest, reason: string) => Promise<void>;
  onApproveAsset?: (request: IRequest) => Promise<void>;
  onSelectRequestForAssignment?: (request: IRequest) => void;
  actionInProgressId?: string;
}

export const RequestList: React.FC<IRequestListProps> = (props) => {
  const [selectedRequestForDetails, setSelectedRequestForDetails] = useState<IRequest | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState<boolean>(false);

  const columns: IColumn[] = [
    {
      key: 'columnRequestKey',
      name: 'Request ID',
      fieldName: 'requestKey',
      minWidth: 90,
      maxWidth: 125,
      isResizable: true
    },
    {
      key: 'columnEmployeeName',
      name: 'Employee Name',
      fieldName: 'requesterName',
      minWidth: 100,
      maxWidth: 150,
      isResizable: true
    },
    {
      key: 'columnAssetType',
      name: 'Asset Type',
      fieldName: 'assetTitle',
      minWidth: 100,
      maxWidth: 120,
      isResizable: true
    },
    {
      key: 'columnPriority',
      name: 'Priority',
      fieldName: 'priority',
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
      onRender: (item: IRequest) => {
        const priority = item.priority || 'Medium';
        let color = '#4b5563'; // default medium (gray)
        let backgroundColor = '#f3f4f6';
        if (priority === 'High') {
          color = '#b91c1c';
          backgroundColor = '#fee2e2';
        } else if (priority === 'Low') {
          color = '#1e3a8a';
          backgroundColor = '#dbeafe';
        }
        return (
          <span style={{
            backgroundColor,
            color,
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600
          }}>
            {priority}
          </span>
        );
      }
    },
    ...(props.hideStatusColumn ? [] : [{ 
      key: 'column6', 
      name: props.statusColumnLabel || 'Status', 
      fieldName: props.statusField || 'status', 
      minWidth: 80, 
      maxWidth: 100, 
      isResizable: true,
      onRender: (item: IRequest) => {
        let val: string = item[props.statusField || 'status'] || 'Pending';
        if (val === 'Pending') val = 'Pending';

        let backgroundColor = '#fef3c7'; // default pending (yellow)
        let textColor = '#92400e';
        
        if (val === 'Approved') {
          backgroundColor = '#dcfce7';
          textColor = '#166534';
        } else if (val === 'Declined') {
          backgroundColor = '#fee2e2';
          textColor = '#991b1b';
        }
        
        return (
          <span style={{ 
            backgroundColor, 
            color: textColor, 
            padding: '4px 12px', 
            borderRadius: '9999px', 
            fontSize: '0.75rem', 
            fontWeight: 600,
            display: 'inline-block'
          }}>
            {val}
          </span>
        );
      }
    } as IColumn]),
    ...(props.canApproveAsset ? [{
      key: 'columnAssetStatus',
      name: 'Asset Status',
      fieldName: 'assetStatus',
      minWidth: 200,
      maxWidth: 260,
      isResizable: true,
      onRender: (item: IRequest) => {
        const value = item.assetStatus || 'Pending';
        const isApproved = value.toLowerCase().includes('approv');
        const isBusy = props.actionInProgressId === item.id;

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
            <span style={{
              backgroundColor: isApproved ? '#dcfce7' : '#fef3c7',
              color: isApproved ? '#166534' : '#92400e',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'inline-block'
            }}>
              {value}
            </span>
            {!isApproved && (
              <PrimaryButton
                text="Review & Assign"
                onClick={() => {
                  if (props.onSelectRequestForAssignment) {
                    props.onSelectRequestForAssignment(item);
                  } else if (props.onApproveAsset) {
                    props.onApproveAsset(item).catch(err => console.error(err));
                  }
                }}
                disabled={isBusy}
                styles={{
                  root: { height: '24px', minHeight: '24px', padding: '0 8px', fontSize: '0.75rem', borderRadius: '4px', border: 'none' }
                }}
              />
            )}
          </div>
        );
      }
    } as IColumn] : []),
    ...(props.showResponseColumns ? [
      { key: 'columnManagerResponse', name: 'Manager Response', fieldName: 'managerResponse', minWidth: 170, maxWidth: 240, isResizable: true },
      {
        key: 'columnAdminResponse',
        name: 'Admin Response',
        fieldName: 'assetStatus',
        minWidth: 140,
        maxWidth: 200,
        isResizable: true,
        onRender: (item: IRequest) => {
          const managerStatus = (item.status || '').toLowerCase();
          if (managerStatus === 'pending') {
            return <span style={{ color: '#92400e', fontStyle: 'italic' }}>Waiting on Manager</span>;
          }
          if (managerStatus === 'declined' || managerStatus === 'rejected') {
            return <span style={{ color: '#991b1b', fontStyle: 'italic' }}>N/A (Rejected)</span>;
          }
          const isApproved = (item.assetStatus || '').toLowerCase().includes('approv');
          return isApproved ? (
            <span style={{ color: '#166534', fontWeight: 600 }}>Asset Allocated</span>
          ) : (
            <span style={{ color: '#92400e', fontWeight: 600 }}>Pending Admin Approval</span>
          );
        }
      }
    ] as IColumn[] : []),
    ...(props.canApproveReject ? [{
      key: 'column8',
      name: 'Actions',
      fieldName: 'actions',
      minWidth: 220,
      maxWidth: 260,
      isResizable: true,
      onRender: (item: IRequest) => {
        const isPending = (item.status || '').toLowerCase() === 'pending';
        const isBusy = props.actionInProgressId === item.id;

        if (!isPending) {
          return <span style={{ color: 'var(--text-muted)' }}>No action</span>;
        }

        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <PrimaryButton
              text="Approve"
              onClick={() => props.onApproveRequest && props.onApproveRequest(item)}
              disabled={isBusy}
            />
            <PrimaryButton
              text="Reject"
              onClick={() => {
                if (!props.onRejectRequest) {
                  return;
                }

                const rejectionReason = window.prompt('Enter rejection reason for this request:');
                if (!rejectionReason || !rejectionReason.trim()) {
                  return;
                }

                props.onRejectRequest(item, rejectionReason.trim()).catch(err => console.error(err));
              }}
              disabled={isBusy}
              styles={{
                root: { backgroundColor: '#991b1b', borderColor: '#991b1b' },
                rootHovered: { backgroundColor: '#7f1d1d', borderColor: '#7f1d1d' }
              }}
            />
          </div>
        );
      }
    } as IColumn] : []),
    {
      key: 'columnViewDetails',
      name: 'Details',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      onRender: (item: IRequest) => (
        <DefaultButton
          text="View"
          onClick={() => {
            setSelectedRequestForDetails(item);
            setIsDetailsPanelOpen(true);
          }}
          styles={{
            root: { height: '24px', minHeight: '24px', padding: '0 8px', fontSize: '0.75rem', borderRadius: '4px' }
          }}
        />
      )
    }
  ];

  return (
    <div style={{ marginTop: '10px' }}>
      {props.items.length === 0 ? (
        <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>No asset requests found.</p>
      ) : (
        <DetailsList
          items={props.items}
          columns={columns}
          setKey="set"
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
        />
      )}

      {selectedRequestForDetails && (
        <Panel
          isOpen={isDetailsPanelOpen}
          onDismiss={() => {
            setIsDetailsPanelOpen(false);
            setSelectedRequestForDetails(null);
          }}
          type={PanelType.medium}
          headerText={`Request Details: ${selectedRequestForDetails.requestKey || 'Asset Request'}`}
          closeButtonAriaLabel="Close"
        >
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'inherit' }}>
            
            {/* Request Info Card */}
            <div style={{
              backgroundColor: 'var(--surface-bg, #ffffff)',
              border: '1px solid rgba(128, 128, 128, 0.15)',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: 'var(--card-shadow)'
            }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main, #333333)', borderBottom: '1px solid rgba(128, 128, 128, 0.1)', paddingBottom: '10px' }}>
                Request Information
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>Request ID</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{selectedRequestForDetails.requestKey || 'N/A'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>Request Date</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{selectedRequestForDetails.requestDate}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>Requester</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{selectedRequestForDetails.requesterName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>Employee ID</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{selectedRequestForDetails.employeeId || '-'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>Asset Category</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{selectedRequestForDetails.assetTitle}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>Quantity</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{selectedRequestForDetails.quantity}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>Priority</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{selectedRequestForDetails.priority || 'Medium'}</strong>
                </div>
              </div>
            </div>

            {/* Justification Card */}
            {selectedRequestForDetails.reason && (
              <div style={{
                backgroundColor: 'var(--surface-bg, #ffffff)',
                border: '1px solid rgba(128, 128, 128, 0.15)',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: 'var(--card-shadow)'
              }}>
                <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main, #333333)', marginBottom: '8px' }}>Justification / Reason</span>
                <div style={{
                  backgroundColor: 'rgba(128, 128, 128, 0.05)',
                  border: '1px solid rgba(128, 128, 128, 0.1)',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '0.85rem',
                  color: 'var(--text-main, #333333)',
                  lineHeight: 1.5
                }}>
                  {selectedRequestForDetails.reason}
                </div>
              </div>
            )}

            {/* Manager Approval Status Card */}
            <div style={{
              backgroundColor: 'var(--surface-bg, #ffffff)',
              border: '1px solid rgba(128, 128, 128, 0.15)',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: 'var(--card-shadow)'
            }}>
              <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main, #333333)', marginBottom: '8px' }}>Manager Approval</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{
                  backgroundColor: selectedRequestForDetails.status === 'Approved' ? '#dcfce7' : selectedRequestForDetails.status === 'Declined' ? '#fee2e2' : '#fef3c7',
                  color: selectedRequestForDetails.status === 'Approved' ? '#166534' : selectedRequestForDetails.status === 'Declined' ? '#991b1b' : '#92400e',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  {selectedRequestForDetails.status || 'Pending'}
                </span>
                {selectedRequestForDetails.managerResponse && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted, #666666)' }}>
                    - &ldquo;{selectedRequestForDetails.managerResponse}&rdquo;
                  </span>
                )}
              </div>
            </div>

            {/* Admin Allocation Status Card */}
            <div style={{
              backgroundColor: 'var(--surface-bg, #ffffff)',
              border: '1px solid rgba(128, 128, 128, 0.15)',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: 'var(--card-shadow)'
            }}>
              <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main, #333333)', marginBottom: '8px' }}>Admin Allocation</span>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main, #333333)' }}>
                {selectedRequestForDetails.status === 'Approved' ? (
                  (selectedRequestForDetails.assetStatus || '').toLowerCase().includes('approv') ? (
                    <span style={{ color: '#166534', fontWeight: 600 }}>Asset Allocated & Dispatched ✓</span>
                  ) : (
                    <span style={{ color: '#92400e', fontWeight: 600 }}>Pending physical asset allocation by system administrator</span>
                  )
                ) : selectedRequestForDetails.status === 'Declined' ? (
                  <span style={{ color: '#991b1b' }}>Not applicable (Request was rejected by manager)</span>
                ) : (
                  <span style={{ color: 'var(--text-muted, #666666)', fontStyle: 'italic' }}>Pending manager approval first</span>
                )}
              </div>
            </div>

            {/* Actions in Detail View if applicable */}
            {/* If Manager approval is pending and user canApproveReject is true */}
            {props.canApproveReject && (selectedRequestForDetails.status || '').toLowerCase() === 'pending' && (
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '10px',
                borderTop: '1px solid rgba(128, 128, 128, 0.15)',
                paddingTop: '15px'
              }}>
                <PrimaryButton
                  text={props.actionInProgressId === selectedRequestForDetails.id ? "Processing..." : "Approve"}
                  onClick={() => {
                    if (props.onApproveRequest) {
                      props.onApproveRequest(selectedRequestForDetails)
                        .then(() => {
                          setIsDetailsPanelOpen(false);
                          setSelectedRequestForDetails(null);
                        })
                        .catch(err => console.error(err));
                    }
                  }}
                  disabled={props.actionInProgressId === selectedRequestForDetails.id}
                />
                <DefaultButton
                  text="Reject"
                  onClick={() => {
                    if (!props.onRejectRequest) return;
                    const rejectionReason = window.prompt('Enter rejection reason for this request:');
                    if (!rejectionReason || !rejectionReason.trim()) return;
                    
                    props.onRejectRequest(selectedRequestForDetails, rejectionReason.trim())
                      .then(() => {
                        setIsDetailsPanelOpen(false);
                        setSelectedRequestForDetails(null);
                      })
                      .catch(err => console.error(err));
                  }}
                  disabled={props.actionInProgressId === selectedRequestForDetails.id}
                  styles={{
                    root: { color: '#dc2626', borderColor: '#dc2626' },
                    rootHovered: { color: '#ffffff', backgroundColor: '#dc2626', borderColor: '#dc2626' }
                  }}
                />
              </div>
            )}

            {/* If Admin assignment is pending and user canApproveAsset is true */}
            {props.canApproveAsset && !(selectedRequestForDetails.assetStatus || '').toLowerCase().includes('approv') && (
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '10px',
                borderTop: '1px solid rgba(128, 128, 128, 0.15)',
                paddingTop: '15px'
              }}>
                <PrimaryButton
                  text="Review & Assign"
                  onClick={() => {
                    setIsDetailsPanelOpen(false);
                    setSelectedRequestForDetails(null);
                    if (props.onSelectRequestForAssignment) {
                      props.onSelectRequestForAssignment(selectedRequestForDetails);
                    }
                  }}
                  iconProps={{ iconName: 'CompletedSolid' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <DefaultButton
                text="Close"
                onClick={() => {
                  setIsDetailsPanelOpen(false);
                  setSelectedRequestForDetails(null);
                }}
              />
            </div>

          </div>
        </Panel>
      )}
    </div>
  );
};
