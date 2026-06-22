"use strict";
self["webpackHotUpdate_56f8f2dc_8391_46cb_b74c_2806d6953063_0_0_1"]("inventory-management-web-part",{

/***/ 82867:
/*!********************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/components/RequestList.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RequestList: () => (/* binding */ RequestList)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 85959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fluentui_react_lib_DetailsList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fluentui/react/lib/DetailsList */ 79370);
/* harmony import */ var _fluentui_react_lib_DetailsList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fluentui/react/lib/DetailsList */ 37805);
/* harmony import */ var _fluentui_react_lib_DetailsList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fluentui/react/lib/DetailsList */ 74423);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @fluentui/react */ 29425);




const RequestList = (props) => {
    const [selectedRequestForDetails, setSelectedRequestForDetails] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
    const [isDetailsPanelOpen, setIsDetailsPanelOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const columns = [
        {
            key: 'columnRequestKey',
            name: 'Request ID',
            fieldName: 'requestKey',
            minWidth: 90,
            maxWidth: 125,
            isResizable: true
        },
        {
            key: 'columnEmployeeName',
            name: 'Employee Name',
            fieldName: 'requesterName',
            minWidth: 100,
            maxWidth: 150,
            isResizable: true
        },
        {
            key: 'columnEmployeeId',
            name: 'Employee ID',
            fieldName: 'employeeId',
            minWidth: 90,
            maxWidth: 110,
            isResizable: true,
            onRender: (item) => item.employeeId || '-'
        },
        {
            key: 'columnAssetType',
            name: 'Asset Type',
            fieldName: 'assetTitle',
            minWidth: 100,
            maxWidth: 120,
            isResizable: true
        },
        {
            key: 'columnQuantity',
            name: 'Quantity',
            fieldName: 'quantity',
            minWidth: 60,
            maxWidth: 80,
            isResizable: true
        },
        {
            key: 'columnReason',
            name: 'Reason for Request',
            fieldName: 'reason',
            minWidth: 150,
            maxWidth: 250,
            isResizable: true,
            onRender: (item) => item.reason || '-'
        },
        {
            key: 'columnPriority',
            name: 'Priority',
            fieldName: 'priority',
            minWidth: 80,
            maxWidth: 100,
            isResizable: true,
            onRender: (item) => {
                const priority = item.priority || 'Medium';
                let color = '#4b5563'; // default medium (gray)
                let backgroundColor = '#f3f4f6';
                if (priority === 'High') {
                    color = '#b91c1c';
                    backgroundColor = '#fee2e2';
                }
                else if (priority === 'Low') {
                    color = '#1e3a8a';
                    backgroundColor = '#dbeafe';
                }
                return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                        backgroundColor,
                        color,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                    } }, priority));
            }
        },
        {
            key: 'columnRequestDate',
            name: 'Request Date',
            fieldName: 'requestDate',
            minWidth: 100,
            maxWidth: 120,
            isResizable: true
        },
        ...(props.hideStatusColumn ? [] : [{
                key: 'column6',
                name: props.statusColumnLabel || 'Status',
                fieldName: props.statusField || 'status',
                minWidth: 80,
                maxWidth: 100,
                isResizable: true,
                onRender: (item) => {
                    let val = item[props.statusField || 'status'] || 'Pending';
                    if (val === 'Pending')
                        val = 'Pending';
                    let backgroundColor = '#fef3c7'; // default pending (yellow)
                    let textColor = '#92400e';
                    if (val === 'Approved') {
                        backgroundColor = '#dcfce7';
                        textColor = '#166534';
                    }
                    else if (val === 'Declined') {
                        backgroundColor = '#fee2e2';
                        textColor = '#991b1b';
                    }
                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                            backgroundColor,
                            color: textColor,
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            display: 'inline-block'
                        } }, val));
                }
            }]),
        ...(props.canApproveAsset ? [{
                key: 'columnAssetStatus',
                name: 'Asset Status',
                fieldName: 'assetStatus',
                minWidth: 200,
                maxWidth: 260,
                isResizable: true,
                onRender: (item) => {
                    const value = item.assetStatus || 'Pending';
                    const isApproved = value.toLowerCase().includes('approv');
                    const isBusy = props.actionInProgressId === item.id;
                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                backgroundColor: isApproved ? '#dcfce7' : '#fef3c7',
                                color: isApproved ? '#166534' : '#92400e',
                                padding: '4px 10px',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                display: 'inline-block'
                            } }, value),
                        !isApproved && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_1__.PrimaryButton, { text: "Review & Assign", onClick: () => {
                                if (props.onSelectRequestForAssignment) {
                                    props.onSelectRequestForAssignment(item);
                                }
                                else if (props.onApproveAsset) {
                                    props.onApproveAsset(item).catch(err => console.error(err));
                                }
                            }, disabled: isBusy, styles: {
                                root: { height: '24px', minHeight: '24px', padding: '0 8px', fontSize: '0.75rem', borderRadius: '4px', border: 'none' }
                            } }))));
                }
            }] : []),
        ...(props.showResponseColumns ? [
            { key: 'columnManagerResponse', name: 'Manager Response', fieldName: 'managerResponse', minWidth: 170, maxWidth: 240, isResizable: true },
            {
                key: 'columnAdminResponse',
                name: 'Admin Response',
                fieldName: 'assetStatus',
                minWidth: 140,
                maxWidth: 200,
                isResizable: true,
                onRender: (item) => {
                    const managerStatus = (item.status || '').toLowerCase();
                    if (managerStatus === 'pending') {
                        return react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#92400e', fontStyle: 'italic' } }, "Waiting on Manager");
                    }
                    if (managerStatus === 'declined' || managerStatus === 'rejected') {
                        return react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#991b1b', fontStyle: 'italic' } }, "N/A (Rejected)");
                    }
                    const isApproved = (item.assetStatus || '').toLowerCase().includes('approv');
                    return isApproved ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#166534', fontWeight: 600 } }, "Asset Allocated")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#92400e', fontWeight: 600 } }, "Pending Admin Approval"));
                }
            }
        ] : []),
        ...(props.canApproveReject ? [{
                key: 'column8',
                name: 'Actions',
                fieldName: 'actions',
                minWidth: 220,
                maxWidth: 260,
                isResizable: true,
                onRender: (item) => {
                    const isPending = (item.status || '').toLowerCase() === 'pending';
                    const isBusy = props.actionInProgressId === item.id;
                    if (!isPending) {
                        return react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: 'var(--text-muted)' } }, "No action");
                    }
                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '8px' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_1__.PrimaryButton, { text: "Approve", onClick: () => props.onApproveRequest && props.onApproveRequest(item), disabled: isBusy }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_1__.PrimaryButton, { text: "Reject", onClick: () => {
                                if (!props.onRejectRequest) {
                                    return;
                                }
                                const rejectionReason = window.prompt('Enter rejection reason for this request:');
                                if (!rejectionReason || !rejectionReason.trim()) {
                                    return;
                                }
                                props.onRejectRequest(item, rejectionReason.trim()).catch(err => console.error(err));
                            }, disabled: isBusy, styles: {
                                root: { backgroundColor: '#991b1b', borderColor: '#991b1b' },
                                rootHovered: { backgroundColor: '#7f1d1d', borderColor: '#7f1d1d' }
                            } })));
                }
            }] : [])
    ];
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '10px' } }, props.items.length === 0 ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { fontStyle: 'italic', color: 'var(--text-muted)' } }, "No asset requests found.")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_lib_DetailsList__WEBPACK_IMPORTED_MODULE_2__.DetailsList, { items: props.items, columns: columns, setKey: "set", layoutMode: _fluentui_react_lib_DetailsList__WEBPACK_IMPORTED_MODULE_3__.DetailsListLayoutMode.justified, selectionMode: _fluentui_react_lib_DetailsList__WEBPACK_IMPORTED_MODULE_4__.SelectionMode.none }))));
};


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("13d5df8411990d13daee")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=inventory-management-web-part.7db7fdb99b42f3eeb2ed.hot-update.js.map