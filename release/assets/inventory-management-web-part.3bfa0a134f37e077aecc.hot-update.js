"use strict";
self["webpackHotUpdate_56f8f2dc_8391_46cb_b74c_2806d6953063_0_0_1"]("inventory-management-web-part",{

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
                serialCol = _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService._resolveFieldInternalName(mappingFields, ["serialnumber", "serial number"]) || "";
                assetNameCol = _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService._resolveFieldInternalName(mappingFields, ["assetname", "asset name"]) || "";
                employeeCol = _base_SharePointBaseService__WEBPACK_IMPORTED_MODULE_1__.SharePointBaseService._resolveFieldInternalName(mappingFields, ["employee", "employee name", "employe"]) || "";
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
/******/ 	__webpack_require__.h = () => ("388b66bb6742e3521881")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=inventory-management-web-part.3bfa0a134f37e077aecc.hot-update.js.map