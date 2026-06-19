"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnQueueList = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_1 = require("@fluentui/react");
var stackTokens = { childrenGap: 15 };
var ReturnQueueList = function (props) {
    var _a = React.useState(undefined), activeRequest = _a[0], setActiveRequest = _a[1];
    var _b = React.useState(undefined), panelAction = _b[0], setPanelAction = _b[1];
    var _c = React.useState(''), remarks = _c[0], setRemarks = _c[1];
    var _d = React.useState('Available'), verificationStatus = _d[0], setVerificationStatus = _d[1];
    var _e = React.useState(false), submitting = _e[0], setSubmitting = _e[1];
    var openPanel = function (request, action) {
        setActiveRequest(request);
        setPanelAction(action);
        setRemarks('');
        setVerificationStatus('Available');
    };
    var closePanel = function () {
        setActiveRequest(undefined);
        setPanelAction(undefined);
        setRemarks('');
    };
    var handleAction = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!activeRequest || !panelAction)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, 9, 10]);
                    setSubmitting(true);
                    if (!(panelAction === 'Approve')) return [3 /*break*/, 3];
                    return [4 /*yield*/, props.onApprove(activeRequest, remarks)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 3:
                    if (!(panelAction === 'Reject')) return [3 /*break*/, 5];
                    return [4 /*yield*/, props.onReject(activeRequest, remarks)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5:
                    if (!(panelAction === 'Verify')) return [3 /*break*/, 7];
                    return [4 /*yield*/, props.onComplete(activeRequest, verificationStatus, remarks)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    closePanel();
                    return [3 /*break*/, 10];
                case 8:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [3 /*break*/, 10];
                case 9:
                    setSubmitting(false);
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    var columns = [
        { key: 'colKey', name: 'Return Request ID', fieldName: 'returnRequestKey', minWidth: 100, maxWidth: 120, isResizable: true },
        { key: 'colAssetId', name: 'Asset ID', fieldName: 'assetId', minWidth: 60, maxWidth: 80, isResizable: true },
        {
            key: 'colAssetName',
            name: 'Asset Name',
            minWidth: 120,
            maxWidth: 150,
            isResizable: true,
            onRender: function (item) {
                var asset = props.inventoryItems.find(function (i) { return i.id === item.assetId; });
                return React.createElement("span", null, asset ? (asset.assetName || asset.title) : (item.assetName || 'Unknown Asset'));
            }
        },
        {
            key: 'colSerialNumber',
            name: 'Serial Number',
            minWidth: 100,
            maxWidth: 120,
            isResizable: true,
            onRender: function (item) {
                var asset = props.inventoryItems.find(function (i) { return i.id === item.assetId; });
                return React.createElement("span", null, asset ? asset.serialNumber : (item.serialNumber || 'N/A'));
            }
        },
        { key: 'colEmployee', name: 'Employee', fieldName: 'employee', minWidth: 120, maxWidth: 150, isResizable: true },
        { key: 'colReason', name: 'Return Reason', fieldName: 'returnReason', minWidth: 150, maxWidth: 220, isResizable: true, isMultiline: true },
        { key: 'colDate', name: 'Request Date', fieldName: 'requestDate', minWidth: 90, maxWidth: 110, isResizable: true },
        {
            key: 'colStatus',
            name: 'Status',
            fieldName: 'status',
            minWidth: 90,
            maxWidth: 100,
            isResizable: true,
            onRender: function (item) {
                var backgroundColor = '#f3f4f6';
                var textColor = '#374151';
                if (item.status === 'Pending') {
                    backgroundColor = '#ffedd5';
                    textColor = '#9a3412';
                }
                else if (item.status === 'Approved') {
                    backgroundColor = '#dbeafe';
                    textColor = '#1e40af';
                }
                else if (item.status === 'Rejected') {
                    backgroundColor = '#fee2e2';
                    textColor = '#991b1b';
                }
                else if (item.status === 'Completed') {
                    backgroundColor = '#dcfce7';
                    textColor = '#166534';
                }
                return (React.createElement("span", { style: {
                        backgroundColor: backgroundColor,
                        color: textColor,
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'inline-block'
                    } }, item.status));
            }
        },
        { key: 'colRemarks', name: 'Remarks / Comments', fieldName: 'managerRemarks', minWidth: 120, maxWidth: 200, isResizable: true, isMultiline: true },
        {
            key: 'colActions',
            name: 'Actions',
            minWidth: 180,
            maxWidth: 220,
            isResizable: true,
            onRender: function (item) {
                if (item.status === 'Pending') {
                    return (React.createElement(react_1.Stack, { horizontal: true, tokens: { childrenGap: 5 } },
                        React.createElement(react_1.PrimaryButton, { text: "Approve", onClick: function () { return openPanel(item, 'Approve'); }, styles: { root: { backgroundColor: '#107c41', borderColor: '#107c41' } } }),
                        React.createElement(react_1.DefaultButton, { text: "Reject", onClick: function () { return openPanel(item, 'Reject'); }, styles: { root: { color: '#ef4444' } } })));
                }
                else if (item.status === 'Approved') {
                    return (React.createElement(react_1.PrimaryButton, { text: "Verify & Complete", iconProps: { iconName: 'ComplianceAudit' }, onClick: function () { return openPanel(item, 'Verify'); } }));
                }
                return React.createElement("span", null, "No Action Required");
            }
        }
    ];
    var dropdownOptions = [
        { key: 'Available', text: 'Available (Restock)' },
        { key: 'Under Repair', text: 'Under Repair (Maintenance)' },
        { key: 'Retired', text: 'Retired (Dispose)' }
    ];
    return (React.createElement("div", { style: { marginTop: '20px' } },
        props.loading ? (React.createElement("p", null, "Loading return requests...")) : props.items.length === 0 ? (React.createElement("p", { style: { fontStyle: 'italic', color: 'var(--text-muted)' } }, "No return requests active.")) : (React.createElement(react_1.DetailsList, { items: props.items, columns: columns, setKey: "set", layoutMode: react_1.DetailsListLayoutMode.justified, selectionMode: react_1.SelectionMode.none })),
        activeRequest && panelAction && (React.createElement(react_1.Panel, { isOpen: !!activeRequest, onDismiss: closePanel, type: react_1.PanelType.medium, headerText: panelAction === 'Approve' ? 'Approve Return Request' :
                panelAction === 'Reject' ? 'Reject Return Request' :
                    'Verify & Complete Asset Return', closeButtonAriaLabel: "Close" },
            React.createElement(react_1.Stack, { tokens: stackTokens, style: { marginTop: '20px' } },
                React.createElement(react_1.TextField, { label: "Return Request ID", value: activeRequest.returnRequestKey, readOnly: true, disabled: true }),
                React.createElement(react_1.TextField, { label: "Employee", value: activeRequest.employee, readOnly: true, disabled: true }),
                React.createElement(react_1.TextField, { label: "Return Reason", value: activeRequest.returnReason, multiline: true, readOnly: true, disabled: true }),
                panelAction === 'Verify' && (React.createElement(react_1.Dropdown, { label: "Verify Physical Condition & Set Status", selectedKey: verificationStatus, options: dropdownOptions, onChange: function (_, option) { return setVerificationStatus(option === null || option === void 0 ? void 0 : option.key); }, required: true })),
                React.createElement(react_1.TextField, { label: "Remarks / Comments", multiline: true, rows: 4, value: remarks, onChange: function (_, newValue) { return setRemarks(newValue || ''); }, placeholder: "Enter details or comments here...", required: panelAction === 'Reject' }),
                React.createElement(react_1.Stack, { horizontal: true, tokens: { childrenGap: 10 }, style: { marginTop: '20px' } },
                    React.createElement(react_1.PrimaryButton, { text: panelAction === 'Approve' ? 'Approve Return' :
                            panelAction === 'Reject' ? 'Reject Return' :
                                'Complete Verification', onClick: handleAction, disabled: submitting || (panelAction === 'Reject' && !remarks.trim()) }),
                    React.createElement(react_1.DefaultButton, { text: "Cancel", onClick: closePanel, disabled: submitting })))))));
};
exports.ReturnQueueList = ReturnQueueList;
//# sourceMappingURL=ReturnQueueList.js.map