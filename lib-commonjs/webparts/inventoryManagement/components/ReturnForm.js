"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnForm = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_1 = require("@fluentui/react");
var stackTokens = { childrenGap: 15 };
var ReturnForm = function (props) {
    var _a = React.useState(''), reason = _a[0], setReason = _a[1];
    React.useEffect(function () {
        if (props.isOpen) {
            setReason('');
        }
    }, [props.isOpen]);
    var onSave = function () {
        if (reason.trim()) {
            props.onSubmitReturn(reason);
            props.onClose();
        }
    };
    if (!props.assetToReturn)
        return null;
    return (React.createElement(react_1.Panel, { isOpen: props.isOpen, onDismiss: props.onClose, type: react_1.PanelType.medium, headerText: "Request Asset Return", closeButtonAriaLabel: "Close" },
        React.createElement(react_1.Stack, { tokens: stackTokens, style: { marginTop: '20px' } },
            React.createElement(react_1.TextField, { label: "Asset Name", value: props.assetToReturn.assetName || props.assetToReturn.title, readOnly: true, disabled: true }),
            React.createElement(react_1.TextField, { label: "Serial Number", value: props.assetToReturn.serialNumber, readOnly: true, disabled: true }),
            React.createElement(react_1.TextField, { label: "Asset Type", value: props.assetToReturn.assetType, readOnly: true, disabled: true }),
            React.createElement(react_1.TextField, { label: "Requester", value: props.employeeName, readOnly: true, disabled: true }),
            React.createElement(react_1.TextField, { label: "Return Reason", multiline: true, rows: 4, required: true, value: reason, onChange: function (_, newValue) { return setReason(newValue || ''); }, placeholder: "Please explain the reason for returning this asset..." }),
            React.createElement(react_1.Stack, { horizontal: true, tokens: { childrenGap: 10 }, style: { marginTop: '20px' } },
                React.createElement(react_1.PrimaryButton, { text: "Submit Request", onClick: onSave, disabled: !reason.trim() }),
                React.createElement(react_1.DefaultButton, { text: "Cancel", onClick: props.onClose })))));
};
exports.ReturnForm = ReturnForm;
//# sourceMappingURL=ReturnForm.js.map