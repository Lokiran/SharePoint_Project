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
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @fluentui/react */ 46643);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @fluentui/react */ 21314);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @fluentui/react */ 52394);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @fluentui/react */ 63208);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! @fluentui/react */ 53918);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @fluentui/react */ 27006);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! @fluentui/react */ 18681);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! @fluentui/react */ 12042);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! @fluentui/react */ 67102);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! @fluentui/react */ 29425);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! @fluentui/react */ 5613);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! @fluentui/react */ 92070);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! @fluentui/react */ 15369);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! @fluentui/react */ 79370);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! @fluentui/react */ 37805);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! @fluentui/react */ 74423);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! @fluentui/react */ 20472);
/* harmony import */ var chart_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! chart.js */ 55277);
/* harmony import */ var react_chartjs_2__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! react-chartjs-2 */ 86766);
/* harmony import */ var jspdf__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! jspdf */ 28339);
/* harmony import */ var _pnp_sp_site_users_web__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @pnp/sp/site-users/web */ 43500);
/* harmony import */ var _pnp_sp_site_groups_web__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @pnp/sp/site-groups/web */ 49036);
/* harmony import */ var _data_mockData__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../data/mockData */ 27962);
/* harmony import */ var _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../services/InventoryService */ 29619);
/* harmony import */ var _AssetTracking__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./AssetTracking */ 20867);
/* harmony import */ var _pages__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../pages */ 56330);
/* harmony import */ var _NotificationCenter__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./NotificationCenter */ 58350);
/* harmony import */ var _IncidentRequest_IncidentRequestModule__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./IncidentRequest/IncidentRequestModule */ 19581);
/* harmony import */ var _AssetLifecycleDiagram__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./AssetLifecycleDiagram */ 29643);
/* harmony import */ var _WorkflowPopup__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./WorkflowPopup */ 235);

















