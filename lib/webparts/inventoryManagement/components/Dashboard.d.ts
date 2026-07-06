import * as React from 'react';
import { IInventoryItem } from '../models/IInventoryItem';
import { IRequest } from '../models/IRequest';
export interface IDashboardProps {
    items: IInventoryItem[];
    requests: IRequest[];
    isAdmin?: boolean;
    /** When true, dashboard copy and the primary pie chart follow the Approvals queue (requests), not inventory asset status. */
    isInventoryManager?: boolean;
    /** Optional callback to navigate to a different tab from quick action buttons. */
    onNavigate?: (tabKey: string) => void;
}
export declare const Dashboard: React.FunctionComponent<IDashboardProps>;
//# sourceMappingURL=Dashboard.d.ts.map