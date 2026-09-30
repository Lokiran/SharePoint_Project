import { SPQueryable } from "@pnp/sp";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IInventoryItem } from "../models/IInventoryItem";
import { InventoryItemService } from "./InventoryItemService";
import { AssetAssignmentService } from "./AssetAssignmentService";
import { IncidentService } from "./IncidentService";
import { SharePointBaseService } from "./base/SharePointBaseService";
import { getPersonDisplayName } from "../utils/SharePointItemUtils";

/** One holder of the asset, from a Mapping List row (written on every assignment). */
export interface IAssetAssignmentRecord {
  employeeName: string;
  employeeId?: string;
  assignedDate?: string;
  assignmentId?: string;
}

export interface IAssetServiceRecord {
  kind: 'incident' | 'replacement';
  reference: string;
  type: string;
  status: string;
  priority?: string;
  date?: string;
  description?: string;
}

export interface IAssetTechnicalInfo {
  itemId: string;
  listTitle?: string;
  created?: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
  version?: string;
  itemUrl?: string;
}

const same = (a?: string, b?: string): boolean =>
  !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase();

/** Belongs to this asset: serial number first (unique), else the exact asset name. */
const matchesAsset = (item: IInventoryItem, serial?: string, name?: string): boolean =>
  (item.serialNumber ? same(item.serialNumber, serial) : false) || (!serial && same(item.assetName, name));

/**
 * Per-asset history for the Inventory details panel. Every method is read-only and never
 * throws: a missing list or column simply yields an empty result.
 */
export class AssetHistoryService {
  /** Everyone who has held the asset, newest first. */
  public static async getAssignments(item: IInventoryItem): Promise<IAssetAssignmentRecord[]> {
    try {
      const list = await AssetAssignmentService.getMappingList();
      const schema = await SharePointBaseService.getListFieldsMetadata(list);
      const field = (aliases: string[]): string | null => SharePointBaseService._resolveFieldInternalName(schema, aliases);
      const serialCol = field(["serialnumber", "serial number"]);
      const assetCol = field(["assetname", "asset name"]);
      const employeeCol = field(["employe", "employee", "employee name", "employeename"]) || "Title";
      const employeeIdCol = field(["employeeid", "employee id", "employeid", "employe id"]);
      const dateCol = field(["assigneddate", "assigned date"]);
      const assignmentCol = field(["assignmentid", "assignment id"]);

      const rows: any[] = await SharePointBaseService._fetchItemsWithExpandedUsers(list);
      return rows
        .filter(r => {
          const serial = serialCol ? String(r[serialCol] || '') : '';
          const name = assetCol ? String(r[assetCol] || '') : '';
          return item.serialNumber ? same(serial, item.serialNumber) : same(name, item.assetName);
        })
        .map(r => ({
          employeeName: getPersonDisplayName(r[employeeCol]) || getPersonDisplayName(r.Title) || '—',
          employeeId: employeeIdCol ? String(r[employeeIdCol] || '') || undefined : undefined,
          assignedDate: (dateCol && r[dateCol]) || r.Created,
          assignmentId: assignmentCol ? String(r[assignmentCol] || '') || undefined : undefined
        }))
        .sort((a, b) => new Date(b.assignedDate || 0).getTime() - new Date(a.assignedDate || 0).getTime());
    } catch (err) {
      console.warn("[AssetHistoryService] Could not read assignment history:", err);
      return [];
    }
  }

  /** Incidents and replacement requests raised against the asset, newest first. */
  public static async getServiceRecords(item: IInventoryItem, context: WebPartContext): Promise<IAssetServiceRecord[]> {
    const service = new IncidentService(context);
    const [incidents, replacements] = await Promise.all([
      service.getEmployeeIncidentHistory('', true).catch(() => [] as any[]),
      service.getEmployeeReplacementHistory('', true).catch(() => [] as any[])
    ]);
    const toRecord = (r: any, kind: 'incident' | 'replacement'): IAssetServiceRecord => ({
      kind,
      reference: r.incidentId || r.id,
      type: r.issueType || r.incidentType || (kind === 'replacement' ? 'Replacement Request' : 'Incident'),
      status: r.status || 'Open',
      priority: r.priority,
      date: r.reportedDate || r.raisedDate || r.requestDate,
      description: r.issueDescription || r.description
    });
    return incidents.filter(r => matchesAsset(item, r.serialNo, r.assetName)).map(r => toRecord(r, 'incident'))
      .concat(replacements.filter(r => matchesAsset(item, r.serialNo, r.assetName)).map(r => toRecord(r, 'replacement')))
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  }

  /** SharePoint facts about the list item: who created and last changed it, its version and link. */
  public static async getTechnicalInfo(item: IInventoryItem): Promise<IAssetTechnicalInfo> {
    const info: IAssetTechnicalInfo = { itemId: item.id };
    try {
      const list = await InventoryItemService.getInventoryList();
      try {
        const raw: any = await list.items.getById(parseInt(item.id, 10))
          .select("ID", "Created", "Modified", "OData__UIVersionString", "Author/Title", "Editor/Title")
          .expand("Author", "Editor")();
        info.created = raw.Created;
        info.modified = raw.Modified;
        info.createdBy = raw.Author ? raw.Author.Title : undefined;
        info.modifiedBy = raw.Editor ? raw.Editor.Title : undefined;
        info.version = raw.OData__UIVersionString;
      } catch (err) {
        console.warn("[AssetHistoryService] Could not read item metadata:", err);
      }
      try {
        const [meta, folder]: any[] = await Promise.all([
          list.select("Title")(),
          SPQueryable(list, "RootFolder").select("ServerRelativeUrl")()
        ]);
        info.listTitle = meta.Title;
        if (folder && folder.ServerRelativeUrl) {
          info.itemUrl = `${window.location.origin}${folder.ServerRelativeUrl}/DispForm.aspx?ID=${item.id}`;
        }
      } catch (err) {
        console.warn("[AssetHistoryService] Could not read list details:", err);
      }
    } catch (err) {
      console.warn("[AssetHistoryService] Could not open the inventory list:", err);
    }
    return info;
  }
}
