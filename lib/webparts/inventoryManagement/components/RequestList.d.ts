import * as React from 'react';
import { IRequest } from '../models/IRequest';
export interface IRequestListProps {
    items: IRequest[];
    canApproveReject?: boolean;
    canApproveAsset?: boolean;
    showResponseColumns?: boolean;
    statusColumnLabel?: string;
    statusField?: 'status' | 'assetStatus';
    hideStatusColumn?: boolean;
    onApproveRequest?: (request: IRequest) => Promise<void>;
    onRejectRequest?: (request: IRequest, reason: string) => Promise<void>;
    onApproveAsset?: (request: IRequest) => Promise<void>;
    actionInProgressId?: string;
}
export declare const RequestList: React.FC<IRequestListProps>;
//# sourceMappingURL=RequestList.d.ts.map