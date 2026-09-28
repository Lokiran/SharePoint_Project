import * as React from 'react';
import { IAuditLogFilters } from '../models/IEventLog';
import { IUserOption } from '../utils/EventLogUtils';
export interface IEventFiltersProps {
    filters: IAuditLogFilters;
    onChange: (filters: IAuditLogFilters) => void;
    onClear: () => void;
    actionsList: string[];
    assetTypesList: string[];
    /** Users with their event counts under the current server-side filters. */
    userOptions: IUserOption[];
    /** Enables the "My Activity" shortcut when set. */
    currentUserName?: string;
}
export declare const EventFilters: React.FC<IEventFiltersProps>;
//# sourceMappingURL=EventFilters.d.ts.map