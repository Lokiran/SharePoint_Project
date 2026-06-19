import * as React from 'react';
import { IInventoryItem } from '../models/IInventoryItem';
export interface IInventoryListProps {
    items: IInventoryItem[];
    isAdmin?: boolean;
    onReturnAsset?: (item: IInventoryItem) => void;
    enablePagination?: boolean;
    pageSize?: number;
}
export declare const InventoryList: React.FC<IInventoryListProps>;
//# sourceMappingURL=InventoryList.d.ts.map