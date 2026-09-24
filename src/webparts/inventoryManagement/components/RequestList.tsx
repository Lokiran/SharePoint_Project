import * as React from 'react';
import { useState } from 'react';
import { IRequest } from '../models/IRequest';
import { IInventoryItem } from '../models/IInventoryItem';
import { 
  DetailsList, 
  DetailsListLayoutMode, 
  SelectionMode, 
  IColumn
} from '@fluentui/react/lib/DetailsList';
import { PrimaryButton, DefaultButton, Panel, PanelType } from '@fluentui/react';
import styles from './InventoryManagement.module.scss';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../utils/LocalizationUtils';
import { getAssetRequestStatusDisplayText } from '../utils/RequestStatusUtils';

export interface IRequestListProps {
  items: IRequest[];
  inventoryItems?: IInventoryItem[];
  canApproveReject?: boolean;
  canApproveAsset?: boolean;
  showResponseColumns?: boolean;
  statusColumnLabel?: string;
  statusField?: 'status' | 'assetStatus';
  hideStatusColumn?: boolean;
  onApproveRequest?: (request: IRequest, comment?: string) => Promise<void>;
  onRejectRequest?: (request: IRequest, reason: string) => Promise<void>;
  onApproveAsset?: (request: IRequest) => Promise<void>;
  onSelectRequestForAssignment?: (request: IRequest) => void;
  actionInProgressId?: string;
}

