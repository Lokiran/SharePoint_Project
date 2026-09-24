import { IReturnRequest } from '../models/IReturnRequest';

export interface IAssetReturnsState {
  returnRequests: IReturnRequest[];
  returnRequestsLoading: boolean;
  isAdmin: boolean;
  isManager: boolean;
}

export interface IAssetReturnsActions {
  onUpdateStatus: (
    requestId: string,
    status: 'Approved' | 'Rejected' | 'Completed' | 'Pending Manager Approval' | 'Pending Admin Verification',
    comment: string,
    finalCondition?: string,
    adminComments?: string,
    managerStatus?: 'Pending' | 'Approved' | 'Rejected',
    adminStatus?: 'Not Started' | 'Completed'
  ) => Promise<void>;
}

export interface IAssetReturnsPageProps {
  state: IAssetReturnsState;
  actions: IAssetReturnsActions;
}
