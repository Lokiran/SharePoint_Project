// AUTO-EXTRACTED from RequestService.ts (structural refactor split).
// Read-side request queries: full request list mapping (with status
// derivation + localStorage fallback), request-key background repair,
// and single-request lifecycle history lookup.
import { IRequest } from "../models/IRequest";
import { IEventLog } from "../models/IEventLog";
import { SharePointBaseService } from "./base/SharePointBaseService";
import { AuditLogService } from "./AuditLogService";
import { RequestListSchemaService } from "./RequestListSchemaService";
import { RequestKeyService } from "./RequestKeyService";

export class RequestQueryService {
  public static async getRequests(): Promise<IRequest[]> {
    let mapped: IRequest[] = [];

    try {
      await RequestListSchemaService.ensureRequestWorkflowFields();

      const list =
        await RequestListSchemaService.getRequestList();

      const fields: any[] =
        await list.fields.select(
          "InternalName",
          "Title",
          "TypeAsString"
        )();

      const items =
        await SharePointBaseService._fetchItemsWithExpandedUsers(
          list
        );

      const findFieldInternalName = (
        searchStr: string,
        fallback: string
      ): string => {
        let field = fields.find(
          (f: any) =>
            f.InternalName
              .toLowerCase() ===
            searchStr.toLowerCase()
        );

        if (field) {
          return field.InternalName;
        }

        field = fields.find(
          (f: any) =>
            f.InternalName
              .toLowerCase()
              .replace(/_x0020_/g, "")
              .indexOf(
                searchStr.toLowerCase()
              ) >= 0
        );

        if (field) {
          return field.InternalName;
        }

        field = fields.find(
          (f: any) =>
            f.Title
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "")
              .indexOf(
                searchStr.toLowerCase()
              ) >= 0
        );

        return field
          ? field.InternalName
          : fallback;
      };

      const employeeKey =
        findFieldInternalName(
          "employee",
          "Employee"
        );

      const requesterKey =
        findFieldInternalName(
          "requester",
          "Requester"
        );

      const selectAssetKey =
        findFieldInternalName(
          "assettype",
          "SelectAsset"
        );

      const quantityKey =
        findFieldInternalName(
          "quantity",
          "Quantity"
        );

      const reasonKey =
        findFieldInternalName(
          "reason",
          "ReasonforRequest"
        );

      const managerCommentKey =
        findFieldInternalName(
          "managercomment",
          "ManagerComment"
        );

      const assetStatusKey =
        findFieldInternalName(
          "assetstatus",
          "AssetStatus"
        );

      const statusKey =
        findFieldInternalName(
          "requeststatus",
          "RequestStatus"
        );

      const employeeIdKey =
        findFieldInternalName(
          "employeeid",
          "EmployeeID"
        );

      const priorityKey =
        findFieldInternalName(
          "priority",
          "Priority"
        );

      const requestDateKey =
        findFieldInternalName(
          "requestdate",
          "RequestDate"
        );

      const managerNameKey =
        findFieldInternalName(
          "managername",
          "ManagerName"
        );

      const resolvedKeyName =
        RequestKeyService.resolveRequestKeyInternalName(
          fields
        );

      mapped = items.map(
        (item: any) => {
          const rawStatus =
            item[statusKey] ||
            item.Status ||
            "Pending";

          const normalizedStatus =
            (rawStatus || "")
              .toString()
              .toLowerCase();

          const status:
            | "Pending"
            | "Approved"
            | "Declined" =
            normalizedStatus.includes(
              "approv"
            )
              ? "Approved"
              : normalizedStatus.includes(
                    "declin"
                  ) ||
                  normalizedStatus.includes(
                    "reject"
                  )
                ? "Declined"
                : "Pending";

          const requestKey =
            item[resolvedKeyName] ||
            RequestKeyService.extractRequestKey(
              item
            );

          return {
            id: item.ID
              ? item.ID.toString()
              : Math.random()
                  .toString(36)
                  .substr(2, 9),

            requestKey:
              requestKey ||
              (item.ID
                ? RequestKeyService.buildRequestKeyFromItemId(
                    parseInt(
                      item.ID.toString(),
                      10
                    )
                  )
                : ""),

            requesterName: (() => {
              const rawEmp =
                item[employeeKey] ||
                item[requesterKey] ||
                item.Employee ||
                item.Author;

              if (!rawEmp) {
                return item.Title || "";
              }

              if (
                typeof rawEmp === "string"
              ) {
                return rawEmp;
              }

              if (
                Array.isArray(rawEmp)
              ) {
                return rawEmp
                  .map(
                    (a: any) =>
                      a.Title ||
                      a.Name ||
                      ""
                  )
                  .join(", ");
              }

              if (
                typeof rawEmp ===
                "object"
              ) {
                return (
                  rawEmp.Title ||
                  rawEmp.Name ||
                  JSON.stringify(rawEmp)
                );
              }

              return rawEmp.toString();
            })(),

            employeeId:
              item[employeeIdKey] || "",

            managerName:
              item[managerNameKey] ||
              item.ManagerName ||
              item.Manager_x0020_Name ||
              item.Manager ||
              "",

            assetId:
              "",

            assetTitle:
              item[selectAssetKey] ||
              item.Title ||
              "",

            assetName:
              "",

            priority:
              item[priorityKey] ||
              "Medium",

            quantity:
              parseInt(
                item[quantityKey]
              ) || 1,

            status,

            assetStatus:
              (
                (
                  item[
                    assetStatusKey
                  ] ||
                  "Pending"
                )
                  .toString()
                  .toLowerCase()
                  .includes("approv")
                  ? "Approved"
                  : "Pending"
              ) as
                | "Pending"
                | "Approved",

            managerResponse:
              item[
                managerCommentKey
              ] || "",

            requestDate:
              item[requestDateKey]
                ? item[
                    requestDateKey
                  ].split("T")[0]
                : item.Created
                  ? item.Created.split(
                      "T"
                    )[0]
                  : new Date()
                      .toISOString()
                      .split("T")[0],

            reason:
              item[reasonKey] || ""
          };
        }
      );

      const itemsToUpdate =
        items.filter(
          (item: any) =>
            !item[resolvedKeyName] &&
            item.ID
        );

      if (
        itemsToUpdate.length > 0
      ) {
        RequestQueryService
          ._updateMissingRequestKeys(
            list,
            resolvedKeyName,
            itemsToUpdate
          )
          .catch(err => {
            console.warn(
              "Background update of missing RequestKeys failed:",
              err
            );
          });
      }

      return mapped;
    } catch (error: any) {
      console.warn(
        "Error fetching requests from SharePoint, falling back to local storage items:",
        error
      );
    }

