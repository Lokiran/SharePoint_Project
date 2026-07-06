export { InventoryItemService } from './InventoryItemService';
export { RequestService } from './RequestService';
export { AssetAssignmentService } from './AssetAssignmentService';
export { ReturnRequestService } from './ReturnRequestService';
export { AuditLogService } from './AuditLogService';
export { SharePointBaseService } from './base/SharePointBaseService';
export type { IFieldMetadata } from './base/SharePointBaseService';
export declare class InventoryService {
    static getInventoryList(): Promise<any>;
    static getItems(): Promise<any[]>;
    static addItem(item: any, userDisplayName: string): Promise<void>;
    static deleteItem(id: number, itemTitle: string, userDisplayName: string): Promise<void>;
    static updateAssetStatus(requestId: number, assetStatus: 'Approved' | 'Pending', approverName?: string, comment?: string): Promise<void>;
    static getRequestList(): Promise<any>;
    static addRequest(request: any, userDisplayName: string): Promise<void>;
    static getRequests(): Promise<any[]>;
    static updateRequestStatus(requestId: number, status: 'Approved' | 'Declined', approverName?: string, rejectionReason?: string): Promise<void>;
    static getRequestHistoryById(requestLookupId: string): Promise<any>;
    static getMappingList(): Promise<any>;
    static assignAssetsToEmployee(assetIds: string[], employeeName: string, employeeEmail: string, adminName: string, employeeId?: string, comment?: string): Promise<void>;
    static syncExistingAssignmentsToMappingList(adminName: string): Promise<{
        checkedCount: number;
        syncedCount: number;
    }>;
    static diagnoseMappingListFields(): Promise<string>;
    static getReturnRequestList(): Promise<any>;
    static getReturnRequests(): Promise<any[]>;
    static addReturnRequest(request: any, userDisplayName: string): Promise<void>;
    static updateReturnRequestStatus(requestId: string, status: 'Approved' | 'Rejected' | 'Completed', managerComment: string, approverName: string, finalCondition?: string): Promise<void>;
    static cleanupReturnApprovedAssets(): Promise<void>;
    static addAuditLog(log: any): Promise<void>;
    static getAuditLogs(): Promise<any[]>;
    static getListFieldsMetadata(list: any): Promise<any[]>;
    static translateSharePointError(error: any, payload: any, mapping: any): Error;
}
//# sourceMappingURL=InventoryService.d.ts.map