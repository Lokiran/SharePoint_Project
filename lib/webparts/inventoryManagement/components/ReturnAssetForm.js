import * as React from 'react';
import { useState } from 'react';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { TextField } from '@fluentui/react/lib/TextField';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { RETURN_CONDITION_OPTIONS } from '../constants/DropdownConstants';
import styles from './InventoryManagement.module.scss';
import * as strings from 'InventoryManagementWebPartStrings';
const conditionOptions = RETURN_CONDITION_OPTIONS;
const stackTokens = { childrenGap: 15 };
export const ReturnAssetForm = (props) => {
    const { isOpen, onDismiss, asset, onSubmit } = props;
    const [reason, setReason] = useState('');
    const [condition, setCondition] = useState('Good');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
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
    const onRenderFooterContent = () => (React.createElement(Stack, { horizontal: true, tokens: { childrenGap: 10 } },
        React.createElement(PrimaryButton, { text: strings.ReturnAssetForm.SubmitRequest, onClick: handleSubmit, disabled: submitting }),
        React.createElement(DefaultButton, { text: strings.Common.Cancel, onClick: onDismiss, disabled: submitting })));
    return (React.createElement(Panel, { isOpen: isOpen, onDismiss: onDismiss, type: PanelType.custom, customWidth: "100%", styles: { main: { maxWidth: '450px' } }, headerText: strings.ReturnAssetForm.HeaderText, closeButtonAriaLabel: strings.Common.Close, onRenderFooterContent: onRenderFooterContent, isFooterAtBottom: true },
        React.createElement("div", { style: { marginTop: '20px' } },
            error && (React.createElement("div", { style: { color: '#991b1b', backgroundColor: '#fee2e2', padding: '10px 15px', borderRadius: '4px', marginBottom: '15px', fontSize: '0.88rem' } },
                React.createElement("strong", null, strings.ReturnAssetForm.ErrorPrefix),
                " ",
                error)),
            React.createElement(Stack, { tokens: stackTokens },
                React.createElement("div", { style: { backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '6px' } },
                    React.createElement("h4", { style: { margin: '0 0 10px 0', fontSize: '0.95rem', color: '#1f2937' } }, strings.ReturnAssetForm.AssetInfoTitle),
                    React.createElement("div", { className: styles.responsiveGridGap8, style: { fontSize: '0.85rem' } },
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
                React.createElement(Dropdown, { label: strings.ReturnAssetForm.LabelReturnedCondition, selectedKey: condition, options: conditionOptions, onChange: (_, option) => setCondition(option ? option.key : 'Good'), required: true }),
                React.createElement(TextField, { label: strings.ReturnAssetForm.LabelReturnReason, placeholder: strings.ReturnAssetForm.ReturnReasonPlaceholder, multiline: true, rows: 4, value: reason, onChange: (_, newValue) => setReason(newValue || ''), required: true, errorMessage: reason.trim() ? '' : error && !reason.trim() ? strings.ReturnAssetForm.ReturnReasonRequired : '' })))));
};
//# sourceMappingURL=ReturnAssetForm.js.map