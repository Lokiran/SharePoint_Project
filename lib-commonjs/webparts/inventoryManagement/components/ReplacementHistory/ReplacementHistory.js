"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplacementHistory = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("react");
const react_2 = require("@fluentui/react");
const jspdf_1 = require("jspdf");
const ReplacementHistory_module_scss_1 = tslib_1.__importDefault(require("./ReplacementHistory.module.scss"));
const IncidentService_1 = require("../../services/IncidentService");
const DropdownConstants_1 = require("../../constants/DropdownConstants");
const strings = tslib_1.__importStar(require("InventoryManagementWebPartStrings"));
const LocalizationUtils_1 = require("../../utils/LocalizationUtils");
const ReplacementHistory = (props) => {
    const [replacements, setReplacements] = (0, react_1.useState)([]);
    const [filteredReplacements, setFilteredReplacements] = (0, react_1.useState)([]);
    const [searchText, setSearchText] = (0, react_1.useState)('');
    const [statusFilter, setStatusFilter] = (0, react_1.useState)(null);
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
    (0, react_1.useEffect)(() => {
        filterReplacements();
    }, [searchText, statusFilter, replacements]);
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
    const filterReplacements = () => {
        let filtered = [...replacements];
        if (searchText) {
            filtered = filtered.filter((rep) => (rep.assetName || '').toLowerCase().includes(searchText.toLowerCase()) ||
                (rep.incidentId || '').toLowerCase().includes(searchText.toLowerCase()));
        }
        if (statusFilter) {
            filtered = filtered.filter((rep) => rep.status === statusFilter);
        }
        setFilteredReplacements(filtered);
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
            const doc = new jspdf_1.jsPDF();
            // Top header banner
            doc.setFillColor(0, 90, 158); // #005a9e (Deep blue theme color)
            doc.rect(0, 0, 210, 25, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text(strings.IncidentHistory.PdfCompanyHeader, 14, 16);
            // Document Title
            doc.setTextColor(51, 65, 85); // Slate 700
            doc.setFontSize(14);
            doc.text(strings.IncidentHistory.PdfReplacementReportTitle, 14, 38);
            // Metadata
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text((0, LocalizationUtils_1.formatString)(strings.IncidentHistory.PdfGeneratedOn, new Date().toLocaleString()), 14, 44);
            // Separator line
            doc.setDrawColor(226, 232, 240); // Slate 200
            doc.line(14, 48, 196, 48);
            // Specifications Section Title
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text(strings.IncidentHistory.PdfReplacementSpecs, 14, 58);
            // Render Specifications Key-Value grid
            let y = 68;
            const printField = (label, value) => {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9);
                doc.setTextColor(100, 116, 139); // Slate 500
                doc.text(label, 14, y);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(9.5);
                doc.setTextColor(15, 23, 42); // Slate 900
                doc.text(value, 55, y);
                y += 8;
            };
            printField(strings.IncidentHistory.PdfReplacementIdLabel, rep.incidentId);
            printField(strings.IncidentHistory.PdfAssetNameLabel, rep.assetName);
            printField(strings.IncidentHistory.PdfTypeLabel, strings.IncidentHistory.ReplacementRequestType);
            printField(strings.IncidentHistory.PdfPriorityLabel, rep.priority || "Medium");
            printField(strings.IncidentHistory.PdfCurrentStatusLabel, rep.status || "Open");
            printField(strings.IncidentHistory.PdfReportedDateLabel, new Date(rep.reportedDate).toLocaleString());
            if (rep.assignedTo) {
                printField(strings.IncidentHistory.PdfAssignedToLabel, rep.assignedTo);
            }
            if (rep.resolvedDate) {
                printField(strings.IncidentHistory.PdfResolvedDateLabel, new Date(rep.resolvedDate).toLocaleString());
            }
            // Reason Title
            y += 4;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(51, 65, 85);
            doc.text(strings.IncidentHistory.PdfReplacementReasonTitle, 14, y);
            y += 6;
            // Reason Box
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(51, 65, 85);
            const splitDesc = doc.splitTextToSize(rep.issueDescription || strings.IncidentHistory.PdfNoReason, 170);
            const descHeight = splitDesc.length * 6 + 10;
            // Draw background box
            doc.setFillColor(248, 250, 252); // slate 50
            doc.setDrawColor(226, 232, 240); // slate 200
            doc.rect(14, y, 182, descHeight, 'FD');
            // Draw left accent bar
            doc.setFillColor(100, 116, 139); // slate 500
            doc.rect(14, y, 3, descHeight, 'F');
            // Draw text
            let textY = y + 8;
            splitDesc.forEach((line) => {
                doc.text(line, 22, textY);
                textY += 6;
            });
            y += descHeight + 10;
            // Resolution Details (if resolved/closed)
            if (rep.resolution) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(11);
                doc.setTextColor(51, 65, 85);
                doc.text(strings.IncidentHistory.PdfResolutionSummaryTitle, 14, y);
                y += 6;
                doc.setFont("helvetica", "normal");
                doc.setFontSize(9.5);
                doc.setTextColor(22, 101, 52); // green 800
                const splitRes = doc.splitTextToSize(rep.resolution, 170);
                const resHeight = splitRes.length * 6 + 10;
                // Draw green background box
                doc.setFillColor(240, 253, 244); // green 50
                doc.setDrawColor(220, 252, 231); // green 200
                doc.rect(14, y, 182, resHeight, 'FD');
                // Draw green left accent bar
                doc.setFillColor(22, 101, 52); // green 800
                doc.rect(14, y, 3, resHeight, 'F');
                // Draw resolution text
                let resTextY = y + 8;
                splitRes.forEach((line) => {
                    doc.text(line, 22, resTextY);
                    resTextY += 6;
                });
            }
            doc.save(`replacement-${rep.incidentId}.pdf`);
        }
        catch (error) {
            console.error('Error generating PDF report:', error);
        }
    };
    const columns = [
        {
            key: 'replacementId',
            name: strings.IncidentHistory.ColReplacementId,
            fieldName: 'incidentId',
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item) => React.createElement(react_2.Text, null, item.incidentId),
        },
        {
            key: 'assetName',
            name: strings.IncidentHistory.ColAsset,
            fieldName: 'assetName',
            minWidth: 120,
            maxWidth: 180,
            isResizable: true,
            onRender: (item) => React.createElement(react_2.Text, null, item.assetName),
        },
        {
            key: 'issueType',
            name: strings.IncidentHistory.ColType,
            fieldName: 'issueType',
            minWidth: 120,
            maxWidth: 150,
            isResizable: true,
            onRender: () => React.createElement(react_2.Text, null, strings.IncidentHistory.ReplacementRequestType),
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
            minWidth: 100,
            maxWidth: 130,
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
    return (React.createElement("div", { style: { marginTop: '20px' }, className: ReplacementHistory_module_scss_1.default.replacementHistory },
        React.createElement(react_2.Stack, { tokens: { childrenGap: 15 } },
            React.createElement("div", { style: { display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '5px' } },
                React.createElement(react_2.SearchBox, { placeholder: strings.IncidentHistory.SearchReplacementsPlaceholder, value: searchText, onChange: (ev, newValue) => setSearchText(newValue || ''), onClear: () => setSearchText(''), styles: { root: { width: '100%', maxWidth: 400 } } }),
                React.createElement(react_2.Dropdown, { placeholder: strings.IncidentHistory.FilterByStatusPlaceholder, options: statusFilterOptions, onChange: (ev, option) => setStatusFilter(option?.key || null), styles: { root: { width: 200 } } })),
            React.createElement(react_2.Text, { variant: "small", style: { color: 'var(--text-muted, #6b7280)', display: 'block' } }, (0, LocalizationUtils_1.formatString)(strings.IncidentHistory.ShowingReplacements, filteredReplacements.length, replacements.length)),
            filteredReplacements.length > 0 ? (React.createElement(react_2.DetailsList, { items: filteredReplacements, columns: columns, setKey: "replacement-list", layoutMode: react_2.DetailsListLayoutMode.justified, selectionMode: react_2.SelectionMode.none })) : (React.createElement("div", { style: {
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
                React.createElement(react_2.Text, { variant: "medium", style: { color: '#6b7280' } }, strings.IncidentHistory.NoReplacementsFound)))),
        React.createElement(react_2.Panel, { isOpen: showDetailPanel, onDismiss: () => setShowDetailPanel(false), type: react_2.PanelType.medium, headerText: strings.IncidentHistory.ReplacementDetailsTitle, closeButtonAriaLabel: strings.Common.Close }, selectedReplacement && (React.createElement("div", { style: { marginTop: '10px' } },
            React.createElement("p", { style: { color: '#6b7280', fontSize: '0.88rem', margin: '0 0 20px 0' } },
                React.createElement("strong", null, strings.IncidentHistory.ReportedLabel),
                " ",
                new Date(selectedReplacement.reportedDate).toLocaleString()),
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