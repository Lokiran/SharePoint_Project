import * as React from 'react';
import { useState } from 'react';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { TextField } from '@fluentui/react/lib/TextField';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
const conditionOptions = [
    { key: 'Good', text: 'Good (No visible damage, fully functional)' },
    { key: 'Fair', text: 'Fair (Minor cosmetic wear, fully functional)' },
    { key: 'Poor', text: 'Poor (Significant wear or partial issues)' },
    { key: 'Damaged', text: 'Damaged (Broken, non-functional, physical damage)' }
];
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
            setError('Please provide a reason for the return.');
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
            setError(err.message || 'Failed to submit return request.');
        }
        finally {
            setSubmitting(false);
        }
    };
    const onRenderFooterContent = () => (React.createElement(Stack, { horizontal: true, tokens: { childrenGap: 10 } },
        React.createElement(PrimaryButton, { text: "Submit Request", onClick: handleSubmit, disabled: submitting }),
        React.createElement(DefaultButton, { text: "Cancel", onClick: onDismiss, disabled: submitting })));
    return (React.createElement(Panel, { isOpen: isOpen, onDismiss: onDismiss, type: PanelType.custom, customWidth: "450px", headerText: "Request Asset Return", closeButtonAriaLabel: "Close", onRenderFooterContent: onRenderFooterContent, isFooterAtBottom: true },
        React.createElement("div", { style: { marginTop: '20px' } },
            error && (React.createElement("div", { style: { color: '#991b1b', backgroundColor: '#fee2e2', padding: '10px 15px', borderRadius: '4px', marginBottom: '15px', fontSize: '0.88rem' } },
                React.createElement("strong", null, "Error:"),
                " ",
                error)),
            React.createElement(Stack, { tokens: stackTokens },
                React.createElement("div", { style: { backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '6px' } },
                    React.createElement("h4", { style: { margin: '0 0 10px 0', fontSize: '0.95rem', color: '#1f2937' } }, "Asset Information"),
                    React.createElement("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' } },
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } }, "Asset Name:"),
                            " ",
                            React.createElement("strong", null, asset.assetName || asset.title)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } }, "Serial Number:"),
                            " ",
                            React.createElement("strong", null, asset.serialNumber || 'N/A')),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } }, "Type:"),
                            " ",
                            React.createElement("strong", null, asset.assetType)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } }, "Current Condition:"),
                            " ",
                            React.createElement("strong", null, asset.condition || 'Good')))),
                React.createElement(Dropdown, { label: "Returned Asset Condition", selectedKey: condition, options: conditionOptions, onChange: (_, option) => setCondition(option ? option.key : 'Good'), required: true }),
                React.createElement(TextField, { label: "Reason for Return", placeholder: "Please detail why you are returning this asset (e.g. Upgrade received, hardware failure, contract ended...)", multiline: true, rows: 4, value: reason, onChange: (_, newValue) => setReason(newValue || ''), required: true, errorMessage: reason.trim() ? '' : error && !reason.trim() ? 'Reason is required' : '' })))));
};
//# sourceMappingURL=ReturnAssetForm.js.map