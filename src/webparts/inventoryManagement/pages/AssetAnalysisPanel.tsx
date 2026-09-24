import * as React from 'react';
import { Stack, Icon, MessageBar, MessageBarType } from '@fluentui/react';
import * as strings from 'InventoryManagementWebPartStrings';
import styles from '../components/InventoryManagement.module.scss';
import { getWarrantyColorInfo, getAssetLifecycleInfo } from '../utils/WarrantyUtils';
import { IAssetAnalysisPanelProps } from '../types/AssetAnalysis.types';

export const AssetAnalysisPanel: React.FC<IAssetAnalysisPanelProps> = ({ asset }) => {
  const lifecycleInfo = getAssetLifecycleInfo(asset.purchaseDate);
  const warrantyInfo = getWarrantyColorInfo(asset.warrantyExpiry);

  let conditionColor = '#16a34a';
  let healthRating = strings.AssetAnalysis.HealthExcellent;
  let healthIcon = "Heart";
  if (asset.condition === 'Fair') {
    conditionColor = '#ea580c';
    healthRating = strings.AssetAnalysis.HealthFair;
    healthIcon = "IncidentTriangle";
  } else if (asset.condition === 'Poor' || asset.condition === 'Damaged') {
    conditionColor = '#dc2626';
    healthRating = strings.AssetAnalysis.HealthCritical;
    healthIcon = "Warning";
  }

  return (
    <Stack tokens={{ childrenGap: 20 }}>
      {/* Asset Overview */}
      <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>{strings.AssetAnalysis.SpecificationsTitle}</h4>
        <div className={styles.responsiveGrid} style={{ fontSize: '0.88rem' }}>
          <div><span style={{ color: '#6b7280' }}>{strings.AssetAnalysis.LabelAssetName}</span> <strong style={{ color: '#111827' }}>{asset.assetName || asset.title}</strong></div>
          <div><span style={{ color: '#6b7280' }}>{strings.AssetAnalysis.LabelSerialNumber}</span> <strong style={{ color: '#111827' }}>{asset.serialNumber}</strong></div>
          <div><span style={{ color: '#6b7280' }}>{strings.AssetAnalysis.LabelAssetType}</span> <strong style={{ color: '#111827' }}>{asset.assetType}</strong></div>
          <div><span style={{ color: '#6b7280' }}>{strings.AssetAnalysis.LabelCurrentStatus}</span> <strong style={{ color: '#111827' }}>{asset.status}</strong></div>
          <div><span style={{ color: '#6b7280' }}>{strings.AssetAnalysis.LabelCondition}</span> <strong style={{ color: conditionColor }}>{asset.condition || "New"}</strong></div>
          <div><span style={{ color: '#6b7280' }}>{strings.AssetAnalysis.LabelVendor}</span> <strong style={{ color: '#111827' }}>{asset.vendor || "N/A"}</strong></div>
          <div><span style={{ color: '#6b7280' }}>{strings.AssetAnalysis.LabelPurchaseDate}</span> <strong style={{ color: '#111827' }}>{asset.purchaseDate || "N/A"}</strong></div>
          <div><span style={{ color: '#6b7280' }}>{strings.AssetAnalysis.LabelWarrantyExpiry}</span> <strong style={{ color: warrantyInfo.textColor, backgroundColor: asset.warrantyExpiry ? warrantyInfo.bgColor : 'transparent', padding: asset.warrantyExpiry ? '2px 8px' : 0, borderRadius: '4px' }}>{asset.warrantyExpiry || "N/A"}</strong></div>
        </div>
        {asset.note && (
          <div style={{ marginTop: '12px', fontSize: '0.88rem', padding: '8px 10px', backgroundColor: '#f9fafb', borderRadius: '4px', border: '1px solid #f3f4f6' }}>
            <span style={{ color: '#6b7280', display: 'block', marginBottom: '2px' }}>{strings.AssetAnalysis.LabelAssetNotes}</span>
            <span style={{ color: '#374151' }}>{asset.note}</span>
          </div>
        )}
      </div>

      {/* Detailed Analysis */}
      <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon iconName="Heart" style={{ color: conditionColor }} /> {strings.AssetAnalysis.DetailedAnalysisTitle}
        </h4>

        <Stack tokens={{ childrenGap: 12 }}>
          {/* Lifecycle & Age evaluation */}
          <div>
            <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>{strings.AssetAnalysis.LifecycleEolLabel}</span>
            <span style={{ fontSize: '0.9rem', color: '#334155' }}>
              {lifecycleInfo.statusText}. {strings.AssetAnalysis.LifecyclePurchaseDatePrefix} <strong>{lifecycleInfo.purchaseDateFormatted}</strong> | {strings.AssetAnalysis.LifecycleEolDatePrefix} <strong>{lifecycleInfo.eolDateFormatted || 'N/A'}</strong>.
            </span>
          </div>

          {/* Warranty alert */}
          <div>
            <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' }}>{strings.AssetAnalysis.WarrantyEvaluationLabel}</span>
            {asset.warrantyExpiry ? (
              warrantyInfo.isExpired ? (
                <MessageBar messageBarType={MessageBarType.error} styles={{ root: { borderRadius: '6px' } }}>
                  <strong>{strings.AssetAnalysis.WarrantyExpiredBold}</strong> {strings.AssetAnalysis.WarrantyExpiredBefore} <strong>{warrantyInfo.formattedDate}</strong> ({warrantyInfo.remainingText}). {strings.AssetAnalysis.WarrantyExpiredAfter}
                </MessageBar>
              ) : warrantyInfo.isLessThan6Months ? (
                <MessageBar messageBarType={MessageBarType.error} styles={{ root: { borderRadius: '6px' } }}>
                  <strong>{strings.AssetAnalysis.WarrantyExpiringSoonBold}</strong> {strings.AssetAnalysis.WarrantyExpiringSoonBefore} <strong>{warrantyInfo.formattedDate}</strong> ({warrantyInfo.remainingText}). {strings.AssetAnalysis.WarrantyExpiringSoonAfter}
                </MessageBar>
              ) : warrantyInfo.isLessThan1Year ? (
                <MessageBar messageBarType={MessageBarType.warning} styles={{ root: { borderRadius: '6px' } }}>
                  <strong>{strings.AssetAnalysis.WarrantyExpiring1YearBold}</strong> {strings.AssetAnalysis.WarrantyExpiring1YearBefore} <strong>{warrantyInfo.formattedDate}</strong> ({warrantyInfo.remainingText}). {strings.AssetAnalysis.WarrantyExpiring1YearAfter}
                </MessageBar>
              ) : (
                <MessageBar messageBarType={MessageBarType.success} styles={{ root: { borderRadius: '6px' } }}>
                  <strong>{strings.AssetAnalysis.WarrantyActiveBold}</strong> {strings.AssetAnalysis.WarrantyActiveBefore} <strong>{warrantyInfo.formattedDate}</strong> ({warrantyInfo.remainingText}).
                </MessageBar>
              )
            ) : (
              <MessageBar messageBarType={MessageBarType.info} styles={{ root: { borderRadius: '6px' } }}>
                <strong>{strings.AssetAnalysis.WarrantyUnknownBold}</strong> {strings.AssetAnalysis.WarrantyUnknownText}
              </MessageBar>
            )}
          </div>

          {/* Condition check */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
            <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' }}>{strings.AssetAnalysis.PhysicalHealthLabel}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
              <Icon iconName={healthIcon} style={{ fontSize: '18px', color: conditionColor }} />
              <span>{strings.AssetAnalysis.HealthClassificationLabel} <strong style={{ color: conditionColor }}>{healthRating}</strong></span>
            </div>
            {(asset.condition === 'Poor' || asset.condition === 'Damaged') && (
              <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: '#b91c1c', fontWeight: 'bold' }}>
                {strings.AssetAnalysis.CriticalActionRecommendation}
              </p>
            )}
          </div>
        </Stack>
      </div>
    </Stack>
  );
};
