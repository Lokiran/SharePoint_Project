import * as React from 'react';
import { Stack, Icon, MessageBar, MessageBarType, ProgressIndicator } from '@fluentui/react';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../utils/LocalizationUtils';
import styles from '../components/InventoryManagement.module.scss';
import { IRequestAnalysisPanelProps } from '../types/RequestAnalysis.types';

export const RequestAnalysisPanel: React.FC<IRequestAnalysisPanelProps> = ({ request, items }) => {
  const reqAssetTitle = request.assetTitle || "";
  const inStockItems = items.filter(item =>
    (item.assetType || '').toLowerCase() === reqAssetTitle.toLowerCase() &&
    (item.status === 'In Stock' || item.status === 'Yes' || (item.status || '').toLowerCase() === 'in stock')
  );
  const inStockCount = inStockItems.length;
  const isSufficient = inStockCount >= request.quantity;

  let progressPercent = 0.33;
  let currentStepText = strings.RequestAnalysis.StepSubmittedPending;
  if (request.status === 'Approved') {
    progressPercent = 0.66;
    currentStepText = strings.RequestAnalysis.StepManagerApproved;
    if (request.assetStatus === 'Approved') {
      progressPercent = 1.0;
      currentStepText = strings.RequestAnalysis.StepCompleted;
    }
  } else if (request.status === 'Declined') {
    progressPercent = 1.0;
    currentStepText = strings.RequestAnalysis.StepDeclined;
  }

  return (
    <Stack tokens={{ childrenGap: 20 }}>
      {/* Request Overview */}
      <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>{strings.RequestAnalysis.OverviewTitle}</h4>
        <div className={styles.responsiveGrid} style={{ fontSize: '0.88rem' }}>
          <div><span style={{ color: '#6b7280' }}>{strings.RequestAnalysis.LabelRequestKey}</span> <strong style={{ color: '#111827' }}>{request.requestKey}</strong></div>
          <div><span style={{ color: '#6b7280' }}>{strings.RequestAnalysis.LabelRequestedAsset}</span> <strong style={{ color: '#111827' }}>{request.assetTitle}</strong></div>
          <div><span style={{ color: '#6b7280' }}>{strings.RequestAnalysis.LabelQuantity}</span> <strong style={{ color: '#111827' }}>{request.quantity}</strong></div>
          <div><span style={{ color: '#6b7280' }}>{strings.RequestAnalysis.LabelPriority}</span> <strong style={{ color: '#111827' }}>{request.priority}</strong></div>
          <div><span style={{ color: '#6b7280' }}>{strings.RequestAnalysis.LabelRequesterName}</span> <strong style={{ color: '#111827' }}>{request.requesterName}</strong></div>
          <div><span style={{ color: '#6b7280' }}>{strings.RequestAnalysis.LabelEmployeeId}</span> <strong style={{ color: '#111827' }}>{request.employeeId || "N/A"}</strong></div>
          <div><span style={{ color: '#6b7280' }}>{strings.RequestAnalysis.LabelRequestDate}</span> <strong style={{ color: '#111827' }}>{request.requestDate}</strong></div>
          <div><span style={{ color: '#6b7280' }}>{strings.RequestAnalysis.LabelRequestStatus}</span> <strong style={{ color: request.status === 'Approved' ? '#16a34a' : request.status === 'Declined' ? '#dc2626' : '#ea580c' }}>{request.status}</strong></div>
        </div>
        {request.reason && (
          <div style={{ marginTop: '12px', fontSize: '0.88rem', padding: '8px 10px', backgroundColor: '#f9fafb', borderRadius: '4px', border: '1px solid #f3f4f6' }}>
            <span style={{ color: '#6b7280', display: 'block', marginBottom: '2px' }}>{strings.RequestAnalysis.LabelReasonForRequest}</span>
            <span style={{ color: '#374151' }}>{request.reason}</span>
          </div>
        )}
        {request.managerResponse && (
          <div style={{ marginTop: '12px', fontSize: '0.88rem', padding: '8px 10px', backgroundColor: '#f0fdf4', borderRadius: '4px', border: '1px solid #dcfce7' }}>
            <span style={{ color: '#15803d', display: 'block', marginBottom: '2px' }}>{strings.RequestAnalysis.LabelManagerResponse}</span>
            <span style={{ color: '#166534' }}>{request.managerResponse}</span>
          </div>
        )}
      </div>

      {/* Detailed Analysis */}
      <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon iconName="BarChart4" style={{ color: '#0078d4' }} /> {strings.RequestAnalysis.DetailedAnalysisTitle}
        </h4>

        <Stack tokens={{ childrenGap: 12 }}>
          {/* Inventory Status Check */}
          <div>
            <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' }}>{strings.RequestAnalysis.InventoryCheckLabel}</span>
            {isSufficient ? (
              <MessageBar messageBarType={MessageBarType.success} styles={{ root: { borderRadius: '6px' } }}>
                <strong>{strings.RequestAnalysis.InventoryCheckPassedBold}</strong> {strings.RequestAnalysis.InventoryCheckPassedBefore} <strong>{inStockCount}</strong> {strings.RequestAnalysis.InventoryCheckPassedMiddle} <strong>{reqAssetTitle}</strong> {strings.RequestAnalysis.InventoryCheckPassedAfter}
              </MessageBar>
            ) : (
              <MessageBar messageBarType={MessageBarType.warning} styles={{ root: { borderRadius: '6px' } }}>
                <strong>{strings.RequestAnalysis.InventoryWarningBold}</strong> {strings.RequestAnalysis.InventoryWarningBefore} <strong>{inStockCount}</strong> {strings.RequestAnalysis.InventoryWarningMiddle} <strong>{reqAssetTitle}</strong> {strings.RequestAnalysis.InventoryWarningAfter}
              </MessageBar>
            )}
          </div>

          {/* Smart recommendation */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
            <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>{strings.RequestAnalysis.StrategicRecommendationLabel}</span>
            <div style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', lineHeight: '1.4', color: '#334155' }}>
              {request.status === 'Pending' ? (
                isSufficient ? (
                  <span><strong>{strings.RequestAnalysis.RecommendedActionBold}</strong> {strings.RequestAnalysis.RecommendationApproveSufficient}</span>
                ) : (
                  <span><strong>{strings.RequestAnalysis.RecommendedActionBold}</strong> {strings.RequestAnalysis.RecommendationHoldBefore}{inStockCount}{strings.RequestAnalysis.RecommendationHoldAfter}</span>
                )
              ) : request.status === 'Approved' && request.assetStatus === 'Pending' ? (
                <span><strong>{strings.RequestAnalysis.RecommendedActionBold}</strong> {strings.RequestAnalysis.RecommendationAssignBefore} <strong>{strings.RequestAnalysis.RecommendationAssignQueueLabel}</strong> {strings.RequestAnalysis.RecommendationAssignMiddle} <strong>{inStockCount}</strong> {formatString(strings.RequestAnalysis.RecommendationAssignAfter, reqAssetTitle, request.requesterName)}</span>
              ) : request.status === 'Approved' && request.assetStatus === 'Approved' ? (
                <span><strong>{strings.RequestAnalysis.LifecycleCompleteBold}</strong> {strings.RequestAnalysis.LifecycleCompleteText}</span>
              ) : (
                <span><strong>{strings.RequestAnalysis.ClosedBold}</strong> {strings.RequestAnalysis.ClosedText}</span>
              )}
            </div>
          </div>

          {/* Lifecycle Timeline Tracker */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
            <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' }}>{strings.RequestAnalysis.LifecycleStageLabel}</span>
            <ProgressIndicator
              label={currentStepText}
              percentComplete={progressPercent}
              styles={{ root: { marginTop: '5px' } }}
            />
          </div>
        </Stack>
      </div>
    </Stack>
  );
};
