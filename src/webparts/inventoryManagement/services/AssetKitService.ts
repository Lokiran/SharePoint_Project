import { getAppConfig } from "../config/AppConfig";
import { IAssetKit, DEFAULT_KITS, parseKitItems, formatKitItems, IOffboardingRow } from "../utils/KitUtils";
import { ListProvisioningService, IProvisionedField } from "./base/ListProvisioningService";
import { RequestService } from "./RequestService";
import { ReturnRequestService } from "./ReturnRequestService";
import { AuditLogService } from "./AuditLogService";
import { IRequest } from "../models/IRequest";
import { findOpenRequest } from "../utils/RequestDuplicateUtils";

const KIT_FIELDS: IProvisionedField[] = [
  { name: "KitItems", type: "Note" },
  { name: "KitDescription", type: "Note" }
];

export interface IKitRecipient {
  displayName: string;
  email: string;
  employeeId?: string;
}

export interface IKitRequestOptions {
  startDate?: string;
  notes?: string;
  managerName?: string;
}

export interface IBatchResult {
  succeeded: string[];
  failed: { label: string; error: string }[];
}

/**
 * Onboarding kits (Asset Kits list: Title, KitItems, KitDescription) and the
 * offboarding "raise all returns" action. Kit requests go through the normal
 * request → manager approval → assignment workflow, one request per asset type.
 */
export class AssetKitService {
  private static get listTitle(): string {
    return getAppConfig().lists.assetKits;
  }

  /** Kits from the list; the built-in kits when the list does not exist or is empty. */
  public static async getKits(): Promise<{ kits: IAssetKit[]; fromList: boolean }> {
    const list = await ListProvisioningService.tryGetList(AssetKitService.listTitle);
    if (!list) return { kits: DEFAULT_KITS, fromList: false };
    const items: any[] = await list.items.select("ID", "Title", "KitItems", "KitDescription").top(500)();
    const kits = items
      .map(i => ({
        id: i.ID,
        name: (i.Title || "").trim(),
        description: i.KitDescription || "",
        lines: parseKitItems(i.KitItems || "")
      }))
      .filter(k => k.name && k.lines.length > 0);
    return kits.length > 0 ? { kits, fromList: true } : { kits: DEFAULT_KITS, fromList: false };
  }

  /** Creates or updates a kit (creates the Asset Kits list on first save). */
  public static async saveKit(kit: IAssetKit): Promise<void> {
    const list = await ListProvisioningService.ensureList(
      AssetKitService.listTitle,
      "Standard asset bundles for onboarding new starters (managed from the Inventory app).",
      KIT_FIELDS
    );
    const payload = { Title: kit.name.trim(), KitItems: formatKitItems(kit.lines), KitDescription: kit.description || "" };
    if (kit.id) {
      await list.items.getById(kit.id).update(payload);
    } else {
      await list.items.add(payload);
    }
  }

  public static async deleteKit(id: number): Promise<void> {
    const list = await ListProvisioningService.tryGetList(AssetKitService.listTitle);
    if (list) await list.items.getById(id).delete();
  }

  /** Raises one asset request per kit line for the new starter. Continues past failures and reports them. */
  public static async requestKit(
    kit: IAssetKit,
    recipient: IKitRecipient,
    options: IKitRequestOptions,
    currentUserName: string,
    currentUserRole: string
  ): Promise<IBatchResult> {
    const result: IBatchResult = { succeeded: [], failed: [] };
    const startText = options.startDate ? `, starting ${new Date(options.startDate).toLocaleDateString()}` : "";
    const reason = `Onboarding kit "${kit.name}" for new starter ${recipient.displayName}${startText}.` +
      (options.notes ? ` ${options.notes.trim()}` : "");

    // One open request per person and asset type: a kit line is skipped while the new starter
    // already has a request for that type in progress. If the check cannot run, the kit goes ahead.
    const existing: IRequest[] = await RequestService.getRequests().catch(() => []);

    for (const line of kit.lines) {
      const open = findOpenRequest(existing, recipient.displayName, line.assetType);
      if (open) {
        result.failed.push({ label: line.assetType, error: `Skipped: ${recipient.displayName} already has an open request for this type (${open.requestKey || `#${open.id}`}).` });
        continue;
      }
      try {
        await RequestService.addRequest({
          requesterName: recipient.displayName,
          requesterEmail: recipient.email,
          employeeId: recipient.employeeId,
          assetId: "",
          assetTitle: line.assetType,
          quantity: line.quantity,
          priority: "High",
          reason,
          managerName: options.managerName,
          requestDate: new Date().toISOString()
        }, currentUserName, currentUserRole, false);
        result.succeeded.push(line.assetType);
        // A second line of the same type in this kit counts as a duplicate too.
        existing.push({ id: `kit-${existing.length}`, requestKey: "", requesterName: recipient.displayName, assetId: "", assetTitle: line.assetType, quantity: line.quantity, status: "Pending", requestDate: "" });
      } catch (e: any) {
        result.failed.push({ label: line.assetType, error: e && e.message ? e.message : String(e) });
      }
    }

    await AuditLogService.addAuditLog({
      title: `Onboarding kit requested: ${kit.name} for ${recipient.displayName}`,
      action: "Create",
      entityType: "Request",
      entityId: `KIT-${Date.now()}`,
      details: JSON.stringify({
        lifecycle: "OnboardingKitRequested",
        kit: kit.name,
        employee: recipient.displayName,
        startDate: options.startDate || "",
        requested: result.succeeded,
        failed: result.failed.map(f => f.label)
      }),
      user: currentUserName
    });

    return result;
  }

  /** Raises a return request for every held asset that has no return in progress. */
  public static async raiseOffboardingReturns(
    rows: IOffboardingRow[],
    employee: { name: string; email?: string },
    lastDay: string | undefined,
    currentUserName: string
  ): Promise<IBatchResult> {
    const result: IBatchResult = { succeeded: [], failed: [] };
    const dayText = lastDay ? ` Last working day: ${new Date(lastDay).toLocaleDateString()}.` : "";

    for (const row of rows.filter(r => r.state === "held")) {
      const label = `${row.assetName}${row.serialNumber ? ` (${row.serialNumber})` : ""}`;
      try {
        await ReturnRequestService.addReturnRequest({
          title: `Offboarding return: ${row.assetName}`,
          assetId: row.assetId,
          assetName: row.assetName,
          assetType: row.assetType,
          serialNumber: row.serialNumber,
          requesterName: employee.name,
          requesterEmail: employee.email,
          requestDate: new Date().toISOString(),
          returnReason: `Offboarding: employee leaving.${dayText} Raised by ${currentUserName}.`,
          proposedCondition: (row.item && row.item.condition) || "Good"
        }, currentUserName);
        result.succeeded.push(label);
      } catch (e: any) {
        result.failed.push({ label, error: e && e.message ? e.message : String(e) });
      }
    }
    return result;
  }
}
