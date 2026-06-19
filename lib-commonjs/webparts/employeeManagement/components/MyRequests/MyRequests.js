"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyRequests = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("react");
const react_2 = require("@fluentui/react");
const react_cards_1 = require("@uifabric/react-cards");
const InventoryService_1 = require("../../services/InventoryService");
const cardTokens = { childrenMargin: 12 };
const statusBadgeStyles = {
    Pending: { backgroundColor: '#ffb81c', color: '#fff' },
    Approved: { backgroundColor: '#27ae60', color: '#fff' },
    Rejected: { backgroundColor: '#e74c3c', color: '#fff' },
    Issued: { backgroundColor: '#0078d4', color: '#fff' },
};
const MyRequests = (props) => {
    const [requests, setRequests] = (0, react_1.useState)([]);
    const [filteredRequests, setFilteredRequests] = (0, react_1.useState)([]);
    const [searchText, setSearchText] = (0, react_1.useState)('');
    const [statusFilter, setStatusFilter] = (0, react_1.useState)(null);
    const [selectedRequest, setSelectedRequest] = (0, react_1.useState)(null);
    const [showDetailDialog, setShowDetailDialog] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        loadRequests();
    }, [props.userEmail]);
    (0, react_1.useEffect)(() => {
        filterRequests();
    }, [searchText, statusFilter, requests]);
    const loadRequests = async () => {
        try {
            props.setIsLoading(true);
            const service = new InventoryService_1.InventoryService(props.spContext);
            const data = await service.getEmployeeAssetRequests(props.userEmail);
            setRequests(data);
        }
        catch (error) {
            console.error('Error loading requests:', error);
        }
        finally {
            props.setIsLoading(false);
        }
    };
    const filterRequests = () => {
        let filtered = [...requests];
        if (searchText) {
            filtered = filtered.filter((req) => req.assetName.toLowerCase().includes(searchText.toLowerCase()) ||
                req.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
                req.serialNo.toLowerCase().includes(searchText.toLowerCase()) ||
                req.reason.toLowerCase().includes(searchText.toLowerCase()));
        }
        if (statusFilter) {
            filtered = filtered.filter((req) => req.status === statusFilter);
        }
        setFilteredRequests(filtered);
    };
    const handleViewDetails = (item) => {
        setSelectedRequest(item);
        setShowDetailDialog(true);
    };
    const handleCancelRequest = async (requestId) => {
        try {
            const service = new InventoryService_1.InventoryService(props.spContext);
            await service.cancelAssetRequest(requestId);
            loadRequests();
        }
        catch (error) {
            console.error('Error canceling request:', error);
        }
    };
    const columns = [
        {
            key: 'employeeName',
            name: 'Employee',
            minWidth: 100,
            onRender: (item) => React.createElement(react_2.Text, null, item.employeeName),
        },
        {
            key: 'employeeId',
            name: 'Employee ID',
            minWidth: 80,
            onRender: (item) => React.createElement(react_2.Text, null, item.employeeId),
        },
        {
            key: 'serialNo',
            name: 'Serial NO',
            minWidth: 100,
            onRender: (item) => React.createElement(react_2.Text, null, item.serialNo),
        },
        {
            key: 'assetName',
            name: 'Asset Name',
            minWidth: 120,
            onRender: (item) => React.createElement(react_2.Text, null, item.assetName),
        },
        {
            key: 'priority',
            name: 'Priority',
            minWidth: 80,
            onRender: (item) => (React.createElement("span", { style: { padding: '4px 8px', borderRadius: '4px', backgroundColor: (item.priority || '').toLowerCase() === 'high' || (item.priority || '').toLowerCase() === 'critical' ? '#d13438' : (item.priority || '').toLowerCase() === 'urgent' ? '#a4262c' : '#0078d4', color: 'white', fontSize: '12px', fontWeight: 600 } }, item.priority ? item.priority.charAt(0).toUpperCase() + item.priority.slice(1) : '')),
        },
        {
            key: 'reason',
            name: 'Reason for Request',
            minWidth: 150,
            onRender: (item) => React.createElement(react_2.Text, null, item.reason),
        },
        {
            key: 'requestDate',
            name: 'Requested Date',
            minWidth: 100,
            onRender: (item) => (React.createElement(react_2.Text, null, item.requestDate ? new Date(item.requestDate).toLocaleDateString() : 'N/A')),
        },
        {
            key: 'status',
            name: 'Status',
            minWidth: 100,
            onRender: (item) => (React.createElement("div", { style: {
                    ...(statusBadgeStyles[item.status] || { backgroundColor: '#666', color: '#fff' }),
                    padding: '6px 12px',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '12px',
                } }, item.status)),
        },
        {
            key: 'actions',
            name: 'Actions',
            minWidth: 120,
            onRender: (item) => (React.createElement(react_2.Stack, { horizontal: true, tokens: { childrenGap: 10 } },
                React.createElement(react_2.PrimaryButton, { text: "View", onClick: () => handleViewDetails(item), styles: {
                        root: { padding: '4px 12px', fontSize: '12px', height: '24px' },
                    } }),
                item.status === 'Pending' && (React.createElement(react_2.PrimaryButton, { text: "Cancel", onClick: () => handleCancelRequest(item.id), styles: {
                        root: { padding: '4px 12px', fontSize: '12px', height: '24px', backgroundColor: '#e74c3c' },
                    } })))),
        },
    ];
    const statusFilterOptions = [
        { key: '', text: 'All Status' },
        { key: 'Pending', text: 'Pending' },
        { key: 'Approved', text: 'Approved' },
        { key: 'Rejected', text: 'Rejected' },
        { key: 'Issued', text: 'Issued' },
    ];
    return (React.createElement(react_2.Stack, { tokens: { childrenGap: 20 } },
        React.createElement(react_2.Text, { variant: "xLarge", block: true, style: { fontWeight: 600 } }, "My Asset Requests"),
        React.createElement(react_cards_1.Card, null,
            React.createElement(react_cards_1.Card.Section, { tokens: cardTokens },
                React.createElement(react_2.Stack, { tokens: { childrenGap: 15 } },
                    React.createElement(react_2.Stack, { horizontal: true, tokens: { childrenGap: 15 } },
                        React.createElement(react_2.SearchBox, { placeholder: "Search by asset name or employee...", value: searchText, onChange: (ev, newValue) => setSearchText(newValue || ''), style: { flex: 1 } }),
                        React.createElement(react_2.Dropdown, { placeholder: "Filter by status", options: statusFilterOptions, onChange: (ev, option) => setStatusFilter(option?.key), style: { width: '200px' } })),
                    React.createElement(react_2.Text, { variant: "small", style: { color: '#666' } },
                        "Showing ",
                        filteredRequests.length,
                        " of ",
                        requests.length,
                        " requests"),
                    filteredRequests.length > 0 ? (React.createElement(react_2.DetailsList, { items: filteredRequests, columns: columns, setKey: "set-items", layoutMode: react_2.DetailsListLayoutMode.justified, selectionMode: react_2.SelectionMode.none })) : (React.createElement(react_2.Stack, { horizontalAlign: "center", verticalAlign: "center", style: { minHeight: '300px' } },
                        React.createElement(react_2.Icon, { iconName: "ClearFilter", style: { fontSize: '48px', color: '#ccc', marginBottom: '10px' } }),
                        React.createElement(react_2.Text, { variant: "large", style: { color: '#666' } }, "No requests found.")))))),
        React.createElement(react_2.Dialog, { hidden: !showDetailDialog, onDismiss: () => setShowDetailDialog(false), dialogContentProps: {
                type: react_2.DialogType.normal,
                title: 'Request Details',
                closeButtonAriaLabel: 'Close',
            } },
            selectedRequest && (React.createElement(react_2.Stack, { tokens: { childrenGap: 15 } },
                React.createElement(react_2.TextField, { label: "Employee", value: selectedRequest.employeeName, disabled: true }),
                React.createElement(react_2.TextField, { label: "Employee ID", value: selectedRequest.employeeId, disabled: true }),
                React.createElement(react_2.TextField, { label: "Serial NO", value: selectedRequest.serialNo, disabled: true }),
                React.createElement(react_2.TextField, { label: "Asset Name", value: selectedRequest.assetName, disabled: true }),
                React.createElement(react_2.TextField, { label: "Priority", value: selectedRequest.priority, disabled: true }),
                React.createElement(react_2.TextField, { label: "Reason for Request", value: selectedRequest.reason, multiline: true, rows: 4, disabled: true }),
                React.createElement(react_2.TextField, { label: "Requested Date", value: selectedRequest.requestDate ? new Date(selectedRequest.requestDate).toLocaleDateString() : 'N/A', disabled: true }),
                React.createElement(react_2.TextField, { label: "Status", value: selectedRequest.status, disabled: true }))),
            React.createElement(react_2.DialogFooter, null,
                React.createElement(react_2.PrimaryButton, { text: "Close", onClick: () => setShowDetailDialog(false) })))));
};
exports.MyRequests = MyRequests;
//# sourceMappingURL=MyRequests.js.map