import * as React from 'react';
import { IEventLog } from '../models/IEventLog';
import { UserRole } from '../utils/RoleUtils';
export interface IEventStreamProps {
    logs: IEventLog[];
    loading: boolean;
    errorMessage?: string;
    currentUserRole: UserRole;
    currentUserName: string;
}
export declare const EventStream: React.FC<IEventStreamProps>;
//# sourceMappingURL=EventStream.d.ts.map