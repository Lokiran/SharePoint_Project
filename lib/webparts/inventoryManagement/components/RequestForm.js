import * as React from 'react';
import { Panel, PanelType, TextField, Dropdown, PrimaryButton, DefaultButton, Stack, MessageBar, MessageBarType } from '@fluentui/react';
const stackTokens = { childrenGap: 15 };
export const RequestForm = (props) => {
    const [selectedRequesterId, setSelectedRequesterId] = React.useState(undefined);
    const [employeeId, setEmployeeId] = React.useState('');
    const [selectedAssetType, setSelectedAssetType] = React.useState(undefined);
    const [priority, setPriority] = React.useState('Medium');
    const [quantity, setQuantity] = React.useState(1);
    const [reason, setReason] = React.useState('');
    const [requestDate, setRequestDate] = React.useState(new Date().toISOString().split('T')[0]);
    React.useEffect(() => {
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
    React.useEffect(() => {
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
        : [
            { key: 'Laptop', text: 'Laptop' },
            { key: 'Monitor', text: 'Monitor' },
            { key: 'Mouse', text: 'Mouse' },
            { key: 'Keyboard', text: 'Keyboard' },
            { key: 'Headset', text: 'Headset' },
            { key: 'Other', text: 'Other' }
        ];
    const isFormValid = !!selectedRequesterId && !!employeeId.trim() && !!selectedAssetType && quantity > 0;
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
                assetId: matchingAsset ? matchingAsset.id : '1',
                assetTitle: selectedAssetType,
                priority: priority,
                quantity,
                reason,
                requestDate
            });
            setSelectedRequesterId(undefined);
            setEmployeeId('');
            setSelectedAssetType(undefined);
            setPriority('Medium');
            setQuantity(1);
            setReason('');
            setRequestDate(new Date().toISOString().split('T')[0]);
            props.onClose();
        }
    };
    return (React.createElement(Panel, { isOpen: props.isOpen, onDismiss: props.onClose, type: PanelType.custom, customWidth: "450px", headerText: "Request an Asset", closeButtonAriaLabel: "Close" },
        React.createElement(Stack, { tokens: stackTokens },
            isEmployee && (React.createElement(MessageBar, { messageBarType: MessageBarType.info }, "You can only request assets for yourself. Contact your manager to request assets for others.")),
            React.createElement(Dropdown, { label: isEmployee ? "Requester (You)" : "Requester (Employee)", selectedKey: selectedRequesterId, options: employeeOptions, onChange: (_, opt) => {
                    const empId = opt?.key;
                    setSelectedRequesterId(empId);
                    const emp = allEmployees.find(e => e.id === empId);
                    if (emp) {
                        setEmployeeId(emp.id);
                    }
                }, required: true, disabled: isEmployee && employeeOptions.length === 1 }),
            React.createElement(TextField, { label: "Employee ID", value: employeeId, onChange: (_, val) => setEmployeeId(val || ''), required: true }),
            React.createElement(TextField, { label: "Requested Date", type: "date", value: requestDate, onChange: (_, val) => setRequestDate(val || ''), required: true }),
            React.createElement(Dropdown, { label: "Asset Type", selectedKey: selectedAssetType, options: assetTypeOptions, onChange: (_, opt) => {
                    setSelectedAssetType(opt?.key);
                }, required: true }),
            React.createElement(Dropdown, { label: "Priority", selectedKey: priority, options: [
                    { key: 'High', text: 'High' },
                    { key: 'Medium', text: 'Medium' },
                    { key: 'Low', text: 'Low' }
                ], onChange: (_, opt) => setPriority(opt?.key), required: true }),
            React.createElement(TextField, { label: "Quantity", type: "number", value: quantity.toString(), onChange: (_, val) => setQuantity(parseInt(val || '0')), required: true }),
            React.createElement(TextField, { label: "Reason for Request", multiline: true, rows: 3, value: reason, onChange: (_, val) => setReason(val || '') }),
            React.createElement(Stack, { horizontal: true, tokens: stackTokens, style: { marginTop: 20 } },
                React.createElement(PrimaryButton, { text: "Submit Request", onClick: onSave, disabled: !isFormValid }),
                React.createElement(DefaultButton, { text: "Cancel", onClick: props.onClose })))));
};
//# sourceMappingURL=RequestForm.js.map