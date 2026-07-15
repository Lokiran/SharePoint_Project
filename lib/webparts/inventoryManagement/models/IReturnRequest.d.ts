export interface IReturnRequest {
    id: string;
    title: string;
    assetId: string;
    assetName: string;
    assetType?: string;
    serialNumber: string;
    requesterName: string;
    requesterEmail?: string;
    requestDate: string;
    returnReason: string;
    proposedCondition: string;
    status: 'Pending' | 'Pending Manager Approval' | 'Pending Admin Verification' | 'Approved' | 'Rejected' | 'Completed' | 'Returned';
    managerComment?: string;
    completedDate?: string;
    managerStatus?: 'Pending' | 'Approved' | 'Rejected';
    adminStatus?: 'Not Started' | 'Completed';
    adminComments?: string;
    verifiedDate?: string;
}
//# sourceMappingURL=IReturnRequest.d.ts.map