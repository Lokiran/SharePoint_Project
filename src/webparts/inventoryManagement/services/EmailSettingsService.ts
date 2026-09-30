import { getAppConfig } from "../config/AppConfig";
import { ListProvisioningService, IProvisionedField } from "./base/ListProvisioningService";

export interface IEmailSettings {
  /** Master switch. When off, emails are recorded in the Email Center but not sent. */
  enabled: boolean;
  /** Route workflow emails (request, approval, rejection, assignment) to test recipients. */
  testMode: boolean;
  /** Test-mode recipients for admin and employee emails. */
  testAdminRecipients: string[];
  /** Test-mode recipient for manager approval emails. */
  testManagerRecipient: string;
}

/** When the Email Center opens by itself. Per browser. */
export type EmailPreviewMode = 'never' | 'failure' | 'always';

// Defaults equal the values that were hardcoded in EmailService, so a site without
// the settings list behaves exactly as before.
export const DEFAULT_EMAIL_SETTINGS: IEmailSettings = {
  enabled: true,
  testMode: true,
  testAdminRecipients: ["Akhila.Dodla@3bh3kf.onmicrosoft.com"],
  testManagerRecipient: "DiegoS@3bh3kf.onmicrosoft.com"
};

// The Email Center opens only from the header's Email button unless a viewer opts in.
export const DEFAULT_EMAIL_PREVIEW_MODE: EmailPreviewMode = 'never';

const SETTINGS_FIELDS: IProvisionedField[] = [{ name: "SettingValue", type: "Note" }];

const KEYS = {
  enabled: "Email.Enabled",
  testMode: "Email.TestMode",
  testAdminRecipients: "Email.TestAdminRecipients",
  testManagerRecipient: "Email.TestManagerRecipient"
};

const PREVIEW_MODE_STORAGE_KEY = "inventoryManagement_emailPreviewMode";

export const parseRecipients = (value: string): string[] =>
  (value || "").split(/[,;]/).map(e => e.trim()).filter(e => e.indexOf("@") > 0);

const parseBool = (value: string | undefined, fallback: boolean): boolean => {
  const v = (value || "").trim().toLowerCase();
  if (v === "true") return true;
  if (v === "false") return false;
  return fallback;
};

/**
 * Site-wide email settings, stored as key/value rows (Title = key, SettingValue = value)
 * in the "Inventory App Settings" list. The list is created the first time an admin saves.
 * Missing list, row or read error = default value, so email keeps working as before.
 */
export class EmailSettingsService {
  private static _cache: IEmailSettings | undefined;
  private static _loading: Promise<IEmailSettings> | undefined;

  private static get listTitle(): string {
    return getAppConfig().lists.appSettings;
  }

  public static get(): Promise<IEmailSettings> {
    if (EmailSettingsService._cache) return Promise.resolve(EmailSettingsService._cache);
    if (!EmailSettingsService._loading) {
      EmailSettingsService._loading = EmailSettingsService._load()
        .catch(err => {
          console.warn("[EmailSettingsService] Could not read email settings, using defaults:", err);
          return DEFAULT_EMAIL_SETTINGS;
        })
        .then(settings => {
          EmailSettingsService._cache = settings;
          EmailSettingsService._loading = undefined;
          return settings;
        });
    }
    return EmailSettingsService._loading;
  }

  /** Re-reads the list (another admin may have changed the settings). */
  public static refresh(): Promise<IEmailSettings> {
    EmailSettingsService._cache = undefined;
    return EmailSettingsService.get();
  }

  public static async save(settings: IEmailSettings): Promise<IEmailSettings> {
    const list = await ListProvisioningService.ensureList(
      EmailSettingsService.listTitle,
      "Site-wide settings for the Inventory app (managed from the app's Email Center).",
      SETTINGS_FIELDS
    );
    const rows = await EmailSettingsService._readRows(list);
    const values: { [key: string]: string } = {
      [KEYS.enabled]: String(settings.enabled),
      [KEYS.testMode]: String(settings.testMode),
      [KEYS.testAdminRecipients]: settings.testAdminRecipients.join(", "),
      [KEYS.testManagerRecipient]: settings.testManagerRecipient.trim()
    };
    for (const key of Object.keys(values)) {
      const existing = rows.find(r => (r.Title || "").trim().toLowerCase() === key.toLowerCase());
      if (existing) {
        if ((existing.SettingValue || "") !== values[key]) {
          await list.items.getById(existing.ID).update({ SettingValue: values[key] });
        }
      } else {
        await list.items.add({ Title: key, SettingValue: values[key] });
      }
    }
    const saved: IEmailSettings = {
      enabled: settings.enabled,
      testMode: settings.testMode,
      testAdminRecipients: settings.testAdminRecipients.slice(),
      testManagerRecipient: settings.testManagerRecipient.trim()
    };
    // eslint-disable-next-line require-atomic-updates
    EmailSettingsService._cache = saved;
    return saved;
  }

  public static getPreviewMode(): EmailPreviewMode {
    try {
      const stored = window.localStorage.getItem(PREVIEW_MODE_STORAGE_KEY);
      if (stored === 'never' || stored === 'failure' || stored === 'always') return stored;
    } catch {
      // Storage unavailable (private window, blocked site data) - use the default.
    }
    return DEFAULT_EMAIL_PREVIEW_MODE;
  }

  public static setPreviewMode(mode: EmailPreviewMode): void {
    try {
      window.localStorage.setItem(PREVIEW_MODE_STORAGE_KEY, mode);
    } catch {
      // Not persisted; the choice still applies until the page reloads via the caller's state.
    }
  }

  private static async _load(): Promise<IEmailSettings> {
    const list = await ListProvisioningService.tryGetList(EmailSettingsService.listTitle);
    if (!list) return DEFAULT_EMAIL_SETTINGS;
    const rows = await EmailSettingsService._readRows(list);
    const value = (key: string): string | undefined => {
      const row = rows.find(r => (r.Title || "").trim().toLowerCase() === key.toLowerCase());
      return row ? (row.SettingValue || "") : undefined;
    };
    const d = DEFAULT_EMAIL_SETTINGS;
    const admins = value(KEYS.testAdminRecipients);
    const manager = value(KEYS.testManagerRecipient);
    return {
      enabled: parseBool(value(KEYS.enabled), d.enabled),
      testMode: parseBool(value(KEYS.testMode), d.testMode),
      testAdminRecipients: admins === undefined ? d.testAdminRecipients : parseRecipients(admins),
      testManagerRecipient: manager === undefined ? d.testManagerRecipient : manager.trim()
    };
  }

  private static async _readRows(list: any): Promise<any[]> {
    return list.items.select("ID", "Title", "SettingValue").top(500)();
  }
}
