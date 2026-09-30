import { getSP } from "../pnpjsConfig";
import "@pnp/sp/profiles";
import "@pnp/sp/site-groups/web";

export interface IPersonResult {
  displayName: string;
  email: string;
  loginName: string;
  jobTitle?: string;
  department?: string;
}

/**
 * Tenant-wide people search (the same source as SharePoint's own people picker),
 * so new starters can be found before they have ever visited the site.
 */
export class PeopleSearchService {
  private static _groupCache: { [groupName: string]: Promise<IPersonResult[]> } = {};

  /**
   * People (not groups or system accounts) in a SharePoint site group, cached for the page
   * session. Throws when the group can't be read, so callers can tell "empty" from "failed".
   */
  public static getGroupMembers(groupName: string): Promise<IPersonResult[]> {
    const key = (groupName || '').trim().toLowerCase();
    if (!PeopleSearchService._groupCache[key]) {
      PeopleSearchService._groupCache[key] = getSP().web.siteGroups.getByName(groupName).users()
        .then((users: any[]) => users
          .filter(u => u.PrincipalType === 1 && (u.Email || '').indexOf('@') > 0)
          .map(u => ({ displayName: u.Title || u.Email, email: u.Email, loginName: u.LoginName || '' })))
        .catch(err => {
          delete PeopleSearchService._groupCache[key];
          throw err;
        });
    }
    return PeopleSearchService._groupCache[key];
  }

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
          jobTitle: r.EntityData ? r.EntityData.Title : undefined,
          department: r.EntityData ? r.EntityData.Department : undefined
        }))
        .filter(p => p.displayName && (p.email || p.loginName));
    } catch (err) {
      console.warn("[PeopleSearchService] People search failed:", err);
      return [];
    }
  }
}
