import * as React from 'react';
import { IInventoryItem } from '../models/IInventoryItem';
import { IReturnRequest } from '../models/IReturnRequest';
export interface IMyAssignedAssetsViewProps {
    items: IInventoryItem[];
    onReturnAsset: (item: IInventoryItem) => void;
    onRaiseIncident: (item: IInventoryItem) => void;
    onAssetReplacement?: (item: IInventoryItem) => void;
    userIncidents?: any[];
    userReplacements?: any[];
    returnRequests?: IReturnRequest[];
}
export declare const MyAssignedAssetsView: React.FC<IMyAssignedAssetsViewProps>;
//# sourceMappingURL=MyAssignedAssetsView.d.ts.map