"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnAssetForm = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("react");
const Panel_1 = require("@fluentui/react/lib/Panel");
const TextField_1 = require("@fluentui/react/lib/TextField");
const Dropdown_1 = require("@fluentui/react/lib/Dropdown");
const Button_1 = require("@fluentui/react/lib/Button");
const Stack_1 = require("@fluentui/react/lib/Stack");
const DropdownConstants_1 = require("../constants/DropdownConstants");
const InventoryManagement_module_scss_1 = tslib_1.__importDefault(require("./InventoryManagement.module.scss"));
const strings = tslib_1.__importStar(require("InventoryManagementWebPartStrings"));
const conditionOptions = DropdownConstants_1.RETURN_CONDITION_OPTIONS;
const stackTokens = { childrenGap: 15 };
const ReturnAssetForm = (props) => {
    const { isOpen, onDismiss, asset, onSubmit } = props;
    const [reason, setReason] = (0, react_1.useState)('');
    const [condition, setCondition] = (0, react_1.useState)('Good');
    const [submitting, setSubmitting] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    if (!asset)
        return null;
    const handleSubmit = async () => {
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
        }
        catch (err) {
            setError(err.message || strings.ReturnAssetForm.GenericSubmitError);
        }
        finally {
            setSubmitting(false);
        }
    };
    const onRenderFooterContent = () => (React.createElement(Stack_1.Stack, { horizontal: true, tokens: { childrenGap: 10 } },
        React.createElement(Button_1.PrimaryButton, { text: strings.ReturnAssetForm.SubmitRequest, onClick: handleSubmit, disabled: submitting }),
        React.createElement(Button_1.DefaultButton, { text: strings.Common.Cancel, onClick: onDismiss, disabled: submitting })));
    return (React.createElement(Panel_1.Panel, { isOpen: isOpen, onDismiss: onDismiss, type: Panel_1.PanelType.custom, customWidth: "100%", styles: { main: { maxWidth: '450px' } }, headerText: strings.ReturnAssetForm.HeaderText, closeButtonAriaLabel: strings.Common.Close, onRenderFooterContent: onRenderFooterContent, isFooterAtBottom: true },
        React.createElement("div", { style: { marginTop: '20px' } },
            error && (React.createElement("div", { style: { color: '#991b1b', backgroundColor: '#fee2e2', padding: '10px 15px', borderRadius: '4px', marginBottom: '15px', fontSize: '0.88rem' } },
                React.createElement("strong", null, strings.ReturnAssetForm.ErrorPrefix),
                " ",
                error)),
            React.createElement(Stack_1.Stack, { tokens: stackTokens },
                React.createElement("div", { style: { backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '6px' } },
                    React.createElement("h4", { style: { margin: '0 0 10px 0', fontSize: '0.95rem', color: '#1f2937' } }, strings.ReturnAssetForm.AssetInfoTitle),
                    React.createElement("div", { className: InventoryManagement_module_scss_1.default.responsiveGridGap8, style: { fontSize: '0.85rem' } },
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } },
                                strings.ReturnAssetForm.LabelAssetName,
                                ":"),
                            " ",
                            React.createElement("strong", null, asset.assetName || asset.title)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } },
                                strings.ReturnAssetForm.LabelSerialNumber,
                                ":"),
                            " ",
                            React.createElement("strong", null, asset.serialNumber || strings.Common.NotAvailable)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } },
                                strings.ReturnAssetForm.LabelType,
                                ":"),
                            " ",
                            React.createElement("strong", null, asset.assetType)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } },
                                strings.ReturnAssetForm.LabelCurrentCondition,
                                ":"),
                            " ",
                            React.createElement("strong", null, asset.condition || 'Good')))),
                React.createElement(Dropdown_1.Dropdown, { label: strings.ReturnAssetForm.LabelReturnedCondition, selectedKey: condition, options: conditionOptions, onChange: (_, option) => setCondition(option ? option.key : 'Good'), required: true }),
                React.createElement(TextField_1.TextField, { label: strings.ReturnAssetForm.LabelReturnReason, placeholder: strings.ReturnAssetForm.ReturnReasonPlaceholder, multiline: true, rows: 4, value: reason, onChange: (_, newValue) => setReason(newValue || ''), required: true, errorMessage: reason.trim() ? '' : error && !reason.trim() ? strings.ReturnAssetForm.ReturnReasonRequired : '' })))));
};
exports.ReturnAssetForm = ReturnAssetForm;
//# sourceMappingURL=ReturnAssetForm.js.map