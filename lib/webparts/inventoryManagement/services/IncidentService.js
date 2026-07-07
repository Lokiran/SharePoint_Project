import { spfi, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/fields';
import { LogLevel, PnPLogging } from '@pnp/logging';
import { EMPLOYEES } from '../data/mockData';
import { InventoryService } from './InventoryService';
export class IncidentService {
    async getReplacementList() {
        try {
            const list = this.sp.web.lists.getByTitle(this.replacementListName);
            await list.select("Title")(); // check if list exists
            return list;
        }
        catch (e) {
            try {
                console.log("Attempting to auto-create 'Asset Replacements' list...");
                await this.sp.web.lists.add(this.replacementListName, "List for tracking asset replacements", 100);
                console.log("Successfully created 'Asset Replacements' list in SharePoint.");
                return this.sp.web.lists.getByTitle(this.replacementListName);
            }
            catch (createError) {
                console.error("Failed to auto-create 'Asset Replacements' list:", createError);
                throw createError;
            }
        }
    }
    async _ensureReplacementListFields() {
        if (IncidentService._replacementListFieldsEnsured) {
            return;
        }
        IncidentService._replacementListFieldsEnsured = true;
        try {
            const list = await this.getReplacementList();
            const fields = await list.fields.select("InternalName", "Title", "TypeAsString")();
            const hasField = (name) => fields.some(field => {
                const internalName = (field.InternalName || '').toString().toLowerCase();
                const title = (field.Title || '').toString().toLowerCase();
                const search = name.toLowerCase();
                return internalName === search || title === search;
            });
            if (!hasField("EmployeeID")) {
                try {
                    await list.fields.addText("EmployeeID", { Title: "Employee ID" });
                }
                catch (err) {
                    console.warn("Could not auto-create EmployeeID field. Continuing.", err);
                }
            }
            if (!hasField("EmployeeEmail")) {
                try {
                    await list.fields.addText("EmployeeEmail", { Title: "Employee Email" });
                }
                catch (err) {
                    console.warn("Could not auto-create EmployeeEmail field. Continuing.", err);
                }
            }
            if (!hasField("AssetName")) {
                try {
                    await list.fields.addText("AssetName", { Title: "Asset Name" });
                }
                catch (err) {
                    console.warn("Could not auto-create AssetName field. Continuing.", err);
                }
            }
            if (!hasField("SerialNo")) {
                try {
                    await list.fields.addText("SerialNo", { Title: "Serial No" });
                }
                catch (err) {
                    console.warn("Could not auto-create SerialNo field. Continuing.", err);
                }
            }
            if (!hasField("Priority")) {
                try {
                    await list.fields.addChoice("Priority", {
                        Choices: ["High", "Medium", "Low"],
                        FillInChoice: false
                    });
                }
                catch (err) {
                    console.warn("Could not auto-create Priority field. Continuing.", err);
                }
            }
            if (!hasField("Description")) {
                try {
                    await list.fields.addMultilineText("Description", { Title: "Description" });
                }
                catch (err) {
                    console.warn("Could not auto-create Description field. Continuing.", err);
                }
            }
            if (!hasField("Status")) {
                try {
                    await list.fields.addChoice("Status", {
                        Choices: ["Open", "In Progress", "Resolved", "Closed"],
                        FillInChoice: false
                    });
                }
                catch (err) {
                    console.warn("Could not auto-create Status field. Continuing.", err);
                }
            }
            if (!hasField("RequestDate")) {
                try {
                    await list.fields.addText("RequestDate", { Title: "Request Date" });
                }
                catch (err) {
                    console.warn("Could not auto-create RequestDate field. Continuing.", err);
                }
            }
        }
        catch (error) {
            // eslint-disable-next-line require-atomic-updates
            IncidentService._replacementListFieldsEnsured = false;
            console.warn("Could not ensure Asset Replacements List fields. Continuing.", error);
        }
    }
    constructor(spContext) {
        this.incidentListName = 'Incident List';
        this.employeeListName = 'EmployeeList';
        this.mappingListName = 'Mapping List';
        this.replacementListName = 'Asset Replacements';
        if (!spContext) {
            throw new Error('SPFx context is required. Ensure the web part is loaded in SharePoint.');
        }
        this.sp = spfi().using(SPFx(spContext)).using(PnPLogging(LogLevel.Warning));
        console.log('IncidentService initialized with SharePoint context');
        this._migrateLocalReplacements();
    }
    _migrateLocalReplacements() {
        try {
            const localIncidents = this.getLocalItems('spfx_mock_incidents');
            const replacementsToMove = localIncidents.filter(item => item.incidentType === 'Replacement Request' ||
                item.issueType === 'Replacement Request' ||
                item.id === '384' ||
                item.id === '976' ||
                item.id === '166' ||
                item.id === '369' ||
                item.id === '859' ||
                item.incidentId === 'INC-384' ||
                item.incidentId === 'INC-976' ||
                item.incidentId === 'INC-166' ||
                item.incidentId === 'INC-369' ||
                item.incidentId === 'INC-859');
            if (replacementsToMove.length > 0) {
                console.log(`[Migration] Moving ${replacementsToMove.length} replacement items from spfx_mock_incidents to spfx_mock_replacements`);
                // 1. Remove them from spfx_mock_incidents
                const remainingIncidents = localIncidents.filter(item => item.incidentType !== 'Replacement Request' &&
                    item.issueType !== 'Replacement Request' &&
                    item.id !== '384' &&
                    item.id !== '976' &&
                    item.id !== '166' &&
                    item.id !== '369' &&
                    item.id !== '859' &&
                    item.incidentId !== 'INC-384' &&
                    item.incidentId !== 'INC-976' &&
                    item.incidentId !== 'INC-166' &&
                    item.incidentId !== 'INC-369' &&
                    item.incidentId !== 'INC-859');
                this.saveLocalItems('spfx_mock_incidents', remainingIncidents);
                // 2. Add them to spfx_mock_replacements
                const localReplacements = this.getLocalItems('spfx_mock_replacements');
                const updatedReplacements = [...localReplacements, ...replacementsToMove.map(item => ({
                        ...item,
                        incidentType: 'Replacement Request',
                        issueType: 'Replacement Request',
                        id: item.id.startsWith('INC-') ? item.id.replace('INC-', 'REP-') : item.id,
                        incidentId: item.incidentId ? item.incidentId.replace('INC-', 'REP-') : `REP-${item.id || Math.floor(Math.random() * 1000)}`
                    }))];
                // Filter duplicates
                const uniqueReplacements = updatedReplacements.filter((item, index, self) => self.findIndex(t => t.id === item.id || t.incidentId === item.incidentId) === index);
                this.saveLocalItems('spfx_mock_replacements', uniqueReplacements);
            }
        }
        catch (e) {
            console.warn("Failed to migrate local storage replacement items:", e);
        }
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
            const incidentTypeField = getInternalName(['Incident Type', 'IncidentType', 'Issue Type', 'IssueType']);
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
        const incidentTypeField = getInternalName(['Incident Type', 'IncidentType', 'Issue Type', 'IssueType']);
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
        let incidentItems = [];
        // 1. Load standard incidents
        try {
            console.log(`[SharePoint IncidentList Read] Fetching incident history for: ${userEmail}, isAdmin: ${isAdmin}`);
            const fields = await this.sp.web.lists.getByTitle(this.incidentListName).fields();
            const items = await this.sp.web.lists.getByTitle(this.incidentListName).items();
            const mapped = await this.getMappedItems(fields, items);
            // Filter out replacements and specific items from standard incident history
            incidentItems = (isAdmin ? mapped : this.filterByUser(mapped, userEmail))
                .filter(item => item.incidentType !== 'Replacement Request' &&
                item.issueType !== 'Replacement Request' &&
                item.id !== '384' &&
                item.id !== '976' &&
                item.id !== '166' &&
                item.id !== '369' &&
                item.id !== '859' &&
                item.incidentId !== 'INC-384' &&
                item.incidentId !== 'INC-976' &&
                item.incidentId !== 'INC-166' &&
                item.incidentId !== 'INC-369' &&
                item.incidentId !== 'INC-859');
        }
        catch (error) {
            console.warn('Failed to fetch standard incidents from SharePoint:', error.message);
        }
        // 2. Load local storage fallback items
        const localIncidents = this.getLocalItems('spfx_mock_incidents');
        const filteredLocalIncidents = (isAdmin ? localIncidents : this.filterByUser(localIncidents, userEmail))
            .filter(item => item.incidentType !== 'Replacement Request' &&
            item.issueType !== 'Replacement Request' &&
            item.id !== '384' &&
            item.id !== '976' &&
            item.id !== '166' &&
            item.id !== '369' &&
            item.id !== '859' &&
            item.incidentId !== 'INC-384' &&
            item.incidentId !== 'INC-976' &&
            item.incidentId !== 'INC-166' &&
            item.incidentId !== 'INC-369' &&
            item.incidentId !== 'INC-859');
        // Merge and sort chronologically (newest first)
        const combined = [
            ...incidentItems,
            ...filteredLocalIncidents
        ];
        combined.sort((a, b) => {
            const dateA = new Date(a.reportedDate || a.raisedDate || 0).getTime();
            const dateB = new Date(b.reportedDate || b.raisedDate || 0).getTime();
            return dateB - dateA;
        });
        return combined;
    }
    async getEmployeeReplacementHistory(userEmail, isAdmin) {
        let replacementItems = [];
        let historicalSharePointReplacements = [];
        // 1. Load replacements from Asset Replacements list
        try {
            console.log(`[SharePoint AssetReplacements Read] Fetching replacements history for: ${userEmail}, isAdmin: ${isAdmin}`);
            const list = await this.getReplacementList();
            const fields = await list.fields();
            const items = await list.items();
            const mapped = await this.getMappedItems(fields, items);
            const mappedWithTypes = mapped.map(item => ({
                ...item,
                incidentType: 'Replacement Request',
                issueType: 'Replacement Request',
                incidentId: item.incidentId ? item.incidentId.replace('INC-', 'REP-') : `REP-${item.Id || item.ID || Math.floor(Math.random() * 1000)}`
            }));
            replacementItems = isAdmin ? mappedWithTypes : this.filterByUser(mappedWithTypes, userEmail);
        }
        catch (error) {
            console.warn('Failed to fetch replacements from SharePoint:', error.message);
        }
        // 2. Load any historical replacements that were saved in the Incident List, including items 384, 976, 166, 369, 859
        try {
            const fields = await this.sp.web.lists.getByTitle(this.incidentListName).fields();
            const items = await this.sp.web.lists.getByTitle(this.incidentListName).items();
            const mapped = await this.getMappedItems(fields, items);
            historicalSharePointReplacements = (isAdmin ? mapped : this.filterByUser(mapped, userEmail))
                .filter(item => item.incidentType === 'Replacement Request' ||
                item.issueType === 'Replacement Request' ||
                item.id === '384' ||
                item.id === '976' ||
                item.id === '166' ||
                item.id === '369' ||
                item.id === '859' ||
                item.incidentId === 'INC-384' ||
                item.incidentId === 'INC-976' ||
                item.incidentId === 'INC-166' ||
                item.incidentId === 'INC-369' ||
                item.incidentId === 'INC-859')
                .map(item => ({
                ...item,
                incidentType: 'Replacement Request',
                issueType: 'Replacement Request',
                incidentId: item.incidentId ? item.incidentId.replace('INC-', 'REP-') : `REP-${item.Id || item.ID || Math.floor(Math.random() * 1000)}`
            }));
        }
        catch (error) {
            console.warn('Failed to fetch historical replacements from Incident List:', error.message);
        }
        // 3. Load local storage fallback items
        const localReplacements = this.getLocalItems('spfx_mock_replacements');
        const filteredLocalReplacements = (isAdmin ? localReplacements : this.filterByUser(localReplacements, userEmail))
            .map(item => ({
            ...item,
            incidentType: 'Replacement Request',
            issueType: 'Replacement Request',
            incidentId: item.incidentId ? item.incidentId.replace('INC-', 'REP-') : `REP-${item.Id || item.ID || Math.floor(Math.random() * 1000)}`
        }));
        // Merge and sort chronologically (newest first)
        const combined = [
            ...replacementItems,
            ...historicalSharePointReplacements,
            ...filteredLocalReplacements
        ];
        combined.sort((a, b) => {
            const dateA = new Date(a.reportedDate || a.raisedDate || 0).getTime();
            const dateB = new Date(b.reportedDate || b.raisedDate || 0).getTime();
            return dateB - dateA;
        });
        return combined;
    }
    async updateIncidentStatus(id, status, resolution) {
        try {
            console.log(`[IncidentService] Updating status of incident ${id} to: ${status}`);
            const isLocal = id.startsWith('INC-') || id.startsWith('REP-') || isNaN(Number(id));
            if (isLocal) {
                const isReplacement = id.startsWith('REP-');
                const localKey = isReplacement ? 'spfx_mock_replacements' : 'spfx_mock_incidents';
                const localItems = this.getLocalItems(localKey);
                const updated = localItems.map(item => {
                    if (item.id === id || item.incidentId === id) {
                        return {
                            ...item,
                            status,
                            resolution: resolution || item.resolution,
                            resolvedDate: status === 'Resolved' || status === 'Closed' ? new Date().toISOString() : item.resolvedDate
                        };
                    }
                    return item;
                });
                this.saveLocalItems(localKey, updated);
                return { success: true };
            }
            else {
                // Try standard list first, then replacement list
                try {
                    const list = this.sp.web.lists.getByTitle(this.incidentListName);
                    const fields = await list.fields();
                    const getFieldName = (displayNames) => {
                        for (const name of displayNames) {
                            const field = fields.find((f) => f.Title && f.Title.toLowerCase() === name.toLowerCase());
                            if (field)
                                return field.InternalName;
                        }
                        return null;
                    };
                    const statusField = getFieldName(['Status', 'Request Status', 'RequestStatus']) || 'Status';
                    const resolutionField = getFieldName(['Resolution', 'Resolution Summary', 'ResolutionDetails', 'ResolutionDescription']);
                    const resolvedDateField = getFieldName(['Resolved Date', 'ResolvedDate', 'Resolution Date', 'ResolutionDate']);
                    const payload = { [statusField]: status };
                    if (resolution && resolutionField) {
                        payload[resolutionField] = resolution;
                    }
                    if ((status === 'Resolved' || status === 'Closed') && resolvedDateField) {
                        payload[resolvedDateField] = new Date().toISOString();
                    }
                    const numericId = parseInt(id, 10);
                    const result = await list.items.getById(numericId).update(payload);
                    return result;
                }
                catch (standardError) {
                    console.log("Not in standard list, trying replacement list...");
                    const list = await this.getReplacementList();
                    const fields = await list.fields();
                    const getFieldName = (displayNames) => {
                        for (const name of displayNames) {
                            const field = fields.find((f) => f.Title && f.Title.toLowerCase() === name.toLowerCase());
                            if (field)
                                return field.InternalName;
                        }
                        return null;
                    };
                    const statusField = getFieldName(['Status', 'Request Status', 'RequestStatus']) || 'Status';
                    const resolutionField = getFieldName(['Resolution', 'Resolution Summary', 'ResolutionDetails', 'ResolutionDescription']);
                    const resolvedDateField = getFieldName(['Resolved Date', 'ResolvedDate', 'Resolution Date', 'ResolutionDate']);
                    const payload = { [statusField]: status };
                    if (resolution && resolutionField) {
                        payload[resolutionField] = resolution;
                    }
                    if ((status === 'Resolved' || status === 'Closed') && resolvedDateField) {
                        payload[resolvedDateField] = new Date().toISOString();
                    }
                    const numericId = parseInt(id, 10);
                    const result = await list.items.getById(numericId).update(payload);
                    return result;
                }
            }
        }
        catch (error) {
            console.warn('[IncidentService] Failed to update SharePoint list item status, using localStorage fallback:', error.message);
            for (const localKey of ['spfx_mock_incidents', 'spfx_mock_replacements']) {
                const localItems = this.getLocalItems(localKey);
                const updated = localItems.map(inc => {
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
                this.saveLocalItems(localKey, updated);
            }
            return { success: true };
        }
    }
    async getEmployeeAssignedAssets(userEmail) {
        try {
            console.log(`[IncidentService] Fetching assigned assets for: ${userEmail}`);
            // Resolve employee name from userEmail / EMPLOYEES
            const userEmailClean = userEmail.toLowerCase().trim();
            const employee = EMPLOYEES.find(emp => emp.email.toLowerCase() === userEmailClean ||
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
                const inventoryItems = await InventoryService.getItems();
                if (inventoryItems && inventoryItems.length > 0) {
                    const matchedInventoryItems = inventoryItems.filter(item => {
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
                const mappingList = await InventoryService.getMappingList();
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
        const isReplacement = incidentData.incidentType === 'Replacement Request' ||
            incidentData.issueType === 'Replacement Request' ||
            (incidentData.incidentType && incidentData.incidentType.toLowerCase().indexOf('replace') > -1) ||
            (incidentData.issueType && incidentData.issueType.toLowerCase().indexOf('replace') > -1);
        const targetListName = isReplacement ? this.replacementListName : this.incidentListName;
        try {
            if (isReplacement) {
                await this._ensureReplacementListFields();
            }
            const payload = await this.getMappedPayload(targetListName, { ...incidentData, status: 'Open' });
            console.log(`[SharePoint Write] TARGET LIST: "${targetListName}"`);
            console.log('[SharePoint Write] PAYLOAD DATA:', JSON.stringify(payload, null, 2));
            const list = isReplacement ? await this.getReplacementList() : this.sp.web.lists.getByTitle(this.incidentListName);
            const result = await list.items.add(payload);
            console.log('[SharePoint Write] RESPONSE:', result);
            return result;
        }
        catch (error) {
            console.error(`Failed to create request in SharePoint on ${targetListName}:`, error);
            const isForbiddenOrMissing = error.message && (error.message.indexOf('404') > -1 ||
                error.message.indexOf('does not exist') > -1 ||
                error.message.indexOf('ArgumentException') > -1 ||
                error.message.indexOf('403') > -1 ||
                error.message.indexOf('Unauthorized') > -1);
            if (isForbiddenOrMissing) {
                console.warn(`SharePoint list write failed, saving to localStorage instead.`);
                const localKey = isReplacement ? 'spfx_mock_replacements' : 'spfx_mock_incidents';
                const localItems = this.getLocalItems(localKey);
                const newRecord = {
                    id: isReplacement ? `REP-${Date.now()}` : `INC-${Date.now()}`,
                    incidentId: isReplacement ? `REP-${Math.floor(100 + Math.random() * 900)}` : `INC-${Math.floor(100 + Math.random() * 900)}`,
                    employeeName: incidentData.employeeName || 'Unknown',
                    employeeId: incidentData.employeeId || 'N/A',
                    employeeEmail: incidentData.employeeEmail || '',
                    serialNo: incidentData.serialNo || '',
                    assetName: incidentData.assetName || incidentData.assetType || 'Device',
                    priority: incidentData.priority || 'Medium',
                    reason: incidentData.description || incidentData.issueDescription || '',
                    description: incidentData.description || incidentData.issueDescription || '',
                    issueDescription: incidentData.description || incidentData.issueDescription || '',
                    requestDate: new Date().toISOString(),
                    reportedDate: new Date().toISOString(),
                    raisedDate: new Date().toISOString(),
                    incidentType: incidentData.incidentType || (isReplacement ? 'Replacement Request' : 'Other'),
                    status: 'Open',
                    raisedTo: incidentData.raisedTo || 'Admin'
                };
                localItems.push(newRecord);
                this.saveLocalItems(localKey, localItems);
                return { data: newRecord };
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
        const mockUser = EMPLOYEES.find(emp => emp.name.toLowerCase() === employeeName.trim().toLowerCase());
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
IncidentService._replacementListFieldsEnsured = false;
//# sourceMappingURL=IncidentService.js.map