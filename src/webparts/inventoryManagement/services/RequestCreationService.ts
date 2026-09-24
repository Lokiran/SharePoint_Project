// AUTO-EXTRACTED from RequestService.ts (structural refactor split).
// Handles new asset-request creation: dynamic SharePoint field-schema
// discovery, item creation, localStorage fallback on failure, audit
// logging, and the manager-approval-request notification email.
import { getSP } from "../pnpjsConfig";
import { IRequest } from "../models/IRequest";
import { SharePointBaseService } from "./base/SharePointBaseService";
import { AuditLogService } from "./AuditLogService";
import { EmailService } from "./EmailService";
import { RequestListSchemaService } from "./RequestListSchemaService";
import { RequestKeyService } from "./RequestKeyService";

export class RequestCreationService {
  public static async addRequest(
    request: Omit<IRequest, "id" | "requestKey" | "status"> & {
      status?: string;
    },
    userDisplayName: string = "Unknown",
    userRole?: string,
    isEmployeeUI?: boolean
  ): Promise<void> {
    const list = await RequestListSchemaService.getRequestList();

    await RequestListSchemaService.ensureRequestWorkflowFields();

    const initialStatus = request.status || "Pending";

    const sp = getSP();

    let requesterId: number | null = null;

    try {
      const user: any = await sp.web.ensureUser(
        request.requesterName
      );

      requesterId = user.data
        ? user.data.Id
        : user.Id;
    } catch (e) {
      console.warn(
        "Could not resolve requester in SharePoint",
        e
      );
    }

    /*
     * Build ONE payload from the actual RequestList schema.
     *
     * IMPORTANT:
     * Do not send multiple hardcoded payloads with guessed
     * SharePoint column names. That was causing the schema
     * mismatch problem.
     */

    let addedRequest: any;
    let success = false;
    let lastError: any = null;

    try {
      const fields: any[] = await list.fields.select(
        "InternalName",
        "Title",
        "TypeAsString",
        "Required"
      )();

      const normalize = (value: any): string => {
        return (value || "")
          .toString()
          .toLowerCase()
          .replace(/_x0020_/g, "")
          .replace(/[^a-z0-9]/g, "");
      };

      /*
       * Exact matching only.
       *
       * This prevents "Employee" from accidentally resolving
       * to "EmployeeID".
       */
      const findExactField = (
        names: string[]
      ): any | undefined => {
        const normalizedNames = names.map(normalize);

        return fields.find((field: any) => {
          const internalName = normalize(
            field.InternalName
          );

          const title = normalize(field.Title);

          return (
            normalizedNames.indexOf(internalName) >= 0 ||
            normalizedNames.indexOf(title) >= 0
          );
        });
      };

      const requesterField = findExactField([
        "Employee",
        "Requester",
        "EmployeeName",
        "RequesterName"
      ]);

      const employeeIdField = findExactField([
        "EmployeeID",
        "Employee Id",
        "Employee_x0020_ID"
      ]);

      const assetField = findExactField([
        "AssetType",
        "Asset Type",
        "SelectAsset",
        "Select Asset",
        "Asset"
      ]);

      const quantityField = findExactField([
        "Quantity"
      ]);

      const reasonField = findExactField([
        "Reason",
        "ReasonforRequest",
        "Reason for Request"
      ]);

      const statusField = findExactField([
        "RequestStatus",
        "Request Status",
        "Status"
      ]);

      const priorityField = findExactField([
        "Priority"
      ]);

      const requestDateField = findExactField([
        "RequestDate",
        "Request Date",
        "RequestedDate",
        "Requested Date"
      ]);

      const managerNameField = findExactField([
        "ManagerName",
        "Manager Name",
        "Managers Name",
        "Manager's Name"
      ]);

      console.log(
        "RequestList fields detected:",
        fields.map((field: any) => ({
          InternalName: field.InternalName,
          Title: field.Title,
          TypeAsString: field.TypeAsString,
          Required: field.Required
        }))
      );

      console.log(
        "Resolved RequestList fields:",
        {
          requesterField:
            requesterField?.InternalName,
          requesterFieldType:
            requesterField?.TypeAsString,

          employeeIdField:
            employeeIdField?.InternalName,
          employeeIdFieldType:
            employeeIdField?.TypeAsString,

          assetField:
            assetField?.InternalName,
          assetFieldType:
            assetField?.TypeAsString,

          quantityField:
            quantityField?.InternalName,
          quantityFieldType:
            quantityField?.TypeAsString,

          reasonField:
            reasonField?.InternalName,
          reasonFieldType:
            reasonField?.TypeAsString,

          statusField:
            statusField?.InternalName,
          statusFieldType:
            statusField?.TypeAsString,

          priorityField:
            priorityField?.InternalName,
          priorityFieldType:
            priorityField?.TypeAsString,

          requestDateField:
            requestDateField?.InternalName,
          requestDateFieldType:
            requestDateField?.TypeAsString,

          managerNameField:
            managerNameField?.InternalName,
          managerNameFieldType:
            managerNameField?.TypeAsString
        }
      );

      const payload: any = {
        Title: `Request for ${request.assetTitle}`
      };

      /*
       * Requester / Employee
       */
      if (requesterField) {
        const fieldType = (
          requesterField.TypeAsString || ""
        ).toLowerCase();

        const isPersonField =
          fieldType === "user" ||
          fieldType === "usermulti";

        if (
          isPersonField &&
          requesterId !== null
        ) {
          payload[
            `${requesterField.InternalName}Id`
          ] = requesterId;
        } else {
          payload[
            requesterField.InternalName
          ] = request.requesterName;
        }
      }

      /*
       * Employee ID
       */
      if (employeeIdField) {
        const employeeIdValue =
          (request as any).employeeId || "";

        payload[
          employeeIdField.InternalName
        ] = employeeIdValue;
      }

      /*
       * Asset
       */
      if (assetField) {
        const fieldType = (
          assetField.TypeAsString || ""
        ).toLowerCase();

        const isLookup =
          fieldType === "lookup";

        if (isLookup) {
          const assetLookupId = parseInt(
            request.assetId,
            10
          );

          if (!Number.isNaN(assetLookupId)) {
            payload[
              `${assetField.InternalName}Id`
            ] = assetLookupId;
          } else {
            console.warn(
              "Asset field is a Lookup, but request.assetId is not a valid SharePoint item ID.",
              request.assetId
            );
          }
        } else {
          payload[
            assetField.InternalName
          ] = request.assetTitle;
        }
      }

      /*
       * Quantity
       */
      if (quantityField) {
        payload[
          quantityField.InternalName
        ] = Number(request.quantity) || 1;
      }

      /*
       * Reason
       */
      if (reasonField) {
        payload[
          reasonField.InternalName
        ] = request.reason || "";
      }

      /*
       * Request Status
       */
      if (statusField) {
        payload[
          statusField.InternalName
        ] = initialStatus;
      } else {
        console.warn(
          "RequestStatus field was not detected. Using configured fallback internal name:",
          SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME
        );

        payload[
          SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME
        ] = initialStatus;
      }

      /*
       * Priority
       */
      if (priorityField) {
        payload[
          priorityField.InternalName
        ] =
          (request as any).priority ||
          "Medium";
      }

      /*
       * Request Date
       *
       * SharePoint Date fields can accept YYYY-MM-DD.
       * SharePoint DateTime fields should receive ISO.
       */
      if (requestDateField) {
        const requestDateValue =
          request.requestDate ||
          new Date().toISOString();

        const fieldType = (
          requestDateField.TypeAsString || ""
        ).toLowerCase();

        if (fieldType === "datetime") {
          const parsedDate =
            new Date(requestDateValue);

          if (!Number.isNaN(parsedDate.getTime())) {
            payload[
              requestDateField.InternalName
            ] = parsedDate.toISOString();
          } else {
            payload[
              requestDateField.InternalName
            ] = new Date().toISOString();
          }
        } else {
          payload[
            requestDateField.InternalName
          ] = requestDateValue;
        }
      }

      /*
       * Manager Name
       */
      if (managerNameField) {
        payload[
          managerNameField.InternalName
        ] =
          (request as any).managerName || "";
      }

      console.log(
        "Final RequestList payload:",
        payload
      );

      /*
       * IMPORTANT:
       * Only ONE SharePoint create operation.
       */
      addedRequest =
        await list.items.add(payload);

      success = true;

      console.log(
        "Request successfully created in SharePoint:",
        addedRequest
      );
    } catch (err: any) {
      lastError = err;

      console.error(
        "RequestList SharePoint save failed.",
        {
          error: err,
          message: err?.message,
          data: err?.data,
          response: err?.response
        }
      );
    }

    /*
     * SharePoint creation failed.
     *
     * Preserve the existing local fallback behavior so the
     * employee does not lose the request, but clearly log the
     * real SharePoint error.
     */
    if (!success) {
      console.error(
        "Final RequestList save error:",
        lastError
      );

      const localRequestKey =
        `REQ-LOCAL-${Date.now()
          .toString(36)
          .toUpperCase()}`;

      const localRequest: IRequest = {
        id: localRequestKey,
        requestKey: localRequestKey,
        requesterName:
          request.requesterName,
        employeeId:
          (request as any).employeeId || "",
        managerName:
          (request as any).managerName || "",
        assetId:
          request.assetId || "",
        assetTitle:
          request.assetTitle,
        assetName:
          request.assetTitle,
        priority:
          (request as any).priority ||
          "Medium",
        quantity:
          request.quantity,
        status:
          initialStatus as any,
        assetStatus:
          "Pending",
        requestDate:
          request.requestDate ||
          new Date()
            .toISOString()
            .split("T")[0],
        reason:
          request.reason || "",
        managerResponse:
          ""
      };

      try {
        const local =
          localStorage.getItem(
            "inventory_requests"
          );

        const listItems: IRequest[] =
          local
            ? JSON.parse(local)
            : [];

        listItems.push(localRequest);

        localStorage.setItem(
          "inventory_requests",
          JSON.stringify(listItems)
        );
      } catch (e) {
        console.error(
          "Local storage save failed for request",
          e
        );
      }

      try {
        await AuditLogService.addAuditLog({
          title:
            `Created Local Request ${localRequestKey} for Asset: ${request.assetTitle}`,

          action: "Create",

          entityType: "Request",

          entityId:
            localRequestKey,

          details:
            JSON.stringify({
              requestKey:
                localRequestKey,

              lifecycle:
                "Submitted (Local Fallback)",

              requesterName:
                request.requesterName,

              assetTitle:
                request.assetTitle,

              quantity:
                request.quantity,

              reason:
                request.reason || "",

              requestedAt:
                new Date().toISOString()
            }),

          user:
            userDisplayName
        });
      } catch (auditErr) {
        console.warn(
          "Failed to add audit log for local fallback request:",
          auditErr
        );
      }

      return;
    }

    /*
     * Post-save actions.
     */
    try {
      const requestItemId =
        addedRequest &&
        addedRequest.data &&
        addedRequest.data.Id
          ? parseInt(
              addedRequest.data.Id.toString(),
              10
            )
          : addedRequest &&
            addedRequest.Id
            ? parseInt(
                addedRequest.Id.toString(),
                10
              )
            : NaN;

      const requestKey =
        Number.isNaN(requestItemId)
          ? `REQ-${Date.now()
              .toString(36)
              .toUpperCase()}`
          : RequestKeyService.buildRequestKeyFromItemId(
              requestItemId
            );

      if (!Number.isNaN(requestItemId)) {
        try {
          const requestListInstance =
            await RequestListSchemaService.getRequestList();

          const fields: any[] =
            await requestListInstance.fields.select(
              "InternalName",
              "Title"
            )();

          const resolvedKeyName =
            RequestKeyService.resolveRequestKeyInternalName(
              fields
            );

          const updatePayload: any = {
            [resolvedKeyName]:
              requestKey
          };

          /*
           * Only update AssetStatus if the configured
           * internal name exists in the current schema.
           */
          const hasAssetStatusField =
            fields.some(
              (field: any) =>
                (
                  field.InternalName || ""
                ).toLowerCase() ===
                SharePointBaseService
                  .ASSET_STATUS_INTERNAL_NAME
                  .toLowerCase()
            );

          if (hasAssetStatusField) {
            updatePayload[
              SharePointBaseService
                .ASSET_STATUS_INTERNAL_NAME
            ] = "Pending";
          }

          await requestListInstance.items
            .getById(requestItemId)
            .update(updatePayload);
        } catch (err) {
          console.warn(
            `Could not persist RequestKey for request item ${requestItemId}.`,
            err
          );
        }
      }

      /*
       * Audit Log
       */
      await AuditLogService.addAuditLog({
        title:
          `Created Request ${requestKey} for Asset: ${request.assetTitle}`,

        action:
          "Create",

        entityType:
          "Request",

        entityId:
          requestKey,

        details:
          JSON.stringify({
            requestKey,
            lifecycle:
              "Submitted",
            requesterName:
              request.requesterName,
            assetTitle:
              request.assetTitle,
            quantity:
              request.quantity,
            reason:
              request.reason || "",
            requestedAt:
              new Date().toISOString()
          }),

        user:
          userDisplayName
      });

      /*
       * Trigger Email Notification to Manager
       *
       * Only from Admin UI and not Employee UI.
       */
      if (
        userRole === "Admin" &&
        !isEmployeeUI
      ) {
        Promise.resolve()
          .then(async () => {
            try {
              let liveManagerEmail = "";

              try {
                const resolvedEmail =
                  await EmailService.resolveLiveManagerEmail(
                    request.requesterName
                  );

                if (resolvedEmail) {
                  liveManagerEmail =
                    resolvedEmail;
                }
              } catch (resolveErr) {
                console.warn(
                  "Failed to resolve live manager email:",
                  resolveErr
                );
              }

              await EmailService.sendApprovalRequestToManager(
                {
                  requestKey,
                  employeeName:
                    request.requesterName,
                  assetName:
                    request.assetTitle,
                  requestDate:
                    request.requestDate ||
                    new Date().toLocaleDateString(),
                  adminName:
                    userDisplayName
                },
                liveManagerEmail ||
                  undefined
              );
            } catch (mailErr) {
              console.warn(
                "Failed to send approval request email in background:",
                mailErr
              );
            }
          })
          .catch(err => {
            console.warn(
              "Unhandled error in background email generation:",
              err
            );
          });
      }
    } catch (postError) {
      console.warn(
        "Failed in post-request creation steps:",
        postError
      );
    }
  }
}
