"use strict";
self["webpackHotUpdate_56f8f2dc_8391_46cb_b74c_2806d6953063_0_0_1"]("inventory-management-web-part",{

/***/ 27885:
/*!****************************************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/components/IncidentHistory/IncidentHistory.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IncidentHistory: () => (/* binding */ IncidentHistory)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 85959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fluentui/react */ 72674);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fluentui/react */ 21314);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fluentui/react */ 29425);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fluentui/react */ 21262);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fluentui/react */ 12042);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @fluentui/react */ 79370);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @fluentui/react */ 37805);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @fluentui/react */ 74423);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @fluentui/react */ 52394);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @fluentui/react */ 27006);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @fluentui/react */ 18681);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @fluentui/react */ 67102);
/* harmony import */ var jspdf__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jspdf */ 28339);
/* harmony import */ var _services_IncidentService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/IncidentService */ 76911);
/* harmony import */ var _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../InventoryManagement.module.scss */ 99623);






const IncidentHistory = (props) => {
    const [incidents, setIncidents] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
    const [filteredIncidents, setFilteredIncidents] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
    const [searchText, setSearchText] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const [statusFilter, setStatusFilter] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
    const [selectedIncident, setSelectedIncident] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
    const [showDetailPanel, setShowDetailPanel] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const [tempResolution, setTempResolution] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const [toastNotification, setToastNotification] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
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
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        loadIncidents();
    }, [props.userEmail]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        filterIncidents();
    }, [searchText, statusFilter, incidents]);
    const loadIncidents = async () => {
        try {
            props.setIsLoading(true);
            const service = new _services_IncidentService__WEBPACK_IMPORTED_MODULE_2__.IncidentService(props.spContext);
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
            const service = new _services_IncidentService__WEBPACK_IMPORTED_MODULE_2__.IncidentService(props.spContext);
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
            const service = new _services_IncidentService__WEBPACK_IMPORTED_MODULE_2__.IncidentService(props.spContext);
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
    const handleDownloadReport = (incident) => {
        try {
            const doc = new jspdf__WEBPACK_IMPORTED_MODULE_1__.jsPDF();
            // Top header banner
            doc.setFillColor(0, 90, 158); // #005a9e (Deep blue theme color)
            doc.rect(0, 0, 210, 25, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("MSFT INVENTORY MANAGEMENT", 14, 16);
            // Document Title
            doc.setTextColor(51, 65, 85); // Slate 700
            doc.setFontSize(14);
            doc.text("INCIDENT REPORT", 14, 38);
            // Metadata
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 44);
            // Separator line
            doc.setDrawColor(226, 232, 240); // Slate 200
            doc.line(14, 48, 196, 48);
            // Specifications Section Title
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text("INCIDENT SPECIFICATIONS", 14, 58);
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
            printField("Incident ID:", incident.incidentId);
            printField("Asset Name:", incident.assetName);
            printField("Issue Type:", incident.issueType);
            printField("Priority:", incident.priority || "Medium");
            printField("Current Status:", incident.status || "Open");
            printField("Reported Date:", new Date(incident.reportedDate).toLocaleString());
            if (incident.assignedTo) {
                printField("Assigned To:", incident.assignedTo);
            }
            if (incident.resolvedDate) {
                printField("Resolved Date:", new Date(incident.resolvedDate).toLocaleString());
            }
            // Issue Description Title
            y += 4;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(51, 65, 85);
            doc.text("ISSUE DESCRIPTION", 14, y);
            y += 6;
            // Issue Description Box
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(51, 65, 85);
            const splitDesc = doc.splitTextToSize(incident.issueDescription || "No description provided.", 170);
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
            if (incident.resolution) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(11);
                doc.setTextColor(51, 65, 85);
                doc.text("RESOLUTION SUMMARY", 14, y);
                y += 6;
                doc.setFont("helvetica", "normal");
                doc.setFontSize(9.5);
                doc.setTextColor(22, 101, 52); // green 800
                const splitRes = doc.splitTextToSize(incident.resolution, 170);
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
            doc.save(`incident-${incident.incidentId}.pdf`);
        }
        catch (error) {
            console.error('Error generating PDF report:', error);
        }
    };
    const columns = [
        {
            key: 'incidentId',
            name: 'Incident ID',
            fieldName: 'incidentId',
            minWidth: 90,
            maxWidth: 120,
            isResizable: true,
            onRender: (item) => react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Text, null, item.incidentId),
        },
        {
            key: 'assetName',
            name: 'Asset',
            fieldName: 'assetName',
            minWidth: 100,
            maxWidth: 150,
            isResizable: true,
            onRender: (item) => react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Text, null, item.assetName),
        },
        {
            key: 'issueType',
            name: 'Issue Type',
            fieldName: 'issueType',
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item) => react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Text, null, item.issueType),
        },
        {
            key: 'priority',
            name: 'Priority',
            fieldName: 'priority',
            minWidth: 80,
            maxWidth: 100,
            isResizable: true,
            onRender: (item) => {
                return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: getPriorityBadgeStyle(item.priority) }, item.priority || 'Medium'));
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
                return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: getStatusBadgeStyle(item.status) }, item.status || 'Open'));
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
                    return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Text, null, "-");
                try {
                    return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Text, null, new Date(item.reportedDate).toLocaleDateString());
                }
                catch {
                    return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Text, null, item.reportedDate);
                }
            },
        },
        {
            key: 'actions',
            name: 'Actions',
            minWidth: 160,
            maxWidth: 220,
            isResizable: true,
            onRender: (item) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_5__.Stack, { horizontal: true, tokens: { childrenGap: 8 } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.PrimaryButton, { text: "View", onClick: () => handleViewDetails(item), styles: {
                        root: { padding: '2px 10px', fontSize: '11px', height: '24px' },
                    } }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.PrimaryButton, { text: "Download", onClick: () => handleDownloadReport(item), styles: {
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
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px' } },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_5__.Stack, { tokens: { childrenGap: 15 } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '5px' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.SearchBox, { placeholder: "Search by incident ID, asset name, or issue type...", value: searchText, onChange: (ev, newValue) => setSearchText(newValue || ''), onClear: () => setSearchText(''), styles: { root: { width: '100%', maxWidth: 400 } } }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.Dropdown, { placeholder: "Filter by status", options: statusFilterOptions, onChange: (ev, option) => setStatusFilter(option?.key || null), styles: { root: { width: 200 } } })),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Text, { variant: "small", style: { color: 'var(--text-muted, #6b7280)', display: 'block' } },
                "Showing ",
                filteredIncidents.length,
                " of ",
                incidents.length,
                " incidents"),
            filteredIncidents.length > 0 ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.DetailsList, { items: filteredIncidents, columns: columns, setKey: "incident-list", layoutMode: _fluentui_react__WEBPACK_IMPORTED_MODULE_10__.DetailsListLayoutMode.justified, selectionMode: _fluentui_react__WEBPACK_IMPORTED_MODULE_11__.SelectionMode.none })) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '250px',
                    border: '1px dashed #e5e7eb',
                    borderRadius: '8px',
                    padding: '30px'
                } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_12__.Icon, { iconName: "ClearFilter", style: { fontSize: '36px', color: '#9ca3af', marginBottom: '10px' } }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.Text, { variant: "medium", style: { color: '#6b7280' } }, "No incidents found.")))),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_13__.Panel, { isOpen: showDetailPanel, onDismiss: () => setShowDetailPanel(false), type: _fluentui_react__WEBPACK_IMPORTED_MODULE_14__.PanelType.medium, headerText: "Incident Details", closeButtonAriaLabel: "Close" }, selectedIncident && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '10px' } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: '#6b7280', fontSize: '0.88rem', margin: '0 0 20px 0' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Reported:"),
                " ",
                new Date(selectedIncident.reportedDate).toLocaleString()),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '12px 15px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #64748b' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: '1.5', whiteSpace: 'pre-wrap' } }, selectedIncident.issueDescription)),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '20px' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } }, "Incident Specifications"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].responsiveGridAlignItemsCenter, style: { fontSize: '0.88rem' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Incident ID:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, selectedIncident.incidentId)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Asset Name:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, selectedIncident.assetName)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Issue Type:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, selectedIncident.issueType)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280', marginRight: '6px' } }, "Priority:"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: getPriorityBadgeStyle(selectedIncident.priority) }, selectedIncident.priority || 'Medium')),
                    props.userRole === 'Admin' ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Status:"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.Dropdown, { selectedKey: selectedIncident.status || 'Open', options: [
                                { key: 'Open', text: 'Open' },
                                { key: 'In Progress', text: 'In Progress' },
                                { key: 'Resolved', text: 'Resolved' },
                                { key: 'Closed', text: 'Closed' }
                            ], onChange: (ev, option) => handleStatusChange(selectedIncident, option?.key), styles: { root: { width: 120 } } }))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280', marginRight: '6px' } }, "Status:"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: getStatusBadgeStyle(selectedIncident.status) }, selectedIncident.status || 'Open'))),
                    selectedIncident.assignedTo && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Assigned To:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, selectedIncident.assignedTo))))),
            props.userRole === 'Admin' && (selectedIncident.status === 'Resolved' || selectedIncident.status === 'Closed') ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_12__.Icon, { iconName: "CheckMark", style: { color: '#166534', fontWeight: 'bold' } }),
                    " Update Resolution Details"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_5__.Stack, { tokens: { childrenGap: 10 } },
                    selectedIncident.resolvedDate && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { fontSize: '0.88rem' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Resolved Date:"),
                        ' ',
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, new Date(selectedIncident.resolvedDate).toLocaleString()))),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_15__.TextField, { label: "Resolution Summary", multiline: true, rows: 3, value: tempResolution, onChange: (ev, newValue) => setTempResolution(newValue || ''), placeholder: "Describe how this issue was resolved..." }),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.PrimaryButton, { text: "Save Resolution", onClick: () => handleSaveResolution(selectedIncident), styles: { root: { alignSelf: 'flex-start' } } })))) : (selectedIncident.resolution && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_12__.Icon, { iconName: "CheckMark", style: { color: '#166534', fontWeight: 'bold' } }),
                    " Resolution Details"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' } },
                    selectedIncident.resolvedDate && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Resolved Date:"),
                        ' ',
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, new Date(selectedIncident.resolvedDate).toLocaleString()))),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #dcfce7', color: '#166534', fontSize: '0.88rem', lineHeight: '1.4', whiteSpace: 'pre-wrap' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Resolution Summary:"),
                        " ",
                        selectedIncident.resolution)))))))),
        toastNotification && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
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
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_12__.Icon, { iconName: "Accept", style: { color: '#166534', fontSize: '15px', fontWeight: 'bold' } })),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { flex: 1 } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { display: 'block', fontSize: '0.86rem', color: '#0f172a', marginBottom: '2px' } }, toastNotification.title || 'Success'),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.8rem', color: '#475569', lineHeight: 1.3, display: 'block' } }, toastNotification.message)),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_12__.Icon, { iconName: "Cancel", style: { cursor: 'pointer', color: '#94a3b8', fontSize: '12px', marginLeft: '6px' }, onClick: () => setToastNotification(null) })))));
};


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("e715f68d0344e0217072")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=inventory-management-web-part.91970b01a1fd627433bb.hot-update.js.map