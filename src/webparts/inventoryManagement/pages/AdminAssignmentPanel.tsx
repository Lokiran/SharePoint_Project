import * as React from 'react';
import { Panel, PanelType, Dropdown, IDropdownOption, TextField, PrimaryButton, DefaultButton } from '@fluentui/react';
import * as strings from 'InventoryManagementWebPartStrings';
import styles from '../components/InventoryManagement.module.scss';
import { IAdminAssignmentPanelProps } from '../types/AdminAssignmentPanel.types';

export const AdminAssignmentPanel: React.FC<IAdminAssignmentPanelProps> = (props) => {
  const { state, actions } = props;
  const request = state.selectedAdminRequest;
  if (!request || !state.isAdminPanelOpen) return null;

  const requestedAssetTitle = request.assetTitle || "";
  const matchingAssets = state.items.filter(item =>
    (item.assetType || '').toLowerCase() === requestedAssetTitle.toLowerCase() &&
    (item.status === 'In Stock' || item.status === 'Yes' || (item.status || '').toLowerCase() === 'in stock')
  );

  const matchingAssetOptions: IDropdownOption[] = matchingAssets.map(asset => ({
    key: asset.id,
    text: `${asset.assetName || asset.title} (SN: ${asset.serialNumber || 'N/A'})`
  }));

  const dropdownPlaceholder = matchingAssets.length > 0
    ? strings.AdminAssignmentPanel.PlaceholderSelectAsset
    : strings.AdminAssignmentPanel.PlaceholderNoAssetsInStock;

  const isBusy = state.requestActionInProgressId === request.id;

  return (
    <Panel
      isOpen={state.isAdminPanelOpen}
      onDismiss={actions.onDismiss}
      type={PanelType.medium}
      headerText={`${strings.AdminAssignmentPanel.RequestHeaderPrefix}${request.requestKey || request.id}`}
      closeButtonAriaLabel="Close"
    >
      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'inherit' }}>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 10px 0' }}>
          {strings.AdminAssignmentPanel.SubHeader}
        </p>

        {/* Request Information Card */}
        <div style={{
          backgroundColor: 'var(--surface-bg)',
          border: '1px solid rgba(128, 128, 128, 0.15)',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: 'var(--card-shadow)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(128, 128, 128, 0.1)', paddingBottom: '10px' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{strings.AdminAssignmentPanel.RequestInfoTitle}</h4>
            <span style={{
              backgroundColor: '#fef3c7',
              color: '#d97706',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: '4px'
            }}>
              {strings.AdminAssignmentPanel.BadgePendingAdmin}
            </span>
          </div>
          <div className={styles.responsiveGridGap16} style={{ fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>{strings.AdminAssignmentPanel.LabelCategory}</span>
              <strong style={{ color: 'var(--text-main)' }}>{request.assetTitle}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>{strings.AdminAssignmentPanel.LabelQuantity}</span>
              <strong style={{ color: 'var(--text-main)' }}>{request.quantity}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>{strings.AdminAssignmentPanel.LabelUrgency}</span>
              <strong style={{ color: 'var(--text-main)' }}>{request.priority || 'Medium'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>{strings.AdminAssignmentPanel.LabelSubmitted}</span>
              <strong style={{ color: 'var(--text-main)' }}>{request.requestDate}</strong>
            </div>
          </div>
          {request.reason && (
            <div style={{ marginTop: '16px' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontSize: '0.85rem' }}>{strings.AdminAssignmentPanel.LabelJustification}</span>
              <div style={{
                backgroundColor: state.isDarkTheme ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                border: '1px solid rgba(128, 128, 128, 0.1)',
                borderRadius: '6px',
                padding: '12px',
                fontSize: '0.85rem',
                color: 'var(--text-main)',
                lineHeight: 1.5
              }}>
                {request.reason}
              </div>
            </div>
          )}
        </div>

        {/* Approval Trail Card */}
        <div style={{
          backgroundColor: 'var(--surface-bg)',
          border: '1px solid rgba(128, 128, 128, 0.15)',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: 'var(--card-shadow)'
        }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', borderBottom: '1px solid rgba(128, 128, 128, 0.1)', paddingBottom: '10px' }}>
            {strings.AdminAssignmentPanel.ApprovalTrailTitle}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.85rem' }}>
            {/* Step 1: Submitted */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981', border: '2px solid var(--surface-bg)', boxShadow: '0 0 0 2px #10b981' }} />
                <div style={{ width: '2px', flexGrow: 1, backgroundColor: '#10b981', minHeight: '20px', marginTop: '4px' }} />
              </div>
              <div>
                <strong style={{ color: 'var(--text-main)', display: 'block' }}>{strings.AdminAssignmentPanel.StepSubmitted}</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{request.requestDate}</span>
              </div>
            </div>

            {/* Step 2: Manager Review */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981', border: '2px solid var(--surface-bg)', boxShadow: '0 0 0 2px #10b981' }} />
                <div style={{ width: '2px', flexGrow: 1, backgroundColor: 'rgba(128, 128, 128, 0.25)', minHeight: '20px', marginTop: '4px' }} />
              </div>
              <div>
                <strong style={{ color: 'var(--text-main)', display: 'block' }}>{strings.AdminAssignmentPanel.StepManagerReview}</strong>
                <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', display: 'block', marginTop: '2px', fontSize: '0.8rem' }}>
                  &ldquo;{request.managerResponse || strings.AdminAssignmentPanel.ManagerReviewDefaultQuote}&rdquo;
                </span>
              </div>
            </div>

            {/* Step 3: Admin Assignment */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6', border: '2px solid var(--surface-bg)', boxShadow: '0 0 0 2px #3b82f6' }} />
              </div>
              <div>
                <strong style={{ color: 'var(--text-main)', display: 'block' }}>{strings.AdminAssignmentPanel.StepAdminAssignment}</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{strings.AdminAssignmentPanel.AwaitingAllocation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Assignment Card */}
        <div style={{
          backgroundColor: state.isDarkTheme ? 'rgba(59, 130, 246, 0.05)' : 'rgba(37, 99, 235, 0.03)',
          border: '1px solid rgba(37, 99, 235, 0.15)',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: 'var(--card-shadow)'
        }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {strings.AdminAssignmentPanel.AdminAssignmentTitle}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Dropdown */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                {strings.AdminAssignmentPanel.LabelAssignAssetOptional}
              </label>
              <Dropdown
                placeholder={dropdownPlaceholder}
                options={matchingAssetOptions}
                selectedKey={state.adminSelectedAssetId}
                onChange={actions.onAssetChange}
                disabled={matchingAssets.length === 0 || isBusy}
                styles={{ dropdown: { width: '100%' } }}
              />
            </div>

            {/* Comment Textfield */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                {strings.AdminAssignmentPanel.LabelComment}
              </label>
              <TextField
                multiline
                rows={4}
                placeholder={strings.AdminAssignmentPanel.PlaceholderComment}
                value={state.adminComment}
                onChange={(_, value) => actions.onCommentChange(value || '')}
                disabled={isBusy}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <PrimaryButton
                text={isBusy ? strings.AdminAssignmentPanel.ButtonProcessing : strings.AdminAssignmentPanel.ButtonAssignApprove}
                onClick={actions.onAssignAndApprove}
                disabled={isBusy}
                iconProps={{ iconName: 'CompletedSolid' }}
              />
              <DefaultButton
                text={strings.AdminAssignmentPanel.ButtonReject}
                onClick={actions.onReject}
                disabled={isBusy}
                iconProps={{ iconName: 'Cancel' }}
                styles={{
                  root: { color: '#dc2626', borderColor: '#dc2626' },
                  rootHovered: { color: '#ffffff', backgroundColor: '#dc2626', borderColor: '#dc2626' }
                }}
              />
            </div>

          </div>
        </div>

      </div>
    </Panel>
  );
};