chart_js__WEBPACK_IMPORTED_MODULE_14__.Chart.register(chart_js__WEBPACK_IMPORTED_MODULE_14__.CategoryScale, chart_js__WEBPACK_IMPORTED_MODULE_14__.LinearScale, chart_js__WEBPACK_IMPORTED_MODULE_14__.ArcElement, chart_js__WEBPACK_IMPORTED_MODULE_14__.BarElement, chart_js__WEBPACK_IMPORTED_MODULE_14__.Title, chart_js__WEBPACK_IMPORTED_MODULE_14__.Tooltip, chart_js__WEBPACK_IMPORTED_MODULE_14__.Legend);










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
            // 1. Check item status - returned or in-stock assets are no longer assigned
            const statusLower = (item.status || '').toLowerCase().trim();
            if (statusLower === 'in stock' ||
                statusLower === 'instock' ||
                statusLower === 'available' ||
                statusLower === 'returned' ||
                statusLower === 'return approved' ||
                statusLower === 'returnapproved' ||
                statusLower === 'under maintenance' ||
                statusLower === 'damaged' ||
                statusLower === 'disposed' ||
                statusLower === 'retired') {
                return false;
            }
            // 2. Check if there is a completed return request for this asset
            const returnRequests = this.state ? this.state.returnRequests : [];
            if (returnRequests && returnRequests.length > 0) {
                const isReturned = returnRequests.some(r => {
                    const isSameAsset = (r.assetId && r.assetId === item.id) ||
                        (r.serialNumber && item.serialNumber && r.serialNumber.toLowerCase().trim() === item.serialNumber.toLowerCase().trim()) ||
                        (r.assetName && item.assetName && r.assetName.toLowerCase().trim() === item.assetName.toLowerCase().trim() && normalize(r.requesterName) === activeUser);
                    const isCompleted = r.status === 'Completed' || r.status === 'Returned' || r.adminStatus === 'Completed';
                    return isSameAsset && isCompleted;
                });
                if (isReturned) {
                    return false;
                }
            }
            // 3. Match user assignment
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
            const isManager = effectiveRole === 'Inventory Manager';
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
                    if (isManager && (ret.status === 'Pending Manager Approval' || ret.status === 'Pending')) {
                        const id = `ret-pending-mgr-${ret.id}`;
                        if (!clearedIds.has(id)) {
                            notifications.push({
                                id,
                                title: "Asset Return Pending Manager Approval",
                                message: `${ret.requesterName} requested to return ${ret.assetName} (Reason: ${ret.returnReason || "None"})`,
                                type: 'info',
                                timestamp: formatTime(ret.requestDate),
                                isRead: readIds.has(id),
                                actionLink: 'AssetReturns',
                                category: 'Request'
                            });
                        }
                    }
                    else if (isAdmin && ret.status === 'Pending Admin Verification') {
                        const id = `ret-pending-adm-${ret.id}`;
                        if (!clearedIds.has(id)) {
                            notifications.push({
                                id,
                                title: "Asset Return Pending Admin Verification",
                                message: `Manager approved return of ${ret.assetName} by ${ret.requesterName}. Awaiting Admin verification.`,
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
                    if (ret.status === 'Approved' || ret.status === 'Rejected' || ret.status === 'Completed' || ret.status === 'Pending Admin Verification') {
                        const id = `ret-resolved-${ret.id}-${ret.status}`;
                        if (!clearedIds.has(id)) {
                            let titleText = "Return Request Manager Approved";
                            let type = 'info';
                            let messageText = `Your return request for ${ret.assetName} has been approved by your manager. Awaiting Admin verification.`;
                            if (ret.status === 'Rejected') {
                                titleText = "Return Request Rejected";
                                type = 'error';
                                messageText = `Your return request for ${ret.assetName} was rejected. Note: ${ret.managerComment || ""}`;
                            }
                            else if (ret.status === 'Completed' || ret.status === 'Approved') {
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
                                actionLink: 'MyRequests',
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
                const finalEmployees = loadedEmployees.length > 0 ? loadedEmployees : _data_mockData__WEBPACK_IMPORTED_MODULE_17__.EMPLOYEES;
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
                    employees: _data_mockData__WEBPACK_IMPORTED_MODULE_17__.EMPLOYEES,
                    roleLoading: false
                });
            }
        };
        this._loadInventory = async () => {
            try {
                this.setState({ loading: true, errorMessage: undefined });
                const items = await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.getItems();
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
                const requests = await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.getRequests();
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
            this.setState(prevState => ({
                auditLogsRefreshTrigger: (prevState.auditLogsRefreshTrigger || 0) + 1
            }));
        };
        this._loadReturnRequests = async () => {
            try {
                this.setState({ returnRequestsLoading: true });
                const returnRequests = await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.getReturnRequests();
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
                    assetType: selectedAssetForReturn.assetType,
                    serialNumber: selectedAssetForReturn.serialNumber,
                    requesterName: this.state.activeUserDisplayName,
                    requesterEmail: this.state.activeUserEmail,
                    requestDate: new Date().toISOString().split('T')[0],
                    returnReason: reason,
                    proposedCondition: condition
                };
                await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.addReturnRequest(reqPayload, this.state.activeUserDisplayName);
                await this._loadInventory();
                await this._loadReturnRequests();
                await this._loadAuditLogs();
                this.setState({
                    isReturnFormOpen: false,
                    selectedAssetForReturn: undefined,
                    returnRequestsLoading: false,
                    syncMessage: `Return request for "${selectedAssetForReturn.assetName || selectedAssetForReturn.title}" submitted successfully!`,
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_25__.MessageBarType.success,
                    workflowPopup: {
                        isOpen: true,
                        title: 'Asset Return Request Submitted',
                        stage: 'Return Stage 1: Submitted',
                        type: 'info',
                        message: `Return request for "${selectedAssetForReturn.assetName || selectedAssetForReturn.title}" has been submitted and is awaiting manager review.`,
                        details: {
                            assetTitle: selectedAssetForReturn.assetName || selectedAssetForReturn.title,
                            requesterName: this.state.activeUserDisplayName,
                            status: 'Pending Manager Approval',
                            condition: condition,
                            comment: reason,
                            date: new Date().toISOString().split('T')[0]
                        }
                    }
                });
            }
            catch (error) {
                const msg = error.message && error.message.includes("already in progress")
                    ? error.message
                    : `Failed to submit return request: ${error.message || JSON.stringify(error)}`;
                this.setState({
                    errorMessage: msg,
                    returnRequestsLoading: false
                });
            }
        };
        this._onUpdateReturnRequestStatus = async (requestId, status, comment, finalCondition, adminComments, managerStatus, adminStatus) => {
            try {
                this.setState({ returnRequestsLoading: true });
                await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.updateReturnRequestStatus(requestId, status, comment, this.state.activeUserDisplayName, finalCondition, adminComments, managerStatus, adminStatus);
                await this._loadInventory();
                await this._loadReturnRequests();
                await this._loadAuditLogs();
                const isCompleted = status === 'Completed';
                const isRejected = status === 'Rejected';
                this.setState({
                    returnRequestsLoading: false,
                    workflowPopup: {
                        isOpen: true,
                        title: isCompleted ? 'Asset Return Completed' : isRejected ? 'Return Request Rejected' : 'Return Request Approved',
                        stage: isCompleted ? 'Return Stage 3: Completed & Checked In' : isRejected ? 'Return Stage: Rejected' : 'Return Stage 2: Manager Approved',
                        type: isCompleted ? 'success' : isRejected ? 'error' : 'info',
                        message: isCompleted
                            ? `Asset return #${requestId} has been verified by IT Admin and checked back into active stock.`
                            : isRejected
                                ? `Return request #${requestId} was rejected.`
                                : `Return request #${requestId} was approved by manager and sent to IT Admin for verification.`,
                        details: {
                            requestId: `#${requestId}`,
                            status: status,
                            comment: comment || adminComments,
                            date: new Date().toISOString().split('T')[0]
                        }
                    }
                });
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
                await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.addItem(newAsset, this.state.activeUserDisplayName);
                await this._loadInventory(); // Refresh list
                await this._loadAuditLogs(); // Refresh audit logs
                this.setState({
                    loading: false,
                    isAssetFormOpen: false,
                    workflowPopup: {
                        isOpen: true,
                        title: 'New Inventory Asset Created',
                        stage: 'Catalog Management',
                        type: 'success',
                        message: `Asset "${newAssetData.title || newAssetData.assetName}" was successfully added to stock inventory.`,
                        details: {
                            assetTitle: newAssetData.title || newAssetData.assetName,
                            status: 'In Stock',
                            date: newAssetData.purchaseDate || new Date().toISOString().split('T')[0]
                        }
                    }
                });
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
                const initialStatus = 'Pending';
                const tempId = `temp-${Date.now()}`;
                const localRequest = {
                    id: tempId,
                    requestKey: `REQ-${("000000" + (this.state.requests.length + 1)).slice(-6)}`,
                    requesterName: requestData.requesterName,
                    employeeId: requestData.employeeId || "",
                    managerName: requestData.managerName || "",
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
                    requests: [localRequest, ...prevState.requests],
                    workflowPopup: {
                        isOpen: true,
                        title: 'Asset Request Created',
                        stage: 'Stage 1: Request Submitted',
                        type: 'success',
                        message: `Your request for "${requestData.assetTitle}" has been submitted successfully and routed to manager (${requestData.managerName || 'Manager'}) for approval.`,
                        details: {
                            requestId: localRequest.requestKey,
                            assetTitle: requestData.assetTitle,
                            quantity: requestData.quantity,
                            requesterName: requestData.requesterName,
                            managerName: requestData.managerName,
                            status: initialStatus,
                            date: localRequest.requestDate
                        }
                    }
                }));
                await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.addRequest({
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
                    await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.updateRequestStatus(parseInt(request.id, 10), 'Approved', this.state.activeUserDisplayName);
                    await this._loadRequests();
                    await this._loadAuditLogs();
                }
                this.setState({
                    workflowPopup: {
                        isOpen: true,
                        title: 'Asset Request Approved by Manager',
                        stage: 'Stage 2: Manager Approved',
                        type: 'success',
                        message: `Request ${request.requestKey || `#${request.id}`} for "${request.assetTitle}" requested by ${request.requesterName} was APPROVED by Manager. Moved to IT Admin for physical asset allocation.`,
                        details: {
                            requestId: request.requestKey || `#${request.id}`,
                            assetTitle: request.assetTitle,
                            requesterName: request.requesterName,
                            managerName: request.managerName || this.state.activeUserDisplayName,
                            status: 'Approved',
                            date: request.requestDate
                        }
                    }
                });
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
                    await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.updateRequestStatus(parseInt(request.id, 10), 'Declined', this.state.activeUserDisplayName, reason);
                    await this._loadRequests();
                    await this._loadAuditLogs();
                }
                this.setState({
                    workflowPopup: {
                        isOpen: true,
                        title: 'Asset Request Rejected by Manager',
                        stage: 'Stage 2: Manager Review',
                        type: 'error',
                        message: `Request ${request.requestKey || `#${request.id}`} for "${request.assetTitle}" requested by ${request.requesterName} was REJECTED by Manager.`,
                        details: {
                            requestId: request.requestKey || `#${request.id}`,
                            assetTitle: request.assetTitle,
                            requesterName: request.requesterName,
                            managerName: request.managerName || this.state.activeUserDisplayName,
                            status: 'Declined',
                            comment: reason,
                            date: request.requestDate
                        }
                    }
                });
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
                    await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.updateAssetStatus(parseInt(request.id, 10), 'Approved', this.state.activeUserDisplayName);
                    await this._loadRequests();
                    await this._loadAuditLogs();
                }
                this.setState({
                    workflowPopup: {
                        isOpen: true,
                        title: 'Physical Asset Allocated & Dispatched',
                        stage: 'Stage 3: Admin Asset Allocation',
                        type: 'success',
                        message: `Physical asset "${request.assetTitle}" has been allocated to ${request.requesterName} by System Administrator! Request fulfilled.`,
                        details: {
                            requestId: request.requestKey || `#${request.id}`,
                            assetTitle: request.assetTitle,
                            requesterName: request.requesterName,
                            status: 'Asset Allocated & Dispatched',
                            date: new Date().toISOString().split('T')[0]
                        }
                    }
                });
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
                await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.assignAssetsToEmployee(assetIds, employeeName, employeeEmail, this.state.activeUserDisplayName, employeeId);
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
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_25__.MessageBarType.info
                });
                const result = await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.syncExistingAssignmentsToMappingList(this.state.activeUserDisplayName);
                this.setState({
                    syncInProgress: false,
                    syncMessage: `Synchronization complete! Verified ${result.checkedCount} assigned assets. Successfully checked and synchronized ${result.syncedCount} missing mapping records.`,
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_25__.MessageBarType.success
                });
                // Reload inventory to ensure consistency
                await this._loadInventory();
            }
            catch (e) {
                console.error("Manual sync failed:", e);
                this.setState({
                    syncInProgress: false,
                    syncMessage: `Failed to synchronize mapping records: ${e.message || JSON.stringify(e)}`,
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_25__.MessageBarType.error
                });
            }
        };
        this._onRunDiagnostics = async () => {
            try {
                this.setState({
                    syncInProgress: true,
                    syncMessage: 'Running Mapping List diagnostic check...',
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_25__.MessageBarType.info
                });
                const diagnosticInfo = await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.diagnoseMappingListFields();
                this.setState({
                    syncInProgress: false,
                    diagnosticInfo,
                    syncMessage: 'Diagnostic check complete! Columns and item counts retrieved successfully.',
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_25__.MessageBarType.success
                });
            }
            catch (e) {
                this.setState({
                    syncInProgress: false,
                    syncMessage: `Failed to retrieve diagnostics: ${e.message || JSON.stringify(e)}`,
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_25__.MessageBarType.error
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
        this._exportWarrantyReportToPDF = () => {
            const { items } = this.state;
            const doc = new jspdf__WEBPACK_IMPORTED_MODULE_13__.jsPDF();
            // Header
            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.text("Asset Warranty Expiry Report", 14, 20);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
            doc.text(`Total Assets: ${items.length} | Assets with Warranty: ${items.filter(i => i.warrantyExpiry).length}`, 14, 34);
            // Table Headers
            doc.setFont("helvetica", "bold");
            doc.setFillColor(240, 240, 240);
            doc.rect(14, 42, 182, 8, "F");
            doc.text("Asset Name", 16, 47);
            doc.text("Asset Type", 70, 47);
            doc.text("Status", 110, 47);
            doc.text("Purchase Date", 140, 47);
            doc.text("Warranty Expiry", 170, 47);
            doc.setDrawColor(200, 200, 200);
            doc.line(14, 50, 196, 50);
            // Rows
            doc.setFont("helvetica", "normal");
            let y = 56;
            items.forEach((item) => {
                if (y > 275) {
                    doc.addPage();
                    y = 20;
                    doc.setFont("helvetica", "bold");
                    doc.setFillColor(240, 240, 240);
                    doc.rect(14, y - 6, 182, 8, "F");
                    doc.text("Asset Name", 16, y - 1);
                    doc.text("Asset Type", 70, y - 1);
                    doc.text("Status", 110, y - 1);
                    doc.text("Purchase Date", 140, y - 1);
                    doc.text("Warranty Expiry", 170, y - 1);
                    doc.line(14, y + 2, 196, y + 2);
                    doc.setFont("helvetica", "normal");
                    y += 8;
                }
                const name = (item.assetName || item.title || "").substring(0, 25);
                const type = (item.assetType || "").substring(0, 18);
                const status = (item.status || "").substring(0, 15);
                const purchaseDate = item.purchaseDate || "N/A";
                const warrantyExpiry = item.warrantyExpiry || "N/A";
                doc.text(name, 16, y);
                doc.text(type, 70, y);
                doc.text(status, 110, y);
                doc.text(purchaseDate, 140, y);
                doc.text(warrantyExpiry, 170, y);
                doc.line(14, y + 2, 196, y + 2);
                y += 8;
            });
            doc.save(`Warranty_Expiry_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        };
        this._exportDetailedReportToExcel = (filteredItems) => {
            const headers = ["Asset Name", "Asset Type", "Status", "Condition", "Purchase Date", "Assigned To", "Specifications"];
            const csvRows = [headers.join(",")];
            filteredItems.forEach(item => {
                const name = (item.assetName || item.title || "").replace(/"/g, '""');
                const type = (item.assetType || "").replace(/"/g, '""');
                const status = (item.status || "").replace(/"/g, '""');
                const condition = (item.condition || "").replace(/"/g, '""');
                const purchaseDate = (item.purchaseDate || "").replace(/"/g, '""');
                const assignedTo = (item.assignedTo || "N/A").replace(/"/g, '""');
                const specs = (item.specifications || "").replace(/"/g, '""');
                const row = [
                    `"${name}"`,
                    `"${type}"`,
                    `"${status}"`,
                    `"${condition}"`,
                    `"${purchaseDate}"`,
                    `"${assignedTo}"`,
                    `"${specs}"`
                ];
                csvRows.push(row.join(","));
            });
            const csvContent = "\uFEFF" + csvRows.join("\n");
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `Detailed_Asset_Report_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        this._exportDetailedReportToPDF = (filteredItems) => {
            const doc = new jspdf__WEBPACK_IMPORTED_MODULE_13__.jsPDF();
            // Header
            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.text("Detailed Inventory Asset Report", 14, 20);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
            doc.text(`Total Assets Displayed: ${filteredItems.length}`, 14, 34);
            // Table Headers
            doc.setFont("helvetica", "bold");
            doc.setFillColor(240, 240, 240);
            doc.rect(14, 42, 182, 8, "F");
            doc.text("Asset Name", 16, 47);
            doc.text("Asset Type", 65, 47);
            doc.text("Status", 100, 47);
            doc.text("Condition", 130, 47);
            doc.text("Assigned To", 160, 47);
            doc.setDrawColor(200, 200, 200);
            doc.line(14, 50, 196, 50);
            // Rows
            doc.setFont("helvetica", "normal");
            let y = 56;
            filteredItems.forEach((item) => {
                if (y > 275) {
                    doc.addPage();
                    y = 20;
                    doc.setFont("helvetica", "bold");
                    doc.setFillColor(240, 240, 240);
                    doc.rect(14, y - 6, 182, 8, "F");
                    doc.text("Asset Name", 16, y - 1);
                    doc.text("Asset Type", 65, y - 1);
                    doc.text("Status", 100, y - 1);
                    doc.text("Condition", 130, y - 1);
                    doc.text("Assigned To", 160, y - 1);
                    doc.line(14, y + 2, 196, y + 2);
                    doc.setFont("helvetica", "normal");
                    y += 8;
                }
                const name = (item.assetName || item.title || "").substring(0, 23);
                const type = (item.assetType || "").substring(0, 15);
                const status = (item.status || "").substring(0, 14);
                const condition = (item.condition || "N/A").substring(0, 14);
                const assignedTo = (item.assignedTo || "N/A").substring(0, 18);
                doc.text(name, 16, y);
                doc.text(type, 65, y);
                doc.text(status, 100, y);
                doc.text(condition, 130, y);
                doc.text(assignedTo, 160, y);
                doc.line(14, y + 2, 196, y + 2);
                y += 8;
            });
            doc.save(`Detailed_Asset_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        };
        this._testListConnection = async (listTitle, internalTitle) => {
            this.setState(prevState => ({
                connectionStatuses: { ...prevState.connectionStatuses, [listTitle]: 'testing' },
                connectionErrorMessages: { ...prevState.connectionErrorMessages, [listTitle]: '' }
            }));
            try {
                const sp = (0,_pnpjsConfig__WEBPACK_IMPORTED_MODULE_7__.getSP)();
                // Try to load 1 item from list to test connection and permissions
                await sp.web.lists.getByTitle(internalTitle).items.select("ID").top(1)();
                this.setState(prevState => ({
                    connectionStatuses: { ...prevState.connectionStatuses, [listTitle]: 'connected' }
                }));
            }
            catch (e) {
                console.warn(`Connection test failed for list ${listTitle}`, e);
                this.setState(prevState => ({
                    connectionStatuses: { ...prevState.connectionStatuses, [listTitle]: 'error' },
                    connectionErrorMessages: { ...prevState.connectionErrorMessages, [listTitle]: e.message || 'Verification failed. List might be missing or inaccessible.' }
                }));
            }
        };
        this._loadGroupUsers = async (groupName) => {
            this.setState(prevState => ({
                loadingGroupUsers: { ...prevState.loadingGroupUsers, [groupName]: true }
            }));
            try {
                const sp = (0,_pnpjsConfig__WEBPACK_IMPORTED_MODULE_7__.getSP)();
                const users = await sp.web.siteGroups.getByName(groupName).users();
                const userList = users.map((u) => u.Title || u.LoginName || 'Unknown User');
                this.setState(prevState => ({
                    groupUsersList: { ...prevState.groupUsersList, [groupName]: userList },
                    loadingGroupUsers: { ...prevState.loadingGroupUsers, [groupName]: false }
                }));
            }
            catch (e) {
                console.warn(`Failed to load members for group ${groupName}`, e);
                this.setState(prevState => ({
                    groupUsersList: { ...prevState.groupUsersList, [groupName]: ['Error retrieving group members'] },
                    loadingGroupUsers: { ...prevState.loadingGroupUsers, [groupName]: false }
                }));
            }
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
            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_26__.Stack, { tokens: { childrenGap: 20 } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } }, "Request Overview"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].responsiveGrid, style: { fontSize: '0.88rem' } },
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
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_27__.Icon, { iconName: "BarChart4", style: { color: '#0078d4' } }),
                        " Detailed Analysis"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_26__.Stack, { tokens: { childrenGap: 12 } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' } }, "Inventory Availability Check:"),
                            isSufficient ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_28__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_25__.MessageBarType.success, styles: { root: { borderRadius: '6px' } } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Inventory Check Passed:"),
                                " There are currently ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, inStockCount),
                                " unit(s) of ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, reqAssetTitle),
                                " in stock, which is sufficient to fulfill this request.")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_28__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_25__.MessageBarType.warning, styles: { root: { borderRadius: '6px' } } },
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
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_29__.ProgressIndicator, { label: currentStepText, percentComplete: progressPercent, styles: { root: { marginTop: '5px' } } }))))));
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
            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_26__.Stack, { tokens: { childrenGap: 20 } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } }, "Asset Specifications"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].responsiveGrid, style: { fontSize: '0.88rem' } },
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
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_27__.Icon, { iconName: "Heart", style: { color: conditionColor } }),
                        " Health & Depreciation Analysis"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_26__.Stack, { tokens: { childrenGap: 12 } },
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
                            asset.warrantyExpiry ? (isExpired ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_28__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_25__.MessageBarType.error, styles: { root: { borderRadius: '6px' } } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Warranty Expired:"),
                                " Coverage ended on ",
                                asset.warrantyExpiry,
                                ". Any future repair operations will incur full direct business costs.")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_28__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_25__.MessageBarType.success, styles: { root: { borderRadius: '6px' } } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Warranty Active:"),
                                " Covered under manufacturer protection until ",
                                asset.warrantyExpiry,
                                "."))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_28__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_25__.MessageBarType.info, styles: { root: { borderRadius: '6px' } } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Warranty Unknown:"),
                                " No warranty expiration date has been registered for this asset."))),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { borderTop: '1px solid #e2e8f0', paddingTop: '10px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' } }, "Asset Physical Health:"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_27__.Icon, { iconName: healthIcon, style: { fontSize: '18px', color: conditionColor } }),
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
            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_30__.Panel, { isOpen: isNotificationDetailsOpen, onDismiss: () => this.setState({ isNotificationDetailsOpen: false }), type: _fluentui_react__WEBPACK_IMPORTED_MODULE_31__.PanelType.medium, headerText: selectedNotification.title, closeButtonAriaLabel: "Close" },
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
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_28__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_25__.MessageBarType.info }, "This is a general system notification. There is no direct database link to an active request or asset."))))));
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
                    await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.assignAssetsToEmployee([adminSelectedAssetId], request.requesterName, employeeEmail, approverName, employeeId, adminComment);
                }
                else {
                    // No asset selected, just approve the asset request status
                    await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.updateAssetStatus(parseInt(request.id, 10), 'Approved', approverName, adminComment);
                }
                // Close panel and refresh data
                this.setState({
                    isAdminPanelOpen: false,
                    selectedAdminRequest: undefined,
                    adminSelectedAssetId: undefined,
                    adminComment: '',
                    workflowPopup: {
                        isOpen: true,
                        title: 'Physical Asset Allocated & Dispatched',
                        stage: 'Stage 3: Admin Asset Allocation',
                        type: 'success',
                        message: `Asset "${request.assetTitle}" has been allocated to ${request.requesterName} by System Administrator! Request fulfilled.`,
                        details: {
                            requestId: request.requestKey || `#${request.id}`,
                            assetTitle: request.assetTitle,
                            requesterName: request.requesterName,
                            status: 'Asset Allocated & Dispatched',
                            comment: adminComment,
                            date: new Date().toISOString().split('T')[0]
                        }
                    }
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
                await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.updateRequestStatus(parseInt(request.id, 10), 'Declined', approverName, adminComment || 'Rejected by Admin during assignment');
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
            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_30__.Panel, { isOpen: this.state.isAdminPanelOpen, onDismiss: () => this.setState({ isAdminPanelOpen: false, selectedAdminRequest: undefined }), type: _fluentui_react__WEBPACK_IMPORTED_MODULE_31__.PanelType.medium, headerText: `Request #${request.requestKey || request.id}`, closeButtonAriaLabel: "Close" },
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
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].responsiveGridGap16, style: { fontSize: '0.85rem' } },
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
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_32__.Dropdown, { placeholder: dropdownPlaceholder, options: matchingAssetOptions, selectedKey: this.state.adminSelectedAssetId, onChange: this._onAdminAssetChange, disabled: matchingAssets.length === 0 || isBusy, styles: { dropdown: { width: '100%' } } })),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("label", { style: { fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)', display: 'block', marginBottom: '6px' } }, "Comment"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_33__.TextField, { multiline: true, rows: 4, placeholder: "Add a comment explaining your decision...", value: this.state.adminComment, onChange: (_, value) => this.setState({ adminComment: value || '' }), disabled: isBusy })),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '12px', marginTop: '8px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_34__.PrimaryButton, { text: isBusy ? "Processing..." : "Assign & Approve", onClick: this._handleAdminAssignAndApprove, disabled: isBusy, iconProps: { iconName: 'CompletedSolid' } }),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_35__.DefaultButton, { text: "Reject", onClick: this._handleAdminReject, disabled: isBusy, iconProps: { iconName: 'Cancel' }, styles: {
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
            employees: _data_mockData__WEBPACK_IMPORTED_MODULE_17__.EMPLOYEES,
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
            auditLogsRefreshTrigger: 0,
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
            adminComment: '',
            sidebarCollapsed: false,
            reportsSelectedTab: 'insights',
            reportsAssetTypeFilter: 'All',
            reportsStatusFilter: 'All',
            configSelectedTab: 'operations',
            connectionStatuses: {},
            connectionErrorMessages: {},
            groupUsersList: {},
            loadingGroupUsers: {},
            workflowPopup: {
                isOpen: false,
                title: '',
                stage: '',
                type: 'info',
                message: ''
            }
        };
    }
    async componentDidMount() {
        await this._resolveUserRole();
        await this._loadReturnRequests();
        // Run self-healing cleanup for Return Approved/Completed assets BEFORE loading inventory
        try {
            await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.cleanupReturnApprovedAssets();
        }
        catch (e) {
            console.warn("Failed to run Return Approved assets self-healing cleanup:", e);
        }
        await this._loadInventory();
        await this._loadRequests();
        await this._loadAuditLogs();
        // Dynamically auto-sync existing assigned assets of our 5 active users to the Mapping List
        try {
            await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.syncExistingAssignmentsToMappingList(this.state.activeUserDisplayName);
            await this._loadInventory();
        }
        catch (e) {
            console.warn("Failed to auto-sync existing assignments to Mapping List:", e);
        }
    }
    render() {
        const { description, isDarkTheme, environmentMessage, hasTeamsContext } = this.props;
        const { items, isAssetFormOpen, isRequestFormOpen, auditLogs, auditLogsLoading, userRole, previewRole, roleLoading, roleGroups, requestActionInProgressId, requestSearchId, activeUserDisplayName, activeUserEmail, loading } = this.state;
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
        const navItems = [
            { key: 'Dashboard', text: 'Dashboard', icon: 'BarChart4', group: 'MAIN' },
            { key: 'MyWorkspace', text: 'My Workspace', icon: 'Briefcase' },
            {
                key: 'Notifications',
                text: 'Notifications',
                icon: 'Ringer',
                badge: notifications.filter(n => !n.isRead).length || undefined,
                badgeColor: '#0078d4'
            },
            { key: 'IncidentHistory', text: 'Incident History', icon: 'History' },
            ...(isAdmin || isManager ? [
                { key: 'Inventory', text: 'Inventory', icon: 'List', group: 'MANAGEMENT' }
            ] : []),
            ...(isManager ? [
                { key: 'Approvals', text: 'Approvals', icon: 'DoubleChevronRight12', group: 'MANAGEMENT' }
            ] : []),
            ...(isAdmin ? [
                { key: 'AssetAssignmentQueue', text: 'Asset Assignment Queue', icon: 'Send', ...(isManager ? {} : { group: undefined }) }
            ] : []),
            ...(isAdmin || isManager ? [
                {
                    key: 'AssetReturns',
                    text: 'Asset Returns',
                    icon: 'ReturnToSession',
                    badge: this.state.returnRequests.filter(r => {
                        if (isAdmin)
                            return r.status === 'Pending Admin Verification';
                        if (isManager)
                            return r.status === 'Pending Manager Approval';
                        return r.status === 'Pending';
                    }).length || undefined,
                    badgeColor: '#ea580c'
                }
            ] : []),
            ...(isAdmin ? [
                { key: 'EventStream', text: 'Event Stream', icon: 'ActivityFeed', group: 'SYSTEM' },
                { key: 'Users', text: 'Users', icon: 'People' },
                { key: 'Reports', text: 'Reports', icon: 'ReportDocument' },
                { key: 'Config', text: 'Config', icon: 'Settings' }
            ] : [])
        ];
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
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].appLayoutContainer },
                    !this.state.sidebarCollapsed && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].sidebarOverlay, onClick: () => this.setState({ sidebarCollapsed: true }), role: "presentation" })),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: `${_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].sidebarContainer} ${this.state.sidebarCollapsed ? _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].sidebarCollapsed : ''}`, role: "navigation", "aria-label": "Main navigation" },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].navHeader },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", null, "Navigation"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                "Role: ",
                                effectiveRole)),
                        navItems.map((nav, index) => {
                            const isActive = this.state.selectedTabKey === nav.key;
                            const showGroupLabel = nav.group && (index === 0 || navItems[index - 1]?.group !== nav.group);
                            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, { key: nav.key },
                                showGroupLabel && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].navGroupLabel }, nav.group)),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { onClick: () => this.setState({ selectedTabKey: nav.key }), onKeyDown: (e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            this.setState({ selectedTabKey: nav.key });
                                        }
                                    }, tabIndex: 0, role: "button", "aria-current": isActive ? 'page' : undefined, "aria-label": nav.text, className: `${_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].sidebarNavItem} ${isActive ? _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].navItemActive : ''}` },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_27__.Icon, { iconName: nav.icon }),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].navItemText }, nav.text),
                                    nav.badge !== undefined && nav.badge > 0 && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].navBadge, style: { backgroundColor: nav.badgeColor || '#e74c3c' } }, nav.badge)))));
                        }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].collapseToggle, onClick: () => this.setState(prev => ({ sidebarCollapsed: !prev.sidebarCollapsed })), role: "button", tabIndex: 0, "aria-label": this.state.sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation', onKeyDown: (e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    this.setState(prev => ({ sidebarCollapsed: !prev.sidebarCollapsed }));
                                }
                            } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_27__.Icon, { iconName: this.state.sidebarCollapsed ? 'DoubleChevronRight' : 'DoubleChevronLeft' }),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].collapseText }, this.state.sidebarCollapsed ? 'Expand' : 'Collapse'))),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: `${_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].card} ${_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].contentContainer}` },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].mobileNavHeader },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].mobileMenuToggle, onClick: () => this.setState(prev => ({ sidebarCollapsed: !prev.sidebarCollapsed })), "aria-label": "Toggle navigation menu" },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_27__.Icon, { iconName: "GlobalNavButton" })),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].mobileNavTitle }, "Inventory Management")),
                        (() => {
                            const dashboardState = {
                                items: isAdmin || isManager ? items : myAssets,
                                requests: isAdmin || isManager ? this.state.requests : myRequests,
                                isAdmin,
                                isInventoryManager: isManager
                            };
                            const dashboardActions = {
                                onNavigate: (key) => this.setState({ selectedTabKey: key })
                            };
                            const reportsState = {
                                reportsSelectedTab: this.state.reportsSelectedTab,
                                reportsAssetTypeFilter: this.state.reportsAssetTypeFilter,
                                reportsStatusFilter: this.state.reportsStatusFilter,
                                items,
                                requests: this.state.requests
                            };
                            const reportsActions = {
                                onTabChange: (tabKey) => this.setState({ reportsSelectedTab: tabKey }),
                                onAssetTypeFilterChange: (type) => this.setState({ reportsAssetTypeFilter: type }),
                                onStatusFilterChange: (status) => this.setState({ reportsStatusFilter: status }),
                                onExportDetailedReportToExcel: (filteredItems) => this._exportDetailedReportToExcel(filteredItems),
                                onExportDetailedReportToPDF: (filteredItems) => this._exportDetailedReportToPDF(filteredItems),
                                onExportWarrantyReportToExcel: () => this._exportWarrantyReportToExcel(),
                                onExportWarrantyReportToPDF: () => this._exportWarrantyReportToPDF()
                            };
                            const incidentHistoryState = {
                                userDisplayName: activeUserDisplayName || '',
                                userEmail: activeUserEmail || '',
                                userRole: effectiveRole
                            };
                            const incidentHistoryActions = {
                                setIsLoading: (loading) => this.setState({ loading })
                            };
                            const inventoryState = {
                                items,
                                loading,
                                isAdmin,
                                isInventoryManager: isManager
                            };
                            const inventoryActions = {
                                onOpenAssetForm: () => this.setState({ isAssetFormOpen: true })
                            };
                            switch (this.state.selectedTabKey) {
                                case 'Dashboard':
                                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_pages__WEBPACK_IMPORTED_MODULE_20__.DashboardPage, { state: dashboardState, actions: dashboardActions }));
                                case 'MyWorkspace':
                                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "My Workspace")),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Manage your assigned assets and track your requests."),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_36__.Pivot, { "aria-label": "My Workspace Tabs" },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_37__.PivotItem, { headerText: "Assets" },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px' } },
                                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginBottom: '15px' } },
                                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_34__.PrimaryButton, { text: "Request Asset", onClick: () => this.setState({ isRequestFormOpen: true }), iconProps: { iconName: 'Send' } })),
                                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_MyAssignedAssetsView__WEBPACK_IMPORTED_MODULE_4__.MyAssignedAssetsView, { items: myAssets, onReturnAsset: (item) => this.setState({ selectedAssetForReturn: item, isReturnFormOpen: true }), onRaiseIncident: (item) => this.setState({ selectedAssetForIncident: item, isIncidentFormOpen: true }) }))),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_37__.PivotItem, { headerText: "Requests" },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px' } },
                                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_MyRequestsView__WEBPACK_IMPORTED_MODULE_5__.MyRequestsView, { requests: myRequests, returnRequests: this.state.returnRequests.filter(r => this._isRequestOwnedByCurrentUser(r.requesterName || '', activeUserDisplayName || '')) }))))));
                                case 'Notifications':
                                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_NotificationCenter__WEBPACK_IMPORTED_MODULE_21__.NotificationCenter, { notifications: notifications, onMarkAsRead: this._markNotificationAsRead, onMarkAllAsRead: this._markAllNotificationsAsRead, onClearNotification: this._clearNotification, onClearAllNotifications: this._clearAllNotifications, onNotificationAction: this._handleNotificationAction }));
                                case 'IncidentHistory':
                                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_pages__WEBPACK_IMPORTED_MODULE_20__.IncidentHistoryPage, { ...this.props, state: incidentHistoryState, actions: incidentHistoryActions }));
                                case 'Inventory':
                                    return (isAdmin || isManager) ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_pages__WEBPACK_IMPORTED_MODULE_20__.InventoryPage, { state: inventoryState, actions: inventoryActions })) : null;
                                case 'Approvals':
                                    return isManager ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Request Approvals & Assignment Queue")),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Track and manage all asset requests efficiently."),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_33__.TextField, { label: "Search by Request ID", placeholder: "e.g. REQ-000123", value: requestSearchId, onChange: (_, value) => this.setState({ requestSearchId: value || '' }), styles: { root: { marginBottom: '12px', maxWidth: 320 } } }),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginBottom: '20px', padding: '15px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginBottom: '10px' } }, "Request Approval Distribution"),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { height: '250px', position: 'relative' } },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_chartjs_2__WEBPACK_IMPORTED_MODULE_38__.Pie, { data: {
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
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_RequestList__WEBPACK_IMPORTED_MODULE_6__.RequestList, { items: visibleManagerRequests, canApproveReject: true, canApproveAsset: false, hideStatusColumn: false, showResponseColumns: false, onApproveRequest: this._onApproveRequest, onRejectRequest: this._onRejectRequest, actionInProgressId: requestActionInProgressId }))) : null;
                                case 'AssetAssignmentQueue':
                                    return isAdmin ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Approved Requests for Asset Assignment")),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Only approved requests are shown here so assets can be assigned."),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_33__.TextField, { label: "Search by Request ID", placeholder: "e.g. REQ-000123", value: requestSearchId, onChange: (_, value) => this.setState({ requestSearchId: value || '' }), styles: { root: { marginBottom: '12px', maxWidth: 320 } } }),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_RequestList__WEBPACK_IMPORTED_MODULE_6__.RequestList, { items: visibleAdminRequests, canApproveReject: false, canApproveAsset: true, hideStatusColumn: true, showResponseColumns: false, onSelectRequestForAssignment: (request) => this.setState({ selectedAdminRequest: request, isAdminPanelOpen: true, adminSelectedAssetId: undefined, adminComment: '' }), actionInProgressId: requestActionInProgressId }))) : null;
                                case 'AssetReturns':
                                    return isAdmin || isManager ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Asset Returns Registry")),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Review and complete employee asset return requests, and verify physical hardware check-ins."),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ReturnRequestList__WEBPACK_IMPORTED_MODULE_12__.ReturnRequestList, { items: this.state.returnRequests, isAdmin: isAdmin, isManager: isManager, onUpdateStatus: this._onUpdateReturnRequestStatus, loading: this.state.returnRequestsLoading }))) : null;
                                case 'EventStream':
                                    return isAdmin ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_EventStream__WEBPACK_IMPORTED_MODULE_10__.EventStream, { logs: auditLogs, loading: auditLogsLoading, errorMessage: undefined, currentUserRole: effectiveRole, currentUserName: activeUserDisplayName, refreshTrigger: this.state.auditLogsRefreshTrigger })) : null;
                                case 'Users':
                                    return isAdmin ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "User Administration")),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Admin-only area. Manage SharePoint groups and user onboarding from your site permissions."),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginBottom: '20px', padding: '15px', backgroundColor: '#f0f6ff', borderRadius: '8px', borderLeft: '4px solid #0078d4' } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginTop: 0, marginBottom: '10px', color: '#0078d4' } }, "SharePoint Group Management"),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { margin: 0, fontSize: '0.9rem', color: '#323130', marginBottom: '15px' } }, "To onboard new employees, grant them Admin access, or assign them as Inventory Managers, you must add them to the respective SharePoint Site Groups."),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_34__.PrimaryButton, { text: "Manage Site Permissions", iconProps: { iconName: 'Permissions' }, onClick: () => {
                                                    const siteUrl = window.location.pathname.substring(0, window.location.pathname.toLowerCase().indexOf('/sitepages'));
                                                    window.open(`${window.location.origin}${siteUrl}/_layouts/15/user.aspx`, '_blank');
                                                } })),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginBottom: '15px' } }, "Employee Directory & Asset Ownership"),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_39__.DetailsList, { items: this.state.employees.map(emp => {
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
                                                ], setKey: "usersList", layoutMode: _fluentui_react__WEBPACK_IMPORTED_MODULE_40__.DetailsListLayoutMode.justified, selectionMode: _fluentui_react__WEBPACK_IMPORTED_MODULE_41__.SelectionMode.none, onRenderRow: (rowProps) => {
                                                    if (!rowProps)
                                                        return null;
                                                    const isExpanded = this.state.expandedUserEmail === rowProps.item.email;
                                                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { onClick: () => this.setState({ expandedUserEmail: isExpanded ? undefined : rowProps.item.email }), style: { cursor: 'pointer', '&:hover': { backgroundColor: '#f3f2f1' } } },
                                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_42__.DetailsRow, { ...rowProps })),
                                                        isExpanded && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '20px 40px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' } },
                                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginTop: 0, marginBottom: '15px', color: '#111827' } },
                                                                "Assets assigned to ",
                                                                rowProps.item.name),
                                                            rowProps.item.assignedItems.length > 0 ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_InventoryList__WEBPACK_IMPORTED_MODULE_3__.InventoryList, { items: rowProps.item.assignedItems, isAdmin: false })) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: '#6b7280', fontSize: '0.9rem', margin: 0 } }, "This user currently has no assets assigned to them."))))));
                                                } })),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '30px', borderTop: '1px solid rgba(128, 128, 128, 0.15)', paddingTop: '24px' } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Employee Asset Tracking")),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Admin and Manager area. Select an employee to view all assets currently assigned to them."),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_AssetTracking__WEBPACK_IMPORTED_MODULE_19__.AssetTracking, { items: items, employees: this.state.employees, currentUserRole: effectiveRole, currentUserName: activeUserDisplayName, currentUserEmail: activeUserEmail })))) : null;
                                case 'Reports':
                                    return isAdmin ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_pages__WEBPACK_IMPORTED_MODULE_20__.ReportsPage, { state: reportsState, actions: reportsActions })) : null;
                                case 'Config': {
                                    const configState = {
                                        configSelectedTab: this.state.configSelectedTab,
                                        syncInProgress: this.state.syncInProgress,
                                        syncMessage: this.state.syncMessage,
                                        syncMessageType: this.state.syncMessageType,
                                        diagnosticInfo: this.state.diagnosticInfo,
                                        connectionStatuses: this.state.connectionStatuses,
                                        connectionErrorMessages: this.state.connectionErrorMessages,
                                        loadingGroupUsers: this.state.loadingGroupUsers,
                                        groupUsersList: this.state.groupUsersList
                                    };
                                    const configActions = {
                                        onSyncAssignedAssets: this._onSyncAssignedAssets,
                                        onRunDiagnostics: this._onRunDiagnostics,
                                        onTestListConnection: this._testListConnection,
                                        onLoadGroupUsers: this._loadGroupUsers,
                                        onDismissSyncMessage: () => this.setState({ syncMessage: undefined }),
                                        onTabChange: (tabKey) => this.setState({ configSelectedTab: tabKey })
                                    };
                                    return isAdmin ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_pages__WEBPACK_IMPORTED_MODULE_20__.ConfigPage, { state: configState, actions: configActions })) : null;
                                }
                                default:
                                    return null;
                            }
                        })()))),
            (isAdmin || isManager) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_AssetForm__WEBPACK_IMPORTED_MODULE_8__.AssetForm, { isOpen: isAssetFormOpen, onClose: () => this.setState({ isAssetFormOpen: false }), currentUserRole: effectiveRole, onAddAsset: this._onAddAsset })),
            (isAdmin || isManager || isEmployee) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_RequestForm__WEBPACK_IMPORTED_MODULE_9__.RequestForm, { isOpen: isRequestFormOpen, onClose: () => this.setState({ isRequestFormOpen: false }), availableAssets: items, employees: this.state.employees, currentUserRole: effectiveRole, currentUserName: activeUserDisplayName, onSubmitRequest: this._onSubmitRequest })),
            (isAdmin || isManager || isEmployee) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_IncidentRequest_IncidentRequestModule__WEBPACK_IMPORTED_MODULE_22__.IncidentRequestModule, { ...this.props, isOpen: this.state.isIncidentFormOpen, onClose: () => this.setState({ isIncidentFormOpen: false, selectedAssetForIncident: undefined }), userDisplayName: activeUserDisplayName, userEmail: activeUserEmail, setIsLoading: (loading) => this.setState({ loading }), preselectedAsset: this.state.selectedAssetForIncident, onSuccessPopup: (details) => {
                    this.setState({
                        workflowPopup: {
                            isOpen: true,
                            title: 'Incident Ticket Logged',
                            stage: 'Incident Management: Logged',
                            type: 'warning',
                            message: `Incident ticket for "${details.assetName}" (${details.incidentType}) has been logged and assigned to Admin IT support.`,
                            details: {
                                assetTitle: details.assetName,
                                requesterName: details.requesterName,
                                status: 'Open Ticket',
                                date: new Date().toISOString().split('T')[0]
                            }
                        }
                    });
                } })),
            this._renderNotificationDetailsPanel(),
            this._renderAdminAssignmentPanel(),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ReturnAssetForm__WEBPACK_IMPORTED_MODULE_11__.ReturnAssetForm, { isOpen: this.state.isReturnFormOpen, onDismiss: () => this.setState({ isReturnFormOpen: false, selectedAssetForReturn: undefined }), asset: this.state.selectedAssetForReturn, onSubmit: this._onSubmitReturnRequest }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_WorkflowPopup__WEBPACK_IMPORTED_MODULE_24__.WorkflowPopup, { isOpen: this.state.workflowPopup?.isOpen, title: this.state.workflowPopup?.title || '', stage: this.state.workflowPopup?.stage || '', type: this.state.workflowPopup?.type || 'info', message: this.state.workflowPopup?.message || '', details: this.state.workflowPopup?.details, onDismiss: () => this.setState({ workflowPopup: { ...this.state.workflowPopup, isOpen: false } }) })));
    }
}


