import { IRequest } from '../models/IRequest';
import { IInventoryItem } from '../models/IInventoryItem';

export interface IAssetAssignmentQueueState {
  requestSearchId: string;
  visibleAdminRequests: IRequest[];
  /** Every manager-approved request, unfiltered (the queue has its own search and filters). */
  allAdminRequests?: IRequest[];
  items: IInventoryItem[];
  requestActionInProgressId?: string;
}

export interface IAssetAssignmentQueueActions {
  onSearchChange: (value: string) => void;
  onSelectRequestForAssignment: (request: IRequest) => void;
}

export interface IAssetAssignmentQueuePageProps {
  state: IAssetAssignmentQueueState;
  actions: IAssetAssignmentQueueActions;
}
