import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Stack, TextField, Dropdown, PrimaryButton, DefaultButton, MessageBar, MessageBarType, Panel, PanelType, } from '@fluentui/react';
import styles from './IncidentRequestModule.module.scss';
import { IncidentService } from '../../services/IncidentService';
import { INCIDENT_TYPE_OPTIONS, INCIDENT_PRIORITY_OPTIONS, INCIDENT_RAISED_TO_OPTIONS } from '../../constants/DropdownConstants';
import * as strings from 'InventoryManagementWebPartStrings';
const incidentTypeOptions = INCIDENT_TYPE_OPTIONS;
const priorityOptions = INCIDENT_PRIORITY_OPTIONS;
const raisedToOptions = INCIDENT_RAISED_TO_OPTIONS;
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
    const prevIsOpenRef = useRef(props.isOpen);
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            employeeName: props.userDisplayName || '',
            employeeId: props.employeeId || '',
            employeeEmail: props.userEmail || '',
        }));
    }, [props.userDisplayName, props.employeeId, props.userEmail]);
    useEffect(() => {
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
                setMessage({ type: MessageBarType.error, text: strings.IncidentRequestModule.ValidationRequiredFields });
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
            const result = await service.createIncidentRequest(payload);
            let incidentId = '';
            if (result && result.data) {
                if (result.data.incidentId) {
                    incidentId = result.data.incidentId;
                }
                else {
                    const itemId = result.data.Id || result.data.ID;
                    if (itemId) {
                        const isReplacement = formData.incidentType === 'Replacement Request';
                        incidentId = isReplacement ? `REP-${itemId}` : `INC-${itemId}`;
                    }
                }
            }
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
                    priority: formData.priority,
                    incidentId: incidentId
                });
            }
        }
        catch (error) {
            console.error('Error submitting incident:', error);
            const errorMessage = error instanceof Error ? error.message : strings.IncidentRequestModule.GenericSubmitError;
            setMessage({ type: MessageBarType.error, text: `${strings.IncidentRequestModule.ErrorPrefix} ${errorMessage}` });
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
    return (React.createElement(Panel, { isOpen: props.isOpen, onDismiss: props.onClose, type: PanelType.custom, customWidth: "100%", styles: { main: { maxWidth: '450px' } }, headerText: isReplacementMode ? strings.IncidentRequestModule.HeaderReplacement : strings.IncidentRequestModule.HeaderIncident, closeButtonAriaLabel: "Close" },
        React.createElement("div", { className: styles.incidentRequestModule },
            React.createElement(Stack, { tokens: { childrenGap: 15 } },
                message && (React.createElement(MessageBar, { messageBarType: message.type, isMultiline: true }, message.text)),
                !isLoadingAssets && assignedAssets.length === 0 && (React.createElement(MessageBar, { messageBarType: MessageBarType.info }, isReplacementMode
                    ? strings.IncidentRequestModule.NoAssetsReplacementInfo
                    : strings.IncidentRequestModule.NoAssetsIncidentInfo)),
                React.createElement(TextField, { label: strings.IncidentRequestModule.LabelEmployeeName, value: formData.employeeName, onChange: (ev, val) => handleInputChange('employeeName', val || ''), required: true }),
                !props.preselectedAsset && (React.createElement(Dropdown, { label: strings.IncidentRequestModule.LabelSelectAsset, placeholder: isLoadingAssets ? strings.IncidentRequestModule.PlaceholderLoadingAssets : strings.IncidentRequestModule.PlaceholderChooseAsset, options: assetOptions, selectedKey: selectedAssetKey, onChange: (ev, option) => {
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
                    }, disabled: isLoadingAssets })),
                formData.assetName && (React.createElement(TextField, { label: strings.IncidentRequestModule.LabelAssetName, value: formData.assetName, disabled: true })),
                formData.serialNo && (React.createElement(TextField, { label: strings.IncidentRequestModule.LabelSerialNo, value: formData.serialNo, disabled: true })),
                !isReplacementMode && (React.createElement(Dropdown, { label: strings.IncidentRequestModule.LabelIssueType, options: incidentTypeOptions, selectedKey: formData.incidentType, onChange: (ev, option) => handleInputChange('incidentType', option?.key), required: true, placeholder: strings.IncidentRequestModule.PlaceholderIssueType })),
                React.createElement(Dropdown, { label: strings.IncidentRequestModule.LabelPriority, options: priorityOptions, selectedKey: formData.priority, onChange: (ev, option) => handleInputChange('priority', option?.key) }),
                React.createElement(TextField, { label: isReplacementMode ? strings.IncidentRequestModule.LabelReasonForReplacement : strings.IncidentRequestModule.LabelDescription, multiline: true, rows: 5, placeholder: isReplacementMode ? strings.IncidentRequestModule.PlaceholderReasonForReplacement : strings.IncidentRequestModule.PlaceholderDescribeIssue, value: formData.description, onChange: (ev, newValue) => handleInputChange('description', newValue), required: true }),
                React.createElement(Dropdown, { label: strings.IncidentRequestModule.LabelRaisedTo, options: raisedToOptions, selectedKey: formData.raisedTo, onChange: (ev, option) => handleInputChange('raisedTo', option?.key), placeholder: strings.IncidentRequestModule.PlaceholderSelectTeam }),
                React.createElement(TextField, { label: strings.IncidentRequestModule.LabelRaisedDate, value: formData.raisedDate, readOnly: true }),
                React.createElement(TextField, { label: strings.IncidentRequestModule.LabelStatus, value: formData.status, readOnly: true }),
                React.createElement(Stack, { horizontal: true, tokens: { childrenGap: 10 }, style: { marginTop: 20 } },
                    React.createElement(PrimaryButton, { text: isReplacementMode ? strings.IncidentRequestModule.RequestReplacement : strings.IncidentRequestModule.ReportIncident, onClick: handleSubmit, disabled: isSubmitting }),
                    React.createElement(DefaultButton, { text: strings.IncidentRequestModule.Cancel, onClick: handleCancel }))))));
};
//# sourceMappingURL=IncidentRequestModule.js.map