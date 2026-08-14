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
/* harmony import */ var _utils_WarrantyUtils__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ../utils/WarrantyUtils */ 98126);
/* harmony import */ var _utils_StockUtils__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ../utils/StockUtils */ 19256);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @fluentui/react */ 46643);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! @fluentui/react */ 21314);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @fluentui/react */ 52394);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! @fluentui/react */ 63208);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! @fluentui/react */ 53918);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! @fluentui/react */ 27006);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! @fluentui/react */ 18681);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! @fluentui/react */ 12042);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! @fluentui/react */ 67102);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! @fluentui/react */ 29425);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! @fluentui/react */ 5613);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! @fluentui/react */ 92070);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! @fluentui/react */ 15369);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(/*! @fluentui/react */ 79370);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(/*! @fluentui/react */ 37805);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(/*! @fluentui/react */ 74423);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(/*! @fluentui/react */ 20472);
/* harmony import */ var chart_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! chart.js */ 55277);
/* harmony import */ var react_chartjs_2__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! react-chartjs-2 */ 86766);
/* harmony import */ var jspdf__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! jspdf */ 28339);
/* harmony import */ var _pnp_sp_site_users_web__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @pnp/sp/site-users/web */ 43500);
/* harmony import */ var _pnp_sp_site_groups_web__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @pnp/sp/site-groups/web */ 49036);
/* harmony import */ var _data_mockData__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../data/mockData */ 27962);
/* harmony import */ var _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../services/InventoryService */ 29619);
/* harmony import */ var _services_EmailService__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../services/EmailService */ 86407);
/* harmony import */ var _AssetTracking__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./AssetTracking */ 20867);
/* harmony import */ var _pages__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../pages */ 56330);
/* harmony import */ var _NotificationCenter__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./NotificationCenter */ 58350);
/* harmony import */ var _IncidentRequest_IncidentRequestModule__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./IncidentRequest/IncidentRequestModule */ 19581);
/* harmony import */ var _ReplacementHistory_ReplacementHistory__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./ReplacementHistory/ReplacementHistory */ 81635);
/* harmony import */ var _AssetLifecycleDiagram__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./AssetLifecycleDiagram */ 29643);
/* harmony import */ var _WorkflowPopup__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./WorkflowPopup */ 48235);



















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
        this._handleMockEmailSent = (ev) => {
            this.setState({
                lastMockEmail: ev.detail,
                editMockEmailTo: ev.detail.to.join(', '),
                editMockEmailSubject: ev.detail.subject,
                isSendingMockEmail: false,
                mockEmailSendError: undefined,
                mockEmailSendSuccess: false
            });
        };
        this._handleEmailSendFailed = (ev) => {
            this.setState({
                syncMessage: `⚠️ Email Notification failed to send to ${ev.detail.to.join(', ')}. Details: ${ev.detail.errorMessage}`,
                syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.warning
            });
        };
        this._onSendMockEmail = async () => {
            const { lastMockEmail, editMockEmailTo, editMockEmailSubject } = this.state;
            if (!lastMockEmail)
                return;
            this.setState({ isSendingMockEmail: true, mockEmailSendError: undefined, mockEmailSendSuccess: false });
            try {
                const recipients = editMockEmailTo.split(',').map(email => email.trim()).filter(Boolean);
                await _services_EmailService__WEBPACK_IMPORTED_MODULE_19__.EmailService.sendMail(recipients, editMockEmailSubject, lastMockEmail.body);
                this.setState({
                    isSendingMockEmail: false,
                    mockEmailSendSuccess: true
                });
                setTimeout(() => {
                    this.setState({ lastMockEmail: undefined, mockEmailSendSuccess: false });
                }, 2000);
            }
            catch (e) {
                console.error("Failed to send email from panel:", e);
                this.setState({
                    isSendingMockEmail: false,
                    mockEmailSendError: e.message || JSON.stringify(e)
                });
            }
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
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.success,
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
                    requesterEmail: requestData.requesterEmail,
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
                const effectiveRole = this.state.previewRole || this.state.userRole;
                const isEmpUI = effectiveRole !== 'Admin';
                await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.addRequest({
                    ...requestData,
                    status: initialStatus
                }, this.state.activeUserDisplayName, effectiveRole, isEmpUI);
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
        this._onApproveRequest = async (request, comment) => {
            const availableStock = (0,_utils_StockUtils__WEBPACK_IMPORTED_MODULE_28__.getAvailableStock)(this.state.items, request);
            const requestedQuantity = Number(request.quantity || 0);
            if (availableStock < requestedQuantity) {
                this.setState({
                    errorMessage: `Insufficient stock for "${request.assetTitle}". Available: ${availableStock}, Requested: ${requestedQuantity}`
                });
                return;
            }
            try {
                this.setState({
                    requestActionInProgressId: request.id,
                    errorMessage: undefined
                });
                // KEEP THE REST OF YOUR EXISTING CODE EXACTLY AS IT IS
                if (request.id.indexOf('temp-') === 0) {
                    this.setState(prevState => ({
                        requests: prevState.requests.map(r => r.id === request.id
                            ? {
                                ...r,
                                status: 'Approved',
                                managerResponse: comment
                            }
                            : r)
                    }));
                }
                else {
                    await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.updateRequestStatus(parseInt(request.id, 10), 'Approved', this.state.activeUserDisplayName, comment);
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
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.info
                });
                const result = await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.syncExistingAssignmentsToMappingList(this.state.activeUserDisplayName);
                this.setState({
                    syncInProgress: false,
                    syncMessage: `Synchronization complete! Verified ${result.checkedCount} assigned assets. Successfully checked and synchronized ${result.syncedCount} missing mapping records.`,
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.success
                });
                // Reload inventory to ensure consistency
                await this._loadInventory();
            }
            catch (e) {
                console.error("Manual sync failed:", e);
                this.setState({
                    syncInProgress: false,
                    syncMessage: `Failed to synchronize mapping records: ${e.message || JSON.stringify(e)}`,
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.error
                });
            }
        };
        this._onRunDiagnostics = async () => {
            try {
                this.setState({
                    syncInProgress: true,
                    syncMessage: 'Running Mapping List diagnostic check...',
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.info
                });
                const diagnosticInfo = await _services_InventoryService__WEBPACK_IMPORTED_MODULE_18__.InventoryService.diagnoseMappingListFields();
                this.setState({
                    syncInProgress: false,
                    diagnosticInfo,
                    syncMessage: 'Diagnostic check complete! Columns and item counts retrieved successfully.',
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.success
                });
            }
            catch (e) {
                this.setState({
                    syncInProgress: false,
                    syncMessage: `Failed to retrieve diagnostics: ${e.message || JSON.stringify(e)}`,
                    syncMessageType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.error
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
            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_29__.Stack, { tokens: { childrenGap: 20 } },
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
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_30__.Icon, { iconName: "BarChart4", style: { color: '#0078d4' } }),
                        " Detailed Analysis"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_29__.Stack, { tokens: { childrenGap: 12 } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' } }, "Inventory Availability Check:"),
                            isSufficient ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_31__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.success, styles: { root: { borderRadius: '6px' } } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Inventory Check Passed:"),
                                " There are currently ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, inStockCount),
                                " unit(s) of ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, reqAssetTitle),
                                " in stock, which is sufficient to fulfill this request.")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_31__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.warning, styles: { root: { borderRadius: '6px' } } },
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
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_32__.ProgressIndicator, { label: currentStepText, percentComplete: progressPercent, styles: { root: { marginTop: '5px' } } }))))));
        };
        this._renderAssetAnalysis = (asset) => {
            const lifecycleInfo = (0,_utils_WarrantyUtils__WEBPACK_IMPORTED_MODULE_33__.getAssetLifecycleInfo)(asset.purchaseDate);
            const warrantyInfo = (0,_utils_WarrantyUtils__WEBPACK_IMPORTED_MODULE_33__.getWarrantyColorInfo)(asset.warrantyExpiry);
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
            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_29__.Stack, { tokens: { childrenGap: 20 } },
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
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: warrantyInfo.textColor, backgroundColor: asset.warrantyExpiry ? warrantyInfo.bgColor : 'transparent', padding: asset.warrantyExpiry ? '2px 8px' : 0, borderRadius: '4px' } }, asset.warrantyExpiry || "N/A"))),
                    asset.note && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '12px', fontSize: '0.88rem', padding: '8px 10px', backgroundColor: '#f9fafb', borderRadius: '4px', border: '1px solid #f3f4f6' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#6b7280', display: 'block', marginBottom: '2px' } }, "Asset Notes:"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#374151' } }, asset.note)))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_30__.Icon, { iconName: "Heart", style: { color: conditionColor } }),
                        " Health & Depreciation Analysis"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_29__.Stack, { tokens: { childrenGap: 12 } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' } }, "Asset Lifecycle & EOL Date:"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.9rem', color: '#334155' } },
                                lifecycleInfo.statusText,
                                ". Purchase Date: ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, lifecycleInfo.purchaseDateFormatted),
                                " | Enterprise EOL Date: ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, lifecycleInfo.eolDateFormatted || 'N/A'),
                                ".")),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' } }, "Warranty Expiry Evaluation:"),
                            asset.warrantyExpiry ? (warrantyInfo.isExpired ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_31__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.error, styles: { root: { borderRadius: '6px' } } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Warranty Expired:"),
                                " Coverage ended on ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, warrantyInfo.formattedDate),
                                " (",
                                warrantyInfo.remainingText,
                                "). Any future repair operations will incur full direct business costs.")) : warrantyInfo.isLessThan6Months ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_31__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.error, styles: { root: { borderRadius: '6px' } } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Warranty Expiring Soon (< 6 months):"),
                                " Expiration date is ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, warrantyInfo.formattedDate),
                                " (",
                                warrantyInfo.remainingText,
                                "). High priority for hardware refresh/warranty renewal.")) : warrantyInfo.isLessThan1Year ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_31__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.warning, styles: { root: { borderRadius: '6px' } } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Warranty Expiring (< 1 year):"),
                                " Expiration date is ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, warrantyInfo.formattedDate),
                                " (",
                                warrantyInfo.remainingText,
                                "). Plan for upcoming hardware lifecycle management.")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_31__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.success, styles: { root: { borderRadius: '6px' } } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Warranty Active (> 1 year):"),
                                " Fully protected under manufacturer coverage until ",
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, warrantyInfo.formattedDate),
                                " (",
                                warrantyInfo.remainingText,
                                ")."))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_31__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.info, styles: { root: { borderRadius: '6px' } } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Warranty Unknown:"),
                                " No warranty expiration date has been registered for this asset."))),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { borderTop: '1px solid #e2e8f0', paddingTop: '10px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' } }, "Asset Physical Health:"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_30__.Icon, { iconName: healthIcon, style: { fontSize: '18px', color: conditionColor } }),
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
            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_34__.Panel, { isOpen: isNotificationDetailsOpen, onDismiss: () => this.setState({ isNotificationDetailsOpen: false }), type: _fluentui_react__WEBPACK_IMPORTED_MODULE_35__.PanelType.medium, headerText: selectedNotification.title, closeButtonAriaLabel: "Close" },
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
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_31__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.info }, "This is a general system notification. There is no direct database link to an active request or asset."))))));
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
            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_34__.Panel, { isOpen: this.state.isAdminPanelOpen, onDismiss: () => this.setState({ isAdminPanelOpen: false, selectedAdminRequest: undefined }), type: _fluentui_react__WEBPACK_IMPORTED_MODULE_35__.PanelType.medium, headerText: `Request #${request.requestKey || request.id}`, closeButtonAriaLabel: "Close" },
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
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_36__.Dropdown, { placeholder: dropdownPlaceholder, options: matchingAssetOptions, selectedKey: this.state.adminSelectedAssetId, onChange: this._onAdminAssetChange, disabled: matchingAssets.length === 0 || isBusy, styles: { dropdown: { width: '100%' } } })),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("label", { style: { fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)', display: 'block', marginBottom: '6px' } }, "Comment"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_37__.TextField, { multiline: true, rows: 4, placeholder: "Add a comment explaining your decision...", value: this.state.adminComment, onChange: (_, value) => this.setState({ adminComment: value || '' }), disabled: isBusy })),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '12px', marginTop: '8px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_38__.PrimaryButton, { text: isBusy ? "Processing..." : "Assign & Approve", onClick: this._handleAdminAssignAndApprove, disabled: isBusy, iconProps: { iconName: 'CompletedSolid' } }),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_39__.DefaultButton, { text: "Reject", onClick: this._handleAdminReject, disabled: isBusy, iconProps: { iconName: 'Cancel' }, styles: {
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
            preselectedIncidentType: undefined,
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
            },
            lastMockEmail: undefined,
            editMockEmailTo: '',
            editMockEmailSubject: '',
            isSendingMockEmail: false,
            mockEmailSendError: undefined,
            mockEmailSendSuccess: false
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
        if (typeof window !== 'undefined') {
            window.addEventListener('spfx_mock_email_sent', this._handleMockEmailSent);
            window.addEventListener('spfx_email_send_failed', this._handleEmailSendFailed);
        }
    }
    componentWillUnmount() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('spfx_mock_email_sent', this._handleMockEmailSent);
            window.removeEventListener('spfx_email_send_failed', this._handleEmailSendFailed);
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
            { key: 'ReplacementHistory', text: 'Replacement History', icon: 'Sync' },
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
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_AssetLifecycleDiagram__WEBPACK_IMPORTED_MODULE_25__.AssetLifecycleDiagram, { isDarkTheme: isDarkTheme }))),
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
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_30__.Icon, { iconName: nav.icon }),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].navItemText }, nav.text),
                                    nav.badge !== undefined && nav.badge > 0 && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].navBadge, style: { backgroundColor: nav.badgeColor || '#e74c3c' } }, nav.badge)))));
                        }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].collapseToggle, onClick: () => this.setState(prev => ({ sidebarCollapsed: !prev.sidebarCollapsed })), role: "button", tabIndex: 0, "aria-label": this.state.sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation', onKeyDown: (e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    this.setState(prev => ({ sidebarCollapsed: !prev.sidebarCollapsed }));
                                }
                            } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_30__.Icon, { iconName: this.state.sidebarCollapsed ? 'DoubleChevronRight' : 'DoubleChevronLeft' }),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].collapseText }, this.state.sidebarCollapsed ? 'Expand' : 'Collapse'))),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: `${_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].card} ${_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].contentContainer}` },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].mobileNavHeader },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].mobileMenuToggle, onClick: () => this.setState(prev => ({ sidebarCollapsed: !prev.sidebarCollapsed })), "aria-label": "Toggle navigation menu" },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_30__.Icon, { iconName: "GlobalNavButton" })),
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
                                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_pages__WEBPACK_IMPORTED_MODULE_21__.DashboardPage, { state: dashboardState, actions: dashboardActions }));
                                case 'MyWorkspace':
                                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "My Workspace")),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Manage your assigned assets and track your requests."),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_40__.Pivot, { "aria-label": "My Workspace Tabs" },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_41__.PivotItem, { headerText: "Assets" },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px' } },
                                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginBottom: '15px' } },
                                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_38__.PrimaryButton, { text: "Request Asset", onClick: () => this.setState({ isRequestFormOpen: true }), iconProps: { iconName: 'Send' } })),
                                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_MyAssignedAssetsView__WEBPACK_IMPORTED_MODULE_4__.MyAssignedAssetsView, { items: myAssets, onReturnAsset: (item) => this.setState({ selectedAssetForReturn: item, isReturnFormOpen: true }), onRaiseIncident: (item) => this.setState({ selectedAssetForIncident: item, isIncidentFormOpen: true }), onAssetReplacement: (item) => this.setState({ selectedAssetForIncident: item, isIncidentFormOpen: true, preselectedIncidentType: 'Replacement Request' }) }))),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_41__.PivotItem, { headerText: "Requests" },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px' } },
                                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_MyRequestsView__WEBPACK_IMPORTED_MODULE_5__.MyRequestsView, { requests: myRequests, returnRequests: this.state.returnRequests.filter(r => this._isRequestOwnedByCurrentUser(r.requesterName || '', activeUserDisplayName || '')) }))))));
                                case 'Notifications':
                                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_NotificationCenter__WEBPACK_IMPORTED_MODULE_22__.NotificationCenter, { notifications: notifications, onMarkAsRead: this._markNotificationAsRead, onMarkAllAsRead: this._markAllNotificationsAsRead, onClearNotification: this._clearNotification, onClearAllNotifications: this._clearAllNotifications, onNotificationAction: this._handleNotificationAction }));
                                case 'IncidentHistory':
                                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_pages__WEBPACK_IMPORTED_MODULE_21__.IncidentHistoryPage, { ...this.props, state: incidentHistoryState, actions: incidentHistoryActions }));
                                case 'ReplacementHistory':
                                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ReplacementHistory_ReplacementHistory__WEBPACK_IMPORTED_MODULE_24__.ReplacementHistory, { ...this.props, userDisplayName: activeUserDisplayName, userEmail: activeUserEmail, userRole: effectiveRole, setIsLoading: (loading) => this.setState({ loading }) })));
                                case 'Inventory':
                                    return (isAdmin || isManager) ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_pages__WEBPACK_IMPORTED_MODULE_21__.InventoryPage, { state: inventoryState, actions: inventoryActions })) : null;
                                case 'Approvals':
                                    return isManager ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Request Approvals & Assignment Queue")),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Track and manage all asset requests efficiently."),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_37__.TextField, { label: "Search by Request ID", placeholder: "e.g. REQ-000123", value: requestSearchId, onChange: (_, value) => this.setState({ requestSearchId: value || '' }), styles: { root: { marginBottom: '12px', maxWidth: 320 } } }),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginBottom: '20px', padding: '15px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginBottom: '10px' } }, "Request Approval Distribution"),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { height: '250px', position: 'relative' } },
                                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_chartjs_2__WEBPACK_IMPORTED_MODULE_42__.Pie, { data: {
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
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_RequestList__WEBPACK_IMPORTED_MODULE_6__.RequestList, { items: visibleManagerRequests, inventoryItems: this.state.items, canApproveReject: true, canApproveAsset: false, hideStatusColumn: false, showResponseColumns: false, onApproveRequest: this._onApproveRequest, onRejectRequest: this._onRejectRequest, actionInProgressId: requestActionInProgressId }))) : null;
                                case 'AssetAssignmentQueue':
                                    return isAdmin ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardHeader },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, "Approved Requests for Asset Assignment")),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Only approved requests are shown here so assets can be assigned."),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_37__.TextField, { label: "Search by Request ID", placeholder: "e.g. REQ-000123", value: requestSearchId, onChange: (_, value) => this.setState({ requestSearchId: value || '' }), styles: { root: { marginBottom: '12px', maxWidth: 320 } } }),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_RequestList__WEBPACK_IMPORTED_MODULE_6__.RequestList, { items: visibleAdminRequests, inventoryItems: this.state.items, canApproveReject: false, canApproveAsset: true, hideStatusColumn: true, showResponseColumns: false, onSelectRequestForAssignment: (request) => this.setState({ selectedAdminRequest: request, isAdminPanelOpen: true, adminSelectedAssetId: undefined, adminComment: '' }), actionInProgressId: requestActionInProgressId }))) : null;
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
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_38__.PrimaryButton, { text: "Manage Site Permissions", iconProps: { iconName: 'Permissions' }, onClick: () => {
                                                    const siteUrl = window.location.pathname.substring(0, window.location.pathname.toLowerCase().indexOf('/sitepages'));
                                                    window.open(`${window.location.origin}${siteUrl}/_layouts/15/user.aspx`, '_blank');
                                                } })),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { marginBottom: '15px' } }, "Employee Directory & Asset Ownership"),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_43__.DetailsList, { items: this.state.employees.map(emp => {
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
                                                ], setKey: "usersList", layoutMode: _fluentui_react__WEBPACK_IMPORTED_MODULE_44__.DetailsListLayoutMode.justified, selectionMode: _fluentui_react__WEBPACK_IMPORTED_MODULE_45__.SelectionMode.none, onRenderRow: (rowProps) => {
                                                    if (!rowProps)
                                                        return null;
                                                    const isExpanded = this.state.expandedUserEmail === rowProps.item.email;
                                                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { onClick: () => this.setState({ expandedUserEmail: isExpanded ? undefined : rowProps.item.email }), style: { cursor: 'pointer', '&:hover': { backgroundColor: '#f3f2f1' } } },
                                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_46__.DetailsRow, { ...rowProps })),
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
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_AssetTracking__WEBPACK_IMPORTED_MODULE_20__.AssetTracking, { items: items, employees: this.state.employees, currentUserRole: effectiveRole, currentUserName: activeUserDisplayName, currentUserEmail: activeUserEmail })))) : null;
                                case 'Reports':
                                    return isAdmin ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_pages__WEBPACK_IMPORTED_MODULE_21__.ReportsPage, { state: reportsState, actions: reportsActions })) : null;
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
                                    return isAdmin ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_pages__WEBPACK_IMPORTED_MODULE_21__.ConfigPage, { state: configState, actions: configActions })) : null;
                                }
                                default:
                                    return null;
                            }
                        })()))),
            (isAdmin || isManager) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_AssetForm__WEBPACK_IMPORTED_MODULE_8__.AssetForm, { isOpen: isAssetFormOpen, onClose: () => this.setState({ isAssetFormOpen: false }), currentUserRole: effectiveRole, onAddAsset: this._onAddAsset })),
            (isAdmin || isManager || isEmployee) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_RequestForm__WEBPACK_IMPORTED_MODULE_9__.RequestForm, { isOpen: isRequestFormOpen, onClose: () => this.setState({ isRequestFormOpen: false }), availableAssets: items, employees: this.state.employees, currentUserRole: effectiveRole, currentUserName: activeUserDisplayName, currentUserEmail: this.state.activeUserEmail, onSubmitRequest: this._onSubmitRequest })),
            (isAdmin || isManager || isEmployee) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_IncidentRequest_IncidentRequestModule__WEBPACK_IMPORTED_MODULE_23__.IncidentRequestModule, { ...this.props, isOpen: this.state.isIncidentFormOpen, onClose: () => this.setState({ isIncidentFormOpen: false, selectedAssetForIncident: undefined, preselectedIncidentType: undefined }), userDisplayName: activeUserDisplayName, userEmail: activeUserEmail, setIsLoading: (loading) => this.setState({ loading }), preselectedAsset: this.state.selectedAssetForIncident, preselectedIncidentType: this.state.preselectedIncidentType, onSuccessPopup: (details) => {
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
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_WorkflowPopup__WEBPACK_IMPORTED_MODULE_26__.WorkflowPopup, { isOpen: this.state.workflowPopup?.isOpen, title: this.state.workflowPopup?.title || '', stage: this.state.workflowPopup?.stage || '', type: this.state.workflowPopup?.type || 'info', message: this.state.workflowPopup?.message || '', details: this.state.workflowPopup?.details, onDismiss: () => this.setState({ workflowPopup: { ...this.state.workflowPopup, isOpen: false } }) }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_34__.Panel, { isOpen: this.state.lastMockEmail !== undefined, onDismiss: () => this.setState({ lastMockEmail: undefined }), type: _fluentui_react__WEBPACK_IMPORTED_MODULE_35__.PanelType.medium, headerText: "\uD83D\uDCEC Outgoing Email Notification (Developer Preview)", closeButtonAriaLabel: "Close", onRenderFooterContent: () => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_29__.Stack, { horizontal: true, tokens: { childrenGap: 10 }, style: { padding: '10px 0' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_38__.PrimaryButton, { text: this.state.isSendingMockEmail ? "Sending..." : "Send Email", onClick: this._onSendMockEmail, disabled: this.state.isSendingMockEmail || this.state.mockEmailSendSuccess || !this.state.editMockEmailTo, iconProps: { iconName: 'Send' } }),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_39__.DefaultButton, { text: "Close", onClick: () => this.setState({ lastMockEmail: undefined }), disabled: this.state.isSendingMockEmail }))), isFooterAtBottom: true }, this.state.lastMockEmail && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_29__.Stack, { tokens: { childrenGap: 15 }, style: { padding: '10px 0' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_31__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.info }, "You can review, modify the recipient(s) or subject, and send this email to test delivery."),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_37__.TextField, { label: "Recipients (comma separated)", value: this.state.editMockEmailTo, onChange: (_, val) => this.setState({ editMockEmailTo: val || '' }), required: true, disabled: this.state.isSendingMockEmail, iconProps: { iconName: 'Mail' } }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_37__.TextField, { label: "Subject", value: this.state.editMockEmailSubject, onChange: (_, val) => this.setState({ editMockEmailSubject: val || '' }), required: true, disabled: this.state.isSendingMockEmail }),
                this.state.mockEmailSendSuccess && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_31__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.success }, "Email has been successfully dispatched to the Microsoft Graph / SharePoint mail queue!")),
                this.state.mockEmailSendError && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_31__.MessageBar, { messageBarType: _fluentui_react__WEBPACK_IMPORTED_MODULE_27__.MessageBarType.error },
                    "Failed to send email: ",
                    this.state.mockEmailSendError)),
                this.state.isSendingMockEmail && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_32__.ProgressIndicator, { label: "Dispatched email transaction in progress..." })),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '10px' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '8px' } }, "Email Content Preview:"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { border: '1px solid #ddd', borderRadius: '8px', padding: '15px', overflow: 'auto', background: '#fff', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)', maxHeight: '400px' }, dangerouslySetInnerHTML: { __html: this.state.lastMockEmail.body } })))))));
    }
}


