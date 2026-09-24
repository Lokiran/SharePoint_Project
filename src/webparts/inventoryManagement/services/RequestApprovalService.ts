// AUTO-EXTRACTED from RequestService.ts (structural refactor split).
// Manager approve/decline transitions: resolves the actual SharePoint
// choice-list values, updates the item, writes an audit log entry, and
// on approval sends the admin-confirmation notification email.
import { SharePointBaseService } from "./base/SharePointBaseService";
import { AuditLogService } from "./AuditLogService";
import { EmailService } from "./EmailService";
import { RequestListSchemaService } from "./RequestListSchemaService";
import { RequestKeyService } from "./RequestKeyService";

export class RequestApprovalService {
  public static async updateRequestStatus(
    requestId: number,
    status: "Approved" | "Declined",
    approverName: string = "Unknown",
    rejectionReason?: string
  ): Promise<void> {
    try {
      await RequestListSchemaService.ensureRequestWorkflowFields();

      if (Number.isNaN(requestId)) {
        throw new Error(
          "Invalid request ID"
        );
      }

      const list =
        await RequestListSchemaService.getRequestList();

      const item =
        await list.items
          .getById(requestId)
          .select("*")();

      const keys =
        Object.keys(item || {});

      const findKey = (
        searchStr: string
      ): string | undefined => {
        const nonIdMatch =
          keys.find(k => {
            const kl =
              k.toLowerCase()
                .replace(
                  /_x0020_/g,
                  ""
                );

            return (
              kl.indexOf(searchStr) >=
                0 &&
              !kl.endsWith("id")
            );
          });

        if (nonIdMatch) {
          return nonIdMatch;
        }

        return keys.find(k =>
          k
            .toLowerCase()
            .replace(
              /_x0020_/g,
              ""
            )
            .indexOf(searchStr) >= 0
        );
      };

      const fields: any[] =
        await list.fields.select(
          "InternalName",
          "Title",
          "TypeAsString",
          "Choices"
        )();

      const statusField =
        fields.find(field => {
          const internalNameRaw =
            (
              field.InternalName ||
              ""
            ).toString();

          const internalName =
            internalNameRaw.toLowerCase();

          const title =
            (
              field.Title || ""
            )
              .toString()
              .toLowerCase();

          const normalizedInternal =
            internalName.replace(
              /_x0020_/g,
              ""
            );

          const isModerationField =
            internalName.includes(
              "moderation"
            );

          const isBusinessStatusField =
            normalizedInternal ===
              "status" ||
            title.trim() ===
              "status";

          return (
            isBusinessStatusField &&
            !isModerationField
          );
        });

      const statusKeyFromItem =
        keys.find(key =>
          SharePointBaseService._isBusinessStatusKey(
            key
          )
        );

      const statusKey =
        statusKeyFromItem ||
        statusField?.InternalName ||
        SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME;

      if (!statusKey) {
        throw new Error(
          "Could not find request status column. Please create a Choice column like RequestStatus/Status in RequestList."
        );
      }

      if (
        !SharePointBaseService._isBusinessStatusKey(
          statusKey
        )
      ) {
        throw new Error(
          "Detected non-business status field. Please ensure RequestList has a dedicated request status column."
        );
      }

      const reasonKey =
        findKey("managercomment") ||
        SharePointBaseService.REQUEST_COMMENT_INTERNAL_NAME ||
        findKey("rejectionreason") ||
        findKey("comments") ||
        findKey("reason");

      const rawChoices =
        statusField?.Choices;

      const choices: string[] =
        Array.isArray(rawChoices)
          ? rawChoices
          : rawChoices &&
              Array.isArray(
                rawChoices.results
              )
            ? rawChoices.results
            : [];

      const pickChoice = (
        preferred: string[],
        fallback: string
      ): string => {
        if (!choices.length) {
          return fallback;
        }

        const lowerChoices =
          choices.map(choice =>
            (
              choice || ""
            )
              .toString()
              .toLowerCase()
          );

        for (
          const preferredValue of preferred
        ) {
          const preferredLower =
            preferredValue.toLowerCase();

          for (
            let i = 0;
            i < lowerChoices.length;
            i++
          ) {
            if (
              lowerChoices[i].includes(
                preferredLower
              ) ||
              preferredLower.includes(
                lowerChoices[i]
              )
            ) {
              return choices[i];
            }
          }
        }

        return fallback;
      };

      const statusValue =
        status === "Declined"
          ? pickChoice(
              ["rejected", "declined"],
              "Rejected"
            )
          : pickChoice(
              ["approved"],
              "Approved"
            );

      const requestKey =
        RequestKeyService.extractRequestKey(
          item
        );

      const basePayload: any =
        {};

      basePayload[statusKey] =
        statusValue;

      if (reasonKey) {
        basePayload[reasonKey] =
          status === "Declined"
            ? rejectionReason ||
              "Rejected by manager"
            : `Approved by ${approverName}`;
      }

      await list.items
        .getById(requestId)
        .update(basePayload);

      await AuditLogService.addAuditLog({
        title:
          `${statusValue} Request ${
            requestKey ||
            `#${requestId}`
          }`,

        action:
          "Update",

        entityType:
          "Request",

        entityId:
          requestKey ||
          requestId.toString(),

        details:
          JSON.stringify({
            requestKey:
              requestKey ||
              RequestKeyService.buildRequestKeyFromItemId(
                requestId
              ),

            lifecycle:
              statusValue,

            changedBy:
              approverName,

            changedAt:
              new Date().toISOString(),

            rejectionReason:
              status === "Declined"
                ? rejectionReason ||
                  ""
                : "",

            assetAllocation:
              status === "Approved"
                ? {
                    assetTitle:
                      item[
                        findKey(
                          "assettype"
                        ) ||
                          findKey(
                            "selectasset"
                          ) ||
                          findKey(
                            "type"
                          ) ||
                          "SelectAsset"
                      ] ||
                      item.Title ||
                      "",

                    quantity:
                      parseInt(
                        item[
                          findKey(
                            "quantity"
                          ) ||
                            "Quantity"
                        ],
                        10
                      ) || 1
                  }
                : undefined
          }),

        user:
          approverName
      });

      if (status === "Approved") {
        try {
          const selectAssetKey =
            findKey("assettype") ||
            findKey("selectasset") ||
            findKey("type") ||
            "SelectAsset";

          const employeeKey =
            findKey("employee") ||
            findKey("requester") ||
            "Employee";

          const requesterKey =
            findKey("requester") ||
            "Requester";

          const rawEmp =
            item[employeeKey] ||
            item[requesterKey] ||
            item.Employee ||
            item.Title ||
            "Employee";

          const employeeName =
            typeof rawEmp === "string"
              ? rawEmp
              : rawEmp &&
                  rawEmp.Title
                ? rawEmp.Title
                : "Employee";

          await EmailService.sendApprovalConfirmationToAdmin(
            {
              requestKey:
                requestKey ||
                RequestKeyService.buildRequestKeyFromItemId(
                  requestId
                ),

              employeeName,

              assetName:
                item[
                  selectAssetKey
                ] ||
                item.Title ||
                "Asset",

              approvedBy:
                approverName,

              approvalDate:
                new Date().toLocaleDateString()
            }
          );
        } catch (mailErr) {
          console.warn(
            "Failed to send approval confirmation email to Admins:",
            mailErr
          );
        }
      }
    } catch (error: any) {
      console.error(
        `Failed to update RequestList item ${requestId} status`,
        error
      );

      throw new Error(
        `Unable to update request status. ${
          error.message ||
          "Verify RequestList status column and choices."
        }`
      );
    }
  }
}