    try {
      const local =
        localStorage.getItem(
          "inventory_requests"
        );

      if (local) {
        const localRequests: IRequest[] =
          JSON.parse(local);

        return [
          ...localRequests,
          ...mapped
        ];
      }
    } catch (e) {
      console.error(
        "Failed to parse local requests from localStorage:",
        e
      );
    }

    return mapped;
  }

  private static async _updateMissingRequestKeys(
    list: any,
    resolvedKeyName: string,
    items: any[]
  ): Promise<void> {
    for (const item of items) {
      try {
        const itemId = parseInt(item.ID.toString(), 10);

        if (!Number.isNaN(itemId)) {
          const requestKey =
            RequestKeyService.buildRequestKeyFromItemId(itemId);

          await list.items.getById(itemId).update({
            [resolvedKeyName]: requestKey
          });

          console.log(
            `Successfully populated Request ID in SharePoint for item ${itemId}: ${requestKey}`
          );
        }
      } catch (err) {
        console.warn(
          `Failed to update missing Request ID for item ${item.ID}:`,
          err
        );
      }
    }
  }

  public static async getRequestHistoryById(
    requestLookupId: string
  ): Promise<{
    request: IRequest;
    lifecycle: IEventLog[];
  }> {
    await RequestListSchemaService.ensureRequestWorkflowFields();

    const normalizedRequestKey =
      RequestKeyService.normalizeRequestKey(
        requestLookupId
      );

    if (!normalizedRequestKey) {
      throw new Error(
        "Request ID is required."
      );
    }

    const reqList =
      await RequestListSchemaService.getRequestList();

    let requestItems: any[] = [];

    try {
      const fields: any[] =
        await reqList.fields.select(
          "InternalName",
          "Title"
        )();

      const resolvedKeyName =
        RequestKeyService.resolveRequestKeyInternalName(
          fields
        );

      requestItems =
        await reqList.items
          .select("*")
          .filter(
            `${resolvedKeyName} eq '${normalizedRequestKey.replace(
              /'/g,
              "''"
            )}'`
          )();
    } catch (filterError) {
      console.warn(
        "RequestKey filter failed. Falling back to item ID based lookup.",
        filterError
      );
    }

    if (!requestItems.length) {
      const derivedIdMatch =
        /^REQ-(\d{1,})$/.exec(
          normalizedRequestKey.replace(
            /^REQ-0*/,
            "REQ-"
          )
        );

      const parsedId =
        derivedIdMatch
          ? parseInt(
              derivedIdMatch[1],
              10
            )
          : NaN;

      if (!Number.isNaN(parsedId)) {
        try {
          const requestById =
            await reqList.items
              .getById(parsedId)
              .select("*")();

          requestItems =
            requestById
              ? [requestById]
              : [];
        } catch (err) {
          console.warn(
            `Fallback ID lookup failed for ${normalizedRequestKey}.`,
            err
          );
        }
      }
    }

    if (
      !requestItems ||
      requestItems.length === 0
    ) {
      throw new Error(
        `No request found for ID ${normalizedRequestKey}`
      );
    }

    const requestItem =
      requestItems[0];

    const requests =
      await RequestQueryService.getRequests();

    const request =
      requests.find(
        r =>
          RequestKeyService.normalizeRequestKey(
            r.requestKey
          ) ===
            normalizedRequestKey ||
          r.id ===
            requestItem.ID?.toString()
      );

    if (!request) {
      throw new Error(
        `Request exists but could not be mapped for ID ${normalizedRequestKey}`
      );
    }

    const requestIdAsString =
      requestItem.ID
        ? requestItem.ID.toString()
        : "";

    const allLogs =
      await AuditLogService.getAuditLogs();

    const lifecycle =
      allLogs
        .filter(
          log =>
            log.entityType ===
              "Request" &&
            (
              RequestKeyService.normalizeRequestKey(
                log.entityId
              ) ===
                normalizedRequestKey ||
              log.entityId ===
                requestIdAsString ||
              (
                log.details || ""
              )
                .toUpperCase()
                .indexOf(
                  `"REQUESTKEY":"${normalizedRequestKey}"`
                ) >= 0
            )
        )
        .sort(
          (a, b) =>
            new Date(
              a.timestamp
            ).getTime() -
            new Date(
              b.timestamp
            ).getTime()
        );

    return {
      request,
      lifecycle
    };
  }
}
