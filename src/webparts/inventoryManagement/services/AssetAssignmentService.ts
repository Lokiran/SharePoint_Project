import { getSP } from "../pnpjsConfig";
import { EMPLOYEES } from "../data/mockData";
import { SharePointBaseService } from "./base/SharePointBaseService";
import { AuditLogService } from "./AuditLogService";
import { InventoryItemService } from "./InventoryItemService";
import { RequestService } from "./RequestService";
import { EmailService } from "./EmailService";

export class AssetAssignmentService {
  private static _resolvedMappingListName: string | null = null;
  private static _mappingListFieldsEnsured = false;

  public static async getMappingList(): Promise<any> {
    const sp = getSP();
    if (AssetAssignmentService._resolvedMappingListName) {
      return sp.web.lists.getByTitle(AssetAssignmentService._resolvedMappingListName);
    }
    try {
      const list = sp.web.lists.getByTitle(SharePointBaseService.MAPPING_LIST_NAME);
      await list.select("Title")(); // Verify list exists
      // eslint-disable-next-line require-atomic-updates
      AssetAssignmentService._resolvedMappingListName = SharePointBaseService.MAPPING_LIST_NAME;
      return list;
    } catch (e) {
      try {
        const fallbackName = "MappingList";
        const list = sp.web.lists.getByTitle(fallbackName);
        await list.select("Title")(); // Verify fallback exists
        console.log("Resolved mapping list name dynamically to fallback: " + fallbackName);
        // eslint-disable-next-line require-atomic-updates
        AssetAssignmentService._resolvedMappingListName = fallbackName;
        return list;
      } catch (e2) {
        // Attempt to auto-create "Mapping List" dynamically
        try {
          console.log("Attempting to auto-create 'Mapping List' list...");
          await sp.web.lists.add(SharePointBaseService.MAPPING_LIST_NAME, "List for tracking asset assignments", 100);
          // eslint-disable-next-line require-atomic-updates
          AssetAssignmentService._resolvedMappingListName = SharePointBaseService.MAPPING_LIST_NAME;
          console.log("Successfully created 'Mapping List' in SharePoint.");
          return sp.web.lists.getByTitle(SharePointBaseService.MAPPING_LIST_NAME);
        } catch (createError) {
          try {
            const allLists = await sp.web.lists.select("Title")();
            const listNames = allLists.map(l => '"' + l.Title + '"').join(', ');
            throw new Error("List '" + SharePointBaseService.MAPPING_LIST_NAME + "' does not exist and could not be auto-created on this SharePoint site. Available lists are: [ " + listNames + " ].");
          } catch (listsError) {
            throw new Error("List '" + SharePointBaseService.MAPPING_LIST_NAME + "' does not exist and could not be auto-created.");
          }
        }
      }
    }
  }

