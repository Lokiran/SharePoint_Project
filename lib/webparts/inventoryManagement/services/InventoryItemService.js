import { getSP } from "../pnpjsConfig";
import { SharePointBaseService } from "./base/SharePointBaseService";
import { AuditLogService } from "./AuditLogService";
export class InventoryItemService {
    static async getInventoryList() {
        const sp = getSP();
        if (InventoryItemService._resolvedListName) {
            return sp.web.lists.getByTitle(InventoryItemService._resolvedListName);
        }
        try {
            const list = sp.web.lists.getByTitle(SharePointBaseService.LIST_NAME);
            await list.select("Title")(); // Verify list exists
            // eslint-disable-next-line require-atomic-updates
            InventoryItemService._resolvedListName = SharePointBaseService.LIST_NAME;
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
                    throw new Error("List '" + SharePointBaseService.LIST_NAME + "' or 'Inventory List' does not exist on this SharePoint site. Available lists on this site are: [ " + listNames + " ]. Please ensure your list title matches exactly.");
                }
                catch (listsError) {
                    throw new Error("List '" + SharePointBaseService.LIST_NAME + "' or 'Inventory List' does not exist on this SharePoint site.");
                }
            }
        }
    }
    static async getItems() {
        try {
            const list = await InventoryItemService.getInventoryList();
            const fields = await list.fields.select("InternalName", "Title", "TypeAsString")();
            const items = await SharePointBaseService._fetchItemsWithExpandedUsers(list);
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
            await AuditLogService.addAuditLog({
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
            await AuditLogService.addAuditLog({
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
            const sp = getSP();
            let list;
            try {
                list = sp.web.lists.getByTitle(SharePointBaseService.REQUEST_LIST_NAME);
                await list.select("Title")();
            }
            catch {
                list = sp.web.lists.getByTitle("Request List");
            }
            // Check fields and auto-create if needed
            const fields = await list.fields.select("InternalName", "Title", "TypeAsString")();
            const hasRequestStatus = fields.some(field => (field.InternalName || '').toString().toLowerCase() === SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME.toLowerCase());
            const hasManagerComment = fields.some(field => (field.InternalName || '').toString().toLowerCase() === SharePointBaseService.REQUEST_COMMENT_INTERNAL_NAME.toLowerCase());
            const hasRequestKey = fields.some(field => {
                const name = (field.InternalName || '').toString().toLowerCase();
                const title = (field.Title || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
                return name === 'requestkey' || name === 'requestid' || name === 'request_x0020_id' || title === 'requestid' || title === 'requestkey';
            });
            const hasAssetStatus = fields.some(field => (field.InternalName || '').toString().toLowerCase() === SharePointBaseService.ASSET_STATUS_INTERNAL_NAME.toLowerCase());
            const hasEmployeeIdField = fields.some(field => {
                const internalName = (field.InternalName || '').toString().toLowerCase();
                return internalName === 'employeeid' || internalName === 'employee_x0020_id';
            });
            const hasPriorityField = fields.some(field => (field.InternalName || '').toString().toLowerCase() === 'priority');
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
            if (!hasRequestKey) {
                try {
                    await list.fields.addText(SharePointBaseService.REQUEST_KEY_INTERNAL_NAME);
                }
                catch (err) {
                    console.warn("Could not auto-create RequestKey field. Continuing.", err);
                }
            }
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
            const assetStatusKey = findKey("assetstatus") || SharePointBaseService.ASSET_STATUS_INTERNAL_NAME;
            const updatePayload = {
                [assetStatusKey]: assetStatus
            };
            if (comment) {
                const managerCommentKey = findKey("managercomment") || findKey("comment") || findKey("response") || SharePointBaseService.REQUEST_COMMENT_INTERNAL_NAME;
                if (managerCommentKey) {
                    const existingComment = item[managerCommentKey] || "";
                    updatePayload[managerCommentKey] = existingComment
                        ? `${existingComment} | [Admin]: ${comment}`
                        : `[Admin]: ${comment}`;
                }
            }
            await list.items.getById(requestId).update(updatePayload);
            await AuditLogService.addAuditLog({
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
//# sourceMappingURL=InventoryItemService.js.map