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
export type { IFieldMetadata } from './base/SharePointBaseService';

export class InventoryService {
  // InventoryItemService Methods
  public static async getInventoryList(): Promise<any> {
    return InventoryItemService.getInventoryList();
  }
  public static async getItems(): Promise<any[]> {
    return InventoryItemService.getItems();
  }
  public static async addItem(item: any, userDisplayName: string): Promise<void> {
    return InventoryItemService.addItem(item, userDisplayName);
  }
  public static async deleteItem(id: number, itemTitle: string, userDisplayName: string): Promise<void> {
    return InventoryItemService.deleteItem(id, itemTitle, userDisplayName);
  }
  public static async updateAssetStatus(requestId: number, assetStatus: 'Approved' | 'Pending', approverName?: string, comment?: string): Promise<void> {
    return InventoryItemService.updateAssetStatus(requestId, assetStatus, approverName, comment);
  }

  // RequestService Methods
  public static async getRequestList(): Promise<any> {
    return RequestService.getRequestList();
  }
  public static async addRequest(request: any, userDisplayName: string, userRole?: string, isEmployeeUI?: boolean): Promise<void> {
    return RequestService.addRequest(request, userDisplayName, userRole, isEmployeeUI);
  }
  public static async getRequests(): Promise<any[]> {
    return RequestService.getRequests();
  }
  public static async updateRequestStatus(requestId: number, status: 'Approved' | 'Declined', approverName?: string, rejectionReason?: string): Promise<void> {
    return RequestService.updateRequestStatus(requestId, status, approverName, rejectionReason);
  }
  public static async getRequestHistoryById(requestLookupId: string): Promise<any> {
    return RequestService.getRequestHistoryById(requestLookupId);
  }

  // AssetAssignmentService Methods
  public static async getMappingList(): Promise<any> {
    return AssetAssignmentService.getMappingList();
  }
  public static async assignAssetsToEmployee(assetIds: string[], employeeName: string, employeeEmail: string, adminName: string, employeeId?: string, comment?: string): Promise<void> {
    return AssetAssignmentService.assignAssetsToEmployee(assetIds, employeeName, employeeEmail, adminName, employeeId, comment);
  }
  public static async syncExistingAssignmentsToMappingList(adminName: string): Promise<{ checkedCount: number; syncedCount: number }> {
    return AssetAssignmentService.syncExistingAssignmentsToMappingList(adminName);
  }
  public static async diagnoseMappingListFields(): Promise<string> {
    return AssetAssignmentService.diagnoseMappingListFields();
  }

  // ReturnRequestService Methods
  public static async getReturnRequestList(): Promise<any> {
    return ReturnRequestService.getReturnRequestList();
  }
  public static async addReturnRequest(request: any, userDisplayName: string): Promise<void> {
    return ReturnRequestService.addReturnRequest(request, userDisplayName);
  }
  public static async getReturnRequests(): Promise<any[]> {
    return ReturnRequestService.getReturnRequests();
  }
  public static async updateReturnRequestStatus(
    requestId: string,
    status: 'Approved' | 'Rejected' | 'Completed' | 'Pending Manager Approval' | 'Pending Admin Verification',
    managerComment: string,
    approverName: string,
    finalCondition?: string,
    adminComments?: string,
    managerStatus?: 'Pending' | 'Approved' | 'Rejected',
    adminStatus?: 'Not Started' | 'Completed'
  ): Promise<void> {
    return ReturnRequestService.updateReturnRequestStatus(
      requestId,
      status,
      managerComment,
      approverName,
      finalCondition,
      adminComments,
      managerStatus,
      adminStatus
    );
  }
  public static async cleanupReturnApprovedAssets(): Promise<void> {
    return ReturnRequestService.cleanupReturnApprovedAssets();
  }

  // AuditLogService Methods
  public static async addAuditLog(log: any): Promise<void> {
    return AuditLogService.addAuditLog(log);
  }
  public static async getAuditLogs(): Promise<any[]> {
    return AuditLogService.getAuditLogs();
  }
  public static async getFilteredAuditLogs(filters: any): Promise<any[]> {
    return AuditLogService.getFilteredAuditLogs(filters);
  }

  // SharePointBaseService Methods
  public static async getListFieldsMetadata(list: any): Promise<any[]> {
    return SharePointBaseService.getListFieldsMetadata(list);
  }
  public static translateSharePointError(error: any, payload: any, mapping: any): Error {
    return SharePointBaseService.translateSharePointError(error, payload, mapping);
  }
}
