import { RequestListSchemaService } from "./RequestListSchemaService";
import { RequestCreationService } from "./RequestCreationService";
import { RequestQueryService } from "./RequestQueryService";
import { RequestApprovalService } from "./RequestApprovalService";
export class RequestService {
    static async getRequestList() {
        return RequestListSchemaService.getRequestList();
    }
    static async addRequest(request, userDisplayName = "Unknown", userRole, isEmployeeUI) {
        return RequestCreationService.addRequest(request, userDisplayName, userRole, isEmployeeUI);
    }
    static async getRequests() {
        return RequestQueryService.getRequests();
    }
    static async updateRequestStatus(requestId, status, approverName = "Unknown", rejectionReason) {
        return RequestApprovalService.updateRequestStatus(requestId, status, approverName, rejectionReason);
    }
    static async getRequestHistoryById(requestLookupId) {
        return RequestQueryService.getRequestHistoryById(requestLookupId);
    }
}
//# sourceMappingURL=RequestService.js.map