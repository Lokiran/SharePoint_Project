"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetAssignmentForm = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_1 = require("@fluentui/react");
var AssetAssignmentForm = function (props) {
    var stackTokens = { childrenGap: 15 };
    var _a = React.useState([]), selectedAssetIds = _a[0], setSelectedAssetIds = _a[1];
    var _b = React.useState(false), isSubmitting = _b[0], setIsSubmitting = _b[1];
    var _c = React.useState(), error = _c[0], setError = _c[1];
    // Reset state when opened with a new employee
    React.useEffect(function () {
        if (props.isOpen) {
            setSelectedAssetIds([]);
            setError(undefined);
        }
    }, [props.isOpen, props.employee]);
    var assetOptions = props.availableAssets.map(function (asset) { return ({
        key: asset.id,
        text: "".concat(asset.assetName || asset.title, " (").concat(asset.serialNumber || 'No SN', ") - ").concat(asset.assetType)
    }); });
    var onDropdownChange = function (event, item) {
        if (item) {
            setSelectedAssetIds(item.selected ? tslib_1.__spreadArray(tslib_1.__spreadArray([], selectedAssetIds, true), [item.key], false) : selectedAssetIds.filter(function (key) { return key !== item.key; }));
        }
    };
    var onSave = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!props.employee || selectedAssetIds.length === 0)
                        return [2 /*return*/];
                    setIsSubmitting(true);
                    setError(undefined);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, props.onAssignAssets(props.employee, selectedAssetIds)];
                case 2:
                    _a.sent();
                    props.onClose();
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1.message || 'An error occurred while assigning assets.');
                    return [3 /*break*/, 5];
                case 4:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement(react_1.Panel, { isOpen: props.isOpen, onDismiss: props.onClose, type: react_1.PanelType.medium, headerText: props.employee ? "Assign Assets to ".concat(props.employee.name) : 'Assign Assets', closeButtonAriaLabel: "Close" },
        React.createElement(react_1.Stack, { tokens: stackTokens },
            React.createElement("p", { style: { margin: 0, color: '#4b5563', fontSize: '0.9rem' } }, "Select one or multiple available assets to directly assign to this employee."),
            error && (React.createElement(react_1.MessageBar, { messageBarType: react_1.MessageBarType.error, onDismiss: function () { return setError(undefined); } }, error)),
            React.createElement(react_1.Dropdown, { placeholder: "Select available assets", label: "Available Assets", selectedKeys: selectedAssetIds, onChange: onDropdownChange, multiSelect: true, options: assetOptions, disabled: assetOptions.length === 0 || isSubmitting }),
            assetOptions.length === 0 && (React.createElement(react_1.MessageBar, { messageBarType: react_1.MessageBarType.warning }, "There are no available assets in stock. Please add new assets first.")),
            React.createElement(react_1.Stack, { horizontal: true, tokens: stackTokens, style: { marginTop: 20 } },
                React.createElement(react_1.PrimaryButton, { text: "Confirm Assignment", onClick: onSave, disabled: selectedAssetIds.length === 0 || isSubmitting }),
                React.createElement(react_1.DefaultButton, { text: "Cancel", onClick: props.onClose, disabled: isSubmitting })))));
};
exports.AssetAssignmentForm = AssetAssignmentForm;
//# sourceMappingURL=AssetAssignmentForm.js.map