import * as React from 'react';
import { IInventoryItem } from '../models/IInventoryItem';
import { IEmployee } from '../models/IEmployee';
import { UserRole } from '../utils/RoleUtils';
export interface IAssetTrackingProps {
    items: IInventoryItem[];
    employees: IEmployee[];
    currentUserRole: UserRole;
    currentUserName?: string;
    currentUserEmail?: string;
    onAssignAssets?: (employeeName: string, employeeEmail: string, assetIds: string[]) => Promise<void>;
    isActionInProgress?: boolean;
}
export declare const AssetTracking: React.FC<IAssetTrackingProps>;
//# sourceMappingURL=AssetTracking.d.ts.map