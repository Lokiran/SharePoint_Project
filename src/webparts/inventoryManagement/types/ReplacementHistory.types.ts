import { UserRole } from '../utils/RoleUtils';
import { IInventoryManagementProps } from '../models/IInventoryManagementProps';

export interface IReplacementHistoryState {
  userDisplayName: string;
  userEmail: string;
  userRole: UserRole;
}

export interface IReplacementHistoryActions {
  setIsLoading: (loading: boolean) => void;
}

export interface IReplacementHistoryPageProps extends IInventoryManagementProps {
  state: IReplacementHistoryState;
  actions: IReplacementHistoryActions;
}
