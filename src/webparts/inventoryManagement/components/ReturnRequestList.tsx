import * as React from 'react';
import { useState, useMemo } from 'react';
import { 
  DetailsList, 
  DetailsListLayoutMode, 
  SelectionMode, 
  IColumn 
} from '@fluentui/react/lib/DetailsList';
import { PrimaryButton, DefaultButton, IconButton } from '@fluentui/react/lib/Button';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react/lib/TextField';
import { Stack } from '@fluentui/react/lib/Stack';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { IReturnRequest } from '../models/IReturnRequest';
import { RETURN_CONDITION_OPTIONS } from '../constants/DropdownConstants';

export interface IReturnRequestListProps {
  items: IReturnRequest[];
  isAdmin: boolean;
  isManager: boolean;
  onUpdateStatus: (
    requestId: string, 
    status: 'Approved' | 'Rejected' | 'Completed' | 'Pending Manager Approval' | 'Pending Admin Verification', 
    comment: string, 
    finalCondition?: string,
    adminComments?: string,
    managerStatus?: 'Pending' | 'Approved' | 'Rejected',
    adminStatus?: 'Not Started' | 'Completed'
  ) => Promise<void>;
  loading: boolean;
}

const conditionOptions = RETURN_CONDITION_OPTIONS;

export const ReturnRequestList: React.FC<IReturnRequestListProps> = (props) => {
  const { items, isAdmin, isManager, onUpdateStatus, loading } = props;
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Dialog / State for Actions
  const [activeRequest, setActiveRequest] = useState<IReturnRequest | null>(null);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | 'Complete' | 'View' | null>(null);
  const [comment, setComment] = useState<string>('');
  const [finalCondition, setFinalCondition] = useState<string>('Good');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Search filter and role filter
  const filteredItems = useMemo(() => {
    let roleFiltered = items;
    if (isAdmin) {
      roleFiltered = items.filter(item => item.status === 'Pending Admin Verification');
    } else if (isManager) {
      roleFiltered = items.filter(item => item.status === 'Pending Manager Approval' || item.status === 'Pending');
    }

    if (!searchQuery) return roleFiltered;
    const q = searchQuery.toLowerCase();
    return roleFiltered.filter(item => 
      (item.assetName || '').toLowerCase().includes(q) ||
      (item.serialNumber || '').toLowerCase().includes(q) ||
      (item.requesterName || '').toLowerCase().includes(q) ||
      (item.status || '').toLowerCase().includes(q) ||
      (item.returnReason || '').toLowerCase().includes(q)
    );
  }, [items, searchQuery, isAdmin, isManager]);

  const openDialog = (request: IReturnRequest, type: 'Approve' | 'Reject' | 'Complete' | 'View'): void => {
    setActiveRequest(request);
    setActionType(type);
    setComment('');
    setFinalCondition(request.proposedCondition || 'Good');
  };

  const closeDialog = (): void => {
    setActiveRequest(null);
    setActionType(null);
    setComment('');
    setSubmitting(false);
  };

  const handleAction = async (): Promise<void> => {
    if (!activeRequest || !actionType) return;
    
    if ((actionType === 'Reject' || actionType === 'Complete') && !comment.trim()) {
      alert(actionType === 'Reject' ? 'Please provide a reason/comment for rejection.' : 'Please provide verification comments.');
      return;
    }

    try {
      setSubmitting(true);
      if (actionType === 'Approve') {
        await onUpdateStatus(
          activeRequest.id, 
          'Pending Admin Verification', 
          comment || 'Approved by Manager', 
          undefined, 
          undefined, 
          'Approved', 
          'Not Started'
        );
      } else if (actionType === 'Reject') {
        await onUpdateStatus(
          activeRequest.id, 
          'Rejected', 
          comment, 
          undefined, 
          undefined, 
          'Rejected', 
          'Not Started'
        );
      } else if (actionType === 'Complete') {
        await onUpdateStatus(
          activeRequest.id, 
          'Completed', 
          activeRequest.managerComment || '', 
          finalCondition, 
          comment, 
          'Approved', 
          'Completed'
        );
      }
      closeDialog();
    } catch (e: any) {
      alert('Action failed: ' + (e.message || JSON.stringify(e)));
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyles = (status: string): { bg: string; fg: string } => {
    switch (status) {
      case 'Pending':
      case 'Pending Manager Approval':
        return { bg: '#ffedd5', fg: '#9a3412' }; // Light orange
      case 'Approved':
      case 'Pending Admin Verification':
        return { bg: '#dbeafe', fg: '#1e40af' }; // Light blue
      case 'Rejected':
        return { bg: '#fee2e2', fg: '#991b1b' }; // Light red
      case 'Completed':
        return { bg: '#dcfce7', fg: '#166534' }; // Light green
      default:
        return { bg: '#f3f4f6', fg: '#374151' };
    }
  };

  const columns: IColumn[] = [
    { key: 'id', name: 'ID', fieldName: 'id', minWidth: 50, maxWidth: 80, isResizable: true, onRender: (item: IReturnRequest) => item.id.replace('RR-', '#') },
    { key: 'assetName', name: 'Asset Name', fieldName: 'assetName', minWidth: 100, maxWidth: 150, isResizable: true },
    { key: 'serialNumber', name: 'Serial Number', fieldName: 'serialNumber', minWidth: 90, maxWidth: 120, isResizable: true },
    { key: 'requesterName', name: 'Employee', fieldName: 'requesterName', minWidth: 100, maxWidth: 130, isResizable: true },
    { key: 'returnReason', name: 'Reason', fieldName: 'returnReason', minWidth: 150, maxWidth: 220, isResizable: true, isMultiline: true },
    { key: 'proposedCondition', name: 'Condition', fieldName: 'proposedCondition', minWidth: 80, maxWidth: 110, isResizable: true },
    { 
      key: 'status', 
      name: 'Status', 
      fieldName: 'status', 
      minWidth: 90, 
      maxWidth: 110, 
      isResizable: true,
      onRender: (item: IReturnRequest) => {
        const { bg, fg } = getStatusStyles(item.status);
        return (
          <span style={{ 
            backgroundColor: bg, 
            color: fg, 
            padding: '4px 10px', 
            borderRadius: '9999px', 
            fontSize: '0.75rem', 
            fontWeight: 600,
            display: 'inline-block'
          }}>
            {item.status}
          </span>
        );
      }
    },
    { key: 'requestDate', name: 'Requested Date', fieldName: 'requestDate', minWidth: 90, maxWidth: 120, isResizable: true },
    { 
      key: 'managerComment', 
      name: 'Manager Notes', 
      fieldName: 'managerComment', 
      minWidth: 120, 
      maxWidth: 200, 
      isResizable: true,
      onRender: (item: IReturnRequest) => item.managerComment || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>None</span>
    },
    // Actions Column (Visible to managers/admins)
    ...((isManager || isAdmin) ? [
      {
        key: 'actions',
        name: 'Actions',
        minWidth: 200,
        maxWidth: 260,
        isResizable: true,
        onRender: (item: IReturnRequest) => {
          const viewButton = (
            <DefaultButton
              text="View"
              onClick={() => openDialog(item, 'View')}
              styles={{ root: { height: 26, padding: '4px 8px', fontSize: '0.75rem' } }}
            />
          );

          if (isManager && (item.status === 'Pending Manager Approval' || item.status === 'Pending')) {
            return (
              <Stack horizontal tokens={{ childrenGap: 6 }}>
                {viewButton}
                <PrimaryButton
                  text="Approve"
                  onClick={() => openDialog(item, 'Approve')}
                  styles={{ root: { height: 26, padding: '4px 8px', fontSize: '0.75rem' } }}
                />
                <DefaultButton
                  text="Reject"
                  onClick={() => openDialog(item, 'Reject')}
                  styles={{ root: { height: 26, padding: '4px 8px', fontSize: '0.75rem', color: '#b91c1c', borderColor: '#fee2e2' } }}
                />
              </Stack>
            );
          }

          if (isAdmin && item.status === 'Pending Admin Verification') {
            return (
              <Stack horizontal tokens={{ childrenGap: 6 }}>
                {viewButton}
                <PrimaryButton
                  text="Verify & Complete"
                  onClick={() => openDialog(item, 'Complete')}
                  styles={{ root: { height: 26, padding: '4px 8px', fontSize: '0.75rem', backgroundColor: '#107c41', borderColor: '#107c41' } }}
                />
              </Stack>
            );
          }

          return (
            <Stack horizontal tokens={{ childrenGap: 6 }} verticalAlign="center">
              {viewButton}
            </Stack>
          );
        }
      }
    ] : [])
  ];

  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ marginBottom: '15px' }}>
        <SearchBox
          placeholder="Search return requests..."
          value={searchQuery}
          onChange={(_, val) => setSearchQuery(val || '')}
          styles={{ root: { maxWidth: 350 } }}
        />
      </div>

      {loading ? (
        <p>Loading return requests...</p>
      ) : filteredItems.length === 0 ? (
        <p style={{ fontStyle: 'italic', color: '#6b7280' }}>No return requests found.</p>
      ) : (
        <DetailsList
          items={filteredItems}
          columns={columns}
          setKey="returnSet"
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
        />
      )}

      {/* Confirmation Dialog */}
      <Dialog
        hidden={!activeRequest}
        onDismiss={closeDialog}
        dialogContentProps={{
          type: DialogType.normal,
          title: actionType === 'Approve' ? 'Approve Return Request' :
                 actionType === 'Reject' ? 'Reject Return Request' :
                 actionType === 'Complete' ? 'Verify & Complete Return' : 'Return Request Details',
          subText: activeRequest ? `Request by ${activeRequest.requesterName} for asset ${activeRequest.assetName}` : ''
        }}
        modalProps={{ isBlocking: true }}
      >
        <Stack tokens={{ childrenGap: 15 }} style={{ marginTop: '15px' }}>
          {/* Asset Return Details Card */}
          {activeRequest && (
            <div style={{
              backgroundColor: 'rgba(128, 128, 128, 0.05)',
              border: '1px solid rgba(128, 128, 128, 0.15)',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '0.85rem',
              fontFamily: 'inherit'
            }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main, #333333)', borderBottom: '1px solid rgba(128, 128, 128, 0.1)', paddingBottom: '6px' }}>
                Asset Return Details
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>Request ID</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{activeRequest.id.replace('RR-', '#')}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>Requested Date</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{activeRequest.requestDate}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>Asset Name</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{activeRequest.assetName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>Serial Number</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{activeRequest.serialNumber || 'N/A'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>Employee</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{activeRequest.requesterName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>Proposed Condition</span>
                  <strong style={{ color: 'var(--text-main, #333333)' }}>{activeRequest.proposedCondition}</strong>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>Return Reason</span>
                  <div style={{
                    backgroundColor: 'rgba(128, 128, 128, 0.05)',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    marginTop: '4px',
                    border: '1px solid rgba(128, 128, 128, 0.1)',
                    fontWeight: 500,
                    color: 'var(--text-main, #333333)'
                  }}>
                    {activeRequest.returnReason}
                  </div>
                </div>
                {activeRequest.managerComment && (
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' }}>Manager Notes</span>
                    <div style={{
                      backgroundColor: 'rgba(128, 128, 128, 0.05)',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      marginTop: '4px',
                      border: '1px solid rgba(128, 128, 128, 0.1)',
                      fontWeight: 500,
                      color: 'var(--text-main, #333333)'
                    }}>
                      {activeRequest.managerComment}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 
            REDUNDANT / REVIEW-ONLY: This condition selection is part of the secondary 
            check-in step, which is now redundant. Retained for review only.
          */}
          {actionType === 'Complete' && (
            <Dropdown
              label="Final Verified Condition"
              selectedKey={finalCondition}
              options={conditionOptions}
              onChange={(_, opt) => setFinalCondition(opt ? (opt.key as string) : 'Good')}
            />
          )}

          {actionType !== 'View' && (
            <TextField
              label={
                actionType === 'Reject' ? 'Rejection Reason (Required)' : 
                actionType === 'Complete' ? 'Verification Comments (Required)' : 
                'Manager Comments'
              }
              placeholder={
                actionType === 'Reject' ? 'Please specify why this return request is being rejected...' : 
                actionType === 'Complete' ? 'Please enter verification details (required)...' : 
                'Add comments for the return request...'
              }
              multiline
              rows={3}
              value={comment}
              onChange={(_, val) => setComment(val || '')}
              required={actionType === 'Reject' || actionType === 'Complete'}
            />
          )}
        </Stack>

        <DialogFooter>
          {actionType !== 'View' ? (
            <>
              <PrimaryButton 
                text={actionType === 'Approve' ? 'Approve' :
                      actionType === 'Reject' ? 'Reject' : 'Verify & Complete'} 
                onClick={handleAction} 
                disabled={submitting || ((actionType === 'Reject' || actionType === 'Complete') && !comment.trim())} 
              />
              <DefaultButton text="Cancel" onClick={closeDialog} disabled={submitting} />
            </>
          ) : (
            <PrimaryButton text="Close" onClick={closeDialog} />
          )}
        </DialogFooter>
      </Dialog>
    </div>
  );
};
