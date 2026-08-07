"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentService = void 0;
const sp_1 = require("@pnp/sp");
require("@pnp/sp/webs");
require("@pnp/sp/lists");
require("@pnp/sp/items");
require("@pnp/sp/fields");
const logging_1 = require("@pnp/logging");
const mockData_1 = require("../data/mockData");
const InventoryService_1 = require("./InventoryService");
class IncidentService {
    constructor(spContext) {
        this.incidentListName = 'Incident List';
        this.employeeListName = 'EmployeeList';
        this.mappingListName = 'Mapping List';
        if (!spContext) {
            throw new Error('SPFx context is required. Ensure the web part is loaded in SharePoint.');
        }
        this.sp = (0, sp_1.spfi)().using((0, sp_1.SPFx)(spContext)).using((0, logging_1.PnPLogging)(logging_1.LogLevel.Warning));
        console.log('IncidentService initialized with SharePoint context');
    }
    async getMappedPayload(listName, data) {
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
            issueType: incidentTypeField && item[incidentTypeField] ? item[incidentTypeField] : 'Incident',
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
    async getEmployeeIncidentHistory(userEmail, isAdmin) {
        try {
            console.log(`[SharePoint IncidentList Read] Fetching incident history for: ${userEmail}, isAdmin: ${isAdmin}`);
            const fields = await this.sp.web.lists.getByTitle(this.incidentListName).fields();
            const items = await this.sp.web.lists.getByTitle(this.incidentListName).items();
            const mappedItems = await this.getMappedItems(fields, items);
            const filtered = isAdmin ? mappedItems : this.filterByUser(mappedItems, userEmail);
            const localIncidents = this.getLocalItems('spfx_mock_incidents');
            const filteredLocal = isAdmin ? localIncidents : this.filterByUser(localIncidents, userEmail);
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
            return isAdmin ? localIncidents : this.filterByUser(localIncidents, userEmail);
        }
    }
    async updateIncidentStatus(id, status, resolution) {
        try {
            console.log(`[IncidentService] Updating status of incident ${id} to: ${status}`);
            const isLocal = id.startsWith('INC-') || isNaN(Number(id));
            if (isLocal) {
                const localIncidents = this.getLocalItems('spfx_mock_incidents');
                const updated = localIncidents.map(inc => {
                    if (inc.id === id || inc.incidentId === id) {
                        return {
                            ...inc,
                            status,
                            resolution: resolution || inc.resolution,
                            resolvedDate: status === 'Resolved' || status === 'Closed' ? new Date().toISOString() : inc.resolvedDate
                        };
                    }
                    return inc;
                });
                this.saveLocalItems('spfx_mock_incidents', updated);
                return { success: true };
            }
            else {
                const list = this.sp.web.lists.getByTitle(this.incidentListName);
                const fields = await list.fields();
                const getFieldName = (displayNames) => {
                    for (const name of displayNames) {
                        const field = fields.find(f => f.Title && f.Title.toLowerCase() === name.toLowerCase());
                        if (field)
                            return field.InternalName;
                    }
                    return null;
                };
                const statusField = getFieldName(['Status', 'Request Status', 'RequestStatus']);
                const resolutionField = getFieldName(['Resolution', 'Resolution Summary', 'ResolutionDetails', 'ResolutionDescription']);
                const resolvedDateField = getFieldName(['Resolved Date', 'ResolvedDate', 'Resolution Date', 'ResolutionDate']);
                const payload = {};
                if (statusField) {
                    payload[statusField] = status;
                }
                else {
                    payload.Status = status;
                }
                if (resolution && resolutionField) {
                    payload[resolutionField] = resolution;
                }
                if ((status === 'Resolved' || status === 'Closed') && resolvedDateField) {
                    payload[resolvedDateField] = new Date().toISOString();
                }
                const numericId = parseInt(id, 10);
                const result = await list.items.getById(numericId).update(payload);
                console.log('[IncidentService] SharePoint update completed successfully:', result);
                return result;
            }
        }
        catch (error) {
            console.warn('[IncidentService] Failed to update SharePoint list item status, using localStorage fallback:', error.message);
            const localIncidents = this.getLocalItems('spfx_mock_incidents');
            const updated = localIncidents.map(inc => {
                if (inc.id === id || inc.incidentId === id) {
                    return {
                        ...inc,
                        status,
                        resolution: resolution || inc.resolution,
                        resolvedDate: status === 'Resolved' || status === 'Closed' ? new Date().toISOString() : inc.resolvedDate
                    };
                }
                return inc;
            });
            this.saveLocalItems('spfx_mock_incidents', updated);
            return { success: true };
        }
    }
    async getEmployeeAssignedAssets(userEmail) {
        try {
            console.log(`[IncidentService] Fetching assigned assets for: ${userEmail}`);
            // Resolve employee name from userEmail / EMPLOYEES
            const userEmailClean = userEmail.toLowerCase().trim();
            const employee = mockData_1.EMPLOYEES.find(emp => emp.email.toLowerCase() === userEmailClean ||
                emp.name.toLowerCase() === userEmailClean ||
                emp.id.toLowerCase() === userEmailClean);
            const employeeName = employee ? employee.name : userEmail;
            const assignedAssets = [];
            const seenSerials = new Set();
            // Helper to normalize strings for comparison
            const normalize = (val) => (val || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const nameNorm = normalize(employeeName);
            const emailNorm = normalize(employee ? employee.email : userEmail);
            // 1. Attempt to fetch from InventoryList items (primary source of truth)
            try {
                const inventoryItems = await InventoryService_1.InventoryService.getItems();
                if (inventoryItems && inventoryItems.length > 0) {
                    const matchedInventoryItems = inventoryItems.filter(item => {
                        const statusLower = (item.status || '').toLowerCase().trim();
                        if (statusLower === 'in stock' || statusLower === 'instock' || statusLower === 'available' || statusLower === 'returned' || statusLower === 'return approved' || statusLower === 'under maintenance' || statusLower === 'disposed' || statusLower === 'retired') {
                            return false;
                        }
                        const assignedNorm = normalize(item.assignedTo);
                        const isAssigned = assignedNorm && (assignedNorm === nameNorm || assignedNorm.includes(nameNorm) || nameNorm.includes(assignedNorm));
                        const isNoted = (item.note || '').toLowerCase().includes('assigned to:') && normalize(item.note).includes(nameNorm);
                        const isStatus = (item.status || '').toLowerCase().includes('assigned to:') && normalize(item.status).includes(nameNorm);
                        const isEmailMatch = emailNorm && ((assignedNorm && (assignedNorm === emailNorm || assignedNorm.includes(emailNorm) || emailNorm.includes(assignedNorm))) ||
                            ((item.note || '').toLowerCase().includes(emailNorm)));
                        return isAssigned || isNoted || isStatus || isEmailMatch;
                    });
                    matchedInventoryItems.forEach(item => {
                        const serial = (item.serialNumber || '').trim();
                        if (serial) {
                            seenSerials.add(serial.toLowerCase());
                        }
                        assignedAssets.push({
                            id: item.id,
                            employeeName: employeeName,
                            employeeId: employee ? employee.id : '',
                            employeeEmail: employee ? employee.email : '',
                            assetType: item.assetType || 'Device',
                            assetName: item.assetName || item.title || 'Device',
                            serialNumber: item.serialNumber || '',
                            assignmentDate: item.assignedDate || new Date().toISOString(),
                            status: item.status || 'Assigned',
                            condition: item.condition || 'Good',
                            location: 'HQ Office'
                        });
                    });
                }
            }
            catch (err) {
                console.warn('[IncidentService] Failed to fetch assets from InventoryList:', err);
            }
            // 2. Attempt to fetch from Mapping List (historical records / synced assignments)
            try {
                const mappingList = await InventoryService_1.InventoryService.getMappingList();
                const fields = await mappingList.fields();
                const items = await mappingList.items();
                const mapped = await this.getMappedAssignedAssets(fields, items);
                const filtered = this.filterByUser(mapped, employeeName || userEmail);
                filtered.forEach(item => {
                    const serial = (item.serialNumber || '').trim();
                    if (serial && seenSerials.has(serial.toLowerCase())) {
                        return; // Skip duplicate
                    }
                    if (serial) {
                        seenSerials.add(serial.toLowerCase());
                    }
                    assignedAssets.push(item);
                });
            }
            catch (err) {
                console.warn('[IncidentService] Failed to fetch assets from Mapping List:', err);
            }
            // 3. Fallback: return mock assets ONLY if user is a known mock employee and has no assignments
            if (assignedAssets.length === 0 && employee) {
                console.log('[IncidentService] No assignments found, generating fallback mock assets for known employee:', employee.name);
                const mockAssets = [
                    {
                        id: `MOCK-MAP-${employee.id}-1`,
                        employeeName: employee.name,
                        employeeId: employee.id,
                        employeeEmail: employee.email,
                        assetType: 'Laptop',
                        assetName: employee.jobTitle === 'Admin' ? 'Dell XPS 15' : 'Dell Latitude 5420',
                        serialNumber: employee.jobTitle === 'Admin' ? 'DX15-9988' : 'DL5420-9831',
                        assignmentDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                        status: 'Assigned',
                        condition: 'Excellent',
                        location: 'Remote Work'
                    },
                    {
                        id: `MOCK-MAP-${employee.id}-2`,
                        employeeName: employee.name,
                        employeeId: employee.id,
                        employeeEmail: employee.email,
                        assetType: 'Headset',
                        assetName: 'Jabra Evolve 65',
                        serialNumber: 'JB65-3819',
                        assignmentDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                        status: 'Assigned',
                        condition: 'Good',
                        location: 'Remote Work'
                    }
                ];
                return mockAssets;
            }
            console.log(`[IncidentService] Found ${assignedAssets.length} assigned assets for user`);
            return assignedAssets;
        }
        catch (error) {
            console.error('[IncidentService] getEmployeeAssignedAssets major error:', error);
            return [];
        }
    }
    async createIncidentRequest(incidentData, file) {
        try {
            const payload = await this.getMappedPayload(this.incidentListName, { ...incidentData, status: 'Open' });
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
    async getEmployeeDetailsByName(employeeName) {
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
        const mockUser = mockData_1.EMPLOYEES.find(emp => emp.name.toLowerCase() === employeeName.trim().toLowerCase());
        if (mockUser) {
            console.log('[Mock Fallback] Employee found by name:', mockUser);
            return {
                employeeId: mockUser.id,
                employeeName: mockUser.name,
                email: mockUser.email,
                department: mockUser.department
            };
        }
        const defaultDetails = {
            employeeId: employeeName,
            employeeName: employeeName,
            email: `${employeeName.toLowerCase().replace(/\s+/g, '.')}@company.com`,
            department: 'General'
        };
        console.log('[Default Fallback] Using typed name directly:', defaultDetails);
        return defaultDetails;
    }
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
}
exports.IncidentService = IncidentService;
//# sourceMappingURL=IncidentService.js.map