import { IEventLog } from '../models/IEventLog';
import { UserRole } from '../utils/RoleUtils';

export interface IEventStreamPageState {
  auditLogs: IEventLog[];
  auditLogsLoading: boolean;
  effectiveRole: UserRole;
  activeUserDisplayName: string;
  auditLogsRefreshTrigger: number;
}

export interface IEventStreamPageProps {
  state: IEventStreamPageState;
}