  private static async _ensureMappingListFields(): Promise<void> {
    if (AssetAssignmentService._mappingListFieldsEnsured) {
      return;
    }

    AssetAssignmentService._mappingListFieldsEnsured = true;
    try {
      const list = await AssetAssignmentService.getMappingList();
      const fields: any[] = await list.fields.select("InternalName", "Title", "TypeAsString")();

      const hasField = (name: string) => fields.some(field => {
        const internalName = (field.InternalName || '').toString().toLowerCase();
        const title = (field.Title || '').toString().toLowerCase();
        const search = name.toLowerCase();
        return internalName === search || title === search;
      });

      // 0. AssignmentID (Text)
      if (!hasField("AssignmentID")) {
        try {
          await list.fields.addText("AssignmentID", { Title: "Assignment ID" });
        } catch (err) {
          console.warn("Could not auto-create AssignmentID field. Continuing.", err);
        }
      }

      // 1. Employe (Text)
      if (!hasField("Employe")) {
        try {
          await list.fields.addText("Employe");
        } catch (err) {
          console.warn("Could not auto-create Employe field. Continuing.", err);
        }
      }

      // 2. EmployeeID / Employee ID (Text)
      const hasEmpId = fields.some(field => {
        const val = (field.InternalName || '').toString().toLowerCase();
        const t = (field.Title || '').toString().toLowerCase();
        return val === 'employeeid' || val === 'employee_x0020_id' || val === 'employee id' || t === 'employee id' || t === 'employeeid' || val === 'employeid' || t === 'employeid' || t === 'employe id';
      });
      if (!hasEmpId) {
        try {
          await list.fields.addText("EmployeeID", { Title: "Employe ID" });
        } catch (err) {
          try {
            await list.fields.addText("EmployeID", { Title: "Employe ID" });
          } catch (err2) {
            try {
              await list.fields.addText("EmployeeID");
            } catch (err3) {
              console.warn("Could not auto-create EmployeeID field. Continuing.", err3);
            }
          }
        }
      }

      // 3. AssetName / Asset Name (Text)
      const hasAssetName = fields.some(field => {
        const val = (field.InternalName || '').toString().toLowerCase();
        const t = (field.Title || '').toString().toLowerCase();
        return val === 'assetname' || val === 'asset_x0020_name' || val === 'asset name' || t === 'asset name' || t === 'assetname';
      });
      if (!hasAssetName) {
        try {
          await list.fields.addText("AssetName", { Title: "Asset Name" });
        } catch (err) {
          try {
            await list.fields.addText("AssetName");
          } catch (err2) {
            console.warn("Could not auto-create AssetName field. Continuing.", err2);
          }
        }
      }

      // 4. SerialNumber / Serial Number (Text)
      const hasSerialNumber = fields.some(field => {
        const val = (field.InternalName || '').toString().toLowerCase();
        const t = (field.Title || '').toString().toLowerCase();
        return val === 'serialnumber' || val === 'serial_x0020_number' || val === 'serial number' || t === 'serial number' || t === 'serialnumber';
      });
      if (!hasSerialNumber) {
        try {
          await list.fields.addText("SerialNumber", { Title: "Serial Number" });
        } catch (err) {
          try {
            await list.fields.addText("SerialNumber");
          } catch (err2) {
            console.warn("Could not auto-create SerialNumber field. Continuing.", err2);
          }
        }
      }

      // 5. Priority (Choice)
      if (!hasField("Priority")) {
        try {
          await list.fields.addChoice("Priority", {
            Choices: ["High", "Medium", "Low"],
            FillInChoice: false
          });
        } catch (err) {
          console.warn("Could not auto-create Priority field. Continuing.", err);
        }
      }

      // 6. RequestedDate / Requested Date (Text)
      const hasRequestedDate = fields.some(field => {
        const val = (field.InternalName || '').toString().toLowerCase();
        const t = (field.Title || '').toString().toLowerCase();
        return val === 'requesteddate' || val === 'requested_x0020_date' || val === 'requested date' || t === 'requested date' || t === 'requesteddate';
      });
      if (!hasRequestedDate) {
        try {
          await list.fields.addText("RequestedDate", { Title: "Requested Date" });
        } catch (err) {
          try {
            await list.fields.addText("RequestedDate");
          } catch (err2) {
            console.warn("Could not auto-create RequestedDate field. Continuing.", err2);
          }
        }
      }

      // 7. ReasonforRequest / Reason for Request (Multiline Text)
      const hasReasonforRequest = fields.some(field => {
        const val = (field.InternalName || '').toString().toLowerCase();
        const t = (field.Title || '').toString().toLowerCase();
        return val === 'reasonforrequest' || val === 'reason_x0020_for_x0020_request' || val === 'reason for request' || t === 'reason for request' || t === 'reasonforrequest';
      });
      if (!hasReasonforRequest) {
        try {
          await list.fields.addMultilineText("ReasonforRequest", { Title: "Reason for Request" });
        } catch (err) {
          try {
            await list.fields.addMultilineText("ReasonforRequest");
          } catch (err2) {
            console.warn("Could not auto-create ReasonforRequest field. Continuing.", err2);
          }
        }
      }

      // 8. AssignedDate / Assigned Date (Text)
      const hasAssignedDate = fields.some(field => {
        const val = (field.InternalName || '').toString().toLowerCase();
        const t = (field.Title || '').toString().toLowerCase();
        return val === 'assigneddate' || val === 'assigned_x0020_date' || val === 'assigned date' || t === 'assigned date' || t === 'assigneddate';
      });
      if (!hasAssignedDate) {
        try {
          await list.fields.addText("AssignedDate", { Title: "Assigned Date" });
        } catch (err) {
          try {
            await list.fields.addText("AssignedDate");
          } catch (err2) {
            console.warn("Could not auto-create AssignedDate field. Continuing.", err2);
          }
        }
      }

    } catch (error) {
      console.warn("Could not ensure Mapping List fields. Continuing.", error);
    }
  }

