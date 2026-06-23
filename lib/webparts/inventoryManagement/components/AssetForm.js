import * as React from 'react';
import { Panel, PanelType, TextField, Dropdown, PrimaryButton, DefaultButton, Stack, MessageBar, MessageBarType } from '@fluentui/react';
import { RoleUtils } from '../utils/RoleUtils';
const assetTypeOptions = [
    { key: 'Laptop', text: 'Laptop' },
    { key: 'Monitor', text: 'Monitor' },
    { key: 'Mouse', text: 'Mouse' },
    { key: 'Keyboard', text: 'Keyboard' },
    { key: 'Headset', text: 'Headset' },
    { key: 'Other', text: 'Other' }
];
const conditionOptions = [
    { key: 'New', text: 'New' },
    { key: 'Good', text: 'Good' },
    { key: 'Fair', text: 'Fair' },
    { key: 'Poor', text: 'Poor' },
    { key: 'Damaged', text: 'Damaged' }
];
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
    return (React.createElement(Panel, { isOpen: props.isOpen, onDismiss: props.onClose, type: PanelType.custom, customWidth: "450px", headerText: isAdmin ? "Add New Asset" : "Register New Asset", closeButtonAriaLabel: "Close" },
        React.createElement(Stack, { tokens: stackTokens },
            isManager && !isAdmin && (React.createElement(MessageBar, { messageBarType: MessageBarType.warning }, "You are registering a new asset. After adding, you can assign it to employees in the Asset Tracking section.")),
            React.createElement(TextField, { label: "Title (Group/Category)", value: title, onChange: (_, val) => setTitle(val || ''), required: true }),
            React.createElement(TextField, { label: "Asset Name", value: assetName, onChange: (_, val) => setAssetName(val || ''), required: true }),
            React.createElement(Dropdown, { label: "Asset Type", selectedKey: assetType, options: assetTypeOptions, onChange: (_, opt) => setAssetType(opt?.key || 'Other'), required: true }),
            React.createElement(TextField, { label: "Serial Number", value: serialNumber, onChange: (_, val) => setSerialNumber(val || ''), required: true }),
            React.createElement(TextField, { label: "Purchase Date", type: "date", value: purchaseDate, onChange: (_, val) => setPurchaseDate(val || ''), required: true }),
            React.createElement(TextField, { label: "Vendor", value: vendor, placeholder: "E.g., Dell, Apple, Microsoft, Lenovo", onChange: (_, val) => setVendor(val || '') }),
            React.createElement(Dropdown, { label: "Condition", selectedKey: condition, options: conditionOptions, onChange: (_, opt) => setCondition(opt?.key || 'New') }),
            React.createElement(TextField, { label: "Warranty Expiry Date", type: "date", value: warrantyExpiry, onChange: (_, val) => setWarrantyExpiry(val || '') }),
            React.createElement(TextField, { label: "Specifications", placeholder: "E.g., Intel i7, 16GB RAM, 512GB SSD, etc.", multiline: true, rows: 3, value: specifications, onChange: (_, val) => setSpecifications(val || '') }),
            React.createElement(Stack, { horizontal: true, tokens: stackTokens, style: { marginTop: 20 } },
                React.createElement(PrimaryButton, { text: "Add Asset", onClick: onSave, disabled: !assetName || !serialNumber }),
                React.createElement(DefaultButton, { text: "Cancel", onClick: props.onClose })))));
};
//# sourceMappingURL=AssetForm.js.map