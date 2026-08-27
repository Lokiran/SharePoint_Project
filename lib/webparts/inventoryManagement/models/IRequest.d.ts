export interface IRequest {
    id: string;
    requestKey: string;
    requesterName: string;
    requesterEmail?: string;
    employeeId?: string;
    assetId: string;
    assetTitle: string;
    assetName?: string;
    priority?: 'High' | 'Medium' | 'Low' | string;
    quantity: number;
    status: 'Pending Manager Approval' | 'Approved by Manager' | 'Rejected' | 'Asset Assigned' | 'Pending' | 'Approved' | 'Declined' | string;
    assetStatus?: 'Pending' | 'Approved';
    managerResponse?: string;
    managerName?: string;
    requestDate: string;
    reason?: string;
}
//# sourceMappingURL=IRequest.d.ts.map