"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentRequestModule = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("react");
const react_2 = require("@fluentui/react");
const IncidentRequestModule_module_scss_1 = tslib_1.__importDefault(require("./IncidentRequestModule.module.scss"));
const IncidentService_1 = require("../../services/IncidentService");
const DropdownConstants_1 = require("../../constants/DropdownConstants");
const incidentTypeOptions = DropdownConstants_1.INCIDENT_TYPE_OPTIONS;
const priorityOptions = DropdownConstants_1.INCIDENT_PRIORITY_OPTIONS;
const raisedToOptions = [
    { key: 'Admin', text: 'Admin' }
];
const IncidentRequestModule = (props) => {
    const [formData, setFormData] = (0, react_1.useState)({
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
    const [assignedAssets, setAssignedAssets] = (0, react_1.useState)([]);
    const [isLoadingAssets, setIsLoadingAssets] = (0, react_1.useState)(true);
    const [message, setMessage] = (0, react_1.useState)(null);
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const timer = setTimeout(() => {
            loadAssignedAssetsForName(formData.employeeName);
        }, 500);
        return () => clearTimeout(timer);
    }, [formData.employeeName]);
    // Sync with props when employee context changes or when a preselected asset is passed
    (0, react_1.useEffect)(() => {
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
            const service = new IncidentService_1.IncidentService(props.spContext);
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
                setMessage({ type: react_2.MessageBarType.error, text: 'Please fill in all required fields.' });
                return;
            }
            setIsSubmitting(true);
            const service = new IncidentService_1.IncidentService(props.spContext);
            const payload = {
                ...formData,
                employeeEmail: formData.employeeEmail || props.userEmail,
                employeeName: formData.employeeName,
                employeeId: formData.employeeId,
            };
            console.log('Submitting incident payload:', payload);
            await service.createIncidentRequest(payload);
            setMessage({ type: react_2.MessageBarType.success, text: 'Incident reported successfully!' });
            setTimeout(() => {
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
                // Refresh assigned assets in case it changes
                loadAssignedAssetsForName(props.userDisplayName);
                props.onClose();
            }, 2000);
        }
        catch (error) {
            console.error('Error submitting incident:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to report incident. Please try again.';
            setMessage({ type: react_2.MessageBarType.error, text: `Error: ${errorMessage}` });
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
    return (React.createElement(react_2.Panel, { isOpen: props.isOpen, onDismiss: props.onClose, type: react_2.PanelType.custom, customWidth: "100%", styles: { main: { maxWidth: '450px' } }, headerText: "Raise Incident", closeButtonAriaLabel: "Close" },
        React.createElement("div", { className: IncidentRequestModule_module_scss_1.default.incidentRequestModule },
            React.createElement(react_2.Stack, { tokens: { childrenGap: 15 } },
                message && (React.createElement(react_2.MessageBar, { messageBarType: message.type, isMultiline: true }, message.text)),
                !isLoadingAssets && assignedAssets.length === 0 && (React.createElement(react_2.MessageBar, { messageBarType: react_2.MessageBarType.info }, "You currently have no assets assigned. You can still raise generic incidents.")),
                React.createElement(react_2.TextField, { label: "Employee Name", value: formData.employeeName, onChange: (ev, val) => handleInputChange('employeeName', val || ''), required: true }),
                React.createElement(react_2.Dropdown, { label: "Select Assigned Asset", placeholder: isLoadingAssets ? "Loading assets..." : "Choose one of your assigned assets", options: assetOptions, selectedKey: selectedAssetKey, onChange: (ev, option) => {
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
                formData.assetName && (React.createElement(react_2.TextField, { label: "Asset Name", value: formData.assetName, disabled: true })),
                formData.serialNo && (React.createElement(react_2.TextField, { label: "Serial NO", value: formData.serialNo, disabled: true })),
                React.createElement(react_2.Dropdown, { label: "Incident Type", options: incidentTypeOptions, selectedKey: formData.incidentType, onChange: (ev, option) => handleInputChange('incidentType', option?.key), required: true, placeholder: "Select Incident Type" }),
                React.createElement(react_2.Dropdown, { label: "Priority", options: priorityOptions, selectedKey: formData.priority, onChange: (ev, option) => handleInputChange('priority', option?.key) }),
                React.createElement(react_2.TextField, { label: "Description", multiline: true, rows: 5, placeholder: "Describe the issue...", value: formData.description, onChange: (ev, newValue) => handleInputChange('description', newValue), required: true }),
                React.createElement(react_2.Dropdown, { label: "Raised To", options: raisedToOptions, selectedKey: formData.raisedTo, onChange: (ev, option) => handleInputChange('raisedTo', option?.key), placeholder: "Select Team" }),
                React.createElement(react_2.TextField, { label: "Raised Date", value: formData.raisedDate, readOnly: true }),
                React.createElement(react_2.TextField, { label: "Status", value: formData.status, readOnly: true }),
                React.createElement(react_2.Stack, { horizontal: true, tokens: { childrenGap: 10 }, style: { marginTop: 20 } },
                    React.createElement(react_2.PrimaryButton, { text: "Report Incident", onClick: handleSubmit, disabled: isSubmitting }),
                    React.createElement(react_2.DefaultButton, { text: "Cancel", onClick: handleCancel }))))));
};
exports.IncidentRequestModule = IncidentRequestModule;
//# sourceMappingURL=IncidentRequestModule.js.map