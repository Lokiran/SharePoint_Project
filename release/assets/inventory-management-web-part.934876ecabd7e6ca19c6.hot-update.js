"use strict";
self["webpackHotUpdate_56f8f2dc_8391_46cb_b74c_2806d6953063_0_0_1"]("inventory-management-web-part",{

/***/ 217:
/*!***********************************************************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/components/ReplacementHistory/ReplacementHistory.module.scss.css ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/@microsoft/sp-css-loader/node_modules/@microsoft/load-themed-styles/lib-es6/index.js */ 96323);
// Imports


_node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__.loadStyles(".replacementHistory_b9999860 .filterSection_b9999860{display:flex;flex-wrap:wrap;gap:15px;margin-bottom:20px}@media (max-width:768px){.replacementHistory_b9999860 .filterSection_b9999860{flex-direction:column}}.replacementHistory_b9999860 .statusBadge_b9999860{border-radius:4px;display:inline-block;font-size:12px;font-weight:600;padding:6px 12px;text-align:center}", true);

// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  replacementHistory: "replacementHistory_b9999860",
  filterSection: "filterSection_b9999860",
  statusBadge: "statusBadge_b9999860"
});


/***/ }),

/***/ 46615:
/*!*********************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/components/EventFilters.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventFilters: () => (/* binding */ EventFilters)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 85959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @fluentui/react */ 21262);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fluentui/react */ 5613);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fluentui/react */ 12042);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fluentui/react */ 21314);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fluentui/react */ 46412);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fluentui/react */ 72674);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fluentui/react */ 44533);


const EventFilters = (props) => {
    const { filters, onChange, onClear, actionsList, assetTypesList, usersList } = props;
    const dateOptions = [
        { key: 'All', text: 'All Time' },
        { key: 'Today', text: 'Today' },
        { key: 'Yesterday', text: 'Yesterday' },
        { key: 'Last7', text: 'Last 7 Days' },
        { key: 'Last15', text: 'Last 15 Days' },
        { key: 'Last30', text: 'Last 30 Days' },
        { key: 'Last60', text: 'Last 60 Days' },
        { key: 'Last90', text: 'Last 90 Days' },
        { key: 'ThisWeek', text: 'This Week' },
        { key: 'ThisMonth', text: 'This Month' },
        { key: 'Custom', text: 'Custom Date Range' }
    ];
    const moduleOptions = [
        { key: 'All', text: 'All Modules' },
        { key: 'Inventory', text: 'Inventory' },
        { key: 'Requests', text: 'Requests' },
        { key: 'Returns', text: 'Returns' },
        { key: 'Users', text: 'Users' },
        { key: 'Reports', text: 'Reports' },
        { key: 'Configuration', text: 'Configuration' },
        { key: 'Notifications', text: 'Notifications' }
    ];
    const statusOptions = [
        { key: 'All', text: 'All Statuses' },
        { key: 'Pending', text: 'Pending' },
        { key: 'Approved', text: 'Approved' },
        { key: 'Rejected', text: 'Rejected' },
        { key: 'Assigned', text: 'Assigned' },
        { key: 'Returned', text: 'Returned' },
        { key: 'Completed', text: 'Completed' }
    ];
    const sortOptions = [
        { key: 'NewestFirst', text: 'Newest First' },
        { key: 'OldestFirst', text: 'Oldest First' },
        { key: 'AssetNameAZ', text: 'Asset Name A-Z' },
        { key: 'AssetNameZA', text: 'Asset Name Z-A' },
        { key: 'UserAZ', text: 'User A-Z' },
        { key: 'UserZA', text: 'User Z-A' }
    ];
    const actionOptions = [
        { key: 'All', text: 'All Actions' },
        ...actionsList.map(action => ({
            key: action,
            text: action.charAt(0).toUpperCase() + action.slice(1)
        }))
    ];
    const assetTypeOptions = [
        { key: 'All', text: 'All Assets' },
        ...assetTypesList.map(type => ({
            key: type,
            text: type
        }))
    ];
    const userOptions = [
        { key: 'All', text: 'All Users' },
        ...usersList.map(user => ({
            key: user,
            text: user
        }))
    ];
    // Helper to check if any filter is active (excluding default search/sort)
    const hasActiveFilters = filters.dateRangeType !== 'All' ||
        filters.action !== 'All' ||
        filters.module !== 'All' ||
        filters.assetType !== 'All' ||
        filters.user !== 'All' ||
        filters.status !== 'All';
    // Format date range labels for chips
    const getDateLabel = () => {
        if (filters.dateRangeType !== 'Custom') {
            return dateOptions.find(o => o.key === filters.dateRangeType)?.text || filters.dateRangeType;
        }
        const startStr = filters.startDate ? new Date(filters.startDate).toLocaleDateString() : '';
        const endStr = filters.endDate ? new Date(filters.endDate).toLocaleDateString() : '';
        return `${startStr} - ${endStr}`;
    };
    const handleDateChange = (type) => {
        onChange({
            ...filters,
            dateRangeType: type,
            startDate: type === 'Custom' ? filters.startDate || new Date() : undefined,
            endDate: type === 'Custom' ? filters.endDate || new Date() : undefined
        });
    };
    // Date range validation
    const isDateRangeInvalid = filters.dateRangeType === 'Custom' &&
        filters.startDate &&
        filters.endDate &&
        new Date(filters.startDate) > new Date(filters.endDate);
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' } },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_1__.SearchBox, { placeholder: "Search by asset name, title, details, user, or action...", value: filters.searchQuery, onChange: (_, newValue) => onChange({ ...filters, searchQuery: newValue || '' }), onClear: () => onChange({ ...filters, searchQuery: '' }), styles: { root: { flexGrow: 1, minWidth: '300px' } } }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_2__.DefaultButton, { text: "Clear Filters", iconProps: { iconName: 'ClearFilter' }, onClick: onClear, disabled: !hasActiveFilters && !filters.searchQuery })),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px'
            } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.Dropdown, { label: "Date Range", selectedKey: filters.dateRangeType, options: dateOptions, onChange: (_, option) => option && handleDateChange(option.key) }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.Dropdown, { label: "Action", selectedKey: filters.action, options: actionOptions, onChange: (_, option) => option && onChange({ ...filters, action: option.key }) }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.Dropdown, { label: "Module", selectedKey: filters.module, options: moduleOptions, onChange: (_, option) => option && onChange({ ...filters, module: option.key }) }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.Dropdown, { label: "Asset Type", selectedKey: filters.assetType, options: assetTypeOptions, onChange: (_, option) => option && onChange({ ...filters, assetType: option.key }) }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.Dropdown, { label: "User", selectedKey: filters.user, options: userOptions, onChange: (_, option) => option && onChange({ ...filters, user: option.key }) }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.Dropdown, { label: "Status", selectedKey: filters.status, options: statusOptions, onChange: (_, option) => option && onChange({ ...filters, status: option.key }) }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.Dropdown, { label: "Sort Order", selectedKey: filters.sortOrder, options: sortOptions, onChange: (_, option) => option && onChange({ ...filters, sortOrder: option.key }) })),
        filters.dateRangeType === 'Custom' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Stack, { horizontal: true, wrap: true, tokens: { childrenGap: 16 }, style: { alignItems: 'flex-end', backgroundColor: '#f3f2f1', padding: '12px', borderRadius: '4px' } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_5__.DatePicker, { label: "Start Date", value: filters.startDate, onSelectDate: (date) => date && onChange({ ...filters, startDate: date }), placeholder: "Select a start date..." })),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_5__.DatePicker, { label: "End Date", value: filters.endDate, onSelectDate: (date) => date && onChange({ ...filters, endDate: date }), placeholder: "Select an end date..." })),
            isDateRangeInvalid && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.Text, { style: { color: '#a80000', alignSelf: 'center', fontWeight: 'bold' } }, "Warning: Start Date must be less than or equal to End Date.")))),
        hasActiveFilters && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '4px' } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.Text, { variant: "smallPlus", style: { color: 'var(--text-muted)', marginRight: '4px', fontWeight: 'bold' } }, "Active Filters:"),
            filters.dateRangeType !== 'All' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: chipStyle },
                getDateLabel(),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.IconButton, { iconProps: { iconName: 'Cancel' }, onClick: () => handleDateChange('All'), styles: chipButtonStyles }))),
            filters.action !== 'All' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: chipStyle },
                "Action: ",
                filters.action,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.IconButton, { iconProps: { iconName: 'Cancel' }, onClick: () => onChange({ ...filters, action: 'All' }), styles: chipButtonStyles }))),
            filters.module !== 'All' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: chipStyle },
                "Module: ",
                filters.module,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.IconButton, { iconProps: { iconName: 'Cancel' }, onClick: () => onChange({ ...filters, module: 'All' }), styles: chipButtonStyles }))),
            filters.assetType !== 'All' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: chipStyle },
                "Asset: ",
                filters.assetType,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.IconButton, { iconProps: { iconName: 'Cancel' }, onClick: () => onChange({ ...filters, assetType: 'All' }), styles: chipButtonStyles }))),
            filters.user !== 'All' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: chipStyle },
                "User: ",
                filters.user,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.IconButton, { iconProps: { iconName: 'Cancel' }, onClick: () => onChange({ ...filters, user: 'All' }), styles: chipButtonStyles }))),
            filters.status !== 'All' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: chipStyle },
                "Status: ",
                filters.status,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.IconButton, { iconProps: { iconName: 'Cancel' }, onClick: () => onChange({ ...filters, status: 'All' }), styles: chipButtonStyles }))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_2__.DefaultButton, { text: "Clear All", onClick: onClear, styles: { root: { height: 26, minWidth: 0, padding: '0 8px', fontSize: '0.8rem' } } })))));
};
const chipStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#edebe9',
    padding: '2px 8px',
    borderRadius: '16px',
    fontSize: '0.8rem',
    color: '#323130',
    border: '1px solid #d2d0ce',
    gap: '4px'
};
const chipButtonStyles = {
    root: { width: 14, height: 14, marginLeft: 2, padding: 0 },
    icon: { fontSize: 8, color: '#605e5c' }
};


/***/ }),

/***/ 19581:
/*!**********************************************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/components/IncidentRequest/IncidentRequestModule.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IncidentRequestModule: () => (/* binding */ IncidentRequestModule)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 85959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fluentui/react */ 46643);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fluentui/react */ 27006);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fluentui/react */ 18681);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fluentui/react */ 21314);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fluentui/react */ 63208);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @fluentui/react */ 67102);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @fluentui/react */ 12042);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @fluentui/react */ 29425);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @fluentui/react */ 5613);
/* harmony import */ var _IncidentRequestModule_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./IncidentRequestModule.module.scss */ 39131);
/* harmony import */ var _services_IncidentService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/IncidentService */ 76911);
/* harmony import */ var _constants_DropdownConstants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../constants/DropdownConstants */ 82889);






const incidentTypeOptions = _constants_DropdownConstants__WEBPACK_IMPORTED_MODULE_3__.INCIDENT_TYPE_OPTIONS;
const priorityOptions = _constants_DropdownConstants__WEBPACK_IMPORTED_MODULE_3__.INCIDENT_PRIORITY_OPTIONS;
const raisedToOptions = [
    { key: 'Admin', text: 'Admin' }
];
const IncidentRequestModule = (props) => {
    const [formData, setFormData] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
        employeeName: props.userDisplayName || '',
        employeeId: props.employeeId || '',
        employeeEmail: props.userEmail || '',
        serialNo: '',
        assetName: '',
        incidentType: '',
        priority: 'Medium',
        description: '',
        raisedDate: new Date().toLocaleString(),
        status: 'Open',
        raisedTo: 'Admin',
        assignedDate: '',
    });
    const [assignedAssets, setAssignedAssets] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
    const [isLoadingAssets, setIsLoadingAssets] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
    const [message, setMessage] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
    const [isSubmitting, setIsSubmitting] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        const timer = setTimeout(() => {
            loadAssignedAssetsForName(formData.employeeName);
        }, 500);
        return () => clearTimeout(timer);
    }, [formData.employeeName]);
    const prevIsOpenRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(props.isOpen);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        setFormData((prev) => ({
            ...prev,
            employeeName: props.userDisplayName || '',
            employeeId: props.employeeId || '',
            employeeEmail: props.userEmail || '',
        }));
    }, [props.userDisplayName, props.employeeId, props.userEmail]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        if (props.isOpen && !prevIsOpenRef.current) {
            // Panel just opened! Reset fields.
            setFormData((prev) => ({
                ...prev,
                assetName: props.preselectedAsset ? (props.preselectedAsset.assetName || props.preselectedAsset.title) : '',
                serialNo: props.preselectedAsset ? props.preselectedAsset.serialNumber : '',
                incidentType: props.preselectedIncidentType ? props.preselectedIncidentType : '',
                description: '',
            }));
        }
        else if (props.preselectedAsset || props.preselectedIncidentType) {
            // Sync preselected asset or incident type if props update while open
            setFormData((prev) => ({
                ...prev,
                assetName: props.preselectedAsset ? (props.preselectedAsset.assetName || props.preselectedAsset.title) : prev.assetName,
                serialNo: props.preselectedAsset ? props.preselectedAsset.serialNumber : prev.serialNo,
                incidentType: props.preselectedIncidentType ? props.preselectedIncidentType : prev.incidentType,
            }));
        }
        prevIsOpenRef.current = props.isOpen;
    }, [props.isOpen, props.preselectedAsset, props.preselectedIncidentType]);
    const loadAssignedAssetsForName = async (name) => {
        if (!name.trim()) {
            setAssignedAssets([]);
            setIsLoadingAssets(false);
            return;
        }
        try {
            setIsLoadingAssets(true);
            const service = new _services_IncidentService__WEBPACK_IMPORTED_MODULE_2__.IncidentService(props.spContext);
            const details = await service.getEmployeeDetailsByName(name);
            setFormData(prev => ({
                ...prev,
                employeeId: details.employeeId || prev.employeeId,
                employeeEmail: details.email || prev.employeeEmail
            }));
            const assets = await service.getEmployeeAssignedAssets(details.email || details.employeeName);
            setAssignedAssets(assets);
        }
        catch (error) {
            console.error('Error loading assigned assets:', error);
            setAssignedAssets([]);
        }
        finally {
            setIsLoadingAssets(false);
        }
    };
    const handleInputChange = (fieldName, value) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };
    const handleSubmit = async () => {
        try {
            if (!formData.incidentType || !formData.description) {
                setMessage({ type: _fluentui_react__WEBPACK_IMPORTED_MODULE_4__.MessageBarType.error, text: 'Please fill in all required fields.' });
                return;
            }
            setIsSubmitting(true);
            const service = new _services_IncidentService__WEBPACK_IMPORTED_MODULE_2__.IncidentService(props.spContext);
            const payload = {
                ...formData,
                employeeEmail: formData.employeeEmail || props.userEmail,
                employeeName: formData.employeeName,
                employeeId: formData.employeeId,
            };
            console.log('Submitting incident payload:', payload);
            await service.createIncidentRequest(payload);
            props.onClose();
            setFormData({
                employeeName: props.userDisplayName || '',
                employeeId: props.employeeId || '',
                employeeEmail: props.userEmail || '',
                serialNo: '',
                assetName: '',
                incidentType: '',
                priority: 'Medium',
                description: '',
                raisedDate: new Date().toLocaleString(),
                status: 'Open',
                raisedTo: 'Admin',
                assignedDate: '',
            });
            setMessage(null);
            if (props.onSuccessPopup) {
                props.onSuccessPopup({
                    incidentType: formData.incidentType,
                    assetName: formData.assetName || 'General Device',
                    requesterName: formData.employeeName,
                    priority: formData.priority
                });
            }
        }
        catch (error) {
            console.error('Error submitting incident:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to report incident. Please try again.';
            setMessage({ type: _fluentui_react__WEBPACK_IMPORTED_MODULE_4__.MessageBarType.error, text: `Error: ${errorMessage}` });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleCancel = () => {
        setFormData({
            employeeName: props.userDisplayName || '',
            employeeId: props.employeeId || '',
            employeeEmail: props.userEmail || '',
            serialNo: '',
            assetName: '',
            incidentType: '',
            priority: 'Medium',
            description: '',
            raisedDate: new Date().toLocaleString(),
            status: 'Open',
            raisedTo: 'Admin',
            assignedDate: '',
        });
        setMessage(null);
        props.onClose();
    };
    const assetOptions = assignedAssets.map(a => ({
        key: a.id,
        text: `${a.assetName} (S/N: ${a.serialNumber || 'N/A'})`,
    }));
    const selectedAssetKey = assignedAssets.find(a => a.serialNumber === formData.serialNo && a.assetName === formData.assetName)?.id;
    const isReplacementMode = props.preselectedIncidentType === 'Replacement Request';
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_5__.Panel, { isOpen: props.isOpen, onDismiss: props.onClose, type: _fluentui_react__WEBPACK_IMPORTED_MODULE_6__.PanelType.custom, customWidth: "100%", styles: { main: { maxWidth: '450px' } }, headerText: isReplacementMode ? "Request Asset Replacement" : "Raise Incident", closeButtonAriaLabel: "Close" },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _IncidentRequestModule_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].incidentRequestModule },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.Stack, { tokens: { childrenGap: 15 } },
                message && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.MessageBar, { messageBarType: message.type, isMultiline: true }, message.text)),
                !isLoadingAssets && assignedAssets.length === 0 && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_4__.MessageBarType.info }, isReplacementMode
                    ? "You currently have no assets assigned to request a replacement for."
                    : "You currently have no assets assigned. You can still raise generic incidents.")),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.TextField, { label: "Employee Name", value: formData.employeeName, onChange: (ev, val) => handleInputChange('employeeName', val || ''), required: true }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_10__.Dropdown, { label: "Select Assigned Asset", placeholder: isLoadingAssets ? "Loading assets..." : "Choose one of your assigned assets", options: assetOptions, selectedKey: selectedAssetKey, onChange: (ev, option) => {
                        const selected = assignedAssets.find(a => a.id === option?.key);
                        if (selected) {
                            handleInputChange('assetName', selected.assetName);
                            handleInputChange('serialNo', selected.serialNumber);
                            handleInputChange('assignedDate', selected.assignmentDate);
                        }
                        else {
                            handleInputChange('assetName', '');
                            handleInputChange('serialNo', '');
                            handleInputChange('assignedDate', '');
                        }
                    }, disabled: isLoadingAssets }),
                formData.assetName && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.TextField, { label: "Asset Name", value: formData.assetName, disabled: true })),
                formData.serialNo && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.TextField, { label: "Serial NO", value: formData.serialNo, disabled: true })),
                !isReplacementMode && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_10__.Dropdown, { label: "Issue Type", options: incidentTypeOptions, selectedKey: formData.incidentType, onChange: (ev, option) => handleInputChange('incidentType', option?.key), required: true, placeholder: "Select Issue Type" })),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_10__.Dropdown, { label: "Priority", options: priorityOptions, selectedKey: formData.priority, onChange: (ev, option) => handleInputChange('priority', option?.key) }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.TextField, { label: isReplacementMode ? "Reason for Replacement" : "Description", multiline: true, rows: 5, placeholder: isReplacementMode ? "Describe the reason for replacement..." : "Describe the issue...", value: formData.description, onChange: (ev, newValue) => handleInputChange('description', newValue), required: true }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_10__.Dropdown, { label: "Raised To", options: raisedToOptions, selectedKey: formData.raisedTo, onChange: (ev, option) => handleInputChange('raisedTo', option?.key), placeholder: "Select Team" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.TextField, { label: "Raised Date", value: formData.raisedDate, readOnly: true }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.TextField, { label: "Status", value: formData.status, readOnly: true }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.Stack, { horizontal: true, tokens: { childrenGap: 10 }, style: { marginTop: 20 } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_11__.PrimaryButton, { text: isReplacementMode ? "Request Replacement" : "Report Incident", onClick: handleSubmit, disabled: isSubmitting }),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_12__.DefaultButton, { text: "Cancel", onClick: handleCancel }))))));
};


/***/ }),

/***/ 50513:
/*!****************************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/components/InventoryManagement.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InventoryManagement)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 85959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./InventoryManagement.module.scss */ 99623);
/* harmony import */ var _microsoft_sp_lodash_subset__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @microsoft/sp-lodash-subset */ 50529);
/* harmony import */ var _microsoft_sp_lodash_subset__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_lodash_subset__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _InventoryList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./InventoryList */ 4938);
/* harmony import */ var _MyAssignedAssetsView__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./MyAssignedAssetsView */ 95966);
/* harmony import */ var _MyRequestsView__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./MyRequestsView */ 12645);
/* harmony import */ var _RequestList__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./RequestList */ 82867);
/* harmony import */ var _pnpjsConfig__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../pnpjsConfig */ 17694);
/* harmony import */ var _AssetForm__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./AssetForm */ 5652);
/* harmony import */ var _RequestForm__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./RequestForm */ 28333);
/* harmony import */ var _EventStream__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./EventStream */ 19178);
/* harmony import */ var _ReturnAssetForm__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./ReturnAssetForm */ 21094);
/* harmony import */ var _ReturnRequestList__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ReturnRequestList */ 18397);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @fluentui/react */ 46643);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @fluentui/react */ 21314);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! @fluentui/react */ 52394);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @fluentui/react */ 63208);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! @fluentui/react */ 53918);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! @fluentui/react */ 27006);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! @fluentui/react */ 18681);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! @fluentui/react */ 12042);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! @fluentui/react */ 67102);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! @fluentui/react */ 29425);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! @fluentui/react */ 5613);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! @fluentui/react */ 92070);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! @fluentui/react */ 15369);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! @fluentui/react */ 79370);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! @fluentui/react */ 37805);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(/*! @fluentui/react */ 74423);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(/*! @fluentui/react */ 20472);
/* harmony import */ var chart_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! chart.js */ 55277);
/* harmony import */ var react_chartjs_2__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! react-chartjs-2 */ 86766);
/* harmony import */ var jspdf__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! jspdf */ 28339);
/* harmony import */ var _pnp_sp_site_users_web__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @pnp/sp/site-users/web */ 43500);
/* harmony import */ var _pnp_sp_site_groups_web__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @pnp/sp/site-groups/web */ 49036);
/* harmony import */ var _data_mockData__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../data/mockData */ 27962);
/* harmony import */ var _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../services/InventoryService */ 29619);
/* harmony import */ var _services_EmailService__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../services/EmailService */ 407);
/* harmony import */ var _AssetTracking__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./AssetTracking */ 20867);
/* harmony import */ var _pages__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../pages */ 56330);
/* harmony import */ var _NotificationCenter__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./NotificationCenter */ 58350);
/* harmony import */ var _IncidentRequest_IncidentRequestModule__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./IncidentRequest/IncidentRequestModule */ 19581);
/* harmony import */ var _ReplacementHistory_ReplacementHistory__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./ReplacementHistory/ReplacementHistory */ 635);
/* harmony import */ var _AssetLifecycleDiagram__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./AssetLifecycleDiagram */ 29643);
/* harmony import */ var _WorkflowPopup__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./WorkflowPopup */ 48235);

















chart_js__WEBPACK_IMPORTED_MODULE_14__.Chart.register(chart_js__WEBPACK_IMPORTED_MODULE_14__.CategoryScale, chart_js__WEBPACK_IMPORTED_MODULE_14__.LinearScale, chart_js__WEBPACK_IMPORTED_MODULE_14__.ArcElement, chart_js__WEBPACK_IMPORTED_MODULE_14__.BarElement, chart_js__WEBPACK_IMPORTED_MODULE_14__.Title, chart_js__WEBPACK_IMPORTED_MODULE_14__.Tooltip, chart_js__WEBPACK_IMPORTED_MODULE_14__.Legend);












class InventoryManagement extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor(props) {
        super(props);
        this._isRequestOwnedByCurrentUser = (requesterName, currentUser) => {
            const normalize = (value) => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const requestOwner = normalize(requesterName);
            const activeUser = normalize(currentUser);
            if (!requestOwner || !activeUser) {
                return false;
            }
            return requestOwner === activeUser || requestOwner.includes(activeUser) || activeUser.includes(requestOwner);
        };
        this._isAssetAssignedToCurrentUser = (item, currentUser) => {
            const normalize = (value) => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const activeUser = normalize(currentUser);
            if (!activeUser)
                return false;
            // 1. Check item status - returned or in-stock assets are no longer assigned
            const statusLower = (item.status || '').toLowerCase().trim();
            if (statusLower === 'in stock' ||
                statusLower === 'instock' ||
                statusLower === 'available' ||
                statusLower === 'returned' ||
                statusLower === 'return approved' ||
                statusLower === 'returnapproved' ||
                statusLower === 'under maintenance' ||
                statusLower === 'damaged' ||
                statusLower === 'disposed' ||
                statusLower === 'retired') {
                return false;
            }
            // 2. Check if there is a completed return request for this asset
            const returnRequests = this.state ? this.state.returnRequests : [];
            if (returnRequests && returnRequests.length > 0) {
                const isReturned = returnRequests.some(r => {
                    const isSameAsset = (r.assetId && r.assetId === item.id) ||
                        (r.serialNumber && item.serialNumber && r.serialNumber.toLowerCase().trim() === item.serialNumber.toLowerCase().trim()) ||
                        (r.assetName && item.assetName && r.assetName.toLowerCase().trim() === item.assetName.toLowerCase().trim() && normalize(r.requesterName) === activeUser);
                    const isCompleted = r.status === 'Completed' || r.status === 'Returned' || r.adminStatus === 'Completed';
                    return isSameAsset && isCompleted;
                });
                if (isReturned) {
                    return false;
                }
            }
            // 3. Match user assignment
            const assignedNorm = normalize(item.assignedTo);
            const isAssigned = assignedNorm && (assignedNorm === activeUser || assignedNorm.includes(activeUser) || activeUser.includes(assignedNorm));
            const isNoted = (item.note || '').toLowerCase().includes('assigned to:') && normalize(item.note).includes(activeUser);
            const isStatus = (item.status || '').toLowerCase().includes('assigned to:') && normalize(item.status).includes(activeUser);
            return !!(isAssigned || isNoted || isStatus);
        };
        this._getNotifications = () => {
            const { items, requests, activeUserDisplayName } = this.state;
            const currentUser = activeUserDisplayName;
            const effectiveRole = this.state.previewRole || this.state.userRole;
            const isAdminOrManager = effectiveRole === 'Admin' || effectiveRole === 'Inventory Manager';
            const isAdmin = effectiveRole === 'Admin';
            const isManager = effectiveRole === 'Inventory Manager';
            const notifications = [];
            const readIds = new Set(this.state.readNotificationIds);
            const clearedIds = new Set(this.state.clearedNotificationIds);
            const normalize = (value) => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const activeUserNorm = normalize(currentUser);
            const formatTime = (isoString) => {
                if (!isoString)
                    return '';
                try {
                    const d = new Date(isoString);
                    const pad = (n) => n < 10 ? '0' + n : '' + n;
                    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
                }
                catch {
                    return isoString;
                }
            };
            // 1. Generate Asset Request Notifications
            requests.forEach(req => {
                const requesterNorm = normalize(req.requesterName);
                const isMyRequest = requesterNorm && (requesterNorm === activeUserNorm || activeUserNorm.includes(requesterNorm) || requesterNorm.includes(activeUserNorm));
                if (isAdminOrManager) {
                    // Pending requests notify Admins & Managers
                    if (req.status === 'Pending') {
                        const id = `req-pending-${req.id}`;
                        if (!clearedIds.has(id)) {
                            notifications.push({
                                id,
                                title: "Asset Request Pending",
                                message: `${req.requesterName} requested ${req.quantity}x ${req.assetTitle} (Reason: ${req.reason || "None"})`,
                                type: 'info',
                                timestamp: formatTime(req.requestDate),
                                isRead: readIds.has(id),
                                actionLink: 'Approvals',
                                category: 'Request'
                            });
                        }
                    }
                }
                if (isMyRequest) {
                    // Approved/Declined requests notify the Employee
                    if (req.status === 'Approved' || req.status === 'Declined') {
                        const id = `req-resolved-${req.id}-${req.status}`;
                        if (!clearedIds.has(id)) {
                            notifications.push({
                                id,
                                title: req.status === 'Approved' ? "Request Approved" : "Request Declined",
                                message: req.status === 'Approved'
                                    ? `Your request for ${req.quantity}x ${req.assetTitle} has been approved.`
                                    : `Your request for ${req.quantity}x ${req.assetTitle} has been declined.`,
                                type: req.status === 'Approved' ? 'success' : 'error',
                                timestamp: formatTime(req.requestDate),
                                isRead: readIds.has(id),
                                actionLink: 'My Requests',
                                category: 'Request'
                            });
                        }
                    }
                }
                if (isAdmin && req.status === 'Approved' && req.assetStatus === 'Pending') {
                    const id = `req-assign-admin-${req.id}`;
                    if (!clearedIds.has(id)) {
                        notifications.push({
                            id,
                            title: "Asset Ready for Assignment",
                            message: `${req.requesterName}'s request for ${req.quantity}x ${req.assetTitle} is approved and ready for assignment.`,
                            type: 'info',
                            timestamp: formatTime(req.requestDate),
                            isRead: readIds.has(id),
                            actionLink: 'AssetAssignmentQueue',
                            category: 'Request'
                        });
                    }
                }
            });
            // 2. Generate Asset Assignment & Audit Notifications
            items.forEach(item => {
                const assignedNorm = normalize(item.assignedTo);
                const isMyAsset = assignedNorm && (assignedNorm === activeUserNorm || activeUserNorm.includes(assignedNorm) || assignedNorm.includes(activeUserNorm));
                const isNotedMyAsset = (item.note || '').toLowerCase().includes('assigned to:') && normalize(item.note).includes(activeUserNorm);
                if (isMyAsset || isNotedMyAsset) {
                    // Asset Assignment notifies the Employee
                    const id = `asset-assigned-${item.id}`;
                    if (!clearedIds.has(id)) {
                        notifications.push({
                            id,
                            title: "Asset Assigned",
                            message: `Asset '${item.assetName || item.title}' (${item.serialNumber || 'N/A'}) has been assigned to you.`,
                            type: 'success',
                            timestamp: formatTime(item.assignedDate || item.purchaseDate),
                            isRead: readIds.has(id),
                            actionLink: 'My Assets',
                            category: 'Assignment'
                        });
                    }
                }
                if (isAdminOrManager) {
                    // When status is 'Assigned', notify Admin/Manager of assignments
                    if (item.status === 'Assigned') {
                        const id = `asset-assigned-admin-${item.id}`;
                        if (!clearedIds.has(id)) {
                            notifications.push({
                                id,
                                title: "Asset Assigned to Employee",
                                message: `Asset '${item.assetName || item.title}' (${item.serialNumber || 'N/A'}) is assigned to ${item.assignedTo || "Employee"}.`,
                                type: 'info',
                                timestamp: formatTime(item.assignedDate || item.purchaseDate),
                                isRead: readIds.has(id),
                                actionLink: 'Asset Tracking',
                                category: 'Assignment'
                            });
                        }
                    }
                    // Audit/Maintenance warnings
                    if (item.status === 'Under Maintenance' || item.condition === 'Damaged' || item.condition === 'Poor') {
                        const id = `asset-maintenance-${item.id}-${item.status}-${item.condition}`;
                        if (!clearedIds.has(id)) {
                            notifications.push({
                                id,
                                title: "Asset Status Alert",
                                message: `Asset '${item.assetName || item.title}' is in ${item.condition} condition and marked as ${item.status}.`,
                                type: 'warning',
                                timestamp: formatTime(item.purchaseDate),
                                isRead: readIds.has(id),
                                actionLink: 'Inventory',
                                category: 'Audit'
                            });
                        }
                    }
                }
            });
            // 3. Generate Asset Return Notifications
            const returnRequests = this.state.returnRequests || [];
            returnRequests.forEach(ret => {
                const isMyReturn = normalize(ret.requesterName) === activeUserNorm || activeUserNorm.includes(normalize(ret.requesterName)) || normalize(ret.requesterName).includes(activeUserNorm);
                if (isAdminOrManager) {
                    if (isManager && (ret.status === 'Pending Manager Approval' || ret.status === 'Pending')) {
                        const id = `ret-pending-mgr-${ret.id}`;
                        if (!clearedIds.has(id)) {
                            notifications.push({
                                id,
                                title: "Asset Return Pending Manager Approval",
                                message: `${ret.requesterName} requested to return ${ret.assetName} (Reason: ${ret.returnReason || "None"})`,
                                type: 'info',
                                timestamp: formatTime(ret.requestDate),
                                isRead: readIds.has(id),
                                actionLink: 'AssetReturns',
                                category: 'Request'
                            });
                        }
                    }
                    else if (isAdmin && ret.status === 'Pending Admin Verification') {
                        const id = `ret-pending-adm-${ret.id}`;
                        if (!clearedIds.has(id)) {
                            notifications.push({
                                id,
                                title: "Asset Return Pending Admin Verification",
                                message: `Manager approved return of ${ret.assetName} by ${ret.requesterName}. Awaiting Admin verification.`,
                                type: 'info',
                                timestamp: formatTime(ret.requestDate),
                                isRead: readIds.has(id),
                                actionLink: 'AssetReturns',
                                category: 'Request'
                            });
                        }
                    }
                }
                if (isMyReturn) {
                    if (ret.status === 'Approved' || ret.status === 'Rejected' || ret.status === 'Completed' || ret.status === 'Pending Admin Verification') {
                        const id = `ret-resolved-${ret.id}-${ret.status}`;
                        if (!clearedIds.has(id)) {
                            let titleText = "Return Request Manager Approved";
                            let type = 'info';
                            let messageText = `Your return request for ${ret.assetName} has been approved by your manager. Awaiting Admin verification.`;
                            if (ret.status === 'Rejected') {
                                titleText = "Return Request Rejected";
                                type = 'error';
                                messageText = `Your return request for ${ret.assetName} was rejected. Note: ${ret.managerComment || ""}`;
                            }
                            else if (ret.status === 'Completed' || ret.status === 'Approved') {
                                titleText = "Asset Return Completed";
                                type = 'success';
                                messageText = `Your return of ${ret.assetName} is complete and has been checked back into stock.`;
                            }
                            notifications.push({
                                id,
                                title: titleText,
                                message: messageText,
                                type,
                                timestamp: formatTime(ret.completedDate || ret.requestDate),
                                isRead: readIds.has(id),
                                actionLink: 'MyRequests',
                                category: 'Assignment'
                            });
                        }
                    }
                }
            });
            // Sort notifications by timestamp descending
            notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            return notifications;
        };
        this._markNotificationAsRead = (id) => {
            const readNotificationIds = [...this.state.readNotificationIds, id];
            this.setState({ readNotificationIds });
            localStorage.setItem('inventory_read_notifications', JSON.stringify(readNotificationIds));
        };
        this._markAllNotificationsAsRead = () => {
            const notifications = this._getNotifications();
            const readNotificationIds = Array.from(new Set([...this.state.readNotificationIds, ...notifications.map(n => n.id)]));
            this.setState({ readNotificationIds });
            localStorage.setItem('inventory_read_notifications', JSON.stringify(readNotificationIds));
        };
        this._clearNotification = (id) => {
            const clearedNotificationIds = [...this.state.clearedNotificationIds, id];
            this.setState({ clearedNotificationIds });
            localStorage.setItem('inventory_cleared_notifications', JSON.stringify(clearedNotificationIds));
        };
        this._clearAllNotifications = () => {
            const notifications = this._getNotifications();
            const clearedNotificationIds = Array.from(new Set([...this.state.clearedNotificationIds, ...notifications.map(n => n.id)]));
            this.setState({ clearedNotificationIds });
            localStorage.setItem('inventory_cleared_notifications', JSON.stringify(clearedNotificationIds));
        };
        this._handleNotificationAction = (actionLink, notificationId) => {
            this._markNotificationAsRead(notificationId);
            const notifications = this._getNotifications();
            const selectedNotification = notifications.find(n => n.id === notificationId);
            this.setState({
                selectedNotification,
                isNotificationDetailsOpen: true
            });
        };
        this._handleMockEmailSent = (ev) => {
            this.setState({
                lastMockEmail: ev.detail,
                editMockEmailTo: ev.detail.to.join(', '),
                editMockEmailSubject: ev.detail.subject,
                isSendingMockEmail: false,
                mockEmailSendError: undefined,
                mockEmailSendSuccess: false
            });
        };
        this._handleEmailSendFailed = (ev) => {
            this.setState({
                syncMessage: `⚠️ Email Notification failed to send to ${ev.detail.to.join(', ')}. Details: ${ev.detail.errorMessage}`,
                syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.warning
            });
        };
        this._onSendMockEmail = async () => {
            const { lastMockEmail, editMockEmailTo, editMockEmailSubject } = this.state;
            if (!lastMockEmail)
                return;
            this.setState({ isSendingMockEmail: true, mockEmailSendError: undefined, mockEmailSendSuccess: false });
            try {
                const recipients = editMockEmailTo.split(',').map(email => email.trim()).filter(Boolean);
                await _services_EmailService__WEBPACK_IMPORTED_MODULE_19__.EmailService.sendMail(recipients, editMockEmailSubject, lastMockEmail.body);
                this.setState({
                    isSendingMockEmail: false,
                    mockEmailSendSuccess: true
                });
                setTimeout(() => {
                    this.setState({ lastMockEmail: undefined, mockEmailSendSuccess: false });
                }, 2000);
            }
            catch (e) {
                console.error("Failed to send email from panel:", e);
                this.setState({
                    isSendingMockEmail: false,
                    mockEmailSendError: e.message || JSON.stringify(e)
                });
            }
        };
        this._resolveUserRole = async () => {
            try {
                const sp = (0,_pnpjsConfig__WEBPACK_IMPORTED_MODULE_7__.getSP)();
                const groups = await sp.web.currentUser.groups();
                const groupNames = groups.map((group) => (group.Title || '').toLowerCase().trim());
                const isAdmin = groupNames.some((name) => name === 'msft owners' || name.indexOf('msft owners') >= 0);
                const isInventoryManager = groupNames.some((name) => name === 'msft members' || name.indexOf('msft members') >= 0);
                const isInventoryEmployee = groupNames.some((name) => name === 'msft visitors' || name.indexOf('msft visitors') >= 0);
                let userRole = 'Inventory Employee';
                if (isAdmin) {
                    userRole = 'Admin';
                }
                else if (isInventoryManager) {
                    userRole = 'Inventory Manager';
                }
                else if (isInventoryEmployee) {
                    userRole = 'Inventory Employee';
                }
                // Load employees from groups dynamically
                const loadedEmployees = [];
                const seenEmails = new Set();
                const addUsers = (users, jobTitle, department) => {
                    users.forEach(u => {
                        const email = (u.Email || u.LoginName || '').toLowerCase().trim();
                        const name = (u.Title || '').trim();
                        const nameLower = name.toLowerCase();
                        // Skip system/group users
                        if (nameLower === 'msft owners' || nameLower === 'system account' || !name) {
                            return;
                        }
                        if (email && !seenEmails.has(email)) {
                            seenEmails.add(email);
                            loadedEmployees.push({
                                id: u.Id ? u.Id.toString() : u.Email || Math.random().toString(),
                                name: name,
                                email: u.Email || '',
                                department: department,
                                jobTitle: jobTitle
                            });
                        }
                    });
                };
                try {
                    const owners = await sp.web.siteGroups.getByName("MSFT Owners").users();
                    addUsers(owners, 'Admin', 'Management');
                }
                catch (e) {
                    console.warn("Could not load users from group 'MSFT Owners':", e);
                }
                try {
                    const members = await sp.web.siteGroups.getByName("MSFT Members").users();
                    addUsers(members, 'Inventory Manager', 'Operations');
                }
                catch (e) {
                    console.warn("Could not load users from group 'MSFT Members':", e);
                }
                try {
                    const visitors = await sp.web.siteGroups.getByName("MSFT Visitors").users();
                    addUsers(visitors, 'Inventory Employee', 'Operations');
                }
                catch (e) {
                    console.warn("Could not load users from group 'MSFT Visitors':", e);
                }
                const finalEmployees = loadedEmployees.length > 0 ? loadedEmployees : _data_mockData__WEBPACK_IMPORTED_MODULE_17__.EMPLOYEES;
                this.setState({
                    userRole,
                    roleGroups: groups.map((group) => group.Title || ''),
                    employees: finalEmployees,
                    roleLoading: false
                });
            }
            catch (error) {
                console.error("Failed to resolve SharePoint group role:", error);
                this.setState({
                    userRole: 'Inventory Employee',
                    roleGroups: [],
                    employees: _data_mockData__WEBPACK_IMPORTED_MODULE_17__.EMPLOYEES,
                    roleLoading: false
                });
            }
        };
        this._loadInventory = async () => {
            try {
                this.setState({ loading: true, errorMessage: undefined });
                const items = await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.getItems();
                if (items && items.length > 0) {
                    this.setState({ items, loading: false });
                }
                else {
                    // List is empty
                    this.setState({
                        items: [],
                        loading: false,
                        errorMessage: 'SharePoint list is empty. Please add items.'
                    });
                }
            }
            catch (error) {
                console.error("Failed to load inventory:", error);
                // Fallback to empty if SharePoint fails so the UI remains functional
                this.setState({
                    items: [],
                    loading: false,
                    errorMessage: `SharePoint Error: ${error.message || JSON.stringify(error)}`
                });
            }
        };
        this._loadRequests = async () => {
            try {
                const requests = await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.getRequests();
                this.setState({ requests });
            }
            catch (error) {
                console.error("Failed to load requests:", error);
                this.setState({
                    errorMessage: `Failed to load Requests. Error: ${error.message || JSON.stringify(error)}`
                });
            }
        };
        this._loadAuditLogs = async () => {
            this.setState(prevState => ({
                auditLogsRefreshTrigger: (prevState.auditLogsRefreshTrigger || 0) + 1
            }));
        };
        this._loadReturnRequests = async () => {
            try {
                this.setState({ returnRequestsLoading: true });
                const returnRequests = await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.getReturnRequests();
                this.setState({ returnRequests, returnRequestsLoading: false });
            }
            catch (error) {
                console.error("Failed to load return requests:", error);
                this.setState({ returnRequestsLoading: false });
            }
        };
        this._onSubmitReturnRequest = async (reason, condition) => {
            const { selectedAssetForReturn } = this.state;
            if (!selectedAssetForReturn)
                return;
            try {
                this.setState({ returnRequestsLoading: true });
                const reqPayload = {
                    title: `Return Request for ${selectedAssetForReturn.assetName || selectedAssetForReturn.title}`,
                    assetId: selectedAssetForReturn.id,
                    assetName: selectedAssetForReturn.assetName || selectedAssetForReturn.title,
                    assetType: selectedAssetForReturn.assetType,
                    serialNumber: selectedAssetForReturn.serialNumber,
                    requesterName: this.state.activeUserDisplayName,
                    requesterEmail: this.state.activeUserEmail,
                    requestDate: new Date().toISOString().split('T')[0],
                    returnReason: reason,
                    proposedCondition: condition
                };
                await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.addReturnRequest(reqPayload, this.state.activeUserDisplayName);
                await this._loadInventory();
                await this._loadReturnRequests();
                await this._loadAuditLogs();
                this.setState({
                    isReturnFormOpen: false,
                    selectedAssetForReturn: undefined,
                    returnRequestsLoading: false,
                    syncMessage: `Return request for "${selectedAssetForReturn.assetName || selectedAssetForReturn.title}" submitted successfully!`,
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.success,
                    workflowPopup: {
                        isOpen: true,
                        title: 'Asset Return Request Submitted',
                        stage: 'Return Stage 1: Submitted',
                        type: 'info',
                        message: `Return request for "${selectedAssetForReturn.assetName || selectedAssetForReturn.title}" has been submitted and is awaiting manager review.`,
                        details: {
                            assetTitle: selectedAssetForReturn.assetName || selectedAssetForReturn.title,
                            requesterName: this.state.activeUserDisplayName,
                            status: 'Pending Manager Approval',
                            condition: condition,
                            comment: reason,
                            date: new Date().toISOString().split('T')[0]
                        }
                    }
                });
            }
            catch (error) {
                const msg = error.message && error.message.includes("already in progress")
                    ? error.message
                    : `Failed to submit return request: ${error.message || JSON.stringify(error)}`;
                this.setState({
                    errorMessage: msg,
                    returnRequestsLoading: false
                });
            }
        };
        this._onUpdateReturnRequestStatus = async (requestId, status, comment, finalCondition, adminComments, managerStatus, adminStatus) => {
            try {
                this.setState({ returnRequestsLoading: true });
                await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.updateReturnRequestStatus(requestId, status, comment, this.state.activeUserDisplayName, finalCondition, adminComments, managerStatus, adminStatus);
                await this._loadInventory();
                await this._loadReturnRequests();
                await this._loadAuditLogs();
                const isCompleted = status === 'Completed';
                const isRejected = status === 'Rejected';
                this.setState({
                    returnRequestsLoading: false,
                    workflowPopup: {
                        isOpen: true,
                        title: isCompleted ? 'Asset Return Completed' : isRejected ? 'Return Request Rejected' : 'Return Request Approved',
                        stage: isCompleted ? 'Return Stage 3: Completed & Checked In' : isRejected ? 'Return Stage: Rejected' : 'Return Stage 2: Manager Approved',
                        type: isCompleted ? 'success' : isRejected ? 'error' : 'info',
                        message: isCompleted
                            ? `Asset return #${requestId} has been verified by IT Admin and checked back into active stock.`
                            : isRejected
                                ? `Return request #${requestId} was rejected.`
                                : `Return request #${requestId} was approved by manager and sent to IT Admin for verification.`,
                        details: {
                            requestId: `#${requestId}`,
                            status: status,
                            comment: comment || adminComments,
                            date: new Date().toISOString().split('T')[0]
                        }
                    }
                });
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to update return status: ${error.message || JSON.stringify(error)}`,
                    returnRequestsLoading: false
                });
            }
        };
        this._onAddAsset = async (newAssetData) => {
            try {
                this.setState({ loading: true, errorMessage: undefined });
                const newAsset = {
                    ...newAssetData,
                    status: 'In Stock'
                };
                await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.addItem(newAsset, this.state.activeUserDisplayName);
                await this._loadInventory(); // Refresh list
                await this._loadAuditLogs(); // Refresh audit logs
                this.setState({
                    loading: false,
                    isAssetFormOpen: false,
                    workflowPopup: {
                        isOpen: true,
                        title: 'New Inventory Asset Created',
                        stage: 'Catalog Management',
                        type: 'success',
                        message: `Asset "${newAssetData.title || newAssetData.assetName}" was successfully added to stock inventory.`,
                        details: {
                            assetTitle: newAssetData.title || newAssetData.assetName,
                            status: 'In Stock',
                            date: newAssetData.purchaseDate || new Date().toISOString().split('T')[0]
                        }
                    }
                });
            }
            catch (error) {
                console.error("Failed to add asset:", error);
                this.setState({
                    loading: false,
                    errorMessage: `Failed to add Asset. SharePoint rejected the save. Error: ${error.message || JSON.stringify(error)}`
                });
            }
        };
        this._onSubmitRequest = async (requestData) => {
            try {
                const initialStatus = 'Pending';
                const tempId = `temp-${Date.now()}`;
                const localRequest = {
                    id: tempId,
                    requestKey: `REQ-${("000000" + (this.state.requests.length + 1)).slice(-6)}`,
                    requesterName: requestData.requesterName,
                    requesterEmail: requestData.requesterEmail,
                    employeeId: requestData.employeeId || "",
                    managerName: requestData.managerName || "",
                    assetId: requestData.assetId || "1",
                    assetTitle: requestData.assetTitle,
                    assetName: "",
                    priority: requestData.priority || "Medium",
                    quantity: requestData.quantity || 1,
                    status: initialStatus,
                    assetStatus: 'Pending',
                    requestDate: requestData.requestDate || new Date().toISOString().split('T')[0],
                    reason: requestData.reason || ""
                };
                // Optimistic update so it gets added to the RequestList directly
                this.setState(prevState => ({
                    requests: [localRequest, ...prevState.requests],
                    workflowPopup: {
                        isOpen: true,
                        title: 'Asset Request Created',
                        stage: 'Stage 1: Request Submitted',
                        type: 'success',
                        message: `Your request for "${requestData.assetTitle}" has been submitted successfully and routed to manager (${requestData.managerName || 'Manager'}) for approval.`,
                        details: {
                            requestId: localRequest.requestKey,
                            assetTitle: requestData.assetTitle,
                            quantity: requestData.quantity,
                            requesterName: requestData.requesterName,
                            managerName: requestData.managerName,
                            status: initialStatus,
                            date: localRequest.requestDate
                        }
                    }
                }));
                const effectiveRole = this.state.previewRole || this.state.userRole;
                const isEmpUI = effectiveRole !== 'Admin';
                await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.addRequest({
                    ...requestData,
                    status: initialStatus
                }, this.state.activeUserDisplayName, effectiveRole, isEmpUI);
                console.log('Successfully saved request to SharePoint');
                await this._loadRequests(); // Refresh list from SharePoint
                await this._loadAuditLogs(); // Refresh audit logs
            }
            catch (error) {
                console.error('Failed to save request to SharePoint AssetRequests list:', error);
                this.setState({
                    errorMessage: `Failed to save Request to SharePoint. A local copy was added. Error: ${error.message || JSON.stringify(error)}`
                });
            }
        };
        this._onApproveRequest = async (request) => {
            try {
                this.setState({ requestActionInProgressId: request.id, errorMessage: undefined });
                if (request.id.indexOf('temp-') === 0) {
                    this.setState(prevState => ({
                        requests: prevState.requests.map(r => r.id === request.id ? { ...r, status: 'Approved' } : r)
                    }));
                }
                else {
                    await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.updateRequestStatus(parseInt(request.id, 10), 'Approved', this.state.activeUserDisplayName);
                    await this._loadRequests();
                    await this._loadAuditLogs();
                }
                this.setState({
                    workflowPopup: {
                        isOpen: true,
                        title: 'Asset Request Approved by Manager',
                        stage: 'Stage 2: Manager Approved',
                        type: 'success',
                        message: `Request ${request.requestKey || `#${request.id}`} for "${request.assetTitle}" requested by ${request.requesterName} was APPROVED by Manager. Moved to IT Admin for physical asset allocation.`,
                        details: {
                            requestId: request.requestKey || `#${request.id}`,
                            assetTitle: request.assetTitle,
                            requesterName: request.requesterName,
                            managerName: request.managerName || this.state.activeUserDisplayName,
                            status: 'Approved',
                            date: request.requestDate
                        }
                    }
                });
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to approve request #${request.id}. ${error.message || JSON.stringify(error)}`
                });
            }
            finally {
                this.setState({ requestActionInProgressId: undefined });
            }
        };
        this._onRejectRequest = async (request, reason) => {
            try {
                this.setState({ requestActionInProgressId: request.id, errorMessage: undefined });
                if (request.id.indexOf('temp-') === 0) {
                    this.setState(prevState => ({
                        requests: prevState.requests.map(r => r.id === request.id ? { ...r, status: 'Declined', managerResponse: reason } : r)
                    }));
                }
                else {
                    await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.updateRequestStatus(parseInt(request.id, 10), 'Declined', this.state.activeUserDisplayName, reason);
                    await this._loadRequests();
                    await this._loadAuditLogs();
                }
                this.setState({
                    workflowPopup: {
                        isOpen: true,
                        title: 'Asset Request Rejected by Manager',
                        stage: 'Stage 2: Manager Review',
                        type: 'error',
                        message: `Request ${request.requestKey || `#${request.id}`} for "${request.assetTitle}" requested by ${request.requesterName} was REJECTED by Manager.`,
                        details: {
                            requestId: request.requestKey || `#${request.id}`,
                            assetTitle: request.assetTitle,
                            requesterName: request.requesterName,
                            managerName: request.managerName || this.state.activeUserDisplayName,
                            status: 'Declined',
                            comment: reason,
                            date: request.requestDate
                        }
                    }
                });
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to reject request #${request.id}. ${error.message || JSON.stringify(error)}`
                });
            }
            finally {
                this.setState({ requestActionInProgressId: undefined });
            }
        };
        this._onApproveAsset = async (request) => {
            try {
                this.setState({ requestActionInProgressId: request.id, errorMessage: undefined });
                if (request.id.indexOf('temp-') === 0) {
                    this.setState(prevState => ({
                        requests: prevState.requests.map(r => r.id === request.id ? { ...r, assetStatus: 'Approved' } : r)
                    }));
                }
                else {
                    await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.updateAssetStatus(parseInt(request.id, 10), 'Approved', this.state.activeUserDisplayName);
                    await this._loadRequests();
                    await this._loadAuditLogs();
                }
                this.setState({
                    workflowPopup: {
                        isOpen: true,
                        title: 'Physical Asset Allocated & Dispatched',
                        stage: 'Stage 3: Admin Asset Allocation',
                        type: 'success',
                        message: `Physical asset "${request.assetTitle}" has been allocated to ${request.requesterName} by System Administrator! Request fulfilled.`,
                        details: {
                            requestId: request.requestKey || `#${request.id}`,
                            assetTitle: request.assetTitle,
                            requesterName: request.requesterName,
                            status: 'Asset Allocated & Dispatched',
                            date: new Date().toISOString().split('T')[0]
                        }
                    }
                });
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to approve asset status for request #${request.requestKey || request.id}. ${error.message || JSON.stringify(error)}`
                });
            }
            finally {
                this.setState({ requestActionInProgressId: undefined });
            }
        };
        this._onAssignAssets = async (employeeName, employeeEmail, assetIds) => {
            try {
                this.setState({ isTrackingActionInProgress: true, errorMessage: undefined });
                const employee = this.state.employees.find(e => e.name.toLowerCase() === employeeName.toLowerCase());
                const employeeId = employee ? employee.id : "";
                await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.assignAssetsToEmployee(assetIds, employeeName, employeeEmail, this.state.activeUserDisplayName, employeeId);
                await this._loadInventory();
                await this._loadAuditLogs();
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to assign assets. ${error.message || JSON.stringify(error)}`
                });
            }
            finally {
                this.setState({ isTrackingActionInProgress: false });
            }
        };
        this._onSyncAssignedAssets = async () => {
            try {
                this.setState({
                    syncInProgress: true,
                    syncMessage: 'Synchronizing assigned assets with SharePoint Mapping List...',
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.info
                });
                const result = await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.syncExistingAssignmentsToMappingList(this.state.activeUserDisplayName);
                this.setState({
                    syncInProgress: false,
                    syncMessage: `Synchronization complete! Verified ${result.checkedCount} assigned assets. Successfully checked and synchronized ${result.syncedCount} missing mapping records.`,
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.success
                });
                // Reload inventory to ensure consistency
                await this._loadInventory();
            }
            catch (e) {
                console.error("Manual sync failed:", e);
                this.setState({
                    syncInProgress: false,
                    syncMessage: `Failed to synchronize mapping records: ${e.message || JSON.stringify(e)}`,
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.error
                });
            }
        };
        this._onRunDiagnostics = async () => {
            try {
                this.setState({
                    syncInProgress: true,
                    syncMessage: 'Running Mapping List diagnostic check...',
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.info
                });
                const diagnosticInfo = await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.diagnoseMappingListFields();
                this.setState({
                    syncInProgress: false,
                    diagnosticInfo,
                    syncMessage: 'Diagnostic check complete! Columns and item counts retrieved successfully.',
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.success
                });
            }
            catch (e) {
                this.setState({
                    syncInProgress: false,
                    syncMessage: `Failed to retrieve diagnostics: ${e.message || JSON.stringify(e)}`,
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.error
                });
            }
        };
        this._exportWarrantyReportToExcel = () => {
            const { items } = this.state;
            const headers = ["Asset Name", "Asset Type", "Status", "Purchase Date", "Warranty Expiry Date"];
            const csvRows = [headers.join(",")];
            items.forEach(item => {
                const name = (item.assetName || item.title || "").replace(/"/g, '""');
                const type = (item.assetType || "").replace(/"/g, '""');
                const status = (item.status || "").replace(/"/g, '""');
                const purchaseDate = (item.purchaseDate || "").replace(/"/g, '""');
                const warrantyExpiry = (item.warrantyExpiry || "N/A").replace(/"/g, '""');
                const row = [
                    `"${name}"`,
                    `"${type}"`,
                    `"${status}"`,
                    `"${purchaseDate}"`,
                    `"${warrantyExpiry}"`
                ];
                csvRows.push(row.join(","));
            });
            const csvContent = "\uFEFF" + csvRows.join("\n");
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `Warranty_Expiry_Report_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        this._exportWarrantyReportToPDF = () => {
            const { items } = this.state;
            const doc = new jspdf__WEBPACK_IMPORTED_MODULE_13__.jsPDF();
            // Header
            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.text("Asset Warranty Expiry Report", 14, 20);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
            doc.text(`Total Assets: ${items.length} | Assets with Warranty: ${items.filter(i => i.warrantyExpiry).length}`, 14, 34);
            // Table Headers
            doc.setFont("helvetica", "bold");
            doc.setFillColor(240, 240, 240);
            doc.rect(14, 42, 182, 8, "F");
            doc.text("Asset Name", 16, 47);
            doc.text("Asset Type", 70, 47);
            doc.text("Status", 110, 47);
            doc.text("Purchase Date", 140, 47);
            doc.text("Warranty Expiry", 170, 47);
            doc.setDrawColor(200, 200, 200);
            doc.line(14, 50, 196, 50);
            // Rows
            doc.setFont("helvetica", "normal");
            let y = 56;
            items.forEach((item) => {
                if (y > 275) {
                    doc.addPage();
                    y = 20;
                    doc.setFont("helvetica", "bold");
                    doc.setFillColor(240, 240, 240);
                    doc.rect(14, y - 6, 182, 8, "F");
                    doc.text("Asset Name", 16, y - 1);
                    doc.text("Asset Type", 70, y - 1);
                    doc.text("Status", 110, y - 1);
                    doc.text("Purchase Date", 140, y - 1);
                    doc.text("Warranty Expiry", 170, y - 1);
                    doc.line(14, y + 2, 196, y + 2);
                    doc.setFont("helvetica", "normal");
                    y += 8;
                }
                const name = (item.assetName || item.title || "").substring(0, 25);
                const type = (item.assetType || "").substring(0, 18);
                const status = (item.status || "").substring(0, 15);
                const purchaseDate = item.purchaseDate || "N/A";
                const warrantyExpiry = item.warrantyExpiry || "N/A";
                doc.text(name, 16, y);
                doc.text(type, 70, y);
                doc.text(status, 110, y);
                doc.text(purchaseDate, 140, y);
                doc.text(warrantyExpiry, 170, y);
                doc.line(14, y + 2, 196, y + 2);
                y += 8;
            });
            doc.save(`Warranty_Expiry_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        };
        this._exportDetailedReportToExcel = (filteredItems) => {
            const headers = ["Asset Name", "Asset Type", "Status", "Condition", "Purchase Date", "Assigned To", "Specifications"];
            const csvRows = [headers.join(",")];
            filteredItems.forEach(item => {
                const name = (item.assetName || item.title || "").replace(/"/g, '""');
                const type = (item.assetType || "").replace(/"/g, '""');
                const status = (item.status || "").replace(/"/g, '""');
                const condition = (item.condition || "").replace(/"/g, '""');
                const purchaseDate = (item.purchaseDate || "").replace(/"/g, '""');
                const assignedTo = (item.assignedTo || "N/A").replace(/"/g, '""');
                const specs = (item.specifications || "").replace(/"/g, '""');
                const row = [
                    `"${name}"`,
                    `"${type}"`,
                    `"${status}"`,
                    `"${condition}"`,
                    `"${purchaseDate}"`,
                    `"${assignedTo}"`,
                    `"${specs}"`
                ];
                csvRows.push(row.join(","));
            });
            const csvContent = "\uFEFF" + csvRows.join("\n");
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `Detailed_Asset_Report_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        this._exportDetailedReportToPDF = (filteredItems) => {
            const doc = new jspdf__WEBPACK_IMPORTED_MODULE_13__.jsPDF();
            // Header
            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.text("Detailed Inventory Asset Report", 14, 20);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
            doc.text(`Total Assets Displayed: ${filteredItems.length}`, 14, 34);
            // Table Headers
            doc.setFont("helvetica", "bold");
            doc.setFillColor(240, 240, 240);
            doc.rect(14, 42, 182, 8, "F");
            doc.text("Asset Name", 16, 47);
            doc.text("Asset Type", 65, 47);
            doc.text("Status", 100, 47);
            doc.text("Condition", 130, 47);
            doc.text("Assigned To", 160, 47);
            doc.setDrawColor(200, 200, 200);
            doc.line(14, 50, 196, 50);
            // Rows
            doc.setFont("helvetica", "normal");
            let y = 56;
            filteredItems.forEach((item) => {
                if (y > 275) {
                    doc.addPage();
                    y = 20;
                    doc.setFont("helvetica", "bold");
                    doc.setFillColor(240, 240, 240);
                    doc.rect(14, y - 6, 182, 8, "F");
                    doc.text("Asset Name", 16, y - 1);
                    doc.text("Asset Type", 65, y - 1);
                    doc.text("Status", 100, y - 1);
                    doc.text("Condition", 130, y - 1);
                    doc.text("Assigned To", 160, y - 1);
                    doc.line(14, y + 2, 196, y + 2);
                    doc.setFont("helvetica", "normal");
                    y += 8;
                }
                const name = (item.assetName || item.title || "").substring(0, 23);
                const type = (item.assetType || "").substring(0, 15);
                const status = (item.status || "").substring(0, 14);
                const condition = (item.condition || "N/A").substring(0, 14);
                const assignedTo = (item.assignedTo || "N/A").substring(0, 18);
                doc.text(name, 16, y);
                doc.text(type, 65, y);
                doc.text(status, 100, y);
                doc.text(condition, 130, y);
                doc.text(assignedTo, 160, y);
                doc.line(14, y + 2, 196, y + 2);
                y += 8;
            });
            doc.save(`Detailed_Asset_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        };
        this._testListConnection = async (listTitle, internalTitle) => {
            this.setState(prevState => ({
                connectionStatuses: { ...prevState.connectionStatuses, [listTitle]: 'testing' },
                connectionErrorMessages: { ...prevState.connectionErrorMessages, [listTitle]: '' }
            }));
            try {
                const sp = (0,_pnpjsConfig__WEBPACK_IMPORTED_MODULE_7__.getSP)();
                // Try to load 1 item from list to test connection and permissions
                await sp.web.lists.getByTitle(internalTitle).items.select("ID").top(1)();
                this.setState(prevState => ({
                    connectionStatuses: { ...prevState.connectionStatuses, [listTitle]: 'connected' }
                }));
            }
            catch (e) {
                console.warn(`Connection test failed for list ${listTitle}`, e);
                this.setState(prevState => ({
                    connectionStatuses: { ...prevState.connectionStatuses, [listTitle]: 'error' },
                    connectionErrorMessages: { ...prevState.connectionErrorMessages, [listTitle]: e.message || 'Verification failed. List might be missing or inaccessible.' }
                }));
            }
        };
        this._loadGroupUsers = async (groupName) => {
            this.setState(prevState => ({
                loadingGroupUsers: { ...prevState.loadingGroupUsers, [groupName]: true }
            }));
            try {
                const sp = (0,_pnpjsConfig__WEBPACK_IMPORTED_MODULE_7__.getSP)();
                const users = await sp.web.siteGroups.getByName(groupName).users();
                const userList = users.map((u) => u.Title || u.LoginName || 'Unknown User');
                this.setState(prevState => ({
                    groupUsersList: { ...prevState.groupUsersList, [groupName]: userList },
                    loadingGroupUsers: { ...prevState.loadingGroupUsers, [groupName]: false }
                }));
            }
            catch (e) {
                console.warn(`Failed to load members for group ${groupName}`, e);
                this.setState(prevState => ({
                    groupUsersList: { ...prevState.groupUsersList, [groupName]: ['Error retrieving group members'] },
                    loadingGroupUsers: { ...prevState.loadingGroupUsers, [groupName]: false }
                }));
            }
        };
        this._renderRequestAnalysis = (request) => {
            const reqAssetTitle = request.assetTitle || "";
            const inStockItems = this.state.items.filter(item => (item.assetType || '').toLowerCase() === reqAssetTitle.toLowerCase() &&
                (item.status === 'In Stock' || item.status === 'Yes' || (item.status || '').toLowerCase() === 'in stock'));
            const inStockCount = inStockItems.length;
            const isSufficient = inStockCount >= request.quantity;
            let progressPercent = 0.33;
            let currentStepText = "Submitted & Pending Approval";
            if (request.status === 'Approved') {
                progressPercent = 0.66;
                currentStepText = "Manager Approved - Awaiting Asset Assignment";
                if (request.assetStatus === 'Approved') {
                    progressPercent = 1.0;
                    currentStepText = "Completed & Asset Assigned";
                }
            }
            else if (request.status === 'Declined') {
                progressPercent = 1.0;
                currentStepText = "Declined by Manager";
            }
            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_28__.Stack, { tokens: { childrenGap: 20 } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } }, "Request Overview"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].responsiveGrid, style: { fontSize: '0.88rem' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Request Key:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, request.requestKey)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Requested Asset:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, request.assetTitle)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Quantity:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, request.quantity)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Priority:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, request.priority)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Requester Name:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, request.requesterName)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Employee ID:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, request.employeeId || "N/A")),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Request Date:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, request.requestDate)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Request Status:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: request.status === 'Approved' ? '#16a34a' : request.status === 'Declined' ? '#dc2626' : '#ea580c' } }, request.status))),
                    request.reason && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '12px', fontSize: '0.88rem', padding: '8px 10px', backgroundColor: '#f9fafb', borderRadius: '4px', border: '1px solid #f3f4f6' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280', display: 'block', marginBottom: '2px' } }, "Reason for Request:"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#374151' } }, request.reason))),
                    request.managerResponse && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '12px', fontSize: '0.88rem', padding: '8px 10px', backgroundColor: '#f0fdf4', borderRadius: '4px', border: '1px solid #dcfce7' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#15803d', display: 'block', marginBottom: '2px' } }, "Manager Response:"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#166534' } }, request.managerResponse)))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_29__.Icon, { iconName: "BarChart4", style: { color: '#0078d4' } }),
                        " Detailed Analysis"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_28__.Stack, { tokens: { childrenGap: 12 } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' } }, "Inventory Availability Check:"),
                            isSufficient ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_30__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.success, styles: { root: { borderRadius: '6px' } } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Inventory Check Passed:"),
                                " There are currently ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, inStockCount),
                                " unit(s) of ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, reqAssetTitle),
                                " in stock, which is sufficient to fulfill this request.")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_30__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.warning, styles: { root: { borderRadius: '6px' } } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Inventory Warning:"),
                                " Only ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, inStockCount),
                                " unit(s) of ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, reqAssetTitle),
                                " in stock. Procurement is required to fully complete this order."))),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { borderTop: '1px solid #e2e8f0', paddingTop: '10px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' } }, "Strategic Recommendation:"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '10px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', lineHeight: '1.4', color: '#334155' } }, request.status === 'Pending' ? (isSufficient ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Recommended Action:"),
                                " Approve the request. Sufficient inventory is available, allowing immediate serial number allocation.")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Recommended Action:"),
                                " Hold approval or assign alternate model. Current stock (",
                                inStockCount,
                                ") is insufficient. Order replenishment units."))) : request.status === 'Approved' && request.assetStatus === 'Pending' ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Recommended Action:"),
                                " Proceed to the ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Asset Assignment Queue"),
                                " tab to allocate one of the ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, inStockCount),
                                " available ",
                                reqAssetTitle,
                                "s to ",
                                request.requesterName,
                                ".")) : request.status === 'Approved' && request.assetStatus === 'Approved' ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Lifecycle Complete:"),
                                " The asset has been successfully allocated. No further manager or admin action is required.")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Closed:"),
                                " Request has been declined. Fulfilling alternate options or review arguments if appealed.")))),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { borderTop: '1px solid #e2e8f0', paddingTop: '10px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' } }, "Request Lifecycle Stage:"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_31__.ProgressIndicator, { label: currentStepText, percentComplete: progressPercent, styles: { root: { marginTop: '5px' } } }))))));
        };
        this._renderAssetAnalysis = (asset) => {
            const purchaseDateVal = asset.purchaseDate ? new Date(asset.purchaseDate) : null;
            const now = new Date();
            const ageInMonths = purchaseDateVal
                ? Math.round((now.getTime() - purchaseDateVal.getTime()) / (1000 * 60 * 60 * 24 * 30.4))
                : null;
            const isExpired = asset.warrantyExpiry && new Date(asset.warrantyExpiry) < now;
            let conditionColor = '#16a34a';
            let healthRating = "Excellent";
            let healthIcon = "Heart";
            if (asset.condition === 'Fair') {
                conditionColor = '#ea580c';
                healthRating = "Fair";
                healthIcon = "IncidentTriangle";
            }
            else if (asset.condition === 'Poor' || asset.condition === 'Damaged') {
                conditionColor = '#dc2626';
                healthRating = "Critical Needs Replacement";
                healthIcon = "Warning";
            }
            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_28__.Stack, { tokens: { childrenGap: 20 } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } }, "Asset Specifications"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].responsiveGrid, style: { fontSize: '0.88rem' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Asset Name:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, asset.assetName || asset.title)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Serial Number:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, asset.serialNumber)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Asset Type:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, asset.assetType)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Current Status:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, asset.status)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Condition:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: conditionColor } }, asset.condition || "New")),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Vendor:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, asset.vendor || "N/A")),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Purchase Date:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, asset.purchaseDate || "N/A")),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Warranty Expiry:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: isExpired ? '#dc2626' : '#111827' } }, asset.warrantyExpiry || "N/A"))),
                    asset.note && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '12px', fontSize: '0.88rem', padding: '8px 10px', backgroundColor: '#f9fafb', borderRadius: '4px', border: '1px solid #f3f4f6' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280', display: 'block', marginBottom: '2px' } }, "Asset Notes:"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#374151' } }, asset.note)))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_29__.Icon, { iconName: "Heart", style: { color: conditionColor } }),
                        " Health & Depreciation Analysis"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_28__.Stack, { tokens: { childrenGap: 12 } },
                        ageInMonths !== null && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' } }, "Asset Age:"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.9rem', color: '#334155' } },
                                "This asset is ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, ageInMonths),
                                " month(s) old (",
                                Math.round(ageInMonths / 12 * 10) / 10,
                                " year(s)). Standard lifecycle depreciation period is 36 months (3 years)."))),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' } }, "Warranty Expiry Evaluation:"),
                            asset.warrantyExpiry ? (isExpired ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_30__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.error, styles: { root: { borderRadius: '6px' } } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Warranty Expired:"),
                                " Coverage ended on ",
                                asset.warrantyExpiry,
                                ". Any future repair operations will incur full direct business costs.")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_30__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.success, styles: { root: { borderRadius: '6px' } } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Warranty Active:"),
                                " Covered under manufacturer protection until ",
                                asset.warrantyExpiry,
                                "."))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_30__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.info, styles: { root: { borderRadius: '6px' } } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Warranty Unknown:"),
                                " No warranty expiration date has been registered for this asset."))),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { borderTop: '1px solid #e2e8f0', paddingTop: '10px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' } }, "Asset Physical Health:"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_29__.Icon, { iconName: healthIcon, style: { fontSize: '18px', color: conditionColor } }),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                    "Health Classification: ",
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: conditionColor } }, healthRating))),
                            (asset.condition === 'Poor' || asset.condition === 'Damaged') && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { margin: '8px 0 0 0', fontSize: '0.8rem', color: '#b91c1c', fontWeight: 'bold' } }, "Critical Action Recommendation: It is highly advised to retire this asset and issue a replacement request.")))))));
        };
        this._renderNotificationDetailsPanel = () => {
            const { selectedNotification, isNotificationDetailsOpen, items, requests } = this.state;
            if (!selectedNotification)
                return null;
            const notifId = selectedNotification.id || "";
            let associatedRequest;
            let associatedAsset;
            if (notifId.startsWith("req-pending-")) {
                const id = notifId.replace("req-pending-", "");
                associatedRequest = requests.find(r => r.id === id);
            }
            else if (notifId.startsWith("req-resolved-")) {
                const parts = notifId.split("-");
                const id = parts[2];
                associatedRequest = requests.find(r => r.id === id);
            }
            else if (notifId.startsWith("req-assign-admin-")) {
                const id = notifId.replace("req-assign-admin-", "");
                associatedRequest = requests.find(r => r.id === id);
            }
            else if (notifId.startsWith("asset-assigned-admin-")) {
                const id = notifId.replace("asset-assigned-admin-", "");
                associatedAsset = items.find(a => a.id === id);
            }
            else if (notifId.startsWith("asset-assigned-")) {
                const id = notifId.replace("asset-assigned-", "");
                associatedAsset = items.find(a => a.id === id);
            }
            else if (notifId.startsWith("asset-maintenance-")) {
                const parts = notifId.replace("asset-maintenance-", "").split("-");
                const id = parts[0];
                associatedAsset = items.find(a => a.id === id);
            }
            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_32__.Panel, { isOpen: isNotificationDetailsOpen, onDismiss: () => this.setState({ isNotificationDetailsOpen: false }), type: _fluentui_react__WEBPACK_IMPORTED_MODULE_33__.PanelType.medium, headerText: selectedNotification.title, closeButtonAriaLabel: "Close" },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '10px' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: '#6b7280', fontSize: '0.88rem', margin: '0 0 20px 0' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Received:"),
                        " ",
                        selectedNotification.timestamp),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '12px 15px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #64748b' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: '1.5' } }, selectedNotification.message)),
                    associatedRequest && this._renderRequestAnalysis(associatedRequest),
                    associatedAsset && this._renderAssetAnalysis(associatedAsset),
                    !associatedRequest && !associatedAsset && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { color: '#111827', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px' } }, "System Alert Analysis"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_30__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.info }, "This is a general system notification. There is no direct database link to an active request or asset."))))));
        };
        this._onAdminAssetChange = (event, option) => {
            if (option) {
                this.setState({ adminSelectedAssetId: option.key });
            }
        };
        this._handleAdminAssignAndApprove = async () => {
            const request = this.state.selectedAdminRequest;
            if (!request)
                return;
            try {
                this.setState({ requestActionInProgressId: request.id, errorMessage: undefined });
                const { adminSelectedAssetId, adminComment } = this.state;
                const approverName = this.state.activeUserDisplayName;
                if (adminSelectedAssetId) {
                    // Find the requester's details
                    const employee = this.state.employees.find(e => e.name.toLowerCase() === request.requesterName.toLowerCase());
                    const employeeEmail = employee ? employee.email : "";
                    const employeeId = employee ? employee.id : "";
                    // Assign the asset to the employee and approve the request
                    await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.assignAssetsToEmployee([adminSelectedAssetId], request.requesterName, employeeEmail, approverName, employeeId, adminComment);
                }
                else {
                    // No asset selected, just approve the asset request status
                    await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.updateAssetStatus(parseInt(request.id, 10), 'Approved', approverName, adminComment);
                }
                // Close panel and refresh data
                this.setState({
                    isAdminPanelOpen: false,
                    selectedAdminRequest: undefined,
                    adminSelectedAssetId: undefined,
                    adminComment: '',
                    workflowPopup: {
                        isOpen: true,
                        title: 'Physical Asset Allocated & Dispatched',
                        stage: 'Stage 3: Admin Asset Allocation',
                        type: 'success',
                        message: `Asset "${request.assetTitle}" has been allocated to ${request.requesterName} by System Administrator! Request fulfilled.`,
                        details: {
                            requestId: request.requestKey || `#${request.id}`,
                            assetTitle: request.assetTitle,
                            requesterName: request.requesterName,
                            status: 'Asset Allocated & Dispatched',
                            comment: adminComment,
                            date: new Date().toISOString().split('T')[0]
                        }
                    }
                });
                await this._loadInventory();
                await this._loadRequests();
                await this._loadAuditLogs();
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to approve & assign request #${request.requestKey || request.id}. ${error.message || JSON.stringify(error)}`
                });
            }
            finally {
                this.setState({ requestActionInProgressId: undefined });
            }
        };
        this._handleAdminReject = async () => {
            const request = this.state.selectedAdminRequest;
            if (!request)
                return;
            try {
                this.setState({ requestActionInProgressId: request.id, errorMessage: undefined });
                const { adminComment } = this.state;
                const approverName = this.state.activeUserDisplayName;
                // Rejecting from the Admin side will set the main status of the request to 'Declined'
                await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.updateRequestStatus(parseInt(request.id, 10), 'Declined', approverName, adminComment || 'Rejected by Admin during assignment');
                // Close panel and refresh data
                this.setState({
                    isAdminPanelOpen: false,
                    selectedAdminRequest: undefined,
                    adminSelectedAssetId: undefined,
                    adminComment: ''
                });
                await this._loadInventory();
                await this._loadRequests();
                await this._loadAuditLogs();
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to reject request #${request.requestKey || request.id}. ${error.message || JSON.stringify(error)}`
                });
            }
            finally {
                this.setState({ requestActionInProgressId: undefined });
            }
        };
        this._renderAdminAssignmentPanel = () => {
            const request = this.state.selectedAdminRequest;
            if (!request || !this.state.isAdminPanelOpen)
                return null;
            const requestedAssetTitle = request.assetTitle || "";
            const matchingAssets = this.state.items.filter(item => (item.assetType || '').toLowerCase() === requestedAssetTitle.toLowerCase() &&
                (item.status === 'In Stock' || item.status === 'Yes' || (item.status || '').toLowerCase() === 'in stock'));
            const matchingAssetOptions = matchingAssets.map(asset => ({
                key: asset.id,
                text: `${asset.assetName || asset.title} (SN: ${asset.serialNumber || 'N/A'})`
            }));
            const dropdownPlaceholder = matchingAssets.length > 0
                ? "Select asset to assign..."
                : "No assets of this type in stock";
            const isBusy = this.state.requestActionInProgressId === request.id;
            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_32__.Panel, { isOpen: this.state.isAdminPanelOpen, onDismiss: () => this.setState({ isAdminPanelOpen: false, selectedAdminRequest: undefined }), type: _fluentui_react__WEBPACK_IMPORTED_MODULE_33__.PanelType.medium, headerText: `Request #${request.requestKey || request.id}`, closeButtonAriaLabel: "Close" },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'inherit' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 10px 0' } }, "Asset request details"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                            backgroundColor: 'var(--surface-bg)',
                            border: '1px solid rgba(128, 128, 128, 0.15)',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: 'var(--card-shadow)'
                        } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(128, 128, 128, 0.1)', paddingBottom: '10px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' } }, "Request Information"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                    backgroundColor: '#fef3c7',
                                    color: '#d97706',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    padding: '3px 8px',
                                    borderRadius: '4px'
                                } }, "Pending Admin")),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].responsiveGridGap16, style: { fontSize: '0.85rem' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: 'var(--text-muted)', display: 'block', marginBottom: '2px' } }, "Category"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: 'var(--text-main)' } }, request.assetTitle)),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: 'var(--text-muted)', display: 'block', marginBottom: '2px' } }, "Quantity"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: 'var(--text-main)' } }, request.quantity)),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: 'var(--text-muted)', display: 'block', marginBottom: '2px' } }, "Urgency"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: 'var(--text-main)' } }, request.priority || 'Medium')),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: 'var(--text-muted)', display: 'block', marginBottom: '2px' } }, "Submitted"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: 'var(--text-main)' } }, request.requestDate))),
                        request.reason && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '16px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontSize: '0.85rem' } }, "Justification"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                                    backgroundColor: this.props.isDarkTheme ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                                    border: '1px solid rgba(128, 128, 128, 0.1)',
                                    borderRadius: '6px',
                                    padding: '12px',
                                    fontSize: '0.85rem',
                                    color: 'var(--text-main)',
                                    lineHeight: 1.5
                                } }, request.reason)))),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                            backgroundColor: 'var(--surface-bg)',
                            border: '1px solid rgba(128, 128, 128, 0.15)',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: 'var(--card-shadow)'
                        } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', borderBottom: '1px solid rgba(128, 128, 128, 0.1)', paddingBottom: '10px' } }, "Approval Trail"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.85rem' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '12px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981', border: '2px solid var(--surface-bg)', boxShadow: '0 0 0 2px #10b981' } }),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { width: '2px', flexGrow: 1, backgroundColor: '#10b981', minHeight: '20px', marginTop: '4px' } })),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: 'var(--text-main)', display: 'block' } }, "Submitted"),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: 'var(--text-muted)', fontSize: '0.75rem' } }, request.requestDate))),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '12px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981', border: '2px solid var(--surface-bg)', boxShadow: '0 0 0 2px #10b981' } }),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { width: '2px', flexGrow: 1, backgroundColor: 'rgba(128, 128, 128, 0.25)', minHeight: '20px', marginTop: '4px' } })),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: 'var(--text-main)', display: 'block' } }, "Manager Review"),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: 'var(--text-muted)', fontStyle: 'italic', display: 'block', marginTop: '2px', fontSize: '0.8rem' } },
                                        "\u201C",
                                        request.managerResponse || 'Approved - valid business need',
                                        "\u201D"))),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '12px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6', border: '2px solid var(--surface-bg)', boxShadow: '0 0 0 2px #3b82f6' } })),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: 'var(--text-main)', display: 'block' } }, "Admin Assignment"),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: 'var(--text-muted)', fontSize: '0.75rem' } }, "Awaiting Asset Allocation"))))),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                            backgroundColor: this.props.isDarkTheme ? 'rgba(59, 130, 246, 0.05)' : 'rgba(37, 99, 235, 0.03)',
                            border: '1px solid rgba(37, 99, 235, 0.15)',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: 'var(--card-shadow)'
                        } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' } }, "Admin Assignment"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("label", { style: { fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)', display: 'block', marginBottom: '6px' } }, "Assign Asset (optional)"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_34__.Dropdown, { placeholder: dropdownPlaceholder, options: matchingAssetOptions, selectedKey: this.state.adminSelectedAssetId, onChange: this._onAdminAssetChange, disabled: matchingAssets.length === 0 || isBusy, styles: { dropdown: { width: '100%' } } })),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("label", { style: { fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)', display: 'block', marginBottom: '6px' } }, "Comment"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_35__.TextField, { multiline: true, rows: 4, placeholder: "Add a comment explaining your decision...", value: this.state.adminComment, onChange: (_, value) => this.setState({ adminComment: value || '' }), disabled: isBusy })),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '12px', marginTop: '8px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_36__.PrimaryButton, { text: isBusy ? "Processing..." : "Assign & Approve", onClick: this._handleAdminAssignAndApprove, disabled: isBusy, iconProps: { iconName: 'CompletedSolid' } }),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_37__.DefaultButton, { text: "Reject", onClick: this._handleAdminReject, disabled: isBusy, iconProps: { iconName: 'Cancel' }, styles: {
                                        root: { color: '#dc2626', borderColor: '#dc2626' },
                                        rootHovered: { color: '#ffffff', backgroundColor: '#dc2626', borderColor: '#dc2626' }
                                    } })))))));
        };
        let readIds = [];
        let clearedIds = [];
        try {
            readIds = JSON.parse(localStorage.getItem('inventory_read_notifications') || '[]');
            clearedIds = JSON.parse(localStorage.getItem('inventory_cleared_notifications') || '[]');
        }
        catch (e) {
            console.warn("localStorage parsing failed", e);
        }
        const activeName = props.userDisplayName;
        const activeEmail = props.userEmail;
        this.state = {
            items: [],
            employees: _data_mockData__WEBPACK_IMPORTED_MODULE_17__.EMPLOYEES,
            requests: [],
            auditLogs: [],
            userRole: 'Inventory Employee',
            previewRole: undefined,
            roleGroups: [],
            roleLoading: true,
            requestActionInProgressId: undefined,
            requestSearchId: '',
            isAssetFormOpen: false,
            isRequestFormOpen: false,
            loading: true,
            auditLogsLoading: true,
            auditLogsRefreshTrigger: 0,
            errorMessage: undefined,
            selectedTabKey: 'Dashboard',
            readNotificationIds: readIds,
            clearedNotificationIds: clearedIds,
            selectedNotification: undefined,
            isNotificationDetailsOpen: false,
            returnRequests: [],
            returnRequestsLoading: true,
            selectedAssetForReturn: undefined,
            isReturnFormOpen: false,
            activeUserDisplayName: activeName,
            activeUserEmail: activeEmail,
            isIncidentFormOpen: false,
            selectedAssetForIncident: undefined,
            preselectedIncidentType: undefined,
            selectedAdminRequest: undefined,
            isAdminPanelOpen: false,
            adminSelectedAssetId: undefined,
            adminComment: '',
            sidebarCollapsed: false,
            reportsSelectedTab: 'insights',
            reportsAssetTypeFilter: 'All',
            reportsStatusFilter: 'All',
            configSelectedTab: 'operations',
            connectionStatuses: {},
            connectionErrorMessages: {},
            groupUsersList: {},
            loadingGroupUsers: {},
            workflowPopup: {
                isOpen: false,
                title: '',
                stage: '',
                type: 'info',
                message: ''
            },
            lastMockEmail: undefined,
            editMockEmailTo: '',
            editMockEmailSubject: '',
            isSendingMockEmail: false,
            mockEmailSendError: undefined,
            mockEmailSendSuccess: false
        };
    }
    async componentDidMount() {
        await this._resolveUserRole();
        await this._loadReturnRequests();
        // Run self-healing cleanup for Return Approved/Completed assets BEFORE loading inventory
        try {
            await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.cleanupReturnApprovedAssets();
        }
        catch (e) {
            console.warn("Failed to run Return Approved assets self-healing cleanup:", e);
        }
        await this._loadInventory();
        await this._loadRequests();
        await this._loadAuditLogs();
        // Dynamically auto-sync existing assigned assets of our 5 active users to the Mapping List
        try {
            await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.syncExistingAssignmentsToMappingList(this.state.activeUserDisplayName);
            await this._loadInventory();
        }
        catch (e) {
            console.warn("Failed to auto-sync existing assignments to Mapping List:", e);
        }
        if (typeof window !== 'undefined') {
            window.addEventListener('spfx_mock_email_sent', this._handleMockEmailSent);
            window.addEventListener('spfx_email_send_failed', this._handleEmailSendFailed);
        }
    }
    componentWillUnmount() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('spfx_mock_email_sent', this._handleMockEmailSent);
            window.removeEventListener('spfx_email_send_failed', this._handleEmailSendFailed);
        }
    }
    render() {
        const { description, isDarkTheme, environmentMessage, hasTeamsContext } = this.props;
        const { items, isAssetFormOpen, isRequestFormOpen, auditLogs, auditLogsLoading, userRole, previewRole, roleLoading, roleGroups, requestActionInProgressId, requestSearchId, activeUserDisplayName, activeUserEmail, loading } = this.state;
        const effectiveRole = previewRole || userRole;
        const isAdmin = effectiveRole === 'Admin';
        const isManager = effectiveRole === 'Inventory Manager';
        const isEmployee = effectiveRole === 'Inventory Employee';
        const myAssets = items.filter(item => this._isAssetAssignedToCurrentUser(item, activeUserDisplayName || ''));
        const myRequests = this.state.requests.filter(request => this._isRequestOwnedByCurrentUser(request.requesterName || '', activeUserDisplayName || ''));
        const myApprovedRequests = myRequests.filter(request => (request.status || '').toLowerCase().includes('approv'));
        const adminQueueRequests = this.state.requests.filter(request => (request.status || '').toLowerCase().includes('approv'));
        const managerQueueRequests = this.state.requests;
        const normalizedSearch = (requestSearchId || '').trim().toLowerCase();
        const filterRequests = (reqs) => normalizedSearch
            ? reqs.filter(request => (request.requestKey || '').toLowerCase().includes(normalizedSearch) ||
                (request.id || '').toLowerCase().includes(normalizedSearch))
            : reqs;
        const visibleAdminRequests = filterRequests(adminQueueRequests);
        const visibleManagerRequests = filterRequests(managerQueueRequests);
        const notifications = this._getNotifications();
        const navItems = [
            { key: 'Dashboard', text: 'Dashboard', icon: 'BarChart4', group: 'MAIN' },
            { key: 'MyWorkspace', text: 'My Workspace', icon: 'Briefcase' },
            {
                key: 'Notifications',
                text: 'Notifications',
                icon: 'Ringer',
                badge: notifications.filter(n => !n.isRead).length || undefined,
                badgeColor: '#0078d4'
            },
            { key: 'IncidentHistory', text: 'Incident History', icon: 'History' },
            { key: 'ReplacementHistory', text: 'Replacement History', icon: 'Sync' },
            ...(isAdmin || isManager ? [
                { key: 'Inventory', text: 'Inventory', icon: 'List', group: 'MANAGEMENT' }
            ] : []),
            ...(isManager ? [
                { key: 'Approvals', text: 'Approvals', icon: 'DoubleChevronRight12', group: 'MANAGEMENT' }
            ] : []),
            ...(isAdmin ? [
                { key: 'AssetAssignmentQueue', text: 'Asset Assignment Queue', icon: 'Send', ...(isManager ? {} : { group: undefined }) }
            ] : []),
            ...(isAdmin || isManager ? [
                {
                    key: 'AssetReturns',
                    text: 'Asset Returns',
                    icon: 'ReturnToSession',
                    badge: this.state.returnRequests.filter(r => {
                        if (isAdmin)
                            return r.status === 'Pending Admin Verification';
                        if (isManager)
                            return r.status === 'Pending Manager Approval';
                        return r.status === 'Pending';
                    }).length || undefined,
                    badgeColor: '#ea580c'
                }
            ] : []),
            ...(isAdmin ? [
                { key: 'EventStream', text: 'Event Stream', icon: 'ActivityFeed', group: 'SYSTEM' },
                { key: 'Users', text: 'Users', icon: 'People' },
                { key: 'Reports', text: 'Reports', icon: 'ReportDocument' },
                { key: 'Config', text: 'Config', icon: 'Settings' }
            ] : [])
        ];
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("section", { className: `${_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].inventoryManagement} ${hasTeamsContext ? _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].teams : ''} ${isDarkTheme ? _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].dark : ''}` },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].mainContent },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].heroSection },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].heroText },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", null, "Inventory Management"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null,
                            "Welcome back, ",
                            (0,_microsoft_sp_lodash_subset__WEBPACK_IMPORTED_MODULE_2__.escape)(activeUserDisplayName),
                            "!"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].smallText },
                            "Role: ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, effectiveRole)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].smallText },
                            environmentMessage,
                            " \u2022 Location: ",
                            (0,_microsoft_sp_lodash_subset__WEBPACK_IMPORTED_MODULE_2__.escape)(description)),
                        isAdmin && roleGroups.length > 0 && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].smallText },
                            "SharePoint Groups: ",
                            (0,_microsoft_sp_lodash_subset__WEBPACK_IMPORTED_MODULE_2__.escape)(roleGroups.join(', '))))),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].welcomeDiagramContainer },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_AssetLifecycleDiagram__WEBPACK_IMPORTED_MODULE_25__.AssetLifecycleDiagram, { isDarkTheme: isDarkTheme }))),
                this.state.errorMessage && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { color: '#991b1b', backgroundColor: '#fee2e2', padding: '15px', borderRadius: '8px', marginBottom: '20px', position: 'relative' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Error:"),
                    " ",
                    this.state.errorMessage,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { onClick: () => this.setState({ errorMessage: undefined }), style: { position: 'absolute', right: '15px', top: '12px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', color: '#991b1b' }, "aria-label": "Dismiss error" }, "\u00D7"))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].appLayoutContainer },
                    !this.state.sidebarCollapsed && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].sidebarOverlay, onClick: () => this.setState({ sidebarCollapsed: true }), role: "presentation" })),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: `${_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].sidebarContainer} ${this.state.sidebarCollapsed ? _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].sidebarCollapsed : ''}`, role: "navigation", "aria-label": "Main navigation" },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].navHeader },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", null, "Navigation"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                "Role: ",
                                effectiveRole)),
                        navItems.map((nav, index) => {
                            const isActive = this.state.selectedTabKey === nav.key;
                            const showGroupLabel = nav.group && (index === 0 || navItems[index - 1]?.group !== nav.group);
                            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, { key: nav.key },
                                showGroupLabel && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].navGroupLabel }, nav.group)),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { onClick: () => this.setState({ selectedTabKey: nav.key }), onKeyDown: (e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            this.setState({ selectedTabKey: nav.key });
                                        }
                                    }, tabIndex: 0, role: "button", "aria-current": isActive ? 'page' : undefined, "aria-label": nav.text, className: `${_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].sidebarNavItem} ${isActive ? _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].navItemActive : ''}` },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_29__.Icon, { iconName: nav.icon }),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].navItemText }, nav.text),
                                    nav.badge !== undefined && nav.badge > 0 && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].navBadge, style: { backgroundColor: nav.badgeColor || '#e74c3c' } }, nav.badge)))));
                        }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].collapseToggle, onClick: () => this.setState(prev => ({ sidebarCollapsed: !prev.sidebarCollapsed })), role: "button", tabIndex: 0, "aria-label": this.state.sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation', onKeyDown: (e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    this.setState(prev => ({ sidebarCollapsed: !prev.sidebarCollapsed }));
                                }
                            } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_29__.Icon, { iconName: this.state.sidebarCollapsed ? 'DoubleChevronRight' : 'DoubleChevronLeft' }),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].collapseText }, this.state.sidebarCollapsed ? 'Expand' : 'Collapse'))),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: `${_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].card} ${_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].contentContainer}` },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].mobileNavHeader },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].mobileMenuToggle, onClick: () => this.setState(prev => ({ sidebarCollapsed: !prev.sidebarCollapsed })), "aria-label": "Toggle navigation menu" },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_29__.Icon, { iconName: "GlobalNavButton" })),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].mobileNavTitle }, "Inventory Management")),
                        (() => {
                            const dashboardState = {
                                items: isAdmin || isManager ? items : myAssets,
                                requests: isAdmin || isManager ? this.state.requests : myRequests,
                                isAdmin,
                                isInventoryManager: isManager
                            };
                            const dashboardActions = {
                                onNavigate: (key) => this.setState({ selectedTabKey: key })
                            };
                            const reportsState = {
                                reportsSelectedTab: this.state.reportsSelectedTab,
                                reportsAssetTypeFilter: this.state.reportsAssetTypeFilter,
                                reportsStatusFilter: this.state.reportsStatusFilter,
                                items,
                                requests: this.state.requests
                            };
                            const reportsActions = {
                                onTabChange: (tabKey) => this.setState({ reportsSelectedTab: tabKey }),
                                onAssetTypeFilterChange: (type) => this.setState({ reportsAssetTypeFilter: type }),
                                onStatusFilterChange: (status) => this.setState({ reportsStatusFilter: status }),
                                onExportDetailedReportToExcel: (filteredItems) => this._exportDetailedReportToExcel(filteredItems),
                                onExportDetailedReportToPDF: (filteredItems) => this._exportDetailedReportToPDF(filteredItems),
                                onExportWarrantyReportToExcel: () => this._exportWarrantyReportToExcel(),
                                onExportWarrantyReportToPDF: () => this._exportWarrantyReportToPDF()
                            };
                            const incidentHistoryState = {
                                userDisplayName: activeUserDisplayName || '',
                                userEmail: activeUserEmail || '',
                                userRole: effectiveRole
                            };
                            const incidentHistoryActions = {
                                setIsLoading: (loading) => this.setState({ loading })
                            };
                            const inventoryState = {
                                items,
                                loading,
                                isAdmin,
                                isInventoryManager: isManager
                            };
                            const inventoryActions = {
                                onOpenAssetForm: () => this.setState({ isAssetFormOpen: true })
                            };
                            switch (this.state.selectedTabKey) {
                                case 'Dashboard':
                                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_pages__WEBPACK_IMPORTED_MODULE_21__.DashboardPage, { state: dashboardState, actions: dashboardActions }));
                                case 'MyWorkspace':
                                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "My Workspace")),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Manage your assigned assets and track your requests."),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_38__.Pivot, { "aria-label": "My Workspace Tabs" },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_39__.PivotItem, { headerText: "Assets" },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px' } },
                                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginBottom: '15px' } },
                                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_36__.PrimaryButton, { text: "Request Asset", onClick: () => this.setState({ isRequestFormOpen: true }), iconProps: { iconName: 'Send' } })),
                                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_MyAssignedAssetsView__WEBPACK_IMPORTED_MODULE_4__.MyAssignedAssetsView, { items: myAssets, onReturnAsset: (item) => this.setState({ selectedAssetForReturn: item, isReturnFormOpen: true }), onRaiseIncident: (item) => this.setState({ selectedAssetForIncident: item, isIncidentFormOpen: true }), onAssetReplacement: (item) => this.setState({ selectedAssetForIncident: item, isIncidentFormOpen: true, preselectedIncidentType: 'Replacement Request' }) }))),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_39__.PivotItem, { headerText: "Requests" },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px' } },
                                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_MyRequestsView__WEBPACK_IMPORTED_MODULE_5__.MyRequestsView, { requests: myRequests, returnRequests: this.state.returnRequests.filter(r => this._isRequestOwnedByCurrentUser(r.requesterName || '', activeUserDisplayName || '')) }))))));
                                case 'Notifications':
                                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_NotificationCenter__WEBPACK_IMPORTED_MODULE_22__.NotificationCenter, { notifications: notifications, onMarkAsRead: this._markNotificationAsRead, onMarkAllAsRead: this._markAllNotificationsAsRead, onClearNotification: this._clearNotification, onClearAllNotifications: this._clearAllNotifications, onNotificationAction: this._handleNotificationAction }));
                                case 'IncidentHistory':
                                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_pages__WEBPACK_IMPORTED_MODULE_21__.IncidentHistoryPage, { ...this.props, state: incidentHistoryState, actions: incidentHistoryActions }));
                                case 'ReplacementHistory':
                                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Replacement History")),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ReplacementHistory_ReplacementHistory__WEBPACK_IMPORTED_MODULE_24__.ReplacementHistory, { ...this.props, userDisplayName: activeUserDisplayName, userEmail: activeUserEmail, userRole: effectiveRole, setIsLoading: (loading) => this.setState({ loading }) })));
                                case 'Inventory':
                                    return (isAdmin || isManager) ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_pages__WEBPACK_IMPORTED_MODULE_21__.InventoryPage, { state: inventoryState, actions: inventoryActions })) : null;
                                case 'Approvals':
                                    return isManager ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Request Approvals & Assignment Queue")),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Track and manage all asset requests efficiently."),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_35__.TextField, { label: "Search by Request ID", placeholder: "e.g. REQ-000123", value: requestSearchId, onChange: (_, value) => this.setState({ requestSearchId: value || '' }), styles: { root: { marginBottom: '12px', maxWidth: 320 } } }),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginBottom: '20px', padding: '15px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginBottom: '10px' } }, "Request Approval Distribution"),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { height: '250px', position: 'relative' } },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_chartjs_2__WEBPACK_IMPORTED_MODULE_40__.Pie, { data: {
                                                        labels: Object.keys(managerQueueRequests.reduce((acc, req) => {
                                                            const status = req.status || 'Pending';
                                                            acc[status] = (acc[status] || 0) + 1;
                                                            return acc;
                                                        }, {})).length ? Object.keys(managerQueueRequests.reduce((acc, req) => {
                                                            const status = req.status || 'Pending';
                                                            acc[status] = (acc[status] || 0) + 1;
                                                            return acc;
                                                        }, {})) : ['No data'],
                                                        datasets: [
                                                            {
                                                                label: 'Requests by Status',
                                                                data: Object.keys(managerQueueRequests.reduce((acc, req) => {
                                                                    const status = req.status || 'Pending';
                                                                    acc[status] = (acc[status] || 0) + 1;
                                                                    return acc;
                                                                }, {})).length ? Object.keys(managerQueueRequests.reduce((acc, req) => {
                                                                    const status = req.status || 'Pending';
                                                                    acc[status] = (acc[status] || 0) + 1;
                                                                    return acc;
                                                                }, {})).map(k => (managerQueueRequests.reduce((acc, req) => {
                                                                    const status = req.status || 'Pending';
                                                                    acc[status] = (acc[status] || 0) + 1;
                                                                    return acc;
                                                                }, {}))[k]) : [1],
                                                                backgroundColor: [
                                                                    'rgba(255, 206, 86, 0.6)',
                                                                    'rgba(75, 192, 192, 0.6)',
                                                                    'rgba(255, 99, 132, 0.6)',
                                                                    'rgba(153, 102, 255, 0.6)',
                                                                    'rgba(54, 162, 235, 0.6)',
                                                                ],
                                                                borderColor: [
                                                                    'rgba(255, 206, 86, 1)',
                                                                    'rgba(75, 192, 192, 1)',
                                                                    'rgba(255, 99, 132, 1)',
                                                                    'rgba(153, 102, 255, 1)',
                                                                    'rgba(54, 162, 235, 1)',
                                                                ],
                                                                borderWidth: 1,
                                                            },
                                                        ],
                                                    }, options: { maintainAspectRatio: false } }))),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_RequestList__WEBPACK_IMPORTED_MODULE_6__.RequestList, { items: visibleManagerRequests, canApproveReject: true, canApproveAsset: false, hideStatusColumn: false, showResponseColumns: false, onApproveRequest: this._onApproveRequest, onRejectRequest: this._onRejectRequest, actionInProgressId: requestActionInProgressId }))) : null;
                                case 'AssetAssignmentQueue':
                                    return isAdmin ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Approved Requests for Asset Assignment")),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Only approved requests are shown here so assets can be assigned."),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_35__.TextField, { label: "Search by Request ID", placeholder: "e.g. REQ-000123", value: requestSearchId, onChange: (_, value) => this.setState({ requestSearchId: value || '' }), styles: { root: { marginBottom: '12px', maxWidth: 320 } } }),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_RequestList__WEBPACK_IMPORTED_MODULE_6__.RequestList, { items: visibleAdminRequests, canApproveReject: false, canApproveAsset: true, hideStatusColumn: true, showResponseColumns: false, onSelectRequestForAssignment: (request) => this.setState({ selectedAdminRequest: request, isAdminPanelOpen: true, adminSelectedAssetId: undefined, adminComment: '' }), actionInProgressId: requestActionInProgressId }))) : null;
                                case 'AssetReturns':
                                    return isAdmin || isManager ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Asset Returns Registry")),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Review and complete employee asset return requests, and verify physical hardware check-ins."),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ReturnRequestList__WEBPACK_IMPORTED_MODULE_12__.ReturnRequestList, { items: this.state.returnRequests, isAdmin: isAdmin, isManager: isManager, onUpdateStatus: this._onUpdateReturnRequestStatus, loading: this.state.returnRequestsLoading }))) : null;
                                case 'EventStream':
                                    return isAdmin ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_EventStream__WEBPACK_IMPORTED_MODULE_10__.EventStream, { logs: auditLogs, loading: auditLogsLoading, errorMessage: undefined, currentUserRole: effectiveRole, currentUserName: activeUserDisplayName, refreshTrigger: this.state.auditLogsRefreshTrigger })) : null;
                                case 'Users':
                                    return isAdmin ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "User Administration")),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Admin-only area. Manage SharePoint groups and user onboarding from your site permissions."),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginBottom: '20px', padding: '15px', backgroundColor: '#f0f6ff', borderRadius: '8px', borderLeft: '4px solid #0078d4' } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginTop: 0, marginBottom: '10px', color: '#0078d4' } }, "SharePoint Group Management"),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { margin: 0, fontSize: '0.9rem', color: '#323130', marginBottom: '15px' } }, "To onboard new employees, grant them Admin access, or assign them as Inventory Managers, you must add them to the respective SharePoint Site Groups."),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_36__.PrimaryButton, { text: "Manage Site Permissions", iconProps: { iconName: 'Permissions' }, onClick: () => {
                                                    const siteUrl = window.location.pathname.substring(0, window.location.pathname.toLowerCase().indexOf('/sitepages'));
                                                    window.open(`${window.location.origin}${siteUrl}/_layouts/15/user.aspx`, '_blank');
                                                } })),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginBottom: '15px' } }, "Employee Directory & Asset Ownership"),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_41__.DetailsList, { items: this.state.employees.map(emp => {
                                                    const realName = emp.jobTitle === 'Admin' ? (activeUserDisplayName || emp.name) : emp.name;
                                                    const assignedItems = items.filter(i => this._isAssetAssignedToCurrentUser(i, realName));
                                                    const assetTypes = Array.from(new Set(assignedItems.map(a => a.assetType))).filter(t => t).join(', ');
                                                    return {
                                                        ...emp,
                                                        assignedAssets: assignedItems.length,
                                                        assignedItems: assignedItems,
                                                        assetTypes: assetTypes || 'None'
                                                    };
                                                }), columns: [
                                                    { key: 'col1', name: 'Name', fieldName: 'name', minWidth: 100, maxWidth: 150, isResizable: true },
                                                    { key: 'col2', name: 'Email', fieldName: 'email', minWidth: 150, maxWidth: 200, isResizable: true },
                                                    { key: 'col3', name: 'Department', fieldName: 'department', minWidth: 100, maxWidth: 120, isResizable: true },
                                                    { key: 'col4', name: 'Job Title', fieldName: 'jobTitle', minWidth: 120, maxWidth: 150, isResizable: true },
                                                    {
                                                        key: 'col5',
                                                        name: 'Assigned Assets',
                                                        fieldName: 'assignedAssets',
                                                        minWidth: 100,
                                                        maxWidth: 120,
                                                        isResizable: true,
                                                        onRender: (item) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                                                backgroundColor: item.assignedAssets > 0 ? '#dbeafe' : '#f3f4f6',
                                                                color: item.assignedAssets > 0 ? '#1e40af' : '#4b5563',
                                                                padding: '4px 10px',
                                                                borderRadius: '9999px',
                                                                fontWeight: 'bold'
                                                            } }, item.assignedAssets))
                                                    },
                                                    { key: 'col6', name: 'Asset Types', fieldName: 'assetTypes', minWidth: 120, maxWidth: 250, isResizable: true }
                                                ], setKey: "usersList", layoutMode: _fluentui_react__WEBPACK_IMPORTED_MODULE_42__.DetailsListLayoutMode.justified, selectionMode: _fluentui_react__WEBPACK_IMPORTED_MODULE_43__.SelectionMode.none, onRenderRow: (rowProps) => {
                                                    if (!rowProps)
                                                        return null;
                                                    const isExpanded = this.state.expandedUserEmail === rowProps.item.email;
                                                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { onClick: () => this.setState({ expandedUserEmail: isExpanded ? undefined : rowProps.item.email }), style: { cursor: 'pointer', '&:hover': { backgroundColor: '#f3f2f1' } } },
                                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_44__.DetailsRow, { ...rowProps })),
                                                        isExpanded && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '20px 40px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' } },
                                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginTop: 0, marginBottom: '15px', color: '#111827' } },
                                                                "Assets assigned to ",
                                                                rowProps.item.name),
                                                            rowProps.item.assignedItems.length > 0 ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_InventoryList__WEBPACK_IMPORTED_MODULE_3__.InventoryList, { items: rowProps.item.assignedItems, isAdmin: false })) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: '#6b7280', fontSize: '0.9rem', margin: 0 } }, "This user currently has no assets assigned to them."))))));
                                                } })),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '30px', borderTop: '1px solid rgba(128, 128, 128, 0.15)', paddingTop: '24px' } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Employee Asset Tracking")),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Admin and Manager area. Select an employee to view all assets currently assigned to them."),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_AssetTracking__WEBPACK_IMPORTED_MODULE_20__.AssetTracking, { items: items, employees: this.state.employees, currentUserRole: effectiveRole, currentUserName: activeUserDisplayName, currentUserEmail: activeUserEmail })))) : null;
                                case 'Reports':
                                    return isAdmin ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_pages__WEBPACK_IMPORTED_MODULE_21__.ReportsPage, { state: reportsState, actions: reportsActions })) : null;
                                case 'Config': {
                                    const configState = {
                                        configSelectedTab: this.state.configSelectedTab,
                                        syncInProgress: this.state.syncInProgress,
                                        syncMessage: this.state.syncMessage,
                                        syncMessageType: this.state.syncMessageType,
                                        diagnosticInfo: this.state.diagnosticInfo,
                                        connectionStatuses: this.state.connectionStatuses,
                                        connectionErrorMessages: this.state.connectionErrorMessages,
                                        loadingGroupUsers: this.state.loadingGroupUsers,
                                        groupUsersList: this.state.groupUsersList
                                    };
                                    const configActions = {
                                        onSyncAssignedAssets: this._onSyncAssignedAssets,
                                        onRunDiagnostics: this._onRunDiagnostics,
                                        onTestListConnection: this._testListConnection,
                                        onLoadGroupUsers: this._loadGroupUsers,
                                        onDismissSyncMessage: () => this.setState({ syncMessage: undefined }),
                                        onTabChange: (tabKey) => this.setState({ configSelectedTab: tabKey })
                                    };
                                    return isAdmin ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_pages__WEBPACK_IMPORTED_MODULE_21__.ConfigPage, { state: configState, actions: configActions })) : null;
                                }
                                default:
                                    return null;
                            }
                        })()))),
            (isAdmin || isManager) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_AssetForm__WEBPACK_IMPORTED_MODULE_8__.AssetForm, { isOpen: isAssetFormOpen, onClose: () => this.setState({ isAssetFormOpen: false }), currentUserRole: effectiveRole, onAddAsset: this._onAddAsset })),
            (isAdmin || isManager || isEmployee) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_RequestForm__WEBPACK_IMPORTED_MODULE_9__.RequestForm, { isOpen: isRequestFormOpen, onClose: () => this.setState({ isRequestFormOpen: false }), availableAssets: items, employees: this.state.employees, currentUserRole: effectiveRole, currentUserName: activeUserDisplayName, currentUserEmail: this.state.activeUserEmail, onSubmitRequest: this._onSubmitRequest })),
            (isAdmin || isManager || isEmployee) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_IncidentRequest_IncidentRequestModule__WEBPACK_IMPORTED_MODULE_23__.IncidentRequestModule, { ...this.props, isOpen: this.state.isIncidentFormOpen, onClose: () => this.setState({ isIncidentFormOpen: false, selectedAssetForIncident: undefined, preselectedIncidentType: undefined }), userDisplayName: activeUserDisplayName, userEmail: activeUserEmail, setIsLoading: (loading) => this.setState({ loading }), preselectedAsset: this.state.selectedAssetForIncident, preselectedIncidentType: this.state.preselectedIncidentType, onSuccessPopup: (details) => {
                    this.setState({
                        workflowPopup: {
                            isOpen: true,
                            title: 'Incident Ticket Logged',
                            stage: 'Incident Management: Logged',
                            type: 'warning',
                            message: `Incident ticket for "${details.assetName}" (${details.incidentType}) has been logged and assigned to Admin IT support.`,
                            details: {
                                assetTitle: details.assetName,
                                requesterName: details.requesterName,
                                status: 'Open Ticket',
                                date: new Date().toISOString().split('T')[0]
                            }
                        }
                    });
                } })),
            this._renderNotificationDetailsPanel(),
            this._renderAdminAssignmentPanel(),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ReturnAssetForm__WEBPACK_IMPORTED_MODULE_11__.ReturnAssetForm, { isOpen: this.state.isReturnFormOpen, onDismiss: () => this.setState({ isReturnFormOpen: false, selectedAssetForReturn: undefined }), asset: this.state.selectedAssetForReturn, onSubmit: this._onSubmitReturnRequest }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_WorkflowPopup__WEBPACK_IMPORTED_MODULE_26__.WorkflowPopup, { isOpen: this.state.workflowPopup?.isOpen, title: this.state.workflowPopup?.title || '', stage: this.state.workflowPopup?.stage || '', type: this.state.workflowPopup?.type || 'info', message: this.state.workflowPopup?.message || '', details: this.state.workflowPopup?.details, onDismiss: () => this.setState({ workflowPopup: { ...this.state.workflowPopup, isOpen: false } }) }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_32__.Panel, { isOpen: this.state.lastMockEmail !== undefined, onDismiss: () => this.setState({ lastMockEmail: undefined }), type: _fluentui_react__WEBPACK_IMPORTED_MODULE_33__.PanelType.medium, headerText: "\uD83D\uDCEC Outgoing Email Notification (Developer Preview)", closeButtonAriaLabel: "Close", onRenderFooterContent: () => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_28__.Stack, { horizontal: true, tokens: { childrenGap: 10 }, style: { padding: '10px 0' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_36__.PrimaryButton, { text: this.state.isSendingMockEmail ? "Sending..." : "Send Email", onClick: this._onSendMockEmail, disabled: this.state.isSendingMockEmail || this.state.mockEmailSendSuccess || !this.state.editMockEmailTo, iconProps: { iconName: 'Send' } }),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_37__.DefaultButton, { text: "Close", onClick: () => this.setState({ lastMockEmail: undefined }), disabled: this.state.isSendingMockEmail }))), isFooterAtBottom: true }, this.state.lastMockEmail && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_28__.Stack, { tokens: { childrenGap: 15 }, style: { padding: '10px 0' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_30__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.info }, "You can review, modify the recipient(s) or subject, and send this email to test delivery."),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_35__.TextField, { label: "Recipients (comma separated)", value: this.state.editMockEmailTo, onChange: (_, val) => this.setState({ editMockEmailTo: val || '' }), required: true, disabled: this.state.isSendingMockEmail, iconProps: { iconName: 'Mail' } }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_35__.TextField, { label: "Subject", value: this.state.editMockEmailSubject, onChange: (_, val) => this.setState({ editMockEmailSubject: val || '' }), required: true, disabled: this.state.isSendingMockEmail }),
                this.state.mockEmailSendSuccess && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_30__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.success }, "Email has been successfully dispatched to the Microsoft Graph / SharePoint mail queue!")),
                this.state.mockEmailSendError && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_30__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.error },
                    "Failed to send email: ",
                    this.state.mockEmailSendError)),
                this.state.isSendingMockEmail && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_31__.ProgressIndicator, { label: "Dispatched email transaction in progress..." })),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '10px' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '8px' } }, "Email Content Preview:"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { border: '1px solid #ddd', borderRadius: '8px', padding: '15px', overflow: 'auto', background: '#fff', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)', maxHeight: '400px' }, dangerouslySetInnerHTML: { __html: this.state.lastMockEmail.body } })))))));
    }
}


/***/ }),

/***/ 95966:
/*!*****************************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/components/MyAssignedAssetsView.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MyAssignedAssetsView: () => (/* binding */ MyAssignedAssetsView)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 85959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fluentui/react */ 21314);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fluentui/react */ 63208);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fluentui/react */ 46643);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fluentui/react */ 52394);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fluentui/react */ 67102);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fluentui/react */ 12042);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @fluentui/react */ 5613);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @fluentui/react */ 72674);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @fluentui/react */ 27006);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @fluentui/react */ 18681);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @fluentui/react */ 29425);
/* harmony import */ var _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./InventoryManagement.module.scss */ 99623);
/* harmony import */ var _constants_DropdownConstants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants/DropdownConstants */ 82889);





const MyAssignedAssetsView = (props) => {
    const { items, onReturnAsset, onRaiseIncident, onAssetReplacement } = props;
    // Search and Filter States
    const [searchQuery, setSearchQuery] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const [selectedType, setSelectedType] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('All');
    const [selectedCondition, setSelectedCondition] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('All');
    const [selectedWarranty, setSelectedWarranty] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('All');
    // Detail Panel State
    const [selectedAsset, setSelectedAsset] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
    const [isPanelOpen, setIsPanelOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    // Helper: Get Asset Age in Months
    const getAgeInMonths = (purchaseDateStr) => {
        if (!purchaseDateStr)
            return null;
        const purchaseDate = new Date(purchaseDateStr);
        if (isNaN(purchaseDate.getTime()))
            return null;
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - purchaseDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.round(diffDays / 30.4375); // average days in a month
    };
    // Helper: Evaluate Warranty Coverage
    const evaluateWarranty = (expiryStr) => {
        if (!expiryStr)
            return { status: 'Unknown', isExpired: false, isExpiringSoon: false, text: 'No warranty registered' };
        const expiryDate = new Date(expiryStr);
        if (isNaN(expiryDate.getTime()))
            return { status: 'Unknown', isExpired: false, isExpiringSoon: false, text: 'Invalid Date' };
        const now = new Date();
        const diffTime = expiryDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) {
            return { status: 'Expired', isExpired: true, isExpiringSoon: false, text: 'Expired' };
        }
        else if (diffDays <= 30) {
            return { status: 'Expiring Soon', isExpired: false, isExpiringSoon: true, text: `Expiring Soon (${diffDays} days)` };
        }
        else {
            return { status: 'Active', isExpired: false, isExpiringSoon: false, text: 'Active' };
        }
    };
    // Helper: Get Type Icon Name
    const getTypeIcon = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('laptop') || t.includes('macbook'))
            return 'LaptopSelected';
        if (t.includes('monitor') || t.includes('screen') || t.includes('display'))
            return 'System';
        if (t.includes('phone') || t.includes('mobile'))
            return 'CellPhone';
        if (t.includes('tablet') || t.includes('ipad'))
            return 'Tablet';
        if (t.includes('headset') || t.includes('headphone'))
            return 'Headset';
        if (t.includes('keyboard'))
            return 'KeyboardClassic';
        if (t.includes('mouse'))
            return 'Mouse';
        return 'Devices2';
    };
    // Dynamic Metrics derived from all items
    const metrics = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
        let activeWarranties = 0;
        let expiredOrExpiringWarranties = 0;
        let actionNeeded = 0;
        items.forEach(item => {
            const w = evaluateWarranty(item.warrantyExpiry);
            if (w.status === 'Active')
                activeWarranties++;
            if (w.status === 'Expired' || w.status === 'Expiring Soon')
                expiredOrExpiringWarranties++;
            const cond = (item.condition || '').toLowerCase();
            if (cond === 'poor' || cond === 'damaged')
                actionNeeded++;
        });
        return {
            total: items.length,
            activeWarranties,
            expiredOrExpiringWarranties,
            actionNeeded
        };
    }, [items]);
    // Unique Asset Types for filter dropdown
    const typeOptions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
        const types = new Set();
        items.forEach(item => {
            if (item.assetType)
                types.add(item.assetType);
        });
        const options = [
            { key: 'All', text: 'All Types' }
        ];
        types.forEach(t => {
            options.push({ key: t, text: t });
        });
        return options;
    }, [items]);
    // Filtering Logic (New to Old)
    const filteredItems = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
        const filtered = items.filter(item => {
            // 1. Search filter
            const normQuery = searchQuery.toLowerCase().trim();
            const matchesSearch = !normQuery ||
                (item.assetName || '').toLowerCase().includes(normQuery) ||
                (item.title || '').toLowerCase().includes(normQuery) ||
                (item.serialNumber || '').toLowerCase().includes(normQuery) ||
                (item.assetType || '').toLowerCase().includes(normQuery) ||
                (item.vendor || '').toLowerCase().includes(normQuery) ||
                (item.specifications || '').toLowerCase().includes(normQuery);
            // 2. Type filter
            const matchesType = selectedType === 'All' || item.assetType === selectedType;
            // 3. Condition filter
            const matchesCondition = selectedCondition === 'All' || item.condition === selectedCondition;
            // 4. Warranty filter
            const w = evaluateWarranty(item.warrantyExpiry);
            const matchesWarranty = selectedWarranty === 'All' || w.status === selectedWarranty;
            return matchesSearch && matchesType && matchesCondition && matchesWarranty;
        });
        return filtered.sort((a, b) => {
            const dateA = a.assignedDate || a.purchaseDate || '';
            const dateB = b.assignedDate || b.purchaseDate || '';
            if (dateA && dateB && dateA !== dateB) {
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            }
            const numA = parseInt((a.id || '0').replace(/\D/g, ''), 10);
            const numB = parseInt((b.id || '0').replace(/\D/g, ''), 10);
            if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
                return numB - numA;
            }
            return (b.id || '').localeCompare(a.id || '');
        });
    }, [items, searchQuery, selectedType, selectedCondition, selectedWarranty]);
    // Detailed Age and Lifecycle Recommendation rendering for the panel
    const renderLifecycleAnalysis = (asset) => {
        const age = getAgeInMonths(asset.purchaseDate);
        const w = evaluateWarranty(asset.warrantyExpiry);
        const condition = asset.condition || 'Good';
        const isCritical = condition === 'Poor' || condition === 'Damaged';
        let conditionColor = '#166534';
        let healthRating = 'Excellent';
        let healthIcon = 'Heart';
        if (condition === 'Fair') {
            conditionColor = '#d97706';
            healthRating = 'Satisfactory';
            healthIcon = 'HeartBroken';
        }
        else if (condition === 'Poor') {
            conditionColor = '#ea580c';
            healthRating = 'Degraded';
            healthIcon = 'ShieldAlert';
        }
        else if (condition === 'Damaged') {
            conditionColor = '#dc2626';
            healthRating = 'Unusable / Broken';
            healthIcon = 'Warning';
        }
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.Stack, { tokens: { childrenGap: 15 }, style: { marginTop: '20px' } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 5px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', color: '#1e293b' } }, "Lifecycle & Health Report"),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 } }, "Asset Lifecycle Age"),
                age !== null ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.9rem', color: '#334155' } },
                    "This asset is ",
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, age),
                    " month(s) old (",
                    Math.round(age / 12 * 10) / 10,
                    " years). Standard enterprise deprecation lifecycle is 36 months.",
                    age >= 36 ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#b45309', display: 'block', marginTop: '6px', fontWeight: 'bold' } }, "\u26A0\uFE0F Asset has reached/passed its standard 3-year lifecycle. Eligible for refresh replacement.")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#166534', display: 'block', marginTop: '6px' } },
                        "\u2713 Asset is within standard usage lifecycle (",
                        36 - age,
                        " months remaining).")))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.9rem', color: '#64748b' } }, "Purchase date is not registered. Age cannot be calculated."))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px', fontWeight: 600 } }, "Warranty Coverage"),
                asset.warrantyExpiry ? (w.isExpired ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_5__.MessageBarType.error, styles: { root: { borderRadius: '6px' } } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Warranty Expired:"),
                    " Coverage ended on ",
                    asset.warrantyExpiry,
                    ". Future repairs will be billed to the departmental cost center.")) : w.isExpiringSoon ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_5__.MessageBarType.warning, styles: { root: { borderRadius: '6px' } } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Warranty Expiring Soon:"),
                    " Expires on ",
                    asset.warrantyExpiry,
                    ". Please plan hardware checks before expiry.")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_5__.MessageBarType.success, styles: { root: { borderRadius: '6px' } } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Warranty Active:"),
                    " Fully protected until ",
                    asset.warrantyExpiry,
                    "."))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_5__.MessageBarType.info, styles: { root: { borderRadius: '6px' } } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Warranty Unknown:"),
                    " No warranty expiration record exists for this item."))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px', fontWeight: 600 } }, "Physical Condition"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.Icon, { iconName: healthIcon, style: { fontSize: '18px', color: conditionColor } }),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                        "Health Rating: ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: conditionColor } },
                            healthRating,
                            " (",
                            condition,
                            ")"))),
                isCritical && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '10px', padding: '8px', backgroundColor: '#fef2f2', borderRadius: '4px', borderLeft: '3px solid #dc2626' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.82rem', color: '#991b1b', fontWeight: 'bold', display: 'block' } }, "Recommendation: RETIRE ASSET"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.8rem', color: '#991b1b' } },
                        "Since this asset is in ",
                        condition.toLowerCase(),
                        " condition, it is recommended to return the asset and raise a replacement request.")))),
            asset.specifications && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px', fontWeight: 600 } }, "System Specifications"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("pre", { style: { margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.82rem', color: '#334155' } }, asset.specifications)))));
    };
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '15px' } },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricsRow },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricItem },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Assigned Assets"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-main)' } }, metrics.total)),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricDivider }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricItem },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Under Warranty"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: '#16a34a' } }, metrics.activeWarranties)),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricDivider }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricItem },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Warranty Action"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: metrics.expiredOrExpiringWarranties > 0 ? '#d97706' : 'var(--text-muted)' } }, metrics.expiredOrExpiringWarranties)),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricDivider }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricItem },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Critical Alerts"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: metrics.actionNeeded > 0 ? '#dc2626' : 'var(--text-muted)' } }, metrics.actionNeeded))),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].filtersRow },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].searchField },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.TextField, { placeholder: "Search by asset name, type, serial number...", value: searchQuery, onChange: (e, val) => setSearchQuery(val || ''), iconProps: { iconName: 'Search' }, underlined: true })),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].filterDropdown },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.Dropdown, { options: typeOptions, selectedKey: selectedType, onChange: (e, option) => setSelectedType(option ? option.key : 'All'), styles: { root: { selectors: { '.ms-Dropdown-title': { border: 'none', borderBottom: '1px solid #a1a1a1', background: 'transparent', paddingLeft: 0 } } } } })),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].filterDropdown },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.Dropdown, { options: [
                        { key: 'All', text: 'All Conditions' },
                        ..._constants_DropdownConstants__WEBPACK_IMPORTED_MODULE_2__.ASSET_CONDITION_OPTIONS
                    ], selectedKey: selectedCondition, onChange: (e, option) => setSelectedCondition(option ? option.key : 'All'), styles: { root: { selectors: { '.ms-Dropdown-title': { border: 'none', borderBottom: '1px solid #a1a1a1', background: 'transparent', paddingLeft: 0 } } } } })),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].filterDropdown },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.Dropdown, { options: [
                        { key: 'All', text: 'All Coverage' },
                        ..._constants_DropdownConstants__WEBPACK_IMPORTED_MODULE_2__.WARRANTY_STATUS_OPTIONS
                    ], selectedKey: selectedWarranty, onChange: (e, option) => setSelectedWarranty(option ? option.key : 'All'), styles: { root: { selectors: { '.ms-Dropdown-title': { border: 'none', borderBottom: '1px solid #a1a1a1', background: 'transparent', paddingLeft: 0 } } } } })),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.DefaultButton, { text: "Reset", iconProps: { iconName: 'ClearFilter' }, onClick: () => {
                        setSearchQuery('');
                        setSelectedType('All');
                        setSelectedCondition('All');
                        setSelectedWarranty('All');
                    }, style: { height: '30px', border: 'none', background: 'transparent' } }))),
        filteredItems.length > 0 ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '16px',
                marginTop: '10px'
            } }, filteredItems.map(item => {
            const w = evaluateWarranty(item.warrantyExpiry);
            const condition = item.condition || 'Good';
            const age = getAgeInMonths(item.purchaseDate);
            // Condition badge styling
            let conditionBg = '#e6f4ea';
            let conditionText = '#137333';
            if (condition === 'Fair') {
                conditionBg = '#fef7e0';
                conditionText = '#b06000';
            }
            else if (condition === 'Poor') {
                conditionBg = '#ffe8d6';
                conditionText = '#a63e00';
            }
            else if (condition === 'Damaged') {
                conditionBg = '#fce8e6';
                conditionText = '#c5221f';
            }
            // Return action states
            const isPendingReturn = item.status === 'Pending Return';
            const isReturnApproved = item.status === 'Return Approved';
            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { key: item.id, style: {
                    backgroundColor: 'var(--surface-bg)',
                    borderRadius: '6px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                    overflow: 'hidden'
                }, className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].assetCardHover },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                        padding: '14px 14px 6px 14px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between'
                    } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.Icon, { iconName: getTypeIcon(item.assetType), style: { fontSize: '14px', color: 'var(--text-muted)' } }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' } }, item.assetName || item.title),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.72rem', color: 'var(--text-muted)' } },
                                item.vendor || 'Brand Unknown',
                                " \u2022 ",
                                item.assetType))),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                            backgroundColor: conditionBg,
                            color: conditionText,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.68rem',
                            fontWeight: 600
                        } }, condition)),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '4px 14px 12px 14px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' } },
                    item.specifications && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: {
                            margin: '0 0 2px 0',
                            fontSize: '0.78rem',
                            color: 'var(--text-muted)',
                            lineHeight: '1.4',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            height: '32px'
                        } }, item.specifications)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.75rem',
                            borderTop: '1px solid rgba(0, 0, 0, 0.04)',
                            paddingTop: '6px',
                            color: 'var(--text-main)'
                        } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                            "S/N: ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, item.serialNumber || 'N/A')),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                            "Purchased: ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'))),
                    age !== null && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.72rem', color: 'var(--text-muted)' } },
                        "Age: ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, age),
                        " month(s) ",
                        age >= 36 && react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#d97706', fontWeight: 500 } }, "(Refresh Eligible \u26A0\uFE0F)"))),
                    item.warrantyExpiry && (w.isExpired || w.isExpiringSoon) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: w.isExpired ? '#fdf2f2' : '#fff9e6',
                            padding: '4px 6px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            color: w.isExpired ? '#c5221f' : '#b06000',
                            marginTop: 'auto'
                        } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.Icon, { iconName: w.isExpired ? "ShieldAlert" : "Warning", style: { fontSize: '10px' } }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null,
                                "Warranty ",
                                w.isExpired ? 'Expired' : 'Expiring',
                                ":"),
                            " ",
                            w.text))),
                    item.warrantyExpiry && !w.isExpired && !w.isExpiringSoon && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { fontSize: '0.72rem', color: '#137333', display: 'flex', alignItems: 'center', gap: '3px', marginTop: 'auto' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.Icon, { iconName: "VerifiedBrand", style: { fontSize: '10px' } }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                            "Warranty Active (Expires: ",
                            new Date(item.warrantyExpiry).toLocaleDateString(),
                            ")")))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                        padding: '8px 14px 10px 14px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        borderTop: '1px solid rgba(0, 0, 0, 0.04)',
                        alignItems: 'center'
                    } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.DefaultButton, { text: "Details", onClick: () => {
                            setSelectedAsset(item);
                            setIsPanelOpen(true);
                        }, style: { height: '24px', padding: '0 6px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid #e0e0e0', minWidth: 'auto' } }),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.DefaultButton, { text: "Report Issue", onClick: () => onRaiseIncident(item), style: { height: '24px', padding: '0 6px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid #e0e0e0', minWidth: 'auto' } }),
                    onAssetReplacement && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.DefaultButton, { text: "Asset Replacement", iconProps: { iconName: 'Sync' }, onClick: () => onAssetReplacement(item), style: { height: '24px', padding: '0 6px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid #e0e0e0', minWidth: 'auto' } })),
                    isPendingReturn ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                            backgroundColor: '#ffe8d6',
                            color: '#a63e00',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            marginLeft: 'auto'
                        } }, "Pending Return")) : isReturnApproved ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                            backgroundColor: '#e6f4ea',
                            color: '#137333',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            marginLeft: 'auto'
                        } }, "Approved")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.DefaultButton, { text: "Return", onClick: () => onReturnAsset(item), style: {
                            height: '24px',
                            padding: '0 6px',
                            fontSize: '0.72rem',
                            borderRadius: '4px',
                            border: '1px solid #e0e0e0',
                            marginLeft: 'auto',
                            minWidth: 'auto'
                        } })))));
        }))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                textAlign: 'center',
                padding: '30px 10px',
                backgroundColor: 'var(--surface-bg)',
                borderRadius: '6px',
                border: '1px solid rgba(0, 0, 0, 0.08)'
            } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.Icon, { iconName: "DatabaseNoData", style: { fontSize: '32px', color: 'var(--text-muted)', marginBottom: '8px' } }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_10__.Text, { variant: "medium", block: true, style: { fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' } }, "No Assigned Assets Found"),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_10__.Text, { variant: "small", style: { color: 'var(--text-muted)' } }, "Try adjusting your search query or filters."))),
        selectedAsset && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_11__.Panel, { isOpen: isPanelOpen, onDismiss: () => {
                setIsPanelOpen(false);
                setSelectedAsset(null);
            }, type: _fluentui_react__WEBPACK_IMPORTED_MODULE_12__.PanelType.medium, headerText: `Asset Details: ${selectedAsset.assetName || selectedAsset.title}`, closeButtonAriaLabel: "Close" },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].responsiveGrid, style: {
                        backgroundColor: '#f1f5f9',
                        padding: '15px',
                        borderRadius: '8px',
                        fontSize: '0.88rem'
                    } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Asset Type:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, selectedAsset.assetType)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Vendor/Brand:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, selectedAsset.vendor || 'Unknown')),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Serial Number:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, selectedAsset.serialNumber || 'N/A')),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Asset Status:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, selectedAsset.status)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { gridColumn: 'span 2' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Title Description:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, selectedAsset.title))),
                renderLifecycleAnalysis(selectedAsset),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.Stack, { horizontal: true, tokens: { childrenGap: 10 }, style: { marginTop: '25px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_13__.PrimaryButton, { text: "Report Incident", onClick: () => {
                            setIsPanelOpen(false);
                            onRaiseIncident(selectedAsset);
                            setSelectedAsset(null);
                        }, iconProps: { iconName: 'AlertSolid' } }),
                    selectedAsset.status !== 'Pending Return' && selectedAsset.status !== 'Return Approved' && onAssetReplacement && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.DefaultButton, { text: "Asset Replacement", onClick: () => {
                            setIsPanelOpen(false);
                            onAssetReplacement(selectedAsset);
                            setSelectedAsset(null);
                        }, iconProps: { iconName: 'Sync' } })),
                    selectedAsset.status !== 'Pending Return' && selectedAsset.status !== 'Return Approved' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.DefaultButton, { text: "Request Return", onClick: () => {
                            setIsPanelOpen(false);
                            onReturnAsset(selectedAsset);
                            setSelectedAsset(null);
                        }, iconProps: { iconName: 'ReturnToSession' } })),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.DefaultButton, { text: "Close", onClick: () => {
                            setIsPanelOpen(false);
                            setSelectedAsset(null);
                        } })))))));
};


/***/ }),

/***/ 635:
/*!**********************************************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/components/ReplacementHistory/ReplacementHistory.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReplacementHistory: () => (/* binding */ ReplacementHistory)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 85959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fluentui/react */ 72674);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fluentui/react */ 21314);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fluentui/react */ 29425);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fluentui/react */ 21262);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fluentui/react */ 12042);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @fluentui/react */ 79370);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @fluentui/react */ 37805);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @fluentui/react */ 74423);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @fluentui/react */ 52394);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @fluentui/react */ 27006);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @fluentui/react */ 18681);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @fluentui/react */ 67102);
/* harmony import */ var jspdf__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jspdf */ 28339);
/* harmony import */ var _ReplacementHistory_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ReplacementHistory.module.scss */ 217);
/* harmony import */ var _services_IncidentService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/IncidentService */ 76911);






const ReplacementHistory = (props) => {
    const [replacements, setReplacements] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
    const [filteredReplacements, setFilteredReplacements] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
    const [searchText, setSearchText] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const [statusFilter, setStatusFilter] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
    const [selectedReplacement, setSelectedReplacement] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
    const [showDetailPanel, setShowDetailPanel] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const [tempResolution, setTempResolution] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const getPriorityBadgeStyle = (priority) => {
        const p = priority || 'Medium';
        let backgroundColor = '#f3f4f6';
        let color = '#4b5563';
        if (p === 'High' || p === 'Critical') {
            backgroundColor = '#fee2e2';
            color = '#b91c1c';
        }
        else if (p === 'Low') {
            backgroundColor = '#dbeafe';
            color = '#1e3a8a';
        }
        return {
            backgroundColor,
            color,
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'inline-block'
        };
    };
    const getStatusBadgeStyle = (status) => {
        const s = status || 'Open';
        let backgroundColor = '#fee2e2';
        let color = '#991b1b';
        if (s === 'In Progress') {
            backgroundColor = '#fef3c7';
            color = '#92400e';
        }
        else if (s === 'Resolved') {
            backgroundColor = '#dcfce7';
            color = '#166534';
        }
        else if (s === 'Closed') {
            backgroundColor = '#f3f4f6';
            color = '#4b5563';
        }
        return {
            backgroundColor,
            color,
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'inline-block',
            textAlign: 'center'
        };
    };
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        loadReplacements();
    }, [props.userEmail]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        filterReplacements();
    }, [searchText, statusFilter, replacements]);
    const loadReplacements = async () => {
        try {
            props.setIsLoading(true);
            const service = new _services_IncidentService__WEBPACK_IMPORTED_MODULE_3__.IncidentService(props.spContext);
            const isAdmin = props.userRole === 'Admin';
            const data = await service.getEmployeeReplacementHistory(props.userEmail, isAdmin);
            setReplacements(data);
        }
        catch (error) {
            console.error('Error loading replacement history:', error);
        }
        finally {
            props.setIsLoading(false);
        }
    };
    const filterReplacements = () => {
        let filtered = [...replacements];
        if (searchText) {
            filtered = filtered.filter((rep) => (rep.assetName || '').toLowerCase().includes(searchText.toLowerCase()) ||
                (rep.incidentId || '').toLowerCase().includes(searchText.toLowerCase()));
        }
        if (statusFilter) {
            filtered = filtered.filter((rep) => rep.status === statusFilter);
        }
        setFilteredReplacements(filtered);
    };
    const handleViewDetails = (item) => {
        setSelectedReplacement(item);
        setTempResolution(item.resolution || '');
        setShowDetailPanel(true);
    };
    const handleStatusChange = async (rep, newStatus) => {
        try {
            props.setIsLoading(true);
            const service = new _services_IncidentService__WEBPACK_IMPORTED_MODULE_3__.IncidentService(props.spContext);
            await service.updateIncidentStatus(rep.id, newStatus, rep.resolution);
            const updated = {
                ...rep,
                status: newStatus,
                resolvedDate: newStatus === 'Resolved' || newStatus === 'Closed' ? new Date().toISOString() : rep.resolvedDate
            };
            setSelectedReplacement(updated);
            await loadReplacements();
        }
        catch (error) {
            console.error('Error updating status:', error);
        }
        finally {
            props.setIsLoading(false);
        }
    };
    const handleSaveResolution = async (rep) => {
        try {
            props.setIsLoading(true);
            const service = new _services_IncidentService__WEBPACK_IMPORTED_MODULE_3__.IncidentService(props.spContext);
            await service.updateIncidentStatus(rep.id, rep.status, tempResolution);
            const updated = {
                ...rep,
                resolution: tempResolution
            };
            setSelectedReplacement(updated);
            await loadReplacements();
        }
        catch (error) {
            console.error('Error saving resolution:', error);
        }
        finally {
            props.setIsLoading(false);
        }
    };
    const handleDownloadReport = (rep) => {
        try {
            const doc = new jspdf__WEBPACK_IMPORTED_MODULE_1__.jsPDF();
            // Top header banner
            doc.setFillColor(0, 90, 158); // #005a9e (Deep blue theme color)
            doc.rect(0, 0, 210, 25, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("MSFT INVENTORY MANAGEMENT", 14, 16);
            // Document Title
            doc.setTextColor(51, 65, 85); // Slate 700
            doc.setFontSize(14);
            doc.text("ASSET REPLACEMENT REPORT", 14, 38);
            // Metadata
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 44);
            // Separator line
            doc.setDrawColor(226, 232, 240); // Slate 200
            doc.line(14, 48, 196, 48);
            // Specifications Section Title
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text("REPLACEMENT SPECIFICATIONS", 14, 58);
            // Render Specifications Key-Value grid
            let y = 68;
            const printField = (label, value) => {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9);
                doc.setTextColor(100, 116, 139); // Slate 500
                doc.text(label, 14, y);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(9.5);
                doc.setTextColor(15, 23, 42); // Slate 900
                doc.text(value, 55, y);
                y += 8;
            };
            printField("Replacement ID:", rep.incidentId);
            printField("Asset Name:", rep.assetName);
            printField("Type:", "Replacement Request");
            printField("Priority:", rep.priority || "Medium");
            printField("Current Status:", rep.status || "Open");
            printField("Reported Date:", new Date(rep.reportedDate).toLocaleString());
            if (rep.assignedTo) {
                printField("Assigned To:", rep.assignedTo);
            }
            if (rep.resolvedDate) {
                printField("Resolved Date:", new Date(rep.resolvedDate).toLocaleString());
            }
            // Reason Title
            y += 4;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(51, 65, 85);
            doc.text("REPLACEMENT REASON & DETAILS", 14, y);
            y += 6;
            // Reason Box
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(51, 65, 85);
            const splitDesc = doc.splitTextToSize(rep.issueDescription || "No reason provided.", 170);
            const descHeight = splitDesc.length * 6 + 10;
            // Draw background box
            doc.setFillColor(248, 250, 252); // slate 50
            doc.setDrawColor(226, 232, 240); // slate 200
            doc.rect(14, y, 182, descHeight, 'FD');
            // Draw left accent bar
            doc.setFillColor(100, 116, 139); // slate 500
            doc.rect(14, y, 3, descHeight, 'F');
            // Draw text
            let textY = y + 8;
            splitDesc.forEach((line) => {
                doc.text(line, 22, textY);
                textY += 6;
            });
            y += descHeight + 10;
            // Resolution Details (if resolved/closed)
            if (rep.resolution) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(11);
                doc.setTextColor(51, 65, 85);
                doc.text("RESOLUTION SUMMARY", 14, y);
                y += 6;
                doc.setFont("helvetica", "normal");
                doc.setFontSize(9.5);
                doc.setTextColor(22, 101, 52); // green 800
                const splitRes = doc.splitTextToSize(rep.resolution, 170);
                const resHeight = splitRes.length * 6 + 10;
                // Draw green background box
                doc.setFillColor(240, 253, 244); // green 50
                doc.setDrawColor(220, 252, 231); // green 200
                doc.rect(14, y, 182, resHeight, 'FD');
                // Draw green left accent bar
                doc.setFillColor(22, 101, 52); // green 800
                doc.rect(14, y, 3, resHeight, 'F');
                // Draw resolution text
                let resTextY = y + 8;
                splitRes.forEach((line) => {
                    doc.text(line, 22, resTextY);
                    resTextY += 6;
                });
            }
            doc.save(`replacement-${rep.incidentId}.pdf`);
        }
        catch (error) {
            console.error('Error generating PDF report:', error);
        }
    };
    const columns = [
        {
            key: 'replacementId',
            name: 'Replacement ID',
            fieldName: 'incidentId',
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item) => react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Text, null, item.incidentId),
        },
        {
            key: 'assetName',
            name: 'Asset',
            fieldName: 'assetName',
            minWidth: 120,
            maxWidth: 180,
            isResizable: true,
            onRender: (item) => react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Text, null, item.assetName),
        },
        {
            key: 'issueType',
            name: 'Type',
            fieldName: 'issueType',
            minWidth: 120,
            maxWidth: 150,
            isResizable: true,
            onRender: () => react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Text, null, "Replacement Request"),
        },
        {
            key: 'priority',
            name: 'Priority',
            fieldName: 'priority',
            minWidth: 80,
            maxWidth: 100,
            isResizable: true,
            onRender: (item) => {
                return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: getPriorityBadgeStyle(item.priority) }, item.priority || 'Medium'));
            },
        },
        {
            key: 'status',
            name: 'Status',
            fieldName: 'status',
            minWidth: 90,
            maxWidth: 120,
            isResizable: true,
            onRender: (item) => {
                return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: getStatusBadgeStyle(item.status) }, item.status || 'Open'));
            },
        },
        {
            key: 'reportedDate',
            name: 'Reported',
            fieldName: 'reportedDate',
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item) => {
                if (!item.reportedDate)
                    return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Text, null, "-");
                try {
                    return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Text, null, new Date(item.reportedDate).toLocaleDateString());
                }
                catch {
                    return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Text, null, item.reportedDate);
                }
            },
        },
        {
            key: 'actions',
            name: 'Actions',
            minWidth: 160,
            maxWidth: 220,
            isResizable: true,
            onRender: (item) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_5__.Stack, { horizontal: true, tokens: { childrenGap: 8 } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.PrimaryButton, { text: "View", onClick: () => handleViewDetails(item), styles: {
                        root: { padding: '2px 10px', fontSize: '11px', height: '24px' },
                    } }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.PrimaryButton, { text: "Download", onClick: () => handleDownloadReport(item), styles: {
                        root: { padding: '2px 10px', fontSize: '11px', height: '24px' },
                    } }))),
        },
    ];
    const statusFilterOptions = [
        { key: '', text: 'All Status' },
        { key: 'Open', text: 'Open' },
        { key: 'In Progress', text: 'In Progress' },
        { key: 'Resolved', text: 'Resolved' },
        { key: 'Closed', text: 'Closed' },
    ];
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px' }, className: _ReplacementHistory_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].replacementHistory },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_5__.Stack, { tokens: { childrenGap: 15 } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '5px' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.SearchBox, { placeholder: "Search by replacement ID, asset name...", value: searchText, onChange: (ev, newValue) => setSearchText(newValue || ''), onClear: () => setSearchText(''), styles: { root: { width: '100%', maxWidth: 400 } } }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.Dropdown, { placeholder: "Filter by status", options: statusFilterOptions, onChange: (ev, option) => setStatusFilter(option?.key || null), styles: { root: { width: 200 } } })),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Text, { variant: "small", style: { color: 'var(--text-muted, #6b7280)', display: 'block' } },
                "Showing ",
                filteredReplacements.length,
                " of ",
                replacements.length,
                " replacement requests"),
            filteredReplacements.length > 0 ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.DetailsList, { items: filteredReplacements, columns: columns, setKey: "replacement-list", layoutMode: _fluentui_react__WEBPACK_IMPORTED_MODULE_10__.DetailsListLayoutMode.justified, selectionMode: _fluentui_react__WEBPACK_IMPORTED_MODULE_11__.SelectionMode.none })) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '250px',
                    border: '1px dashed #e5e7eb',
                    borderRadius: '8px',
                    padding: '30px'
                } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_12__.Icon, { iconName: "ClearFilter", style: { fontSize: '36px', color: '#9ca3af', marginBottom: '10px' } }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Text, { variant: "medium", style: { color: '#6b7280' } }, "No replacement requests found.")))),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_13__.Panel, { isOpen: showDetailPanel, onDismiss: () => setShowDetailPanel(false), type: _fluentui_react__WEBPACK_IMPORTED_MODULE_14__.PanelType.medium, headerText: "Replacement Request Details", closeButtonAriaLabel: "Close" }, selectedReplacement && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '10px' } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: '#6b7280', fontSize: '0.88rem', margin: '0 0 20px 0' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Reported:"),
                " ",
                new Date(selectedReplacement.reportedDate).toLocaleString()),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '12px 15px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #64748b' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: '1.5', whiteSpace: 'pre-wrap' } }, selectedReplacement.issueDescription)),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '20px' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } }, "Replacement Specifications"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem', alignItems: 'center' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Replacement ID:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, selectedReplacement.incidentId)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Asset Name:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, selectedReplacement.assetName)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Type:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, "Replacement Request")),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280', marginRight: '6px' } }, "Priority:"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: getPriorityBadgeStyle(selectedReplacement.priority) }, selectedReplacement.priority || 'Medium')),
                    props.userRole === 'Admin' ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Status:"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.Dropdown, { selectedKey: selectedReplacement.status || 'Open', options: [
                                { key: 'Open', text: 'Open' },
                                { key: 'In Progress', text: 'In Progress' },
                                { key: 'Resolved', text: 'Resolved' },
                                { key: 'Closed', text: 'Closed' }
                            ], onChange: (ev, option) => handleStatusChange(selectedReplacement, option?.key), styles: { root: { width: 120 } } }))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280', marginRight: '6px' } }, "Status:"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: getStatusBadgeStyle(selectedReplacement.status) }, selectedReplacement.status || 'Open'))),
                    selectedReplacement.assignedTo && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Assigned To:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, selectedReplacement.assignedTo))))),
            props.userRole === 'Admin' && (selectedReplacement.status === 'Resolved' || selectedReplacement.status === 'Closed') ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_12__.Icon, { iconName: "CheckMark", style: { color: '#166534', fontWeight: 'bold' } }),
                    " Update Resolution Details"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_5__.Stack, { tokens: { childrenGap: 10 } },
                    selectedReplacement.resolvedDate && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { fontSize: '0.88rem' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Resolved Date:"),
                        ' ',
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, new Date(selectedReplacement.resolvedDate).toLocaleString()))),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_15__.TextField, { label: "Resolution Summary", multiline: true, rows: 3, value: tempResolution, onChange: (ev, newValue) => setTempResolution(newValue || ''), placeholder: "Describe how this replacement was completed..." }),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.PrimaryButton, { text: "Save Resolution", onClick: () => handleSaveResolution(selectedReplacement), styles: { root: { alignSelf: 'flex-start' } } })))) : (selectedReplacement.resolution && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_12__.Icon, { iconName: "CheckMark", style: { color: '#166534', fontWeight: 'bold' } }),
                    " Resolution Details"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' } },
                    selectedReplacement.resolvedDate && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Resolved Date:"),
                        ' ',
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, new Date(selectedReplacement.resolvedDate).toLocaleString()))),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #dcfce7', color: '#166534', fontSize: '0.88rem', lineHeight: '1.4', whiteSpace: 'pre-wrap' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Resolution Summary:"),
                        " ",
                        selectedReplacement.resolution))))))))));
};


/***/ }),

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
        email: props.currentUserEmail || '',
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
                requesterEmail: employee.email,
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


/***/ }),

/***/ 48235:
/*!**********************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/components/WorkflowPopup.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WorkflowPopup: () => (/* binding */ WorkflowPopup)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 85959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fluentui_react_lib_Dialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @fluentui/react/lib/Dialog */ 4312);
/* harmony import */ var _fluentui_react_lib_Dialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fluentui/react/lib/Dialog */ 10548);
/* harmony import */ var _fluentui_react_lib_Dialog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fluentui/react/lib/Dialog */ 87295);
/* harmony import */ var _fluentui_react_lib_Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fluentui/react/lib/Button */ 29425);
/* harmony import */ var _fluentui_react_lib_Icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fluentui/react/lib/Icon */ 52394);




const WorkflowPopup = (props) => {
    const { isOpen, title, stage, type, message, details, onDismiss } = props;
    if (!isOpen)
        return null;
    let iconName = 'CheckMark';
    let iconColor = '#15803d';
    let badgeBg = '#dcfce7';
    let badgeTextColor = '#166534';
    let borderColor = '#22c55e';
    let iconBg = '#f0fdf4';
    if (type === 'error' || (details?.status || '').toLowerCase().includes('reject') || (details?.status || '').toLowerCase().includes('declin')) {
        iconName = 'ErrorBadge';
        iconColor = '#b91c1c';
        badgeBg = '#fee2e2';
        badgeTextColor = '#991b1b';
        borderColor = '#ef4444';
        iconBg = '#fef2f2';
    }
    else if (type === 'warning' || (details?.status || '').toLowerCase().includes('pending')) {
        iconName = 'Clock';
        iconColor = '#b45309';
        badgeBg = '#fef3c7';
        badgeTextColor = '#92400e';
        borderColor = '#f59e0b';
        iconBg = '#fffbeb';
    }
    else if (type === 'info') {
        iconName = 'Info';
        iconColor = '#1d4ed8';
        badgeBg = '#dbeafe';
        badgeTextColor = '#1e40af';
        borderColor = '#3b82f6';
        iconBg = '#eff6ff';
    }
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_lib_Dialog__WEBPACK_IMPORTED_MODULE_1__.Dialog, { hidden: !isOpen, onDismiss: onDismiss, dialogContentProps: {
            type: _fluentui_react_lib_Dialog__WEBPACK_IMPORTED_MODULE_2__.DialogType.normal,
            title: '',
        }, modalProps: {
            isBlocking: true,
            styles: {
                main: {
                    maxWidth: '520px',
                    minWidth: '340px',
                    borderRadius: '16px',
                    padding: '24px 28px',
                    borderTop: `5px solid ${borderColor}`,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                    backgroundColor: '#ffffff'
                }
            }
        } },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '18px', fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif' } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '14px' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: iconBg,
                        border: `1px solid ${borderColor}33`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 4px 12px ${borderColor}22`
                    } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_lib_Icon__WEBPACK_IMPORTED_MODULE_3__.Icon, { iconName: iconName, style: { fontSize: '22px', color: iconColor, fontWeight: 'bold' } })),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { flex: 1 } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                display: 'inline-block',
                                backgroundColor: badgeBg,
                                color: badgeTextColor,
                                padding: '3px 10px',
                                borderRadius: '9999px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em'
                            } }, stage)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", { style: { margin: 0, fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.3 } }, title))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.55 } }, message),
            details && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #e2e8f0',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px',
                    fontSize: '0.82rem'
                } },
                details.requestId && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Request ID"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#0f172a', fontSize: '0.88rem' } }, details.requestId))),
                details.assetTitle && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Asset"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#0f172a', fontSize: '0.88rem' } },
                        details.assetTitle,
                        " ",
                        details.quantity ? `(Qty: ${details.quantity})` : ''))),
                details.requesterName && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Requester"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#0f172a', fontSize: '0.88rem' } }, details.requesterName))),
                details.managerName && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Manager's Name"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#0f172a', fontSize: '0.88rem' } }, details.managerName))),
                details.status && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Workflow Status"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                            backgroundColor: badgeBg,
                            color: badgeTextColor,
                            padding: '3px 9px',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            display: 'inline-block'
                        } }, details.status))),
                details.date && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Date"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#0f172a', fontSize: '0.88rem' } }, details.date))),
                details.condition && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Condition"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#0f172a', fontSize: '0.88rem' } }, details.condition))),
                details.comment && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { gridColumn: '1 / -1', marginTop: '4px' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '4px' } }, "Manager / Admin Notes"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                            backgroundColor: '#ffffff',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            color: '#334155',
                            fontStyle: 'italic',
                            lineHeight: 1.4
                        } },
                        "\u201C",
                        details.comment,
                        "\u201D")))))),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_lib_Dialog__WEBPACK_IMPORTED_MODULE_4__.DialogFooter, { styles: { actionsRight: { marginTop: '20px' } } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_lib_Button__WEBPACK_IMPORTED_MODULE_5__.PrimaryButton, { text: "Got it", onClick: onDismiss, iconProps: { iconName: 'Accept' }, styles: {
                    root: {
                        borderRadius: '8px',
                        padding: '0 20px',
                        height: '36px',
                        backgroundColor: '#005a9e',
                        border: 'none'
                    },
                    rootHovered: {
                        backgroundColor: '#004578'
                    }
                } }))));
};


/***/ }),

/***/ 82889:
/*!*************************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/constants/DropdownConstants.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ASSET_CONDITION_OPTIONS: () => (/* binding */ ASSET_CONDITION_OPTIONS),
/* harmony export */   ASSET_REQUEST_PRIORITY_OPTIONS: () => (/* binding */ ASSET_REQUEST_PRIORITY_OPTIONS),
/* harmony export */   ASSET_REQUEST_STATUS_OPTIONS: () => (/* binding */ ASSET_REQUEST_STATUS_OPTIONS),
/* harmony export */   DEFAULT_ASSET_TYPE_OPTIONS: () => (/* binding */ DEFAULT_ASSET_TYPE_OPTIONS),
/* harmony export */   INCIDENT_PRIORITY_OPTIONS: () => (/* binding */ INCIDENT_PRIORITY_OPTIONS),
/* harmony export */   INCIDENT_STATUS_OPTIONS: () => (/* binding */ INCIDENT_STATUS_OPTIONS),
/* harmony export */   INCIDENT_TYPE_OPTIONS: () => (/* binding */ INCIDENT_TYPE_OPTIONS),
/* harmony export */   RETURN_CONDITION_OPTIONS: () => (/* binding */ RETURN_CONDITION_OPTIONS),
/* harmony export */   RETURN_REQUEST_STATUS_OPTIONS: () => (/* binding */ RETURN_REQUEST_STATUS_OPTIONS),
/* harmony export */   WARRANTY_STATUS_OPTIONS: () => (/* binding */ WARRANTY_STATUS_OPTIONS)
/* harmony export */ });
// ==========================================
// Asset Options
// ==========================================
const DEFAULT_ASSET_TYPE_OPTIONS = [
    { key: 'Laptop', text: 'Laptop' },
    { key: 'Monitor', text: 'Monitor' },
    { key: 'Mouse', text: 'Mouse' },
    { key: 'Keyboard', text: 'Keyboard' },
    { key: 'Headset', text: 'Headset' },
    { key: 'Other', text: 'Other' }
];
const ASSET_CONDITION_OPTIONS = [
    { key: 'New', text: 'New' },
    { key: 'Good', text: 'Good' },
    { key: 'Fair', text: 'Fair' },
    { key: 'Poor', text: 'Poor' },
    { key: 'Damaged', text: 'Damaged' }
];
// ==========================================
// Incident Options
// ==========================================
const INCIDENT_TYPE_OPTIONS = [
    { key: 'Hardware Issue', text: 'Hardware Issue' },
    { key: 'Software Issue', text: 'Software Issue' },
    { key: 'Network Issue', text: 'Network Issue' },
    { key: 'Asset Damage', text: 'Asset Damage' },
    { key: 'Replacement Request', text: 'Replacement Request' },
    { key: 'Access Issue', text: 'Access Issue' },
    { key: 'Login Issue', text: 'Login Issue' },
    { key: 'Performance Issue', text: 'Performance Issue' },
    { key: 'Email Issue', text: 'Email Issue' },
    { key: 'Printer Issue', text: 'Printer Issue' },
    { key: 'Other', text: 'Other' }
];
const INCIDENT_PRIORITY_OPTIONS = [
    { key: 'Low', text: 'Low' },
    { key: 'Medium', text: 'Medium' },
    { key: 'High', text: 'High' },
    { key: 'Critical', text: 'Critical' }
];
const INCIDENT_STATUS_OPTIONS = [
    { key: 'Open', text: 'Open' },
    { key: 'In Progress', text: 'In Progress' },
    { key: 'Resolved', text: 'Resolved' },
    { key: 'Closed', text: 'Closed' }
];
// ==========================================
// Return Options
// ==========================================
const RETURN_CONDITION_OPTIONS = [
    { key: 'Good', text: 'Good (No damage, fully functional)' },
    { key: 'Fair', text: 'Fair (Minor wear, fully functional)' },
    { key: 'Poor', text: 'Poor (Significant wear, needs repair)' },
    { key: 'Damaged', text: 'Damaged (Broken, non-functional)' }
];
const RETURN_REQUEST_STATUS_OPTIONS = [
    { key: 'Pending', text: 'Pending' },
    { key: 'Approved', text: 'Approved' },
    { key: 'Rejected', text: 'Rejected' },
    { key: 'Completed', text: 'Completed' }
];
// ==========================================
// Request Options
// ==========================================
const ASSET_REQUEST_PRIORITY_OPTIONS = [
    { key: 'Low', text: 'Low' },
    { key: 'Medium', text: 'Medium' },
    { key: 'High', text: 'High' }
];
const ASSET_REQUEST_STATUS_OPTIONS = [
    { key: 'Pending', text: 'Pending' },
    { key: 'Approved', text: 'Approved' },
    { key: 'Declined', text: 'Declined' }
];
// ==========================================
// Warranty Options
// ==========================================
const WARRANTY_STATUS_OPTIONS = [
    { key: 'Active', text: 'Active' },
    { key: 'Expiring Soon', text: 'Expiring Soon' },
    { key: 'Expired', text: 'Expired' },
    { key: 'Unknown', text: 'Unknown' }
];


/***/ }),

/***/ 27962:
/*!***********************************************************!*\
  !*** ./lib/webparts/inventoryManagement/data/mockData.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ASSET_CATEGORIES: () => (/* binding */ ASSET_CATEGORIES),
/* harmony export */   EMPLOYEES: () => (/* binding */ EMPLOYEES)
/* harmony export */ });
const EMPLOYEES = [
    { id: 'L005', name: 'Loka Kiran Reddy', email: 'Kiran.Reddy@3bh3kf.onmicrosoft.com', department: 'IT', jobTitle: 'Admin' },
    { id: 'E2', name: 'Adele Vance', email: 'AdeleV@3bh3kf.onmicrosoft.com', department: 'Operations', jobTitle: 'Inventory Employee' },
    { id: 'A001', name: 'Alex Wilber', email: 'AlexW@3bh3kf.onmicrosoft.com', department: 'Operations', jobTitle: 'Inventory Employee' },
    { id: 'D004', name: 'Diego Siciliani', email: 'DiegoS@3bh3kf.onmicrosoft.com', department: 'Management', jobTitle: 'Inventory Manager' },
    { id: 'G005', name: 'Grady Archie', email: 'GradyA@3bh3kf.onmicrosoft.com', department: 'Management', jobTitle: 'Inventory Manager' }
];
const ASSET_CATEGORIES = [
    { key: 'IT', text: 'IT' },
    { key: 'Accessories', text: 'Accessories' },
    { key: 'Peripheral', text: 'Peripheral' },
    { key: 'Furniture', text: 'Furniture' },
    { key: 'Other', text: 'Other' }
];


/***/ }),

/***/ 43325:
/*!**************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/pages/ConfigPage.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConfigPage: () => (/* binding */ ConfigPage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 85959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fluentui/react */ 92070);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fluentui/react */ 15369);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fluentui/react */ 29425);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fluentui/react */ 63208);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fluentui/react */ 21314);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fluentui/react */ 52394);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fluentui/react */ 5613);
/* harmony import */ var _components_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/InventoryManagement.module.scss */ 99623);



const ConfigPage = (props) => {
    const { state, actions } = props;
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _components_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Configuration & List Management"),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', margin: '4px 0 0 0', fontSize: '0.85rem' } }, "Admin-only control center for list syncing, database connection tests, role diagnostics, and list schemas.")),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_2__.Pivot, { selectedKey: state.configSelectedTab, onLinkClick: (item) => actions.onTabChange(item ? item.props.itemKey || 'operations' : 'operations'), styles: { root: { marginBottom: '20px', borderBottom: '1px solid rgba(128,128,128,0.1)' } } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.PivotItem, { headerText: "Sync Operations", itemKey: "operations" }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.PivotItem, { headerText: "List Connections", itemKey: "connections" }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.PivotItem, { headerText: "RBAC Site Groups", itemKey: "rbac" }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.PivotItem, { headerText: "Required Schema Guides", itemKey: "schema" })),
        state.configSelectedTab === 'operations' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginBottom: '10px', color: '#111827', marginTop: 0 } }, "Mapping List Management & Sync"),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { fontSize: '0.88rem', color: '#4b5563', margin: '0 0 15px 0' } },
                "Ensure all assets currently assigned to active employees are properly mapped to the SharePoint ",
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Mapping List"),
                ". Use the buttons below to perform a manual synchronization check or diagnose the list's database schema."),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '15px' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.PrimaryButton, { text: state.syncInProgress ? "Processing..." : "Sync Assigned Assets", iconProps: { iconName: 'Sync' }, onClick: actions.onSyncAssignedAssets, disabled: state.syncInProgress }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.PrimaryButton, { text: state.syncInProgress ? "Checking Schema..." : "Run Schema Diagnostics", iconProps: { iconName: 'Database' }, onClick: actions.onRunDiagnostics, disabled: state.syncInProgress, styles: {
                        root: { backgroundColor: '#5c2d91', borderColor: '#5c2d91' },
                        rootHovered: { backgroundColor: '#4b2278', borderColor: '#4b2278' }
                    } })),
            state.syncMessage && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_5__.MessageBar, { messageBarType: state.syncMessageType, onDismiss: actions.onDismissSyncMessage, styles: { root: { marginBottom: '15px', borderRadius: '6px' } } }, state.syncMessage)),
            state.diagnosticInfo && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '15px' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#323130', marginBottom: '6px' } }, "Diagnostic Log Output:"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("textarea", { readOnly: true, value: state.diagnosticInfo, rows: 10, style: {
                        width: '100%',
                        fontFamily: 'monospace',
                        fontSize: '0.82rem',
                        padding: '10px',
                        backgroundColor: '#f3f2f1',
                        border: '1px solid #e1dfdd',
                        borderRadius: '4px',
                        resize: 'vertical',
                        color: '#323130'
                    } }))))),
        state.configSelectedTab === 'connections' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginBottom: '15px', color: '#111827', marginTop: 0 } }, "SharePoint List Connections"),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { fontSize: '0.85rem', color: '#6b7280', marginBottom: '20px' } }, "Verify the read/write database connection status of the required SharePoint storage lists."),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.Stack, { tokens: { childrenGap: 16 } }, [
                { title: 'Inventory List', internal: 'InventoryList', desc: 'Stores the master catalog of all physical assets and hardware.' },
                { title: 'Request List', internal: 'RequestList', desc: 'Manages employee request tickets, workflow histories, and assignment queues.' },
                { title: 'Asset Return Request List', internal: 'Asset Return Request List', desc: 'Handles asset return forms, check-in inspections, and manager validations.' },
                { title: 'Mapping List', internal: 'Mapping List', desc: 'Maintains live active assignment mapping for automated clearing checks.' },
                { title: 'System Audit Log', internal: 'AuditLogList', desc: 'Tracks historical change logs, lifecycle states, and admin operations.' }
            ].map(list => {
                const connectionStatus = state.connectionStatuses[list.title];
                const errorMsg = state.connectionErrorMessages[list.title];
                return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { key: list.title, style: { padding: '16px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.15)', backgroundColor: 'var(--surface-color, #ffffff)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { flex: '1 1 300px' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h5", { style: { margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 600, color: '#111827' } },
                            list.title,
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontWeight: 'normal', color: '#6b7280', fontSize: '0.8rem' } },
                                "(",
                                list.internal,
                                ")")),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.82rem', color: '#4b5563' } }, list.desc),
                        errorMsg && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '8px', color: '#d13438', fontSize: '0.78rem', backgroundColor: '#fde7e9', padding: '6px 10px', borderRadius: '4px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Error:"),
                            " ",
                            errorMsg))),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
                        connectionStatus === 'testing' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.8rem', color: '#0078d4', display: 'flex', alignItems: 'center', gap: '6px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.Icon, { iconName: "ProgressLoopOuter", style: { animation: 'spin 1.5s linear infinite' } }),
                            " Verifying...")),
                        connectionStatus === 'connected' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                color: '#166534',
                                backgroundColor: '#dcfce7',
                                padding: '4px 12px',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                            } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.Icon, { iconName: "Completed" }),
                            " Connected")),
                        connectionStatus === 'error' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                color: '#b91c1c',
                                backgroundColor: '#fee2e2',
                                padding: '4px 12px',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                            } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.Icon, { iconName: "ErrorBadge" }),
                            " Failed")),
                        !connectionStatus && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                color: '#4b5563',
                                backgroundColor: '#f3f4f6',
                                padding: '4px 12px',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: 500
                            } }, "Not Verified")),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.DefaultButton, { text: "Test Live", iconProps: { iconName: 'PlugConnected' }, onClick: () => actions.onTestListConnection(list.title, list.internal), disabled: connectionStatus === 'testing' }))));
            })))),
        state.configSelectedTab === 'rbac' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginBottom: '15px', color: '#111827', marginTop: 0 } }, "Role Based Access Control (RBAC)"),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { fontSize: '0.85rem', color: '#6b7280', marginBottom: '20px' } }, "Inspect user groups resolved from SharePoint for permission level verification."),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.Stack, { tokens: { childrenGap: 16 } }, [
                { group: 'MSFT Owners', role: 'Admin', desc: 'Full administrative rights to modify assets, approve returns, and manage database connection setups.' },
                { group: 'MSFT Members', role: 'Inventory Manager', desc: 'Write access to create items, process returns, assign assets, and view reports.' },
                { group: 'MSFT Visitors', role: 'Inventory Employee', desc: 'Read-only access to available stocks and permission to request return tickets.' }
            ].map(item => {
                const isLoading = state.loadingGroupUsers[item.group];
                const members = state.groupUsersList[item.group];
                return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { key: item.group, style: { padding: '16px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.15)', backgroundColor: 'var(--surface-color, #ffffff)' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h5", { style: { margin: 0, fontSize: '1rem', fontWeight: 600, color: '#111827' } },
                                item.group,
                                " ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#0078d4', fontSize: '0.8rem', backgroundColor: '#deecf9', padding: '2px 8px', borderRadius: '4px', marginLeft: '6px', fontWeight: 600 } }, item.role)),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.8rem', color: '#4b5563', display: 'block', marginTop: '4px' } }, item.desc)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.DefaultButton, { text: isLoading ? "Loading..." : "View Members", iconProps: { iconName: 'People' }, onClick: () => actions.onLoadGroupUsers(item.group), disabled: isLoading })),
                    members && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid rgba(128,128,128,0.1)' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' } },
                            "Group Members (",
                            members.length,
                            "):"),
                        members.length === 0 ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic' } }, "No members found in this group")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } }, members.map((m, idx) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { key: idx, style: { backgroundColor: '#ffffff', border: '1px solid rgba(128,128,128,0.15)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.78rem', color: '#111827', fontWeight: 500 } }, m)))))))));
            })))),
        state.configSelectedTab === 'schema' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginBottom: '5px', color: '#111827', marginTop: 0 } }, "Required List Schema (Developer Reference)"),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { fontSize: '0.85rem', color: '#6b7280', marginBottom: '20px', marginTop: 0 } }, "Ensure your SharePoint lists contain the following columns exactly as written to prevent validation errors."),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h5", { style: { marginTop: '15px', marginBottom: '8px', color: '#374151' } },
                "InventoryList ",
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontWeight: 'normal', color: '#9ca3af' } }, "(Asset Database)")),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '25px' } }, ['Title', 'AssetName', 'AssetType', 'SerialNumber', 'PurchaseDate', 'Status', 'Specifications', 'AssignedTo (Person/Group)'].map(col => (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { key: col, style: { backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', color: '#374151', border: '1px solid #e5e7eb' } }, col)))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h5", { style: { marginBottom: '8px', color: '#374151' } },
                "RequestList ",
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontWeight: 'normal', color: '#9ca3af' } }, "(Approval Workflows)")),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '25px' } }, ['Title', 'Employee', 'AssetType', 'Quantity', 'ReasonforRequest', 'RequestStatus', 'RequestKey', 'AssetStatus'].map(col => (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { key: col, style: { backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', color: '#374151', border: '1px solid #e5e7eb' } }, col)))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h5", { style: { marginBottom: '8px', color: '#374151' } },
                "Asset Return Request List ",
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontWeight: 'normal', color: '#9ca3af' } }, "(Returns Handling)")),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '25px' } }, ['Title', 'AssetID', 'AssetName', 'SerialNumber', 'Employee', 'ReasonforReturn', 'ProposedCondition', 'RequestStatus', 'ManagerComments'].map(col => (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { key: col, style: { backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', color: '#374151', border: '1px solid #e5e7eb' } }, col)))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h5", { style: { marginBottom: '8px', color: '#374151' } },
                "Mapping List ",
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontWeight: 'normal', color: '#9ca3af' } }, "(Custody Tracking)")),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } }, ['Title', 'SerialNumber', 'Employe', 'EmployeeID', 'AssetName', 'AssignmentID'].map(col => (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { key: col, style: { backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', color: '#374151', border: '1px solid #e5e7eb' } }, col))))))));
};


/***/ }),

/***/ 76577:
/*!*****************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/pages/DashboardPage.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DashboardPage: () => (/* binding */ DashboardPage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 85959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_Dashboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/Dashboard */ 71422);


const DashboardPage = (props) => {
    const { state, actions } = props;
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_Dashboard__WEBPACK_IMPORTED_MODULE_1__.Dashboard, { items: state.items, requests: state.requests, isAdmin: state.isAdmin, isInventoryManager: state.isInventoryManager, onNavigate: actions.onNavigate }));
};


/***/ }),

/***/ 34575:
/*!***********************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/pages/IncidentHistoryPage.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IncidentHistoryPage: () => (/* binding */ IncidentHistoryPage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 85959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_IncidentHistory_IncidentHistory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/IncidentHistory/IncidentHistory */ 27885);
/* harmony import */ var _components_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/InventoryManagement.module.scss */ 99623);



const IncidentHistoryPage = (props) => {
    const { state, actions, ...rest } = props;
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _components_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].cardHeader },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Incident History")),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_IncidentHistory_IncidentHistory__WEBPACK_IMPORTED_MODULE_1__.IncidentHistory, { ...rest, userDisplayName: state.userDisplayName, userEmail: state.userEmail, userRole: state.userRole, setIsLoading: actions.setIsLoading })));
};


/***/ }),

/***/ 44809:
/*!*****************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/pages/InventoryPage.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InventoryPage: () => (/* binding */ InventoryPage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 85959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fluentui/react */ 29425);
/* harmony import */ var _components_InventoryList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/InventoryList */ 4938);
/* harmony import */ var _components_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/InventoryManagement.module.scss */ 99623);




const InventoryPage = (props) => {
    const { state, actions } = props;
    const { items, loading, isAdmin, isInventoryManager } = state;
    return (isAdmin || isInventoryManager) ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _components_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].cardHeader },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Current Inventory Overview")),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Track and manage your organizational assets efficiently within the SharePoint Framework."),
        loading ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "Loading inventory...")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginBottom: '15px' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.PrimaryButton, { text: isAdmin ? "Add New Asset" : "Assign / Manage Assets", onClick: actions.onOpenAssetForm, iconProps: { iconName: 'Add' } })),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_InventoryList__WEBPACK_IMPORTED_MODULE_1__.InventoryList, { items: items, isAdmin: isAdmin, enablePagination: true }))))) : null;
};


/***/ }),

/***/ 22882:
/*!***************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/pages/ReportsPage.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReportsPage: () => (/* binding */ ReportsPage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 85959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fluentui/react */ 92070);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fluentui/react */ 15369);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fluentui/react */ 21314);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fluentui/react */ 29425);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fluentui/react */ 12042);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fluentui/react */ 79370);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @fluentui/react */ 37805);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @fluentui/react */ 74423);
/* harmony import */ var react_chartjs_2__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-chartjs-2 */ 86766);
/* harmony import */ var _components_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/InventoryManagement.module.scss */ 99623);




const ReportsPage = (props) => {
    const { state, actions } = props;
    const { items, requests } = state;
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _components_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader, style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Reporting & Insights"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', margin: '4px 0 0 0', fontSize: '0.85rem' } }, "Interactive dashboards, live graphs, status analysis, and exporter module."))),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_2__.Pivot, { selectedKey: state.reportsSelectedTab, onLinkClick: (item) => actions.onTabChange(item ? item.props.itemKey || 'insights' : 'insights'), styles: { root: { marginBottom: '20px', borderBottom: '1px solid rgba(128,128,128,0.1)' } } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.PivotItem, { headerText: "Visual Insights", itemKey: "insights" }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.PivotItem, { headerText: "Detailed Reports", itemKey: "detailed" }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.PivotItem, { headerText: "Warranty Expiry", itemKey: "expiry" })),
        state.reportsSelectedTab === 'insights' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Stack, { tokens: { childrenGap: 24 } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '16px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.82rem', color: '#6b7280', fontWeight: 600, marginBottom: '6px' } }, "TOTAL INVENTORY ASSETS"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-main, #111827)' } }, items.length)),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '16px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.82rem', color: '#1e40af', fontWeight: 600, marginBottom: '6px' } }, "ASSETS CURRENTLY ASSIGNED"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.75rem', fontWeight: 'bold', color: '#1e3a8a' } }, items.length - items.filter(i => i.status === 'In Stock' || i.status === 'Yes').length)),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '16px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.82rem', color: '#166534', fontWeight: 600, marginBottom: '6px' } }, "UTILIZATION RATE"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.75rem', fontWeight: 'bold', color: '#14532d' } },
                        items.length > 0 ? Math.round(((items.length - items.filter(i => i.status === 'In Stock' || i.status === 'Yes').length) / items.length) * 100) : 0,
                        "%")),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '16px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.82rem', color: '#92400e', fontWeight: 600, marginBottom: '6px' } }, "TOTAL APPROVAL REQUESTS"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.75rem', fontWeight: 'bold', color: '#78350f' } }, requests.length))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _components_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].responsiveGridGap20 },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 15px 0', alignSelf: 'flex-start', color: '#374151' } }, "Asset Status Distribution"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { height: '220px', width: '220px', position: 'relative' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_chartjs_2__WEBPACK_IMPORTED_MODULE_5__.Pie, { data: {
                                labels: ['In Stock', 'Assigned', 'Pending Return', 'Under Maintenance'],
                                datasets: [{
                                        data: [
                                            items.filter(i => i.status === 'In Stock' || i.status === 'Yes').length,
                                            items.filter(i => i.status === 'Assigned' || i.status === 'Yes (Assigned)').length,
                                            items.filter(i => i.status === 'Pending Return').length,
                                            items.filter(i => i.status === 'Under Maintenance' || i.status === 'Damaged' || i.status === 'Poor').length,
                                        ],
                                        backgroundColor: ['#107c41', '#1f77b4', '#ea580c', '#b91c1c']
                                    }]
                            }, options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } }
                            } })),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '15px', fontSize: '0.78rem', color: '#4b5563' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#107c41', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' } }, "\u25CF"),
                            "In Stock"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#1f77b4', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' } }, "\u25CF"),
                            "Assigned"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#ea580c', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' } }, "\u25CF"),
                            "Pending Return"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#b91c1c', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' } }, "\u25CF"),
                            "Maintenance"))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 15px 0', color: '#374151' } }, "Asset Type Distribution"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { height: '240px' } }, (() => {
                        const typeCounts = {};
                        items.forEach(i => {
                            const type = i.assetType || "Other";
                            typeCounts[type] = (typeCounts[type] || 0) + 1;
                        });
                        const labels = Object.keys(typeCounts);
                        const data = Object.keys(typeCounts).map(key => typeCounts[key]);
                        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_chartjs_2__WEBPACK_IMPORTED_MODULE_5__.Bar, { data: {
                                labels,
                                datasets: [{
                                        label: 'Assets Count',
                                        data,
                                        backgroundColor: '#1f77b4',
                                        borderRadius: 4
                                    }]
                            }, options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { beginAtZero: true, ticks: { precision: 0 } }
                                }
                            } }));
                    })())),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 15px 0', alignSelf: 'flex-start', color: '#374151' } }, "Asset Aging Analysis"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { height: '220px', width: '220px', position: 'relative' } }, (() => {
                        const now = new Date();
                        const aging = items.reduce((acc, item) => {
                            if (!item.purchaseDate) {
                                acc.unknown++;
                                return acc;
                            }
                            const pd = new Date(item.purchaseDate);
                            const diffYears = Math.abs(now.getTime() - pd.getTime()) / (1000 * 60 * 60 * 24 * 365);
                            if (diffYears < 1)
                                acc.under1++;
                            else if (diffYears <= 3)
                                acc.between1and3++;
                            else
                                acc.over3++;
                            return acc;
                        }, { under1: 0, between1and3: 0, over3: 0, unknown: 0 });
                        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_chartjs_2__WEBPACK_IMPORTED_MODULE_5__.Doughnut, { data: {
                                labels: ['< 1 Year (New)', '1-3 Years', '> 3 Years (Aging)', 'Unknown'],
                                datasets: [{
                                        data: [aging.under1, aging.between1and3, aging.over3, aging.unknown],
                                        backgroundColor: ['#2ca02c', '#ff7f0e', '#d62728', '#9467bd']
                                    }]
                            }, options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } }
                            } }));
                    })()),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '15px', fontSize: '0.78rem', color: '#4b5563' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#2ca02c', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' } }, "\u25CF"),
                            "< 1 Year"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#ff7f0e', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' } }, "\u25CF"),
                            "1-3 Years"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#d62728', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' } }, "\u25CF"),
                            "> 3 Years"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#9467bd', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' } }, "\u25CF"),
                            "Unknown"))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 15px 0', color: '#374151' } }, "Request Approval Trends"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { height: '240px' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_chartjs_2__WEBPACK_IMPORTED_MODULE_5__.Bar, { data: {
                                labels: ['Approved', 'Declined/Rejected', 'Pending'],
                                datasets: [{
                                        data: [
                                            requests.filter(r => (r.status || '').toLowerCase().includes('approv')).length,
                                            requests.filter(r => (r.status || '').toLowerCase().includes('declin') || (r.status || '').toLowerCase().includes('reject')).length,
                                            requests.filter(r => (r.status || '').toLowerCase() === 'pending').length
                                        ],
                                        backgroundColor: ['#2ca02c', '#d62728', '#ff7f0e']
                                    }]
                            }, options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { beginAtZero: true, ticks: { precision: 0 } }
                                }
                            } })))))),
        state.reportsSelectedTab === 'detailed' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px', alignItems: 'center', marginBottom: '20px' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: 0 } }, "Filterable Asset Inventory"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Stack, { horizontal: true, tokens: { childrenGap: 8 } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.PrimaryButton, { text: "Export Excel", iconProps: { iconName: 'ExcelDocument' }, onClick: () => {
                            const filtered = items.filter(i => {
                                const typeMatch = state.reportsAssetTypeFilter === 'All' || i.assetType === state.reportsAssetTypeFilter;
                                const statusMatch = state.reportsStatusFilter === 'All' || i.status === state.reportsStatusFilter;
                                return typeMatch && statusMatch;
                            });
                            actions.onExportDetailedReportToExcel(filtered);
                        }, styles: { root: { backgroundColor: '#107c41', borderColor: '#107c41', color: '#ffffff' } } }),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.PrimaryButton, { text: "Export PDF", iconProps: { iconName: 'PDF' }, onClick: () => {
                            const filtered = items.filter(i => {
                                const typeMatch = state.reportsAssetTypeFilter === 'All' || i.assetType === state.reportsAssetTypeFilter;
                                const statusMatch = state.reportsStatusFilter === 'All' || i.status === state.reportsStatusFilter;
                                return typeMatch && statusMatch;
                            });
                            actions.onExportDetailedReportToPDF(filtered);
                        }, styles: { root: { backgroundColor: '#d13438', borderColor: '#d13438', color: '#ffffff' } } }))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { minWidth: '150px' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.Dropdown, { label: "Asset Type", selectedKey: state.reportsAssetTypeFilter, options: [
                            { key: 'All', text: 'All Types' },
                            ...Array.from(new Set(items.map(i => i.assetType).filter(Boolean))).map(type => ({ key: type, text: type }))
                        ], onChange: (_, opt) => actions.onAssetTypeFilterChange(opt ? opt.key : 'All') })),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { minWidth: '150px' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.Dropdown, { label: "Asset Status", selectedKey: state.reportsStatusFilter, options: [
                            { key: 'All', text: 'All Statuses' },
                            ...Array.from(new Set(items.map(i => i.status).filter(Boolean))).map(status => ({ key: status, text: status }))
                        ], onChange: (_, opt) => actions.onStatusFilterChange(opt ? opt.key : 'All') }))),
            (() => {
                const filtered = items.filter(i => {
                    const typeMatch = state.reportsAssetTypeFilter === 'All' || i.assetType === state.reportsAssetTypeFilter;
                    const statusMatch = state.reportsStatusFilter === 'All' || i.status === state.reportsStatusFilter;
                    return typeMatch && statusMatch;
                });
                return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.DetailsList, { items: filtered, columns: [
                        { key: 'col1', name: 'Asset Name', fieldName: 'assetName', minWidth: 120, maxWidth: 180, isResizable: true, onRender: (item) => item.assetName || item.title },
                        { key: 'col2', name: 'Asset Type', fieldName: 'assetType', minWidth: 90, maxWidth: 120, isResizable: true },
                        { key: 'col3', name: 'Status', fieldName: 'status', minWidth: 90, maxWidth: 120, isResizable: true },
                        { key: 'col4', name: 'Condition', fieldName: 'condition', minWidth: 80, maxWidth: 100, isResizable: true },
                        { key: 'col5', name: 'Assigned To', fieldName: 'assignedTo', minWidth: 100, maxWidth: 140, isResizable: true, onRender: (item) => item.assignedTo || react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#9ca3af', fontStyle: 'italic' } }, "Unassigned") }
                    ], setKey: "detailedReportList", layoutMode: _fluentui_react__WEBPACK_IMPORTED_MODULE_9__.DetailsListLayoutMode.justified, selectionMode: _fluentui_react__WEBPACK_IMPORTED_MODULE_10__.SelectionMode.none }));
            })())),
        state.reportsSelectedTab === 'expiry' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: 0 } }, "Warranty Expiry Report"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Stack, { horizontal: true, tokens: { childrenGap: 8 } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.PrimaryButton, { text: "Export Excel", iconProps: { iconName: 'ExcelDocument' }, onClick: actions.onExportWarrantyReportToExcel, styles: { root: { backgroundColor: '#107c41', borderColor: '#107c41', color: '#ffffff' } } }),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.PrimaryButton, { text: "Export PDF", iconProps: { iconName: 'PDF' }, onClick: actions.onExportWarrantyReportToPDF, styles: { root: { backgroundColor: '#d13438', borderColor: '#d13438', color: '#ffffff' } } }))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginBottom: '15px', display: 'flex', gap: '20px' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#f3f4f6', borderRadius: '6px' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px' } }, "Total Assets Count"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' } }, items.length)),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#f3f4f6', borderRadius: '6px' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px' } }, "Assets with Warranty Data"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' } }, items.filter(i => i.warrantyExpiry).length))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.DetailsList, { items: items, columns: [
                    { key: 'col1', name: 'Asset Name', fieldName: 'assetName', minWidth: 120, maxWidth: 200, isResizable: true, onRender: (item) => item.assetName || item.title },
                    { key: 'col2', name: 'Asset Type', fieldName: 'assetType', minWidth: 100, maxWidth: 150, isResizable: true },
                    { key: 'col3', name: 'Status', fieldName: 'status', minWidth: 80, maxWidth: 100, isResizable: true },
                    { key: 'col4', name: 'Purchase Date', fieldName: 'purchaseDate', minWidth: 100, maxWidth: 120, isResizable: true },
                    {
                        key: 'col5',
                        name: 'Warranty Expiry Date',
                        fieldName: 'warrantyExpiry',
                        minWidth: 140,
                        maxWidth: 200,
                        isResizable: true,
                        onRender: (item) => {
                            const isExpired = item.warrantyExpiry && new Date(item.warrantyExpiry) < new Date();
                            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                    color: isExpired ? '#ef4444' : '#166534',
                                    fontWeight: 600,
                                    backgroundColor: isExpired ? '#fee2e2' : '#dcfce7',
                                    padding: '2px 8px',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    display: 'inline-block'
                                } },
                                item.warrantyExpiry || 'N/A',
                                " ",
                                isExpired ? '(Expired)' : '(Active)'));
                        }
                    }
                ], setKey: "warrantyReport", layoutMode: _fluentui_react__WEBPACK_IMPORTED_MODULE_9__.DetailsListLayoutMode.justified, selectionMode: _fluentui_react__WEBPACK_IMPORTED_MODULE_10__.SelectionMode.none })))));
};


/***/ }),

/***/ 56330:
/*!*********************************************************!*\
  !*** ./lib/webparts/inventoryManagement/pages/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConfigPage: () => (/* reexport safe */ _ConfigPage__WEBPACK_IMPORTED_MODULE_0__.ConfigPage),
/* harmony export */   DashboardPage: () => (/* reexport safe */ _DashboardPage__WEBPACK_IMPORTED_MODULE_1__.DashboardPage),
/* harmony export */   IncidentHistoryPage: () => (/* reexport safe */ _IncidentHistoryPage__WEBPACK_IMPORTED_MODULE_3__.IncidentHistoryPage),
/* harmony export */   InventoryPage: () => (/* reexport safe */ _InventoryPage__WEBPACK_IMPORTED_MODULE_4__.InventoryPage),
/* harmony export */   ReportsPage: () => (/* reexport safe */ _ReportsPage__WEBPACK_IMPORTED_MODULE_2__.ReportsPage)
/* harmony export */ });
/* harmony import */ var _ConfigPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ConfigPage */ 43325);
/* harmony import */ var _DashboardPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DashboardPage */ 76577);
/* harmony import */ var _ReportsPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ReportsPage */ 22882);
/* harmony import */ var _IncidentHistoryPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./IncidentHistoryPage */ 34575);
/* harmony import */ var _InventoryPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./InventoryPage */ 44809);







/***/ }),

/***/ 17694:
/*!*********************************************************!*\
  !*** ./lib/webparts/inventoryManagement/pnpjsConfig.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getContext: () => (/* binding */ getContext),
/* harmony export */   getSP: () => (/* binding */ getSP)
/* harmony export */ });
/* harmony import */ var _pnp_sp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/sp */ 2011);
/* harmony import */ var _pnp_logging__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/logging */ 60133);
/* harmony import */ var _pnp_sp_webs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @pnp/sp/webs */ 47339);
/* harmony import */ var _pnp_sp_lists__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @pnp/sp/lists */ 52185);
/* harmony import */ var _pnp_sp_items__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @pnp/sp/items */ 95324);
/* harmony import */ var _pnp_sp_batching__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @pnp/sp/batching */ 82815);
/* harmony import */ var _pnp_sp_fields__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @pnp/sp/fields */ 75621);







let _sp;
let _context;
const getSP = (context) => {
    if (context != null) {
        _context = context;
        // Initialize the sp object with SPFx context and logging
        _sp = (0,_pnp_sp__WEBPACK_IMPORTED_MODULE_0__.spfi)().using((0,_pnp_sp__WEBPACK_IMPORTED_MODULE_0__.SPFx)(context)).using((0,_pnp_logging__WEBPACK_IMPORTED_MODULE_1__.PnPLogging)(_pnp_logging__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Warning));
    }
    return _sp;
};
const getContext = () => {
    return _context;
};


/***/ }),

/***/ 95576:
/*!*****************************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/services/AssetAssignmentService.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssetAssignmentService: () => (/* binding */ AssetAssignmentService)
/* harmony export */ });
/* harmony import */ var _pnpjsConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../pnpjsConfig */ 17694);
/* harmony import */ var _data_mockData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data/mockData */ 27962);
/* harmony import */ var _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base/SharePointBaseService */ 93535);
/* harmony import */ var _AuditLogService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AuditLogService */ 43584);
/* harmony import */ var _InventoryItemService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./InventoryItemService */ 32974);
/* harmony import */ var _RequestService__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./RequestService */ 50764);
/* harmony import */ var _EmailService__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./EmailService */ 407);







class AssetAssignmentService {
    static async getMappingList() {
        const sp = (0,_pnpjsConfig__WEBPACK_IMPORTED_MODULE_0__.getSP)();
        if (AssetAssignmentService._resolvedMappingListName) {
            return sp.web.lists.getByTitle(AssetAssignmentService._resolvedMappingListName);
        }
        try {
            const list = sp.web.lists.getByTitle(_base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_2__.SharePointBaseService.MAPPING_LIST_NAME);
            await list.select("Title")(); // Verify list exists
            // eslint-disable-next-line require-atomic-updates
            AssetAssignmentService._resolvedMappingListName = _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_2__.SharePointBaseService.MAPPING_LIST_NAME;
            return list;
        }
        catch (e) {
            try {
                const fallbackName = "MappingList";
                const list = sp.web.lists.getByTitle(fallbackName);
                await list.select("Title")(); // Verify fallback exists
                console.log("Resolved mapping list name dynamically to fallback: " + fallbackName);
                // eslint-disable-next-line require-atomic-updates
                AssetAssignmentService._resolvedMappingListName = fallbackName;
                return list;
            }
            catch (e2) {
                // Attempt to auto-create "Mapping List" dynamically
                try {
                    console.log("Attempting to auto-create 'Mapping List' list...");
                    await sp.web.lists.add(_base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_2__.SharePointBaseService.MAPPING_LIST_NAME, "List for tracking asset assignments", 100);
                    // eslint-disable-next-line require-atomic-updates
                    AssetAssignmentService._resolvedMappingListName = _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_2__.SharePointBaseService.MAPPING_LIST_NAME;
                    console.log("Successfully created 'Mapping List' in SharePoint.");
                    return sp.web.lists.getByTitle(_base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_2__.SharePointBaseService.MAPPING_LIST_NAME);
                }
                catch (createError) {
                    try {
                        const allLists = await sp.web.lists.select("Title")();
                        const listNames = allLists.map(l => '"' + l.Title + '"').join(', ');
                        throw new Error("List '" + _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_2__.SharePointBaseService.MAPPING_LIST_NAME + "' does not exist and could not be auto-created on this SharePoint site. Available lists are: [ " + listNames + " ].");
                    }
                    catch (listsError) {
                        throw new Error("List '" + _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_2__.SharePointBaseService.MAPPING_LIST_NAME + "' does not exist and could not be auto-created.");
                    }
                }
            }
        }
    }
    static async _ensureMappingListFields() {
        if (AssetAssignmentService._mappingListFieldsEnsured) {
            return;
        }
        AssetAssignmentService._mappingListFieldsEnsured = true;
        try {
            const list = await AssetAssignmentService.getMappingList();
            const fields = await list.fields.select("InternalName", "Title", "TypeAsString")();
            const hasField = (name) => fields.some(field => {
                const internalName = (field.InternalName || '').toString().toLowerCase();
                const title = (field.Title || '').toString().toLowerCase();
                const search = name.toLowerCase();
                return internalName === search || title === search;
            });
            // 0. AssignmentID (Text)
            if (!hasField("AssignmentID")) {
                try {
                    await list.fields.addText("AssignmentID", { Title: "Assignment ID" });
                }
                catch (err) {
                    console.warn("Could not auto-create AssignmentID field. Continuing.", err);
                }
            }
            // 1. Employe (Text)
            if (!hasField("Employe")) {
                try {
                    await list.fields.addText("Employe");
                }
                catch (err) {
                    console.warn("Could not auto-create Employe field. Continuing.", err);
                }
            }
            // 2. EmployeeID / Employee ID (Text)
            const hasEmpId = fields.some(field => {
                const val = (field.InternalName || '').toString().toLowerCase();
                const t = (field.Title || '').toString().toLowerCase();
                return val === 'employeeid' || val === 'employee_x0020_id' || val === 'employee id' || t === 'employee id' || t === 'employeeid' || val === 'employeid' || t === 'employeid' || t === 'employe id';
            });
            if (!hasEmpId) {
                try {
                    await list.fields.addText("EmployeeID", { Title: "Employe ID" });
                }
                catch (err) {
                    try {
                        await list.fields.addText("EmployeID", { Title: "Employe ID" });
                    }
                    catch (err2) {
                        try {
                            await list.fields.addText("EmployeeID");
                        }
                        catch (err3) {
                            console.warn("Could not auto-create EmployeeID field. Continuing.", err3);
                        }
                    }
                }
            }
            // 3. AssetName / Asset Name (Text)
            const hasAssetName = fields.some(field => {
                const val = (field.InternalName || '').toString().toLowerCase();
                const t = (field.Title || '').toString().toLowerCase();
                return val === 'assetname' || val === 'asset_x0020_name' || val === 'asset name' || t === 'asset name' || t === 'assetname';
            });
            if (!hasAssetName) {
                try {
                    await list.fields.addText("AssetName", { Title: "Asset Name" });
                }
                catch (err) {
                    try {
                        await list.fields.addText("AssetName");
                    }
                    catch (err2) {
                        console.warn("Could not auto-create AssetName field. Continuing.", err2);
                    }
                }
            }
            // 4. SerialNumber / Serial Number (Text)
            const hasSerialNumber = fields.some(field => {
                const val = (field.InternalName || '').toString().toLowerCase();
                const t = (field.Title || '').toString().toLowerCase();
                return val === 'serialnumber' || val === 'serial_x0020_number' || val === 'serial number' || t === 'serial number' || t === 'serialnumber';
            });
            if (!hasSerialNumber) {
                try {
                    await list.fields.addText("SerialNumber", { Title: "Serial Number" });
                }
                catch (err) {
                    try {
                        await list.fields.addText("SerialNumber");
                    }
                    catch (err2) {
                        console.warn("Could not auto-create SerialNumber field. Continuing.", err2);
                    }
                }
            }
            // 5. Priority (Choice)
            if (!hasField("Priority")) {
                try {
                    await list.fields.addChoice("Priority", {
                        Choices: ["High", "Medium", "Low"],
                        FillInChoice: false
                    });
                }
                catch (err) {
                    console.warn("Could not auto-create Priority field. Continuing.", err);
                }
            }
            // 6. RequestedDate / Requested Date (Text)
            const hasRequestedDate = fields.some(field => {
                const val = (field.InternalName || '').toString().toLowerCase();
                const t = (field.Title || '').toString().toLowerCase();
                return val === 'requesteddate' || val === 'requested_x0020_date' || val === 'requested date' || t === 'requested date' || t === 'requesteddate';
            });
            if (!hasRequestedDate) {
                try {
                    await list.fields.addText("RequestedDate", { Title: "Requested Date" });
                }
                catch (err) {
                    try {
                        await list.fields.addText("RequestedDate");
                    }
                    catch (err2) {
                        console.warn("Could not auto-create RequestedDate field. Continuing.", err2);
                    }
                }
            }
            // 7. ReasonforRequest / Reason for Request (Multiline Text)
            const hasReasonforRequest = fields.some(field => {
                const val = (field.InternalName || '').toString().toLowerCase();
                const t = (field.Title || '').toString().toLowerCase();
                return val === 'reasonforrequest' || val === 'reason_x0020_for_x0020_request' || val === 'reason for request' || t === 'reason for request' || t === 'reasonforrequest';
            });
            if (!hasReasonforRequest) {
                try {
                    await list.fields.addMultilineText("ReasonforRequest", { Title: "Reason for Request" });
                }
                catch (err) {
                    try {
                        await list.fields.addMultilineText("ReasonforRequest");
                    }
                    catch (err2) {
                        console.warn("Could not auto-create ReasonforRequest field. Continuing.", err2);
                    }
                }
            }
            // 8. AssignedDate / Assigned Date (Text)
            const hasAssignedDate = fields.some(field => {
                const val = (field.InternalName || '').toString().toLowerCase();
                const t = (field.Title || '').toString().toLowerCase();
                return val === 'assigneddate' || val === 'assigned_x0020_date' || val === 'assigned date' || t === 'assigned date' || t === 'assigneddate';
            });
            if (!hasAssignedDate) {
                try {
                    await list.fields.addText("AssignedDate", { Title: "Assigned Date" });
                }
                catch (err) {
                    try {
                        await list.fields.addText("AssignedDate");
                    }
                    catch (err2) {
                        console.warn("Could not auto-create AssignedDate field. Continuing.", err2);
                    }
                }
            }
        }
        catch (error) {
            console.warn("Could not ensure Mapping List fields. Continuing.", error);
        }
    }
    static _resolveMappingPayload(mappingFields, employeeName, employeeId, assetName, serialNumber, priority, requestedDate, reason, assignedDate, assignedToId, isEmployePerson) {
        const findField = (searchStr, fallback) => {
            let field = mappingFields.find((f) => f.Title.toLowerCase() === searchStr.toLowerCase());
            if (field)
                return field.InternalName;
            field = mappingFields.find((f) => f.InternalName.toLowerCase() === searchStr.toLowerCase());
            if (field)
                return field.InternalName;
            const normalizedSearch = searchStr.toLowerCase().replace(/[^a-z0-9]/g, '');
            field = mappingFields.find((f) => f.Title.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedSearch);
            if (field)
                return field.InternalName;
            field = mappingFields.find((f) => f.InternalName.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedSearch);
            if (field)
                return field.InternalName;
            return fallback;
        };
        const titleField = mappingFields.find((f) => f.InternalName === "Title");
        const titleFieldTitle = titleField ? (titleField.Title || "").toLowerCase().trim() : "";
        const isTitleEmploye = titleFieldTitle === "employe" || titleFieldTitle === "employee";
        let employeeNameFieldName = "Title";
        if (isTitleEmploye) {
            employeeNameFieldName = "Title";
        }
        else {
            const f = mappingFields.find((x) => {
                const title = (x.Title || "").toLowerCase().trim();
                const internal = (x.InternalName || "").toLowerCase().trim();
                return title === "employe" || title === "employee" || internal === "employe" || internal === "employee";
            });
            if (f)
                employeeNameFieldName = f.InternalName;
        }
        const employeeIdFieldName = (() => {
            const searchFields = mappingFields.filter((f) => f.InternalName !== employeeNameFieldName);
            const findFieldInList = (list, search) => {
                let f = list.find((x) => (x.Title || "").toLowerCase().trim() === search.toLowerCase());
                if (f)
                    return f.InternalName;
                f = list.find((x) => x.InternalName.toLowerCase().trim() === search.toLowerCase());
                if (f)
                    return f.InternalName;
                const norm = search.toLowerCase().replace(/[^a-z0-9]/g, '');
                f = list.find((x) => (x.Title || "").toLowerCase().replace(/[^a-z0-9]/g, '') === norm);
                if (f)
                    return f.InternalName;
                return null;
            };
            return (findFieldInList(searchFields, "employe id") ||
                findFieldInList(searchFields, "employee id") ||
                findFieldInList(searchFields, "employeeid") ||
                findFieldInList(searchFields, "employeid") ||
                findFieldInList(searchFields, "employe") ||
                "EmployeeID");
        })();
        const assetNameFieldName = findField("asset name", "AssetName");
        const serialNumberFieldName = findField("serial number", "SerialNumber");
        const priorityFieldName = findField("priority", "Priority");
        const requestedDateFieldName = findField("requested date", "RequestedDate");
        const reasonFieldName = findField("reason for request", "ReasonforRequest");
        const assignedDateFieldName = findField("assigned date", "AssignedDate");
        const payload = {};
        // Map Employee Name to the Employee column (either Title or a custom field)
        if (employeeNameFieldName === "Title") {
            payload["Title"] = employeeName;
        }
        else {
            payload["Title"] = `Assignment of ${assetName}`;
            const empFieldObj = mappingFields.find((f) => f.InternalName === employeeNameFieldName);
            const isEmpFieldPerson = empFieldObj && (empFieldObj.TypeAsString === "User" || empFieldObj.TypeAsString === "UserMulti");
            if (isEmpFieldPerson && assignedToId !== null) {
                payload[`${employeeNameFieldName}Id`] = assignedToId;
            }
            else {
                payload[employeeNameFieldName] = employeeName;
            }
        }
        // Map Employee ID to the Employee ID column
        const empIdFieldObj = mappingFields.find((f) => f.InternalName === employeeIdFieldName);
        const isEmpIdFieldPerson = empIdFieldObj && (empIdFieldObj.TypeAsString === "User" || empIdFieldObj.TypeAsString === "UserMulti");
        if (isEmpIdFieldPerson && assignedToId !== null) {
            payload[`${employeeIdFieldName}Id`] = assignedToId;
        }
        else {
            payload[employeeIdFieldName] = employeeId;
        }
        // Map other columns
        payload[assetNameFieldName] = assetName;
        payload[serialNumberFieldName] = serialNumber;
        payload[priorityFieldName] = priority;
        payload[requestedDateFieldName] = requestedDate;
        payload[reasonFieldName] = reason;
        payload[assignedDateFieldName] = assignedDate;
        return payload;
    }
    static async _writeToMappingList(employeeName, employeeId, employeeEmail, assetName, serialNumber, priority, requestedDate, reason, assignedDate, assignmentId) {
        const mappingList = await AssetAssignmentService.getMappingList();
        const schema = await _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_2__.SharePointBaseService.getListFieldsMetadata(mappingList);
        const finalAssignmentId = assignmentId || `ASG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        let assignedToId = null;
        try {
            const sp = (0,_pnpjsConfig__WEBPACK_IMPORTED_MODULE_0__.getSP)();
            const user = await sp.web.ensureUser(employeeEmail);
            assignedToId = user.data ? user.data.Id : user.Id;
        }
        catch (e) {
            console.warn(`Could not resolve user ${employeeEmail} in SharePoint during mapping write. Falling back to current user.`, e);
            try {
                const sp = (0,_pnpjsConfig__WEBPACK_IMPORTED_MODULE_0__.getSP)();
                const currentUser = await sp.web.currentUser();
                assignedToId = currentUser.Id;
            }
            catch (currUserErr) {
                console.warn("Failed to get current user as fallback in mapping write", currUserErr);
            }
        }
        const resolvedMapping = {};
        let employeeNameField = schema.find(f => f.internalName.toLowerCase() === "employe" ||
            f.internalName.toLowerCase() === "employee" ||
            f.displayName.toLowerCase() === "employe" ||
            f.displayName.toLowerCase() === "employee" ||
            f.displayName.toLowerCase() === "employee name");
        if (!employeeNameField) {
            employeeNameField = schema.find(f => f.internalName === "Title");
        }
        if (employeeNameField) {
            resolvedMapping["EmployeeName"] = employeeNameField.internalName;
        }
        const getField = (aliases) => {
            const mappedValues = new Set();
            for (const k of Object.keys(resolvedMapping)) {
                mappedValues.add(resolvedMapping[k]);
            }
            const match = _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_2__.SharePointBaseService._resolveFieldInternalName(schema, aliases, mappedValues);
            return match;
        };
        const empIdCol = getField(["employeeid", "employee id", "employeid", "employe id"]);
        if (empIdCol)
            resolvedMapping["EmployeeID"] = empIdCol;
        const assetNameCol = getField(["assetname", "asset name"]);
        if (assetNameCol)
            resolvedMapping["AssetName"] = assetNameCol;
        const serialCol = getField(["serialnumber", "serial number"]);
        if (serialCol)
            resolvedMapping["SerialNumber"] = serialCol;
        const assignedDateCol = getField(["assigneddate", "assigned date"]);
        if (assignedDateCol)
            resolvedMapping["AssignedDate"] = assignedDateCol;
        const assignmentIdCol = getField(["assignmentid", "assignment id"]);
        if (assignmentIdCol)
            resolvedMapping["AssignmentID"] = assignmentIdCol;
        const logicalPayload = {
            EmployeeName: assignedToId || employeeName,
            EmployeeID: employeeId,
            AssetName: assetName,
            SerialNumber: serialNumber,
            AssignedDate: assignedDate,
            AssignmentID: finalAssignmentId
        };
        const requiredKeys = ["EmployeeName", "EmployeeID", "AssetName", "SerialNumber", "AssignedDate"];
        let finalPayload;
        try {
            finalPayload = await _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_2__.SharePointBaseService._coerceAndValidatePayload(logicalPayload, schema, resolvedMapping, requiredKeys);
            console.log(`[Mapping List Write] Dynamic Mapping resolved:`, JSON.stringify(resolvedMapping, null, 2));
            console.log(`[Mapping List Write] Final Payload before submission:`, JSON.stringify(finalPayload, null, 2));
            await mappingList.items.add(finalPayload);
            console.log(`Successfully added mapping record for ${employeeName}`);
        }
        catch (err) {
            const translatedErr = _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_2__.SharePointBaseService.translateSharePointError(err, finalPayload || logicalPayload, resolvedMapping);
            console.error(translatedErr.message);
            throw translatedErr;
        }
    }
    static async assignAssetsToEmployee(assetIds, employeeName, employeeEmail, adminName, employeeId, comment) {
        const sp = (0,_pnpjsConfig__WEBPACK_IMPORTED_MODULE_0__.getSP)();
        const list = await _InventoryItemService__WEBPACK_IMPORTED_MODULE_4__.InventoryItemService.getInventoryList();
        let assignedToId = null;
        // Ensure 'Note' column exists to guarantee we have a place to save the Assignee
        try {
            const fields = await list.fields();
            if (!fields.some((f) => f.InternalName === 'Note')) {
                await list.fields.addMultilineText('Note', { NumberOfLines: 6, RichText: false });
                console.log("Automatically created 'Note' column in SharePoint list.");
            }
        }
        catch (e) {
            console.warn("Failed to check or create Note column", e);
        }
        // Try to resolve the user in SharePoint by email
        try {
            const user = await sp.web.ensureUser(employeeEmail);
            assignedToId = user.data ? user.data.Id : user.Id;
        }
        catch (e) {
            console.warn(`Could not resolve user ${employeeEmail} in SharePoint. Falling back to current user.`, e);
            try {
                const currentUser = await sp.web.currentUser();
                assignedToId = currentUser.Id;
            }
            catch (currUserErr) {
                console.warn("Failed to get current user as fallback in assignAssetsToEmployee", currUserErr);
            }
        }
        const updatePromises = assetIds.map(async (assetId) => {
            // 1. Get asset details first
            let assetItem = null;
            try {
                assetItem = await list.items.getById(parseInt(assetId))();
            }
            catch (e) {
                console.warn(`Could not fetch details for asset ${assetId}`, e);
            }
            const assetName = assetItem ? (assetItem.AssetName || assetItem.Asset_x0020_Name || assetItem.Asset || assetItem.Title || "") : "";
            const assetType = assetItem ? (assetItem.AssetType || assetItem.Asset_x0020_Type || assetItem.Type || "") : "";
            const serialNumber = assetItem ? (assetItem.SerialNumber || assetItem.Serial_x0020_Number || "") : "";
            // 2. Perform the update to InventoryList
            const payloadsToTry = [];
            const baseStatus = { Status: 'Assigned' };
            if (assignedToId !== null) {
                payloadsToTry.push({ ...baseStatus, AssignedToId: { results: [assignedToId] }, Note: `Assigned to: ${employeeName}` });
                payloadsToTry.push({ ...baseStatus, Assigned_x0020_ToId: { results: [assignedToId] }, Note: `Assigned to: ${employeeName}` });
                payloadsToTry.push({ ...baseStatus, AssignedToId: assignedToId, Note: `Assigned to: ${employeeName}` });
                payloadsToTry.push({ ...baseStatus, Assigned_x0020_ToId: assignedToId, Note: `Assigned to: ${employeeName}` });
                payloadsToTry.push({ ...baseStatus, AssignedToId: assignedToId });
                payloadsToTry.push({ ...baseStatus, Assigned_x0020_ToId: assignedToId });
            }
            else {
                payloadsToTry.push({ ...baseStatus, AssignedTo: employeeName, Note: `Assigned to: ${employeeName}` });
                payloadsToTry.push({ ...baseStatus, Assigned_x0020_To: employeeName, Note: `Assigned to: ${employeeName}` });
                payloadsToTry.push({ ...baseStatus, AssignedTo: employeeName });
                payloadsToTry.push({ ...baseStatus, Assigned_x0020_To: employeeName });
            }
            payloadsToTry.push({ ...baseStatus, Note: `Assigned to: ${employeeName}` });
            payloadsToTry.push({ ...baseStatus, Notes: `Assigned to: ${employeeName}` });
            payloadsToTry.push({ Status: `Assigned to: ${employeeName}`, AssetStatus: `Assigned to: ${employeeName}` }); // Fallback to Status column
            payloadsToTry.push({ ...baseStatus });
            let success = false;
            let lastErr;
            for (const payload of payloadsToTry) {
                try {
                    await list.items.getById(parseInt(assetId)).update(payload);
                    success = true;
                    break; // Stop trying if one succeeds
                }
                catch (err) {
                    lastErr = err;
                }
            }
            if (!success) {
                console.error(`All fallback updates failed for asset ${assetId}`, lastErr);
                throw new Error(lastErr.message || "Failed to update asset status");
            }
            // 3. Find matching request in RequestList
            let priority = "Medium";
            let requestedDate = "";
            let reason = "Direct Assignment";
            let matchingRequest = null;
            try {
                const requests = await _RequestService__WEBPACK_IMPORTED_MODULE_5__.RequestService.getRequests();
                matchingRequest = requests.find(r => {
                    const isEmployeeMatch = (employeeId && r.employeeId && r.employeeId.toLowerCase() === employeeId.toLowerCase()) ||
                        (employeeName && r.requesterName && r.requesterName.toLowerCase() === employeeName.toLowerCase());
                    const isAssetMatch = assetType && r.assetTitle && r.assetTitle.toLowerCase() === assetType.toLowerCase();
                    return isEmployeeMatch && isAssetMatch && r.status === 'Approved' && r.assetStatus === 'Pending';
                });
                if (matchingRequest) {
                    priority = matchingRequest.priority || "Medium";
                    requestedDate = matchingRequest.requestDate || "";
                    reason = matchingRequest.reason || "Direct Assignment";
                }
            }
            catch (err) {
                console.warn("Failed to find matching approved request in RequestList", err);
            }
            // Format dates properly
            const formatDate = (dateStr) => {
                if (!dateStr) {
                    const d = new Date();
                    const day = ("0" + d.getDate()).slice(-2);
                    const month = ("0" + (d.getMonth() + 1)).slice(-2);
                    return `${day}/${month}/${d.getFullYear()}`;
                }
                if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
                    return dateStr;
                }
                const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
                if (match) {
                    return `${match[3]}/${match[2]}/${match[1]}`;
                }
                return dateStr;
            };
            const finalRequestedDate = formatDate(requestedDate);
            const finalAssignedDate = formatDate(new Date().toISOString());
            // 4. Update the matching request status to allocated (assetStatus = 'Approved')
            if (matchingRequest) {
                try {
                    await _InventoryItemService__WEBPACK_IMPORTED_MODULE_4__.InventoryItemService.updateAssetStatus(parseInt(matchingRequest.id, 10), 'Approved', adminName, comment);
                }
                catch (err) {
                    console.warn(`Failed to update assetStatus to Approved for Request ${matchingRequest.id}`, err);
                }
            }
            // 5. Update Mapping List
            try {
                await AssetAssignmentService._ensureMappingListFields();
                await AssetAssignmentService._writeToMappingList(employeeName, employeeId || "", employeeEmail, assetName, serialNumber, priority, finalRequestedDate, reason, finalAssignedDate);
            }
            catch (err) {
                console.warn("Failed to execute Mapping List update logic. Continuing.", err);
            }
            await _AuditLogService__WEBPACK_IMPORTED_MODULE_3__.AuditLogService.addAuditLog({
                title: `Asset activated and assigned to ${employeeName}`,
                action: 'Activated',
                entityType: 'Asset',
                entityId: assetId,
                details: JSON.stringify({
                    lifecycle: "DirectAssignment",
                    assignedTo: employeeName,
                    changedBy: adminName,
                    changedAt: new Date().toISOString()
                }),
                user: adminName
            });
            // Trigger Email Notification to Employee on Assignment
            try {
                await _EmailService__WEBPACK_IMPORTED_MODULE_6__.EmailService.sendAssignmentNotificationToEmployee({
                    employeeName,
                    employeeEmail,
                    assetName,
                    assetId: serialNumber || assetId,
                    assignedBy: adminName,
                    assignedDate: finalAssignedDate
                });
            }
            catch (mailErr) {
                console.warn("Failed to send assignment notification email to Employee:", mailErr);
            }
        });
        await Promise.all(updatePromises);
    }
    static async syncExistingAssignmentsToMappingList(adminName) {
        let checkedCount = 0;
        let syncedCount = 0;
        try {
            console.log("Starting Mapping List sync...");
            const list = await _InventoryItemService__WEBPACK_IMPORTED_MODULE_4__.InventoryItemService.getInventoryList();
            const items = await _InventoryItemService__WEBPACK_IMPORTED_MODULE_4__.InventoryItemService.getItems();
            // Filter for assigned items matching the 5 active employees
            const assignedItems = items.filter(item => {
                return _data_mockData__WEBPACK_IMPORTED_MODULE_1__.EMPLOYEES.some(emp => {
                    const normalize = (value) => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                    const activeUser = normalize(emp.name);
                    if (!activeUser)
                        return false;
                    const assignedNorm = normalize(item.assignedTo);
                    const isAssigned = assignedNorm && (assignedNorm === activeUser || assignedNorm.includes(activeUser) || activeUser.includes(assignedNorm));
                    const isNoted = (item.note || '').toLowerCase().includes('assigned to:') && normalize(item.note).includes(activeUser);
                    const isStatus = (item.status || '').toLowerCase().includes('assigned to:') && normalize(item.status).includes(activeUser);
                    return !!(isAssigned || isNoted || isStatus);
                });
            });
            checkedCount = assignedItems.length;
            if (assignedItems.length === 0) {
                console.log("No assigned assets found for the 5 active employees.");
                return { checkedCount, syncedCount };
            }
            await AssetAssignmentService._ensureMappingListFields();
            const mappingList = await AssetAssignmentService.getMappingList();
            const mappingItems = await mappingList.items();
            const requests = await _RequestService__WEBPACK_IMPORTED_MODULE_5__.RequestService.getRequests();
            // Resolve the Mapping List field names
            const mappingFields = await mappingList.fields.select("InternalName", "Title", "TypeAsString")();
            const findMappingField = (searchStr, fallback) => {
                let field = mappingFields.find((f) => f.InternalName.toLowerCase() === searchStr.toLowerCase());
                if (field)
                    return field.InternalName;
                field = mappingFields.find((f) => f.Title.toLowerCase() === searchStr.toLowerCase());
                if (field)
                    return field.InternalName;
                const normalizedSearch = searchStr.toLowerCase().replace(/[^a-z0-9]/g, '');
                field = mappingFields.find((f) => f.Title.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedSearch);
                if (field)
                    return field.InternalName;
                field = mappingFields.find((f) => f.Title.toLowerCase().replace(/[^a-z0-9]/g, '').indexOf(normalizedSearch) >= 0);
                if (field)
                    return field.InternalName;
                return fallback;
            };
            const serialNumberFieldName = findMappingField("serialnumber", "SerialNumber");
            for (const asset of assignedItems) {
                // Check if this asset is already in the Mapping List
                const alreadyMapped = mappingItems.some((m) => {
                    const mSerial = m[serialNumberFieldName] || m.SerialNumber || m.Serial_x0020_Number || "";
                    return mSerial.toString().toLowerCase() === asset.serialNumber.toString().toLowerCase();
                });
                if (alreadyMapped) {
                    console.log(`Asset ${asset.assetName || asset.title} (${asset.serialNumber}) is already in Mapping List.`);
                    continue;
                }
                const employee = _data_mockData__WEBPACK_IMPORTED_MODULE_1__.EMPLOYEES.find(emp => {
                    const normalize = (value) => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                    const activeUser = normalize(emp.name);
                    if (!activeUser)
                        return false;
                    const assignedNorm = normalize(asset.assignedTo);
                    const isAssigned = assignedNorm && (assignedNorm === activeUser || assignedNorm.includes(activeUser) || activeUser.includes(assignedNorm));
                    const isNoted = (asset.note || '').toLowerCase().includes('assigned to:') && normalize(asset.note).includes(activeUser);
                    const isStatus = (asset.status || '').toLowerCase().includes('assigned to:') && normalize(asset.status).includes(activeUser);
                    return !!(isAssigned || isNoted || isStatus);
                });
                const employeeName = employee ? employee.name : (asset.assignedTo || "Unknown");
                const employeeId = employee ? employee.id : "";
                const employeeEmail = employee ? employee.email : "";
                const assetAssignedTo = employeeName;
                console.log(`Syncing missing assigned asset to Mapping List: ${asset.assetName || asset.title} (${asset.serialNumber}) for ${assetAssignedTo}`);
                // Find matching request
                let priority = "Medium";
                let requestedDate = "";
                let reason = "Direct Assignment";
                let matchingRequest = null;
                const assetType = asset.assetType || "";
                matchingRequest = requests.find(r => {
                    const isEmployeeMatch = (employeeId && r.employeeId && r.employeeId.toLowerCase() === employeeId.toLowerCase()) ||
                        (employeeName && r.requesterName && r.requesterName.toLowerCase() === employeeName.toLowerCase());
                    const isAssetMatch = assetType && r.assetTitle && r.assetTitle.toLowerCase() === assetType.toLowerCase();
                    return isEmployeeMatch && isAssetMatch && r.status === 'Approved';
                });
                if (matchingRequest) {
                    priority = matchingRequest.priority || "Medium";
                    requestedDate = matchingRequest.requestDate || "";
                    reason = matchingRequest.reason || "Direct Assignment";
                }
                // Format dates properly
                const formatDate = (dateStr) => {
                    if (!dateStr) {
                        const d = new Date();
                        const day = ("0" + d.getDate()).slice(-2);
                        const month = ("0" + (d.getMonth() + 1)).slice(-2);
                        return `${day}/${month}/${d.getFullYear()}`;
                    }
                    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
                        return dateStr;
                    }
                    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
                    if (match) {
                        return `${match[3]}/${match[2]}/${match[1]}`;
                    }
                    return dateStr;
                };
                const finalRequestedDate = formatDate(requestedDate);
                const finalAssignedDate = formatDate(asset.assignedDate || new Date().toISOString());
                // Update the matching request status to allocated (assetStatus = 'Approved')
                if (matchingRequest && matchingRequest.assetStatus === 'Pending') {
                    try {
                        await _InventoryItemService__WEBPACK_IMPORTED_MODULE_4__.InventoryItemService.updateAssetStatus(parseInt(matchingRequest.id, 10), 'Approved', adminName);
                    }
                    catch (err) {
                        console.warn(`Failed to update assetStatus to Approved for Request ${matchingRequest.id}`, err);
                    }
                }
                // Add to Mapping List
                const assetName = asset.assetName || asset.title || "";
                const serialNumber = asset.serialNumber || "";
                try {
                    await AssetAssignmentService._writeToMappingList(employeeName, employeeId, employeeEmail, assetName, serialNumber, priority, finalRequestedDate, reason, finalAssignedDate);
                    syncedCount++;
                }
                catch (err) {
                    console.warn(`Failed to write synced record for ${employeeName} to Mapping List.`, err);
                }
            }
        }
        catch (e) {
            console.error("Failed to sync existing assignments to Mapping List:", e);
            throw e;
        }
        return { checkedCount, syncedCount };
    }
    static async diagnoseMappingListFields() {
        try {
            const mappingList = await AssetAssignmentService.getMappingList();
            const fields = await mappingList.fields.select("InternalName", "Title", "TypeAsString")();
            const items = await mappingList.items.select("ID")();
            let output = `Mapping List Diagnostics:\n`;
            output += `- List URL Title: "${mappingList.Title || "Mapping List"}"\n`;
            output += `- Record Count: ${items.length}\n`;
            output += `- Available Fields in List:\n`;
            fields.forEach((f) => {
                output += `  * InternalName: "${f.InternalName}", Title: "${f.Title}", Type: "${f.TypeAsString}"\n`;
            });
            return output;
        }
        catch (e) {
            return `Failed to diagnose Mapping List schema. Error: ${e.message || JSON.stringify(e)}`;
        }
    }
}
AssetAssignmentService._resolvedMappingListName = null;
AssetAssignmentService._mappingListFieldsEnsured = false;


/***/ }),

/***/ 407:
/*!*******************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/services/EmailService.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EmailService: () => (/* binding */ EmailService)
/* harmony export */ });
/* harmony import */ var _pnpjsConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../pnpjsConfig */ 17694);
/* harmony import */ var _data_mockData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data/mockData */ 27962);


class EmailService {
    /**
     * Helper to get target emails for Admins
     */
    static async getAdminEmails(liveEmails) {
        return this.USE_MOCK_TEST_EMAILS ? this.MOCK_ADMIN_EMAILS : liveEmails;
    }
    /**
     * Helper to get target email for Manager
     */
    static async getManagerEmail(liveEmail) {
        return this.USE_MOCK_TEST_EMAILS ? this.MOCK_MANAGER_EMAIL : liveEmail;
    }
    /**
     * Helper to get target email for Employee
     */
    static async getEmployeeEmail(liveEmail) {
        return this.USE_MOCK_TEST_EMAILS ? this.MOCK_ADMIN_EMAILS[0] : (liveEmail || this.MOCK_ADMIN_EMAILS[0]);
    }
    /**
     * Send Approval Request Email to Manager (Diego / sanikommurohitha123@gmail.com)
     */
    static async sendApprovalRequestToManager(params, liveManagerEmail) {
        const toEmail = await this.getManagerEmail(liveManagerEmail || "");
        const subject = "Approval Required - Asset Request";
        const body = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6; padding: 20px; color: #1f2937; min-height: 100%;">
        <div style="max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
          <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 30px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Approval Required</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Asset Requisition Pending Your Action</p>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px; line-height: 1.6; margin-top: 0; color: #374151;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">A new asset request has been created and requires your review and approval:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden;">
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase; width: 40%;">Employee Name</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600; font-size: 14px;">${params.employeeName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Requested Asset</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600; font-size: 14px;">${params.assetName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Request ID</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #2563eb; font-weight: 700; font-size: 14px;">${params.requestKey}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Request Date</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">${params.requestDate}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Requested By</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">${params.adminName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Status</td>
                <td style="padding: 12px 15px; color: #d97706; font-weight: 700; font-size: 14px;">Pending Approval</td>
              </tr>
            </table>

            <p style="font-size: 15px; line-height: 1.6; color: #4b5563; text-align: center; margin-top: 30px;">
              Please open the Asset Management Portal to Approve or Reject this request.
            </p>
          </div>
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; background-color: #fafafa;">
            This is an automated request from the Asset Management Portal.
          </div>
        </div>
      </div>
    `;
        await this.sendMail([toEmail], subject, body);
    }
    /**
     * Send Approval Confirmation Email to Admins (Kiran / Akhila)
     */
    static async sendApprovalConfirmationToAdmin(params, liveAdminEmails) {
        const toEmails = await this.getAdminEmails(liveAdminEmails || []);
        const subject = "Asset Request Approved";
        const body = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6; padding: 20px; color: #1f2937; min-height: 100%;">
        <div style="max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Request Approved</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Requisition Ready for Asset Assignment</p>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px; line-height: 1.6; margin-top: 0; color: #374151;">Hello Admin,</p>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">The following asset request has been approved by the manager. Please proceed to allocate the asset to the employee in the Admin panel:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden;">
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase; width: 40%;">Request ID</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #2563eb; font-weight: 700; font-size: 14px;">${params.requestKey}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Employee Name</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600; font-size: 14px;">${params.employeeName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Asset Name</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600; font-size: 14px;">${params.assetName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Approved By</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">${params.approvedBy}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Approval Date</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">${params.approvalDate}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Status</td>
                <td style="padding: 12px 15px; color: #059669; font-weight: 700; font-size: 14px;">Approved</td>
              </tr>
            </table>
          </div>
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; background-color: #fafafa;">
            This is an automated confirmation from the Asset Management Portal.
          </div>
        </div>
      </div>
    `;
        await this.sendMail(toEmails, subject, body);
    }
    /**
     * Send Asset Assignment Notification Email to Employee (Adele / Alex)
     */
    static async sendAssignmentNotificationToEmployee(params, liveEmployeeEmail) {
        const toEmail = await this.getEmployeeEmail(liveEmployeeEmail || "");
        const subject = "Your Asset Has Been Assigned";
        const body = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6; padding: 20px; color: #1f2937; min-height: 100%;">
        <div style="max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
          <div style="background: linear-gradient(135deg, #0284c7, #0369a1); padding: 30px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Asset Assigned</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">IT Device Handover Notification</p>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px; line-height: 1.6; margin-top: 0; color: #374151;">Dear ${params.employeeName},</p>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">Your requested asset has been assigned to you. Here are the assignment details:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden;">
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase; width: 40%;">Employee Name</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600; font-size: 14px;">${params.employeeName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Asset Name</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600; font-size: 14px;">${params.assetName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Asset ID / Serial</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">${params.assetId || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Assigned By</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">${params.assignedBy}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Assignment Date</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">${params.assignedDate}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Status</td>
                <td style="padding: 12px 15px; color: #0284c7; font-weight: 700; font-size: 14px;">Assigned</td>
              </tr>
            </table>

            <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-top: 30px;">
              Please contact the IT Helpdesk if you have any questions regarding your device or if you require deployment assistance.
            </p>
          </div>
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; background-color: #fafafa;">
            This is an automated handover receipt from the Asset Management Portal.
          </div>
        </div>
      </div>
    `;
        await this.sendMail([toEmail], subject, body);
    }
    /**
     * Try to resolve the manager's email dynamically from SharePoint User Profiles or EmployeeList
     */
    static async resolveLiveManagerEmail(employeeName) {
        try {
            const sp = (0,_pnpjsConfig__WEBPACK_IMPORTED_MODULE_0__.getSP)();
            // 1. Try to query the EmployeeList first
            try {
                const employeeList = sp.web.lists.getByTitle("EmployeeList");
                const fields = await employeeList.fields.select("InternalName", "Title")();
                const getFieldName = (candidates) => {
                    const found = fields.find(f => candidates.some(c => f.Title.toLowerCase() === c.toLowerCase() || f.InternalName.toLowerCase() === c.toLowerCase()));
                    return found ? found.InternalName : null;
                };
                const nameField = getFieldName(['Employee Name', 'EmployeeName', 'Name', 'Title']);
                const managerField = getFieldName(['Manager', 'ManagerEmail', 'ReportsTo', 'ManagerName', 'Manager_x0020_Email']);
                if (nameField && managerField) {
                    const items = await employeeList.items.select(nameField, managerField)();
                    const employee = items.find((item) => {
                        const nameVal = item[nameField];
                        return nameVal && nameVal.toString().toLowerCase().trim() === employeeName.toLowerCase().trim();
                    });
                    if (employee) {
                        const managerVal = employee[managerField];
                        if (managerVal) {
                            if (typeof managerVal === 'string' && managerVal.indexOf("@") > 0) {
                                return managerVal;
                            }
                            // If it's a Person field
                            if (managerVal.Email) {
                                return managerVal.Email;
                            }
                            if (managerVal.Title && managerVal.Title.indexOf("@") > 0) {
                                return managerVal.Title;
                            }
                        }
                    }
                }
            }
            catch (listErr) {
                console.warn("Could not query EmployeeList for manager:", listErr);
            }
            // 2. Try User Profile Service using ensureUser first
            try {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                __webpack_require__(/*! @pnp/sp/profiles */ 878);
                const matchingEmp = _data_mockData__WEBPACK_IMPORTED_MODULE_1__.EMPLOYEES.find(e => e.name.toLowerCase() === employeeName.toLowerCase());
                const userIdentifier = matchingEmp ? matchingEmp.email : employeeName;
                const user = await sp.web.ensureUser(userIdentifier);
                const loginName = user.data ? user.data.LoginName : user.LoginName;
                const profile = await sp.profiles.getPropertiesFor(loginName);
                const managerProp = profile.UserProfileProperties.find((p) => p.Key === "Manager");
                if (managerProp && managerProp.Value) {
                    const managerProfile = await sp.profiles.getPropertiesFor(managerProp.Value);
                    const emailProp = managerProfile.UserProfileProperties.find((p) => p.Key === "WorkEmail");
                    if (emailProp && emailProp.Value) {
                        return emailProp.Value;
                    }
                }
            }
            catch (profileErr) {
                console.warn("Could not query User Profile Service for manager:", profileErr);
            }
        }
        catch (e) {
            console.warn("Error resolving live manager email:", e);
        }
        return null;
    }
    /**
     * Internal sender method using SharePoint sp.utility.sendEmail or developer console fallback.
     */
    static async sendMail(to, subject, htmlBody) {
        const validEmails = to.filter(email => email && email.indexOf("@") > 0);
        if (validEmails.length === 0) {
            console.warn(`[EmailService] No valid recipient emails found:`, to);
            return;
        }
        // Try sending email via Microsoft Graph API first (allows sending to external addresses like nexergroup.com)
        try {
            const context = (0,_pnpjsConfig__WEBPACK_IMPORTED_MODULE_0__.getContext)();
            if (context && context.msGraphClientFactory) {
                const client = await context.msGraphClientFactory.getClient("3");
                await client.api("/me/sendMail").post({
                    message: {
                        subject: subject,
                        body: {
                            contentType: "HTML",
                            content: htmlBody
                        },
                        toRecipients: validEmails.map(email => ({
                            emailAddress: {
                                address: email
                            }
                        }))
                    }
                });
                console.log(`[EmailService] Outgoing mail successfully sent via Microsoft Graph to: ${validEmails.join(", ")}`);
                return; // Success! Skip SharePoint Utility fallback
            }
        }
        catch (graphError) {
            console.warn("[EmailService] Failed to send email via Microsoft Graph. Falling back to SharePoint Utility...", graphError);
        }
        try {
            const sp = (0,_pnpjsConfig__WEBPACK_IMPORTED_MODULE_0__.getSP)();
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { Utilities } = __webpack_require__(/*! @pnp/sp/sputilities */ 229);
            const utility = Utilities(sp.web);
            await utility.sendEmail({
                To: validEmails,
                Subject: subject,
                Body: htmlBody,
                AdditionalHeaders: {
                    "content-type": "text/html"
                }
            });
            console.log(`[EmailService] Outgoing mail successfully sent via SharePoint Utility to: ${validEmails.join(", ")}`);
        }
        catch (error) {
            console.warn("[EmailService] Failed to send email via SharePoint Utility. Using console logs fallback:", error);
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('spfx_email_send_failed', {
                    detail: {
                        to: validEmails,
                        subject,
                        errorMessage: error instanceof Error ? error.message : JSON.stringify(error)
                    }
                }));
            }
        }
        finally {
            // Always write a beautiful colored log in the developer console to allow testing without live exchange configs.
            console.log(`%c📬 [EMAIL NOTIFICATION OUTBOX]\nTo: ${validEmails.join(", ")}\nSubject: ${subject}\n\n[HTML RENDERED EMAIL BODY]:\n${htmlBody.trim()}`, "background: #1e3a8a; color: #ffffff; border-left: 5px solid #3b82f6; padding: 12px; font-family: monospace; font-size: 12px; line-height: 1.5; border-radius: 4px;");
            // Dispatch event to allow the UI to render the email banner popup directly
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('spfx_mock_email_sent', {
                    detail: { to: validEmails, subject, body: htmlBody }
                }));
            }
        }
    }
}
// Set to true to route all emails to test accounts; set to false to use live SharePoint/AD emails.
EmailService.USE_MOCK_TEST_EMAILS = true;
EmailService.MOCK_ADMIN_EMAILS = [
    "Akhila.Dodla@3bh3kf.onmicrosoft.com"
];
EmailService.MOCK_MANAGER_EMAIL = "DiegoS@3bh3kf.onmicrosoft.com";


/***/ }),

/***/ 76911:
/*!**********************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/services/IncidentService.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IncidentService: () => (/* binding */ IncidentService)
/* harmony export */ });
/* harmony import */ var _pnp_sp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/sp */ 2011);
/* harmony import */ var _pnp_sp_webs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/sp/webs */ 47339);
/* harmony import */ var _pnp_sp_lists__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @pnp/sp/lists */ 52185);
/* harmony import */ var _pnp_sp_items__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @pnp/sp/items */ 95324);
/* harmony import */ var _pnp_sp_fields__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @pnp/sp/fields */ 75621);
/* harmony import */ var _pnp_logging__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @pnp/logging */ 60133);
/* harmony import */ var _data_mockData__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../data/mockData */ 27962);
/* harmony import */ var _InventoryService__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./InventoryService */ 29619);








class IncidentService {
    async getReplacementList() {
        try {
            const list = this.sp.web.lists.getByTitle(this.replacementListName);
            await list.select("Title")(); // check if list exists
            return list;
        }
        catch (e) {
            try {
                console.log("Attempting to auto-create 'Asset Replacements' list...");
                await this.sp.web.lists.add(this.replacementListName, "List for tracking asset replacements", 100);
                console.log("Successfully created 'Asset Replacements' list in SharePoint.");
                return this.sp.web.lists.getByTitle(this.replacementListName);
            }
            catch (createError) {
                console.error("Failed to auto-create 'Asset Replacements' list:", createError);
                throw createError;
            }
        }
    }
    async _ensureReplacementListFields() {
        if (IncidentService._replacementListFieldsEnsured) {
            return;
        }
        IncidentService._replacementListFieldsEnsured = true;
        try {
            const list = await this.getReplacementList();
            const fields = await list.fields.select("InternalName", "Title", "TypeAsString")();
            const hasField = (name) => fields.some(field => {
                const internalName = (field.InternalName || '').toString().toLowerCase();
                const title = (field.Title || '').toString().toLowerCase();
                const search = name.toLowerCase();
                return internalName === search || title === search;
            });
            if (!hasField("EmployeeID")) {
                try {
                    await list.fields.addText("EmployeeID", { Title: "Employee ID" });
                }
                catch (err) {
                    console.warn("Could not auto-create EmployeeID field. Continuing.", err);
                }
            }
            if (!hasField("EmployeeEmail")) {
                try {
                    await list.fields.addText("EmployeeEmail", { Title: "Employee Email" });
                }
                catch (err) {
                    console.warn("Could not auto-create EmployeeEmail field. Continuing.", err);
                }
            }
            if (!hasField("AssetName")) {
                try {
                    await list.fields.addText("AssetName", { Title: "Asset Name" });
                }
                catch (err) {
                    console.warn("Could not auto-create AssetName field. Continuing.", err);
                }
            }
            if (!hasField("SerialNo")) {
                try {
                    await list.fields.addText("SerialNo", { Title: "Serial No" });
                }
                catch (err) {
                    console.warn("Could not auto-create SerialNo field. Continuing.", err);
                }
            }
            if (!hasField("Priority")) {
                try {
                    await list.fields.addChoice("Priority", {
                        Choices: ["High", "Medium", "Low"],
                        FillInChoice: false
                    });
                }
                catch (err) {
                    console.warn("Could not auto-create Priority field. Continuing.", err);
                }
            }
            if (!hasField("Description")) {
                try {
                    await list.fields.addMultilineText("Description", { Title: "Description" });
                }
                catch (err) {
                    console.warn("Could not auto-create Description field. Continuing.", err);
                }
            }
            if (!hasField("Status")) {
                try {
                    await list.fields.addChoice("Status", {
                        Choices: ["Open", "In Progress", "Resolved", "Closed"],
                        FillInChoice: false
                    });
                }
                catch (err) {
                    console.warn("Could not auto-create Status field. Continuing.", err);
                }
            }
            if (!hasField("RequestDate")) {
                try {
                    await list.fields.addText("RequestDate", { Title: "Request Date" });
                }
                catch (err) {
                    console.warn("Could not auto-create RequestDate field. Continuing.", err);
                }
            }
        }
        catch (error) {
            // eslint-disable-next-line require-atomic-updates
            IncidentService._replacementListFieldsEnsured = false;
            console.warn("Could not ensure Asset Replacements List fields. Continuing.", error);
        }
    }
    constructor(spContext) {
        this.incidentListName = 'Incident List';
        this.employeeListName = 'EmployeeList';
        this.mappingListName = 'Mapping List';
        this.replacementListName = 'Asset Replacements';
        if (!spContext) {
            throw new Error('SPFx context is required. Ensure the web part is loaded in SharePoint.');
        }
        this.sp = (0,_pnp_sp__WEBPACK_IMPORTED_MODULE_0__.spfi)().using((0,_pnp_sp__WEBPACK_IMPORTED_MODULE_0__.SPFx)(spContext)).using((0,_pnp_logging__WEBPACK_IMPORTED_MODULE_5__.PnPLogging)(_pnp_logging__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Warning));
        console.log('IncidentService initialized with SharePoint context');
        this._migrateLocalReplacements();
    }
    _migrateLocalReplacements() {
        try {
            const localIncidents = this.getLocalItems('spfx_mock_incidents');
            const replacementsToMove = localIncidents.filter(item => item.incidentType === 'Replacement Request' ||
                item.issueType === 'Replacement Request' ||
                item.id === '384' ||
                item.id === '976' ||
                item.id === '166' ||
                item.id === '369' ||
                item.id === '859' ||
                item.incidentId === 'INC-384' ||
                item.incidentId === 'INC-976' ||
                item.incidentId === 'INC-166' ||
                item.incidentId === 'INC-369' ||
                item.incidentId === 'INC-859');
            if (replacementsToMove.length > 0) {
                console.log(`[Migration] Moving ${replacementsToMove.length} replacement items from spfx_mock_incidents to spfx_mock_replacements`);
                // 1. Remove them from spfx_mock_incidents
                const remainingIncidents = localIncidents.filter(item => item.incidentType !== 'Replacement Request' &&
                    item.issueType !== 'Replacement Request' &&
                    item.id !== '384' &&
                    item.id !== '976' &&
                    item.id !== '166' &&
                    item.id !== '369' &&
                    item.id !== '859' &&
                    item.incidentId !== 'INC-384' &&
                    item.incidentId !== 'INC-976' &&
                    item.incidentId !== 'INC-166' &&
                    item.incidentId !== 'INC-369' &&
                    item.incidentId !== 'INC-859');
                this.saveLocalItems('spfx_mock_incidents', remainingIncidents);
                // 2. Add them to spfx_mock_replacements
                const localReplacements = this.getLocalItems('spfx_mock_replacements');
                const updatedReplacements = [...localReplacements, ...replacementsToMove.map(item => ({
                        ...item,
                        incidentType: 'Replacement Request',
                        issueType: 'Replacement Request',
                        id: item.id.startsWith('INC-') ? item.id.replace('INC-', 'REP-') : item.id,
                        incidentId: item.incidentId ? item.incidentId.replace('INC-', 'REP-') : `REP-${item.id || Math.floor(Math.random() * 1000)}`
                    }))];
                // Filter duplicates
                const uniqueReplacements = updatedReplacements.filter((item, index, self) => self.findIndex(t => t.id === item.id || t.incidentId === item.incidentId) === index);
                this.saveLocalItems('spfx_mock_replacements', uniqueReplacements);
            }
        }
        catch (e) {
            console.warn("Failed to migrate local storage replacement items:", e);
        }
    }
    async getMappedPayload(listName, data) {
        try {
            const fields = await this.sp.web.lists.getByTitle(listName).fields();
            const getInternalName = (displayNames) => {
                for (const name of displayNames) {
                    const field = fields.find(f => f.Title && f.Title.toLowerCase() === name.toLowerCase());
                    if (field)
                        return field.InternalName;
                }
                return null;
            };
            const payload = {};
            // The first column (usually Title) was renamed to Employe/Employee
            payload.Title = data.employeeName || 'Unknown';
            const empNameField = getInternalName(['Employe Name', 'Employee Name', 'EmployeeName', 'EmployeName']);
            if (empNameField) {
                payload[empNameField] = data.employeeName || 'Unknown';
            }
            const empIdField = getInternalName(['Employe ID', 'Employee ID', 'EmployeeId', 'EmployeID']);
            if (empIdField)
                payload[empIdField] = data.employeeId || 'N/A';
            const emailField = getInternalName(['Employee Email', 'Email', 'Email ID', 'EmailID', 'User Email', 'UserEmail']);
            if (emailField && emailField !== empIdField)
                payload[emailField] = data.employeeEmail || data.email || '';
            const assetTypeField = getInternalName(['Asset Type', 'AssetType', 'Asset Name', 'AssetName']);
            if (assetTypeField)
                payload[assetTypeField] = data.assetName || data.assetType || 'Other';
            const serialField = getInternalName(['Serial Number', 'SerialNumber', 'Serial No', 'SerialNo']);
            if (serialField)
                payload[serialField] = data.serialNo || '';
            const priorityField = getInternalName(['Priority']);
            if (priorityField)
                payload[priorityField] = data.priority || 'Medium';
            const dateField = getInternalName(['Raised Date', 'RaisedDate', 'Requested Date', 'RequestedDate', 'Reported Date', 'ReportedDate']);
            if (dateField) {
                payload[dateField] = data.raisedDate || data.requiredDate || data.reportedDate || new Date().toISOString();
            }
            const reasonField = getInternalName(['Description', 'Reason for Request', 'ReasonforRequest', 'Reason', 'Issue Description', 'IssueDescription']);
            if (reasonField)
                payload[reasonField] = data.description || data.reasonDescription || data.issueDescription || '';
            const statusField = getInternalName(['Status', 'Request Status', 'RequestStatus']);
            if (statusField)
                payload[statusField] = data.status || 'Pending';
            const incidentTypeField = getInternalName(['Incident Type', 'IncidentType', 'Issue Type', 'IssueType']);
            if (incidentTypeField)
                payload[incidentTypeField] = data.incidentType || '';
            const raisedToField = getInternalName(['Raised To', 'RaisedTo']);
            if (raisedToField)
                payload[raisedToField] = data.raisedTo || '';
            return payload;
        }
        catch (error) {
            console.error("Could not map fields dynamically for list: " + listName, error);
            throw error;
        }
    }
    getLocalItems(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }
    saveLocalItems(key, items) {
        localStorage.setItem(key, JSON.stringify(items));
    }
    getEmployeeNameFromEmail(email) {
        const parts = email.split('@')[0].split('.');
        return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    }
    filterByUser(items, userEmail) {
        if (!items || !userEmail)
            return [];
        const emailPrefix = userEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        const userEmailClean = userEmail.toLowerCase().trim();
        return items.filter(item => {
            const empNameClean = (item.employeeName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const empIdClean = (item.employeeId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const empEmailClean = (item.employeeEmail || item.email || '').toLowerCase().trim();
            const empIdRaw = (item.employeeId || '').toLowerCase().trim();
            return empNameClean.includes(emailPrefix) || emailPrefix.includes(empNameClean) ||
                empIdClean.includes(emailPrefix) || emailPrefix.includes(empIdClean) ||
                empEmailClean === userEmailClean || empIdRaw === userEmailClean;
        });
    }
    async getMappedItems(fields, items) {
        const getInternalName = (displayNames) => {
            for (const name of displayNames) {
                const field = fields.find(f => f.Title && f.Title.toLowerCase() === name.toLowerCase());
                if (field)
                    return field.InternalName;
            }
            return null;
        };
        const empIdField = getInternalName(['Employe ID', 'Employee ID', 'EmployeeId', 'EmployeID']);
        const emailField = getInternalName(['Employee Email', 'Email', 'Email ID', 'EmailID', 'User Email', 'UserEmail']);
        const assetTypeField = getInternalName(['Asset Type', 'AssetType', 'Asset Name', 'AssetName']);
        const serialField = getInternalName(['Serial Number', 'SerialNumber', 'Serial No', 'SerialNo']);
        const priorityField = getInternalName(['Priority']);
        const dateField = getInternalName(['Raised Date', 'RaisedDate', 'Requested Date', 'RequestedDate', 'Reported Date', 'ReportedDate']);
        const reasonField = getInternalName(['Description', 'Reason for Request', 'ReasonforRequest', 'Reason', 'Issue Description', 'IssueDescription']);
        const statusField = getInternalName(['Status', 'Request Status', 'RequestStatus']);
        const incidentTypeField = getInternalName(['Incident Type', 'IncidentType', 'Issue Type', 'IssueType']);
        const raisedToField = getInternalName(['Raised To', 'RaisedTo']);
        const empNameField = getInternalName(['Employe Name', 'Employee Name', 'EmployeeName', 'EmployeName']);
        return items.map(item => ({
            id: item.Id ? item.Id.toString() : item.ID ? item.ID.toString() : Math.random().toString(),
            employeeName: empNameField && item[empNameField] ? item[empNameField] : (item.Title || 'Unknown'),
            employeeId: empIdField && item[empIdField] ? item[empIdField] : '',
            employeeEmail: emailField && item[emailField] ? item[emailField] : '',
            serialNo: serialField && item[serialField] ? item[serialField] : '',
            assetName: assetTypeField && item[assetTypeField] ? item[assetTypeField] : '',
            priority: priorityField && item[priorityField] ? item[priorityField] : 'Medium',
            reason: reasonField && item[reasonField] ? item[reasonField] : '',
            description: reasonField && item[reasonField] ? item[reasonField] : '',
            requestDate: dateField && item[dateField] ? item[dateField] : '',
            reportedDate: dateField && item[dateField] ? item[dateField] : '',
            raisedDate: dateField && item[dateField] ? item[dateField] : '',
            issueType: incidentTypeField && item[incidentTypeField] ? item[incidentTypeField] : 'Incident',
            incidentType: incidentTypeField && item[incidentTypeField] ? item[incidentTypeField] : '',
            issueDescription: reasonField && item[reasonField] ? item[reasonField] : '',
            incidentId: `INC-${item.Id || item.ID || Math.floor(Math.random() * 1000)}`,
            status: statusField && item[statusField] ? item[statusField] : 'Pending',
            raisedTo: raisedToField && item[raisedToField] ? item[raisedToField] : ''
        }));
    }
    async getMappedAssignedAssets(fields, items) {
        const getInternalName = (displayNames) => {
            for (const name of displayNames) {
                const field = fields.find(f => f.Title && f.Title.toLowerCase() === name.toLowerCase());
                if (field)
                    return field.InternalName;
            }
            return null;
        };
        const empIdField = getInternalName(['Employe ID', 'Employee ID', 'EmployeeId', 'EmployeID']);
        const emailField = getInternalName(['Employee Email', 'Email', 'Email ID', 'EmailID', 'User Email', 'UserEmail']);
        const assetTypeField = getInternalName(['Asset Type', 'AssetType', 'Asset Name', 'AssetName']);
        const serialField = getInternalName(['Serial Number', 'SerialNumber', 'Serial No', 'SerialNo']);
        const dateField = getInternalName(['Assigned Date', 'AssignedDate', 'Requested Date', 'RequestedDate']);
        const statusField = getInternalName(['Status', 'Assignment Status', 'AssignmentStatus']);
        const empNameField = getInternalName(['Employe Name', 'Employee Name', 'EmployeeName', 'EmployeName']);
        return items.map(item => ({
            id: item.Id ? item.Id.toString() : item.ID ? item.ID.toString() : Math.random().toString(),
            employeeName: empNameField && item[empNameField] ? item[empNameField] : (item.Title || 'Unknown'),
            employeeId: empIdField && item[empIdField] ? item[empIdField] : '',
            employeeEmail: emailField && item[emailField] ? item[emailField] : '',
            assetType: assetTypeField && item[assetTypeField] ? item[assetTypeField] : 'Device',
            assetName: assetTypeField && item[assetTypeField] ? item[assetTypeField] : 'Device',
            serialNumber: serialField && item[serialField] ? item[serialField] : '',
            assignmentDate: dateField && item[dateField] ? item[dateField] : item.Created || new Date().toISOString(),
            status: statusField && item[statusField] ? item[statusField] : 'Assigned',
            condition: 'Good',
            location: 'HQ Office'
        }));
    }
    async getEmployeeIncidentHistory(userEmail, isAdmin) {
        let incidentItems = [];
        // 1. Load standard incidents
        try {
            console.log(`[SharePoint IncidentList Read] Fetching incident history for: ${userEmail}, isAdmin: ${isAdmin}`);
            const fields = await this.sp.web.lists.getByTitle(this.incidentListName).fields();
            const items = await this.sp.web.lists.getByTitle(this.incidentListName).items();
            const mapped = await this.getMappedItems(fields, items);
            // Filter out replacements and specific items from standard incident history
            incidentItems = (isAdmin ? mapped : this.filterByUser(mapped, userEmail))
                .filter(item => item.incidentType !== 'Replacement Request' &&
                item.issueType !== 'Replacement Request' &&
                item.id !== '384' &&
                item.id !== '976' &&
                item.id !== '166' &&
                item.id !== '369' &&
                item.id !== '859' &&
                item.incidentId !== 'INC-384' &&
                item.incidentId !== 'INC-976' &&
                item.incidentId !== 'INC-166' &&
                item.incidentId !== 'INC-369' &&
                item.incidentId !== 'INC-859');
        }
        catch (error) {
            console.warn('Failed to fetch standard incidents from SharePoint:', error.message);
        }
        // 2. Load local storage fallback items
        const localIncidents = this.getLocalItems('spfx_mock_incidents');
        const filteredLocalIncidents = (isAdmin ? localIncidents : this.filterByUser(localIncidents, userEmail))
            .filter(item => item.incidentType !== 'Replacement Request' &&
            item.issueType !== 'Replacement Request' &&
            item.id !== '384' &&
            item.id !== '976' &&
            item.id !== '166' &&
            item.id !== '369' &&
            item.id !== '859' &&
            item.incidentId !== 'INC-384' &&
            item.incidentId !== 'INC-976' &&
            item.incidentId !== 'INC-166' &&
            item.incidentId !== 'INC-369' &&
            item.incidentId !== 'INC-859');
        // Merge and sort chronologically (newest first)
        const combined = [
            ...incidentItems,
            ...filteredLocalIncidents
        ];
        combined.sort((a, b) => {
            const dateA = new Date(a.reportedDate || a.raisedDate || 0).getTime();
            const dateB = new Date(b.reportedDate || b.raisedDate || 0).getTime();
            return dateB - dateA;
        });
        return combined;
    }
    async getEmployeeReplacementHistory(userEmail, isAdmin) {
        let replacementItems = [];
        let historicalSharePointReplacements = [];
        // 1. Load replacements from Asset Replacements list
        try {
            console.log(`[SharePoint AssetReplacements Read] Fetching replacements history for: ${userEmail}, isAdmin: ${isAdmin}`);
            const list = await this.getReplacementList();
            const fields = await list.fields();
            const items = await list.items();
            const mapped = await this.getMappedItems(fields, items);
            const mappedWithTypes = mapped.map(item => ({
                ...item,
                incidentType: 'Replacement Request',
                issueType: 'Replacement Request',
                incidentId: item.incidentId ? item.incidentId.replace('INC-', 'REP-') : `REP-${item.Id || item.ID || Math.floor(Math.random() * 1000)}`
            }));
            replacementItems = isAdmin ? mappedWithTypes : this.filterByUser(mappedWithTypes, userEmail);
        }
        catch (error) {
            console.warn('Failed to fetch replacements from SharePoint:', error.message);
        }
        // 2. Load any historical replacements that were saved in the Incident List, including items 384, 976, 166, 369, 859
        try {
            const fields = await this.sp.web.lists.getByTitle(this.incidentListName).fields();
            const items = await this.sp.web.lists.getByTitle(this.incidentListName).items();
            const mapped = await this.getMappedItems(fields, items);
            historicalSharePointReplacements = (isAdmin ? mapped : this.filterByUser(mapped, userEmail))
                .filter(item => item.incidentType === 'Replacement Request' ||
                item.issueType === 'Replacement Request' ||
                item.id === '384' ||
                item.id === '976' ||
                item.id === '166' ||
                item.id === '369' ||
                item.id === '859' ||
                item.incidentId === 'INC-384' ||
                item.incidentId === 'INC-976' ||
                item.incidentId === 'INC-166' ||
                item.incidentId === 'INC-369' ||
                item.incidentId === 'INC-859')
                .map(item => ({
                ...item,
                incidentType: 'Replacement Request',
                issueType: 'Replacement Request',
                incidentId: item.incidentId ? item.incidentId.replace('INC-', 'REP-') : `REP-${item.Id || item.ID || Math.floor(Math.random() * 1000)}`
            }));
        }
        catch (error) {
            console.warn('Failed to fetch historical replacements from Incident List:', error.message);
        }
        // 3. Load local storage fallback items
        const localReplacements = this.getLocalItems('spfx_mock_replacements');
        const filteredLocalReplacements = (isAdmin ? localReplacements : this.filterByUser(localReplacements, userEmail))
            .map(item => ({
            ...item,
            incidentType: 'Replacement Request',
            issueType: 'Replacement Request',
            incidentId: item.incidentId ? item.incidentId.replace('INC-', 'REP-') : `REP-${item.Id || item.ID || Math.floor(Math.random() * 1000)}`
        }));
        // Merge and sort chronologically (newest first)
        const combined = [
            ...replacementItems,
            ...historicalSharePointReplacements,
            ...filteredLocalReplacements
        ];
        combined.sort((a, b) => {
            const dateA = new Date(a.reportedDate || a.raisedDate || 0).getTime();
            const dateB = new Date(b.reportedDate || b.raisedDate || 0).getTime();
            return dateB - dateA;
        });
        return combined;
    }
    async updateIncidentStatus(id, status, resolution) {
        try {
            console.log(`[IncidentService] Updating status of incident ${id} to: ${status}`);
            const isLocal = id.startsWith('INC-') || id.startsWith('REP-') || isNaN(Number(id));
            if (isLocal) {
                const isReplacement = id.startsWith('REP-');
                const localKey = isReplacement ? 'spfx_mock_replacements' : 'spfx_mock_incidents';
                const localItems = this.getLocalItems(localKey);
                const updated = localItems.map(item => {
                    if (item.id === id || item.incidentId === id) {
                        return {
                            ...item,
                            status,
                            resolution: resolution || item.resolution,
                            resolvedDate: status === 'Resolved' || status === 'Closed' ? new Date().toISOString() : item.resolvedDate
                        };
                    }
                    return item;
                });
                this.saveLocalItems(localKey, updated);
                return { success: true };
            }
            else {
                // Try standard list first, then replacement list
                try {
                    const list = this.sp.web.lists.getByTitle(this.incidentListName);
                    const fields = await list.fields();
                    const getFieldName = (displayNames) => {
                        for (const name of displayNames) {
                            const field = fields.find((f) => f.Title && f.Title.toLowerCase() === name.toLowerCase());
                            if (field)
                                return field.InternalName;
                        }
                        return null;
                    };
                    const statusField = getFieldName(['Status', 'Request Status', 'RequestStatus']) || 'Status';
                    const resolutionField = getFieldName(['Resolution', 'Resolution Summary', 'ResolutionDetails', 'ResolutionDescription']);
                    const resolvedDateField = getFieldName(['Resolved Date', 'ResolvedDate', 'Resolution Date', 'ResolutionDate']);
                    const payload = { [statusField]: status };
                    if (resolution && resolutionField) {
                        payload[resolutionField] = resolution;
                    }
                    if ((status === 'Resolved' || status === 'Closed') && resolvedDateField) {
                        payload[resolvedDateField] = new Date().toISOString();
                    }
                    const numericId = parseInt(id, 10);
                    const result = await list.items.getById(numericId).update(payload);
                    return result;
                }
                catch (standardError) {
                    console.log("Not in standard list, trying replacement list...");
                    const list = await this.getReplacementList();
                    const fields = await list.fields();
                    const getFieldName = (displayNames) => {
                        for (const name of displayNames) {
                            const field = fields.find((f) => f.Title && f.Title.toLowerCase() === name.toLowerCase());
                            if (field)
                                return field.InternalName;
                        }
                        return null;
                    };
                    const statusField = getFieldName(['Status', 'Request Status', 'RequestStatus']) || 'Status';
                    const resolutionField = getFieldName(['Resolution', 'Resolution Summary', 'ResolutionDetails', 'ResolutionDescription']);
                    const resolvedDateField = getFieldName(['Resolved Date', 'ResolvedDate', 'Resolution Date', 'ResolutionDate']);
                    const payload = { [statusField]: status };
                    if (resolution && resolutionField) {
                        payload[resolutionField] = resolution;
                    }
                    if ((status === 'Resolved' || status === 'Closed') && resolvedDateField) {
                        payload[resolvedDateField] = new Date().toISOString();
                    }
                    const numericId = parseInt(id, 10);
                    const result = await list.items.getById(numericId).update(payload);
                    return result;
                }
            }
        }
        catch (error) {
            console.warn('[IncidentService] Failed to update SharePoint list item status, using localStorage fallback:', error.message);
            for (const localKey of ['spfx_mock_incidents', 'spfx_mock_replacements']) {
                const localItems = this.getLocalItems(localKey);
                const updated = localItems.map(inc => {
                    if (inc.id === id || inc.incidentId === id) {
                        return {
                            ...inc,
                            status,
                            resolution: resolution || inc.resolution,
                            resolvedDate: status === 'Resolved' || status === 'Closed' ? new Date().toISOString() : inc.resolvedDate
                        };
                    }
                    return inc;
                });
                this.saveLocalItems(localKey, updated);
            }
            return { success: true };
        }
    }
    async getEmployeeAssignedAssets(userEmail) {
        try {
            console.log(`[IncidentService] Fetching assigned assets for: ${userEmail}`);
            // Resolve employee name from userEmail / EMPLOYEES
            const userEmailClean = userEmail.toLowerCase().trim();
            const employee = _data_mockData__WEBPACK_IMPORTED_MODULE_6__.EMPLOYEES.find(emp => emp.email.toLowerCase() === userEmailClean ||
                emp.name.toLowerCase() === userEmailClean ||
                emp.id.toLowerCase() === userEmailClean);
            const employeeName = employee ? employee.name : userEmail;
            const assignedAssets = [];
            const seenSerials = new Set();
            // Helper to normalize strings for comparison
            const normalize = (val) => (val || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const nameNorm = normalize(employeeName);
            const emailNorm = normalize(employee ? employee.email : userEmail);
            // 1. Attempt to fetch from InventoryList items (primary source of truth)
            try {
                const inventoryItems = await _InventoryService__WEBPACK_IMPORTED_MODULE_7__.InventoryService.getItems();
                if (inventoryItems && inventoryItems.length > 0) {
                    const matchedInventoryItems = inventoryItems.filter(item => {
                        const statusLower = (item.status || '').toLowerCase().trim();
                        if (statusLower === 'in stock' || statusLower === 'instock' || statusLower === 'available' || statusLower === 'returned' || statusLower === 'return approved' || statusLower === 'under maintenance' || statusLower === 'disposed' || statusLower === 'retired') {
                            return false;
                        }
                        const assignedNorm = normalize(item.assignedTo);
                        const isAssigned = assignedNorm && (assignedNorm === nameNorm || assignedNorm.includes(nameNorm) || nameNorm.includes(assignedNorm));
                        const isNoted = (item.note || '').toLowerCase().includes('assigned to:') && normalize(item.note).includes(nameNorm);
                        const isStatus = (item.status || '').toLowerCase().includes('assigned to:') && normalize(item.status).includes(nameNorm);
                        const isEmailMatch = emailNorm && ((assignedNorm && (assignedNorm === emailNorm || assignedNorm.includes(emailNorm) || emailNorm.includes(assignedNorm))) ||
                            ((item.note || '').toLowerCase().includes(emailNorm)));
                        return isAssigned || isNoted || isStatus || isEmailMatch;
                    });
                    matchedInventoryItems.forEach(item => {
                        const serial = (item.serialNumber || '').trim();
                        if (serial) {
                            seenSerials.add(serial.toLowerCase());
                        }
                        assignedAssets.push({
                            id: item.id,
                            employeeName: employeeName,
                            employeeId: employee ? employee.id : '',
                            employeeEmail: employee ? employee.email : '',
                            assetType: item.assetType || 'Device',
                            assetName: item.assetName || item.title || 'Device',
                            serialNumber: item.serialNumber || '',
                            assignmentDate: item.assignedDate || new Date().toISOString(),
                            status: item.status || 'Assigned',
                            condition: item.condition || 'Good',
                            location: 'HQ Office'
                        });
                    });
                }
            }
            catch (err) {
                console.warn('[IncidentService] Failed to fetch assets from InventoryList:', err);
            }
            // 2. Attempt to fetch from Mapping List (historical records / synced assignments)
            try {
                const mappingList = await _InventoryService__WEBPACK_IMPORTED_MODULE_7__.InventoryService.getMappingList();
                const fields = await mappingList.fields();
                const items = await mappingList.items();
                const mapped = await this.getMappedAssignedAssets(fields, items);
                const filtered = this.filterByUser(mapped, employeeName || userEmail);
                filtered.forEach(item => {
                    const serial = (item.serialNumber || '').trim();
                    if (serial && seenSerials.has(serial.toLowerCase())) {
                        return; // Skip duplicate
                    }
                    if (serial) {
                        seenSerials.add(serial.toLowerCase());
                    }
                    assignedAssets.push(item);
                });
            }
            catch (err) {
                console.warn('[IncidentService] Failed to fetch assets from Mapping List:', err);
            }
            // 3. Fallback: return mock assets ONLY if user is a known mock employee and has no assignments
            if (assignedAssets.length === 0 && employee) {
                console.log('[IncidentService] No assignments found, generating fallback mock assets for known employee:', employee.name);
                const mockAssets = [
                    {
                        id: `MOCK-MAP-${employee.id}-1`,
                        employeeName: employee.name,
                        employeeId: employee.id,
                        employeeEmail: employee.email,
                        assetType: 'Laptop',
                        assetName: employee.jobTitle === 'Admin' ? 'Dell XPS 15' : 'Dell Latitude 5420',
                        serialNumber: employee.jobTitle === 'Admin' ? 'DX15-9988' : 'DL5420-9831',
                        assignmentDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                        status: 'Assigned',
                        condition: 'Excellent',
                        location: 'Remote Work'
                    },
                    {
                        id: `MOCK-MAP-${employee.id}-2`,
                        employeeName: employee.name,
                        employeeId: employee.id,
                        employeeEmail: employee.email,
                        assetType: 'Headset',
                        assetName: 'Jabra Evolve 65',
                        serialNumber: 'JB65-3819',
                        assignmentDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                        status: 'Assigned',
                        condition: 'Good',
                        location: 'Remote Work'
                    }
                ];
                return mockAssets;
            }
            console.log(`[IncidentService] Found ${assignedAssets.length} assigned assets for user`);
            return assignedAssets;
        }
        catch (error) {
            console.error('[IncidentService] getEmployeeAssignedAssets major error:', error);
            return [];
        }
    }
    async createIncidentRequest(incidentData, file) {
        const isReplacement = incidentData.incidentType === 'Replacement Request' ||
            incidentData.issueType === 'Replacement Request' ||
            (incidentData.incidentType && incidentData.incidentType.toLowerCase().indexOf('replace') > -1) ||
            (incidentData.issueType && incidentData.issueType.toLowerCase().indexOf('replace') > -1);
        const targetListName = isReplacement ? this.replacementListName : this.incidentListName;
        try {
            if (isReplacement) {
                await this._ensureReplacementListFields();
            }
            const payload = await this.getMappedPayload(targetListName, { ...incidentData, status: 'Open' });
            console.log(`[SharePoint Write] TARGET LIST: "${targetListName}"`);
            console.log('[SharePoint Write] PAYLOAD DATA:', JSON.stringify(payload, null, 2));
            const list = isReplacement ? await this.getReplacementList() : this.sp.web.lists.getByTitle(this.incidentListName);
            const result = await list.items.add(payload);
            console.log('[SharePoint Write] RESPONSE:', result);
            return result;
        }
        catch (error) {
            console.error(`Failed to create request in SharePoint on ${targetListName}:`, error);
            const isForbiddenOrMissing = error.message && (error.message.indexOf('404') > -1 ||
                error.message.indexOf('does not exist') > -1 ||
                error.message.indexOf('ArgumentException') > -1 ||
                error.message.indexOf('403') > -1 ||
                error.message.indexOf('Unauthorized') > -1);
            if (isForbiddenOrMissing) {
                console.warn(`SharePoint list write failed, saving to localStorage instead.`);
                const localKey = isReplacement ? 'spfx_mock_replacements' : 'spfx_mock_incidents';
                const localItems = this.getLocalItems(localKey);
                const newRecord = {
                    id: isReplacement ? `REP-${Date.now()}` : `INC-${Date.now()}`,
                    incidentId: isReplacement ? `REP-${Math.floor(100 + Math.random() * 900)}` : `INC-${Math.floor(100 + Math.random() * 900)}`,
                    employeeName: incidentData.employeeName || 'Unknown',
                    employeeId: incidentData.employeeId || 'N/A',
                    employeeEmail: incidentData.employeeEmail || '',
                    serialNo: incidentData.serialNo || '',
                    assetName: incidentData.assetName || incidentData.assetType || 'Device',
                    priority: incidentData.priority || 'Medium',
                    reason: incidentData.description || incidentData.issueDescription || '',
                    description: incidentData.description || incidentData.issueDescription || '',
                    issueDescription: incidentData.description || incidentData.issueDescription || '',
                    requestDate: new Date().toISOString(),
                    reportedDate: new Date().toISOString(),
                    raisedDate: new Date().toISOString(),
                    incidentType: incidentData.incidentType || (isReplacement ? 'Replacement Request' : 'Other'),
                    status: 'Open',
                    raisedTo: incidentData.raisedTo || 'Admin'
                };
                localItems.push(newRecord);
                this.saveLocalItems(localKey, localItems);
                return { data: newRecord };
            }
            const errorDetails = this.formatError(error);
            throw new Error(`SharePoint list submission failed. ${errorDetails}`);
        }
    }
    async getEmployeeDetailsByName(employeeName) {
        try {
            console.log(`[SharePoint EmployeeList Read] Looking up employee by name: ${employeeName}`);
            const fields = await this.sp.web.lists.getByTitle(this.employeeListName).fields();
            const items = await this.sp.web.lists.getByTitle(this.employeeListName).items();
            const getInternalName = (displayNames) => {
                for (const name of displayNames) {
                    const field = fields.find(f => f.Title && f.Title.toLowerCase() === name.toLowerCase());
                    if (field)
                        return field.InternalName;
                }
                return null;
            };
            const empIdField = getInternalName(['Employee ID', 'EmployeeID', 'EmployeeId', 'Title']);
            const emailField = getInternalName(['Email', 'EmployeeEmail', 'UserEmail']);
            const deptField = getInternalName(['Department', 'Dept']);
            const nameField = getInternalName(['Employee Name', 'EmployeeName', 'Name', 'Title']);
            const employee = items.find(item => {
                const nameVal = nameField ? item[nameField] : null;
                return nameVal && nameVal.toString().trim().toLowerCase() === employeeName.trim().toLowerCase();
            });
            if (employee) {
                const result = {
                    employeeId: empIdField ? employee[empIdField] : employeeName,
                    employeeName: nameField && nameField !== empIdField ? employee[nameField] : (employee.Title || employeeName),
                    email: emailField ? employee[emailField] : (employee.Email || `${employeeName}@company.com`),
                    department: deptField ? employee[deptField] : 'General',
                };
                console.log('[SharePoint EmployeeList Read] Employee found by name:', result);
                return result;
            }
        }
        catch (error) {
            console.warn('SharePoint name lookup failed, attempting mock fallback:', error.message);
        }
        const mockUser = _data_mockData__WEBPACK_IMPORTED_MODULE_6__.EMPLOYEES.find(emp => emp.name.toLowerCase() === employeeName.trim().toLowerCase());
        if (mockUser) {
            console.log('[Mock Fallback] Employee found by name:', mockUser);
            return {
                employeeId: mockUser.id,
                employeeName: mockUser.name,
                email: mockUser.email,
                department: mockUser.department
            };
        }
        const defaultDetails = {
            employeeId: employeeName,
            employeeName: employeeName,
            email: `${employeeName.toLowerCase().replace(/\s+/g, '.')}@company.com`,
            department: 'General'
        };
        console.log('[Default Fallback] Using typed name directly:', defaultDetails);
        return defaultDetails;
    }
    formatError(error) {
        if (!error)
            return 'Unknown error';
        if (error.statusCode === 404) {
            return `SharePoint list not found. Ensure lists exist with correct titles.`;
        }
        if (error.statusCode === 403) {
            return `Access denied. Verify you have appropriate permissions.`;
        }
        if (error.message && typeof error.message === 'string') {
            if (error.message.includes('Failed to fetch')) {
                return 'Failed to fetch. If you are testing locally, ensure you are using the Hosted Workbench and NOT localhost.';
            }
            return error.message;
        }
        return JSON.stringify(error);
    }
}
IncidentService._replacementListFieldsEnsured = false;


/***/ }),

/***/ 29619:
/*!***********************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/services/InventoryService.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssetAssignmentService: () => (/* reexport safe */ _AssetAssignmentService__WEBPACK_IMPORTED_MODULE_2__.AssetAssignmentService),
/* harmony export */   AuditLogService: () => (/* reexport safe */ _AuditLogService__WEBPACK_IMPORTED_MODULE_4__.AuditLogService),
/* harmony export */   InventoryItemService: () => (/* reexport safe */ _InventoryItemService__WEBPACK_IMPORTED_MODULE_0__.InventoryItemService),
/* harmony export */   InventoryService: () => (/* binding */ InventoryService),
/* harmony export */   RequestService: () => (/* reexport safe */ _RequestService__WEBPACK_IMPORTED_MODULE_1__.RequestService),
/* harmony export */   ReturnRequestService: () => (/* reexport safe */ _ReturnRequestService__WEBPACK_IMPORTED_MODULE_3__.ReturnRequestService),
/* harmony export */   SharePointBaseService: () => (/* reexport safe */ _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_5__.SharePointBaseService)
/* harmony export */ });
/* harmony import */ var _InventoryItemService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./InventoryItemService */ 32974);
/* harmony import */ var _RequestService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RequestService */ 50764);
/* harmony import */ var _AssetAssignmentService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AssetAssignmentService */ 95576);
/* harmony import */ var _ReturnRequestService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ReturnRequestService */ 86382);
/* harmony import */ var _AuditLogService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AuditLogService */ 43584);
/* harmony import */ var _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./base/SharePointBaseService */ 93535);












class InventoryService {
    // InventoryItemService Methods
    static async getInventoryList() {
        return _InventoryItemService__WEBPACK_IMPORTED_MODULE_0__.InventoryItemService.getInventoryList();
    }
    static async getItems() {
        return _InventoryItemService__WEBPACK_IMPORTED_MODULE_0__.InventoryItemService.getItems();
    }
    static async addItem(item, userDisplayName) {
        return _InventoryItemService__WEBPACK_IMPORTED_MODULE_0__.InventoryItemService.addItem(item, userDisplayName);
    }
    static async deleteItem(id, itemTitle, userDisplayName) {
        return _InventoryItemService__WEBPACK_IMPORTED_MODULE_0__.InventoryItemService.deleteItem(id, itemTitle, userDisplayName);
    }
    static async updateAssetStatus(requestId, assetStatus, approverName, comment) {
        return _InventoryItemService__WEBPACK_IMPORTED_MODULE_0__.InventoryItemService.updateAssetStatus(requestId, assetStatus, approverName, comment);
    }
    // RequestService Methods
    static async getRequestList() {
        return _RequestService__WEBPACK_IMPORTED_MODULE_1__.RequestService.getRequestList();
    }
    static async addRequest(request, userDisplayName, userRole, isEmployeeUI) {
        return _RequestService__WEBPACK_IMPORTED_MODULE_1__.RequestService.addRequest(request, userDisplayName, userRole, isEmployeeUI);
    }
    static async getRequests() {
        return _RequestService__WEBPACK_IMPORTED_MODULE_1__.RequestService.getRequests();
    }
    static async updateRequestStatus(requestId, status, approverName, rejectionReason) {
        return _RequestService__WEBPACK_IMPORTED_MODULE_1__.RequestService.updateRequestStatus(requestId, status, approverName, rejectionReason);
    }
    static async getRequestHistoryById(requestLookupId) {
        return _RequestService__WEBPACK_IMPORTED_MODULE_1__.RequestService.getRequestHistoryById(requestLookupId);
    }
    // AssetAssignmentService Methods
    static async getMappingList() {
        return _AssetAssignmentService__WEBPACK_IMPORTED_MODULE_2__.AssetAssignmentService.getMappingList();
    }
    static async assignAssetsToEmployee(assetIds, employeeName, employeeEmail, adminName, employeeId, comment) {
        return _AssetAssignmentService__WEBPACK_IMPORTED_MODULE_2__.AssetAssignmentService.assignAssetsToEmployee(assetIds, employeeName, employeeEmail, adminName, employeeId, comment);
    }
    static async syncExistingAssignmentsToMappingList(adminName) {
        return _AssetAssignmentService__WEBPACK_IMPORTED_MODULE_2__.AssetAssignmentService.syncExistingAssignmentsToMappingList(adminName);
    }
    static async diagnoseMappingListFields() {
        return _AssetAssignmentService__WEBPACK_IMPORTED_MODULE_2__.AssetAssignmentService.diagnoseMappingListFields();
    }
    // ReturnRequestService Methods
    static async getReturnRequestList() {
        return _ReturnRequestService__WEBPACK_IMPORTED_MODULE_3__.ReturnRequestService.getReturnRequestList();
    }
    static async addReturnRequest(request, userDisplayName) {
        return _ReturnRequestService__WEBPACK_IMPORTED_MODULE_3__.ReturnRequestService.addReturnRequest(request, userDisplayName);
    }
    static async getReturnRequests() {
        return _ReturnRequestService__WEBPACK_IMPORTED_MODULE_3__.ReturnRequestService.getReturnRequests();
    }
    static async updateReturnRequestStatus(requestId, status, managerComment, approverName, finalCondition, adminComments, managerStatus, adminStatus) {
        return _ReturnRequestService__WEBPACK_IMPORTED_MODULE_3__.ReturnRequestService.updateReturnRequestStatus(requestId, status, managerComment, approverName, finalCondition, adminComments, managerStatus, adminStatus);
    }
    static async cleanupReturnApprovedAssets() {
        return _ReturnRequestService__WEBPACK_IMPORTED_MODULE_3__.ReturnRequestService.cleanupReturnApprovedAssets();
    }
    // AuditLogService Methods
    static async addAuditLog(log) {
        return _AuditLogService__WEBPACK_IMPORTED_MODULE_4__.AuditLogService.addAuditLog(log);
    }
    static async getAuditLogs() {
        return _AuditLogService__WEBPACK_IMPORTED_MODULE_4__.AuditLogService.getAuditLogs();
    }
    static async getFilteredAuditLogs(filters) {
        return _AuditLogService__WEBPACK_IMPORTED_MODULE_4__.AuditLogService.getFilteredAuditLogs(filters);
    }
    // SharePointBaseService Methods
    static async getListFieldsMetadata(list) {
        return _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_5__.SharePointBaseService.getListFieldsMetadata(list);
    }
    static translateSharePointError(error, payload, mapping) {
        return _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_5__.SharePointBaseService.translateSharePointError(error, payload, mapping);
    }
}


/***/ }),

/***/ 50764:
/*!*********************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/services/RequestService.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RequestService: () => (/* binding */ RequestService)
/* harmony export */ });
/* harmony import */ var _pnpjsConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../pnpjsConfig */ 17694);
/* harmony import */ var _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base/SharePointBaseService */ 93535);
/* harmony import */ var _AuditLogService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AuditLogService */ 43584);
/* harmony import */ var _EmailService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./EmailService */ 407);




class RequestService {
    static _normalizeRequestKey(input) {
        return (input || "").trim().toUpperCase();
    }
    static _buildRequestKeyFromItemId(itemId) {
        const raw = itemId.toString();
        const padded = ("000000" + raw).slice(-6);
        return `REQ-${padded}`;
    }
    static _resolveRequestKeyInternalName(fields) {
        const candidates = ["requestid", "requestkey", "request_x0020_id", "request_x0020_key", "request id"];
        for (const cand of candidates) {
            const field = fields.find((f) => {
                const internal = (f.InternalName || "").toLowerCase();
                const title = (f.Title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                const candNorm = cand.replace(/[^a-z0-9]/g, "");
                return internal === cand || internal.replace(/_x0020_/g, "") === candNorm || title === candNorm;
            });
            if (field) {
                return field.InternalName;
            }
        }
        return _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.REQUEST_KEY_INTERNAL_NAME;
    }
    static _extractRequestKey(item) {
        if (!item) {
            return "";
        }
        const candidates = ["requestkey", "requestid", "request_x0020_id", "request_x0020_key"];
        for (const key of Object.keys(item)) {
            const normalizedKey = key.toLowerCase().replace(/_x0020_/g, "");
            if (candidates.indexOf(normalizedKey) >= 0 && item[key]) {
                return RequestService._normalizeRequestKey(item[key].toString());
            }
        }
        if (item.ID) {
            return RequestService._buildRequestKeyFromItemId(parseInt(item.ID.toString(), 10));
        }
        return "";
    }
    static async getRequestList() {
        const sp = (0,_pnpjsConfig__WEBPACK_IMPORTED_MODULE_0__.getSP)();
        if (RequestService._resolvedRequestListName) {
            return sp.web.lists.getByTitle(RequestService._resolvedRequestListName);
        }
        try {
            const list = sp.web.lists.getByTitle(_base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.REQUEST_LIST_NAME);
            await list.select("Title")(); // Verify list exists
            // eslint-disable-next-line require-atomic-updates
            RequestService._resolvedRequestListName = _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.REQUEST_LIST_NAME;
            return list;
        }
        catch (e) {
            try {
                const fallbackName = "Request List";
                const list = sp.web.lists.getByTitle(fallbackName);
                await list.select("Title")(); // Verify fallback exists
                console.log("Resolved requests list name dynamically to fallback: " + fallbackName);
                // eslint-disable-next-line require-atomic-updates
                RequestService._resolvedRequestListName = fallbackName;
                return list;
            }
            catch (e2) {
                try {
                    const allLists = await sp.web.lists.select("Title")();
                    const listNames = allLists.map(l => '"' + l.Title + '"').join(', ');
                    throw new Error("List '" + _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.REQUEST_LIST_NAME + "' or 'Request List' does not exist on this SharePoint site. Available lists are: [ " + listNames + " ].");
                }
                catch (listsError) {
                    throw new Error("List '" + _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.REQUEST_LIST_NAME + "' or 'Request List' does not exist.");
                }
            }
        }
    }
    static async _updateMissingRequestKeys(list, resolvedKeyName, items) {
        for (const item of items) {
            try {
                const itemId = parseInt(item.ID.toString(), 10);
                if (!Number.isNaN(itemId)) {
                    const requestKey = RequestService._buildRequestKeyFromItemId(itemId);
                    await list.items.getById(itemId).update({
                        [resolvedKeyName]: requestKey
                    });
                    console.log(`Successfully populated Request ID in SharePoint for item ${itemId}: ${requestKey}`);
                }
            }
            catch (err) {
                console.warn(`Failed to update missing Request ID for item ${item.ID}:`, err);
            }
        }
    }
    static async _ensureRequestWorkflowFields() {
        if (RequestService._requestWorkflowFieldsEnsured) {
            return;
        }
        RequestService._requestWorkflowFieldsEnsured = true;
        try {
            const list = await RequestService.getRequestList();
            const fields = await list.fields.select("InternalName", "Title", "TypeAsString")();
            const hasRequestStatus = fields.some(field => {
                const internalName = (field.InternalName || '').toString().toLowerCase();
                return internalName === _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME.toLowerCase();
            });
            const hasManagerComment = fields.some(field => {
                const internalName = (field.InternalName || '').toString().toLowerCase();
                return internalName === _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.REQUEST_COMMENT_INTERNAL_NAME.toLowerCase();
            });
            if (!hasRequestStatus) {
                try {
                    await list.fields.addChoice(_base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME, {
                        Choices: ["Pending", "Approved", "Rejected"],
                        FillInChoice: false
                    });
                }
                catch (err) {
                    console.warn("Could not auto-create RequestStatus field. Continuing.", err);
                }
            }
            if (!hasManagerComment) {
                try {
                    await list.fields.addMultilineText(_base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.REQUEST_COMMENT_INTERNAL_NAME);
                }
                catch (err) {
                    console.warn("Could not auto-create ManagerComment field. Continuing.", err);
                }
            }
            const hasRequestKey = fields.some(field => {
                const name = (field.InternalName || '').toString().toLowerCase();
                const title = (field.Title || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
                return name === 'requestkey' || name === 'requestid' || name === 'request_x0020_id' || title === 'requestid' || title === 'requestkey';
            });
            if (!hasRequestKey) {
                try {
                    await list.fields.addText(_base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.REQUEST_KEY_INTERNAL_NAME);
                }
                catch (err) {
                    console.warn("Could not auto-create RequestKey field. Continuing.", err);
                }
            }
            const hasAssetStatus = fields.some(field => {
                const internalName = (field.InternalName || '').toString().toLowerCase();
                return internalName === _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.ASSET_STATUS_INTERNAL_NAME.toLowerCase();
            });
            if (!hasAssetStatus) {
                try {
                    await list.fields.addChoice(_base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.ASSET_STATUS_INTERNAL_NAME, {
                        Choices: ["Pending", "Approved"],
                        FillInChoice: false
                    });
                }
                catch (err) {
                    console.warn("Could not auto-create AssetStatus field. Continuing.", err);
                }
            }
            const hasEmployeeIdField = fields.some(field => {
                const internalName = (field.InternalName || '').toString().toLowerCase();
                return internalName === 'employeeid' || internalName === 'employee_x0020_id';
            });
            if (!hasEmployeeIdField) {
                try {
                    await list.fields.addText('EmployeeID');
                }
                catch (err) {
                    console.warn("Could not auto-create EmployeeID field. Continuing.", err);
                }
            }
            const hasPriorityField = fields.some(field => {
                const internalName = (field.InternalName || '').toString().toLowerCase();
                return internalName === 'priority';
            });
            if (!hasPriorityField) {
                try {
                    await list.fields.addChoice('Priority', {
                        Choices: ["High", "Medium", "Low"],
                        FillInChoice: false
                    });
                }
                catch (err) {
                    console.warn("Could not auto-create Priority field. Continuing.", err);
                }
            }
        }
        catch (error) {
            // Non-admin users may not have schema permissions. Don't block request flows.
            console.warn("Could not ensure RequestList workflow fields. Continuing with fallback behavior.", error);
        }
    }
    static async addRequest(request, userDisplayName = "Unknown", userRole, isEmployeeUI) {
        const list = await RequestService.getRequestList();
        await RequestService._ensureRequestWorkflowFields();
        const initialStatus = request.status || "Pending";
        const sp = (0,_pnpjsConfig__WEBPACK_IMPORTED_MODULE_0__.getSP)();
        let requesterId = null;
        try {
            const user = await sp.web.ensureUser(request.requesterName);
            requesterId = user.data ? user.data.Id : user.Id;
        }
        catch (e) {
            console.warn("Could not resolve requester in SharePoint", e);
        }
        let dynamicPayload = null;
        try {
            const fields = await list.fields.select("InternalName", "Title", "TypeAsString", "Required")();
            const findField = (searchStr) => {
                let field = fields.find((f) => f.InternalName.toLowerCase() === searchStr.toLowerCase());
                if (field)
                    return field;
                field = fields.find((f) => f.InternalName.toLowerCase().replace(/_x0020_/g, '').indexOf(searchStr.toLowerCase()) >= 0);
                if (field)
                    return field;
                field = fields.find((f) => f.Title.toLowerCase().replace(/[^a-z0-9]/g, '').indexOf(searchStr.toLowerCase()) >= 0);
                return field;
            };
            const requesterField = findField("employee") || findField("requester");
            const assetField = findField("assettype") || findField("asset type") || findField("selectasset") || findField("asset") || findField("type");
            const quantityField = findField("quantity");
            const reasonField = findField("reason");
            const statusField = fields.find((f) => {
                const name = (f.InternalName || '').toLowerCase().replace(/_x0020_/g, '');
                const title = (f.Title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                return name === "requeststatus" || name === "status" || title === "requeststatus" || title === "status";
            });
            const employeeIdField = findField("employeeid") || findField("employee id") || findField("employee_x0020_id");
            const priorityField = findField("priority");
            const requestDateField = findField("requestdate") || findField("request date") || findField("requesteddate") || findField("requested date");
            const managerNameField = findField("managername") || findField("manager's name") || findField("managers name") || findField("manager_x0027_s_x0020_name") || findField("manager");
            dynamicPayload = {
                Title: `Request for ${request.assetTitle}`
            };
            if (requesterField) {
                const isPerson = requesterField.TypeAsString === "User" || requesterField.TypeAsString === "UserMulti";
                if (isPerson && requesterId !== null) {
                    dynamicPayload[`${requesterField.InternalName}Id`] = requesterId;
                }
                else {
                    dynamicPayload[requesterField.InternalName] = request.requesterName;
                }
            }
            if (assetField) {
                const isLookup = assetField.TypeAsString === "Lookup";
                if (isLookup) {
                    dynamicPayload[`${assetField.InternalName}Id`] = parseInt(request.assetId, 10) || 1;
                }
                else {
                    dynamicPayload[assetField.InternalName] = request.assetTitle;
                }
            }
            if (quantityField) {
                dynamicPayload[quantityField.InternalName] = request.quantity;
            }
            if (reasonField) {
                dynamicPayload[reasonField.InternalName] = request.reason || "";
            }
            if (statusField) {
                dynamicPayload[statusField.InternalName] = initialStatus;
            }
            else {
                dynamicPayload[_base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME] = initialStatus;
            }
            if (employeeIdField) {
                dynamicPayload[employeeIdField.InternalName] = request.employeeId || "";
            }
            if (priorityField) {
                dynamicPayload[priorityField.InternalName] = request.priority || "Medium";
            }
            if (requestDateField) {
                dynamicPayload[requestDateField.InternalName] = request.requestDate || new Date().toISOString().split('T')[0];
            }
            if (managerNameField) {
                dynamicPayload[managerNameField.InternalName] = request.managerName || "";
            }
        }
        catch (e) {
            console.warn("Failed to generate dynamic payload from schema, will use hardcoded candidates", e);
        }
        const payloads = [
            ...(dynamicPayload ? [dynamicPayload] : []),
            // 1. User's specific columns (Employee/Requester as Person/Lookup field)
            ...(requesterId !== null ? [
                {
                    Title: `Request for ${request.assetTitle}`,
                    EmployeeId: requesterId,
                    EmployeeID: request.employeeId || "",
                    ManagerName: request.managerName || "",
                    Manager_x0027_s_x0020_Name: request.managerName || "",
                    Manager_x0020_Name: request.managerName || "",
                    Manager: request.managerName || "",
                    Priority: request.priority || "Medium",
                    Asset_x0020_type: request.assetTitle,
                    Quantity: request.quantity,
                    Reason_x0020_for_x0020_Request: request.reason || "",
                    RequestStatus: initialStatus,
                    RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
                    Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
                },
                {
                    Title: `Request for ${request.assetTitle}`,
                    EmployeeId: requesterId,
                    EmployeeID: request.employeeId || "",
                    ManagerName: request.managerName || "",
                    Manager_x0027_s_x0020_Name: request.managerName || "",
                    Manager_x0020_Name: request.managerName || "",
                    Manager: request.managerName || "",
                    Priority: request.priority || "Medium",
                    Assettype: request.assetTitle,
                    Quantity: request.quantity,
                    ReasonforRequest: request.reason || "",
                    RequestStatus: initialStatus,
                    RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
                    Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
                },
                {
                    Title: `Request for ${request.assetTitle}`,
                    RequesterId: requesterId,
                    EmployeeID: request.employeeId || "",
                    ManagerName: request.managerName || "",
                    Manager_x0027_s_x0020_Name: request.managerName || "",
                    Manager_x0020_Name: request.managerName || "",
                    Manager: request.managerName || "",
                    Priority: request.priority || "Medium",
                    Asset_x0020_type: request.assetTitle,
                    Quantity: request.quantity,
                    Reason_x0020_for_x0020_Request: request.reason || "",
                    RequestStatus: initialStatus,
                    RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
                    Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
                },
                {
                    Title: `Request for ${request.assetTitle}`,
                    RequesterId: requesterId,
                    EmployeeID: request.employeeId || "",
                    ManagerName: request.managerName || "",
                    Manager_x0027_s_x0020_Name: request.managerName || "",
                    Manager_x0020_Name: request.managerName || "",
                    Manager: request.managerName || "",
                    Priority: request.priority || "Medium",
                    Assettype: request.assetTitle,
                    Quantity: request.quantity,
                    ReasonforRequest: request.reason || "",
                    RequestStatus: initialStatus,
                    RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
                    Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
                }
            ] : []),
            // 2. User's specific columns (Employee/Requester as plain Text field)
            {
                Title: `Request for ${request.assetTitle}`,
                Employee: request.requesterName,
                EmployeeID: request.employeeId || "",
                ManagerName: request.managerName || "",
                Manager_x0027_s_x0020_Name: request.managerName || "",
                Manager_x0020_Name: request.managerName || "",
                Manager: request.managerName || "",
                Priority: request.priority || "Medium",
                Asset_x0020_type: request.assetTitle,
                Quantity: request.quantity,
                Reason_x0020_for_x0020_Request: request.reason || "",
                RequestStatus: initialStatus,
                RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
                Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
            },
            {
                Title: `Request for ${request.assetTitle}`,
                Employee: request.requesterName,
                EmployeeID: request.employeeId || "",
                Priority: request.priority || "Medium",
                Assettype: request.assetTitle,
                Quantity: request.quantity,
                ReasonforRequest: request.reason || "",
                RequestStatus: initialStatus,
                RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
                Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
            },
            {
                Title: `Request for ${request.assetTitle}`,
                Requester: request.requesterName,
                EmployeeID: request.employeeId || "",
                Priority: request.priority || "Medium",
                Asset_x0020_type: request.assetTitle,
                Quantity: request.quantity,
                Reason_x0020_for_x0020_Request: request.reason || "",
                RequestStatus: initialStatus,
                RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
                Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
            },
            {
                Title: `Request for ${request.assetTitle}`,
                Requester: request.requesterName,
                EmployeeID: request.employeeId || "",
                Priority: request.priority || "Medium",
                Assettype: request.assetTitle,
                Quantity: request.quantity,
                ReasonforRequest: request.reason || "",
                RequestStatus: initialStatus,
                RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
                Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
            },
            // 3. Fallbacks
            {
                Title: `Request for ${request.assetTitle}`,
                Employee: request.requesterName,
                EmployeeID: request.employeeId || "",
                Priority: request.priority || "Medium",
                SelectAsset: request.assetTitle,
                Quantity: request.quantity,
                ReasonforRequest: request.reason || "",
                RequestStatus: initialStatus,
                RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
                Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
            },
            {
                Title: `Request for ${request.assetTitle}`,
                Employee: request.requesterName,
                EmployeeID: request.employeeId || "",
                Priority: request.priority || "Medium",
                Select_x0020_Asset: request.assetTitle,
                Quantity: request.quantity,
                Reason_x0020_for_x0020_Request: request.reason || "",
                RequestStatus: initialStatus,
                RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
                Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
            },
            {
                Title: `Request for ${request.assetTitle}`,
                Employee: request.requesterName,
                EmployeeID: request.employeeId || "",
                Priority: request.priority || "Medium",
                Quantity: request.quantity,
                ReasonforRequest: request.reason || "",
                RequestStatus: initialStatus,
                RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
                Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
            }
        ];
        let addedRequest;
        let success = false;
        let lastError;
        for (const payload of payloads) {
            try {
                addedRequest = await list.items.add(payload);
                success = true;
                break; // Success, stop looping immediately!
            }
            catch (err) {
                lastError = err;
            }
        }
        if (!success) {
            // localStorage Fallback logic
            const localRequestKey = `REQ-LOCAL-${Date.now().toString(36).toUpperCase()}`;
            const localRequest = {
                id: localRequestKey,
                requestKey: localRequestKey,
                requesterName: request.requesterName,
                employeeId: request.employeeId || "",
                managerName: request.managerName || "",
                assetId: request.assetId || "",
                assetTitle: request.assetTitle,
                assetName: request.assetTitle,
                priority: request.priority || "Medium",
                quantity: request.quantity,
                status: initialStatus,
                assetStatus: "Pending",
                requestDate: request.requestDate || new Date().toISOString().split('T')[0],
                reason: request.reason || "",
                managerResponse: ""
            };
            try {
                const local = localStorage.getItem("inventory_requests");
                const listItems = local ? JSON.parse(local) : [];
                listItems.push(localRequest);
                localStorage.setItem("inventory_requests", JSON.stringify(listItems));
            }
            catch (e) {
                console.error("Local storage save failed for request", e);
            }
            try {
                await _AuditLogService__WEBPACK_IMPORTED_MODULE_2__.AuditLogService.addAuditLog({
                    title: `Created Local Request ${localRequestKey} for Asset: ${request.assetTitle}`,
                    action: 'Create',
                    entityType: 'Request',
                    entityId: localRequestKey,
                    details: JSON.stringify({
                        requestKey: localRequestKey,
                        lifecycle: "Submitted (Local Fallback)",
                        requesterName: request.requesterName,
                        assetTitle: request.assetTitle,
                        quantity: request.quantity,
                        reason: request.reason || "",
                        requestedAt: new Date().toISOString()
                    }),
                    user: userDisplayName
                });
            }
            catch (auditErr) {
                console.warn("Failed to add audit log for local fallback request:", auditErr);
            }
            return;
        }
        // Safely perform post-save actions (key generation, updating, logging) outside the creation loop
        try {
            const requestItemId = (addedRequest && addedRequest.data && addedRequest.data.Id)
                ? parseInt(addedRequest.data.Id.toString(), 10)
                : (addedRequest && addedRequest.Id)
                    ? parseInt(addedRequest.Id.toString(), 10)
                    : NaN;
            const requestKey = Number.isNaN(requestItemId)
                ? `REQ-${Date.now().toString(36).toUpperCase()}`
                : RequestService._buildRequestKeyFromItemId(requestItemId);
            if (!Number.isNaN(requestItemId)) {
                try {
                    const requestListInstance = await RequestService.getRequestList();
                    const fields = await requestListInstance.fields.select("InternalName", "Title")();
                    const resolvedKeyName = RequestService._resolveRequestKeyInternalName(fields);
                    await requestListInstance.items.getById(requestItemId)
                        .update({
                        [resolvedKeyName]: requestKey,
                        [_base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.ASSET_STATUS_INTERNAL_NAME]: "Pending"
                    });
                }
                catch (err) {
                    console.warn(`Could not persist RequestKey for request item ${requestItemId}.`, err);
                }
            }
            // Log the event
            await _AuditLogService__WEBPACK_IMPORTED_MODULE_2__.AuditLogService.addAuditLog({
                title: `Created Request ${requestKey} for Asset: ${request.assetTitle}`,
                action: 'Create',
                entityType: 'Request',
                entityId: requestKey,
                details: JSON.stringify({
                    requestKey,
                    lifecycle: "Submitted",
                    requesterName: request.requesterName,
                    assetTitle: request.assetTitle,
                    quantity: request.quantity,
                    reason: request.reason || "",
                    requestedAt: new Date().toISOString()
                }),
                user: userDisplayName
            });
            // Trigger Email Notification to Manager (only from Admin UI, and NOT when requested from Employee UI)
            if (userRole === 'Admin' && !isEmployeeUI) {
                // Run email sending asynchronously so it does not block or disturb the asset request creation flow
                Promise.resolve().then(async () => {
                    try {
                        let liveManagerEmail = "";
                        try {
                            const resolvedEmail = await _EmailService__WEBPACK_IMPORTED_MODULE_3__.EmailService.resolveLiveManagerEmail(request.requesterName);
                            if (resolvedEmail) {
                                liveManagerEmail = resolvedEmail;
                            }
                        }
                        catch (resolveErr) {
                            console.warn("Failed to resolve live manager email:", resolveErr);
                        }
                        await _EmailService__WEBPACK_IMPORTED_MODULE_3__.EmailService.sendApprovalRequestToManager({
                            requestKey,
                            employeeName: request.requesterName,
                            assetName: request.assetTitle,
                            requestDate: request.requestDate || new Date().toLocaleDateString(),
                            adminName: userDisplayName
                        }, liveManagerEmail || undefined);
                    }
                    catch (mailErr) {
                        console.warn("Failed to send approval request email in background:", mailErr);
                    }
                }).catch(err => {
                    console.warn("Unhandled error in background email generation:", err);
                });
            }
        }
        catch (postError) {
            console.warn("Failed in post-request creation steps:", postError);
        }
    }
    static async getRequests() {
        let mapped = [];
        try {
            await RequestService._ensureRequestWorkflowFields();
            const list = await RequestService.getRequestList();
            const fields = await list.fields.select("InternalName", "Title", "TypeAsString")();
            const items = await _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService._fetchItemsWithExpandedUsers(list);
            const findFieldInternalName = (searchStr, fallback) => {
                let field = fields.find((f) => f.InternalName.toLowerCase() === searchStr.toLowerCase());
                if (field)
                    return field.InternalName;
                field = fields.find((f) => f.InternalName.toLowerCase().replace(/_x0020_/g, '').indexOf(searchStr.toLowerCase()) >= 0);
                if (field)
                    return field.InternalName;
                field = fields.find((f) => f.Title.toLowerCase().replace(/[^a-z0-9]/g, '').indexOf(searchStr.toLowerCase()) >= 0);
                return field ? field.InternalName : fallback;
            };
            const employeeKey = findFieldInternalName("employee", "Employee");
            const requesterKey = findFieldInternalName("requester", "Requester");
            const selectAssetKey = findFieldInternalName("assettype", "SelectAsset");
            const quantityKey = findFieldInternalName("quantity", "Quantity");
            const reasonKey = findFieldInternalName("reason", "ReasonforRequest");
            const managerCommentKey = findFieldInternalName("managercomment", "ManagerComment");
            const assetStatusKey = findFieldInternalName("assetstatus", "AssetStatus");
            const statusKey = findFieldInternalName("requeststatus", "RequestStatus");
            const employeeIdKey = findFieldInternalName("employeeid", "EmployeeID");
            const priorityKey = findFieldInternalName("priority", "Priority");
            const requestDateKey = findFieldInternalName("requestdate", "RequestDate");
            const managerNameKey = findFieldInternalName("managername", "ManagerName");
            const resolvedKeyName = RequestService._resolveRequestKeyInternalName(fields);
            mapped = items.map((item) => {
                const rawStatus = item[statusKey] || item.Status || 'Pending';
                const normalizedStatus = (rawStatus || '').toString().toLowerCase();
                const status = (normalizedStatus.includes('approv')) ? 'Approved' :
                    (normalizedStatus.includes('declin') || normalizedStatus.includes('reject')) ? 'Declined' :
                        'Pending';
                const requestKey = item[resolvedKeyName] || RequestService._extractRequestKey(item);
                return {
                    id: item.ID ? item.ID.toString() : Math.random().toString(36).substr(2, 9),
                    requestKey: requestKey || (item.ID ? RequestService._buildRequestKeyFromItemId(parseInt(item.ID.toString(), 10)) : ""),
                    requesterName: (() => {
                        const rawEmp = item[employeeKey] || item[requesterKey] || item.Employee || item.Author;
                        if (!rawEmp)
                            return item.Title || "";
                        if (typeof rawEmp === 'string')
                            return rawEmp;
                        if (Array.isArray(rawEmp))
                            return rawEmp.map((a) => a.Title || a.Name || "").join(', ');
                        if (typeof rawEmp === 'object')
                            return rawEmp.Title || rawEmp.Name || JSON.stringify(rawEmp);
                        return rawEmp.toString();
                    })(),
                    employeeId: item[employeeIdKey] || "",
                    managerName: item[managerNameKey] || item.ManagerName || item.Manager_x0020_Name || item.Manager || "",
                    assetId: "",
                    assetTitle: item[selectAssetKey] || item.Title || "",
                    assetName: "",
                    priority: item[priorityKey] || "Medium",
                    quantity: parseInt(item[quantityKey]) || 1,
                    status,
                    assetStatus: ((item[assetStatusKey] || "Pending").toString().toLowerCase().includes("approv") ? "Approved" : "Pending"),
                    managerResponse: item[managerCommentKey] || "",
                    requestDate: item[requestDateKey] ? item[requestDateKey].split('T')[0] : (item.Created ? item.Created.split('T')[0] : new Date().toISOString().split('T')[0]),
                    reason: item[reasonKey] || ""
                };
            });
            const itemsToUpdate = items.filter((item) => !item[resolvedKeyName] && item.ID);
            if (itemsToUpdate.length > 0) {
                RequestService._updateMissingRequestKeys(list, resolvedKeyName, itemsToUpdate).catch(err => {
                    console.warn("Background update of missing RequestKeys failed:", err);
                });
            }
            return mapped;
        }
        catch (error) {
            console.warn("Error fetching requests from SharePoint, falling back to local storage items:", error);
        }
        try {
            const local = localStorage.getItem("inventory_requests");
            if (local) {
                const localRequests = JSON.parse(local);
                return [...localRequests, ...mapped];
            }
        }
        catch (e) {
            console.error("Failed to parse local requests from localStorage:", e);
        }
        return mapped;
    }
    static async updateRequestStatus(requestId, status, approverName = 'Unknown', rejectionReason) {
        try {
            await RequestService._ensureRequestWorkflowFields();
            if (Number.isNaN(requestId)) {
                throw new Error('Invalid request ID');
            }
            const list = await RequestService.getRequestList();
            const item = await list.items.getById(requestId).select("*")();
            const keys = Object.keys(item || {});
            const findKey = (searchStr) => {
                const nonIdMatch = keys.find(k => {
                    const kl = k.toLowerCase().replace(/_x0020_/g, '');
                    return kl.indexOf(searchStr) >= 0 && !kl.endsWith("id");
                });
                if (nonIdMatch)
                    return nonIdMatch;
                return keys.find(k => k.toLowerCase().replace(/_x0020_/g, '').indexOf(searchStr) >= 0);
            };
            const fields = await list.fields.select("InternalName", "Title", "TypeAsString", "Choices")();
            const statusField = fields.find(field => {
                const internalNameRaw = (field.InternalName || '').toString();
                const internalName = internalNameRaw.toLowerCase();
                const title = (field.Title || '').toLowerCase();
                const normalizedInternal = internalName.replace(/_x0020_/g, '');
                const isModerationField = internalName.includes('moderation');
                const isBusinessStatusField = normalizedInternal === 'status' || title.trim() === 'status';
                return isBusinessStatusField && !isModerationField;
            });
            const statusKeyFromItem = keys.find(key => _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService._isBusinessStatusKey(key));
            const statusKey = statusKeyFromItem || statusField?.InternalName || _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME;
            if (!statusKey) {
                throw new Error('Could not find request status column. Please create a Choice column like RequestStatus/Status in RequestList.');
            }
            if (!_base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService._isBusinessStatusKey(statusKey)) {
                throw new Error('Detected non-business status field. Please ensure RequestList has a dedicated request status column.');
            }
            const reasonKey = findKey("managercomment") || _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.REQUEST_COMMENT_INTERNAL_NAME || findKey("rejectionreason") || findKey("comments") || findKey("reason");
            const rawChoices = statusField?.Choices;
            const choices = Array.isArray(rawChoices)
                ? rawChoices
                : (rawChoices && Array.isArray(rawChoices.results) ? rawChoices.results : []);
            const pickChoice = (preferred, fallback) => {
                if (!choices.length) {
                    return fallback;
                }
                const lowerChoices = choices.map(choice => (choice || '').toString().toLowerCase());
                for (const preferredValue of preferred) {
                    const preferredLower = preferredValue.toLowerCase();
                    for (let i = 0; i < lowerChoices.length; i++) {
                        if (lowerChoices[i].includes(preferredLower) || preferredLower.includes(lowerChoices[i])) {
                            return choices[i];
                        }
                    }
                }
                return fallback;
            };
            const statusValue = status === 'Declined'
                ? pickChoice(['rejected', 'declined'], 'Rejected')
                : pickChoice(['approved'], 'Approved');
            const requestKey = RequestService._extractRequestKey(item);
            const basePayload = {};
            basePayload[statusKey] = statusValue;
            if (reasonKey) {
                basePayload[reasonKey] = status === 'Declined'
                    ? (rejectionReason || 'Rejected by manager')
                    : `Approved by ${approverName}`;
            }
            await list.items.getById(requestId).update(basePayload);
            await _AuditLogService__WEBPACK_IMPORTED_MODULE_2__.AuditLogService.addAuditLog({
                title: `${statusValue} Request ${requestKey || `#${requestId}`}`,
                action: 'Update',
                entityType: 'Request',
                entityId: requestKey || requestId.toString(),
                details: JSON.stringify({
                    requestKey: requestKey || RequestService._buildRequestKeyFromItemId(requestId),
                    lifecycle: statusValue,
                    changedBy: approverName,
                    changedAt: new Date().toISOString(),
                    rejectionReason: status === 'Declined' ? (rejectionReason || "") : "",
                    assetAllocation: status === 'Approved'
                        ? {
                            assetTitle: item[findKey("assettype") || findKey("selectasset") || findKey("type") || "SelectAsset"] || item.Title || "",
                            quantity: parseInt(item[findKey("quantity") || "Quantity"], 10) || 1
                        }
                        : undefined
                }),
                user: approverName
            });
            // Trigger Email Notification to Admin on Approval
            if (status === 'Approved') {
                try {
                    const selectAssetKey = findKey("assettype") || findKey("selectasset") || findKey("type") || "SelectAsset";
                    const employeeKey = findKey("employee") || findKey("requester") || "Employee";
                    const requesterKey = findKey("requester") || "Requester";
                    const rawEmp = item[employeeKey] || item[requesterKey] || item.Employee || item.Title || "Employee";
                    const employeeName = typeof rawEmp === 'string' ? rawEmp : (rawEmp && rawEmp.Title ? rawEmp.Title : "Employee");
                    await _EmailService__WEBPACK_IMPORTED_MODULE_3__.EmailService.sendApprovalConfirmationToAdmin({
                        requestKey: requestKey || RequestService._buildRequestKeyFromItemId(requestId),
                        employeeName,
                        assetName: item[selectAssetKey] || item.Title || "Asset",
                        approvedBy: approverName,
                        approvalDate: new Date().toLocaleDateString()
                    });
                }
                catch (mailErr) {
                    console.warn("Failed to send approval confirmation email to Admins:", mailErr);
                }
            }
        }
        catch (error) {
            console.error(`Failed to update RequestList item ${requestId} status`, error);
            throw new Error(`Unable to update request status. ${error.message || 'Verify RequestList status column and choices.'}`);
        }
    }
    static async getRequestHistoryById(requestLookupId) {
        await RequestService._ensureRequestWorkflowFields();
        const normalizedRequestKey = RequestService._normalizeRequestKey(requestLookupId);
        if (!normalizedRequestKey) {
            throw new Error("Request ID is required.");
        }
        const reqList = await RequestService.getRequestList();
        let requestItems = [];
        try {
            const fields = await reqList.fields.select("InternalName", "Title")();
            const resolvedKeyName = RequestService._resolveRequestKeyInternalName(fields);
            requestItems = await reqList
                .items.select("*")
                .filter(`${resolvedKeyName} eq '${normalizedRequestKey.replace(/'/g, "''")}'`)();
        }
        catch (filterError) {
            console.warn("RequestKey filter failed. Falling back to item ID based lookup.", filterError);
        }
        if (!requestItems.length) {
            const derivedIdMatch = /^REQ-(\d{1,})$/.exec(normalizedRequestKey.replace(/^REQ-0*/, "REQ-"));
            const parsedId = derivedIdMatch ? parseInt(derivedIdMatch[1], 10) : NaN;
            if (!Number.isNaN(parsedId)) {
                try {
                    const requestById = await reqList
                        .items.getById(parsedId)
                        .select("*")();
                    requestItems = requestById ? [requestById] : [];
                }
                catch (err) {
                    console.warn(`Fallback ID lookup failed for ${normalizedRequestKey}.`, err);
                }
            }
        }
        if (!requestItems || requestItems.length === 0) {
            throw new Error(`No request found for ID ${normalizedRequestKey}`);
        }
        const requestItem = requestItems[0];
        const requests = await RequestService.getRequests();
        const request = requests.find(r => RequestService._normalizeRequestKey(r.requestKey) === normalizedRequestKey ||
            r.id === requestItem.ID?.toString());
        if (!request) {
            throw new Error(`Request exists but could not be mapped for ID ${normalizedRequestKey}`);
        }
        const requestIdAsString = requestItem.ID ? requestItem.ID.toString() : "";
        const allLogs = await _AuditLogService__WEBPACK_IMPORTED_MODULE_2__.AuditLogService.getAuditLogs();
        const lifecycle = allLogs
            .filter(log => log.entityType === "Request" && (RequestService._normalizeRequestKey(log.entityId) === normalizedRequestKey ||
            log.entityId === requestIdAsString ||
            ((log.details || "").toUpperCase().indexOf(`"REQUESTKEY":"${normalizedRequestKey}"`) >= 0)))
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        return {
            request,
            lifecycle
        };
    }
}
RequestService._resolvedRequestListName = null;
RequestService._requestWorkflowFieldsEnsured = false;


/***/ }),

/***/ 41094:
/*!*************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/utils/RoleUtils.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RoleUtils: () => (/* binding */ RoleUtils)
/* harmony export */ });
const RoleUtils = {
    getRoleLevel: (role) => {
        switch (role) {
            case 'Admin':
                return 2;
            case 'Inventory Manager':
                return 1;
            case 'Inventory Employee':
                return 0;
            default:
                return 0;
        }
    },
    canAddAssets: (role) => {
        return role === 'Admin' || role === 'Inventory Manager';
    },
    canApproveRequests: (role) => {
        return role === 'Inventory Manager' || role === 'Admin';
    },
    canViewAuditLogs: (role) => {
        return role === 'Admin' || role === 'Inventory Manager';
    },
    canAssignAssets: (role) => {
        return role === 'Admin' || role === 'Inventory Manager';
    },
    canManageUsers: (role) => {
        return role === 'Admin';
    },
    canAccessReports: (role) => {
        return role === 'Admin';
    },
    canAccessConfig: (role) => {
        return role === 'Admin';
    },
    isAdmin: (role) => {
        return role === 'Admin';
    },
    isManager: (role) => {
        return role === 'Inventory Manager';
    },
    isEmployee: (role) => {
        return role === 'Inventory Employee';
    },
    hasPermission: (role, minRequiredRole) => {
        return RoleUtils.getRoleLevel(role) >= RoleUtils.getRoleLevel(minRequiredRole);
    },
    getRoleDisplayName: (role) => {
        return role;
    }
};


/***/ }),

/***/ 878:
/*!************************************************!*\
  !*** ./node_modules/@pnp/sp/profiles/index.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Profiles: () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_1__.Profiles),
/* harmony export */   UrlZone: () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_1__.UrlZone)
/* harmony export */ });
/* harmony import */ var _fi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../fi.js */ 17066);
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types.js */ 19);



Reflect.defineProperty(_fi_js__WEBPACK_IMPORTED_MODULE_0__.SPFI.prototype, "profiles", {
    configurable: true,
    enumerable: true,
    get: function () {
        return this.create(_types_js__WEBPACK_IMPORTED_MODULE_1__.Profiles);
    },
});


/***/ }),

/***/ 19:
/*!************************************************!*\
  !*** ./node_modules/@pnp/sp/profiles/types.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Profiles: () => (/* binding */ Profiles),
/* harmony export */   UrlZone: () => (/* binding */ UrlZone),
/* harmony export */   _Profiles: () => (/* binding */ _Profiles)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 13759);
/* harmony import */ var _spqueryable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../spqueryable.js */ 96290);
/* harmony import */ var _pnp_queryable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/queryable */ 2464);
/* harmony import */ var _decorators_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../decorators.js */ 43445);
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @pnp/core */ 49671);





class _Profiles extends _spqueryable_js__WEBPACK_IMPORTED_MODULE_0__._SPInstance {
    /**
     * Creates a new instance of the UserProfileQuery class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this user profile query
     */
    constructor(baseUrl, path = "_api/sp.userprofiles.peoplemanager") {
        super(baseUrl, path);
        this.clientPeoplePickerQuery = (new ClientPeoplePickerQuery(baseUrl)).using((0,_pnp_core__WEBPACK_IMPORTED_MODULE_2__.AssignFrom)(this));
        this.profileLoader = (new ProfileLoader(baseUrl)).using((0,_pnp_core__WEBPACK_IMPORTED_MODULE_2__.AssignFrom)(this));
    }
    /**
     * The url of the edit profile page for the current user
     */
    getEditProfileLink() {
        return Profiles(this, "EditProfileLink")();
    }
    /**
     * A boolean value that indicates whether the current user's "People I'm Following" list is public
     */
    getIsMyPeopleListPublic() {
        return Profiles(this, "IsMyPeopleListPublic")();
    }
    /**
     * A boolean value that indicates whether the current user is being followed by the specified user
     *
     * @param loginName The account name of the user
     */
    amIFollowedBy(loginName) {
        const q = Profiles(this, "amifollowedby(@v)");
        q.query.set("@v", `'${loginName}'`);
        return q();
    }
    /**
     * A boolean value that indicates whether the current user is following the specified user
     *
     * @param loginName The account name of the user
     */
    amIFollowing(loginName) {
        const q = Profiles(this, "amifollowing(@v)");
        q.query.set("@v", `'${loginName}'`);
        return q();
    }
    /**
     * Gets tags that the current user is following
     *
     * @param maxCount The maximum number of tags to retrieve (default is 20)
     */
    getFollowedTags(maxCount = 20) {
        return Profiles(this, `getfollowedtags(${maxCount})`)();
    }
    /**
     * Gets the people who are following the specified user
     *
     * @param loginName The account name of the user
     */
    getFollowersFor(loginName) {
        const q = Profiles(this, "getfollowersfor(@v)");
        q.query.set("@v", `'${loginName}'`);
        return q();
    }
    /**
     * Gets the people who are following the current user
     *
     */
    get myFollowers() {
        return (0,_spqueryable_js__WEBPACK_IMPORTED_MODULE_0__.SPCollection)(this, "getmyfollowers");
    }
    /**
     * Gets user properties for the current user
     *
     */
    get myProperties() {
        return Profiles(this, "getmyproperties");
    }
    /**
     * Gets the people who the specified user is following
     *
     * @param loginName The account name of the user.
     */
    getPeopleFollowedBy(loginName) {
        const q = Profiles(this, "getpeoplefollowedby(@v)");
        q.query.set("@v", `'${loginName}'`);
        return q();
    }
    /**
     * Gets user properties for the specified user.
     *
     * @param loginName The account name of the user.
     */
    getPropertiesFor(loginName) {
        const q = Profiles(this, "getpropertiesfor(@v)");
        q.query.set("@v", `'${loginName}'`);
        return q();
    }
    /**
     * Gets the 20 most popular hash tags over the past week, sorted so that the most popular tag appears first
     *
     */
    get trendingTags() {
        const q = Profiles(this, null);
        q.concat(".gettrendingtags");
        return q();
    }
    /**
     * Gets the specified user profile property for the specified user
     *
     * @param loginName The account name of the user
     * @param propertyName The case-sensitive name of the property to get
     */
    getUserProfilePropertyFor(loginName, propertyName) {
        const q = Profiles(this, `getuserprofilepropertyfor(accountname=@v, propertyname='${propertyName}')`);
        q.query.set("@v", `'${loginName}'`);
        return q();
    }
    /**
     * Removes the specified user from the user's list of suggested people to follow
     *
     * @param loginName The account name of the user
     */
    hideSuggestion(loginName) {
        const q = Profiles(this, "hidesuggestion(@v)");
        q.query.set("@v", `'${loginName}'`);
        return (0,_spqueryable_js__WEBPACK_IMPORTED_MODULE_0__.spPost)(q);
    }
    /**
     * A boolean values that indicates whether the first user is following the second user
     *
     * @param follower The account name of the user who might be following the followee
     * @param followee The account name of the user who might be followed by the follower
     */
    isFollowing(follower, followee) {
        const q = Profiles(this, null);
        q.concat(".isfollowing(possiblefolloweraccountname=@v, possiblefolloweeaccountname=@y)");
        q.query.set("@v", `'${follower}'`);
        q.query.set("@y", `'${followee}'`);
        return q();
    }
    /**
     * Uploads and sets the user profile picture (Users can upload a picture to their own profile only). Not supported for batching.
     *
     * @param profilePicSource Blob data representing the user's picture in BMP, JPEG, or PNG format of up to 4.76MB
     */
    setMyProfilePic(profilePicSource) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const buffer = e.target.result;
                try {
                    await (0,_spqueryable_js__WEBPACK_IMPORTED_MODULE_0__.spPost)(Profiles(this, "setmyprofilepicture"), { body: buffer });
                    resolve();
                }
                catch (e) {
                    reject(e);
                }
            };
            reader.readAsArrayBuffer(profilePicSource);
        });
    }
    /**
     * Sets single value User Profile property
     *
     * @param accountName The account name of the user
     * @param propertyName Property name
     * @param propertyValue Property value
     */
    setSingleValueProfileProperty(accountName, propertyName, propertyValue) {
        return (0,_spqueryable_js__WEBPACK_IMPORTED_MODULE_0__.spPost)(Profiles(this, "SetSingleValueProfileProperty"), (0,_pnp_queryable__WEBPACK_IMPORTED_MODULE_1__.body)({
            accountName,
            propertyName,
            propertyValue,
        }));
    }
    /**
     * Sets multi valued User Profile property
     *
     * @param accountName The account name of the user
     * @param propertyName Property name
     * @param propertyValues Property values
     */
    setMultiValuedProfileProperty(accountName, propertyName, propertyValues) {
        return (0,_spqueryable_js__WEBPACK_IMPORTED_MODULE_0__.spPost)(Profiles(this, "SetMultiValuedProfileProperty"), (0,_pnp_queryable__WEBPACK_IMPORTED_MODULE_1__.body)({
            accountName,
            propertyName,
            propertyValues,
        }));
    }
    /**
     * Provisions one or more users' personal sites. (My Site administrator on SharePoint Online only)
     *
     * @param emails The email addresses of the users to provision sites for
     */
    createPersonalSiteEnqueueBulk(...emails) {
        return this.profileLoader.createPersonalSiteEnqueueBulk(emails);
    }
    /**
     * Gets the user profile of the site owner
     *
     */
    get ownerUserProfile() {
        return this.profileLoader.ownerUserProfile;
    }
    /**
     * Gets the user profile for the current user
     */
    get userProfile() {
        return this.profileLoader.userProfile;
    }
    /**
     * Enqueues creating a personal site for this user, which can be used to share documents, web pages, and other files
     *
     * @param interactiveRequest true if interactively (web) initiated request, or false (default) if non-interactively (client) initiated request
     */
    createPersonalSite(interactiveRequest = false) {
        return this.profileLoader.createPersonalSite(interactiveRequest);
    }
    /**
     * Sets the privacy settings for this profile
     *
     * @param share true to make all social data public; false to make all social data private
     */
    shareAllSocialData(share) {
        return this.profileLoader.shareAllSocialData(share);
    }
    /**
     * Resolves user or group using specified query parameters
     *
     * @param queryParams The query parameters used to perform resolve
     */
    clientPeoplePickerResolveUser(queryParams) {
        return this.clientPeoplePickerQuery.clientPeoplePickerResolveUser(queryParams);
    }
    /**
     * Searches for users or groups using specified query parameters
     *
     * @param queryParams The query parameters used to perform search
     */
    clientPeoplePickerSearchUser(queryParams) {
        return this.clientPeoplePickerQuery.clientPeoplePickerSearchUser(queryParams);
    }
}
const Profiles = (0,_spqueryable_js__WEBPACK_IMPORTED_MODULE_0__.spInvokableFactory)(_Profiles);
let ProfileLoader = class ProfileLoader extends _spqueryable_js__WEBPACK_IMPORTED_MODULE_0__._SPQueryable {
    /**
     * Provisions one or more users' personal sites. (My Site administrator on SharePoint Online only) Doesn't support batching
     *
     * @param emails The email addresses of the users to provision sites for
     */
    createPersonalSiteEnqueueBulk(emails) {
        return (0,_spqueryable_js__WEBPACK_IMPORTED_MODULE_0__.spPost)(ProfileLoaderFactory(this, "createpersonalsiteenqueuebulk"), (0,_pnp_queryable__WEBPACK_IMPORTED_MODULE_1__.body)({ "emailIDs": emails }));
    }
    /**
     * Gets the user profile of the site owner.
     *
     */
    get ownerUserProfile() {
        return (0,_spqueryable_js__WEBPACK_IMPORTED_MODULE_0__.spPost)(this.getParent(ProfileLoaderFactory, "_api/sp.userprofiles.profileloader.getowneruserprofile"));
    }
    /**
     * Gets the user profile of the current user.
     *
     */
    get userProfile() {
        return (0,_spqueryable_js__WEBPACK_IMPORTED_MODULE_0__.spPost)(ProfileLoaderFactory(this, "getuserprofile"));
    }
    /**
     * Enqueues creating a personal site for this user, which can be used to share documents, web pages, and other files.
     *
     * @param interactiveRequest true if interactively (web) initiated request, or false (default) if non-interactively (client) initiated request
     */
    createPersonalSite(interactiveRequest = false) {
        return (0,_spqueryable_js__WEBPACK_IMPORTED_MODULE_0__.spPost)(ProfileLoaderFactory(this, `getuserprofile/createpersonalsiteenque(${interactiveRequest})`));
    }
    /**
     * Sets the privacy settings for this profile
     *
     * @param share true to make all social data public; false to make all social data private.
     */
    shareAllSocialData(share) {
        return (0,_spqueryable_js__WEBPACK_IMPORTED_MODULE_0__.spPost)(ProfileLoaderFactory(this, `getuserprofile/shareallsocialdata(${share})`));
    }
};
ProfileLoader = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([
    (0,_decorators_js__WEBPACK_IMPORTED_MODULE_4__.defaultPath)("_api/sp.userprofiles.profileloader.getprofileloader")
], ProfileLoader);
const ProfileLoaderFactory = (baseUrl, path) => {
    return new ProfileLoader(baseUrl, path);
};
let ClientPeoplePickerQuery = class ClientPeoplePickerQuery extends _spqueryable_js__WEBPACK_IMPORTED_MODULE_0__._SPQueryable {
    /**
     * Resolves user or group using specified query parameters
     *
     * @param queryParams The query parameters used to perform resolve
     */
    async clientPeoplePickerResolveUser(queryParams) {
        const q = ClientPeoplePickerFactory(this, null);
        q.concat(".clientpeoplepickerresolveuser");
        const res = await (0,_spqueryable_js__WEBPACK_IMPORTED_MODULE_0__.spPost)(q, this.getBodyFrom(queryParams));
        return JSON.parse(typeof res === "object" ? res.ClientPeoplePickerResolveUser : res);
    }
    /**
     * Searches for users or groups using specified query parameters
     *
     * @param queryParams The query parameters used to perform search
     */
    async clientPeoplePickerSearchUser(queryParams) {
        const q = ClientPeoplePickerFactory(this, null);
        q.concat(".clientpeoplepickersearchuser");
        const res = await (0,_spqueryable_js__WEBPACK_IMPORTED_MODULE_0__.spPost)(q, this.getBodyFrom(queryParams));
        return JSON.parse(typeof res === "object" ? res.ClientPeoplePickerSearchUser : res);
    }
    /**
     * Creates ClientPeoplePickerQueryParameters request body
     *
     * @param queryParams The query parameters to create request body
     */
    getBodyFrom(queryParams) {
        return (0,_pnp_queryable__WEBPACK_IMPORTED_MODULE_1__.body)({ queryParams });
    }
};
ClientPeoplePickerQuery = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([
    (0,_decorators_js__WEBPACK_IMPORTED_MODULE_4__.defaultPath)("_api/sp.ui.applicationpages.clientpeoplepickerwebserviceinterface")
], ClientPeoplePickerQuery);
const ClientPeoplePickerFactory = (baseUrl, path) => {
    return new ClientPeoplePickerQuery(baseUrl, path);
};
/**
 * Specifies the originating zone of a request received.
 */
var UrlZone;
(function (UrlZone) {
    /**
     * Specifies the default zone used for requests unless another zone is specified.
     */
    UrlZone[UrlZone["DefaultZone"] = 0] = "DefaultZone";
    /**
     * Specifies an intranet zone.
     */
    UrlZone[UrlZone["Intranet"] = 1] = "Intranet";
    /**
     * Specifies an Internet zone.
     */
    UrlZone[UrlZone["Internet"] = 2] = "Internet";
    /**
     * Specifies a custom zone.
     */
    UrlZone[UrlZone["Custom"] = 3] = "Custom";
    /**
     * Specifies an extranet zone.
     */
    UrlZone[UrlZone["Extranet"] = 4] = "Extranet";
})(UrlZone || (UrlZone = {}));


/***/ }),

/***/ 229:
/*!***************************************************!*\
  !*** ./node_modules/@pnp/sp/sputilities/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Utilities: () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_1__.Utilities)
/* harmony export */ });
/* harmony import */ var _fi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../fi.js */ 17066);
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types.js */ 636);



Reflect.defineProperty(_fi_js__WEBPACK_IMPORTED_MODULE_0__.SPFI.prototype, "utility", {
    configurable: true,
    enumerable: true,
    get: function () {
        return this.create(_types_js__WEBPACK_IMPORTED_MODULE_1__.Utilities, "");
    },
});


/***/ }),

/***/ 636:
/*!***************************************************!*\
  !*** ./node_modules/@pnp/sp/sputilities/types.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Utilities: () => (/* binding */ Utilities),
/* harmony export */   _Utilities: () => (/* binding */ _Utilities)
/* harmony export */ });
/* harmony import */ var _pnp_queryable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/queryable */ 2464);
/* harmony import */ var _spqueryable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../spqueryable.js */ 96290);
/* harmony import */ var _utils_extract_web_url_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/extract-web-url.js */ 48939);
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @pnp/core */ 49671);




class _Utilities extends _spqueryable_js__WEBPACK_IMPORTED_MODULE_1__._SPQueryable {
    constructor(base, methodName = "") {
        super(base);
        this._url = (0,_pnp_core__WEBPACK_IMPORTED_MODULE_3__.combine)((0,_utils_extract_web_url_js__WEBPACK_IMPORTED_MODULE_2__.extractWebUrl)(this._url), `_api/SP.Utilities.Utility.${methodName}`);
    }
    excute(props) {
        return (0,_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__.spPost)(this, (0,_pnp_queryable__WEBPACK_IMPORTED_MODULE_0__.body)(props));
    }
    sendEmail(properties) {
        if (properties.AdditionalHeaders) {
            // we have to remap the additional headers into this format #2253
            properties.AdditionalHeaders = Reflect.ownKeys(properties.AdditionalHeaders).map(key => ({
                Key: key,
                Value: Reflect.get(properties.AdditionalHeaders, key),
                ValueType: "Edm.String",
            }));
        }
        return UtilitiesCloneFactory(this, "SendEmail").excute({ properties });
    }
    getCurrentUserEmailAddresses() {
        return UtilitiesCloneFactory(this, "GetCurrentUserEmailAddresses").excute({});
    }
    resolvePrincipal(input, scopes, sources, inputIsEmailOnly, addToUserInfoList, matchUserInfoList = false) {
        const params = {
            addToUserInfoList,
            input,
            inputIsEmailOnly,
            matchUserInfoList,
            scopes,
            sources,
        };
        return UtilitiesCloneFactory(this, "ResolvePrincipalInCurrentContext").excute(params);
    }
    searchPrincipals(input, scopes, sources, groupName, maxCount) {
        const params = {
            groupName: groupName,
            input: input,
            maxCount: maxCount,
            scopes: scopes,
            sources: sources,
        };
        return UtilitiesCloneFactory(this, "SearchPrincipalsUsingContextWeb").excute(params);
    }
    createEmailBodyForInvitation(pageAddress) {
        const params = {
            pageAddress: pageAddress,
        };
        return UtilitiesCloneFactory(this, "CreateEmailBodyForInvitation").excute(params);
    }
    expandGroupsToPrincipals(inputs, maxCount = 30) {
        const params = {
            inputs: inputs,
            maxCount: maxCount,
        };
        const clone = UtilitiesCloneFactory(this, "ExpandGroupsToPrincipals");
        return clone.excute(params);
    }
}
const Utilities = (0,_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__.spInvokableFactory)(_Utilities);
const UtilitiesCloneFactory = (base, path) => Utilities(base, path);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("403c032425752de14112")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=inventory-management-web-part.934876ecabd7e6ca19c6.hot-update.js.map