/***/ }),

/***/ 82867:
/*!********************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/components/RequestList.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RequestList: () => (/* binding */ RequestList)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 85959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_StockUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/StockUtils */ 19256);
/* harmony import */ var _fluentui_react_lib_DetailsList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fluentui/react/lib/DetailsList */ 79370);
/* harmony import */ var _fluentui_react_lib_DetailsList__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fluentui/react/lib/DetailsList */ 37805);
/* harmony import */ var _fluentui_react_lib_DetailsList__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fluentui/react/lib/DetailsList */ 74423);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fluentui/react */ 29425);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fluentui/react */ 5613);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fluentui/react */ 27006);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @fluentui/react */ 18681);
/* harmony import */ var _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./InventoryManagement.module.scss */ 99623);






const RequestList = (props) => {
    const [selectedRequestForDetails, setSelectedRequestForDetails] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
    const [isDetailsPanelOpen, setIsDetailsPanelOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const selectedRequestAvailableStock = selectedRequestForDetails
        ? (0,_utils_StockUtils__WEBPACK_IMPORTED_MODULE_2__.getAvailableStock)(props.inventoryItems, selectedRequestForDetails)
        : 0;
    const selectedRequestHasEnoughStock = selectedRequestForDetails
        ? selectedRequestAvailableStock >= Number(selectedRequestForDetails.quantity || 0)
        : false;
    const sortedItems = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
        return [...props.items].sort((a, b) => {
            const dateA = a.requestDate || '';
            const dateB = b.requestDate || '';
            if (dateA && dateB && dateA !== dateB) {
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            }
            const numA = parseInt((a.id || '0').replace(/\D/g, ''), 10);
            const numB = parseInt((b.id || '0').replace(/\D/g, ''), 10);
            if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
                return numB - numA;
            }
            return (b.id || '').localeCompare(a.id || '');
        });
    }, [props.items]);
    const columns = [
        {
            key: 'columnRequestKey',
            name: 'Request ID',
            fieldName: 'requestKey',
            minWidth: 90,
            maxWidth: 125,
            isResizable: true
        },
        {
            key: 'columnEmployeeName',
            name: 'Employee Name',
            fieldName: 'requesterName',
            minWidth: 100,
            maxWidth: 150,
            isResizable: true
        },
        {
            key: 'columnManagerName',
            name: "Manager's Name",
            fieldName: 'managerName',
            minWidth: 110,
            maxWidth: 140,
            isResizable: true,
            onRender: (item) => item.managerName || 'N/A'
        },
        {
            key: 'columnAssetType',
            name: 'Asset Type',
            fieldName: 'assetTitle',
            minWidth: 100,
            maxWidth: 120,
            isResizable: true
        },
        {
            key: 'columnPriority',
            name: 'Priority',
            fieldName: 'priority',
            minWidth: 80,
            maxWidth: 100,
            isResizable: true,
            onRender: (item) => {
                const priority = item.priority || 'Medium';
                let color = '#4b5563';
                let backgroundColor = '#f3f4f6';
                if (priority === 'High') {
                    color = '#b91c1c';
                    backgroundColor = '#fee2e2';
                }
                else if (priority === 'Low') {
                    color = '#1e3a8a';
                    backgroundColor = '#dbeafe';
                }
                return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                        backgroundColor,
                        color,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                    } }, priority));
            }
        },
        ...(props.hideStatusColumn
            ? []
            : [
                {
                    key: 'column6',
                    name: props.statusColumnLabel || 'Status',
                    fieldName: props.statusField || 'status',
                    minWidth: 80,
                    maxWidth: 100,
                    isResizable: true,
                    onRender: (item) => {
                        let val = item[props.statusField || 'status'] || 'Pending';
                        if (val === 'Pending') {
                            val = 'Pending';
                        }
                        let backgroundColor = '#fef3c7';
                        let textColor = '#92400e';
                        if (val === 'Approved') {
                            backgroundColor = '#dcfce7';
                            textColor = '#166534';
                        }
                        else if (val === 'Declined') {
                            backgroundColor = '#fee2e2';
                            textColor = '#991b1b';
                        }
                        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                backgroundColor,
                                color: textColor,
                                padding: '4px 12px',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                display: 'inline-block'
                            } }, val));
                    }
                }
            ]),
        {
            key: 'columnManagerComment',
            name: 'Manager Comment',
            fieldName: 'managerResponse',
            minWidth: 150,
            maxWidth: 220,
            isResizable: true,
            onRender: (item) => {
                if (!item.managerResponse) {
                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                            color: 'var(--text-muted)',
                            fontStyle: 'italic'
                        } }, "-"));
                }
                const isDeclined = item.status === 'Declined';
                return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                        color: isDeclined ? '#991b1b' : 'inherit',
                        fontWeight: isDeclined ? 600 : 400
                    } }, item.managerResponse));
            }
        },
        ...(props.canApproveAsset
            ? [
                {
                    key: 'columnAssetStatus',
                    name: 'Asset Status',
                    fieldName: 'assetStatus',
                    minWidth: 200,
                    maxWidth: 260,
                    isResizable: true,
                    onRender: (item) => {
                        const value = item.assetStatus || 'Pending';
                        const isApproved = value.toLowerCase().includes('approv');
                        const isBusy = props.actionInProgressId === item.id;
                        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                flexWrap: 'nowrap'
                            } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                    backgroundColor: isApproved
                                        ? '#dcfce7'
                                        : '#fef3c7',
                                    color: isApproved
                                        ? '#166534'
                                        : '#92400e',
                                    padding: '4px 10px',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    display: 'inline-block'
                                } }, value),
                            !isApproved && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.PrimaryButton, { text: "Review & Assign", onClick: () => {
                                    if (props.onSelectRequestForAssignment) {
                                        props.onSelectRequestForAssignment(item);
                                    }
                                    else if (props.onApproveAsset) {
                                        props
                                            .onApproveAsset(item)
                                            .catch(err => console.error(err));
                                    }
                                }, disabled: isBusy, styles: {
                                    root: {
                                        height: '24px',
                                        minHeight: '24px',
                                        padding: '0 8px',
                                        fontSize: '0.75rem',
                                        borderRadius: '4px',
                                        border: 'none'
                                    }
                                } }))));
                    }
                }
            ]
            : []),
        ...(props.showResponseColumns
            ? [
                {
                    key: 'columnAdminResponse',
                    name: 'Admin Response',
                    fieldName: 'assetStatus',
                    minWidth: 140,
                    maxWidth: 200,
                    isResizable: true,
                    onRender: (item) => {
                        const managerStatus = (item.status || '').toLowerCase();
                        if (managerStatus === 'pending') {
                            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                    color: '#92400e',
                                    fontStyle: 'italic'
                                } }, "Waiting on Manager"));
                        }
                        if (managerStatus === 'declined' ||
                            managerStatus === 'rejected') {
                            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                    color: '#991b1b',
                                    fontStyle: 'italic'
                                } }, "N/A (Rejected)"));
                        }
                        const isApproved = (item.assetStatus || '')
                            .toLowerCase()
                            .includes('approv');
                        return isApproved ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                color: '#166534',
                                fontWeight: 600
                            } }, "Asset Allocated")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                color: '#92400e',
                                fontWeight: 600
                            } }, "Pending Admin Approval"));
                    }
                }
            ]
            : []),
        ...(props.canApproveReject
            ? [
                {
                    key: 'column8',
                    name: 'Actions',
                    fieldName: 'actions',
                    minWidth: 280,
                    maxWidth: 320,
                    isResizable: true,
                    onRender: (item) => {
                        const isPending = (item.status || '').toLowerCase() === 'pending';
                        const isBusy = props.actionInProgressId === item.id;
                        const availableStock = (0,_utils_StockUtils__WEBPACK_IMPORTED_MODULE_2__.getAvailableStock)(props.inventoryItems, item);
                        const requestedQuantity = Number(item.quantity || 0);
                        const hasEnoughStock = availableStock >= requestedQuantity;
                        if (!isPending) {
                            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                    color: 'var(--text-muted)'
                                } }, "No action"));
                        }
                        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px'
                            } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                                    display: 'flex',
                                    gap: '8px'
                                } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.PrimaryButton, { text: "Approve", onClick: () => {
                                        if (!props.onApproveRequest) {
                                            return;
                                        }
                                        const approvalComment = window.prompt('Add a comment or note for this approval:');
                                        if (approvalComment === null) {
                                            return;
                                        }
                                        props
                                            .onApproveRequest(item, approvalComment.trim())
                                            .catch(err => console.error(err));
                                    }, disabled: isBusy || !hasEnoughStock }),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.PrimaryButton, { text: "Reject", onClick: () => {
                                        if (!props.onRejectRequest) {
                                            return;
                                        }
                                        const rejectionReason = window.prompt('Enter rejection reason for this request:');
                                        if (!rejectionReason ||
                                            !rejectionReason.trim()) {
                                            return;
                                        }
                                        props
                                            .onRejectRequest(item, rejectionReason.trim())
                                            .catch(err => console.error(err));
                                    }, disabled: isBusy, styles: {
                                        root: {
                                            backgroundColor: '#991b1b',
                                            borderColor: '#991b1b'
                                        },
                                        rootHovered: {
                                            backgroundColor: '#7f1d1d',
                                            borderColor: '#7f1d1d'
                                        }
                                    } })),
                            !hasEnoughStock && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                                    fontSize: '12px',
                                    color: '#d13438',
                                    lineHeight: '1.3'
                                } },
                                "Insufficient stock \u2014 Available:",
                                ' ',
                                availableStock,
                                ", Requested:",
                                ' ',
                                requestedQuantity))));
                    }
                }
            ]
            : []),
        {
            key: 'columnViewDetails',
            name: 'Details',
            minWidth: 70,
            maxWidth: 90,
            isResizable: true,
            onRender: (item) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.DefaultButton, { text: "View", onClick: () => {
                    setSelectedRequestForDetails(item);
                    setIsDetailsPanelOpen(true);
                }, styles: {
                    root: {
                        height: '24px',
                        minHeight: '24px',
                        padding: '0 8px',
                        fontSize: '0.75rem',
                        borderRadius: '4px'
                    }
                } }))
        }
    ];
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '10px' } },
        sortedItems.length === 0 ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: {
                fontStyle: 'italic',
                color: 'var(--text-muted)'
            } }, "No asset requests found.")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].tableWrapper },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_lib_DetailsList__WEBPACK_IMPORTED_MODULE_5__.DetailsList, { items: sortedItems, columns: columns, setKey: "set", layoutMode: _fluentui_react_lib_DetailsList__WEBPACK_IMPORTED_MODULE_6__.DetailsListLayoutMode.justified, selectionMode: _fluentui_react_lib_DetailsList__WEBPACK_IMPORTED_MODULE_7__.SelectionMode.none }))),
        selectedRequestForDetails && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.Panel, { isOpen: isDetailsPanelOpen, onDismiss: () => {
                setIsDetailsPanelOpen(false);
                setSelectedRequestForDetails(null);
            }, type: _fluentui_react__WEBPACK_IMPORTED_MODULE_9__.PanelType.medium, headerText: `Request Details: ${selectedRequestForDetails.requestKey ||
                'Asset Request'}`, closeButtonAriaLabel: "Close" },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                    marginTop: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    fontFamily: 'inherit'
                } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                        backgroundColor: 'var(--surface-bg, #ffffff)',
                        border: '1px solid rgba(128, 128, 128, 0.15)',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: 'var(--card-shadow)'
                    } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: {
                            margin: '0 0 16px 0',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: 'var(--text-main, #333333)',
                            borderBottom: '1px solid rgba(128, 128, 128, 0.1)',
                            paddingBottom: '10px'
                        } }, "Request Information"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].responsiveGridGap16, style: { fontSize: '0.85rem' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                    color: 'var(--text-muted, #666666)',
                                    display: 'block',
                                    marginBottom: '2px'
                                } }, "Request ID"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: {
                                    color: 'var(--text-main, #333333)'
                                } }, selectedRequestForDetails.requestKey ||
                                'N/A')),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                    color: 'var(--text-muted, #666666)',
                                    display: 'block',
                                    marginBottom: '2px'
                                } }, "Request Date"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: {
                                    color: 'var(--text-main, #333333)'
                                } }, selectedRequestForDetails.requestDate)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                    color: 'var(--text-muted, #666666)',
                                    display: 'block',
                                    marginBottom: '2px'
                                } }, "Requester"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: {
                                    color: 'var(--text-main, #333333)'
                                } }, selectedRequestForDetails.requesterName)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                    color: 'var(--text-muted, #666666)',
                                    display: 'block',
                                    marginBottom: '2px'
                                } }, "Employee ID"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: {
                                    color: 'var(--text-main, #333333)'
                                } }, selectedRequestForDetails.employeeId ||
                                '-')),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                    color: 'var(--text-muted, #666666)',
                                    display: 'block',
                                    marginBottom: '2px'
                                } }, "Manager's Name"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: {
                                    color: 'var(--text-main, #333333)'
                                } }, selectedRequestForDetails.managerName ||
                                '-')),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                    color: 'var(--text-muted, #666666)',
                                    display: 'block',
                                    marginBottom: '2px'
                                } }, "Asset Category"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: {
                                    color: 'var(--text-main, #333333)'
                                } }, selectedRequestForDetails.assetTitle)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                    color: 'var(--text-muted, #666666)',
                                    display: 'block',
                                    marginBottom: '2px'
                                } }, "Quantity"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: {
                                    color: 'var(--text-main, #333333)'
                                } }, selectedRequestForDetails.quantity)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                    color: 'var(--text-muted, #666666)',
                                    display: 'block',
                                    marginBottom: '2px'
                                } }, "Priority"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: {
                                    color: 'var(--text-main, #333333)'
                                } }, selectedRequestForDetails.priority ||
                                'Medium')))),
                selectedRequestForDetails.reason && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                        backgroundColor: 'var(--surface-bg, #ffffff)',
                        border: '1px solid rgba(128, 128, 128, 0.15)',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: 'var(--card-shadow)'
                    } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: 'var(--text-main, #333333)',
                            marginBottom: '8px'
                        } }, "Justification / Reason"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                            backgroundColor: 'rgba(128, 128, 128, 0.05)',
                            border: '1px solid rgba(128, 128, 128, 0.1)',
                            borderRadius: '6px',
                            padding: '12px',
                            fontSize: '0.85rem',
                            color: 'var(--text-main, #333333)',
                            lineHeight: 1.5
                        } }, selectedRequestForDetails.reason))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                        backgroundColor: 'var(--surface-bg, #ffffff)',
                        border: '1px solid rgba(128, 128, 128, 0.15)',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: 'var(--card-shadow)'
                    } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: 'var(--text-main, #333333)',
                            marginBottom: '8px'
                        } }, "Manager Approval"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center'
                        } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                backgroundColor: selectedRequestForDetails.status ===
                                    'Approved'
                                    ? '#dcfce7'
                                    : selectedRequestForDetails.status ===
                                        'Declined'
                                        ? '#fee2e2'
                                        : '#fef3c7',
                                color: selectedRequestForDetails.status ===
                                    'Approved'
                                    ? '#166534'
                                    : selectedRequestForDetails.status ===
                                        'Declined'
                                        ? '#991b1b'
                                        : '#92400e',
                                padding: '4px 10px',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: 600
                            } }, selectedRequestForDetails.status ||
                            'Pending'),
                        selectedRequestForDetails.managerResponse && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                fontSize: '0.85rem',
                                color: 'var(--text-muted, #666666)'
                            } },
                            "- \u201C",
                            selectedRequestForDetails.managerResponse,
                            "\u201D")))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                        backgroundColor: 'var(--surface-bg, #ffffff)',
                        border: '1px solid rgba(128, 128, 128, 0.15)',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: 'var(--card-shadow)'
                    } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: 'var(--text-main, #333333)',
                            marginBottom: '8px'
                        } }, "Admin Allocation"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                            fontSize: '0.85rem',
                            color: 'var(--text-main, #333333)'
                        } }, selectedRequestForDetails.status ===
                        'Approved' ? ((selectedRequestForDetails.assetStatus ||
                        '')
                        .toLowerCase()
                        .includes('approv') ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                            color: '#166534',
                            fontWeight: 600
                        } }, "Asset Allocated & Dispatched \u2713")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                            color: '#92400e',
                            fontWeight: 600
                        } }, "Pending physical asset allocation by system administrator"))) : selectedRequestForDetails.status ===
                        'Declined' ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                            color: '#991b1b'
                        } }, "Not applicable (Request was rejected by manager)")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                            color: 'var(--text-muted, #666666)',
                            fontStyle: 'italic'
                        } }, "Pending manager approval first")))),
                props.canApproveReject &&
                    (selectedRequestForDetails.status || '')
                        .toLowerCase() === 'pending' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        marginTop: '10px',
                        borderTop: '1px solid rgba(128, 128, 128, 0.15)',
                        paddingTop: '15px'
                    } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                            display: 'flex',
                            gap: '12px'
                        } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.PrimaryButton, { text: props.actionInProgressId ===
                                selectedRequestForDetails.id
                                ? 'Processing...'
                                : 'Approve', onClick: () => {
                                if (props.onApproveRequest) {
                                    props
                                        .onApproveRequest(selectedRequestForDetails)
                                        .then(() => {
                                        setIsDetailsPanelOpen(false);
                                        setSelectedRequestForDetails(null);
                                    })
                                        .catch(err => console.error(err));
                                }
                            }, disabled: props.actionInProgressId ===
                                selectedRequestForDetails.id ||
                                !selectedRequestHasEnoughStock }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.DefaultButton, { text: "Reject", onClick: () => {
                                if (!props.onRejectRequest) {
                                    return;
                                }
                                const rejectionReason = window.prompt('Enter rejection reason for this request:');
                                if (!rejectionReason ||
                                    !rejectionReason.trim()) {
                                    return;
                                }
                                props
                                    .onRejectRequest(selectedRequestForDetails, rejectionReason.trim())
                                    .then(() => {
                                    setIsDetailsPanelOpen(false);
                                    setSelectedRequestForDetails(null);
                                })
                                    .catch(err => console.error(err));
                            }, disabled: props.actionInProgressId ===
                                selectedRequestForDetails.id, styles: {
                                root: {
                                    color: '#dc2626',
                                    borderColor: '#dc2626'
                                },
                                rootHovered: {
                                    color: '#ffffff',
                                    backgroundColor: '#dc2626',
                                    borderColor: '#dc2626'
                                }
                            } })),
                    !selectedRequestHasEnoughStock && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                            fontSize: '12px',
                            color: '#d13438',
                            lineHeight: '1.3'
                        } },
                        "Insufficient stock \u2014 Available:",
                        ' ',
                        selectedRequestAvailableStock,
                        ", Requested:",
                        ' ',
                        selectedRequestForDetails.quantity)))),
                props.canApproveAsset &&
                    !(selectedRequestForDetails.assetStatus || '')
                        .toLowerCase()
                        .includes('approv') && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                        display: 'flex',
                        gap: '12px',
                        marginTop: '10px',
                        borderTop: '1px solid rgba(128, 128, 128, 0.15)',
                        paddingTop: '15px'
                    } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.PrimaryButton, { text: "Review & Assign", onClick: () => {
                            setIsDetailsPanelOpen(false);
                            setSelectedRequestForDetails(null);
                            if (props.onSelectRequestForAssignment) {
                                props.onSelectRequestForAssignment(selectedRequestForDetails);
                            }
                        }, iconProps: {
                            iconName: 'CompletedSolid'
                        } }))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '10px'
                    } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.DefaultButton, { text: "Close", onClick: () => {
                            setIsDetailsPanelOpen(false);
                            setSelectedRequestForDetails(null);
                        } })))))));
};


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("f4adc8ebb83c71d76073")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=inventory-management-web-part.42135a3c2d0788e95dfc.hot-update.js.map