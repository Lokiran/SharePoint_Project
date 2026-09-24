"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestService = void 0;
const RequestListSchemaService_1 = require("./RequestListSchemaService");
const RequestCreationService_1 = require("./RequestCreationService");
const RequestQueryService_1 = require("./RequestQueryService");
const RequestApprovalService_1 = require("./RequestApprovalService");
class RequestService {
    static async getRequestList() {
        return RequestListSchemaService_1.RequestListSchemaService.getRequestList();
    }
    static async addRequest(request, userDisplayName = "Unknown", userRole, isEmployeeUI) {
        return RequestCreationService_1.RequestCreationService.addRequest(request, userDisplayName, userRole, isEmployeeUI);
    }
    static async getRequests() {
        return RequestQueryService_1.RequestQueryService.getRequests();
    }
    static async updateRequestStatus(requestId, status, approverName = "Unknown", rejectionReason) {
        return RequestApprovalService_1.RequestApprovalService.updateRequestStatus(requestId, status, approverName, rejectionReason);
    }
    static async getRequestHistoryById(requestLookupId) {
        return RequestQueryService_1.RequestQueryService.getRequestHistoryById(requestLookupId);
    }
}
exports.RequestService = RequestService;
//# sourceMappingURL=RequestService.js.map