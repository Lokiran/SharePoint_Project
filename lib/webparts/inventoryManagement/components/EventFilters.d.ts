import * as React from 'react';
import { IAuditLogFilters } from '../models/IEventLog';
export interface IEventFiltersProps {
    filters: IAuditLogFilters;
    onChange: (filters: IAuditLogFilters) => void;
    onClear: () => void;
    actionsList: string[];
    assetTypesList: string[];
    usersList: string[];
}
export declare const EventFilters: React.FC<IEventFiltersProps>;
//# sourceMappingURL=EventFilters.d.ts.map