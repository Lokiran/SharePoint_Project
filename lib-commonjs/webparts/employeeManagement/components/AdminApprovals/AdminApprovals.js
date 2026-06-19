"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminApprovals = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("react");
const react_2 = require("@fluentui/react");
const react_cards_1 = require("@uifabric/react-cards");
const InventoryService_1 = require("../../services/InventoryService");
const cardTokens = { childrenMargin: 12 };
const AdminApprovals = (props) => {
    const [requests, setRequests] = (0, react_1.useState)([]);
    const [filteredRequests, setFilteredRequests] = (0, react_1.useState)([]);
    const [searchText, setSearchText] = (0, react_1.useState)('');
    const [message, setMessage] = (0, react_1.useState)(null);
    const [processingId, setProcessingId] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        loadPendingRequests();
    }, []);
    (0, react_1.useEffect)(() => {
        filterRequests();
    }, [searchText, requests]);
    const loadPendingRequests = async () => {
        try {
            props.setIsLoading(true);
            const service = new InventoryService_1.InventoryService(props.spContext);
            const data = await service.getPendingRequests();
            setRequests(data);
        }
        catch (error) {
            console.error('Error loading pending requests:', error);
            setMessage({ type: react_2.MessageBarType.error, text: 'Failed to load pending requests.' });
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
                req.employeeId.toLowerCase().includes(searchText.toLowerCase()) ||
                req.reason.toLowerCase().includes(searchText.toLowerCase()));
        }
        setFilteredRequests(filtered);
    };
    const handleApprove = async (item) => {
        try {
            setProcessingId(item.id);
            setMessage(null);
            const service = new InventoryService_1.InventoryService(props.spContext);
            await service.approveRequest(item.id, props.userName);
            setMessage({
                type: react_2.MessageBarType.success,
                text: `Successfully approved request for ${item.employeeName} (${item.assetName}). Asset link saved in MappingList.`,
            });
            // Reload pending items
            await loadPendingRequests();
        }
        catch (error) {
            console.error('Error approving request:', error);
            setMessage({ type: react_2.MessageBarType.error, text: `Approval failed: ${error.message || error}` });
        }
        finally {
            setProcessingId(null);
        }
    };
    const handleReject = async (item) => {
        try {
            setProcessingId(item.id);
            setMessage(null);
            const service = new InventoryService_1.InventoryService(props.spContext);
            await service.rejectRequest(item.id);
            setMessage({
                type: react_2.MessageBarType.warning,
                text: `Rejected request for ${item.employeeName} (${item.assetName}).`,
            });
            // Reload pending items
            await loadPendingRequests();
        }
        catch (error) {
            console.error('Error rejecting request:', error);
            setMessage({ type: react_2.MessageBarType.error, text: `Rejection failed: ${error.message || error}` });
        }
        finally {
            setProcessingId(null);
        }
    };
    const columns = [
        {
            key: 'employeeName',
            name: 'Employee Name',
            fieldName: 'employeeName',
            minWidth: 120,
            isResizable: true,
        },
        {
            key: 'employeeId',
            name: 'Employee ID',
            fieldName: 'employeeId',
            minWidth: 80,
            isResizable: true,
        },
        {
            key: 'assetName',
            name: 'Requested Asset',
            fieldName: 'assetName',
            minWidth: 120,
            isResizable: true,
        },
        {
            key: 'serialNo',
            name: 'Serial Number',
            fieldName: 'serialNo',
            minWidth: 100,
            isResizable: true,
        },
        {
            key: 'priority',
            name: 'Priority',
            minWidth: 80,
            isResizable: true,
            onRender: (item) => (React.createElement("span", { style: {
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: (item.priority || '').toLowerCase() === 'high' || (item.priority || '').toLowerCase() === 'urgent' || (item.priority || '').toLowerCase() === 'critical' ? '#d13438' : '#0078d4',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 600,
                } }, item.priority)),
        },
        {
            key: 'reason',
            name: 'Reason',
            fieldName: 'reason',
            minWidth: 150,
            isResizable: true,
        },
        {
            key: 'requestDate',
            name: 'Requested Date',
            minWidth: 100,
            isResizable: true,
            onRender: (item) => (React.createElement(react_2.Text, null, item.requestDate ? new Date(item.requestDate).toLocaleDateString() : 'N/A')),
        },
        {
            key: 'actions',
            name: 'Actions',
            minWidth: 180,
            onRender: (item) => {
                if (processingId === item.id) {
                    return React.createElement(react_2.Spinner, { size: react_2.SpinnerSize.small, label: "Processing..." });
                }
                return (React.createElement(react_2.Stack, { horizontal: true, tokens: { childrenGap: 10 } },
                    React.createElement(react_2.PrimaryButton, { text: "Approve", onClick: () => handleApprove(item), styles: {
                            root: { padding: '4px 12px', fontSize: '12px', height: '24px', backgroundColor: '#107c10', borderColor: '#107c10' },
                            rootHovered: { backgroundColor: '#0b590b', borderColor: '#0b590b' },
                        } }),
                    React.createElement(react_2.PrimaryButton, { text: "Reject", onClick: () => handleReject(item), styles: {
                            root: { padding: '4px 12px', fontSize: '12px', height: '24px', backgroundColor: '#a4262c', borderColor: '#a4262c' },
                            rootHovered: { backgroundColor: '#751b1f', borderColor: '#751b1f' },
                        } })));
            },
        },
    ];
    return (React.createElement(react_2.Stack, { tokens: { childrenGap: 20 } },
        React.createElement(react_2.Text, { variant: "xLarge", block: true, style: { fontWeight: 600 } }, "Admin Asset Request Approvals"),
        message && (React.createElement(react_2.MessageBar, { messageBarType: message.type, isMultiline: true, onDismiss: () => setMessage(null), dismissButtonAriaLabel: "Close" }, message.text)),
        React.createElement(react_cards_1.Card, null,
            React.createElement(react_cards_1.Card.Section, { tokens: cardTokens },
                React.createElement(react_2.Stack, { tokens: { childrenGap: 15 } },
                    React.createElement(react_2.SearchBox, { placeholder: "Search pending requests...", value: searchText, onChange: (ev, newValue) => setSearchText(newValue || '') }),
                    React.createElement(react_2.Text, { variant: "small", style: { color: '#666' } },
                        "Showing ",
                        filteredRequests.length,
                        " pending request(s)"),
                    filteredRequests.length > 0 ? (React.createElement(react_2.DetailsList, { items: filteredRequests, columns: columns, setKey: "set-items", layoutMode: react_2.DetailsListLayoutMode.justified, selectionMode: react_2.SelectionMode.none })) : (React.createElement(react_2.Stack, { horizontalAlign: "center", verticalAlign: "center", style: { minHeight: '200px' } },
                        React.createElement(react_2.Icon, { iconName: "Accept", style: { fontSize: '48px', color: '#ccc', marginBottom: '10px' } }),
                        React.createElement(react_2.Text, { variant: "large", style: { color: '#666' } }, "No pending asset requests found!"))))))));
};
exports.AdminApprovals = AdminApprovals;
//# sourceMappingURL=AdminApprovals.js.map