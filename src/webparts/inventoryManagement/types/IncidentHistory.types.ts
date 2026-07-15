import { UserRole } from '../utils/RoleUtils';
import { IInventoryManagementProps } from '../models/IInventoryManagementProps';

export interface IIncidentHistoryState {
  userDisplayName: string;
  userEmail: string;
  userRole: UserRole;
}

export interface IIncidentHistoryActions {
  setIsLoading: (loading: boolean) => void;
}

export interface IIncidentHistoryPageProps extends IInventoryManagementProps {
  state: IIncidentHistoryState;
  actions: IIncidentHistoryActions;
}
