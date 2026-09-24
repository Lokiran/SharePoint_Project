import { IInventoryItem } from '../models/IInventoryItem';
import { IRequest } from '../models/IRequest';
import { IReturnRequest } from '../models/IReturnRequest';

export interface IMyWorkspaceState {
  myAssets: IInventoryItem[];
  myRequests: IRequest[];
  myReturnRequests: IReturnRequest[];
}

export interface IMyWorkspaceActions {
  onRequestAsset: () => void;
  onReturnAsset: (item: IInventoryItem) => void;
  onRaiseIncident: (item: IInventoryItem) => void;
  onAssetReplacement: (item: IInventoryItem) => void;
}

export interface IMyWorkspacePageProps {
  state: IMyWorkspaceState;
  actions: IMyWorkspaceActions;
}
