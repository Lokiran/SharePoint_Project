"use strict";
self["webpackHotUpdate_56f8f2dc_8391_46cb_b74c_2806d6953063_0_0_1"]("inventory-management-web-part",{

/***/ 50513:
/*!****************************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/components/InventoryManagement.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InventoryManagement)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 85959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./InventoryManagement.module.scss */ 99623);
/* harmony import */ var _microsoft_sp_lodash_subset__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @microsoft/sp-lodash-subset */ 50529);
/* harmony import */ var _microsoft_sp_lodash_subset__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_lodash_subset__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _InventoryList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./InventoryList */ 4938);
/* harmony import */ var _MyAssignedAssetsView__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./MyAssignedAssetsView */ 95966);
/* harmony import */ var _MyRequestsView__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./MyRequestsView */ 12645);
/* harmony import */ var _RequestList__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./RequestList */ 82867);
/* harmony import */ var _pnpjsConfig__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../pnpjsConfig */ 17694);
/* harmony import */ var _AssetForm__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./AssetForm */ 5652);
/* harmony import */ var _RequestForm__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./RequestForm */ 28333);
/* harmony import */ var _EventStream__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./EventStream */ 19178);
/* harmony import */ var _ReturnAssetForm__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./ReturnAssetForm */ 21094);
/* harmony import */ var _ReturnRequestList__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ReturnRequestList */ 18397);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @fluentui/react */ 46643);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @fluentui/react */ 21314);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @fluentui/react */ 52394);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @fluentui/react */ 63208);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @fluentui/react */ 53918);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! @fluentui/react */ 27006);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @fluentui/react */ 18681);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! @fluentui/react */ 12042);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! @fluentui/react */ 67102);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! @fluentui/react */ 29425);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! @fluentui/react */ 5613);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! @fluentui/react */ 92070);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! @fluentui/react */ 15369);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! @fluentui/react */ 79370);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! @fluentui/react */ 37805);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! @fluentui/react */ 74423);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! @fluentui/react */ 20472);
/* harmony import */ var chart_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! chart.js */ 55277);
/* harmony import */ var react_chartjs_2__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! react-chartjs-2 */ 86766);
/* harmony import */ var _pnp_sp_site_users_web__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @pnp/sp/site-users/web */ 43500);
/* harmony import */ var _pnp_sp_site_groups_web__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @pnp/sp/site-groups/web */ 49036);
/* harmony import */ var _data_mockData__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../data/mockData */ 27962);
/* harmony import */ var _services_InventoryService__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../services/InventoryService */ 29619);
/* harmony import */ var _Dashboard__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./Dashboard */ 71422);
/* harmony import */ var _AssetTracking__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./AssetTracking */ 20867);
/* harmony import */ var _NotificationCenter__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./NotificationCenter */ 58350);
/* harmony import */ var _IncidentRequest_IncidentRequestModule__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./IncidentRequest/IncidentRequestModule */ 19581);
/* harmony import */ var _IncidentHistory_IncidentHistory__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./IncidentHistory/IncidentHistory */ 27885);
/* harmony import */ var _AssetLifecycleDiagram__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./AssetLifecycleDiagram */ 29643);
















chart_js__WEBPACK_IMPORTED_MODULE_13__.Chart.register(chart_js__WEBPACK_IMPORTED_MODULE_13__.CategoryScale, chart_js__WEBPACK_IMPORTED_MODULE_13__.LinearScale, chart_js__WEBPACK_IMPORTED_MODULE_13__.ArcElement, chart_js__WEBPACK_IMPORTED_MODULE_13__.Title, chart_js__WEBPACK_IMPORTED_MODULE_13__.Tooltip, chart_js__WEBPACK_IMPORTED_MODULE_13__.Legend);










