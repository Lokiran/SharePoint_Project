// Thin facade preserving the original RequestService public API.
// Implementation is split across RequestListSchemaService, RequestKeyService,
// RequestCreationService, RequestQueryService, and RequestApprovalService
// (structural refactor — see plan). Consumers (InventoryService,
// AssetAssignmentService) do not need to change.
import { IRequest } from "../models/IRequest";
import { IEventLog } from "../models/IEventLog";
import { RequestListSchemaService } from "./RequestListSchemaService";
import { RequestCreationService } from "./RequestCreationService";
import { RequestQueryService } from "./RequestQueryService";
import { RequestApprovalService } from "./RequestApprovalService";

export class RequestService {
  public static async getRequestList(): Promise<any> {
    return RequestListSchemaService.getRequestList();
  }

  public static async addRequest(
    request: Omit<IRequest, "id" | "requestKey" | "status"> & {
      status?: string;
    },
    userDisplayName: string = "Unknown",
    userRole?: string,
    isEmployeeUI?: boolean
  ): Promise<void> {
    return RequestCreationService.addRequest(
      request,
      userDisplayName,
      userRole,
      isEmployeeUI
    );
  }

  public static async getRequests(): Promise<IRequest[]> {
    return RequestQueryService.getRequests();
  }

  public static async updateRequestStatus(
    requestId: number,
    status: "Approved" | "Declined",
    approverName: string = "Unknown",
    rejectionReason?: string
  ): Promise<void> {
    return RequestApprovalService.updateRequestStatus(
      requestId,
      status,
      approverName,
      rejectionReason
    );
  }

  public static async getRequestHistoryById(
    requestLookupId: string
  ): Promise<{
    request: IRequest;
    lifecycle: IEventLog[];
  }> {
    return RequestQueryService.getRequestHistoryById(requestLookupId);
  }
}
