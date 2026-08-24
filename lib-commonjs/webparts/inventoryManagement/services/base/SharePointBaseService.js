"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharePointBaseService = void 0;
const pnpjsConfig_1 = require("../../pnpjsConfig");
class SharePointBaseService {
    static async getListFieldsMetadata(list) {
        const fields = await list.fields.select("Title", "InternalName", "TypeAsString", "Required", "Choices")();
        return fields.map((f) => {
            let choices = f.Choices || undefined;
            const internalName = f.InternalName || "";
            const displayName = f.Title || "";
            // Ensure all standard conditions are available if this is a condition choice field
            if (f.TypeAsString === "Choice" && choices && choices.length > 0) {
                const isConditionField = internalName.toLowerCase().includes("condition") ||
                    displayName.toLowerCase().includes("condition");
                if (isConditionField) {
                    const standardConditions = ['New', 'Excellent', 'Good', 'Fair', 'Poor', 'Damaged'];
                    const newChoices = [...choices];
                    for (const cond of standardConditions) {
                        if (!newChoices.some(c => c.toLowerCase() === cond.toLowerCase())) {
                            newChoices.push(cond);
                        }
                    }
                    choices = newChoices;
                }
            }
            return {
                displayName: displayName,
                internalName: internalName,
                fieldType: f.TypeAsString || "",
                required: !!f.Required,
                choices: choices
            };
        });
    }
    static formatToSharePointDate(dateStr) {
        if (!dateStr)
            return null;
        if (dateStr instanceof Date) {
            return dateStr.toISOString();
        }
        const dateStrStr = String(dateStr).trim();
        if (!dateStrStr)
            return null;
        if (/^\d{4}-\d{2}-\d{2}/.test(dateStrStr)) {
            try {
                return new Date(dateStrStr).toISOString();
            }
            catch {
                // fallback
            }
        }
        const dmYMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(dateStrStr);
        if (dmYMatch) {
            const day = parseInt(dmYMatch[1], 10);
            const month = parseInt(dmYMatch[2], 10) - 1;
            const year = parseInt(dmYMatch[3], 10);
            try {
                return new Date(Date.UTC(year, month, day)).toISOString();
            }
            catch {
                // fallback
            }
        }
        try {
            const parsed = new Date(dateStrStr);
            if (!isNaN(parsed.getTime())) {
                return parsed.toISOString();
            }
        }
        catch {
            // fallback
        }
        return null;
    }
    static async _coerceAndValidatePayload(logicalPayload, schema, resolvedMapping, requiredKeys) {
        const cleanPayload = {};
        for (const logicalKey of Object.keys(logicalPayload)) {
            const internalName = resolvedMapping[logicalKey];
            const isRequired = requiredKeys.indexOf(logicalKey) >= 0;
            const val = logicalPayload[logicalKey];
            if (!internalName) {
                if (isRequired) {
                    throw new Error(`Required field "${logicalKey}" could not be mapped to any SharePoint column.`);
                }
                continue;
            }
            const isValueEmpty = val === undefined || val === null || (typeof val === "string" && val.trim() === "");
            if (isValueEmpty) {
                if (isRequired) {
                    throw new Error(`Missing required value for field "${logicalKey}" (SharePoint column: "${internalName}").`);
                }
                continue;
            }
            const fieldSchema = schema.find(f => f.internalName === internalName);
            if (!fieldSchema) {
                cleanPayload[internalName] = val;
                continue;
            }
            const fieldType = fieldSchema.fieldType;
            let coercedVal = val;
            if (fieldType === "DateTime") {
                const isoDate = SharePointBaseService.formatToSharePointDate(val);
                if (!isoDate) {
                    throw new Error(`Invalid date format for field "${logicalKey}" (value: "${val}").`);
                }
                coercedVal = isoDate;
            }
            else if (fieldType === "Choice") {
                if (fieldSchema.choices && fieldSchema.choices.length > 0) {
                    const choicesLower = fieldSchema.choices.map(c => c.toLowerCase());
                    const valStr = String(val).trim();
                    const index = choicesLower.indexOf(valStr.toLowerCase());
                    if (index >= 0) {
                        coercedVal = fieldSchema.choices[index];
                    }
                    else {
                        throw new Error(`Invalid choice value "${valStr}" for field "${logicalKey}". Allowed: [${fieldSchema.choices.join(", ")}].`);
                    }
                }
            }
            else if (fieldType === "User" || fieldType === "UserMulti") {
                let userId = null;
                if (typeof val === "number") {
                    userId = val;
                }
                else if (typeof val === "string" && val.trim() !== "") {
                    const valTrim = val.trim();
                    const parsedId = parseInt(valTrim, 10);
                    if (!isNaN(parsedId) && String(parsedId) === valTrim) {
                        userId = parsedId;
                    }
                    else {
                        try {
                            const sp = (0, pnpjsConfig_1.getSP)();
                            const user = await sp.web.ensureUser(valTrim);
                            userId = user.data ? user.data.Id : user.Id;
                        }
                        catch (err) {
                            throw new Error(`Failed to resolve Person/User value "${valTrim}" for field "${logicalKey}".`);
                        }
                    }
                }
                if (userId !== null) {
                    cleanPayload[`${internalName}Id`] = userId;
                    continue;
                }
                else {
                    if (isRequired) {
                        throw new Error(`Required Person field "${logicalKey}" could not be resolved (value: "${val}").`);
                    }
                    continue;
                }
            }
            else if (fieldType === "Lookup" || fieldType === "LookupMulti") {
                let lookupId = null;
                if (typeof val === "number") {
                    lookupId = val;
                }
                else if (typeof val === "string") {
                    const valTrim = val.trim();
                    const parsedId = parseInt(valTrim, 10);
                    if (!isNaN(parsedId) && String(parsedId) === valTrim) {
                        lookupId = parsedId;
                    }
                }
                if (lookupId !== null) {
                    cleanPayload[`${internalName}Id`] = lookupId;
                    continue;
                }
                else {
                    if (isRequired) {
                        throw new Error(`Required Lookup field ID for "${logicalKey}" could not be resolved (value: "${val}").`);
                    }
                    continue;
                }
            }
            else if (fieldType === "Number") {
                const parsed = Number(val);
                if (isNaN(parsed)) {
                    throw new Error(`Invalid number value "${val}" for field "${logicalKey}".`);
                }
                coercedVal = parsed;
            }
            else if (fieldType === "Boolean") {
                coercedVal = !!val;
            }
            else {
                coercedVal = String(val);
            }
            cleanPayload[internalName] = coercedVal;
        }
        for (const field of schema) {
            if (field.required && field.internalName !== "Title" && field.internalName !== "ID" && field.internalName !== "Id") {
                const hasDirectValue = cleanPayload[field.internalName] !== undefined && cleanPayload[field.internalName] !== null;
                const hasIdValue = cleanPayload[`${field.internalName}Id`] !== undefined && cleanPayload[`${field.internalName}Id`] !== null;
                if (!hasDirectValue && !hasIdValue) {
                    throw new Error(`Missing required SharePoint field: "${field.displayName}" (InternalName: "${field.internalName}").`);
                }
            }
        }
        if (!cleanPayload["Title"]) {
            const assetVal = logicalPayload["AssetName"] || "Asset";
            cleanPayload["Title"] = `Assignment of ${assetVal}`;
        }
        return cleanPayload;
    }
    static translateSharePointError(error, payload, mapping) {
        console.error("SharePoint Operation Error Details:");
        console.error("- Error Object:", error);
        console.error("- Final Payload:", JSON.stringify(payload, null, 2));
        console.error("- Dynamic Mapping:", JSON.stringify(mapping, null, 2));
        let msg = error?.message || "";
        if (typeof error === "object" && error !== null) {
            if (error.data && typeof error.data === "object") {
                msg += " | " + JSON.stringify(error.data);
            }
        }
        const msgLower = msg.toLowerCase();
        if (msgLower.includes("column") || msgLower.includes("field")) {
            return new Error(`SharePoint Rejected Payload: Unknown column or field schema mismatch. Details: ${msg}`);
        }
        if (msgLower.includes("required")) {
            return new Error(`SharePoint Rejected Payload: Missing required field. Details: ${msg}`);
        }
        if (msgLower.includes("datetime") || msgLower.includes("date")) {
            return new Error(`SharePoint Rejected Payload: Invalid date/time format. Details: ${msg}`);
        }
        if (msgLower.includes("user") || msgLower.includes("person") || msgLower.includes("principal")) {
            return new Error(`SharePoint Rejected Payload: Invalid Person/User field value. Details: ${msg}`);
        }
        if (msgLower.includes("choice") || msgLower.includes("invalid value")) {
            return new Error(`SharePoint Rejected Payload: Invalid Choice column value. Details: ${msg}`);
        }
        return new Error(`SharePoint Error: ${msg || "Unknown SharePoint error occurred."}`);
    }
    static _resolveFieldInternalName(fields, aliases, excludeFields = new Set()) {
        for (const alias of aliases) {
            const matched = fields.find(f => !excludeFields.has(f.internalName) &&
                (f.internalName.toLowerCase() === alias.toLowerCase() || f.displayName.toLowerCase() === alias.toLowerCase()));
            if (matched)
                return matched.internalName;
        }
        for (const alias of aliases) {
            const normAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
            const matched = fields.find(f => {
                if (excludeFields.has(f.internalName))
                    return false;
                const normInternal = f.internalName.toLowerCase().replace(/[^a-z0-9]/g, '');
                const normDisplay = f.displayName.toLowerCase().replace(/[^a-z0-9]/g, '');
                return normInternal === normAlias || normDisplay === normAlias;
            });
            if (matched)
                return matched.internalName;
        }
        for (const alias of aliases) {
            const matched = fields.find(f => !excludeFields.has(f.internalName) &&
                (f.internalName.toLowerCase().includes(alias.toLowerCase()) || f.displayName.toLowerCase().includes(alias.toLowerCase())));
            if (matched)
                return matched.internalName;
        }
        return null;
    }
    static async _fetchItemsWithExpandedUsers(list, filterStr) {
        try {
            const fields = await list.fields.select("InternalName", "Title", "TypeAsString")();
            const selectFields = ["*"];
            const expandFields = [];
            fields.forEach((field) => {
                const name = field.InternalName;
                const type = field.TypeAsString;
                if (type === "User" || type === "UserMulti") {
                    const nameLower = (name || '').toLowerCase();
                    const titleLower = (field.Title || '').toLowerCase();
                    if (nameLower.indexOf("employee") >= 0 ||
                        nameLower.indexOf("requester") >= 0 ||
                        nameLower.indexOf("assigned") >= 0 ||
                        nameLower.indexOf("author") >= 0 ||
                        nameLower.indexOf("editor") >= 0 ||
                        titleLower.indexOf("employee") >= 0 ||
                        titleLower.indexOf("requester") >= 0 ||
                        titleLower.indexOf("assigned") >= 0) {
                        selectFields.push(`${name}/Title`, `${name}/Id`);
                        expandFields.push(name);
                    }
                }
            });
            if (expandFields.indexOf("Author") === -1) {
                selectFields.push("Author/Title", "Author/Id");
                expandFields.push("Author");
            }
            if (expandFields.indexOf("Editor") === -1) {
                selectFields.push("Editor/Title", "Editor/Id");
                expandFields.push("Editor");
            }
            let query = list.items.select(selectFields.join(",")).expand(...expandFields);
            if (filterStr) {
                query = query.filter(filterStr);
            }
            return await query();
        }
        catch (error) {
            console.error("Dynamic user expansion failed:", error);
            throw new Error(`Dynamic user expansion failed: ${error.message || JSON.stringify(error)}`);
        }
    }
    static _isBusinessStatusKey(key) {
        const lower = (key || '').toLowerCase();
        const normalized = lower.replace(/_x0020_/g, '');
        const isSystemKey = lower.indexOf('__') === 0 || lower.indexOf('odata') >= 0;
        const isModeration = normalized.indexOf('moderationstatus') >= 0 || lower.indexOf('moderation') >= 0;
        const looksLikeStatus = normalized === 'status' || normalized === 'requeststatus' || normalized.indexOf('requeststatus') >= 0;
        return !isSystemKey && !isModeration && looksLikeStatus;
    }
}
exports.SharePointBaseService = SharePointBaseService;
SharePointBaseService.LIST_NAME = "InventoryList";
SharePointBaseService.EVENT_LOG_LIST = "EventLogList";
SharePointBaseService.REQUEST_LIST_NAME = "RequestList";
SharePointBaseService.RETURN_REQUEST_LIST_NAME = "Asset Return Request List";
SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME = "RequestStatus";
SharePointBaseService.REQUEST_COMMENT_INTERNAL_NAME = "ManagerComment";
SharePointBaseService.REQUEST_KEY_INTERNAL_NAME = "RequestKey";
SharePointBaseService.ASSET_STATUS_INTERNAL_NAME = "AssetStatus";
SharePointBaseService.MAPPING_LIST_NAME = "Mapping List";
//# sourceMappingURL=SharePointBaseService.js.map