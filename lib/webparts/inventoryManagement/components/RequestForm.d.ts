import * as React from 'react';
import { IInventoryItem } from '../models/IInventoryItem';
import { IRequest } from '../models/IRequest';
import { IEmployee } from '../models/IEmployee';
import { UserRole } from '../utils/RoleUtils';
export interface IRequestFormProps {
    isOpen: boolean;
    onClose: () => void;
    availableAssets: IInventoryItem[];
    employees: IEmployee[];
    currentUserRole: UserRole;
    currentUserName: string;
    currentUserEmail?: string;
    /** The current user's own requests; a type with one still in progress cannot be requested again. */
    myRequests?: IRequest[];
    onSubmitRequest: (request: Omit<IRequest, 'id' | 'requestKey' | 'status'>) => void;
}
export declare const RequestForm: React.FC<IRequestFormProps>;
//# sourceMappingURL=RequestForm.d.ts.map