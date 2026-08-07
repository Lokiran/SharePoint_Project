"use strict";
self["webpackHotUpdate_56f8f2dc_8391_46cb_b74c_2806d6953063_0_0_1"]("inventory-management-web-part",{

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
    // Sync with props when employee context changes or when a preselected asset is passed
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        setFormData((prev) => ({
            ...prev,
            employeeName: props.userDisplayName || '',
            employeeId: props.employeeId || '',
            employeeEmail: props.userEmail || '',
            assetName: props.preselectedAsset ? (props.preselectedAsset.assetName || props.preselectedAsset.title) : (props.isOpen ? '' : prev.assetName),
            serialNo: props.preselectedAsset ? props.preselectedAsset.serialNumber : (props.isOpen ? '' : prev.serialNo),
        }));
    }, [props.userDisplayName, props.employeeId, props.userEmail, props.preselectedAsset, props.isOpen]);
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
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_5__.Panel, { isOpen: props.isOpen, onDismiss: props.onClose, type: _fluentui_react__WEBPACK_IMPORTED_MODULE_6__.PanelType.custom, customWidth: "100%", styles: { main: { maxWidth: '450px' } }, headerText: "Raise Incident", closeButtonAriaLabel: "Close" },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _IncidentRequestModule_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].incidentRequestModule },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.Stack, { tokens: { childrenGap: 15 } },
                message && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.MessageBar, { messageBarType: message.type, isMultiline: true }, message.text)),
                !isLoadingAssets && assignedAssets.length === 0 && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_4__.MessageBarType.info }, "You currently have no assets assigned. You can still raise generic incidents.")),
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
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_10__.Dropdown, { label: "Incident Type", options: incidentTypeOptions, selectedKey: formData.incidentType, onChange: (ev, option) => handleInputChange('incidentType', option?.key), required: true, placeholder: "Select Incident Type" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_10__.Dropdown, { label: "Priority", options: priorityOptions, selectedKey: formData.priority, onChange: (ev, option) => handleInputChange('priority', option?.key) }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.TextField, { label: "Description", multiline: true, rows: 5, placeholder: "Describe the issue...", value: formData.description, onChange: (ev, newValue) => handleInputChange('description', newValue), required: true }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_10__.Dropdown, { label: "Raised To", options: raisedToOptions, selectedKey: formData.raisedTo, onChange: (ev, option) => handleInputChange('raisedTo', option?.key), placeholder: "Select Team" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.TextField, { label: "Raised Date", value: formData.raisedDate, readOnly: true }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.TextField, { label: "Status", value: formData.status, readOnly: true }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.Stack, { horizontal: true, tokens: { childrenGap: 10 }, style: { marginTop: 20 } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_11__.PrimaryButton, { text: "Report Incident", onClick: handleSubmit, disabled: isSubmitting }),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_12__.DefaultButton, { text: "Cancel", onClick: handleCancel }))))));
};


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("94ab40cbf05df87b89fb")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=inventory-management-web-part.727a3ec0b48682f9a71c.hot-update.js.map