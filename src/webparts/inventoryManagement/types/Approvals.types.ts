import { IRequest } from '../models/IRequest';
import { IInventoryItem } from '../models/IInventoryItem';

export interface IApprovalsState {
  requestSearchId: string;
  managerQueueRequests: IRequest[];
  visibleManagerRequests: IRequest[];
  items: IInventoryItem[];
  requestActionInProgressId?: string;
}

export interface IApprovalsActions {
  onSearchChange: (value: string) => void;
  onApproveRequest: (request: IRequest, comment?: string) => Promise<void>;
  onRejectRequest: (request: IRequest, reason: string) => Promise<void>;
}

export interface IApprovalsPageProps {
  state: IApprovalsState;
  actions: IApprovalsActions;
}
