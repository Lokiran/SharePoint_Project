import { IInventoryItem } from '../models/IInventoryItem';
import { IReturnRequest } from '../models/IReturnRequest';

export interface IOnboardingState {
  items: IInventoryItem[];
  returnRequests: IReturnRequest[];
  currentUserName: string;
  currentUserRole: string;
  /** Admins can also manage kits. */
  isAdmin: boolean;
}

export interface IOnboardingActions {
  /** Reload requests, returns and inventory after the page creates items. */
  onDataChanged: () => void;
}

export interface IOnboardingPageProps {
  state: IOnboardingState;
  actions: IOnboardingActions;
}