  private static _resolveMappingPayload(
    mappingFields: any[],
    employeeName: string,
    employeeId: string,
    assetName: string,
    serialNumber: string,
    priority: string,
    requestedDate: string,
    reason: string,
    assignedDate: string,
    assignedToId: number | null,
    isEmployePerson: boolean
  ): any {
    const findField = (searchStr: string, fallback: string): string => {
      let field = mappingFields.find((f: any) => f.Title.toLowerCase() === searchStr.toLowerCase());
      if (field) return field.InternalName;

      field = mappingFields.find((f: any) => f.InternalName.toLowerCase() === searchStr.toLowerCase());
      if (field) return field.InternalName;

      const normalizedSearch = searchStr.toLowerCase().replace(/[^a-z0-9]/g, '');
      field = mappingFields.find((f: any) => f.Title.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedSearch);
      if (field) return field.InternalName;

      field = mappingFields.find((f: any) => f.InternalName.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedSearch);
      if (field) return field.InternalName;

      return fallback;
    };

    const titleField = mappingFields.find((f: any) => f.InternalName === "Title");
    const titleFieldTitle = titleField ? (titleField.Title || "").toLowerCase().trim() : "";
    const isTitleEmploye = titleFieldTitle === "employe" || titleFieldTitle === "employee";

    let employeeNameFieldName = "Title";
    if (isTitleEmploye) {
      employeeNameFieldName = "Title";
    } else {
      const f = mappingFields.find((x: any) => {
        const title = (x.Title || "").toLowerCase().trim();
        const internal = (x.InternalName || "").toLowerCase().trim();
        return title === "employe" || title === "employee" || internal === "employe" || internal === "employee";
      });
      if (f) employeeNameFieldName = f.InternalName;
    }

    const employeeIdFieldName = (() => {
      const searchFields = mappingFields.filter((f: any) => f.InternalName !== employeeNameFieldName);

      const findFieldInList = (list: any[], search: string): string | null => {
        let f = list.find((x: any) => (x.Title || "").toLowerCase().trim() === search.toLowerCase());
        if (f) return f.InternalName;
        f = list.find((x: any) => x.InternalName.toLowerCase().trim() === search.toLowerCase());
        if (f) return f.InternalName;
        const norm = search.toLowerCase().replace(/[^a-z0-9]/g, '');
        f = list.find((x: any) => (x.Title || "").toLowerCase().replace(/[^a-z0-9]/g, '') === norm);
        if (f) return f.InternalName;
        return null;
      };

      return (
        findFieldInList(searchFields, "employe id") ||
        findFieldInList(searchFields, "employee id") ||
        findFieldInList(searchFields, "employeeid") ||
        findFieldInList(searchFields, "employeid") ||
        findFieldInList(searchFields, "employe") ||
        "EmployeeID"
      );
    })();

    const assetNameFieldName = findField("asset name", "AssetName");
    const serialNumberFieldName = findField("serial number", "SerialNumber");
    const priorityFieldName = findField("priority", "Priority");
    const requestedDateFieldName = findField("requested date", "RequestedDate");
    const reasonFieldName = findField("reason for request", "ReasonforRequest");
    const assignedDateFieldName = findField("assigned date", "AssignedDate");

    const payload: any = {};

    // Map Employee Name to the Employee column (either Title or a custom field)
    if (employeeNameFieldName === "Title") {
      payload["Title"] = employeeName;
    } else {
      payload["Title"] = `Assignment of ${assetName}`;

      const empFieldObj = mappingFields.find((f: any) => f.InternalName === employeeNameFieldName);
      const isEmpFieldPerson = empFieldObj && (empFieldObj.TypeAsString === "User" || empFieldObj.TypeAsString === "UserMulti");

      if (isEmpFieldPerson && assignedToId !== null) {
        payload[`${employeeNameFieldName}Id`] = assignedToId;
      } else {
        payload[employeeNameFieldName] = employeeName;
      }
    }

    // Map Employee ID to the Employee ID column
    const empIdFieldObj = mappingFields.find((f: any) => f.InternalName === employeeIdFieldName);
    const isEmpIdFieldPerson = empIdFieldObj && (empIdFieldObj.TypeAsString === "User" || empIdFieldObj.TypeAsString === "UserMulti");

    if (isEmpIdFieldPerson && assignedToId !== null) {
      payload[`${employeeIdFieldName}Id`] = assignedToId;
    } else {
      payload[employeeIdFieldName] = employeeId;
    }

    // Map other columns
    payload[assetNameFieldName] = assetName;
    payload[serialNumberFieldName] = serialNumber;
    payload[priorityFieldName] = priority;
    payload[requestedDateFieldName] = requestedDate;
    payload[reasonFieldName] = reason;
    payload[assignedDateFieldName] = assignedDate;

    return payload;
  }

