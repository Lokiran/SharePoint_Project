import * as React from 'react';
import { Panel, PanelType, TextField, Dropdown, PrimaryButton, DefaultButton, Stack, MessageBar, MessageBarType } from '@fluentui/react';
import { RoleUtils } from '../utils/RoleUtils';
import { DEFAULT_ASSET_TYPE_OPTIONS, ASSET_CONDITION_OPTIONS } from '../constants/DropdownConstants';
import * as strings from 'InventoryManagementWebPartStrings';
export const AssetForm = (props) => {
    const stackTokens = { childrenGap: 15 };
    const [title, setTitle] = React.useState('Company Assets');
    const [assetName, setAssetName] = React.useState('');
    const [assetType, setAssetType] = React.useState('Laptop');
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
    return (React.createElement(Panel, { isOpen: props.isOpen, onDismiss: props.onClose, type: PanelType.custom, customWidth: "100%", styles: { main: { maxWidth: '450px' } }, headerText: isAdmin ? strings.AssetForm.HeaderAdmin : strings.AssetForm.HeaderManager, closeButtonAriaLabel: strings.Common.Close },
        React.createElement(Stack, { tokens: stackTokens },
            isManager && !isAdmin && (React.createElement(MessageBar, { messageBarType: MessageBarType.warning }, strings.AssetForm.ManagerHint)),
            React.createElement(TextField, { label: strings.AssetForm.LabelTitle, value: title, onChange: (_, val) => setTitle(val || ''), required: true }),
            React.createElement(TextField, { label: strings.AssetForm.LabelAssetName, value: assetName, onChange: (_, val) => setAssetName(val || ''), required: true }),
            React.createElement(Dropdown, { label: strings.AssetForm.LabelAssetType, selectedKey: assetType, options: DEFAULT_ASSET_TYPE_OPTIONS, onChange: (_, opt) => setAssetType(opt?.key || 'Other'), required: true }),
            React.createElement(TextField, { label: strings.AssetForm.LabelSerialNumber, value: serialNumber, onChange: (_, val) => setSerialNumber(val || ''), required: true }),
            React.createElement(TextField, { label: strings.AssetForm.LabelPurchaseDate, type: "date", value: purchaseDate, onChange: (_, val) => setPurchaseDate(val || ''), required: true }),
            React.createElement(TextField, { label: strings.AssetForm.LabelVendor, value: vendor, placeholder: strings.AssetForm.VendorPlaceholder, onChange: (_, val) => setVendor(val || '') }),
            React.createElement(Dropdown, { label: strings.AssetForm.LabelCondition, selectedKey: condition, options: ASSET_CONDITION_OPTIONS, onChange: (_, opt) => setCondition(opt?.key || 'New') }),
            React.createElement(TextField, { label: strings.AssetForm.LabelWarrantyExpiry, type: "date", value: warrantyExpiry, onChange: (_, val) => setWarrantyExpiry(val || '') }),
            React.createElement(TextField, { label: strings.AssetForm.LabelSpecifications, placeholder: strings.AssetForm.SpecificationsPlaceholder, multiline: true, rows: 3, value: specifications, onChange: (_, val) => setSpecifications(val || '') }),
            React.createElement(Stack, { horizontal: true, tokens: stackTokens, style: { marginTop: 20 } },
                React.createElement(PrimaryButton, { text: strings.AssetForm.AddAsset, onClick: onSave, disabled: !assetName || !serialNumber }),
                React.createElement(DefaultButton, { text: strings.Common.Cancel, onClick: props.onClose })))));
};
//# sourceMappingURL=AssetForm.js.map