import { IRequest } from "../models/IRequest";
import { IEventLog } from "../models/IEventLog";
export declare class RequestService {
    static getRequestList(): Promise<any>;
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