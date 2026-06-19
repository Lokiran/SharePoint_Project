import * as React from 'react';
import { useState, useEffect } from 'react';
import { Stack, TextField, Dropdown, PrimaryButton, DefaultButton, MessageBar, MessageBarType, Panel, PanelType, } from '@fluentui/react';
import styles from './IncidentRequestModule.module.scss';
import { IncidentService } from '../../services/IncidentService';
const incidentTypeOptions = [
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
const priorityOptions = [
    { key: 'Low', text: 'Low' },
    { key: 'Medium', text: 'Medium' },
    { key: 'High', text: 'High' },
    { key: 'Critical', text: 'Critical' },
];
const raisedToOptions = [
    { key: 'Admin', text: 'Admin' }
];
export const IncidentRequestModule = (props) => {
    const [formData, setFormData] = useState({
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
    const [assignedAssets, setAssignedAssets] = useState([]);
    const [isLoadingAssets, setIsLoadingAssets] = useState(true);
    const [message, setMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            loadAssignedAssetsForName(formData.employeeName);
        }, 500);
        return () => clearTimeout(timer);
    }, [formData.employeeName]);
    // Sync with props when employee context changes or when a preselected asset is passed
    useEffect(() => {
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
            const service = new IncidentService(props.spContext);
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
                setMessage({ type: MessageBarType.error, text: 'Please fill in all required fields.' });
                return;
            }
            setIsSubmitting(true);
            const service = new IncidentService(props.spContext);
            const payload = {
                ...formData,
                employeeEmail: formData.employeeEmail || props.userEmail,
                employeeName: formData.employeeName,
                employeeId: formData.employeeId,
            };
            console.log('Submitting incident payload:', payload);
            await service.createIncidentRequest(payload);
            setMessage({ type: MessageBarType.success, text: 'Incident reported successfully!' });
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
            setMessage({ type: MessageBarType.error, text: `Error: ${errorMessage}` });
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
    return (React.createElement(Panel, { isOpen: props.isOpen, onDismiss: props.onClose, type: PanelType.medium, headerText: "Raise Incident", closeButtonAriaLabel: "Close" },
        React.createElement("div", { className: styles.incidentRequestModule },
            React.createElement(Stack, { tokens: { childrenGap: 15 } },
                message && (React.createElement(MessageBar, { messageBarType: message.type, isMultiline: true }, message.text)),
                !isLoadingAssets && assignedAssets.length === 0 && (React.createElement(MessageBar, { messageBarType: MessageBarType.info }, "You currently have no assets assigned. You can still raise generic incidents.")),
                React.createElement(TextField, { label: "Employee Name", value: formData.employeeName, onChange: (ev, val) => handleInputChange('employeeName', val || ''), required: true }),
                React.createElement(Dropdown, { label: "Select Assigned Asset", placeholder: isLoadingAssets ? "Loading assets..." : "Choose one of your assigned assets", options: assetOptions, selectedKey: selectedAssetKey, onChange: (ev, option) => {
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
                formData.assetName && (React.createElement(TextField, { label: "Asset Name", value: formData.assetName, disabled: true })),
                formData.serialNo && (React.createElement(TextField, { label: "Serial NO", value: formData.serialNo, disabled: true })),
                React.createElement(Dropdown, { label: "Incident Type", options: incidentTypeOptions, selectedKey: formData.incidentType, onChange: (ev, option) => handleInputChange('incidentType', option?.key), required: true, placeholder: "Select Incident Type" }),
                React.createElement(Dropdown, { label: "Priority", options: priorityOptions, selectedKey: formData.priority, onChange: (ev, option) => handleInputChange('priority', option?.key) }),
                React.createElement(TextField, { label: "Description", multiline: true, rows: 5, placeholder: "Describe the issue...", value: formData.description, onChange: (ev, newValue) => handleInputChange('description', newValue), required: true }),
                React.createElement(Dropdown, { label: "Raised To", options: raisedToOptions, selectedKey: formData.raisedTo, onChange: (ev, option) => handleInputChange('raisedTo', option?.key), placeholder: "Select Team" }),
                React.createElement(TextField, { label: "Raised Date", value: formData.raisedDate, readOnly: true }),
                React.createElement(TextField, { label: "Status", value: formData.status, readOnly: true }),
                React.createElement(Stack, { horizontal: true, tokens: { childrenGap: 10 }, style: { marginTop: 20 } },
                    React.createElement(PrimaryButton, { text: "Report Incident", onClick: handleSubmit, disabled: isSubmitting }),
                    React.createElement(DefaultButton, { text: "Cancel", onClick: handleCancel }))))));
};
//# sourceMappingURL=IncidentRequestModule.js.map