import { getSP } from "../../pnpjsConfig";
import "@pnp/sp/views";

export type ProvisionedFieldType = 'Text' | 'Note' | 'Number' | 'DateTime';

export interface IProvisionedField {
  /** Internal name (no spaces), also used as the display name. */
  name: string;
  type: ProvisionedFieldType;
}

/**
 * Creates app-owned lists on first use (the same approach the Mapping List and
 * Asset Replacements lists already use). Idempotent: existing lists and columns are left alone.
 */
export class ListProvisioningService {
  private static _ensured = new Set<string>();

  /** The list if it exists, otherwise undefined (never creates). */
  public static async tryGetList(title: string): Promise<any | undefined> {
    try {
      const list = getSP().web.lists.getByTitle(title);
      await list.select("Title")();
      return list;
    } catch {
      return undefined;
    }
  }

  /** Returns the list, creating it and any missing columns first. Requires Manage Lists permission. */
  public static async ensureList(title: string, description: string, fields: IProvisionedField[]): Promise<any> {
    const sp = getSP();
    const key = title.toLowerCase();
    if (ListProvisioningService._ensured.has(key)) {
      return sp.web.lists.getByTitle(title);
    }

    const result: any = await sp.web.lists.ensure(title, description, 100);
    const list = result.list || sp.web.lists.getByTitle(title);

    const existing: any[] = await list.fields.select("InternalName")();
    const has = (name: string): boolean => existing.some(f => (f.InternalName || '').toLowerCase() === name.toLowerCase());

    for (const field of fields) {
      if (has(field.name)) continue;
      switch (field.type) {
        case 'Number':
          await list.fields.addNumber(field.name);
          break;
        case 'DateTime':
          // DisplayFormat 1 = Date and Time
          await list.fields.addDateTime(field.name, { DisplayFormat: 1 } as any);
          break;
        case 'Note':
          await list.fields.addMultilineText(field.name, { RichText: false, NumberOfLines: 6 } as any);
          break;
        default:
          await list.fields.addText(field.name);
      }
      // Show the new column in the list's default view so admins can see and edit it.
      try {
        await list.defaultView.fields.add(field.name);
      } catch {
        // View update is cosmetic; ignore failures.
      }
    }

    ListProvisioningService._ensured.add(key);
    return list;
  }
}
