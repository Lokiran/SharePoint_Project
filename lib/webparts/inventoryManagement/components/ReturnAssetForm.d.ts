import * as React from 'react';
import { IInventoryItem } from '../models/IInventoryItem';
export interface IReturnAssetFormProps {
    isOpen: boolean;
    onDismiss: () => void;
    asset: IInventoryItem | undefined;
    onSubmit: (reason: string, condition: string) => Promise<void>;
}
export declare const ReturnAssetForm: React.FC<IReturnAssetFormProps>;
//# sourceMappingURL=ReturnAssetForm.d.ts.map