import * as React from 'react';
import { Panel, PanelType, TextField, Dropdown, PrimaryButton, DefaultButton, Stack, MessageBar, MessageBarType } from '@fluentui/react';
import { DEFAULT_ASSET_TYPE_OPTIONS, ASSET_REQUEST_PRIORITY_OPTIONS } from '../constants/DropdownConstants';
const stackTokens = { childrenGap: 15 };
export const RequestForm = (props) => {
    const [selectedRequesterId, setSelectedRequesterId] = React.useState(undefined);
    const [employeeId, setEmployeeId] = React.useState('');
    const [managerName, setManagerName] = React.useState('');
    const [selectedAssetType, setSelectedAssetType] = React.useState(undefined);
    const [priority, setPriority] = React.useState('Medium');
    const [quantity, setQuantity] = React.useState(1);
    const [reason, setReason] = React.useState('');
    const [requestDate, setRequestDate] = React.useState(new Date().toISOString().split('T')[0]);
    const [reasonTouched, setReasonTouched] = React.useState(false);
    const [managerNameTouched, setManagerNameTouched] = React.useState(false);
    React.useEffect(() => {
        if (props.isOpen) {
            setRequestDate(new Date().toISOString().split('T')[0]);
            setReasonTouched(false);
            setManagerNameTouched(false);
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
        jobTitle: props.currentUserRole
    };
    const matchedEmployee = props.employees.find(emp => (props.currentUserEmail && emp.email.toLowerCase() === props.currentUserEmail.toLowerCase()) ||
        emp.name.toLowerCase() === props.currentUserName.toLowerCase());
    const activeEmployee = matchedEmployee || currentUserOption;
    const availableEmployees = [activeEmployee];
    const allEmployees = props.employees.some(e => e.id === activeEmployee.id) ? props.employees : [activeEmployee, ...props.employees];
    const employeeOptions = availableEmployees.map(emp => ({
        key: emp.id,
        text: `${emp.name} (${emp.department})`
    }));
    // Auto-select current user and pre-populate Employee ID
    React.useEffect(() => {
        if (props.isOpen && employeeOptions.length > 0) {
            setSelectedRequesterId(activeEmployee.id);
            setEmployeeId(activeEmployee.id === 'current-user' ? '' : activeEmployee.id);
        }
    }, [props.isOpen, employeeOptions]);
    const uniqueAssetTypes = Array.from(new Set(props.availableAssets.map(a => a.assetType).filter(Boolean)));
    const dynamicAssetTypeOptions = uniqueAssetTypes.map(type => ({ key: type, text: type }));
    const assetTypeOptions = dynamicAssetTypeOptions.length > 0
        ? dynamicAssetTypeOptions
        : DEFAULT_ASSET_TYPE_OPTIONS;
    const isFormValid = !!selectedRequesterId && !!employeeId.trim() && !!managerName.trim() && !!selectedAssetType && quantity > 0 && !!reason.trim();
    const onSave = () => {
        const employee = activeEmployee;
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
            setReasonTouched(false);
            setManagerNameTouched(false);
            props.onClose();
        }
    };
    return (React.createElement(Panel, { isOpen: props.isOpen, onDismiss: props.onClose, type: PanelType.custom, customWidth: "100%", styles: { main: { maxWidth: '450px' } }, headerText: "Request an Asset", closeButtonAriaLabel: "Close" },
        React.createElement(Stack, { tokens: stackTokens },
            React.createElement(MessageBar, { messageBarType: MessageBarType.info }, "You are requesting this asset for yourself. Requesting on behalf of other users is disabled."),
            React.createElement(Dropdown, { label: "Requester", selectedKey: selectedRequesterId, options: employeeOptions, required: true, disabled: true }),
            React.createElement(TextField, { label: "Employee ID", value: employeeId, onChange: (_, val) => setEmployeeId(val || ''), required: true, disabled: activeEmployee.id !== 'current-user' }),
            React.createElement(TextField, { label: "Manager's Name", value: managerName, onChange: (_, val) => {
                    setManagerName(val || '');
                    setManagerNameTouched(true);
                }, onBlur: () => setManagerNameTouched(true), placeholder: "Enter manager's name", required: true, errorMessage: managerNameTouched && !managerName.trim() ? "Manager's name is required" : undefined }),
            React.createElement(TextField, { label: "Requested Date", type: "date", value: requestDate, onChange: (_, val) => setRequestDate(val || ''), required: true }),
            React.createElement(Dropdown, { label: "Asset Type", selectedKey: selectedAssetType, options: assetTypeOptions, onChange: (_, opt) => {
                    setSelectedAssetType(opt?.key);
                }, required: true }),
            React.createElement(Dropdown, { label: "Priority", selectedKey: priority, options: ASSET_REQUEST_PRIORITY_OPTIONS, onChange: (_, opt) => setPriority(opt?.key), required: true }),
            React.createElement(TextField, { label: "Quantity", type: "number", value: quantity.toString(), onChange: (_, val) => setQuantity(parseInt(val || '0')), required: true }),
            React.createElement(TextField, { label: "Reason for Request", multiline: true, rows: 3, value: reason, onChange: (_, val) => {
                    setReason(val || '');
                    setReasonTouched(true);
                }, onBlur: () => setReasonTouched(true), required: true, errorMessage: reasonTouched && !reason.trim() ? "Reason for request is required" : undefined }),
            React.createElement(Stack, { horizontal: true, tokens: stackTokens, style: { marginTop: 20 } },
                React.createElement(PrimaryButton, { text: "Submit Request", onClick: onSave, disabled: !isFormValid }),
                React.createElement(DefaultButton, { text: "Cancel", onClick: props.onClose })))));
};
//# sourceMappingURL=RequestForm.js.map