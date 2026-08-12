"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentHistory = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("react");
const react_2 = require("@fluentui/react");
const IncidentService_1 = require("../../services/IncidentService");
const InventoryManagement_module_scss_1 = tslib_1.__importDefault(require("../InventoryManagement.module.scss"));
const NexerHeader_1 = require("../shared/NexerHeader");
const NexerTheme_1 = require("../../utils/NexerTheme");
const IncidentHistory = (props) => {
    const [incidents, setIncidents] = (0, react_1.useState)([]);
    const [filteredIncidents, setFilteredIncidents] = (0, react_1.useState)([]);
    const [searchText, setSearchText] = (0, react_1.useState)('');
    const [statusFilter, setStatusFilter] = (0, react_1.useState)(null);
    const [selectedIncident, setSelectedIncident] = (0, react_1.useState)(null);
    const [showDetailPanel, setShowDetailPanel] = (0, react_1.useState)(false);
    const [tempResolution, setTempResolution] = (0, react_1.useState)('');
    const [toastNotification, setToastNotification] = (0, react_1.useState)(null);
    const triggerToast = (message, title = 'Incident Updated') => {
        setToastNotification({ message, title });
        setTimeout(() => setToastNotification(null), 4000);
    };
    const getPriorityBadgeStyle = (priority) => {
        const p = priority || 'Medium';
        let backgroundColor = '#f3f4f6';
        let color = '#4b5563';
        if (p === 'High' || p === 'Critical') {
            backgroundColor = '#fee2e2';
            color = '#b91c1c';
        }
        else if (p === 'Low') {
            backgroundColor = '#dbeafe';
            color = '#1e3a8a';
        }
        return {
            backgroundColor,
            color,
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'inline-block'
        };
    };
    const getStatusBadgeStyle = (status) => {
        const s = status || 'Open';
        let backgroundColor = '#fee2e2';
        let color = '#991b1b';
        if (s === 'In Progress') {
            backgroundColor = '#fef3c7';
            color = '#92400e';
        }
        else if (s === 'Resolved') {
            backgroundColor = '#dcfce7';
            color = '#166534';
        }
        else if (s === 'Closed') {
            backgroundColor = '#f3f4f6';
            color = '#4b5563';
        }
        return {
            backgroundColor,
            color,
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'inline-block',
            textAlign: 'center'
        };
    };
    (0, react_1.useEffect)(() => {
        loadIncidents();
    }, [props.userEmail]);
    (0, react_1.useEffect)(() => {
        filterIncidents();
    }, [searchText, statusFilter, incidents]);
    const loadIncidents = async () => {
        try {
            props.setIsLoading(true);
            const service = new IncidentService_1.IncidentService(props.spContext);
            const isAdmin = props.userRole === 'Admin';
            const data = await service.getEmployeeIncidentHistory(props.userEmail, isAdmin);
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
            filtered = filtered.filter((incident) => (incident.assetName || '').toLowerCase().includes(searchText.toLowerCase()) ||
                (incident.issueType || '').toLowerCase().includes(searchText.toLowerCase()) ||
                (incident.incidentId || '').toLowerCase().includes(searchText.toLowerCase()));
        }
        if (statusFilter) {
            filtered = filtered.filter((incident) => incident.status === statusFilter);
        }
        setFilteredIncidents(filtered);
    };
    const handleViewDetails = (item) => {
        setSelectedIncident(item);
        setTempResolution(item.resolution || '');
        setShowDetailPanel(true);
    };
    const handleStatusChange = async (incident, newStatus) => {
        try {
            props.setIsLoading(true);
            const service = new IncidentService_1.IncidentService(props.spContext);
            await service.updateIncidentStatus(incident.id, newStatus, incident.resolution);
            const updatedIncident = {
                ...incident,
                status: newStatus,
                resolvedDate: newStatus === 'Resolved' || newStatus === 'Closed' ? new Date().toISOString() : incident.resolvedDate
            };
            setSelectedIncident(updatedIncident);
            await loadIncidents();
            triggerToast(`Status for incident ${incident.incidentId || '#' + incident.id} updated to '${newStatus}'.`, 'Status Updated');
        }
        catch (error) {
            console.error('Error updating status:', error);
        }
        finally {
            props.setIsLoading(false);
        }
    };
    const handleSaveResolution = async (incident) => {
        try {
            props.setIsLoading(true);
            const service = new IncidentService_1.IncidentService(props.spContext);
            await service.updateIncidentStatus(incident.id, incident.status, tempResolution);
            const updatedIncident = {
                ...incident,
                resolution: tempResolution
            };
            setSelectedIncident(updatedIncident);
            await loadIncidents();
            triggerToast(`Resolution summary saved for incident ${incident.incidentId || '#' + incident.id}.`, 'Resolution Saved');
        }
        catch (error) {
            console.error('Error saving resolution:', error);
        }
        finally {
            props.setIsLoading(false);
        }
    };
    const handleDownloadReport = async (incident) => {
        await (0, NexerTheme_1.generateNexerPdfReport)({
            reportTitle: 'INCIDENT REPORT',
            docTitle: 'INCIDENT SPECIFICATIONS',
            idLabel: 'Incident ID:',
            idValue: incident.incidentId,
            assetName: incident.assetName,
            typeLabel: 'Issue Type:',
            typeValue: incident.issueType,
            priority: incident.priority || 'Medium',
            status: incident.status || 'Open',
            reportedDate: incident.reportedDate,
            assignedTo: incident.assignedTo,
            resolvedDate: incident.resolvedDate,
            descriptionTitle: 'ISSUE DESCRIPTION',
            description: incident.issueDescription,
            resolution: incident.resolution,
            fileName: `incident-${incident.incidentId}.pdf`,
        });
    };
    const columns = [
        {
            key: 'incidentId',
            name: 'Incident ID',
            fieldName: 'incidentId',
            minWidth: 90,
            maxWidth: 120,
            isResizable: true,
            onRender: (item) => React.createElement(react_2.Text, null, item.incidentId),
        },
        {
            key: 'assetName',
            name: 'Asset',
            fieldName: 'assetName',
            minWidth: 100,
            maxWidth: 150,
            isResizable: true,
            onRender: (item) => React.createElement(react_2.Text, null, item.assetName),
        },
        {
            key: 'issueType',
            name: 'Issue Type',
            fieldName: 'issueType',
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item) => React.createElement(react_2.Text, null, item.issueType),
        },
        {
            key: 'priority',
            name: 'Priority',
            fieldName: 'priority',
            minWidth: 80,
            maxWidth: 100,
            isResizable: true,
            onRender: (item) => {
                return (React.createElement("span", { style: getPriorityBadgeStyle(item.priority) }, item.priority || 'Medium'));
            },
        },
        {
            key: 'status',
            name: 'Status',
            fieldName: 'status',
            minWidth: 90,
            maxWidth: 120,
            isResizable: true,
            onRender: (item) => {
                return (React.createElement("span", { style: getStatusBadgeStyle(item.status) }, item.status || 'Open'));
            },
        },
        {
            key: 'reportedDate',
            name: 'Reported',
            fieldName: 'reportedDate',
            minWidth: 90,
            maxWidth: 120,
            isResizable: true,
            onRender: (item) => {
                if (!item.reportedDate)
                    return React.createElement(react_2.Text, null, "-");
                try {
                    return React.createElement(react_2.Text, null, new Date(item.reportedDate).toLocaleDateString());
                }
                catch {
                    return React.createElement(react_2.Text, null, item.reportedDate);
                }
            },
        },
        {
            key: 'actions',
            name: 'Actions',
            minWidth: 160,
            maxWidth: 220,
            isResizable: true,
            onRender: (item) => (React.createElement(react_2.Stack, { horizontal: true, tokens: { childrenGap: 8 } },
                React.createElement(react_2.PrimaryButton, { text: "View", onClick: () => handleViewDetails(item), styles: {
                        root: { padding: '2px 10px', fontSize: '11px', height: '24px' },
                    } }),
                React.createElement(react_2.PrimaryButton, { text: "Download", onClick: () => handleDownloadReport(item), styles: {
                        root: { padding: '2px 10px', fontSize: '11px', height: '24px' },
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
    return (React.createElement("div", { style: { marginTop: '10px' } },
        React.createElement(NexerHeader_1.NexerHeader, { title: "Incident History", subtitle: "Track and manage reported hardware & software incidents" }),
        React.createElement(react_2.Stack, { tokens: { childrenGap: 15 } },
            React.createElement("div", { style: { display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '5px' } },
                React.createElement(react_2.SearchBox, { placeholder: "Search by incident ID, asset name, or issue type...", value: searchText, onChange: (ev, newValue) => setSearchText(newValue || ''), onClear: () => setSearchText(''), styles: { root: { width: '100%', maxWidth: 400 } } }),
                React.createElement(react_2.Dropdown, { placeholder: "Filter by status", options: statusFilterOptions, onChange: (ev, option) => setStatusFilter(option?.key || null), styles: { root: { width: 200 } } })),
            React.createElement(react_2.Text, { variant: "small", style: { color: 'var(--text-muted, #6b7280)', display: 'block' } },
                "Showing ",
                filteredIncidents.length,
                " of ",
                incidents.length,
                " incidents"),
            filteredIncidents.length > 0 ? (React.createElement(react_2.DetailsList, { items: filteredIncidents, columns: columns, setKey: "incident-list", layoutMode: react_2.DetailsListLayoutMode.justified, selectionMode: react_2.SelectionMode.none })) : (React.createElement("div", { style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '250px',
                    border: '1px dashed #e5e7eb',
                    borderRadius: '8px',
                    padding: '30px'
                } },
                React.createElement(react_2.Icon, { iconName: "ClearFilter", style: { fontSize: '36px', color: '#9ca3af', marginBottom: '10px' } }),
                React.createElement(react_2.Text, { variant: "medium", style: { color: '#6b7280' } }, "No incidents found.")))),
        React.createElement(react_2.Panel, { isOpen: showDetailPanel, onDismiss: () => setShowDetailPanel(false), type: react_2.PanelType.medium, headerText: "Incident Details", closeButtonAriaLabel: "Close" }, selectedIncident && (React.createElement("div", { style: { marginTop: '0px' } },
            React.createElement(NexerHeader_1.NexerHeader, { title: `Incident Details - ${selectedIncident.incidentId}`, subtitle: `Reported: ${new Date(selectedIncident.reportedDate).toLocaleString()}`, isPanel: true }),
            React.createElement("div", { style: { padding: '12px 15px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #64748b' } },
                React.createElement("p", { style: { margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: '1.5', whiteSpace: 'pre-wrap' } }, selectedIncident.issueDescription)),
            React.createElement("div", { style: { backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '20px' } },
                React.createElement("h4", { style: { margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } }, "Incident Specifications"),
                React.createElement("div", { className: InventoryManagement_module_scss_1.default.responsiveGridAlignItemsCenter, style: { fontSize: '0.88rem' } },
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280' } }, "Incident ID:"),
                        " ",
                        React.createElement("strong", { style: { color: '#111827' } }, selectedIncident.incidentId)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280' } }, "Asset Name:"),
                        " ",
                        React.createElement("strong", { style: { color: '#111827' } }, selectedIncident.assetName)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280' } }, "Issue Type:"),
                        " ",
                        React.createElement("strong", { style: { color: '#111827' } }, selectedIncident.issueType)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280', marginRight: '6px' } }, "Priority:"),
                        React.createElement("span", { style: getPriorityBadgeStyle(selectedIncident.priority) }, selectedIncident.priority || 'Medium')),
                    props.userRole === 'Admin' ? (React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                        React.createElement("span", { style: { color: '#6b7280' } }, "Status:"),
                        React.createElement(react_2.Dropdown, { selectedKey: selectedIncident.status || 'Open', options: [
                                { key: 'Open', text: 'Open' },
                                { key: 'In Progress', text: 'In Progress' },
                                { key: 'Resolved', text: 'Resolved' },
                                { key: 'Closed', text: 'Closed' }
                            ], onChange: (ev, option) => handleStatusChange(selectedIncident, option?.key), styles: { root: { width: 120 } } }))) : (React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280', marginRight: '6px' } }, "Status:"),
                        React.createElement("span", { style: getStatusBadgeStyle(selectedIncident.status) }, selectedIncident.status || 'Open'))),
                    selectedIncident.assignedTo && (React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280' } }, "Assigned To:"),
                        " ",
                        React.createElement("strong", { style: { color: '#111827' } }, selectedIncident.assignedTo))))),
            props.userRole === 'Admin' && (selectedIncident.status === 'Resolved' || selectedIncident.status === 'Closed') ? (React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' } },
                React.createElement("h4", { style: { margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' } },
                    React.createElement(react_2.Icon, { iconName: "CheckMark", style: { color: '#166534', fontWeight: 'bold' } }),
                    " Update Resolution Details"),
                React.createElement(react_2.Stack, { tokens: { childrenGap: 10 } },
                    selectedIncident.resolvedDate && (React.createElement("div", { style: { fontSize: '0.88rem' } },
                        React.createElement("span", { style: { color: '#6b7280' } }, "Resolved Date:"),
                        ' ',
                        React.createElement("strong", { style: { color: '#111827' } }, new Date(selectedIncident.resolvedDate).toLocaleString()))),
                    React.createElement(react_2.TextField, { label: "Resolution Summary", multiline: true, rows: 3, value: tempResolution, onChange: (ev, newValue) => setTempResolution(newValue || ''), placeholder: "Describe how this issue was resolved..." }),
                    React.createElement(react_2.PrimaryButton, { text: "Save Resolution", onClick: () => handleSaveResolution(selectedIncident), styles: { root: { alignSelf: 'flex-start' } } })))) : (selectedIncident.resolution && (React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' } },
                React.createElement("h4", { style: { margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' } },
                    React.createElement(react_2.Icon, { iconName: "CheckMark", style: { color: '#166534', fontWeight: 'bold' } }),
                    " Resolution Details"),
                React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' } },
                    selectedIncident.resolvedDate && (React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280' } }, "Resolved Date:"),
                        ' ',
                        React.createElement("strong", { style: { color: '#111827' } }, new Date(selectedIncident.resolvedDate).toLocaleString()))),
                    React.createElement("div", { style: { padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #dcfce7', color: '#166534', fontSize: '0.88rem', lineHeight: '1.4', whiteSpace: 'pre-wrap' } },
                        React.createElement("strong", null, "Resolution Summary:"),
                        " ",
                        selectedIncident.resolution)))))))),
        toastNotification && (React.createElement("div", { style: {
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 100000,
                backgroundColor: '#ffffff',
                color: '#0f172a',
                padding: '14px 18px',
                borderRadius: '12px',
                boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.06)',
                borderLeft: '5px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                maxWidth: '380px',
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif'
            } },
            React.createElement("div", { style: {
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                } },
                React.createElement(react_2.Icon, { iconName: "Accept", style: { color: '#166534', fontSize: '15px', fontWeight: 'bold' } })),
            React.createElement("div", { style: { flex: 1 } },
                React.createElement("strong", { style: { display: 'block', fontSize: '0.86rem', color: '#0f172a', marginBottom: '2px' } }, toastNotification.title || 'Success'),
                React.createElement("span", { style: { fontSize: '0.8rem', color: '#475569', lineHeight: 1.3, display: 'block' } }, toastNotification.message)),
            React.createElement(react_2.Icon, { iconName: "Cancel", style: { cursor: 'pointer', color: '#94a3b8', fontSize: '12px', marginLeft: '6px' }, onClick: () => setToastNotification(null) })))));
};
exports.IncidentHistory = IncidentHistory;
//# sourceMappingURL=IncidentHistory.js.map