"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentHistory = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("react");
const react_2 = require("@fluentui/react");
const react_cards_1 = require("@uifabric/react-cards");
const InventoryService_1 = require("../../services/InventoryService");
const cardTokens = { childrenMargin: 12 };
const statusBadgeStyles = {
    Open: { backgroundColor: '#e74c3c', color: '#fff' },
    'In Progress': { backgroundColor: '#f39c12', color: '#fff' },
    Resolved: { backgroundColor: '#27ae60', color: '#fff' },
    Closed: { backgroundColor: '#666', color: '#fff' },
};
const IncidentHistory = (props) => {
    const [incidents, setIncidents] = (0, react_1.useState)([]);
    const [filteredIncidents, setFilteredIncidents] = (0, react_1.useState)([]);
    const [searchText, setSearchText] = (0, react_1.useState)('');
    const [statusFilter, setStatusFilter] = (0, react_1.useState)(null);
    const [selectedIncident, setSelectedIncident] = (0, react_1.useState)(null);
    const [showDetailDialog, setShowDetailDialog] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        loadIncidents();
    }, [props.userEmail]);
    (0, react_1.useEffect)(() => {
        filterIncidents();
    }, [searchText, statusFilter, incidents]);
    const loadIncidents = async () => {
        try {
            props.setIsLoading(true);
            const service = new InventoryService_1.InventoryService(props.spContext);
            const data = await service.getEmployeeIncidentHistory(props.userEmail);
            setIncidents(data);
        }
        catch (error) {
            console.error('Error loading incident history:', error);
        }
        finally {
            props.setIsLoading(false);
        }
    };
    const filterIncidents = () => {
        let filtered = [...incidents];
        if (searchText) {
            filtered = filtered.filter((incident) => incident.assetName.toLowerCase().includes(searchText.toLowerCase()) ||
                incident.issueType.toLowerCase().includes(searchText.toLowerCase()) ||
                incident.incidentId.toLowerCase().includes(searchText.toLowerCase()));
        }
        if (statusFilter) {
            filtered = filtered.filter((incident) => incident.status === statusFilter);
        }
        setFilteredIncidents(filtered);
    };
    const handleViewDetails = (item) => {
        setSelectedIncident(item);
        setShowDetailDialog(true);
    };
    const handleDownloadReport = (incident) => {
        const report = `
Incident Report
==========================
Incident ID: ${incident.incidentId}
Asset: ${incident.assetName}
Issue Type: ${incident.issueType}
Priority: ${incident.priority}
Status: ${incident.status}
Reported Date: ${new Date(incident.reportedDate).toLocaleString()}
${incident.resolvedDate ? `Resolved Date: ${new Date(incident.resolvedDate).toLocaleString()}` : ''}
${incident.assignedTo ? `Assigned To: ${incident.assignedTo}` : ''}

Issue Description:
${incident.issueDescription}

${incident.resolution ? `Resolution:\n${incident.resolution}` : ''}

Generated: ${new Date().toLocaleString()}
    `;
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(report));
        element.setAttribute('download', `incident-${incident.incidentId}.txt`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };
    const columns = [
        {
            key: 'incidentId',
            name: 'Incident ID',
            minWidth: 100,
            onRender: (item) => React.createElement(react_2.Text, null, item.incidentId),
        },
        {
            key: 'assetName',
            name: 'Asset',
            minWidth: 120,
            onRender: (item) => React.createElement(react_2.Text, null, item.assetName),
        },
        {
            key: 'issueType',
            name: 'Issue Type',
            minWidth: 120,
            onRender: (item) => React.createElement(react_2.Text, null, item.issueType),
        },
        {
            key: 'priority',
            name: 'Priority',
            minWidth: 100,
            onRender: (item) => (React.createElement(react_2.Text, { style: { fontWeight: 600, color: item.priority === 'Critical' ? '#e74c3c' : item.priority === 'High' ? '#f39c12' : '#0078d4' } }, item.priority)),
        },
        {
            key: 'status',
            name: 'Status',
            minWidth: 120,
            onRender: (item) => (React.createElement("div", { style: {
                    ...statusBadgeStyles[item.status],
                    padding: '6px 12px',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '12px',
                } }, item.status)),
        },
        {
            key: 'reportedDate',
            name: 'Reported',
            minWidth: 120,
            onRender: (item) => (React.createElement(react_2.Text, null, new Date(item.reportedDate).toLocaleDateString())),
        },
        {
            key: 'actions',
            name: 'Actions',
            minWidth: 150,
            onRender: (item) => (React.createElement(react_2.Stack, { horizontal: true, tokens: { childrenGap: 10 } },
                React.createElement(react_2.PrimaryButton, { text: "View", onClick: () => handleViewDetails(item), styles: {
                        root: { padding: '4px 12px', fontSize: '12px', height: '24px' },
                    } }),
                React.createElement(react_2.PrimaryButton, { text: "Download", onClick: () => handleDownloadReport(item), styles: {
                        root: { padding: '4px 12px', fontSize: '12px', height: '24px' },
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
    return (React.createElement(react_2.Stack, { tokens: { childrenGap: 20 } },
        React.createElement(react_2.Text, { variant: "xLarge", block: true, style: { fontWeight: 600 } }, "Incident History"),
        React.createElement(react_cards_1.Card, null,
            React.createElement(react_cards_1.Card.Section, { tokens: cardTokens },
                React.createElement(react_2.Stack, { tokens: { childrenGap: 15 } },
                    React.createElement(react_2.Stack, { horizontal: true, tokens: { childrenGap: 15 }, wrap: true },
                        React.createElement(react_2.SearchBox, { placeholder: "Search by incident ID, asset name, or issue type...", value: searchText, onChange: (ev, newValue) => setSearchText(newValue || ''), style: { flex: 1, minWidth: '250px' } }),
                        React.createElement(react_2.Dropdown, { placeholder: "Filter by status", options: statusFilterOptions, onChange: (ev, option) => setStatusFilter(option?.key), style: { width: '200px' } })),
                    React.createElement(react_2.Text, { variant: "small", style: { color: '#666' } },
                        "Showing ",
                        filteredIncidents.length,
                        " of ",
                        incidents.length,
                        " incidents"),
                    filteredIncidents.length > 0 ? (React.createElement(react_2.DetailsList, { items: filteredIncidents, columns: columns, setKey: "set-items", layoutMode: react_2.DetailsListLayoutMode.justified, selectionMode: react_2.SelectionMode.none })) : (React.createElement(react_2.Stack, { horizontalAlign: "center", verticalAlign: "center", style: { minHeight: '300px' } },
                        React.createElement(react_2.Icon, { iconName: "ClearFilter", style: { fontSize: '48px', color: '#ccc', marginBottom: '10px' } }),
                        React.createElement(react_2.Text, { variant: "large", style: { color: '#666' } }, "No incidents found.")))))),
        React.createElement(react_2.Dialog, { hidden: !showDetailDialog, onDismiss: () => setShowDetailDialog(false), dialogContentProps: {
                type: react_2.DialogType.normal,
                title: 'Incident Details',
                closeButtonAriaLabel: 'Close',
            }, minWidth: 600 },
            selectedIncident && (React.createElement(react_2.Stack, { tokens: { childrenGap: 15 } },
                React.createElement(react_2.TextField, { label: "Incident ID", value: selectedIncident.incidentId, disabled: true }),
                React.createElement(react_2.TextField, { label: "Asset Name", value: selectedIncident.assetName, disabled: true }),
                React.createElement(react_2.TextField, { label: "Issue Type", value: selectedIncident.issueType, disabled: true }),
                React.createElement(react_2.TextField, { label: "Priority", value: selectedIncident.priority, disabled: true }),
                React.createElement(react_2.TextField, { label: "Status", value: selectedIncident.status, disabled: true }),
                React.createElement(react_2.TextField, { label: "Issue Description", value: selectedIncident.issueDescription, multiline: true, rows: 4, disabled: true }),
                selectedIncident.resolution && (React.createElement(react_2.TextField, { label: "Resolution", value: selectedIncident.resolution, multiline: true, rows: 4, disabled: true })),
                React.createElement(react_2.TextField, { label: "Reported Date", value: new Date(selectedIncident.reportedDate).toLocaleString(), disabled: true }),
                selectedIncident.resolvedDate && (React.createElement(react_2.TextField, { label: "Resolved Date", value: new Date(selectedIncident.resolvedDate).toLocaleString(), disabled: true })),
                selectedIncident.assignedTo && (React.createElement(react_2.TextField, { label: "Assigned To", value: selectedIncident.assignedTo, disabled: true })))),
            React.createElement(react_2.DialogFooter, null,
                React.createElement(react_2.PrimaryButton, { text: "Close", onClick: () => setShowDetailDialog(false) })))));
};
exports.IncidentHistory = IncidentHistory;
//# sourceMappingURL=IncidentHistory.js.map