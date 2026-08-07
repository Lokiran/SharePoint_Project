import * as React from 'react';
export interface IWorkflowPopupDetails {
    requestId?: string;
    assetTitle?: string;
    requesterName?: string;
    managerName?: string;
    status?: string;
    date?: string;
    comment?: string;
    quantity?: number;
    condition?: string;
}
export interface IWorkflowPopupProps {
    isOpen: boolean;
    title: string;
    stage: string;
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
    details?: IWorkflowPopupDetails;
    onDismiss: () => void;
}
export declare const WorkflowPopup: React.FC<IWorkflowPopupProps>;
//# sourceMappingURL=WorkflowPopup.d.ts.map