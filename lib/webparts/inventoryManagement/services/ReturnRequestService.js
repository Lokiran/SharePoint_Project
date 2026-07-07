import { getSP } from "../pnpjsConfig";
import { SharePointBaseService } from "./base/SharePointBaseService";
import { AuditLogService } from "./AuditLogService";
import { InventoryItemService } from "./InventoryItemService";
import { AssetAssignmentService } from "./AssetAssignmentService";
export class ReturnRequestService {
    static async getReturnRequestList() {
        const sp = getSP();
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
        return list;
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
                    status: (item[statusKey] || 'Pending'),
                    managerComment: item[commentKey] || item.ManagerComment || "",
                    completedDate: item[completedDateKey] || item.CompletedDate || ""
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
        const listTitle = ReturnRequestService._resolvedReturnListName || "Asset Return Request List";
        console.log(`[Return Request Workflow] Accessing Return Requests List: "${listTitle}"`);
        const autoDate = new Date().toISOString().split('T')[0];
        const newRequest = {
            ...request,
            requestDate: autoDate,
            id: `RR-${Date.now()}`,
            status: 'Pending'
        };
        let list;
        let schema;
        try {
            list = await ReturnRequestService.getReturnRequestList();
            schema = await SharePointBaseService.getListFieldsMetadata(list);
        }
        catch (err) {
            console.error(`[Return Request Workflow] Failed to access list metadata for "${listTitle}". Error:`, err);
            throw new Error(`Failed to access Return Request list metadata: ${err.message || JSON.stringify(err)}`);
        }
        const resolvedMapping = {};
        const excludeFields = new Set();
        const getField = (logicalKey, aliases) => {
            const match = SharePointBaseService._resolveFieldInternalName(schema, aliases, excludeFields);
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
            Status: "Pending"
        };
        const requiredKeys = ["AssetID", "AssetName", "RequesterName", "Status"];
        let finalPayload;
        try {
            finalPayload = await SharePointBaseService._coerceAndValidatePayload(logicalPayload, schema, resolvedMapping, requiredKeys);
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
            const translatedErr = SharePointBaseService.translateSharePointError(err, finalPayload, resolvedMapping);
            console.error(`[Return Request Workflow] Operation Failed: Creating Return Request. Error details:`, translatedErr.message);
            throw new Error(`Creating Return Request failed: ${translatedErr.message}`);
        }
        // Operation 2: Updating Inventory Status
        const invListTitle = "InventoryList";
        console.log(`[Return Request Workflow] Accessing list: "${invListTitle}" to update status of asset ${request.assetId}`);
        try {
            const invList = await InventoryItemService.getInventoryList();
            const invFields = await SharePointBaseService.getListFieldsMetadata(invList);
            const statusField = invFields.find(f => f.internalName.toLowerCase() === "status" || f.displayName.toLowerCase() === "status");
            const statusKey = statusField ? statusField.internalName : "Status";
            const updatePayload = {
                [statusKey]: "Pending Return"
            };
            console.log(`[Return Request Workflow] Updating Inventory Asset ${request.assetId} with payload:`, JSON.stringify(updatePayload));
            await invList.items.getById(parseInt(request.assetId, 10)).update(updatePayload);
            console.log(`[Return Request Workflow] Success: Updated Inventory Asset status to 'Pending Return' in SharePoint.`);
        }
        catch (error) {
            console.error(`[Return Request Workflow] Operation Failed: Updating Inventory Status. Error details:`, error);
            throw new Error(`Updating Inventory Status failed: ${error.message || JSON.stringify(error)}`);
        }
        // Operation 3: Writing Audit Log
        const auditListTitle = "EventLogList";
        console.log(`[Return Request Workflow] Writing to audit log list: "${auditListTitle}"`);
        try {
            const auditPayload = {
                title: `Requested Return & Deactivated: ${request.assetName}`,
                action: 'Deactivated',
                entityType: 'Asset',
                entityId: request.assetId,
                details: JSON.stringify({
                    lifecycle: "ReturnRequested",
                    assetId: request.assetId,
                    assetName: request.assetName,
                    serialNumber: request.serialNumber,
                    requesterName: request.requesterName,
                    returnReason: request.returnReason,
                    proposedCondition: request.proposedCondition,
                    requestedAt: new Date().toISOString()
                }),
                user: userDisplayName
            };
            console.log(`[Return Request Workflow] Submitting Audit Log with payload:`, JSON.stringify(auditPayload));
            await AuditLogService.addAuditLog(auditPayload);
            console.log(`[Return Request Workflow] Success: Created Audit Log record in SharePoint.`);
        }
        catch (e) {
            console.error(`[Return Request Workflow] Operation Failed: Writing Audit Log. Error details:`, e);
            throw new Error(`Writing Audit Log failed: ${e.message || JSON.stringify(e)}`);
        }
    }
    static async updateReturnRequestStatus(requestId, status, managerComment, approverName, finalCondition) {
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
            const payload = {
                [statusKey]: status,
                [commentKey]: managerComment
            };
            if (status === 'Completed') {
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
                            const updatedReq = { ...r, status, managerComment };
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
                    if (status === 'Completed') {
                        item.completedDate = new Date().toISOString().split('T')[0];
                    }
                    localStorage.setItem(requestId, JSON.stringify(item));
                }
            }
            catch (e) {
                console.error("localStorage update failed:", e.message, e.stack);
            }
        }
        try {
            const list = await InventoryItemService.getInventoryList();
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
            if (status === 'Completed') {
                const condition = finalCondition || req.proposedCondition || "Activated";
                let nextStatus = "In Stock";
                if (condition === "Poor" || condition === "Damaged") {
                    nextStatus = "Under Maintenance";
                }
                const payload = {
                    [statusKey]: nextStatus,
                    [assignedToKey]: null,
                    [`${assignedToKey}Id`]: null,
                    [conditionKey]: condition,
                    [noteKey]: `Returned by employee. Manager Note: ${managerComment}`
                };
                if (assignedToKey !== "AssignedTo") {
                    payload.AssignedTo = null;
                    payload.AssignedToId = null;
                }
                console.log("Inventory Update Payload:", JSON.stringify(payload));
                let assetUpdateResult = null;
                try {
                    assetUpdateResult = await list.items.getById(assetIdNum).update(payload);
                    console.log("Result of list.items.update() (Inventory update):", JSON.stringify(assetUpdateResult));
                }
                catch (err) {
                    console.error(`Exception in SharePoint Asset update on Return ${status}:`, err.message, err.stack);
                    if (err.data)
                        console.error("Error details:", JSON.stringify(err.data));
                }
                try {
                    const mappingList = await AssetAssignmentService.getMappingList();
                    console.log("Resolved Mapping List Name:", mappingList.Title || "Mapping List");
                    const mappingFields = await SharePointBaseService.getListFieldsMetadata(mappingList);
                    const serialCol = SharePointBaseService._resolveFieldInternalName(mappingFields, ["serialnumber", "serial number"]);
                    let mappedItems = [];
                    if (serialCol && req.serialNumber) {
                        mappedItems = await mappingList.items.filter(`${serialCol} eq '${req.serialNumber.replace(/'/g, "''")}'`).select("ID")();
                    }
                    if ((!mappedItems || mappedItems.length === 0) && req.assetName) {
                        console.log("[Return Request Workflow] Mapping record not found by serial number. Trying fallback search by Asset Name and Employee Name...");
                        const assetNameCol = SharePointBaseService._resolveFieldInternalName(mappingFields, ["assetname", "asset name"]);
                        const employeeCol = SharePointBaseService._resolveFieldInternalName(mappingFields, ["employee", "employee name", "employe"]);
                        if (assetNameCol && employeeCol && req.requesterName) {
                            const filterQuery = `${assetNameCol} eq '${req.assetName.replace(/'/g, "''")}' and ${employeeCol} eq '${req.requesterName.replace(/'/g, "''")}'`;
                            mappedItems = await mappingList.items.filter(filterQuery).select("ID")();
                        }
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
            let logTitle = "";
            let lifecycle = "";
            if (status === 'Approved') {
                logTitle = `Approved Return Request for Asset: ${req.assetName}`;
                lifecycle = "ReturnApproved";
            }
            else if (status === 'Rejected') {
                logTitle = `Rejected Return Request for Asset: ${req.assetName}`;
                lifecycle = "ReturnRejected";
            }
            else if (status === 'Completed') {
                logTitle = `Completed Return for Asset: ${req.assetName}`;
                lifecycle = "ReturnCompleted";
            }
            let finalAction = 'Update';
            let finalTitle = logTitle;
            if (status === 'Approved') {
                finalAction = 'Deactivated';
                finalTitle = `Approved Return Request & Deactivated: ${req.assetName}`;
            }
            else if (status === 'Rejected') {
                finalAction = 'Activated';
                finalTitle = `Rejected Return Request & Reactivated: ${req.assetName}`;
            }
            else if (status === 'Completed') {
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
            console.log("Submitting Audit Log payload...");
            await AuditLogService.addAuditLog({
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
                    condition: finalCondition || req.proposedCondition
                }),
                user: approverName
            });
            console.log("Audit Log created successfully.");
        }
        catch (e) {
            console.error("Exception in writing Audit Log:", e.message, e.stack);
        }
        console.log("========================");
        console.log("RETURN WORKFLOW END");
        console.log("========================");
    }
    static async cleanupReturnApprovedAssets() {
        console.log("[Cleanup] Starting self-healing cleanup for Return Approved assets...");
        try {
            const list = await InventoryItemService.getInventoryList();
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
            const items = await list.items.select("ID", statusKey, assignedToKey, "SerialNumber", "Title")();
            for (const item of items) {
                const rawStatus = item[statusKey] || "";
                const val = item[assignedToKey];
                let hasAssignee = false;
                if (val) {
                    if (typeof val === 'object') {
                        hasAssignee = Object.keys(val).length > 0;
                    }
                    else {
                        hasAssignee = true;
                    }
                }
                if (rawStatus === "Return Approved" || rawStatus === "ReturnApproved" || (rawStatus === "In Stock" && hasAssignee)) {
                    console.log(`[Cleanup] Found return approved or in-stock asset with assignee: ${item.Title || "Asset"} (ID: ${item.ID})`);
                    const payload = {
                        [statusKey]: "In Stock",
                        [assignedToKey]: null,
                        [`${assignedToKey}Id`]: null
                    };
                    if (assignedToKey !== "AssignedTo") {
                        payload.AssignedTo = null;
                        payload.AssignedToId = null;
                    }
                    await list.items.getById(item.ID).update(payload);
                    console.log(`[Cleanup] Updated asset ID ${item.ID} in SharePoint to 'In Stock' and cleared assignee.`);
                    const serialNumber = item.SerialNumber || "";
                    const assetTitle = item.Title || "";
                    const requesterName = (val && (val.Title || val.Name || (typeof val === 'object' ? '' : val.toString()))) || "";
                    try {
                        const mappingList = await AssetAssignmentService.getMappingList();
                        const mappingFields = await SharePointBaseService.getListFieldsMetadata(mappingList);
                        const serialCol = SharePointBaseService._resolveFieldInternalName(mappingFields, ["serialnumber", "serial number"]);
                        let mappedItems = [];
                        if (serialCol && serialNumber) {
                            mappedItems = await mappingList.items.filter(`${serialCol} eq '${serialNumber.replace(/'/g, "''")}'`).select("ID")();
                        }
                        if ((!mappedItems || mappedItems.length === 0) && assetTitle) {
                            const assetNameCol = SharePointBaseService._resolveFieldInternalName(mappingFields, ["assetname", "asset name"]);
                            const employeeCol = SharePointBaseService._resolveFieldInternalName(mappingFields, ["employee", "employee name", "employe"]);
                            if (assetNameCol && employeeCol && requesterName) {
                                const filterQuery = `${assetNameCol} eq '${assetTitle.replace(/'/g, "''")}' and ${employeeCol} eq '${requesterName.replace(/'/g, "''")}'`;
                                mappedItems = await mappingList.items.filter(filterQuery).select("ID")();
                            }
                        }
                        for (const mItem of mappedItems) {
                            await mappingList.items.getById(mItem.ID).delete();
                            console.log(`[Cleanup] Deleted mapping record ID ${mItem.ID} for asset ${assetTitle}`);
                        }
                    }
                    catch (err) {
                        console.warn(`[Cleanup] Failed to clean up mapping record for asset ${assetTitle}`, err);
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
//# sourceMappingURL=ReturnRequestService.js.map