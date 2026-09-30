"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentHistory = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("react");
const react_2 = require("@fluentui/react");
const NexerPdfReport_1 = require("../../utils/NexerPdfReport");
const IncidentService_1 = require("../../services/IncidentService");
const DropdownConstants_1 = require("../../constants/DropdownConstants");
const InventoryManagement_module_scss_1 = tslib_1.__importDefault(require("../InventoryManagement.module.scss"));
const strings = tslib_1.__importStar(require("InventoryManagementWebPartStrings"));
const LocalizationUtils_1 = require("../../utils/LocalizationUtils");
const IncidentHistory = (props) => {
    const [incidents, setIncidents] = (0, react_1.useState)([]);
    const [filteredIncidents, setFilteredIncidents] = (0, react_1.useState)([]);
    const [searchText, setSearchText] = (0, react_1.useState)('');
    const [statusFilter, setStatusFilter] = (0, react_1.useState)(null);
    const [selectedIncident, setSelectedIncident] = (0, react_1.useState)(null);
    const [showDetailPanel, setShowDetailPanel] = (0, react_1.useState)(false);
    const [tempResolution, setTempResolution] = (0, react_1.useState)('');
    const [toastNotification, setToastNotification] = (0, react_1.useState)(null);
    const triggerToast = (message, title = strings.IncidentHistory.ToastIncidentUpdatedTitle, isError = false) => {
        setToastNotification({ message, title, isError });
        setTimeout(() => setToastNotification(null), isError ? 8000 : 4000);
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
            triggerToast((0, LocalizationUtils_1.formatString)(strings.IncidentHistory.ToastStatusMessage, incident.incidentId || '#' + incident.id, newStatus), strings.IncidentHistory.ToastStatusUpdatedTitle);
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
            triggerToast((0, LocalizationUtils_1.formatString)(strings.IncidentHistory.ToastResolutionMessage, incident.incidentId || '#' + incident.id), strings.IncidentHistory.ToastResolutionSavedTitle);
        }
        catch (error) {
            console.error('Error saving resolution:', error);
        }
        finally {
            props.setIsLoading(false);
        }
    };
    const handleDownloadReport = (incident) => {
        try {
            const h = strings.IncidentHistory;
            const fields = [
                { label: h.PdfIncidentIdLabel, value: incident.incidentId },
                { label: h.PdfCurrentStatusLabel, value: incident.status || 'Open' },
                { label: h.PdfAssetNameLabel, value: (incident.assetName || '').trim() },
                { label: h.PdfPriorityLabel, value: incident.priority || 'Medium' },
                { label: h.PdfIssueTypeLabel, value: incident.issueType },
                { label: h.PdfReportedDateLabel, value: (0, NexerPdfReport_1.formatReportDate)(incident.reportedDate) }
            ];
            if (incident.assignedTo)
                fields.push({ label: h.PdfAssignedToLabel, value: incident.assignedTo });
            if (incident.resolvedDate)
                fields.push({ label: h.PdfResolvedDateLabel, value: (0, NexerPdfReport_1.formatReportDate)(incident.resolvedDate) });
            const sections = [
                { title: h.PdfIssueDescriptionTitle, text: incident.issueDescription || h.PdfNoDescription }
            ];
            if (incident.resolution)
                sections.push({ title: h.PdfResolutionSummaryTitle, text: incident.resolution, tone: 'positive' });
            (0, NexerPdfReport_1.saveNexerReport)({
                documentType: h.PdfIncidentReportTitle,
                reference: incident.incidentId || incident.id,
                heading: (incident.assetName || '').trim() || incident.incidentId,
                subheading: [incident.issueType, (0, NexerPdfReport_1.formatReportDate)(incident.reportedDate, false)].filter(Boolean).join('  ·  '),
                status: incident.status || 'Open',
                fieldsTitle: h.PdfIncidentSpecs,
                fields,
                sections,
                productName: strings.Hero.Title,
                generatedText: (0, LocalizationUtils_1.formatString)(h.PdfGeneratedOn, (0, NexerPdfReport_1.formatReportDate)(new Date().toISOString()) || ''),
                fileName: `incident-${incident.incidentId || incident.id}.pdf`
            });
        }
        catch (error) {
            console.error('Error generating PDF report:', error);
            triggerToast((0, LocalizationUtils_1.formatString)(strings.IncidentHistory.PdfDownloadFailed, incident.incidentId || incident.id), strings.IncidentHistory.PdfDownloadFailedTitle, true);
        }
    };
    const columns = [
        {
            key: 'incidentId',
            name: strings.IncidentHistory.ColIncidentId,
            fieldName: 'incidentId',
            minWidth: 90,
            maxWidth: 120,
            isResizable: true,
            onRender: (item) => (React.createElement("div", null,
                React.createElement(react_2.Text, null, item.incidentId),
                item.isLocalOnly && (React.createElement("span", { title: strings.IncidentHistory.LocalOnlyTooltip, "aria-label": strings.IncidentHistory.LocalOnlyTooltip, style: { display: 'inline-block', marginTop: 2, padding: '0 6px', borderRadius: 999, fontSize: 11, fontWeight: 600, lineHeight: '18px', color: '#8a3707', background: '#fff4ce' } }, strings.IncidentHistory.LocalOnlyTag)))),
        },
        {
            key: 'assetName',
            name: strings.IncidentHistory.ColAsset,
            fieldName: 'assetName',
            minWidth: 100,
            maxWidth: 150,
            isResizable: true,
            onRender: (item) => React.createElement(react_2.Text, null, item.assetName),
        },
        {
            key: 'issueType',
            name: strings.IncidentHistory.ColIssueType,
            fieldName: 'issueType',
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item) => React.createElement(react_2.Text, null, item.issueType),
        },
        {
            key: 'priority',
            name: strings.IncidentHistory.ColPriority,
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
            name: strings.IncidentHistory.ColStatus,
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
            name: strings.IncidentHistory.ColReported,
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
            name: strings.IncidentHistory.ColActions,
            minWidth: 160,
            maxWidth: 220,
            isResizable: true,
            onRender: (item) => (React.createElement(react_2.Stack, { horizontal: true, tokens: { childrenGap: 8 } },
                React.createElement(react_2.PrimaryButton, { text: strings.IncidentHistory.ButtonView, onClick: () => handleViewDetails(item), styles: {
                        root: { padding: '2px 10px', fontSize: '11px', height: '24px' },
                    } }),
                React.createElement(react_2.PrimaryButton, { text: strings.IncidentHistory.ButtonDownload, onClick: () => handleDownloadReport(item), styles: {
                        root: { padding: '2px 10px', fontSize: '11px', height: '24px' },
                    } }))),
        },
    ];
    const statusFilterOptions = [
        { key: '', text: strings.IncidentHistory.AllStatusOption },
        ...DropdownConstants_1.INCIDENT_STATUS_OPTIONS
    ];
    return (React.createElement("div", { style: { marginTop: '20px' } },
        React.createElement(react_2.Stack, { tokens: { childrenGap: 15 } },
            React.createElement("div", { style: { display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '5px' } },
                React.createElement(react_2.SearchBox, { placeholder: strings.IncidentHistory.SearchIncidentsPlaceholder, value: searchText, onChange: (ev, newValue) => setSearchText(newValue || ''), onClear: () => setSearchText(''), styles: { root: { width: '100%', maxWidth: 400 } } }),
                React.createElement(react_2.Dropdown, { placeholder: strings.IncidentHistory.FilterByStatusPlaceholder, options: statusFilterOptions, onChange: (ev, option) => setStatusFilter(option?.key || null), styles: { root: { width: 200 } } })),
            React.createElement(react_2.Text, { variant: "small", style: { color: 'var(--text-muted, #6b7280)', display: 'block' } }, (0, LocalizationUtils_1.formatString)(strings.IncidentHistory.ShowingIncidents, filteredIncidents.length, incidents.length)),
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
                React.createElement(react_2.Text, { variant: "medium", style: { color: '#6b7280' } }, strings.IncidentHistory.NoIncidentsFound)))),
        React.createElement(react_2.Panel, { isOpen: showDetailPanel, onDismiss: () => setShowDetailPanel(false), type: react_2.PanelType.medium, headerText: strings.IncidentHistory.IncidentDetailsTitle, closeButtonAriaLabel: strings.Common.Close }, selectedIncident && (React.createElement("div", { style: { marginTop: '10px' } },
            React.createElement("p", { style: { color: '#6b7280', fontSize: '0.88rem', margin: '0 0 20px 0' } },
                React.createElement("strong", null, strings.IncidentHistory.ReportedLabel),
                " ",
                new Date(selectedIncident.reportedDate).toLocaleString()),
            React.createElement("div", { style: { padding: '12px 15px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #64748b' } },
                React.createElement("p", { style: { margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: '1.5', whiteSpace: 'pre-wrap' } }, selectedIncident.issueDescription)),
            React.createElement("div", { style: { backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '20px' } },
                React.createElement("h4", { style: { margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } }, strings.IncidentHistory.IncidentSpecificationsTitle),
                React.createElement("div", { className: InventoryManagement_module_scss_1.default.responsiveGridAlignItemsCenter, style: { fontSize: '0.88rem' } },
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280' } }, strings.IncidentHistory.LabelIncidentId),
                        " ",
                        React.createElement("strong", { style: { color: '#111827' } }, selectedIncident.incidentId)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280' } }, strings.IncidentHistory.LabelAssetName),
                        " ",
                        React.createElement("strong", { style: { color: '#111827' } }, selectedIncident.assetName)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280' } }, strings.IncidentHistory.LabelIssueType),
                        " ",
                        React.createElement("strong", { style: { color: '#111827' } }, selectedIncident.issueType)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280', marginRight: '6px' } }, strings.IncidentHistory.LabelPriority),
                        React.createElement("span", { style: getPriorityBadgeStyle(selectedIncident.priority) }, selectedIncident.priority || 'Medium')),
                    props.userRole === 'Admin' ? (React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                        React.createElement("span", { style: { color: '#6b7280' } }, strings.IncidentHistory.LabelStatus),
                        React.createElement(react_2.Dropdown, { selectedKey: selectedIncident.status || 'Open', options: DropdownConstants_1.INCIDENT_STATUS_OPTIONS, onChange: (ev, option) => handleStatusChange(selectedIncident, option?.key), styles: { root: { width: 120 } } }))) : (React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280', marginRight: '6px' } }, strings.IncidentHistory.LabelStatus),
                        React.createElement("span", { style: getStatusBadgeStyle(selectedIncident.status) }, selectedIncident.status || 'Open'))),
                    selectedIncident.assignedTo && (React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280' } }, strings.IncidentHistory.LabelAssignedTo),
                        " ",
                        React.createElement("strong", { style: { color: '#111827' } }, selectedIncident.assignedTo))))),
            props.userRole === 'Admin' && (selectedIncident.status === 'Resolved' || selectedIncident.status === 'Closed') ? (React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' } },
                React.createElement("h4", { style: { margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' } },
                    React.createElement(react_2.Icon, { iconName: "CheckMark", style: { color: '#166534', fontWeight: 'bold' } }),
                    " ",
                    strings.IncidentHistory.UpdateResolutionTitle),
                React.createElement(react_2.Stack, { tokens: { childrenGap: 10 } },
                    selectedIncident.resolvedDate && (React.createElement("div", { style: { fontSize: '0.88rem' } },
                        React.createElement("span", { style: { color: '#6b7280' } }, strings.IncidentHistory.LabelResolvedDate),
                        ' ',
                        React.createElement("strong", { style: { color: '#111827' } }, new Date(selectedIncident.resolvedDate).toLocaleString()))),
                    React.createElement(react_2.TextField, { label: strings.IncidentHistory.ResolutionSummaryLabel, multiline: true, rows: 3, value: tempResolution, onChange: (ev, newValue) => setTempResolution(newValue || ''), placeholder: strings.IncidentHistory.ResolutionSummaryPlaceholderIncident }),
                    React.createElement(react_2.PrimaryButton, { text: strings.IncidentHistory.SaveResolutionButton, onClick: () => handleSaveResolution(selectedIncident), styles: { root: { alignSelf: 'flex-start' } } })))) : (selectedIncident.resolution && (React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' } },
                React.createElement("h4", { style: { margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' } },
                    React.createElement(react_2.Icon, { iconName: "CheckMark", style: { color: '#166534', fontWeight: 'bold' } }),
                    " ",
                    strings.IncidentHistory.ResolutionDetailsTitle),
                React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' } },
                    selectedIncident.resolvedDate && (React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280' } }, strings.IncidentHistory.LabelResolvedDate),
                        ' ',
                        React.createElement("strong", { style: { color: '#111827' } }, new Date(selectedIncident.resolvedDate).toLocaleString()))),
                    React.createElement("div", { style: { padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #dcfce7', color: '#166534', fontSize: '0.88rem', lineHeight: '1.4', whiteSpace: 'pre-wrap' } },
                        React.createElement("strong", null, strings.IncidentHistory.ResolutionSummaryPrefix),
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
                borderLeft: `5px solid ${toastNotification.isError ? '#c50f1f' : '#10b981'}`,
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
                    backgroundColor: toastNotification.isError ? '#fde7e9' : '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                } },
                React.createElement(react_2.Icon, { iconName: toastNotification.isError ? 'ErrorBadge' : 'Accept', style: { color: toastNotification.isError ? '#c50f1f' : '#166534', fontSize: '15px', fontWeight: 'bold' } })),
            React.createElement("div", { style: { flex: 1 } },
                React.createElement("strong", { style: { display: 'block', fontSize: '0.86rem', color: '#0f172a', marginBottom: '2px' } }, toastNotification.title || 'Success'),
                React.createElement("span", { style: { fontSize: '0.8rem', color: '#475569', lineHeight: 1.3, display: 'block' } }, toastNotification.message)),
            React.createElement(react_2.Icon, { iconName: "Cancel", style: { cursor: 'pointer', color: '#94a3b8', fontSize: '12px', marginLeft: '6px' }, onClick: () => setToastNotification(null) })))));
};
exports.IncidentHistory = IncidentHistory;
//# sourceMappingURL=IncidentHistory.js.map