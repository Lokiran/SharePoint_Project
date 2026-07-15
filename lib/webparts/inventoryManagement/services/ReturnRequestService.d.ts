import { IReturnRequest } from "../models/IReturnRequest";
export declare class ReturnRequestService {
    private static _resolvedReturnListName;
    static getReturnRequestList(): Promise<any>;
    private static _findReturnField;
    private static _getLocalReturnRequests;
    static getReturnRequests(): Promise<IReturnRequest[]>;
    static addReturnRequest(request: Omit<IReturnRequest, 'id' | 'status'>, userDisplayName: string): Promise<void>;
    static updateReturnRequestStatus(requestId: string, status: 'Approved' | 'Rejected' | 'Completed' | 'Pending Manager Approval' | 'Pending Admin Verification', managerComment: string, approverName: string, finalCondition?: string, adminComments?: string, managerStatus?: 'Pending' | 'Approved' | 'Rejected', adminStatus?: 'Not Started' | 'Completed'): Promise<void>;
    static cleanupReturnApprovedAssets(): Promise<void>;
}
//# sourceMappingURL=ReturnRequestService.d.ts.map