  private static async _writeToMappingList(
    employeeName: string,
    employeeId: string,
    employeeEmail: string,
    assetName: string,
    serialNumber: string,
    priority: string,
    requestedDate: string,
    reason: string,
    assignedDate: string,
    assignmentId?: string
  ): Promise<void> {
    const mappingList = await AssetAssignmentService.getMappingList();
    const schema = await SharePointBaseService.getListFieldsMetadata(mappingList);

    const finalAssignmentId = assignmentId || `ASG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    let assignedToId: number | null = null;
    try {
      const sp = getSP();
      const user: any = await sp.web.ensureUser(employeeEmail);
      assignedToId = user.data ? user.data.Id : user.Id;
    } catch (e) {
      console.warn(`Could not resolve user ${employeeEmail} in SharePoint during mapping write. Falling back to current user.`, e);
      try {
        const sp = getSP();
        const currentUser = await sp.web.currentUser();
        assignedToId = currentUser.Id;
      } catch (currUserErr) {
        console.warn("Failed to get current user as fallback in mapping write", currUserErr);
      }
    }

    const resolvedMapping: { [logicalKey: string]: string } = {};

    let employeeNameField = schema.find(f => 
      f.internalName.toLowerCase() === "employe" || 
      f.internalName.toLowerCase() === "employee" ||
      f.displayName.toLowerCase() === "employe" ||
      f.displayName.toLowerCase() === "employee" ||
      f.displayName.toLowerCase() === "employee name"
    );
    if (!employeeNameField) {
      employeeNameField = schema.find(f => f.internalName === "Title");
    }
    if (employeeNameField) {
      resolvedMapping["EmployeeName"] = employeeNameField.internalName;
    }

    const getField = (aliases: string[]): string | null => {
      const mappedValues = new Set<string>();
      for (const k of Object.keys(resolvedMapping)) {
        mappedValues.add(resolvedMapping[k]);
      }
      const match = SharePointBaseService._resolveFieldInternalName(
        schema,
        aliases,
        mappedValues
      );
      return match;
    };

    const empIdCol = getField(["employeeid", "employee id", "employeid", "employe id"]);
    if (empIdCol) resolvedMapping["EmployeeID"] = empIdCol;

    const assetNameCol = getField(["assetname", "asset name"]);
    if (assetNameCol) resolvedMapping["AssetName"] = assetNameCol;

    const serialCol = getField(["serialnumber", "serial number"]);
    if (serialCol) resolvedMapping["SerialNumber"] = serialCol;

    const assignedDateCol = getField(["assigneddate", "assigned date"]);
    if (assignedDateCol) resolvedMapping["AssignedDate"] = assignedDateCol;

    const assignmentIdCol = getField(["assignmentid", "assignment id"]);
    if (assignmentIdCol) resolvedMapping["AssignmentID"] = assignmentIdCol;

    const logicalPayload = {
      EmployeeName: assignedToId || employeeName,
      EmployeeID: employeeId,
      AssetName: assetName,
      SerialNumber: serialNumber,
      AssignedDate: assignedDate,
      AssignmentID: finalAssignmentId
    };

    const requiredKeys = ["EmployeeName", "EmployeeID", "AssetName", "SerialNumber", "AssignedDate"];

    let finalPayload: any;
    try {
      finalPayload = await SharePointBaseService._coerceAndValidatePayload(logicalPayload, schema, resolvedMapping, requiredKeys);
      console.log(`[Mapping List Write] Dynamic Mapping resolved:`, JSON.stringify(resolvedMapping, null, 2));
      console.log(`[Mapping List Write] Final Payload before submission:`, JSON.stringify(finalPayload, null, 2));

      await mappingList.items.add(finalPayload);
      console.log(`Successfully added mapping record for ${employeeName}`);
    } catch (err: any) {
      const translatedErr = SharePointBaseService.translateSharePointError(err, finalPayload || logicalPayload, resolvedMapping);
      console.error(translatedErr.message);
      throw translatedErr;
    }
  }

  public static async assignAssetsToEmployee(
    assetIds: string[],
    employeeName: string,
    employeeEmail: string,
    adminName: string,
    employeeId?: string,
    comment?: string
  ): Promise<void> {
    const sp = getSP();
    const list = await InventoryItemService.getInventoryList();
    let assignedToId: number | null = null;

    // Ensure 'Note' column exists to guarantee we have a place to save the Assignee
    try {
      const fields = await list.fields();
      if (!fields.some((f: any) => f.InternalName === 'Note')) {
        await list.fields.addMultilineText('Note', { NumberOfLines: 6, RichText: false });
        console.log("Automatically created 'Note' column in SharePoint list.");
      }
    } catch (e) {
      console.warn("Failed to check or create Note column", e);
    }

    // Try to resolve the user in SharePoint by email
    try {
      const user: any = await sp.web.ensureUser(employeeEmail);
      assignedToId = user.data ? user.data.Id : user.Id;
    } catch (e) {
      console.warn(`Could not resolve user ${employeeEmail} in SharePoint. Falling back to current user.`, e);
      try {
        const currentUser = await sp.web.currentUser();
        assignedToId = currentUser.Id;
      } catch (currUserErr) {
        console.warn("Failed to get current user as fallback in assignAssetsToEmployee", currUserErr);
      }
    }

    const updatePromises = assetIds.map(async (assetId) => {
      // 1. Get asset details first
      let assetItem: any = null;
      try {
        assetItem = await list.items.getById(parseInt(assetId))();
      } catch (e) {
        console.warn(`Could not fetch details for asset ${assetId}`, e);
      }

      const assetName = assetItem ? (assetItem.AssetName || assetItem.Asset_x0020_Name || assetItem.Asset || assetItem.Title || "") : "";
      const assetType = assetItem ? (assetItem.AssetType || assetItem.Asset_x0020_Type || assetItem.Type || "") : "";
      const serialNumber = assetItem ? (assetItem.SerialNumber || assetItem.Serial_x0020_Number || "") : "";

      // 2. Perform the update to InventoryList
      const payloadsToTry: any[] = [];
      const baseStatus = { Status: 'Assigned' };

      if (assignedToId !== null) {
        payloadsToTry.push({ ...baseStatus, AssignedToId: { results: [assignedToId] }, Note: `Assigned to: ${employeeName}` });
        payloadsToTry.push({ ...baseStatus, Assigned_x0020_ToId: { results: [assignedToId] }, Note: `Assigned to: ${employeeName}` });
        payloadsToTry.push({ ...baseStatus, AssignedToId: assignedToId, Note: `Assigned to: ${employeeName}` });
        payloadsToTry.push({ ...baseStatus, Assigned_x0020_ToId: assignedToId, Note: `Assigned to: ${employeeName}` });
        payloadsToTry.push({ ...baseStatus, AssignedToId: assignedToId });
        payloadsToTry.push({ ...baseStatus, Assigned_x0020_ToId: assignedToId });
      } else {
        payloadsToTry.push({ ...baseStatus, AssignedTo: employeeName, Note: `Assigned to: ${employeeName}` });
        payloadsToTry.push({ ...baseStatus, Assigned_x0020_To: employeeName, Note: `Assigned to: ${employeeName}` });
        payloadsToTry.push({ ...baseStatus, AssignedTo: employeeName });
        payloadsToTry.push({ ...baseStatus, Assigned_x0020_To: employeeName });
      }

      payloadsToTry.push({ ...baseStatus, Note: `Assigned to: ${employeeName}` });
      payloadsToTry.push({ ...baseStatus, Notes: `Assigned to: ${employeeName}` });
      payloadsToTry.push({ Status: `Assigned to: ${employeeName}`, AssetStatus: `Assigned to: ${employeeName}` }); // Fallback to Status column
      payloadsToTry.push({ ...baseStatus });

      let success = false;
      let lastErr: any;

      for (const payload of payloadsToTry) {
        try {
          await list.items.getById(parseInt(assetId)).update(payload);
          success = true;
          break; // Stop trying if one succeeds
        } catch (err) {
          lastErr = err;
        }
      }

      if (!success) {
        console.error(`All fallback updates failed for asset ${assetId}`, lastErr);
        throw new Error(lastErr.message || "Failed to update asset status");
      }

      // 3. Find matching request in RequestList
      let priority = "Medium";
      let requestedDate = "";
      let reason = "Direct Assignment";
      let matchingRequest: any = null;

      try {
        const requests = await RequestService.getRequests();
        matchingRequest = requests.find(r => {
          const isEmployeeMatch = (employeeId && r.employeeId && r.employeeId.toLowerCase() === employeeId.toLowerCase()) ||
            (employeeName && r.requesterName && r.requesterName.toLowerCase() === employeeName.toLowerCase());

          const isAssetMatch = assetType && r.assetTitle && r.assetTitle.toLowerCase() === assetType.toLowerCase();

          return isEmployeeMatch && isAssetMatch && r.status === 'Approved' && r.assetStatus === 'Pending';
        });

        if (matchingRequest) {
          priority = matchingRequest.priority || "Medium";
          requestedDate = matchingRequest.requestDate || "";
          reason = matchingRequest.reason || "Direct Assignment";
        }
      } catch (err) {
        console.warn("Failed to find matching approved request in RequestList", err);
      }

      // Format dates properly
      const formatDate = (dateStr?: string): string => {
        if (!dateStr) {
          const d = new Date();
          const day = ("0" + d.getDate()).slice(-2);
          const month = ("0" + (d.getMonth() + 1)).slice(-2);
          return `${day}/${month}/${d.getFullYear()}`;
        }
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
          return dateStr;
        }
        const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
        if (match) {
          return `${match[3]}/${match[2]}/${match[1]}`;
        }
        return dateStr;
      };

      const finalRequestedDate = formatDate(requestedDate);
      const finalAssignedDate = formatDate(new Date().toISOString());

      // 4. Update the matching request status to allocated (assetStatus = 'Approved')
      if (matchingRequest) {
        try {
          await InventoryItemService.updateAssetStatus(parseInt(matchingRequest.id, 10), 'Approved', adminName, comment);
        } catch (err) {
          console.warn(`Failed to update assetStatus to Approved for Request ${matchingRequest.id}`, err);
        }
      }

      // 5. Update Mapping List
      try {
        await AssetAssignmentService._ensureMappingListFields();
        await AssetAssignmentService._writeToMappingList(
          employeeName,
          employeeId || "",
          employeeEmail,
          assetName,
          serialNumber,
          priority,
          finalRequestedDate,
          reason,
          finalAssignedDate
        );
      } catch (err) {
        console.warn("Failed to execute Mapping List update logic. Continuing.", err);
      }

      await AuditLogService.addAuditLog({
        title: `Asset activated and assigned to ${employeeName}`,
        action: 'Activated',
        entityType: 'Asset',
        entityId: assetId,
        details: JSON.stringify({
          lifecycle: "DirectAssignment",
          assignedTo: employeeName,
          changedBy: adminName,
          changedAt: new Date().toISOString()
        }),
        user: adminName
      });

      // Trigger Email Notification to Employee on Assignment
      try {
        await EmailService.sendAssignmentNotificationToEmployee({
          employeeName,
          employeeEmail,
          assetName,
          assetId: serialNumber || assetId,
          assignedBy: adminName,
          assignedDate: finalAssignedDate
        });
      } catch (mailErr) {
        console.warn("Failed to send assignment notification email to Employee:", mailErr);
      }
    });

    await Promise.all(updatePromises);
  }

  public static async syncExistingAssignmentsToMappingList(adminName: string): Promise<{ checkedCount: number; syncedCount: number }> {
    let checkedCount = 0;
    let syncedCount = 0;
    try {
      console.log("Starting Mapping List sync...");
      const list = await InventoryItemService.getInventoryList();
      const items = await InventoryItemService.getItems();

      // Filter for assigned items matching the 5 active employees
      const assignedItems = items.filter(item => {
        return EMPLOYEES.some(emp => {
          const normalize = (value: string | undefined): string => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const activeUser = normalize(emp.name);
          if (!activeUser) return false;

          const assignedNorm = normalize(item.assignedTo);
          const isAssigned = assignedNorm && (assignedNorm === activeUser || assignedNorm.includes(activeUser) || activeUser.includes(assignedNorm));
          const isNoted = (item.note || '').toLowerCase().includes('assigned to:') && normalize(item.note).includes(activeUser);
          const isStatus = (item.status || '').toLowerCase().includes('assigned to:') && normalize(item.status).includes(activeUser);

          return !!(isAssigned || isNoted || isStatus);
        });
      });

      checkedCount = assignedItems.length;

      if (assignedItems.length === 0) {
        console.log("No assigned assets found for the 5 active employees.");
        return { checkedCount, syncedCount };
      }

      await AssetAssignmentService._ensureMappingListFields();
      const mappingList = await AssetAssignmentService.getMappingList();
      const mappingItems = await mappingList.items();

      const requests = await RequestService.getRequests();

      // Resolve the Mapping List field names
      const mappingFields: any[] = await mappingList.fields.select("InternalName", "Title", "TypeAsString")();

      const findMappingField = (searchStr: string, fallback: string): string => {
        let field = mappingFields.find((f: any) => f.InternalName.toLowerCase() === searchStr.toLowerCase());
        if (field) return field.InternalName;

        field = mappingFields.find((f: any) => f.Title.toLowerCase() === searchStr.toLowerCase());
        if (field) return field.InternalName;

        const normalizedSearch = searchStr.toLowerCase().replace(/[^a-z0-9]/g, '');
        field = mappingFields.find((f: any) => f.Title.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedSearch);
        if (field) return field.InternalName;

        field = mappingFields.find((f: any) => f.Title.toLowerCase().replace(/[^a-z0-9]/g, '').indexOf(normalizedSearch) >= 0);
        if (field) return field.InternalName;

        return fallback;
      };

      const serialNumberFieldName = findMappingField("serialnumber", "SerialNumber");

      for (const asset of assignedItems) {
        // Check if this asset is already in the Mapping List
        const alreadyMapped = mappingItems.some((m: any) => {
          const mSerial = m[serialNumberFieldName] || m.SerialNumber || m.Serial_x0020_Number || "";
          return mSerial.toString().toLowerCase() === asset.serialNumber.toString().toLowerCase();
        });

        if (alreadyMapped) {
          console.log(`Asset ${asset.assetName || asset.title} (${asset.serialNumber}) is already in Mapping List.`);
          continue;
        }

        const employee = EMPLOYEES.find(emp => {
          const normalize = (value: string | undefined): string => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const activeUser = normalize(emp.name);
          if (!activeUser) return false;

          const assignedNorm = normalize(asset.assignedTo);
          const isAssigned = assignedNorm && (assignedNorm === activeUser || assignedNorm.includes(activeUser) || activeUser.includes(assignedNorm));
          const isNoted = (asset.note || '').toLowerCase().includes('assigned to:') && normalize(asset.note).includes(activeUser);
          const isStatus = (asset.status || '').toLowerCase().includes('assigned to:') && normalize(asset.status).includes(activeUser);

          return !!(isAssigned || isNoted || isStatus);
        });

        const employeeName = employee ? employee.name : (asset.assignedTo || "Unknown");
        const employeeId = employee ? employee.id : "";
        const employeeEmail = employee ? employee.email : "";

        const assetAssignedTo = employeeName;
        console.log(`Syncing missing assigned asset to Mapping List: ${asset.assetName || asset.title} (${asset.serialNumber}) for ${assetAssignedTo}`);

        // Find matching request
        let priority = "Medium";
        let requestedDate = "";
        let reason = "Direct Assignment";
        let matchingRequest: any = null;

        const assetType = asset.assetType || "";
        matchingRequest = requests.find(r => {
          const isEmployeeMatch = (employeeId && r.employeeId && r.employeeId.toLowerCase() === employeeId.toLowerCase()) ||
            (employeeName && r.requesterName && r.requesterName.toLowerCase() === employeeName.toLowerCase());

          const isAssetMatch = assetType && r.assetTitle && r.assetTitle.toLowerCase() === assetType.toLowerCase();

          return isEmployeeMatch && isAssetMatch && r.status === 'Approved';
        });

        if (matchingRequest) {
          priority = matchingRequest.priority || "Medium";
          requestedDate = matchingRequest.requestDate || "";
          reason = matchingRequest.reason || "Direct Assignment";
        }

        // Format dates properly
        const formatDate = (dateStr?: string): string => {
          if (!dateStr) {
            const d = new Date();
            const day = ("0" + d.getDate()).slice(-2);
            const month = ("0" + (d.getMonth() + 1)).slice(-2);
            return `${day}/${month}/${d.getFullYear()}`;
          }
          if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
            return dateStr;
          }
          const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
          if (match) {
            return `${match[3]}/${match[2]}/${match[1]}`;
          }
          return dateStr;
        };

        const finalRequestedDate = formatDate(requestedDate);
        const finalAssignedDate = formatDate(asset.assignedDate || new Date().toISOString());

        // Update the matching request status to allocated (assetStatus = 'Approved')
        if (matchingRequest && matchingRequest.assetStatus === 'Pending') {
          try {
            await InventoryItemService.updateAssetStatus(parseInt(matchingRequest.id, 10), 'Approved', adminName);
          } catch (err) {
            console.warn(`Failed to update assetStatus to Approved for Request ${matchingRequest.id}`, err);
          }
        }

        // Add to Mapping List
        const assetName = asset.assetName || asset.title || "";
        const serialNumber = asset.serialNumber || "";

        try {
          await AssetAssignmentService._writeToMappingList(
            employeeName,
            employeeId,
            employeeEmail,
            assetName,
            serialNumber,
            priority,
            finalRequestedDate,
            reason,
            finalAssignedDate
          );
          syncedCount++;
        } catch (err) {
          console.warn(`Failed to write synced record for ${employeeName} to Mapping List.`, err);
        }
      }
    } catch (e) {
      console.error("Failed to sync existing assignments to Mapping List:", e);
      throw e;
    }
    return { checkedCount, syncedCount };
  }

  public static async diagnoseMappingListFields(): Promise<string> {
    try {
      const mappingList = await AssetAssignmentService.getMappingList();
      const fields: any[] = await mappingList.fields.select("InternalName", "Title", "TypeAsString")();
      const items = await mappingList.items.select("ID")();

      let output = `Mapping List Diagnostics:\n`;
      output += `- List URL Title: "${mappingList.Title || "Mapping List"}"\n`;
      output += `- Record Count: ${items.length}\n`;
      output += `- Available Fields in List:\n`;

      fields.forEach((f: any) => {
        output += `  * InternalName: "${f.InternalName}", Title: "${f.Title}", Type: "${f.TypeAsString}"\n`;
      });

      return output;
    } catch (e: any) {
      return `Failed to diagnose Mapping List schema. Error: ${e.message || JSON.stringify(e)}`;
    }
  }
}
