import * as React from 'react';
import { IInventoryItem } from '../models/IInventoryItem';
export interface IMyAssignedAssetsViewProps {
    items: IInventoryItem[];
    onReturnAsset: (item: IInventoryItem) => void;
    onRaiseIncident: (item: IInventoryItem) => void;
    onAssetReplacement?: (item: IInventoryItem) => void;
}
export declare const MyAssignedAssetsView: React.FC<IMyAssignedAssetsViewProps>;
//# sourceMappingURL=MyAssignedAssetsView.d.ts.map