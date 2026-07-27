import { IInventoryItem } from "../models/IInventoryItem";
import { IRequest } from "../models/IRequest";
import { IEventLog } from "../models/IEventLog";
import { IReturnRequest } from "../models/IReturnRequest";
export declare class InventoryService {
    private static readonly LIST_NAME;
    private static readonly EVENT_LOG_LIST;
    private static readonly REQUEST_LIST_NAME;
    private static readonly REQUEST_STATUS_INTERNAL_NAME;
    private static readonly REQUEST_COMMENT_INTERNAL_NAME;
    private static readonly REQUEST_KEY_INTERNAL_NAME;
    private static readonly ASSET_STATUS_INTERNAL_NAME;
    private static readonly MAPPING_LIST_NAME;
    private static _requestWorkflowFieldsEnsured;
    private static _resolvedListName;
    private static _resolvedRequestListName;
    private static _resolvedMappingListName;
    private static _mappingListFieldsEnsured;
    static getInventoryList(): Promise<any>;
    static getRequestList(): Promise<any>;
    static getMappingList(): Promise<any>;
    private static _ensureMappingListFields;
    private static _normalizeRequestKey;
    private static _buildRequestKeyFromItemId;
    private static _resolveRequestKeyInternalName;
    private static _updateMissingRequestKeys;
    private static _extractRequestKey;
    private static _isBusinessStatusKey;
    private static _ensureRequestWorkflowFields;
    static getItems(): Promise<IInventoryItem[]>;
    static addItem(item: Omit<IInventoryItem, 'id'>, userDisplayName?: string): Promise<void>;
    static addRequest(request: Omit<IRequest, 'id' | 'requestKey' | 'status'> & {
        status?: string;
    }, userDisplayName?: string, userRole?: string, isEmployeeUI?: boolean): Promise<void>;
    static deleteItem(id: number, itemTitle?: string, userDisplayName?: string): Promise<void>;
    static getRequests(): Promise<IRequest[]>;
    static updateRequestStatus(requestId: number, status: 'Approved' | 'Declined', approverName?: string, rejectionReason?: string): Promise<void>;
    static addAuditLog(log: Omit<IEventLog, 'id' | 'timestamp'>): Promise<void>;
    static updateAssetStatus(requestId: number, assetStatus: 'Approved' | 'Pending', approverName?: string, comment?: string): Promise<void>;
    private static _resolveMappingPayload;
    private static _writeToMappingList;
    private static _filterPayloadBySchema;
    static assignAssetsToEmployee(assetIds: string[], employeeName: string, employeeEmail: string, adminName: string, employeeId?: string, comment?: string): Promise<void>;
    static syncExistingAssignmentsToMappingList(adminName: string): Promise<{
        checkedCount: number;
        syncedCount: number;
    }>;
    static diagnoseMappingListFields(): Promise<string>;
    static getAuditLogs(): Promise<IEventLog[]>;
    static getRequestHistoryById(requestLookupId: string): Promise<{
        request: IRequest;
        lifecycle: IEventLog[];
    }>;
    private static _fetchItemsWithExpandedUsers;
    static getReturnRequests(): Promise<IReturnRequest[]>;
    static addReturnRequest(request: Omit<IReturnRequest, 'id' | 'status'>, userDisplayName: string): Promise<void>;
    static updateReturnRequestStatus(requestId: string, status: 'Approved' | 'Rejected' | 'Completed', managerComment: string, approverName: string, finalCondition?: string): Promise<void>;
}
//# sourceMappingURL=InventoryService.d.ts.map