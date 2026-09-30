import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IInventoryItem } from '../models/IInventoryItem';
import { IEventLog } from '../models/IEventLog';
import { IReturnRequest } from '../models/IReturnRequest';

export interface IInventoryState {
  items: IInventoryItem[];
  loading: boolean;
  isAdmin: boolean;
  isInventoryManager: boolean;
  /** Audit trail, used for each asset's Activity tab. */
  auditLogs: IEventLog[];
  /** Return requests, used for each asset's custody history. */
  returnRequests: IReturnRequest[];
  spContext: WebPartContext;
}

export interface IInventoryActions {
  onOpenAssetForm: () => void;
}

export interface IInventoryPageProps {
  state: IInventoryState;
  actions: IInventoryActions;
}
