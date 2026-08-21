import { IRequest } from "../models/IRequest";
import { IEventLog } from "../models/IEventLog";
export declare class RequestService {
    private static _resolvedRequestListName;
    private static _requestWorkflowFieldsEnsured;
    private static _normalizeRequestKey;
    private static _buildRequestKeyFromItemId;
    private static _resolveRequestKeyInternalName;
    private static _extractRequestKey;
    static getRequestList(): Promise<any>;
    private static _updateMissingRequestKeys;
    private static _ensureRequestWorkflowFields;
    static addRequest(request: Omit<IRequest, "id" | "requestKey" | "status"> & {
        status?: string;
    }, userDisplayName?: string, userRole?: string, isEmployeeUI?: boolean): Promise<void>;
    static getRequests(): Promise<IRequest[]>;
    static updateRequestStatus(requestId: number, status: "Approved" | "Declined", approverName?: string, rejectionReason?: string): Promise<void>;
    static getRequestHistoryById(requestLookupId: string): Promise<{
        request: IRequest;
        lifecycle: IEventLog[];
    }>;
}
//# sourceMappingURL=RequestService.d.ts.map