export const RequestList: React.FC<IRequestListProps> = (props) => {
  const [selectedRequestForDetails, setSelectedRequestForDetails] = useState<IRequest | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState<boolean>(false);

  const sortedItems = React.useMemo(() => {
    return [...props.items].sort((a, b) => {
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
  }, [props.items]);

  const getStatusDisplayText = getAssetRequestStatusDisplayText;

  const columns: IColumn[] = [
    {
      key: 'columnRequestKey',
      name: strings.Columns.RequestId,
      fieldName: 'requestKey',
      minWidth: 90,
      maxWidth: 125,
      isResizable: true
    },
    {
      key: 'columnEmployeeName',
      name: strings.Columns.EmployeeName,
      fieldName: 'requesterName',
      minWidth: 100,
      maxWidth: 150,
      isResizable: true
    },
    {
      key: 'columnManagerName',
      name: strings.Columns.ManagerName,
      fieldName: 'managerName',
      minWidth: 110,
      maxWidth: 140,
      isResizable: true,
      onRender: (item: IRequest) => item.managerName || strings.Common.NotAvailable
    },
    {
      key: 'columnAssetType',
      name: strings.Columns.AssetType,
      fieldName: 'assetTitle',
      minWidth: 100,
      maxWidth: 120,
      isResizable: true
    },
    {
      key: 'columnPriority',
      name: strings.Columns.Priority,
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
      name: props.statusColumnLabel || strings.Columns.Status,
      fieldName: props.statusField || 'status',
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
      onRender: (item: IRequest) => {
        const val: string = item[props.statusField || 'status'] || 'Pending';

        let backgroundColor = '#fef3c7'; // default pending (yellow)
        let textColor = '#92400e';
        let displayVal = strings.RequestList.StatusPendingManagerApproval;

        if (val === 'Approved by Manager' || val === 'Approved') {
          backgroundColor = '#e0f2fe';
          textColor = '#0369a1';
          displayVal = strings.Dropdowns.AssetRequestStatus.ApprovedByManager;
        } else if (val === 'Asset Assigned') {
          backgroundColor = '#dcfce7';
          textColor = '#166534';
          displayVal = strings.Dropdowns.AssetRequestStatus.AssetAssigned;
        } else if (val === 'Rejected' || val === 'Declined') {
          backgroundColor = '#fee2e2';
          textColor = '#991b1b';
          displayVal = strings.Dropdowns.AssetRequestStatus.Rejected;
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
            {displayVal}
          </span>
        );
      }
    } as IColumn]),
    {
      key: 'columnManagerComment',
      name: strings.Columns.ManagerComment,
      fieldName: 'managerResponse',
      minWidth: 150,
      maxWidth: 220,
      isResizable: true,
      onRender: (item: IRequest) => {
        if (!item.managerResponse) return <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>-</span>;
        const isDeclined = item.status === 'Declined';
        return (
          <span style={{ color: isDeclined ? '#991b1b' : 'inherit', fontWeight: isDeclined ? 600 : 400 }}>
            {item.managerResponse}
          </span>
        );
      }
    },
    ...(props.canApproveAsset ? [{
      key: 'columnAssetStatus',
      name: strings.Columns.AssetStatus,
      fieldName: 'assetStatus',
      minWidth: 200,
      maxWidth: 260,
      isResizable: true,
      onRender: (item: IRequest) => {
        const value = item.assetStatus || 'Pending';
        const isApproved = value.toLowerCase().includes('approv');
        const isBusy = props.actionInProgressId === item.id;
        const displayValue = isApproved ? strings.Dropdowns.AuditLogStatus.Approved : strings.Dropdowns.AuditLogStatus.Pending;

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
              {displayValue}
            </span>
            {!isApproved && (
              <PrimaryButton
                text={strings.RequestList.ButtonReviewAssign}
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
      {
        key: 'columnAdminResponse',
        name: strings.Columns.AdminResponse,
        fieldName: 'assetStatus',
        minWidth: 140,
        maxWidth: 200,
        isResizable: true,
        onRender: (item: IRequest) => {
          const managerStatus = (item.status || '').toLowerCase();
          if (managerStatus.includes('pending')) {
            return <span style={{ color: '#92400e', fontStyle: 'italic' }}>{strings.RequestList.AdminResponseWaitingOnManager}</span>;
          }
          if (managerStatus === 'declined' || managerStatus === 'rejected') {
            return <span style={{ color: '#991b1b', fontStyle: 'italic' }}>{strings.RequestList.AdminResponseRejected}</span>;
          }
          const isApproved = (item.assetStatus || '').toLowerCase().includes('approv') || managerStatus === 'asset assigned';
          return isApproved ? (
            <span style={{ color: '#166534', fontWeight: 600 }}>{strings.RequestList.AdminResponseAllocated}</span>
          ) : (
            <span style={{ color: '#92400e', fontWeight: 600 }}>{strings.RequestList.AdminResponsePendingApproval}</span>
          );
        }
      }
    ] as IColumn[] : []),
    ...(props.canApproveReject ? [{
      key: 'column8',
      name: strings.Columns.Actions,
      fieldName: 'actions',
      minWidth: 220,
      maxWidth: 260,
      isResizable: true,
      onRender: (item: IRequest) => {
        const isPending = (item.status || '').toLowerCase().includes('pending');
        const isBusy = props.actionInProgressId === item.id;

        if (!isPending) {
          return <span style={{ color: 'var(--text-muted)' }}>{strings.RequestList.NoAction}</span>;
        }

        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <PrimaryButton
              text={strings.Common.Approve}
              onClick={() => props.onApproveRequest && props.onApproveRequest(item)}
              disabled={isBusy}
            />
            <PrimaryButton
              text={strings.Common.Reject}
              onClick={() => {
                if (!props.onRejectRequest) {
                  return;
                }

                const rejectionReason = window.prompt(strings.RequestList.RejectionPrompt);
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
      name: strings.Common.Details,
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      onRender: (item: IRequest) => (
        <DefaultButton
          text={strings.Common.View}
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
      {sortedItems.length === 0 ? (
        <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>{strings.RequestList.EmptyState}</p>
      ) : (
        <div className={styles.tableWrapper}>
          <DetailsList
            items={sortedItems}
            columns={columns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
          />
        </div>
      )}

      {selectedRequestForDetails && (
        <Panel
          isOpen={isDetailsPanelOpen}
          onDismiss={() => {
            setIsDetailsPanelOpen(false);
            setSelectedRequestForDetails(null);
          }}
          type={PanelType.medium}
          headerText={formatString(strings.RequestList.DetailsHeaderPrefix, selectedRequestForDetails.requestKey || strings.RequestList.DetailsHeaderFallback)}
          closeButtonAriaLabel={strings.Common.Close}
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
                {strings.RequestList.SectionRequestInformation}
              </h4>
              <div className={styles.responsiveGridGap16} style={{ fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>{strings.Columns.RequestId}</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{selectedRequestForDetails.requestKey || strings.Common.NotAvailable}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>{strings.RequestList.LabelRequestDate}</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{selectedRequestForDetails.requestDate}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>{strings.WorkflowPopup.LabelRequester}</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{selectedRequestForDetails.requesterName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>{strings.RequestForm.LabelEmployeeId}</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{selectedRequestForDetails.employeeId || '-'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>{strings.Columns.ManagerName}</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{selectedRequestForDetails.managerName || '-'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>{strings.RequestList.LabelAssetCategory}</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{selectedRequestForDetails.assetTitle}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>{strings.RequestForm.LabelQuantity}</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{selectedRequestForDetails.quantity}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>{strings.Columns.Priority}</span>
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
                <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main, #333333)', marginBottom: '8px' }}>{strings.RequestList.SectionJustification}</span>
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
              <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main, #333333)', marginBottom: '8px' }}>{strings.RequestList.SectionManagerApproval}</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{
                  backgroundColor: (selectedRequestForDetails.status === 'Approved' || selectedRequestForDetails.status === 'Approved by Manager' || selectedRequestForDetails.status === 'Asset Assigned') ? '#dcfce7' : (selectedRequestForDetails.status === 'Declined' || selectedRequestForDetails.status === 'Rejected') ? '#fee2e2' : '#fef3c7',
                  color: (selectedRequestForDetails.status === 'Approved' || selectedRequestForDetails.status === 'Approved by Manager' || selectedRequestForDetails.status === 'Asset Assigned') ? '#166534' : (selectedRequestForDetails.status === 'Declined' || selectedRequestForDetails.status === 'Rejected') ? '#991b1b' : '#92400e',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  {getStatusDisplayText(selectedRequestForDetails.status)}
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
              <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main, #333333)', marginBottom: '8px' }}>{strings.RequestList.SectionAdminAllocation}</span>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main, #333333)' }}>
                {(selectedRequestForDetails.status === 'Approved' || selectedRequestForDetails.status === 'Approved by Manager' || selectedRequestForDetails.status === 'Asset Assigned') ? (
                  ((selectedRequestForDetails.assetStatus || '').toLowerCase().includes('approv') || selectedRequestForDetails.status === 'Asset Assigned') ? (
                    <span style={{ color: '#166534', fontWeight: 600 }}>{strings.RequestList.AllocationAllocated}</span>
                  ) : (
                    <span style={{ color: '#92400e', fontWeight: 600 }}>{strings.RequestList.AllocationPendingAdmin}</span>
                  )
                ) : (selectedRequestForDetails.status === 'Declined' || selectedRequestForDetails.status === 'Rejected') ? (
                  <span style={{ color: '#991b1b' }}>{strings.RequestList.AllocationNotApplicable}</span>
                ) : (
                  <span style={{ color: 'var(--text-muted, #666666)', fontStyle: 'italic' }}>{strings.RequestList.AllocationPendingManager}</span>
                )}
              </div>
            </div>

            {/* Actions in Detail View if applicable */}
            {/* If Manager approval is pending and user canApproveReject is true */}
            {props.canApproveReject && (selectedRequestForDetails.status || '').toLowerCase().includes('pending') && (
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '10px',
                borderTop: '1px solid rgba(128, 128, 128, 0.15)',
                paddingTop: '15px'
              }}>
                <PrimaryButton
                  text={props.actionInProgressId === selectedRequestForDetails.id ? strings.Common.Processing : strings.Common.Approve}
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
                  text={strings.Common.Reject}
                  onClick={() => {
                    if (!props.onRejectRequest) return;
                    const rejectionReason = window.prompt(strings.RequestList.RejectionPrompt);
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
                  text={strings.RequestList.ButtonReviewAssign}
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
                text={strings.Common.Close}
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
