import * as React from 'react';
import { IInventoryItem } from '../models/IInventoryItem';
import { UserRole } from '../utils/RoleUtils';
export interface IAssetFormProps {
    isOpen: boolean;
    onClose: () => void;
    currentUserRole: UserRole;
    onAddAsset: (asset: Omit<IInventoryItem, 'id' | 'status' | 'assignedTo'>) => void;
}
export declare const AssetForm: React.FC<IAssetFormProps>;
//# sourceMappingURL=AssetForm.d.ts.map