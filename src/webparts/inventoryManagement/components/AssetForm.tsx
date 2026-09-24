import * as React from 'react';
import {
  Panel,
  PanelType,
  TextField,
  Dropdown,
  IDropdownOption,
  PrimaryButton,
  DefaultButton,
  Stack,
  IStackTokens,
  MessageBar,
  MessageBarType
} from '@fluentui/react';
import { IInventoryItem } from '../models/IInventoryItem';
import { RoleUtils, UserRole } from '../utils/RoleUtils';
import { DEFAULT_ASSET_TYPE_OPTIONS, ASSET_CONDITION_OPTIONS } from '../constants/DropdownConstants';
import * as strings from 'InventoryManagementWebPartStrings';

export interface IAssetFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: UserRole;
  onAddAsset: (asset: Omit<IInventoryItem, 'id' | 'status' | 'assignedTo'>) => void;
}

export const AssetForm: React.FC<IAssetFormProps> = (props) => {
  const stackTokens: IStackTokens = { childrenGap: 15 };
  const [title, setTitle] = React.useState('Company Assets');
  const [assetName, setAssetName] = React.useState('');
  const [assetType, setAssetType] = React.useState<string>('Laptop');
  const [serialNumber, setSerialNumber] = React.useState('');
  const [purchaseDate, setPurchaseDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [vendor, setVendor] = React.useState('');
  const [condition, setCondition] = React.useState('New');
  const [warrantyExpiry, setWarrantyExpiry] = React.useState('');
  const [specifications, setSpecifications] = React.useState('');

  const isAdmin = props.currentUserRole === 'Admin';
  const isManager = props.currentUserRole === 'Inventory Manager';

  if (!RoleUtils.canAddAssets(props.currentUserRole)) {
    return null;
  }

  const onSave = () => {
    props.onAddAsset({
      title,
      assetName,
      assetType,
      serialNumber,
      purchaseDate,
      vendor,
      condition,
      warrantyExpiry,
      specifications
    });
    setAssetName('');
    setSerialNumber('');
    setVendor('');
    setCondition('New');
    setWarrantyExpiry('');
    setSpecifications('');
    props.onClose();
  };

  return (
    <Panel
      isOpen={props.isOpen}
      onDismiss={props.onClose}
      type={PanelType.custom}
      customWidth="100%"
      styles={{ main: { maxWidth: '450px' } }}
      headerText={isAdmin ? strings.AssetForm.HeaderAdmin : strings.AssetForm.HeaderManager}
      closeButtonAriaLabel={strings.Common.Close}
    >
      <Stack tokens={stackTokens}>
        {isManager && !isAdmin && (
          <MessageBar messageBarType={MessageBarType.warning}>
            {strings.AssetForm.ManagerHint}
          </MessageBar>
        )}
        <TextField
          label={strings.AssetForm.LabelTitle}
          value={title}
          onChange={(_, val) => setTitle(val || '')}
          required
        />
        <TextField
          label={strings.AssetForm.LabelAssetName}
          value={assetName}
          onChange={(_, val) => setAssetName(val || '')}
          required
        />
        <Dropdown
          label={strings.AssetForm.LabelAssetType}
          selectedKey={assetType}
          options={DEFAULT_ASSET_TYPE_OPTIONS}
          onChange={(_, opt) => setAssetType(opt?.key as string || 'Other')}
          required
        />
        <TextField
          label={strings.AssetForm.LabelSerialNumber}
          value={serialNumber}
          onChange={(_, val) => setSerialNumber(val || '')}
          required
        />
        <TextField
          label={strings.AssetForm.LabelPurchaseDate}
          type="date"
          value={purchaseDate}
          onChange={(_, val) => setPurchaseDate(val || '')}
          required
        />
        <TextField
          label={strings.AssetForm.LabelVendor}
          value={vendor}
          placeholder={strings.AssetForm.VendorPlaceholder}
          onChange={(_, val) => setVendor(val || '')}
        />
        <Dropdown
          label={strings.AssetForm.LabelCondition}
          selectedKey={condition}
          options={ASSET_CONDITION_OPTIONS}
          onChange={(_, opt) => setCondition(opt?.key as string || 'New')}
        />
        <TextField
          label={strings.AssetForm.LabelWarrantyExpiry}
          type="date"
          value={warrantyExpiry}
          onChange={(_, val) => setWarrantyExpiry(val || '')}
        />
        <TextField
          label={strings.AssetForm.LabelSpecifications}
          placeholder={strings.AssetForm.SpecificationsPlaceholder}
          multiline
          rows={3}
          value={specifications}
          onChange={(_, val) => setSpecifications(val || '')}
        />
        <Stack horizontal tokens={stackTokens} style={{ marginTop: 20 }}>
          <PrimaryButton text={strings.AssetForm.AddAsset} onClick={onSave} disabled={!assetName || !serialNumber} />
          <DefaultButton text={strings.Common.Cancel} onClick={props.onClose} />
        </Stack>
      </Stack>
    </Panel>
  );
};
