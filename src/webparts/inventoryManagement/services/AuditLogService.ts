import { getSP } from "../pnpjsConfig";
import { IEventLog } from "../models/IEventLog";
import { SharePointBaseService } from "./base/SharePointBaseService";

export class AuditLogService {
  public static async addAuditLog(log: Omit<IEventLog, 'id' | 'timestamp'>): Promise<void> {
    const sp = getSP();
    try {
      await sp.web.lists.getByTitle(SharePointBaseService.EVENT_LOG_LIST).items.add({
        Title: log.title,
        Action: log.action,
        EntityType: log.entityType,
        EntityId: log.entityId,
        Details: log.details,
        User: log.user
      });
    } catch (error: any) {
      console.error("Error adding audit log to SharePoint:", error);
    }
  }

  public static async getAuditLogs(): Promise<IEventLog[]> {
    const logs: IEventLog[] = [];
    const processedEventLogIds = new Set<string>();

    const formatTimestamp = (isoString?: string): string => {
      if (!isoString) return new Date().toISOString().replace('T', ' ').substring(0, 19);
      try {
        const formatted = isoString.replace('T', ' ');
        if (formatted.indexOf('.') > 0) {
          return formatted.substring(0, formatted.indexOf('.'));
        }
        if (formatted.indexOf('Z') > 0) {
          return formatted.substring(0, formatted.indexOf('Z'));
        }
        return formatted.substring(0, 19);
      } catch {
        return isoString.replace('T', ' ').substring(0, 19);
      }
    };

    const sp = getSP();

    // 1. Fetch from EventLogList (the audit logging list)
    try {
      const eventLogList = sp.web.lists.getByTitle(SharePointBaseService.EVENT_LOG_LIST);
      const eventItems = await eventLogList.items.select("ID", "Title", "Action", "EntityType", "EntityId", "Details", "User", "Created")();

      eventItems.forEach((item: any) => {
        let assetName = "";
        let detailsText = item.Details || "";
        let actionText = item.Action || "";

        // Parse JSON details if possible
        if (detailsText.trim().startsWith("{") && detailsText.trim().endsWith("}")) {
          try {
            const parsed = JSON.parse(detailsText);
            assetName = parsed.assetName || parsed.assetTitle || parsed.Title || "";
            if (parsed.lifecycle) {
              if (parsed.lifecycle === "DirectAssignment") {
                detailsText = `Asset assigned to employee`;
                actionText = "admin assigned";
              } else if (parsed.lifecycle === "Approved") {
                detailsText = `Approved request for ${assetName || "Asset"}`;
                actionText = "manager approved";
              } else if (parsed.lifecycle === "Rejected" || parsed.lifecycle === "Declined") {
                detailsText = `Rejected request for ${assetName || "Asset"}`;
                actionText = "manager rejected";
              } else if (parsed.lifecycle === "Submitted") {
                detailsText = `Submitted asset request for ${assetName || "Asset"}`;
                actionText = "created";
              } else if (parsed.lifecycle === "ReturnRequested") {
                detailsText = `Requested return of ${assetName || "Asset"}`;
                actionText = "return requested";
              } else if (parsed.lifecycle === "ReturnApproved") {
                detailsText = `Approved return request for ${assetName || "Asset"}`;
                actionText = "return approved";
              } else if (parsed.lifecycle === "ReturnRejected") {
                detailsText = `Rejected return request for ${assetName || "Asset"}`;
                actionText = "return rejected";
              } else if (parsed.lifecycle === "ReturnCompleted") {
                detailsText = `Completed return of ${assetName || "Asset"}`;
                actionText = "return completed";
              }
            } else if (parsed.assetStatus === "Approved" || parsed.lifecycle === "AssetStatusUpdated") {
              detailsText = `Assigned ${assetName || "Asset"}`;
              actionText = "admin assigned";
            }
          } catch (e) {
            // Keep detailsText as string
          }
        }

        const titleLower = (item.Title || "").toLowerCase();
        const actionLower = (item.Action || "").toLowerCase();
        const detailsLower = (detailsText || "").toLowerCase();

        // High fidelity text mapping
        if (actionLower === "create") {
          actionText = "created";
        } else if (actionLower === "delete") {
          actionText = "deleted";
        }

        if (titleLower.includes("directly assigned") || detailsLower.includes("assigned to employee") || detailsLower.includes("assigned to:")) {
          actionText = "admin assigned";
          detailsText = "Asset assigned to employee";
        } else if (titleLower.includes("approved return request") || detailsLower.includes("approved return request")) {
          actionText = "return approved";
          detailsText = `Approved return request for ${assetName || "Asset"}`;
        } else if (titleLower.includes("rejected return request") || detailsLower.includes("rejected return request")) {
          actionText = "return rejected";
          detailsText = `Rejected return request for ${assetName || "Asset"}`;
        } else if (titleLower.includes("completed return") || detailsLower.includes("completed return")) {
          actionText = "return completed";
          detailsText = `Completed return of ${assetName || "Asset"}`;
        } else if (titleLower.includes("requested return") || detailsLower.includes("requested return")) {
          actionText = "return requested";
          detailsText = `Requested return of ${assetName || "Asset"}`;
        } else if (titleLower.includes("approved request") || detailsLower.includes("approved request")) {
          actionText = "manager approved";
          detailsText = `Approved request for ${assetName || "Asset"}`;
        } else if (titleLower.includes("rejected request") || detailsLower.includes("rejected request") || titleLower.includes("declined request") || detailsLower.includes("declined request")) {
          actionText = "manager rejected";
          detailsText = `Rejected request for ${assetName || "Asset"}`;
        } else if (titleLower.includes("created request") || detailsLower.includes("submitted asset request")) {
          actionText = "created";
          detailsText = `Submitted asset request for ${assetName || "Asset"}`;
        } else if (titleLower.includes("created asset") || detailsLower.includes("added to inventory")) {
          actionText = "created";
          detailsText = "Asset was added to inventory";
        } else if (titleLower.includes("deleted asset") || detailsLower.includes("retired due to damage")) {
          actionText = "deleted";
          detailsText = "Asset retired due to damage";
        } else if (detailsLower.includes("under investigation") || detailsLower.includes("in progress")) {
          actionText = "status updated to in progress";
          detailsText = "Under investigation";
        } else if (detailsLower.includes("resolved") || detailsLower.includes("replacement cable")) {
          actionText = "status updated to resolved";
          detailsText = "Replacement cable sourced";
        }

        // Try to extract assetName if empty
        if (!assetName) {
          if (titleLower.includes("created asset:")) {
            assetName = item.Title.substring(titleLower.indexOf("created asset:") + 14).trim();
          } else if (titleLower.includes("updated asset:")) {
            assetName = item.Title.substring(titleLower.indexOf("updated asset:") + 14).trim();
          } else if (titleLower.includes("deleted asset:")) {
            assetName = item.Title.substring(titleLower.indexOf("deleted asset:") + 14).trim();
          } else if (titleLower.includes("request for")) {
            assetName = item.Title.substring(titleLower.indexOf("request for") + 11).trim();
          }
        }

        logs.push({
          id: `event-log-${item.ID}`,
          title: item.Title || "",
          action: actionText,
          entityType: item.EntityType || "",
          entityId: item.EntityId || "",
          assetName: assetName,
          details: detailsText,
          user: item.User || "System",
          timestamp: formatTimestamp(item.Created)
        });

        processedEventLogIds.add(`${item.EntityType}-${item.EntityId}-${item.Action}-${formatTimestamp(item.Created).substring(0, 16)}`);
      });
    } catch (err) {
      console.warn("Could not fetch EventLogList, relying on live list generation", err);
    }

    // 2. Fetch from InventoryList for dynamic fallback logs
    try {
      let list: any;
      try {
        list = sp.web.lists.getByTitle(SharePointBaseService.LIST_NAME);
        await list.select("Title")();
      } catch {
        list = sp.web.lists.getByTitle("Inventory List");
      }
      const fields: any[] = await list.fields.select("InternalName", "Title", "TypeAsString")();
      const findFieldInternalName = (searchStr: string, fallback: string): string => {
        let field = fields.find((f: any) => f.InternalName.toLowerCase() === searchStr.toLowerCase());
        if (field) return field.InternalName;
        field = fields.find((f: any) => f.InternalName.toLowerCase().replace(/_x0020_/g, '').indexOf(searchStr.toLowerCase()) >= 0);
        if (field) return field.InternalName;
        field = fields.find((f: any) => f.Title.toLowerCase().replace(/[^a-z0-9]/g, '').indexOf(searchStr.toLowerCase()) >= 0);
        return field ? field.InternalName : fallback;
      };

      const assetNameKey = findFieldInternalName("assetname", "AssetName");
      const statusKey = findFieldInternalName("status", "Status");

      const inventoryItems = await list.items.select("ID", "Title", assetNameKey, statusKey, "Created", "Modified", "Author/Title", "Editor/Title").expand("Author", "Editor")();

      inventoryItems.forEach((item: any) => {
        const itemCreated = formatTimestamp(item.Created);
        const itemModified = formatTimestamp(item.Modified);
        const assetName = item[assetNameKey] || item.Title || "";
        const itemStatus = item[statusKey] || "";

        // Add dynamic Create event
        const createKey = `Asset-${item.ID}-Create-${itemCreated.substring(0, 16)}`;
        if (!processedEventLogIds.has(createKey)) {
          logs.push({
            id: `asset-create-${item.ID}`,
            title: `Created Asset: ${item.Title}`,
            action: 'created',
            entityType: 'Asset',
            entityId: item.ID.toString(),
            assetName: assetName,
            details: `Asset was added to inventory`,
            user: item.Author?.Title || "System",
            timestamp: itemCreated
          });
        }

        // Add dynamic Update event if item has been updated
        if (item.Modified && item.Created && new Date(item.Modified).getTime() - new Date(item.Created).getTime() > 5000) {
          const updateKey = `Asset-${item.ID}-Update-${itemModified.substring(0, 16)}`;
          const updateKeyAssigned = `Asset-${item.ID}-admin assigned-${itemModified.substring(0, 16)}`;
          if (!processedEventLogIds.has(updateKey) && !processedEventLogIds.has(updateKeyAssigned)) {
            let actionText = "updated";
            let detailsText = "Asset details were modified";

            if (itemStatus.toLowerCase().includes("assigned") || itemStatus.toLowerCase() === "active" || itemStatus.toLowerCase() === "in use") {
              actionText = "admin assigned";
              detailsText = "Asset assigned to employee";
            } else if (itemStatus.toLowerCase().includes("maintenance")) {
              actionText = "status updated to in progress";
              detailsText = "Under investigation";
            } else if (itemStatus.toLowerCase() === "in stock" || itemStatus.toLowerCase() === "yes") {
              actionText = "status updated to resolved";
              detailsText = "Replacement cable sourced";
            }

            logs.push({
              id: `asset-update-${item.ID}-${new Date(item.Modified).getTime()}`,
              title: `Updated Asset: ${item.Title}`,
              action: actionText,
              entityType: 'Asset',
              entityId: item.ID.toString(),
              assetName: assetName,
              details: detailsText,
              user: item.Editor?.Title || "System",
              timestamp: itemModified
            });
          }
        }
      });
    } catch (err) {
      console.warn("Could not fetch InventoryList for audit logs", err);
    }

    // 3. Fetch from RequestList for dynamic fallback logs
    try {
      let reqList: any;
      try {
        reqList = sp.web.lists.getByTitle(SharePointBaseService.REQUEST_LIST_NAME);
        await reqList.select("Title")();
      } catch {
        reqList = sp.web.lists.getByTitle("Request List");
      }
      const requestItems = await SharePointBaseService._fetchItemsWithExpandedUsers(reqList);

      requestItems.forEach((item: any) => {
        const keys = Object.keys(item);
        const findKey = (searchStr: string) => {
          const nonIdMatch = keys.find(k => {
            const kl = k.toLowerCase().replace(/_x0020_/g, '');
            return kl.indexOf(searchStr) >= 0 && !kl.endsWith("id");
          });
          if (nonIdMatch) return nonIdMatch;
          return keys.find(k => k.toLowerCase().replace(/_x0020_/g, '').indexOf(searchStr) >= 0);
        };

        const employeeKey = findKey("requester") || findKey("employee") || "Employee";
        const selectAssetKey = findKey("assettype") || findKey("selectasset") || findKey("type") || "SelectAsset";
        const statusKey = keys.find(key => SharePointBaseService._isBusinessStatusKey(key)) || "RequestStatus";
        const assetStatusKey = findKey("assetstatus") || "AssetStatus";

        const reqAssetName = item[selectAssetKey] || item.Title || "Unknown Asset";
        const rawEmp = item[employeeKey] || item.Employee || item.Author;
        const reqUser = (() => {
          if (!rawEmp) return item.Title || "System";
          if (typeof rawEmp === 'string') return rawEmp;
          if (Array.isArray(rawEmp)) return rawEmp.map((a: any) => a.Title || a.Name || "").join(', ');
          if (typeof rawEmp === 'object') return rawEmp.Title || rawEmp.Name || JSON.stringify(rawEmp);
          return rawEmp.toString();
        })();

        const itemCreated = formatTimestamp(item.Created);
        const itemModified = formatTimestamp(item.Modified);
        const requestStatus = item[statusKey] || "";
        const assetStatus = item[assetStatusKey] || "";

        // Add dynamic Create event
        const createKey = `Request-${item.ID}-Create-${itemCreated.substring(0, 16)}`;
        if (!processedEventLogIds.has(createKey)) {
          logs.push({
            id: `request-create-${item.ID}`,
            title: `Created Request: ${reqAssetName}`,
            action: 'created',
            entityType: 'Request',
            entityId: item.ID.toString(),
            assetName: reqAssetName,
            details: `Submitted asset request for ${reqAssetName}`,
            user: reqUser,
            timestamp: itemCreated
          });
        }

        // Add dynamic Update event
        if (item.Modified && item.Created && new Date(item.Modified).getTime() - new Date(item.Created).getTime() > 5000) {
          const updateKey = `Request-${item.ID}-Update-${itemModified.substring(0, 16)}`;
          if (!processedEventLogIds.has(updateKey)) {
            if (requestStatus.toLowerCase().includes("approv")) {
              logs.push({
                id: `request-approve-${item.ID}-${new Date(item.Modified).getTime()}`,
                title: `Approved Request: ${reqAssetName}`,
                action: 'manager approved',
                entityType: 'Request',
                entityId: item.ID.toString(),
                assetName: reqAssetName,
                details: `Approved request for ${reqAssetName}`,
                user: reqUser,
                timestamp: itemModified
              });

              if (assetStatus.toLowerCase().includes("approv")) {
                logs.push({
                  id: `request-assign-${item.ID}-${new Date(item.Modified).getTime()}`,
                  title: `Assigned Request: ${reqAssetName}`,
                  action: 'admin assigned',
                  entityType: 'Request',
                  entityId: item.ID.toString(),
                  assetName: reqAssetName,
                  details: `Assigned ${reqAssetName}`,
                  user: reqUser,
                  timestamp: itemModified
                });
              }
            } else if (requestStatus.toLowerCase().includes("reject") || requestStatus.toLowerCase().includes("declin")) {
              logs.push({
                id: `request-reject-${item.ID}-${new Date(item.Modified).getTime()}`,
                title: `Rejected Request: ${reqAssetName}`,
                action: 'manager rejected',
                entityType: 'Request',
                entityId: item.ID.toString(),
                assetName: reqAssetName,
                details: `Rejected request for ${reqAssetName}`,
                user: reqUser,
                timestamp: itemModified
              });
            } else {
              logs.push({
                id: `request-update-${item.ID}-${new Date(item.Modified).getTime()}`,
                title: `Updated Request: ${reqAssetName}`,
                action: 'updated',
                entityType: 'Request',
                entityId: item.ID.toString(),
                assetName: reqAssetName,
                details: `Request details were modified`,
                user: reqUser,
                timestamp: itemModified
              });
            }
          }
        }
      });
    } catch (err) {
      console.warn("Could not fetch RequestList for audit logs", err);
    }

    // Sort logs by timestamp descending
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return logs;
  }
}
