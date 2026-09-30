import * as React from 'react';
import { Panel, PanelType, TextField, PrimaryButton, DefaultButton, Icon, MessageBar, MessageBarType } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import * as strings from 'InventoryManagementWebPartStrings';
import styles from '../components/InventoryManagement.module.scss';
import { IAdminAssignmentPanelProps } from '../types/AdminAssignmentPanel.types';
import { IInventoryItem } from '../models/IInventoryItem';
import { formatString } from '../utils/LocalizationUtils';
import { assignableOfType, assetTypeIcon, conditionTone, warrantyInfo, ageText, formatDay, TONES } from '../components/inventory/inventoryUi';

const CONDITION_RANK: { [c: string]: number } = { new: 0, excellent: 1, good: 2, fair: 3 };

/** Best first: better condition, then the most warranty left, then the newest purchase. */
const rankAssets = (assets: IInventoryItem[]): IInventoryItem[] => assets.slice().sort((a, b) => {
  const ca = CONDITION_RANK[(a.condition || '').toLowerCase()] ?? 4;
  const cb = CONDITION_RANK[(b.condition || '').toLowerCase()] ?? 4;
  if (ca !== cb) return ca - cb;
  const wa = warrantyInfo(a.warrantyExpiry).days ?? -Infinity;
  const wb = warrantyInfo(b.warrantyExpiry).days ?? -Infinity;
  if (wa !== wb) return wb - wa;
  return (new Date(b.purchaseDate || 0).getTime() || 0) - (new Date(a.purchaseDate || 0).getTime() || 0);
});

const pickerCss = mergeStyleSets({
  list: { display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 360, overflowY: 'auto', paddingRight: 2 },
  option: {
    display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', padding: '10px 12px',
    borderRadius: 8, border: '1px solid rgba(0, 0, 0, 0.14)', background: 'var(--surface-bg, #ffffff)',
    cursor: 'pointer', font: 'inherit', color: 'inherit',
    selectors: { ':hover': { borderColor: 'rgba(0, 0, 0, 0.3)' }, ':focus-visible': { outline: '2px solid #0f6cbd', outlineOffset: 2 }, ':disabled': { cursor: 'default', opacity: 0.6 } }
  },
  optionSelected: { borderColor: '#0f6cbd', boxShadow: 'inset 0 0 0 1px #0f6cbd', background: 'rgba(15, 108, 189, 0.05)' },
  radio: { width: 18, height: 18, borderRadius: '50%', border: '2px solid #8a8886', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: '#0f6cbd' },
  radioDot: { width: 8, height: 8, borderRadius: '50%', background: '#0f6cbd' },
  icon: { width: 32, height: 32, borderRadius: 8, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  body: { flex: 1, minWidth: 0 },
  name: { fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  meta: { fontSize: 12, color: 'var(--text-muted, #616161)', marginTop: 2 },
  tag: { fontSize: 11, fontWeight: 600, padding: '0 8px', borderRadius: 999, lineHeight: '18px' }
});

export const AdminAssignmentPanel: React.FC<IAdminAssignmentPanelProps> = (props) => {
  const { state, actions } = props;
  const request = state.selectedAdminRequest;
  if (!request || !state.isAdminPanelOpen) return null;

  const matchingAssets = rankAssets(assignableOfType(state.items, request.assetTitle));
  const quantity = Math.max(1, request.quantity || 1);

  const isBusy = state.requestActionInProgressId === request.id;
  const q = strings.AssignmentQueue;

  const renderAssetPicker = (): JSX.Element => {
    if (matchingAssets.length === 0) {
      return (
        <MessageBar messageBarType={MessageBarType.warning} styles={{ root: { borderRadius: 6 } }}>
          {formatString(q.PanelNoStock, request.assetTitle || '')}
        </MessageBar>
      );
    }
    return (
      <div className={pickerCss.list} role="radiogroup" aria-label={strings.AdminAssignmentPanel.LabelAssignAssetOptional}>
        {matchingAssets.map((asset, index) => {
          const selected = state.adminSelectedAssetId === asset.id;
          const warranty = warrantyInfo(asset.warrantyExpiry);
          const cond = conditionTone(asset.condition);
          return (
            <button
              key={asset.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={isBusy}
              className={`${pickerCss.option} ${selected ? pickerCss.optionSelected : ''}`}
              onClick={() => actions.onAssetChange({} as React.FormEvent<HTMLDivElement>, { key: asset.id, text: asset.assetName || asset.title })}
            >
              <span className={`${pickerCss.radio} ${selected ? pickerCss.radioOn : ''}`} aria-hidden="true">{selected && <span className={pickerCss.radioDot} />}</span>
              <span className={pickerCss.icon} aria-hidden="true"><Icon iconName={assetTypeIcon(asset.assetType)} /></span>
              <span className={pickerCss.body}>
                <span className={pickerCss.name}>
                  {asset.assetName || asset.title}
                  {index === 0 && <span className={pickerCss.tag} style={{ background: TONES.blue.bg, color: TONES.blue.fg }}>{q.Recommended}</span>}
                  {asset.condition && <span className={pickerCss.tag} style={{ background: cond.bg, color: cond.fg }}>{asset.condition}</span>}
                </span>
                <span className={pickerCss.meta} style={{ display: 'block' }}>
                  {[asset.serialNumber, `#${asset.id}`, asset.vendor, asset.purchaseDate ? `${formatDay(asset.purchaseDate)}${ageText(asset.purchaseDate) ? ` (${ageText(asset.purchaseDate)})` : ''}` : ''].filter(Boolean).join('  ·  ')}
                </span>
                <span className={pickerCss.meta} style={{ display: 'block', color: warranty.state === 'active' || warranty.state === 'none' ? undefined : warranty.tone.fg }}>{warranty.text}</span>
              </span>
            </button>
          );
        })}
      </div>
    );
  };

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

            {/* Asset picker: in-stock assets of the requested type, best first */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                {strings.AdminAssignmentPanel.LabelAssignAssetOptional}
              </label>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                {formatString(q.PanelStockLine, matchingAssets.length, request.assetTitle || '', quantity)}
              </span>
              {renderAssetPicker()}
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
