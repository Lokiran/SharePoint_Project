import { getSP } from "../pnpjsConfig";
import "@pnp/sp/profiles";

export interface IPersonResult {
  displayName: string;
  email: string;
  loginName: string;
  jobTitle?: string;
}

/**
 * Tenant-wide people search (the same source as SharePoint's own people picker),
 * so new starters can be found before they have ever visited the site.
 */
export class PeopleSearchService {
  public static async search(query: string, max: number = 8): Promise<IPersonResult[]> {
    const text = (query || '').trim();
    if (text.length < 2) return [];
    try {
      const results: any[] = await getSP().profiles.clientPeoplePickerSearchUser({
        QueryString: text,
        MaximumEntitySuggestions: max,
        AllowEmailAddresses: true,
        AllowMultipleEntities: false,
        PrincipalSource: 15, // All sources
        PrincipalType: 1     // Users only
      } as any);
      return results
        .map(r => ({
          displayName: r.DisplayText || '',
          email: (r.EntityData && (r.EntityData.Email || r.EntityData.SIPAddress)) || '',
          loginName: r.Key || '',
          jobTitle: r.EntityData ? r.EntityData.Title : undefined
        }))
        .filter(p => p.displayName && (p.email || p.loginName));
    } catch (err) {
      console.warn("[PeopleSearchService] People search failed:", err);
      return [];
    }
  }
}
