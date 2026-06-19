"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const sp_1 = require("@pnp/sp");
require("@pnp/sp/webs");
require("@pnp/sp/lists");
require("@pnp/sp/items");
require("@pnp/sp/fields");
const logging_1 = require("@pnp/logging");
class InventoryService {
    constructor(spContext) {
        this.inventoryListName = 'InventoryList';
        this.mappingListName = 'Mapping List';
        this.requestListName = 'RequestList';
        this.incidentListName = 'Incident List';
        this.employeeListName = 'EmployeeList';
        if (!spContext) {
            throw new Error('SPFx context is required. Ensure the web part is loaded in SharePoint.');
        }
        this.sp = (0, sp_1.spfi)().using((0, sp_1.SPFx)(spContext)).using((0, logging_1.PnPLogging)(logging_1.LogLevel.Warning));
        console.log('InventoryService initialized with SharePoint context');
    }
    async getMappedPayload(listName, data, isIncident) {
        try {
            const fields = await this.sp.web.lists.getByTitle(listName).fields();
            const getInternalName = (displayNames) => {
                for (const name of displayNames) {
                    const field = fields.find(f => f.Title && f.Title.toLowerCase() === name.toLowerCase());
                    if (field)
                        return field.InternalName;
                }
                return null;
            };
            const payload = {};
            // The first column (usually Title) was renamed to Employe/Employee
            payload.Title = data.employeeName || 'Unknown';
            const empNameField = getInternalName(['Employe Name', 'Employee Name', 'EmployeeName', 'EmployeName']);
            if (empNameField) {
                payload[empNameField] = data.employeeName || 'Unknown';
            }
            const empIdField = getInternalName(['Employe ID', 'Employee ID', 'EmployeeId', 'EmployeID']);
            if (empIdField)
                payload[empIdField] = data.employeeId || 'N/A';
            const emailField = getInternalName(['Employee Email', 'Email', 'Email ID', 'EmailID', 'User Email', 'UserEmail']);
            if (emailField && emailField !== empIdField)
                payload[emailField] = data.employeeEmail || data.email || '';
            const assetTypeField = getInternalName(['Asset Type', 'AssetType', 'Asset Name', 'AssetName']);
            if (assetTypeField)
                payload[assetTypeField] = data.assetName || data.assetType || 'Other';
            const serialField = getInternalName(['Serial Number', 'SerialNumber', 'Serial No', 'SerialNo']);
            if (serialField)
                payload[serialField] = data.serialNo || '';
            const priorityField = getInternalName(['Priority']);
            if (priorityField)
                payload[priorityField] = data.priority || 'Medium';
            const dateField = getInternalName(['Raised Date', 'RaisedDate', 'Requested Date', 'RequestedDate', 'Reported Date', 'ReportedDate']);
            if (dateField) {
                payload[dateField] = data.raisedDate || data.requiredDate || data.reportedDate || new Date().toISOString();
            }
            const reasonField = getInternalName(['Description', 'Reason for Request', 'ReasonforRequest', 'Reason', 'Issue Description', 'IssueDescription']);
            if (reasonField)
                payload[reasonField] = data.description || data.reasonDescription || data.issueDescription || '';
            const statusField = getInternalName(['Status', 'Request Status', 'RequestStatus']);
            if (statusField)
                payload[statusField] = data.status || 'Pending';
            const incidentTypeField = getInternalName(['Incident Type', 'IncidentType']);
            if (incidentTypeField)
                payload[incidentTypeField] = data.incidentType || '';
            const raisedToField = getInternalName(['Raised To', 'RaisedTo']);
            if (raisedToField)
                payload[raisedToField] = data.raisedTo || '';
            return payload;
        }
        catch (error) {
            console.error("Could not map fields dynamically for list: " + listName, error);
            throw error;
        }
    }
    /**
     * Submit an asset request directly to SharePoint RequestList
     */
    getLocalItems(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }
    saveLocalItems(key, items) {
        localStorage.setItem(key, JSON.stringify(items));
    }
    getEmployeeNameFromEmail(email) {
        const parts = email.split('@')[0].split('.');
        return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    }
    filterByUser(items, userEmail) {
        if (!items || !userEmail)
            return [];
        const emailPrefix = userEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        const userEmailClean = userEmail.toLowerCase().trim();
        return items.filter(item => {
            const empNameClean = (item.employeeName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const empIdClean = (item.employeeId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const empEmailClean = (item.employeeEmail || item.email || '').toLowerCase().trim();
            const empIdRaw = (item.employeeId || '').toLowerCase().trim();
            return empNameClean.includes(emailPrefix) || emailPrefix.includes(empNameClean) ||
                empIdClean.includes(emailPrefix) || emailPrefix.includes(empIdClean) ||
                empEmailClean === userEmailClean || empIdRaw === userEmailClean;
        });
    }
    /**
     * Submit an asset request directly to SharePoint RequestList
     */
    async createAssetRequest(requestData) {
        try {
            const payload = await this.getMappedPayload(this.requestListName, { ...requestData, status: 'Pending' }, false);
            console.log(`[SharePoint Write] TARGET LIST: "${this.requestListName}"`);
            console.log('[SharePoint Write] PAYLOAD DATA:', JSON.stringify(payload, null, 2));
            const result = await this.sp.web.lists.getByTitle(this.requestListName).items.add(payload);
            console.log('[SharePoint Write] RESPONSE:', result);
            return result;
        }
        catch (error) {
            console.error('Failed to create asset request in SharePoint:', error);
            const isListMissing = error.message && (error.message.indexOf('404') > -1 || error.message.indexOf('does not exist') > -1 || error.message.indexOf('ArgumentException') > -1);
            if (isListMissing) {
                console.warn('SharePoint RequestList not found, saving to localStorage instead.');
                const localRequests = this.getLocalItems('spfx_mock_requests');
                const newRequest = {
                    id: `REQ-${Date.now()}`,
                    employeeName: requestData.employeeName || 'Unknown',
                    employeeId: requestData.employeeId || 'N/A',
                    serialNo: requestData.serialNo || '',
                    assetName: requestData.assetName || requestData.assetType || 'Other',
                    priority: requestData.priority || 'Medium',
                    reason: requestData.reasonDescription || requestData.description || '',
                    description: requestData.reasonDescription || requestData.description || '',
                    requestDate: new Date().toISOString(),
                    reportedDate: new Date().toISOString(),
                    raisedDate: new Date().toISOString(),
                    status: 'Pending',
                    raisedTo: requestData.raisedTo || ''
                };
                localRequests.push(newRequest);
                this.saveLocalItems('spfx_mock_requests', localRequests);
                return { data: newRequest };
            }
            const errorDetails = this.formatError(error);
            throw new Error(`SharePoint list submission failed. ${errorDetails}`);
        }
    }
    /**
     * Helper to map raw SharePoint item back to our interface
     */
    async getMappedItems(fields, items) {
        const getInternalName = (displayNames) => {
            for (const name of displayNames) {
                const field = fields.find(f => f.Title && f.Title.toLowerCase() === name.toLowerCase());
                if (field)
                    return field.InternalName;
            }
            return null;
        };
        const empIdField = getInternalName(['Employe ID', 'Employee ID', 'EmployeeId', 'EmployeID']);
        const emailField = getInternalName(['Employee Email', 'Email', 'Email ID', 'EmailID', 'User Email', 'UserEmail']);
        const assetTypeField = getInternalName(['Asset Type', 'AssetType', 'Asset Name', 'AssetName']);
        const serialField = getInternalName(['Serial Number', 'SerialNumber', 'Serial No', 'SerialNo']);
        const priorityField = getInternalName(['Priority']);
        const dateField = getInternalName(['Raised Date', 'RaisedDate', 'Requested Date', 'RequestedDate', 'Reported Date', 'ReportedDate']);
        const reasonField = getInternalName(['Description', 'Reason for Request', 'ReasonforRequest', 'Reason', 'Issue Description', 'IssueDescription']);
        const statusField = getInternalName(['Status', 'Request Status', 'RequestStatus']);
        const incidentTypeField = getInternalName(['Incident Type', 'IncidentType']);
        const raisedToField = getInternalName(['Raised To', 'RaisedTo']);
        const empNameField = getInternalName(['Employe Name', 'Employee Name', 'EmployeeName', 'EmployeName']);
        return items.map(item => ({
            id: item.Id ? item.Id.toString() : item.ID ? item.ID.toString() : Math.random().toString(),
            employeeName: empNameField && item[empNameField] ? item[empNameField] : (item.Title || 'Unknown'),
            employeeId: empIdField && item[empIdField] ? item[empIdField] : '',
            employeeEmail: emailField && item[emailField] ? item[emailField] : '',
            serialNo: serialField && item[serialField] ? item[serialField] : '',
            assetName: assetTypeField && item[assetTypeField] ? item[assetTypeField] : '',
            priority: priorityField && item[priorityField] ? item[priorityField] : 'Medium',
            reason: reasonField && item[reasonField] ? item[reasonField] : '',
            description: reasonField && item[reasonField] ? item[reasonField] : '',
            requestDate: dateField && item[dateField] ? item[dateField] : '',
            reportedDate: dateField && item[dateField] ? item[dateField] : '',
            raisedDate: dateField && item[dateField] ? item[dateField] : '',
            issueType: incidentTypeField && item[incidentTypeField] ? item[incidentTypeField] : 'Incident', // Fallback
            incidentType: incidentTypeField && item[incidentTypeField] ? item[incidentTypeField] : '',
            issueDescription: reasonField && item[reasonField] ? item[reasonField] : '',
            incidentId: `INC-${item.Id || item.ID || Math.floor(Math.random() * 1000)}`,
            status: statusField && item[statusField] ? item[statusField] : 'Pending',
            raisedTo: raisedToField && item[raisedToField] ? item[raisedToField] : ''
        }));
    }
    async getMappedAssignedAssets(fields, items) {
        const getInternalName = (displayNames) => {
            for (const name of displayNames) {
                const field = fields.find(f => f.Title && f.Title.toLowerCase() === name.toLowerCase());
                if (field)
                    return field.InternalName;
            }
            return null;
        };
        const empIdField = getInternalName(['Employe ID', 'Employee ID', 'EmployeeId', 'EmployeID']);
        const emailField = getInternalName(['Employee Email', 'Email', 'Email ID', 'EmailID', 'User Email', 'UserEmail']);
        const assetTypeField = getInternalName(['Asset Type', 'AssetType', 'Asset Name', 'AssetName']);
        const serialField = getInternalName(['Serial Number', 'SerialNumber', 'Serial No', 'SerialNo']);
        const dateField = getInternalName(['Assigned Date', 'AssignedDate', 'Requested Date', 'RequestedDate']);
        const statusField = getInternalName(['Status', 'Assignment Status', 'AssignmentStatus']);
        const empNameField = getInternalName(['Employe Name', 'Employee Name', 'EmployeeName', 'EmployeName']);
        return items.map(item => ({
            id: item.Id ? item.Id.toString() : item.ID ? item.ID.toString() : Math.random().toString(),
            employeeName: empNameField && item[empNameField] ? item[empNameField] : (item.Title || 'Unknown'),
            employeeId: empIdField && item[empIdField] ? item[empIdField] : '',
            employeeEmail: emailField && item[emailField] ? item[emailField] : '',
            assetType: assetTypeField && item[assetTypeField] ? item[assetTypeField] : 'Device',
            assetName: assetTypeField && item[assetTypeField] ? item[assetTypeField] : 'Device',
            serialNumber: serialField && item[serialField] ? item[serialField] : '',
            assignmentDate: dateField && item[dateField] ? item[dateField] : item.Created || new Date().toISOString(),
            status: statusField && item[statusField] ? item[statusField] : 'Assigned',
            condition: 'Good',
            location: 'HQ Office'
        }));
    }
    /**
     * Get all asset requests for the current user from RequestList
     */
    async getEmployeeAssetRequests(userEmail) {
        try {
            console.log(`[SharePoint RequestList Read] Fetching asset requests for user: ${userEmail}`);
            const fields = await this.sp.web.lists.getByTitle(this.requestListName).fields();
            const items = await this.sp.web.lists.getByTitle(this.requestListName).items();
            const mappedItems = await this.getMappedItems(fields, items);
            const filtered = this.filterByUser(mappedItems, userEmail);
            const localRequests = this.getLocalItems('spfx_mock_requests');
            const filteredLocal = this.filterByUser(localRequests, userEmail);
            console.log(`[SharePoint RequestList Read] Found ${filtered.length + filteredLocal.length} requests`);
            return [...filtered, ...filteredLocal];
        }
        catch (error) {
            console.warn('Failed to fetch employee asset requests from SharePoint, returning localStorage fallback:', error.message);
            const localRequests = this.getLocalItems('spfx_mock_requests');
            return this.filterByUser(localRequests, userEmail);
        }
    }
    /**
     * Cancel an asset request
     */
    async cancelAssetRequest(requestId) {
        try {
            console.log('Cancelling asset request:', requestId);
            await this.sp.web.lists
                .getByTitle(this.requestListName)
                .items.getById(parseInt(requestId))
                .update({ Status: 'Cancelled' });
            console.log('Asset request cancelled successfully');
        }
        catch (error) {
            console.error('Failed to cancel asset request:', error);
            const isListMissing = error.message && (error.message.indexOf('404') > -1 || error.message.indexOf('does not exist') > -1 || error.message.indexOf('ArgumentException') > -1 || isNaN(parseInt(requestId)));
            if (isListMissing || error.message.includes('getById')) {
                console.warn('SharePoint RequestList not found or request ID is mock, updating localStorage instead.');
                const localRequests = this.getLocalItems('spfx_mock_requests');
                const updated = localRequests.map(req => {
                    if (req.id === requestId) {
                        return { ...req, status: 'Cancelled' };
                    }
                    return req;
                });
                this.saveLocalItems('spfx_mock_requests', updated);
                return;
            }
            throw new Error(`Failed to cancel request. ${this.formatError(error)}`);
        }
    }
    /**
     * Format error messages to provide actionable feedback
     */
    formatError(error) {
        if (!error)
            return 'Unknown error';
        if (error.statusCode === 404) {
            return `SharePoint list not found. Ensure lists exist with correct titles.`;
        }
        if (error.statusCode === 403) {
            return `Access denied. Verify you have appropriate permissions.`;
        }
        if (error.message && typeof error.message === 'string') {
            if (error.message.includes('Failed to fetch')) {
                return 'Failed to fetch. If you are testing locally, ensure you are using the Hosted Workbench and NOT localhost.';
            }
            return error.message;
        }
        return JSON.stringify(error);
    }
    /**
     * Get employee incident history from SharePoint IncidentList
     */
    async getEmployeeIncidentHistory(userEmail) {
        try {
            console.log(`[SharePoint IncidentList Read] Fetching incident history for: ${userEmail}`);
            const fields = await this.sp.web.lists.getByTitle(this.incidentListName).fields();
            const items = await this.sp.web.lists.getByTitle(this.incidentListName).items();
            const mappedItems = await this.getMappedItems(fields, items);
            const filtered = this.filterByUser(mappedItems, userEmail);
            const localIncidents = this.getLocalItems('spfx_mock_incidents');
            const filteredLocal = this.filterByUser(localIncidents, userEmail);
            console.log(`[SharePoint IncidentList Read] Found ${filtered.length + filteredLocal.length} incidents`);
            return [...filtered, ...filteredLocal];
        }
        catch (error) {
            console.warn('Failed to fetch incident history from SharePoint, returning localStorage fallback:', error.message);
            let localIncidents = this.getLocalItems('spfx_mock_incidents');
            if (localIncidents.length === 0) {
                localIncidents = [
                    {
                        id: 'INC-101',
                        incidentId: 'INC-782',
                        employeeName: this.getEmployeeNameFromEmail(userEmail),
                        employeeId: userEmail,
                        serialNo: 'XYZ890123',
                        assetName: 'Dell Latitude Laptop',
                        priority: 'High',
                        reason: 'Screen flickers when connected to external monitor.',
                        description: 'Screen flickers when connected to external monitor.',
                        issueDescription: 'Screen flickers when connected to external monitor.',
                        reportedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                        raisedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                        incidentType: 'Hardware',
                        status: 'Resolved',
                        raisedTo: 'Admin'
                    }
                ];
                this.saveLocalItems('spfx_mock_incidents', localIncidents);
            }
            return this.filterByUser(localIncidents, userEmail);
        }
    }
    /**
     * Get assigned assets for the employee from SharePoint MappingList
     */
    async getEmployeeAssignedAssets(userEmail) {
        try {
            console.log(`[SharePoint MappingList Read] Fetching assigned assets for: ${userEmail}`);
            const fields = await this.sp.web.lists.getByTitle(this.mappingListName).fields();
            const items = await this.sp.web.lists.getByTitle(this.mappingListName).items();
            const mapped = await this.getMappedAssignedAssets(fields, items);
            const filtered = this.filterByUser(mapped, userEmail);
            const localAssets = this.getLocalItems('spfx_mock_assets');
            const filteredLocal = this.filterByUser(localAssets, userEmail);
            console.log(`[SharePoint MappingList Read] Found ${filtered.length + filteredLocal.length} assigned assets`);
            return [...filtered, ...filteredLocal];
        }
        catch (error) {
            console.warn('Failed to fetch assigned assets from SharePoint, returning localStorage fallback:', error.message);
            let localAssets = this.getLocalItems('spfx_mock_assets');
            if (localAssets.length === 0) {
                localAssets = [
                    {
                        id: 'MAP-101',
                        employeeName: this.getEmployeeNameFromEmail(userEmail),
                        employeeId: userEmail,
                        assetType: 'Laptop',
                        assetName: 'Dell Latitude 5420',
                        serialNumber: 'DL5420-9831',
                        assignmentDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                        status: 'Assigned',
                        condition: 'Excellent',
                        location: 'Remote Work'
                    },
                    {
                        id: 'MAP-102',
                        employeeName: this.getEmployeeNameFromEmail(userEmail),
                        employeeId: userEmail,
                        assetType: 'Headset',
                        assetName: 'Jabra Evolve 65',
                        serialNumber: 'JB65-3819',
                        assignmentDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                        status: 'Assigned',
                        condition: 'Good',
                        location: 'Remote Work'
                    }
                ];
                this.saveLocalItems('spfx_mock_assets', localAssets);
            }
            return this.filterByUser(localAssets, userEmail);
        }
    }
    /**
     * Get dashboard statistics from SharePoint lists
     */
    async getDashboardStats(userEmail) {
        try {
            console.log(`[SharePoint Dashboard Stats] Aggregating dashboard stats for: ${userEmail}`);
            const userRequests = await this.getEmployeeAssetRequests(userEmail);
            const userAssets = await this.getEmployeeAssignedAssets(userEmail);
            const userIncidents = await this.getEmployeeIncidentHistory(userEmail);
            const pending = userRequests.filter(r => r.status === 'Pending').length;
            const approved = userRequests.filter(r => r.status === 'Approved').length;
            const resolved = userIncidents.filter(i => i.status === 'Resolved').length;
            const open = userIncidents.filter(i => i.status === 'Open' || i.status === 'In Progress').length;
            return {
                totalRequests: userRequests.length,
                pendingRequests: pending,
                approvedRequests: approved,
                assignedAssets: userAssets.length,
                recentIncidents: userIncidents.length,
                resolvedIncidents: resolved,
                openIncidents: open
            };
        }
        catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
            return {
                totalRequests: 0,
                pendingRequests: 0,
                approvedRequests: 0,
                assignedAssets: 0,
                recentIncidents: 0,
                resolvedIncidents: 0,
                openIncidents: 0
            };
        }
    }
    /**
     * Create an incident request in SharePoint IncidentList
     */
    async createIncidentRequest(incidentData, file) {
        try {
            const payload = await this.getMappedPayload(this.incidentListName, { ...incidentData, status: 'Open' }, true);
            console.log(`[SharePoint Write] TARGET LIST: "${this.incidentListName}"`);
            console.log('[SharePoint Write] PAYLOAD DATA:', JSON.stringify(payload, null, 2));
            const result = await this.sp.web.lists.getByTitle(this.incidentListName).items.add(payload);
            console.log('[SharePoint Write] RESPONSE:', result);
            return result;
        }
        catch (error) {
            console.error('Failed to create incident request in SharePoint:', error);
            const isListMissing = error.message && (error.message.indexOf('404') > -1 || error.message.indexOf('does not exist') > -1 || error.message.indexOf('ArgumentException') > -1);
            if (isListMissing) {
                console.warn('SharePoint IncidentList not found, saving to localStorage instead.');
                const localIncidents = this.getLocalItems('spfx_mock_incidents');
                const newIncident = {
                    id: `INC-${Date.now()}`,
                    incidentId: `INC-${Math.floor(100 + Math.random() * 900)}`,
                    employeeName: incidentData.employeeName || 'Unknown',
                    employeeId: incidentData.employeeId || 'N/A',
                    serialNo: incidentData.serialNo || '',
                    assetName: incidentData.assetName || incidentData.assetType || 'Device',
                    priority: incidentData.priority || 'Medium',
                    reason: incidentData.description || incidentData.issueDescription || '',
                    description: incidentData.description || incidentData.issueDescription || '',
                    issueDescription: incidentData.description || incidentData.issueDescription || '',
                    requestDate: new Date().toISOString(),
                    reportedDate: new Date().toISOString(),
                    raisedDate: new Date().toISOString(),
                    incidentType: incidentData.incidentType || 'Other',
                    status: 'Open',
                    raisedTo: incidentData.raisedTo || 'Admin'
                };
                localIncidents.push(newIncident);
                this.saveLocalItems('spfx_mock_incidents', localIncidents);
                return { data: newIncident };
            }
            const errorDetails = this.formatError(error);
            throw new Error(`SharePoint list submission failed. ${errorDetails}`);
        }
    }
    /**
     * Get all pending asset requests (Admin view)
     */
    async getPendingRequests() {
        try {
            console.log(`[SharePoint Read] Fetching pending requests from list: "${this.requestListName}"`);
            const fields = await this.sp.web.lists.getByTitle(this.requestListName).fields();
            const items = await this.sp.web.lists.getByTitle(this.requestListName).items();
            const mapped = await this.getMappedItems(fields, items);
            const pending = mapped.filter(r => r.status === 'Pending');
            const localRequests = this.getLocalItems('spfx_mock_requests');
            const localPending = localRequests.filter(r => r.status === 'Pending');
            console.log(`[SharePoint Read] Found ${pending.length + localPending.length} pending requests`);
            return [...pending, ...localPending];
        }
        catch (error) {
            console.warn('Failed to fetch pending requests from SharePoint, returning localStorage fallback:', error.message);
            const localRequests = this.getLocalItems('spfx_mock_requests');
            return localRequests.filter(r => r.status === 'Pending');
        }
    }
    /**
     * Approve a request and link asset in MappingList
     */
    async approveRequest(requestId, adminName) {
        try {
            console.log(`[Approval Processing] STARTING approval for Request ID: ${requestId} by Admin: ${adminName}`);
            const reqIdInt = parseInt(requestId);
            if (isNaN(reqIdInt)) {
                throw new Error('Mock/local ID detected, skipping SharePoint execution.');
            }
            const requestItem = await this.sp.web.lists.getByTitle(this.requestListName).items.getById(reqIdInt)();
            const fields = await this.sp.web.lists.getByTitle(this.requestListName).fields();
            const mappedRequest = (await this.getMappedItems(fields, [requestItem]))[0];
            console.log('[Approval Processing] MAPPED REQUEST DETAILS FOR APPROVAL:', JSON.stringify(mappedRequest, null, 2));
            // 1. Update status in RequestList to Approved
            console.log(`[SharePoint Write] TARGET LIST: "${this.requestListName}" (Update Request ID: ${requestId})`);
            const requestFields = await this.sp.web.lists.getByTitle(this.requestListName).fields();
            const getReqInternalName = (displayNames) => {
                for (const name of displayNames) {
                    const field = requestFields.find(f => f.Title && f.Title.toLowerCase() === name.toLowerCase());
                    if (field)
                        return field.InternalName;
                }
                return null;
            };
            const statusField = getReqInternalName(['Status', 'Request Status', 'RequestStatus']);
            const updatePayload = {};
            if (statusField) {
                updatePayload[statusField] = 'Approved';
            }
            else {
                updatePayload.Status = 'Approved';
            }
            await this.sp.web.lists.getByTitle(this.requestListName).items.getById(reqIdInt).update(updatePayload);
            console.log(`[SharePoint Write] Request status successfully updated to "Approved"`);
            // 2. Create Mapping entry in MappingList
            console.log(`[SharePoint Write] TARGET LIST: "${this.mappingListName}" (Creating assignment mapping)`);
            const mappingFields = await this.sp.web.lists.getByTitle(this.mappingListName).fields();
            const getMapInternalName = (displayNames) => {
                for (const name of displayNames) {
                    const field = mappingFields.find(f => f.Title && f.Title.toLowerCase() === name.toLowerCase());
                    if (field)
                        return field.InternalName;
                }
                return null;
            };
            const mappingPayload = {};
            mappingPayload.Title = mappedRequest.employeeName; // Employee Name
            const empNameField = getMapInternalName(['Employe Name', 'Employee Name', 'EmployeeName', 'EmployeName']);
            if (empNameField) {
                mappingPayload[empNameField] = mappedRequest.employeeName || 'Unknown';
            }
            const empIdField = getMapInternalName(['Employe ID', 'Employee ID', 'EmployeeId', 'EmployeID']);
            if (empIdField)
                mappingPayload[empIdField] = mappedRequest.employeeId || 'N/A';
            const assetTypeField = getMapInternalName(['Asset Type', 'AssetType', 'Asset Name', 'AssetName']);
            if (assetTypeField)
                mappingPayload[assetTypeField] = mappedRequest.assetName || 'Other';
            const serialField = getMapInternalName(['Serial Number', 'SerialNumber', 'Serial No', 'SerialNo']);
            if (serialField)
                mappingPayload[serialField] = mappedRequest.serialNo || '';
            const dateField = getMapInternalName(['Assigned Date', 'AssignedDate', 'Requested Date', 'RequestedDate']);
            if (dateField)
                mappingPayload[dateField] = new Date().toISOString();
            const mappingResult = await this.sp.web.lists.getByTitle(this.mappingListName).items.add(mappingPayload);
            console.log('[SharePoint Write] Mapping created successfully:', mappingResult);
            console.log('[Approval Processing] APPROVAL COMPLETED');
            return mappingResult;
        }
        catch (error) {
            console.warn('[Approval Processing] Failed to approve request on SharePoint, attempting localStorage fallback:', error.message);
            const localRequests = this.getLocalItems('spfx_mock_requests');
            let approvedRequest = null;
            const updatedRequests = localRequests.map(req => {
                if (req.id === requestId) {
                    approvedRequest = { ...req, status: 'Approved' };
                    return approvedRequest;
                }
                return req;
            });
            if (approvedRequest) {
                this.saveLocalItems('spfx_mock_requests', updatedRequests);
                const localAssets = this.getLocalItems('spfx_mock_assets');
                const newAsset = {
                    id: `MAP-${Date.now()}`,
                    employeeName: approvedRequest.employeeName,
                    employeeId: approvedRequest.employeeId,
                    assetType: approvedRequest.assetName || 'Device',
                    assetName: approvedRequest.assetName || 'Device',
                    serialNumber: approvedRequest.serialNo || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
                    assignmentDate: new Date().toISOString(),
                    status: 'Assigned',
                    condition: 'Excellent',
                    location: 'HQ Office'
                };
                localAssets.push(newAsset);
                this.saveLocalItems('spfx_mock_assets', localAssets);
                console.log('[Local Fallback] Request approved and asset assigned locally.');
                return { success: true };
            }
            throw new Error(`Failed to approve request. ${this.formatError(error)}`);
        }
    }
    /**
     * Reject a request
     */
    async rejectRequest(requestId) {
        try {
            console.log(`[Approval Processing] Rejecting Request ID: ${requestId}`);
            const reqIdInt = parseInt(requestId);
            if (isNaN(reqIdInt)) {
                throw new Error('Mock/local ID detected, skipping SharePoint execution.');
            }
            const requestFields = await this.sp.web.lists.getByTitle(this.requestListName).fields();
            const getReqInternalName = (displayNames) => {
                for (const name of displayNames) {
                    const field = requestFields.find(f => f.Title && f.Title.toLowerCase() === name.toLowerCase());
                    if (field)
                        return field.InternalName;
                }
                return null;
            };
            const statusField = getReqInternalName(['Status', 'Request Status', 'RequestStatus']);
            const updatePayload = {};
            if (statusField) {
                updatePayload[statusField] = 'Rejected';
            }
            else {
                updatePayload.Status = 'Rejected';
            }
            await this.sp.web.lists.getByTitle(this.requestListName).items.getById(reqIdInt).update(updatePayload);
            console.log(`[SharePoint Write] Request status updated to "Rejected"`);
            return { success: true };
        }
        catch (error) {
            console.warn('[Approval Processing] Failed to reject request on SharePoint, attempting localStorage fallback:', error.message);
            const localRequests = this.getLocalItems('spfx_mock_requests');
            let rejected = false;
            const updatedRequests = localRequests.map(req => {
                if (req.id === requestId) {
                    rejected = true;
                    return { ...req, status: 'Rejected' };
                }
                return req;
            });
            if (rejected) {
                this.saveLocalItems('spfx_mock_requests', updatedRequests);
                console.log('[Local Fallback] Request rejected locally.');
                return { success: true };
            }
            throw new Error(`Failed to reject request. ${this.formatError(error)}`);
        }
    }
    /**
     * Search for employee details by employee name in SharePoint EmployeeList,
     * falling back to mock employees.
     */
    async getEmployeeDetailsByName(employeeName) {
        const mockEmployees = [
            { employeeId: 'AdeleV@3bh3kf.onmicrosoft.com', employeeName: 'Adele Vance', department: 'Operations', email: 'AdeleV@3bh3kf.onmicrosoft.com' },
            { employeeId: 'AlexW@3bh3kf.onmicrosoft.com', employeeName: 'Alex Wilber', department: 'Marketing', email: 'AlexW@3bh3kf.onmicrosoft.com' },
            { employeeId: 'Akhila.Dodla@3bh3kf.onmicrosoft.com', employeeName: 'Akhila Dodla', department: 'Operations', email: 'Akhila.Dodla@3bh3kf.onmicrosoft.com' },
            { employeeId: 'Swati.j@3bhkf.onmicrosoft.com', employeeName: 'Swati J', department: 'Information Technology', email: 'Swati.j@3bhkf.onmicrosoft.com' },
            { employeeId: 'Swati.j@3bh3kf.onmicrosoft.com', employeeName: 'Swati J', department: 'Information Technology', email: 'Swati.j@3bh3kf.onmicrosoft.com' },
            { employeeId: 'Kiran.Reddy@3bhkf.ommicrosoft.com', employeeName: 'Kiran Reddy', department: 'Operations', email: 'Kiran.Reddy@3bhkf.ommicrosoft.com' },
            { employeeId: 'Kiran.Reddy@3bhkf.onmicrosoft.com', employeeName: 'Kiran Reddy', department: 'Operations', email: 'Kiran.Reddy@3bhkf.onmicrosoft.com' },
            { employeeId: 'EMP001', employeeName: 'John Doe', department: 'Human Resources', email: 'john.doe@company.com' },
            { employeeId: 'EMP002', employeeName: 'Jane Smith', department: 'Information Technology', email: 'jane.smith@company.com' },
            { employeeId: 'EMP003', employeeName: 'Robert Johnson', department: 'Finance', email: 'robert.johnson@company.com' }
        ];
        try {
            console.log(`[SharePoint EmployeeList Read] Looking up employee by name: ${employeeName}`);
            const fields = await this.sp.web.lists.getByTitle(this.employeeListName).fields();
            const items = await this.sp.web.lists.getByTitle(this.employeeListName).items();
            const getInternalName = (displayNames) => {
                for (const name of displayNames) {
                    const field = fields.find(f => f.Title && f.Title.toLowerCase() === name.toLowerCase());
                    if (field)
                        return field.InternalName;
                }
                return null;
            };
            const empIdField = getInternalName(['Employee ID', 'EmployeeID', 'EmployeeId', 'Title']);
            const emailField = getInternalName(['Email', 'EmployeeEmail', 'UserEmail']);
            const deptField = getInternalName(['Department', 'Dept']);
            const nameField = getInternalName(['Employee Name', 'EmployeeName', 'Name', 'Title']);
            // Find the employee with matching Name
            const employee = items.find(item => {
                const nameVal = nameField ? item[nameField] : null;
                return nameVal && nameVal.toString().trim().toLowerCase() === employeeName.trim().toLowerCase();
            });
            if (employee) {
                const result = {
                    employeeId: empIdField ? employee[empIdField] : employeeName,
                    employeeName: nameField && nameField !== empIdField ? employee[nameField] : (employee.Title || employeeName),
                    email: emailField ? employee[emailField] : (employee.Email || `${employeeName}@company.com`),
                    department: deptField ? employee[deptField] : 'General',
                };
                console.log('[SharePoint EmployeeList Read] Employee found by name:', result);
                return result;
            }
        }
        catch (error) {
            console.warn('SharePoint name lookup failed, attempting mock fallback:', error.message);
        }
        const mockUser = mockEmployees.find(emp => emp.employeeName.toLowerCase() === employeeName.trim().toLowerCase());
        if (mockUser) {
            console.log('[Mock Fallback] Employee found by name:', mockUser);
            return {
                employeeId: mockUser.employeeId,
                employeeName: mockUser.employeeName,
                email: mockUser.email,
                department: mockUser.department
            };
        }
        // Default fallback if not found in list or mock
        const defaultDetails = {
            employeeId: employeeName,
            employeeName: employeeName,
            email: `${employeeName.toLowerCase().replace(/\s+/g, '.')}@company.com`,
            department: 'General'
        };
        console.log('[Default Fallback] Using typed name directly:', defaultDetails);
        return defaultDetails;
    }
    /**
     * Validate employee credentials against EmployeeList in SharePoint.
     * Falls back to mock employees if the list does not exist in SharePoint yet.
     */
    async validateEmployee(employeeId, password) {
        const mockEmployees = [
            { employeeId: 'AdeleV@3bh3kf.onmicrosoft.com', password: 'W&Im{Q9Y4wki_uS', employeeName: 'Adele Vance', department: 'Operations', email: 'AdeleV@3bh3kf.onmicrosoft.com' },
            { employeeId: 'AlexW@3bh3kf.onmicrosoft.com', password: 'W&Im{Q9Y4wki_uS', employeeName: 'Alex Wilber', department: 'Marketing', email: 'AlexW@3bh3kf.onmicrosoft.com' },
            { employeeId: 'Akhila.Dodla@3bh3kf.onmicrosoft.com', password: 'W&Im{Q9Y4wki_uS', employeeName: 'Akhila Dodla', department: 'Operations', email: 'Akhila.Dodla@3bh3kf.onmicrosoft.com' },
            { employeeId: 'Swati.j@3bhkf.onmicrosoft.com', password: 'W&Im{Q9Y4wki_uS', employeeName: 'Swati J', department: 'Information Technology', email: 'Swati.j@3bhkf.onmicrosoft.com' },
            { employeeId: 'Swati.j@3bh3kf.onmicrosoft.com', password: 'W&Im{Q9Y4wki_uS', employeeName: 'Swati J', department: 'Information Technology', email: 'Swati.j@3bh3kf.onmicrosoft.com' },
            { employeeId: 'Kiran.Reddy@3bhkf.ommicrosoft.com', password: 'W&Im{Q9Y4wki_uS', employeeName: 'Kiran Reddy', department: 'Operations', email: 'Kiran.Reddy@3bhkf.ommicrosoft.com' },
            { employeeId: 'Kiran.Reddy@3bhkf.onmicrosoft.com', password: 'W&Im{Q9Y4wki_uS', employeeName: 'Kiran Reddy', department: 'Operations', email: 'Kiran.Reddy@3bhkf.onmicrosoft.com' },
            { employeeId: 'EMP001', password: 'password123', employeeName: 'John Doe', department: 'Human Resources', email: 'john.doe@company.com' },
            { employeeId: 'EMP002', password: 'password123', employeeName: 'Jane Smith', department: 'Information Technology', email: 'jane.smith@company.com' },
            { employeeId: 'EMP003', password: 'password123', employeeName: 'Robert Johnson', department: 'Finance', email: 'robert.johnson@company.com' }
        ];
        try {
            console.log(`[SharePoint EmployeeList Read] Validating Employee ID: ${employeeId}`);
            const fields = await this.sp.web.lists.getByTitle(this.employeeListName).fields();
            const items = await this.sp.web.lists.getByTitle(this.employeeListName).items();
            const getInternalName = (displayNames) => {
                for (const name of displayNames) {
                    const field = fields.find(f => f.Title && f.Title.toLowerCase() === name.toLowerCase());
                    if (field)
                        return field.InternalName;
                }
                return null;
            };
            const empIdField = getInternalName(['Employee ID', 'EmployeeID', 'EmployeeId', 'Title']);
            const passwordField = getInternalName(['Password', 'PasswordHash', 'PIN']);
            const emailField = getInternalName(['Email', 'EmployeeEmail', 'UserEmail']);
            const deptField = getInternalName(['Department', 'Dept']);
            const nameField = getInternalName(['Employee Name', 'EmployeeName', 'Name', 'Title']);
            // Find the employee with matching ID
            const employee = items.find(item => {
                const idVal = empIdField ? item[empIdField] : null;
                return idVal && idVal.toString().trim().toLowerCase() === employeeId.trim().toLowerCase();
            });
            if (!employee) {
                throw new Error(`Employee ID "${employeeId}" not found in SharePoint list.`);
            }
            // Validate password
            const storedPassword = passwordField ? employee[passwordField] : null;
            if (!storedPassword || storedPassword.toString().trim() !== password.trim()) {
                throw new Error('Invalid password.');
            }
            const result = {
                employeeId: empIdField ? employee[empIdField] : employeeId,
                employeeName: nameField && nameField !== empIdField ? employee[nameField] : (employee.Title || 'Unknown Employee'),
                email: emailField ? employee[emailField] : (employee.Email || `${employeeId}@company.com`),
                department: deptField ? employee[deptField] : 'General',
            };
            console.log('[SharePoint EmployeeList Read] Validation successful:', result);
            return result;
        }
        catch (error) {
            console.warn('SharePoint verification failed, attempting mock fallback:', error.message);
            const mockUser = mockEmployees.find(emp => emp.employeeId.toLowerCase() === employeeId.trim().toLowerCase());
            if (mockUser) {
                if (mockUser.password === password) {
                    console.log('[Mock Fallback] Validation successful for', mockUser.employeeName);
                    return {
                        employeeId: mockUser.employeeId,
                        employeeName: mockUser.employeeName,
                        email: mockUser.email,
                        department: mockUser.department
                    };
                }
                else {
                    throw new Error('Invalid password.');
                }
            }
            // If the list did not exist (404), throw a clean user-friendly authentication error instead of the raw HttpClient error.
            if (error.message && (error.message.indexOf('404') > -1 || error.message.indexOf('does not exist') > -1)) {
                throw new Error(`Authentication failed: Employee ID "${employeeId}" is not registered. Please use mock credentials (e.g., EMP001 / password123).`);
            }
            throw new Error(error.message || `Authentication failed: Employee ID "${employeeId}" not found.`);
        }
    }
}
exports.InventoryService = InventoryService;
/**
 * Create an incident request in SharePoint IncidentList
 */
/**
 * Get all pending asset requests (Admin view)
 */
//# sourceMappingURL=InventoryService.js.map