/***/ }),

/***/ 32974:
/*!***************************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/services/InventoryItemService.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InventoryItemService: () => (/* binding */ InventoryItemService)
/* harmony export */ });
/* harmony import */ var _pnpjsConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../pnpjsConfig */ 17694);
/* harmony import */ var _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base/SharePointBaseService */ 93535);
/* harmony import */ var _AuditLogService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AuditLogService */ 43584);



class InventoryItemService {
    static async getInventoryList() {
        const sp = (0,_pnpjsConfig__WEBPACK_IMPORTED_MODULE_0__.getSP)();
        if (InventoryItemService._resolvedListName) {
            return sp.web.lists.getByTitle(InventoryItemService._resolvedListName);
        }
        try {
            const list = sp.web.lists.getByTitle(_base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.LIST_NAME);
            await list.select("Title")(); // Verify list exists
            // eslint-disable-next-line require-atomic-updates
            InventoryItemService._resolvedListName = _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.LIST_NAME;
            return list;
        }
        catch (e) {
            try {
                const fallbackName = "Inventory List";
                const list = sp.web.lists.getByTitle(fallbackName);
                await list.select("Title")(); // Verify fallback exists
                console.log("Resolved list name dynamically to fallback: " + fallbackName);
                // eslint-disable-next-line require-atomic-updates
                InventoryItemService._resolvedListName = fallbackName;
                return list;
            }
            catch (e2) {
                try {
                    const allLists = await sp.web.lists.select("Title")();
                    const listNames = allLists.map(l => '"' + l.Title + '"').join(', ');
                    throw new Error("List '" + _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.LIST_NAME + "' or 'Inventory List' does not exist on this SharePoint site. Available lists on this site are: [ " + listNames + " ]. Please ensure your list title matches exactly.");
                }
                catch (listsError) {
                    throw new Error("List '" + _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.LIST_NAME + "' or 'Inventory List' does not exist on this SharePoint site.");
                }
            }
        }
    }
    static async getItems() {
        try {
            const list = await InventoryItemService.getInventoryList();
            const fields = await list.fields.select("InternalName", "Title", "TypeAsString")();
            const items = await _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService._fetchItemsWithExpandedUsers(list);
            const findFieldInternalName = (searchStr, fallback) => {
                let field = fields.find((f) => f.InternalName.toLowerCase() === searchStr.toLowerCase());
                if (field)
                    return field.InternalName;
                field = fields.find((f) => f.InternalName.toLowerCase().replace(/_x0020_/g, '').indexOf(searchStr.toLowerCase()) >= 0);
                if (field)
                    return field.InternalName;
                field = fields.find((f) => f.Title.toLowerCase().replace(/[^a-z0-9]/g, '').indexOf(searchStr.toLowerCase()) >= 0);
                return field ? field.InternalName : fallback;
            };
            const assignedToKey = findFieldInternalName("assignedto", "AssignedTo");
            const assetNameKey = findFieldInternalName("assetname", "AssetName");
            const assetTypeKey = findFieldInternalName("assettype", "AssetType");
            const serialNumberKey = findFieldInternalName("serialnumber", "SerialNumber");
            const purchaseDateKey = findFieldInternalName("purchasedate", "PurchaseDate");
            const vendorKey = findFieldInternalName("vendor", "Vendor");
            const conditionKey = findFieldInternalName("condition", "Condition");
            const statusKey = findFieldInternalName("status", "Status");
            const warrantyExpiryKey = findFieldInternalName("warrantyexpiry", "WarrantyExpiry");
            const specificationsKey = findFieldInternalName("specifications", "Specifications");
            const noteKey = findFieldInternalName("note", "Note");
            return items.map((item) => {
                const assignedToVal = (() => {
                    const assignedField = item[assignedToKey] || item.AssignedTo || item.Assigned_x0020_To;
                    if (assignedField) {
                        if (typeof assignedField === 'string')
                            return assignedField;
                        if (Array.isArray(assignedField))
                            return assignedField.map((a) => a.Title).join(', ');
                        if (assignedField.Title)
                            return assignedField.Title;
                    }
                    // Fallback: extract assignee name from Note or Status if the primary field is empty
                    const noteText = item[noteKey] || item.Note || item.Notes || "";
                    const statusText = item[statusKey] || item.Status || item.AssetStatus || "";
                    const extractFromText = (text) => {
                        const match = /assigned to:\s*([^;\n\r]+)/i.exec(text);
                        return match ? match[1].trim() : "";
                    };
                    const fromNote = extractFromText(noteText);
                    if (fromNote)
                        return fromNote;
                    const fromStatus = extractFromText(statusText);
                    if (fromStatus)
                        return fromStatus;
                    return "";
                })();
                const rawStatus = item[statusKey] || item.Status || item.AssetStatus || "";
                const noteText = item[noteKey] || item.Note || item.Notes || "";
                let finalStatus = rawStatus;
                let finalAssignedTo = assignedToVal;
                const statusLower = (rawStatus || "").toLowerCase();
                const noteLower = (noteText || "").toLowerCase();
                if (statusLower === "return approved" || statusLower === "returnapproved" || statusLower === "in stock" || statusLower === "instock" || statusLower === "returned" || statusLower === "completed" || statusLower === "available" || noteLower.indexOf("returned by employee") >= 0 || noteLower.indexOf("in stock") >= 0) {
                    finalStatus = statusLower === "under maintenance" ? "Under Maintenance" : "In Stock";
                    finalAssignedTo = "";
                }
                else if (statusLower === "assigned" || statusLower.startsWith("assigned")) {
                    if (!assignedToVal || assignedToVal.trim() === "") {
                        finalStatus = "In Stock";
                    }
                }
                return {
                    id: item.ID.toString(),
                    title: item.Title || "",
                    assetName: item[assetNameKey] || item.AssetName || item.Asset_x0020_Name || item.Asset || "",
                    assetType: item[assetTypeKey] || item.AssetType || item.Asset_x0020_Type || item.Type || "",
                    serialNumber: item[serialNumberKey] || item.SerialNumber || item.Serial_x0020_Number || "",
                    purchaseDate: item[purchaseDateKey] || item.PurchaseDate || item.Purchase_x0020_Date || "",
                    vendor: item[vendorKey] || item.Vendor || item.VendorName || "",
                    condition: item[conditionKey] || item.Condition || item.AssetCondition || "",
                    status: finalStatus,
                    assignedTo: finalAssignedTo,
                    assignedDate: item.Modified || "",
                    warrantyExpiry: item[warrantyExpiryKey] || item.WarrantyExpiry || item.Warranty_x0020_Expiry || "",
                    specifications: item[specificationsKey] || item.Specifications || item.SpecificationsText || item.Note || item.Notes || "",
                    note: item[noteKey] || item.Note || item.Notes || ""
                };
            });
        }
        catch (error) {
            console.error("Error fetching items from SharePoint:", error);
            throw error;
        }
    }
    static async addItem(item, userDisplayName = "Unknown") {
        const list = await InventoryItemService.getInventoryList();
        const payloads = [
            // 1. Standard modern field names with Specifications column (Priority)
            {
                Title: item.title,
                AssetName: item.assetName,
                AssetType: item.assetType,
                SerialNumber: item.serialNumber,
                PurchaseDate: item.purchaseDate,
                Vendor: item.vendor || "",
                Condition: item.condition || "",
                WarrantyExpiry: item.warrantyExpiry || "",
                Status: item.status,
                Specifications: item.specifications || ""
            },
            // 2. Space field names with Specifications column
            {
                Title: item.title,
                Asset_x0020_Name: item.assetName,
                Asset_x0020_Type: item.assetType,
                Serial_x0020_Number: item.serialNumber,
                Purchase_x0020_Date: item.purchaseDate,
                Vendor: item.vendor || "",
                Condition: item.condition || "",
                WarrantyExpiry: item.warrantyExpiry || "",
                Status: item.status,
                Specifications: item.specifications || ""
            },
            // 3. Alternate field names with Specifications column
            {
                Title: item.title,
                Asset: item.assetName,
                Type: item.assetType,
                Serial_x0020_Number: item.serialNumber,
                Purchase_x0020_Date: item.purchaseDate,
                Vendor: item.vendor || "",
                Condition: item.condition || "",
                WarrantyExpiry: item.warrantyExpiry || "",
                AssetStatus: item.status,
                Specifications: item.specifications || ""
            },
            // 4. Standard modern field names fallback (Note)
            {
                Title: item.title,
                AssetName: item.assetName,
                AssetType: item.assetType,
                SerialNumber: item.serialNumber,
                PurchaseDate: item.purchaseDate,
                Vendor: item.vendor || "",
                Condition: item.condition || "",
                WarrantyExpiry: item.warrantyExpiry || "",
                Status: item.status,
                Note: item.specifications || ""
            },
            // 5. Space field names fallback (Note)
            {
                Title: item.title,
                Asset_x0020_Name: item.assetName,
                Asset_x0020_Type: item.assetType,
                Serial_x0020_Number: item.serialNumber,
                Purchase_x0020_Date: item.purchaseDate,
                Vendor: item.vendor || "",
                Condition: item.condition || "",
                WarrantyExpiry: item.warrantyExpiry || "",
                Status: item.status,
                Note: item.specifications || ""
            },
            // 6. Alternate field names fallback (Notes)
            {
                Title: item.title,
                Asset: item.assetName,
                Type: item.assetType,
                Serial_x0020_Number: item.serialNumber,
                Purchase_x0020_Date: item.purchaseDate,
                Vendor: item.vendor || "",
                Condition: item.condition || "",
                WarrantyExpiry: item.warrantyExpiry || "",
                AssetStatus: item.status,
                Notes: item.specifications || ""
            }
        ];
        let addedItem;
        let success = false;
        let lastError;
        for (const payload of payloads) {
            try {
                addedItem = await list.items.add(payload);
                success = true;
                break; // Success, stop looping immediately!
            }
            catch (error) {
                lastError = error;
            }
        }
        if (!success) {
            console.error("Error adding item to SharePoint:", lastError);
            throw new Error(`SharePoint rejected the save. The columns you created in InventoryList do not match the expected format. Error: ${lastError.message || JSON.stringify(lastError)}`);
        }
        // Safely perform post-save actions (audit logging) outside the creation loop
        try {
            const entityId = (addedItem && addedItem.data && addedItem.data.Id)
                ? addedItem.data.Id.toString()
                : (addedItem && addedItem.Id)
                    ? addedItem.Id.toString()
                    : 'Unknown';
            await _AuditLogService__WEBPACK_IMPORTED_MODULE_2__.AuditLogService.addAuditLog({
                title: `Created Asset: ${item.assetName || item.title} (Inactivated)`,
                action: 'Inactivated',
                entityType: 'Asset',
                entityId,
                details: JSON.stringify({
                    lifecycle: "Registration",
                    status: "In Stock",
                    changedBy: userDisplayName,
                    changedAt: new Date().toISOString(),
                    item
                }),
                user: userDisplayName
            });
        }
        catch (auditError) {
            console.warn("Failed to write audit log for newly created asset:", auditError);
        }
    }
    static async deleteItem(id, itemTitle = "Unknown", userDisplayName = "Unknown") {
        try {
            const list = await InventoryItemService.getInventoryList();
            await list.items.getById(id).delete();
            // Log the event
            await _AuditLogService__WEBPACK_IMPORTED_MODULE_2__.AuditLogService.addAuditLog({
                title: `Deleted Asset: ${itemTitle}`,
                action: 'Delete',
                entityType: 'Asset',
                entityId: id.toString(),
                details: `Deleted asset with ID ${id}`,
                user: userDisplayName
            });
        }
        catch (error) {
            console.error("Error deleting item from SharePoint:", error);
            throw error;
        }
    }
    static async updateAssetStatus(requestId, assetStatus, approverName = 'Unknown', comment) {
        try {
            // Inline the getRequestList behavior to respect strict safety import rules:
            const sp = (0,_pnpjsConfig__WEBPACK_IMPORTED_MODULE_0__.getSP)();
            let list;
            try {
                list = sp.web.lists.getByTitle(_base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.REQUEST_LIST_NAME);
                await list.select("Title")();
            }
            catch {
                list = sp.web.lists.getByTitle("Request List");
            }
            // Check fields and auto-create if needed
            const fields = await list.fields.select("InternalName", "Title", "TypeAsString")();
            const hasRequestStatus = fields.some(field => (field.InternalName || '').toString().toLowerCase() === _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME.toLowerCase());
            const hasManagerComment = fields.some(field => (field.InternalName || '').toString().toLowerCase() === _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.REQUEST_COMMENT_INTERNAL_NAME.toLowerCase());
            const hasRequestKey = fields.some(field => {
                const name = (field.InternalName || '').toString().toLowerCase();
                const title = (field.Title || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
                return name === 'requestkey' || name === 'requestid' || name === 'request_x0020_id' || title === 'requestid' || title === 'requestkey';
            });
            const hasAssetStatus = fields.some(field => (field.InternalName || '').toString().toLowerCase() === _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.ASSET_STATUS_INTERNAL_NAME.toLowerCase());
            const hasEmployeeIdField = fields.some(field => {
                const internalName = (field.InternalName || '').toString().toLowerCase();
                return internalName === 'employeeid' || internalName === 'employee_x0020_id';
            });
            const hasPriorityField = fields.some(field => (field.InternalName || '').toString().toLowerCase() === 'priority');
            if (!hasRequestStatus) {
                try {
                    await list.fields.addChoice(_base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME, {
                        Choices: ["Pending", "Approved", "Rejected"],
                        FillInChoice: false
                    });
                }
                catch (err) {
                    console.warn("Could not auto-create RequestStatus field. Continuing.", err);
                }
            }
            if (!hasManagerComment) {
                try {
                    await list.fields.addMultilineText(_base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.REQUEST_COMMENT_INTERNAL_NAME);
                }
                catch (err) {
                    console.warn("Could not auto-create ManagerComment field. Continuing.", err);
                }
            }
            if (!hasRequestKey) {
                try {
                    await list.fields.addText(_base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.REQUEST_KEY_INTERNAL_NAME);
                }
                catch (err) {
                    console.warn("Could not auto-create RequestKey field. Continuing.", err);
                }
            }
            if (!hasAssetStatus) {
                try {
                    await list.fields.addChoice(_base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.ASSET_STATUS_INTERNAL_NAME, {
                        Choices: ["Pending", "Approved"],
                        FillInChoice: false
                    });
                }
                catch (err) {
                    console.warn("Could not auto-create AssetStatus field. Continuing.", err);
                }
            }
            if (!hasEmployeeIdField) {
                try {
                    await list.fields.addText('EmployeeID');
                }
                catch (err) {
                    console.warn("Could not auto-create EmployeeID field. Continuing.", err);
                }
            }
            if (!hasPriorityField) {
                try {
                    await list.fields.addChoice('Priority', {
                        Choices: ["High", "Medium", "Low"],
                        FillInChoice: false
                    });
                }
                catch (err) {
                    console.warn("Could not auto-create Priority field. Continuing.", err);
                }
            }
            if (Number.isNaN(requestId)) {
                throw new Error('Invalid request ID');
            }
            const item = await list.items.getById(requestId).select("*")();
            const keys = Object.keys(item || {});
            const findKey = (searchStr) => keys.find(k => k.toLowerCase().replace(/_x0020_/g, '').includes(searchStr));
            // Helper inline for extracting request key
            const extractRequestKey = (itm) => {
                if (!itm)
                    return "";
                const candidates = ["requestkey", "requestid", "request_x0020_id", "request_x0020_key"];
                for (const key of Object.keys(itm)) {
                    const normalizedKey = key.toLowerCase().replace(/_x0020_/g, "");
                    if (candidates.indexOf(normalizedKey) >= 0 && itm[key]) {
                        return (itm[key].toString() || "").trim().toUpperCase();
                    }
                }
                if (itm.ID) {
                    const raw = itm.ID.toString();
                    const padded = ("000000" + raw).slice(-6);
                    return `REQ-${padded}`;
                }
                return "";
            };
            const requestKey = extractRequestKey(item);
            const assetStatusKey = findKey("assetstatus") || _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.ASSET_STATUS_INTERNAL_NAME;
            const updatePayload = {
                [assetStatusKey]: assetStatus
            };
            if (comment) {
                const managerCommentKey = findKey("managercomment") || findKey("comment") || findKey("response") || _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.REQUEST_COMMENT_INTERNAL_NAME;
                if (managerCommentKey) {
                    const existingComment = item[managerCommentKey] || "";
                    updatePayload[managerCommentKey] = existingComment
                        ? `${existingComment} | [Admin]: ${comment}`
                        : `[Admin]: ${comment}`;
                }
            }
            await list.items.getById(requestId).update(updatePayload);
            await _AuditLogService__WEBPACK_IMPORTED_MODULE_2__.AuditLogService.addAuditLog({
                title: `Asset status ${assetStatus} for Request ${requestKey || `#${requestId}`}`,
                action: 'Update',
                entityType: 'Request',
                entityId: requestKey || requestId.toString(),
                details: JSON.stringify({
                    requestKey: requestKey || (("000000" + requestId.toString()).slice(-6)),
                    lifecycle: "AssetStatusUpdated",
                    assetStatus,
                    changedBy: approverName,
                    changedAt: new Date().toISOString()
                }),
                user: approverName
            });
        }
        catch (error) {
            console.error(`Failed to update asset status for RequestList item ${requestId}`, error);
            throw new Error(`Unable to update asset status. ${error.message || 'Verify AssetStatus column and permissions.'}`);
        }
    }
}
InventoryItemService._resolvedListName = null;


/***/ }),

