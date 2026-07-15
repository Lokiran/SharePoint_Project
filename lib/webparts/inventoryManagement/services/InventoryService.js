import { InventoryItemService } from './InventoryItemService';
import { RequestService } from './RequestService';
import { AssetAssignmentService } from './AssetAssignmentService';
import { ReturnRequestService } from './ReturnRequestService';
import { AuditLogService } from './AuditLogService';
import { SharePointBaseService } from './base/SharePointBaseService';
export { InventoryItemService } from './InventoryItemService';
export { RequestService } from './RequestService';
export { AssetAssignmentService } from './AssetAssignmentService';
export { ReturnRequestService } from './ReturnRequestService';
export { AuditLogService } from './AuditLogService';
export { SharePointBaseService } from './base/SharePointBaseService';
export class InventoryService {
    // InventoryItemService Methods
    static async getInventoryList() {
        return InventoryItemService.getInventoryList();
    }
    static async getItems() {
        return InventoryItemService.getItems();
    }
    static async addItem(item, userDisplayName) {
        return InventoryItemService.addItem(item, userDisplayName);
    }
    static async deleteItem(id, itemTitle, userDisplayName) {
        return InventoryItemService.deleteItem(id, itemTitle, userDisplayName);
    }
    static async updateAssetStatus(requestId, assetStatus, approverName, comment) {
        return InventoryItemService.updateAssetStatus(requestId, assetStatus, approverName, comment);
    }
    // RequestService Methods
    static async getRequestList() {
        return RequestService.getRequestList();
    }
    static async addRequest(request, userDisplayName) {
        return RequestService.addRequest(request, userDisplayName);
    }
    static async getRequests() {
        return RequestService.getRequests();
    }
    static async updateRequestStatus(requestId, status, approverName, rejectionReason) {
        return RequestService.updateRequestStatus(requestId, status, approverName, rejectionReason);
    }
    static async getRequestHistoryById(requestLookupId) {
        return RequestService.getRequestHistoryById(requestLookupId);
    }
    // AssetAssignmentService Methods
    static async getMappingList() {
        return AssetAssignmentService.getMappingList();
    }
    static async assignAssetsToEmployee(assetIds, employeeName, employeeEmail, adminName, employeeId, comment) {
        return AssetAssignmentService.assignAssetsToEmployee(assetIds, employeeName, employeeEmail, adminName, employeeId, comment);
    }
    static async syncExistingAssignmentsToMappingList(adminName) {
        return AssetAssignmentService.syncExistingAssignmentsToMappingList(adminName);
    }
    static async diagnoseMappingListFields() {
        return AssetAssignmentService.diagnoseMappingListFields();
    }
    // ReturnRequestService Methods
    static async getReturnRequestList() {
        return ReturnRequestService.getReturnRequestList();
    }
    static async getReturnRequests() {
        return ReturnRequestService.getReturnRequests();
    }
    static async addReturnRequest(request, userDisplayName) {
        return ReturnRequestService.addReturnRequest(request, userDisplayName);
    }
    static async updateReturnRequestStatus(requestId, status, managerComment, approverName, finalCondition, adminComments, managerStatus, adminStatus) {
        return ReturnRequestService.updateReturnRequestStatus(requestId, status, managerComment, approverName, finalCondition, adminComments, managerStatus, adminStatus);
    }
    static async cleanupReturnApprovedAssets() {
        return ReturnRequestService.cleanupReturnApprovedAssets();
    }
    // AuditLogService Methods
    static async addAuditLog(log) {
        return AuditLogService.addAuditLog(log);
    }
    static async getAuditLogs() {
        return AuditLogService.getAuditLogs();
    }
    static async getFilteredAuditLogs(filters) {
        return AuditLogService.getFilteredAuditLogs(filters);
    }
    // SharePointBaseService Methods
    static async getListFieldsMetadata(list) {
        return SharePointBaseService.getListFieldsMetadata(list);
    }
    static translateSharePointError(error, payload, mapping) {
        return SharePointBaseService.translateSharePointError(error, payload, mapping);
    }
}
//# sourceMappingURL=InventoryService.js.map