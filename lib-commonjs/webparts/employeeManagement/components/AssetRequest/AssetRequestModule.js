"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetRequestModule = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("react");
const react_2 = require("@fluentui/react");
const react_cards_1 = require("@uifabric/react-cards");
const InventoryService_1 = require("../../services/InventoryService");
const priorityOptions = [
    { key: 'low', text: 'Low' },
    { key: 'medium', text: 'Medium' },
    { key: 'high', text: 'High' },
    { key: 'urgent', text: 'Urgent' },
];
const assetNameOptions = [
    { key: 'HP Pavilion 15', text: 'HP Pavilion 15' },
    { key: 'Dell Latitude 5420', text: 'Dell Latitude 5420' },
    { key: 'MacBook Pro 16', text: 'MacBook Pro 16' },
    { key: 'Lenovo ThinkPad T14', text: 'Lenovo ThinkPad T14' },
    { key: 'iPad Air', text: 'iPad Air' },
    { key: 'iPhone 13', text: 'iPhone 13' },
    { key: 'Logitech MX Master 3', text: 'Logitech MX Master 3' },
    { key: 'Dell UltraSharp 27', text: 'Dell UltraSharp 27' },
];
const assetTypeOptions = [
    { key: 'Laptop', text: 'Laptop' },
    { key: 'Mobile', text: 'Mobile' },
    { key: 'Tablet', text: 'Tablet' },
    { key: 'Accessory', text: 'Accessory' },
    { key: 'Monitor', text: 'Monitor' },
    { key: 'Other', text: 'Other' },
];
const cardTokens = { childrenMargin: 12 };
const AssetRequestModule = (props) => {
    const [formData, setFormData] = (0, react_1.useState)({
        employeeName: props.userName || '',
        employeeId: props.employeeId || '',
        employeeEmail: props.userEmail || '',
        department: props.department || 'General',
        serialNo: '',
        assetName: '',
        assetType: '',
        priority: 'medium',
        reasonDescription: '',
        requiredDate: new Date().toISOString().split('T')[0],
    });
    const [message, setMessage] = (0, react_1.useState)(null);
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    // Sync with props when employee context changes
    (0, react_1.useEffect)(() => {
        setFormData((prev) => ({
            ...prev,
            employeeName: props.userName || '',
            employeeId: props.employeeId || '',
            department: props.department || 'General',
            employeeEmail: props.userEmail || '',
        }));
    }, [props.userName, props.employeeId, props.department, props.userEmail]);
    // Lookup employee details when typed manually
    (0, react_1.useEffect)(() => {
        const timer = setTimeout(async () => {
            if (!formData.employeeName.trim())
                return;
            try {
                const service = new InventoryService_1.InventoryService(props.spContext);
                const details = await service.getEmployeeDetailsByName(formData.employeeName);
                setFormData(prev => ({
                    ...prev,
                    employeeId: details.employeeId || prev.employeeId,
                    department: details.department || prev.department,
                    employeeEmail: details.email || prev.employeeEmail,
                }));
            }
            catch (e) {
                console.error('Failed to resolve employee details in asset request', e);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [formData.employeeName]);
    const handleInputChange = (fieldName, value) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };
    const handleSubmit = async () => {
        try {
            if (!formData.assetName || !formData.assetType || !formData.reasonDescription) {
                setMessage({ type: react_2.MessageBarType.error, text: 'Please fill in all required fields.' });
                return;
            }
            setIsSubmitting(true);
            const service = new InventoryService_1.InventoryService(props.spContext);
            const payload = {
                employeeEmail: formData.employeeEmail || props.userEmail,
                employeeName: formData.employeeName,
                employeeId: formData.employeeId,
                department: formData.department,
                serialNo: formData.serialNo || 'N/A',
                assetType: formData.assetType,
                assetName: formData.assetName,
                priority: formData.priority,
                reasonDescription: formData.reasonDescription,
                requiredDate: formData.requiredDate,
            };
            console.log('Submitting asset request to SharePoint', {
                siteUrl: props.webUrl,
                userEmail: payload.employeeEmail,
                payload,
            });
            await service.createAssetRequest(payload);
            setMessage({ type: react_2.MessageBarType.success, text: 'Asset request submitted successfully!' });
            // Reset form fields
            setTimeout(() => {
                setFormData({
                    employeeName: props.userName || '',
                    employeeId: props.employeeId || '',
                    employeeEmail: props.userEmail || '',
                    department: props.department || 'General',
                    serialNo: '',
                    assetName: '',
                    assetType: '',
                    priority: 'medium',
                    reasonDescription: '',
                    requiredDate: new Date().toISOString().split('T')[0],
                });
                setMessage(null);
            }, 2000);
        }
        catch (error) {
            console.error('Error submitting asset request:', error);
            const fullError = error && typeof error === 'object' ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : String(error);
            const errorMessage = `Failed to submit request: ${error.message || fullError || 'Check browser console (F12) for details.'}`;
            setMessage({ type: react_2.MessageBarType.error, text: errorMessage });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleCancel = () => {
        setFormData({
            employeeName: props.userName || '',
            employeeId: props.employeeId || '',
            employeeEmail: props.userEmail || '',
            department: props.department || 'General',
            serialNo: '',
            assetName: '',
            assetType: '',
            priority: 'medium',
            reasonDescription: '',
            requiredDate: new Date().toISOString().split('T')[0],
        });
        setMessage(null);
    };
    return (React.createElement(react_2.Stack, { tokens: { childrenGap: 20 } },
        React.createElement(react_2.Text, { variant: "xLarge", block: true, style: { fontWeight: 600 } }, "Request Asset"),
        message && (React.createElement(react_2.MessageBar, { messageBarType: message.type, isMultiline: true }, message.text)),
        React.createElement(react_cards_1.Card, null,
            React.createElement(react_cards_1.Card.Section, { tokens: cardTokens },
                React.createElement(react_2.Stack, { tokens: { childrenGap: 15 } },
                    React.createElement(react_2.Stack, { tokens: { childrenGap: 10 } },
                        React.createElement(react_2.Text, { variant: "large", style: { fontWeight: 600, color: '#0078d4' } }, "Employee Information"),
                        React.createElement(react_2.TextField, { label: "Employee Name *", value: formData.employeeName, onChange: (ev, val) => handleInputChange('employeeName', val || ''), required: true })),
                    React.createElement(react_2.Stack, { tokens: { childrenGap: 10 } },
                        React.createElement(react_2.Text, { variant: "large", style: { fontWeight: 600, color: '#0078d4' } }, "Asset Details"),
                        React.createElement(react_2.Dropdown, { label: "Asset Name *", placeholder: "Choose an asset model", options: assetNameOptions, selectedKey: formData.assetName, onChange: (ev, option) => handleInputChange('assetName', option?.key), required: true }),
                        React.createElement(react_2.Dropdown, { label: "Asset Type *", placeholder: "Choose an asset category", options: assetTypeOptions, selectedKey: formData.assetType, onChange: (ev, option) => handleInputChange('assetType', option?.key), required: true }),
                        React.createElement(react_2.Dropdown, { label: "Priority", options: priorityOptions, selectedKey: formData.priority, onChange: (ev, option) => handleInputChange('priority', option?.key) }),
                        React.createElement(react_2.TextField, { label: "Reason for Request *", multiline: true, rows: 4, placeholder: "Explain why you need this...", value: formData.reasonDescription, onChange: (ev, newValue) => handleInputChange('reasonDescription', newValue), required: true })),
                    React.createElement(react_2.Stack, { tokens: { childrenGap: 10 } },
                        React.createElement(react_2.Text, { variant: "large", style: { fontWeight: 600, color: '#0078d4' } }, "Timeline"),
                        React.createElement(react_2.TextField, { label: "Requested Date", type: "date", value: formData.requiredDate, onChange: (ev, newValue) => handleInputChange('requiredDate', newValue) })),
                    React.createElement(react_2.Stack, { horizontal: true, tokens: { childrenGap: 10 } },
                        React.createElement(react_2.PrimaryButton, { text: "Submit Request", onClick: handleSubmit, disabled: isSubmitting }),
                        React.createElement(react_2.DefaultButton, { text: "Cancel", onClick: handleCancel })))))));
};
exports.AssetRequestModule = AssetRequestModule;
//# sourceMappingURL=AssetRequestModule.js.map