/***/ 86382:
/*!***************************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/services/ReturnRequestService.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReturnRequestService: () => (/* binding */ ReturnRequestService)
/* harmony export */ });
/* harmony import */ var _pnpjsConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../pnpjsConfig */ 17694);
/* harmony import */ var _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base/SharePointBaseService */ 93535);
/* harmony import */ var _AuditLogService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AuditLogService */ 43584);
/* harmony import */ var _InventoryItemService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./InventoryItemService */ 32974);
/* harmony import */ var _AssetAssignmentService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AssetAssignmentService */ 95576);





class ReturnRequestService {
    static async getReturnRequestList() {
        const sp = (0,_pnpjsConfig__WEBPACK_IMPORTED_MODULE_0__.getSP)();
        if (ReturnRequestService._resolvedReturnListName) {
            return sp.web.lists.getByTitle(ReturnRequestService._resolvedReturnListName);
        }
        // Try all known name variants in order of preference
        const namesToTry = [
            "Asset Return Request List",
            "Return Requests List",
            "ReturnRequestList",
            "Return Request List",
            "ReturnRequests",
            "Return Requests"
        ];
        for (const name of namesToTry) {
            try {
                const list = sp.web.lists.getByTitle(name);
                await list.select("Title")(); // Verify it exists
                ReturnRequestService._resolvedReturnListName = name;
                console.log(`Resolved Asset Return Request list name to: "${name}"`);
                return list;
            }
            catch (TirKeyError) {
                // try next
            }
        }
        // None found — log available lists and throw
        try {
            const allLists = await sp.web.lists.select("Title")();
            const listNames = allLists.map((l) => '"' + l.Title + '"').join(', ');
            throw new Error(`Could not find an Asset Return Request list. Tried: ${namesToTry.map(n => '"' + n + '"').join(', ')}. Available lists: [ ${listNames} ]`);
        }
        catch (eLists) {
            throw new Error(`Could not find an Asset Return Request list. Tried: ${namesToTry.map(n => '"' + n + '"').join(', ')}`);
        }
    }
    static _findReturnField(fields, ...candidates) {
        for (const cand of candidates) {
            const norm = cand.toLowerCase().replace(/[^a-z0-9]/g, '');
            const field = fields.find((f) => {
                const internal = (f.InternalName || '').toLowerCase().replace(/_x0020_/g, '').replace(/[^a-z0-9]/g, '');
                const title = (f.Title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                return internal === norm || title === norm;
            });
            if (field)
                return field.InternalName;
        }
        return undefined;
    }
    static _getLocalReturnRequests() {
        const list = [];
        // 1. Try unified key first
        try {
            const unified = localStorage.getItem("inventory_return_requests");
            if (unified) {
                list.push(...JSON.parse(unified));
            }
        }
        catch (e) {
            console.warn("Failed to parse unified return requests from localStorage", e);
        }
        // 2. Scan all keys in localStorage for individual RR- keys (to handle Bug 2 where individual keys were used)
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith("RR-")) {
                    const itemStr = localStorage.getItem(key);
                    if (itemStr) {
                        try {
                            const item = JSON.parse(itemStr);
                            if (item && item.id && !list.some(r => r.id === item.id)) {
                                list.push(item);
                            }
                        }
                        catch (e) {
                            console.warn(`Failed to parse return request under key ${key}:`, e);
                        }
                    }
                }
            }
        }
        catch (e) {
            console.warn("Failed to scan localStorage for RR- keys", e);
        }
        const coerceWorkflowStatus = (item) => {
            const spStatus = item.status || 'Pending';
            let mappedStatus = 'Pending Manager Approval';
            if (spStatus === 'Approved' || spStatus === 'Pending Admin Verification') {
                mappedStatus = 'Pending Admin Verification';
            }
            else if (spStatus === 'Rejected') {
                mappedStatus = 'Rejected';
            }
            else if (spStatus === 'Returned' || spStatus === 'Completed') {
                mappedStatus = 'Completed';
            }
            else {
                mappedStatus = 'Pending Manager Approval';
            }
            return {
                ...item,
                status: mappedStatus
            };
        };
        return list.map(coerceWorkflowStatus);
    }
    static async getReturnRequests() {
        try {
            const list = await ReturnRequestService.getReturnRequestList();
            const fields = await list.fields.select("InternalName", "Title", "TypeAsString")();
            // Resolve column internal names dynamically
            const f = ((...c) => ReturnRequestService._findReturnField(fields, ...c));
            const titleKey = f('Title') || 'Title';
            const returnRequestIdKey = f('ReturnRequestID', 'Return Request ID', 'ReturnRequestId', 'ReturnRequestKey', 'Return Request Key');
            const assetIdKey = f('AssetID', 'Asset ID', 'AssetId') || 'AssetID';
            const assetNameKey = f('AssetName', 'Asset Name') || 'AssetName';
            const assetTypeKey = f('AssetType', 'Asset Type') || 'AssetType';
            const serialKey = f('SerialNumber', 'Serial Number') || 'SerialNumber';
            const requesterKey = f('RequesterName', 'Requester Name', 'Requester', 'Employee', 'EmployeeName') || 'RequesterName';
            const requesterEmailKey = f('RequesterEmail', 'Requester Email') || 'RequesterEmail';
            const requestDateKey = f('RequestDate', 'Request Date', 'ReturnRequestDate', 'Return Request Date') || 'RequestDate';
            const returnReasonKey = f('ReturnReason', 'Return Reason', 'Reason') || 'ReturnReason';
            const conditionKey = f('ProposedCondition', 'Proposed Condition', 'ReturnedAssetCondition', 'Returned Asset Condition', 'Condition') || 'ProposedCondition';
            const statusKey = f('Status', 'ReturnStatus', 'Return Status', 'RequestStatus', 'Return Request Status') || 'Status';
            const commentKey = f('ManagerComment', 'Manager Comment', 'Comment', 'Notes') || 'ManagerComment';
            const completedDateKey = f('CompletedDate', 'Completed Date', 'ReturnCompletedDate') || 'CompletedDate';
            const managerStatusKey = f('ManagerStatus', 'Manager Status') || 'ManagerStatus';
            const adminStatusKey = f('AdminStatus', 'Admin Status') || 'AdminStatus';
            const adminCommentsKey = f('AdminComments', 'Admin Comments', 'AdminComment', 'Admin Comment') || 'AdminComments';
            const verifiedDateKey = f('VerifiedDate', 'Verified Date') || 'VerifiedDate';
            const items = await list.items.select('*', 'ID').orderBy('ID', false)();
            const spMapped = items.map((item) => {
                const idVal = returnRequestIdKey ? item[returnRequestIdKey] : null;
                return {
                    id: idVal ? idVal.toString() : item.ID.toString(),
                    title: item[titleKey] || "",
                    assetId: item[assetIdKey] || item.AssetID || item.AssetId || "",
                    assetName: item[assetNameKey] || item.AssetName || item.Asset_x0020_Name || "",
                    assetType: item[assetTypeKey] || item.AssetType || item.Asset_x0020_Type || item.Type || "",
                    serialNumber: item[serialKey] || item.SerialNumber || item.Serial_x0020_Number || "",
                    requesterName: item[requesterKey] || item.RequesterName || item.Author?.Title || "",
                    requesterEmail: item[requesterEmailKey] || item.RequesterEmail || "",
                    requestDate: item[requestDateKey] || item.Created?.split('T')[0] || "",
                    returnReason: item[returnReasonKey] || item.ReturnReason || item.Return_x0020_Reason || "",
                    proposedCondition: item[conditionKey] || item.ProposedCondition || "",
                    status: (() => {
                        const spStatus = item[statusKey] || 'Pending';
                        if (spStatus === 'Approved' || spStatus === 'Pending Admin Verification') {
                            return 'Pending Admin Verification';
                        }
                        else if (spStatus === 'Rejected') {
                            return 'Rejected';
                        }
                        else if (spStatus === 'Returned' || spStatus === 'Completed') {
                            return 'Completed';
                        }
                        else {
                            return 'Pending Manager Approval';
                        }
                    })(),
                    managerComment: item[commentKey] || item.ManagerComment || "",
                    completedDate: item[completedDateKey] || item.CompletedDate || "",
                    managerStatus: item[managerStatusKey] || item.ManagerStatus || "Pending",
                    adminStatus: item[adminStatusKey] || item.AdminStatus || "Not Started",
                    adminComments: item[adminCommentsKey] || item.AdminComments || "",
                    verifiedDate: item[verifiedDateKey] || item.VerifiedDate || ""
                };
            });
            // Get local items and merge them
            const localRequests = ReturnRequestService._getLocalReturnRequests();
            const syncedAssetIds = new Set(spMapped.map((r) => r.assetId.toString()));
            const unsyncedLocal = localRequests.filter(localReq => {
                return !syncedAssetIds.has(localReq.assetId.toString());
            });
            return [...spMapped, ...unsyncedLocal];
        }
        catch (error) {
            console.warn("Could not fetch return requests from SharePoint, returning local storage fallback:", error);
            return ReturnRequestService._getLocalReturnRequests();
        }
    }
    static async addReturnRequest(request, userDisplayName) {
        // Check for existing active return request for the same asset
        const requests = await ReturnRequestService.getReturnRequests();
        const activeRequest = requests.find(r => r.assetId === request.assetId &&
            r.status !== 'Completed' &&
            r.status !== 'Rejected');
        if (activeRequest) {
            throw new Error("A return request for this asset is already in progress.");
        }
        const listTitle = ReturnRequestService._resolvedReturnListName || "Asset Return Request List";
        console.log(`[Return Request Workflow] Accessing Return Requests List: "${listTitle}"`);
        const autoDate = new Date().toISOString().split('T')[0];
        const newRequest = {
            ...request,
            requestDate: autoDate,
            id: `RR-${Date.now()}`,
            status: 'Pending Manager Approval',
            managerStatus: 'Pending',
            adminStatus: 'Not Started'
        };
        let list;
        let schema;
        try {
            list = await ReturnRequestService.getReturnRequestList();
            schema = await _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.getListFieldsMetadata(list);
        }
        catch (err) {
            console.error(`[Return Request Workflow] Failed to access list metadata for "${listTitle}". Error:`, err);
            throw new Error(`Failed to access Return Request list metadata: ${err.message || JSON.stringify(err)}`);
        }
        const resolvedMapping = {};
        const excludeFields = new Set();
        const getField = (logicalKey, aliases) => {
            const match = _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService._resolveFieldInternalName(schema, aliases, excludeFields);
            if (match) {
                resolvedMapping[logicalKey] = match;
                excludeFields.add(match);
            }
        };
        getField("ReturnRequestID", ["returnrequestid", "return request id", "returnrequestkey", "return request key"]);
        getField("AssetID", ["assetid", "asset id"]);
        getField("AssetName", ["assetname", "asset name"]);
        getField("AssetType", ["assettype", "asset type"]);
        getField("SerialNumber", ["serialnumber", "serial number"]);
        getField("RequesterName", ["requestername", "requester name", "requester", "employee"]);
        getField("RequesterEmail", ["requesteremail", "requester email"]);
        getField("ReturnRequestDate", ["requestdate", "request date", "returnrequestdate", "return request date"]);
        getField("ReturnReason", ["returnreason", "return reason", "reason"]);
        getField("ReturnedAssetCondition", ["proposedcondition", "proposed condition", "returnedassetcondition", "returned asset condition", "condition"]);
        getField("Status", ["status", "returnstatus", "return status", "requeststatus", "return request status"]);
        getField("ManagerStatus", ["managerstatus", "manager status"]);
        getField("AdminStatus", ["adminstatus", "admin status"]);
        console.log(`[Return Request Workflow] Resolved field mappings:`, JSON.stringify(resolvedMapping, null, 2));
        const logicalPayload = {
            ReturnRequestID: newRequest.id,
            AssetID: request.assetId,
            AssetName: request.assetName,
            AssetType: request.assetType || "",
            SerialNumber: request.serialNumber || "",
            RequesterName: request.requesterName,
            RequesterEmail: request.requesterEmail || "",
            ReturnRequestDate: newRequest.requestDate,
            ReturnReason: request.returnReason,
            ReturnedAssetCondition: request.proposedCondition,
            Status: "Pending", // Set Status choice to 'Pending' (valid value)
            ManagerStatus: "Pending",
            AdminStatus: "Not Started"
        };
        const requiredKeys = ["AssetID", "AssetName", "RequesterName", "Status"];
        let finalPayload;
        try {
            finalPayload = await _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService._coerceAndValidatePayload(logicalPayload, schema, resolvedMapping, requiredKeys);
            if (!finalPayload["Title"]) {
                finalPayload["Title"] = request.title || `Return Request for ${request.assetName}`;
            }
        }
        catch (validationErr) {
            console.error(`[Return Request Workflow] Payload validation/coercion failed:`, validationErr);
            throw new Error(`Failed to validate/coerce Return Request payload: ${validationErr.message}`);
        }
        console.log(`[Return Request Workflow] Final payload before submission:`, JSON.stringify(finalPayload, null, 2));
        // Operation 1: Creating Return Request
        try {
            await list.items.add(finalPayload);
            console.log(`[Return Request Workflow] Success: Created Return Request item in SharePoint with ID ${newRequest.id}`);
        }
        catch (err) {
            const translatedErr = _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.translateSharePointError(err, finalPayload, resolvedMapping);
            console.error(`[Return Request Workflow] Operation Failed: Creating Return Request. Error details:`, translatedErr.message);
            throw new Error(`Creating Return Request failed: ${translatedErr.message}`);
        }
        // Operations 2 & 3 (Updating Inventory status & Writing Audit Log) are now deferred to manager/admin approval.
    }
    static async updateReturnRequestStatus(requestId, status, managerComment, approverName, finalCondition, adminComments, managerStatus, adminStatus) {
        console.log("========================");
        console.log("RETURN WORKFLOW START");
        console.log("========================");
        console.log("Request ID:", requestId);
        console.log("Status:", status);
        const requests = await ReturnRequestService.getReturnRequests();
        const req = requests.find(r => r.id === requestId);
        if (!req) {
            console.error("Error: Return request not found.");
            console.log("========================");
            console.log("RETURN WORKFLOW END");
            console.log("========================");
            throw new Error(`Return request with ID ${requestId} not found.`);
        }
        console.log("Asset ID:", req.assetId);
        console.log("Serial Number:", req.serialNumber);
        let updatedSharePoint = false;
        // Try SharePoint update
        try {
            const list = await ReturnRequestService.getReturnRequestList();
            console.log("Resolved Return Request List Name:", list.Title || "Asset Return Request List");
            const fields = await list.fields.select("InternalName", "Title", "TypeAsString")();
            const f = ((...c) => ReturnRequestService._findReturnField(fields, ...c));
            const returnRequestIdKey = f('ReturnRequestID', 'Return Request ID', 'ReturnRequestId', 'ReturnRequestKey', 'Return Request Key');
            const statusKey = f('Status', 'ReturnStatus', 'Return Status', 'RequestStatus', 'Return Request Status') || 'Status';
            const commentKey = f('ManagerComment', 'Manager Comment', 'Comment', 'Notes') || 'ManagerComment';
            const completedKey = f('CompletedDate', 'Completed Date', 'ReturnCompletedDate') || 'CompletedDate';
            const managerStatusKey = f('ManagerStatus', 'Manager Status') || 'ManagerStatus';
            const adminStatusKey = f('AdminStatus', 'Admin Status') || 'AdminStatus';
            const adminCommentsKey = f('AdminComments', 'Admin Comments', 'AdminComment', 'Admin Comment') || 'AdminComments';
            const verifiedDateKey = f('VerifiedDate', 'Verified Date') || 'VerifiedDate';
            let spStatusValue = 'Pending';
            if (status === 'Pending Admin Verification' || status === 'Approved') {
                spStatusValue = 'Approved';
            }
            else if (status === 'Rejected') {
                spStatusValue = 'Rejected';
            }
            else if (status === 'Completed') {
                spStatusValue = 'Returned';
            }
            const payload = {
                [statusKey]: spStatusValue, // Store valid SharePoint Choice value: Pending, Approved, Rejected, Returned
                [commentKey]: managerComment
            };
            if (managerStatusKey && managerStatus) {
                payload[managerStatusKey] = managerStatus;
            }
            if (adminStatusKey && adminStatus) {
                payload[adminStatusKey] = adminStatus;
            }
            if (adminCommentsKey && adminComments) {
                payload[adminCommentsKey] = adminComments;
            }
            if (verifiedDateKey && status === 'Completed') {
                payload[verifiedDateKey] = new Date().toISOString().split('T')[0];
            }
            if (status === 'Approved' || status === 'Completed') {
                payload[completedKey] = new Date().toISOString().split('T')[0];
            }
            const numericId = parseInt(requestId, 10);
            let restResponse = null;
            if (!isNaN(numericId) && !requestId.startsWith('RR-')) {
                restResponse = await list.items.getById(numericId).update(payload);
                console.log("Result of list.items.update() (Request List ID update):", JSON.stringify(restResponse));
                updatedSharePoint = true;
            }
            else if (returnRequestIdKey) {
                const spItems = await list.items.filter(`${returnRequestIdKey} eq '${requestId.replace(/'/g, "''")}'`).select('ID')();
                if (spItems && spItems.length > 0) {
                    const spId = spItems[0].ID;
                    restResponse = await list.items.getById(spId).update(payload);
                    console.log("Result of list.items.update() (Request List filter update):", JSON.stringify(restResponse));
                    updatedSharePoint = true;
                }
            }
        }
        catch (err) {
            console.error("Exception caught in Return Request update:", err.message, err.stack);
            if (err.data)
                console.error("Error details:", JSON.stringify(err.data));
            const errStr = (err.message || "").toLowerCase();
            const isNetworkOrNotFound = errStr.includes("not found") || errStr.includes("404") || errStr.includes("fetch") || errStr.includes("network") || errStr.includes("getbytitle");
            if (!isNetworkOrNotFound) {
                throw new Error(`Failed to update Return Request in SharePoint: ${err.message || JSON.stringify(err)}`);
            }
        }
        if (!updatedSharePoint) {
            // Update localStorage fallback copy
            try {
                const local = localStorage.getItem("inventory_return_requests");
                if (local) {
                    const localList = JSON.parse(local);
                    const updated = localList.map(r => {
                        if (r.id === requestId) {
                            const updatedReq = {
                                ...r,
                                status,
                                managerComment,
                                managerStatus: managerStatus || r.managerStatus,
                                adminStatus: adminStatus || r.adminStatus,
                                adminComments: adminComments || r.adminComments,
                                verifiedDate: status === 'Completed' ? new Date().toISOString().split('T')[0] : r.verifiedDate
                            };
                            if (status === 'Completed') {
                                updatedReq.completedDate = new Date().toISOString().split('T')[0];
                            }
                            return updatedReq;
                        }
                        return r;
                    });
                    localStorage.setItem("inventory_return_requests", JSON.stringify(updated));
                }
                // Also update individual key for Bug 2 compatibility
                const itemStr = localStorage.getItem(requestId);
                if (itemStr) {
                    const item = JSON.parse(itemStr);
                    item.status = status;
                    item.managerComment = managerComment;
                    if (managerStatus)
                        item.managerStatus = managerStatus;
                    if (adminStatus)
                        item.adminStatus = adminStatus;
                    if (adminComments)
                        item.adminComments = adminComments;
                    if (status === 'Completed') {
                        item.completedDate = new Date().toISOString().split('T')[0];
                        item.verifiedDate = new Date().toISOString().split('T')[0];
                    }
                    localStorage.setItem(requestId, JSON.stringify(item));
                }
            }
            catch (e) {
                console.error("localStorage update failed:", e.message, e.stack);
            }
        }
        try {
            const list = await _InventoryItemService__WEBPACK_IMPORTED_MODULE_3__.InventoryItemService.getInventoryList();
            console.log("Resolved Inventory List Name:", list.Title || "InventoryList");
            const fields = await list.fields.select("InternalName", "Title", "TypeAsString")();
            const findField = (searchStr, fallback) => {
                const field = fields.find((f) => f.InternalName.toLowerCase() === searchStr.toLowerCase() || f.Title.toLowerCase() === searchStr.toLowerCase());
                return field ? field.InternalName : fallback;
            };
            const statusKey = findField("status", "Status");
            const assignedToKey = findField("assignedto", "AssignedTo");
            const conditionKey = findField("condition", "Condition");
            const noteKey = findField("note", "Note");
            console.log("Resolved Status Field:", statusKey);
            console.log("Resolved AssignedTo Field:", assignedToKey);
            console.log("Resolved Condition Field:", conditionKey);
            const assetIdNum = parseInt(req.assetId, 10);
            console.log("Inventory Item ID:", assetIdNum);
            if (status === 'Completed' || status === 'Approved') {
                const condition = finalCondition || req.proposedCondition || "Good";
                let nextStatus = "In Stock";
                if (condition === "Poor" || condition === "Damaged") {
                    nextStatus = "Under Maintenance";
                }
                const payload = {
                    [statusKey]: nextStatus,
                    [assignedToKey]: null,
                    [`${assignedToKey}Id`]: null,
                    [conditionKey]: condition,
                    [noteKey]: `In Stock - Returned by employee. Verification Note: ${adminComments || managerComment || 'Returned to Stock'}`
                };
                if (assignedToKey !== "AssignedTo") {
                    payload.AssignedTo = null;
                    payload.AssignedToId = null;
                }
                console.log("Inventory Update Payload:", JSON.stringify(payload));
                let assetUpdateResult = null;
                try {
                    if (!isNaN(assetIdNum)) {
                        assetUpdateResult = await list.items.getById(assetIdNum).update(payload);
                        console.log("Result of list.items.update() (Inventory update by ID):", JSON.stringify(assetUpdateResult));
                    }
                }
                catch (err) {
                    console.error(`Exception in SharePoint Asset update by ID on Return ${status}:`, err.message);
                }
                // Fallback update by Serial Number or Title if ID update didn't run or failed
                try {
                    let matchingAssets = [];
                    if (req.serialNumber) {
                        const serialCol = findField("serialnumber", "SerialNumber");
                        matchingAssets = await list.items.filter(`${serialCol} eq '${req.serialNumber.replace(/'/g, "''")}'`).select("ID")();
                    }
                    if ((!matchingAssets || matchingAssets.length === 0) && req.assetName) {
                        const titleCol = findField("assetname", "Title");
                        matchingAssets = await list.items.filter(`${titleCol} eq '${req.assetName.replace(/'/g, "''")}'`).select("ID")();
                    }
                    for (const mAsset of matchingAssets) {
                        if (mAsset.ID !== assetIdNum) {
                            await list.items.getById(mAsset.ID).update(payload);
                            console.log(`Updated inventory asset ID ${mAsset.ID} (${req.assetName}) to '${nextStatus}' via fallback search.`);
                        }
                    }
                }
                catch (err) {
                    console.warn("Fallback inventory update failed:", err.message);
                }
                // Delete Mapping List records for the returned asset
                try {
                    const mappingList = await _AssetAssignmentService__WEBPACK_IMPORTED_MODULE_4__.AssetAssignmentService.getMappingList();
                    console.log("Resolved Mapping List Name:", mappingList.Title || "Mapping List");
                    const mappingFields = await _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.getListFieldsMetadata(mappingList);
                    const serialCol = _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService._resolveFieldInternalName(mappingFields, ["serialnumber", "serial number"]);
                    const assetNameCol = _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService._resolveFieldInternalName(mappingFields, ["assetname", "asset name"]);
                    const employeeCol = _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService._resolveFieldInternalName(mappingFields, ["employee", "employee name", "employe"]);
                    let mappedItems = [];
                    if (serialCol && req.serialNumber) {
                        mappedItems = await mappingList.items.filter(`${serialCol} eq '${req.serialNumber.replace(/'/g, "''")}'`).select("ID")();
                    }
                    if ((!mappedItems || mappedItems.length === 0) && assetNameCol && req.assetName) {
                        let filterQuery = `${assetNameCol} eq '${req.assetName.replace(/'/g, "''")}'`;
                        if (employeeCol && req.requesterName) {
                            filterQuery += ` and ${employeeCol} eq '${req.requesterName.replace(/'/g, "''")}'`;
                        }
                        mappedItems = await mappingList.items.filter(filterQuery).select("ID")();
                    }
                    console.log("Mapping Records Found for deletion:", JSON.stringify(mappedItems));
                    if (mappedItems && mappedItems.length > 0) {
                        const deletedIds = [];
                        for (const mItem of mappedItems) {
                            const deleteResult = await mappingList.items.getById(mItem.ID).delete();
                            console.log(`Result of mapping deletion for ID ${mItem.ID}:`, JSON.stringify(deleteResult));
                            deletedIds.push(mItem.ID);
                        }
                        console.log("Deleted Mapping IDs:", JSON.stringify(deletedIds));
                    }
                }
                catch (err) {
                    console.error(`Exception in Mapping List Cleanup on return ${status.toLowerCase()}:`, err.message, err.stack);
                }
            }
            else if (status === 'Rejected') {
                try {
                    const rejectPayload = { [statusKey]: "Assigned" };
                    console.log("Inventory Reject Update Payload:", JSON.stringify(rejectPayload));
                    const rejectResult = await list.items.getById(assetIdNum).update(rejectPayload);
                    console.log("Result of list.items.update() (Inventory Reject update):", JSON.stringify(rejectResult));
                }
                catch (err) {
                    console.error("Exception in SharePoint Asset update on Return Rejection:", err.message, err.stack);
                }
            }
        }
        catch (error) {
            console.error("Exception in Asset inventory sync block:", error.message, error.stack);
        }
        try {
            if (status === 'Completed' || status === 'Rejected') {
                let logTitle = "";
                let lifecycle = "";
                if (status === 'Completed') {
                    logTitle = `Completed Return for Asset: ${req.assetName}`;
                    lifecycle = "ReturnCompleted";
                }
                else if (status === 'Rejected') {
                    logTitle = `Rejected Return Request for Asset: ${req.assetName}`;
                    lifecycle = "ReturnRejected";
                }
                let finalAction = 'Update';
                let finalTitle = logTitle;
                if (status === 'Completed') {
                    const condition = finalCondition || req.proposedCondition || "Good";
                    let nextStatus = "In Stock";
                    if (condition === "Poor" || condition === "Damaged") {
                        nextStatus = "Under Maintenance";
                    }
                    if (nextStatus === 'In Stock') {
                        finalAction = 'Inactivated';
                        finalTitle = `Completed Return & Inactivated: ${req.assetName} (Returned to Stock)`;
                    }
                    else {
                        finalAction = 'Deactivated';
                        finalTitle = `Completed Return & Deactivated: ${req.assetName} (Under Maintenance)`;
                    }
                }
                else if (status === 'Rejected') {
                    finalAction = 'Activated';
                    finalTitle = `Rejected Return Request & Reactivated: ${req.assetName}`;
                }
                console.log("Submitting Audit Log payload...");
                await _AuditLogService__WEBPACK_IMPORTED_MODULE_2__.AuditLogService.addAuditLog({
                    title: finalTitle,
                    action: finalAction,
                    entityType: 'Asset',
                    entityId: req.assetId,
                    details: JSON.stringify({
                        requestKey: req.id,
                        lifecycle,
                        assetName: req.assetName,
                        requesterName: req.requesterName,
                        changedBy: approverName,
                        changedAt: new Date().toISOString(),
                        managerComment,
                        adminComments,
                        condition: finalCondition || req.proposedCondition
                    }),
                    user: approverName
                });
                console.log("Audit Log created successfully.");
            }
        }
        catch (e) {
            console.error("Exception in writing Audit Log:", e.message, e.stack);
        }
        console.log("========================");
        console.log("RETURN WORKFLOW END");
        console.log("========================");
    }
    static async cleanupReturnApprovedAssets() {
        console.log("[Cleanup] Starting self-healing cleanup for Return Approved & Completed assets...");
        try {
            const list = await _InventoryItemService__WEBPACK_IMPORTED_MODULE_3__.InventoryItemService.getInventoryList();
            if (!list || !list.items || typeof list.items.select !== 'function') {
                console.log("[Cleanup] list.items.select is not a function (mock or missing). Skipping cleanup.");
                return;
            }
            const fields = await list.fields.select("InternalName", "Title", "TypeAsString")();
            const findField = (searchStr, fallback) => {
                const field = fields.find((f) => f.InternalName.toLowerCase() === searchStr.toLowerCase() || f.Title.toLowerCase() === searchStr.toLowerCase());
                return field ? field.InternalName : fallback;
            };
            const statusKey = findField("status", "Status");
            const assignedToKey = findField("assignedto", "AssignedTo");
            const conditionKey = findField("condition", "Condition");
            const noteKey = findField("note", "Note");
            // 1. Fetch completed/approved return requests
            const returnRequests = await ReturnRequestService.getReturnRequests();
            const resolvedReturns = returnRequests.filter(r => {
                const s = (r.status || '').toLowerCase();
                return s === 'completed' || s === 'approved' || s === 'returned' || s === 'pending admin verification';
            });
            console.log(`[Cleanup] Found ${resolvedReturns.length} approved/completed return request(s) to verify against inventory.`);
            const inventoryItems = await list.items.select("ID", statusKey, assignedToKey, "SerialNumber", "Title", noteKey)();
            // Clean up mapping list records for resolved returns
            let mappingList = null;
            let mappingFields = [];
            let serialCol = "";
            let assetNameCol = "";
            let employeeCol = "";
            try {
                mappingList = await _AssetAssignmentService__WEBPACK_IMPORTED_MODULE_4__.AssetAssignmentService.getMappingList();
                mappingFields = await _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService.getListFieldsMetadata(mappingList);
                serialCol = _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService._resolveFieldInternalName(mappingFields, ["serialnumber", "serial number"]);
                assetNameCol = _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService._resolveFieldInternalName(mappingFields, ["assetname", "asset name"]);
                employeeCol = _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService._resolveFieldInternalName(mappingFields, ["employee", "employee name", "employe"]);
            }
            catch (e) {
                console.warn("[Cleanup] Could not bind mapping list", e);
            }
            for (const ret of resolvedReturns) {
                const serial = (ret.serialNumber || '').trim().toLowerCase();
                const title = (ret.assetName || '').trim().toLowerCase();
                const reqAssetId = (ret.assetId || '').trim();
                // Match inventory item
                const matchingInventoryItem = inventoryItems.find((item) => {
                    const itemID = item.ID ? item.ID.toString() : "";
                    const itemSerial = (item.SerialNumber || '').trim().toLowerCase();
                    const itemTitle = (item.Title || item.AssetName || '').trim().toLowerCase();
                    return (reqAssetId && itemID === reqAssetId) ||
                        (serial && itemSerial && itemSerial === serial) ||
                        (title && itemTitle && itemTitle === title);
                });
                if (matchingInventoryItem) {
                    const rawStatus = (matchingInventoryItem[statusKey] || '').toString().toLowerCase();
                    const val = matchingInventoryItem[assignedToKey];
                    const hasAssignee = !!(val && (typeof val === 'object' ? Object.keys(val).length > 0 : String(val).trim() !== ''));
                    if (rawStatus === 'assigned' || hasAssignee || rawStatus === 'return approved' || rawStatus === 'returnapproved') {
                        console.log(`[Cleanup] Resetting returned asset '${ret.assetName}' (ID: ${matchingInventoryItem.ID}) to 'In Stock'.`);
                        const payload = {
                            [statusKey]: "In Stock",
                            [assignedToKey]: null,
                            [`${assignedToKey}Id`]: null,
                            [noteKey]: `In Stock - Returned by employee (${ret.requesterName || ''})`
                        };
                        if (assignedToKey !== "AssignedTo") {
                            payload.AssignedTo = null;
                            payload.AssignedToId = null;
                        }
                        try {
                            await list.items.getById(matchingInventoryItem.ID).update(payload);
                            console.log(`[Cleanup] Successfully set Inventory item ID ${matchingInventoryItem.ID} to 'In Stock'.`);
                        }
                        catch (err) {
                            console.error(`[Cleanup] Failed to update inventory item ID ${matchingInventoryItem.ID}:`, err.message);
                        }
                    }
                }
                // Clean up mapping record
                if (mappingList) {
                    try {
                        let mappedItems = [];
                        if (serialCol && ret.serialNumber) {
                            mappedItems = await mappingList.items.filter(`${serialCol} eq '${ret.serialNumber.replace(/'/g, "''")}'`).select("ID")();
                        }
                        if ((!mappedItems || mappedItems.length === 0) && assetNameCol && ret.assetName) {
                            let filterQuery = `${assetNameCol} eq '${ret.assetName.replace(/'/g, "''")}'`;
                            if (employeeCol && ret.requesterName) {
                                filterQuery += ` and ${employeeCol} eq '${ret.requesterName.replace(/'/g, "''")}'`;
                            }
                            mappedItems = await mappingList.items.filter(filterQuery).select("ID")();
                        }
                        for (const mItem of mappedItems) {
                            await mappingList.items.getById(mItem.ID).delete();
                            console.log(`[Cleanup] Deleted mapping record ID ${mItem.ID} for returned asset ${ret.assetName}`);
                        }
                    }
                    catch (mErr) {
                        console.warn(`[Cleanup] Mapping deletion warning for ${ret.assetName}:`, mErr.message);
                    }
                }
            }
            console.log("[Cleanup] Self-healing cleanup finished.");
        }
        catch (error) {
            console.warn("[Cleanup] Failed to run return approved assets cleanup:", error);
        }
    }
}
ReturnRequestService._resolvedReturnListName = null;


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("3bfa0a134f37e077aecc")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=inventory-management-web-part.e715f68d0344e0217072.hot-update.js.map