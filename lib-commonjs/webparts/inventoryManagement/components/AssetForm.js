"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetForm = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("@fluentui/react");
const RoleUtils_1 = require("../utils/RoleUtils");
const DropdownConstants_1 = require("../constants/DropdownConstants");
const strings = tslib_1.__importStar(require("InventoryManagementWebPartStrings"));
const AssetForm = (props) => {
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
    if (!RoleUtils_1.RoleUtils.canAddAssets(props.currentUserRole)) {
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
    return (React.createElement(react_1.Panel, { isOpen: props.isOpen, onDismiss: props.onClose, type: react_1.PanelType.custom, customWidth: "100%", styles: { main: { maxWidth: '450px' } }, headerText: isAdmin ? strings.AssetForm.HeaderAdmin : strings.AssetForm.HeaderManager, closeButtonAriaLabel: strings.Common.Close },
        React.createElement(react_1.Stack, { tokens: stackTokens },
            isManager && !isAdmin && (React.createElement(react_1.MessageBar, { messageBarType: react_1.MessageBarType.warning }, strings.AssetForm.ManagerHint)),
            React.createElement(react_1.TextField, { label: strings.AssetForm.LabelTitle, value: title, onChange: (_, val) => setTitle(val || ''), required: true }),
            React.createElement(react_1.TextField, { label: strings.AssetForm.LabelAssetName, value: assetName, onChange: (_, val) => setAssetName(val || ''), required: true }),
            React.createElement(react_1.Dropdown, { label: strings.AssetForm.LabelAssetType, selectedKey: assetType, options: DropdownConstants_1.DEFAULT_ASSET_TYPE_OPTIONS, onChange: (_, opt) => setAssetType(opt?.key || 'Other'), required: true }),
            React.createElement(react_1.TextField, { label: strings.AssetForm.LabelSerialNumber, value: serialNumber, onChange: (_, val) => setSerialNumber(val || ''), required: true }),
            React.createElement(react_1.TextField, { label: strings.AssetForm.LabelPurchaseDate, type: "date", value: purchaseDate, onChange: (_, val) => setPurchaseDate(val || ''), required: true }),
            React.createElement(react_1.TextField, { label: strings.AssetForm.LabelVendor, value: vendor, placeholder: strings.AssetForm.VendorPlaceholder, onChange: (_, val) => setVendor(val || '') }),
            React.createElement(react_1.Dropdown, { label: strings.AssetForm.LabelCondition, selectedKey: condition, options: DropdownConstants_1.ASSET_CONDITION_OPTIONS, onChange: (_, opt) => setCondition(opt?.key || 'New') }),
            React.createElement(react_1.TextField, { label: strings.AssetForm.LabelWarrantyExpiry, type: "date", value: warrantyExpiry, onChange: (_, val) => setWarrantyExpiry(val || '') }),
            React.createElement(react_1.TextField, { label: strings.AssetForm.LabelSpecifications, placeholder: strings.AssetForm.SpecificationsPlaceholder, multiline: true, rows: 3, value: specifications, onChange: (_, val) => setSpecifications(val || '') }),
            React.createElement(react_1.Stack, { horizontal: true, tokens: stackTokens, style: { marginTop: 20 } },
                React.createElement(react_1.PrimaryButton, { text: strings.AssetForm.AddAsset, onClick: onSave, disabled: !assetName || !serialNumber }),
                React.createElement(react_1.DefaultButton, { text: strings.Common.Cancel, onClick: props.onClose })))));
};
exports.AssetForm = AssetForm;
//# sourceMappingURL=AssetForm.js.map