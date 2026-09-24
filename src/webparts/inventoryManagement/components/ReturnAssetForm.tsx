import * as React from 'react';
import { useState } from 'react';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { TextField } from '@fluentui/react/lib/TextField';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import { IInventoryItem } from '../models/IInventoryItem';
import { RETURN_CONDITION_OPTIONS } from '../constants/DropdownConstants';
import styles from './InventoryManagement.module.scss';
import * as strings from 'InventoryManagementWebPartStrings';

export interface IReturnAssetFormProps {
  isOpen: boolean;
  onDismiss: () => void;
  asset: IInventoryItem | undefined;
  onSubmit: (reason: string, condition: string) => Promise<void>;
}

const conditionOptions = RETURN_CONDITION_OPTIONS;

const stackTokens: IStackTokens = { childrenGap: 15 };

export const ReturnAssetForm: React.FC<IReturnAssetFormProps> = (props) => {
  const { isOpen, onDismiss, asset, onSubmit } = props;
  
  const [reason, setReason] = useState<string>('');
  const [condition, setCondition] = useState<string>('Good');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!asset) return null;

  const handleSubmit = async (): Promise<void> => {
    if (!reason.trim()) {
      setError(strings.ReturnAssetForm.ReturnReasonRequired);
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onSubmit(reason, condition);
      setReason('');
      setCondition('Good');
      onDismiss();
    } catch (err: any) {
      setError(err.message || strings.ReturnAssetForm.GenericSubmitError);
    } finally {
      setSubmitting(false);
    }
  };

  const onRenderFooterContent = (): JSX.Element => (
    <Stack horizontal tokens={{ childrenGap: 10 }}>
      <PrimaryButton
        text={strings.ReturnAssetForm.SubmitRequest}
        onClick={handleSubmit}
        disabled={submitting}
      />
      <DefaultButton
        text={strings.Common.Cancel}
        onClick={onDismiss}
        disabled={submitting}
      />
    </Stack>
  );

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      type={PanelType.custom}
      customWidth="100%"
      styles={{ main: { maxWidth: '450px' } }}
      headerText={strings.ReturnAssetForm.HeaderText}
      closeButtonAriaLabel={strings.Common.Close}
      onRenderFooterContent={onRenderFooterContent}
      isFooterAtBottom={true}
    >
      <div style={{ marginTop: '20px' }}>
        {error && (
          <div style={{ color: '#991b1b', backgroundColor: '#fee2e2', padding: '10px 15px', borderRadius: '4px', marginBottom: '15px', fontSize: '0.88rem' }}>
            <strong>{strings.ReturnAssetForm.ErrorPrefix}</strong> {error}
          </div>
        )}

        <Stack tokens={stackTokens}>
          <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '6px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#1f2937' }}>{strings.ReturnAssetForm.AssetInfoTitle}</h4>
            <div className={styles.responsiveGridGap8} style={{ fontSize: '0.85rem' }}>
              <div><span style={{ color: '#6b7280' }}>{strings.ReturnAssetForm.LabelAssetName}:</span> <strong>{asset.assetName || asset.title}</strong></div>
              <div><span style={{ color: '#6b7280' }}>{strings.ReturnAssetForm.LabelSerialNumber}:</span> <strong>{asset.serialNumber || strings.Common.NotAvailable}</strong></div>
              <div><span style={{ color: '#6b7280' }}>{strings.ReturnAssetForm.LabelType}:</span> <strong>{asset.assetType}</strong></div>
              <div><span style={{ color: '#6b7280' }}>{strings.ReturnAssetForm.LabelCurrentCondition}:</span> <strong>{asset.condition || 'Good'}</strong></div>
            </div>
          </div>

          <Dropdown
            label={strings.ReturnAssetForm.LabelReturnedCondition}
            selectedKey={condition}
            options={conditionOptions}
            onChange={(_, option) => setCondition(option ? (option.key as string) : 'Good')}
            required
          />

          <TextField
            label={strings.ReturnAssetForm.LabelReturnReason}
            placeholder={strings.ReturnAssetForm.ReturnReasonPlaceholder}
            multiline
            rows={4}
            value={reason}
            onChange={(_, newValue) => setReason(newValue || '')}
            required
            errorMessage={reason.trim() ? '' : error && !reason.trim() ? strings.ReturnAssetForm.ReturnReasonRequired : ''}
          />
        </Stack>
      </div>
    </Panel>
  );
};
