// AUTO-EXTRACTED from RequestService.ts (structural refactor split).
// Owns Request-list resolution/memoization and idempotent list-schema
// bootstrap (auto-creating missing workflow columns). Shared dependency
// for request creation, query, approval, and history lookup.
import { getSP } from "../pnpjsConfig";
import { SharePointBaseService } from "./base/SharePointBaseService";

export class RequestListSchemaService {
  private static _resolvedRequestListName: string | null = null;
  private static _requestWorkflowFieldsEnsured = false;

  public static async getRequestList(): Promise<any> {
    const sp = getSP();

    if (RequestListSchemaService._resolvedRequestListName) {
      return sp.web.lists.getByTitle(
        RequestListSchemaService._resolvedRequestListName
      );
    }

    try {
      const list = sp.web.lists.getByTitle(
        SharePointBaseService.REQUEST_LIST_NAME
      );

      await list.select("Title")();

      // eslint-disable-next-line require-atomic-updates
      RequestListSchemaService._resolvedRequestListName =
        SharePointBaseService.REQUEST_LIST_NAME;

      return list;
    } catch (e) {
      try {
        const fallbackName = "Request List";
        const list = sp.web.lists.getByTitle(fallbackName);

        await list.select("Title")();

        console.log(
          "Resolved requests list name dynamically to fallback: " +
            fallbackName
        );

        // eslint-disable-next-line require-atomic-updates
        RequestListSchemaService._resolvedRequestListName = fallbackName;

        return list;
      } catch (e2) {
        try {
          const allLists = await sp.web.lists.select("Title")();

          const listNames = allLists
            .map(l => '"' + l.Title + '"')
            .join(", ");

          throw new Error(
            "List '" +
              SharePointBaseService.REQUEST_LIST_NAME +
              "' or 'Request List' does not exist on this SharePoint site. Available lists are: [ " +
              listNames +
              " ]."
          );
        } catch (listsError) {
          throw new Error(
            "List '" +
              SharePointBaseService.REQUEST_LIST_NAME +
              "' or 'Request List' does not exist."
          );
        }
      }
    }
  }

  public static async ensureRequestWorkflowFields(): Promise<void> {
    if (RequestListSchemaService._requestWorkflowFieldsEnsured) {
      return;
    }

    try {
      const list = await RequestListSchemaService.getRequestList();

      const fields: any[] = await list.fields.select(
        "InternalName",
        "Title",
        "TypeAsString"
      )();

      const hasRequestStatus = fields.some(field => {
        const internalName = (
          field.InternalName || ""
        )
          .toString()
          .toLowerCase();

        return (
          internalName ===
          SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME.toLowerCase()
        );
      });

      const hasManagerComment = fields.some(field => {
        const internalName = (
          field.InternalName || ""
        )
          .toString()
          .toLowerCase();

        return (
          internalName ===
          SharePointBaseService.REQUEST_COMMENT_INTERNAL_NAME.toLowerCase()
        );
      });

      if (!hasRequestStatus) {
        try {
          await list.fields.addChoice(
            SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME,
            {
              Choices: ["Pending", "Approved", "Rejected"],
              FillInChoice: false
            }
          );
        } catch (err) {
          console.warn(
            "Could not auto-create RequestStatus field. Continuing.",
            err
          );
        }
      }

      if (!hasManagerComment) {
        try {
          await list.fields.addMultilineText(
            SharePointBaseService.REQUEST_COMMENT_INTERNAL_NAME
          );
        } catch (err) {
          console.warn(
            "Could not auto-create ManagerComment field. Continuing.",
            err
          );
        }
      }

      const hasRequestKey = fields.some(field => {
        const name = (
          field.InternalName || ""
        )
          .toString()
          .toLowerCase();

        const title = (
          field.Title || ""
        )
          .toString()
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");

        return (
          name === "requestkey" ||
          name === "requestid" ||
          name === "request_x0020_id" ||
          title === "requestid" ||
          title === "requestkey"
        );
      });

      if (!hasRequestKey) {
        try {
          await list.fields.addText(
            SharePointBaseService.REQUEST_KEY_INTERNAL_NAME
          );
        } catch (err) {
          console.warn(
            "Could not auto-create RequestKey field. Continuing.",
            err
          );
        }
      }

      const hasAssetStatus = fields.some(field => {
        const internalName = (
          field.InternalName || ""
        )
          .toString()
          .toLowerCase();

        return (
          internalName ===
          SharePointBaseService.ASSET_STATUS_INTERNAL_NAME.toLowerCase()
        );
      });

      if (!hasAssetStatus) {
        try {
          await list.fields.addChoice(
            SharePointBaseService.ASSET_STATUS_INTERNAL_NAME,
            {
              Choices: ["Pending", "Approved"],
              FillInChoice: false
            }
          );
        } catch (err) {
          console.warn(
            "Could not auto-create AssetStatus field. Continuing.",
            err
          );
        }
      }

      const hasEmployeeIdField = fields.some(field => {
        const internalName = (
          field.InternalName || ""
        )
          .toString()
          .toLowerCase();

        return (
          internalName === "employeeid" ||
          internalName === "employee_x0020_id"
        );
      });

      if (!hasEmployeeIdField) {
        try {
          await list.fields.addText("EmployeeID");
        } catch (err) {
          console.warn(
            "Could not auto-create EmployeeID field. Continuing.",
            err
          );
        }
      }

      const hasPriorityField = fields.some(field => {
        const internalName = (
          field.InternalName || ""
        )
          .toString()
          .toLowerCase();

        return internalName === "priority";
      });

      if (!hasPriorityField) {
        try {
          await list.fields.addChoice("Priority", {
            Choices: ["High", "Medium", "Low"],
            FillInChoice: false
          });
        } catch (err) {
          console.warn(
            "Could not auto-create Priority field. Continuing.",
            err
          );
        }
      }

      // eslint-disable-next-line require-atomic-updates
      RequestListSchemaService._requestWorkflowFieldsEnsured = true;
    } catch (error) {
      console.warn(
        "Could not ensure RequestList workflow fields. Continuing with fallback behavior.",
        error
      );
    }
  }
}
