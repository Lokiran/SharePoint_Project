"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = exports.SharePointBaseService = exports.AuditLogService = exports.ReturnRequestService = exports.AssetAssignmentService = exports.RequestService = exports.InventoryItemService = void 0;
const InventoryItemService_1 = require("./InventoryItemService");
const RequestService_1 = require("./RequestService");
const AssetAssignmentService_1 = require("./AssetAssignmentService");
const ReturnRequestService_1 = require("./ReturnRequestService");
const AuditLogService_1 = require("./AuditLogService");
const SharePointBaseService_1 = require("./base/SharePointBaseService");
var InventoryItemService_2 = require("./InventoryItemService");
Object.defineProperty(exports, "InventoryItemService", { enumerable: true, get: function () { return InventoryItemService_2.InventoryItemService; } });
var RequestService_2 = require("./RequestService");
Object.defineProperty(exports, "RequestService", { enumerable: true, get: function () { return RequestService_2.RequestService; } });
var AssetAssignmentService_2 = require("./AssetAssignmentService");
Object.defineProperty(exports, "AssetAssignmentService", { enumerable: true, get: function () { return AssetAssignmentService_2.AssetAssignmentService; } });
var ReturnRequestService_2 = require("./ReturnRequestService");
Object.defineProperty(exports, "ReturnRequestService", { enumerable: true, get: function () { return ReturnRequestService_2.ReturnRequestService; } });
var AuditLogService_2 = require("./AuditLogService");
Object.defineProperty(exports, "AuditLogService", { enumerable: true, get: function () { return AuditLogService_2.AuditLogService; } });
var SharePointBaseService_2 = require("./base/SharePointBaseService");
Object.defineProperty(exports, "SharePointBaseService", { enumerable: true, get: function () { return SharePointBaseService_2.SharePointBaseService; } });
class InventoryService {
    // InventoryItemService Methods
    static async getInventoryList() {
        return InventoryItemService_1.InventoryItemService.getInventoryList();
    }
    static async getItems() {
        return InventoryItemService_1.InventoryItemService.getItems();
    }
    static async addItem(item, userDisplayName) {
        return InventoryItemService_1.InventoryItemService.addItem(item, userDisplayName);
    }
    static async deleteItem(id, itemTitle, userDisplayName) {
        return InventoryItemService_1.InventoryItemService.deleteItem(id, itemTitle, userDisplayName);
    }
    static async updateAssetStatus(requestId, assetStatus, approverName, comment) {
        return InventoryItemService_1.InventoryItemService.updateAssetStatus(requestId, assetStatus, approverName, comment);
    }
    // RequestService Methods
    static async getRequestList() {
        return RequestService_1.RequestService.getRequestList();
    }
    static async addRequest(request, userDisplayName, userRole, isEmployeeUI) {
        return RequestService_1.RequestService.addRequest(request, userDisplayName, userRole, isEmployeeUI);
    }
    static async getRequests() {
        return RequestService_1.RequestService.getRequests();
    }
    static async updateRequestStatus(requestId, status, approverName, rejectionReason) {
        return RequestService_1.RequestService.updateRequestStatus(requestId, status, approverName, rejectionReason);
    }
    static async getRequestHistoryById(requestLookupId) {
        return RequestService_1.RequestService.getRequestHistoryById(requestLookupId);
    }
    // AssetAssignmentService Methods
    static async getMappingList() {
        return AssetAssignmentService_1.AssetAssignmentService.getMappingList();
    }
    static async assignAssetsToEmployee(assetIds, employeeName, employeeEmail, adminName, employeeId, comment) {
        return AssetAssignmentService_1.AssetAssignmentService.assignAssetsToEmployee(assetIds, employeeName, employeeEmail, adminName, employeeId, comment);
    }
    static async syncExistingAssignmentsToMappingList(adminName) {
        return AssetAssignmentService_1.AssetAssignmentService.syncExistingAssignmentsToMappingList(adminName);
    }
    static async diagnoseMappingListFields() {
        return AssetAssignmentService_1.AssetAssignmentService.diagnoseMappingListFields();
    }
    // ReturnRequestService Methods
    static async getReturnRequestList() {
        return ReturnRequestService_1.ReturnRequestService.getReturnRequestList();
    }
    static async addReturnRequest(request, userDisplayName) {
        return ReturnRequestService_1.ReturnRequestService.addReturnRequest(request, userDisplayName);
    }
    static async getReturnRequests() {
        return ReturnRequestService_1.ReturnRequestService.getReturnRequests();
    }
    static async updateReturnRequestStatus(requestId, status, managerComment, approverName, finalCondition, adminComments, managerStatus, adminStatus) {
        return ReturnRequestService_1.ReturnRequestService.updateReturnRequestStatus(requestId, status, managerComment, approverName, finalCondition, adminComments, managerStatus, adminStatus);
    }
    static async cleanupReturnApprovedAssets() {
        return ReturnRequestService_1.ReturnRequestService.cleanupReturnApprovedAssets();
    }
    // AuditLogService Methods
    static async addAuditLog(log) {
        return AuditLogService_1.AuditLogService.addAuditLog(log);
    }
    static async getAuditLogs() {
        return AuditLogService_1.AuditLogService.getAuditLogs();
    }
    static async getFilteredAuditLogs(filters) {
        return AuditLogService_1.AuditLogService.getFilteredAuditLogs(filters);
    }
    // SharePointBaseService Methods
    static async getListFieldsMetadata(list) {
        return SharePointBaseService_1.SharePointBaseService.getListFieldsMetadata(list);
    }
    static translateSharePointError(error, payload, mapping) {
        return SharePointBaseService_1.SharePointBaseService.translateSharePointError(error, payload, mapping);
    }
}
exports.InventoryService = InventoryService;
//# sourceMappingURL=InventoryService.js.map