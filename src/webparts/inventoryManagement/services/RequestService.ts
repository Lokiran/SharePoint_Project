import { getSP } from "../pnpjsConfig";
import { IRequest } from "../models/IRequest";
import { IEventLog } from "../models/IEventLog";
import { SharePointBaseService } from "./base/SharePointBaseService";
import { AuditLogService } from "./AuditLogService";
import { InventoryItemService } from "./InventoryItemService";

export class RequestService {
  private static _resolvedRequestListName: string | null = null;
  private static _requestWorkflowFieldsEnsured = false;

  private static _normalizeRequestKey(input: string): string {
    return (input || "").trim().toUpperCase();
  }

  private static _buildRequestKeyFromItemId(itemId: number): string {
    const raw = itemId.toString();
    const padded = ("000000" + raw).slice(-6);
    return `REQ-${padded}`;
  }

  private static _resolveRequestKeyInternalName(fields: any[]): string {
    const candidates = ["requestid", "requestkey", "request_x0020_id", "request_x0020_key", "request id"];
    for (const cand of candidates) {
      const field = fields.find((f: any) => {
        const internal = (f.InternalName || "").toLowerCase();
        const title = (f.Title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const candNorm = cand.replace(/[^a-z0-9]/g, "");
        return internal === cand || internal.replace(/_x0020_/g, "") === candNorm || title === candNorm;
      });
      if (field) {
        return field.InternalName;
      }
    }
    return SharePointBaseService.REQUEST_KEY_INTERNAL_NAME;
  }

  private static _extractRequestKey(item: any): string {
    if (!item) {
      return "";
    }

    const candidates = ["requestkey", "requestid", "request_x0020_id", "request_x0020_key"];
    for (const key of Object.keys(item)) {
      const normalizedKey = key.toLowerCase().replace(/_x0020_/g, "");
      if (candidates.indexOf(normalizedKey) >= 0 && item[key]) {
        return RequestService._normalizeRequestKey(item[key].toString());
      }
    }

    if (item.ID) {
      return RequestService._buildRequestKeyFromItemId(parseInt(item.ID.toString(), 10));
    }

    return "";
  }

  public static async getRequestList(): Promise<any> {
    const sp = getSP();
    if (RequestService._resolvedRequestListName) {
      return sp.web.lists.getByTitle(RequestService._resolvedRequestListName);
    }
    try {
      const list = sp.web.lists.getByTitle(SharePointBaseService.REQUEST_LIST_NAME);
      await list.select("Title")(); // Verify list exists
      // eslint-disable-next-line require-atomic-updates
      RequestService._resolvedRequestListName = SharePointBaseService.REQUEST_LIST_NAME;
      return list;
    } catch (e) {
      try {
        const fallbackName = "Request List";
        const list = sp.web.lists.getByTitle(fallbackName);
        await list.select("Title")(); // Verify fallback exists
        console.log("Resolved requests list name dynamically to fallback: " + fallbackName);
        // eslint-disable-next-line require-atomic-updates
        RequestService._resolvedRequestListName = fallbackName;
        return list;
      } catch (e2) {
        try {
          const allLists = await sp.web.lists.select("Title")();
          const listNames = allLists.map(l => '"' + l.Title + '"').join(', ');
          throw new Error("List '" + SharePointBaseService.REQUEST_LIST_NAME + "' or 'Request List' does not exist on this SharePoint site. Available lists are: [ " + listNames + " ].");
        } catch (listsError) {
          throw new Error("List '" + SharePointBaseService.REQUEST_LIST_NAME + "' or 'Request List' does not exist.");
        }
      }
    }
  }

  private static async _updateMissingRequestKeys(list: any, resolvedKeyName: string, items: any[]): Promise<void> {
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
      } catch (err) {
        console.warn(`Failed to update missing Request ID for item ${item.ID}:`, err);
      }
    }
  }

  private static async _ensureRequestWorkflowFields(): Promise<void> {
    if (RequestService._requestWorkflowFieldsEnsured) {
      return;
    }

    RequestService._requestWorkflowFieldsEnsured = true;
    try {
      const list = await RequestService.getRequestList();
      const fields: any[] = await list.fields.select("InternalName", "Title", "TypeAsString")();

      const hasRequestStatus = fields.some(field => {
        const internalName = (field.InternalName || '').toString().toLowerCase();
        return internalName === SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME.toLowerCase();
      });

      const hasManagerComment = fields.some(field => {
        const internalName = (field.InternalName || '').toString().toLowerCase();
        return internalName === SharePointBaseService.REQUEST_COMMENT_INTERNAL_NAME.toLowerCase();
      });

      if (!hasRequestStatus) {
        try {
          await list.fields.addChoice(SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME, {
            Choices: ["Pending", "Approved", "Rejected"],
            FillInChoice: false
          });
        } catch (err) {
          console.warn("Could not auto-create RequestStatus field. Continuing.", err);
        }
      }

      if (!hasManagerComment) {
        try {
          await list.fields.addMultilineText(SharePointBaseService.REQUEST_COMMENT_INTERNAL_NAME);
        } catch (err) {
          console.warn("Could not auto-create ManagerComment field. Continuing.", err);
        }
      }

      const hasRequestKey = fields.some(field => {
        const name = (field.InternalName || '').toString().toLowerCase();
        const title = (field.Title || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
        return name === 'requestkey' || name === 'requestid' || name === 'request_x0020_id' || title === 'requestid' || title === 'requestkey';
      });
      if (!hasRequestKey) {
        try {
          await list.fields.addText(SharePointBaseService.REQUEST_KEY_INTERNAL_NAME);
        } catch (err) {
          console.warn("Could not auto-create RequestKey field. Continuing.", err);
        }
      }

      const hasAssetStatus = fields.some(field => {
        const internalName = (field.InternalName || '').toString().toLowerCase();
        return internalName === SharePointBaseService.ASSET_STATUS_INTERNAL_NAME.toLowerCase();
      });
      if (!hasAssetStatus) {
        try {
          await list.fields.addChoice(SharePointBaseService.ASSET_STATUS_INTERNAL_NAME, {
            Choices: ["Pending", "Approved"],
            FillInChoice: false
          });
        } catch (err) {
          console.warn("Could not auto-create AssetStatus field. Continuing.", err);
        }
      }

      const hasEmployeeIdField = fields.some(field => {
        const internalName = (field.InternalName || '').toString().toLowerCase();
        return internalName === 'employeeid' || internalName === 'employee_x0020_id';
      });
      if (!hasEmployeeIdField) {
        try {
          await list.fields.addText('EmployeeID');
        } catch (err) {
          console.warn("Could not auto-create EmployeeID field. Continuing.", err);
        }
      }

      const hasPriorityField = fields.some(field => {
        const internalName = (field.InternalName || '').toString().toLowerCase();
        return internalName === 'priority';
      });
      if (!hasPriorityField) {
        try {
          await list.fields.addChoice('Priority', {
            Choices: ["High", "Medium", "Low"],
            FillInChoice: false
          });
        } catch (err) {
          console.warn("Could not auto-create Priority field. Continuing.", err);
        }
      }
    } catch (error) {
      // Non-admin users may not have schema permissions. Don't block request flows.
      console.warn("Could not ensure RequestList workflow fields. Continuing with fallback behavior.", error);
    }
  }

  public static async addRequest(request: Omit<IRequest, 'id' | 'requestKey' | 'status'> & { status?: string }, userDisplayName: string = "Unknown"): Promise<void> {
    const list = await RequestService.getRequestList();
    await RequestService._ensureRequestWorkflowFields();

    const initialStatus = request.status || "Pending";
    const sp = getSP();
    let requesterId: number | null = null;
    try {
      const user: any = await sp.web.ensureUser(request.requesterName);
      requesterId = user.data ? user.data.Id : user.Id;
    } catch (e) {
      console.warn("Could not resolve requester in SharePoint", e);
    }

    let dynamicPayload: any = null;
    try {
      const fields: any[] = await list.fields.select("InternalName", "Title", "TypeAsString", "Required")();

      const findField = (searchStr: string) => {
        let field = fields.find((f: any) => f.InternalName.toLowerCase() === searchStr.toLowerCase());
        if (field) return field;
        field = fields.find((f: any) => f.InternalName.toLowerCase().replace(/_x0020_/g, '').indexOf(searchStr.toLowerCase()) >= 0);
        if (field) return field;
        field = fields.find((f: any) => f.Title.toLowerCase().replace(/[^a-z0-9]/g, '').indexOf(searchStr.toLowerCase()) >= 0);
        return field;
      };

      const requesterField = findField("employee") || findField("requester");
      const assetField = findField("assettype") || findField("asset type") || findField("selectasset") || findField("asset") || findField("type");
      const quantityField = findField("quantity");
      const reasonField = findField("reason");
      const statusField = fields.find((f: any) => {
        const name = (f.InternalName || '').toLowerCase().replace(/_x0020_/g, '');
        const title = (f.Title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return name === "requeststatus" || name === "status" || title === "requeststatus" || title === "status";
      });
      const employeeIdField = findField("employeeid") || findField("employee id") || findField("employee_x0020_id");
      const priorityField = findField("priority");
      const requestDateField = findField("requestdate") || findField("request date") || findField("requesteddate") || findField("requested date");
      const managerNameField = findField("managername") || findField("manager's name") || findField("managers name") || findField("manager_x0027_s_x0020_name") || findField("manager");

      dynamicPayload = {
        Title: `Request for ${request.assetTitle}`
      };

      if (requesterField) {
        const isPerson = requesterField.TypeAsString === "User" || requesterField.TypeAsString === "UserMulti";
        if (isPerson && requesterId !== null) {
          dynamicPayload[`${requesterField.InternalName}Id`] = requesterId;
        } else {
          dynamicPayload[requesterField.InternalName] = request.requesterName;
        }
      }

      if (assetField) {
        const isLookup = assetField.TypeAsString === "Lookup";
        if (isLookup) {
          dynamicPayload[`${assetField.InternalName}Id`] = parseInt(request.assetId, 10) || 1;
        } else {
          dynamicPayload[assetField.InternalName] = request.assetTitle;
        }
      }

      if (quantityField) {
        dynamicPayload[quantityField.InternalName] = request.quantity;
      }

      if (reasonField) {
        dynamicPayload[reasonField.InternalName] = request.reason || "";
      }

      if (statusField) {
        dynamicPayload[statusField.InternalName] = initialStatus;
      } else {
        dynamicPayload[SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME] = initialStatus;
      }

      if (employeeIdField) {
        dynamicPayload[employeeIdField.InternalName] = (request as any).employeeId || "";
      }
      if (priorityField) {
        dynamicPayload[priorityField.InternalName] = (request as any).priority || "Medium";
      }
      if (requestDateField) {
        dynamicPayload[requestDateField.InternalName] = request.requestDate || new Date().toISOString().split('T')[0];
      }
      if (managerNameField) {
        dynamicPayload[managerNameField.InternalName] = (request as any).managerName || "";
      }
    } catch (e) {
      console.warn("Failed to generate dynamic payload from schema, will use hardcoded candidates", e);
    }

    const payloads = [
      ...(dynamicPayload ? [dynamicPayload] : []),
      // 1. User's specific columns (Employee/Requester as Person/Lookup field)
      ...(requesterId !== null ? [
        {
          Title: `Request for ${request.assetTitle}`,
          EmployeeId: requesterId,
          EmployeeID: (request as any).employeeId || "",
          ManagerName: (request as any).managerName || "",
          Manager_x0027_s_x0020_Name: (request as any).managerName || "",
          Manager_x0020_Name: (request as any).managerName || "",
          Manager: (request as any).managerName || "",
          Priority: (request as any).priority || "Medium",
          Asset_x0020_type: request.assetTitle,
          Quantity: request.quantity,
          Reason_x0020_for_x0020_Request: request.reason || "",
          RequestStatus: initialStatus,
          RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
          Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
        },
        {
          Title: `Request for ${request.assetTitle}`,
          EmployeeId: requesterId,
          EmployeeID: (request as any).employeeId || "",
          ManagerName: (request as any).managerName || "",
          Manager_x0027_s_x0020_Name: (request as any).managerName || "",
          Manager_x0020_Name: (request as any).managerName || "",
          Manager: (request as any).managerName || "",
          Priority: (request as any).priority || "Medium",
          Assettype: request.assetTitle,
          Quantity: request.quantity,
          ReasonforRequest: request.reason || "",
          RequestStatus: initialStatus,
          RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
          Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
        },
        {
          Title: `Request for ${request.assetTitle}`,
          RequesterId: requesterId,
          EmployeeID: (request as any).employeeId || "",
          ManagerName: (request as any).managerName || "",
          Manager_x0027_s_x0020_Name: (request as any).managerName || "",
          Manager_x0020_Name: (request as any).managerName || "",
          Manager: (request as any).managerName || "",
          Priority: (request as any).priority || "Medium",
          Asset_x0020_type: request.assetTitle,
          Quantity: request.quantity,
          Reason_x0020_for_x0020_Request: request.reason || "",
          RequestStatus: initialStatus,
          RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
          Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
        },
        {
          Title: `Request for ${request.assetTitle}`,
          RequesterId: requesterId,
          EmployeeID: (request as any).employeeId || "",
          ManagerName: (request as any).managerName || "",
          Manager_x0027_s_x0020_Name: (request as any).managerName || "",
          Manager_x0020_Name: (request as any).managerName || "",
          Manager: (request as any).managerName || "",
          Priority: (request as any).priority || "Medium",
          Assettype: request.assetTitle,
          Quantity: request.quantity,
          ReasonforRequest: request.reason || "",
          RequestStatus: initialStatus,
          RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
          Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
        }
      ] : []),
      // 2. User's specific columns (Employee/Requester as plain Text field)
      {
        Title: `Request for ${request.assetTitle}`,
        Employee: request.requesterName,
        EmployeeID: (request as any).employeeId || "",
        ManagerName: (request as any).managerName || "",
        Manager_x0027_s_x0020_Name: (request as any).managerName || "",
        Manager_x0020_Name: (request as any).managerName || "",
        Manager: (request as any).managerName || "",
        Priority: (request as any).priority || "Medium",
        Asset_x0020_type: request.assetTitle,
        Quantity: request.quantity,
        Reason_x0020_for_x0020_Request: request.reason || "",
        RequestStatus: initialStatus,
        RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
        Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
      },
      {
        Title: `Request for ${request.assetTitle}`,
        Employee: request.requesterName,
        EmployeeID: (request as any).employeeId || "",
        Priority: (request as any).priority || "Medium",
        Assettype: request.assetTitle,
        Quantity: request.quantity,
        ReasonforRequest: request.reason || "",
        RequestStatus: initialStatus,
        RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
        Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
      },
      {
        Title: `Request for ${request.assetTitle}`,
        Requester: request.requesterName,
        EmployeeID: (request as any).employeeId || "",
        Priority: (request as any).priority || "Medium",
        Asset_x0020_type: request.assetTitle,
        Quantity: request.quantity,
        Reason_x0020_for_x0020_Request: request.reason || "",
        RequestStatus: initialStatus,
        RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
        Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
      },
      {
        Title: `Request for ${request.assetTitle}`,
        Requester: request.requesterName,
        EmployeeID: (request as any).employeeId || "",
        Priority: (request as any).priority || "Medium",
        Assettype: request.assetTitle,
        Quantity: request.quantity,
        ReasonforRequest: request.reason || "",
        RequestStatus: initialStatus,
        RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
        Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
      },
      // 3. Fallbacks
      {
        Title: `Request for ${request.assetTitle}`,
        Employee: request.requesterName,
        EmployeeID: (request as any).employeeId || "",
        Priority: (request as any).priority || "Medium",
        SelectAsset: request.assetTitle,
        Quantity: request.quantity,
        ReasonforRequest: request.reason || "",
        RequestStatus: initialStatus,
        RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
        Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
      },
      {
        Title: `Request for ${request.assetTitle}`,
        Employee: request.requesterName,
        EmployeeID: (request as any).employeeId || "",
        Priority: (request as any).priority || "Medium",
        Select_x0020_Asset: request.assetTitle,
        Quantity: request.quantity,
        Reason_x0020_for_x0020_Request: request.reason || "",
        RequestStatus: initialStatus,
        RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
        Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
      },
      {
        Title: `Request for ${request.assetTitle}`,
        Employee: request.requesterName,
        EmployeeID: (request as any).employeeId || "",
        Priority: (request as any).priority || "Medium",
        Quantity: request.quantity,
        ReasonforRequest: request.reason || "",
        RequestStatus: initialStatus,
        RequestDate: request.requestDate || new Date().toISOString().split('T')[0],
        Request_x0020_Date: request.requestDate || new Date().toISOString().split('T')[0]
      }
    ];

    let addedRequest: any;
    let success = false;
    let lastError: any;
    for (const payload of payloads) {
      try {
        addedRequest = await list.items.add(payload);
        success = true;
        break; // Success, stop looping immediately!
      } catch (err) {
        lastError = err;
      }
    }

    if (!success) {
      console.error("Error adding request to SharePoint after trying all column combinations.", lastError);
      throw new Error(`SharePoint rejected the save. The columns you created in RequestList do not match the expected format. Please check the Developer Console (F12) for the exact column name mismatch.`);
    }

    // Safely perform post-save actions (key generation, updating, logging) outside the creation loop
    try {
      const requestItemId = (addedRequest && addedRequest.data && addedRequest.data.Id)
        ? parseInt(addedRequest.data.Id.toString(), 10)
        : (addedRequest && addedRequest.Id)
          ? parseInt(addedRequest.Id.toString(), 10)
          : NaN;

      const requestKey = Number.isNaN(requestItemId)
        ? `REQ-${Date.now().toString(36).toUpperCase()}`
        : RequestService._buildRequestKeyFromItemId(requestItemId);

      if (!Number.isNaN(requestItemId)) {
        try {
          const requestListInstance = await RequestService.getRequestList();
          const fields: any[] = await requestListInstance.fields.select("InternalName", "Title")();
          const resolvedKeyName = RequestService._resolveRequestKeyInternalName(fields);
          await requestListInstance.items.getById(requestItemId)
            .update({
              [resolvedKeyName]: requestKey,
              [SharePointBaseService.ASSET_STATUS_INTERNAL_NAME]: "Pending"
            });
        } catch (err) {
          console.warn(`Could not persist RequestKey for request item ${requestItemId}.`, err);
        }
      }

      // Log the event
      await AuditLogService.addAuditLog({
        title: `Created Request ${requestKey} for Asset: ${request.assetTitle}`,
        action: 'Create',
        entityType: 'Request',
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
    } catch (postError) {
      console.warn("Failed in post-request creation steps:", postError);
    }
  }

  public static async getRequests(): Promise<IRequest[]> {
    try {
      await RequestService._ensureRequestWorkflowFields();
      const list = await RequestService.getRequestList();
      const fields: any[] = await list.fields.select("InternalName", "Title", "TypeAsString")();
      const items = await SharePointBaseService._fetchItemsWithExpandedUsers(list);

      const findFieldInternalName = (searchStr: string, fallback: string): string => {
        let field = fields.find((f: any) => f.InternalName.toLowerCase() === searchStr.toLowerCase());
        if (field) return field.InternalName;
        field = fields.find((f: any) => f.InternalName.toLowerCase().replace(/_x0020_/g, '').indexOf(searchStr.toLowerCase()) >= 0);
        if (field) return field.InternalName;
        field = fields.find((f: any) => f.Title.toLowerCase().replace(/[^a-z0-9]/g, '').indexOf(searchStr.toLowerCase()) >= 0);
        return field ? field.InternalName : fallback;
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

      const mapped = items.map((item: any) => {
        const rawStatus = item[statusKey] || item.Status || 'Pending';
        const normalizedStatus = (rawStatus || '').toString().toLowerCase();
        const status: 'Pending' | 'Approved' | 'Declined' =
          (normalizedStatus.includes('approv')) ? 'Approved' :
            (normalizedStatus.includes('declin') || normalizedStatus.includes('reject')) ? 'Declined' :
              'Pending';
        const requestKey = item[resolvedKeyName] || RequestService._extractRequestKey(item);

        return {
          id: item.ID ? item.ID.toString() : Math.random().toString(36).substr(2, 9),
          requestKey: requestKey || (item.ID ? RequestService._buildRequestKeyFromItemId(parseInt(item.ID.toString(), 10)) : ""),
          requesterName: (() => {
            const rawEmp = item[employeeKey] || item[requesterKey] || item.Employee || item.Author;
            if (!rawEmp) return item.Title || "";
            if (typeof rawEmp === 'string') return rawEmp;
            if (Array.isArray(rawEmp)) return rawEmp.map((a: any) => a.Title || a.Name || "").join(', ');
            if (typeof rawEmp === 'object') return rawEmp.Title || rawEmp.Name || JSON.stringify(rawEmp);
            return rawEmp.toString();
          })(),
          employeeId: item[employeeIdKey] || "",
          managerName: item[managerNameKey] || item.ManagerName || item.Manager_x0020_Name || item.Manager || "",
          assetId: "",
          assetTitle: item[selectAssetKey] || item.Title || "",
          assetName: "",
          priority: item[priorityKey] || "Medium",
          quantity: parseInt(item[quantityKey]) || 1,
          status,
          assetStatus: ((item[assetStatusKey] || "Pending").toString().toLowerCase().includes("approv") ? "Approved" : "Pending") as 'Pending' | 'Approved',
          managerResponse: item[managerCommentKey] || "",
          requestDate: item[requestDateKey] ? item[requestDateKey].split('T')[0] : (item.Created ? item.Created.split('T')[0] : new Date().toISOString().split('T')[0]),
          reason: item[reasonKey] || ""
        };
      });

      const itemsToUpdate = items.filter((item: any) => !item[resolvedKeyName] && item.ID);
      if (itemsToUpdate.length > 0) {
        RequestService._updateMissingRequestKeys(list, resolvedKeyName, itemsToUpdate).catch(err => {
          console.warn("Background update of missing RequestKeys failed:", err);
        });
      }

      return mapped;
    } catch (error: any) {
      console.error("Error fetching requests from SharePoint:", error);
      throw error;
    }
  }

  public static async updateRequestStatus(
    requestId: number,
    status: 'Approved' | 'Declined',
    approverName: string = 'Unknown',
    rejectionReason?: string
  ): Promise<void> {
    try {
      await RequestService._ensureRequestWorkflowFields();

      if (Number.isNaN(requestId)) {
        throw new Error('Invalid request ID');
      }

      const list = await RequestService.getRequestList();
      const item = await list.items.getById(requestId).select("*")();
      const keys = Object.keys(item || {});
      const findKey = (searchStr: string): string | undefined => {
        const nonIdMatch = keys.find(k => {
          const kl = k.toLowerCase().replace(/_x0020_/g, '');
          return kl.indexOf(searchStr) >= 0 && !kl.endsWith("id");
        });
        if (nonIdMatch) return nonIdMatch;
        return keys.find(k => k.toLowerCase().replace(/_x0020_/g, '').indexOf(searchStr) >= 0);
      };

      const fields: any[] = await list.fields.select("InternalName", "Title", "TypeAsString", "Choices")();
      const statusField = fields.find(field => {
        const internalNameRaw = (field.InternalName || '').toString();
        const internalName = internalNameRaw.toLowerCase();
        const title = ((field.Title || '') as string).toLowerCase();
        const normalizedInternal = internalName.replace(/_x0020_/g, '');
        const isModerationField = internalName.includes('moderation');
        const isBusinessStatusField = normalizedInternal === 'status' || title.trim() === 'status';
        return isBusinessStatusField && !isModerationField;
      });

      const statusKeyFromItem = keys.find(key => SharePointBaseService._isBusinessStatusKey(key));

      const statusKey = statusKeyFromItem || statusField?.InternalName || SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME;
      if (!statusKey) {
        throw new Error('Could not find request status column. Please create a Choice column like RequestStatus/Status in RequestList.');
      }

      if (!SharePointBaseService._isBusinessStatusKey(statusKey)) {
        throw new Error('Detected non-business status field. Please ensure RequestList has a dedicated request status column.');
      }
      const reasonKey = findKey("managercomment") || SharePointBaseService.REQUEST_COMMENT_INTERNAL_NAME || findKey("rejectionreason") || findKey("comments") || findKey("reason");
      const rawChoices = statusField?.Choices;
      const choices: string[] = Array.isArray(rawChoices)
        ? rawChoices
        : (rawChoices && Array.isArray(rawChoices.results) ? rawChoices.results : []);

      const pickChoice = (preferred: string[], fallback: string): string => {
        if (!choices.length) {
          return fallback;
        }

        const lowerChoices = choices.map(choice => (choice || '').toString().toLowerCase());
        for (const preferredValue of preferred) {
          const preferredLower = preferredValue.toLowerCase();
          for (let i = 0; i < lowerChoices.length; i++) {
            if (lowerChoices[i].includes(preferredLower) || preferredLower.includes(lowerChoices[i])) {
              return choices[i];
            }
          }
        }

        return fallback;
      };

      const statusValue = status === 'Declined'
        ? pickChoice(['rejected', 'declined'], 'Rejected')
        : pickChoice(['approved'], 'Approved');
      const requestKey = RequestService._extractRequestKey(item);

      const basePayload: any = {};
      basePayload[statusKey] = statusValue;
      if (reasonKey) {
        basePayload[reasonKey] = status === 'Declined'
          ? (rejectionReason || 'Rejected by manager')
          : `Approved by ${approverName}`;
      }
      await list.items.getById(requestId).update(basePayload);

      await AuditLogService.addAuditLog({
        title: `${statusValue} Request ${requestKey || `#${requestId}`}`,
        action: 'Update',
        entityType: 'Request',
        entityId: requestKey || requestId.toString(),
        details: JSON.stringify({
          requestKey: requestKey || RequestService._buildRequestKeyFromItemId(requestId),
          lifecycle: statusValue,
          changedBy: approverName,
          changedAt: new Date().toISOString(),
          rejectionReason: status === 'Declined' ? (rejectionReason || "") : "",
          assetAllocation: status === 'Approved'
            ? {
              assetTitle: item[findKey("assettype") || findKey("selectasset") || findKey("type") || "SelectAsset"] || item.Title || "",
              quantity: parseInt(item[findKey("quantity") || "Quantity"], 10) || 1
            }
            : undefined
        }),
        user: approverName
      });
    } catch (error: any) {
      console.error(`Failed to update RequestList item ${requestId} status`, error);
      throw new Error(`Unable to update request status. ${error.message || 'Verify RequestList status column and choices.'}`);
    }
  }

  public static async getRequestHistoryById(
    requestLookupId: string
  ): Promise<{ request: IRequest; lifecycle: IEventLog[] }> {
    await RequestService._ensureRequestWorkflowFields();

    const normalizedRequestKey = RequestService._normalizeRequestKey(requestLookupId);
    if (!normalizedRequestKey) {
      throw new Error("Request ID is required.");
    }

    const reqList = await RequestService.getRequestList();
    let requestItems: any[] = [];
    try {
      const fields: any[] = await reqList.fields.select("InternalName", "Title")();
      const resolvedKeyName = RequestService._resolveRequestKeyInternalName(fields);
      requestItems = await reqList
        .items.select("*")
        .filter(`${resolvedKeyName} eq '${normalizedRequestKey.replace(/'/g, "''")}'`)();
    } catch (filterError) {
      console.warn("RequestKey filter failed. Falling back to item ID based lookup.", filterError);
    }

    if (!requestItems.length) {
      const derivedIdMatch = /^REQ-(\d{1,})$/.exec(normalizedRequestKey.replace(/^REQ-0*/, "REQ-"));
      const parsedId = derivedIdMatch ? parseInt(derivedIdMatch[1], 10) : NaN;
      if (!Number.isNaN(parsedId)) {
        try {
          const requestById = await reqList
            .items.getById(parsedId)
            .select("*")();
          requestItems = requestById ? [requestById] : [];
        } catch (err) {
          console.warn(`Fallback ID lookup failed for ${normalizedRequestKey}.`, err);
        }
      }
    }

    if (!requestItems || requestItems.length === 0) {
      throw new Error(`No request found for ID ${normalizedRequestKey}`);
    }

    const requestItem = requestItems[0];
    const requests = await RequestService.getRequests();
    const request = requests.find(r =>
      RequestService._normalizeRequestKey(r.requestKey) === normalizedRequestKey ||
      r.id === requestItem.ID?.toString()
    );

    if (!request) {
      throw new Error(`Request exists but could not be mapped for ID ${normalizedRequestKey}`);
    }

    const requestIdAsString = requestItem.ID ? requestItem.ID.toString() : "";
    const allLogs = await AuditLogService.getAuditLogs();
    const lifecycle = allLogs
      .filter(log =>
        log.entityType === "Request" && (
          RequestService._normalizeRequestKey(log.entityId) === normalizedRequestKey ||
          log.entityId === requestIdAsString ||
          ((log.details || "").toUpperCase().indexOf(`"REQUESTKEY":"${normalizedRequestKey}"`) >= 0)
        )
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return {
      request,
      lifecycle
    };
  }
}
