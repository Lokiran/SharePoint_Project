import * as React from 'react';
import { IReturnRequest } from '../models/IReturnRequest';
export interface IReturnRequestListProps {
    items: IReturnRequest[];
    isAdmin: boolean;
    isManager: boolean;
    onUpdateStatus: (requestId: string, status: 'Approved' | 'Rejected' | 'Completed' | 'Pending Manager Approval' | 'Pending Admin Verification', comment: string, finalCondition?: string, adminComments?: string, managerStatus?: 'Pending' | 'Approved' | 'Rejected', adminStatus?: 'Not Started' | 'Completed') => Promise<void>;
    loading: boolean;
}
export declare const ReturnRequestList: React.FC<IReturnRequestListProps>;
//# sourceMappingURL=ReturnRequestList.d.ts.map