class InventoryManagement extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor(props) {
        super(props);
        this._isRequestOwnedByCurrentUser = (requesterName, currentUser) => {
            const normalize = (value) => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const requestOwner = normalize(requesterName);
            const activeUser = normalize(currentUser);
            if (!requestOwner || !activeUser) {
                return false;
            }
            return requestOwner === activeUser || requestOwner.includes(activeUser) || activeUser.includes(requestOwner);
        };
        this._isAssetAssignedToCurrentUser = (item, currentUser) => {
            const normalize = (value) => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const activeUser = normalize(currentUser);
            if (!activeUser)
                return false;
            const assignedNorm = normalize(item.assignedTo);
            const isAssigned = assignedNorm && (assignedNorm === activeUser || assignedNorm.includes(activeUser) || activeUser.includes(assignedNorm));
            const isNoted = (item.note || '').toLowerCase().includes('assigned to:') && normalize(item.note).includes(activeUser);
            const isStatus = (item.status || '').toLowerCase().includes('assigned to:') && normalize(item.status).includes(activeUser);
            return !!(isAssigned || isNoted || isStatus);
        };
        this._getNotifications = () => {
            const { items, requests, activeUserDisplayName } = this.state;
            const currentUser = activeUserDisplayName;
            const effectiveRole = this.state.previewRole || this.state.userRole;
            const isAdminOrManager = effectiveRole === 'Admin' || effectiveRole === 'Inventory Manager';
            const isAdmin = effectiveRole === 'Admin';
            const notifications = [];
            const readIds = new Set(this.state.readNotificationIds);
            const clearedIds = new Set(this.state.clearedNotificationIds);
            const normalize = (value) => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const activeUserNorm = normalize(currentUser);
            const formatTime = (isoString) => {
                if (!isoString)
                    return '';
                try {
                    const d = new Date(isoString);
                    const pad = (n) => n < 10 ? '0' + n : '' + n;
                    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
                }
                catch {
                    return isoString;
                }
            };
            // 1. Generate Asset Request Notifications
            requests.forEach(req => {
                const requesterNorm = normalize(req.requesterName);
                const isMyRequest = requesterNorm && (requesterNorm === activeUserNorm || activeUserNorm.includes(requesterNorm) || requesterNorm.includes(activeUserNorm));
                if (isAdminOrManager) {
                    // Pending requests notify Admins & Managers
                    if (req.status === 'Pending') {
                        const id = `req-pending-${req.id}`;
                        if (!clearedIds.has(id)) {
                            notifications.push({
                                id,
                                title: "Asset Request Pending",
                                message: `${req.requesterName} requested ${req.quantity}x ${req.assetTitle} (Reason: ${req.reason || "None"})`,
                                type: 'info',
                                timestamp: formatTime(req.requestDate),
                                isRead: readIds.has(id),
                                actionLink: 'Approvals',
                                category: 'Request'
                            });
                        }
                    }
                }
                if (isMyRequest) {
                    // Approved/Declined requests notify the Employee
                    if (req.status === 'Approved' || req.status === 'Declined') {
                        const id = `req-resolved-${req.id}-${req.status}`;
                        if (!clearedIds.has(id)) {
                            notifications.push({
                                id,
                                title: req.status === 'Approved' ? "Request Approved" : "Request Declined",
                                message: req.status === 'Approved'
                                    ? `Your request for ${req.quantity}x ${req.assetTitle} has been approved.`
                                    : `Your request for ${req.quantity}x ${req.assetTitle} has been declined.`,
                                type: req.status === 'Approved' ? 'success' : 'error',
                                timestamp: formatTime(req.requestDate),
                                isRead: readIds.has(id),
                                actionLink: 'My Requests',
                                category: 'Request'
                            });
                        }
                    }
                }
                if (isAdmin && req.status === 'Approved' && req.assetStatus === 'Pending') {
                    const id = `req-assign-admin-${req.id}`;
                    if (!clearedIds.has(id)) {
                        notifications.push({
                            id,
                            title: "Asset Ready for Assignment",
                            message: `${req.requesterName}'s request for ${req.quantity}x ${req.assetTitle} is approved and ready for assignment.`,
                            type: 'info',
                            timestamp: formatTime(req.requestDate),
                            isRead: readIds.has(id),
                            actionLink: 'AssetAssignmentQueue',
                            category: 'Request'
                        });
                    }
                }
            });
            // 2. Generate Asset Assignment & Audit Notifications
            items.forEach(item => {
                const assignedNorm = normalize(item.assignedTo);
                const isMyAsset = assignedNorm && (assignedNorm === activeUserNorm || activeUserNorm.includes(assignedNorm) || assignedNorm.includes(activeUserNorm));
                const isNotedMyAsset = (item.note || '').toLowerCase().includes('assigned to:') && normalize(item.note).includes(activeUserNorm);
                if (isMyAsset || isNotedMyAsset) {
                    // Asset Assignment notifies the Employee
                    const id = `asset-assigned-${item.id}`;
                    if (!clearedIds.has(id)) {
                        notifications.push({
                            id,
                            title: "Asset Assigned",
                            message: `Asset '${item.assetName || item.title}' (${item.serialNumber || 'N/A'}) has been assigned to you.`,
                            type: 'success',
                            timestamp: formatTime(item.assignedDate || item.purchaseDate),
                            isRead: readIds.has(id),
                            actionLink: 'My Assets',
                            category: 'Assignment'
                        });
                    }
                }
                if (isAdminOrManager) {
                    // When status is 'Assigned', notify Admin/Manager of assignments
                    if (item.status === 'Assigned') {
                        const id = `asset-assigned-admin-${item.id}`;
                        if (!clearedIds.has(id)) {
                            notifications.push({
                                id,
                                title: "Asset Assigned to Employee",
                                message: `Asset '${item.assetName || item.title}' (${item.serialNumber || 'N/A'}) is assigned to ${item.assignedTo || "Employee"}.`,
                                type: 'info',
                                timestamp: formatTime(item.assignedDate || item.purchaseDate),
                                isRead: readIds.has(id),
                                actionLink: 'Asset Tracking',
                                category: 'Assignment'
                            });
                        }
                    }
                    // Audit/Maintenance warnings
                    if (item.status === 'Under Maintenance' || item.condition === 'Damaged' || item.condition === 'Poor') {
                        const id = `asset-maintenance-${item.id}-${item.status}-${item.condition}`;
                        if (!clearedIds.has(id)) {
                            notifications.push({
                                id,
                                title: "Asset Status Alert",
                                message: `Asset '${item.assetName || item.title}' is in ${item.condition} condition and marked as ${item.status}.`,
                                type: 'warning',
                                timestamp: formatTime(item.purchaseDate),
                                isRead: readIds.has(id),
                                actionLink: 'Inventory',
                                category: 'Audit'
                            });
                        }
                    }
                }
            });
            // 3. Generate Asset Return Notifications
            const returnRequests = this.state.returnRequests || [];
            returnRequests.forEach(ret => {
                const isMyReturn = normalize(ret.requesterName) === activeUserNorm || activeUserNorm.includes(normalize(ret.requesterName)) || normalize(ret.requesterName).includes(activeUserNorm);
                if (isAdminOrManager) {
                    if (ret.status === 'Pending') {
                        const id = `ret-pending-${ret.id}`;
                        if (!clearedIds.has(id)) {
                            notifications.push({
                                id,
                                title: "Asset Return Pending",
                                message: `${ret.requesterName} requested to return ${ret.assetName} (Reason: ${ret.returnReason || "None"})`,
                                type: 'info',
                                timestamp: formatTime(ret.requestDate),
                                isRead: readIds.has(id),
                                actionLink: 'AssetReturns',
                                category: 'Request'
                            });
                        }
                    }
                }
                if (isMyReturn) {
                    if (ret.status === 'Approved' || ret.status === 'Rejected' || ret.status === 'Completed') {
                        const id = `ret-resolved-${ret.id}-${ret.status}`;
                        if (!clearedIds.has(id)) {
                            let titleText = "Return Request Approved";
                            let type = 'success';
                            let messageText = `Your return request for ${ret.assetName} has been approved. Please hand it over.`;
                            if (ret.status === 'Rejected') {
                                titleText = "Return Request Rejected";
                                type = 'error';
                                messageText = `Your return request for ${ret.assetName} was rejected. Note: ${ret.managerComment || ""}`;
                            }
                            else if (ret.status === 'Completed') {
                                titleText = "Asset Return Completed";
                                type = 'success';
                                messageText = `Your return of ${ret.assetName} is complete and has been checked back into stock.`;
                            }
                            notifications.push({
                                id,
                                title: titleText,
                                message: messageText,
                                type,
                                timestamp: formatTime(ret.completedDate || ret.requestDate),
                                isRead: readIds.has(id),
                                actionLink: 'My Assets',
                                category: 'Assignment'
                            });
                        }
                    }
                }
            });
            // Sort notifications by timestamp descending
            notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            return notifications;
        };
        this._markNotificationAsRead = (id) => {
            const readNotificationIds = [...this.state.readNotificationIds, id];
            this.setState({ readNotificationIds });
            localStorage.setItem('inventory_read_notifications', JSON.stringify(readNotificationIds));
        };
        this._markAllNotificationsAsRead = () => {
            const notifications = this._getNotifications();
            const readNotificationIds = Array.from(new Set([...this.state.readNotificationIds, ...notifications.map(n => n.id)]));
            this.setState({ readNotificationIds });
            localStorage.setItem('inventory_read_notifications', JSON.stringify(readNotificationIds));
        };
        this._clearNotification = (id) => {
            const clearedNotificationIds = [...this.state.clearedNotificationIds, id];
            this.setState({ clearedNotificationIds });
            localStorage.setItem('inventory_cleared_notifications', JSON.stringify(clearedNotificationIds));
        };
        this._clearAllNotifications = () => {
            const notifications = this._getNotifications();
            const clearedNotificationIds = Array.from(new Set([...this.state.clearedNotificationIds, ...notifications.map(n => n.id)]));
            this.setState({ clearedNotificationIds });
            localStorage.setItem('inventory_cleared_notifications', JSON.stringify(clearedNotificationIds));
        };
        this._handleNotificationAction = (actionLink, notificationId) => {
            this._markNotificationAsRead(notificationId);
            const notifications = this._getNotifications();
            const selectedNotification = notifications.find(n => n.id === notificationId);
            this.setState({
                selectedNotification,
                isNotificationDetailsOpen: true
            });
        };
        this._resolveUserRole = async () => {
            try {
                const sp = (0,_pnpjsConfig__WEBPACK_IMPORTED_MODULE_7__.getSP)();
                const groups = await sp.web.currentUser.groups();
                const groupNames = groups.map((group) => (group.Title || '').toLowerCase().trim());
                const isAdmin = groupNames.some((name) => name === 'msft owners' || name.indexOf('msft owners') >= 0);
                const isInventoryManager = groupNames.some((name) => name === 'msft members' || name.indexOf('msft members') >= 0);
                const isInventoryEmployee = groupNames.some((name) => name === 'msft visitors' || name.indexOf('msft visitors') >= 0);
                let userRole = 'Inventory Employee';
                if (isAdmin) {
                    userRole = 'Admin';
                }
                else if (isInventoryManager) {
                    userRole = 'Inventory Manager';
                }
                else if (isInventoryEmployee) {
                    userRole = 'Inventory Employee';
                }
                // Load employees from groups dynamically
                const loadedEmployees = [];
                const seenEmails = new Set();
                const addUsers = (users, jobTitle, department) => {
                    users.forEach(u => {
                        const email = (u.Email || u.LoginName || '').toLowerCase().trim();
                        const name = (u.Title || '').trim();
                        const nameLower = name.toLowerCase();
                        // Skip system/group users
                        if (nameLower === 'msft owners' || nameLower === 'system account' || !name) {
                            return;
                        }
                        if (email && !seenEmails.has(email)) {
                            seenEmails.add(email);
                            loadedEmployees.push({
                                id: u.Id ? u.Id.toString() : u.Email || Math.random().toString(),
                                name: name,
                                email: u.Email || '',
                                department: department,
                                jobTitle: jobTitle
                            });
                        }
                    });
                };
                try {
                    const owners = await sp.web.siteGroups.getByName("MSFT Owners").users();
                    addUsers(owners, 'Admin', 'Management');
                }
                catch (e) {
                    console.warn("Could not load users from group 'MSFT Owners':", e);
                }
                try {
                    const members = await sp.web.siteGroups.getByName("MSFT Members").users();
                    addUsers(members, 'Inventory Manager', 'Operations');
                }
                catch (e) {
                    console.warn("Could not load users from group 'MSFT Members':", e);
                }
                try {
                    const visitors = await sp.web.siteGroups.getByName("MSFT Visitors").users();
                    addUsers(visitors, 'Inventory Employee', 'Operations');
                }
                catch (e) {
                    console.warn("Could not load users from group 'MSFT Visitors':", e);
                }
                const finalEmployees = loadedEmployees.length > 0 ? loadedEmployees : _data_mockData__WEBPACK_IMPORTED_MODULE_16__.EMPLOYEES;
                this.setState({
                    userRole,
                    roleGroups: groups.map((group) => group.Title || ''),
                    employees: finalEmployees,
                    roleLoading: false
                });
            }
            catch (error) {
                console.error("Failed to resolve SharePoint group role:", error);
                this.setState({
                    userRole: 'Inventory Employee',
                    roleGroups: [],
                    employees: _data_mockData__WEBPACK_IMPORTED_MODULE_16__.EMPLOYEES,
                    roleLoading: false
                });
            }
        };
        this._loadInventory = async () => {
            try {
                this.setState({ loading: true, errorMessage: undefined });
                const items = await _services_InventoryService__WEBPACK_IMPORTED_MODULE_17__.InventoryService.getItems();
                if (items && items.length > 0) {
                    this.setState({ items, loading: false });
                }
                else {
                    // List is empty
                    this.setState({
                        items: [],
                        loading: false,
                        errorMessage: 'SharePoint list is empty. Please add items.'
                    });
                }
            }
            catch (error) {
                console.error("Failed to load inventory:", error);
                // Fallback to empty if SharePoint fails so the UI remains functional
                this.setState({
                    items: [],
                    loading: false,
                    errorMessage: `SharePoint Error: ${error.message || JSON.stringify(error)}`
                });
            }
        };
        this._loadRequests = async () => {
            try {
                const requests = await _services_InventoryService__WEBPACK_IMPORTED_MODULE_17__.InventoryService.getRequests();
                this.setState({ requests });
            }
            catch (error) {
                console.error("Failed to load requests:", error);
                this.setState({
                    errorMessage: `Failed to load Requests. Error: ${error.message || JSON.stringify(error)}`
                });
            }
        };
        this._loadAuditLogs = async () => {
            try {
                this.setState({ auditLogsLoading: true });
                const auditLogs = await _services_InventoryService__WEBPACK_IMPORTED_MODULE_17__.InventoryService.getAuditLogs();
                this.setState({ auditLogs, auditLogsLoading: false });
            }
            catch (error) {
                console.error("Failed to load audit logs:", error);
                this.setState({ auditLogsLoading: false });
            }
        };
        this._loadReturnRequests = async () => {
            try {
                this.setState({ returnRequestsLoading: true });
                const returnRequests = await _services_InventoryService__WEBPACK_IMPORTED_MODULE_17__.InventoryService.getReturnRequests();
                this.setState({ returnRequests, returnRequestsLoading: false });
            }
            catch (error) {
                console.error("Failed to load return requests:", error);
                this.setState({ returnRequestsLoading: false });
            }
        };
        this._onSubmitReturnRequest = async (reason, condition) => {
            const { selectedAssetForReturn } = this.state;
            if (!selectedAssetForReturn)
                return;
            try {
                this.setState({ returnRequestsLoading: true });
                const reqPayload = {
                    title: `Return Request for ${selectedAssetForReturn.assetName || selectedAssetForReturn.title}`,
                    assetId: selectedAssetForReturn.id,
                    assetName: selectedAssetForReturn.assetName || selectedAssetForReturn.title,
                    serialNumber: selectedAssetForReturn.serialNumber,
                    requesterName: this.state.activeUserDisplayName,
                    requesterEmail: this.state.activeUserEmail,
                    requestDate: new Date().toISOString().split('T')[0],
                    returnReason: reason,
                    proposedCondition: condition
                };
                await _services_InventoryService__WEBPACK_IMPORTED_MODULE_17__.InventoryService.addReturnRequest(reqPayload, this.state.activeUserDisplayName);
                await this._loadInventory();
                await this._loadReturnRequests();
                await this._loadAuditLogs();
                this.setState({ isReturnFormOpen: false, selectedAssetForReturn: undefined });
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to submit return request: ${error.message || JSON.stringify(error)}`,
                    returnRequestsLoading: false
                });
            }
        };
        this._onUpdateReturnRequestStatus = async (requestId, status, comment, finalCondition) => {
            try {
                this.setState({ returnRequestsLoading: true });
                await _services_InventoryService__WEBPACK_IMPORTED_MODULE_17__.InventoryService.updateReturnRequestStatus(requestId, status, comment, this.state.activeUserDisplayName, finalCondition);
                await this._loadInventory();
                await this._loadReturnRequests();
                await this._loadAuditLogs();
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to update return status: ${error.message || JSON.stringify(error)}`,
                    returnRequestsLoading: false
                });
            }
        };
        this._onAddAsset = async (newAssetData) => {
            try {
                this.setState({ loading: true, errorMessage: undefined });
                const newAsset = {
                    ...newAssetData,
                    status: 'In Stock'
                };
                await _services_InventoryService__WEBPACK_IMPORTED_MODULE_17__.InventoryService.addItem(newAsset, this.state.activeUserDisplayName);
                await this._loadInventory(); // Refresh list
                await this._loadAuditLogs(); // Refresh audit logs
            }
            catch (error) {
                console.error("Failed to add asset:", error);
                this.setState({
                    loading: false,
                    errorMessage: `Failed to add Asset. SharePoint rejected the save. Error: ${error.message || JSON.stringify(error)}`
                });
            }
        };
        this._onSubmitRequest = async (requestData) => {
            try {
                const requesterEmployee = this.state.employees.find(e => e.name.toLowerCase() === requestData.requesterName.toLowerCase());
                const requesterRole = requesterEmployee ? requesterEmployee.jobTitle : 'Inventory Employee';
                const initialStatus = requesterRole === 'Inventory Manager' ? 'Approved' : 'Pending';
                const tempId = `temp-${Date.now()}`;
                const localRequest = {
                    id: tempId,
                    requestKey: `REQ-${("000000" + (this.state.requests.length + 1)).slice(-6)}`,
                    requesterName: requestData.requesterName,
                    employeeId: requestData.employeeId || "",
                    assetId: requestData.assetId || "1",
                    assetTitle: requestData.assetTitle,
                    assetName: "",
                    priority: requestData.priority || "Medium",
                    quantity: requestData.quantity || 1,
                    status: initialStatus,
                    assetStatus: 'Pending',
                    requestDate: requestData.requestDate || new Date().toISOString().split('T')[0],
                    reason: requestData.reason || ""
                };
                // Optimistic update so it gets added to the RequestList directly
                this.setState(prevState => ({
                    requests: [localRequest, ...prevState.requests]
                }));
                await _services_InventoryService__WEBPACK_IMPORTED_MODULE_17__.InventoryService.addRequest({
                    ...requestData,
                    status: initialStatus
                }, this.state.activeUserDisplayName);
                console.log('Successfully saved request to SharePoint');
                await this._loadRequests(); // Refresh list from SharePoint
                await this._loadAuditLogs(); // Refresh audit logs
            }
            catch (error) {
                console.error('Failed to save request to SharePoint AssetRequests list:', error);
                this.setState({
                    errorMessage: `Failed to save Request to SharePoint. A local copy was added. Error: ${error.message || JSON.stringify(error)}`
                });
            }
        };
        this._onApproveRequest = async (request) => {
            try {
                this.setState({ requestActionInProgressId: request.id, errorMessage: undefined });
                if (request.id.indexOf('temp-') === 0) {
                    this.setState(prevState => ({
                        requests: prevState.requests.map(r => r.id === request.id ? { ...r, status: 'Approved' } : r)
                    }));
                }
                else {
                    await _services_InventoryService__WEBPACK_IMPORTED_MODULE_17__.InventoryService.updateRequestStatus(parseInt(request.id, 10), 'Approved', this.state.activeUserDisplayName);
                    await this._loadRequests();
                    await this._loadAuditLogs();
                }
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to approve request #${request.id}. ${error.message || JSON.stringify(error)}`
                });
            }
            finally {
                this.setState({ requestActionInProgressId: undefined });
            }
        };
        this._onRejectRequest = async (request, reason) => {
            try {
                this.setState({ requestActionInProgressId: request.id, errorMessage: undefined });
                if (request.id.indexOf('temp-') === 0) {
                    this.setState(prevState => ({
                        requests: prevState.requests.map(r => r.id === request.id ? { ...r, status: 'Declined', managerResponse: reason } : r)
                    }));
                }
                else {
                    await _services_InventoryService__WEBPACK_IMPORTED_MODULE_17__.InventoryService.updateRequestStatus(parseInt(request.id, 10), 'Declined', this.state.activeUserDisplayName, reason);
                    await this._loadRequests();
                    await this._loadAuditLogs();
                }
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to reject request #${request.id}. ${error.message || JSON.stringify(error)}`
                });
            }
            finally {
                this.setState({ requestActionInProgressId: undefined });
            }
        };
        this._onApproveAsset = async (request) => {
            try {
                this.setState({ requestActionInProgressId: request.id, errorMessage: undefined });
                if (request.id.indexOf('temp-') === 0) {
                    this.setState(prevState => ({
                        requests: prevState.requests.map(r => r.id === request.id ? { ...r, assetStatus: 'Approved' } : r)
                    }));
                }
                else {
                    await _services_InventoryService__WEBPACK_IMPORTED_MODULE_17__.InventoryService.updateAssetStatus(parseInt(request.id, 10), 'Approved', this.state.activeUserDisplayName);
                    await this._loadRequests();
                    await this._loadAuditLogs();
                }
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to approve asset status for request #${request.requestKey || request.id}. ${error.message || JSON.stringify(error)}`
                });
            }
            finally {
                this.setState({ requestActionInProgressId: undefined });
            }
        };
        this._onAssignAssets = async (employeeName, employeeEmail, assetIds) => {
            try {
                this.setState({ isTrackingActionInProgress: true, errorMessage: undefined });
                const employee = this.state.employees.find(e => e.name.toLowerCase() === employeeName.toLowerCase());
                const employeeId = employee ? employee.id : "";
                await _services_InventoryService__WEBPACK_IMPORTED_MODULE_17__.InventoryService.assignAssetsToEmployee(assetIds, employeeName, employeeEmail, this.state.activeUserDisplayName, employeeId);
                await this._loadInventory();
                await this._loadAuditLogs();
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to assign assets. ${error.message || JSON.stringify(error)}`
                });
            }
            finally {
                this.setState({ isTrackingActionInProgress: false });
            }
        };
        this._onSyncAssignedAssets = async () => {
            try {
                this.setState({
                    syncInProgress: true,
                    syncMessage: 'Synchronizing assigned assets with SharePoint Mapping List...',
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_24__.MessageBarType.info
                });
                const result = await _services_InventoryService__WEBPACK_IMPORTED_MODULE_17__.InventoryService.syncExistingAssignmentsToMappingList(this.state.activeUserDisplayName);
                this.setState({
                    syncInProgress: false,
                    syncMessage: `Synchronization complete! Verified ${result.checkedCount} assigned assets. Successfully checked and synchronized ${result.syncedCount} missing mapping records.`,
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_24__.MessageBarType.success
                });
                // Reload inventory to ensure consistency
                await this._loadInventory();
            }
            catch (e) {
                console.error("Manual sync failed:", e);
                this.setState({
                    syncInProgress: false,
                    syncMessage: `Failed to synchronize mapping records: ${e.message || JSON.stringify(e)}`,
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_24__.MessageBarType.error
                });
            }
        };
        this._onRunDiagnostics = async () => {
            try {
                this.setState({
                    syncInProgress: true,
                    syncMessage: 'Running Mapping List diagnostic check...',
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_24__.MessageBarType.info
                });
                const diagnosticInfo = await _services_InventoryService__WEBPACK_IMPORTED_MODULE_17__.InventoryService.diagnoseMappingListFields();
                this.setState({
                    syncInProgress: false,
                    diagnosticInfo,
                    syncMessage: 'Diagnostic check complete! Columns and item counts retrieved successfully.',
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_24__.MessageBarType.success
                });
            }
            catch (e) {
                this.setState({
                    syncInProgress: false,
                    syncMessage: `Failed to retrieve diagnostics: ${e.message || JSON.stringify(e)}`,
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_24__.MessageBarType.error
                });
            }
        };
        this._exportWarrantyReportToExcel = () => {
            const { items } = this.state;
            const headers = ["Asset Name", "Asset Type", "Status", "Purchase Date", "Warranty Expiry Date"];
            const csvRows = [headers.join(",")];
            items.forEach(item => {
                const name = (item.assetName || item.title || "").replace(/"/g, '""');
                const type = (item.assetType || "").replace(/"/g, '""');
                const status = (item.status || "").replace(/"/g, '""');
                const purchaseDate = (item.purchaseDate || "").replace(/"/g, '""');
                const warrantyExpiry = (item.warrantyExpiry || "N/A").replace(/"/g, '""');
                const row = [
                    `"${name}"`,
                    `"${type}"`,
                    `"${status}"`,
                    `"${purchaseDate}"`,
                    `"${warrantyExpiry}"`
                ];
                csvRows.push(row.join(","));
            });
            const csvContent = "\uFEFF" + csvRows.join("\n");
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `Warranty_Expiry_Report_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        this._renderRequestAnalysis = (request) => {
            const reqAssetTitle = request.assetTitle || "";
            const inStockItems = this.state.items.filter(item => (item.assetType || '').toLowerCase() === reqAssetTitle.toLowerCase() &&
                (item.status === 'In Stock' || item.status === 'Yes' || (item.status || '').toLowerCase() === 'in stock'));
            const inStockCount = inStockItems.length;
            const isSufficient = inStockCount >= request.quantity;
            let progressPercent = 0.33;
            let currentStepText = "Submitted & Pending Approval";
            if (request.status === 'Approved') {
                progressPercent = 0.66;
                currentStepText = "Manager Approved - Awaiting Asset Assignment";
                if (request.assetStatus === 'Approved') {
                    progressPercent = 1.0;
                    currentStepText = "Completed & Asset Assigned";
                }
            }
            else if (request.status === 'Declined') {
                progressPercent = 1.0;
                currentStepText = "Declined by Manager";
            }
            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_25__.Stack, { tokens: { childrenGap: 20 } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } }, "Request Overview"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Request Key:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, request.requestKey)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Requested Asset:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, request.assetTitle)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Quantity:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, request.quantity)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Priority:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, request.priority)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Requester Name:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, request.requesterName)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Employee ID:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, request.employeeId || "N/A")),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Request Date:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, request.requestDate)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Request Status:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: request.status === 'Approved' ? '#16a34a' : request.status === 'Declined' ? '#dc2626' : '#ea580c' } }, request.status))),
                    request.reason && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '12px', fontSize: '0.88rem', padding: '8px 10px', backgroundColor: '#f9fafb', borderRadius: '4px', border: '1px solid #f3f4f6' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280', display: 'block', marginBottom: '2px' } }, "Reason for Request:"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#374151' } }, request.reason))),
                    request.managerResponse && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '12px', fontSize: '0.88rem', padding: '8px 10px', backgroundColor: '#f0fdf4', borderRadius: '4px', border: '1px solid #dcfce7' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#15803d', display: 'block', marginBottom: '2px' } }, "Manager Response:"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#166534' } }, request.managerResponse)))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_26__.Icon, { iconName: "BarChart4", style: { color: '#0078d4' } }),
                        " Detailed Analysis"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_25__.Stack, { tokens: { childrenGap: 12 } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' } }, "Inventory Availability Check:"),
                            isSufficient ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_24__.MessageBarType.success, styles: { root: { borderRadius: '6px' } } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Inventory Check Passed:"),
                                " There are currently ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, inStockCount),
                                " unit(s) of ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, reqAssetTitle),
                                " in stock, which is sufficient to fulfill this request.")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_24__.MessageBarType.warning, styles: { root: { borderRadius: '6px' } } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Inventory Warning:"),
                                " Only ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, inStockCount),
                                " unit(s) of ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, reqAssetTitle),
                                " in stock. Procurement is required to fully complete this order."))),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { borderTop: '1px solid #e2e8f0', paddingTop: '10px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' } }, "Strategic Recommendation:"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '10px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', lineHeight: '1.4', color: '#334155' } }, request.status === 'Pending' ? (isSufficient ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Recommended Action:"),
                                " Approve the request. Sufficient inventory is available, allowing immediate serial number allocation.")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Recommended Action:"),
                                " Hold approval or assign alternate model. Current stock (",
                                inStockCount,
                                ") is insufficient. Order replenishment units."))) : request.status === 'Approved' && request.assetStatus === 'Pending' ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Recommended Action:"),
                                " Proceed to the ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Asset Assignment Queue"),
                                " tab to allocate one of the ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, inStockCount),
                                " available ",
                                reqAssetTitle,
                                "s to ",
                                request.requesterName,
                                ".")) : request.status === 'Approved' && request.assetStatus === 'Approved' ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Lifecycle Complete:"),
                                " The asset has been successfully allocated. No further manager or admin action is required.")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Closed:"),
                                " Request has been declined. Fulfilling alternate options or review arguments if appealed.")))),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { borderTop: '1px solid #e2e8f0', paddingTop: '10px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' } }, "Request Lifecycle Stage:"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_28__.ProgressIndicator, { label: currentStepText, percentComplete: progressPercent, styles: { root: { marginTop: '5px' } } }))))));
        };
        this._renderAssetAnalysis = (asset) => {
            const purchaseDateVal = asset.purchaseDate ? new Date(asset.purchaseDate) : null;
            const now = new Date();
            const ageInMonths = purchaseDateVal
                ? Math.round((now.getTime() - purchaseDateVal.getTime()) / (1000 * 60 * 60 * 24 * 30.4))
                : null;
            const isExpired = asset.warrantyExpiry && new Date(asset.warrantyExpiry) < now;
            let conditionColor = '#16a34a';
            let healthRating = "Excellent";
            let healthIcon = "Heart";
            if (asset.condition === 'Fair') {
                conditionColor = '#ea580c';
                healthRating = "Fair";
                healthIcon = "IncidentTriangle";
            }
            else if (asset.condition === 'Poor' || asset.condition === 'Damaged') {
                conditionColor = '#dc2626';
                healthRating = "Critical Needs Replacement";
                healthIcon = "Warning";
            }
            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_25__.Stack, { tokens: { childrenGap: 20 } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } }, "Asset Specifications"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Asset Name:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, asset.assetName || asset.title)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Serial Number:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, asset.serialNumber)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Asset Type:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, asset.assetType)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Current Status:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, asset.status)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Condition:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: conditionColor } }, asset.condition || "New")),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Vendor:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, asset.vendor || "N/A")),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Purchase Date:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, asset.purchaseDate || "N/A")),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280' } }, "Warranty Expiry:"),
                            " ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: isExpired ? '#dc2626' : '#111827' } }, asset.warrantyExpiry || "N/A"))),
                    asset.note && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '12px', fontSize: '0.88rem', padding: '8px 10px', backgroundColor: '#f9fafb', borderRadius: '4px', border: '1px solid #f3f4f6' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280', display: 'block', marginBottom: '2px' } }, "Asset Notes:"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#374151' } }, asset.note)))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_26__.Icon, { iconName: "Heart", style: { color: conditionColor } }),
                        " Health & Depreciation Analysis"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_25__.Stack, { tokens: { childrenGap: 12 } },
                        ageInMonths !== null && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' } }, "Asset Age:"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.9rem', color: '#334155' } },
                                "This asset is ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, ageInMonths),
                                " month(s) old (",
                                Math.round(ageInMonths / 12 * 10) / 10,
                                " year(s)). Standard lifecycle depreciation period is 36 months (3 years)."))),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' } }, "Warranty Expiry Evaluation:"),
                            asset.warrantyExpiry ? (isExpired ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_24__.MessageBarType.error, styles: { root: { borderRadius: '6px' } } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Warranty Expired:"),
                                " Coverage ended on ",
                                asset.warrantyExpiry,
                                ". Any future repair operations will incur full direct business costs.")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_24__.MessageBarType.success, styles: { root: { borderRadius: '6px' } } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Warranty Active:"),
                                " Covered under manufacturer protection until ",
                                asset.warrantyExpiry,
                                "."))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_24__.MessageBarType.info, styles: { root: { borderRadius: '6px' } } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Warranty Unknown:"),
                                " No warranty expiration date has been registered for this asset."))),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { borderTop: '1px solid #e2e8f0', paddingTop: '10px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' } }, "Asset Physical Health:"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_26__.Icon, { iconName: healthIcon, style: { fontSize: '18px', color: conditionColor } }),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                    "Health Classification: ",
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: conditionColor } }, healthRating))),
                            (asset.condition === 'Poor' || asset.condition === 'Damaged') && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { margin: '8px 0 0 0', fontSize: '0.8rem', color: '#b91c1c', fontWeight: 'bold' } }, "Critical Action Recommendation: It is highly advised to retire this asset and issue a replacement request.")))))));
        };
        this._renderNotificationDetailsPanel = () => {
            const { selectedNotification, isNotificationDetailsOpen, items, requests } = this.state;
            if (!selectedNotification)
                return null;
            const notifId = selectedNotification.id || "";
            let associatedRequest;
            let associatedAsset;
            if (notifId.startsWith("req-pending-")) {
                const id = notifId.replace("req-pending-", "");
                associatedRequest = requests.find(r => r.id === id);
            }
            else if (notifId.startsWith("req-resolved-")) {
                const parts = notifId.split("-");
                const id = parts[2];
                associatedRequest = requests.find(r => r.id === id);
            }
            else if (notifId.startsWith("req-assign-admin-")) {
                const id = notifId.replace("req-assign-admin-", "");
                associatedRequest = requests.find(r => r.id === id);
            }
            else if (notifId.startsWith("asset-assigned-admin-")) {
                const id = notifId.replace("asset-assigned-admin-", "");
                associatedAsset = items.find(a => a.id === id);
            }
            else if (notifId.startsWith("asset-assigned-")) {
                const id = notifId.replace("asset-assigned-", "");
                associatedAsset = items.find(a => a.id === id);
            }
            else if (notifId.startsWith("asset-maintenance-")) {
                const parts = notifId.replace("asset-maintenance-", "").split("-");
                const id = parts[0];
                associatedAsset = items.find(a => a.id === id);
            }
            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_29__.Panel, { isOpen: isNotificationDetailsOpen, onDismiss: () => this.setState({ isNotificationDetailsOpen: false }), type: _fluentui_react__WEBPACK_IMPORTED_MODULE_30__.PanelType.medium, headerText: selectedNotification.title, closeButtonAriaLabel: "Close" },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '10px' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: '#6b7280', fontSize: '0.88rem', margin: '0 0 20px 0' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Received:"),
                        " ",
                        selectedNotification.timestamp),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '12px 15px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #64748b' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: '1.5' } }, selectedNotification.message)),
                    associatedRequest && this._renderRequestAnalysis(associatedRequest),
                    associatedAsset && this._renderAssetAnalysis(associatedAsset),
                    !associatedRequest && !associatedAsset && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { color: '#111827', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px' } }, "System Alert Analysis"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_24__.MessageBarType.info }, "This is a general system notification. There is no direct database link to an active request or asset."))))));
        };
        this._onAdminAssetChange = (event, option) => {
            if (option) {
                this.setState({ adminSelectedAssetId: option.key });
            }
        };
        this._handleAdminAssignAndApprove = async () => {
            const request = this.state.selectedAdminRequest;
            if (!request)
                return;
            try {
                this.setState({ requestActionInProgressId: request.id, errorMessage: undefined });
                const { adminSelectedAssetId, adminComment } = this.state;
                const approverName = this.state.activeUserDisplayName;
                if (adminSelectedAssetId) {
                    // Find the requester's details
                    const employee = this.state.employees.find(e => e.name.toLowerCase() === request.requesterName.toLowerCase());
                    const employeeEmail = employee ? employee.email : "";
                    const employeeId = employee ? employee.id : "";
                    // Assign the asset to the employee and approve the request
                    await _services_InventoryService__WEBPACK_IMPORTED_MODULE_17__.InventoryService.assignAssetsToEmployee([adminSelectedAssetId], request.requesterName, employeeEmail, approverName, employeeId, adminComment);
                }
                else {
                    // No asset selected, just approve the asset request status
                    await _services_InventoryService__WEBPACK_IMPORTED_MODULE_17__.InventoryService.updateAssetStatus(parseInt(request.id, 10), 'Approved', approverName, adminComment);
                }
                // Close panel and refresh data
                this.setState({
                    isAdminPanelOpen: false,
                    selectedAdminRequest: undefined,
                    adminSelectedAssetId: undefined,
                    adminComment: ''
                });
                await this._loadInventory();
                await this._loadRequests();
                await this._loadAuditLogs();
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to approve & assign request #${request.requestKey || request.id}. ${error.message || JSON.stringify(error)}`
                });
            }
            finally {
                this.setState({ requestActionInProgressId: undefined });
            }
        };
        this._handleAdminReject = async () => {
            const request = this.state.selectedAdminRequest;
            if (!request)
                return;
            try {
                this.setState({ requestActionInProgressId: request.id, errorMessage: undefined });
                const { adminComment } = this.state;
                const approverName = this.state.activeUserDisplayName;
                // Rejecting from the Admin side will set the main status of the request to 'Declined'
                await _services_InventoryService__WEBPACK_IMPORTED_MODULE_17__.InventoryService.updateRequestStatus(parseInt(request.id, 10), 'Declined', approverName, adminComment || 'Rejected by Admin during assignment');
                // Close panel and refresh data
                this.setState({
                    isAdminPanelOpen: false,
                    selectedAdminRequest: undefined,
                    adminSelectedAssetId: undefined,
                    adminComment: ''
                });
                await this._loadInventory();
                await this._loadRequests();
                await this._loadAuditLogs();
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to reject request #${request.requestKey || request.id}. ${error.message || JSON.stringify(error)}`
                });
            }
            finally {
                this.setState({ requestActionInProgressId: undefined });
            }
        };
        this._renderAdminAssignmentPanel = () => {
            const request = this.state.selectedAdminRequest;
            if (!request || !this.state.isAdminPanelOpen)
                return null;
            const requestedAssetTitle = request.assetTitle || "";
            const matchingAssets = this.state.items.filter(item => (item.assetType || '').toLowerCase() === requestedAssetTitle.toLowerCase() &&
                (item.status === 'In Stock' || item.status === 'Yes' || (item.status || '').toLowerCase() === 'in stock'));
            const matchingAssetOptions = matchingAssets.map(asset => ({
                key: asset.id,
                text: `${asset.assetName || asset.title} (SN: ${asset.serialNumber || 'N/A'})`
            }));
            const dropdownPlaceholder = matchingAssets.length > 0
                ? "Select asset to assign..."
                : "No assets of this type in stock";
            const isBusy = this.state.requestActionInProgressId === request.id;
            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_29__.Panel, { isOpen: this.state.isAdminPanelOpen, onDismiss: () => this.setState({ isAdminPanelOpen: false, selectedAdminRequest: undefined }), type: _fluentui_react__WEBPACK_IMPORTED_MODULE_30__.PanelType.medium, headerText: `Request #${request.requestKey || request.id}`, closeButtonAriaLabel: "Close" },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'inherit' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 10px 0' } }, "Asset request details"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                            backgroundColor: 'var(--surface-bg)',
                            border: '1px solid rgba(128, 128, 128, 0.15)',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: 'var(--card-shadow)'
                        } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(128, 128, 128, 0.1)', paddingBottom: '10px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' } }, "Request Information"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                    backgroundColor: '#fef3c7',
                                    color: '#d97706',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    padding: '3px 8px',
                                    borderRadius: '4px'
                                } }, "Pending Admin")),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.85rem' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: 'var(--text-muted)', display: 'block', marginBottom: '2px' } }, "Category"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: 'var(--text-main)' } }, request.assetTitle)),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: 'var(--text-muted)', display: 'block', marginBottom: '2px' } }, "Quantity"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: 'var(--text-main)' } }, request.quantity)),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: 'var(--text-muted)', display: 'block', marginBottom: '2px' } }, "Urgency"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: 'var(--text-main)' } }, request.priority || 'Medium')),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: 'var(--text-muted)', display: 'block', marginBottom: '2px' } }, "Submitted"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: 'var(--text-main)' } }, request.requestDate))),
                        request.reason && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '16px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontSize: '0.85rem' } }, "Justification"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                                    backgroundColor: this.props.isDarkTheme ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                                    border: '1px solid rgba(128, 128, 128, 0.1)',
                                    borderRadius: '6px',
                                    padding: '12px',
                                    fontSize: '0.85rem',
                                    color: 'var(--text-main)',
                                    lineHeight: 1.5
                                } }, request.reason)))),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                            backgroundColor: 'var(--surface-bg)',
                            border: '1px solid rgba(128, 128, 128, 0.15)',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: 'var(--card-shadow)'
                        } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', borderBottom: '1px solid rgba(128, 128, 128, 0.1)', paddingBottom: '10px' } }, "Approval Trail"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.85rem' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '12px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981', border: '2px solid var(--surface-bg)', boxShadow: '0 0 0 2px #10b981' } }),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { width: '2px', flexGrow: 1, backgroundColor: '#10b981', minHeight: '20px', marginTop: '4px' } })),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: 'var(--text-main)', display: 'block' } }, "Submitted"),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: 'var(--text-muted)', fontSize: '0.75rem' } }, request.requestDate))),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '12px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981', border: '2px solid var(--surface-bg)', boxShadow: '0 0 0 2px #10b981' } }),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { width: '2px', flexGrow: 1, backgroundColor: 'rgba(128, 128, 128, 0.25)', minHeight: '20px', marginTop: '4px' } })),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: 'var(--text-main)', display: 'block' } }, "Manager Review"),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: 'var(--text-muted)', fontStyle: 'italic', display: 'block', marginTop: '2px', fontSize: '0.8rem' } },
                                        "\u201C",
                                        request.managerResponse || 'Approved - valid business need',
                                        "\u201D"))),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '12px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6', border: '2px solid var(--surface-bg)', boxShadow: '0 0 0 2px #3b82f6' } })),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: 'var(--text-main)', display: 'block' } }, "Admin Assignment"),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: 'var(--text-muted)', fontSize: '0.75rem' } }, "Awaiting Asset Allocation"))))),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                            backgroundColor: this.props.isDarkTheme ? 'rgba(59, 130, 246, 0.05)' : 'rgba(37, 99, 235, 0.03)',
                            border: '1px solid rgba(37, 99, 235, 0.15)',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: 'var(--card-shadow)'
                        } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' } }, "Admin Assignment"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("label", { style: { fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)', display: 'block', marginBottom: '6px' } }, "Assign Asset (optional)"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_31__.Dropdown, { placeholder: dropdownPlaceholder, options: matchingAssetOptions, selectedKey: this.state.adminSelectedAssetId, onChange: this._onAdminAssetChange, disabled: matchingAssets.length === 0 || isBusy, styles: { dropdown: { width: '100%' } } })),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("label", { style: { fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)', display: 'block', marginBottom: '6px' } }, "Comment"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_32__.TextField, { multiline: true, rows: 4, placeholder: "Add a comment explaining your decision...", value: this.state.adminComment, onChange: (_, value) => this.setState({ adminComment: value || '' }), disabled: isBusy })),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '12px', marginTop: '8px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_33__.PrimaryButton, { text: isBusy ? "Processing..." : "Assign & Approve", onClick: this._handleAdminAssignAndApprove, disabled: isBusy, iconProps: { iconName: 'CompletedSolid' } }),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_34__.DefaultButton, { text: "Reject", onClick: this._handleAdminReject, disabled: isBusy, iconProps: { iconName: 'Cancel' }, styles: {
                                        root: { color: '#dc2626', borderColor: '#dc2626' },
                                        rootHovered: { color: '#ffffff', backgroundColor: '#dc2626', borderColor: '#dc2626' }
                                    } })))))));
        };
        let readIds = [];
        let clearedIds = [];
        try {
            readIds = JSON.parse(localStorage.getItem('inventory_read_notifications') || '[]');
            clearedIds = JSON.parse(localStorage.getItem('inventory_cleared_notifications') || '[]');
        }
        catch (e) {
            console.warn("localStorage parsing failed", e);
        }
        const activeName = props.userDisplayName;
        const activeEmail = props.userEmail;
        this.state = {
            items: [],
            employees: _data_mockData__WEBPACK_IMPORTED_MODULE_16__.EMPLOYEES,
            requests: [],
            auditLogs: [],
            userRole: 'Inventory Employee',
            previewRole: undefined,
            roleGroups: [],
            roleLoading: true,
            requestActionInProgressId: undefined,
            requestSearchId: '',
            isAssetFormOpen: false,
            isRequestFormOpen: false,
            loading: true,
            auditLogsLoading: true,
            errorMessage: undefined,
            selectedTabKey: 'Dashboard',
            readNotificationIds: readIds,
            clearedNotificationIds: clearedIds,
            selectedNotification: undefined,
            isNotificationDetailsOpen: false,
            returnRequests: [],
            returnRequestsLoading: true,
            selectedAssetForReturn: undefined,
            isReturnFormOpen: false,
            activeUserDisplayName: activeName,
            activeUserEmail: activeEmail,
            isIncidentFormOpen: false,
            selectedAssetForIncident: undefined,
            selectedAdminRequest: undefined,
            isAdminPanelOpen: false,
            adminSelectedAssetId: undefined,
            adminComment: ''
        };
    }
    async componentDidMount() {
        await this._resolveUserRole();
        await this._loadInventory();
        await this._loadRequests();
        await this._loadAuditLogs();
        await this._loadReturnRequests();
        // Dynamically auto-sync existing assigned assets of our 5 active users to the Mapping List
        try {
            await _services_InventoryService__WEBPACK_IMPORTED_MODULE_17__.InventoryService.syncExistingAssignmentsToMappingList(this.state.activeUserDisplayName);
        }
        catch (e) {
            console.warn("Failed to auto-sync existing assignments to Mapping List:", e);
        }
    }
    render() {
        const { description, isDarkTheme, environmentMessage, hasTeamsContext } = this.props;
        const { items, isAssetFormOpen, isRequestFormOpen, auditLogs, auditLogsLoading, userRole, previewRole, roleLoading, roleGroups, requestActionInProgressId, requestSearchId, activeUserDisplayName, activeUserEmail } = this.state;
        const effectiveRole = previewRole || userRole;
        const isAdmin = effectiveRole === 'Admin';
        const isManager = effectiveRole === 'Inventory Manager';
        const isEmployee = effectiveRole === 'Inventory Employee';
        const myAssets = items.filter(item => this._isAssetAssignedToCurrentUser(item, activeUserDisplayName || ''));
        const myRequests = this.state.requests.filter(request => this._isRequestOwnedByCurrentUser(request.requesterName || '', activeUserDisplayName || ''));
        const myApprovedRequests = myRequests.filter(request => (request.status || '').toLowerCase().includes('approv'));
        const adminQueueRequests = this.state.requests.filter(request => (request.status || '').toLowerCase().includes('approv'));
        const managerQueueRequests = this.state.requests;
        const normalizedSearch = (requestSearchId || '').trim().toLowerCase();
        const filterRequests = (reqs) => normalizedSearch
            ? reqs.filter(request => (request.requestKey || '').toLowerCase().includes(normalizedSearch) ||
                (request.id || '').toLowerCase().includes(normalizedSearch))
            : reqs;
        const visibleAdminRequests = filterRequests(adminQueueRequests);
        const visibleManagerRequests = filterRequests(managerQueueRequests);
        const notifications = this._getNotifications();
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("section", { className: `${_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].inventoryManagement} ${hasTeamsContext ? _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].teams : ''} ${isDarkTheme ? _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].dark : ''}` },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].mainContent },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].heroSection },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].heroText },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", null, "Inventory Management"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null,
                            "Welcome back, ",
                            (0,_microsoft_sp_lodash_subset__WEBPACK_IMPORTED_MODULE_2__.escape)(activeUserDisplayName),
                            "!"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].smallText },
                            "Role: ",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, effectiveRole)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].smallText },
                            environmentMessage,
                            " \u2022 Location: ",
                            (0,_microsoft_sp_lodash_subset__WEBPACK_IMPORTED_MODULE_2__.escape)(description)),
                        isAdmin && roleGroups.length > 0 && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].smallText },
                            "SharePoint Groups: ",
                            (0,_microsoft_sp_lodash_subset__WEBPACK_IMPORTED_MODULE_2__.escape)(roleGroups.join(', '))))),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].welcomeDiagramContainer },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_AssetLifecycleDiagram__WEBPACK_IMPORTED_MODULE_23__.AssetLifecycleDiagram, { isDarkTheme: isDarkTheme }))),
                this.state.errorMessage && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { color: '#991b1b', backgroundColor: '#fee2e2', padding: '15px', borderRadius: '8px', marginBottom: '20px', position: 'relative' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Error:"),
                    " ",
                    this.state.errorMessage,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { onClick: () => this.setState({ errorMessage: undefined }), style: { position: 'absolute', right: '15px', top: '12px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', color: '#991b1b' }, "aria-label": "Dismiss error" }, "\u00D7"))),
                !roleLoading && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].actionGrid },
                    (isAdmin || isManager) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].actionButtonContainer },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_33__.PrimaryButton, { text: isAdmin ? "Add New Asset" : "Assign / Manage Assets", onClick: () => this.setState({ isAssetFormOpen: true }), iconProps: { iconName: 'Add' } }))),
                    (isAdmin || isManager || isEmployee) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].actionButtonContainer },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_33__.PrimaryButton, { text: "Request Asset", onClick: () => this.setState({ isRequestFormOpen: true }), iconProps: { iconName: 'Send' } }))),
                    (isAdmin || isManager || isEmployee) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].actionButtonContainer },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_33__.PrimaryButton, { text: "Raise Incident", onClick: () => this.setState({ isIncidentFormOpen: true }), iconProps: { iconName: 'AlertSolid' } }))))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].card },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_35__.Pivot, { "aria-label": "Inventory Management Views", selectedKey: this.state.selectedTabKey, onLinkClick: (item) => item && this.setState({ selectedTabKey: item.props.itemKey }) },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_36__.PivotItem, { headerText: "Dashboard", itemIcon: "BarChart4", itemKey: "Dashboard" },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Dashboard__WEBPACK_IMPORTED_MODULE_18__.Dashboard, { items: isAdmin || isManager ? items : myAssets, requests: isAdmin || isManager ? this.state.requests : myRequests, isAdmin: isAdmin, isInventoryManager: isManager })),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_36__.PivotItem, { headerText: "My Assets", itemIcon: "Broom", itemKey: "MyAssets" },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "My Assigned Assets")),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "View assets currently assigned to you."),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_MyAssignedAssetsView__WEBPACK_IMPORTED_MODULE_4__.MyAssignedAssetsView, { items: myAssets, onReturnAsset: (item) => this.setState({ selectedAssetForReturn: item, isReturnFormOpen: true }), onRaiseIncident: (item) => this.setState({ selectedAssetForIncident: item, isIncidentFormOpen: true }) }))),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_36__.PivotItem, { headerText: "My Requests", itemIcon: "Send", itemKey: "MyRequests" },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "My Asset Requests")),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Track your submitted requests and approval status."),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_MyRequestsView__WEBPACK_IMPORTED_MODULE_5__.MyRequestsView, { requests: myRequests }))),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_36__.PivotItem, { headerText: notifications.filter(n => !n.isRead).length > 0 ? `Notifications (${notifications.filter(n => !n.isRead).length})` : "Notifications", itemIcon: "Ringer", itemKey: "Notifications" },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_NotificationCenter__WEBPACK_IMPORTED_MODULE_20__.NotificationCenter, { notifications: notifications, onMarkAsRead: this._markNotificationAsRead, onMarkAllAsRead: this._markAllNotificationsAsRead, onClearNotification: this._clearNotification, onClearAllNotifications: this._clearAllNotifications, onNotificationAction: this._handleNotificationAction })),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_36__.PivotItem, { headerText: "Incident History", itemIcon: "History", itemKey: "IncidentHistory" },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_IncidentHistory_IncidentHistory__WEBPACK_IMPORTED_MODULE_22__.IncidentHistory, { ...this.props, userDisplayName: activeUserDisplayName, userEmail: activeUserEmail, userRole: effectiveRole, setIsLoading: (loading) => this.setState({ loading }) }))),
                        isAdmin && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_36__.PivotItem, { headerText: "Inventory", itemIcon: "List", itemKey: "Inventory" },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Current Inventory Overview")),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Track and manage your organizational assets efficiently within the SharePoint Framework."),
                                this.state.loading ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "Loading inventory...")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_InventoryList__WEBPACK_IMPORTED_MODULE_3__.InventoryList, { items: items, isAdmin: true, enablePagination: true }))))),
                        isManager && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_36__.PivotItem, { headerText: "Approvals", itemIcon: "DoubleChevronRight12", itemKey: "Approvals" },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Request Approvals & Assignment Queue")),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Track and manage all asset requests efficiently."),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_32__.TextField, { label: "Search by Request ID", placeholder: "e.g. REQ-000123", value: requestSearchId, onChange: (_, value) => this.setState({ requestSearchId: value || '' }), styles: { root: { marginBottom: '12px', maxWidth: 320 } } }),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginBottom: '20px', padding: '15px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginBottom: '10px' } }, "Request Approval Distribution"),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { height: '250px', position: 'relative' } },
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_chartjs_2__WEBPACK_IMPORTED_MODULE_37__.Pie, { data: {
                                                labels: Object.keys(managerQueueRequests.reduce((acc, req) => {
                                                    const status = req.status || 'Pending';
                                                    acc[status] = (acc[status] || 0) + 1;
                                                    return acc;
                                                }, {})).length ? Object.keys(managerQueueRequests.reduce((acc, req) => {
                                                    const status = req.status || 'Pending';
                                                    acc[status] = (acc[status] || 0) + 1;
                                                    return acc;
                                                }, {})) : ['No data'],
                                                datasets: [
                                                    {
                                                        label: 'Requests by Status',
                                                        data: Object.keys(managerQueueRequests.reduce((acc, req) => {
                                                            const status = req.status || 'Pending';
                                                            acc[status] = (acc[status] || 0) + 1;
                                                            return acc;
                                                        }, {})).length ? Object.keys(managerQueueRequests.reduce((acc, req) => {
                                                            const status = req.status || 'Pending';
                                                            acc[status] = (acc[status] || 0) + 1;
                                                            return acc;
                                                        }, {})).map(k => (managerQueueRequests.reduce((acc, req) => {
                                                            const status = req.status || 'Pending';
                                                            acc[status] = (acc[status] || 0) + 1;
                                                            return acc;
                                                        }, {}))[k]) : [1],
                                                        backgroundColor: [
                                                            'rgba(255, 206, 86, 0.6)',
                                                            'rgba(75, 192, 192, 0.6)',
                                                            'rgba(255, 99, 132, 0.6)',
                                                            'rgba(153, 102, 255, 0.6)',
                                                            'rgba(54, 162, 235, 0.6)',
                                                        ],
                                                        borderColor: [
                                                            'rgba(255, 206, 86, 1)',
                                                            'rgba(75, 192, 192, 1)',
                                                            'rgba(255, 99, 132, 1)',
                                                            'rgba(153, 102, 255, 1)',
                                                            'rgba(54, 162, 235, 1)',
                                                        ],
                                                        borderWidth: 1,
                                                    },
                                                ],
                                            }, options: { maintainAspectRatio: false } }))),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_RequestList__WEBPACK_IMPORTED_MODULE_6__.RequestList, { items: visibleManagerRequests, canApproveReject: true, canApproveAsset: false, hideStatusColumn: false, showResponseColumns: false, onApproveRequest: this._onApproveRequest, onRejectRequest: this._onRejectRequest, actionInProgressId: requestActionInProgressId })))),
                        isAdmin && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_36__.PivotItem, { headerText: "Asset Assignment Queue", itemIcon: "Send", itemKey: "AssetAssignmentQueue" },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Approved Requests for Asset Assignment")),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Only approved requests are shown here so assets can be assigned."),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_32__.TextField, { label: "Search by Request ID", placeholder: "e.g. REQ-000123", value: requestSearchId, onChange: (_, value) => this.setState({ requestSearchId: value || '' }), styles: { root: { marginBottom: '12px', maxWidth: 320 } } }),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_RequestList__WEBPACK_IMPORTED_MODULE_6__.RequestList, { items: visibleAdminRequests, canApproveReject: false, canApproveAsset: true, hideStatusColumn: true, showResponseColumns: false, onSelectRequestForAssignment: (request) => this.setState({ selectedAdminRequest: request, isAdminPanelOpen: true, adminSelectedAssetId: undefined, adminComment: '' }), actionInProgressId: requestActionInProgressId })))),
                        (isAdmin || isManager) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_36__.PivotItem, { headerText: "Asset Returns", itemIcon: "ReturnToSession", itemKey: "AssetReturns" },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Asset Returns Registry")),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Review and complete employee asset return requests, and verify physical hardware check-ins."),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ReturnRequestList__WEBPACK_IMPORTED_MODULE_12__.ReturnRequestList, { items: this.state.returnRequests, isAdmin: isAdmin, isManager: isManager, onUpdateStatus: this._onUpdateReturnRequestStatus, loading: this.state.returnRequestsLoading })))),
                        isAdmin && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_36__.PivotItem, { headerText: "Event Stream", itemIcon: "ActivityFeed", itemKey: "EventStream" },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_EventStream__WEBPACK_IMPORTED_MODULE_10__.EventStream, { logs: auditLogs, loading: auditLogsLoading, errorMessage: undefined, currentUserRole: effectiveRole, currentUserName: activeUserDisplayName }))),
                        isAdmin && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_36__.PivotItem, { headerText: "Users", itemIcon: "People", itemKey: "Users" },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "User Administration")),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Admin-only area. Manage SharePoint groups and user onboarding from your site permissions."),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginBottom: '20px', padding: '15px', backgroundColor: '#f0f6ff', borderRadius: '8px', borderLeft: '4px solid #0078d4' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginTop: 0, marginBottom: '10px', color: '#0078d4' } }, "SharePoint Group Management"),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { margin: 0, fontSize: '0.9rem', color: '#323130', marginBottom: '15px' } }, "To onboard new employees, grant them Admin access, or assign them as Inventory Managers, you must add them to the respective SharePoint Site Groups."),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_33__.PrimaryButton, { text: "Manage Site Permissions", iconProps: { iconName: 'Permissions' }, onClick: () => {
                                            const siteUrl = window.location.pathname.substring(0, window.location.pathname.toLowerCase().indexOf('/sitepages'));
                                            window.open(`${window.location.origin}${siteUrl}/_layouts/15/user.aspx`, '_blank');
                                        } })),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginBottom: '15px' } }, "Employee Directory & Asset Ownership"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_38__.DetailsList, { items: this.state.employees.map(emp => {
                                            const realName = emp.jobTitle === 'Admin' ? (activeUserDisplayName || emp.name) : emp.name;
                                            const assignedItems = items.filter(i => this._isAssetAssignedToCurrentUser(i, realName));
                                            const assetTypes = Array.from(new Set(assignedItems.map(a => a.assetType))).filter(t => t).join(', ');
                                            return {
                                                ...emp,
                                                assignedAssets: assignedItems.length,
                                                assignedItems: assignedItems,
                                                assetTypes: assetTypes || 'None'
                                            };
                                        }), columns: [
                                            { key: 'col1', name: 'Name', fieldName: 'name', minWidth: 100, maxWidth: 150, isResizable: true },
                                            { key: 'col2', name: 'Email', fieldName: 'email', minWidth: 150, maxWidth: 200, isResizable: true },
                                            { key: 'col3', name: 'Department', fieldName: 'department', minWidth: 100, maxWidth: 120, isResizable: true },
                                            { key: 'col4', name: 'Job Title', fieldName: 'jobTitle', minWidth: 120, maxWidth: 150, isResizable: true },
                                            {
                                                key: 'col5',
                                                name: 'Assigned Assets',
                                                fieldName: 'assignedAssets',
                                                minWidth: 100,
                                                maxWidth: 120,
                                                isResizable: true,
                                                onRender: (item) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                                        backgroundColor: item.assignedAssets > 0 ? '#dbeafe' : '#f3f4f6',
                                                        color: item.assignedAssets > 0 ? '#1e40af' : '#4b5563',
                                                        padding: '4px 10px',
                                                        borderRadius: '9999px',
                                                        fontWeight: 'bold'
                                                    } }, item.assignedAssets))
                                            },
                                            { key: 'col6', name: 'Asset Types', fieldName: 'assetTypes', minWidth: 120, maxWidth: 250, isResizable: true }
                                        ], setKey: "usersList", layoutMode: _fluentui_react__WEBPACK_IMPORTED_MODULE_39__.DetailsListLayoutMode.justified, selectionMode: _fluentui_react__WEBPACK_IMPORTED_MODULE_40__.SelectionMode.none, onRenderRow: (rowProps) => {
                                            if (!rowProps)
                                                return null;
                                            const isExpanded = this.state.expandedUserEmail === rowProps.item.email;
                                            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { onClick: () => this.setState({ expandedUserEmail: isExpanded ? undefined : rowProps.item.email }), style: { cursor: 'pointer', '&:hover': { backgroundColor: '#f3f2f1' } } },
                                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_41__.DetailsRow, { ...rowProps })),
                                                isExpanded && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '20px 40px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' } },
                                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginTop: 0, marginBottom: '15px', color: '#111827' } },
                                                        "Assets assigned to ",
                                                        rowProps.item.name),
                                                    rowProps.item.assignedItems.length > 0 ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_InventoryList__WEBPACK_IMPORTED_MODULE_3__.InventoryList, { items: rowProps.item.assignedItems, isAdmin: false })) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: '#6b7280', fontSize: '0.9rem', margin: 0 } }, "This user currently has no assets assigned to them."))))));
                                        } })),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '30px', borderTop: '1px solid rgba(128, 128, 128, 0.15)', paddingTop: '24px' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Asset Tracking & Direct Assignment")),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Admin and Manager area. Select an employee to view their assigned assets or directly assign new assets from the inventory."),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_AssetTracking__WEBPACK_IMPORTED_MODULE_19__.AssetTracking, { items: items, employees: this.state.employees, currentUserRole: effectiveRole, currentUserName: activeUserDisplayName, currentUserEmail: activeUserEmail, onAssignAssets: this._onAssignAssets, isActionInProgress: !!this.state.isTrackingActionInProgress }))))),
                        isAdmin && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_36__.PivotItem, { headerText: "Reports", itemIcon: "ReportDocument", itemKey: "Reports" },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Reporting & Insights")),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Use dashboard and event history to derive utilization, approval trends, and asset aging reports."),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px', padding: '15px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginBottom: '10px' } }, "Asset Utilization"),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '20px' } },
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#f3f4f6', borderRadius: '6px', flex: 1 } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px' } }, "Total Assets"),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' } }, items.length)),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#dbeafe', borderRadius: '6px', flex: 1 } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#1e40af', marginBottom: '4px' } }, "In Use / Assigned"),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#1e3a8a' } }, items.length - items.filter(i => i.status === 'In Stock' || i.status === 'Yes').length)),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#dcfce7', borderRadius: '6px', flex: 1 } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#166534', marginBottom: '4px' } }, "Utilization Rate"),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#14532d' } },
                                                items.length > 0 ? Math.round(((items.length - items.filter(i => i.status === 'In Stock' || i.status === 'Yes').length) / items.length) * 100) : 0,
                                                "%")))),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px', padding: '15px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginBottom: '10px' } }, "Approval Trends"),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '20px' } },
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#f3f4f6', borderRadius: '6px', flex: 1 } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px' } }, "Total Requests"),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' } }, this.state.requests.length)),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#dcfce7', borderRadius: '6px', flex: 1 } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#166534', marginBottom: '4px' } }, "Approved"),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#14532d' } }, this.state.requests.filter(r => (r.status || '').toLowerCase().includes('approv')).length)),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#fee2e2', borderRadius: '6px', flex: 1 } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#991b1b', marginBottom: '4px' } }, "Declined"),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#7f1d1d' } }, this.state.requests.filter(r => (r.status || '').toLowerCase().includes('declin') || (r.status || '').toLowerCase().includes('reject')).length)),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#fef3c7', borderRadius: '6px', flex: 1 } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#92400e', marginBottom: '4px' } }, "Approval Rate"),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#78350f' } },
                                                this.state.requests.length > 0 ? Math.round((this.state.requests.filter(r => (r.status || '').toLowerCase().includes('approv')).length / this.state.requests.length) * 100) : 0,
                                                "%")))),
                                (() => {
                                    const now = new Date();
                                    const aging = items.reduce((acc, item) => {
                                        if (!item.purchaseDate) {
                                            acc.unknown++;
                                            return acc;
                                        }
                                        const pd = new Date(item.purchaseDate);
                                        const diffYears = Math.abs(now.getTime() - pd.getTime()) / (1000 * 60 * 60 * 24 * 365);
                                        if (diffYears < 1)
                                            acc.under1++;
                                        else if (diffYears <= 3)
                                            acc.between1and3++;
                                        else
                                            acc.over3++;
                                        return acc;
                                    }, { under1: 0, between1and3: 0, over3: 0, unknown: 0 });
                                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px', padding: '15px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } },
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginBottom: '10px' } }, "Asset Aging"),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '20px' } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#dcfce7', borderRadius: '6px', flex: 1 } },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#166534', marginBottom: '4px' } }, "< 1 Year Old (New)"),
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#14532d' } }, aging.under1)),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#fef3c7', borderRadius: '6px', flex: 1 } },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#92400e', marginBottom: '4px' } }, "1 - 3 Years Old"),
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#78350f' } }, aging.between1and3)),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#fee2e2', borderRadius: '6px', flex: 1 } },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#991b1b', marginBottom: '4px' } }, "> 3 Years Old (Aging)"),
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#7f1d1d' } }, aging.over3)),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#f3f4f6', borderRadius: '6px', flex: 1 } },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px' } }, "Unknown Age"),
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' } }, aging.unknown)))));
                                })(),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px', padding: '15px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' } },
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: 0 } }, "Warranty Expiry Report"),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_33__.PrimaryButton, { text: "Export to Excel", iconProps: { iconName: 'ExcelDocument' }, onClick: this._exportWarrantyReportToExcel, styles: {
                                                root: { backgroundColor: '#107c41', borderColor: '#107c41', color: '#ffffff' },
                                                rootHovered: { backgroundColor: '#0b592e', borderColor: '#0b592e', color: '#ffffff' },
                                                rootPressed: { backgroundColor: '#0a522a', borderColor: '#0a522a', color: '#ffffff' }
                                            } })),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginBottom: '15px', display: 'flex', gap: '20px' } },
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#f3f4f6', borderRadius: '6px' } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px' } }, "Total Assets Count"),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' } }, items.length)),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#f3f4f6', borderRadius: '6px' } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px' } }, "Assets with Warranty Data"),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' } }, items.filter(i => i.warrantyExpiry).length))),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_38__.DetailsList, { items: items, columns: [
                                            { key: 'col1', name: 'Asset Name', fieldName: 'assetName', minWidth: 120, maxWidth: 200, isResizable: true, onRender: (item) => item.assetName || item.title },
                                            { key: 'col2', name: 'Asset Type', fieldName: 'assetType', minWidth: 100, maxWidth: 150, isResizable: true },
                                            { key: 'col3', name: 'Status', fieldName: 'status', minWidth: 80, maxWidth: 100, isResizable: true },
                                            { key: 'col4', name: 'Purchase Date', fieldName: 'purchaseDate', minWidth: 100, maxWidth: 120, isResizable: true },
                                            {
                                                key: 'col5',
                                                name: 'Warranty Expiry Date',
                                                fieldName: 'warrantyExpiry',
                                                minWidth: 140,
                                                maxWidth: 200,
                                                isResizable: true,
                                                onRender: (item) => {
                                                    const isExpired = item.warrantyExpiry && new Date(item.warrantyExpiry) < new Date();
                                                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                                            color: isExpired ? '#ef4444' : 'inherit',
                                                            fontWeight: isExpired ? 'bold' : 'normal'
                                                        } },
                                                        item.warrantyExpiry || 'N/A',
                                                        " ",
                                                        isExpired && '(Expired)'));
                                                }
                                            }
                                        ], setKey: "warrantyReport", layoutMode: _fluentui_react__WEBPACK_IMPORTED_MODULE_39__.DetailsListLayoutMode.justified, selectionMode: _fluentui_react__WEBPACK_IMPORTED_MODULE_40__.SelectionMode.none }))))),
                        isAdmin && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_36__.PivotItem, { headerText: "Config", itemIcon: "Settings", itemKey: "Config" },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Configuration")),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Admin-only configuration area for list schema, process settings, and environment setup."),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginBottom: '10px', color: '#111827', marginTop: 0 } }, "Mapping List Management & Sync"),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { fontSize: '0.88rem', color: '#4b5563', margin: '0 0 15px 0' } },
                                        "Ensure all assets currently assigned to active employees are properly mapped to the SharePoint ",
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Mapping List"),
                                        ". Use the buttons below to perform a manual synchronization check or diagnose the list's database schema."),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '15px' } },
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_33__.PrimaryButton, { text: this.state.syncInProgress ? "Processing..." : "Sync Assigned Assets", iconProps: { iconName: 'Sync' }, onClick: this._onSyncAssignedAssets, disabled: this.state.syncInProgress }),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_33__.PrimaryButton, { text: this.state.syncInProgress ? "Checking Schema..." : "Run Schema Diagnostics", iconProps: { iconName: 'Database' }, onClick: this._onRunDiagnostics, disabled: this.state.syncInProgress, styles: {
                                                root: { backgroundColor: '#5c2d91', borderColor: '#5c2d91' },
                                                rootHovered: { backgroundColor: '#4b2278', borderColor: '#4b2278' }
                                            } })),
                                    this.state.syncMessage && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBar, { messageBarType: this.state.syncMessageType, onDismiss: () => this.setState({ syncMessage: undefined }), styles: { root: { marginBottom: '15px', borderRadius: '6px' } } }, this.state.syncMessage)),
                                    this.state.diagnosticInfo && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '15px' } },
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#323130', marginBottom: '6px' } }, "Diagnostic Log Output:"),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("textarea", { readOnly: true, value: this.state.diagnosticInfo, rows: 10, style: {
                                                width: '100%',
                                                fontFamily: 'monospace',
                                                fontSize: '0.82rem',
                                                padding: '10px',
                                                backgroundColor: '#f3f2f1',
                                                border: '1px solid #e1dfdd',
                                                borderRadius: '4px',
                                                resize: 'vertical',
                                                color: '#323130'
                                            } })))),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } },
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginBottom: '15px', color: '#111827', marginTop: 0 } }, "SharePoint List Connections"),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("ul", { style: { listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem' } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", { style: { marginBottom: '12px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#4b5563' } }, "Inventory Database:"),
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, "InventoryList")),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", { style: { marginBottom: '12px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#4b5563' } }, "Approvals & Requests:"),
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, "RequestList")),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", { style: { display: 'flex', justifyContent: 'space-between' } },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#4b5563' } }, "System Audit Logs:"),
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, "AuditLogList")))),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } },
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginBottom: '15px', color: '#111827', marginTop: 0 } }, "Role Based Access Control"),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("ul", { style: { listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem' } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", { style: { marginBottom: '12px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#4b5563' } }, "Admin Group:"),
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, "Inventory Administrators")),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", { style: { marginBottom: '12px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#4b5563' } }, "Manager Group:"),
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, "Inventory Managers")),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", { style: { display: 'flex', justifyContent: 'space-between' } },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#4b5563' } }, "Employee Access:"),
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#111827' } }, "Site Visitors"))))),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px', backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginBottom: '5px', color: '#111827', marginTop: 0 } }, "Required List Schema (Developer Reference)"),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { fontSize: '0.85rem', color: '#6b7280', marginBottom: '15px', marginTop: 0 } }, "Ensure your SharePoint lists contain the following columns exactly as written to prevent validation errors."),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h5", { style: { marginTop: '15px', marginBottom: '8px', color: '#374151' } },
                                        "InventoryList ",
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontWeight: 'normal', color: '#9ca3af' } }, "(Asset Database)")),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '25px' } }, ['Title', 'AssetName', 'AssetType', 'SerialNumber', 'PurchaseDate', 'Status', 'Specifications', 'AssignedTo (Person/Group)'].map(col => (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { key: col, style: { backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', color: '#374151', border: '1px solid #e5e7eb' } }, col)))),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h5", { style: { marginBottom: '8px', color: '#374151' } },
                                        "RequestList ",
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontWeight: 'normal', color: '#9ca3af' } }, "(Approval Workflows)")),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } }, ['Title', 'Employee', 'AssetType', 'Quantity', 'ReasonforRequest', 'RequestStatus', 'RequestKey', 'AssetStatus'].map(col => (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { key: col, style: { backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', color: '#374151', border: '1px solid #e5e7eb' } }, col))))))))))),
            (isAdmin || isManager) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_AssetForm__WEBPACK_IMPORTED_MODULE_8__.AssetForm, { isOpen: isAssetFormOpen, onClose: () => this.setState({ isAssetFormOpen: false }), currentUserRole: effectiveRole, onAddAsset: this._onAddAsset })),
            (isAdmin || isManager || isEmployee) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_RequestForm__WEBPACK_IMPORTED_MODULE_9__.RequestForm, { isOpen: isRequestFormOpen, onClose: () => this.setState({ isRequestFormOpen: false }), availableAssets: items, employees: this.state.employees, currentUserRole: effectiveRole, currentUserName: activeUserDisplayName, onSubmitRequest: this._onSubmitRequest })),
            (isAdmin || isManager || isEmployee) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_IncidentRequest_IncidentRequestModule__WEBPACK_IMPORTED_MODULE_21__.IncidentRequestModule, { ...this.props, isOpen: this.state.isIncidentFormOpen, onClose: () => this.setState({ isIncidentFormOpen: false, selectedAssetForIncident: undefined }), userDisplayName: activeUserDisplayName, userEmail: activeUserEmail, setIsLoading: (loading) => this.setState({ loading }), preselectedAsset: this.state.selectedAssetForIncident })),
            this._renderNotificationDetailsPanel(),
            this._renderAdminAssignmentPanel(),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ReturnAssetForm__WEBPACK_IMPORTED_MODULE_11__.ReturnAssetForm, { isOpen: this.state.isReturnFormOpen, onDismiss: () => this.setState({ isReturnFormOpen: false, selectedAssetForReturn: undefined }), asset: this.state.selectedAssetForReturn, onSubmit: this._onSubmitReturnRequest })));
    }
}


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("7db7fdb99b42f3eeb2ed")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=inventory-management-web-part.a9e9e28ead4ff8668310.hot-update.js.map