"use strict";
self["webpackHotUpdate_56f8f2dc_8391_46cb_b74c_2806d6953063_0_0_1"]("inventory-management-web-part",{

/***/ 20867:
/*!**********************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/components/AssetTracking.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssetTracking: () => (/* binding */ AssetTracking)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 85959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fluentui/react */ 63208);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fluentui/react */ 46643);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fluentui/react */ 12042);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fluentui/react */ 21314);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fluentui/react */ 79370);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fluentui/react */ 74423);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fluentui/react */ 37805);
/* harmony import */ var _utils_RoleUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/RoleUtils */ 41094);



const AssetTracking = (props) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = react__WEBPACK_IMPORTED_MODULE_0__.useState();
    const stackTokens = { childrenGap: 20 };
    if (!_utils_RoleUtils__WEBPACK_IMPORTED_MODULE_1__.RoleUtils.canAssignAssets(props.currentUserRole)) {
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_2__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_3__.MessageBarType.error }, "You do not have permission to access the Asset Tracking section. Only Admins and Managers can assign assets."));
    }
    // Patch the Admin employee with the REAL user's email and name so that SharePoint's ensureUser works correctly
    const patchedEmployees = props.employees.map(emp => {
        if (emp.jobTitle === 'Admin') {
            return {
                ...emp,
                name: props.currentUserName || emp.name,
                email: props.currentUserEmail || emp.email
            };
        }
        return emp;
    });
    const employeeOptions = patchedEmployees.map(emp => ({
        key: emp.id,
        text: `${emp.name} (${emp.department})`
    }));
    const selectedEmployee = patchedEmployees.find(e => e.id === selectedEmployeeId);
    const normalize = (val) => (val || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const employeeAssignedAssets = props.items.filter(i => {
        if (!selectedEmployee)
            return false;
        const nameNorm = normalize(selectedEmployee.name);
        const assignedNorm = normalize(i.assignedTo);
        const isAssigned = assignedNorm && (assignedNorm === nameNorm || assignedNorm.includes(nameNorm) || nameNorm.includes(assignedNorm));
        const isNoted = (i.note || '').toLowerCase().includes('assigned to:') && normalize(i.note).includes(nameNorm);
        const isStatus = (i.status || '').toLowerCase().includes('assigned to:') && normalize(i.status).includes(nameNorm);
        return isAssigned || isNoted || isStatus;
    });
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px' } },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginTop: 0, marginBottom: '15px', color: '#111827' } }, "Select Employee"),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Dropdown, { placeholder: "Select an employee to view assets", options: employeeOptions, selectedKey: selectedEmployeeId, onChange: (_, option) => setSelectedEmployeeId(option?.key), styles: { dropdown: { width: 400 } } })),
        selectedEmployee && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_5__.Stack, { tokens: stackTokens },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginTop: 0, marginBottom: '15px', color: '#111827' } },
                    "Currently Assigned to ",
                    selectedEmployee.name),
                employeeAssignedAssets.length > 0 ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.DetailsList, { items: employeeAssignedAssets, columns: [
                        { key: 'col1', name: 'Asset Name', fieldName: 'assetName', minWidth: 150, maxWidth: 200, isResizable: true, onRender: item => item.assetName || item.title },
                        { key: 'col2', name: 'Type', fieldName: 'assetType', minWidth: 100, maxWidth: 150, isResizable: true },
                        { key: 'col3', name: 'Serial Number', fieldName: 'serialNumber', minWidth: 120, maxWidth: 180, isResizable: true },
                        { key: 'col4', name: 'Status', fieldName: 'status', minWidth: 100, maxWidth: 120, isResizable: true },
                        {
                            key: 'col5',
                            name: 'Assigned Date',
                            fieldName: 'assignedDate',
                            minWidth: 120,
                            maxWidth: 150,
                            isResizable: true,
                            onRender: item => {
                                if (!item.assignedDate)
                                    return 'N/A';
                                try {
                                    return new Date(item.assignedDate).toLocaleString();
                                }
                                catch {
                                    return item.assignedDate;
                                }
                            }
                        }
                    ], selectionMode: _fluentui_react__WEBPACK_IMPORTED_MODULE_7__.SelectionMode.none, layoutMode: _fluentui_react__WEBPACK_IMPORTED_MODULE_8__.DetailsListLayoutMode.justified })) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: '#6b7280', fontSize: '0.9rem' } }, "This employee has no assets currently assigned.")))))));
};


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("012b2e784f3adaae2c42")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=inventory-management-web-part.5679af95f4f560a7fd7e.hot-update.js.map