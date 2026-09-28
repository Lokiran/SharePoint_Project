import { getSP } from "../pnpjsConfig";
import "@pnp/sp/site-groups/web";
import { getAppConfig } from "../config/AppConfig";
import { IInventoryItem } from "../models/IInventoryItem";
import { IStockThreshold, IStockLevel, evaluateStockLevels, planStockAlerts } from "../utils/StockUtils";
import { ListProvisioningService, IProvisionedField } from "./base/ListProvisioningService";
import { EmailService } from "./EmailService";

const THRESHOLD_FIELDS: IProvisionedField[] = [
  { name: "MinimumStock", type: "Number" },
  { name: "LastAlertSent", type: "DateTime" }
];

export interface IStockAlertResult {
  levels: IStockLevel[];
  alerted: string[];
  reset: string[];
}

const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Low-stock thresholds and alerts.
 *
 * Thresholds live in the "Stock Thresholds" list (Title = asset type, MinimumStock,
 * LastAlertSent). A type without a row uses the default minimum from the property pane.
 * The list is created the first time an admin saves thresholds or an alert is sent.
 */
export class StockThresholdService {
  private static _checkInFlight: Promise<IStockAlertResult | undefined> | undefined;

  private static get listTitle(): string {
    return getAppConfig().lists.stockThresholds;
  }

  public static async getThresholds(): Promise<IStockThreshold[]> {
    const list = await ListProvisioningService.tryGetList(StockThresholdService.listTitle);
    if (!list) return [];
    const items: any[] = await list.items.select("ID", "Title", "MinimumStock", "LastAlertSent").top(5000)();
    return items
      .filter(i => (i.Title || "").trim())
      .map(i => ({
        id: i.ID,
        assetType: (i.Title || "").trim(),
        minimumStock: i.MinimumStock === null || i.MinimumStock === undefined ? undefined : Number(i.MinimumStock),
        lastAlertSent: i.LastAlertSent || undefined
      }));
  }

  private static async _ensureList(): Promise<any> {
    return ListProvisioningService.ensureList(
      StockThresholdService.listTitle,
      "Minimum available stock per asset type, used for low-stock alerts (managed from the Inventory app).",
      THRESHOLD_FIELDS
    );
  }

  /**
   * Saves per-type minimums. `undefined` minimum = use the default (the row is kept so
   * alert state survives). Rows are matched by asset type, case-insensitively.
   */
  public static async saveThresholds(rows: { assetType: string; minimumStock?: number }[]): Promise<void> {
    const list = await StockThresholdService._ensureList();
    const existing = await StockThresholdService.getThresholds();
    for (const row of rows) {
      const type = (row.assetType || "").trim();
      if (!type) continue;
      const current = existing.find(t => t.assetType.toLowerCase() === type.toLowerCase());
      const minimum = row.minimumStock === undefined ? null : Math.max(0, Math.floor(row.minimumStock));
      if (current && current.id) {
        if ((current.minimumStock ?? null) !== minimum) {
          await list.items.getById(current.id).update({ MinimumStock: minimum });
        }
      } else if (minimum !== null) {
        await list.items.add({ Title: type, MinimumStock: minimum });
      }
    }
  }

  /**
   * Checks stock against thresholds; emails the admin group once per low-stock episode
   * (per type) and clears the flag once stock recovers. Safe to call often: concurrent
   * calls share one run, and nothing is sent when no type newly dropped below its minimum.
   */
  public static checkAndNotify(items: IInventoryItem[]): Promise<IStockAlertResult | undefined> {
    if (!StockThresholdService._checkInFlight) {
      StockThresholdService._checkInFlight = StockThresholdService._check(items)
        .catch(err => {
          console.warn("[StockThresholdService] Low-stock check failed:", err);
          return undefined;
        })
        .then(result => {
          StockThresholdService._checkInFlight = undefined;
          return result;
        });
    }
    return StockThresholdService._checkInFlight;
  }

  private static async _check(items: IInventoryItem[]): Promise<IStockAlertResult> {
    const config = getAppConfig();
    const thresholds = await StockThresholdService.getThresholds();
    const levels = evaluateStockLevels(items, thresholds, config.stock.defaultMinimum);
    const { toAlert, toReset } = planStockAlerts(levels);
    const result: IStockAlertResult = { levels, alerted: [], reset: [] };

    if (toReset.length > 0) {
      const list = await ListProvisioningService.tryGetList(StockThresholdService.listTitle);
      if (list) {
        for (const level of toReset) {
          if (level.threshold && level.threshold.id) {
            await list.items.getById(level.threshold.id).update({ LastAlertSent: null });
            result.reset.push(level.assetType);
          }
        }
      }
    }

    if (toAlert.length === 0) return result;

    const recipients = await StockThresholdService._getAdminEmails();
    if (recipients.length === 0) {
      console.warn("[StockThresholdService] Low stock detected but the admin group has no members with an email address.");
      return result;
    }

    await EmailService.sendMail(recipients, StockThresholdService._subject(toAlert), StockThresholdService._body(toAlert));

    // Record the alert so the same drop is not reported again.
    const list = await StockThresholdService._ensureList();
    const now = new Date().toISOString();
    for (const level of toAlert) {
      if (level.threshold && level.threshold.id) {
        await list.items.getById(level.threshold.id).update({ LastAlertSent: now });
      } else {
        // Type on the default minimum: add a row (MinimumStock left blank = default) to hold the alert flag.
        await list.items.add({ Title: level.assetType, LastAlertSent: now });
      }
      result.alerted.push(level.assetType);
    }
    return result;
  }

  private static async _getAdminEmails(): Promise<string[]> {
    try {
      const users: any[] = await getSP().web.siteGroups.getByName(getAppConfig().roleGroups.admin).users();
      return users.map(u => (u.Email || "").trim()).filter(e => e.indexOf("@") > 0);
    } catch (err) {
      console.warn("[StockThresholdService] Could not read admin group members:", err);
      return [];
    }
  }

  private static _subject(levels: IStockLevel[]): string {
    return `Low stock: ${levels.map(l => l.assetType).join(", ")}`;
  }

  private static _body(levels: IStockLevel[]): string {
    const rows = levels
      .map(l => `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee">${escapeHtml(l.assetType)}</td>` +
        `<td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right">${l.available}</td>` +
        `<td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right">${l.minimum}</td></tr>`)
      .join("");
    const link = typeof window !== "undefined" ? window.location.href.split("#")[0] : "";
    return `
      <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:14px;color:#242424">
        <p>The following asset types have dropped below their minimum available stock:</p>
        <table style="border-collapse:collapse;margin:8px 0 16px">
          <thead><tr>
            <th style="text-align:left;padding:6px 12px;border-bottom:2px solid #ccc">Asset type</th>
            <th style="text-align:right;padding:6px 12px;border-bottom:2px solid #ccc">Available</th>
            <th style="text-align:right;padding:6px 12px;border-bottom:2px solid #ccc">Minimum</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p>You will not be alerted again for these types until stock is back at or above the minimum.</p>
        ${link ? `<p><a href="${escapeHtml(link)}">Open the Inventory app</a></p>` : ""}
      </div>`;
  }
}
