import { IEmployee } from '../models/IEmployee';
import { IInventoryItem } from '../models/IInventoryItem';
import { UserRole } from '../utils/RoleUtils';

export interface IUsersState {
  employees: IEmployee[];
  items: IInventoryItem[];
  activeUserDisplayName: string;
  effectiveRole: UserRole;
  activeUserEmail: string;
  expandedUserEmail?: string;
}

export interface IUsersActions {
  onToggleExpandUser: (email: string | undefined) => void;
  isAssetAssignedToCurrentUser: (item: IInventoryItem, userName: string) => boolean;
}

export interface IUsersPageProps {
  state: IUsersState;
  actions: IUsersActions;
}
