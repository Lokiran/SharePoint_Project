import { getSP } from "../pnpjsConfig";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/site-users/web";
import { PeopleSearchService } from "./PeopleSearchService";

export interface IGroupMemberToAdd {
  displayName: string;
  email: string;
  /** Claims login from the people picker ("i:0#.f|membership|…"); resolved from the email when missing. */
  loginName?: string;
}

/** Membership changes for the SharePoint site groups that decide the app's roles. */
export class SiteGroupService {
  /**
   * Adds a person to a site group. The signed-in user needs permission to manage the group
   * (site owners have it); SharePoint's error is passed on otherwise.
   */
  public static async addMember(groupName: string, person: IGroupMemberToAdd): Promise<void> {
    const sp = getSP();
    let loginName = (person.loginName || "").trim();
    if (!loginName) {
      const ensured: any = await sp.web.ensureUser(person.email);
      const info = ensured && ensured.data ? ensured.data : ensured;
      loginName = info && info.LoginName ? info.LoginName : "";
    }
    if (!loginName) throw new Error(`Could not resolve ${person.displayName || person.email} in SharePoint.`);
    await sp.web.siteGroups.getByName(groupName).users.add(loginName);
    // The request form's manager picker caches group members.
    PeopleSearchService.clearGroupCache(groupName);
  }
}
