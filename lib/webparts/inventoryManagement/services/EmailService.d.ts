import "@pnp/sp/profiles";
export interface IApprovalRequestParams {
    requestKey: string;
    employeeName: string;
    assetName: string;
    requestDate: string;
    adminName: string;
}
export interface IApprovalConfirmationParams {
    requestKey: string;
    employeeName: string;
    assetName: string;
    approvedBy: string;
    approvalDate: string;
}
export interface IAssignmentNotificationParams {
    employeeName: string;
    employeeEmail: string;
    assetName: string;
    assetId: string;
    assignedBy: string;
    assignedDate: string;
}
export declare class EmailService {
    private static readonly USE_MOCK_TEST_EMAILS;
    private static readonly MOCK_ADMIN_EMAILS;
    private static readonly MOCK_MANAGER_EMAIL;
    /**
     * Helper to get target emails for Admins
     */
    private static getAdminEmails;
    /**
     * Helper to get target email for Manager
     */
    private static getManagerEmail;
    /**
     * Helper to get target email for Employee
     */
    private static getEmployeeEmail;
    /**
     * Send Approval Request Email to Manager (Diego / sanikommurohitha123@gmail.com)
     */
    static sendApprovalRequestToManager(params: IApprovalRequestParams, liveManagerEmail?: string): Promise<void>;
    /**
     * Send Approval Confirmation Email to Admins (Kiran / Akhila)
     */
    static sendApprovalConfirmationToAdmin(params: IApprovalConfirmationParams, liveAdminEmails?: string[]): Promise<void>;
    /**
     * Send Asset Assignment Notification Email to Employee (Adele / Alex)
     */
    static sendAssignmentNotificationToEmployee(params: IAssignmentNotificationParams, liveEmployeeEmail?: string): Promise<void>;
    /**
     * Try to resolve the manager's email dynamically from SharePoint User Profiles or EmployeeList
     */
    static resolveLiveManagerEmail(employeeName: string): Promise<string | null>;
    /**
     * Internal sender method using SharePoint sp.utility.sendEmail or developer console fallback.
     */
    static sendMail(to: string[], subject: string, htmlBody: string): Promise<void>;
}
//# sourceMappingURL=EmailService.d.ts.map