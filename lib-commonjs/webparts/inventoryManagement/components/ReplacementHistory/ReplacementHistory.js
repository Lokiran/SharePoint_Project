"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplacementHistory = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("react");
const react_2 = require("@fluentui/react");
const NexerPdfReport_1 = require("../../utils/NexerPdfReport");
const ReplacementHistory_module_scss_1 = tslib_1.__importDefault(require("./ReplacementHistory.module.scss"));
const IncidentService_1 = require("../../services/IncidentService");
const DropdownConstants_1 = require("../../constants/DropdownConstants");
const strings = tslib_1.__importStar(require("InventoryManagementWebPartStrings"));
const LocalizationUtils_1 = require("../../utils/LocalizationUtils");
const ServiceRecordCards_1 = require("../service/ServiceRecordCards");
const listUi_1 = require("../common/listUi");
const ReplacementHistory = (props) => {
    const [replacements, setReplacements] = (0, react_1.useState)([]);
    const [selectedReplacement, setSelectedReplacement] = (0, react_1.useState)(null);
    const [showDetailPanel, setShowDetailPanel] = (0, react_1.useState)(false);
    const [tempResolution, setTempResolution] = (0, react_1.useState)('');
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
        loadReplacements();
    }, [props.userEmail]);
    const loadReplacements = async () => {
        try {
            props.setIsLoading(true);
            const service = new IncidentService_1.IncidentService(props.spContext);
            const isAdmin = props.userRole === 'Admin';
            const data = await service.getEmployeeReplacementHistory(props.userEmail, isAdmin);
            setReplacements(data);
        }
        catch (error) {
            console.error('Error loading replacement history:', error);
        }
        finally {
            props.setIsLoading(false);
        }
    };
    const handleViewDetails = (item) => {
        setSelectedReplacement(item);
        setTempResolution(item.resolution || '');
        setShowDetailPanel(true);
    };
    const handleStatusChange = async (rep, newStatus) => {
        try {
            props.setIsLoading(true);
            const service = new IncidentService_1.IncidentService(props.spContext);
            await service.updateIncidentStatus(rep.id, newStatus, rep.resolution);
            const updated = {
                ...rep,
                status: newStatus,
                resolvedDate: newStatus === 'Resolved' || newStatus === 'Closed' ? new Date().toISOString() : rep.resolvedDate
            };
            setSelectedReplacement(updated);
            await loadReplacements();
        }
        catch (error) {
            console.error('Error updating status:', error);
        }
        finally {
            props.setIsLoading(false);
        }
    };
    const handleSaveResolution = async (rep) => {
        try {
            props.setIsLoading(true);
            const service = new IncidentService_1.IncidentService(props.spContext);
            await service.updateIncidentStatus(rep.id, rep.status, tempResolution);
            const updated = {
                ...rep,
                resolution: tempResolution
            };
            setSelectedReplacement(updated);
            await loadReplacements();
        }
        catch (error) {
            console.error('Error saving resolution:', error);
        }
        finally {
            props.setIsLoading(false);
        }
    };
    const handleDownloadReport = (rep) => {
        try {
            const h = strings.IncidentHistory;
            const fields = [
                { label: h.PdfReplacementIdLabel, value: rep.incidentId },
                { label: h.PdfCurrentStatusLabel, value: rep.status || 'Open' },
                { label: h.PdfAssetNameLabel, value: (rep.assetName || '').trim() },
                { label: h.PdfPriorityLabel, value: rep.priority || 'Medium' },
                { label: h.PdfTypeLabel, value: h.ReplacementRequestType },
                { label: h.PdfReportedDateLabel, value: (0, NexerPdfReport_1.formatReportDate)(rep.reportedDate) }
            ];
            if (rep.assignedTo)
                fields.push({ label: h.PdfAssignedToLabel, value: rep.assignedTo });
            if (rep.resolvedDate)
                fields.push({ label: h.PdfResolvedDateLabel, value: (0, NexerPdfReport_1.formatReportDate)(rep.resolvedDate) });
            const sections = [
                { title: h.PdfReplacementReasonTitle, text: rep.issueDescription || h.PdfNoReason }
            ];
            if (rep.resolution)
                sections.push({ title: h.PdfResolutionSummaryTitle, text: rep.resolution, tone: 'positive' });
            (0, NexerPdfReport_1.saveNexerReport)({
                documentType: h.PdfReplacementReportTitle,
                reference: rep.incidentId || rep.id,
                heading: (rep.assetName || '').trim() || rep.incidentId,
                subheading: [h.ReplacementRequestType, (0, NexerPdfReport_1.formatReportDate)(rep.reportedDate, false)].filter(Boolean).join('  ·  '),
                status: rep.status || 'Open',
                fieldsTitle: h.PdfReplacementSpecs,
                fields,
                sections,
                productName: strings.Hero.Title,
                generatedText: (0, LocalizationUtils_1.formatString)(h.PdfGeneratedOn, (0, NexerPdfReport_1.formatReportDate)(new Date().toISOString()) || ''),
                fileName: `replacement-${rep.incidentId || rep.id}.pdf`
            });
        }
        catch (error) {
            console.error('Error generating PDF report:', error);
        }
    };
    return (React.createElement("div", { style: { marginTop: '20px' }, className: ReplacementHistory_module_scss_1.default.replacementHistory },
        React.createElement(ServiceRecordCards_1.ServiceRecordCards, { kind: "replacement", title: strings.Nav.ReplacementHistory, subtitle: strings.RecordLists.SubtitleReplacements, records: replacements, isAdmin: props.userRole === 'Admin', onView: handleViewDetails, onDownload: handleDownloadReport }),
        React.createElement(react_2.Panel, { isOpen: showDetailPanel, onDismiss: () => setShowDetailPanel(false), type: react_2.PanelType.medium, headerText: strings.IncidentHistory.ReplacementDetailsTitle, closeButtonAriaLabel: strings.Common.Close }, selectedReplacement && (React.createElement("div", { style: { marginTop: '10px' } },
            React.createElement("p", { style: { color: '#6b7280', fontSize: '0.88rem', margin: '0 0 20px 0' } },
                React.createElement("strong", null, strings.IncidentHistory.ReportedLabel),
                " ",
                (0, listUi_1.formatFlexibleDateTime)(selectedReplacement.reportedDate)),
            React.createElement("div", { style: { padding: '12px 15px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #64748b' } },
                React.createElement("p", { style: { margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: '1.5', whiteSpace: 'pre-wrap' } }, selectedReplacement.issueDescription)),
            React.createElement("div", { style: { backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '20px' } },
                React.createElement("h4", { style: { margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } }, strings.IncidentHistory.ReplacementSpecificationsTitle),
                React.createElement("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem', alignItems: 'center' } },
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280' } }, strings.IncidentHistory.LabelReplacementId),
                        " ",
                        React.createElement("strong", { style: { color: '#111827' } }, selectedReplacement.incidentId)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280' } }, strings.IncidentHistory.LabelAssetName),
                        " ",
                        React.createElement("strong", { style: { color: '#111827' } }, selectedReplacement.assetName)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280' } }, strings.IncidentHistory.LabelType),
                        " ",
                        React.createElement("strong", { style: { color: '#111827' } }, strings.IncidentHistory.ReplacementRequestType)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280', marginRight: '6px' } }, strings.IncidentHistory.LabelPriority),
                        React.createElement("span", { style: getPriorityBadgeStyle(selectedReplacement.priority) }, selectedReplacement.priority || 'Medium')),
                    props.userRole === 'Admin' ? (React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                        React.createElement("span", { style: { color: '#6b7280' } }, strings.IncidentHistory.LabelStatus),
                        React.createElement(react_2.Dropdown, { selectedKey: selectedReplacement.status || 'Open', options: DropdownConstants_1.INCIDENT_STATUS_OPTIONS, onChange: (ev, option) => handleStatusChange(selectedReplacement, option?.key), styles: { root: { width: 120 } } }))) : (React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280', marginRight: '6px' } }, strings.IncidentHistory.LabelStatus),
                        React.createElement("span", { style: getStatusBadgeStyle(selectedReplacement.status) }, selectedReplacement.status || 'Open'))),
                    selectedReplacement.assignedTo && (React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280' } }, strings.IncidentHistory.LabelAssignedTo),
                        " ",
                        React.createElement("strong", { style: { color: '#111827' } }, selectedReplacement.assignedTo))))),
            props.userRole === 'Admin' && (selectedReplacement.status === 'Resolved' || selectedReplacement.status === 'Closed') ? (React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' } },
                React.createElement("h4", { style: { margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' } },
                    React.createElement(react_2.Icon, { iconName: "CheckMark", style: { color: '#166534', fontWeight: 'bold' } }),
                    " ",
                    strings.IncidentHistory.UpdateResolutionTitle),
                React.createElement(react_2.Stack, { tokens: { childrenGap: 10 } },
                    selectedReplacement.resolvedDate && (React.createElement("div", { style: { fontSize: '0.88rem' } },
                        React.createElement("span", { style: { color: '#6b7280' } }, strings.IncidentHistory.LabelResolvedDate),
                        ' ',
                        React.createElement("strong", { style: { color: '#111827' } }, new Date(selectedReplacement.resolvedDate).toLocaleString()))),
                    React.createElement(react_2.TextField, { label: strings.IncidentHistory.ResolutionSummaryLabel, multiline: true, rows: 3, value: tempResolution, onChange: (ev, newValue) => setTempResolution(newValue || ''), placeholder: strings.IncidentHistory.ResolutionSummaryPlaceholderReplacement }),
                    React.createElement(react_2.PrimaryButton, { text: strings.IncidentHistory.SaveResolutionButton, onClick: () => handleSaveResolution(selectedReplacement), styles: { root: { alignSelf: 'flex-start' } } })))) : (selectedReplacement.resolution && (React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' } },
                React.createElement("h4", { style: { margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' } },
                    React.createElement(react_2.Icon, { iconName: "CheckMark", style: { color: '#166534', fontWeight: 'bold' } }),
                    " ",
                    strings.IncidentHistory.ResolutionDetailsTitle),
                React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' } },
                    selectedReplacement.resolvedDate && (React.createElement("div", null,
                        React.createElement("span", { style: { color: '#6b7280' } }, strings.IncidentHistory.LabelResolvedDate),
                        ' ',
                        React.createElement("strong", { style: { color: '#111827' } }, new Date(selectedReplacement.resolvedDate).toLocaleString()))),
                    React.createElement("div", { style: { padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #dcfce7', color: '#166534', fontSize: '0.88rem', lineHeight: '1.4', whiteSpace: 'pre-wrap' } },
                        React.createElement("strong", null, strings.IncidentHistory.ResolutionSummaryPrefix),
                        " ",
                        selectedReplacement.resolution))))))))));
};
exports.ReplacementHistory = ReplacementHistory;
//# sourceMappingURL=ReplacementHistory.js.map