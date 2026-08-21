import { getSP } from "../pnpjsConfig";
import { SharePointBaseService } from "./base/SharePointBaseService";
import { AuditLogService } from "./AuditLogService";
import { EmailService } from "./EmailService";
export class RequestService {
    static _normalizeRequestKey(input) {
        return (input || "").trim().toUpperCase();
    }
    static _buildRequestKeyFromItemId(itemId) {
        const raw = itemId.toString();
        const padded = ("000000" + raw).slice(-6);
        return `REQ-${padded}`;
    }
    static _resolveRequestKeyInternalName(fields) {
        const candidates = [
            "requestid",
            "requestkey",
            "request_x0020_id",
            "request_x0020_key",
            "request id"
        ];
        for (const cand of candidates) {
            const field = fields.find((f) => {
                const internal = (f.InternalName || "").toLowerCase();
                const title = (f.Title || "")
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "");
                const candNorm = cand.replace(/[^a-z0-9]/g, "");
                return (internal === cand ||
                    internal.replace(/_x0020_/g, "") === candNorm ||
                    title === candNorm);
            });
            if (field) {
                return field.InternalName;
            }
        }
        return SharePointBaseService.REQUEST_KEY_INTERNAL_NAME;
    }
    static _extractRequestKey(item) {
        if (!item) {
            return "";
        }
        const candidates = [
            "requestkey",
            "requestid",
            "request_x0020_id",
            "request_x0020_key"
        ];
        for (const key of Object.keys(item)) {
            const normalizedKey = key
                .toLowerCase()
                .replace(/_x0020_/g, "");
            if (candidates.indexOf(normalizedKey) >= 0 &&
                item[key]) {
                return RequestService._normalizeRequestKey(item[key].toString());
            }
        }
        if (item.ID) {
            return RequestService._buildRequestKeyFromItemId(parseInt(item.ID.toString(), 10));
        }
        return "";
    }
    static async getRequestList() {
        const sp = getSP();
        if (RequestService._resolvedRequestListName) {
            return sp.web.lists.getByTitle(RequestService._resolvedRequestListName);
        }
        try {
            const list = sp.web.lists.getByTitle(SharePointBaseService.REQUEST_LIST_NAME);
            await list.select("Title")();
            // eslint-disable-next-line require-atomic-updates
            RequestService._resolvedRequestListName =
                SharePointBaseService.REQUEST_LIST_NAME;
            return list;
        }
        catch (e) {
            try {
                const fallbackName = "Request List";
                const list = sp.web.lists.getByTitle(fallbackName);
                await list.select("Title")();
                console.log("Resolved requests list name dynamically to fallback: " +
                    fallbackName);
                // eslint-disable-next-line require-atomic-updates
                RequestService._resolvedRequestListName = fallbackName;
                return list;
            }
            catch (e2) {
                try {
                    const allLists = await sp.web.lists.select("Title")();
                    const listNames = allLists
                        .map(l => '"' + l.Title + '"')
                        .join(", ");
                    throw new Error("List '" +
                        SharePointBaseService.REQUEST_LIST_NAME +
                        "' or 'Request List' does not exist on this SharePoint site. Available lists are: [ " +
                        listNames +
                        " ].");
                }
                catch (listsError) {
                    throw new Error("List '" +
                        SharePointBaseService.REQUEST_LIST_NAME +
                        "' or 'Request List' does not exist.");
                }
            }
        }
    }
    static async _updateMissingRequestKeys(list, resolvedKeyName, items) {
        for (const item of items) {
            try {
                const itemId = parseInt(item.ID.toString(), 10);
                if (!Number.isNaN(itemId)) {
                    const requestKey = RequestService._buildRequestKeyFromItemId(itemId);
                    await list.items.getById(itemId).update({
                        [resolvedKeyName]: requestKey
                    });
                    console.log(`Successfully populated Request ID in SharePoint for item ${itemId}: ${requestKey}`);
                }
            }
            catch (err) {
                console.warn(`Failed to update missing Request ID for item ${item.ID}:`, err);
            }
        }
    }
    static async _ensureRequestWorkflowFields() {
        if (RequestService._requestWorkflowFieldsEnsured) {
            return;
        }
        try {
            const list = await RequestService.getRequestList();
            const fields = await list.fields.select("InternalName", "Title", "TypeAsString")();
            const hasRequestStatus = fields.some(field => {
                const internalName = (field.InternalName || "")
                    .toString()
                    .toLowerCase();
                return (internalName ===
                    SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME.toLowerCase());
            });
            const hasManagerComment = fields.some(field => {
                const internalName = (field.InternalName || "")
                    .toString()
                    .toLowerCase();
                return (internalName ===
                    SharePointBaseService.REQUEST_COMMENT_INTERNAL_NAME.toLowerCase());
            });
            if (!hasRequestStatus) {
                try {
                    await list.fields.addChoice(SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME, {
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
                    await list.fields.addMultilineText(SharePointBaseService.REQUEST_COMMENT_INTERNAL_NAME);
                }
                catch (err) {
                    console.warn("Could not auto-create ManagerComment field. Continuing.", err);
                }
            }
            const hasRequestKey = fields.some(field => {
                const name = (field.InternalName || "")
                    .toString()
                    .toLowerCase();
                const title = (field.Title || "")
                    .toString()
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "");
                return (name === "requestkey" ||
                    name === "requestid" ||
                    name === "request_x0020_id" ||
                    title === "requestid" ||
                    title === "requestkey");
            });
            if (!hasRequestKey) {
                try {
                    await list.fields.addText(SharePointBaseService.REQUEST_KEY_INTERNAL_NAME);
                }
                catch (err) {
                    console.warn("Could not auto-create RequestKey field. Continuing.", err);
                }
            }
            const hasAssetStatus = fields.some(field => {
                const internalName = (field.InternalName || "")
                    .toString()
                    .toLowerCase();
                return (internalName ===
                    SharePointBaseService.ASSET_STATUS_INTERNAL_NAME.toLowerCase());
            });
            if (!hasAssetStatus) {
                try {
                    await list.fields.addChoice(SharePointBaseService.ASSET_STATUS_INTERNAL_NAME, {
                        Choices: ["Pending", "Approved"],
                        FillInChoice: false
                    });
                }
                catch (err) {
                    console.warn("Could not auto-create AssetStatus field. Continuing.", err);
                }
            }
            const hasEmployeeIdField = fields.some(field => {
                const internalName = (field.InternalName || "")
                    .toString()
                    .toLowerCase();
                return (internalName === "employeeid" ||
                    internalName === "employee_x0020_id");
            });
            if (!hasEmployeeIdField) {
                try {
                    await list.fields.addText("EmployeeID");
                }
                catch (err) {
                    console.warn("Could not auto-create EmployeeID field. Continuing.", err);
                }
            }
            const hasPriorityField = fields.some(field => {
                const internalName = (field.InternalName || "")
                    .toString()
                    .toLowerCase();
                return internalName === "priority";
            });
            if (!hasPriorityField) {
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
            // eslint-disable-next-line require-atomic-updates
            RequestService._requestWorkflowFieldsEnsured = true;
        }
        catch (error) {
            console.warn("Could not ensure RequestList workflow fields. Continuing with fallback behavior.", error);
        }
    }
    static async addRequest(request, userDisplayName = "Unknown", userRole, isEmployeeUI) {
        const list = await RequestService.getRequestList();
        await RequestService._ensureRequestWorkflowFields();
        const initialStatus = request.status || "Pending";
        const sp = getSP();
        let requesterId = null;
        try {
            const user = await sp.web.ensureUser(request.requesterName);
            requesterId = user.data
                ? user.data.Id
                : user.Id;
        }
        catch (e) {
            console.warn("Could not resolve requester in SharePoint", e);
        }
        /*
         * Build ONE payload from the actual RequestList schema.
         *
         * IMPORTANT:
         * Do not send multiple hardcoded payloads with guessed
         * SharePoint column names. That was causing the schema
         * mismatch problem.
         */
        let addedRequest;
        let success = false;
        let lastError = null;
        try {
            const fields = await list.fields.select("InternalName", "Title", "TypeAsString", "Required")();
            const normalize = (value) => {
                return (value || "")
                    .toString()
                    .toLowerCase()
                    .replace(/_x0020_/g, "")
                    .replace(/[^a-z0-9]/g, "");
            };
            /*
             * Exact matching only.
             *
             * This prevents "Employee" from accidentally resolving
             * to "EmployeeID".
             */
            const findExactField = (names) => {
                const normalizedNames = names.map(normalize);
                return fields.find((field) => {
                    const internalName = normalize(field.InternalName);
                    const title = normalize(field.Title);
                    return (normalizedNames.indexOf(internalName) >= 0 ||
                        normalizedNames.indexOf(title) >= 0);
                });
            };
            const requesterField = findExactField([
                "Employee",
                "Requester",
                "EmployeeName",
                "RequesterName"
            ]);
            const employeeIdField = findExactField([
                "EmployeeID",
                "Employee Id",
                "Employee_x0020_ID"
            ]);
            const assetField = findExactField([
                "AssetType",
                "Asset Type",
                "SelectAsset",
                "Select Asset",
                "Asset"
            ]);
            const quantityField = findExactField([
                "Quantity"
            ]);
            const reasonField = findExactField([
                "Reason",
                "ReasonforRequest",
                "Reason for Request"
            ]);
            const statusField = findExactField([
                "RequestStatus",
                "Request Status",
                "Status"
            ]);
            const priorityField = findExactField([
                "Priority"
            ]);
            const requestDateField = findExactField([
                "RequestDate",
                "Request Date",
                "RequestedDate",
                "Requested Date"
            ]);
            const managerNameField = findExactField([
                "ManagerName",
                "Manager Name",
                "Managers Name",
                "Manager's Name"
            ]);
            console.log("RequestList fields detected:", fields.map((field) => ({
                InternalName: field.InternalName,
                Title: field.Title,
                TypeAsString: field.TypeAsString,
                Required: field.Required
            })));
            console.log("Resolved RequestList fields:", {
                requesterField: requesterField?.InternalName,
                requesterFieldType: requesterField?.TypeAsString,
                employeeIdField: employeeIdField?.InternalName,
                employeeIdFieldType: employeeIdField?.TypeAsString,
                assetField: assetField?.InternalName,
                assetFieldType: assetField?.TypeAsString,
                quantityField: quantityField?.InternalName,
                quantityFieldType: quantityField?.TypeAsString,
                reasonField: reasonField?.InternalName,
                reasonFieldType: reasonField?.TypeAsString,
                statusField: statusField?.InternalName,
                statusFieldType: statusField?.TypeAsString,
                priorityField: priorityField?.InternalName,
                priorityFieldType: priorityField?.TypeAsString,
                requestDateField: requestDateField?.InternalName,
                requestDateFieldType: requestDateField?.TypeAsString,
                managerNameField: managerNameField?.InternalName,
                managerNameFieldType: managerNameField?.TypeAsString
            });
            const payload = {
                Title: `Request for ${request.assetTitle}`
            };
            /*
             * Requester / Employee
             */
            if (requesterField) {
                const fieldType = (requesterField.TypeAsString || "").toLowerCase();
                const isPersonField = fieldType === "user" ||
                    fieldType === "usermulti";
                if (isPersonField &&
                    requesterId !== null) {
                    payload[`${requesterField.InternalName}Id`] = requesterId;
                }
                else {
                    payload[requesterField.InternalName] = request.requesterName;
                }
            }
            /*
             * Employee ID
             */
            if (employeeIdField) {
                const employeeIdValue = request.employeeId || "";
                payload[employeeIdField.InternalName] = employeeIdValue;
            }
            /*
             * Asset
             */
            if (assetField) {
                const fieldType = (assetField.TypeAsString || "").toLowerCase();
                const isLookup = fieldType === "lookup";
                if (isLookup) {
                    const assetLookupId = parseInt(request.assetId, 10);
                    if (!Number.isNaN(assetLookupId)) {
                        payload[`${assetField.InternalName}Id`] = assetLookupId;
                    }
                    else {
                        console.warn("Asset field is a Lookup, but request.assetId is not a valid SharePoint item ID.", request.assetId);
                    }
                }
                else {
                    payload[assetField.InternalName] = request.assetTitle;
                }
            }
            /*
             * Quantity
             */
            if (quantityField) {
                payload[quantityField.InternalName] = Number(request.quantity) || 1;
            }
            /*
             * Reason
             */
            if (reasonField) {
                payload[reasonField.InternalName] = request.reason || "";
            }
            /*
             * Request Status
             */
            if (statusField) {
                payload[statusField.InternalName] = initialStatus;
            }
            else {
                console.warn("RequestStatus field was not detected. Using configured fallback internal name:", SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME);
                payload[SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME] = initialStatus;
            }
            /*
             * Priority
             */
            if (priorityField) {
                payload[priorityField.InternalName] =
                    request.priority ||
                        "Medium";
            }
            /*
             * Request Date
             *
             * SharePoint Date fields can accept YYYY-MM-DD.
             * SharePoint DateTime fields should receive ISO.
             */
            if (requestDateField) {
                const requestDateValue = request.requestDate ||
                    new Date().toISOString();
                const fieldType = (requestDateField.TypeAsString || "").toLowerCase();
                if (fieldType === "datetime") {
                    const parsedDate = new Date(requestDateValue);
                    if (!Number.isNaN(parsedDate.getTime())) {
                        payload[requestDateField.InternalName] = parsedDate.toISOString();
                    }
                    else {
                        payload[requestDateField.InternalName] = new Date().toISOString();
                    }
                }
                else {
                    payload[requestDateField.InternalName] = requestDateValue;
                }
            }
            /*
             * Manager Name
             */
            if (managerNameField) {
                payload[managerNameField.InternalName] =
                    request.managerName || "";
            }
            console.log("Final RequestList payload:", payload);
            /*
             * IMPORTANT:
             * Only ONE SharePoint create operation.
             */
            addedRequest =
                await list.items.add(payload);
            success = true;
            console.log("Request successfully created in SharePoint:", addedRequest);
        }
        catch (err) {
            lastError = err;
            console.error("RequestList SharePoint save failed.", {
                error: err,
                message: err?.message,
                data: err?.data,
                response: err?.response
            });
        }
        /*
         * SharePoint creation failed.
         *
         * Preserve the existing local fallback behavior so the
         * employee does not lose the request, but clearly log the
         * real SharePoint error.
         */
        if (!success) {
            console.error("Final RequestList save error:", lastError);
            const localRequestKey = `REQ-LOCAL-${Date.now()
                .toString(36)
                .toUpperCase()}`;
            const localRequest = {
                id: localRequestKey,
                requestKey: localRequestKey,
                requesterName: request.requesterName,
                employeeId: request.employeeId || "",
                managerName: request.managerName || "",
                assetId: request.assetId || "",
                assetTitle: request.assetTitle,
                assetName: request.assetTitle,
                priority: request.priority ||
                    "Medium",
                quantity: request.quantity,
                status: initialStatus,
                assetStatus: "Pending",
                requestDate: request.requestDate ||
                    new Date()
                        .toISOString()
                        .split("T")[0],
                reason: request.reason || "",
                managerResponse: ""
            };
            try {
                const local = localStorage.getItem("inventory_requests");
                const listItems = local
                    ? JSON.parse(local)
                    : [];
                listItems.push(localRequest);
                localStorage.setItem("inventory_requests", JSON.stringify(listItems));
            }
            catch (e) {
                console.error("Local storage save failed for request", e);
            }
            try {
                await AuditLogService.addAuditLog({
                    title: `Created Local Request ${localRequestKey} for Asset: ${request.assetTitle}`,
                    action: "Create",
                    entityType: "Request",
                    entityId: localRequestKey,
                    details: JSON.stringify({
                        requestKey: localRequestKey,
                        lifecycle: "Submitted (Local Fallback)",
                        requesterName: request.requesterName,
                        assetTitle: request.assetTitle,
                        quantity: request.quantity,
                        reason: request.reason || "",
                        requestedAt: new Date().toISOString()
                    }),
                    user: userDisplayName
                });
            }
            catch (auditErr) {
                console.warn("Failed to add audit log for local fallback request:", auditErr);
            }
            return;
        }
        /*
         * Post-save actions.
         */
        try {
            const requestItemId = addedRequest &&
                addedRequest.data &&
                addedRequest.data.Id
                ? parseInt(addedRequest.data.Id.toString(), 10)
                : addedRequest &&
                    addedRequest.Id
                    ? parseInt(addedRequest.Id.toString(), 10)
                    : NaN;
            const requestKey = Number.isNaN(requestItemId)
                ? `REQ-${Date.now()
                    .toString(36)
                    .toUpperCase()}`
                : RequestService._buildRequestKeyFromItemId(requestItemId);
            if (!Number.isNaN(requestItemId)) {
                try {
                    const requestListInstance = await RequestService.getRequestList();
                    const fields = await requestListInstance.fields.select("InternalName", "Title")();
                    const resolvedKeyName = RequestService._resolveRequestKeyInternalName(fields);
                    const updatePayload = {
                        [resolvedKeyName]: requestKey
                    };
                    /*
                     * Only update AssetStatus if the configured
                     * internal name exists in the current schema.
                     */
                    const hasAssetStatusField = fields.some((field) => (field.InternalName || "").toLowerCase() ===
                        SharePointBaseService
                            .ASSET_STATUS_INTERNAL_NAME
                            .toLowerCase());
                    if (hasAssetStatusField) {
                        updatePayload[SharePointBaseService
                            .ASSET_STATUS_INTERNAL_NAME] = "Pending";
                    }
                    await requestListInstance.items
                        .getById(requestItemId)
                        .update(updatePayload);
                }
                catch (err) {
                    console.warn(`Could not persist RequestKey for request item ${requestItemId}.`, err);
                }
            }
            /*
             * Audit Log
             */
            await AuditLogService.addAuditLog({
                title: `Created Request ${requestKey} for Asset: ${request.assetTitle}`,
                action: "Create",
                entityType: "Request",
                entityId: requestKey,
                details: JSON.stringify({
                    requestKey,
                    lifecycle: "Submitted",
                    requesterName: request.requesterName,
                    assetTitle: request.assetTitle,
                    quantity: request.quantity,
                    reason: request.reason || "",
                    requestedAt: new Date().toISOString()
                }),
                user: userDisplayName
            });
            /*
             * Trigger Email Notification to Manager
             *
             * Only from Admin UI and not Employee UI.
             */
            if (userRole === "Admin" &&
                !isEmployeeUI) {
                Promise.resolve()
                    .then(async () => {
                    try {
                        let liveManagerEmail = "";
                        try {
                            const resolvedEmail = await EmailService.resolveLiveManagerEmail(request.requesterName);
                            if (resolvedEmail) {
                                liveManagerEmail =
                                    resolvedEmail;
                            }
                        }
                        catch (resolveErr) {
                            console.warn("Failed to resolve live manager email:", resolveErr);
                        }
                        await EmailService.sendApprovalRequestToManager({
                            requestKey,
                            employeeName: request.requesterName,
                            assetName: request.assetTitle,
                            requestDate: request.requestDate ||
                                new Date().toLocaleDateString(),
                            adminName: userDisplayName
                        }, liveManagerEmail ||
                            undefined);
                    }
                    catch (mailErr) {
                        console.warn("Failed to send approval request email in background:", mailErr);
                    }
                })
                    .catch(err => {
                    console.warn("Unhandled error in background email generation:", err);
                });
            }
        }
        catch (postError) {
            console.warn("Failed in post-request creation steps:", postError);
        }
    }
    static async getRequests() {
        let mapped = [];
        try {
            await RequestService._ensureRequestWorkflowFields();
            const list = await RequestService.getRequestList();
            const fields = await list.fields.select("InternalName", "Title", "TypeAsString")();
            const items = await SharePointBaseService._fetchItemsWithExpandedUsers(list);
            const findFieldInternalName = (searchStr, fallback) => {
                let field = fields.find((f) => f.InternalName
                    .toLowerCase() ===
                    searchStr.toLowerCase());
                if (field) {
                    return field.InternalName;
                }
                field = fields.find((f) => f.InternalName
                    .toLowerCase()
                    .replace(/_x0020_/g, "")
                    .indexOf(searchStr.toLowerCase()) >= 0);
                if (field) {
                    return field.InternalName;
                }
                field = fields.find((f) => f.Title
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "")
                    .indexOf(searchStr.toLowerCase()) >= 0);
                return field
                    ? field.InternalName
                    : fallback;
            };
            const employeeKey = findFieldInternalName("employee", "Employee");
            const requesterKey = findFieldInternalName("requester", "Requester");
            const selectAssetKey = findFieldInternalName("assettype", "SelectAsset");
            const quantityKey = findFieldInternalName("quantity", "Quantity");
            const reasonKey = findFieldInternalName("reason", "ReasonforRequest");
            const managerCommentKey = findFieldInternalName("managercomment", "ManagerComment");
            const assetStatusKey = findFieldInternalName("assetstatus", "AssetStatus");
            const statusKey = findFieldInternalName("requeststatus", "RequestStatus");
            const employeeIdKey = findFieldInternalName("employeeid", "EmployeeID");
            const priorityKey = findFieldInternalName("priority", "Priority");
            const requestDateKey = findFieldInternalName("requestdate", "RequestDate");
            const managerNameKey = findFieldInternalName("managername", "ManagerName");
            const resolvedKeyName = RequestService._resolveRequestKeyInternalName(fields);
            mapped = items.map((item) => {
                const rawStatus = item[statusKey] ||
                    item.Status ||
                    "Pending";
                const normalizedStatus = (rawStatus || "")
                    .toString()
                    .toLowerCase();
                const status = normalizedStatus.includes("approv")
                    ? "Approved"
                    : normalizedStatus.includes("declin") ||
                        normalizedStatus.includes("reject")
                        ? "Declined"
                        : "Pending";
                const requestKey = item[resolvedKeyName] ||
                    RequestService._extractRequestKey(item);
                return {
                    id: item.ID
                        ? item.ID.toString()
                        : Math.random()
                            .toString(36)
                            .substr(2, 9),
                    requestKey: requestKey ||
                        (item.ID
                            ? RequestService._buildRequestKeyFromItemId(parseInt(item.ID.toString(), 10))
                            : ""),
                    requesterName: (() => {
                        const rawEmp = item[employeeKey] ||
                            item[requesterKey] ||
                            item.Employee ||
                            item.Author;
                        if (!rawEmp) {
                            return item.Title || "";
                        }
                        if (typeof rawEmp === "string") {
                            return rawEmp;
                        }
                        if (Array.isArray(rawEmp)) {
                            return rawEmp
                                .map((a) => a.Title ||
                                a.Name ||
                                "")
                                .join(", ");
                        }
                        if (typeof rawEmp ===
                            "object") {
                            return (rawEmp.Title ||
                                rawEmp.Name ||
                                JSON.stringify(rawEmp));
                        }
                        return rawEmp.toString();
                    })(),
                    employeeId: item[employeeIdKey] || "",
                    managerName: item[managerNameKey] ||
                        item.ManagerName ||
                        item.Manager_x0020_Name ||
                        item.Manager ||
                        "",
                    assetId: "",
                    assetTitle: item[selectAssetKey] ||
                        item.Title ||
                        "",
                    assetName: "",
                    priority: item[priorityKey] ||
                        "Medium",
                    quantity: parseInt(item[quantityKey]) || 1,
                    status,
                    assetStatus: ((item[assetStatusKey] ||
                        "Pending")
                        .toString()
                        .toLowerCase()
                        .includes("approv")
                        ? "Approved"
                        : "Pending"),
                    managerResponse: item[managerCommentKey] || "",
                    requestDate: item[requestDateKey]
                        ? item[requestDateKey].split("T")[0]
                        : item.Created
                            ? item.Created.split("T")[0]
                            : new Date()
                                .toISOString()
                                .split("T")[0],
                    reason: item[reasonKey] || ""
                };
            });
            const itemsToUpdate = items.filter((item) => !item[resolvedKeyName] &&
                item.ID);
            if (itemsToUpdate.length > 0) {
                RequestService
                    ._updateMissingRequestKeys(list, resolvedKeyName, itemsToUpdate)
                    .catch(err => {
                    console.warn("Background update of missing RequestKeys failed:", err);
                });
            }
            return mapped;
        }
        catch (error) {
            console.warn("Error fetching requests from SharePoint, falling back to local storage items:", error);
        }
        try {
            const local = localStorage.getItem("inventory_requests");
            if (local) {
                const localRequests = JSON.parse(local);
                return [
                    ...localRequests,
                    ...mapped
                ];
            }
        }
        catch (e) {
            console.error("Failed to parse local requests from localStorage:", e);
        }
        return mapped;
    }
    static async updateRequestStatus(requestId, status, approverName = "Unknown", rejectionReason) {
        try {
            await RequestService._ensureRequestWorkflowFields();
            if (Number.isNaN(requestId)) {
                throw new Error("Invalid request ID");
            }
            const list = await RequestService.getRequestList();
            const item = await list.items
                .getById(requestId)
                .select("*")();
            const keys = Object.keys(item || {});
            const findKey = (searchStr) => {
                const nonIdMatch = keys.find(k => {
                    const kl = k.toLowerCase()
                        .replace(/_x0020_/g, "");
                    return (kl.indexOf(searchStr) >=
                        0 &&
                        !kl.endsWith("id"));
                });
                if (nonIdMatch) {
                    return nonIdMatch;
                }
                return keys.find(k => k
                    .toLowerCase()
                    .replace(/_x0020_/g, "")
                    .indexOf(searchStr) >= 0);
            };
            const fields = await list.fields.select("InternalName", "Title", "TypeAsString", "Choices")();
            const statusField = fields.find(field => {
                const internalNameRaw = (field.InternalName ||
                    "").toString();
                const internalName = internalNameRaw.toLowerCase();
                const title = (field.Title || "")
                    .toString()
                    .toLowerCase();
                const normalizedInternal = internalName.replace(/_x0020_/g, "");
                const isModerationField = internalName.includes("moderation");
                const isBusinessStatusField = normalizedInternal ===
                    "status" ||
                    title.trim() ===
                        "status";
                return (isBusinessStatusField &&
                    !isModerationField);
            });
            const statusKeyFromItem = keys.find(key => SharePointBaseService._isBusinessStatusKey(key));
            const statusKey = statusKeyFromItem ||
                statusField?.InternalName ||
                SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME;
            if (!statusKey) {
                throw new Error("Could not find request status column. Please create a Choice column like RequestStatus/Status in RequestList.");
            }
            if (!SharePointBaseService._isBusinessStatusKey(statusKey)) {
                throw new Error("Detected non-business status field. Please ensure RequestList has a dedicated request status column.");
            }
            const reasonKey = findKey("managercomment") ||
                SharePointBaseService.REQUEST_COMMENT_INTERNAL_NAME ||
                findKey("rejectionreason") ||
                findKey("comments") ||
                findKey("reason");
            const rawChoices = statusField?.Choices;
            const choices = Array.isArray(rawChoices)
                ? rawChoices
                : rawChoices &&
                    Array.isArray(rawChoices.results)
                    ? rawChoices.results
                    : [];
            const pickChoice = (preferred, fallback) => {
                if (!choices.length) {
                    return fallback;
                }
                const lowerChoices = choices.map(choice => (choice || "")
                    .toString()
                    .toLowerCase());
                for (const preferredValue of preferred) {
                    const preferredLower = preferredValue.toLowerCase();
                    for (let i = 0; i < lowerChoices.length; i++) {
                        if (lowerChoices[i].includes(preferredLower) ||
                            preferredLower.includes(lowerChoices[i])) {
                            return choices[i];
                        }
                    }
                }
                return fallback;
            };
            const statusValue = status === "Declined"
                ? pickChoice(["rejected", "declined"], "Rejected")
                : pickChoice(["approved"], "Approved");
            const requestKey = RequestService._extractRequestKey(item);
            const basePayload = {};
            basePayload[statusKey] =
                statusValue;
            if (reasonKey) {
                basePayload[reasonKey] =
                    status === "Declined"
                        ? rejectionReason ||
                            "Rejected by manager"
                        : `Approved by ${approverName}`;
            }
            await list.items
                .getById(requestId)
                .update(basePayload);
            await AuditLogService.addAuditLog({
                title: `${statusValue} Request ${requestKey ||
                    `#${requestId}`}`,
                action: "Update",
                entityType: "Request",
                entityId: requestKey ||
                    requestId.toString(),
                details: JSON.stringify({
                    requestKey: requestKey ||
                        RequestService._buildRequestKeyFromItemId(requestId),
                    lifecycle: statusValue,
                    changedBy: approverName,
                    changedAt: new Date().toISOString(),
                    rejectionReason: status === "Declined"
                        ? rejectionReason ||
                            ""
                        : "",
                    assetAllocation: status === "Approved"
                        ? {
                            assetTitle: item[findKey("assettype") ||
                                findKey("selectasset") ||
                                findKey("type") ||
                                "SelectAsset"] ||
                                item.Title ||
                                "",
                            quantity: parseInt(item[findKey("quantity") ||
                                "Quantity"], 10) || 1
                        }
                        : undefined
                }),
                user: approverName
            });
            if (status === "Approved") {
                try {
                    const selectAssetKey = findKey("assettype") ||
                        findKey("selectasset") ||
                        findKey("type") ||
                        "SelectAsset";
                    const employeeKey = findKey("employee") ||
                        findKey("requester") ||
                        "Employee";
                    const requesterKey = findKey("requester") ||
                        "Requester";
                    const rawEmp = item[employeeKey] ||
                        item[requesterKey] ||
                        item.Employee ||
                        item.Title ||
                        "Employee";
                    const employeeName = typeof rawEmp === "string"
                        ? rawEmp
                        : rawEmp &&
                            rawEmp.Title
                            ? rawEmp.Title
                            : "Employee";
                    await EmailService.sendApprovalConfirmationToAdmin({
                        requestKey: requestKey ||
                            RequestService._buildRequestKeyFromItemId(requestId),
                        employeeName,
                        assetName: item[selectAssetKey] ||
                            item.Title ||
                            "Asset",
                        approvedBy: approverName,
                        approvalDate: new Date().toLocaleDateString()
                    });
                }
                catch (mailErr) {
                    console.warn("Failed to send approval confirmation email to Admins:", mailErr);
                }
            }
        }
        catch (error) {
            console.error(`Failed to update RequestList item ${requestId} status`, error);
            throw new Error(`Unable to update request status. ${error.message ||
                "Verify RequestList status column and choices."}`);
        }
    }
    static async getRequestHistoryById(requestLookupId) {
        await RequestService._ensureRequestWorkflowFields();
        const normalizedRequestKey = RequestService._normalizeRequestKey(requestLookupId);
        if (!normalizedRequestKey) {
            throw new Error("Request ID is required.");
        }
        const reqList = await RequestService.getRequestList();
        let requestItems = [];
        try {
            const fields = await reqList.fields.select("InternalName", "Title")();
            const resolvedKeyName = RequestService._resolveRequestKeyInternalName(fields);
            requestItems =
                await reqList.items
                    .select("*")
                    .filter(`${resolvedKeyName} eq '${normalizedRequestKey.replace(/'/g, "''")}'`)();
        }
        catch (filterError) {
            console.warn("RequestKey filter failed. Falling back to item ID based lookup.", filterError);
        }
        if (!requestItems.length) {
            const derivedIdMatch = /^REQ-(\d{1,})$/.exec(normalizedRequestKey.replace(/^REQ-0*/, "REQ-"));
            const parsedId = derivedIdMatch
                ? parseInt(derivedIdMatch[1], 10)
                : NaN;
            if (!Number.isNaN(parsedId)) {
                try {
                    const requestById = await reqList.items
                        .getById(parsedId)
                        .select("*")();
                    requestItems =
                        requestById
                            ? [requestById]
                            : [];
                }
                catch (err) {
                    console.warn(`Fallback ID lookup failed for ${normalizedRequestKey}.`, err);
                }
            }
        }
        if (!requestItems ||
            requestItems.length === 0) {
            throw new Error(`No request found for ID ${normalizedRequestKey}`);
        }
        const requestItem = requestItems[0];
        const requests = await RequestService.getRequests();
        const request = requests.find(r => RequestService._normalizeRequestKey(r.requestKey) ===
            normalizedRequestKey ||
            r.id ===
                requestItem.ID?.toString());
        if (!request) {
            throw new Error(`Request exists but could not be mapped for ID ${normalizedRequestKey}`);
        }
        const requestIdAsString = requestItem.ID
            ? requestItem.ID.toString()
            : "";
        const allLogs = await AuditLogService.getAuditLogs();
        const lifecycle = allLogs
            .filter(log => log.entityType ===
            "Request" &&
            (RequestService._normalizeRequestKey(log.entityId) ===
                normalizedRequestKey ||
                log.entityId ===
                    requestIdAsString ||
                (log.details || "")
                    .toUpperCase()
                    .indexOf(`"REQUESTKEY":"${normalizedRequestKey}"`) >= 0))
            .sort((a, b) => new Date(a.timestamp).getTime() -
            new Date(b.timestamp).getTime());
        return {
            request,
            lifecycle
        };
    }
}
RequestService._resolvedRequestListName = null;
RequestService._requestWorkflowFieldsEnsured = false;
//# sourceMappingURL=RequestService.js.map