import * as React from 'react';
import { IInventoryManagementProps } from '../../models/IInventoryManagementProps';
import { IInventoryItem } from '../../models/IInventoryItem';
interface IIncidentRequestModuleProps extends IInventoryManagementProps {
    employeeId?: string;
    department?: string;
    setIsLoading: (loading: boolean) => void;
    isOpen: boolean;
    onClose: () => void;
    preselectedAsset?: IInventoryItem;
    onSuccessPopup?: (details: {
        incidentType: string;
        assetName: string;
        requesterName: string;
        priority: string;
    }) => void;
    preselectedIncidentType?: string;
}
export declare const IncidentRequestModule: React.FC<IIncidentRequestModuleProps>;
export {};
//# sourceMappingURL=IncidentRequestModule.d.ts.map