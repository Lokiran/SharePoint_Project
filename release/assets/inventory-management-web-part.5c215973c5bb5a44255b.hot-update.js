"use strict";
self["webpackHotUpdate_56f8f2dc_8391_46cb_b74c_2806d6953063_0_0_1"]("inventory-management-web-part",{

/***/ 28333:
/*!********************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/components/RequestForm.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RequestForm: () => (/* binding */ RequestForm)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 85959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fluentui/react */ 27006);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fluentui/react */ 18681);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fluentui/react */ 21314);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fluentui/react */ 63208);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fluentui/react */ 46643);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fluentui/react */ 12042);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fluentui/react */ 67102);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @fluentui/react */ 29425);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @fluentui/react */ 5613);
/* harmony import */ var _constants_DropdownConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/DropdownConstants */ 82889);



const stackTokens = { childrenGap: 15 };
const RequestForm = (props) => {
    const [selectedRequesterId, setSelectedRequesterId] = react__WEBPACK_IMPORTED_MODULE_0__.useState(undefined);
    const [employeeId, setEmployeeId] = react__WEBPACK_IMPORTED_MODULE_0__.useState('');
    const [managerName, setManagerName] = react__WEBPACK_IMPORTED_MODULE_0__.useState('');
    const [selectedAssetType, setSelectedAssetType] = react__WEBPACK_IMPORTED_MODULE_0__.useState(undefined);
    const [priority, setPriority] = react__WEBPACK_IMPORTED_MODULE_0__.useState('Medium');
    const [quantity, setQuantity] = react__WEBPACK_IMPORTED_MODULE_0__.useState(1);
    const [reason, setReason] = react__WEBPACK_IMPORTED_MODULE_0__.useState('');
    const [requestDate, setRequestDate] = react__WEBPACK_IMPORTED_MODULE_0__.useState(new Date().toISOString().split('T')[0]);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
        if (props.isOpen) {
            setRequestDate(new Date().toISOString().split('T')[0]);
        }
    }, [props.isOpen]);
    const isAdmin = props.currentUserRole === 'Admin';
    const isManager = props.currentUserRole === 'Inventory Manager';
    const isEmployee = props.currentUserRole === 'Inventory Employee';
    const currentUserOption = {
        id: 'current-user',
        name: props.currentUserName,
        email: '',
        department: 'Your Department',
        jobTitle: 'Employee'
    };
    const employeeExists = props.employees.some(emp => emp.name.toLowerCase() === props.currentUserName.toLowerCase());
    const allEmployees = employeeExists ? props.employees : [currentUserOption, ...props.employees];
    const availableEmployees = isEmployee
        ? allEmployees.filter(emp => emp.name.toLowerCase() === props.currentUserName.toLowerCase())
        : allEmployees;
    const employeeOptions = availableEmployees.map(emp => ({
        key: emp.id,
        text: `${emp.name} (${emp.department})`
    }));
    // Auto-select current user if employee
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
        if (isEmployee && employeeOptions.length === 1) {
            setSelectedRequesterId(employeeOptions[0].key);
            const emp = allEmployees.find(e => e.id === employeeOptions[0].key);
            if (emp) {
                setEmployeeId(emp.id);
            }
        }
    }, [isEmployee, employeeOptions, props.isOpen]);
    const uniqueAssetTypes = Array.from(new Set(props.availableAssets.map(a => a.assetType).filter(Boolean)));
    const dynamicAssetTypeOptions = uniqueAssetTypes.map(type => ({ key: type, text: type }));
    const assetTypeOptions = dynamicAssetTypeOptions.length > 0
        ? dynamicAssetTypeOptions
        : _constants_DropdownConstants__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_ASSET_TYPE_OPTIONS;
    const isFormValid = !!selectedRequesterId && !!employeeId.trim() && !!managerName.trim() && !!selectedAssetType && quantity > 0;
    const onSave = () => {
        // Validate role: employees can only request for themselves
        if (isEmployee && selectedRequesterId) {
            const selectedEmployee = allEmployees.find(e => e.id === selectedRequesterId);
            if (selectedEmployee && selectedEmployee.name.toLowerCase() !== props.currentUserName.toLowerCase()) {
                alert('Employees can only request assets for themselves.');
                return;
            }
        }
        const employee = allEmployees.find(e => e.id === selectedRequesterId);
        // Find a real asset ID to satisfy SharePoint backend lookups
        let matchingAsset = props.availableAssets.find(a => a.assetType === selectedAssetType &&
            (a.status === 'In Stock' || a.status === 'Yes'));
        if (!matchingAsset) {
            matchingAsset = props.availableAssets.find(a => a.assetType === selectedAssetType);
        }
        if (selectedAssetType && employee) {
            props.onSubmitRequest({
                requesterName: employee.name,
                employeeId: employeeId,
                managerName: managerName.trim(),
                assetId: matchingAsset ? matchingAsset.id : '1',
                assetTitle: selectedAssetType,
                priority: priority,
                quantity,
                reason,
                requestDate
            });
            setSelectedRequesterId(undefined);
            setEmployeeId('');
            setManagerName('');
            setSelectedAssetType(undefined);
            setPriority('Medium');
            setQuantity(1);
            setReason('');
            setRequestDate(new Date().toISOString().split('T')[0]);
            props.onClose();
        }
    };
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_2__.Panel, { isOpen: props.isOpen, onDismiss: props.onClose, type: _fluentui_react__WEBPACK_IMPORTED_MODULE_3__.PanelType.custom, customWidth: "100%", styles: { main: { maxWidth: '450px' } }, headerText: "Request an Asset", closeButtonAriaLabel: "Close" },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Stack, { tokens: stackTokens },
            isEmployee && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_5__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_6__.MessageBarType.info }, "You can only request assets for yourself. Contact your manager to request assets for others.")),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.Dropdown, { label: isEmployee ? "Requester (You)" : "Requester (Employee)", selectedKey: selectedRequesterId, options: employeeOptions, onChange: (_, opt) => {
                    const empId = opt?.key;
                    setSelectedRequesterId(empId);
                    const emp = allEmployees.find(e => e.id === empId);
                    if (emp) {
                        setEmployeeId(emp.id);
                    }
                }, required: true, disabled: isEmployee && employeeOptions.length === 1 }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.TextField, { label: "Employee ID", value: employeeId, onChange: (_, val) => setEmployeeId(val || ''), required: true }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.TextField, { label: "Manager's Name", value: managerName, onChange: (_, val) => setManagerName(val || ''), placeholder: "Enter manager's name", required: true }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.TextField, { label: "Requested Date", type: "date", value: requestDate, onChange: (_, val) => setRequestDate(val || ''), required: true }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.Dropdown, { label: "Asset Type", selectedKey: selectedAssetType, options: assetTypeOptions, onChange: (_, opt) => {
                    setSelectedAssetType(opt?.key);
                }, required: true }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.Dropdown, { label: "Priority", selectedKey: priority, options: _constants_DropdownConstants__WEBPACK_IMPORTED_MODULE_1__.ASSET_REQUEST_PRIORITY_OPTIONS, onChange: (_, opt) => setPriority(opt?.key), required: true }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.TextField, { label: "Quantity", type: "number", value: quantity.toString(), onChange: (_, val) => setQuantity(parseInt(val || '0')), required: true }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.TextField, { label: "Reason for Request", multiline: true, rows: 3, value: reason, onChange: (_, val) => setReason(val || '') }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Stack, { horizontal: true, tokens: stackTokens, style: { marginTop: 20 } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.PrimaryButton, { text: "Submit Request", onClick: onSave, disabled: !isFormValid }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_10__.DefaultButton, { text: "Cancel", onClick: props.onClose })))));
};


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("50dc5a21b20f446eaefe")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=inventory-management-web-part.5c215973c5bb5a44255b.hot-update.js.map