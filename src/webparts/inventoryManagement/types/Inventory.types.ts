import { IInventoryItem } from '../models/IInventoryItem';

export interface IInventoryState {
  items: IInventoryItem[];
  loading: boolean;
  isAdmin: boolean;
  isInventoryManager: boolean;
}

export interface IInventoryActions {
  onOpenAssetForm: () => void;
}

export interface IInventoryPageProps {
  state: IInventoryState;
  actions: IInventoryActions;
}
